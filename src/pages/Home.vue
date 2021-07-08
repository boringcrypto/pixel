<template>
    <h1>Pixel Inc</h1>
    <button @click="buy">Buy</button>
    {{ pixel }}
    <div id="canvas" style="position: relative; line-height: 0; width: 1000px; height: 1000px">
        <div :style="selectionStyle"></div>
    </div>
    {{ selecting }} - {{ startSelectX }} - {{ startSelectY }} - {{ endSelectX }} - {{ endSelectY }} - {{ selected }} <label>Image File:</label
    ><br />
    <input type="file" id="imageLoader" name="imageLoader" />
    <canvas id="imageCanvas"></canvas>

    <!-- hitwebcounter Code START -->
    <a href="https://www.hitwebcounter.com" target="_blank">
        <img
            src="https://hitwebcounter.com/counter/counter.php?page=7835616&style=0004&nbdigits=6&type=page&initCount=0"
            title="Free Counter"
            Alt="web counter"
            border="0"
        />
    </a>
</template>

<script lang="ts">
import {defineComponent, PropType} from "@vue/runtime-core"
import {ProviderInfo} from "../components/Web3.vue"
import * as PixelDeployment from "../../deployments/localhost/Pixel.json"
import {Pixel, PixelFactory} from "../../types/ethers-contracts"

export default defineComponent({
    name: "Home",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true,
        },
    },
    data() {
        return {
            pixel: "",

            buying: false,
            selecting: false,
            selected: false,
            startSelectX: 0,
            startSelectY: 0,
            endSelectX: 0,
            endSelectY: 0,
        }
    },
    computed: {
        selectionStyle() {
            let style = "position: absolute; background: blue; opacity: 0.5; pointer-events: none;"
            style += this.selecting ? "" : "display: none;"
            style += "left: " + this.startSelectX * 10 + "px;"
            style += "top: " + this.startSelectY * 10 + "px;"
            style += "width: " + (this.endSelectX - this.startSelectX + 1) * 10 + "px;"
            style += "height: " + (this.endSelectY - this.startSelectY + 1) * 10 + "px;"
            return style
        },
    },
    methods: {
        buy() {
            this.buying = true

            this.pixel = PixelDeployment.address
            if (window.provider) {
                console.log(this.info.provider)
                let p = PixelFactory.connect(this.pixel, window.provider)
                console.log("try")
                p.name().then((dec) => console.log(dec))
            }
        },
    },
    mounted() {
        let canvas = document.getElementById("imageCanvas") as HTMLCanvasElement
        let ctx = canvas?.getContext("2d")
        let imageLoader = document.getElementById("imageLoader") as HTMLInputElement
        imageLoader.onchange = function (e) {
            var reader = new FileReader()
            reader.onload = function (event) {
                let img = new Image()
                img.onload = function () {
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx?.drawImage(img, 0, 0)
                }
                img.src = event.target?.result as string
            }
            const target = e.target as HTMLInputElement
            if (target.files?.length) {
                reader.readAsDataURL(target.files[0])
            }
        }

        console.log(document.getElementById("canvas"))
        let root = document.getElementById("canvas")
        if (root) {
            const self: any = this
            root.onmousedown = function (e) {
                if (self.buying) {
                    e.preventDefault()
                    self.selected = false
                    self.selecting = true
                    self.startSelectX = Math.floor((e.pageX - (root?.offsetLeft || 0)) / 10)
                    self.startSelectY = Math.floor((e.pageY - (root?.offsetTop || 0)) / 10)
                    self.endSelectX = self.startSelectX
                    self.endSelectY = self.startSelectY
                }
            }

            root.onmousemove = function (e) {
                if (self.selecting) {
                    self.endSelectX = Math.floor((e.pageX - (root?.offsetLeft || 0)) / 10)
                    self.endSelectY = Math.floor((e.pageY - (root?.offsetTop || 0)) / 10)
                }
            }

            root.onmouseleave = function (e) {
                self.selecting = false
                console.log("mouseleave")
            }

            root.onmouseup = function (e) {
                if (self.selecting) {
                    self.selecting = false
                    self.selected = true
                    e.preventDefault()
                }
            }

            root.onclick = function (e) {
                if (self.buying) {
                    e.preventDefault()
                }
            }
        }

        for (let i = 0; i < 10000; i++) {
            let img = new Image()
            img.width = 10
            img.height = 10
            img.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAABYSURBVChTdYzBDYAwDAM7CC/EOCzLYMwQLhxqGwSWVTm5uC2+tB47JiQmncuGbxQEN7zNwz8/7d6z5DiwgDxjVNpI7DUubV3arxmVtni+EJvzc+VRd64iLizYwalapbkhAAAAAElFTkSuQmCC"

            const a = document.createElement("a")
            a.href = "https://sushi.com"
            a.title = "Sushi!"
            a.appendChild(img)

            root?.appendChild(a)
        }
    },
})
</script>
