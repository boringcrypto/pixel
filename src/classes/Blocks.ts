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
    },
    loadFromChain(blocks: Block[], block: ChainBlock) {
        blocks[block.number].owner = block.owner
        blocks[block.number].lastPrice = block.lastPrice.toDec(18).toNumber()
        blocks[block.number].url = cleanURI(block.url)
        blocks[block.number].description = block.description
        blocks[block.number].pixels = block.pixels        
        return blocks
    }
}

export {
    Blocks
}