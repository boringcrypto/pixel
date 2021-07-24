<template>
    <div style="width: 480px; background-color: #ccc; color: black; border: 1px solid rgb(169, 216,235);">
        <img src="../assets/ambassador.svg" style="height: 160px; margin: -24px" /><br>
        <table v-if="pollInfo" style="width: 440px; margin: auto" class="blueTable">
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
                <td style="text-align: right">{{ pollInfo.downline.tier1 }}</td>
                <td style="text-align: right">{{ pollInfo.downline.earnings1.print(18, 2) }}</td>
            </tr>
            <tr>
                <td>Tier 2</td>
                <td style="text-align: right">10%</td>
                <td style="text-align: right">{{ pollInfo.downline.tier2 }}</td>
                <td style="text-align: right">{{ pollInfo.downline.earnings2.print(18, 2) }}</td>
            </tr>
            <tr>
                <td>Tier 3</td>
                <td style="text-align: right">5%</td>
                <td style="text-align: right">{{ pollInfo.downline.tier3 }}</td>
                <td style="text-align: right">{{ pollInfo.downline.earnings3.print(18, 2) }}</td>
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
import { ProviderInfo } from "../classes/ProviderInfo"
import { PollInfo } from "../types"

export default defineComponent({
    name: "AmbassadorProgram",
    props: {
        info: {
            type: Object as PropType<ProviderInfo>,
            required: true,
        },        
        pollInfo: {
            type: Object as PropType<PollInfo | null>,
        },
    }
})
</script>
