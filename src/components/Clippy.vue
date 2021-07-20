<template>

</template>
<script lang="ts">
import {defineComponent} from "vue"
// @ts-ignore
import clippy from 'clippyjs'

declare global {
    interface Array<T> {
        random(): T;
    }
}

let randomItem = function(array: any[]) {
    return array[Math.floor(Math.random() * array.length)]
}

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