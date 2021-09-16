const { BigNumber, ethers } = require("ethers");

console.log("Deploying")

module.exports = async (hre) => {
    const { deploy } = hre.deployments
    const accounts = await hre.getUnnamedAccounts()
    const signers = await hre.ethers.getSigners()
    console.log("Deployer:", accounts[0])
    
    await deploy("Canvas", {
        from: accounts[0],
        args: ["0x1590ABe3612Be1CB3ab5B0f28874D521576e97Dc"],
        log: true,
        gas: BigNumber.from("20000000")
    })

    signers[0].sendTransaction({
        to: "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E",
        value: ethers.utils.parseEther("1000")
    })

    signers[0].sendTransaction({
        to: "0xfa4e230a06BAa482A961E7f82a9c38c461e78b32",
        value: ethers.utils.parseEther("1000")
    })
}

module.exports.tags = ["Pixel"]
