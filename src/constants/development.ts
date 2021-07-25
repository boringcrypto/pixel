import { Constants } from "./constants"
import * as PixelDeployment from "../../deployments/localhost/PixelV2.json"

let constants: Constants = {
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
    pixel: PixelDeployment.address,
    migrator: "",
    minichef: ""
}
export { constants }