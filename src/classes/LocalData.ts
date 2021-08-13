import { BigNumber } from "ethers"
import { PixelV2 } from "../../types/ethers-contracts"
import * as Cache from "../cache.json"
import { PollInfo } from "../types"
import { decompressPixels, imgDataToHex } from "./Order"
import { compress, decompress, sleep } from "./Utils"

type LocalBlock = {
    owner: number,
    lastPrice: number,
    url: number,
    description: number,
    pixels: number,
}

class UserInfo {
    balance: BigNumber = BigNumber.from(0)
    upline: string = "0x0000000000000000000000000000000000000000"
    earnings = {
        tier1: 0,
        tier2: 0,
        tier3: 0
    }
    lemmings = {
        tier1: 0,
        tier2: 0,
        tier3: 0
    }

    load(pollInfo: PollInfo) {
        this.balance = pollInfo.balance
        this.upline = pollInfo.upline_
        this.earnings.tier1 = pollInfo.mlm_.earnings1
        this.earnings.tier2 = pollInfo.mlm_.earnings2
        this.earnings.tier3 = pollInfo.mlm_.earnings3
        this.lemmings.tier1 = pollInfo.mlm_.tier1
        this.lemmings.tier2 = pollInfo.mlm_.tier2
        this.lemmings.tier3 = pollInfo.mlm_.tier3
    }
}

async function retry<T>(func: () => Promise<T>): Promise<T> {
    let result: T
    let success = false
    let delay = 10000
    let retries = 10
    while (!success && retries > 0) {
        try {
            result = await func()
            success = true
        } catch(e) {
            await sleep(delay)
            delay += delay /2
            retries--
            if (!retries) {
                throw e
            }
        }
    }
    return result!
}

export class LocalData {
    blocks: LocalBlock[] = []
    addresses: string[] = ["0x0000000000000000000000000000000000000000"]
    texts: string[] = [""]
    datas: string[] = [""]
    updateIndex = 0
    version = 0
    startTimeStamp = 0
    lockTimeStamp = 0
    userInfo = new UserInfo()
    supply = BigNumber.from(0)
    loading = false

    async load() {
        // Load from (compressed) localStorage
        let dataStr = localStorage.getItem("data")
        if (dataStr) {
            let data = await decompress<LocalData>(dataStr)
            if (data) {
                console.log("Using local storage", data)
                this.blocks = data.blocks || []
                this.addresses = data.addresses || []
                this.texts = data.texts || []
                this.datas = data.datas || []
                this.updateIndex = data.updateIndex || 0
                this.startTimeStamp = data.startTimeStamp || 0
                this.lockTimeStamp = data.lockTimeStamp || 0
                this.version = data.version || 0
                console.log("Using local storage", this.version)
            }
        }

        // Replace with Cache if it's newer
        if (this.version < Cache.version) {
            console.log("Using cache")
            this.blocks = Cache.blocks
            this.addresses = Cache.addresses
            this.texts = Cache.texts
            this.datas = Cache.datas
            this.updateIndex = Cache.updateIndex
            this.startTimeStamp = Cache.startTimeStamp
            this.lockTimeStamp = Cache.lockTimeStamp
            this.version = Cache.version
        }

        // Fill with empty data if needed
        while (this.blocks.length != 10000) {
            this.blocks.push({
                owner: 0,
                lastPrice: 0,
                url: 0,
                description: 0,
                pixels: 0
            })
        }
    }

    async save() {
        let fullData = {
            blocks: this.blocks,
            addresses: this.addresses,
            texts: this.texts,
            datas: this.datas,
            updateIndex: this.updateIndex,
            startTimeStamp: this.startTimeStamp,
            lockTimeStamp: this.lockTimeStamp,
            version: this.version
        }
        let compressed = await compress(fullData)
        console.log("Stored compressed info", compressed.length, this.version)
        localStorage.setItem("data", compressed)
    }

    async updateAddresses(pixel: PixelV2, count: number) {
        // Load new addresses
        const max_batch_size = 2000
        let start = this.addresses.length
        while (start < count) {
            let end = Math.min(start + max_batch_size, count)
            console.log("Getting addresses from", start, "to", end)
            let addresses = await retry(() => pixel.getAddressesRange(start, end))
            if (start != this.addresses.length) { return; }
            this.addresses = this.addresses.concat(addresses)
            start += max_batch_size
        }
    }

    async updateTexts(pixel: PixelV2, count: number) {
        // Load new texts
        const max_batch_size = 2000
        let start = this.texts.length
        while (start < count) {
            let end = Math.min(start + max_batch_size, count)
            console.log("Getting texts from", start, "to", end)
            let texts = await retry(() => pixel.getTextRange(start, end))
            if (start != this.texts.length) { return; }
            this.texts = this.texts.concat(texts)
            start += max_batch_size
        }
    }

    async updateDatas(pixel: PixelV2, count: number) {
        // Load new addresses
        const max_batch_size = 200
        let start = this.datas.length
        while (start < count) {
            let end = Math.min(start + max_batch_size, count)
            console.log("Getting datas from", start, "to", end)
            let datas = await retry(() => pixel.getDataRange(start, end))
            if (start != this.datas.length) { return; }
            datas = await Promise.all(datas.map(async (compressed) => {
                let data = await decompressPixels(compressed)
                let raw = imgDataToHex(data)
                return raw
            }))
            this.datas = this.datas.concat(datas)
            start += max_batch_size
        }
    }

    async updateBlocks(pixel: PixelV2, count: number, onBlocks: (onBlocks: number[]) => void) {
        const max_batch_size = 1000
        let updates: number[] = []
        let start = this.updateIndex
        while (count > start) {
            console.log("Getting updates from", start)
            let add = (await retry(() => pixel.getUpdates(start, max_batch_size))).map(bn => bn.toNumber())
            updates = updates.concat(add)
            start += add.length
        }

        // Unique blocks that have been updated
        updates = [...new Set(updates)]

        if (!this.updateIndex) {
            updates = [10000]
        }

        if (updates.length) {
            if (updates[0] == 10000) {
                console.log("Update ALL blocks")
                updates = [...Array(10000).keys()]
            }

            while (updates.length) {
                console.log("Update blocks", updates.length, "left")
                let blockNumbers = updates.splice(0, 100)
                let blocks = await retry(() => pixel.getRawBlocks(blockNumbers))

                for (let i in blocks) {
                    let block = blocks[i]
                    this.blocks[block.number].owner = block.owner
                    this.blocks[block.number].lastPrice = block.lastPrice.toDec(18).toNumber()
                    this.blocks[block.number].url = block.url
                    this.blocks[block.number].description = block.description

                    this.blocks[block.number].pixels = block.pixels
                }

                onBlocks(blockNumbers)
            }

            this.updateIndex = count
        }
    }

    async update(pixel: PixelV2, address: string, onBlocks: (onBlocks: number[]) => void) {
        // Get pollInfo
        let pollInfo = await pixel.poll(address)
        this.userInfo.load(pollInfo)
        this.supply = pollInfo.supply

        // Update lookups
        const addressCount = pollInfo.addresses_.toNumber()
        const textCount = pollInfo.text_.toNumber()
        const dataCount = pollInfo.data_.toNumber()
        const updateCount = pollInfo.updates_.toNumber()

        if (this.loading) { return }
        if (this.addresses.length < addressCount) {
            this.loading = true
            await this.updateAddresses(pixel, addressCount)
        }
        if (this.texts.length < textCount) {
            this.loading = true
            await this.updateTexts(pixel, textCount)
        }
        if (this.datas.length < dataCount) {
            this.loading = true
            await this.updateDatas(pixel, dataCount)
        }
        if (this.updateIndex < updateCount || !updateCount) {
            this.loading = true
            await this.updateBlocks(pixel, updateCount, onBlocks)
        }
        if (this.loading) {
            this.save()
            this.loading = false
        }
    }
}