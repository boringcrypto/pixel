<template>
    <table style="width: 1004px; margin: auto; border-spacing: 0;">
        <tr>
            <td style="text-align: left; vertical-align: top">
                <PixelLogo />
            </td>
            <td style="vertical-align: bottom">
                <div style="margin-left: auto; width: 340px; background-color: #ccc; color: black; border: 1px solid rgb(169, 216,235); margin-bottom: 8px; padding: 8px">
                    <a href="https://snapshot.org/#/pixelinc.eth/proposal/QmVxXwALTod3uvmiYLo4wXscLUyD38DKDP34s66ahP7uY8" target="_blank">
                        We're moving to Ethereum!
                    </a>
                    <p>
                        To move your PIXEL tokens to Ethereum mainnet, you can migrate them here. Once we launch on mainnet, the PIXEL tokens will be airdropped into your Ethereum wallet with the same address.
                    </p>
                    <span v-if="info.address && pollInfo && pollInfo.balance.gt(0)">
                        <button v-if="allowance.lt(pollInfo.balance)" @click="allow">
                            Allow
                        </button>
                        <button v-else @click="migrate">
                            Migrate {{ pollInfo.balance.print(18, 0) }} PIXEL tokens
                        </button>
                    </span>
                    <p v-if="migrateBalance.gt(0)">
                        In migration: {{ migrateBalance.print(18, 0) }} PIXEL
                    </p>
                </div>
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
                        <tr v-if="lpBalance.gt(0)">
                            <td style="border: 3px ridge; padding: 4px;">Staked LP</td>
                            <td style="border: 3px ridge; padding: 4px;">
                                {{ lpBalance.print(18, 0) }}&nbsp;
                                <button @click="unstake">Unstake</button>
                            </td>
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

    <SelectionArea :image="image" :select="buyState == BuyState.DrawArea" @select="areaSelected" style="position: relative; width: 1000px; height: 1000px; background-color: rgb(40, 95, 170); border: 1px solid rgb(169, 216,235); margin-left: auto; margin-right: auto;">
        <canvas id="canvas" width="1000" height="1000" @click="click" @mousemove="mousemove" @mouseleave="mouseleave" style="cursor: pointer;" />
        <Tooltip v-if="buyState != BuyState.SelectImage" ref="tooltip" :info="info" :blocks="blocks" :mx="mx" :my="my" />
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
    <Leaderboard :blocks="blocks" />
    <Admin v-if="info.address.toLowerCase() == '0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E'.toLowerCase()" :info="info" :pixel="pixel" :blocks="blocks" :updateIndex="updateIndex" :version="version" />
    <Clippy @loaded="clippyLoaded"></Clippy>
</template>

<script lang="ts">
// Hi there! Thanks for reading the code... it's a mess, put together quickly. Enjoy and good luck!
// - BoringCrypto (https://twitter.com/Boring_Crypto)

import {defineComponent, PropType } from "@vue/runtime-core"
import { ProviderInfo } from "../classes/ProviderInfo"
import * as Cache from "../cache.json"
import { MiniChefV2, MiniChefV2Factory, PixelMigrator, PixelMigratorFactory, PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { PollInfo } from "../types"
import { nextTick } from "process"
import { ethers } from "ethers"
import { constants } from "../constants/live"
import { sleep, playSound, randomItem, decompress, compress } from "../classes/Utils"
import { MaticProvider } from "../classes/MaticProvider"
import { Blocks, PixelsToImageData } from "../classes/Blocks"
import { Order, SelectedArea } from "../classes/Order"

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
            pixel: null as PixelV2 | null,
            migrator: null as PixelMigrator | null,
            minichef: null as MiniChefV2 | null
        }
    },
    data() {
        return {
            BuyState,
            loading: false,
            startTimeStamp: 0,
            lockTimeStamp: 0,

            pollInfo: null as PollInfo | null,
            updateIndex: 0,
            version: 0,

            blocks: Blocks.empty([]),
            canvas: null as HTMLCanvasElement | null,
            image: null as HTMLImageElement | null,

            mouseBelowHalf: false,
            mx: -1,
            my: -1,

            buyState: BuyState.None,
            order: new Order(),

            edit: false,

            mnemonic: "",
            clippy: null as ClippyAgent | null,

            allowance: BigNumber.from("0"),
            migrateBalance: BigNumber.from("0"),
            lpBalance: BigNumber.from("0")
        }
    },
    async created() {
        this.matic = new MaticProvider(constants.network.rpcUrls[0], () => {
            this.newBlock()
        })
        this.pixel = PixelV2Factory.connect(constants.pixel, this.matic.provider)
        this.migrator = PixelMigratorFactory.connect(constants.migrator, this.matic.provider)
        this.minichef = MiniChefV2Factory.connect(constants.minichef, this.matic.provider)

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
        wrongNetwork(): boolean { return this.info.chainId != constants.chainId },
        referrerClean(): string { return this.referrer?.toLowerCase() != this.info.address.toLowerCase() ? this.referrer || ethers.constants.AddressZero : ethers.constants.AddressZero },
    },
    watch: {
        'info.address': function() {
            this.newBlock()
        }
    },
    methods: {
        allow() {
            if (window.provider && this.pixel && this.migrator) {
                const signer = window.provider.getSigner(this.info.address)
                this.pixel.connect(signer).approve(this.migrator.address, ethers.constants.MaxUint256)
            }
        },
        migrate() {
            if (window.provider && this.pixel && this.migrator && this.pollInfo) {
                const signer = window.provider.getSigner(this.info.address)
                this.migrator.connect(signer).Migrate(this.pollInfo?.balance)
            }
        },
        unstake() {
            if (window.provider && this.minichef) {
                const signer = window.provider.getSigner(this.info.address)
                let minichef = this.minichef.connect(signer)
                minichef.withdrawAndHarvest(25, this.lpBalance, this.info.address)
            }
        },
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
                await this.order.create(area, this.blocks, this.pixel, window.provider)
                if (this.order.cost.gt("0")) {
                    this.buyState = BuyState.Buy
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

                if (this.migrator) {
                    this.allowance = await this.pixel.allowance(this.info.address, this.migrator.address)
                    this.migrateBalance = await this.migrator.deposited(this.info.address)
                }
                if (this.minichef) {
                    this.lpBalance = (await this.minichef.userInfo(25, this.info.address))[0]
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
                if (updates) {
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
                    let block = this.blocks[b]
                    let pixels = block.pixels
                    if (pixels) {
                        ctx.putImageData(PixelsToImageData(ctx, pixels), (b % 100) * 10, Math.floor(b / 100) * 10)
                    }
                }
            }
        })
    }
})
</script>
