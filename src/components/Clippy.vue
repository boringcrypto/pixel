<template>

</template>
<script lang="ts">
import {defineComponent} from "vue"
// @ts-ignore
import clippy from 'clippyjs'
import { randomItem } from "../classes/Utils"

interface ClippyAgent {
    show(): void
    speak(text: string): void
}

let Clippy = defineComponent({
    name: "Clippy",
    props: {
        names: {
            type: Array,
            default: ["Clippy", "Rover", "Links"]
        }
    },
    data() {
        return {
            name: null as string | null,
            agent: null as ClippyAgent | null,
        }
    },
    mounted() {
        this.name = randomItem(this.names as string[])
        clippy.load(this.name, (agent: ClippyAgent) => {
            this.agent = agent
            this.$emit("loaded", agent)
        })
    },
    methods: {

    }
})

export {
    Clippy as default,
    ClippyAgent
}
</script>