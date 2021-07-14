import * as PixelDeployment from "../../deployments/localhost/Pixel.json"

let constants = {
    chainId: 31337,
    network: {
        chainId: "0x7A69",
        chainName: 'Hardhat (localhost)',
        nativeCurrency:
            {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
            },
        rpcUrls: ['http://localhost:8545'],
        blockExplorerUrls: ['https://localhost/'],
    },
    pixel: PixelDeployment.address
}
export { constants }