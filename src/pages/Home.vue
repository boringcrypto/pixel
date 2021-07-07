<template>
  <h1>Dictator DAO</h1>
  <p>
    Dictator DAO is an organization where the token holders democratically
    elect a 'dictator' to operate the protocol. Whenever the DAO isn't happy,
    they can simply elect a new 'dictator'.
  </p>
  <router-link to="/dash/0x0A1DdA7149FeE6c47770609cCD205Ff0Efe7F761">Test DAO</router-link>
  <router-link to="/create" class="btn btn-primary">Create New</router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { ProviderInfo } from "../components/Web3.vue.__VLS_script";

export default defineComponent({
  name: "Home",
  props: {
    info: {
      type: Object as PropType<ProviderInfo>,
      required: true
    }
  },
  methods: {
  },
  setup: () => {
    return {
    };
  },
});
</script>