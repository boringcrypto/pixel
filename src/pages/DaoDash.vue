<template>
  <div v-if="loading == true">Loading...</div>
  <div v-else>
    <h1>DAO Page</h1>
    Address: {{ address }}
    <br />
    Supply: {{ totalSupply.toString() }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { DictatorToken__factory } from "../assets/ethers-contracts";
import { ProviderInfo } from "../components/Web3.vue.__VLS_script";

export default defineComponent({
  name: "DaoDash",
  props: {
    info: {
      type: Object as PropType<ProviderInfo>,
      required: true
    }
  },
  methods: {
  },
  setup: () => {
    const route = useRoute()
    const address = route.params.address.toString()
    if (!window.provider) { return {} }
    const dao = DictatorToken__factory.connect(address, window.provider)
    const totalSupply = ref()
    const loading = ref(true)

    const load = async () => {
      totalSupply.value = await dao.totalSupply()
      loading.value = false
    }
    load()
    return {
      loading,
      address,
      totalSupply
    };
  },
});
</script>