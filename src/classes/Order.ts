import { BigNumber, ethers } from "ethers"
import { Block } from "../types"
import { PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { ProviderInfo } from "../classes/ProviderInfo"
import { PixelsToImageData } from "./Blocks";
import { LocalData } from "./LocalData";

export interface SelectedArea {
    startX: number
    startY: number
    endX: number
    endY: number,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D
}

function uint32(v: number): BigNumber {
    let result = BigNumber.from(v)
    if (result.lt(0)) {
        return BigNumber.from("2").pow("32").add(result)
    }
    return result
}

async function blobToHex(data: Blob) {
    return [...new Uint8Array(await data.arrayBuffer())].map(x => x.toString(16).padStart(2, '0')).join('');    
}

function hexToBlob(hex: string) {
    var byteArray = new Uint8Array(hex.length/2);
    for (var x = 0; x < byteArray.length; x++){
        byteArray[x] = parseInt(hex.substr(x*2,2), 16);
    }
    
    var blob = new Blob([byteArray], {type: "application/octet-stream"});
    return blob
}

function toBlob(canvas: HTMLCanvasElement, mime: string, quality: number = 0.75): Promise<Blob> {
    return new Promise(function (resolve) {
            canvas.toBlob((data) => {
                if (data) {
                    resolve(data)
                }
            }, mime, quality);
        });    
}

function imgToImageData(img: HTMLImageElement): ImageData {
    var canvas = document.createElement('canvas')
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');
    context!.drawImage(img, 0, 0);
    return context!.getImageData(0, 0, canvas.width, canvas.height);
}

function blobToImageData(blob: Blob): Promise<ImageData> {
    return new Promise((resolve) => {
        let img = new Image()
        img.onload = () => {
            URL.revokeObjectURL(img.src)
            resolve(imgToImageData(img));
        };
        img.src = URL.createObjectURL(blob)
    })
}

export function imgDataToHex(data: ImageData): string {
    return "0x" + [...data.data.filter((e, i) => i % 4 < 3)].map(x => x.toString(16).padStart(2, '0')).join('');
}

// 00 = Error
// 01 = Stripped PNG
// 02 = Full PNG
// 03 = Stripped JPG
// 04 = Full JPG
// 05 = Raw
// 06 = Single color
export async function compressPixels(data: ImageData): Promise<string> {
    let canvas = document.createElement("CANVAS") as HTMLCanvasElement
    canvas.width = 10
    canvas.height = 10
    let ctx = canvas.getContext("2d")
    if (!ctx) { return "0x00" }

    let options = []

    ctx.putImageData(data, 0, 0)
    let png = await blobToHex(await toBlob(canvas, "image/png"))
    if (png.startsWith("89504e470d0a1a0a0000000d494844520000000a0000000a08060000008d32cfbd0000") && png.endsWith("0000000049454e44ae426082")) {
        options.push("01" + png.slice(70, png.length - 24))
    } else {
        options.push("02" + png)
    }

    let jpg = await blobToHex(await toBlob(canvas, "image/jpeg", 0.8))
    if (jpg.startsWith("ffd8ffe000104a46494600010100000100010000ffdb0043000a07070807060a0808080b0a0a0b0e18100e0d0d0e1d15161118231f2524221f2221262b372f26293429212230413134393b3e3e3e252e4449433c48373d3e3bffdb0043010a0b0b0e0d0e1c10101c3b2822283b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3bffc0001108000a000a03012200021101031101ffc400") && jpg.endsWith("ffd9")) {
        options.push("03" + jpg.slice(360, jpg.length - 4))
    } else {
        options.push("04" + jpg)
    }

    let raw = [...data.data.filter((e, i) => i % 4 < 3)].map(x => x.toString(16).padStart(2, '0')).join('');
    options.push("05" + raw)

    let color = raw.substr(0, 6)
    let index = 0
    while (index < 100 && raw.substr(index * 6, 6) == color) {
        index++;
    }
    if (index == 100) {
        options.push("06" + color)
    }

    options.sort((a, b) => a.length - b.length)

    return "0x" + options[0]
}

export async function decompressPixels(hex: string): Promise<ImageData> {
    if (hex.startsWith("0x")) {
        hex = hex.substr(2)
    }
    let method = hex.substr(0, 2)
    hex = hex.substr(2)
    if (method == "01" || method == "02" || method == "03" || method == "04") {
        if (method == "01") {
            hex = "89504e470d0a1a0a0000000d494844520000000a0000000a08060000008d32cfbd0000" + hex + "0000000049454e44ae426082"
        }
        if (method == "03") {
            hex = "ffd8ffe000104a46494600010100000100010000ffdb0043000a07070807060a0808080b0a0a0b0e18100e0d0d0e1d15161118231f2524221f2221262b372f26293429212230413134393b3e3e3e252e4449433c48373d3e3bffdb0043010a0b0b0e0d0e1c10101c3b2822283b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3bffc0001108000a000a03012200021101031101ffc400" + hex + "ffd9"
        }
        return await blobToImageData(hexToBlob(hex))
    } else if (method == "05") {
        var canvas = document.createElement('canvas')
        canvas.width = 10;
        canvas.height = 10;
        var ctx = canvas.getContext('2d');
        return PixelsToImageData(ctx!, "0x" + hex)
    } else if (method == "06") {
        var canvas = document.createElement('canvas')
        canvas.width = 10;
        canvas.height = 10;
        var ctx = canvas.getContext('2d');
        ctx!.fillStyle="#" + hex
        ctx?.fillRect(0, 0, 10, 10)
        return ctx!.getImageData(0, 0, 10, 10)
    }
    var canvas = document.createElement('canvas')
    canvas.width = 10;
    canvas.height = 10;
    var ctx = canvas.getContext('2d');
    return ctx!.getImageData(0, 0, 10, 10)
}

export class Order {
    width: number = 0
    height: number = 0
    blockNumbers: number[] = []
    pixels: number[] = []
    newDatas: string[] = []
    cost: BigNumber = BigNumber.from(0)
    gas: BigNumber = BigNumber.from(0)
    gasPrice: BigNumber = BigNumber.from(0)
    duplicateBlocks: number = 0
    url: string = ""
    description: string = ""
    
    async create(area: SelectedArea, data: LocalData, pixel: PixelV2, provider: ethers.providers.JsonRpcProvider) {
        this.duplicateBlocks = 0
        this.width = area.width
        this.height = area.height
        for (let x = 0; x < area.width; x++) {
            for (let y = 0; y < area.height; y++) {
                let imageData = area.ctx.getImageData(x * 10, y * 10, 10, 10)
                let raw = imgDataToHex(imageData)
                let blockNumber = (area.startY + y) * 100 + area.startX + x;
                let originalRaw = data.datas[data.blocks[blockNumber].pixels]
                if (raw != originalRaw) {
                    this.blockNumbers.push(blockNumber)
                    let pixelNr = data.datas.indexOf(raw)
                    if (pixelNr == -1) {
                        let hex = await compressPixels(imageData)
                        let newPixelNr = this.newDatas.indexOf(hex)
                        if (newPixelNr >= 0) {
                            pixelNr = -(1 + newPixelNr)
                        } else {
                            this.newDatas.push(hex)
                            pixelNr = -this.newDatas.length
                        }
                    }
                    this.pixels.push(pixelNr)
                } else {
                    this.url = data.texts[data.blocks[blockNumber].url]
                    this.description = data.texts[data.blocks[blockNumber].description]
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
            //let gas = await pixel.estimateGas["setBlocks(uint256[],string,string,bytes[],address)"](blockNumbers, this.url, this.description, pixels, referrer || ethers.constants.AddressZero, { value: cost })
            //this.gas = this.gas.add(gas)
        }
    }

    async buy(pixel: PixelV2, provider: ethers.providers.JsonRpcProvider, data: LocalData, info: ProviderInfo, referrer: string) {
        const signer = provider.getSigner(info.address)
        let p = PixelV2Factory.connect(pixel.address, signer)
        const max_blocks_per_tx = 25

        if (this.blockNumbers.length <= max_blocks_per_tx) {
            let ownerNr = uint32(data.addresses.indexOf(info.address))
            let urlNr = uint32(data.texts.indexOf(this.url))
            let descriptionNr = uint32(data.texts.indexOf(this.description))
            let referrerNr = uint32(data.addresses.indexOf(referrer))
            let cost = await p["getCost(uint256[])"](this.blockNumbers)
            console.log(
                info.address,
                ownerNr.toString(),
                this.url,
                urlNr.toString(),
                this.description,
                descriptionNr.toString(),
                this.blockNumbers,
                this.newDatas,
                this.pixels,
                referrer,
                referrerNr.toString()               
            )
            p.setBlocks(
                info.address,
                ownerNr,
                this.url,
                urlNr,
                this.description,
                descriptionNr,
                this.blockNumbers,
                this.newDatas,
                this.pixels,
                referrer,
                referrerNr, 
                { value: cost }
            )
        } else {

        }
        /*for (let i = 0; i <= Math.floor((this.blockNumbers.length - 1) / 25); i++) {
            let blockNumbers = this.blockNumbers.slice(i * 25, (i + 1) * 25)
            let pixels = this.pixels.slice(i * 25, (i + 1) * 25)
            let cost = await p["getCost(uint256[])"](blockNumbers)
            p["setBlocks(uint256[],string,string,bytes[],address)"](blockNumbers, this.url, this.description, pixels, referrer || ethers.constants.AddressZero, { value: cost })
        }*/
    }
}