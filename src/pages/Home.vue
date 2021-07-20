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
                <img alt="Pixel Inc Logo" src="../assets/pixelIncLogo.png" height="100" /><br>
                An experiment in collaborative 'art'<br>
                and a tribute to web design of the past.<br>
                <a href="https://boringcrypto.medium.com/pixel-inc-artvertising-nft-1c1ddaa16f32" style="color: #ddd">What is this?!?</a>
            </td>
            <td v-if="started && !locked" style="vertical-align: bottom">
                <button v-if="wrongNetwork" @click="switchToNetwork" class="upload-button">Switch to {{ chainName }}</button>
                <button v-if="!wrongNetwork && !info.address" @click="info.connect" class="upload-button">Connect Metamask</button>
                <button v-if="!wrongNetwork && info.address" @click="buying = true" class="upload-button">Upload your own pixels</button>
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
                <span v-if="started">
                    <span v-if="!locked">
                        <strong>Creation Phase</strong><br>
                        ends in  <Countdown :goal="lockTimeStamp" /><br>
                        {{ blocksUsed / 100 }}% owned, {{ blocksLvl2 / 100 }}% lvl2, {{ blocksLvl3 / 100 }}% lvl3, {{ blocksLvl4 / 100 }}% lvl4
                    </span>
                    <span v-else>
                        <strong>Canvas NFT Phase</strong><br>
                        The canvas is now locked.
                    </span>
                </span>
                <span v-else-if="startTimeStamp">
                    <strong>Creation Phase</strong><br>
                    starting in <Countdown :goal="startTimeStamp" />
                </span>
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
                <div style="width: 480px; background-color: #ccc; color: black; border: 1px solid rgb(169, 216,235);">
                    <img src="../assets/ambassador.svg" style="height: 160px; margin: -24px" /><br>
                    <table v-if="pollInfo" style="width: 440px; margin: auto" class="blueTable">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Payout</th>
                            <th>Lemmings</th>
                            <th>Earnings</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Tier 1</td>
                            <td style="text-align: right">20%</td>
                            <td style="text-align: right">{{ pollInfo.downline.tier1 }}</td>
                            <td style="text-align: right">{{ pollInfo.downline.earnings1.print(18, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Tier 2</td>
                            <td style="text-align: right">10%</td>
                            <td style="text-align: right">{{ pollInfo.downline.tier2 }}</td>
                            <td style="text-align: right">{{ pollInfo.downline.earnings2.print(18, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Tier 3</td>
                            <td style="text-align: right">5%</td>
                            <td style="text-align: right">{{ pollInfo.downline.tier3 }}</td>
                            <td style="text-align: right">{{ pollInfo.downline.earnings3.print(18, 2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                    Your ambassador link:<br>
                    https://pixel.inc/?ref={{ info.address }}<br>
                    <br>
                </div>
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
    <div v-if="info.address.toLowerCase() == '0xeC393ccCF2Adf142F606a03F3350C8f59176c9CC'.toLowerCase()">
        <hr>
        Admin<br>
        Edit mode: {{ edit ? 'ON' : 'OFF'}}<br>
        <button @click="withdraw">Withdraw MATIC</button>
        <button @click="mint">Mint CANVAS NFT</button>
        <button @click="edit=!edit">Edit mode</button>
        <button @click="logBlocks">Log cache</button>
        <button @click="reload">Reload</button>
        <button @click="getInfo">Info</button><br>
    </div>
    <Clippy @loaded="clippyLoaded"></Clippy>
</template>

<script lang="ts">
// Hi there! Thanks for reading the code... it's a mess, put together quickly. Enjoy and good luck!
// - BoringCrypto (https://twitter.com/Boring_Crypto)

import {defineComponent, PropType, ref} from "@vue/runtime-core"
import {ProviderInfo} from "../components/Web3.vue"
import * as Cache from "../cache.json"
//import * as Snapshot from "../snapshot.json"
import { PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { Block, PollInfo } from "../types"
import { nextTick } from "process"
import Decimal from "decimal.js-light"
import { ethers } from "ethers"
import { constants } from "../constants/live"
// @ts-ignore
import Countdown from "../components/Countdown.vue"
import DropTarget from "../components/DropTarget.vue"
import Leaderboard from "../components/Leaderboard.vue"
import Clippy, { ClippyAgent } from "../components/Clippy.vue"
import { MaticProvider } from "../classes/MaticProvider"

declare module "decimal.js-light" {
    interface Decimal {
        toInt(decimals: number): BigNumber
    }
}

declare module "@ethersproject/bignumber" {
    interface BigNumber {
        toDec(divisor: number): Decimal
        print(divisor: number, decimals: number): string
    }
}

declare class CompressionStream {
    constructor(encoding: string)
    writable: any
    readable: any
}

declare class DecompressionStream {
    constructor(encoding: string)
    writable: any
    readable: any
}

Decimal.config({ precision: 36 })
Decimal.config({ toExpNeg: -1000 })
Decimal.config({ toExpPos: 1000 })
Decimal.prototype.toInt = function (decimals: number) {
    return BigNumber.from(this.times(new Decimal("10").pow(decimals)).todp(0).toString())
}

BigNumber.prototype.toDec = function (divisor: number) {
    return new Decimal(this.toString()).dividedBy(new Decimal("10").toPower(divisor));
}

// Returns a string where the value is divided by 10^divisor and cut off to decimalPlaces decimal places
// Pass in sep to change the decimal point. No rounding done at the moment.
BigNumber.prototype.print = function (divisor, decimals) {
    let powDivisor = new Decimal(10).toPower(divisor);
    //Scale the number down by divisor
    let x = new Decimal(this.toString());
    x = x.dividedBy(powDivisor);
    if (x.decimalPlaces() - x.precision(0) > decimals - 4) {
        return x.toSignificantDigits(4).toFixed();
    }
    else {
        return x.toFixed(decimals);
    }
}

function cleanURI(uri: string) {
    if (!uri) { return "" }
    let a = document.createElement("A") as HTMLAnchorElement
    if (!uri.startsWith("http:") && !uri.startsWith("https:")) {
        uri = "http://" + uri
    }
    a.href = uri
    if (a.protocol == 'http:' || a.protocol == 'https:') {
        return a.href
    }
    console.log("Bad url", uri)
    return "<invalid URL>"
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
        DropTarget,
        Leaderboard,
        Clippy
    },
    setup() {
        let matic = null as MaticProvider | null
        let pixel = null as PixelV2 | null
        return {
            matic,
            pixel
        }
    },
    data() {
        return {
            loading: false,
            startTimeStamp: 0,
            lockTimeStamp: 0,

            blocks: [] as Block[],
            pollInfo: null as PollInfo | null,
            updateIndex: 0,
            version: 0,

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
        if (dataStr && DecompressionStream) {
            let dataNum = []
            for (var i = 0; i < dataStr.length; i++) {
                dataNum.push(dataStr.charCodeAt(i));
            }
            const cs = new DecompressionStream("gzip");
            const writer = cs.writable.getWriter();
            writer.write(Uint8Array.from(dataNum));
            writer.close();
            let result = new TextDecoder().decode(await new Response(cs.readable).arrayBuffer())
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

        if (!this.blocks.length) {
            for (let i = 0; i < 10000; i++) { this.blocks.push({owner: "", lastPrice: 0, url: "", description: "", pixels: "" }) }
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
        tooltip(): boolean { return this.mx != -1 && !this.buying },
        tooltipBlock(): Block | null { return this.tooltip && this.blocks.length == 10000 ? this.blocks[Math.floor(this.my / 10) * 100 + Math.floor(this.mx / 10)] : null},
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
        blocksUsed(): number { return this.blocks.filter(b => b.owner).length },
        blocksLvl2(): number { return this.blocks.filter(b => b.lastPrice >= 20).length },
        blocksLvl3(): number { return this.blocks.filter(b => b.lastPrice >= 40).length },
        blocksLvl4(): number { return this.blocks.filter(b => b.lastPrice >= 80).length }
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

                var myAudio = document.createElement('audio');
                if (myAudio.canPlayType('audio/mpeg')) {
                    myAudio.setAttribute('src','/' + ["win95", "winxp"][Math.floor(Math.random() * 2)] + '.mp3');
                }
                myAudio.volume = 0.3
                myAudio.play();                

                window.setTimeout(() => {
                    this.clippy!.show()
                    this.clippy!.speak("Welcome to Pixel Inc!")
                }, 2500)
            }, 1000)
        },

/*        async upload() {
            let wallet = ethers.Wallet.fromMnemonic(this.mnemonic)
            wallet = wallet.connect(this.matic)
            let p = PixelV2Factory.connect(constants.pixel, wallet)
            let i = 0;
            Snapshot.blocks.splice(0, i)
            while (Snapshot.blocks.length) {
                let blocks = Snapshot.blocks.splice(0, 20)
                let result = 0
                while(result == 0) {
                    console.log(result, blocks.map((b, j) => i + j))
                    let tx = await p.initBlocks(
                        blocks.map((b, j) => i + j),
                        blocks.map(b => b.url),
                        blocks.map(b => b.description),
                        blocks.map(b => b.pixels),
                        blocks.map(b => BigNumber.from(b.lastPrice).mul("1000000000000000000")),
                        blocks.map(b => b.owner),
                        {
                            gasPrice: 11100000000,
                            //gasLimit: 12000000
                        }
                    )
                    result = (await tx.wait()).status || 0
                    console.log("Result", result)
                    if (result == 0) {
                        console.log("Error, sleeping 1 minute")
                        await sleep(60000)
                    }
                }
                i = i + blocks.length
            }
        },*/
        async getInfo() {
            let allUsers = ["0x0000000000000000000000000000000000000000","0x30a0911731f6ec80c87c4b99f27c254639a3abcd","0xa30b98148ef97b6f6dcd911b129c7dd68c0b09ff","0xc858dd4f2a80a859d491a16beee6708a6743bfb7","0x092471cffe4b941c896bfec001fe8bcc73a991d9","0x57d9b1e86a1f4a0b76bec742f8e9e6f70650e6b0","0xf58aa8e0832deac36550296dc92fc091d5de2b7d","0x5ba8be640c84e294bd7285b4d7a676ed8e1ff2ec","0x5b7dcb8ce882f3d4c953c9f9d79e08730efe4939","0x8f54c8c2df62c94772ac14ccfc85603742976312","0x65204c0183b29778d2b19513930ed8bdfdf044c0","0xb2f6be1d6c18514eabdc352b97b63273608af8fe","0xa03dee508d09ba9401a661f154036b36328e0f0c","0xa8ec58dd533e0cf82ec417bca3c4dbca48ae5a8b","0x1e4135cf6e2b9feebd52c6e90817fb19cfe294b9","0x00a5af2d7da07df76073a6f478f0fb4942d2659a","0x0d35324061f620f66af983dee02076b2e45e57fc","0x5b52bf12e7d8737ed61f06147fc655514679ce72","0xb11a0ce3a6ea30d8aa906e0f84eb92be8af5afcb","0x4cb1a8bb524ec318aaad1c63ca51b2189df00560","0x0f278c56b52b4c0e2a69b30a0b591d237c783907","0x1beea90d1ceab31919b4197409cef9373e7b2c11","0x9e6e344f94305d36ea59912b0911fe2c9149ed3e","0x7bf4d5e579a26dd09f1dddb2391566e7ba575b5b","0xf07504a96601b35dd702b07ecc57b2b169866f57","0xaf1ca20615f84c48782f2f23b3cc737db9c3514c","0xc61a2bb414a41ce492a94b5f59f5fd72f3a71c97","0x7f3d32c56b94a9b7878fdfac4f40aaa2a6e11edf","0x256d49d87cbb877d26e2bcf2bf0a40d26bdfb5d4","0xa03d1648be58e6957c81c1c201236e189b6ee6af","0x2b19fde5d7377b48be50a5d0a78398a496e8b15c","0x1ef5526ee1a6d8c596cce90e774a2c41372cc8cd","0x62c04cc455520708958c9ce3fafff51745e42189","0xc962ba9a1a45b79c1228636db5a6efa4a4b75d76","0x62b979923922045fb5a77bed9e0753941b1da52c","0x84e5bc3df0df0f543648f250443c6f4077218312","0xebaca45c63ba3981b083064a8dcf5d2999430bd6","0x72e30bd8d69311fad86dcb8c7edf46294b432343","0xed3c50209648e2b4794d47b0973e2b95e6b756ce","0x3185fd8f4578f746441eff27cebce89480904c20","0x528d4e4e0dbf071ec23013f06d8487bad5a8a68b","0x206971261b391763458134212feeab2360874676","0xdf547eab8944d9ef06475df8eee372b9808f425e","0xc847a016ed0a023196eeb641cf13a93ce3c82b6b","0xb4a3f907ec1611f22543219ae9bb33ec5e96e116","0x81f185cb71a4b98777a5ee50ca55e80608db61c1","0xdb6f1920a889355780af7570773609bd8cb1f498","0x29a4ea26ac9eed2fbdcd649cfd707948b18f4c67","0x9a568bfeb8cb19e4bafcb57ee69498d57d9591ca","0x0f85a912448279111694f4ba4f85dc641c54b594","0x157b6c44f47ecd30c0a2c428a6f35dbc606aa81b","0x51c25230335472236853676290062c8c7a0825b6","0xc70c99c1485eccc693e434433edbf5c27f937499","0x0655e4deaa64b4c6da6b68db283934a15d9afc8d","0x3c0a3d1994c567fd4bf17dc5858ec84ff1f87501","0x05f0ba0f63b401bc9b86089265cee2f79c955768","0x91b12c04ba95cede8e7cdd1a17d961cbdfd2e00b","0x592f1a037eb4cbe529e80ca0f855525e13993380","0x3d9b0a7ef1cceada457001a6d51f28ff61e39904","0x58a5d0d2d5cda76806f48a3b255d2b0238f965c5","0x01485557c2bc6e26c7187ff4cc38d5d9474405d4","0x6da4f80adac622571b9008b8529c240933d1a8d9","0x7bd8a74a0b06fa03a9c2275f58081a7ccf549f16","0x897656b1fb6c3688e48e1dd8259f7e092364754d","0x862c6f0373ac129fc66a324b234943139ca10c92","0x8591656bb9f1e1e66806a465572bdd1982c25761","0xc9fd84728f98df2820896db89d7d47ac9998228c","0x79b1a32ec97537486e75d99850bd56ecfa09d643","0xa0bf4e5640e5db6fa82967d2c160e35a9a28ae83","0xe61a0809ef3f1d2d695555413ac354284bf23915","0x218d75b17f491793a96ab4326c7875950359a80c","0x315388deb1608bdcf532ce0bf6fc130542f5132c","0xe9f654994f1135ebfab3183f50603da5c6abd4c3","0xbf2116d0a79da0e5710df8ab00eb20415bca94c8","0x131ee3be2e3803bf9e8976ddf0306236f001b7f2","0xd264da372aefcd5269ca212bfd3c56e8e95bccca","0x25c89a394e37268c33628bd3cc54908b5f8d1bd5","0xfd5a25ef7396384c2d43645f32609bc869c36208","0x54d925f320400139f9f2925767f1ec68b027e7c0","0xce3c9e357425c99cc27dc9bf963d06e739811465","0xf1228c34651348f12d05d138896dc6d2e946f970","0x069e85d4f1010dd961897dc8c095fbb5ff297434","0xa2db5f9313a553f572fa44aa1ba5b5871ed68406","0xb3160404ca9581784b3dec9e85bcd354397b8c72","0x1f427a6fcdb95a7393c58552093e10a932890fa8","0x43d20d5efa78ff0e465dda2e58109f9fb3a2bece","0xb9956c74639d8e11c64d8005dc0c2262945af074","0xf82a5d0168cc93e63dc217314adb87f15891d124","0xc572c95996653ae98ec3a59d9a511eda142b98c1","0x8fb07b21383d331f3752a7590b0cfeac85514a1f","0x0b981d98e857c888e00d2c494d24dc16a12f8f3a","0xe744048f7d1b63b4e233a1d63c3153b913d7a2cc","0xd6e371526cdaee04cd8af225d42e37bc14688d9e","0x7a4a8f7b3707ecc86b50cae33f83edc5f8c8f57e","0x000000000000000000000000000000000000dead","0x070ae2385dedc927f821e75434e881ca5fd549fb","0x41381649b2231cafc8293f501bb3df422aeba5e4","0xb5ede9893fccd62a110fd9d0cce5c89418a8540b","0x357dfdc34f93388059d2eb09996d80f233037cba","0xbf912cb4d1c3f93e51622fae0bfa28be1b4b6c6c","0x496ea957960bf9a2bbc1d3c114eaa124e07d0543","0xc16414ac1fedfdac4f8a09674d994e1bbb9d7113","0x4ef416aa741053b5f3968900379df2e3d0229065","0x9efb6d49fd5496626e80ad0b07017744ae9a0efa","0xc53f5a27021455293aa34da308280abc4cad210a","0x3d343914eb418f465401e617a19cc9dd072922e7","0x94e169525d86df638cc51d801eac8d60275a8047","0x835f394f3d770b6ff818303f045e39f541b3d781","0x28c24f2da9b6e517968300eb1a4f4ae1b235238e","0x1200b4a3a90dcdc504443130572e840c988ec13c","0x826a471055333505e596f424348983af0aa8411b","0xbcc1a3455bfe501cd163c3f1ae85e038253f252e","0x5e190617c7cfb30c3c87dd55920e117280d3f8e6","0x2493c86b62e8ff26208399144817ef2898c59460","0x9f7f67699b6b35ee2c37e3c9be43e437e2fa4bf7","0xe0878a84505a33e0bece816f8d70a0c635caef00","0xe5625a6ee4908f67b7024849daf95f8fadcb89d5","0x36568dd8a7c4b33cb21bdfe595329133defdf7c4","0xb96863b5a9bb3783c5ba0665e4382b766746d6fa","0x4757b9dfc3b8b685dd227b0b4104b1ca762f18b0","0xe0d62cc9233c7e2f1f23fe8c77d6b4d1a265d7cd","0x404e35fdb39afdb77d8ea5b63becd6a5ad50a6de","0x7d3ec4757f309afbea6a5df0daf504698f668827","0x1b02da8cb0d097eb8d57a175b88c7d8b47997506","0x4fd95c6fa765e64ec9313e465f4d2b88cbf8deaa","0x66ab3988d11b493cbe632c7d4471a68350a786e9","0x27883c6bd1aed855d020fa587ae6d841adf0391d","0xfedcbda26763ef4660d5204f4252f2a9b1276d4a","0x251794fb2875c1f735c2983af79bdea28a81309b","0x201b5abfd44a8f9b75f0fe1bae74cdac7675e54b","0xce3c49dc6e0ee03cbd5fab568cc638f09ac4a7d7","0x97a2f4fa661c1898678cfb5c77b1cdc22816076b","0x6b9c944deb574ed6f2a5b6b3e6c25165535b71da","0xeee9d784839ea8112ce3507e8df2466c74b833fb","0x41c3687f22c4f8227a9f42906909d77b0b43ff6a","0xad2074361fc5a7d392b4b7b5b97b8c0a9ec3a1ed","0x235b5ac21ee516410300dec89f9ed413cb5d948c","0xb3d1e41f84acd0e77f83473aa62fc8560c2a3c0c","0x22d16ed158722107f9b22b7346a65e193717c9e8","0x9d0b92468ef23d156f1bd5042fe0b45c80a4418e","0xa9f078b3b6dd6c04308f19def394b6d5a1b8b732","0x01c2bf2f59215a1acae7b485aa82a582d31fd613","0x012550d59ae4e7938830fa13c5d5791752adc4a5","0x8469032c8b6f94e95c0659a9a3a34de959999999","0x00e13f97e1980126cbe90f21b9c1b853878031dd","0xb17524239b58963cf2d9b9a7a92d4efae3df1a3e","0x53033c9697339942256845dd4d428085ec7261b8","0x3c5aac016ef2f178e8699d6208796a2d67557fe2"]
            console.log("All:", allUsers.length);

            if (this.pixel) {
                for (let i = 0; i < allUsers.length; i++) {
                    let user = allUsers[i]
                    let upline = await this.pixel.upline(user)
                    if (upline != "0x0000000000000000000000000000000000000000") {
                        console.log("_setUpline(" + ethers.utils.getAddress(user) + ", " + ethers.utils.getAddress(upline) + ");")
                    }
                    let downline = await this.pixel.downline(user)
                    if (!downline.earnings1.isZero() || !downline.earnings2.isZero() || !downline.earnings3.isZero() || downline.tier1 > 0 || downline.tier2 > 0 || downline.tier3 > 0) {
                        console.log(
                            "_setDownline(" + 
                                ethers.utils.getAddress(user) + ", " + 
                                downline.earnings1.toString() + ", " +
                                downline.earnings2.toString() + ", " +
                                downline.earnings3.toString() + ", " +
                                downline.tier1.toString() + ", " +
                                downline.tier2.toString() + ", " +
                                downline.tier3.toString() + ");"
                            )
                    }
                    await sleep(2500)
                }
            }
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
                        this.blocks[block.number].owner = block.owner
                        this.blocks[block.number].lastPrice = block.lastPrice.toDec(18).toNumber()
                        this.blocks[block.number].url = cleanURI(block.url)
                        this.blocks[block.number].description = block.description
                        this.blocks[block.number].pixels = block.pixels

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

                if (CompressionStream) {
                    const byteArray = new TextEncoder().encode(JSON.stringify({blocks: this.blocks, updateIndex: this.updateIndex, version: this.version}));
                    const cs = new CompressionStream("gzip");
                    const writer = cs.writable.getWriter();
                    writer.write(byteArray);
                    writer.close();
                    let compressed = await new Response(cs.readable).arrayBuffer();
                    localStorage.setItem("data", Array.from(new Uint8Array(compressed)).map(n => String.fromCharCode(n)).join(''))
                }
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
        async withdraw() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelV2Factory.connect(constants.pixel, signer)
                await p.withdraw(ethers.constants.AddressZero)
            }
        },
        async mint() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelV2Factory.connect(constants.pixel, signer)
                await p.mintCanvas()
            }
        },
        agentDo(action: string) {
            (this.$refs.clippy as typeof Clippy).play(action)
        },
        logBlocks() { 
            console.log(JSON.stringify({blocks: this.blocks, updateIndex: this.updateIndex, version: this.version + 1}))
        },
        reload() {
            let ctx = this.canvas?.getContext("2d")
            if (ctx) {
                localStorage.removeItem("data")
                this.blocks = []
                for (let i = 0; i < 10000; i++) { this.blocks.push({owner: "", lastPrice: 0, url: "", description: "", pixels: "" }) }
                this.updateIndex = 0
                this.version = 0
                ctx.clearRect(0, 0, 1000, 1000)
                this.newBlock()
            }
        }
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

            this.newBlock()
            /*this.pixel.on(this.pixel.filters.PixelBlockTransfer(null, null, null), (events) => {
                console.log("New block detected!", events)
                this.newBlock()
            })*/
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
