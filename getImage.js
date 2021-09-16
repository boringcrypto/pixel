if (!process.argv[2]) { console.log('Usage: node getImage.js <RPC URL>') } else {
    const ethers = require('ethers')
    const contract = new ethers.Contract('0x1590ABe3612Be1CB3ab5B0f28874D521576e97Dc', [{'inputs':[{'internalType':'uint256[]','name':'blockNumbers','type':'uint256[]'}],'name':'getBlocks','outputs':[{
                'components':[{'internalType':'address','name':'owner','type':'address'},{'internalType':'string','name':'url','type':'string'},{'internalType':'string','name':'description','type':'string'},{'internalType':'bytes','name':'pixels','type':'bytes'},{'internalType':'uint128','name':'lastPrice','type':'uint128'},{'internalType':'uint32','name':'number','type':'uint32'}],
                'internalType':'struct PixelV2.ExportBlock[]','name':'blocks','type':'tuple[]'}],'stateMutability':'view','type':'function'}], 
                new ethers.providers.JsonRpcProvider(process.argv[2]))
    const { Canvas, Image } = require('node-canvas')

    async function main() {
        const canvas = new Canvas(1000, 1000)
        const ctx = canvas.getContext('2d')
        
        for (let y = 0; y < 100; y++) {
            console.log(y * 100)
            let blocks = await contract.getBlocks([...Array(100).keys()].map(i => i + y * 100))
            for (let x in blocks) {
                let method = parseInt(blocks[x].pixels.substr(2, 2))
                let hex = blocks[x].pixels.substr(4)
                if (method <= 4) {
                    if (method == 1) { hex = '89504e470d0a1a0a0000000d494844520000000a0000000a08060000008d32cfbd0000' + hex + '0000000049454e44ae426082' }
                    if (method == 3) { hex = 'ffd8ffe000104a46494600010100000100010000ffdb0043000a07070807060a0808080b0a0a0b0e18100e0d0d0e1d15161118231f2524221f2221262b372f26293429212230413134393b3e3e3e252e4449433c48373d3e3bffdb0043010a0b0b0e0d0e1c10101c3b2822283b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3bffc0001108000a000a03012200021101031101ffc400' + hex + 'ffd9' }
                    const img = new Image()
                    img.src = Buffer.from(hex, 'hex')
                    ctx.drawImage(img, x * 10, y * 10, 10, 10)
                } else if (method == 5) {
                    let data = ctx.createImageData(10, 10)
                    for(let i = 0; i < 100; i++) {
                        let color = parseInt(hex.substr(i * 6, 6), 16)
                        data.data.set([Math.floor(color / 65536), Math.floor((color % 65536) / 256), color % 256, 255], i * 4)
                    }
                    ctx.putImageData(data, x * 10, y * 10)
                } else if (method == 6 || !hex) {
                    ctx.fillStyle='#' + (hex || '000000')
                    ctx.fillRect(x * 10, y * 10, 10, 10)
                }
            }
        }
        const buffer = canvas.toBuffer('image/png')
        require('fs').writeFileSync('canvas.png', buffer)
    }
    main()
}