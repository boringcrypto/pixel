<template>
    <table style="width: 440px; margin: auto; color: black" class="blueTable">
        <thead>
        <tr>
            <th></th>
            <th>Leaderboard</th>
            <th>Pixels</th>
            <th>Cost</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="line, p in leaderboard" :key="line.address">
                <td style="padding: 6px">{{ parseInt(p.toString()) + 1 }}</td>
                <td style="padding: 6px"><a :href="'https://debank.com/profile/' + line.address" target="_blank">{{ line.address }}</a></td>
                <td style="padding: 6px;text-align: right">{{ line.pixels }}</td>
                <td style="padding: 6px;text-align: right">{{ line.price }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">

import { BigNumber } from "@ethersproject/bignumber"
import {defineComponent, PropType} from "vue"
import { LocalData } from "../classes/LocalData"

export default defineComponent({
    name: "Leaderboard",
    props: {
        data: {
            type: Object as PropType<LocalData>,
            required: true,
        },
    },
    computed: {
        leaderboard(): any {
            let board: any = {}
            for (let i in this.data.blocks) {
                let block = this.data.blocks[i]
                let owner = this.data.addresses[block.owner]
                if (!board[owner]) {
                    board[owner] = {
                        pixels: 0,
                        price: 0
                    }
                }
                board[owner].pixels = board[owner].pixels + 100
                board[owner].price = board[owner].price + block.lastPrice
            }
            return Object.keys(board).map(a => ({ address: a, pixels: board[a].pixels, price: Math.round(board[a].price * 2000) / 2000 })).sort(function(a, b) { return b.pixels - a.pixels + b.price - a.price; })
        }
    }
})
</script>
