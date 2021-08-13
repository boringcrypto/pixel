import * as express from "express"
import "@nomiclabs/hardhat-ethers"
import { task } from "hardhat/config"
import * as plugins from "hardhat/plugins"
const app = express.default()
const port = 8000

task("node", async (args, hre, runSuper) => {
  console.log("Starting hardhatscan server")
  app.get('/', async (req, res) => {
    res.send(JSON.stringify(await hre.ethers.provider.getBlockNumber()))
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  
  // do something
  return runSuper()
})


