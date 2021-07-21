<template>
    <hr>
    Admin<br>
    Edit mode: {{ edit ? 'ON' : 'OFF'}}<br>
    <button @click="withdraw">Withdraw MATIC</button>
    <button @click="edit=!edit">Edit mode</button>
    <button @click="logBlocks">Log cache</button>
    <button @click="reload">Reload</button>
    <button @click="getInfo">Info</button><br>
    <button @click="test">Test</button><br>
</template>

<script lang="ts">

import { BigNumber, ethers } from "ethers"
import { defineComponent, PropType } from "vue"
import { PixelV2 } from "../../types/ethers-contracts"
import { Blocks } from "../classes/Blocks"
import { sleep } from "../classes/Utils"
import { ProviderInfo } from "./Web3.vue"

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
        pixel: {
            type: Object as PropType<PixelV2>,
            required: true
        },
        blocks: {
            type: Object as PropType<Blocks>,
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
                let p = this.pixel.connect(signer)
                await p.withdraw(ethers.constants.AddressZero)
            }
        },
        async mint() {
            if (window.provider) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = this.pixel.connect(signer)
                await p.mintCanvas()
            }
        },
        async test() {
            let canvas = document.createElement("CANVAS") as HTMLCanvasElement
            canvas.width = 10
            canvas.height = 10
            let ctx = canvas.getContext("2d")
            if (!ctx) { return }

            let raw = 0
            let compressed = 0

            for (let b = 0; b < 10000; b++) {
                let pixels = this.blocks[b].pixels
                let data: ImageData = ctx.createImageData(10, 10)
                for(let i = 0; i < 100; i++) {
                    let hex = pixels.substr(2 + i * 6, 2)
                    data.data[i * 4] = BigNumber.from("0x" + hex).toNumber()
                    hex = pixels.substr(4 + i * 6, 2)
                    data.data[i * 4 + 1] = BigNumber.from("0x" + hex).toNumber()
                    hex = pixels.substr(6 + i * 6, 2)
                    data.data[i * 4 + 2] = BigNumber.from("0x" + hex).toNumber()
                    data.data[i * 4 + 3] = 255
                }
                ctx.putImageData(data, 0, 0)
                let png = await blobToHex(await toBlob(canvas, "image/png"))
                let jpg = await blobToHex(await toBlob(canvas, "image/jpeg", 0.7))
                console.log(pixels.length, png.length, jpg.length)

                raw = raw + Math.floor((pixels.length - 2) / 64) + 1
                compressed = compressed + Math.floor((Math.min(pixels.length, png.length, jpg.length) - 1) / 64) + 1
            }
            console.log("Test", raw, compressed)
        },
        logBlocks() { 
            //console.log(JSON.stringify({blocks: this.blocks, updateIndex: this.updateIndex, version: this.version + 1}))
        },
        reload() {
            /*let ctx = this.canvas?.getContext("2d")
            if (ctx) {
                localStorage.removeItem("data")
                this.blocks = []
                for (let i = 0; i < 10000; i++) { this.blocks.push({owner: "", lastPrice: 0, url: "", description: "", pixels: "" }) }
                this.updateIndex = 0
                this.version = 0
                ctx.clearRect(0, 0, 1000, 1000)
                this.newBlock()
            }*/
        },
        async upload() {
            /*let wallet = ethers.Wallet.fromMnemonic(this.mnemonic)
            wallet = wallet.connect(this.matic)
            let p = PixelV2Factory.connect(this.constants.pixel, wallet)
            let i = 0;
            Snapshot.blocks.splice(0, i)
            while (Snapshot.blocks.length) {
                let blocks = Snapshot.blocks.splice(0, 20)
                let result = 0
                while(result == 0) {
                    console.log(result, blocks.map((b, j) => i + j))
                    let tx = await p.initBlocks(
                        blocks.map((b, j) => i + j),
                        blocks.map(b => b.url),
                        blocks.map(b => b.description),
                        blocks.map(b => b.pixels),
                        blocks.map(b => BigNumber.from(b.lastPrice).mul("1000000000000000000")),
                        blocks.map(b => b.owner),
                        {
                            gasPrice: 11100000000,
                            //gasLimit: 12000000
                        }
                    )
                    result = (await tx.wait()).status || 0
                    console.log("Result", result)
                    if (result == 0) {
                        console.log("Error, sleeping 1 minute")
                        await sleep(60000)
                    }
                }
                i = i + blocks.length
            }*/
        },
        async getInfo() {
            let allUsers = ["0x0000000000000000000000000000000000000000","0x30a0911731f6ec80c87c4b99f27c254639a3abcd","0xa30b98148ef97b6f6dcd911b129c7dd68c0b09ff","0xc858dd4f2a80a859d491a16beee6708a6743bfb7","0x092471cffe4b941c896bfec001fe8bcc73a991d9","0x57d9b1e86a1f4a0b76bec742f8e9e6f70650e6b0","0xf58aa8e0832deac36550296dc92fc091d5de2b7d","0x5ba8be640c84e294bd7285b4d7a676ed8e1ff2ec","0x5b7dcb8ce882f3d4c953c9f9d79e08730efe4939","0x8f54c8c2df62c94772ac14ccfc85603742976312","0x65204c0183b29778d2b19513930ed8bdfdf044c0","0xb2f6be1d6c18514eabdc352b97b63273608af8fe","0xa03dee508d09ba9401a661f154036b36328e0f0c","0xa8ec58dd533e0cf82ec417bca3c4dbca48ae5a8b","0x1e4135cf6e2b9feebd52c6e90817fb19cfe294b9","0x00a5af2d7da07df76073a6f478f0fb4942d2659a","0x0d35324061f620f66af983dee02076b2e45e57fc","0x5b52bf12e7d8737ed61f06147fc655514679ce72","0xb11a0ce3a6ea30d8aa906e0f84eb92be8af5afcb","0x4cb1a8bb524ec318aaad1c63ca51b2189df00560","0x0f278c56b52b4c0e2a69b30a0b591d237c783907","0x1beea90d1ceab31919b4197409cef9373e7b2c11","0x9e6e344f94305d36ea59912b0911fe2c9149ed3e","0x7bf4d5e579a26dd09f1dddb2391566e7ba575b5b","0xf07504a96601b35dd702b07ecc57b2b169866f57","0xaf1ca20615f84c48782f2f23b3cc737db9c3514c","0xc61a2bb414a41ce492a94b5f59f5fd72f3a71c97","0x7f3d32c56b94a9b7878fdfac4f40aaa2a6e11edf","0x256d49d87cbb877d26e2bcf2bf0a40d26bdfb5d4","0xa03d1648be58e6957c81c1c201236e189b6ee6af","0x2b19fde5d7377b48be50a5d0a78398a496e8b15c","0x1ef5526ee1a6d8c596cce90e774a2c41372cc8cd","0x62c04cc455520708958c9ce3fafff51745e42189","0xc962ba9a1a45b79c1228636db5a6efa4a4b75d76","0x62b979923922045fb5a77bed9e0753941b1da52c","0x84e5bc3df0df0f543648f250443c6f4077218312","0xebaca45c63ba3981b083064a8dcf5d2999430bd6","0x72e30bd8d69311fad86dcb8c7edf46294b432343","0xed3c50209648e2b4794d47b0973e2b95e6b756ce","0x3185fd8f4578f746441eff27cebce89480904c20","0x528d4e4e0dbf071ec23013f06d8487bad5a8a68b","0x206971261b391763458134212feeab2360874676","0xdf547eab8944d9ef06475df8eee372b9808f425e","0xc847a016ed0a023196eeb641cf13a93ce3c82b6b","0xb4a3f907ec1611f22543219ae9bb33ec5e96e116","0x81f185cb71a4b98777a5ee50ca55e80608db61c1","0xdb6f1920a889355780af7570773609bd8cb1f498","0x29a4ea26ac9eed2fbdcd649cfd707948b18f4c67","0x9a568bfeb8cb19e4bafcb57ee69498d57d9591ca","0x0f85a912448279111694f4ba4f85dc641c54b594","0x157b6c44f47ecd30c0a2c428a6f35dbc606aa81b","0x51c25230335472236853676290062c8c7a0825b6","0xc70c99c1485eccc693e434433edbf5c27f937499","0x0655e4deaa64b4c6da6b68db283934a15d9afc8d","0x3c0a3d1994c567fd4bf17dc5858ec84ff1f87501","0x05f0ba0f63b401bc9b86089265cee2f79c955768","0x91b12c04ba95cede8e7cdd1a17d961cbdfd2e00b","0x592f1a037eb4cbe529e80ca0f855525e13993380","0x3d9b0a7ef1cceada457001a6d51f28ff61e39904","0x58a5d0d2d5cda76806f48a3b255d2b0238f965c5","0x01485557c2bc6e26c7187ff4cc38d5d9474405d4","0x6da4f80adac622571b9008b8529c240933d1a8d9","0x7bd8a74a0b06fa03a9c2275f58081a7ccf549f16","0x897656b1fb6c3688e48e1dd8259f7e092364754d","0x862c6f0373ac129fc66a324b234943139ca10c92","0x8591656bb9f1e1e66806a465572bdd1982c25761","0xc9fd84728f98df2820896db89d7d47ac9998228c","0x79b1a32ec97537486e75d99850bd56ecfa09d643","0xa0bf4e5640e5db6fa82967d2c160e35a9a28ae83","0xe61a0809ef3f1d2d695555413ac354284bf23915","0x218d75b17f491793a96ab4326c7875950359a80c","0x315388deb1608bdcf532ce0bf6fc130542f5132c","0xe9f654994f1135ebfab3183f50603da5c6abd4c3","0xbf2116d0a79da0e5710df8ab00eb20415bca94c8","0x131ee3be2e3803bf9e8976ddf0306236f001b7f2","0xd264da372aefcd5269ca212bfd3c56e8e95bccca","0x25c89a394e37268c33628bd3cc54908b5f8d1bd5","0xfd5a25ef7396384c2d43645f32609bc869c36208","0x54d925f320400139f9f2925767f1ec68b027e7c0","0xce3c9e357425c99cc27dc9bf963d06e739811465","0xf1228c34651348f12d05d138896dc6d2e946f970","0x069e85d4f1010dd961897dc8c095fbb5ff297434","0xa2db5f9313a553f572fa44aa1ba5b5871ed68406","0xb3160404ca9581784b3dec9e85bcd354397b8c72","0x1f427a6fcdb95a7393c58552093e10a932890fa8","0x43d20d5efa78ff0e465dda2e58109f9fb3a2bece","0xb9956c74639d8e11c64d8005dc0c2262945af074","0xf82a5d0168cc93e63dc217314adb87f15891d124","0xc572c95996653ae98ec3a59d9a511eda142b98c1","0x8fb07b21383d331f3752a7590b0cfeac85514a1f","0x0b981d98e857c888e00d2c494d24dc16a12f8f3a","0xe744048f7d1b63b4e233a1d63c3153b913d7a2cc","0xd6e371526cdaee04cd8af225d42e37bc14688d9e","0x7a4a8f7b3707ecc86b50cae33f83edc5f8c8f57e","0x000000000000000000000000000000000000dead","0x070ae2385dedc927f821e75434e881ca5fd549fb","0x41381649b2231cafc8293f501bb3df422aeba5e4","0xb5ede9893fccd62a110fd9d0cce5c89418a8540b","0x357dfdc34f93388059d2eb09996d80f233037cba","0xbf912cb4d1c3f93e51622fae0bfa28be1b4b6c6c","0x496ea957960bf9a2bbc1d3c114eaa124e07d0543","0xc16414ac1fedfdac4f8a09674d994e1bbb9d7113","0x4ef416aa741053b5f3968900379df2e3d0229065","0x9efb6d49fd5496626e80ad0b07017744ae9a0efa","0xc53f5a27021455293aa34da308280abc4cad210a","0x3d343914eb418f465401e617a19cc9dd072922e7","0x94e169525d86df638cc51d801eac8d60275a8047","0x835f394f3d770b6ff818303f045e39f541b3d781","0x28c24f2da9b6e517968300eb1a4f4ae1b235238e","0x1200b4a3a90dcdc504443130572e840c988ec13c","0x826a471055333505e596f424348983af0aa8411b","0xbcc1a3455bfe501cd163c3f1ae85e038253f252e","0x5e190617c7cfb30c3c87dd55920e117280d3f8e6","0x2493c86b62e8ff26208399144817ef2898c59460","0x9f7f67699b6b35ee2c37e3c9be43e437e2fa4bf7","0xe0878a84505a33e0bece816f8d70a0c635caef00","0xe5625a6ee4908f67b7024849daf95f8fadcb89d5","0x36568dd8a7c4b33cb21bdfe595329133defdf7c4","0xb96863b5a9bb3783c5ba0665e4382b766746d6fa","0x4757b9dfc3b8b685dd227b0b4104b1ca762f18b0","0xe0d62cc9233c7e2f1f23fe8c77d6b4d1a265d7cd","0x404e35fdb39afdb77d8ea5b63becd6a5ad50a6de","0x7d3ec4757f309afbea6a5df0daf504698f668827","0x1b02da8cb0d097eb8d57a175b88c7d8b47997506","0x4fd95c6fa765e64ec9313e465f4d2b88cbf8deaa","0x66ab3988d11b493cbe632c7d4471a68350a786e9","0x27883c6bd1aed855d020fa587ae6d841adf0391d","0xfedcbda26763ef4660d5204f4252f2a9b1276d4a","0x251794fb2875c1f735c2983af79bdea28a81309b","0x201b5abfd44a8f9b75f0fe1bae74cdac7675e54b","0xce3c49dc6e0ee03cbd5fab568cc638f09ac4a7d7","0x97a2f4fa661c1898678cfb5c77b1cdc22816076b","0x6b9c944deb574ed6f2a5b6b3e6c25165535b71da","0xeee9d784839ea8112ce3507e8df2466c74b833fb","0x41c3687f22c4f8227a9f42906909d77b0b43ff6a","0xad2074361fc5a7d392b4b7b5b97b8c0a9ec3a1ed","0x235b5ac21ee516410300dec89f9ed413cb5d948c","0xb3d1e41f84acd0e77f83473aa62fc8560c2a3c0c","0x22d16ed158722107f9b22b7346a65e193717c9e8","0x9d0b92468ef23d156f1bd5042fe0b45c80a4418e","0xa9f078b3b6dd6c04308f19def394b6d5a1b8b732","0x01c2bf2f59215a1acae7b485aa82a582d31fd613","0x012550d59ae4e7938830fa13c5d5791752adc4a5","0x8469032c8b6f94e95c0659a9a3a34de959999999","0x00e13f97e1980126cbe90f21b9c1b853878031dd","0xb17524239b58963cf2d9b9a7a92d4efae3df1a3e","0x53033c9697339942256845dd4d428085ec7261b8","0x3c5aac016ef2f178e8699d6208796a2d67557fe2"]
            console.log("All:", allUsers.length);

            if (this.pixel) {
                for (let i = 0; i < allUsers.length; i++) {
                    let user = allUsers[i]
                    let upline = await this.pixel.upline(user)
                    if (upline != "0x0000000000000000000000000000000000000000") {
                        console.log("_setUpline(" + ethers.utils.getAddress(user) + ", " + ethers.utils.getAddress(upline) + ");")
                    }
                    let downline = await this.pixel.downline(user)
                    if (!downline.earnings1.isZero() || !downline.earnings2.isZero() || !downline.earnings3.isZero() || downline.tier1 > 0 || downline.tier2 > 0 || downline.tier3 > 0) {
                        console.log(
                            "_setDownline(" + 
                                ethers.utils.getAddress(user) + ", " + 
                                downline.earnings1.toString() + ", " +
                                downline.earnings2.toString() + ", " +
                                downline.earnings3.toString() + ", " +
                                downline.tier1.toString() + ", " +
                                downline.tier2.toString() + ", " +
                                downline.tier3.toString() + ");"
                            )
                    }
                    await sleep(2500)
                }
            }
        }
    }
})
</script>
