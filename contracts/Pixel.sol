//SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/ERC20.sol";

contract Pixel is ERC20WithSupply {
    using BoringMath for uint256;
    using BoringMath128 for uint128;

    string public constant symbol = "PIXEL";
    string public constant name = "Pixel";
    uint8 public constant decimals = 18;

    uint256 private constant START_BLOCK_PRICE = 1e18; // Price starts at 1 MATIC/pixel = 10 MATIC/block

    struct PixelData {
        uint8 red;
        uint8 green;
        uint8 blue;
    }

    struct Block {
        address owner;          // current owner of the block
        uint256 lastPrice;      // last sale price - 0 = never sold
        string url;             // url for this block (should be < 256 characters)
        string description;     // description for this block (should be < 256 characters)
        uint32 lastSold;        // blocktime the block was last sold - 0 = never sold
        PixelData[100] pixels;  // red, green, blue values for all 100 pixels
    }

    // data is organized in blocks of 10x10. There are 100x100 blocks. Base is 0 and counting goes left to right, then top to bottom.
    Block[10000] public data;
    uint256 public immutable lockTimestamp;

    constructor() public {
        lockTimestamp = block.timestamp + 2 weeks;
    }

    function getBlocks(uint256[] calldata blockNumbers) public view returns (Block[] memory blocks) {
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

    function setBlocks(uint256[] calldata blockNumbers, string calldata url, string calldata description, PixelData[100] calldata pixels) public payable {
        // This error may happen when you calculate the correct cost, but someone buys one of your blocks before your transaction goes through
        // This is tested first to reduce wasted gas in case of failure
        uint256 cost = getCost(blockNumbers);
        require(msg.value >= cost, "Pixel: not enough funds");
        uint256 refund = cost.sub(msg.value);
        if (refund > 0) {
            // Refund excess payment and ensure success
            (bool success,) = msg.sender.call{value: refund}("");
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
            newBlock.pixels = pixels;
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
}