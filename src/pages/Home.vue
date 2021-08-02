<template>
    <table style="width: 1004px; margin: auto; border-spacing: 0;">
        <tr>
            <td style="text-align: left; vertical-align: top">
                <PixelLogo />
            </td>
            <td style="vertical-align: bottom">
                <button v-if="wrongNetwork" @click="switchToNetwork" class="upload-button">Switch to {{ chainName }}</button>
                <button v-if="!wrongNetwork && !info.address" @click="info.connect" class="upload-button">Connect Metamask</button>
                <button v-if="!wrongNetwork && info.address" @click="buyState = BuyState.SelectImage" class="upload-button">Upload your own pixels</button>
            </td>
            <td style="text-align: right">
                <span v-if="info.chainId == 0">
                    Network not connected
                </span>
                <span v-else-if="wrongNetwork">
                    Wrong network <button @click="switchToNetwork">Switch to {{ chainName }}</button>
                </span>
                <span v-else-if="!info.address">
                    <button @click="info.connect">Connect Metamask</button>
                </span>
                <span v-else>
                    <strong>Your wallet address</strong><br>
                    {{ info.address }}
                </span>
                <br><br>
                <table v-if="pollInfo" style="margin-left: auto;">
                    <tbody>
                        <tr>
                            <td style="border: 3px ridge; padding: 4px;">Total PIXELs</td>
                            <td style="border: 3px ridge; padding: 4px;">{{ pollInfo.supply.print(18, 0) }}</td>
                        </tr>
                        <tr v-if="info.address">
                            <td style="border: 3px ridge; padding: 4px;">You own</td>
                            <td style="border: 3px ridge; padding: 4px;">{{ pollInfo.balance.print(18, 0) }}</td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <Countdown :goal="startTimeStamp">
                    <template v-slot:before>
                        <strong>Creation Phase</strong><br>
                        starting in
                    </template>
                    <Countdown :goal="lockTimeStamp">
                        <template v-slot:before>
                            <strong>Creation Phase</strong><br>
                            <BlocksStats :blocks="data.blocks" /><br>
                            ends in
                        </template>
                        <strong>Canvas NFT Phase</strong><br>
                        The canvas is now locked.
                    </Countdown>
                </Countdown>
            </td>
        </tr>
    </table>

    <SelectionArea :image="image" :select="buyState == BuyState.DrawArea" @select="areaSelected" style="position: relative; width: 1000px; height: 1000px; background-color: rgb(40, 95, 170); border: 1px solid rgb(169, 216,235); margin-left: auto; margin-right: auto;">
        <canvas id="canvas" width="1000" height="1000" @click="click" @mousemove="mousemove" @mouseleave="mouseleave" style="cursor: pointer;" />
        <Tooltip v-if="buyState != BuyState.SelectImage" ref="tooltip" :info="info" :blocks="data.blocks" :mx="mx" :my="my" />
        <Loading v-if="loading" />

        <div v-if="buyState == BuyState.SelectImage" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); max-width: 400px;">
            <div class="title-bar">
                <div class="title-bar-text">Claim your piece of the canvas, get some PIXELs</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" @click="buyState = BuyState.None"></button>
                </div>
            </div>
            <div class="window-body">
                <h3 style="font-family: Comic Sans MS; font-size: 1.5em">Step 1. Upload an image</h3>
                <p>Select the image you would like to draw onto the canvas. For the best results, prepare an image at the correct size. 10x10, 20x20, 30x60, etc.</p>
                <DropTarget @fileLoaded="imageLoaded">
                    <div id="drop_zone">
                        <img src="../assets/fileflip.gif" style="float: left; margin-left: 20px;" />
                        <br><br>
                        <p>Drag your image here or click to Browse...</p>
                    </div>
                </DropTarget>
            </div>
        </div>

        <div v-if="buyState == BuyState.DrawArea" class="window" :style="'position: absolute; ' + (mouseBelowHalf ? 'top' : 'bottom') + ': 10%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%)'">
            <div class="title-bar">
                <div class="title-bar-text">Claim your piece of the canvas, get some PIXELs</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" @click="buyState = BuyState.None"></button>
                </div>
            </div>
            <div class="window-body">
                <img src="../assets/measure.gif" />
                <h3 style="font-family: Comic Sans MS; font-size: 1.5em">Step 2. Select the area you like</h3>
                <p>Use your mouse to click and drag the area where you would like the image to go.</p>
            </div>
        </div>

        <div v-if="buyState == BuyState.Buy" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); max-width: 500px;">
            <div class="title-bar">
                <div class="title-bar-text">Claim your piece of the canvas, get some PIXELs</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" @click="buyState = BuyState.None"></button>
                </div>
            </div>
            <div class="window-body">
                <h3 style="font-family: Comic Sans MS; font-size: 1.5em">Step 3. Purchase</h3>
                <p>
                    Size: {{ order.width * 10 }}x{{ order.height * 10 }} pixels<br>
                    Pixel cost: {{ order.cost.print(18, 0) }} MATIC<br>
                    Gas costs (est): {{ order.gas.mul(order.gasPrice).print(18, 0)}} MATIC ({{ order.gasPrice.print(9, 0) }} gwei)<br>
                    You will receive {{ (order.width * order.height - order.duplicateBlocks) * 100 }} PIXEL tokens
                    <span v-if="order.width * order.height - order.duplicateBlocks > 25">
                        <br><br>
                        They area is too large for a single transaction. <strong>{{ Math.ceil((order.width * order.height - order.duplicateBlocks) / 25) }} transactions will be queued</strong>. If any of the transactions fail, you can simply redo it with the same image and the same area. Any blocks of pixels already succesfully bought will be ignored (not bought again).
                    </span>
                    <span v-if="order.duplicateBlocks"><br>{{ order.duplicateBlocks * 100 }} duplicate pixels found, ignored</span>
                </p>
                <div class="field-row-stacked" style="width: 100%">
                    <label for="url">URL</label>
                    <input id="url" type="url" v-model="order.url">
                </div>
                <div class="field-row-stacked" style="width: 100%">
                    <label for="description">Description</label>
                    <input id="description" type="text" v-model="order.description">
                </div>
                <br>
                <button @click="buy">Purchase</button>
            </div>
            <img src="../assets/bsbpayperview.gif" style="width: 100%" />
        </div>        
    </SelectionArea>

    <table style="width: 1004px; margin: auto; border-spacing: 0;">
        <tr>
            <td style="vertical-align: top; padding-top: 20px">
                <AmbassadorProgram :info="info" :pollInfo="pollInfo" />
                <div style="text-align: left; vertical-align: top; padding-top: 10px;">
                    <SocialButtons></SocialButtons>
                </div>
            </td>
            <td style="vertical-align: top; padding-top: 20px">
                <div style="margin-left: auto; width: 480px; background-color: #ccc; color: black; border: 1px solid rgb(169, 216,235);">
                    <h4 style="color: rgb(29, 74, 129); margin-block-start: 0.5em; margin-block-end: 0.5em">Pixel Smart Contract</h4>
                    PIXEL address is <a :href="contractURL" target="_blank">{{ contractAddress }}</a><br>
                    CAUTION: Contracts are NOT audited.<br>
                    All data is stored on-chain. Website is <a :href="'https://pixelinc.eth.link/?ref=' + referrer">hosted on IPFS</a>.
                    <br>
                    <br>

                    <div style="display: flex; width: 100%">
                        <div style="flex-grow: 1">
                            Best viewed with:<br>
                            <a href="https://www.youtube.com/watch?v=eTVzkftwYgM" target="_blank"><img src="../assets/catsheepnow.gif" height="60"></a>
                        </div>
                        <div style="flex-grow: 1">
                            You are visitor:<br>
                            <img src="https://www.webfreecounter.com/hit.php?id=grofcnc&nd=6&style=11" border="0" alt="visitor counter">
                        </div>
                    </div>
                    <br>
                </div>
                <div style="padding-top: 10px">
                    <img style="float: right" src="../assets/tom.jpg" height="80">
                    <p style="text-align: right; padding-right: 100px">
                        <span style="color: rgb(55, 94, 165)">
                            "Some of my best friends<br>
                            are made of pixels"<br>
                        </span>
                        <strong>- Tom</strong>
                    </p>
                </div>
            </td>
        </tr>
    </table>
    <br>
    <Leaderboard :blocks="data.blocks" />
    <Admin v-if="info.address.toLowerCase() == '0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E'.toLowerCase()" :info="info" :pixel="pixel" :blocks="data.blocks" :updateIndex="updateIndex" :version="version" />
    <Clippy @loaded="clippyLoaded"></Clippy>
</template>

<script lang="ts">
// Hi there! Thanks for reading the code... it's a mess, put together quickly. Enjoy and good luck!
// - BoringCrypto (https://twitter.com/Boring_Crypto)

import {defineComponent, PropType } from "@vue/runtime-core"
import { ProviderInfo } from "../classes/ProviderInfo"
import * as Cache from "../cache.json"
import * as Snapshot from "../snapshot.json"
import { PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { PollInfo } from "../types"
import { nextTick } from "process"
import { ethers } from "ethers"
import { constants } from "../constants/development"
import { sleep, playSound, randomItem, decompress, compress, cleanURI } from "../classes/Utils"
import { MaticProvider } from "../classes/MaticProvider"
import { Blocks, Canvas, PixelsToImageData } from "../classes/Blocks"
import { compressPixels, decompressPixels, imgDataToHex, Order, SelectedArea } from "../classes/Order"

import * as Keys from "../../keys.json"

import Countdown from "../components/Countdown.vue"
import PixelLogo from "../components/PixelLogo.vue"
import SocialButtons from "../components/SocialButtons.vue"
import BlocksStats from "../components/BlocksStats.vue"
import DropTarget from "../components/DropTarget.vue"
import AmbassadorProgram from "../components/AmbassadorProgram.vue"
import Leaderboard from "../components/Leaderboard.vue"
import Clippy, { ClippyAgent } from "../components/Clippy.vue"
import Admin from "../components/Admin.vue"
import SelectionArea from "../components/SelectionArea.vue"
import Tooltip from "../components/Tooltip.vue"
import Loading from "../components/Loading.vue"

enum BuyState {
    None,
    SelectImage,
    DrawArea,
    Buy
}

export default defineComponent({
    name: "Home",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true,
        },
        referrer: String
    },
    components: {
        Countdown,
        PixelLogo,
        SocialButtons,
        BlocksStats,
        DropTarget,
        AmbassadorProgram,
        Leaderboard,
        Clippy,
        Admin,
        SelectionArea,
        Tooltip,
        Loading
    },
    setup() {
        return {
            matic: null as MaticProvider | null,
            pixel: null as PixelV2 | null
        }
    },
    data() {
        return {
            BuyState,
            loading: false,
            startTimeStamp: 0,
            lockTimeStamp: 0,

            pollInfo: null as PollInfo | null,
            addresses: [] as string[],
            texts: [] as string[],
            datas: [] as string[],
            updateIndex: 0,
            version: 0,

            canvas: null as HTMLCanvasElement | null,
            image: null as HTMLImageElement | null,

            data: new Canvas(),

            mouseBelowHalf: false,
            mx: -1,
            my: -1,

            buyState: BuyState.None,
            order: new Order(),

            edit: false,

            mnemonic: "",
            clippy: null as ClippyAgent | null,
        }
    },
    async created() {
        let gas = BigNumber.from("0")
        this.matic = new MaticProvider(constants.network.rpcUrls[0], () => {
            this.newBlock()
        })
        this.pixel = PixelV2Factory.connect(constants.pixel, this.matic.provider)

        let dataStr = localStorage.getItem("data")
        if (dataStr) {
            let result = await decompress(dataStr)
            let data = JSON.parse(result)
            this.data.blocks = data.blocks
            this.updateIndex = data.updateIndex
            this.version = data.version || 0
        }

        if (this.version < Cache.version || this.updateIndex < Cache.updateIndex) {
            this.data.blocks = Cache.blocks
            this.updateIndex = Cache.updateIndex
            this.version = Cache.version
        }

        if (this.data.blocks.length != 10000) {
            Blocks.empty(this.data.blocks)
        }

        this.startTimeStamp = (await this.pixel.START_TIMESTAMP()).toNumber()
        this.lockTimeStamp = (await this.pixel.LOCK_TIMESTAMP()).toNumber()

        let signer = ethers.Wallet.fromMnemonic(Keys.deployer).connect(this.matic.provider)
        let pixel = PixelV2Factory.connect(constants.pixel, signer)

        let tx

        /*let currentAddresses = await pixel.getAddresses()
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
            currentData = currentData.concat(await pixel.getData(start, end))
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
            currentData = currentData.concat(await pixel.getData(start, end))
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
            tx = await (await pixel.initBlocks(
                blockNumbers.splice(0, 300),
                lastPrices.splice(0, 300),
                owners.splice(0, 300),
                urls.splice(0, 300),
                descriptions.splice(0, 300),
                pixelss.splice(0, 300)
            )).wait()
            console.log("Left", blockNumbers.length, "gas", tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        console.log("Total gas", gas.toString())*/
    },
    computed: {
        chainName() { return constants.network.chainName },
        contractAddress() { return constants.pixel },
        contractURL() { return constants.network.blockExplorerUrls[0] + 'address/' + constants.pixel + "#code" },
        wrongNetwork(): boolean { return this.info.chainId != constants.chainId },
        referrerClean(): string { return this.referrer?.toLowerCase() != this.info.address.toLowerCase() ? this.referrer || ethers.constants.AddressZero : ethers.constants.AddressZero },
    },
    watch: {
        'info.address': function() {
            this.newBlock()
        }
    },
    methods: {
        mousemove(event: MouseEvent) {
            if (event.target === this.canvas) {
                this.mouseBelowHalf = event.offsetY > 500
                this.mx = event.offsetX < 1000 ? event.offsetX : 999
                this.my = event.offsetY < 1000 ? event.offsetY : 999
            }
        },
        mouseleave() {
            this.mx = -1
            this.my = -1
        },
        imageLoaded(src: string) {
            this.image = new Image()
            this.image.src = src
            this.buyState = BuyState.DrawArea
        },
        async areaSelected(area: SelectedArea) {
            if (this.pixel && window.provider) {
                this.order = new Order()
                await this.order.create(area, this.data.blocks, this.pixel, window.provider)
                console.log(this.order)
                if (this.order.cost.gt("0")) {
                    this.buyState = BuyState.Buy
                    this.image = null
                    
                    let ctx = this.canvas?.getContext("2d")
                    for (let i = 0; i < this.order.blockNumbers.length; i++) {
                        ctx!.putImageData(await decompressPixels(this.order.pixels[i]), ( this.order.blockNumbers[i] % 100) * 10, Math.floor( this.order.blockNumbers[i] / 100) * 10)
                    }
                } else {
                    this.buyState = BuyState.None
                }
            }
        },
        clippyLoaded(agent: ClippyAgent) {
            this.clippy = agent
            window.setTimeout(() => {
                let app = document.getElementById("app")
                if (app) {
                    app.style.display = "block";
                }
                let splash = document.getElementById("splash")
                if (splash) {
                    splash.style.display = "none";
                }

                playSound('/' + randomItem(["win95", "winxp"]) + '.mp3')

                window.setTimeout(() => {
                    this.clippy!.show()
                    this.clippy!.speak("Welcome to Pixel Inc!")
                }, 2500)
            }, 1000)
        },
        async switchToNetwork() {
            await window.ethereum.request({method: 'wallet_addEthereumChain', params: [constants.network]})
        },
        async newBlock() {
            let ctx = this.canvas?.getContext("2d")
            if (ctx && this.pixel && !this.edit) {
                console.log("Polling for new data")

                let pollInfo = await this.pixel!.poll(this.info.address || ethers.constants.AddressZero)
                console.log(pollInfo)
                this.pollInfo = {
                    updates: pollInfo.updates_,
                    balance: pollInfo.balance,
                    supply: pollInfo.supply,
                    downline: {
                        tier1: pollInfo.mlm_.tier1,
                        tier2: pollInfo.mlm_.tier2,
                        tier3: pollInfo.mlm_.tier3,
                        earnings1: pollInfo.mlm_.earnings1,
                        earnings2: pollInfo.mlm_.earnings2,
                        earnings3: pollInfo.mlm_.earnings3
                    },
                    upline: pollInfo.upline_
                }

                let currentUpdatesCount = this.pollInfo.updates.toNumber()
                if (this.loading) { return; }
                this.loading = true

                if (pollInfo.addresses_.toNumber() > this.addresses.length) {
                    console.log("Get addresses")
                    this.addresses = await this.pixel.getAddresses()
                }

                if (pollInfo.text_.toNumber() > this.texts.length) {
                    console.log("Get text")
                    this.texts = await this.pixel.getText()
                }

                let start = this.datas.length
                let dataCount = pollInfo.data_.toNumber()
                while (start < dataCount) {
                    let end = start + 200 < dataCount ? start + 200 : dataCount
                    console.log("Getting data from", start, "to", end)
                    console.log("Get data", start, end)
                    this.datas = this.datas.concat(await this.pixel.getData(start, end))
                    start += 200
                }

                let updateBlockSize = 1000
                let updates: any[] = []
                let newUpdates: any[] = []
                while (currentUpdatesCount > this.updateIndex) {
                    console.log("Getting", this.updateIndex, currentUpdatesCount)
                    let success = false
                    while (!success) {
                        try {
                            newUpdates = await this.pixel.getUpdates(this.updateIndex, updateBlockSize)
                            updates = updates.concat(newUpdates)
                            success = true
                        } catch {
                            await sleep(10000)
                        }
                    }
                    this.updateIndex = this.updateIndex + newUpdates.length
                }
                updates = [...new Set(updates.map(bn => bn.toNumber()))]
                if (updates && ctx) {
                    if (updates.length && updates[0] == 10000) {
                        console.log("Update ALL blocks")
                        updates = [...Array(10000).keys()]
                    }

                    console.log("Updates", updates)

                    while (updates.length) {
                        console.log(updates.length, "left")
                        let success = false
                        let updatedBlocks: any[] = []
                        while (!success) {
                            try {
                                updatedBlocks = await this.pixel.getRawBlocks(updates.splice(0, 100))
                                success = true
                            } catch {
                                await sleep(10000)
                            }
                        }

                        for (let i in updatedBlocks) {
                            let block = updatedBlocks[i]
                            this.data.blocks[block.number].owner = this.addresses[block.owner]
                            this.data.blocks[block.number].lastPrice = block.lastPrice.toDec(18).toNumber()
                            this.data.blocks[block.number].url = cleanURI(this.texts[block.url])
                            this.data.blocks[block.number].description = this.texts[block.description]

                            let data = await decompressPixels(this.datas[block.pixels])
                            ctx.putImageData(data, (block.number % 100) * 10, Math.floor(block.number / 100) * 10)
                            this.data.blocks[block.number].pixels = imgDataToHex(data)
                        }
                    }

                    //localStorage.setItem("data", await compress(JSON.stringify({blocks: this.data.blocks, updateIndex: this.updateIndex, version: this.version})))
                }
                this.loading = false
            }
        },
        async buy() {
            this.image = null
            this.buyState = BuyState.None
            if (!this.edit) {
                if (this.pixel && window.provider) {
                    this.order.buy(this.pixel, window.provider, this.info, this.referrerClean)
                }
            } else {
                let ctx = this.canvas?.getContext("2d")

                for (let n = 0; n < this.order.blockNumbers.length; n++) {
                    let blockNumber = this.order.blockNumbers[n]
                    let pixels = this.order.pixels[n]
                    this.data.blocks[blockNumber].url = "https://www.youtube.com/watch?v=4q1dgn_C0AU"
                    this.data.blocks[blockNumber].description = "Don't worry, be happy"
                    this.data.blocks[blockNumber].pixels = pixels

                    if (pixels && ctx) {
                        let data: ImageData = ctx.createImageData(10, 10)
                        for(let i = 0; i < 100; i++) {
                            let hex = pixels.substr(2 + i * 6, 2)
                            data.data[i * 4] = BigNumber.from("0x" + hex).toNumber()
                            hex = pixels.substr(4 + i * 6, 2)
                            data.data[i * 4 + 1] = BigNumber.from("0x" + hex).toNumber()
                            hex = pixels.substr(6 + i * 6, 2)
                            data.data[i * 4 + 2] = BigNumber.from("0x" + hex).toNumber()
                            data.data[i * 4 + 3] = 255
                        }
                        ctx.putImageData(data, (blockNumber % 100) * 10, Math.floor(blockNumber / 100) * 10)
                    }
                }
            }
        },
        agentDo(action: string) {
            (this.$refs.clippy as typeof Clippy).play(action)
        },
        click(event: Event) {
            if (event.target === this.canvas) {
                if (this.buyState == BuyState.None) {
                    (this.$refs.tooltip as typeof Tooltip).navigate()
                }
            }
        }
    },
    mounted() {
        const self = this
        nextTick(() => {
            this.canvas = document.getElementById("canvas") as HTMLCanvasElement
            let ctx = this.canvas?.getContext("2d")
            if (ctx) {
                ctx.imageSmoothingEnabled= false
                for (let b = 0; b < 10000; b++) {
                    let block = this.data.blocks[b]
                    if (block) {
                        let pixels = block.pixels
                        if (pixels) {
                            ctx.putImageData(PixelsToImageData(ctx, pixels), (b % 100) * 10, Math.floor(b / 100) * 10)
                        }
                    }
                }
            }
        })
    }
})
</script>
