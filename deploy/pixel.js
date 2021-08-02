const { BigNumber } = require("ethers");

console.log("Deploying")

module.exports = async (hre) => {
    const { deploy } = hre.deployments
    const accounts = await hre.getUnnamedAccounts()

    console.log("Deployer:", accounts[0])
    
    await deploy("PixelV2", {
        from: accounts[0],
        args: [],
        log: true,
        value: BigNumber.from("7000000000000000000000"),
        gas: BigNumber.from("20000000")
    })


}

module.exports.tags = ["Pixel"]
