<template>
    <div @mousedown="mousedown" @mousemove="mousemove" @mouseleave="mouseleave" @mouseup="mouseup" @click="click">
        <img ref="preview" v-if="image" :style="imageStyle" />
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { SelectedArea } from "../classes/Order"

export default defineComponent({
    name: "SelectionArea",
    props: {
        select: {
            type: Boolean,
            default: false
        },
        image: {
            type: Object as PropType<HTMLImageElement | null>,
            required: false
        }
    },
    data() {
        return {
            selecting: false,
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        }
    },
    computed: {
        width(): number { return Math.abs(this.endX - this.startX) + 1 },
        height(): number { return Math.abs(this.endY - this.startY) + 1 },
        imageStyle() {
            let style = "position: absolute; pointer-events: none;"
            if (this.startX <= this.endX) {
                style += "left: " + this.startX * 10 + "px;"
                style += "width: " + (this.endX - this.startX + 1) * 10 + "px;"
            } else {
                style += "left: " + this.endX * 10 + "px;"
                style += "width: " + (this.startX - this.endX + 1) * 10 + "px;"
            }

            if (this.startY <= this.endY) {
                style += "top: " + this.startY * 10 + "px;"
                style += "height: " + (this.endY - this.startY + 1) * 10 + "px;"
            } else {
                style += "top: " + this.endY * 10 + "px;"
                style += "height: " + (this.startY - this.endY + 1) * 10 + "px;"
            }
            return style
        }
    },
    methods: {
        renderImage(): CanvasRenderingContext2D {
            let canvas = document.createElement("CANVAS") as HTMLCanvasElement
            canvas.width = this.width * 10
            canvas.height = this.height * 10
            let ctx = canvas.getContext("2d") as CanvasRenderingContext2D
            if (this.image) {
                ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)
            }

            let preview = this.$refs.preview as HTMLImageElement
            preview.src = canvas.toDataURL()
            return ctx
        },
        emit(event: string) {
            let ctx = this.renderImage()
            this.$emit(event, {
                startX: this.endX >= this.startX ? this.startX : this.endX, 
                startY: this.endY >= this.startY ? this.startY : this.endY,
                endX: this.endX >= this.startX ? this.endX : this.startX,
                endY: this.endY >= this.startY ? this.endY : this.startY,
                width: this.width,
                height: this.height,
                ctx
            } as SelectedArea)
        },
        mousedown(event: MouseEvent) {
            if (this.select) {
                event.preventDefault()
                this.selecting = true
                this.startX = Math.floor((event.pageX - (this.$el.offsetLeft || 0)) / 10)
                this.startY = Math.floor((event.pageY - (this.$el.offsetTop || 0)) / 10)
                this.endX = this.startX
                this.endY = this.startY
                this.emit("draw")
            }
        },
        mousemove(event: MouseEvent) {
            if (this.selecting) {
                this.endX = Math.floor((event.pageX - (this.$el.offsetLeft || 0)) / 10)
                this.endY = Math.floor((event.pageY - (this.$el.offsetTop || 0)) / 10)
                this.emit("draw")
            }
        },
        mouseleave() {
            this.selecting = false
        },
        mouseup(event: MouseEvent) {
            if (this.selecting) {
                this.endX = Math.floor((event.pageX - (this.$el.offsetLeft || 0)) / 10)
                this.endY = Math.floor((event.pageY - (this.$el.offsetTop || 0)) / 10)
                this.selecting = false
                event.preventDefault()
                this.emit("select")
            }
        },
        click(event: MouseEvent) {
            if (this.select) {
                event.preventDefault()
            }
        }
    },
    watch: {
        'select': function() {
            if (!this.select) {
                this.selecting = false
            }
        }
    }
})
</script>
