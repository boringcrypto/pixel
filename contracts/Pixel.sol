//SPDX-License-Identifier: UNLICENSED
// Copyright BoringCrypto - All rights reserved
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
import "@boringcrypto/boring-solidity/contracts/BoringOwnable.sol";
import "@boringcrypto/boring-solidity/contracts/ERC20.sol";
import "@boringcrypto/boring-solidity/contracts/BoringBatchable.sol";

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

    string public constant name = "The Canvas of Pixels";
    string public constant symbol = "CANVAS";

    address public holder;
    address public allowed;

    uint256 public price;
    IERC20 public pixel;

    constructor(IERC20 _pixel) public {
        pixel = _pixel;
        price = _pixel.totalSupply() / 10;
    }

    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
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
        return _owner == holder ? 1 : 0;
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        require(_tokenId == 0, "Invalid token ID");
        require(holder != address(0), "No owner");
        return holder;
    }

    function _transfer(
        address from,
        address to,
        uint256 _tokenId
    ) internal {
        require(_tokenId == 0, "Invalid token ID");
        require(from == holder, "From not owner");
        require(from == msg.sender || from == allowed || operators[holder][from], "Transfer not allowed");
        require(to != address(0), "No zero address");
        holder = to;
        allowed = address(0);
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
        uint256 _tokenId,
        bytes calldata _data
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

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        safeTransferFrom(_from, _to, _tokenId, "");
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
        allowed = _approved;
    }

    mapping(address => mapping(address => bool)) public operators;

    function setApprovalForAll(address _operator, bool _approved) public {
        operators[msg.sender][_operator] = _approved;
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        require(_tokenId == 0, "Invalid token ID");
        return allowed;
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return operators[_owner][_operator];
    }

    function totalSupply() external view returns (uint256) {
        return holder == address(0) ? 0 : 1;
    }

    function buy() external payable {
        require(msg.value == price, "Value != price");
        holder.call{value: price.mul(110) / 150, gas: 20000}("");
        (bool success, ) = address(pixel).call{value: price.mul(40) / 150, gas: 20000}("");
        require(success, "Funding pixel pool failed");
        holder = msg.sender;
        allowed = address(0);
    }
}

contract Pixel is ERC20WithSupply, BoringOwnable, BoringBatchable {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    string public constant symbol = "PIXEL";
    string public constant name = "Pixel";
    uint8 public constant decimals = 18;
    address public canvas;

    uint256 private constant START_BLOCK_PRICE = 1e18; // Price starts at 1 MATIC/pixel = 10 MATIC/block

    struct PixelData {
        uint8 red;
        uint8 green;
        uint8 blue;
    }

    struct Block {
        address owner; // current owner of the block
        uint256 lastPrice; // last sale price - 0 = never sold
        string url; // url for this block (should be < 256 characters)
        string description; // description for this block (should be < 256 characters)
        uint32 lastSold; // blocktime the block was last sold - 0 = never sold
        PixelData[100] pixels; // red, green, blue values for all 100 pixels
    }

    // data is organized in blocks of 10x10. There are 100x100 blocks. Base is 0 and counting goes left to right, then top to bottom.
    Block[10000] public data;
    uint256 public immutable lockTimestamp;

    constructor() public {
        lockTimestamp = block.timestamp + 2 weeks;
    }

    function mintCanvas() external {
        // The canvas is final
        require(block.timestamp >= lockTimestamp);
        // Send any funds left to the owner
        owner.call{value: address(this).balance}("");
        // Create Canvas
        canvas = address(new Canvas(this));
    }

    modifier notLocked() {
        require(block.timestamp < lockTimestamp);
        _;
    }

    function getBlocks(uint256[] calldata blockNumbers) public view returns (Block[] memory blocks) {
        blocks = new Block[](blockNumbers.length);
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            blocks[i] = data[blockNumbers[i]];
        }
    }

    // The first time the UI should download the entire data, but by storing this locally, it can use the lastSolds array to get the updated blocks
    function getlastSolds() public view returns (uint32[10000] memory lastSolds) {
        for (uint256 i = 0; i < 10000; i++) {
            lastSolds[i] = data[i].lastSold;
        }
    }

    function setBlocks(
        uint256[] calldata blockNumbers,
        string calldata url,
        string calldata description,
        PixelData[100][] calldata pixels
    ) public payable notLocked() {
        require(bytes(url).length < 256, "URL too long");
        require(bytes(description).length < 256, "Description too long");

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

        for (uint256 i = 0; i < blockNumbers.length; i++) {
            // Forward a maximum of 20000 gas to the previous owner for accepting the refund to avoid griefing attacks
            data[blockNumbers[i]].owner.call{value: data[blockNumbers[i]].lastPrice, gas: 20000}("");

            Block memory newBlock;
            newBlock.owner = msg.sender;
            newBlock.lastPrice = getCost(blockNumbers[i]);
            newBlock.url = url;
            newBlock.description = description;
            newBlock.lastSold = block.timestamp.to32();
            newBlock.pixels = pixels[i];
            data[blockNumbers[i]] = newBlock;
        }

        // Mint a PIXEL token for each pixel bought
        _mint(msg.sender, blockNumbers.length.mul(1e20));
    }

    function getCost(uint256 blockNumber) public view returns (uint256 cost) {
        uint256 last = data[blockNumber].lastPrice;
        cost = last == 0 ? START_BLOCK_PRICE : last.mul(2);
    }

    function getCost(uint256[] calldata blockNumbers) public view returns (uint256 cost) {
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            cost = cost.add(getCost(blockNumbers[i]));
        }
    }

    function withdraw(IERC20 token) public onlyOwner {
        if (token != IERC20(0)) {
            token.safeTransfer(owner, token.balanceOf(address(this)));
        } else if (block.timestamp < lockTimestamp) {
            // After canvas is created, funds go to PIXEL holders and can't be withdrawn by the owner
            owner.call{value: address(this).balance}("");
        }
    }

    // Receive funds from NFT sales for all PIXEL holders
    fallback() external payable {}
}
