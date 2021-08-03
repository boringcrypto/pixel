<template>
    <div style="width: 480px; background-color: #ccc; color: black; border: 1px solid rgb(169, 216,235);">
        <img src="../assets/ambassador.svg" style="height: 160px; margin: -24px" /><br>
        <table v-if="data.userInfo" style="width: 440px; margin: auto" class="blueTable">
            <thead>
            <tr>
                <th></th>
                <th>Payout</th>
                <th>Lemmings</th>
                <th>Earnings</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Tier 1</td>
                <td style="text-align: right">20%</td>
                <td style="text-align: right">{{ data.userInfo.lemmings.tier1 }}</td>
                <td style="text-align: right">{{ data.userInfo.earnings.tier1 }}</td>
            </tr>
            <tr>
                <td>Tier 2</td>
                <td style="text-align: right">10%</td>
                <td style="text-align: right">{{ data.userInfo.lemmings.tier2 }}</td>
                <td style="text-align: right">{{ data.userInfo.earnings.tier2 }}</td>
            </tr>
            <tr>
                <td>Tier 3</td>
                <td style="text-align: right">5%</td>
                <td style="text-align: right">{{ data.userInfo.lemmings.tier3 }}</td>
                <td style="text-align: right">{{ data.userInfo.earnings.tier3 }}</td>
            </tr>
            </tbody>
        </table>
        <br>
        Your ambassador link:<br>
        https://pixel.inc/?ref={{ info.address }}<br>
        <br>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from "vue"
import { LocalData } from "../classes/LocalData"
import { ProviderInfo } from "../classes/ProviderInfo"
import { PollInfo } from "../types"

export default defineComponent({
    name: "AmbassadorProgram",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true,
        },        
        data: {
            type: Object as PropType<LocalData>,
            required: true,
        },
    }
})
</script>
