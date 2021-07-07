<template>
  <form class="mx-auto text-start" style="max-width: 400px;">
    <div class="mb-3">
      <label for="inputSymbol" class="form-label">Token Symbol</label>
      <input type="text" v-model="tokenSymbol" class="form-control" id="inputSymbol" />
    </div>

    <div class="mb-3">
      <label for="inputName" class="form-label">Token Name</label>
      <input type="text" v-model="tokenName" class="form-control" id="inputName" />
    </div>

    <div class="mb-3">
      <label for="inputShareSymbol" class="form-label">Staked Token Symbol</label>
      <input type="text" v-model="shareSymbol" class="form-control" id="inputShareSymbol" />
    </div>

    <div class="mb-3">
      <label for="inputShareName" class="form-label">Staked Token Name</label>
      <input type="text" v-model="shareName" class="form-control" id="inputShareName" />
    </div>
  </form>
  <button class="btn btn-primary" @click="create">Create DAO!</button>
</template>

<script lang="ts">
import { ethers } from "ethers";
import { defineComponent, PropType } from "vue";
import * as dao_abi from "../assets/DictatorDAO.json"
import { ProviderInfo } from "../components/Web3.vue";

export default defineComponent({
  name: "CreateDao",
  props: {
    info: {
      type: Object as PropType<ProviderInfo>,
      required: true
    }
  },
  methods: {
    create: function() {
      const interface_ = new ethers.utils.Interface(dao_abi.abi)
      const signer = window.provider?.getSigner(this.info.address)
      console.log(signer)
      const factory = new ethers.ContractFactory(interface_, dao_abi.bytecode, window.provider?.getSigner(0))
      console.log(factory)
      factory.deploy(this.tokenSymbol, this.tokenName, this.shareSymbol, this.shareName, this.info.address)
    }
  },
  setup: () => {
    const tokenSymbol = "UCT"
    const tokenName = "Umbrella Corporation Token"
    const shareSymbol = "UCS"
    const shareName = "Umbrella Corporation Share"
    console.log(dao_abi)
    return {
      tokenSymbol,
      tokenName,
      shareSymbol,
      shareName
    };
  },
});
</script>