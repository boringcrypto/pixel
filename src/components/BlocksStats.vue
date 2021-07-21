<template>
    {{ owned / 100 }}% owned, 
    {{ lvl2 / 100 }}% lvl2, 
    {{ lvl3 / 100 }}% lvl3, 
    {{ lvl4 / 100 }}% lvl4
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import { Block } from "../types"

export default defineComponent({
    name: "BlocksStats",
    props: {
        blocks: {
            type: Object as PropType<Block[]>,
            required: true,
        },
    },
    computed: {
        owned(): number {
            return this.blocks ? this.blocks.filter(b => b.owner).length : 0
        },
        lvl2(): number {
            return this.blocks ? this.blocks.filter(b => b.lastPrice >= 20).length : 0
        },
        lvl3(): number {
            return this.blocks ? this.blocks.filter(b => b.lastPrice >= 40).length : 0
        },
        lvl4(): number {
            return this.blocks ? this.blocks.filter(b => b.lastPrice >= 80).length : 0
        }
    }
})
</script>
