const { BigNumber } = require("ethers")

console.log("Deploying")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    await deploy("PixelV2", {
        from: deployer,
        args: [],
        log: true,
        value: BigNumber.from("7000000000000000000000"),
        gas: BigNumber.from("20000000")
    })


}

module.exports.tags = ["Pixel"]
