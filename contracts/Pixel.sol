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

// solhint-disable avoid-low-level-calls

contract AddressList {
    address[] public addresses;
    function addressesCount() public view returns (uint256) { return addresses.length; }

    constructor() public {
        addresses.push(address(0));
    }

    function addAddresses(
        address[] calldata addresses_
    ) public {
        for (uint256 i = 0; i < addresses_.length; i++) { addresses.push(addresses_[i]); }
    }

    function getAddresses() public view returns (address[] memory) { return addresses; }
    function getAddressesRange(
        uint256 start,
        uint256 end
    ) public view returns (address[] memory) {
        address[] memory result = new address[](end - start);
        for (uint256 i = start; i < (end == 0 ? addresses.length : end); i++)
        {
            result[i - start] = addresses[i];
        }
        return result; 
    }
}

// Simple Multi Level Marketing contract with 3 tiers
contract MLM is AddressList {
    using BoringMath for uint256;

    struct RepInfo {
        uint32 upline;
        uint32 earnings1;
        uint32 earnings2;
        uint32 earnings3;
        uint16 tier1;
        uint16 tier2;
        uint16 tier3;
    }
    mapping (address => RepInfo) public mlm;

    event MLMAddRep(address rep, address upline);
    event MLMEarn(address rep, uint32 amount, uint8 lvl);

    function _set(address rep, uint32 upline_, uint32 earnings1, uint32 earnings2, uint32 earnings3, uint16 tier1, uint16 tier2, uint16 tier3) internal {
        mlm[rep] = RepInfo({
            upline: upline_,
            earnings1: earnings1,
            earnings2: earnings2,
            earnings3: earnings3,
            tier1: tier1,
            tier2: tier2,
            tier3: tier3
        });
    }

    function _mlm(address rep, uint32 upline_, uint32 earnings1, uint32 earnings2, uint32 earnings3) internal returns (address lvl1, address lvl2, address lvl3) {
        RepInfo memory info = mlm[rep];
        if (info.upline == 0 && upline_ != 0) {
            lvl1 = addresses[upline_];
            require(rep != lvl1, "MLM: Can't refer yourself");

            if (lvl1 != address(0)) {
                info.upline = upline_;
                mlm[rep] = info;
                emit MLMAddRep(rep, lvl1);
            }
        } else {
            lvl1 = addresses[info.upline];
        }

        if (info.upline != 0) {
            RepInfo memory info1 = mlm[lvl1];
            info1.tier1++;
            info1.tier2 += info.tier1;
            info1.tier2 += info.tier3;
            info1.earnings1 += earnings1;
            emit MLMEarn(lvl1, earnings1, 1);
            mlm[lvl1] = info1;
            if (info1.upline != 0) {
                lvl2 = addresses[info1.upline];
                RepInfo memory info2 = mlm[lvl2];
                info2.tier2++;
                info2.tier3 += info1.tier2;
                info2.earnings2 += earnings2;
                emit MLMEarn(lvl2, earnings2, 2);
                mlm[lvl2] = info2;
                if (info2.upline != 0) {
                    lvl3 = addresses[info2.upline];
                    RepInfo memory info3 = mlm[lvl3];
                    info3.tier3++;
                    info3.earnings3 += earnings3;
                    emit MLMEarn(lvl3, earnings3, 3);
                    mlm[lvl3] = info3;
                }
            }
        }
    }
}

contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() internal {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, 'ReentrancyGuard: reentrant call');
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract PixelV2 is ERC20WithSupply, BoringOwnable, MLM, ReentrancyGuard {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    event PixelBlockTransfer(address from, address to, uint256 pricePerPixel);

    string public constant symbol = "PIXEL";
    string public constant name = "Pixel";
    uint8 public constant decimals = 18;
    uint256 private constant START_BLOCK_PRICE = 5e15; // Price starts at 0.00005 ETH/pixel = 0.005 ETH/block
    uint256 public START_TIMESTAMP;
    uint256 public LOCK_TIMESTAMP;
    
    // Block info compressed into a single storage slot
    struct Block {
        uint32 owner; // current owner nr of the block
        uint32 url; // Data nr for url
        uint32 description; // Data nr for description
        uint32 pixels; // Data nr for pixels
        uint128 lastPrice; // last sale price - 0 = never sold
    }

    struct ExportBlock {
        address owner; // current owner of the block
        string url; // url for this block (should be < 256 characters)
        string description; // description for this block (should be < 256 characters)
        bytes pixels; // pixels as bytes
        uint128 lastPrice; // last sale price - 0 = never sold
        uint32 number;
    }

    struct ExportRawBlock {
        uint32 owner; // current owner nr of the block
        uint32 url; // Data nr for url
        uint32 description; // Data nr for description
        uint32 pixels; // Data nr for pixels
        uint128 lastPrice; // last sale price - 0 = never sold
        uint32 number;
    }

    // lookup tables
    bytes[] public data;
    string[] public text;

    function dataCount() public view returns (uint256) { return data.length; }
    function textCount() public view returns (uint256) { return text.length; }

    // data is organized in blocks of 10x10. There are 100x100 blocks. Base is 0 and counting goes left to right, then top to bottom.
    Block[10000] public blk;
    uint256[] public updates;

    constructor() public payable {
        // Set data[0] to blank
        text.push("");
        data.push(bytes(""));
        updates.push(10000); // Update of 10000 means: update all blocks from 0 to 9999
    }

    modifier onlyCreationPhase() {
        require(block.timestamp >= START_TIMESTAMP && block.timestamp < LOCK_TIMESTAMP, "Not in creation phase");
        _;
    }

    function getBlocks(uint256[] calldata blockNumbers) public view returns (ExportBlock[] memory blocks) {
        blocks = new ExportBlock[](blockNumbers.length);
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            Block memory _blk = blk[blockNumbers[i]];
            blocks[i].number = blockNumbers[i].to32();
            blocks[i].owner = addresses[_blk.owner];
            blocks[i].url = text[_blk.url];
            blocks[i].description = text[_blk.description];
            blocks[i].pixels = data[_blk.pixels];
            blocks[i].lastPrice = _blk.lastPrice;
        }
    }

    function getRawBlocks(uint256[] calldata blockNumbers) public view returns (ExportRawBlock[] memory blocks) {
        blocks = new ExportRawBlock[](blockNumbers.length);
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            Block memory _blk = blk[blockNumbers[i]];
            blocks[i].number = blockNumbers[i].to32();
            blocks[i].owner = _blk.owner;
            blocks[i].url = _blk.url;
            blocks[i].description = _blk.description;
            blocks[i].pixels = _blk.pixels;
            blocks[i].lastPrice = _blk.lastPrice;
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

    function addText(
        string[] calldata text_
    ) public {
        for (uint256 i = 0; i < text_.length; i++) { text.push(text_[i]); }
    }

    function addData(
        bytes[] calldata data_
    ) public {
        for (uint256 i = 0; i < data_.length; i++) { data.push(data_[i]); }
    }

    function getText() public view returns (string[] memory) { return text; }
    function getTextRange(
        uint256 start,
        uint256 end
    ) public view returns (string[] memory) {
        string[] memory result = new string[](end - start);
        for (uint256 i = start; i < (end == 0 ? text.length : end); i++)
        {
            result[i - start] = text[i];
        }
        return result; 
    }

    function getDataRange(
        uint256 start,
        uint256 end
    ) public view returns (bytes[] memory) {
        bytes[] memory result = new bytes[](end - start);
        for (uint256 i = start; i < (end == 0 ? data.length : end); i++)
        {
            result[i - start] = data[i];
        }
        return result; 
    }

    function initMLM(
        address[] memory reps,
        uint32[] memory upline,
        uint32[] memory earn1,
        uint32[] memory earn2,
        uint32[] memory earn3,
        uint16[] memory tier1,
        uint16[] memory tier2,
        uint16[] memory tier3
    ) public onlyOwner {
        require(START_TIMESTAMP == 0, "Initialization finished");
        for (uint256 i = 0; i < reps.length; i++) {
            _set(reps[i], upline[i], earn1[i], earn2[i], earn3[i], tier1[i], tier2[i], tier3[i]);
        }
    }

    function initBlocks(
        uint256[] calldata blockNumbers,
        uint128[] calldata lastPrice,
        uint32[] calldata ownerNr,
        uint32[] calldata urlNr,
        uint32[] calldata descriptionNr,
        uint32[] calldata pixelsNr
    ) public onlyOwner {
        require(START_TIMESTAMP == 0, "Initialization finished");

        for (uint256 i = 0; i < blockNumbers.length; i++) {
            uint256 blockNumber = blockNumbers[i];

            blk[blockNumber] = Block({
                owner: ownerNr[i],
                url: urlNr[i],
                description: descriptionNr[i],
                pixels: pixelsNr[i],
                lastPrice: lastPrice[i]
            });
        }
    }

    function finishInit() public onlyOwner {
        START_TIMESTAMP = block.timestamp + 2 hours;
        LOCK_TIMESTAMP = block.timestamp + 14 days + 2 hours;
    }

    function _setBlock(
        uint256 blockNumber,
        uint32 ownerNr,
        uint32 urlNr,
        uint32 descriptionNr,
        uint32 pixelsNr
    ) private returns(uint256 blockCost) {
        require(pixelsNr < data.length, "Wrong pixelNr");

        Block memory block_ = blk[blockNumber];
        // Forward a maximum of 20000 gas to the previous owner for accepting the refund to avoid griefing attacks
        bool success;
        address previousOwner = addresses[block_.owner];
        uint256 lastPrice = block_.lastPrice;
        (success, ) = previousOwner.call{value: lastPrice, gas: 20000}("");

        blockCost = lastPrice == 0 ? START_BLOCK_PRICE : lastPrice.mul(2);

        block_.owner = ownerNr;
        block_.url = urlNr;
        block_.description = descriptionNr;
        block_.lastPrice = blockCost.to128();
        block_.pixels = pixelsNr;
        blk[blockNumber] = block_;

        updates.push(blockNumber);

        emit PixelBlockTransfer(previousOwner, addresses[ownerNr], blockCost);
    }

    function setBlocks(
        address owner,
        uint32 ownerNr,

        string memory url,
        uint32 urlNr,

        string memory description,
        uint32 descriptionNr,

        uint256[] memory blockNumbers,
        bytes[] memory pixels,
        // Positive numbers refer to existing data. Negative numbers refer to the index in the passed in pixels array
        int32[] memory pixelsNr,
        address referrer,
        uint32 referrerNr
    ) public payable onlyCreationPhase() nonReentrant() {
        if (ownerNr == uint32(-1)) {
            ownerNr = addresses.length.to32();
            addresses.push(owner);
        }
        require(ownerNr < addresses.length, "Wrong owner");

        if (urlNr == uint32(-1)) {
            urlNr = text.length.to32();
            text.push(url);
        }
        require(urlNr < text.length, "Wrong url");

        if (descriptionNr == uint32(-1)) {
            descriptionNr = text.length.to32();
            text.push(description);
        }
        require(descriptionNr < text.length, "Wrong description");

        if (referrerNr == uint32(-1)) {
            referrerNr = addresses.length.to32();
            addresses.push(referrer);
        }
        require(referrerNr < addresses.length, "Wrong referrer");

        uint256 startPixelNr = data.length;
        for (uint256 i = 0; i < pixels.length; i++) { data.push(pixels[i]); }

        uint256 cost;
        for (uint256 i = 0; i < blockNumbers.length; i++) {
            cost = cost.add(_setBlock(blockNumbers[i], ownerNr, urlNr, descriptionNr, (pixelsNr[i] >=0 ? uint256(pixelsNr[i]) : startPixelNr + uint256(-1-pixelsNr[i])).to32()));
        }

        require(msg.value == cost, "Pixel: not enough funds");

        // Mint a PIXEL token for each pixel bought
        uint256 blocks = blockNumbers.length;
        _mint(msg.sender, blocks.mul(1e20));
        
        (address lvl1, address lvl2, address lvl3) = _mlm(msg.sender, referrerNr, blocks.mul(20).to32(), blocks.mul(10).to32(), blocks.mul(5).to32());
        if (lvl1 != address(0)) { _mint(lvl1, blocks.mul(20e18)); }
        if (lvl2 != address(0)) { _mint(lvl2, blocks.mul(10e18)); }
        if (lvl3 != address(0)) { _mint(lvl3, blocks.mul(5e18)); }
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
        } else {
            bool success;
            (success, ) = owner.call{value: address(this).balance}("");
        }
    }

    function poll(address user) public view returns (uint256 updates_, uint256 addresses_, uint256 text_, uint256 data_, uint256 balance, uint256 supply, RepInfo memory mlm_, address upline_) {
        updates_ = updates.length;
        addresses_ = addresses.length;
        text_ = text.length;
        data_ = data.length;
        balance = balanceOf[user];
        supply = totalSupply;
        mlm_ = mlm[user];
        upline_ = addresses[mlm[user].upline];
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
