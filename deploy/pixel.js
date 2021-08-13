const { BigNumber, ethers } = require("ethers");

console.log("Deploying")

module.exports = async (hre) => {
    const { deploy } = hre.deployments
    const accounts = await hre.getUnnamedAccounts()
    const signers = await hre.ethers.getSigners()
    console.log(accounts)
    console.log(signers.map(s => s.address))

    console.log("Deployer:", accounts[0])
    
    await deploy("PixelV2", {
        from: accounts[0],
        args: [],
        log: true,
        gas: BigNumber.from("20000000")
    })

    signers[0].sendTransaction({
        to: "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E",
        value: ethers.utils.parseEther("1000")
    })

    await network.provider.send("evm_setNextBlockTimestamp", [Math.floor(Date.now() / 1000) - 60 * 60 * 4])
}

module.exports.tags = ["Pixel"]
