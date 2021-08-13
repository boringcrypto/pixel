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
        rpcUrls: [],
        blockExplorerUrls: ['https://etherscan.io/'],
    },
    pixel: "0x1590ABe3612Be1CB3ab5B0f28874D521576e97Dc"
}
export { constants }