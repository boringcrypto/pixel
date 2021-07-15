module.exports = {
    hardhat: {
        namedAccounts: {
            deployer: {
                default: 0, // here this will by default take the first account as deployer
            },
        },
        networks: {
            hardhat: {
                forking: {
                    blockNumber: 12818185,
                    blockGasLimit: 20000000,
                }
            }
        }        
    },
    solcover: {},
    prettier: {},
}
