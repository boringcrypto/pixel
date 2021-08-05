import { BigNumber, ethers } from "ethers"
import { PixelV2Factory } from "../../types/ethers-contracts"
import { constants } from "../constants/development"
import * as Keys from "../../keys.json"
import Snapshot from "../snapshot"
import { compressPixels } from "./Order"
import { PixelsToImageData } from "./Blocks"

export class Deployer {
    getMLM() {
        const mlm = {
            rep: [] as string[],
            upline: [] as string[],
            uplineNr: [] as number[],
            earn1: [] as number[],
            earn2: [] as number[],
            earn3: [] as number[],
            tier1: [] as number[],
            tier2: [] as number[],
            tier3: [] as number[]
        }
        
        function setMLM(rep: string, upline: string, earn1: number, earn2: number, earn3: number, tier1: number, tier2: number, tier3: number) {
            mlm.rep.push(rep)
            mlm.upline.push(upline)
            mlm.earn1.push(earn1)
            mlm.earn2.push(earn2)
            mlm.earn3.push(earn3)
            mlm.tier1.push(tier1)
            mlm.tier2.push(tier2)
            mlm.tier3.push(tier3)
        }
        
        setMLM("0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", "0x256D49d87cbb877D26E2Bcf2bF0A40D26bdfB5d4", 2500,0,0,5,0,0);
        setMLM("0x1EF5526ee1A6D8c596cce90e774A2c41372cC8cD", "0x0A26E272A2D722799B7ff39A1e5128A379b8582C", 1120,0,0,2,0,0);
        setMLM("0x528d4e4E0dbF071eC23013f06D8487BaD5A8a68B", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x47Ea9F2d81Aff9F539348a476F45EdbF5F2122B2", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", "0x0000000000000000000000000000000000000000", 380,0,0,8,0,0);
        setMLM("0x496ea957960Bf9A2BBC1D3c114EaA124e07D0543", "0x3D9B0A7ef1CcEAda457001A6d51F28FF61E39904", 40,200,10,1,1,1);
        setMLM("0xf07504A96601b35Dd702b07EcC57B2b169866f57", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x0A26E272A2D722799B7ff39A1e5128A379b8582C", "0x0000000000000000000000000000000000000000", 720,60,0,1,2,0);
        setMLM("0xc572c95996653ae98Ec3A59d9a511eDA142b98C1", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0xB6207FaCFbc0C7373425D9671Ea0Ca23459E9796", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0xa0bf4E5640e5db6FA82967d2C160e35a9a28AE83", "0xe61a0809eF3f1d2D695555413ac354284BF23915", 0,0,0,0,0,0);
        setMLM("0x9D0b92468Ef23D156F1bd5042Fe0B45C80a4418e", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0x897656B1Fb6C3688e48e1DD8259f7E092364754d", "0x0000000000000000000000000000000000000000", 620,0,0,1,0,0);
        setMLM("0x5434289767bb094DaDbb8D1E5D58b47Ca5729063", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x3D9B0A7ef1CcEAda457001A6d51F28FF61E39904", "0x496ea957960Bf9A2BBC1D3c114EaA124e07D0543", 420,20,100,1,1,1);
        setMLM("0x357dfdC34F93388059D2eb09996d80F233037cBa", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xcE3C9E357425c99cC27Dc9bF963d06E739811465", "0x77FB740096D2bd63F23995c7DB8b46502F556377", 20,40580,5,1,1,1);
        setMLM("0x00A5af2D7DA07dF76073A6f478f0fB4942D2659a", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x9a4773EeEE73e34e1EE0E9A64E4b7453b0b04246", "0x0000000000000000000000000000000000000000", 20,0,0,1,0,0);
        setMLM("0x0E2353516EB6208aA84a552b9a1EE5f13eDaDa57", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0x77FB740096D2bd63F23995c7DB8b46502F556377", "0xcE3C9E357425c99cC27Dc9bF963d06E739811465", 81220,10,20290,1,1,1);
        setMLM("0xaf1ca20615F84c48782F2f23b3cC737Db9c3514c", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", "0x0000000000000000000000000000000000000000", 2160,0,0,3,0,0);
        setMLM("0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", "0x0000000000000000000000000000000000000000", 17360,7560,625,8,11,5);
        setMLM("0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 620,0,0,4,0,0);
        setMLM("0x4e880933AAa461a5FbD0D499f1e142D78f77c8eA", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x41361Ad7c8845fC628B2370Ac78E1e98A70960Dc", "0x9a4773EeEE73e34e1EE0E9A64E4b7453b0b04246", 0,0,0,0,0,0);
        setMLM("0x7f3D32C56b94a9B7878fdfAC4F40Aaa2A6E11EdF", "0xe61a0809eF3f1d2D695555413ac354284BF23915", 0,0,0,0,0,0);
        setMLM("0xe61a0809eF3f1d2D695555413ac354284BF23915", "0x0000000000000000000000000000000000000000", 5640,0,0,2,0,0);
        setMLM("0x17d8E3268B7C81111C98b7D3cCeA55072A32D6C0", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xA03DEE508d09Ba9401a661F154036B36328e0F0C", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 14240,0,0,6,0,0);
        setMLM("0x256D49d87cbb877D26E2Bcf2bF0A40D26bdfB5d4", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 1360,1250,0,1,5,0);
        setMLM("0x54D925F320400139f9F2925767F1ec68B027e7C0", "0x1EF5526ee1A6D8c596cce90e774A2c41372cC8cD", 0,0,0,0,0,0);
        setMLM("0xb3D1e41F84AcD0E77F83473aa62fc8560C2A3c0C", "0x28c24f2Da9B6E517968300Eb1A4F4aE1B235238E", 0,0,0,0,0,0);
        setMLM("0x1a6049c6362D35C768470F1E3684d60D36CF4E47", "0x2931839f032597E1eCeF70DD71F309aCc50Fe7B8", 20,0,5,1,1,1);
        setMLM("0x2931839f032597E1eCeF70DD71F309aCc50Fe7B8", "0x1a6049c6362D35C768470F1E3684d60D36CF4E47", 20,10,0,1,1,1);
        setMLM("0xDA4C79CcfDcbfA9128B1e328f77E5f9C6AD72A44", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0xbf2116D0a79da0E5710Df8AB00eb20415bCA94C8", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0xF3CDA35B2fb88aFf0e8df3499EC88959d13a3B5f", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0x19D2991076f65ca610d4186001EfF4CF64Ed1edB", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0x4fD95c6FA765e64eC9313E465F4D2B88Cbf8dEaa", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x81F185CB71A4b98777a5Ee50CA55e80608DB61c1", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x0b981d98e857C888E00D2C494D24DC16a12F8f3A", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0x28c24f2Da9B6E517968300Eb1A4F4aE1B235238E", "0x0000000000000000000000000000000000000000", 20,0,0,1,0,0);
        setMLM("0x20C27c130155685070a7Bf3Cfe7084E70e06bF64", "0x897656B1Fb6C3688e48e1DD8259f7E092364754d", 0,0,0,0,0,0);
        setMLM("0x1aDcF07389b1F6605C44a7683c50A5243829A92C", "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", 0,0,0,0,0,0);
        setMLM("0x1F427A6FCdb95A7393C58552093e10A932890FA8", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x218d75b17f491793a96ab4326c7875950359a80C", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x2493C86B62E8ff26208399144817EF2898c59460", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x43d20d5efA78Ff0e465DDa2e58109F9fb3A2becE", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x53033C9697339942256845dD4d428085eC7261B8", "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", 0,0,0,0,0,0);
        setMLM("0x66AB3988D11B493cBe632C7d4471A68350a786e9", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0x8fB07b21383d331F3752A7590b0cfEAc85514A1F", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x9EFb6D49Fd5496626E80Ad0B07017744aE9A0efA", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xBF912CB4d1c3f93e51622fAe0bfa28be1B4b6C6c", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xDf547EaB8944D9Ef06475dF8eEe372B9808f425E", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xF82a5d0168cc93e63dc217314AdB87f15891d124", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xfEdcBda26763eF4660d5204F4252f2A9B1276D4a", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x62BA33Ccc4a404456e388456C332D871DaE7ae9e", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xf07A2439296e07Bc4320AF924E655a01fb69D89C", "0x0000000000000000000000000000000000000000", 500,0,0,4,0,0);
        setMLM("0x4656E28Ed7C4aAcD1e7FB98D3C8041d6De04c08F", "0x1EF5526ee1A6D8c596cce90e774A2c41372cC8cD", 0,0,0,0,0,0);
        setMLM("0xBF5310fAe4D7a0C6dF0452bCDA09aEFA2748Ad59", "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", 0,0,0,0,0,0);

        return mlm;
    }

    async deploy() {
        let provider = new ethers.providers.JsonRpcProvider(constants.network.rpcUrls[0])
        let signer = ethers.Wallet.fromMnemonic(Keys.deployer).connect(provider)
        let pixel = PixelV2Factory.connect(constants.pixel, signer)
        let mlm = this.getMLM()

        let gas = BigNumber.from("0")
        let tx

        let currentAddresses = await pixel.getAddresses()
        let allAddresses = Snapshot.blocks.map(b => b.owner).concat(mlm.upline)
        let addresses = [...new Set(allAddresses.filter(a => currentAddresses.indexOf(a) < 0))]
        if (addresses.length) {
            console.log("Adding", addresses.length, "addresses")
            tx = await (await pixel.addAddresses(addresses)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }
        currentAddresses = await pixel.getAddresses()

        console.log(mlm.upline.map(a => currentAddresses.indexOf(a)))
        tx = await (await pixel.initMLM(
            mlm.rep,
            mlm.upline.map(a => currentAddresses.indexOf(a)),
            mlm.earn1,
            mlm.earn2,
            mlm.earn3,
            mlm.tier1,
            mlm.tier2,
            mlm.tier3
        )).wait()
        gas = gas.add(tx.gasUsed)

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
        let pixelPromises: Promise<string>[] = []
        console.log("Building pixels...")
        for(let i in Snapshot.blocks) {
            let b = Snapshot.blocks[i]
            let d = compressPixels(PixelsToImageData(ctx!, b.pixels))
            pixelPromises.push(d)
        }
        console.log("Promises", pixelPromises.length)
        let allPixels = (await Promise.all(pixelPromises))

        console.log("Pixels", allPixels.length)
        let pixels = [...new Set(allPixels)].filter(d => currentData.indexOf(d) < 0)
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
            if (isBlank.filter(b => b).length > 0) {
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
        }

        tx = await (await pixel.finishInit()).wait()
        gas = gas.add(tx.gasUsed)

        console.log("Total gas", gas.toString())
    }
}