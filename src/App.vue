<style lang="scss">
//@import "src/scss/main.scss";
    body {
        background-image: url('/src/assets/bg.gif');
    }
</style>

<template>
    <div style="text-align: center;">
        <Web3 :info="info">
            <template v-slot:none>No web3 provider was found. Please use MetaMask.</template>
            <template v-slot:connect>
                <button class="btn btn-primary" @click="info.connect">Connect Metamask</button>
            </template>
            <router-view :info="info"></router-view>
        </Web3>
    </div>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue"
import Web3, {EmptyProviderInfo, ProviderInfo} from "./components/Web3.vue"

export default defineComponent({
    name: "App",
    components: {
        Web3,
    },
    setup: () => {
        const info: Ref<ProviderInfo> = ref(EmptyProviderInfo)
        return {
            info,
        }
    },
})
</script>
