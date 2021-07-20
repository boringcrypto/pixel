let constants = {
    chainId: 137,
    network: {
        chainId: "0x89",
        chainName: 'Polygon (Matic)',
        nativeCurrency:
            {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
        rpcUrls: ['https://matic-mainnet.chainstacklabs.com/', 'https://rpc-mainnet.maticvigil.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
    },
    pixel: "0x61E9c2F3501889f6167921087Bd6EA306002904a",
    wsUrl: "wss://ws-matic-mainnet.chainstacklabs.com"
}
export { constants }