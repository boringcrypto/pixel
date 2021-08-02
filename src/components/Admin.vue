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
import { ProviderInfo } from "../classes/ProviderInfo"
import { sleep } from "../classes/Utils"
import { Block } from "../types"

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
            type: Object as PropType<PixelV2 | null>,
            required: true
        },
        blocks: {
            type: Object as PropType<Block[]>,
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
            if (window.provider && this.pixel) {
                const signer = window.provider?.getSigner(this.info.address)
                let p = this.pixel.connect(signer)
                await p.withdraw(ethers.constants.AddressZero)
            }
        },
        async mint() {
            if (window.provider && this.pixel) {
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
            console.log(JSON.stringify({blocks: this.blocks, updateIndex: this.updateIndex, version: this.version + 1}))
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
            let allUsers = [
                "0x0000000000000000000000000000000000000000",
                "0x30a0911731f6ec80c87c4b99f27c254639a3abcd",
                "0xc37899901ffdef1b6baf95fd4081d82942a0a85a",
                "0xed3c50209648e2b4794d47b0973e2b95e6b756ce",
                "0x4ef416aa741053b5f3968900379df2e3d0229065",
                "0x3185fd8f4578f746441eff27cebce89480904c20",
                "0x1ef5526ee1a6d8c596cce90e774a2c41372cc8cd",
                "0x528d4e4e0dbf071ec23013f06d8487bad5a8a68b",
                "0x47ea9f2d81aff9f539348a476f45edbf5f2122b2",
                "0xa8ec58dd533e0cf82ec417bca3c4dbca48ae5a8b",
                "0xc858dd4f2a80a859d491a16beee6708a6743bfb7",
                "0x29a4ea26ac9eed2fbdcd649cfd707948b18f4c67",
                "0x496ea957960bf9a2bbc1d3c114eaa124e07d0543",
                "0xf07504a96601b35dd702b07ecc57b2b169866f57",
                "0x0a26e272a2d722799b7ff39a1e5128a379b8582c",
                "0xc572c95996653ae98ec3a59d9a511eda142b98c1",
                "0x7bf4d5e579a26dd09f1dddb2391566e7ba575b5b",
                "0xb3160404ca9581784b3dec9e85bcd354397b8c72",
                "0xb6207facfbc0c7373425d9671ea0ca23459e9796",
                "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
                "0xa0bf4e5640e5db6fa82967d2c160e35a9a28ae83",
                "0xbcd4b2f3a07f07841b9d66cd9b006574e928eeb0",
                "0xc70c99c1485eccc693e434433edbf5c27f937499",
                "0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0",
                "0x79b1a32ec97537486e75d99850bd56ecfa09d643",
                "0x90249ed4d69d70e709ffcd8bee2c5a566f65dade",
                "0x9d0b92468ef23d156f1bd5042fe0b45c80a4418e",
                "0x0ab9e77400392de635134761308f67a77f010a10",
                "0xe0878a84505a33e0bece816f8d70a0c635caef00",
                "0x897656b1fb6c3688e48e1dd8259f7e092364754d",
                "0x13786f832c8836cc7af3e0bdcbe82987ed4d38cb",
                "0x53be8a9afbe6c38f39f73bcb29cc87e37c1000af",
                "0x38274785d72ed15af7c40685e4a54a60bbb14668",
                "0xff9078b4ed84859401930184e8d6926a70857596",
                "0x0f85a912448279111694f4ba4f85dc641c54b594",
                "0x23e44614d00fa86b1642df1d1c1a624bf4743a23",
                "0x3d216ebbda0bcd9bc31ea4e8116158221fc34543",
                "0xa3bb988e1b551df71c1e785415acb5d02043f934",
                "0xca5e2d9d4ead9da6f33bba321a6c7dcf6f6fce17",
                "0xe741f716049de5514e8304b1c666ee2b18f7027e",
                "0x5434289767bb094dadbb8d1e5d58b47ca5729063",
                "0x3d9b0a7ef1cceada457001a6d51f28ff61e39904",
                "0x05dc467b8173a6c4e8fb222df4e6b3a80b9d1673",
                "0x357dfdc34f93388059d2eb09996d80f233037cba",
                "0xedeb8c6da59cd16cf38021e1aa12c18f2c7b11ee",
                "0x5e190617c7cfb30c3c87dd55920e117280d3f8e6",
                "0xce3c9e357425c99cc27dc9bf963d06e739811465",
                "0x8d071fa6905e1fb872903603a6239947c03fd450",
                "0xd20b976584bf506baf5cc604d1f0a1b8d07138da",
                "0xfe9bae5f3a30746de18e59f6e6f9d600e90cfdd4",
                "0xc16414ac1fedfdac4f8a09674d994e1bbb9d7113",
                "0x55f2e85fd0c6fb9f6ccfbd9294c08c9171df13f7",
                "0x1200b4a3a90dcdc504443130572e840c988ec13c",
                "0x00a5af2d7da07df76073a6f478f0fb4942d2659a",
                "0xf2e4209afa4c3c9eaa3fb8e12eed25d8f328171c",
                "0x944bae1afde5417b6226ff13a227636c288e5695",
                "0xc25e4d9c5de4bdf7d0b940debe45d02f654a5bce",
                "0x199be825fa1d5f346f41956da42bd3479055c5a6",
                "0x9a4773eeee73e34e1ee0e9a64e4b7453b0b04246",
                "0xe795e863673f4934ea9dda6cf433f46e6f450e22",
                "0xedfc79af9421fb3cf26f8877e71417910cd8ec69",
                "0x3c10e6f13abc22df2eb9b898b0c533d78d1360bb",
                "0x0698daef2a14e5aabce317fbadb2e5c568a6070b",
                "0x9fa10388d2bb8b7d8a2c8586772876d6302d4cb3",
                "0x0e2353516eb6208aa84a552b9a1ee5f13edada57",
                "0x0658d1467080e660b92cb40dfb021ce12fbdf161",
                "0x76d2ddce6b781e66c4b184c82fbf4f94346cfb0d",
                "0x43766bcec4343b7ba50e48490c3d000e4c8b0600",
                "0x60b7ced7edd929a8fc9a1211aad34b6020311dff",
                "0xc11d9fd49c6745dac498a79bf5799c2666866f5d",
                "0x91d35872af0bafa35642a4ce0db540e74be3cc66",
                "0xdb6f1920a889355780af7570773609bd8cb1f498",
                "0x6385455e62a54b4dce013db26429119f988801bf",
                "0x2c38ac52e0aead03622bd0b102963aa26430c551",
                "0x7f87f257e788c66dee81f81d4091b245d4f57f52",
                "0xd69efaeaa701db84fc248874f731712c3867eb0f",
                "0xee5c256721abe58af6f582c0efd6774dd2765038",
                "0xa03d1648be58e6957c81c1c201236e189b6ee6af",
                "0x67813543101ed8d7bdbae9548806caf8799552f8",
                "0x5e53ce97fcd3abe46f1ab45abb3e9a9c5e19f193",
                "0x77fb740096d2bd63f23995c7db8b46502f556377",
                "0x38fdb9fd8e4b16b5b9fa41964f7929f015caf420",
                "0x0f278c56b52b4c0e2a69b30a0b591d237c783907",
                "0x5f9afbf2808e60b8960c369bd757aa01bbee3419",
                "0x47ea0ab486f9d00f16d9f248e3388586e061f7f8",
                "0xd515c8cbbbfde09e119378bdbdc3eecf6aab8e2b",
                "0x3d343914eb418f465401e617a19cc9dd072922e7",
                "0x895526e2eef96243c1b781757e9e0a7fbb2c47a1",
                "0x544ca06341830ed7f6473351d33ee7a42c2cfa76",
                "0xe749ab474583622531d4d996f41035bbc6411891",
                "0x48a6ad8c6481498ea2df50e049c771b81eec2dca",
                "0x2b39694f5014a06773d8bc491715c2fe81d11668",
                "0xc3b4a67e8c8120cedccbbf392f18d622ffa34fc0",
                "0x6e9530067c3ff4dc48f522260ef81ce4f961aee9",
                "0x975421d06eb75eed183c14712ead426bb11f9853",
                "0xce1458fd45007f9ae75b46ae197e656e96a19f00",
                "0x30ec78ca9e112123e30e9a74838be38e0b9ccf13",
                "0x87279a012d49f44ed3a347c50dcc7cd0d7dec61e",
                "0x185481774fd30b770c80495b5fcd269d05d78631",
                "0x306bf96102ebe58579dff7b3c3c54dc360bddb30",
                "0x651c636fc2adbb79fb2c8fbb1cf3a6f76ff1fdd9",
                "0x2b6a21269140fcafd2a73af859083e8cdadbeee6",
                "0x7588ada969bcef3200fd2bfafb3dd3e0c87aa00b",
                "0xcb0190c6ae615755c2353316399bab2e43a0a05e",
                "0x57d9b1e86a1f4a0b76bec742f8e9e6f70650e6b0",
                "0x0fadcd8d7862bb2b39d63d6a30c6b7c660c41d32",
                "0x117f7218c68f990d71277bcbaceebec2fefb81ef",
                "0xe7967e618010c7561f5acd59ab9790455370e65e",
                "0xece1477d3c350a42486d2dc802f6243e99409a41",
                "0x9d0607968f92163d999504d14d39150a58a6e43b",
                "0xd9b49a81ee72af3c026a2c144c9ffd678a78c8b1",
                "0xe6d2032ac650850428e664e7680e9c8408971303",
                "0x3815eaa0bfef42587c751374fab6a0fafe7600a8",
                "0x2c1e4a2f58baba8cef414610bee783becf22da76",
                "0x24bb7e0f4f9bad7f147a865e710c45f893caf675",
                "0x346aa49f590602bd2d0b83f905647191c11fe195",
                "0xaefa62eb087c326be8975c639d6a7d98f48fa05a",
                "0x9a39659bab91b3e7c815bc1964837edc2cf8f13c",
                "0x45f9018a8ce19a8424cb5caeaf019168c8ee6bb8",
                "0x201b5abfd44a8f9b75f0fe1bae74cdac7675e54b",
                "0xc93678ec2b974a7ae280341cefeb85984a29fff7",
                "0xaf1ca20615f84c48782f2f23b3cc737db9c3514c",
                "0xebaca45c63ba3981b083064a8dcf5d2999430bd6",
                "0x4981d1b985d0b486009da7e5a01035602f57a334",
                "0xa6029ecba580161dbc6fd0bac3ed7854c0136b7b",
                "0x73f432da307525b6590c858bf458116322d50d16",
                "0x507cc427c8fba38b81e891549189e6718862af45",
                "0xf49ac88e0fdd009af1921cfcb403be993e40df6d",
                "0x9c3a113ac3d5835276f488b5ba9f5a5accebf80b",
                "0x55f7bfde54728b39cc103f729f8b64191af59488",
                "0x2e86d29cfea7c4f422f7fccf97986bbba03e1a7f",
                "0x4d9fed7af38c4691e992d5d6396d8b2fc773fc99",
                "0xf497427c896263342996c181d4af8f4e60899ac3",
                "0xde793eed0bd59b0ab02390ae3326a807bba6c4be",
                "0xe0634b61c9629aa84c4ea6428e61976c88c4a947",
                "0xf2da8b05f3a9d20e3331326ee48d19a21842dfeb",
                "0xfb42ea5c64ffdafcd8022fe321e1ef0197a8fc8f",
                "0x8a47ee6008ab47174a90019413746309ef6d13dc",
                "0xeb8ec5710903c2ed9d26395464a7bfcd754a38d1",
                "0xf1228c34651348f12d05d138896dc6d2e946f970",
                "0xc692ca93838dbb3d85c0726869de56b9101b8c3f",
                "0xfe0b3cf733d60cb25e433d966b1d58b0b23ed44e",
                "0xf3d871341dd9f341d54ed8ef89906deb84c0f90a",
                "0x5a7ff73ef571661c533fa969560ad61a51211f0a",
                "0x4623c412144a2c02996474662e872af5687f4d76",
                "0x8bef9a4106900d15e12d16336f15abb6034fdb2a",
                "0xb6ca5d1ed0ca4bf8444c9dee2d068a9f4c5e2e92",
                "0x747cd756f653f0e257a71b39d4c1fd5e69996da5",
                "0x4f33d323454ebd746415b6c119687f18fc145854",
                "0xf3ba4250c3a2fc5b4dd5a1b394f76037f1fdc28f",
                "0x300588b284f30439bcb32e8ac85321410074e31b",
                "0x0b877312b0d24d2246e4711e2df9b2aa10bd659c",
                "0xe03c71d9f4b2ccf8026b495cc01f3763b66f4cb6",
                "0xc77c3efb55bd7b0e44c13eb27eb33c98597f0a68",
                "0xfbda25e7147edf11bcd561f39707f74a80cfb81a",
                "0xdca06c2683cefe7e16e9a119a37627d5ceb3f15b",
                "0x7ebd3e9cf6367bb2e6ba4b8db7806d286767fece",
                "0xd69c9fb62f52339e7ad423cc56e44d83777ade15",
                "0xac8728faefb65f0a59cab5340f30fd0df38bb09f",
                "0x51845fad9e2afbc9f6f07cfd60fdba45df1e3c2d",
                "0x26e2efc8ed94a57e49de0ea76623d92fda8665ce",
                "0x588d91abf5192a0f0dc026bf05f510253bd1cf51",
                "0xd50ff7fc87e1100b138c39f812571c8e6a1a2525",
                "0x5da68351bd082abda73e42ac981db51d9364fe69",
                "0x0319000133d3ada02600f0875d2cf03d442c3367",
                "0x5ce19256d7a4f7e35140b0f4a89b44e5e6cabf47",
                "0x0e0ba63a3eb3a91ab5b23efc4819a689b4b2f803",
                "0x1cfe0fa9fc2bc61ee2e310274a71955d3dd8e547",
                "0x71ea4de67ccfd1817683a15c69097f5bfbaa47b2",
                "0x09a87bc37d1f2ee88fabc572a036e829da601e16",
                "0x347985b3a275d11199005b1f2f222f883e42bd1d",
                "0x563d132c12c4b778b7669e1432e812548bf023d0",
                "0xe27f2e8321fb4c32525a4ed86d2902dba63491e4",
                "0xb06199db17c4d49ad2e296637143e3922e9ffdb1",
                "0x99cf484640b87ac7ca5930ea35642654391c764c",
                "0x5a98d8a5e0652c09dd557d785019d8d65afdc60e",
                "0x7273fbfbd803df55859b4b0a0f231190b1286ae0",
                "0x0ccaf6d978efc9eeb52030375cf8e8cfc9b1cab4",
                "0x3c5aac016ef2f178e8699d6208796a2d67557fe2",
                "0x9e6e344f94305d36ea59912b0911fe2c9149ed3e",
                "0x519c2d687f51497fde6dcb967234f5d947d2df75",
                "0x7d9ea6549d5b86ef07b9fa2f1cbac52fc523df65",
                "0x3935fd3f1b0ca70e29e55dcd530a4144e2e810b7",
                "0x0333c75557912d591b5f79b38c56799f48ff3688",
                "0x7c80ffd697cc4eea2d39879df80910151dd2abfc",
                "0x686d1da2fc8c52a24e5a83c285274bd8bfa7102e",
                "0x77d85cfa28949c795022d6284e3651a513e1cecb",
                "0x4083ab5d0645b263d069b1643d1b92ba79b0d278",
                "0x62fafb31cfb1e57612be488035b3783048cfe813",
                "0xa83f6bec55a100ca3402245fc1d46127889354ec",
                "0x7f825692dfae7107d16bf4e2071fe06b1bc72297",
                "0x16925f0d9f4d74e4918e00a30010cc523fb751d2",
                "0x9435428e8e5f619f9a31a9c1e1c83250d8088892",
                "0xf75032b4e53c5287556424668da0cb5c99c2a1be",
                "0xa7e25c1684fc66fc95c40568e9ba77806cd5358b",
                "0x9086a51a6f6b4bdc45d88bfb9201202fa0c340d3",
                "0x46c1794df805bfb5761726c60a8148158dab87e2",
                "0x72e30bd8d69311fad86dcb8c7edf46294b432343",
                "0x411673bcff405dcadfe7a0d1e1c255d391a9033a",
                "0x17901e99e4757df5102e15253575761cc71d8e95",
                "0x05ea34e37b28962b9f17fce9cff68637ebb80e58",
                "0x0f5557a06ba7fd9e4bd67c18efd38a4da768f320",
                "0x2656a63adcfdd4b96d146bc18513ba10e595e451",
                "0xe0c810ae609cf72b4f9053b49e64c1c184ef9311",
                "0x2d198cb728acadccff21e8057c46fbd55f392955",
                "0x0e22b17cbc92cc9bfaf06e875dfaf1fdca5d3715",
                "0x18657ec15013bc2a5549d5d69e5998a5f4884bb9",
                "0xe4da32444226ab63b1f8e9b7322561b6e9314fc9",
                "0x58e6884f4c0c5f8114854ef7322b4cf03086f1fb",
                "0xb429981ace804e54b64d8705ecf78ac3c861c824",
                "0x60a543647a1ecaccaadfc2df27a2d1d74e60a39f",
                "0x02aef62867532fbddf4521b3889a5af09b5333d8",
                "0x97a880bd9cfc8e3ba744acc68ea23aab6871d205",
                "0x1328e154a9c1dbc314a5f91341ed95771159cd57",
                "0x4b3f301699a0b12fd47306becb2db8f679be674c",
                "0x0b51b640a32e95b189e8b3db300a6b23303971d7",
                "0x489ac3ef4b1159b8b82c15240cadd059dfcaba28",
                "0x14aa530f606ae4c02401ca031c4448cd9ee09f3c",
                "0xf1180102846d1b587cd326358bc1d54fc7441ec3",
                "0x9e54af0a81b6b94007f39c3421511942aa90b5ac",
                "0x6be3c102956b17fb34430291fb4f105c17f79131",
                "0x6b9c944deb574ed6f2a5b6b3e6c25165535b71da",
                "0xf590a9e8a1414649abeb54e85f22ea6ed33b20ce",
                "0x6a2006a5ecd0e7999667798e2bc5597444f6bd3c",
                "0x03a05c4dd78c2387f3a1645e46a0c5cbcef5cd81",
                "0xd477acacdc6f3dd76a2771a03ad2fc1ac0eca222",
                "0x12839d2532d37d6ae00f2b7ef9ffbb9b4bb31fb2",
                "0x656e04dc572257c15ab647f27cf0f71a773c2490",
                "0xf59e78f88bb14c8da3638c4d9c3906c26c9bc1c3",
                "0x786103a19bcc1c5f97887be5fe1eba9ac743cbf7",
                "0x8ea1d57413621d4dbd3a676c786d268b60925ee1",
                "0x092471cffe4b941c896bfec001fe8bcc73a991d9",
                "0x265294a3abcd8aacc36daf3d15b9044b1f6b17ac",
                "0xdd3c7daf175266eec1b830544bd5e40f1649cc61",
                "0xb6f5b3624d51fba03a801d9ad3586e8a7bbb7575",
                "0x1fac6eee2197c98d1ef0f166eccffa8632e9a279",
                "0x893d427c758ffeadd934fa1acb54d8483208d82b",
                "0xf31cdac4fc9397d849787486bab2939fd962aec9",
                "0x5acfd914f2dfd41f07f27407bd7936f43d0db167",
                "0x934c44b813dc4c9ca08d5fd0d5190447dcadeb51",
                "0xf8d093d95b800ced71c66e6c94997dcbd72c2535",
                "0x1d7d835f46b3e4b6dacfc4431b0ecaf331816761",
                "0x4aab3a066b2c0f48c1fd94ac15b79cb1e313ff56",
                "0x251794fb2875c1f735c2983af79bdea28a81309b",
                "0xd4b2905ee116d13664840f67c9374b768d1297ed",
                "0x131ee3be2e3803bf9e8976ddf0306236f001b7f2",
                "0x4757b9dfc3b8b685dd227b0b4104b1ca762f18b0",
                "0x4e880933aaa461a5fbd0d499f1e142d78f77c8ea",
                "0x05f0ba0f63b401bc9b86089265cee2f79c955768",
                "0x25c89a394e37268c33628bd3cc54908b5f8d1bd5",
                "0x41361ad7c8845fc628b2370ac78e1e98a70960dc",
                "0x7f3d32c56b94a9b7878fdfac4f40aaa2a6e11edf",
                "0xe61a0809ef3f1d2d695555413ac354284bf23915",
                "0x235b5ac21ee516410300dec89f9ed413cb5d948c",
                "0x835f394f3d770b6ff818303f045e39f541b3d781",
                "0xc53f5a27021455293aa34da308280abc4cad210a",
                "0x17d8e3268b7c81111c98b7d3ccea55072a32d6c0",
                "0x41aa0b6d60732da0001b788bb68c2b943a4a589b",
                "0xa03dee508d09ba9401a661f154036b36328e0f0c",
                "0xb17524239b58963cf2d9b9a7a92d4efae3df1a3e",
                "0xd5f8a40d7b18b62e29cfd7df55fc0a01617945bd",
                "0x62c04cc455520708958c9ce3fafff51745e42189",
                "0x6c3c301bb3af46c86205844c7ad9ef8bd6593baf",
                "0x862c6f0373ac129fc66a324b234943139ca10c92",
                "0x256d49d87cbb877d26e2bcf2bf0a40d26bdfb5d4",
                "0x54d925f320400139f9f2925767f1ec68b027e7c0",
                "0xb3d1e41f84acd0e77f83473aa62fc8560c2a3c0c",
                "0x1a6049c6362d35c768470f1e3684d60d36cf4e47",
                "0x2931839f032597e1ecef70dd71f309acc50fe7b8",
                "0xda4c79ccfdcbfa9128b1e328f77e5f9c6ad72a44",
                "0x2b19fde5d7377b48be50a5d0a78398a496e8b15c",
                "0x5b7dcb8ce882f3d4c953c9f9d79e08730efe4939",
                "0x083a1457d8fc367c664b59886d651910fb9e9a70",
                "0xd7e4001eddfc111758f732488d9e95cd835fce76",
                "0xbf2116d0a79da0e5710df8ab00eb20415bca94c8",
                "0x84e5bc3df0df0f543648f250443c6f4077218312",
                "0x630be16e634e2638403f0571691c1fabfdf71563",
                "0x3a4e1c8ad003a9c977457c059c8f202c070622bc",
                "0x4e9ba296decfb2bac193ecb546407be5c2c21543",
                "0xf3cda35b2fb88aff0e8df3499ec88959d13a3b5f",
                "0x19d2991076f65ca610d4186001eff4cf64ed1edb",
                "0x4fd95c6fa765e64ec9313e465f4d2b88cbf8deaa",
                "0x1028483735f79a7d7c2d35f1988406e7c8594f0b",
                "0x81f185cb71a4b98777a5ee50ca55e80608db61c1",
                "0x0b981d98e857c888e00d2c494d24dc16a12f8f3a",
                "0x431b5ddb0ace97ebc3d936403ea25831bad832b6",
                "0x28c24f2da9b6e517968300eb1a4f4ae1b235238e",
                "0x20c27c130155685070a7bf3cfe7084e70e06bf64",
                "0x1adcf07389b1f6605c44a7683c50a5243829a92c",
                "0xc962ba9a1a45b79c1228636db5a6efa4a4b75d76",
                "0x652c2ecf7ee7c2a1a635d83bbf456ef0dbae1cde",
                "0x22160911a56bbda683ac09335886eb570e340dac",
                "0x27883c6bd1aed855d020fa587ae6d841adf0391d",
                "0xad2074361fc5a7d392b4b7b5b97b8c0a9ec3a1ed",
                "0x2b23d9b02fffa1f5441ef951b4b95c09faa57eba",
                "0x8f54c8c2df62c94772ac14ccfc85603742976312",
                "0x000000000000000000000000000000000000dead",
                "0x00e13f97e1980126cbe90f21b9c1b853878031dd",
                "0x012550d59ae4e7938830fa13c5d5791752adc4a5",
                "0x01485557c2bc6e26c7187ff4cc38d5d9474405d4",
                "0x01c2bf2f59215a1acae7b485aa82a582d31fd613",
                "0x0655e4deaa64b4c6da6b68db283934a15d9afc8d",
                "0x069e85d4f1010dd961897dc8c095fbb5ff297434",
                "0x070ae2385dedc927f821e75434e881ca5fd549fb",
                "0x0d35324061f620f66af983dee02076b2e45e57fc",
                "0x157b6c44f47ecd30c0a2c428a6f35dbc606aa81b",
                "0x1f427a6fcdb95a7393c58552093e10a932890fa8",
                "0x206971261b391763458134212feeab2360874676",
                "0x218d75b17f491793a96ab4326c7875950359a80c",
                "0x22d16ed158722107f9b22b7346a65e193717c9e8",
                "0x2493c86b62e8ff26208399144817ef2898c59460",
                "0x315388deb1608bdcf532ce0bf6fc130542f5132c",
                "0x36568dd8a7c4b33cb21bdfe595329133defdf7c4",
                "0x3c0a3d1994c567fd4bf17dc5858ec84ff1f87501",
                "0x404e35fdb39afdb77d8ea5b63becd6a5ad50a6de",
                "0x41381649b2231cafc8293f501bb3df422aeba5e4",
                "0x43d20d5efa78ff0e465dda2e58109f9fb3a2bece",
                "0x4cb1a8bb524ec318aaad1c63ca51b2189df00560",
                "0x53033c9697339942256845dd4d428085ec7261b8",
                "0x58a5d0d2d5cda76806f48a3b255d2b0238f965c5",
                "0x592f1a037eb4cbe529e80ca0f855525e13993380",
                "0x5b52bf12e7d8737ed61f06147fc655514679ce72",
                "0x5ba8be640c84e294bd7285b4d7a676ed8e1ff2ec",
                "0x62b979923922045fb5a77bed9e0753941b1da52c",
                "0x66ab3988d11b493cbe632c7d4471a68350a786e9",
                "0x7a4a8f7b3707ecc86b50cae33f83edc5f8c8f57e",
                "0x826a471055333505e596f424348983af0aa8411b",
                "0x8469032c8b6f94e95c0659a9a3a34de959999999",
                "0x8fb07b21383d331f3752a7590b0cfeac85514a1f",
                "0x94e169525d86df638cc51d801eac8d60275a8047",
                "0x97a2f4fa661c1898678cfb5c77b1cdc22816076b",
                "0x9a568bfeb8cb19e4bafcb57ee69498d57d9591ca",
                "0x9efb6d49fd5496626e80ad0b07017744ae9a0efa",
                "0x9f7f67699b6b35ee2c37e3c9be43e437e2fa4bf7",
                "0xa2db5f9313a553f572fa44aa1ba5b5871ed68406",
                "0xb11a0ce3a6ea30d8aa906e0f84eb92be8af5afcb",
                "0xb2f6be1d6c18514eabdc352b97b63273608af8fe",
                "0xb4a3f907ec1611f22543219ae9bb33ec5e96e116",
                "0xb5ede9893fccd62a110fd9d0cce5c89418a8540b",
                "0xb96863b5a9bb3783c5ba0665e4382b766746d6fa",
                "0xb9956c74639d8e11c64d8005dc0c2262945af074",
                "0xbcc1a3455bfe501cd163c3f1ae85e038253f252e",
                "0xbf912cb4d1c3f93e51622fae0bfa28be1b4b6c6c",
                "0xc61a2bb414a41ce492a94b5f59f5fd72f3a71c97",
                "0xc9fd84728f98df2820896db89d7d47ac9998228c",
                "0xce3c49dc6e0ee03cbd5fab568cc638f09ac4a7d7",
                "0xd264da372aefcd5269ca212bfd3c56e8e95bccca",
                "0xd6e371526cdaee04cd8af225d42e37bc14688d9e",
                "0xdf547eab8944d9ef06475df8eee372b9808f425e",
                "0xe0d62cc9233c7e2f1f23fe8c77d6b4d1a265d7cd",
                "0xe5625a6ee4908f67b7024849daf95f8fadcb89d5",
                "0xe744048f7d1b63b4e233a1d63c3153b913d7a2cc",
                "0xe9f654994f1135ebfab3183f50603da5c6abd4c3",
                "0xf58aa8e0832deac36550296dc92fc091d5de2b7d",
                "0xf82a5d0168cc93e63dc217314adb87f15891d124",
                "0xfd5a25ef7396384c2d43645f32609bc869c36208",
                "0xfedcbda26763ef4660d5204f4252f2a9b1276d4a",
                "0xa3bbc5a9f32c12f6e51e83bc520ed82b261b9798",
                "0x62ba33ccc4a404456e388456c332d871dae7ae9e",
                "0xda918c71780b2ae1b8d4c0546b1aab0cadc21e4b",
                "0xd852b4b77417368d579c1bee592f3f630028b25e",
                "0xf07a2439296e07bc4320af924e655a01fb69d89c",
                "0xaa2c4825e6c5eb45d63519ee0ff267a387b197bc",
                "0xd2f91edd7dd5388737552d18d99555313dcd78e0",
                "0x328809a567b87b6123462c3062e8438bbb75c1c5",
                "0xfca59abdabedc4eb54c3c557ab82ca5d7c2f96f3",
                "0x720c9244473dfc596547c1f7b6261c7112a3dad4",
                "0x0764dc400c280ff2b6d1f0582969c0c668271340",
                "0x1eef9b7b06062f1786fd99aea49ade90cca4c516",
                "0x31529d22fc85e31e0974a486f6cd7e056dc848f6",
                "0x4656e28ed7c4aacd1e7fb98d3c8041d6de04c08f",
                "0xfd543d0250ca20eb92bd296a79e9e5cef1c84fb6",
                "0x183bdb344a07ee3d27f07ac4799a56e4a2fe5439",
                "0xf9ea1a3d185ea9bb6667bdb02acc1e705a6a10b8",
                "0x1d97c1fa1fe2378f484571bed33a89eb165e0ae1",
                "0x3788aeb49692ac53b55a25c40b40f1d3735132f9",
                "0xe5b65108d0347725dd70817c59faee66de4e21e0",
                "0x7a4eaa613eb74281c3c37a3d8a05effb5ee35887",
                "0xe97b4adeed8c29de314019441fb42d009b871987",
                "0x15b8166dbd76fa28f0221bfcbb7e17f2247162e1",
                "0xbf5310fae4d7a0c6df0452bcda09aefa2748ad59",
                "0x9c64e4fe8c13afd4176913f307c3572191c65c92",
                "0x54c375c481f95ba43e2cecd6ef30631f55518f57",
                "0x7705e47bd6eb6dc5a11aa1839639f3dc6e1a6eaf",
                "0xa17f7de14ee47efb1c822a7610781c3679bcdf92",
                "0xa9e21228349800b1f7ebac82b41643021269db0b",
                "0xfe052ea1476cb1287cee5fac9c6fccdc3a2a9984"
            ]
            console.log("All:", allUsers.length);

            if (this.pixel) {
                for (let i = 0; i < allUsers.length; i++) {
                    let user = allUsers[i]
                    let upline = await this.pixel.upline(user)
                    let downline = await this.pixel.downline(user)
                    if (upline != "0x0000000000000000000000000000000000000000" || !downline.earnings1.isZero() || !downline.earnings2.isZero() || !downline.earnings3.isZero() || downline.tier1 > 0 || downline.tier2 > 0 || downline.tier3 > 0) {
                        console.log(
                            "\"" + ethers.utils.getAddress(user) + "\", " + 
                            "\"" + ethers.utils.getAddress(upline) + "\", " + 
                            downline.earnings1.div("1000000000000000000").toString() + ", " +
                            downline.earnings2.div("1000000000000000000").toString() + ", " +
                            downline.earnings3.div("1000000000000000000").toString() + ", " +
                            downline.tier1.toString() + ", " +
                            downline.tier2.toString() + ", " +
                            downline.tier3.toString()
                        )
                    }
                    await sleep(500)
                }
                console.log("Finished:", allUsers.length);
            }
        }
    }
})
</script>
