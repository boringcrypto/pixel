//SPDX-License-Identifier: MIT
//  _____ _          _   _____            
// |  __ (_)        | | |_   _|           
// | |__) |__  _____| |   | |  _ __   ___ 
// |  ___/ \ \/ / _ \ |   | | | '_ \ / __|
// | |   | |>  <  __/ |  _| |_| | | | (__ 
// |_|   |_/_/\_\___|_| |_____|_| |_|\___|
//
// Flung together by BoringCrypto during COVID-19 lockdown in 2021
// Stay safe! 

// Alpha here https://bit.ly/3icxSru

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
import "@boringcrypto/boring-solidity/contracts/BoringOwnable.sol";
import "@boringcrypto/boring-solidity/contracts/ERC20.sol";
import "@boringcrypto/boring-solidity/contracts/BoringBatchable.sol";

interface ISushiSwapFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface ISushiSwapRouter {
    function WETH() external pure returns (address);
    function factory() external pure returns (ISushiSwapFactory);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
}

// solhint-disable avoid-low-level-calls
// solhint-disable

interface ERC721TokenReceiver {
    /// @notice Handle the receipt of an NFT
    /// @dev The ERC721 smart contract calls this function on the recipient
    ///  after a `transfer`. This function MAY throw to revert and reject the
    ///  transfer. Return of other than the magic value MUST result in the
    ///  transaction being reverted.
    ///  Note: the contract address is always the message sender.
    /// @param _operator The address which called `safeTransferFrom` function
    /// @param _from The address which previously owned the token
    /// @param _tokenId The NFT identifier which is being transferred
    /// @param _data Additional data with no specified format
    /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    ///  unless throwing
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) external returns (bytes4);
}

contract Canvas {
    using BoringMath for uint256;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    event Buy(address hodler, address buyer, uint256 price, uint256 hodler_share);

    string public constant name = "The Canvas of Pixels";
    string public constant symbol = "CANVAS";

    address public hodler;
    address public allowed;

    uint256 public price;
    IERC20 public immutable pixel;
    string public info;

    mapping(address => mapping(address => bool)) public operators;

    constructor(IERC20 _pixel) public {
        pixel = _pixel;
        price = _pixel.totalSupply() / 10;
        hodler = address(_pixel);
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return
            interfaceID == this.supportsInterface.selector || // EIP-165
            interfaceID == 0x80ac58cd; // EIP-721
    }

    function tokenURI(uint256 _tokenId) public pure returns (string memory) {
        require(_tokenId == 0, "Invalid token ID");
        return "https://pixel.inc/canvas.json";
    }

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "No zero address");
        return _owner == hodler ? 1 : 0;
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        require(_tokenId == 0, "Invalid token ID");
        require(hodler != address(0), "No owner");
        return hodler;
    }

    function _transfer(
        address from,
        address to,
        uint256 _tokenId
    ) internal {
        require(_tokenId == 0, "Invalid token ID");
        require(from == hodler, "From not owner");
        require(from == msg.sender || from == allowed || operators[hodler][from], "Transfer not allowed");
        require(to != address(0), "No zero address");
        hodler = to;
        allowed = address(0);
        emit Transfer(from, to, _tokenId);
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public payable {
        _transfer(_from, _to, _tokenId);
        if (isContract(_to)) {
            require(
                ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data) ==
                    bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")),
                "Wrong return value"
            );
        }
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) public payable {
        require(_tokenId == 0, "Invalid token ID");
        require(msg.sender == hodler, "Not hodler");
        allowed = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        operators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        require(_tokenId == 0, "Invalid token ID");
        return allowed;
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return operators[_owner][_operator];
    }

    function totalSupply() external pure returns (uint256) {
        return 1;
    }

    function buy() external payable {
        require(msg.value == price, "Value != price");

        // Send original price paid + 10% back to the hodler with max 20.000 gas. If this fails, continue anyway to prevent grieving/blocking attacks.
        uint256 hodler_share = hodler == address(pixel) ? 0 : price.mul(110) / 150;
        (bool success, ) = hodler.call{value: hodler_share, gas: 20000}("");

        // Send the remaining funds to the PIXEL token hodlers.
        (success, ) = address(pixel).call{value: price.sub(hodler_share), gas: 20000}("");
        require(success, "Funding pixel pool failed");

        emit Transfer(hodler, msg.sender, 0);
        emit Buy(hodler, msg.sender, price, hodler_share);

        price = price.mul(150) / 100; // Increase price by 50%
        hodler = msg.sender;
        allowed = address(0);
    }

    function setInfo(string memory info_) external {
        require(msg.sender == hodler, "Canvas: not hodler");
        info = info_;
    }

    function poll() public view returns(address hodler_, address allowed_, uint256 price_) {
        hodler_ = hodler;
        allowed_ = allowed;
        price_ = price;
    }
}

// Simple Multi Level Marketing contract with 3 tiers
contract MLM {
    struct DownlineStats {
        uint128 earnings1;
        uint128 earnings2;
        uint128 earnings3;
        uint32 tier1;
        uint32 tier2;
        uint32 tier3;
    }
    mapping (address => address) public upline;
    mapping (address => DownlineStats) public downline;

    event MLMAddRep(address rep, address upline);
    event MLMEarn(address rep, uint128 amount, uint8 lvl);

    function _addRep(address rep, address upline_) internal {
        if (upline_ == address(0) || upline[rep] != address(0)) { return; }
        require(rep != upline_, "MLM: Can't refer yourself");
        upline[rep] = upline_;
        (address lvl1, address lvl2, address lvl3) = _getUpline(rep);
        if (lvl1 != address(0)) { downline[lvl1].tier1++; downline[lvl1].tier2 += downline[rep].tier1; downline[lvl1].tier2 += downline[rep].tier3; }
        if (lvl2 != address(0)) { downline[lvl2].tier2++; downline[lvl2].tier2 += downline[rep].tier3; }
        if (lvl3 != address(0)) { downline[lvl3].tier3++; }
        emit MLMAddRep(rep, upline_);
    }

    function _getUpline(address rep) internal view returns (address lvl1, address lvl2, address lvl3) {
        lvl1 = upline[rep];
        if (lvl1 != address(0)) {
            lvl2 = upline[lvl1];
            if (lvl2 != address(0)) {
                lvl3 = upline[lvl2];
            }
        }
    }

    function _recordEarnings(address lvl1, address lvl2, address lvl3, uint128 earnings1, uint128 earnings2, uint128 earnings3) internal {
        if (lvl1 != address(0)) {
            downline[lvl1].earnings1 += earnings1;
            emit MLMEarn(lvl1, earnings1, 1);
        }
        if (lvl2 != address(0)) {
            downline[lvl2].earnings2 += earnings2;
            emit MLMEarn(lvl2, earnings1, 2);
        }
        if (lvl3 != address(0)) {
            downline[lvl3].earnings3 += earnings3;
            emit MLMEarn(lvl3, earnings1, 3);
        }
    }
}

contract Pixel is ERC20WithSupply, MLM, BoringOwnable, BoringBatchable {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    event PixelBlockTransfer(address from, address to, uint256 pricePerPixel);

    string public constant symbol = "PIXEL";
    string public constant name = "Pixel";
    uint8 public constant decimals = 18;
    address public canvas;

    uint256 private constant START_BLOCK_PRICE = 10e18; // Price starts at 0.1 MATIC/pixel = 10 MATIC/block
    
    // 50.000 PIXEL tokens will be minted for the initial AMM pool
    // To keep this fair, we set the price at DOUBLE the cost (because the PIXEL tokens are free to the deployer)
    // Cost of 1 PIXEL token at launch will be 0.1 MATIC / 1.4 (due to ambassador program) = 0.0714
    // So price should be set at twice that: 0.1428
    // For 50,000 PIXELs = 50,000 * 0.1428 ≈ 7000 (rounded down to the nearest thousand)
    uint256 private constant SUSHI_PIXEL_BALANCE = 50000e18;
    // uint256 private constant SUSHI_MATIC_BALANCE = 7000e18;
    // Will be added manually to SushiSwap, ran out of time to put it in the contract

    struct BlockLink {
        string url; // url for this block (should be < 256 characters)
        string description; // description for this block (should be < 256 characters)
    }

    struct Block {
        address owner; // current owner of the block
        uint128 lastPrice; // last sale price - 0 = never sold
        uint32 link; // The BlockLink for this block
        bytes pixels; // pixels as bytes
    }

    struct ExportBlock {
        uint32 number;
        address owner; // current owner of the block
        uint128 lastPrice; // last sale price - 0 = never sold
        string url; // url for this block (should be < 256 characters)
        string description; // description for this block (should be < 256 characters)
        bytes pixels; // pixels as bytes
    }

    BlockLink[] public link;
    // data is organized in blocks of 10x10. There are 100x100 blocks. Base is 0 and counting goes left to right, then top to bottom.
    Block[10000] public blk;
    uint256 public constant START_TIMESTAMP = 1626368400;
    uint256 public constant LOCK_TIMESTAMP = START_TIMESTAMP + 2 weeks;
    uint256[] public updates;

    constructor() public payable {
        // Set link[0] to blank
        link.push(BlockLink({
            url: "",
            description: ""
        }));

        _mint(msg.sender, SUSHI_PIXEL_BALANCE); // Send PIXELs to the deployer to create SushiSwap pool (ran out of time to automate this)
    }

    function mintCanvas() external {
        // The canvas is final
        require(block.timestamp >= LOCK_TIMESTAMP, "Creation Phase not finished");
        // Send any funds left to the owner. If this fails, continue anyway to prevent blocking.
        bool success;
        (success, ) = owner.call{value: address(this).balance}("");
        // Create Canvas
        canvas = address(new Canvas(this));
    }

    modifier onlyCreationPhase() {
        require(block.timestamp >= START_TIMESTAMP && block.timestamp < LOCK_TIMESTAMP, "Not in creation phase");
        _;
    }

    function getBlocks(uint256[] calldata blockNumbers) public view returns (ExportBlock[] memory blocks) {
        blocks = new ExportBlock[](blockNumbers.length);
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            Block memory _blk = blk[blockNumbers[i]];
            BlockLink memory _link = link[_blk.link];
            blocks[i].number = blockNumbers[i].to32();
            blocks[i].owner = _blk.owner;
            blocks[i].lastPrice = _blk.lastPrice;
            blocks[i].url = _link.url;
            blocks[i].description = _link.description;
            blocks[i].pixels = _blk.pixels;
        }
    }

    function updatesCount() public view returns (uint256) {
        return updates.length;
    }

    function getUpdates(uint256 since, uint256 max) public view returns (uint256[] memory updatesSince) {
        uint256 length = updates.length - since;
        if (length > max) { 
            length = max; 
        }
        updatesSince = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            updatesSince[i] = updates[since + i];
        }
    }

    function setBlocks(
        uint256[] calldata blockNumbers,
        uint32 linkNumber,
        bytes[] calldata pixels,
        address referrer
    ) public payable onlyCreationPhase() {
        // This error may happen when you calculate the correct cost, but someone buys one of your blocks before your transaction goes through
        // This is tested first to reduce wasted gas in case of failure
        uint256 cost = getCost(blockNumbers);
        require(msg.value >= cost, "Pixel: not enough funds");
        uint256 refund = cost.sub(msg.value);
        if (refund > 0) {
            // Refund excess payment and ensure success
            (bool success, ) = msg.sender.call{value: refund}("");
            require(success, "Pixel: refund failed");
        }

        _addRep(msg.sender, referrer);

        for (uint256 i = 0; i < blockNumbers.length; i++) {
            uint256 blockNumber = blockNumbers[i];
            // Forward a maximum of 20000 gas to the previous owner for accepting the refund to avoid griefing attacks
            bool success;
            address previousOwner = blk[blockNumber].owner;
            (success, ) = previousOwner.call{value: blk[blockNumber].lastPrice, gas: 20000}("");

            Block memory newBlock;
            newBlock.owner = msg.sender;
            newBlock.lastPrice = getCost(blockNumber).to128();
            newBlock.link = linkNumber;
            newBlock.pixels = pixels[i];
            blk[blockNumber] = newBlock;

            updates.push(blockNumber);

            emit PixelBlockTransfer(previousOwner, msg.sender, newBlock.lastPrice);
        }

        // Mint a PIXEL token for each pixel bought
        uint256 blocks = blockNumbers.length;
        _mint(msg.sender, blocks.mul(1e20));
        (address lvl1, address lvl2, address lvl3) = _getUpline(msg.sender);
        if (lvl1 != address(0)) { _mint(lvl1, blocks.mul(20e18)); }
        if (lvl2 != address(0)) { _mint(lvl2, blocks.mul(10e18)); }
        if (lvl3 != address(0)) { _mint(lvl3, blocks.mul(5e18)); }
        _recordEarnings(lvl1, lvl2, lvl3, blocks.mul(20e18).to128(), blocks.mul(10e18).to128(), blocks.mul(5e18).to128());
    }

    function setBlocks(
        uint256[] calldata blockNumbers,
        string calldata url,
        string calldata description,
        bytes[] calldata pixels,
        address referrer
    ) public payable onlyCreationPhase() returns (uint32 linkNumber) {
        BlockLink memory newLink;
        newLink.url = url;
        newLink.description = description;
        linkNumber = link.length.to32();
        link.push(newLink);

        setBlocks(blockNumbers, linkNumber, pixels, referrer);
    }

    function getCost(uint256 blockNumber) public view returns (uint256 cost) {
        uint256 last = blk[blockNumber].lastPrice;
        cost = last == 0 ? START_BLOCK_PRICE : last.mul(2);
    }

    function getCost(uint256[] calldata blockNumbers) public view returns (uint256 cost) {
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            cost = cost.add(getCost(blockNumbers[i]));
        }
    }

    function withdraw(IERC20 token) public onlyOwner {
        if (token != IERC20(0)) {
            // Withdraw any accidental token deposits
            token.safeTransfer(owner, token.balanceOf(address(this)));
        } else if (block.timestamp < LOCK_TIMESTAMP) {
            // After canvas is created, funds go to PIXEL hodlers and can't be withdrawn by the owner
            bool success;
            (success, ) = owner.call{value: address(this).balance}("");
        }
    }

    function poll(address user) public view returns (address canvas_, uint256 updates_, uint256 balance, uint256 supply, address upline_, DownlineStats memory downline_) {
        canvas_ = canvas;
        updates_ = updates.length;
        balance = balanceOf[user];
        supply = totalSupply;
        upline_ = upline[user];
        downline_ = downline[user];
    }

    // Receive funds from NFT sales for all PIXEL hodlers
    receive() external payable {}
}
