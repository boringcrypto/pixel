import { Constants } from "./constants"

let constants: Constants = {
    chainId: 137,
    network: {
        chainId: "0x89",
        chainName: 'Polygon (Matic)',
        nativeCurrency:
            {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
        rpcUrls: ['https://matic-mainnet.chainstacklabs.com/', 'https://rpc-mainnet.maticvigil.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
    },
    pixel: "0x61E9c2F3501889f6167921087Bd6EA306002904a",
    migrator: "0x15B8166DBD76FA28F0221bFcbB7e17f2247162E1",
    minichef: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F"
}
export { constants }