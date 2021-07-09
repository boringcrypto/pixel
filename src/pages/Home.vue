<template>
    Balance: {{ pixelBalance.toString() }}<br>

    <div id="selectionArea" style="position: relative; width: 1000px; height: 1000px; background-color: white">
        <canvas id="canvas" width="1000" height="1000" />
        <img ref="preview" :style="selectionStyle" />
    </div>
    
    <div v-if="!image">
        <h3>Step 1. Upload an image</h3>
        <input type="file" id="imageLoader" name="imageLoader" />
    </div>
    <div v-if="image && !selected">
        <h3>Step 2. Select the area you'd like</h3>
        <p>Use your mouse to click and drag the area where you would like the image to go</p>
    </div>
    <div v-if="image && selected">
        <h3>Step 3. Purchase</h3>
        <p>
            Size: {{ blockWidth * 10 }}x{{ blockHeight * 10 }}<br>
            Cost: {{ cost }} MATIC<br>
            You will receive {{ blockWidth * blockHeight * 100 }} PIXEL tokens
        </p>
        <button @click="buy">Purchase</button>
    </div>

    <!-- hitwebcounter Code START -->
    <a href="https://www.hitwebcounter.com" target="_blank">
        <img
            src="https://hitwebcounter.com/counter/counter.php?page=7835616&style=0004&nbdigits=6&type=page&initCount=0"
            title="Free Counter"
            Alt="web counter"
            border="0"
        />
    </a>
</template>

<script lang="ts">
import {defineComponent, PropType} from "@vue/runtime-core"
import {ProviderInfo} from "../components/Web3.vue"
import * as PixelDeployment from "../../deployments/localhost/Pixel.json"
import {PixelFactory} from "../../types/ethers-contracts"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { utils } from "ethers"

type Block = {
    owner: string,
    lastPrice: BigNumberish,
    lastSold: number,
    url: string,
    description: string,
    pixels: string
}

export default defineComponent({
    name: "Home",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true,
        },
    },
    data(): { pixelBalance: BigNumberish, blocks: Block[], updateIndex: number, pixel: string, image: HTMLImageElement | null, canvas: HTMLCanvasElement | null, selecting: boolean, selected: boolean, startSelectX: number, startSelectY: number, endSelectX: number, endSelectY: number, blockNumbers: number[], pixels: string[], cost: number } {
        return {
            pixelBalance: 0,

            blocks: [],
            updateIndex: 0,

            pixel: "",
            image: null,
            canvas: null,

            selecting: false,
            selected: false,
            startSelectX: 0,
            startSelectY: 0,
            endSelectX: 0,
            endSelectY: 0,
            blockNumbers: [],
            pixels: [],
            cost: 0,
        }
    },
    created() {
        this.pixel = PixelDeployment.address
        for (let i = 0; i < 10000; i++) {
            this.blocks.push({
                owner: "",
                lastPrice: BigNumber.from(0),
                lastSold: 0,
                url: "",
                description: "",
                pixels: ""
            })
        }
    },
    computed: {
        selectionStyle() {
            let style = "position: absolute; background: blue; pointer-events: none;"
            style += this.selecting || this.selected ? "" : "display: none;"
            style += "left: " + this.startSelectX * 10 + "px;"
            style += "top: " + this.startSelectY * 10 + "px;"
            style += "width: " + (this.endSelectX - this.startSelectX + 1) * 10 + "px;"
            style += "height: " + (this.endSelectY - this.startSelectY + 1) * 10 + "px;"
            return style
        },
        blockWidth(): number { return this.endSelectX - this.startSelectX + 1 },
        blockHeight(): number { return this.endSelectY - this.startSelectY + 1 },
    },
    watch: {
        "info.block": async function() {
            console.log(this.info.block)
            let ctx = this.canvas?.getContext("2d")
            console.log(this.canvas, ctx)
            if (window.provider && this.info.address && ctx) {
                console.log(this.info.address)
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelFactory.connect(this.pixel, signer)
                this.pixelBalance = await p.balanceOf(this.info.address)

                let currentUpdatesCount = await p.updatesCount()
                if (currentUpdatesCount.toNumber() > this.updateIndex) {
                    let updates = [...new Set((await p.getUpdates(this.updateIndex)).map(bn => bn.toNumber()))]
                    let updatedBlocks = await p.getBlocks(updates)
                    updatedBlocks.forEach(block => {
                        this.blocks[block.number].owner = block.owner
                        this.blocks[block.number].lastPrice = block.lastPrice
                        this.blocks[block.number].lastSold = block.lastSold
                        this.blocks[block.number].url = block.url
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
            }
        }
    },
    methods: {
        async buy() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = PixelFactory.connect(this.pixel, signer)
                let cost = await p["getCost(uint256[])"](this.blockNumbers)
                p["setBlocks(uint256[],string,string,bytes[])"](this.blockNumbers, "https://pixel.inc", "Pixel Inc!", this.pixels, { value: cost })
            }
        },
        setup_image_loader() {
            const self = this
            let imageLoader = document.getElementById("imageLoader") as HTMLInputElement
            imageLoader.onchange = function (e) {
                var reader = new FileReader()
                reader.onload = function (event) {
                    self.image = new Image()
                    self.image.src = event.target?.result as string
                    let preview = self.$refs.preview as HTMLImageElement
                    preview.src = event.target?.result as string
                }
                const target = e.target as HTMLInputElement
                if (target.files?.length) {
                    reader.readAsDataURL(target.files[0])
                }
            }
        }
    },
    mounted() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement
        const self = this
        this.setup_image_loader()
        
        let root = document.getElementById("selectionArea")
        if (root) {
            root.onmousedown = function (e) {
                if (self.image) {
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
            }

            root.onmouseleave = function (e) {
                self.selecting = false
                console.log("mouseleave")
            }

            root.onmouseup = async function (e) {
                if (self.selecting && self.image) {
                    self.selecting = false
                    self.selected = true
                    e.preventDefault()

                    let canvas = document.createElement("CANVAS") as HTMLCanvasElement
                    canvas.width = self.blockWidth * 10
                    canvas.height = self.blockHeight * 10
                    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D
                    ctx.drawImage(self.image, 0, 0, canvas.width, canvas.height)
                    for (let x = 0; x < self.blockWidth; x++) {
                        for (let y = 0; y < self.blockHeight; y++) {
                            self.pixel = PixelDeployment.address
                            let data = ctx.getImageData(x * 10, y * 10, 10, 10).data.filter((e, i) => i % 4 < 3)
                            let hex = "0x" + [...data].map(x => x.toString(16).padStart(2, '0')).join('');
                            self.blockNumbers.push((self.startSelectY + y) * 100 + self.startSelectX + x)
                            self.pixels.push(hex)
                        }
                    }

                    if (window.provider) {
                        const signer = window.provider?.getSigner(self.info.address)
                        let p = PixelFactory.connect(self.pixel, signer)
                        self.cost = (await p["getCost(uint256[])"](self.blockNumbers)).div("10000000000000000").toNumber() / 100
                    }
                }
            }

            root.onclick = function (e) {
                if (self.image) {
                    e.preventDefault()
                }
            }
        }
    },
})
</script>
