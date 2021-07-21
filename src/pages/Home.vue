<style>
    .window {
        color: black;
    }

    .window-body, button {
        font-family: "Comic Sans MS";
    }

    .upload-button {
        font-size: 14pt;
        height: 38px;
        margin-bottom: 8px;
        margin-top: auto;
    }

    #drop_zone {
        border: 3px dashed rgb(13, 13, 13);
        width:  80%;
        height: 100px;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
    }
</style>

<template>
    <table style="width: 1004px; margin: auto; border-spacing: 0;">
        <tr>
            <td style="text-align: left; vertical-align: top">
                <PixelLogo />
            </td>
            <td v-if="started && !locked" style="vertical-align: bottom">
                <button v-if="wrongNetwork" @click="switchToNetwork" class="upload-button">Switch to {{ chainName }}</button>
                <button v-if="!wrongNetwork && !info.address" @click="info.connect" class="upload-button">Connect Metamask</button>
                <button v-if="!wrongNetwork && info.address" @click="buying = true" class="upload-button">Upload your own pixels</button>
                <br>
                <a style="color: white" href="https://snapshot.org/#/pixelinc.eth/proposal/QmVxXwALTod3uvmiYLo4wXscLUyD38DKDP34s66ahP7uY8" target="_blank">Move to Ethereum? 
                    <Countdown :goal="1626919200">
                        <template v-slot:before>Vote in&nbsp;</template>
                        Voting is open!
                    </Countdown>
                </a>
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
                <table v-if="started && pollInfo" style="margin-left: auto;">
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
                            <BlocksStats :blocks="blocks" /><br>
                            ends in
                        </template>
                        <strong>Canvas NFT Phase</strong><br>
                        The canvas is now locked.
                    </Countdown>
                </Countdown>
            </td>
        </tr>
    </table>

    <div id="selectionArea" :style="'position: relative; width: 1000px; height: 1000px; background-color: rgb(' + (image && !selected ? '20, 47, 85' : '40, 95, 170') + '); border: 1px solid rgb(169, 216,235); margin-left: auto; margin-right: auto;' + (tooltip ? 'cursor: pointer' : '')">
        <canvas id="canvas" width="1000" height="1000" />
        <div v-if="loading" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); max-width: 400px;">
            <div class="title-bar">
                <div class="title-bar-text">Loading...</div>
            </div>
            <div class="window-body">
                <img src="../assets/McHammer.gif" />
            </div>
        </div>

        <div class="window" v-if="tooltip" ref="tooltip" :style="tooltipStyle">
            <div class="window-body">
                <span v-if="tooltipBlock?.owner">
                    {{ tooltipBlock?.description }}<br>
                    <a>{{ tooltipBlock?.url }}</a>
                </span>
                <span v-else>
                    Unowned
                </span>
            </div>
            <div class="status-bar">
                <p class="status-bar-field">{{ (tooltipBlock?.lastPrice || 0) * 0.02 || 0.1 }} MATIC per pixel</p>
                <p class="status-bar-field">{{ tooltipBlock?.owner ? tooltipBlock?.owner.toLowerCase() == info.address.toLowerCase() ? "Owned by you!" : "Owned by other" : "Unowned" }}</p>
            </div>
            <div v-if="tooltipBlock.owner" class="status-bar">
                <p class="status-bar-field">{{ tooltipBlock.owner }}</p>
            </div>
        </div>        
        <img ref="preview" :style="selectionStyle" />

        <div v-if="buying && !image" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); max-width: 400px;">
            <div class="title-bar">
                <div class="title-bar-text">Claim your piece of the canvas, get some PIXELs</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" @click="buying = false"></button>
                </div>
            </div>
            <div class="window-body">
                <h3 style="font-family: Comic Sans MS; font-size: 1.5em">Step 1. Upload an image</h3>
                <p>Select the image you would like to draw onto the canvas. For the best results, prepare an image at the correct size. 10x10, 20x20, 30x60, etc.</p>
                <DropTarget @loaded="loaded">
                    <div id="drop_zone">
                        <img src="../assets/fileflip.gif" style="float: left; margin-left: 20px;" />
                        <br><br>
                        <p>Drag your image here or click to Browse...</p>
                    </div>
                </DropTarget>
            </div>
        </div>

        <div v-if="image && !selected" class="window" :style="'position: absolute; ' + (mouseBelowHalf ? 'top' : 'bottom') + ': 10%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%)'">
            <div class="title-bar">
                <div class="title-bar-text">Claim your piece of the canvas, get some PIXELs</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" @click="buying = false"></button>
                </div>
            </div>
            <div class="window-body">
                <img src="../assets/measure.gif" />
                <h3 style="font-family: Comic Sans MS; font-size: 1.5em">Step 2. Select the area you like</h3>
                <p>Use your mouse to click and drag the area where you would like the image to go.</p>
            </div>
        </div>

        <div v-if="image && selected" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); max-width: 500px;">
            <div class="title-bar">
                <div class="title-bar-text">Claim your piece of the canvas, get some PIXELs</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" @click="image = null; buying = false; selected = false"></button>
                </div>
            </div>
            <div class="window-body">
                <h3 style="font-family: Comic Sans MS; font-size: 1.5em">Step 3. Purchase</h3>
                <p>
                    Size: {{ blockWidth * 10 }}x{{ blockHeight * 10 }} pixels<br>
                    Pixel cost: {{ cost.print(18, 0) }} MATIC<br>
                    Gas costs (est): {{ gas.mul(gasPrice).print(18, 0)}} MATIC ({{ gasPrice.print(9, 0) }} gwei)<br>
                    You will receive {{ (blockWidth * blockHeight - duplicateBlocks) * 100 }} PIXEL tokens
                    <span v-if="blockWidth * blockHeight - duplicateBlocks > 25">
                        <br><br>
                        They area is too large for a single transaction. <strong>{{ Math.ceil((blockWidth * blockHeight - duplicateBlocks) / 25) }} transactions will be queued</strong>. If any of the transactions fail, you can simply redo it with the same image and the same area. Any blocks of pixels already succesfully bought will be ignored (not bought again).
                    </span>
                    <span v-if="duplicateBlocks"><br>{{ duplicateBlocks * 100 }} duplicate pixels found, ignored</span>
                </p>
                <div class="field-row-stacked" style="width: 100%">
                    <label for="url">URL</label>
                    <input id="url" type="url" v-model="url">
                </div>
                <div class="field-row-stacked" style="width: 100%">
                    <label for="description">Description</label>
                    <input id="description" type="text" v-model="description">
                </div>
                <br>
                <button @click="buy">Purchase</button>
            </div>
            <img src="../assets/bsbpayperview.gif" style="width: 100%" />
        </div>        
    </div>

    <table style="width: 1004px; margin: auto; border-spacing: 0;">
        <tr>
            <td style="vertical-align: top; padding-top: 20px">
                <AmbassadorProgram :info="info" :pollInfo="pollInfo" />
                <div style="text-align: left; vertical-align: top; padding-top: 10px;">
                    <a href="https://twitter.com/Boring_Crypto" target="_blank"><img src="../assets/social_twitter.svg" height="32" style="padding-right: 10px"></a>
                    <a href="https://icq.im/760436916" target="_blank"><img src="../assets/icq.png" height="32" style="padding-right: 10px"></a>
                    <a href="https://boringcrypto.medium.com/pixel-inc-artvertising-nft-1c1ddaa16f32" target="_blank"><img src="../assets/social_medium.svg" height="32" style="padding-right: 10px"></a>
                    <a href="https://discord.gg/KE9R3GYJ" target="_blank"><img src="../assets/social_discord.svg" height="32" style="padding-right: 10px"></a>
                    <a href="https://github.com/boringcrypto/pixel" target="_blank"><img src="../assets/social_github.svg" height="32" style="padding-right: 10px"></a>
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
    <Leaderboard :blocks="blocks" />
    <Admin v-if="info.address.toLowerCase() == '0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E'.toLowerCase()" :info="info" :pixel="pixel" :blocks="blocks" />
    <Clippy @loaded="clippyLoaded"></Clippy>
</template>

<script lang="ts">
// Hi there! Thanks for reading the code... it's a mess, put together quickly. Enjoy and good luck!
// - BoringCrypto (https://twitter.com/Boring_Crypto)

import {defineComponent, PropType, reactive, ref} from "@vue/runtime-core"
import {ProviderInfo} from "../components/Web3.vue"
import * as Cache from "../cache.json"
import { PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { Block, PollInfo } from "../types"
import { nextTick } from "process"
import { ethers } from "ethers"
import { constants } from "../constants/live"
import { sleep, playSound, randomItem, decompress, compress } from "../classes/Utils"
import { MaticProvider } from "../classes/MaticProvider"
import { Blocks } from "../classes/Blocks"

import Countdown from "../components/Countdown.vue"
import PixelLogo from "../components/PixelLogo.vue"
import BlocksStats from "../components/BlocksStats.vue"
import DropTarget from "../components/DropTarget.vue"
import AmbassadorProgram from "../components/AmbassadorProgram.vue"
import Leaderboard from "../components/Leaderboard.vue"
import Clippy, { ClippyAgent } from "../components/Clippy.vue"
import Admin from "../components/Admin.vue"

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
        BlocksStats,
        DropTarget,
        AmbassadorProgram,
        Leaderboard,
        Clippy,
        Admin
    },
    setup() {
        let matic = null as MaticProvider | null
        let pixel = null as PixelV2 | null
        return {
            matic,
            pixel,
        }
    },
    data() {
        return {
            loading: false,
            startTimeStamp: 0,
            lockTimeStamp: 0,

            pollInfo: null as PollInfo | null,
            updateIndex: 0,
            version: 0,

            blocks: Blocks.empty([]),
            canvas: null as HTMLCanvasElement | null,

            mouseBelowHalf: false,
            mx: -1,
            my: -1,

            buying: false,
            image: null as HTMLImageElement | null,
            selecting: false,
            selected: false,
            startSelectX: 0,
            startSelectY: 0,
            endSelectX: 0,
            endSelectY: 0,
            blockNumbers: [] as number[],
            pixels: [] as string[],
            cost: BigNumber.from(0),
            gas: BigNumber.from(0),
            gasPrice: BigNumber.from(0),
            duplicateBlocks: 0,
            url: "",
            description: "",
            now: Date.now(),

            agent: null,
            edit: false,

            mnemonic: "",
            clippy: null as ClippyAgent | null
        }
    },
    async created() {
        this.matic = new MaticProvider(constants.network.rpcUrls[0], () => {
            this.newBlock()
        })
        this.pixel = PixelV2Factory.connect(constants.pixel, this.matic.provider)

        let dataStr = localStorage.getItem("data")
        if (dataStr) {
            let result = await decompress(dataStr)
            let data = JSON.parse(result)
            this.blocks = data.blocks
            this.updateIndex = data.updateIndex
            this.version = data.version || 0
        }

        if (this.version < Cache.version || this.updateIndex < Cache.updateIndex) {
            this.blocks = Cache.blocks
            this.updateIndex = Cache.updateIndex
            this.version = Cache.version
        }

        this.startTimeStamp = (await this.pixel.START_TIMESTAMP()).toNumber()
        this.lockTimeStamp = (await this.pixel.LOCK_TIMESTAMP()).toNumber()
    },
    computed: {
        chainName() { return constants.network.chainName },
        contractAddress() { return constants.pixel },
        contractURL() { return constants.network.blockExplorerUrls[0] + 'address/' + constants.pixel + "#code" },
        selectionStyle() {
            let style = "position: absolute; pointer-events: none;"
            style += this.selecting || this.selected ? "" : "display: none;"
            if (this.startSelectX <= this.endSelectX) {
                style += "left: " + this.startSelectX * 10 + "px;"
                style += "width: " + (this.endSelectX - this.startSelectX + 1) * 10 + "px;"
            } else {
                style += "left: " + this.endSelectX * 10 + "px;"
                style += "width: " + (this.startSelectX - this.endSelectX + 1) * 10 + "px;"
            }

            if (this.startSelectY <= this.endSelectY) {
                style += "top: " + this.startSelectY * 10 + "px;"
                style += "height: " + (this.endSelectY - this.startSelectY + 1) * 10 + "px;"
            } else {
                style += "top: " + this.endSelectY * 10 + "px;"
                style += "height: " + (this.startSelectY - this.endSelectY + 1) * 10 + "px;"
            }
            return style
        },
        wrongNetwork(): boolean { return this.info.chainId != constants.chainId },
        tooltip(): boolean { return this.mx != -1 && this.blocks.length == 10000 && !this.buying },
        tooltipBlock(): Block | null { return this.tooltip ? this.blocks[Math.floor(this.my / 10) * 100 + Math.floor(this.mx / 10)] : null},
        tooltipStyle(): string {
            let style = "position: absolute; pointer-events: none; margin: 5px; min-width: 200px;"
            style += "left: " + this.mx + "px;"
            style += "top: " + this.my + "px;"
            return style
        },
        blockWidth(): number { return Math.abs(this.endSelectX - this.startSelectX) + 1 },
        blockHeight(): number { return Math.abs(this.endSelectY - this.startSelectY) + 1 },
        started(): boolean { return this.now > this.startTimeStamp * 1000 ? true : false },
        locked(): boolean { return this.now > this.lockTimeStamp * 1000 ? true : false },
        
        referrerClean(): string { return this.referrer?.toLowerCase() != this.info.address.toLowerCase() ? this.referrer || ethers.constants.AddressZero : ethers.constants.AddressZero },
    },
    watch: {
        'info.address': function() {
            this.newBlock()
        }
    },
    methods: {
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
                this.gasPrice = await this.matic!.provider.getGasPrice()

                console.log("Polling for new data")
                let pollInfo = await this.pixel!.poll(this.info.address || ethers.constants.AddressZero)
                this.pollInfo = {
                    updates: pollInfo.updates_,
                    balance: pollInfo.balance,
                    supply: pollInfo.supply,
                    downline: {
                        tier1: pollInfo.downline_.tier1,
                        tier2: pollInfo.downline_.tier2,
                        tier3: pollInfo.downline_.tier3,
                        earnings1: pollInfo.downline_.earnings1,
                        earnings2: pollInfo.downline_.earnings2,
                        earnings3: pollInfo.downline_.earnings3
                    },
                    upline: pollInfo.upline_
                }

                let currentUpdatesCount = this.pollInfo.updates.toNumber()
                if (this.loading) { return; }
                if (currentUpdatesCount > this.updateIndex) {
                    this.loading = true
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

                while (updates.length) {
                    console.log(updates.length, "left")
                    let success = false
                    let updatedBlocks: any[] = []
                    while (!success) {
                        try {
                            updatedBlocks = await this.pixel.getBlocks(updates.splice(0, 100))
                            success = true
                        } catch {
                            await sleep(10000)
                        }
                    }

                    updatedBlocks.forEach(block => {
                        Blocks.loadFromChain(this.blocks, block)

                        if (block.pixels && ctx) {
                            let data: ImageData = ctx.createImageData(10, 10)
                            for(let i = 0; i < 100; i++) {
                                let hex = block.pixels.substr(2 + i * 6, 2)
                                data.data[i * 4] = BigNumber.from("0x" + hex).toNumber()
                                hex = block.pixels.substr(4 + i * 6, 2)
                                data.data[i * 4 + 1] = BigNumber.from("0x" + hex).toNumber()
                                hex = block.pixels.substr(6 + i * 6, 2)
                                data.data[i * 4 + 2] = BigNumber.from("0x" + hex).toNumber()
                                data.data[i * 4 + 3] = 255
                            }
                            ctx.putImageData(data, (block.number % 100) * 10, Math.floor(block.number / 100) * 10)
                        }
                    })
                }

                localStorage.setItem("data", await compress(JSON.stringify({blocks: this.blocks, updateIndex: this.updateIndex, version: this.version})))
                this.loading = false
            }
        },
        async buy() {
            this.image = null
            this.selected = false
            this.buying = false
            if (!this.edit) {
                if (window.provider) {
                    const signer = window.provider?.getSigner(this.info.address)
                    let p = PixelV2Factory.connect(constants.pixel, signer)
                    for (let i = 0; i <= Math.floor((this.blockNumbers.length - 1) / 25); i++) {
                        let blockNumbers = this.blockNumbers.slice(i * 25, (i + 1) * 25)
                        let pixels = this.pixels.slice(i * 25, (i + 1) * 25)
                        let cost = await p["getCost(uint256[])"](blockNumbers)
                        p["setBlocks(uint256[],string,string,bytes[],address)"](blockNumbers, this.url, this.description, pixels, this.referrerClean || ethers.constants.AddressZero, { value: cost })
                    }
                }
            } else {
                let ctx = this.canvas?.getContext("2d")

                for (let n = 0; n < this.blockNumbers.length; n++) {
                    let blockNumber = this.blockNumbers[n]
                    let pixels = this.pixels[n]
                    console.log(blockNumber, pixels)
                    this.blocks[blockNumber].url = "https://www.youtube.com/watch?v=4q1dgn_C0AU"
                    this.blocks[blockNumber].description = "Don't worry, be happy"
                    this.blocks[blockNumber].pixels = pixels

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
        loaded(src: string) {
            this.image = new Image()
            this.image.src = src
        },
        agentDo(action: string) {
            (this.$refs.clippy as typeof Clippy).play(action)
        },
    },
    mounted() {
        const self = this
        nextTick(() => {
            this.canvas = document.getElementById("canvas") as HTMLCanvasElement
            let ctx = this.canvas?.getContext("2d")
            if (ctx) {
                for (let b = 0; b < 10000; b++) {
                    let block = this.blocks[b]
                    let pixels = block.pixels
                    if (pixels) {
                        let data: ImageData = ctx.createImageData(10, 10)
                        for(let i = 0; i < 100; i++) {
                            let color = parseInt(pixels.substr(2 + i * 6, 6), 16)
                            data.data.set([Math.floor(color / 65536), Math.floor((color % 65536) / 256), color % 256, 255], i * 4)
                        }
                        ctx.putImageData(data, (b % 100) * 10, Math.floor(b / 100) * 10)
                    }
                }
            }
        })
        
        let root = document.getElementById("selectionArea")
        if (root) {
            root.onmousedown = function (e) {
                if (self.image && !self.selected) {
                    e.preventDefault()
                    self.blockNumbers = []
                    self.pixels = []
                    self.selected = false
                    self.selecting = true
                    self.startSelectX = Math.floor((e.pageX - (root?.offsetLeft || 0)) / 10)
                    self.startSelectY = Math.floor((e.pageY - (root?.offsetTop || 0)) / 10)
                    self.endSelectX = self.startSelectX
                    self.endSelectY = self.startSelectY
                }
            }

            root.onmousemove = function (e) {
                if (self.selecting) {
                    self.endSelectX = Math.floor((e.pageX - (root?.offsetLeft || 0)) / 10)
                    self.endSelectY = Math.floor((e.pageY - (root?.offsetTop || 0)) / 10)

                    if (self.image) {
                        let canvas = document.createElement("CANVAS") as HTMLCanvasElement
                        canvas.width = self.blockWidth * 10
                        canvas.height = self.blockHeight * 10
                        let ctx = canvas.getContext("2d") as CanvasRenderingContext2D
                        ctx.drawImage(self.image, 0, 0, canvas.width, canvas.height)

                        let preview = self.$refs.preview as HTMLImageElement
                        preview.src = canvas.toDataURL()
                    }
                }
                if (e.target === self.canvas) {
                    self.mouseBelowHalf = e.offsetY > 500
                    self.mx = e.offsetX < 1000 ? e.offsetX : 999
                    self.my = e.offsetY < 1000 ? e.offsetY : 999
                }
            }

            root.onmouseleave = function (e) {
                self.selecting = false
                self.mx = -1
                self.my = -1
            }

            root.onmouseup = async function (e) {
                if (self.selecting && self.image) {
                    self.selecting = false
                    e.preventDefault()

                    if (self.endSelectX < self.startSelectX) { [self.startSelectX, self.endSelectX] = [self.endSelectX, self.startSelectX] }
                    if (self.endSelectY < self.startSelectY) { [self.startSelectY, self.endSelectY] = [self.endSelectY, self.startSelectY] }

                    let canvas = document.createElement("CANVAS") as HTMLCanvasElement
                    canvas.width = self.blockWidth * 10
                    canvas.height = self.blockHeight * 10
                    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D
                    ctx.drawImage(self.image, 0, 0, canvas.width, canvas.height)
                    self.duplicateBlocks = 0
                    for (let x = 0; x < self.blockWidth; x++) {
                        for (let y = 0; y < self.blockHeight; y++) {
                            let data = ctx.getImageData(x * 10, y * 10, 10, 10).data.filter((e, i) => i % 4 < 3)
                            let hex = "0x" + [...data].map(x => x.toString(16).padStart(2, '0')).join('');
                            let blockNumber = (self.startSelectY + y) * 100 + self.startSelectX + x;
                            if (self.blocks[blockNumber].pixels != hex) {
                                self.blockNumbers.push(blockNumber)
                                self.pixels.push(hex)
                            } else {
                                self.url = self.blocks[blockNumber].url
                                self.description = self.blocks[blockNumber].description
                                console.log(self.url, self.blocks[blockNumber].url)
                                self.duplicateBlocks++
                            }
                        }
                    }

                    if (self.blockNumbers.length) {
                        self.selected = true

                        if (window.provider && self.pixel) {
                            self.cost = await self.pixel["getCost(uint256[])"](self.blockNumbers)

                            self.gas = BigNumber.from("0")
                            for (let i = 0; i <= Math.floor((self.blockNumbers.length - 1) / 25); i++) {
                                let blockNumbers = self.blockNumbers.slice(i * 25, (i + 1) * 25)
                                let pixels = self.pixels.slice(i * 25, (i + 1) * 25)
                                let cost = await self.pixel["getCost(uint256[])"](blockNumbers)
                                let gas = await self.pixel.estimateGas["setBlocks(uint256[],string,string,bytes[],address)"](blockNumbers, self.url, self.description, pixels, self.referrerClean || ethers.constants.AddressZero, { value: cost })
                                self.gas = self.gas.add(gas)
                            }

                            self.agentDo("Congratulate")
                        }
                    } else {
                        self.buying = false
                        self.image = null
                    }
                }
            }

            root.onclick = function (e) {
                if (self.image) {
                    e.preventDefault()
                } else if (e.target === self.canvas) {
                    if (!self.buying && self.tooltip && self.tooltipBlock) {
                        if (self.tooltipBlock.url) {
                            window.open(self.tooltipBlock.url, "_blank")
                        } else if (self.started && !self.locked && !self.wrongNetwork && self.info.address) {
                            self.buying = true
                        }
                    }
                }
            }
        }
    },
})
</script>
