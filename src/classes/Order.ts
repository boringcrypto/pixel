import { BigNumber, ethers } from "ethers"
import { Block } from "../types"
import { PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { ProviderInfo } from "../classes/ProviderInfo"

export interface SelectedArea {
    startX: number
    startY: number
    endX: number
    endY: number,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D
}

export class Order {
    width: number
    height: number
    blockNumbers: number[]
    pixels: string[]
    cost: BigNumber
    gas: BigNumber
    gasPrice: BigNumber
    duplicateBlocks: number
    url: string
    description: string
    
    constructor() {
        this.width = 0
        this.height = 0
        this.blockNumbers = []
        this.pixels = []
        this.cost = BigNumber.from(0)
        this.gas = BigNumber.from(0)
        this.gasPrice = BigNumber.from(0)
        this.duplicateBlocks = 0
        this.url = ""
        this.description = ""
    }

    async create(area: SelectedArea, blocks: Block[], pixel: PixelV2, provider: ethers.providers.JsonRpcProvider) {
        this.duplicateBlocks = 0
        this.width = area.width
        this.height = area.height
        for (let x = 0; x < area.width; x++) {
            for (let y = 0; y < area.height; y++) {
                let data = area.ctx.getImageData(x * 10, y * 10, 10, 10).data.filter((e, i) => i % 4 < 3)
                let hex = "0x" + [...data].map(x => x.toString(16).padStart(2, '0')).join('');
                let blockNumber = (area.startY + y) * 100 + area.startX + x;
                if (blocks[blockNumber].pixels != hex) {
                    this.blockNumbers.push(blockNumber)
                    this.pixels.push(hex)
                } else {
                    this.url = blocks[blockNumber].url
                    this.description = blocks[blockNumber].description
                    this.duplicateBlocks++
                }
            }
        }

        if (this.blockNumbers.length) {
            if (provider && pixel) {
                this.cost = await pixel["getCost(uint256[])"](this.blockNumbers)
            }
        }
    }

    async estimateGas(pixel: PixelV2, provider: ethers.providers.JsonRpcProvider, referrer: string) {
        this.gasPrice = await provider.getGasPrice()
        this.gas = BigNumber.from("0")
        for (let i = 0; i <= Math.floor((this.blockNumbers.length - 1) / 25); i++) {
            let blockNumbers = this.blockNumbers.slice(i * 25, (i + 1) * 25)
            let pixels = this.pixels.slice(i * 25, (i + 1) * 25)
            let cost = await pixel["getCost(uint256[])"](blockNumbers)
            let gas = await pixel.estimateGas["setBlocks(uint256[],string,string,bytes[],address)"](blockNumbers, this.url, this.description, pixels, referrer || ethers.constants.AddressZero, { value: cost })
            this.gas = this.gas.add(gas)
        }
    }

    async buy(pixel: PixelV2, provider: ethers.providers.JsonRpcProvider, info: ProviderInfo, referrer: string) {
        const signer = provider.getSigner(info.address)
        let p = PixelV2Factory.connect(pixel.address, signer)
        for (let i = 0; i <= Math.floor((this.blockNumbers.length - 1) / 25); i++) {
            let blockNumbers = this.blockNumbers.slice(i * 25, (i + 1) * 25)
            let pixels = this.pixels.slice(i * 25, (i + 1) * 25)
            let cost = await p["getCost(uint256[])"](blockNumbers)
            p["setBlocks(uint256[],string,string,bytes[],address)"](blockNumbers, this.url, this.description, pixels, referrer || ethers.constants.AddressZero, { value: cost })
        }
    }
}