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

interface Pixel is IERC20 {
    function burn(uint256 amount) external;
}

contract Canvas {
    using BoringMath for uint256;
    using BoringERC20 for Pixel;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    event Buy(address hodler, address buyer, uint256 price, uint256 hodler_share);

    string public constant name = "The Canvas of Pixel Inc";
    string public constant symbol = "CANVAS";

    address public hodler;
    address public allowed;

    uint256 public price;
    Pixel public immutable pixel;
    string public info;

    mapping(address => mapping(address => bool)) public operators;

    constructor(Pixel _pixel) public {
        pixel = _pixel;
        price = _pixel.totalSupply() / 200000;
        hodler = address(_pixel);
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return
            interfaceID == this.supportsInterface.selector || // EIP-165
            interfaceID == 0x80ac58cd; // EIP-721
    }

    function tokenURI(uint256 _tokenId) public pure returns (string memory) {
        require(_tokenId == 0, "Invalid token ID");

        // {"name": "Canvas", "description": "The final canvas created by the Pixel Inc project, 1000x1000 pixels painted by many different collaborators. Be aware, the canvas is always for sale through the website, don't list this on marketplaces! All the image and link data is stored fully on-chain and can be retrieved by querying the contract. The javascript code for this is included in this contract.", "image": "ipfs://bafybeidhigbhrccj27qrgnfswebfcciiywa46y2pisbtlad6vi2h5iu3u4/"}
        return string(abi.encodePacked('data:application/json;base64,eyJuYW1lIjogIkNhbnZhcyIsICJkZXNjcmlwdGlvbiI6ICJUaGUgZmluYWwgY2FudmFzIGNyZWF0ZWQgYnkgdGhlIFBpeGVsIEluYyBwcm9qZWN0LCAxMDAweDEwMDAgcGl4ZWxzIHBhaW50ZWQgYnkgbWFueSBkaWZmZXJlbnQgY29sbGFib3JhdG9ycy4gQmUgYXdhcmUsIHRoZSBjYW52YXMgaXMgYWx3YXlzIGZvciBzYWxlIHRocm91Z2ggdGhlIHdlYnNpdGUsIGRvbid0IGxpc3QgdGhpcyBvbiBtYXJrZXRwbGFjZXMhIEFsbCB0aGUgaW1hZ2UgYW5kIGxpbmsgZGF0YSBpcyBzdG9yZWQgZnVsbHkgb24tY2hhaW4gYW5kIGNhbiBiZSByZXRyaWV2ZWQgYnkgcXVlcnlpbmcgdGhlIGNvbnRyYWN0LiBUaGUgamF2YXNjcmlwdCBjb2RlIGZvciB0aGlzIGlzIGluY2x1ZGVkIGluIHRoaXMgY29udHJhY3QuIiwgImltYWdlIjogImlwZnM6Ly9iYWZ5YmVpZGhpZ2JocmNjajI3cXJnbmZzd2ViZmNjaWl5d2E0NnkycGlzYnRsYWQ2dmkyaDVpdTN1NC8ifQ'));
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
        require(from != to, "No self transfer");
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
        bool success;
        (success, ) = hodler.call{value: hodler_share, gas: 20000}("");

        emit Transfer(hodler, msg.sender, 0);
        emit Buy(hodler, msg.sender, price, hodler_share);

        price = price.mul(150) / 100; // Increase price by 50%
        hodler = msg.sender;
        allowed = address(0);
    }

    function redeem(uint256 amount) external {
        uint256 share = address(this).balance.mul(amount) / pixel.totalSupply();
        pixel.safeTransferFrom(msg.sender, address(this), amount);
        pixel.burn(amount);
        bool success;
        (success, ) = msg.sender.call{value: share, gas: 20000}("");
        require(success, "Sending of ETH failed");
    }

    function setInfo(string memory info_) external {
        require(msg.sender == hodler, "Canvas: not hodler");
        info = info_;
    }

    function poll(address user) public view returns(address hodler_, address allowed_, uint256 price_, uint256 pool, uint256 share, string memory info_) {
        return (hodler, allowed, price, address(this).balance, address(this).balance.mul(pixel.balanceOf(user)) / pixel.totalSupply(), info);
    }

    function getCanvasImageCode() public pure returns (string memory code) {
        return "if(process.argv[2]){const e=require('ethers'),t=new e.Contract('0x1590ABe3612Be1CB3ab5B0f28874D521576e97Dc',[{inputs:[{internalType:'uint256[]',name:'blockNumbers',type:'uint256[]'}],name:'getBlocks',outputs:[{components:[{internalType:'address',name:'owner',type:'address'},{internalType:'string',name:'url',type:'string'},{internalType:'string',name:'description',type:'string'},{internalType:'bytes',name:'pixels',type:'bytes'},{internalType:'uint128',name:'lastPrice',type:'uint128'},{internalType:'uint32',name:'number',type:'uint32'}],internalType:'struct PixelV2.ExportBlock[]',name:'blocks',type:'tuple[]'}],stateMutability:'view',type:'function'}],new e.providers.JsonRpcProvider(process.argv[2])),{Canvas:a,Image:b}=require('node-canvas');async function main(){const e=new a(1e3,1e3),n=e.getContext('2d');for(let e=0;e<100;e++){console.log(100*e);let a=await t.getBlocks([...Array(100).keys()].map(t=>t+100*e));for(let t in a){let s=parseInt(a[t].pixels.substr(2,2)),r=a[t].pixels.substr(4);if(s<=4){1==s&&(r='89504e470d0a1a0a0000000d494844520000000a0000000a08060000008d32cfbd0000'+r+'0000000049454e44ae426082'),3==s&&(r='ffd8ffe000104a46494600010100000100010000ffdb0043000a07070807060a0808080b0a0a0b0e18100e0d0d0e1d15161118231f2524221f2221262b372f26293429212230413134393b3e3e3e252e4449433c48373d3e3bffdb0043010a0b0b0e0d0e1c10101c3b2822283b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3bffc0001108000a000a03012200021101031101ffc400'+r+'ffd9');const a=new b;a.src=Buffer.from(r,'hex'),n.drawImage(a,10*t,10*e,10,10)}else if(5==s){let a=n.createImageData(10,10);for(let e=0;e<100;e++){let t=parseInt(r.substr(6*e,6),16);a.data.set([Math.floor(t/65536),Math.floor(t%65536/256),t%256,255],4*e)}n.putImageData(a,10*t,10*e)}else 6!=s&&r||(n.fillStyle='#'+(r||'000000'),n.fillRect(10*t,10*e,10,10))}}const s=e.toBuffer('image/png');require('fs').writeFileSync('canvas.png',s)}main()}else console.log('Usage: node getImage.js <RPC URL>');";
    }
}
