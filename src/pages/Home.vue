<template>
    <table style="width: 1004px; margin: auto; border-spacing: 0;">
        <tr>
            <td style="text-align: left; vertical-align: top">
                <PixelLogo />
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
                <table style="margin-left: auto;">
                    <tbody>
                        <tr>
                            <td style="border: 3px ridge; padding: 4px;">PIXEL pool</td>
                            <td style="border: 3px ridge; padding: 4px;">{{ pool.print(18, 0) }} ETH</td>
                        </tr>
                        <tr v-if="info.address">
                            <td style="border: 3px ridge; padding: 4px;">Your share</td>
                            <td style="border: 3px ridge; padding: 4px;">{{ share.print(18, 0) }} ETH</td>
                        </tr>
                    </tbody>
                </table>
                <span v-if="!share.isZero()">
                    <button @click="redeem">Redeem</button><br>
                    Redeeming will burn your {{ data.userInfo.balance.print(18, 0) }} PIXEL tokens permanently
                </span>
            </td>
        </tr>
    </table>

    <SelectionArea :image="image" :select="buyState == BuyState.DrawArea" @select="areaSelected" style="position: relative; width: 1000px; height: 1000px; background-color: rgb(40, 95, 170); border: 1px solid rgb(169, 216,235); margin-left: auto; margin-right: auto;">
        <canvas id="canvas" width="1000" height="1000" @click="click" @mousemove="mousemove" @mouseleave="mouseleave" style="cursor: pointer;" />
        <Tooltip v-if="buyState != BuyState.SelectImage" ref="tooltip" :info="info" :data="data" :mx="mx" :my="my" />
        <Loading v-if="data.loading" />

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
                    Pixel cost: {{ order.cost.print(18, 0) }} ETH<br>
                    Gas costs (est): {{ order.gas.mul(order.gasPrice).print(18, 0)}} ETH ({{ order.gasPrice.print(9, 0) }} gwei)<br>
                    You will receive {{ (order.width * order.height - order.duplicateBlocks) * 100 }} PIXEL tokens
                    <span v-if="order.duplicateBlocks"><br>{{ order.duplicateBlocks * 100 }} duplicate pixels found, ignored</span>
                    <span v-if="order.width * order.height - order.duplicateBlocks > 25">
                        <br><br>
                        You selected a large area and this purchase might be split into multiple transactions. If any of the transactions fail, you can simply redo it with the same image and the same area. Any blocks of pixels already succesfully bought will be ignored (not bought again).
                    </span>
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
            <td colspan="2">
                Price: {{ price.print(18, 0) }} ETH
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
                    <button @click="buyCanvas">Buy</button>
                </span>
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top; padding-top: 20px">
                <div style="text-align: left; vertical-align: top; padding-top: 10px;">
                    <SocialButtons></SocialButtons>
                </div>
            </td>
            <td style="vertical-align: top; padding-top: 20px">
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
    <Admin v-if="info.address.toLowerCase() == '0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E'.toLowerCase()" :info="info" :data="data" :updateIndex="data.updateIndex" :version="data.version" />
</template>

<script lang="ts">
// Hi there! Thanks for reading the code... it's a mess, put together quickly. Enjoy and good luck!
// - BoringCrypto (https://twitter.com/Boring_Crypto)

import {defineComponent, PropType } from "@vue/runtime-core"
import { ProviderInfo } from "../classes/ProviderInfo"
import { CanvasFactory, PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { nextTick } from "process"
import { BigNumber, ethers } from "ethers"
import { constants } from "../constants/development"
import { playSound, randomItem } from "../classes/Utils"
import { PixelsToImageData } from "../classes/Blocks"
import { LocalData } from "../classes/LocalData"
import { Order, SelectedArea } from "../classes/Order"

import Countdown from "../components/Countdown.vue"
import PixelLogo from "../components/PixelLogo.vue"
import SocialButtons from "../components/SocialButtons.vue"
import BlocksStats from "../components/BlocksStats.vue"
import DropTarget from "../components/DropTarget.vue"
import AmbassadorProgram from "../components/AmbassadorProgram.vue"
import Leaderboard from "../components/Leaderboard.vue"
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
        Admin,
        SelectionArea,
        Tooltip,
        Loading
    },
    data() {
        return {
            BuyState,

            data: new LocalData(),

            canvas: null as HTMLCanvasElement | null,
            image: null as HTMLImageElement | null,

            mouseBelowHalf: false,
            mx: -1,
            my: -1,

            buyState: BuyState.None,
            order: new Order(),

            price: BigNumber.from("0"),
            pool: BigNumber.from("0"),
            share: BigNumber.from("0")
        }
    },
    async created() {
        await this.data.load()
    },
    computed: {
        chainName() { return constants.network.chainName },
        contractAddress() { return constants.pixel },
        contractURL() { return constants.network.blockExplorerUrls[0] + 'address/' + constants.pixel + "#code" },
        wrongNetwork(): boolean { return this.info.chainId != constants.chainId },
        referrerClean(): string { return this.referrer?.toLowerCase() != this.info.address.toLowerCase() ? this.referrer || ethers.constants.AddressZero : ethers.constants.AddressZero }
    },
    watch: {
        'info.address': function() {
            this.newBlock()
        },
        'info.block': function() {
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
            if (window.provider) {
                this.order = new Order()
                let pixel = PixelV2Factory.connect(constants.pixel, window.provider)
                await this.order.create(area, this.data, pixel)
                if (this.order.cost.gt("0")) {
                    this.buyState = BuyState.Buy
                    this.image = null
                } else {
                    this.buyState = BuyState.None
                }
            }
        },
        async switchToNetwork() {
            await window.ethereum.request({method: 'wallet_addEthereumChain', params: [constants.network]})
        },
        drawBlocks(blocks: number[]) {
            let ctx = this.canvas?.getContext("2d")
            blocks.forEach(blockNumber => {
                let block = this.data.blocks[blockNumber]
                ctx!.putImageData(PixelsToImageData(ctx!, this.data.datas[block.pixels]), (blockNumber % 100) * 10, Math.floor(blockNumber / 100) * 10)
            })
        },
        async newBlock() {
            let ctx = this.canvas?.getContext("2d")
            if (ctx && window.provider) {
                console.log("Polling for new data")

                let pixel = PixelV2Factory.connect(constants.pixel, window.provider)
                await this.data.update(pixel, this.info.address, this.drawBlocks)

                console.log("canvas", constants.canvas)
                let canvas = CanvasFactory.connect(constants.canvas, window.provider)
                let info = await canvas.poll(this.info.address)
                console.log(info)
                this.price = info.price_
                this.pool = info.pool
                this.share = info.share
            }
        },
        async buy() {
            this.image = null
            this.buyState = BuyState.None
            if (window.provider) {
                let pixel = PixelV2Factory.connect(constants.pixel, window.provider)
                this.order.buy(pixel, window.provider, this.data, this.info, this.referrerClean, this.drawBlocks)
            }
        },
        async buyCanvas() {
            if (window.provider) {
                let canvas = CanvasFactory.connect(constants.canvas, window.provider.getSigner(this.info.address))
                await canvas.buy({
                    value: this.price
                })
            }
        },
        async redeem() {
            if (window.provider) {
                let pixel = PixelV2Factory.connect(constants.pixel, window.provider.getSigner(this.info.address))
                let canvas = CanvasFactory.connect(constants.canvas, window.provider.getSigner(this.info.address))
                let allowance = await pixel.allowance(this.info.address, canvas.address)
                let amount = this.data.userInfo.balance
                if (allowance.lt(amount)) {
                    await pixel.approve(canvas.address, amount)
                }
                await canvas.redeem(amount)
            }
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
                console.log("Drawing")
                for (let b = 0; b < 10000; b++) {
                    if (this.data.blocks[b].pixels) {
                        ctx.putImageData(PixelsToImageData(ctx, this.data.datas[this.data.blocks[b].pixels]), (b % 100) * 10, Math.floor(b / 100) * 10)
                    }
                }
            }
            let app = document.getElementById("app")
            if (app) {
                app.style.display = "block";
            }
            let splash = document.getElementById("splash")
            if (splash) {
                splash.style.display = "none";
            }

            playSound('/' + randomItem(["win95", "winxp"]) + '.mp3')
        })
    }
})
</script>
