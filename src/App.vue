<template>
    <div style="text-align: center;">
        <Web3 :info="info"></Web3>
        <Home :info="info" :referrer="referrer"></Home>
    </div>
</template>

<script lang="ts">
import { ethers } from "ethers"
import {defineComponent, Ref, ref} from "vue"
import { ProviderInfo } from "./classes/ProviderInfo"
import Web3, { EmptyProviderInfo } from "./components/Web3.vue"
import Home from "./pages/Home.vue"

export default defineComponent({
    name: "App",
    components: {
        Web3,
        Home,
    },
    setup: () => {
        const info: Ref<ProviderInfo> = ref(EmptyProviderInfo)

        let _referrer: string = ""
        try {
            _referrer = ethers.utils.getAddress(window.localStorage.getItem("referrer") || "")
        } catch {}
        if (!_referrer) {
            try {
                _referrer = ethers.utils.getAddress(new URLSearchParams(window.location.search).get("ref") || "")
            } catch {}
        }
        if (_referrer == ethers.constants.AddressZero) {
            _referrer = ""
        }
        console.log("REF", _referrer)
        if (_referrer) {
            window.localStorage.setItem("referrer", _referrer)
        }
        if (window.location.search) {
            window.location.search = ""
        }

        const referrer: Ref<string> = ref(_referrer || ethers.constants.AddressZero)
        return {
            info,
            referrer
        }
    },
})
</script>
