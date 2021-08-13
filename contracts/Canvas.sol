//SPDX-License-Identifier: MIT
//  _____ _          _   _____            
// |  __ (_)        | | |_   _|           
// | |__) |__  _____| |   | |  _ __   ___ 
// |  ___/ \ \/ / _ \ |   | | | '_ \ / __|
// | |   | |>  <  __/ |  _| |_| | | | (__ 
// |_|   |_/_/\_\___|_| |_____|_| |_|\___| Canvas
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
