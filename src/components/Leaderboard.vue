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

import {defineComponent, PropType} from "vue"
import { Block } from "../types"

export default defineComponent({
    name: "Leaderboard",
    props: {
        blocks: {
            type: Object as PropType<Block[]>,
            required: true,
        },
    },
    computed: {
        leaderboard(): any {
            let board: any = {}
            for (let i in this.blocks) {
                let block = this.blocks[i]
                if (!board[block.owner]) {
                    board[block.owner] = {
                        pixels: 0,
                        price: 0
                    }
                }
                board[block.owner].pixels = board[block.owner].pixels + 100
                board[block.owner].price = board[block.owner].price + block.lastPrice
            }
            return Object.keys(board).map(a => ({ address: a, pixels: board[a].pixels, price: board[a].price })).sort(function(a, b) { return b.pixels - a.pixels; })
        }
    }
})
</script>
