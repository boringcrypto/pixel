<template>
    <hr>
    Admin<br>
    Edit mode: {{ edit ? 'ON' : 'OFF'}}<br>
    <button @click="withdraw">Withdraw ETH</button>
    <button @click="edit=!edit">Edit mode</button>
    <button @click="logBlocks">Log cache</button>
</template>

<script lang="ts">

import { ethers } from "ethers"
import { defineComponent, PropType } from "vue"
import { PixelV2Factory } from "../../types/ethers-contracts"
import { ProviderInfo } from "../classes/ProviderInfo"
import { constants } from "../constants/live"
import { LocalData } from "../classes/LocalData"

async function blobToHex(data: Blob) {
    return "0x" + [...new Uint8Array(await data.arrayBuffer())].map(x => x.toString(16).padStart(2, '0')).join('');    
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

export default defineComponent({
    name: "Admin",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true
        },
        data: {
            type: Object as PropType<LocalData>,
            required: true
        },
        updateIndex: {
            type: Number,
            required: true
        },
        version: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            edit: false
        }
    },
    methods: {
        async withdraw() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let pixel = PixelV2Factory.connect(constants.pixel, signer)
                let p = pixel.connect(signer)
                await p.withdraw(ethers.constants.AddressZero)
            }
        },
        logBlocks() { 
            console.log(JSON.stringify({
                blocks: this.data.blocks,
                addresses: this.data.addresses,
                texts: this.data.texts,
                datas: this.data.datas,
                updateIndex: this.data.updateIndex,
                startTimeStamp: this.data.startTimeStamp,
                lockTimeStamp: this.data.lockTimeStamp,
                version: this.version + 1
            }))
        }
    }
})
</script>
