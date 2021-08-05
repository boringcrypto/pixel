import { BigNumber, ethers } from "ethers"
import { PixelMigratorFactory, PixelV2, PixelV2Factory } from "../../types/ethers-contracts"
import { constants } from "../constants/development"
import * as Keys from "../../keys.json"
import Snapshot from "../snapshot"
import { compressPixels } from "./Order"
import { PixelsToImageData } from "./Blocks"

export class Deployer {
    getMLM() {
        const mlm = {
            rep: [] as string[],
            upline: [] as string[],
            uplineNr: [] as number[],
            earn1: [] as number[],
            earn2: [] as number[],
            earn3: [] as number[],
            tier1: [] as number[],
            tier2: [] as number[],
            tier3: [] as number[]
        }
        
        function setMLM(rep: string, upline: string, earn1: number, earn2: number, earn3: number, tier1: number, tier2: number, tier3: number) {
            mlm.rep.push(rep)
            mlm.upline.push(upline)
            mlm.earn1.push(earn1)
            mlm.earn2.push(earn2)
            mlm.earn3.push(earn3)
            mlm.tier1.push(tier1)
            mlm.tier2.push(tier2)
            mlm.tier3.push(tier3)
        }
        
        setMLM("0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", "0x256D49d87cbb877D26E2Bcf2bF0A40D26bdfB5d4", 2500,0,0,5,0,0);
        setMLM("0x1EF5526ee1A6D8c596cce90e774A2c41372cC8cD", "0x0A26E272A2D722799B7ff39A1e5128A379b8582C", 1120,0,0,2,0,0);
        setMLM("0x528d4e4E0dbF071eC23013f06D8487BaD5A8a68B", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x47Ea9F2d81Aff9F539348a476F45EdbF5F2122B2", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", "0x0000000000000000000000000000000000000000", 380,0,0,8,0,0);
        setMLM("0x496ea957960Bf9A2BBC1D3c114EaA124e07D0543", "0x3D9B0A7ef1CcEAda457001A6d51F28FF61E39904", 40,200,10,1,1,1);
        setMLM("0xf07504A96601b35Dd702b07EcC57B2b169866f57", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x0A26E272A2D722799B7ff39A1e5128A379b8582C", "0x0000000000000000000000000000000000000000", 720,60,0,1,2,0);
        setMLM("0xc572c95996653ae98Ec3A59d9a511eDA142b98C1", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0xB6207FaCFbc0C7373425D9671Ea0Ca23459E9796", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0xa0bf4E5640e5db6FA82967d2C160e35a9a28AE83", "0xe61a0809eF3f1d2D695555413ac354284BF23915", 0,0,0,0,0,0);
        setMLM("0x9D0b92468Ef23D156F1bd5042Fe0B45C80a4418e", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0x897656B1Fb6C3688e48e1DD8259f7E092364754d", "0x0000000000000000000000000000000000000000", 620,0,0,1,0,0);
        setMLM("0x5434289767bb094DaDbb8D1E5D58b47Ca5729063", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x3D9B0A7ef1CcEAda457001A6d51F28FF61E39904", "0x496ea957960Bf9A2BBC1D3c114EaA124e07D0543", 420,20,100,1,1,1);
        setMLM("0x357dfdC34F93388059D2eb09996d80F233037cBa", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xcE3C9E357425c99cC27Dc9bF963d06E739811465", "0x77FB740096D2bd63F23995c7DB8b46502F556377", 20,40580,5,1,1,1);
        setMLM("0x00A5af2D7DA07dF76073A6f478f0fB4942D2659a", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x9a4773EeEE73e34e1EE0E9A64E4b7453b0b04246", "0x0000000000000000000000000000000000000000", 20,0,0,1,0,0);
        setMLM("0x0E2353516EB6208aA84a552b9a1EE5f13eDaDa57", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0x77FB740096D2bd63F23995c7DB8b46502F556377", "0xcE3C9E357425c99cC27Dc9bF963d06E739811465", 81220,10,20290,1,1,1);
        setMLM("0xaf1ca20615F84c48782F2f23b3cC737Db9c3514c", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", "0x0000000000000000000000000000000000000000", 2160,0,0,3,0,0);
        setMLM("0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", "0x0000000000000000000000000000000000000000", 17360,7560,625,8,11,5);
        setMLM("0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 620,0,0,4,0,0);
        setMLM("0x4e880933AAa461a5FbD0D499f1e142D78f77c8eA", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x41361Ad7c8845fC628B2370Ac78E1e98A70960Dc", "0x9a4773EeEE73e34e1EE0E9A64E4b7453b0b04246", 0,0,0,0,0,0);
        setMLM("0x7f3D32C56b94a9B7878fdfAC4F40Aaa2A6E11EdF", "0xe61a0809eF3f1d2D695555413ac354284BF23915", 0,0,0,0,0,0);
        setMLM("0xe61a0809eF3f1d2D695555413ac354284BF23915", "0x0000000000000000000000000000000000000000", 5640,0,0,2,0,0);
        setMLM("0x17d8E3268B7C81111C98b7D3cCeA55072A32D6C0", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xA03DEE508d09Ba9401a661F154036B36328e0F0C", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 14240,0,0,6,0,0);
        setMLM("0x256D49d87cbb877D26E2Bcf2bF0A40D26bdfB5d4", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 1360,1250,0,1,5,0);
        setMLM("0x54D925F320400139f9F2925767F1ec68B027e7C0", "0x1EF5526ee1A6D8c596cce90e774A2c41372cC8cD", 0,0,0,0,0,0);
        setMLM("0xb3D1e41F84AcD0E77F83473aa62fc8560C2A3c0C", "0x28c24f2Da9B6E517968300Eb1A4F4aE1B235238E", 0,0,0,0,0,0);
        setMLM("0x1a6049c6362D35C768470F1E3684d60D36CF4E47", "0x2931839f032597E1eCeF70DD71F309aCc50Fe7B8", 20,0,5,1,1,1);
        setMLM("0x2931839f032597E1eCeF70DD71F309aCc50Fe7B8", "0x1a6049c6362D35C768470F1E3684d60D36CF4E47", 20,10,0,1,1,1);
        setMLM("0xDA4C79CcfDcbfA9128B1e328f77E5f9C6AD72A44", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0xbf2116D0a79da0E5710Df8AB00eb20415bCA94C8", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0xF3CDA35B2fb88aFf0e8df3499EC88959d13a3B5f", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0x19D2991076f65ca610d4186001EfF4CF64Ed1edB", "0xf07A2439296e07Bc4320AF924E655a01fb69D89C", 0,0,0,0,0,0);
        setMLM("0x4fD95c6FA765e64eC9313E465F4D2B88Cbf8dEaa", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x81F185CB71A4b98777a5Ee50CA55e80608DB61c1", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x0b981d98e857C888E00D2C494D24DC16a12F8f3A", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0x28c24f2Da9B6E517968300Eb1A4F4aE1B235238E", "0x0000000000000000000000000000000000000000", 20,0,0,1,0,0);
        setMLM("0x20C27c130155685070a7Bf3Cfe7084E70e06bF64", "0x897656B1Fb6C3688e48e1DD8259f7E092364754d", 0,0,0,0,0,0);
        setMLM("0x1aDcF07389b1F6605C44a7683c50A5243829A92C", "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", 0,0,0,0,0,0);
        setMLM("0x1F427A6FCdb95A7393C58552093e10A932890FA8", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x218d75b17f491793a96ab4326c7875950359a80C", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x2493C86B62E8ff26208399144817EF2898c59460", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x43d20d5efA78Ff0e465DDa2e58109F9fb3A2becE", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0x53033C9697339942256845dD4d428085eC7261B8", "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", 0,0,0,0,0,0);
        setMLM("0x66AB3988D11B493cBe632C7d4471A68350a786e9", "0x131Ee3bE2E3803Bf9E8976dDf0306236f001B7F2", 0,0,0,0,0,0);
        setMLM("0x8fB07b21383d331F3752A7590b0cfEAc85514A1F", "0xA03DEE508d09Ba9401a661F154036B36328e0F0C", 0,0,0,0,0,0);
        setMLM("0x9EFb6D49Fd5496626E80Ad0B07017744aE9A0efA", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xBF912CB4d1c3f93e51622fAe0bfa28be1B4b6C6c", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xDf547EaB8944D9Ef06475dF8eEe372B9808f425E", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xF82a5d0168cc93e63dc217314AdB87f15891d124", "0xC858Dd4F2a80a859D491A16BeEe6708a6743bfb7", 0,0,0,0,0,0);
        setMLM("0xfEdcBda26763eF4660d5204F4252f2A9B1276D4a", "0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E", 0,0,0,0,0,0);
        setMLM("0x62BA33Ccc4a404456e388456C332D871DaE7ae9e", "0x30a0911731f6eC80c87C4b99f27c254639A3Abcd", 0,0,0,0,0,0);
        setMLM("0xf07A2439296e07Bc4320AF924E655a01fb69D89C", "0x0000000000000000000000000000000000000000", 500,0,0,4,0,0);
        setMLM("0x4656E28Ed7C4aAcD1e7FB98D3C8041d6De04c08F", "0x1EF5526ee1A6D8c596cce90e774A2c41372cC8cD", 0,0,0,0,0,0);
        setMLM("0xBF5310fAe4D7a0C6dF0452bCDA09aEFA2748Ad59", "0x3c5Aac016EF2F178e8699D6208796A2D67557fe2", 0,0,0,0,0,0);

        return mlm;
    }

    balanceAddresses() {
        return [
            //"0x000000000000000000000000000000000000dead", Dead
            "0x00e13f97e1980126cbe90f21b9c1b853878031dd",
            "0x012550d59ae4e7938830fa13c5d5791752adc4a5",
            "0x01485557c2bc6e26c7187ff4cc38d5d9474405d4",
            "0x01c2bf2f59215a1acae7b485aa82a582d31fd613",
            //"0x0319000133d3ada02600f0875d2cf03d442c3367", BentoBox
            "0x0333c75557912d591b5f79b38c56799f48ff3688",
            "0x05ea34e37b28962b9f17fce9cff68637ebb80e58",
            "0x0655e4deaa64b4c6da6b68db283934a15d9afc8d",
            "0x069e85d4f1010dd961897dc8c095fbb5ff297434",
            "0x070ae2385dedc927f821e75434e881ca5fd549fb",
            "0x0764dc400c280ff2b6d1f0582969c0c668271340",
            "0x09a87bc37d1f2ee88fabc572a036e829da601e16",
            "0x0d35324061f620f66af983dee02076b2e45e57fc",
            "0x11ededebf63bef0ea2d2d071bdf88f71543ec6fb",
            "0x157b6c44f47ecd30c0a2c428a6f35dbc606aa81b",
            //"0x15b8166dbd76fa28f0221bfcbb7e17f2247162e1", Migrator
            //"0x183bdb344a07ee3d27f07ac4799a56e4a2fe5439", Dust
            "0x1d97c1fa1fe2378f484571bed33a89eb165e0ae1",
            "0x1eef9b7b06062f1786fd99aea49ade90cca4c516",
            "0x1f427a6fcdb95a7393c58552093e10a932890fa8",
            "0x206971261b391763458134212feeab2360874676",
            "0x218d75b17f491793a96ab4326c7875950359a80c",
            "0x22d16ed158722107f9b22b7346a65e193717c9e8",
            "0x2493c86b62e8ff26208399144817ef2898c59460",
            "0x24bb7e0f4f9bad7f147a865e710c45f893caf675",
            "0x2b23d9b02fffa1f5441ef951b4b95c09faa57eba",
            //"0x2d198cb728acadccff21e8057c46fbd55f392955", Dust
            "0x300588b284f30439bcb32e8ac85321410074e31b",
            "0x31529d22fc85e31e0974a486f6cd7e056dc848f6",
            "0x315388deb1608bdcf532ce0bf6fc130542f5132c",
            "0x328809a567b87b6123462c3062e8438bbb75c1c5",
            "0x36568dd8a7c4b33cb21bdfe595329133defdf7c4",
            "0x3788aeb49692ac53b55a25c40b40f1d3735132f9",
            //"0x38fdb9fd8e4b16b5b9fa41964f7929f015caf420", Dust
            "0x3c0a3d1994c567fd4bf17dc5858ec84ff1f87501",
            "0x4083ab5d0645b263d069b1643d1b92ba79b0d278",
            "0x41381649b2231cafc8293f501bb3df422aeba5e4",
            "0x43d20d5efa78ff0e465dda2e58109f9fb3a2bece",
            "0x4656e28ed7c4aacd1e7fb98d3c8041d6de04c08f",
            "0x4cb1a8bb524ec318aaad1c63ca51b2189df00560",
            "0x53033c9697339942256845dd4d428085ec7261b8",
            "0x54c375c481f95ba43e2cecd6ef30631f55518f57",
            //"0x563d132c12c4b778b7669e1432e812548bf023d0", Dust
            "0x58a5d0d2d5cda76806f48a3b255d2b0238f965c5",
            "0x592f1a037eb4cbe529e80ca0f855525e13993380",
            "0x5a7ff73ef571661c533fa969560ad61a51211f0a",
            //"0x5acfd914f2dfd41f07f27407bd7936f43d0db167", Dust
            "0x5b52bf12e7d8737ed61f06147fc655514679ce72",
            "0x5ba8be640c84e294bd7285b4d7a676ed8e1ff2ec",
            "0x62b979923922045fb5a77bed9e0753941b1da52c",
            "0x62ba33ccc4a404456e388456c332d871dae7ae9e",
            //"0x630be16e634e2638403f0571691c1fabfdf71563", Uniswap V2 pair
            "0x66ab3988d11b493cbe632c7d4471a68350a786e9",
            "0x720c9244473dfc596547c1f7b6261c7112a3dad4",
            "0x7705e47bd6eb6dc5a11aa1839639f3dc6e1a6eaf",
            "0x77fb740096d2bd63f23995c7db8b46502f556377",
            "0x786103a19bcc1c5f97887be5fe1eba9ac743cbf7",
            "0x7a4a8f7b3707ecc86b50cae33f83edc5f8c8f57e",
            //"0x7a4eaa613eb74281c3c37a3d8a05effb5ee35887", Dust
            "0x826a471055333505e596f424348983af0aa8411b",
            "0x8469032c8b6f94e95c0659a9a3a34de959999999",
            "0x8d071fa6905e1fb872903603a6239947c03fd450",
            "0x8f54c8c2df62c94772ac14ccfc85603742976312",
            "0x8fb07b21383d331f3752a7590b0cfeac85514a1f",
            "0x9086a51a6f6b4bdc45d88bfb9201202fa0c340d3",
            "0x91d35872af0bafa35642a4ce0db540e74be3cc66",
            "0x944bae1afde5417b6226ff13a227636c288e5695",
            "0x94e169525d86df638cc51d801eac8d60275a8047",
            "0x97a2f4fa661c1898678cfb5c77b1cdc22816076b",
            "0x9a568bfeb8cb19e4bafcb57ee69498d57d9591ca",
            "0x9c64e4fe8c13afd4176913f307c3572191c65c92",
            "0x9efb6d49fd5496626e80ad0b07017744ae9a0efa",
            "0xa17f7de14ee47efb1c822a7610781c3679bcdf92",
            "0xa2db5f9313a553f572fa44aa1ba5b5871ed68406",
            "0xa3bbc5a9f32c12f6e51e83bc520ed82b261b9798",
            //"0xa7e25c1684fc66fc95c40568e9ba77806cd5358b", Dust
            //"0xa8ec58dd533e0cf82ec417bca3c4dbca48ae5a8b", Dust
            //"0xa9e21228349800b1f7ebac82b41643021269db0b", Dust
            "0xaa2c4825e6c5eb45d63519ee0ff267a387b197bc",
            "0xb11a0ce3a6ea30d8aa906e0f84eb92be8af5afcb",
            //"0xb22f8dd27ccdde2ec086ff4b7fad7efbe461f825", Dust
            "0xb2f6be1d6c18514eabdc352b97b63273608af8fe",
            "0xb4a3f907ec1611f22543219ae9bb33ec5e96e116",
            "0xb5ede9893fccd62a110fd9d0cce5c89418a8540b",
            "0xb84848ce4a46a44f06864b5decc2fe07b842cf30",
            "0xb96863b5a9bb3783c5ba0665e4382b766746d6fa",
            "0xb9956c74639d8e11c64d8005dc0c2262945af074",
            "0xbf5310fae4d7a0c6df0452bcda09aefa2748ad59",
            "0xbf912cb4d1c3f93e51622fae0bfa28be1b4b6c6c",
            "0xc11d9fd49c6745dac498a79bf5799c2666866f5d",
            //"0xc37899901ffdef1b6baf95fd4081d82942a0a85a", SushiSwap SLP
            //"0xc3b4a67e8c8120cedccbbf392f18d622ffa34fc0", Dust
            "0xc61a2bb414a41ce492a94b5f59f5fd72f3a71c97",
            "0xc9fd84728f98df2820896db89d7d47ac9998228c",
            "0xce3c49dc6e0ee03cbd5fab568cc638f09ac4a7d7",
            "0xd264da372aefcd5269ca212bfd3c56e8e95bccca",
            "0xd2f91edd7dd5388737552d18d99555313dcd78e0",
            "0xd6e371526cdaee04cd8af225d42e37bc14688d9e",
            "0xd852b4b77417368d579c1bee592f3f630028b25e",
            "0xd9b49a81ee72af3c026a2c144c9ffd678a78c8b1",
            "0xda918c71780b2ae1b8d4c0546b1aab0cadc21e4b",
            "0xdd3c7daf175266eec1b830544bd5e40f1649cc61",
            "0xdf547eab8944d9ef06475df8eee372b9808f425e",
            "0xe0d62cc9233c7e2f1f23fe8c77d6b4d1a265d7cd",
            //"0xe5b65108d0347725dd70817c59faee66de4e21e0", Dust
            "0xe741f716049de5514e8304b1c666ee2b18f7027e",
            "0xe744048f7d1b63b4e233a1d63c3153b913d7a2cc",
            "0xe7967e618010c7561f5acd59ab9790455370e65e",
            //"0xe97b4adeed8c29de314019441fb42d009b871987", Dust
            "0xe9f654994f1135ebfab3183f50603da5c6abd4c3",
            "0xee5c256721abe58af6f582c0efd6774dd2765038",
            "0xf07a2439296e07bc4320af924e655a01fb69d89c",
            "0xf58aa8e0832deac36550296dc92fc091d5de2b7d",
            "0xf82a5d0168cc93e63dc217314adb87f15891d124",
            "0xf9ea1a3d185ea9bb6667bdb02acc1e705a6a10b8",
            "0xfca59abdabedc4eb54c3c557ab82ca5d7c2f96f3",
            "0xfd543d0250ca20eb92bd296a79e9e5cef1c84fb6",
            "0xfd5a25ef7396384c2d43645f32609bc869c36208",
            "0xfedcbda26763ef4660d5204f4252f2a9b1276d4a"
        ]
    }

    async deploy() {
        let provider = new ethers.providers.JsonRpcProvider(constants.network.rpcUrls[0])
        let signer = ethers.Wallet.fromMnemonic(Keys.deployer).connect(provider)
        let pixel = PixelV2Factory.connect(constants.pixel, signer)
        let mlm = this.getMLM()
        let gas = BigNumber.from("0")
        let tx

        if ((await pixel.balanceOf("0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E")).isZero()) {
            let matic = new ethers.providers.JsonRpcProvider('https://matic-mainnet.chainstacklabs.com/')
            let migrator = PixelMigratorFactory.connect("0x15B8166DBD76FA28F0221bFcbB7e17f2247162E1", matic)
            let maticPixel = PixelV2Factory.connect("0x61E9c2F3501889f6167921087Bd6EA306002904a", matic)
            let migrations = await migrator.MigratedSince(0)
            let totalSupply = await maticPixel.totalSupply()
            let mints = {
                to: [] as string[],
                amount: [] as BigNumber[]
            }
            migrations.forEach(m => {
                mints.to.push(m.owner)
                mints.amount.push(m.amount)
            })
            const check = this.balanceAddresses()
            for(let i = 0; (i < check.length); i++) {
                let balance = await maticPixel.balanceOf(check[i])
                console.log("Imported balance", check[i], balance.toString())
                if (balance) {
                    mints.to.push(check[i])
                    mints.amount.push(balance)
                }
            }

            let totalMigrated = mints.amount.reduce((p, v) => p.add(v), BigNumber.from(0))
            console.log(totalSupply.toString(), totalMigrated.toString(), totalSupply.sub(totalMigrated).toString())
            mints.to.push(pixel.address)
            mints.amount.push(totalSupply.sub(totalMigrated))

            console.log("Adding", mints.to.length, "balance migrations")
            tx = await (await pixel.mint(mints.to, mints.amount)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        let currentAddresses = await pixel.getAddresses()
        let allAddresses = Snapshot.blocks.map(b => b.owner).concat(mlm.upline)
        let addresses = [...new Set(allAddresses.filter(a => currentAddresses.indexOf(a) < 0))]
        if (addresses.length) {
            console.log("Adding", addresses.length, "addresses")
            tx = await (await pixel.addAddresses(addresses)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }
        currentAddresses = await pixel.getAddresses()

        if ((await pixel.mlm("0x9e6e344f94305d36eA59912b0911fE2c9149Ed3E")).earnings1 == 0) {
            console.log("Adding MLM data")
            tx = await (await pixel.initMLM(
                mlm.rep,
                mlm.upline.map(a => currentAddresses.indexOf(a)),
                mlm.earn1,
                mlm.earn2,
                mlm.earn3,
                mlm.tier1,
                mlm.tier2,
                mlm.tier3
            )).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        let currentText = await pixel.getText()
        let url = [...new Set(Snapshot.blocks.map(b => b.url).filter(t => currentText.indexOf(t) < 0))]
        if (url.length) {
            console.log("Adding", url.length, "urls")
            tx = await (await pixel.addText(url)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        currentText = await pixel.getText()
        let description = [...new Set(Snapshot.blocks.map(b => b.description).filter(t => currentText.indexOf(t) < 0))]
        if (description.length) {
            console.log("Adding", description.length, "descriptions")
            tx = await (await pixel.addText(description)).wait()
            console.log(tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }
        currentText = await pixel.getText()

        let dataCount = (await pixel.dataCount()).toNumber()
        let start = 0
        let currentData: string[] = []
        while (start < dataCount) {
            let end = start + 200 < dataCount ? start + 200 : dataCount
            console.log("Getting data from", start, "to", end)
            currentData = currentData.concat(await pixel.getDataRange(start, end))
            start += 200
        }
        console.log("Existing data", currentData.length, dataCount)
        
        let ctx = (document.createElement("CANVAS") as HTMLCanvasElement).getContext("2d")
        let pixelPromises: Promise<string>[] = []
        console.log("Building pixels...")
        for(let i in Snapshot.blocks) {
            let b = Snapshot.blocks[i]
            let d = compressPixels(PixelsToImageData(ctx!, b.pixels))
            pixelPromises.push(d)
        }
        console.log("Promises", pixelPromises.length)
        let allPixels = (await Promise.all(pixelPromises))

        console.log("Pixels", allPixels.length)
        let pixels = [...new Set(allPixels)].filter(d => currentData.indexOf(d) < 0)
        console.log("Adding", pixels.length, "pixels")
        while (pixels.length) {
            let batch = pixels.splice(0, 35)
            tx = await (await pixel.addData(batch)).wait()
            console.log("Left", pixels.length, "gas", tx.gasUsed.toString())
            gas = gas.add(tx.gasUsed)
        }

        dataCount = (await pixel.dataCount()).toNumber()
        start = 0
        currentData = []
        while (start < dataCount) {
            let end = start + 200 < dataCount ? start + 200 : dataCount
            console.log("Getting data from", start, "to", end)
            currentData = currentData.concat(await pixel.getDataRange(start, end))
            start += 200
        }
        console.log("Existing data", currentData.length, dataCount)

        let blockNumbers: number[] = []
        let owners: number[] = []
        let urls: number[] = []
        let descriptions: number[] = []
        let pixelss: number[] = []
        let lastPrices: BigNumber[] = []
        for(let i = 0; i < 10000; i++) {
            let b = Snapshot.blocks[i]
            blockNumbers[i] = i
            owners[i] = currentAddresses.indexOf(b.owner)
            urls[i] = currentText.indexOf(b.url)
            descriptions[i] = currentText.indexOf(b.description)
            pixelss[i] = currentData.indexOf(allPixels[i])
            lastPrices[i] = BigNumber.from(b.lastPrice).mul("500000000000000")
        }
        while(blockNumbers.length) {
            let isBlank = (await pixel.getRawBlocks(blockNumbers.slice(0, 300))).map(b => b.owner == 0)
            if (isBlank.filter(b => b).length > 0) {
                tx = await (await pixel.initBlocks(
                    blockNumbers.splice(0, 300).filter((d, i) => isBlank[i]),
                    lastPrices.splice(0, 300).filter((d, i) => isBlank[i]),
                    owners.splice(0, 300).filter((d, i) => isBlank[i]),
                    urls.splice(0, 300).filter((d, i) => isBlank[i]),
                    descriptions.splice(0, 300).filter((d, i) => isBlank[i]),
                    pixelss.splice(0, 300).filter((d, i) => isBlank[i])
                )).wait()
                console.log("Left", blockNumbers.length, "gas", tx.gasUsed.toString())
                gas = gas.add(tx.gasUsed)
            }
        }

        tx = await (await pixel.finishInit()).wait()
        gas = gas.add(tx.gasUsed)

        console.log("Total gas", gas.toString())
    }
}