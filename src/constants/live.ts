import { Constants } from "./constants"

let constants: Constants = {
    chainId: 1,
    network: {
        chainId: "1",
        chainName: 'Ethereum',
        nativeCurrency:
            {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
            },
        rpcUrls: ['https://mainnet.infura.io/v3/aa35466583b245cd9397e308c75d9df0'],
        blockExplorerUrls: ['https://etherscan.io/'],
    },
    pixel: "0x1590ABe3612Be1CB3ab5B0f28874D521576e97Dc",
    migrator: "0x15B8166DBD76FA28F0221bFcbB7e17f2247162E1",
    minichef: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F"
}
export { constants }