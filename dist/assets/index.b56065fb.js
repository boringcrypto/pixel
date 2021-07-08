import {
    d as e,
    W as n,
    B as o,
    c as t,
    r as i,
    o as r,
    a as c,
    b as a,
    w as s,
    e as d,
    f as u,
    F as f,
    g as w,
    h as l,
    i as h,
} from "./vendor.adb2aa3c.js"
const m = {
    name: "Loading...",
    connected: !1,
    chainId: 0,
    address: "",
    block: 0,
    connect: function () {
        var e
        this.connected && (null == (e = window.ethereum) || e.enable())
    },
}
var p = e({
    name: "Web3",
    props: { info: { type: Object, required: !0 } },
    setup: (e) => {
        if (window.ethereum) {
            let t = function (e) {
                    r(e.chainId)
                },
                i = function (n) {
                    n && n.length ? (e.info.address = n[0]) : (e.info.address = "")
                },
                r = function (t) {
                    var r, c
                    ;(e.info.chainId = Number(o.from(t))),
                        (e.info.connected = window.ethereum.isConnected()),
                        null == (r = window.provider) || r.off("block"),
                        (window.provider = new n(window.ethereum)),
                        window.ethereum.request({ method: "eth_accounts" }).then(i),
                        null == (c = window.provider) ||
                            c.getBlockNumber().then((n) => {
                                var o
                                ;(e.info.block = n),
                                    null == (o = window.provider) ||
                                        o.on("block", (n) => {
                                            e.info.block = n
                                        })
                            })
                }
            ;(window.provider = new n(window.ethereum)),
                window.ethereum.isMetaMask ? (e.info.name = "MetaMask") : (e.info.name = "Other"),
                (window.ethereum.autoRefreshOnNetworkChange = !1),
                window.ethereum.on("accountsChanged", i),
                window.ethereum.on("chainChanged", r),
                window.ethereum.on("connect", t),
                window.ethereum.on("disconnect", (n) => {
                    ;(e.info.connected = !1), (e.info.block = 0)
                }),
                (e.info.connected = window.ethereum.isConnected()),
                e.info.connected && t({ chainId: window.ethereum.chainId })
        } else e.info.name = "None"
        return {}
    },
})
p.render = function (e, n, o, c, a, s) {
    return (
        r(),
        t("div", null, [
            e.info.connected
                ? e.info.connected && !e.info.address
                    ? i(e.$slots, "connect", { key: 1 })
                    : i(e.$slots, "default", { key: 2 })
                : i(e.$slots, "none", { key: 0 }),
        ])
    )
}
var b = e({ name: "App", components: { Web3: p }, setup: () => ({ info: c(m) }) })
const k = { class: "text-center" },
    v = a("img", { alt: "Dictator DAO Logo", src: "assets/logo.3f41d6b2.jpeg", height: "180" }, null, -1),
    g = u("No web3 provider was found. Please use MetaMask.")
b.render = function (e, n, o, i, c, u) {
    const f = d("router-view"),
        w = d("Web3")
    return (
        r(),
        t("div", k, [
            v,
            a(
                w,
                { info: e.info },
                {
                    none: s(() => [g]),
                    connect: s(() => [
                        a(
                            "button",
                            { class: "btn btn-primary", onClick: n[1] || (n[1] = (...n) => e.info.connect && e.info.connect(...n)) },
                            "Connect Metamask"
                        ),
                    ]),
                    default: s(() => [a(f, { info: e.info }, null, 8, ["info"])]),
                    _: 1,
                },
                8,
                ["info"]
            ),
        ])
    )
}
var y = e({ name: "Home", props: { info: { type: Object, required: !0 } }, methods: {}, setup: () => ({}) })
const C = a("h1", null, "Pixel Inc", -1),
    M = a("p", null, " Tada ", -1)
y.render = function (e, n, o, i, c, a) {
    return r(), t(f, null, [C, M], 64)
}
const I = [{ path: "/", component: y }],
    N = w({ history: l(), routes: I })
h(b).use(N).mount("#app")
