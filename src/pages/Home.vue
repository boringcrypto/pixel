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
        width: 250px;
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
    <table style="width: 1000px; margin: auto;">
        <tr>
            <td style="text-align: left; vertical-align: top">
                <img alt="Pixel Inc Logo" src="../assets/pixelIncLogo.png" height="100" /><br>
                An experiment in collaborative 'art'<br>
                and a tribute to web design of the past.
            </td>
            <td style="vertical-align: bottom">
                <button @click="buying = true" class="upload-button">Upload your own pixels</button>
            </td>
            <td style="text-align: right">
                <span v-if="info.chainId == 0">
                    Network not connected
                </span>
                <span v-else-if="wrongNetwork">
                    Wrong network <button @click="gotoPolygon">Switch to Mumbai</button>
                </span>
                <span v-else>
                    <strong>Your wallet address</strong><br>
                    {{ info.address }}
                </span>
                <br><br>
                <table style="margin-left: auto;">
                    <tbody>
                        <tr>
                            <td style="border: 3px ridge; padding: 4px;">Total PIXELs</td>
                            <td style="border: 3px ridge; padding: 4px;">{{ pixelTotalSupply.print(18, 0) }}</td>
                        </tr>
                        <tr>
                            <td style="border: 3px ridge; padding: 4px;">You own</td>
                            <td style="border: 3px ridge; padding: 4px;">{{ pixelBalance.print(18, 0) }}</td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <strong>Creation Phase</strong><br>
                ends in {{ lockDiffDays }} days {{ lockDiffHours }} hours {{ lockDiffMinutes }} min {{ lockDiffSeconds }} sec
            </td>
        </tr>
    </table>

    <div id="selectionArea" :style="'position: relative; width: 1000px; height: 1000px; background-color: rgb(40, 95, 170); border: 1px solid rgb(169, 216,235); margin-left: auto; margin-right: auto;' + (tooltip ? 'cursor: pointer' : '')">
        <canvas id="canvas" width="1000" height="1000" />
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
                <p class="status-bar-field">{{ (tooltipBlock?.lastPrice || 0) * 2 || 0.0001 }} MATIC per pixel</p>
                <p class="status-bar-field">{{ tooltipBlock?.owner ? "Owned" : "Unowned" }}</p>
            </div>
        </div>        
        <img ref="preview" :style="selectionStyle" />

        <div v-if="loading" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); max-width: 400px;">
            <div class="title-bar">
                <div class="title-bar-text">Loading...</div>
            </div>
            <div class="window-body">
                <img src="../assets/McHammer.gif" />
            </div>
        </div>

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
                <div id="drop_zone" @drop="dropHandler" @dragover="dragOverHandler" onclick="document.getElementById('fileInput').click()">
                    <img src="../assets/fileflip.gif" style="float: left; margin-left: 20px;" />
                    <br><br>
                    <p>Drag your image here or click to Browse...</p>
                </div>
                <input type="file" id="fileInput" @input="imageLoad" style="display: none" />
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

        <div v-if="image && selected" class="window" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%)">
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
                    Cost: {{ cost }} MATIC<br>
                    You will receive {{ (blockWidth * blockHeight - duplicateBlocks) * 100 }} PIXEL tokens
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

    <table style="width: 1000px; margin: auto;">
        <tr>
            <td style="text-align: left">
                <img src="../assets/catsheepnow.gif" height="80">
            </td>
            <td style="text-align: left">
                You are visitor:<br>
                <!-- Start of WebFreeCounter Code -->
                <a href="https://www.webfreecounter.com/" target="_blank"><img src="https://www.webfreecounter.com/hit.php?id=grofcnc&nd=6&style=11" border="0" alt="visitor counter"></a>
                <!-- End of WebFreeCounter Code -->    
            </td>
            <td>
                <img style="float: right" src="../assets/tom.jpg" height="80">
                <strong>Tom</strong><br>
                "All my friends love this site!"
            </td>
        </tr>
    </table>
    
    <div v-if="info.address.toLowerCase() == '0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E'.toLowerCase()">
        <hr>
        Admin<br>
        <button @click="withdraw">Withdraw MATIC</button>
        <button @click="mint">Mint CANVAS NFT</button>
    </div>

    <hr>
    <img src="../assets/underconstruction.gif">

</template>

<script lang="ts">
import {defineComponent, PropType} from "@vue/runtime-core"
import {ProviderInfo} from "../components/Web3.vue"
import * as PixelDeployment from "../../deployments/localhost/Pixel.json"
import * as Cache from "../cache.json"
import {PixelFactory} from "../../types/ethers-contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { nextTick } from "process"
import Decimal from "decimal.js-light"
import { ethers } from "ethers"

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

type Block = {
    owner: string,
    lastPrice: number,
    url: string,
    description: string,
    pixels: string
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

export default defineComponent({
    name: "Home",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true,
        },
    },
    data(): { 
            loading: boolean,
            lockTimeStamp: number, pixelBalance: BigNumber, pixelTotalSupply: BigNumber, blocks: Block[], updateIndex: number, pixel: string, 
            buying: boolean, image: HTMLImageElement | null, canvas: HTMLCanvasElement | null, mouseBelowHalf: boolean, mx: number, my: number,
            selecting: boolean, selected: boolean, startSelectX: number, startSelectY: number, endSelectX: number, endSelectY: number, 
            blockNumbers: number[], pixels: string[], cost: number, duplicateBlocks: number, url: string, description: string, now: number } {
        return {
            loading: false,
            lockTimeStamp: 0,
            pixelBalance: BigNumber.from(0),
            pixelTotalSupply: BigNumber.from(0),

            blocks: [],
            updateIndex: 0,

            pixel: "",
            canvas: null,

            mouseBelowHalf: false,
            mx: -1,
            my: -1,

            buying: false,
            image: null,
            selecting: false,
            selected: false,
            startSelectX: 0,
            startSelectY: 0,
            endSelectX: 0,
            endSelectY: 0,
            blockNumbers: [],
            pixels: [],
            cost: 0,
            duplicateBlocks: 0,
            url: "",
            description: "",
            now: Date.now(),
        }
    },
    async created() {
        //this.pixel = PixelDeployment.address
        this.pixel = "0x81DB9C598b3ebbdC92426422fc0A1d06E77195ec"
        setInterval(() => this.now = Date.now(), 1000);

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
        }

        if (this.updateIndex < Cache.updateIndex) {
            this.blocks = Cache.blocks
            this.updateIndex = Cache.updateIndex
        }

        if (!this.blocks.length) {
            for (let i = 0; i < 10000; i++) {
                this.blocks.push({
                    owner: "",
                    lastPrice: 0,
                    url: "",
                    description: "",
                    pixels: ""
                })
            }
        }
    },
    computed: {
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
        wrongNetwork(): boolean { return this.info.chainId != 80001 },
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
        lockDate(): Date | null { return this.lockTimeStamp ? new Date(this.lockTimeStamp * 1000) : null },
        locked(): boolean { return this.now > this.lockTimeStamp * 1000 ? true : false },
        lockDiff(): number { return this.lockDate ? this.lockDate.getTime() - this.now : 0 },
        lockDiffDays(): number { return Math.floor(this.lockDiff / (24 * 60 * 60 * 1000)) },
        lockDiffHours(): number { return Math.floor(this.lockDiff / (60 * 60 * 1000)) % 24 },
        lockDiffMinutes(): number { return Math.floor(this.lockDiff / (60 * 1000)) % 60 },
        lockDiffSeconds(): number { return Math.floor(this.lockDiff / (1000)) % 60 },
    },
    watch: {
        "info.block": async function() {
            console.log("Block", this.info.block)
            let ctx = this.canvas?.getContext("2d")
            if (window.provider && this.info.address && ctx) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelFactory.connect(this.pixel, signer)

                if (!this.lockTimeStamp) {
                    this.lockTimeStamp = (await p.lockTimestamp()).toNumber()
                }

                this.pixelBalance = await p.balanceOf(this.info.address)
                this.pixelTotalSupply = await p.totalSupply()

                let currentUpdatesCount = await p.updatesCount()
                while (currentUpdatesCount.toNumber() > this.updateIndex) {
                    console.log("Getting", this.updateIndex, currentUpdatesCount.toNumber())
                    let updates = [...new Set((await p.getUpdates(this.updateIndex, 1000)).map(bn => bn.toNumber()))]
                    this.updateIndex = currentUpdatesCount.toNumber() - this.updateIndex > 1000 ? this.updateIndex + 1000 : currentUpdatesCount.toNumber()
                    while (updates.length) {
                        console.log(updates.length, "left")
                        let updatedBlocks = await p.getBlocks(updates.splice(0, 200))
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
                        const byteArray = new TextEncoder().encode(JSON.stringify({blocks: this.blocks, updateIndex: this.updateIndex}));
                        const cs = new CompressionStream("gzip");
                        const writer = cs.writable.getWriter();
                        writer.write(byteArray);
                        writer.close();
                        let compressed = await new Response(cs.readable).arrayBuffer();
                        localStorage.setItem("data", Array.from(new Uint8Array(compressed)).map(n => String.fromCharCode(n)).join(''))
                    }
                }
            }
        }
    },
    methods: {
        async gotoPolygon() {
            let ethereum = window.ethereum;
            const data = [{
                chainId: "0x13881",
                chainName: 'Mumbai (Polygon Testnet)',
                nativeCurrency:
                    {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18
                    },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            }]
            const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data}).catch()
            if (tx) {
                console.log(tx)
            }
        },
        async buy() {
            this.image = null
            this.selected = false
            this.buying = false
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelFactory.connect(this.pixel, signer)
                for (let i = 0; i <= Math.floor((this.blockNumbers.length - 1) / 25); i++) {
                    let blockNumbers = this.blockNumbers.slice(i * 25, (i + 1) * 25)
                    let pixels = this.pixels.slice(i * 25, (i + 1) * 25)
                    let cost = await p["getCost(uint256[])"](blockNumbers)
                    p["setBlocks(uint256[],string,string,bytes[])"](blockNumbers, this.url, this.description, pixels, { value: cost, gasPrice: 1000000000 })
                }
            }
        },
        load(file: Blob) {
            const self = this
            var reader = new FileReader()
            reader.onload = function (event) {
                self.image = new Image()
                self.image.src = event.target?.result as string
                let preview = self.$refs.preview as HTMLImageElement
                preview.src = event.target?.result as string
            }
            reader.readAsDataURL(file)
        },
        imageLoad(e: Event) {
            const target = (e as InputEvent).target as HTMLInputElement
            if (target.files?.length) {
                this.load(target.files[0])
            }
        },
        dragOverHandler(ev: DragEvent) {
            ev.preventDefault();
        },
        dropHandler(ev: DragEvent) {
            ev.preventDefault();

            if (ev.dataTransfer?.items) {
                if (ev.dataTransfer.items[0].kind === 'file') {
                    var file = ev.dataTransfer.items[0].getAsFile();
                    if (file) {
                        this.load(file)
                    }
                }
            } else if (ev.dataTransfer) {
                this.load(ev.dataTransfer.files[0])
            }
        },
        async withdraw() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelFactory.connect(this.pixel, signer)
                await p.withdraw(ethers.constants.AddressZero)
            }
        },
        async mint() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelFactory.connect(this.pixel, signer)
                await p.mintCanvas()
            }
        },
    },
    mounted() {
        const self = this
        nextTick(() => {
            this.canvas = document.getElementById("canvas") as HTMLCanvasElement
            let ctx = this.canvas?.getContext("2d")
            let start = Date.now()
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
            console.log(Date.now() - start)
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
                            if (self.blocks[blockNumber].pixels != hex || self.blocks[blockNumber].owner.toLowerCase() != self.info.address.toLowerCase()) {
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

                        if (window.provider) {
                            const signer = window.provider?.getSigner(self.info.address)
                            let p = PixelFactory.connect(self.pixel, signer)
                            self.cost = (await p["getCost(uint256[])"](self.blockNumbers)).div("10000000000000000").toNumber() / 100
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
                    if (!self.buying && self.tooltip && self.tooltipBlock && self.tooltipBlock.url)
                    window.open(self.tooltipBlock.url, "_blank")
                }
            }
        }
    },
})
</script>
