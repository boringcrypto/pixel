import { BigNumber, ethers } from "ethers"
import { PixelV2Factory } from "../../types/ethers-contracts"
import { constants } from "../constants/development"
import * as Keys from "../../keys.json"
import Snapshot from "../snapshot"
import { compressPixels } from "./Order"
import { PixelsToImageData } from "./Blocks"

export class Deployer {
    async deploy() {
        let provider = new ethers.providers.JsonRpcProvider(constants.network.rpcUrls[0])
        let signer = ethers.Wallet.fromMnemonic(Keys.deployer).connect(provider)
        let pixel = PixelV2Factory.connect(constants.pixel, signer)

        let gas = BigNumber.from("0")
        let tx

        let currentAddresses = await pixel.getAddresses()
        let addresses = [...new Set(Snapshot.blocks.map(b => b.owner).filter(a => currentAddresses.indexOf(a) < 0))]
        if (addresses.length) {
            console.log("Adding", addresses.length, "addresses")
            tx = await (await pixel.addAddresses(addresses)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }
        currentAddresses = await pixel.getAddresses()

        let currentText = await pixel.getText()
        let url = [...new Set(Snapshot.blocks.map(b => b.url).filter(t => currentText.indexOf(t) < 0))]
        if (url.length) {
            console.log("Adding", url.length, "urls")
            tx = await (await pixel.addText(url)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        currentText = await pixel.getText()
        let description = [...new Set(Snapshot.blocks.map(b => b.description).filter(t => currentText.indexOf(t) < 0))]
        if (description.length) {
            console.log("Adding", description.length, "descriptions")
            tx = await (await pixel.addText(description)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }
        currentText = await pixel.getText()

        let dataCount = (await pixel.dataCount()).toNumber()
        let start = 0
        let currentData: string[] = []
        while (start < dataCount) {
            let end = start + 200 < dataCount ? start + 200 : dataCount
            console.log("Getting data from", start, "to", end)
            currentData = currentData.concat(await pixel.getDataRange(start, end))
            start += 200
        }
        console.log("Existing data", currentData.length, dataCount)
        
        let ctx = (document.createElement("CANVAS") as HTMLCanvasElement).getContext("2d")
        let pixels: any = []
        console.log("Building pixels...")
        for(let i in Snapshot.blocks) {
            let b = Snapshot.blocks[i]
            let d = compressPixels(PixelsToImageData(ctx!, b.pixels))
            pixels.push(d)
        }
        console.log("Promises", pixels.length)
        let allPixels = (await Promise.all(pixels)).map(p => "0x" + p)

        console.log("Pixels", pixels.length)
        pixels = [...new Set(allPixels)].filter(d => currentData.indexOf(d) < 0)
        console.log("Adding", pixels.length, "pixels")
        while (pixels.length) {
            let batch = pixels.splice(0, 35)
            tx = await (await pixel.addData(batch)).wait()
            console.log("Left", pixels.length, "gas", tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        dataCount = (await pixel.dataCount()).toNumber()
        start = 0
        currentData = []
        while (start < dataCount) {
            let end = start + 200 < dataCount ? start + 200 : dataCount
            console.log("Getting data from", start, "to", end)
            currentData = currentData.concat(await pixel.getDataRange(start, end))
            start += 200
        }
        console.log("Existing data", currentData.length, dataCount)

        let blockNumbers: number[] = []
        let owners: number[] = []
        let urls: number[] = []
        let descriptions: number[] = []
        let pixelss: number[] = []
        let lastPrices: BigNumber[] = []
        for(let i = 0; i < 10000; i++) {
            let b = Snapshot.blocks[i]
            blockNumbers[i] = i
            owners[i] = currentAddresses.indexOf(b.owner)
            urls[i] = currentText.indexOf(b.url)
            descriptions[i] = currentText.indexOf(b.description)
            pixelss[i] = currentData.indexOf(allPixels[i])
            lastPrices[i] = BigNumber.from(b.lastPrice).mul("500000000000000")
        }
        while(blockNumbers.length) {
            let isBlank = (await pixel.getRawBlocks(blockNumbers.slice(0, 300))).map(b => b.owner == 0)
            console.log(isBlank)
            tx = await (await pixel.initBlocks(
                blockNumbers.splice(0, 300).filter((d, i) => isBlank[i]),
                lastPrices.splice(0, 300).filter((d, i) => isBlank[i]),
                owners.splice(0, 300).filter((d, i) => isBlank[i]),
                urls.splice(0, 300).filter((d, i) => isBlank[i]),
                descriptions.splice(0, 300).filter((d, i) => isBlank[i]),
                pixelss.splice(0, 300).filter((d, i) => isBlank[i])
            )).wait()
            console.log("Left", blockNumbers.length, "gas", tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        tx = await (await pixel.finishInit()).wait()
        gas = gas.add(tx.gasUsed)

        console.log("Total gas", gas.toString())
    }
}