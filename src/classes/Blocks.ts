import { BigNumber } from "ethers";
import { Block } from "../types";
import { cleanURI } from "./Utils";

interface ChainBlock {
    number: number,
    owner: string,
    lastPrice: BigNumber,
    description: string,
    url: string,
    pixels: string
}

export class Canvas {
    blocks: Block[] = []
    text: {[key: string]: number} = {}
    textCount: number = 1
    data: {[key: string]: number} = {}
    dataCount = 1
    addresses: {[key: string]: number} = {}
    addressesCount = 1
    pixels: {[key: string]: number} = {}

    newPixels: string[] = []

    constructor() {
        this.blocks = Blocks.empty([])
        this.text[""] = 0
    }

    reset() {
        this.newPixels = []
    }

    addText(t: string) {
        if (!this.text[t]) {
            this.text[t] = this.textCount++
        }
    }

    addPixels(p: string): number {
        if (this.pixels[p]) {
            return this.pixels[p]
        }
        if (this.newPixels.indexOf(p) >= 0) {
            return -(1 + this.newPixels.indexOf(p))
        }
        this.newPixels.push(p)
        return -this.newPixels.length
    }
}

let Blocks = {
    clear(blocks: Block[]) {
        while (blocks.length) {
            blocks.pop()
        }
        return blocks
    },
    empty(blocks: Block[]) {
        this.clear(blocks)
        for (let i = 0; i < 10000; i++) { 
            blocks.push({
                owner: "",
                lastPrice: 0,
                url: "",
                description: "",
                pixels: ""
            })
        }
        return blocks
    }
}

function PixelsToImageData(ctx: CanvasRenderingContext2D, pixels: string): ImageData {
    let data: ImageData = ctx.createImageData(10, 10)
    for(let i = 0; i < 100; i++) {
        let color = parseInt(pixels.substr(2 + i * 6, 6), 16)
        data.data.set([Math.floor(color / 65536), Math.floor((color % 65536) / 256), color % 256, 255], i * 4)
    }
    return data
}

export {
    Blocks,
    PixelsToImageData
}