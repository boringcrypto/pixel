import { BigNumber } from "@ethersproject/bignumber"

type Block = {
    owner: string,
    lastPrice: number,
    url: string,
    description: string,
    pixels: string
}

type PollInfo = {
    updates: BigNumber;
    balance: BigNumber;
    supply: BigNumber;
    upline: string;
    downline: {
      earnings1: number;
      earnings2: number;
      earnings3: number;
      tier1: number;
      tier2: number;
      tier3: number;
    }
}

export {
    Block,
    PollInfo
}