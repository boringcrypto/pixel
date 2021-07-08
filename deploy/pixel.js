console.log("Deploying")

module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy('Pixel', {
        from: deployer,
        args: [],
        log: true,
    });
};

module.exports.tags = ['Pixel'];