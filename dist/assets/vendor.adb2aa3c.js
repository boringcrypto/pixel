function t(t, e) {
    const r = Object.create(null),
        n = t.split(",")
    for (let i = 0; i < n.length; i++) r[n[i]] = !0
    return e ? (t) => !!r[t.toLowerCase()] : (t) => !!r[t]
}
const e = t(
        "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt"
    ),
    r = t("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly")
function n(t) {
    if (b(t)) {
        const e = {}
        for (let r = 0; r < t.length; r++) {
            const i = t[r],
                o = n(E(i) ? s(i) : i)
            if (o) for (const t in o) e[t] = o[t]
        }
        return e
    }
    if (M(t)) return t
}
const i = /;(?![^(]*\))/g,
    o = /:(.+)/
function s(t) {
    const e = {}
    return (
        t.split(i).forEach((t) => {
            if (t) {
                const r = t.split(o)
                r.length > 1 && (e[r[0].trim()] = r[1].trim())
            }
        }),
        e
    )
}
function a(t) {
    let e = ""
    if (E(t)) e = t
    else if (b(t))
        for (let r = 0; r < t.length; r++) {
            const n = a(t[r])
            n && (e += n + " ")
        }
    else if (M(t)) for (const r in t) t[r] && (e += r + " ")
    return e.trim()
}
const l = {},
    u = [],
    h = () => {},
    c = () => !1,
    f = /^on[^a-z]/,
    d = (t) => f.test(t),
    p = (t) => t.startsWith("onUpdate:"),
    m = Object.assign,
    g = (t, e) => {
        const r = t.indexOf(e)
        r > -1 && t.splice(r, 1)
    },
    v = Object.prototype.hasOwnProperty,
    y = (t, e) => v.call(t, e),
    b = Array.isArray,
    w = (t) => "[object Map]" === N(t),
    _ = (t) => "function" == typeof t,
    E = (t) => "string" == typeof t,
    k = (t) => "symbol" == typeof t,
    M = (t) => null !== t && "object" == typeof t,
    x = (t) => M(t) && _(t.then) && _(t.catch),
    A = Object.prototype.toString,
    N = (t) => A.call(t),
    P = (t) => E(t) && "NaN" !== t && "-" !== t[0] && "" + parseInt(t, 10) === t,
    S = t(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),
    I = (t) => {
        const e = Object.create(null)
        return (r) => e[r] || (e[r] = t(r))
    },
    R = /-(\w)/g,
    T = I((t) => t.replace(R, (t, e) => (e ? e.toUpperCase() : ""))),
    O = /\B([A-Z])/g,
    C = I((t) => t.replace(O, "-$1").toLowerCase()),
    B = I((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    F = I((t) => (t ? `on${B(t)}` : "")),
    L = (t, e) => t !== e && (t == t || e == e),
    U = (t, e) => {
        for (let r = 0; r < t.length; r++) t[r](e)
    },
    q = (t, e, r) => {
        Object.defineProperty(t, e, { configurable: !0, enumerable: !1, value: r })
    },
    j = (t) => {
        const e = parseFloat(t)
        return isNaN(e) ? t : e
    },
    D = new WeakMap(),
    z = []
let G
const $ = Symbol(""),
    H = Symbol("")
function V(t, e = l) {
    ;(function (t) {
        return t && !0 === t._isEffect
    })(t) && (t = t.raw)
    const r = (function (t, e) {
        const r = function () {
            if (!r.active) return t()
            if (!z.includes(r)) {
                J(r)
                try {
                    return Z.push(X), (X = !0), z.push(r), (G = r), t()
                } finally {
                    z.pop(), Y(), (G = z[z.length - 1])
                }
            }
        }
        return (
            (r.id = K++),
            (r.allowRecurse = !!e.allowRecurse),
            (r._isEffect = !0),
            (r.active = !0),
            (r.raw = t),
            (r.deps = []),
            (r.options = e),
            r
        )
    })(t, e)
    return e.lazy || r(), r
}
function W(t) {
    t.active && (J(t), t.options.onStop && t.options.onStop(), (t.active = !1))
}
let K = 0
function J(t) {
    const { deps: e } = t
    if (e.length) {
        for (let r = 0; r < e.length; r++) e[r].delete(t)
        e.length = 0
    }
}
let X = !0
const Z = []
function Q() {
    Z.push(X), (X = !1)
}
function Y() {
    const t = Z.pop()
    X = void 0 === t || t
}
function tt(t, e, r) {
    if (!X || void 0 === G) return
    let n = D.get(t)
    n || D.set(t, (n = new Map()))
    let i = n.get(r)
    i || n.set(r, (i = new Set())), i.has(G) || (i.add(G), G.deps.push(i))
}
function et(t, e, r, n, i, o) {
    const s = D.get(t)
    if (!s) return
    const a = new Set(),
        l = (t) => {
            t &&
                t.forEach((t) => {
                    ;(t !== G || t.allowRecurse) && a.add(t)
                })
        }
    if ("clear" === e) s.forEach(l)
    else if ("length" === r && b(t))
        s.forEach((t, e) => {
            ;("length" === e || e >= n) && l(t)
        })
    else
        switch ((void 0 !== r && l(s.get(r)), e)) {
            case "add":
                b(t) ? P(r) && l(s.get("length")) : (l(s.get($)), w(t) && l(s.get(H)))
                break
            case "delete":
                b(t) || (l(s.get($)), w(t) && l(s.get(H)))
                break
            case "set":
                w(t) && l(s.get($))
        }
    a.forEach((t) => {
        t.options.scheduler ? t.options.scheduler(t) : t()
    })
}
const rt = t("__proto__,__v_isRef,__isVue"),
    nt = new Set(
        Object.getOwnPropertyNames(Symbol)
            .map((t) => Symbol[t])
            .filter(k)
    ),
    it = ut(),
    ot = ut(!1, !0),
    st = ut(!0),
    at = lt()
function lt() {
    const t = {}
    return (
        ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
            const r = Array.prototype[e]
            t[e] = function (...t) {
                const e = Kt(this)
                for (let r = 0, i = this.length; r < i; r++) tt(e, 0, r + "")
                const n = r.apply(e, t)
                return -1 === n || !1 === n ? r.apply(e, t.map(Kt)) : n
            }
        }),
        ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
            const r = Array.prototype[e]
            t[e] = function (...t) {
                Q()
                const e = r.apply(this, t)
                return Y(), e
            }
        }),
        t
    )
}
function ut(t = !1, e = !1) {
    return function (r, n, i) {
        if ("__v_isReactive" === n) return !t
        if ("__v_isReadonly" === n) return t
        if ("__v_raw" === n && i === (t ? (e ? jt : qt) : e ? Ut : Lt).get(r)) return r
        const o = b(r)
        if (!t && o && y(at, n)) return Reflect.get(at, n, i)
        const s = Reflect.get(r, n, i)
        if (k(n) ? nt.has(n) : rt(n)) return s
        if ((t || tt(r, 0, n), e)) return s
        if (Zt(s)) {
            return !o || !P(n) ? s.value : s
        }
        return M(s) ? (t ? Gt(s) : zt(s)) : s
    }
}
function ht(t = !1) {
    return function (e, r, n, i) {
        let o = e[r]
        if (!t && ((n = Kt(n)), (o = Kt(o)), !b(e) && Zt(o) && !Zt(n))) return (o.value = n), !0
        const s = b(e) && P(r) ? Number(r) < e.length : y(e, r),
            a = Reflect.set(e, r, n, i)
        return e === Kt(i) && (s ? L(n, o) && et(e, "set", r, n) : et(e, "add", r, n)), a
    }
}
const ct = {
        get: it,
        set: ht(),
        deleteProperty: function (t, e) {
            const r = y(t, e)
            t[e]
            const n = Reflect.deleteProperty(t, e)
            return n && r && et(t, "delete", e, void 0), n
        },
        has: function (t, e) {
            const r = Reflect.has(t, e)
            return (k(e) && nt.has(e)) || tt(t, 0, e), r
        },
        ownKeys: function (t) {
            return tt(t, 0, b(t) ? "length" : $), Reflect.ownKeys(t)
        },
    },
    ft = { get: st, set: (t, e) => !0, deleteProperty: (t, e) => !0 },
    dt = m({}, ct, { get: ot, set: ht(!0) }),
    pt = (t) => (M(t) ? zt(t) : t),
    mt = (t) => (M(t) ? Gt(t) : t),
    gt = (t) => t,
    vt = (t) => Reflect.getPrototypeOf(t)
function yt(t, e, r = !1, n = !1) {
    const i = Kt((t = t.__v_raw)),
        o = Kt(e)
    e !== o && !r && tt(i, 0, e), !r && tt(i, 0, o)
    const { has: s } = vt(i),
        a = n ? gt : r ? mt : pt
    return s.call(i, e) ? a(t.get(e)) : s.call(i, o) ? a(t.get(o)) : void (t !== i && t.get(e))
}
function bt(t, e = !1) {
    const r = this.__v_raw,
        n = Kt(r),
        i = Kt(t)
    return t !== i && !e && tt(n, 0, t), !e && tt(n, 0, i), t === i ? r.has(t) : r.has(t) || r.has(i)
}
function wt(t, e = !1) {
    return (t = t.__v_raw), !e && tt(Kt(t), 0, $), Reflect.get(t, "size", t)
}
function _t(t) {
    t = Kt(t)
    const e = Kt(this)
    return vt(e).has.call(e, t) || (e.add(t), et(e, "add", t, t)), this
}
function Et(t, e) {
    e = Kt(e)
    const r = Kt(this),
        { has: n, get: i } = vt(r)
    let o = n.call(r, t)
    o || ((t = Kt(t)), (o = n.call(r, t)))
    const s = i.call(r, t)
    return r.set(t, e), o ? L(e, s) && et(r, "set", t, e) : et(r, "add", t, e), this
}
function kt(t) {
    const e = Kt(this),
        { has: r, get: n } = vt(e)
    let i = r.call(e, t)
    i || ((t = Kt(t)), (i = r.call(e, t))), n && n.call(e, t)
    const o = e.delete(t)
    return i && et(e, "delete", t, void 0), o
}
function Mt() {
    const t = Kt(this),
        e = 0 !== t.size,
        r = t.clear()
    return e && et(t, "clear", void 0, void 0), r
}
function xt(t, e) {
    return function (r, n) {
        const i = this,
            o = i.__v_raw,
            s = Kt(o),
            a = e ? gt : t ? mt : pt
        return !t && tt(s, 0, $), o.forEach((t, e) => r.call(n, a(t), a(e), i))
    }
}
function At(t, e, r) {
    return function (...n) {
        const i = this.__v_raw,
            o = Kt(i),
            s = w(o),
            a = "entries" === t || (t === Symbol.iterator && s),
            l = "keys" === t && s,
            u = i[t](...n),
            h = r ? gt : e ? mt : pt
        return (
            !e && tt(o, 0, l ? H : $),
            {
                next() {
                    const { value: t, done: e } = u.next()
                    return e ? { value: t, done: e } : { value: a ? [h(t[0]), h(t[1])] : h(t), done: e }
                },
                [Symbol.iterator]() {
                    return this
                },
            }
        )
    }
}
function Nt(t) {
    return function (...e) {
        return "delete" !== t && this
    }
}
function Pt() {
    const t = {
            get(t) {
                return yt(this, t)
            },
            get size() {
                return wt(this)
            },
            has: bt,
            add: _t,
            set: Et,
            delete: kt,
            clear: Mt,
            forEach: xt(!1, !1),
        },
        e = {
            get(t) {
                return yt(this, t, !1, !0)
            },
            get size() {
                return wt(this)
            },
            has: bt,
            add: _t,
            set: Et,
            delete: kt,
            clear: Mt,
            forEach: xt(!1, !0),
        },
        r = {
            get(t) {
                return yt(this, t, !0)
            },
            get size() {
                return wt(this, !0)
            },
            has(t) {
                return bt.call(this, t, !0)
            },
            add: Nt("add"),
            set: Nt("set"),
            delete: Nt("delete"),
            clear: Nt("clear"),
            forEach: xt(!0, !1),
        },
        n = {
            get(t) {
                return yt(this, t, !0, !0)
            },
            get size() {
                return wt(this, !0)
            },
            has(t) {
                return bt.call(this, t, !0)
            },
            add: Nt("add"),
            set: Nt("set"),
            delete: Nt("delete"),
            clear: Nt("clear"),
            forEach: xt(!0, !0),
        }
    return (
        ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
            ;(t[i] = At(i, !1, !1)), (r[i] = At(i, !0, !1)), (e[i] = At(i, !1, !0)), (n[i] = At(i, !0, !0))
        }),
        [t, r, e, n]
    )
}
const [St, It, Rt, Tt] = Pt()
function Ot(t, e) {
    const r = e ? (t ? Tt : Rt) : t ? It : St
    return (e, n, i) =>
        "__v_isReactive" === n ? !t : "__v_isReadonly" === n ? t : "__v_raw" === n ? e : Reflect.get(y(r, n) && n in e ? r : e, n, i)
}
const Ct = { get: Ot(!1, !1) },
    Bt = { get: Ot(!1, !0) },
    Ft = { get: Ot(!0, !1) },
    Lt = new WeakMap(),
    Ut = new WeakMap(),
    qt = new WeakMap(),
    jt = new WeakMap()
function Dt(t) {
    return t.__v_skip || !Object.isExtensible(t)
        ? 0
        : (function (t) {
              switch (t) {
                  case "Object":
                  case "Array":
                      return 1
                  case "Map":
                  case "Set":
                  case "WeakMap":
                  case "WeakSet":
                      return 2
                  default:
                      return 0
              }
          })(((t) => N(t).slice(8, -1))(t))
}
function zt(t) {
    return t && t.__v_isReadonly ? t : $t(t, !1, ct, Ct, Lt)
}
function Gt(t) {
    return $t(t, !0, ft, Ft, qt)
}
function $t(t, e, r, n, i) {
    if (!M(t)) return t
    if (t.__v_raw && (!e || !t.__v_isReactive)) return t
    const o = i.get(t)
    if (o) return o
    const s = Dt(t)
    if (0 === s) return t
    const a = new Proxy(t, 2 === s ? n : r)
    return i.set(t, a), a
}
function Ht(t) {
    return Vt(t) ? Ht(t.__v_raw) : !(!t || !t.__v_isReactive)
}
function Vt(t) {
    return !(!t || !t.__v_isReadonly)
}
function Wt(t) {
    return Ht(t) || Vt(t)
}
function Kt(t) {
    return (t && Kt(t.__v_raw)) || t
}
function Jt(t) {
    return q(t, "__v_skip", !0), t
}
const Xt = (t) => (M(t) ? zt(t) : t)
function Zt(t) {
    return Boolean(t && !0 === t.__v_isRef)
}
function Qt(t) {
    return te(t)
}
class Yt {
    constructor(t, e) {
        ;(this._rawValue = t), (this._shallow = e), (this.__v_isRef = !0), (this._value = e ? t : Xt(t))
    }
    get value() {
        return tt(Kt(this), 0, "value"), this._value
    }
    set value(t) {
        L(Kt(t), this._rawValue) && ((this._rawValue = t), (this._value = this._shallow ? t : Xt(t)), et(Kt(this), "set", "value", t))
    }
}
function te(t, e = !1) {
    return Zt(t) ? t : new Yt(t, e)
}
function ee(t) {
    return Zt(t) ? t.value : t
}
const re = {
    get: (t, e, r) => ee(Reflect.get(t, e, r)),
    set: (t, e, r, n) => {
        const i = t[e]
        return Zt(i) && !Zt(r) ? ((i.value = r), !0) : Reflect.set(t, e, r, n)
    },
}
function ne(t) {
    return Ht(t) ? t : new Proxy(t, re)
}
class ie {
    constructor(t, e, r) {
        ;(this._setter = e),
            (this._dirty = !0),
            (this.__v_isRef = !0),
            (this.effect = V(t, {
                lazy: !0,
                scheduler: () => {
                    this._dirty || ((this._dirty = !0), et(Kt(this), "set", "value"))
                },
            })),
            (this.__v_isReadonly = r)
    }
    get value() {
        const t = Kt(this)
        return t._dirty && ((t._value = this.effect()), (t._dirty = !1)), tt(t, 0, "value"), t._value
    }
    set value(t) {
        this._setter(t)
    }
}
function oe(t, e, r, n) {
    let i
    try {
        i = n ? t(...n) : t()
    } catch (o) {
        ae(o, e, r)
    }
    return i
}
function se(t, e, r, n) {
    if (_(t)) {
        const i = oe(t, e, r, n)
        return (
            i &&
                x(i) &&
                i.catch((t) => {
                    ae(t, e, r)
                }),
            i
        )
    }
    const i = []
    for (let o = 0; o < t.length; o++) i.push(se(t[o], e, r, n))
    return i
}
function ae(t, e, r, n = !0) {
    e && e.vnode
    if (e) {
        let n = e.parent
        const i = e.proxy,
            o = r
        for (; n; ) {
            const e = n.ec
            if (e) for (let r = 0; r < e.length; r++) if (!1 === e[r](t, i, o)) return
            n = n.parent
        }
        const s = e.appContext.config.errorHandler
        if (s) return void oe(s, null, 10, [t, i, o])
    }
    !(function (t, e, r, n = !0) {
        console.error(t)
    })(t, 0, 0, n)
}
let le = !1,
    ue = !1
const he = []
let ce = 0
const fe = []
let de = null,
    pe = 0
const me = []
let ge = null,
    ve = 0
const ye = Promise.resolve()
let be = null,
    we = null
function _e(t) {
    const e = be || ye
    return t ? e.then(this ? t.bind(this) : t) : e
}
function Ee(t) {
    if (!((he.length && he.includes(t, le && t.allowRecurse ? ce + 1 : ce)) || t === we)) {
        const e = (function (t) {
            let e = ce + 1,
                r = he.length
            const n = Ne(t)
            for (; e < r; ) {
                const t = (e + r) >>> 1
                Ne(he[t]) < n ? (e = t + 1) : (r = t)
            }
            return e
        })(t)
        e > -1 ? he.splice(e, 0, t) : he.push(t), ke()
    }
}
function ke() {
    le || ue || ((ue = !0), (be = ye.then(Pe)))
}
function Me(t, e, r, n) {
    b(t) ? r.push(...t) : (e && e.includes(t, t.allowRecurse ? n + 1 : n)) || r.push(t), ke()
}
function xe(t, e = null) {
    if (fe.length) {
        for (we = e, de = [...new Set(fe)], fe.length = 0, pe = 0; pe < de.length; pe++) de[pe]()
        ;(de = null), (pe = 0), (we = null), xe(t, e)
    }
}
function Ae(t) {
    if (me.length) {
        const t = [...new Set(me)]
        if (((me.length = 0), ge)) return void ge.push(...t)
        for (ge = t, ge.sort((t, e) => Ne(t) - Ne(e)), ve = 0; ve < ge.length; ve++) ge[ve]()
        ;(ge = null), (ve = 0)
    }
}
const Ne = (t) => (null == t.id ? 1 / 0 : t.id)
function Pe(t) {
    ;(ue = !1), (le = !0), xe(t), he.sort((t, e) => Ne(t) - Ne(e))
    try {
        for (ce = 0; ce < he.length; ce++) {
            const t = he[ce]
            t && !1 !== t.active && oe(t, null, 14)
        }
    } finally {
        ;(ce = 0), (he.length = 0), Ae(), (le = !1), (be = null), (he.length || fe.length || me.length) && Pe(t)
    }
}
function Se(t, e, ...r) {
    const n = t.vnode.props || l
    let i = r
    const o = e.startsWith("update:"),
        s = o && e.slice(7)
    if (s && s in n) {
        const t = `${"modelValue" === s ? "model" : s}Modifiers`,
            { number: e, trim: o } = n[t] || l
        o ? (i = r.map((t) => t.trim())) : e && (i = r.map(j))
    }
    let a,
        u = n[(a = F(e))] || n[(a = F(T(e)))]
    !u && o && (u = n[(a = F(C(e)))]), u && se(u, t, 6, i)
    const h = n[a + "Once"]
    if (h) {
        if (t.emitted) {
            if (t.emitted[a]) return
        } else t.emitted = {}
        ;(t.emitted[a] = !0), se(h, t, 6, i)
    }
}
function Ie(t, e, r = !1) {
    const n = e.emitsCache,
        i = n.get(t)
    if (void 0 !== i) return i
    const o = t.emits
    let s = {},
        a = !1
    if (!_(t)) {
        const n = (t) => {
            const r = Ie(t, e, !0)
            r && ((a = !0), m(s, r))
        }
        !r && e.mixins.length && e.mixins.forEach(n), t.extends && n(t.extends), t.mixins && t.mixins.forEach(n)
    }
    return o || a ? (b(o) ? o.forEach((t) => (s[t] = null)) : m(s, o), n.set(t, s), s) : (n.set(t, null), null)
}
function Re(t, e) {
    return !(!t || !d(e)) && ((e = e.slice(2).replace(/Once$/, "")), y(t, e[0].toLowerCase() + e.slice(1)) || y(t, C(e)) || y(t, e))
}
let Te = null,
    Oe = null
function Ce(t) {
    const e = Te
    return (Te = t), (Oe = (t && t.type.__scopeId) || null), e
}
function Be(t, e = Te, r) {
    if (!e) return t
    if (t._n) return t
    const n = (...r) => {
        n._d && on(-1)
        const i = Ce(e),
            o = t(...r)
        return Ce(i), n._d && on(1), o
    }
    return (n._n = !0), (n._c = !0), (n._d = !0), n
}
function Fe(t) {
    const {
        type: e,
        vnode: r,
        proxy: n,
        withProxy: i,
        props: o,
        propsOptions: [s],
        slots: a,
        attrs: l,
        emit: u,
        render: h,
        renderCache: c,
        data: f,
        setupState: d,
        ctx: m,
        inheritAttrs: g,
    } = t
    let v
    const y = Ce(t)
    try {
        let t
        if (4 & r.shapeFlag) {
            const e = i || n
            ;(v = mn(h.call(e, e, c, o, d, f, m))), (t = l)
        } else {
            const r = e
            0, (v = mn(r.length > 1 ? r(o, { attrs: l, slots: a, emit: u }) : r(o, null))), (t = e.props ? l : Le(l))
        }
        let y = v
        if (t && !1 !== g) {
            const e = Object.keys(t),
                { shapeFlag: r } = y
            e.length && (1 & r || 6 & r) && (s && e.some(p) && (t = Ue(t, s)), (y = dn(y, t)))
        }
        0, r.dirs && (y.dirs = y.dirs ? y.dirs.concat(r.dirs) : r.dirs), r.transition && (y.transition = r.transition), (v = y)
    } catch (b) {
        ;(tn.length = 0), ae(b, t, 1), (v = fn(Qr))
    }
    return Ce(y), v
}
const Le = (t) => {
        let e
        for (const r in t) ("class" === r || "style" === r || d(r)) && ((e || (e = {}))[r] = t[r])
        return e
    },
    Ue = (t, e) => {
        const r = {}
        for (const n in t) (p(n) && n.slice(9) in e) || (r[n] = t[n])
        return r
    }
function qe(t, e, r) {
    const n = Object.keys(e)
    if (n.length !== Object.keys(t).length) return !0
    for (let i = 0; i < n.length; i++) {
        const o = n[i]
        if (e[o] !== t[o] && !Re(r, o)) return !0
    }
    return !1
}
function je(t, e) {
    if (An) {
        let r = An.provides
        const n = An.parent && An.parent.provides
        n === r && (r = An.provides = Object.create(n)), (r[t] = e)
    } else;
}
function De(t, e, r = !1) {
    const n = An || Te
    if (n) {
        const i = null == n.parent ? n.vnode.appContext && n.vnode.appContext.provides : n.parent.provides
        if (i && t in i) return i[t]
        if (arguments.length > 1) return r && _(e) ? e.call(n.proxy) : e
    }
}
const ze = {}
function Ge(t, e, r) {
    return $e(t, e, r)
}
function $e(t, e, { immediate: r, deep: n, flush: i, onTrack: o, onTrigger: s } = l, a = An) {
    let u,
        c,
        f = !1,
        d = !1
    if (
        (Zt(t)
            ? ((u = () => t.value), (f = !!t._shallow))
            : Ht(t)
            ? ((u = () => t), (n = !0))
            : b(t)
            ? ((d = !0), (f = t.some(Ht)), (u = () => t.map((t) => (Zt(t) ? t.value : Ht(t) ? We(t) : _(t) ? oe(t, a, 2) : void 0))))
            : (u = _(t)
                  ? e
                      ? () => oe(t, a, 2)
                      : () => {
                            if (!a || !a.isUnmounted) return c && c(), se(t, a, 3, [p])
                        }
                  : h),
        e && n)
    ) {
        const t = u
        u = () => We(t())
    }
    let p = (t) => {
            c = w.options.onStop = () => {
                oe(t, a, 4)
            }
        },
        m = d ? [] : ze
    const v = () => {
        if (w.active)
            if (e) {
                const t = w()
                ;(n || f || (d ? t.some((t, e) => L(t, m[e])) : L(t, m))) && (c && c(), se(e, a, 3, [t, m === ze ? void 0 : m, p]), (m = t))
            } else w()
    }
    let y
    ;(v.allowRecurse = !!e),
        (y =
            "sync" === i
                ? v
                : "post" === i
                ? () => zr(v, a && a.suspense)
                : () => {
                      !a || a.isMounted
                          ? (function (t) {
                                Me(t, de, fe, pe)
                            })(v)
                          : v()
                  })
    const w = V(u, { lazy: !0, onTrack: o, onTrigger: s, scheduler: y })
    return (
        On(w, a),
        e ? (r ? v() : (m = w())) : "post" === i ? zr(w, a && a.suspense) : w(),
        () => {
            W(w), a && g(a.effects, w)
        }
    )
}
function He(t, e, r) {
    const n = this.proxy,
        i = E(t) ? (t.includes(".") ? Ve(n, t) : () => n[t]) : t.bind(n, n)
    let o
    return _(e) ? (o = e) : ((o = e.handler), (r = e)), $e(i, o.bind(n), r, this)
}
function Ve(t, e) {
    const r = e.split(".")
    return () => {
        let e = t
        for (let t = 0; t < r.length && e; t++) e = e[r[t]]
        return e
    }
}
function We(t, e = new Set()) {
    if (!M(t) || e.has(t) || t.__v_skip) return t
    if ((e.add(t), Zt(t))) We(t.value, e)
    else if (b(t)) for (let r = 0; r < t.length; r++) We(t[r], e)
    else if ("[object Set]" === N(t) || w(t))
        t.forEach((t) => {
            We(t, e)
        })
    else if (((t) => "[object Object]" === N(t))(t)) for (const r in t) We(t[r], e)
    return t
}
function Ke(t) {
    return _(t) ? { setup: t, name: t.name } : t
}
const Je = (t) => !!t.type.__asyncLoader,
    Xe = (t) => t.type.__isKeepAlive
function Ze(t, e) {
    Ye(t, "a", e)
}
function Qe(t, e) {
    Ye(t, "da", e)
}
function Ye(t, e, r = An) {
    const n =
        t.__wdc ||
        (t.__wdc = () => {
            let e = r
            for (; e; ) {
                if (e.isDeactivated) return
                e = e.parent
            }
            t()
        })
    if ((er(e, n, r), r)) {
        let t = r.parent
        for (; t && t.parent; ) Xe(t.parent.vnode) && tr(n, e, r, t), (t = t.parent)
    }
}
function tr(t, e, r, n) {
    const i = er(e, t, n, !0)
    lr(() => {
        g(n[e], i)
    }, r)
}
function er(t, e, r = An, n = !1) {
    if (r) {
        const i = r[t] || (r[t] = []),
            o =
                e.__weh ||
                (e.__weh = (...n) => {
                    if (r.isUnmounted) return
                    Q(), Nn(r)
                    const i = se(e, r, t, n)
                    return Nn(null), Y(), i
                })
        return n ? i.unshift(o) : i.push(o), o
    }
}
const rr =
        (t) =>
        (e, r = An) =>
            (!Sn || "sp" === t) && er(t, e, r),
    nr = rr("bm"),
    ir = rr("m"),
    or = rr("bu"),
    sr = rr("u"),
    ar = rr("bum"),
    lr = rr("um"),
    ur = rr("sp"),
    hr = rr("rtg"),
    cr = rr("rtc")
function fr(t, e = An) {
    er("ec", t, e)
}
let dr = !0
function pr(t) {
    const e = vr(t),
        r = t.proxy,
        n = t.ctx
    ;(dr = !1), e.beforeCreate && mr(e.beforeCreate, t, "bc")
    const {
        data: i,
        computed: o,
        methods: s,
        watch: a,
        provide: l,
        inject: u,
        created: c,
        beforeMount: f,
        mounted: d,
        beforeUpdate: p,
        updated: m,
        activated: g,
        deactivated: v,
        beforeDestroy: y,
        beforeUnmount: w,
        destroyed: E,
        unmounted: k,
        render: x,
        renderTracked: A,
        renderTriggered: N,
        errorCaptured: P,
        serverPrefetch: S,
        expose: I,
        inheritAttrs: R,
        components: T,
        directives: O,
        filters: C,
    } = e
    if (
        (u &&
            (function (t, e, r = h) {
                b(t) && (t = _r(t))
                for (const n in t) {
                    const r = t[n]
                    M(r) ? (e[n] = "default" in r ? De(r.from || n, r.default, !0) : De(r.from || n)) : (e[n] = De(r))
                }
            })(u, n, null),
        s)
    )
        for (const h in s) {
            const t = s[h]
            _(t) && (n[h] = t.bind(r))
        }
    if (i) {
        const e = i.call(r, r)
        M(e) && (t.data = zt(e))
    }
    if (((dr = !0), o))
        for (const b in o) {
            const t = o[b],
                e = Bn({ get: _(t) ? t.bind(r, r) : _(t.get) ? t.get.bind(r, r) : h, set: !_(t) && _(t.set) ? t.set.bind(r) : h })
            Object.defineProperty(n, b, { enumerable: !0, configurable: !0, get: () => e.value, set: (t) => (e.value = t) })
        }
    if (a) for (const h in a) gr(a[h], n, r, h)
    if (l) {
        const t = _(l) ? l.call(r) : l
        Reflect.ownKeys(t).forEach((e) => {
            je(e, t[e])
        })
    }
    function B(t, e) {
        b(e) ? e.forEach((e) => t(e.bind(r))) : e && t(e.bind(r))
    }
    if (
        (c && mr(c, t, "c"),
        B(nr, f),
        B(ir, d),
        B(or, p),
        B(sr, m),
        B(Ze, g),
        B(Qe, v),
        B(fr, P),
        B(cr, A),
        B(hr, N),
        B(ar, w),
        B(lr, k),
        B(ur, S),
        b(I))
    )
        if (I.length) {
            const e = t.exposed || (t.exposed = {})
            I.forEach((t) => {
                Object.defineProperty(e, t, { get: () => r[t], set: (e) => (r[t] = e) })
            })
        } else t.exposed || (t.exposed = {})
    x && t.render === h && (t.render = x), null != R && (t.inheritAttrs = R), T && (t.components = T), O && (t.directives = O)
}
function mr(t, e, r) {
    se(b(t) ? t.map((t) => t.bind(e.proxy)) : t.bind(e.proxy), e, r)
}
function gr(t, e, r, n) {
    const i = n.includes(".") ? Ve(r, n) : () => r[n]
    if (E(t)) {
        const r = e[t]
        _(r) && Ge(i, r)
    } else if (_(t)) Ge(i, t.bind(r))
    else if (M(t))
        if (b(t)) t.forEach((t) => gr(t, e, r, n))
        else {
            const n = _(t.handler) ? t.handler.bind(r) : e[t.handler]
            _(n) && Ge(i, n, t)
        }
}
function vr(t) {
    const e = t.type,
        { mixins: r, extends: n } = e,
        {
            mixins: i,
            optionsCache: o,
            config: { optionMergeStrategies: s },
        } = t.appContext,
        a = o.get(e)
    let l
    return a ? (l = a) : i.length || r || n ? ((l = {}), i.length && i.forEach((t) => yr(l, t, s, !0)), yr(l, e, s)) : (l = e), o.set(e, l), l
}
function yr(t, e, r, n = !1) {
    const { mixins: i, extends: o } = e
    o && yr(t, o, r, !0), i && i.forEach((e) => yr(t, e, r, !0))
    for (const s in e)
        if (n && "expose" === s);
        else {
            const n = br[s] || (r && r[s])
            t[s] = n ? n(t[s], e[s]) : e[s]
        }
    return t
}
const br = {
    data: wr,
    props: kr,
    emits: kr,
    methods: kr,
    computed: kr,
    beforeCreate: Er,
    created: Er,
    beforeMount: Er,
    mounted: Er,
    beforeUpdate: Er,
    updated: Er,
    beforeDestroy: Er,
    destroyed: Er,
    activated: Er,
    deactivated: Er,
    errorCaptured: Er,
    serverPrefetch: Er,
    components: kr,
    directives: kr,
    watch: function (t, e) {
        if (!t) return e
        if (!e) return t
        const r = m(Object.create(null), t)
        for (const n in e) r[n] = Er(t[n], e[n])
        return r
    },
    provide: wr,
    inject: function (t, e) {
        return kr(_r(t), _r(e))
    },
}
function wr(t, e) {
    return e
        ? t
            ? function () {
                  return m(_(t) ? t.call(this, this) : t, _(e) ? e.call(this, this) : e)
              }
            : e
        : t
}
function _r(t) {
    if (b(t)) {
        const e = {}
        for (let r = 0; r < t.length; r++) e[t[r]] = t[r]
        return e
    }
    return t
}
function Er(t, e) {
    return t ? [...new Set([].concat(t, e))] : e
}
function kr(t, e) {
    return t ? m(m(Object.create(null), t), e) : e
}
function Mr(t, e, r, n = !1) {
    const i = {},
        o = {}
    q(o, un, 1), (t.propsDefaults = Object.create(null)), xr(t, e, i, o)
    for (const s in t.propsOptions[0]) s in i || (i[s] = void 0)
    r ? (t.props = n ? i : $t(i, !1, dt, Bt, Ut)) : t.type.props ? (t.props = i) : (t.props = o), (t.attrs = o)
}
function xr(t, e, r, n) {
    const [i, o] = t.propsOptions
    let s,
        a = !1
    if (e)
        for (let l in e) {
            if (S(l)) continue
            const u = e[l]
            let h
            i && y(i, (h = T(l)))
                ? o && o.includes(h)
                    ? ((s || (s = {}))[h] = u)
                    : (r[h] = u)
                : Re(t.emitsOptions, l) || (u !== n[l] && ((n[l] = u), (a = !0)))
        }
    if (o) {
        const e = Kt(r),
            n = s || l
        for (let s = 0; s < o.length; s++) {
            const a = o[s]
            r[a] = Ar(i, e, a, n[a], t, !y(n, a))
        }
    }
    return a
}
function Ar(t, e, r, n, i, o) {
    const s = t[r]
    if (null != s) {
        const t = y(s, "default")
        if (t && void 0 === n) {
            const t = s.default
            if (s.type !== Function && _(t)) {
                const { propsDefaults: o } = i
                r in o ? (n = o[r]) : (Nn(i), (n = o[r] = t.call(null, e)), Nn(null))
            } else n = t
        }
        s[0] && (o && !t ? (n = !1) : !s[1] || ("" !== n && n !== C(r)) || (n = !0))
    }
    return n
}
function Nr(t, e, r = !1) {
    const n = e.propsCache,
        i = n.get(t)
    if (i) return i
    const o = t.props,
        s = {},
        a = []
    let h = !1
    if (!_(t)) {
        const n = (t) => {
            h = !0
            const [r, n] = Nr(t, e, !0)
            m(s, r), n && a.push(...n)
        }
        !r && e.mixins.length && e.mixins.forEach(n), t.extends && n(t.extends), t.mixins && t.mixins.forEach(n)
    }
    if (!o && !h) return n.set(t, u), u
    if (b(o))
        for (let u = 0; u < o.length; u++) {
            const t = T(o[u])
            Pr(t) && (s[t] = l)
        }
    else if (o)
        for (const l in o) {
            const t = T(l)
            if (Pr(t)) {
                const e = o[l],
                    r = (s[t] = b(e) || _(e) ? { type: e } : e)
                if (r) {
                    const e = Rr(Boolean, r.type),
                        n = Rr(String, r.type)
                    ;(r[0] = e > -1), (r[1] = n < 0 || e < n), (e > -1 || y(r, "default")) && a.push(t)
                }
            }
        }
    const c = [s, a]
    return n.set(t, c), c
}
function Pr(t) {
    return "$" !== t[0]
}
function Sr(t) {
    const e = t && t.toString().match(/^\s*function (\w+)/)
    return e ? e[1] : ""
}
function Ir(t, e) {
    return Sr(t) === Sr(e)
}
function Rr(t, e) {
    return b(e) ? e.findIndex((e) => Ir(e, t)) : _(e) && Ir(e, t) ? 0 : -1
}
const Tr = (t) => "_" === t[0] || "$stable" === t,
    Or = (t) => (b(t) ? t.map(mn) : [mn(t)]),
    Cr = (t, e, r) => {
        const n = Be((t) => Or(e(t)), r)
        return (n._c = !1), n
    },
    Br = (t, e, r) => {
        const n = t._ctx
        for (const i in t) {
            if (Tr(i)) continue
            const r = t[i]
            if (_(r)) e[i] = Cr(0, r, n)
            else if (null != r) {
                const t = Or(r)
                e[i] = () => t
            }
        }
    },
    Fr = (t, e) => {
        const r = Or(e)
        t.slots.default = () => r
    }
function Lr(t, e, r, n) {
    const i = t.dirs,
        o = e && e.dirs
    for (let s = 0; s < i.length; s++) {
        const a = i[s]
        o && (a.oldValue = o[s].value)
        let l = a.dir[n]
        l && (Q(), se(l, r, 8, [t.el, a, t, e]), Y())
    }
}
function Ur() {
    return {
        app: null,
        config: {
            isNativeTag: c,
            performance: !1,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: void 0,
            warnHandler: void 0,
            compilerOptions: {},
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap(),
    }
}
let qr = 0
function jr(t, e) {
    return function (r, n = null) {
        null == n || M(n) || (n = null)
        const i = Ur(),
            o = new Set()
        let s = !1
        const a = (i.app = {
            _uid: qr++,
            _component: r,
            _props: n,
            _container: null,
            _context: i,
            _instance: null,
            version: Ln,
            get config() {
                return i.config
            },
            set config(t) {},
            use: (t, ...e) => (o.has(t) || (t && _(t.install) ? (o.add(t), t.install(a, ...e)) : _(t) && (o.add(t), t(a, ...e))), a),
            mixin: (t) => (i.mixins.includes(t) || i.mixins.push(t), a),
            component: (t, e) => (e ? ((i.components[t] = e), a) : i.components[t]),
            directive: (t, e) => (e ? ((i.directives[t] = e), a) : i.directives[t]),
            mount(o, l, u) {
                if (!s) {
                    const h = fn(r, n)
                    return (
                        (h.appContext = i), l && e ? e(h, o) : t(h, o, u), (s = !0), (a._container = o), (o.__vue_app__ = a), h.component.proxy
                    )
                }
            },
            unmount() {
                s && (t(null, a._container), delete a._container.__vue_app__)
            },
            provide: (t, e) => ((i.provides[t] = e), a),
        })
        return a
    }
}
const Dr = { scheduler: Ee, allowRecurse: !0 },
    zr = function (t, e) {
        e && e.pendingBranch ? (b(t) ? e.effects.push(...t) : e.effects.push(t)) : Me(t, ge, me, ve)
    },
    Gr = (t, e, r, n, i = !1) => {
        if (b(t)) return void t.forEach((t, o) => Gr(t, e && (b(e) ? e[o] : e), r, n, i))
        if (Je(n) && !i) return
        const o = 4 & n.shapeFlag ? Tn(n.component) || n.component.proxy : n.el,
            s = i ? null : o,
            { i: a, r: u } = t,
            h = e && e.r,
            c = a.refs === l ? (a.refs = {}) : a.refs,
            f = a.setupState
        if ((null != h && h !== u && (E(h) ? ((c[h] = null), y(f, h) && (f[h] = null)) : Zt(h) && (h.value = null)), E(u))) {
            const t = () => {
                ;(c[u] = s), y(f, u) && (f[u] = s)
            }
            s ? ((t.id = -1), zr(t, r)) : t()
        } else if (Zt(u)) {
            const t = () => {
                u.value = s
            }
            s ? ((t.id = -1), zr(t, r)) : t()
        } else _(u) && oe(u, a, 12, [s, c])
    }
function $r(t) {
    return (function (t, e) {
        const {
                insert: r,
                remove: n,
                patchProp: i,
                forcePatchProp: o,
                createElement: s,
                createText: a,
                createComment: c,
                setText: f,
                setElementText: d,
                parentNode: p,
                nextSibling: g,
                setScopeId: v = h,
                cloneNode: b,
                insertStaticContent: w,
            } = t,
            _ = (t, e, r, n = null, i = null, o = null, s = !1, a = null, l = !1) => {
                t && !ln(t, e) && ((n = st(t)), tt(t, i, o, !0), (t = null)), -2 === e.patchFlag && ((l = !1), (e.dynamicChildren = null))
                const { type: u, ref: h, shapeFlag: c } = e
                switch (u) {
                    case Zr:
                        E(t, e, r, n)
                        break
                    case Qr:
                        k(t, e, r, n)
                        break
                    case Yr:
                        null == t && M(e, r, n, s)
                        break
                    case Xr:
                        j(t, e, r, n, i, o, s, a, l)
                        break
                    default:
                        1 & c
                            ? P(t, e, r, n, i, o, s, a, l)
                            : 6 & c
                            ? D(t, e, r, n, i, o, s, a, l)
                            : (64 & c || 128 & c) && u.process(t, e, r, n, i, o, s, a, l, lt)
                }
                null != h && i && Gr(h, t && t.ref, o, e || t, !e)
            },
            E = (t, e, n, i) => {
                if (null == t) r((e.el = a(e.children)), n, i)
                else {
                    const r = (e.el = t.el)
                    e.children !== t.children && f(r, e.children)
                }
            },
            k = (t, e, n, i) => {
                null == t ? r((e.el = c(e.children || "")), n, i) : (e.el = t.el)
            },
            M = (t, e, r, n) => {
                const i = w(t.children, e, r, n, t.staticCache)
                t.el || (t.staticCache = i), (t.el = i[0]), (t.anchor = i[i.length - 1])
            },
            A = ({ el: t, anchor: e }, n, i) => {
                let o
                for (; t && t !== e; ) (o = g(t)), r(t, n, i), (t = o)
                r(e, n, i)
            },
            N = ({ el: t, anchor: e }) => {
                let r
                for (; t && t !== e; ) (r = g(t)), n(t), (t = r)
                n(e)
            },
            P = (t, e, r, n, i, o, s, a, l) => {
                ;(s = s || "svg" === e.type), null == t ? I(e, r, n, i, o, s, a, l) : B(t, e, i, o, s, a, l)
            },
            I = (t, e, n, o, a, l, u, h) => {
                let c, f
                const { type: p, props: m, shapeFlag: g, transition: v, patchFlag: y, dirs: w } = t
                if (t.el && void 0 !== b && -1 === y) c = t.el = b(t.el)
                else {
                    if (
                        ((c = t.el = s(t.type, l, m && m.is, m)),
                        8 & g
                            ? d(c, t.children)
                            : 16 & g && O(t.children, c, null, o, a, l && "foreignObject" !== p, u, h || !!t.dynamicChildren),
                        w && Lr(t, null, o, "created"),
                        m)
                    ) {
                        for (const e in m) S(e) || i(c, e, null, m[e], l, t.children, o, a, ot)
                        ;(f = m.onVnodeBeforeMount) && Hr(f, o, t)
                    }
                    R(c, t, t.scopeId, u, o)
                }
                w && Lr(t, null, o, "beforeMount")
                const _ = (!a || (a && !a.pendingBranch)) && v && !v.persisted
                _ && v.beforeEnter(c),
                    r(c, e, n),
                    ((f = m && m.onVnodeMounted) || _ || w) &&
                        zr(() => {
                            f && Hr(f, o, t), _ && v.enter(c), w && Lr(t, null, o, "mounted")
                        }, a)
            },
            R = (t, e, r, n, i) => {
                if ((r && v(t, r), n)) for (let o = 0; o < n.length; o++) v(t, n[o])
                if (i) {
                    if (e === i.subTree) {
                        const e = i.vnode
                        R(t, e, e.scopeId, e.slotScopeIds, i.parent)
                    }
                }
            },
            O = (t, e, r, n, i, o, s, a, l = 0) => {
                for (let u = l; u < t.length; u++) {
                    const l = (t[u] = a ? gn(t[u]) : mn(t[u]))
                    _(null, l, e, r, n, i, o, s, a)
                }
            },
            B = (t, e, r, n, s, a, u) => {
                const h = (e.el = t.el)
                let { patchFlag: c, dynamicChildren: f, dirs: p } = e
                c |= 16 & t.patchFlag
                const m = t.props || l,
                    g = e.props || l
                let v
                if (((v = g.onVnodeBeforeUpdate) && Hr(v, r, e, t), p && Lr(e, t, r, "beforeUpdate"), c > 0)) {
                    if (16 & c) L(h, e, m, g, r, n, s)
                    else if (
                        (2 & c && m.class !== g.class && i(h, "class", null, g.class, s), 4 & c && i(h, "style", m.style, g.style, s), 8 & c)
                    ) {
                        const a = e.dynamicProps
                        for (let e = 0; e < a.length; e++) {
                            const l = a[e],
                                u = m[l],
                                c = g[l]
                            ;(c !== u || (o && o(h, l))) && i(h, l, u, c, s, t.children, r, n, ot)
                        }
                    }
                    1 & c && t.children !== e.children && d(h, e.children)
                } else u || null != f || L(h, e, m, g, r, n, s)
                const y = s && "foreignObject" !== e.type
                f ? F(t.dynamicChildren, f, h, r, n, y, a) : u || K(t, e, h, null, r, n, y, a, !1),
                    ((v = g.onVnodeUpdated) || p) &&
                        zr(() => {
                            v && Hr(v, r, e, t), p && Lr(e, t, r, "updated")
                        }, n)
            },
            F = (t, e, r, n, i, o, s) => {
                for (let a = 0; a < e.length; a++) {
                    const l = t[a],
                        u = e[a],
                        h = l.el && (l.type === Xr || !ln(l, u) || 6 & l.shapeFlag || 64 & l.shapeFlag) ? p(l.el) : r
                    _(l, u, h, null, n, i, o, s, !0)
                }
            },
            L = (t, e, r, n, s, a, u) => {
                if (r !== n) {
                    for (const l in n) {
                        if (S(l)) continue
                        const h = n[l],
                            c = r[l]
                        ;(h !== c || (o && o(t, l))) && i(t, l, c, h, u, e.children, s, a, ot)
                    }
                    if (r !== l) for (const o in r) S(o) || o in n || i(t, o, r[o], null, u, e.children, s, a, ot)
                }
            },
            j = (t, e, n, i, o, s, l, u, h) => {
                const c = (e.el = t ? t.el : a("")),
                    f = (e.anchor = t ? t.anchor : a(""))
                let { patchFlag: d, dynamicChildren: p, slotScopeIds: m } = e
                p && (h = !0),
                    m && (u = u ? u.concat(m) : m),
                    null == t
                        ? (r(c, n, i), r(f, n, i), O(e.children, n, f, o, s, l, u, h))
                        : d > 0 && 64 & d && p && t.dynamicChildren
                        ? (F(t.dynamicChildren, p, n, o, s, l, u), (null != e.key || (o && e === o.subTree)) && Vr(t, e, !0))
                        : K(t, e, n, f, o, s, l, u, h)
            },
            D = (t, e, r, n, i, o, s, a, l) => {
                ;(e.slotScopeIds = a), null == t ? (512 & e.shapeFlag ? i.ctx.activate(e, r, n, s, l) : z(e, r, n, i, o, s, l)) : G(t, e, l)
            },
            z = (t, e, r, n, i, o, s) => {
                const a = (t.component = (function (t, e, r) {
                    const n = t.type,
                        i = (e ? e.appContext : t.appContext) || Mn,
                        o = {
                            uid: xn++,
                            vnode: t,
                            type: n,
                            parent: e,
                            appContext: i,
                            root: null,
                            next: null,
                            subTree: null,
                            update: null,
                            render: null,
                            proxy: null,
                            exposed: null,
                            exposeProxy: null,
                            withProxy: null,
                            effects: null,
                            provides: e ? e.provides : Object.create(i.provides),
                            accessCache: null,
                            renderCache: [],
                            components: null,
                            directives: null,
                            propsOptions: Nr(n, i),
                            emitsOptions: Ie(n, i),
                            emit: null,
                            emitted: null,
                            propsDefaults: l,
                            inheritAttrs: n.inheritAttrs,
                            ctx: l,
                            data: l,
                            props: l,
                            attrs: l,
                            slots: l,
                            refs: l,
                            setupState: l,
                            setupContext: null,
                            suspense: r,
                            suspenseId: r ? r.pendingId : 0,
                            asyncDep: null,
                            asyncResolved: !1,
                            isMounted: !1,
                            isUnmounted: !1,
                            isDeactivated: !1,
                            bc: null,
                            c: null,
                            bm: null,
                            m: null,
                            bu: null,
                            u: null,
                            um: null,
                            bum: null,
                            da: null,
                            a: null,
                            rtg: null,
                            rtc: null,
                            ec: null,
                            sp: null,
                        }
                    return (o.ctx = { _: o }), (o.root = e ? e.root : o), (o.emit = Se.bind(null, o)), o
                })(t, n, i))
                if (
                    (Xe(t) && (a.ctx.renderer = lt),
                    (function (t, e = !1) {
                        Sn = e
                        const { props: r, children: n } = t.vnode,
                            i = Pn(t)
                        Mr(t, r, i, e),
                            ((t, e) => {
                                if (32 & t.vnode.shapeFlag) {
                                    const r = e._
                                    r ? ((t.slots = Kt(e)), q(e, "_", r)) : Br(e, (t.slots = {}))
                                } else (t.slots = {}), e && Fr(t, e)
                                q(t.slots, un, 1)
                            })(t, n)
                        const o = i
                            ? (function (t, e) {
                                  const r = t.type
                                  ;(t.accessCache = Object.create(null)), (t.proxy = Jt(new Proxy(t.ctx, En)))
                                  const { setup: n } = r
                                  if (n) {
                                      const r = (t.setupContext =
                                          n.length > 1
                                              ? (function (t) {
                                                    const e = (e) => {
                                                        t.exposed = e || {}
                                                    }
                                                    return { attrs: t.attrs, slots: t.slots, emit: t.emit, expose: e }
                                                })(t)
                                              : null)
                                      ;(An = t), Q()
                                      const i = oe(n, t, 0, [t.props, r])
                                      if ((Y(), (An = null), x(i))) {
                                          const r = () => {
                                              An = null
                                          }
                                          if ((i.then(r, r), e))
                                              return i
                                                  .then((e) => {
                                                      In(t, e)
                                                  })
                                                  .catch((e) => {
                                                      ae(e, t, 0)
                                                  })
                                          t.asyncDep = i
                                      } else In(t, i)
                                  } else Rn(t)
                              })(t, e)
                            : void 0
                        Sn = !1
                    })(a),
                    a.asyncDep)
                ) {
                    if ((i && i.registerDep(a, $), !t.el)) {
                        const t = (a.subTree = fn(Qr))
                        k(null, t, e, r)
                    }
                } else $(a, t, e, r, i, o, s)
            },
            G = (t, e, r) => {
                const n = (e.component = t.component)
                if (
                    (function (t, e, r) {
                        const { props: n, children: i, component: o } = t,
                            { props: s, children: a, patchFlag: l } = e,
                            u = o.emitsOptions
                        if (e.dirs || e.transition) return !0
                        if (!(r && l >= 0)) return !((!i && !a) || (a && a.$stable)) || (n !== s && (n ? !s || qe(n, s, u) : !!s))
                        if (1024 & l) return !0
                        if (16 & l) return n ? qe(n, s, u) : !!s
                        if (8 & l) {
                            const t = e.dynamicProps
                            for (let e = 0; e < t.length; e++) {
                                const r = t[e]
                                if (s[r] !== n[r] && !Re(u, r)) return !0
                            }
                        }
                        return !1
                    })(t, e, r)
                ) {
                    if (n.asyncDep && !n.asyncResolved) return void H(n, e, r)
                    ;(n.next = e),
                        (function (t) {
                            const e = he.indexOf(t)
                            e > ce && he.splice(e, 1)
                        })(n.update),
                        n.update()
                } else (e.component = t.component), (e.el = t.el), (n.vnode = e)
            },
            $ = (t, e, r, n, i, o, s) => {
                t.update = V(function () {
                    if (t.isMounted) {
                        let e,
                            { next: r, bu: n, u: a, parent: l, vnode: u } = t,
                            h = r
                        r ? ((r.el = u.el), H(t, r, s)) : (r = u), n && U(n), (e = r.props && r.props.onVnodeBeforeUpdate) && Hr(e, l, r, u)
                        const c = Fe(t),
                            f = t.subTree
                        ;(t.subTree = c),
                            _(f, c, p(f.el), st(f), t, i, o),
                            (r.el = c.el),
                            null === h &&
                                (function ({ vnode: t, parent: e }, r) {
                                    for (; e && e.subTree === t; ) ((t = e.vnode).el = r), (e = e.parent)
                                })(t, c.el),
                            a && zr(a, i),
                            (e = r.props && r.props.onVnodeUpdated) && zr(() => Hr(e, l, r, u), i)
                    } else {
                        let s
                        const { el: a, props: l } = e,
                            { bm: u, m: h, parent: c } = t
                        if ((u && U(u), (s = l && l.onVnodeBeforeMount) && Hr(s, c, e), a && ht)) {
                            const r = () => {
                                ;(t.subTree = Fe(t)), ht(a, t.subTree, t, i, null)
                            }
                            Je(e) ? e.type.__asyncLoader().then(() => !t.isUnmounted && r()) : r()
                        } else {
                            const s = (t.subTree = Fe(t))
                            _(null, s, r, n, t, i, o), (e.el = s.el)
                        }
                        if ((h && zr(h, i), (s = l && l.onVnodeMounted))) {
                            const t = e
                            zr(() => Hr(s, c, t), i)
                        }
                        256 & e.shapeFlag && t.a && zr(t.a, i), (t.isMounted = !0), (e = r = n = null)
                    }
                }, Dr)
            },
            H = (t, e, r) => {
                e.component = t
                const n = t.vnode.props
                ;(t.vnode = e),
                    (t.next = null),
                    (function (t, e, r, n) {
                        const {
                                props: i,
                                attrs: o,
                                vnode: { patchFlag: s },
                            } = t,
                            a = Kt(i),
                            [l] = t.propsOptions
                        let u = !1
                        if (!(n || s > 0) || 16 & s) {
                            let n
                            xr(t, e, i, o) && (u = !0)
                            for (const o in a)
                                (e && (y(e, o) || ((n = C(o)) !== o && y(e, n)))) ||
                                    (l ? !r || (void 0 === r[o] && void 0 === r[n]) || (i[o] = Ar(l, a, o, void 0, t, !0)) : delete i[o])
                            if (o !== a) for (const t in o) (e && y(e, t)) || (delete o[t], (u = !0))
                        } else if (8 & s) {
                            const r = t.vnode.dynamicProps
                            for (let n = 0; n < r.length; n++) {
                                let s = r[n]
                                const h = e[s]
                                if (l)
                                    if (y(o, s)) h !== o[s] && ((o[s] = h), (u = !0))
                                    else {
                                        const e = T(s)
                                        i[e] = Ar(l, a, e, h, t, !1)
                                    }
                                else h !== o[s] && ((o[s] = h), (u = !0))
                            }
                        }
                        u && et(t, "set", "$attrs")
                    })(t, e.props, n, r),
                    ((t, e, r) => {
                        const { vnode: n, slots: i } = t
                        let o = !0,
                            s = l
                        if (32 & n.shapeFlag) {
                            const t = e._
                            t ? (r && 1 === t ? (o = !1) : (m(i, e), r || 1 !== t || delete i._)) : ((o = !e.$stable), Br(e, i)), (s = e)
                        } else e && (Fr(t, e), (s = { default: 1 }))
                        if (o) for (const a in i) Tr(a) || a in s || delete i[a]
                    })(t, e.children, r),
                    Q(),
                    xe(void 0, t.update),
                    Y()
            },
            K = (t, e, r, n, i, o, s, a, l = !1) => {
                const u = t && t.children,
                    h = t ? t.shapeFlag : 0,
                    c = e.children,
                    { patchFlag: f, shapeFlag: p } = e
                if (f > 0) {
                    if (128 & f) return void X(u, c, r, n, i, o, s, a, l)
                    if (256 & f) return void J(u, c, r, n, i, o, s, a, l)
                }
                8 & p
                    ? (16 & h && ot(u, i, o), c !== u && d(r, c))
                    : 16 & h
                    ? 16 & p
                        ? X(u, c, r, n, i, o, s, a, l)
                        : ot(u, i, o, !0)
                    : (8 & h && d(r, ""), 16 & p && O(c, r, n, i, o, s, a, l))
            },
            J = (t, e, r, n, i, o, s, a, l) => {
                e = e || u
                const h = (t = t || u).length,
                    c = e.length,
                    f = Math.min(h, c)
                let d
                for (d = 0; d < f; d++) {
                    const n = (e[d] = l ? gn(e[d]) : mn(e[d]))
                    _(t[d], n, r, null, i, o, s, a, l)
                }
                h > c ? ot(t, i, o, !0, !1, f) : O(e, r, n, i, o, s, a, l, f)
            },
            X = (t, e, r, n, i, o, s, a, l) => {
                let h = 0
                const c = e.length
                let f = t.length - 1,
                    d = c - 1
                for (; h <= f && h <= d; ) {
                    const n = t[h],
                        u = (e[h] = l ? gn(e[h]) : mn(e[h]))
                    if (!ln(n, u)) break
                    _(n, u, r, null, i, o, s, a, l), h++
                }
                for (; h <= f && h <= d; ) {
                    const n = t[f],
                        u = (e[d] = l ? gn(e[d]) : mn(e[d]))
                    if (!ln(n, u)) break
                    _(n, u, r, null, i, o, s, a, l), f--, d--
                }
                if (h > f) {
                    if (h <= d) {
                        const t = d + 1,
                            u = t < c ? e[t].el : n
                        for (; h <= d; ) _(null, (e[h] = l ? gn(e[h]) : mn(e[h])), r, u, i, o, s, a, l), h++
                    }
                } else if (h > d) for (; h <= f; ) tt(t[h], i, o, !0), h++
                else {
                    const p = h,
                        m = h,
                        g = new Map()
                    for (h = m; h <= d; h++) {
                        const t = (e[h] = l ? gn(e[h]) : mn(e[h]))
                        null != t.key && g.set(t.key, h)
                    }
                    let v,
                        y = 0
                    const b = d - m + 1
                    let w = !1,
                        E = 0
                    const k = new Array(b)
                    for (h = 0; h < b; h++) k[h] = 0
                    for (h = p; h <= f; h++) {
                        const n = t[h]
                        if (y >= b) {
                            tt(n, i, o, !0)
                            continue
                        }
                        let u
                        if (null != n.key) u = g.get(n.key)
                        else
                            for (v = m; v <= d; v++)
                                if (0 === k[v - m] && ln(n, e[v])) {
                                    u = v
                                    break
                                }
                        void 0 === u
                            ? tt(n, i, o, !0)
                            : ((k[u - m] = h + 1), u >= E ? (E = u) : (w = !0), _(n, e[u], r, null, i, o, s, a, l), y++)
                    }
                    const M = w
                        ? (function (t) {
                              const e = t.slice(),
                                  r = [0]
                              let n, i, o, s, a
                              const l = t.length
                              for (n = 0; n < l; n++) {
                                  const l = t[n]
                                  if (0 !== l) {
                                      if (((i = r[r.length - 1]), t[i] < l)) {
                                          ;(e[n] = i), r.push(n)
                                          continue
                                      }
                                      for (o = 0, s = r.length - 1; o < s; ) (a = ((o + s) / 2) | 0), t[r[a]] < l ? (o = a + 1) : (s = a)
                                      l < t[r[o]] && (o > 0 && (e[n] = r[o - 1]), (r[o] = n))
                                  }
                              }
                              ;(o = r.length), (s = r[o - 1])
                              for (; o-- > 0; ) (r[o] = s), (s = e[s])
                              return r
                          })(k)
                        : u
                    for (v = M.length - 1, h = b - 1; h >= 0; h--) {
                        const t = m + h,
                            u = e[t],
                            f = t + 1 < c ? e[t + 1].el : n
                        0 === k[h] ? _(null, u, r, f, i, o, s, a, l) : w && (v < 0 || h !== M[v] ? Z(u, r, f, 2) : v--)
                    }
                }
            },
            Z = (t, e, n, i, o = null) => {
                const { el: s, type: a, transition: l, children: u, shapeFlag: h } = t
                if (6 & h) return void Z(t.component.subTree, e, n, i)
                if (128 & h) return void t.suspense.move(e, n, i)
                if (64 & h) return void a.move(t, e, n, lt)
                if (a === Xr) {
                    r(s, e, n)
                    for (let t = 0; t < u.length; t++) Z(u[t], e, n, i)
                    return void r(t.anchor, e, n)
                }
                if (a === Yr) return void A(t, e, n)
                if (2 !== i && 1 & h && l)
                    if (0 === i) l.beforeEnter(s), r(s, e, n), zr(() => l.enter(s), o)
                    else {
                        const { leave: t, delayLeave: i, afterLeave: o } = l,
                            a = () => r(s, e, n),
                            u = () => {
                                t(s, () => {
                                    a(), o && o()
                                })
                            }
                        i ? i(s, a, u) : u()
                    }
                else r(s, e, n)
            },
            tt = (t, e, r, n = !1, i = !1) => {
                const { type: o, props: s, ref: a, children: l, dynamicChildren: u, shapeFlag: h, patchFlag: c, dirs: f } = t
                if ((null != a && Gr(a, null, r, t, !0), 256 & h)) return void e.ctx.deactivate(t)
                const d = 1 & h && f
                let p
                if (((p = s && s.onVnodeBeforeUnmount) && Hr(p, e, t), 6 & h)) it(t.component, r, n)
                else {
                    if (128 & h) return void t.suspense.unmount(r, n)
                    d && Lr(t, null, e, "beforeUnmount"),
                        64 & h
                            ? t.type.remove(t, e, r, i, lt, n)
                            : u && (o !== Xr || (c > 0 && 64 & c))
                            ? ot(u, e, r, !1, !0)
                            : ((o === Xr && (128 & c || 256 & c)) || (!i && 16 & h)) && ot(l, e, r),
                        n && rt(t)
                }
                ;((p = s && s.onVnodeUnmounted) || d) &&
                    zr(() => {
                        p && Hr(p, e, t), d && Lr(t, null, e, "unmounted")
                    }, r)
            },
            rt = (t) => {
                const { type: e, el: r, anchor: i, transition: o } = t
                if (e === Xr) return void nt(r, i)
                if (e === Yr) return void N(t)
                const s = () => {
                    n(r), o && !o.persisted && o.afterLeave && o.afterLeave()
                }
                if (1 & t.shapeFlag && o && !o.persisted) {
                    const { leave: e, delayLeave: n } = o,
                        i = () => e(r, s)
                    n ? n(t.el, s, i) : i()
                } else s()
            },
            nt = (t, e) => {
                let r
                for (; t !== e; ) (r = g(t)), n(t), (t = r)
                n(e)
            },
            it = (t, e, r) => {
                const { bum: n, effects: i, update: o, subTree: s, um: a } = t
                if ((n && U(n), i)) for (let l = 0; l < i.length; l++) W(i[l])
                o && (W(o), tt(s, t, e, r)),
                    a && zr(a, e),
                    zr(() => {
                        t.isUnmounted = !0
                    }, e),
                    e &&
                        e.pendingBranch &&
                        !e.isUnmounted &&
                        t.asyncDep &&
                        !t.asyncResolved &&
                        t.suspenseId === e.pendingId &&
                        (e.deps--, 0 === e.deps && e.resolve())
            },
            ot = (t, e, r, n = !1, i = !1, o = 0) => {
                for (let s = o; s < t.length; s++) tt(t[s], e, r, n, i)
            },
            st = (t) => (6 & t.shapeFlag ? st(t.component.subTree) : 128 & t.shapeFlag ? t.suspense.next() : g(t.anchor || t.el)),
            at = (t, e, r) => {
                null == t ? e._vnode && tt(e._vnode, null, null, !0) : _(e._vnode || null, t, e, null, null, null, r), Ae(), (e._vnode = t)
            },
            lt = { p: _, um: tt, m: Z, r: rt, mt: z, mc: O, pc: K, pbc: F, n: st, o: t }
        let ut, ht
        e && ([ut, ht] = e(lt))
        return { render: at, hydrate: ut, createApp: jr(at, ut) }
    })(t)
}
function Hr(t, e, r, n = null) {
    se(t, e, 7, [r, n])
}
function Vr(t, e, r = !1) {
    const n = t.children,
        i = e.children
    if (b(n) && b(i))
        for (let o = 0; o < n.length; o++) {
            const t = n[o]
            let e = i[o]
            1 & e.shapeFlag &&
                !e.dynamicChildren &&
                ((e.patchFlag <= 0 || 32 === e.patchFlag) && ((e = i[o] = gn(i[o])), (e.el = t.el)), r || Vr(t, e))
        }
}
function Wr(t, e) {
    return (
        (function (t, e, r = !0, n = !1) {
            const i = Te || An
            if (i) {
                const r = i.type
                if ("components" === t) {
                    const t = Cn(r)
                    if (t && (t === e || t === T(e) || t === B(T(e)))) return r
                }
                const o = Jr(i[t] || r[t], e) || Jr(i.appContext[t], e)
                return !o && n ? r : o
            }
        })("components", t, !0, e) || t
    )
}
const Kr = Symbol()
function Jr(t, e) {
    return t && (t[e] || t[T(e)] || t[B(T(e))])
}
const Xr = Symbol(void 0),
    Zr = Symbol(void 0),
    Qr = Symbol(void 0),
    Yr = Symbol(void 0),
    tn = []
let en = null
function rn(t = !1) {
    tn.push((en = t ? null : []))
}
let nn = 1
function on(t) {
    nn += t
}
function sn(t, e, r, n, i) {
    const o = fn(t, e, r, n, i, !0)
    return (o.dynamicChildren = nn > 0 ? en || u : null), tn.pop(), (en = tn[tn.length - 1] || null), nn > 0 && en && en.push(o), o
}
function an(t) {
    return !!t && !0 === t.__v_isVNode
}
function ln(t, e) {
    return t.type === e.type && t.key === e.key
}
const un = "__vInternal",
    hn = ({ key: t }) => (null != t ? t : null),
    cn = ({ ref: t }) => (null != t ? (E(t) || Zt(t) || _(t) ? { i: Te, r: t } : t) : null),
    fn = function (t, e = null, r = null, i = 0, o = null, s = !1) {
        ;(t && t !== Kr) || (t = Qr)
        if (an(t)) {
            const n = dn(t, e, !0)
            return r && vn(n, r), n
        }
        ;(l = t), _(l) && "__vccOpts" in l && (t = t.__vccOpts)
        var l
        if (e) {
            ;(Wt(e) || un in e) && (e = m({}, e))
            let { class: t, style: r } = e
            t && !E(t) && (e.class = a(t)), M(r) && (Wt(r) && !b(r) && (r = m({}, r)), (e.style = n(r)))
        }
        const u = E(t) ? 1 : ((t) => t.__isSuspense)(t) ? 128 : ((t) => t.__isTeleport)(t) ? 64 : M(t) ? 4 : _(t) ? 2 : 0,
            h = {
                __v_isVNode: !0,
                __v_skip: !0,
                type: t,
                props: e,
                key: e && hn(e),
                ref: e && cn(e),
                scopeId: Oe,
                slotScopeIds: null,
                children: null,
                component: null,
                suspense: null,
                ssContent: null,
                ssFallback: null,
                dirs: null,
                transition: null,
                el: null,
                anchor: null,
                target: null,
                targetAnchor: null,
                shapeFlag: u,
                patchFlag: i,
                dynamicProps: o,
                dynamicChildren: null,
                appContext: null,
            }
        vn(h, r), 128 & u && t.normalize(h)
        nn > 0 && !s && en && (i > 0 || 6 & u) && 32 !== i && en.push(h)
        return h
    }
function dn(t, e, r = !1) {
    const { props: i, ref: o, patchFlag: s, children: l } = t,
        u = e
            ? (function (...t) {
                  const e = m({}, t[0])
                  for (let r = 1; r < t.length; r++) {
                      const i = t[r]
                      for (const t in i)
                          if ("class" === t) e.class !== i.class && (e.class = a([e.class, i.class]))
                          else if ("style" === t) e.style = n([e.style, i.style])
                          else if (d(t)) {
                              const r = e[t],
                                  n = i[t]
                              r !== n && (e[t] = r ? [].concat(r, n) : n)
                          } else "" !== t && (e[t] = i[t])
                  }
                  return e
              })(i || {}, e)
            : i
    return {
        __v_isVNode: !0,
        __v_skip: !0,
        type: t.type,
        props: u,
        key: u && hn(u),
        ref: e && e.ref ? (r && o ? (b(o) ? o.concat(cn(e)) : [o, cn(e)]) : cn(e)) : o,
        scopeId: t.scopeId,
        slotScopeIds: t.slotScopeIds,
        children: l,
        target: t.target,
        targetAnchor: t.targetAnchor,
        staticCount: t.staticCount,
        staticCache: t.staticCache,
        shapeFlag: t.shapeFlag,
        patchFlag: e && t.type !== Xr ? (-1 === s ? 16 : 16 | s) : s,
        dynamicProps: t.dynamicProps,
        dynamicChildren: t.dynamicChildren,
        appContext: t.appContext,
        dirs: t.dirs,
        transition: t.transition,
        component: t.component,
        suspense: t.suspense,
        ssContent: t.ssContent && dn(t.ssContent),
        ssFallback: t.ssFallback && dn(t.ssFallback),
        el: t.el,
        anchor: t.anchor,
    }
}
function pn(t = " ", e = 0) {
    return fn(Zr, null, t, e)
}
function mn(t) {
    return null == t || "boolean" == typeof t ? fn(Qr) : b(t) ? fn(Xr, null, t.slice()) : "object" == typeof t ? gn(t) : fn(Zr, null, String(t))
}
function gn(t) {
    return null === t.el ? t : dn(t)
}
function vn(t, e) {
    let r = 0
    const { shapeFlag: n } = t
    if (null == e) e = null
    else if (b(e)) r = 16
    else if ("object" == typeof e) {
        if (1 & n || 64 & n) {
            const r = e.default
            return void (r && (r._c && (r._d = !1), vn(t, r()), r._c && (r._d = !0)))
        }
        {
            r = 32
            const n = e._
            n || un in e ? 3 === n && Te && (1 === Te.slots._ ? (e._ = 1) : ((e._ = 2), (t.patchFlag |= 1024))) : (e._ctx = Te)
        }
    } else _(e) ? ((e = { default: e, _ctx: Te }), (r = 32)) : ((e = String(e)), 64 & n ? ((r = 16), (e = [pn(e)])) : (r = 8))
    ;(t.children = e), (t.shapeFlag |= r)
}
function yn(t, e, r = {}, n, i) {
    let o = t[e]
    o && o._c && (o._d = !1), rn()
    const s = o && bn(o(r)),
        a = sn(Xr, { key: r.key || `_${e}` }, s || (n ? n() : []), s && 1 === t._ ? 64 : -2)
    return !i && a.scopeId && (a.slotScopeIds = [a.scopeId + "-s"]), o && o._c && (o._d = !0), a
}
function bn(t) {
    return t.some((t) => !an(t) || (t.type !== Qr && !(t.type === Xr && !bn(t.children)))) ? t : null
}
const wn = (t) => (t ? (Pn(t) ? Tn(t) || t.proxy : wn(t.parent)) : null),
    _n = m(Object.create(null), {
        $: (t) => t,
        $el: (t) => t.vnode.el,
        $data: (t) => t.data,
        $props: (t) => t.props,
        $attrs: (t) => t.attrs,
        $slots: (t) => t.slots,
        $refs: (t) => t.refs,
        $parent: (t) => wn(t.parent),
        $root: (t) => wn(t.root),
        $emit: (t) => t.emit,
        $options: (t) => vr(t),
        $forceUpdate: (t) => () => Ee(t.update),
        $nextTick: (t) => _e.bind(t.proxy),
        $watch: (t) => He.bind(t),
    }),
    En = {
        get({ _: t }, e) {
            const { ctx: r, setupState: n, data: i, props: o, accessCache: s, type: a, appContext: u } = t
            let h
            if ("$" !== e[0]) {
                const a = s[e]
                if (void 0 !== a)
                    switch (a) {
                        case 0:
                            return n[e]
                        case 1:
                            return i[e]
                        case 3:
                            return r[e]
                        case 2:
                            return o[e]
                    }
                else {
                    if (n !== l && y(n, e)) return (s[e] = 0), n[e]
                    if (i !== l && y(i, e)) return (s[e] = 1), i[e]
                    if ((h = t.propsOptions[0]) && y(h, e)) return (s[e] = 2), o[e]
                    if (r !== l && y(r, e)) return (s[e] = 3), r[e]
                    dr && (s[e] = 4)
                }
            }
            const c = _n[e]
            let f, d
            return c
                ? ("$attrs" === e && tt(t, 0, e), c(t))
                : (f = a.__cssModules) && (f = f[e])
                ? f
                : r !== l && y(r, e)
                ? ((s[e] = 3), r[e])
                : ((d = u.config.globalProperties), y(d, e) ? d[e] : void 0)
        },
        set({ _: t }, e, r) {
            const { data: n, setupState: i, ctx: o } = t
            if (i !== l && y(i, e)) i[e] = r
            else if (n !== l && y(n, e)) n[e] = r
            else if (y(t.props, e)) return !1
            return ("$" !== e[0] || !(e.slice(1) in t)) && ((o[e] = r), !0)
        },
        has({ _: { data: t, setupState: e, accessCache: r, ctx: n, appContext: i, propsOptions: o } }, s) {
            let a
            return (
                void 0 !== r[s] ||
                (t !== l && y(t, s)) ||
                (e !== l && y(e, s)) ||
                ((a = o[0]) && y(a, s)) ||
                y(n, s) ||
                y(_n, s) ||
                y(i.config.globalProperties, s)
            )
        },
    },
    kn = m({}, En, {
        get(t, e) {
            if (e !== Symbol.unscopables) return En.get(t, e, t)
        },
        has: (t, r) => "_" !== r[0] && !e(r),
    }),
    Mn = Ur()
let xn = 0
let An = null
const Nn = (t) => {
    An = t
}
function Pn(t) {
    return 4 & t.vnode.shapeFlag
}
let Sn = !1
function In(t, e, r) {
    _(e) ? (t.render = e) : M(e) && (t.setupState = ne(e)), Rn(t)
}
function Rn(t, e, r) {
    const n = t.type
    t.render || ((t.render = n.render || h), t.render._rc && (t.withProxy = new Proxy(t.ctx, kn))), (An = t), Q(), pr(t), Y(), (An = null)
}
function Tn(t) {
    if (t.exposed)
        return t.exposeProxy || (t.exposeProxy = new Proxy(ne(Jt(t.exposed)), { get: (e, r) => (r in e ? e[r] : r in _n ? _n[r](t) : void 0) }))
}
function On(t, e = An) {
    e && (e.effects || (e.effects = [])).push(t)
}
function Cn(t) {
    return (_(t) && t.displayName) || t.name
}
function Bn(t) {
    const e = (function (t) {
        let e, r
        return _(t) ? ((e = t), (r = h)) : ((e = t.get), (r = t.set)), new ie(e, r, _(t) || !t.set)
    })(t)
    return On(e.effect), e
}
function Fn(t, e, r) {
    const n = arguments.length
    return 2 === n
        ? M(e) && !b(e)
            ? an(e)
                ? fn(t, null, [e])
                : fn(t, e)
            : fn(t, null, e)
        : (n > 3 ? (r = Array.prototype.slice.call(arguments, 2)) : 3 === n && an(r) && (r = [r]), fn(t, e, r))
}
const Ln = "3.1.4",
    Un = "http://www.w3.org/2000/svg",
    qn = "undefined" != typeof document ? document : null,
    jn = {
        insert: (t, e, r) => {
            e.insertBefore(t, r || null)
        },
        remove: (t) => {
            const e = t.parentNode
            e && e.removeChild(t)
        },
        createElement: (t, e, r, n) => {
            const i = e ? qn.createElementNS(Un, t) : qn.createElement(t, r ? { is: r } : void 0)
            return "select" === t && n && null != n.multiple && i.setAttribute("multiple", n.multiple), i
        },
        createText: (t) => qn.createTextNode(t),
        createComment: (t) => qn.createComment(t),
        setText: (t, e) => {
            t.nodeValue = e
        },
        setElementText: (t, e) => {
            t.textContent = e
        },
        parentNode: (t) => t.parentNode,
        nextSibling: (t) => t.nextSibling,
        querySelector: (t) => qn.querySelector(t),
        setScopeId(t, e) {
            t.setAttribute(e, "")
        },
        cloneNode(t) {
            const e = t.cloneNode(!0)
            return "_value" in t && (e._value = t._value), e
        },
        insertStaticContent(t, e, r, n, i) {
            if (i) {
                let t,
                    n,
                    o = 0,
                    s = i.length
                for (; o < s; o++) {
                    const a = i[o].cloneNode(!0)
                    0 === o && (t = a), o === s - 1 && (n = a), e.insertBefore(a, r)
                }
                return [t, n]
            }
            const o = r ? r.previousSibling : e.lastChild
            if (r) {
                let i,
                    o = !1
                r instanceof Element
                    ? (i = r)
                    : ((o = !0), (i = n ? qn.createElementNS(Un, "g") : qn.createElement("div")), e.insertBefore(i, r)),
                    i.insertAdjacentHTML("beforebegin", t),
                    o && e.removeChild(i)
            } else e.insertAdjacentHTML("beforeend", t)
            let s = o ? o.nextSibling : e.firstChild
            const a = r ? r.previousSibling : e.lastChild,
                l = []
            for (; s && (l.push(s), s !== a); ) s = s.nextSibling
            return l
        },
    }
const Dn = /\s*!important$/
function zn(t, e, r) {
    if (b(r)) r.forEach((r) => zn(t, e, r))
    else if (e.startsWith("--")) t.setProperty(e, r)
    else {
        const n = (function (t, e) {
            const r = $n[e]
            if (r) return r
            let n = T(e)
            if ("filter" !== n && n in t) return ($n[e] = n)
            n = B(n)
            for (let i = 0; i < Gn.length; i++) {
                const r = Gn[i] + n
                if (r in t) return ($n[e] = r)
            }
            return e
        })(t, e)
        Dn.test(r) ? t.setProperty(C(n), r.replace(Dn, ""), "important") : (t[n] = r)
    }
}
const Gn = ["Webkit", "Moz", "ms"],
    $n = {}
const Hn = "http://www.w3.org/1999/xlink"
let Vn = Date.now,
    Wn = !1
if ("undefined" != typeof window) {
    Vn() > document.createEvent("Event").timeStamp && (Vn = () => performance.now())
    const t = navigator.userAgent.match(/firefox\/(\d+)/i)
    Wn = !!(t && Number(t[1]) <= 53)
}
let Kn = 0
const Jn = Promise.resolve(),
    Xn = () => {
        Kn = 0
    }
function Zn(t, e, r, n, i = null) {
    const o = t._vei || (t._vei = {}),
        s = o[e]
    if (n && s) s.value = n
    else {
        const [r, a] = (function (t) {
            let e
            if (Qn.test(t)) {
                let r
                for (e = {}; (r = t.match(Qn)); ) (t = t.slice(0, t.length - r[0].length)), (e[r[0].toLowerCase()] = !0)
            }
            return [C(t.slice(2)), e]
        })(e)
        if (n) {
            !(function (t, e, r, n) {
                t.addEventListener(e, r, n)
            })(
                t,
                r,
                (o[e] = (function (t, e) {
                    const r = (t) => {
                        const n = t.timeStamp || Vn()
                        ;(Wn || n >= r.attached - 1) &&
                            se(
                                (function (t, e) {
                                    if (b(e)) {
                                        const r = t.stopImmediatePropagation
                                        return (
                                            (t.stopImmediatePropagation = () => {
                                                r.call(t), (t._stopped = !0)
                                            }),
                                            e.map((t) => (e) => !e._stopped && t(e))
                                        )
                                    }
                                    return e
                                })(t, r.value),
                                e,
                                5,
                                [t]
                            )
                    }
                    return (r.value = t), (r.attached = (() => Kn || (Jn.then(Xn), (Kn = Vn())))()), r
                })(n, i)),
                a
            )
        } else
            s &&
                (!(function (t, e, r, n) {
                    t.removeEventListener(e, r, n)
                })(t, r, s, a),
                (o[e] = void 0))
    }
}
const Qn = /(?:Once|Passive|Capture)$/
const Yn = /^on[a-z]/
const ti = m(
    {
        patchProp: (t, e, n, i, o = !1, s, a, l, u) => {
            switch (e) {
                case "class":
                    !(function (t, e, r) {
                        if ((null == e && (e = ""), r)) t.setAttribute("class", e)
                        else {
                            const r = t._vtc
                            r && (e = (e ? [e, ...r] : [...r]).join(" ")), (t.className = e)
                        }
                    })(t, i, o)
                    break
                case "style":
                    !(function (t, e, r) {
                        const n = t.style
                        if (r)
                            if (E(r)) {
                                if (e !== r) {
                                    const e = n.display
                                    ;(n.cssText = r), "_vod" in t && (n.display = e)
                                }
                            } else {
                                for (const t in r) zn(n, t, r[t])
                                if (e && !E(e)) for (const t in e) null == r[t] && zn(n, t, "")
                            }
                        else t.removeAttribute("style")
                    })(t, n, i)
                    break
                default:
                    d(e)
                        ? p(e) || Zn(t, e, 0, i, a)
                        : (function (t, e, r, n) {
                              if (n) return "innerHTML" === e || !!(e in t && Yn.test(e) && _(r))
                              if ("spellcheck" === e || "draggable" === e) return !1
                              if ("form" === e) return !1
                              if ("list" === e && "INPUT" === t.tagName) return !1
                              if ("type" === e && "TEXTAREA" === t.tagName) return !1
                              if (Yn.test(e) && E(r)) return !1
                              return e in t
                          })(t, e, i, o)
                        ? (function (t, e, r, n, i, o, s) {
                              if ("innerHTML" === e || "textContent" === e) return n && s(n, i, o), void (t[e] = null == r ? "" : r)
                              if ("value" === e && "PROGRESS" !== t.tagName) {
                                  t._value = r
                                  const n = null == r ? "" : r
                                  return t.value !== n && (t.value = n), void (null == r && t.removeAttribute(e))
                              }
                              if ("" === r || null == r) {
                                  const n = typeof t[e]
                                  if ("" === r && "boolean" === n) return void (t[e] = !0)
                                  if (null == r && "string" === n) return (t[e] = ""), void t.removeAttribute(e)
                                  if ("number" === n) return (t[e] = 0), void t.removeAttribute(e)
                              }
                              try {
                                  t[e] = r
                              } catch (a) {}
                          })(t, e, i, s, a, l, u)
                        : ("true-value" === e ? (t._trueValue = i) : "false-value" === e && (t._falseValue = i),
                          (function (t, e, n, i, o) {
                              if (i && e.startsWith("xlink:"))
                                  null == n ? t.removeAttributeNS(Hn, e.slice(6, e.length)) : t.setAttributeNS(Hn, e, n)
                              else {
                                  const i = r(e)
                                  null == n || (i && !1 === n) ? t.removeAttribute(e) : t.setAttribute(e, i ? "" : n)
                              }
                          })(t, e, i, o))
            }
        },
        forcePatchProp: (t, e) => "value" === e,
    },
    jn
)
let ei
const ri = (...t) => {
    const e = (ei || (ei = $r(ti))).createApp(...t),
        { mount: r } = e
    return (
        (e.mount = (t) => {
            const n = (function (t) {
                if (E(t)) {
                    return document.querySelector(t)
                }
                return t
            })(t)
            if (!n) return
            const i = e._component
            _(i) || i.render || i.template || (i.template = n.innerHTML), (n.innerHTML = "")
            const o = r(n, !1, n instanceof SVGElement)
            return n instanceof Element && (n.removeAttribute("v-cloak"), n.setAttribute("data-v-app", "")), o
        }),
        e
    )
}
var ni =
    "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {}
function ii(t) {
    if (t.__esModule) return t
    var e = Object.defineProperty({}, "__esModule", { value: !0 })
    return (
        Object.keys(t).forEach(function (r) {
            var n = Object.getOwnPropertyDescriptor(t, r)
            Object.defineProperty(
                e,
                r,
                n.get
                    ? n
                    : {
                          enumerable: !0,
                          get: function () {
                              return t[r]
                          },
                      }
            )
        }),
        e
    )
}
var oi = { exports: {} },
    si = ii(Object.freeze({ __proto__: null, [Symbol.toStringTag]: "Module", default: {} }))
!(function (t, e) {
    function r(t, e) {
        if (!t) throw new Error(e || "Assertion failed")
    }
    function n(t, e) {
        t.super_ = e
        var r = function () {}
        ;(r.prototype = e.prototype), (t.prototype = new r()), (t.prototype.constructor = t)
    }
    function i(t, e, r) {
        if (i.isBN(t)) return t
        ;(this.negative = 0),
            (this.words = null),
            (this.length = 0),
            (this.red = null),
            null !== t && (("le" !== e && "be" !== e) || ((r = e), (e = 10)), this._init(t || 0, e || 10, r || "be"))
    }
    var o
    "object" == typeof t ? (t.exports = i) : (e.BN = i), (i.BN = i), (i.wordSize = 26)
    try {
        o = "undefined" != typeof window && void 0 !== window.Buffer ? window.Buffer : si.Buffer
    } catch (M) {}
    function s(t, e) {
        var r = t.charCodeAt(e)
        return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : (r - 48) & 15
    }
    function a(t, e, r) {
        var n = s(t, r)
        return r - 1 >= e && (n |= s(t, r - 1) << 4), n
    }
    function l(t, e, r, n) {
        for (var i = 0, o = Math.min(t.length, r), s = e; s < o; s++) {
            var a = t.charCodeAt(s) - 48
            ;(i *= n), (i += a >= 49 ? a - 49 + 10 : a >= 17 ? a - 17 + 10 : a)
        }
        return i
    }
    ;(i.isBN = function (t) {
        return t instanceof i || (null !== t && "object" == typeof t && t.constructor.wordSize === i.wordSize && Array.isArray(t.words))
    }),
        (i.max = function (t, e) {
            return t.cmp(e) > 0 ? t : e
        }),
        (i.min = function (t, e) {
            return t.cmp(e) < 0 ? t : e
        }),
        (i.prototype._init = function (t, e, n) {
            if ("number" == typeof t) return this._initNumber(t, e, n)
            if ("object" == typeof t) return this._initArray(t, e, n)
            "hex" === e && (e = 16), r(e === (0 | e) && e >= 2 && e <= 36)
            var i = 0
            "-" === (t = t.toString().replace(/\s+/g, ""))[0] && (i++, (this.negative = 1)),
                i < t.length &&
                    (16 === e ? this._parseHex(t, i, n) : (this._parseBase(t, e, i), "le" === n && this._initArray(this.toArray(), e, n)))
        }),
        (i.prototype._initNumber = function (t, e, n) {
            t < 0 && ((this.negative = 1), (t = -t)),
                t < 67108864
                    ? ((this.words = [67108863 & t]), (this.length = 1))
                    : t < 4503599627370496
                    ? ((this.words = [67108863 & t, (t / 67108864) & 67108863]), (this.length = 2))
                    : (r(t < 9007199254740992), (this.words = [67108863 & t, (t / 67108864) & 67108863, 1]), (this.length = 3)),
                "le" === n && this._initArray(this.toArray(), e, n)
        }),
        (i.prototype._initArray = function (t, e, n) {
            if ((r("number" == typeof t.length), t.length <= 0)) return (this.words = [0]), (this.length = 1), this
            ;(this.length = Math.ceil(t.length / 3)), (this.words = new Array(this.length))
            for (var i = 0; i < this.length; i++) this.words[i] = 0
            var o,
                s,
                a = 0
            if ("be" === n)
                for (i = t.length - 1, o = 0; i >= 0; i -= 3)
                    (s = t[i] | (t[i - 1] << 8) | (t[i - 2] << 16)),
                        (this.words[o] |= (s << a) & 67108863),
                        (this.words[o + 1] = (s >>> (26 - a)) & 67108863),
                        (a += 24) >= 26 && ((a -= 26), o++)
            else if ("le" === n)
                for (i = 0, o = 0; i < t.length; i += 3)
                    (s = t[i] | (t[i + 1] << 8) | (t[i + 2] << 16)),
                        (this.words[o] |= (s << a) & 67108863),
                        (this.words[o + 1] = (s >>> (26 - a)) & 67108863),
                        (a += 24) >= 26 && ((a -= 26), o++)
            return this.strip()
        }),
        (i.prototype._parseHex = function (t, e, r) {
            ;(this.length = Math.ceil((t.length - e) / 6)), (this.words = new Array(this.length))
            for (var n = 0; n < this.length; n++) this.words[n] = 0
            var i,
                o = 0,
                s = 0
            if ("be" === r)
                for (n = t.length - 1; n >= e; n -= 2)
                    (i = a(t, e, n) << o),
                        (this.words[s] |= 67108863 & i),
                        o >= 18 ? ((o -= 18), (s += 1), (this.words[s] |= i >>> 26)) : (o += 8)
            else
                for (n = (t.length - e) % 2 == 0 ? e + 1 : e; n < t.length; n += 2)
                    (i = a(t, e, n) << o),
                        (this.words[s] |= 67108863 & i),
                        o >= 18 ? ((o -= 18), (s += 1), (this.words[s] |= i >>> 26)) : (o += 8)
            this.strip()
        }),
        (i.prototype._parseBase = function (t, e, r) {
            ;(this.words = [0]), (this.length = 1)
            for (var n = 0, i = 1; i <= 67108863; i *= e) n++
            n--, (i = (i / e) | 0)
            for (var o = t.length - r, s = o % n, a = Math.min(o, o - s) + r, u = 0, h = r; h < a; h += n)
                (u = l(t, h, h + n, e)), this.imuln(i), this.words[0] + u < 67108864 ? (this.words[0] += u) : this._iaddn(u)
            if (0 !== s) {
                var c = 1
                for (u = l(t, h, t.length, e), h = 0; h < s; h++) c *= e
                this.imuln(c), this.words[0] + u < 67108864 ? (this.words[0] += u) : this._iaddn(u)
            }
            this.strip()
        }),
        (i.prototype.copy = function (t) {
            t.words = new Array(this.length)
            for (var e = 0; e < this.length; e++) t.words[e] = this.words[e]
            ;(t.length = this.length), (t.negative = this.negative), (t.red = this.red)
        }),
        (i.prototype.clone = function () {
            var t = new i(null)
            return this.copy(t), t
        }),
        (i.prototype._expand = function (t) {
            for (; this.length < t; ) this.words[this.length++] = 0
            return this
        }),
        (i.prototype.strip = function () {
            for (; this.length > 1 && 0 === this.words[this.length - 1]; ) this.length--
            return this._normSign()
        }),
        (i.prototype._normSign = function () {
            return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this
        }),
        (i.prototype.inspect = function () {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
        })
    var u = [
            "",
            "0",
            "00",
            "000",
            "0000",
            "00000",
            "000000",
            "0000000",
            "00000000",
            "000000000",
            "0000000000",
            "00000000000",
            "000000000000",
            "0000000000000",
            "00000000000000",
            "000000000000000",
            "0000000000000000",
            "00000000000000000",
            "000000000000000000",
            "0000000000000000000",
            "00000000000000000000",
            "000000000000000000000",
            "0000000000000000000000",
            "00000000000000000000000",
            "000000000000000000000000",
            "0000000000000000000000000",
        ],
        h = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        c = [
            0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536,
            11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368,
            20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176,
        ]
    function f(t, e, r) {
        r.negative = e.negative ^ t.negative
        var n = (t.length + e.length) | 0
        ;(r.length = n), (n = (n - 1) | 0)
        var i = 0 | t.words[0],
            o = 0 | e.words[0],
            s = i * o,
            a = 67108863 & s,
            l = (s / 67108864) | 0
        r.words[0] = a
        for (var u = 1; u < n; u++) {
            for (var h = l >>> 26, c = 67108863 & l, f = Math.min(u, e.length - 1), d = Math.max(0, u - t.length + 1); d <= f; d++) {
                var p = (u - d) | 0
                ;(h += ((s = (i = 0 | t.words[p]) * (o = 0 | e.words[d]) + c) / 67108864) | 0), (c = 67108863 & s)
            }
            ;(r.words[u] = 0 | c), (l = 0 | h)
        }
        return 0 !== l ? (r.words[u] = 0 | l) : r.length--, r.strip()
    }
    ;(i.prototype.toString = function (t, e) {
        var n
        if (((e = 0 | e || 1), 16 === (t = t || 10) || "hex" === t)) {
            n = ""
            for (var i = 0, o = 0, s = 0; s < this.length; s++) {
                var a = this.words[s],
                    l = (16777215 & ((a << i) | o)).toString(16)
                ;(n = 0 != (o = (a >>> (24 - i)) & 16777215) || s !== this.length - 1 ? u[6 - l.length] + l + n : l + n),
                    (i += 2) >= 26 && ((i -= 26), s--)
            }
            for (0 !== o && (n = o.toString(16) + n); n.length % e != 0; ) n = "0" + n
            return 0 !== this.negative && (n = "-" + n), n
        }
        if (t === (0 | t) && t >= 2 && t <= 36) {
            var f = h[t],
                d = c[t]
            n = ""
            var p = this.clone()
            for (p.negative = 0; !p.isZero(); ) {
                var m = p.modn(d).toString(t)
                n = (p = p.idivn(d)).isZero() ? m + n : u[f - m.length] + m + n
            }
            for (this.isZero() && (n = "0" + n); n.length % e != 0; ) n = "0" + n
            return 0 !== this.negative && (n = "-" + n), n
        }
        r(!1, "Base should be between 2 and 36")
    }),
        (i.prototype.toNumber = function () {
            var t = this.words[0]
            return (
                2 === this.length
                    ? (t += 67108864 * this.words[1])
                    : 3 === this.length && 1 === this.words[2]
                    ? (t += 4503599627370496 + 67108864 * this.words[1])
                    : this.length > 2 && r(!1, "Number can only safely store up to 53 bits"),
                0 !== this.negative ? -t : t
            )
        }),
        (i.prototype.toJSON = function () {
            return this.toString(16)
        }),
        (i.prototype.toBuffer = function (t, e) {
            return r(void 0 !== o), this.toArrayLike(o, t, e)
        }),
        (i.prototype.toArray = function (t, e) {
            return this.toArrayLike(Array, t, e)
        }),
        (i.prototype.toArrayLike = function (t, e, n) {
            var i = this.byteLength(),
                o = n || Math.max(1, i)
            r(i <= o, "byte array longer than desired length"), r(o > 0, "Requested array length <= 0"), this.strip()
            var s,
                a,
                l = "le" === e,
                u = new t(o),
                h = this.clone()
            if (l) {
                for (a = 0; !h.isZero(); a++) (s = h.andln(255)), h.iushrn(8), (u[a] = s)
                for (; a < o; a++) u[a] = 0
            } else {
                for (a = 0; a < o - i; a++) u[a] = 0
                for (a = 0; !h.isZero(); a++) (s = h.andln(255)), h.iushrn(8), (u[o - a - 1] = s)
            }
            return u
        }),
        Math.clz32
            ? (i.prototype._countBits = function (t) {
                  return 32 - Math.clz32(t)
              })
            : (i.prototype._countBits = function (t) {
                  var e = t,
                      r = 0
                  return (
                      e >= 4096 && ((r += 13), (e >>>= 13)),
                      e >= 64 && ((r += 7), (e >>>= 7)),
                      e >= 8 && ((r += 4), (e >>>= 4)),
                      e >= 2 && ((r += 2), (e >>>= 2)),
                      r + e
                  )
              }),
        (i.prototype._zeroBits = function (t) {
            if (0 === t) return 26
            var e = t,
                r = 0
            return (
                0 == (8191 & e) && ((r += 13), (e >>>= 13)),
                0 == (127 & e) && ((r += 7), (e >>>= 7)),
                0 == (15 & e) && ((r += 4), (e >>>= 4)),
                0 == (3 & e) && ((r += 2), (e >>>= 2)),
                0 == (1 & e) && r++,
                r
            )
        }),
        (i.prototype.bitLength = function () {
            var t = this.words[this.length - 1],
                e = this._countBits(t)
            return 26 * (this.length - 1) + e
        }),
        (i.prototype.zeroBits = function () {
            if (this.isZero()) return 0
            for (var t = 0, e = 0; e < this.length; e++) {
                var r = this._zeroBits(this.words[e])
                if (((t += r), 26 !== r)) break
            }
            return t
        }),
        (i.prototype.byteLength = function () {
            return Math.ceil(this.bitLength() / 8)
        }),
        (i.prototype.toTwos = function (t) {
            return 0 !== this.negative ? this.abs().inotn(t).iaddn(1) : this.clone()
        }),
        (i.prototype.fromTwos = function (t) {
            return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone()
        }),
        (i.prototype.isNeg = function () {
            return 0 !== this.negative
        }),
        (i.prototype.neg = function () {
            return this.clone().ineg()
        }),
        (i.prototype.ineg = function () {
            return this.isZero() || (this.negative ^= 1), this
        }),
        (i.prototype.iuor = function (t) {
            for (; this.length < t.length; ) this.words[this.length++] = 0
            for (var e = 0; e < t.length; e++) this.words[e] = this.words[e] | t.words[e]
            return this.strip()
        }),
        (i.prototype.ior = function (t) {
            return r(0 == (this.negative | t.negative)), this.iuor(t)
        }),
        (i.prototype.or = function (t) {
            return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this)
        }),
        (i.prototype.uor = function (t) {
            return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this)
        }),
        (i.prototype.iuand = function (t) {
            var e
            e = this.length > t.length ? t : this
            for (var r = 0; r < e.length; r++) this.words[r] = this.words[r] & t.words[r]
            return (this.length = e.length), this.strip()
        }),
        (i.prototype.iand = function (t) {
            return r(0 == (this.negative | t.negative)), this.iuand(t)
        }),
        (i.prototype.and = function (t) {
            return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this)
        }),
        (i.prototype.uand = function (t) {
            return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this)
        }),
        (i.prototype.iuxor = function (t) {
            var e, r
            this.length > t.length ? ((e = this), (r = t)) : ((e = t), (r = this))
            for (var n = 0; n < r.length; n++) this.words[n] = e.words[n] ^ r.words[n]
            if (this !== e) for (; n < e.length; n++) this.words[n] = e.words[n]
            return (this.length = e.length), this.strip()
        }),
        (i.prototype.ixor = function (t) {
            return r(0 == (this.negative | t.negative)), this.iuxor(t)
        }),
        (i.prototype.xor = function (t) {
            return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this)
        }),
        (i.prototype.uxor = function (t) {
            return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this)
        }),
        (i.prototype.inotn = function (t) {
            r("number" == typeof t && t >= 0)
            var e = 0 | Math.ceil(t / 26),
                n = t % 26
            this._expand(e), n > 0 && e--
            for (var i = 0; i < e; i++) this.words[i] = 67108863 & ~this.words[i]
            return n > 0 && (this.words[i] = ~this.words[i] & (67108863 >> (26 - n))), this.strip()
        }),
        (i.prototype.notn = function (t) {
            return this.clone().inotn(t)
        }),
        (i.prototype.setn = function (t, e) {
            r("number" == typeof t && t >= 0)
            var n = (t / 26) | 0,
                i = t % 26
            return this._expand(n + 1), (this.words[n] = e ? this.words[n] | (1 << i) : this.words[n] & ~(1 << i)), this.strip()
        }),
        (i.prototype.iadd = function (t) {
            var e, r, n
            if (0 !== this.negative && 0 === t.negative) return (this.negative = 0), (e = this.isub(t)), (this.negative ^= 1), this._normSign()
            if (0 === this.negative && 0 !== t.negative) return (t.negative = 0), (e = this.isub(t)), (t.negative = 1), e._normSign()
            this.length > t.length ? ((r = this), (n = t)) : ((r = t), (n = this))
            for (var i = 0, o = 0; o < n.length; o++)
                (e = (0 | r.words[o]) + (0 | n.words[o]) + i), (this.words[o] = 67108863 & e), (i = e >>> 26)
            for (; 0 !== i && o < r.length; o++) (e = (0 | r.words[o]) + i), (this.words[o] = 67108863 & e), (i = e >>> 26)
            if (((this.length = r.length), 0 !== i)) (this.words[this.length] = i), this.length++
            else if (r !== this) for (; o < r.length; o++) this.words[o] = r.words[o]
            return this
        }),
        (i.prototype.add = function (t) {
            var e
            return 0 !== t.negative && 0 === this.negative
                ? ((t.negative = 0), (e = this.sub(t)), (t.negative ^= 1), e)
                : 0 === t.negative && 0 !== this.negative
                ? ((this.negative = 0), (e = t.sub(this)), (this.negative = 1), e)
                : this.length > t.length
                ? this.clone().iadd(t)
                : t.clone().iadd(this)
        }),
        (i.prototype.isub = function (t) {
            if (0 !== t.negative) {
                t.negative = 0
                var e = this.iadd(t)
                return (t.negative = 1), e._normSign()
            }
            if (0 !== this.negative) return (this.negative = 0), this.iadd(t), (this.negative = 1), this._normSign()
            var r,
                n,
                i = this.cmp(t)
            if (0 === i) return (this.negative = 0), (this.length = 1), (this.words[0] = 0), this
            i > 0 ? ((r = this), (n = t)) : ((r = t), (n = this))
            for (var o = 0, s = 0; s < n.length; s++) (o = (e = (0 | r.words[s]) - (0 | n.words[s]) + o) >> 26), (this.words[s] = 67108863 & e)
            for (; 0 !== o && s < r.length; s++) (o = (e = (0 | r.words[s]) + o) >> 26), (this.words[s] = 67108863 & e)
            if (0 === o && s < r.length && r !== this) for (; s < r.length; s++) this.words[s] = r.words[s]
            return (this.length = Math.max(this.length, s)), r !== this && (this.negative = 1), this.strip()
        }),
        (i.prototype.sub = function (t) {
            return this.clone().isub(t)
        })
    var d = function (t, e, r) {
        var n,
            i,
            o,
            s = t.words,
            a = e.words,
            l = r.words,
            u = 0,
            h = 0 | s[0],
            c = 8191 & h,
            f = h >>> 13,
            d = 0 | s[1],
            p = 8191 & d,
            m = d >>> 13,
            g = 0 | s[2],
            v = 8191 & g,
            y = g >>> 13,
            b = 0 | s[3],
            w = 8191 & b,
            _ = b >>> 13,
            E = 0 | s[4],
            k = 8191 & E,
            M = E >>> 13,
            x = 0 | s[5],
            A = 8191 & x,
            N = x >>> 13,
            P = 0 | s[6],
            S = 8191 & P,
            I = P >>> 13,
            R = 0 | s[7],
            T = 8191 & R,
            O = R >>> 13,
            C = 0 | s[8],
            B = 8191 & C,
            F = C >>> 13,
            L = 0 | s[9],
            U = 8191 & L,
            q = L >>> 13,
            j = 0 | a[0],
            D = 8191 & j,
            z = j >>> 13,
            G = 0 | a[1],
            $ = 8191 & G,
            H = G >>> 13,
            V = 0 | a[2],
            W = 8191 & V,
            K = V >>> 13,
            J = 0 | a[3],
            X = 8191 & J,
            Z = J >>> 13,
            Q = 0 | a[4],
            Y = 8191 & Q,
            tt = Q >>> 13,
            et = 0 | a[5],
            rt = 8191 & et,
            nt = et >>> 13,
            it = 0 | a[6],
            ot = 8191 & it,
            st = it >>> 13,
            at = 0 | a[7],
            lt = 8191 & at,
            ut = at >>> 13,
            ht = 0 | a[8],
            ct = 8191 & ht,
            ft = ht >>> 13,
            dt = 0 | a[9],
            pt = 8191 & dt,
            mt = dt >>> 13
        ;(r.negative = t.negative ^ e.negative), (r.length = 19)
        var gt = (((u + (n = Math.imul(c, D))) | 0) + ((8191 & (i = ((i = Math.imul(c, z)) + Math.imul(f, D)) | 0)) << 13)) | 0
        ;(u = ((((o = Math.imul(f, z)) + (i >>> 13)) | 0) + (gt >>> 26)) | 0),
            (gt &= 67108863),
            (n = Math.imul(p, D)),
            (i = ((i = Math.imul(p, z)) + Math.imul(m, D)) | 0),
            (o = Math.imul(m, z))
        var vt =
            (((u + (n = (n + Math.imul(c, $)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, H)) | 0) + Math.imul(f, $)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, H)) | 0) + (i >>> 13)) | 0) + (vt >>> 26)) | 0),
            (vt &= 67108863),
            (n = Math.imul(v, D)),
            (i = ((i = Math.imul(v, z)) + Math.imul(y, D)) | 0),
            (o = Math.imul(y, z)),
            (n = (n + Math.imul(p, $)) | 0),
            (i = ((i = (i + Math.imul(p, H)) | 0) + Math.imul(m, $)) | 0),
            (o = (o + Math.imul(m, H)) | 0)
        var yt =
            (((u + (n = (n + Math.imul(c, W)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, K)) | 0) + Math.imul(f, W)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, K)) | 0) + (i >>> 13)) | 0) + (yt >>> 26)) | 0),
            (yt &= 67108863),
            (n = Math.imul(w, D)),
            (i = ((i = Math.imul(w, z)) + Math.imul(_, D)) | 0),
            (o = Math.imul(_, z)),
            (n = (n + Math.imul(v, $)) | 0),
            (i = ((i = (i + Math.imul(v, H)) | 0) + Math.imul(y, $)) | 0),
            (o = (o + Math.imul(y, H)) | 0),
            (n = (n + Math.imul(p, W)) | 0),
            (i = ((i = (i + Math.imul(p, K)) | 0) + Math.imul(m, W)) | 0),
            (o = (o + Math.imul(m, K)) | 0)
        var bt =
            (((u + (n = (n + Math.imul(c, X)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, Z)) | 0) + Math.imul(f, X)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, Z)) | 0) + (i >>> 13)) | 0) + (bt >>> 26)) | 0),
            (bt &= 67108863),
            (n = Math.imul(k, D)),
            (i = ((i = Math.imul(k, z)) + Math.imul(M, D)) | 0),
            (o = Math.imul(M, z)),
            (n = (n + Math.imul(w, $)) | 0),
            (i = ((i = (i + Math.imul(w, H)) | 0) + Math.imul(_, $)) | 0),
            (o = (o + Math.imul(_, H)) | 0),
            (n = (n + Math.imul(v, W)) | 0),
            (i = ((i = (i + Math.imul(v, K)) | 0) + Math.imul(y, W)) | 0),
            (o = (o + Math.imul(y, K)) | 0),
            (n = (n + Math.imul(p, X)) | 0),
            (i = ((i = (i + Math.imul(p, Z)) | 0) + Math.imul(m, X)) | 0),
            (o = (o + Math.imul(m, Z)) | 0)
        var wt =
            (((u + (n = (n + Math.imul(c, Y)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, tt)) | 0) + Math.imul(f, Y)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, tt)) | 0) + (i >>> 13)) | 0) + (wt >>> 26)) | 0),
            (wt &= 67108863),
            (n = Math.imul(A, D)),
            (i = ((i = Math.imul(A, z)) + Math.imul(N, D)) | 0),
            (o = Math.imul(N, z)),
            (n = (n + Math.imul(k, $)) | 0),
            (i = ((i = (i + Math.imul(k, H)) | 0) + Math.imul(M, $)) | 0),
            (o = (o + Math.imul(M, H)) | 0),
            (n = (n + Math.imul(w, W)) | 0),
            (i = ((i = (i + Math.imul(w, K)) | 0) + Math.imul(_, W)) | 0),
            (o = (o + Math.imul(_, K)) | 0),
            (n = (n + Math.imul(v, X)) | 0),
            (i = ((i = (i + Math.imul(v, Z)) | 0) + Math.imul(y, X)) | 0),
            (o = (o + Math.imul(y, Z)) | 0),
            (n = (n + Math.imul(p, Y)) | 0),
            (i = ((i = (i + Math.imul(p, tt)) | 0) + Math.imul(m, Y)) | 0),
            (o = (o + Math.imul(m, tt)) | 0)
        var _t =
            (((u + (n = (n + Math.imul(c, rt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, nt)) | 0) + Math.imul(f, rt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, nt)) | 0) + (i >>> 13)) | 0) + (_t >>> 26)) | 0),
            (_t &= 67108863),
            (n = Math.imul(S, D)),
            (i = ((i = Math.imul(S, z)) + Math.imul(I, D)) | 0),
            (o = Math.imul(I, z)),
            (n = (n + Math.imul(A, $)) | 0),
            (i = ((i = (i + Math.imul(A, H)) | 0) + Math.imul(N, $)) | 0),
            (o = (o + Math.imul(N, H)) | 0),
            (n = (n + Math.imul(k, W)) | 0),
            (i = ((i = (i + Math.imul(k, K)) | 0) + Math.imul(M, W)) | 0),
            (o = (o + Math.imul(M, K)) | 0),
            (n = (n + Math.imul(w, X)) | 0),
            (i = ((i = (i + Math.imul(w, Z)) | 0) + Math.imul(_, X)) | 0),
            (o = (o + Math.imul(_, Z)) | 0),
            (n = (n + Math.imul(v, Y)) | 0),
            (i = ((i = (i + Math.imul(v, tt)) | 0) + Math.imul(y, Y)) | 0),
            (o = (o + Math.imul(y, tt)) | 0),
            (n = (n + Math.imul(p, rt)) | 0),
            (i = ((i = (i + Math.imul(p, nt)) | 0) + Math.imul(m, rt)) | 0),
            (o = (o + Math.imul(m, nt)) | 0)
        var Et =
            (((u + (n = (n + Math.imul(c, ot)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, st)) | 0) + Math.imul(f, ot)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, st)) | 0) + (i >>> 13)) | 0) + (Et >>> 26)) | 0),
            (Et &= 67108863),
            (n = Math.imul(T, D)),
            (i = ((i = Math.imul(T, z)) + Math.imul(O, D)) | 0),
            (o = Math.imul(O, z)),
            (n = (n + Math.imul(S, $)) | 0),
            (i = ((i = (i + Math.imul(S, H)) | 0) + Math.imul(I, $)) | 0),
            (o = (o + Math.imul(I, H)) | 0),
            (n = (n + Math.imul(A, W)) | 0),
            (i = ((i = (i + Math.imul(A, K)) | 0) + Math.imul(N, W)) | 0),
            (o = (o + Math.imul(N, K)) | 0),
            (n = (n + Math.imul(k, X)) | 0),
            (i = ((i = (i + Math.imul(k, Z)) | 0) + Math.imul(M, X)) | 0),
            (o = (o + Math.imul(M, Z)) | 0),
            (n = (n + Math.imul(w, Y)) | 0),
            (i = ((i = (i + Math.imul(w, tt)) | 0) + Math.imul(_, Y)) | 0),
            (o = (o + Math.imul(_, tt)) | 0),
            (n = (n + Math.imul(v, rt)) | 0),
            (i = ((i = (i + Math.imul(v, nt)) | 0) + Math.imul(y, rt)) | 0),
            (o = (o + Math.imul(y, nt)) | 0),
            (n = (n + Math.imul(p, ot)) | 0),
            (i = ((i = (i + Math.imul(p, st)) | 0) + Math.imul(m, ot)) | 0),
            (o = (o + Math.imul(m, st)) | 0)
        var kt =
            (((u + (n = (n + Math.imul(c, lt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, ut)) | 0) + Math.imul(f, lt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, ut)) | 0) + (i >>> 13)) | 0) + (kt >>> 26)) | 0),
            (kt &= 67108863),
            (n = Math.imul(B, D)),
            (i = ((i = Math.imul(B, z)) + Math.imul(F, D)) | 0),
            (o = Math.imul(F, z)),
            (n = (n + Math.imul(T, $)) | 0),
            (i = ((i = (i + Math.imul(T, H)) | 0) + Math.imul(O, $)) | 0),
            (o = (o + Math.imul(O, H)) | 0),
            (n = (n + Math.imul(S, W)) | 0),
            (i = ((i = (i + Math.imul(S, K)) | 0) + Math.imul(I, W)) | 0),
            (o = (o + Math.imul(I, K)) | 0),
            (n = (n + Math.imul(A, X)) | 0),
            (i = ((i = (i + Math.imul(A, Z)) | 0) + Math.imul(N, X)) | 0),
            (o = (o + Math.imul(N, Z)) | 0),
            (n = (n + Math.imul(k, Y)) | 0),
            (i = ((i = (i + Math.imul(k, tt)) | 0) + Math.imul(M, Y)) | 0),
            (o = (o + Math.imul(M, tt)) | 0),
            (n = (n + Math.imul(w, rt)) | 0),
            (i = ((i = (i + Math.imul(w, nt)) | 0) + Math.imul(_, rt)) | 0),
            (o = (o + Math.imul(_, nt)) | 0),
            (n = (n + Math.imul(v, ot)) | 0),
            (i = ((i = (i + Math.imul(v, st)) | 0) + Math.imul(y, ot)) | 0),
            (o = (o + Math.imul(y, st)) | 0),
            (n = (n + Math.imul(p, lt)) | 0),
            (i = ((i = (i + Math.imul(p, ut)) | 0) + Math.imul(m, lt)) | 0),
            (o = (o + Math.imul(m, ut)) | 0)
        var Mt =
            (((u + (n = (n + Math.imul(c, ct)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, ft)) | 0) + Math.imul(f, ct)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, ft)) | 0) + (i >>> 13)) | 0) + (Mt >>> 26)) | 0),
            (Mt &= 67108863),
            (n = Math.imul(U, D)),
            (i = ((i = Math.imul(U, z)) + Math.imul(q, D)) | 0),
            (o = Math.imul(q, z)),
            (n = (n + Math.imul(B, $)) | 0),
            (i = ((i = (i + Math.imul(B, H)) | 0) + Math.imul(F, $)) | 0),
            (o = (o + Math.imul(F, H)) | 0),
            (n = (n + Math.imul(T, W)) | 0),
            (i = ((i = (i + Math.imul(T, K)) | 0) + Math.imul(O, W)) | 0),
            (o = (o + Math.imul(O, K)) | 0),
            (n = (n + Math.imul(S, X)) | 0),
            (i = ((i = (i + Math.imul(S, Z)) | 0) + Math.imul(I, X)) | 0),
            (o = (o + Math.imul(I, Z)) | 0),
            (n = (n + Math.imul(A, Y)) | 0),
            (i = ((i = (i + Math.imul(A, tt)) | 0) + Math.imul(N, Y)) | 0),
            (o = (o + Math.imul(N, tt)) | 0),
            (n = (n + Math.imul(k, rt)) | 0),
            (i = ((i = (i + Math.imul(k, nt)) | 0) + Math.imul(M, rt)) | 0),
            (o = (o + Math.imul(M, nt)) | 0),
            (n = (n + Math.imul(w, ot)) | 0),
            (i = ((i = (i + Math.imul(w, st)) | 0) + Math.imul(_, ot)) | 0),
            (o = (o + Math.imul(_, st)) | 0),
            (n = (n + Math.imul(v, lt)) | 0),
            (i = ((i = (i + Math.imul(v, ut)) | 0) + Math.imul(y, lt)) | 0),
            (o = (o + Math.imul(y, ut)) | 0),
            (n = (n + Math.imul(p, ct)) | 0),
            (i = ((i = (i + Math.imul(p, ft)) | 0) + Math.imul(m, ct)) | 0),
            (o = (o + Math.imul(m, ft)) | 0)
        var xt =
            (((u + (n = (n + Math.imul(c, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(c, mt)) | 0) + Math.imul(f, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(f, mt)) | 0) + (i >>> 13)) | 0) + (xt >>> 26)) | 0),
            (xt &= 67108863),
            (n = Math.imul(U, $)),
            (i = ((i = Math.imul(U, H)) + Math.imul(q, $)) | 0),
            (o = Math.imul(q, H)),
            (n = (n + Math.imul(B, W)) | 0),
            (i = ((i = (i + Math.imul(B, K)) | 0) + Math.imul(F, W)) | 0),
            (o = (o + Math.imul(F, K)) | 0),
            (n = (n + Math.imul(T, X)) | 0),
            (i = ((i = (i + Math.imul(T, Z)) | 0) + Math.imul(O, X)) | 0),
            (o = (o + Math.imul(O, Z)) | 0),
            (n = (n + Math.imul(S, Y)) | 0),
            (i = ((i = (i + Math.imul(S, tt)) | 0) + Math.imul(I, Y)) | 0),
            (o = (o + Math.imul(I, tt)) | 0),
            (n = (n + Math.imul(A, rt)) | 0),
            (i = ((i = (i + Math.imul(A, nt)) | 0) + Math.imul(N, rt)) | 0),
            (o = (o + Math.imul(N, nt)) | 0),
            (n = (n + Math.imul(k, ot)) | 0),
            (i = ((i = (i + Math.imul(k, st)) | 0) + Math.imul(M, ot)) | 0),
            (o = (o + Math.imul(M, st)) | 0),
            (n = (n + Math.imul(w, lt)) | 0),
            (i = ((i = (i + Math.imul(w, ut)) | 0) + Math.imul(_, lt)) | 0),
            (o = (o + Math.imul(_, ut)) | 0),
            (n = (n + Math.imul(v, ct)) | 0),
            (i = ((i = (i + Math.imul(v, ft)) | 0) + Math.imul(y, ct)) | 0),
            (o = (o + Math.imul(y, ft)) | 0)
        var At =
            (((u + (n = (n + Math.imul(p, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(p, mt)) | 0) + Math.imul(m, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(m, mt)) | 0) + (i >>> 13)) | 0) + (At >>> 26)) | 0),
            (At &= 67108863),
            (n = Math.imul(U, W)),
            (i = ((i = Math.imul(U, K)) + Math.imul(q, W)) | 0),
            (o = Math.imul(q, K)),
            (n = (n + Math.imul(B, X)) | 0),
            (i = ((i = (i + Math.imul(B, Z)) | 0) + Math.imul(F, X)) | 0),
            (o = (o + Math.imul(F, Z)) | 0),
            (n = (n + Math.imul(T, Y)) | 0),
            (i = ((i = (i + Math.imul(T, tt)) | 0) + Math.imul(O, Y)) | 0),
            (o = (o + Math.imul(O, tt)) | 0),
            (n = (n + Math.imul(S, rt)) | 0),
            (i = ((i = (i + Math.imul(S, nt)) | 0) + Math.imul(I, rt)) | 0),
            (o = (o + Math.imul(I, nt)) | 0),
            (n = (n + Math.imul(A, ot)) | 0),
            (i = ((i = (i + Math.imul(A, st)) | 0) + Math.imul(N, ot)) | 0),
            (o = (o + Math.imul(N, st)) | 0),
            (n = (n + Math.imul(k, lt)) | 0),
            (i = ((i = (i + Math.imul(k, ut)) | 0) + Math.imul(M, lt)) | 0),
            (o = (o + Math.imul(M, ut)) | 0),
            (n = (n + Math.imul(w, ct)) | 0),
            (i = ((i = (i + Math.imul(w, ft)) | 0) + Math.imul(_, ct)) | 0),
            (o = (o + Math.imul(_, ft)) | 0)
        var Nt =
            (((u + (n = (n + Math.imul(v, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(v, mt)) | 0) + Math.imul(y, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(y, mt)) | 0) + (i >>> 13)) | 0) + (Nt >>> 26)) | 0),
            (Nt &= 67108863),
            (n = Math.imul(U, X)),
            (i = ((i = Math.imul(U, Z)) + Math.imul(q, X)) | 0),
            (o = Math.imul(q, Z)),
            (n = (n + Math.imul(B, Y)) | 0),
            (i = ((i = (i + Math.imul(B, tt)) | 0) + Math.imul(F, Y)) | 0),
            (o = (o + Math.imul(F, tt)) | 0),
            (n = (n + Math.imul(T, rt)) | 0),
            (i = ((i = (i + Math.imul(T, nt)) | 0) + Math.imul(O, rt)) | 0),
            (o = (o + Math.imul(O, nt)) | 0),
            (n = (n + Math.imul(S, ot)) | 0),
            (i = ((i = (i + Math.imul(S, st)) | 0) + Math.imul(I, ot)) | 0),
            (o = (o + Math.imul(I, st)) | 0),
            (n = (n + Math.imul(A, lt)) | 0),
            (i = ((i = (i + Math.imul(A, ut)) | 0) + Math.imul(N, lt)) | 0),
            (o = (o + Math.imul(N, ut)) | 0),
            (n = (n + Math.imul(k, ct)) | 0),
            (i = ((i = (i + Math.imul(k, ft)) | 0) + Math.imul(M, ct)) | 0),
            (o = (o + Math.imul(M, ft)) | 0)
        var Pt =
            (((u + (n = (n + Math.imul(w, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(w, mt)) | 0) + Math.imul(_, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(_, mt)) | 0) + (i >>> 13)) | 0) + (Pt >>> 26)) | 0),
            (Pt &= 67108863),
            (n = Math.imul(U, Y)),
            (i = ((i = Math.imul(U, tt)) + Math.imul(q, Y)) | 0),
            (o = Math.imul(q, tt)),
            (n = (n + Math.imul(B, rt)) | 0),
            (i = ((i = (i + Math.imul(B, nt)) | 0) + Math.imul(F, rt)) | 0),
            (o = (o + Math.imul(F, nt)) | 0),
            (n = (n + Math.imul(T, ot)) | 0),
            (i = ((i = (i + Math.imul(T, st)) | 0) + Math.imul(O, ot)) | 0),
            (o = (o + Math.imul(O, st)) | 0),
            (n = (n + Math.imul(S, lt)) | 0),
            (i = ((i = (i + Math.imul(S, ut)) | 0) + Math.imul(I, lt)) | 0),
            (o = (o + Math.imul(I, ut)) | 0),
            (n = (n + Math.imul(A, ct)) | 0),
            (i = ((i = (i + Math.imul(A, ft)) | 0) + Math.imul(N, ct)) | 0),
            (o = (o + Math.imul(N, ft)) | 0)
        var St =
            (((u + (n = (n + Math.imul(k, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(k, mt)) | 0) + Math.imul(M, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(M, mt)) | 0) + (i >>> 13)) | 0) + (St >>> 26)) | 0),
            (St &= 67108863),
            (n = Math.imul(U, rt)),
            (i = ((i = Math.imul(U, nt)) + Math.imul(q, rt)) | 0),
            (o = Math.imul(q, nt)),
            (n = (n + Math.imul(B, ot)) | 0),
            (i = ((i = (i + Math.imul(B, st)) | 0) + Math.imul(F, ot)) | 0),
            (o = (o + Math.imul(F, st)) | 0),
            (n = (n + Math.imul(T, lt)) | 0),
            (i = ((i = (i + Math.imul(T, ut)) | 0) + Math.imul(O, lt)) | 0),
            (o = (o + Math.imul(O, ut)) | 0),
            (n = (n + Math.imul(S, ct)) | 0),
            (i = ((i = (i + Math.imul(S, ft)) | 0) + Math.imul(I, ct)) | 0),
            (o = (o + Math.imul(I, ft)) | 0)
        var It =
            (((u + (n = (n + Math.imul(A, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(A, mt)) | 0) + Math.imul(N, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(N, mt)) | 0) + (i >>> 13)) | 0) + (It >>> 26)) | 0),
            (It &= 67108863),
            (n = Math.imul(U, ot)),
            (i = ((i = Math.imul(U, st)) + Math.imul(q, ot)) | 0),
            (o = Math.imul(q, st)),
            (n = (n + Math.imul(B, lt)) | 0),
            (i = ((i = (i + Math.imul(B, ut)) | 0) + Math.imul(F, lt)) | 0),
            (o = (o + Math.imul(F, ut)) | 0),
            (n = (n + Math.imul(T, ct)) | 0),
            (i = ((i = (i + Math.imul(T, ft)) | 0) + Math.imul(O, ct)) | 0),
            (o = (o + Math.imul(O, ft)) | 0)
        var Rt =
            (((u + (n = (n + Math.imul(S, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(S, mt)) | 0) + Math.imul(I, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(I, mt)) | 0) + (i >>> 13)) | 0) + (Rt >>> 26)) | 0),
            (Rt &= 67108863),
            (n = Math.imul(U, lt)),
            (i = ((i = Math.imul(U, ut)) + Math.imul(q, lt)) | 0),
            (o = Math.imul(q, ut)),
            (n = (n + Math.imul(B, ct)) | 0),
            (i = ((i = (i + Math.imul(B, ft)) | 0) + Math.imul(F, ct)) | 0),
            (o = (o + Math.imul(F, ft)) | 0)
        var Tt =
            (((u + (n = (n + Math.imul(T, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(T, mt)) | 0) + Math.imul(O, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(O, mt)) | 0) + (i >>> 13)) | 0) + (Tt >>> 26)) | 0),
            (Tt &= 67108863),
            (n = Math.imul(U, ct)),
            (i = ((i = Math.imul(U, ft)) + Math.imul(q, ct)) | 0),
            (o = Math.imul(q, ft))
        var Ot =
            (((u + (n = (n + Math.imul(B, pt)) | 0)) | 0) + ((8191 & (i = ((i = (i + Math.imul(B, mt)) | 0) + Math.imul(F, pt)) | 0)) << 13)) | 0
        ;(u = ((((o = (o + Math.imul(F, mt)) | 0) + (i >>> 13)) | 0) + (Ot >>> 26)) | 0), (Ot &= 67108863)
        var Ct = (((u + (n = Math.imul(U, pt))) | 0) + ((8191 & (i = ((i = Math.imul(U, mt)) + Math.imul(q, pt)) | 0)) << 13)) | 0
        return (
            (u = ((((o = Math.imul(q, mt)) + (i >>> 13)) | 0) + (Ct >>> 26)) | 0),
            (Ct &= 67108863),
            (l[0] = gt),
            (l[1] = vt),
            (l[2] = yt),
            (l[3] = bt),
            (l[4] = wt),
            (l[5] = _t),
            (l[6] = Et),
            (l[7] = kt),
            (l[8] = Mt),
            (l[9] = xt),
            (l[10] = At),
            (l[11] = Nt),
            (l[12] = Pt),
            (l[13] = St),
            (l[14] = It),
            (l[15] = Rt),
            (l[16] = Tt),
            (l[17] = Ot),
            (l[18] = Ct),
            0 !== u && ((l[19] = u), r.length++),
            r
        )
    }
    function p(t, e, r) {
        return new m().mulp(t, e, r)
    }
    function m(t, e) {
        ;(this.x = t), (this.y = e)
    }
    Math.imul || (d = f),
        (i.prototype.mulTo = function (t, e) {
            var r = this.length + t.length
            return 10 === this.length && 10 === t.length
                ? d(this, t, e)
                : r < 63
                ? f(this, t, e)
                : r < 1024
                ? (function (t, e, r) {
                      ;(r.negative = e.negative ^ t.negative), (r.length = t.length + e.length)
                      for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
                          var s = i
                          i = 0
                          for (var a = 67108863 & n, l = Math.min(o, e.length - 1), u = Math.max(0, o - t.length + 1); u <= l; u++) {
                              var h = o - u,
                                  c = (0 | t.words[h]) * (0 | e.words[u]),
                                  f = 67108863 & c
                              ;(a = 67108863 & (f = (f + a) | 0)),
                                  (i += (s = ((s = (s + ((c / 67108864) | 0)) | 0) + (f >>> 26)) | 0) >>> 26),
                                  (s &= 67108863)
                          }
                          ;(r.words[o] = a), (n = s), (s = i)
                      }
                      return 0 !== n ? (r.words[o] = n) : r.length--, r.strip()
                  })(this, t, e)
                : p(this, t, e)
        }),
        (m.prototype.makeRBT = function (t) {
            for (var e = new Array(t), r = i.prototype._countBits(t) - 1, n = 0; n < t; n++) e[n] = this.revBin(n, r, t)
            return e
        }),
        (m.prototype.revBin = function (t, e, r) {
            if (0 === t || t === r - 1) return t
            for (var n = 0, i = 0; i < e; i++) (n |= (1 & t) << (e - i - 1)), (t >>= 1)
            return n
        }),
        (m.prototype.permute = function (t, e, r, n, i, o) {
            for (var s = 0; s < o; s++) (n[s] = e[t[s]]), (i[s] = r[t[s]])
        }),
        (m.prototype.transform = function (t, e, r, n, i, o) {
            this.permute(o, t, e, r, n, i)
            for (var s = 1; s < i; s <<= 1)
                for (var a = s << 1, l = Math.cos((2 * Math.PI) / a), u = Math.sin((2 * Math.PI) / a), h = 0; h < i; h += a)
                    for (var c = l, f = u, d = 0; d < s; d++) {
                        var p = r[h + d],
                            m = n[h + d],
                            g = r[h + d + s],
                            v = n[h + d + s],
                            y = c * g - f * v
                        ;(v = c * v + f * g),
                            (g = y),
                            (r[h + d] = p + g),
                            (n[h + d] = m + v),
                            (r[h + d + s] = p - g),
                            (n[h + d + s] = m - v),
                            d !== a && ((y = l * c - u * f), (f = l * f + u * c), (c = y))
                    }
        }),
        (m.prototype.guessLen13b = function (t, e) {
            var r = 1 | Math.max(e, t),
                n = 1 & r,
                i = 0
            for (r = (r / 2) | 0; r; r >>>= 1) i++
            return 1 << (i + 1 + n)
        }),
        (m.prototype.conjugate = function (t, e, r) {
            if (!(r <= 1))
                for (var n = 0; n < r / 2; n++) {
                    var i = t[n]
                    ;(t[n] = t[r - n - 1]), (t[r - n - 1] = i), (i = e[n]), (e[n] = -e[r - n - 1]), (e[r - n - 1] = -i)
                }
        }),
        (m.prototype.normalize13b = function (t, e) {
            for (var r = 0, n = 0; n < e / 2; n++) {
                var i = 8192 * Math.round(t[2 * n + 1] / e) + Math.round(t[2 * n] / e) + r
                ;(t[n] = 67108863 & i), (r = i < 67108864 ? 0 : (i / 67108864) | 0)
            }
            return t
        }),
        (m.prototype.convert13b = function (t, e, n, i) {
            for (var o = 0, s = 0; s < e; s++) (o += 0 | t[s]), (n[2 * s] = 8191 & o), (o >>>= 13), (n[2 * s + 1] = 8191 & o), (o >>>= 13)
            for (s = 2 * e; s < i; ++s) n[s] = 0
            r(0 === o), r(0 == (-8192 & o))
        }),
        (m.prototype.stub = function (t) {
            for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0
            return e
        }),
        (m.prototype.mulp = function (t, e, r) {
            var n = 2 * this.guessLen13b(t.length, e.length),
                i = this.makeRBT(n),
                o = this.stub(n),
                s = new Array(n),
                a = new Array(n),
                l = new Array(n),
                u = new Array(n),
                h = new Array(n),
                c = new Array(n),
                f = r.words
            ;(f.length = n),
                this.convert13b(t.words, t.length, s, n),
                this.convert13b(e.words, e.length, u, n),
                this.transform(s, o, a, l, n, i),
                this.transform(u, o, h, c, n, i)
            for (var d = 0; d < n; d++) {
                var p = a[d] * h[d] - l[d] * c[d]
                ;(l[d] = a[d] * c[d] + l[d] * h[d]), (a[d] = p)
            }
            return (
                this.conjugate(a, l, n),
                this.transform(a, l, f, o, n, i),
                this.conjugate(f, o, n),
                this.normalize13b(f, n),
                (r.negative = t.negative ^ e.negative),
                (r.length = t.length + e.length),
                r.strip()
            )
        }),
        (i.prototype.mul = function (t) {
            var e = new i(null)
            return (e.words = new Array(this.length + t.length)), this.mulTo(t, e)
        }),
        (i.prototype.mulf = function (t) {
            var e = new i(null)
            return (e.words = new Array(this.length + t.length)), p(this, t, e)
        }),
        (i.prototype.imul = function (t) {
            return this.clone().mulTo(t, this)
        }),
        (i.prototype.imuln = function (t) {
            r("number" == typeof t), r(t < 67108864)
            for (var e = 0, n = 0; n < this.length; n++) {
                var i = (0 | this.words[n]) * t,
                    o = (67108863 & i) + (67108863 & e)
                ;(e >>= 26), (e += (i / 67108864) | 0), (e += o >>> 26), (this.words[n] = 67108863 & o)
            }
            return 0 !== e && ((this.words[n] = e), this.length++), this
        }),
        (i.prototype.muln = function (t) {
            return this.clone().imuln(t)
        }),
        (i.prototype.sqr = function () {
            return this.mul(this)
        }),
        (i.prototype.isqr = function () {
            return this.imul(this.clone())
        }),
        (i.prototype.pow = function (t) {
            var e = (function (t) {
                for (var e = new Array(t.bitLength()), r = 0; r < e.length; r++) {
                    var n = (r / 26) | 0,
                        i = r % 26
                    e[r] = (t.words[n] & (1 << i)) >>> i
                }
                return e
            })(t)
            if (0 === e.length) return new i(1)
            for (var r = this, n = 0; n < e.length && 0 === e[n]; n++, r = r.sqr());
            if (++n < e.length) for (var o = r.sqr(); n < e.length; n++, o = o.sqr()) 0 !== e[n] && (r = r.mul(o))
            return r
        }),
        (i.prototype.iushln = function (t) {
            r("number" == typeof t && t >= 0)
            var e,
                n = t % 26,
                i = (t - n) / 26,
                o = (67108863 >>> (26 - n)) << (26 - n)
            if (0 !== n) {
                var s = 0
                for (e = 0; e < this.length; e++) {
                    var a = this.words[e] & o,
                        l = ((0 | this.words[e]) - a) << n
                    ;(this.words[e] = l | s), (s = a >>> (26 - n))
                }
                s && ((this.words[e] = s), this.length++)
            }
            if (0 !== i) {
                for (e = this.length - 1; e >= 0; e--) this.words[e + i] = this.words[e]
                for (e = 0; e < i; e++) this.words[e] = 0
                this.length += i
            }
            return this.strip()
        }),
        (i.prototype.ishln = function (t) {
            return r(0 === this.negative), this.iushln(t)
        }),
        (i.prototype.iushrn = function (t, e, n) {
            var i
            r("number" == typeof t && t >= 0), (i = e ? (e - (e % 26)) / 26 : 0)
            var o = t % 26,
                s = Math.min((t - o) / 26, this.length),
                a = 67108863 ^ ((67108863 >>> o) << o),
                l = n
            if (((i -= s), (i = Math.max(0, i)), l)) {
                for (var u = 0; u < s; u++) l.words[u] = this.words[u]
                l.length = s
            }
            if (0 === s);
            else if (this.length > s) for (this.length -= s, u = 0; u < this.length; u++) this.words[u] = this.words[u + s]
            else (this.words[0] = 0), (this.length = 1)
            var h = 0
            for (u = this.length - 1; u >= 0 && (0 !== h || u >= i); u--) {
                var c = 0 | this.words[u]
                ;(this.words[u] = (h << (26 - o)) | (c >>> o)), (h = c & a)
            }
            return l && 0 !== h && (l.words[l.length++] = h), 0 === this.length && ((this.words[0] = 0), (this.length = 1)), this.strip()
        }),
        (i.prototype.ishrn = function (t, e, n) {
            return r(0 === this.negative), this.iushrn(t, e, n)
        }),
        (i.prototype.shln = function (t) {
            return this.clone().ishln(t)
        }),
        (i.prototype.ushln = function (t) {
            return this.clone().iushln(t)
        }),
        (i.prototype.shrn = function (t) {
            return this.clone().ishrn(t)
        }),
        (i.prototype.ushrn = function (t) {
            return this.clone().iushrn(t)
        }),
        (i.prototype.testn = function (t) {
            r("number" == typeof t && t >= 0)
            var e = t % 26,
                n = (t - e) / 26,
                i = 1 << e
            return !(this.length <= n || !(this.words[n] & i))
        }),
        (i.prototype.imaskn = function (t) {
            r("number" == typeof t && t >= 0)
            var e = t % 26,
                n = (t - e) / 26
            if ((r(0 === this.negative, "imaskn works only with positive numbers"), this.length <= n)) return this
            if ((0 !== e && n++, (this.length = Math.min(n, this.length)), 0 !== e)) {
                var i = 67108863 ^ ((67108863 >>> e) << e)
                this.words[this.length - 1] &= i
            }
            return this.strip()
        }),
        (i.prototype.maskn = function (t) {
            return this.clone().imaskn(t)
        }),
        (i.prototype.iaddn = function (t) {
            return (
                r("number" == typeof t),
                r(t < 67108864),
                t < 0
                    ? this.isubn(-t)
                    : 0 !== this.negative
                    ? 1 === this.length && (0 | this.words[0]) < t
                        ? ((this.words[0] = t - (0 | this.words[0])), (this.negative = 0), this)
                        : ((this.negative = 0), this.isubn(t), (this.negative = 1), this)
                    : this._iaddn(t)
            )
        }),
        (i.prototype._iaddn = function (t) {
            this.words[0] += t
            for (var e = 0; e < this.length && this.words[e] >= 67108864; e++)
                (this.words[e] -= 67108864), e === this.length - 1 ? (this.words[e + 1] = 1) : this.words[e + 1]++
            return (this.length = Math.max(this.length, e + 1)), this
        }),
        (i.prototype.isubn = function (t) {
            if ((r("number" == typeof t), r(t < 67108864), t < 0)) return this.iaddn(-t)
            if (0 !== this.negative) return (this.negative = 0), this.iaddn(t), (this.negative = 1), this
            if (((this.words[0] -= t), 1 === this.length && this.words[0] < 0)) (this.words[0] = -this.words[0]), (this.negative = 1)
            else for (var e = 0; e < this.length && this.words[e] < 0; e++) (this.words[e] += 67108864), (this.words[e + 1] -= 1)
            return this.strip()
        }),
        (i.prototype.addn = function (t) {
            return this.clone().iaddn(t)
        }),
        (i.prototype.subn = function (t) {
            return this.clone().isubn(t)
        }),
        (i.prototype.iabs = function () {
            return (this.negative = 0), this
        }),
        (i.prototype.abs = function () {
            return this.clone().iabs()
        }),
        (i.prototype._ishlnsubmul = function (t, e, n) {
            var i,
                o,
                s = t.length + n
            this._expand(s)
            var a = 0
            for (i = 0; i < t.length; i++) {
                o = (0 | this.words[i + n]) + a
                var l = (0 | t.words[i]) * e
                ;(a = ((o -= 67108863 & l) >> 26) - ((l / 67108864) | 0)), (this.words[i + n] = 67108863 & o)
            }
            for (; i < this.length - n; i++) (a = (o = (0 | this.words[i + n]) + a) >> 26), (this.words[i + n] = 67108863 & o)
            if (0 === a) return this.strip()
            for (r(-1 === a), a = 0, i = 0; i < this.length; i++) (a = (o = -(0 | this.words[i]) + a) >> 26), (this.words[i] = 67108863 & o)
            return (this.negative = 1), this.strip()
        }),
        (i.prototype._wordDiv = function (t, e) {
            var r = (this.length, t.length),
                n = this.clone(),
                o = t,
                s = 0 | o.words[o.length - 1]
            0 != (r = 26 - this._countBits(s)) && ((o = o.ushln(r)), n.iushln(r), (s = 0 | o.words[o.length - 1]))
            var a,
                l = n.length - o.length
            if ("mod" !== e) {
                ;((a = new i(null)).length = l + 1), (a.words = new Array(a.length))
                for (var u = 0; u < a.length; u++) a.words[u] = 0
            }
            var h = n.clone()._ishlnsubmul(o, 1, l)
            0 === h.negative && ((n = h), a && (a.words[l] = 1))
            for (var c = l - 1; c >= 0; c--) {
                var f = 67108864 * (0 | n.words[o.length + c]) + (0 | n.words[o.length + c - 1])
                for (f = Math.min((f / s) | 0, 67108863), n._ishlnsubmul(o, f, c); 0 !== n.negative; )
                    f--, (n.negative = 0), n._ishlnsubmul(o, 1, c), n.isZero() || (n.negative ^= 1)
                a && (a.words[c] = f)
            }
            return a && a.strip(), n.strip(), "div" !== e && 0 !== r && n.iushrn(r), { div: a || null, mod: n }
        }),
        (i.prototype.divmod = function (t, e, n) {
            return (
                r(!t.isZero()),
                this.isZero()
                    ? { div: new i(0), mod: new i(0) }
                    : 0 !== this.negative && 0 === t.negative
                    ? ((a = this.neg().divmod(t, e)),
                      "mod" !== e && (o = a.div.neg()),
                      "div" !== e && ((s = a.mod.neg()), n && 0 !== s.negative && s.iadd(t)),
                      { div: o, mod: s })
                    : 0 === this.negative && 0 !== t.negative
                    ? ((a = this.divmod(t.neg(), e)), "mod" !== e && (o = a.div.neg()), { div: o, mod: a.mod })
                    : 0 != (this.negative & t.negative)
                    ? ((a = this.neg().divmod(t.neg(), e)),
                      "div" !== e && ((s = a.mod.neg()), n && 0 !== s.negative && s.isub(t)),
                      { div: a.div, mod: s })
                    : t.length > this.length || this.cmp(t) < 0
                    ? { div: new i(0), mod: this }
                    : 1 === t.length
                    ? "div" === e
                        ? { div: this.divn(t.words[0]), mod: null }
                        : "mod" === e
                        ? { div: null, mod: new i(this.modn(t.words[0])) }
                        : { div: this.divn(t.words[0]), mod: new i(this.modn(t.words[0])) }
                    : this._wordDiv(t, e)
            )
            var o, s, a
        }),
        (i.prototype.div = function (t) {
            return this.divmod(t, "div", !1).div
        }),
        (i.prototype.mod = function (t) {
            return this.divmod(t, "mod", !1).mod
        }),
        (i.prototype.umod = function (t) {
            return this.divmod(t, "mod", !0).mod
        }),
        (i.prototype.divRound = function (t) {
            var e = this.divmod(t)
            if (e.mod.isZero()) return e.div
            var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
                n = t.ushrn(1),
                i = t.andln(1),
                o = r.cmp(n)
            return o < 0 || (1 === i && 0 === o) ? e.div : 0 !== e.div.negative ? e.div.isubn(1) : e.div.iaddn(1)
        }),
        (i.prototype.modn = function (t) {
            r(t <= 67108863)
            for (var e = (1 << 26) % t, n = 0, i = this.length - 1; i >= 0; i--) n = (e * n + (0 | this.words[i])) % t
            return n
        }),
        (i.prototype.idivn = function (t) {
            r(t <= 67108863)
            for (var e = 0, n = this.length - 1; n >= 0; n--) {
                var i = (0 | this.words[n]) + 67108864 * e
                ;(this.words[n] = (i / t) | 0), (e = i % t)
            }
            return this.strip()
        }),
        (i.prototype.divn = function (t) {
            return this.clone().idivn(t)
        }),
        (i.prototype.egcd = function (t) {
            r(0 === t.negative), r(!t.isZero())
            var e = this,
                n = t.clone()
            e = 0 !== e.negative ? e.umod(t) : e.clone()
            for (var o = new i(1), s = new i(0), a = new i(0), l = new i(1), u = 0; e.isEven() && n.isEven(); ) e.iushrn(1), n.iushrn(1), ++u
            for (var h = n.clone(), c = e.clone(); !e.isZero(); ) {
                for (var f = 0, d = 1; 0 == (e.words[0] & d) && f < 26; ++f, d <<= 1);
                if (f > 0) for (e.iushrn(f); f-- > 0; ) (o.isOdd() || s.isOdd()) && (o.iadd(h), s.isub(c)), o.iushrn(1), s.iushrn(1)
                for (var p = 0, m = 1; 0 == (n.words[0] & m) && p < 26; ++p, m <<= 1);
                if (p > 0) for (n.iushrn(p); p-- > 0; ) (a.isOdd() || l.isOdd()) && (a.iadd(h), l.isub(c)), a.iushrn(1), l.iushrn(1)
                e.cmp(n) >= 0 ? (e.isub(n), o.isub(a), s.isub(l)) : (n.isub(e), a.isub(o), l.isub(s))
            }
            return { a: a, b: l, gcd: n.iushln(u) }
        }),
        (i.prototype._invmp = function (t) {
            r(0 === t.negative), r(!t.isZero())
            var e = this,
                n = t.clone()
            e = 0 !== e.negative ? e.umod(t) : e.clone()
            for (var o, s = new i(1), a = new i(0), l = n.clone(); e.cmpn(1) > 0 && n.cmpn(1) > 0; ) {
                for (var u = 0, h = 1; 0 == (e.words[0] & h) && u < 26; ++u, h <<= 1);
                if (u > 0) for (e.iushrn(u); u-- > 0; ) s.isOdd() && s.iadd(l), s.iushrn(1)
                for (var c = 0, f = 1; 0 == (n.words[0] & f) && c < 26; ++c, f <<= 1);
                if (c > 0) for (n.iushrn(c); c-- > 0; ) a.isOdd() && a.iadd(l), a.iushrn(1)
                e.cmp(n) >= 0 ? (e.isub(n), s.isub(a)) : (n.isub(e), a.isub(s))
            }
            return (o = 0 === e.cmpn(1) ? s : a).cmpn(0) < 0 && o.iadd(t), o
        }),
        (i.prototype.gcd = function (t) {
            if (this.isZero()) return t.abs()
            if (t.isZero()) return this.abs()
            var e = this.clone(),
                r = t.clone()
            ;(e.negative = 0), (r.negative = 0)
            for (var n = 0; e.isEven() && r.isEven(); n++) e.iushrn(1), r.iushrn(1)
            for (;;) {
                for (; e.isEven(); ) e.iushrn(1)
                for (; r.isEven(); ) r.iushrn(1)
                var i = e.cmp(r)
                if (i < 0) {
                    var o = e
                    ;(e = r), (r = o)
                } else if (0 === i || 0 === r.cmpn(1)) break
                e.isub(r)
            }
            return r.iushln(n)
        }),
        (i.prototype.invm = function (t) {
            return this.egcd(t).a.umod(t)
        }),
        (i.prototype.isEven = function () {
            return 0 == (1 & this.words[0])
        }),
        (i.prototype.isOdd = function () {
            return 1 == (1 & this.words[0])
        }),
        (i.prototype.andln = function (t) {
            return this.words[0] & t
        }),
        (i.prototype.bincn = function (t) {
            r("number" == typeof t)
            var e = t % 26,
                n = (t - e) / 26,
                i = 1 << e
            if (this.length <= n) return this._expand(n + 1), (this.words[n] |= i), this
            for (var o = i, s = n; 0 !== o && s < this.length; s++) {
                var a = 0 | this.words[s]
                ;(o = (a += o) >>> 26), (a &= 67108863), (this.words[s] = a)
            }
            return 0 !== o && ((this.words[s] = o), this.length++), this
        }),
        (i.prototype.isZero = function () {
            return 1 === this.length && 0 === this.words[0]
        }),
        (i.prototype.cmpn = function (t) {
            var e,
                n = t < 0
            if (0 !== this.negative && !n) return -1
            if (0 === this.negative && n) return 1
            if ((this.strip(), this.length > 1)) e = 1
            else {
                n && (t = -t), r(t <= 67108863, "Number is too big")
                var i = 0 | this.words[0]
                e = i === t ? 0 : i < t ? -1 : 1
            }
            return 0 !== this.negative ? 0 | -e : e
        }),
        (i.prototype.cmp = function (t) {
            if (0 !== this.negative && 0 === t.negative) return -1
            if (0 === this.negative && 0 !== t.negative) return 1
            var e = this.ucmp(t)
            return 0 !== this.negative ? 0 | -e : e
        }),
        (i.prototype.ucmp = function (t) {
            if (this.length > t.length) return 1
            if (this.length < t.length) return -1
            for (var e = 0, r = this.length - 1; r >= 0; r--) {
                var n = 0 | this.words[r],
                    i = 0 | t.words[r]
                if (n !== i) {
                    n < i ? (e = -1) : n > i && (e = 1)
                    break
                }
            }
            return e
        }),
        (i.prototype.gtn = function (t) {
            return 1 === this.cmpn(t)
        }),
        (i.prototype.gt = function (t) {
            return 1 === this.cmp(t)
        }),
        (i.prototype.gten = function (t) {
            return this.cmpn(t) >= 0
        }),
        (i.prototype.gte = function (t) {
            return this.cmp(t) >= 0
        }),
        (i.prototype.ltn = function (t) {
            return -1 === this.cmpn(t)
        }),
        (i.prototype.lt = function (t) {
            return -1 === this.cmp(t)
        }),
        (i.prototype.lten = function (t) {
            return this.cmpn(t) <= 0
        }),
        (i.prototype.lte = function (t) {
            return this.cmp(t) <= 0
        }),
        (i.prototype.eqn = function (t) {
            return 0 === this.cmpn(t)
        }),
        (i.prototype.eq = function (t) {
            return 0 === this.cmp(t)
        }),
        (i.red = function (t) {
            return new E(t)
        }),
        (i.prototype.toRed = function (t) {
            return (
                r(!this.red, "Already a number in reduction context"),
                r(0 === this.negative, "red works only with positives"),
                t.convertTo(this)._forceRed(t)
            )
        }),
        (i.prototype.fromRed = function () {
            return r(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this)
        }),
        (i.prototype._forceRed = function (t) {
            return (this.red = t), this
        }),
        (i.prototype.forceRed = function (t) {
            return r(!this.red, "Already a number in reduction context"), this._forceRed(t)
        }),
        (i.prototype.redAdd = function (t) {
            return r(this.red, "redAdd works only with red numbers"), this.red.add(this, t)
        }),
        (i.prototype.redIAdd = function (t) {
            return r(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t)
        }),
        (i.prototype.redSub = function (t) {
            return r(this.red, "redSub works only with red numbers"), this.red.sub(this, t)
        }),
        (i.prototype.redISub = function (t) {
            return r(this.red, "redISub works only with red numbers"), this.red.isub(this, t)
        }),
        (i.prototype.redShl = function (t) {
            return r(this.red, "redShl works only with red numbers"), this.red.shl(this, t)
        }),
        (i.prototype.redMul = function (t) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t)
        }),
        (i.prototype.redIMul = function (t) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t)
        }),
        (i.prototype.redSqr = function () {
            return r(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this)
        }),
        (i.prototype.redISqr = function () {
            return r(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this)
        }),
        (i.prototype.redSqrt = function () {
            return r(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this)
        }),
        (i.prototype.redInvm = function () {
            return r(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this)
        }),
        (i.prototype.redNeg = function () {
            return r(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this)
        }),
        (i.prototype.redPow = function (t) {
            return r(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t)
        })
    var g = { k256: null, p224: null, p192: null, p25519: null }
    function v(t, e) {
        ;(this.name = t),
            (this.p = new i(e, 16)),
            (this.n = this.p.bitLength()),
            (this.k = new i(1).iushln(this.n).isub(this.p)),
            (this.tmp = this._tmp())
    }
    function y() {
        v.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
    }
    function b() {
        v.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
    }
    function w() {
        v.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
    }
    function _() {
        v.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
    }
    function E(t) {
        if ("string" == typeof t) {
            var e = i._prime(t)
            ;(this.m = e.p), (this.prime = e)
        } else r(t.gtn(1), "modulus must be greater than 1"), (this.m = t), (this.prime = null)
    }
    function k(t) {
        E.call(this, t),
            (this.shift = this.m.bitLength()),
            this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
            (this.r = new i(1).iushln(this.shift)),
            (this.r2 = this.imod(this.r.sqr())),
            (this.rinv = this.r._invmp(this.m)),
            (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
            (this.minv = this.minv.umod(this.r)),
            (this.minv = this.r.sub(this.minv))
    }
    ;(v.prototype._tmp = function () {
        var t = new i(null)
        return (t.words = new Array(Math.ceil(this.n / 13))), t
    }),
        (v.prototype.ireduce = function (t) {
            var e,
                r = t
            do {
                this.split(r, this.tmp), (e = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength())
            } while (e > this.n)
            var n = e < this.n ? -1 : r.ucmp(this.p)
            return 0 === n ? ((r.words[0] = 0), (r.length = 1)) : n > 0 ? r.isub(this.p) : void 0 !== r.strip ? r.strip() : r._strip(), r
        }),
        (v.prototype.split = function (t, e) {
            t.iushrn(this.n, 0, e)
        }),
        (v.prototype.imulK = function (t) {
            return t.imul(this.k)
        }),
        n(y, v),
        (y.prototype.split = function (t, e) {
            for (var r = 4194303, n = Math.min(t.length, 9), i = 0; i < n; i++) e.words[i] = t.words[i]
            if (((e.length = n), t.length <= 9)) return (t.words[0] = 0), void (t.length = 1)
            var o = t.words[9]
            for (e.words[e.length++] = o & r, i = 10; i < t.length; i++) {
                var s = 0 | t.words[i]
                ;(t.words[i - 10] = ((s & r) << 4) | (o >>> 22)), (o = s)
            }
            ;(o >>>= 22), (t.words[i - 10] = o), 0 === o && t.length > 10 ? (t.length -= 10) : (t.length -= 9)
        }),
        (y.prototype.imulK = function (t) {
            ;(t.words[t.length] = 0), (t.words[t.length + 1] = 0), (t.length += 2)
            for (var e = 0, r = 0; r < t.length; r++) {
                var n = 0 | t.words[r]
                ;(e += 977 * n), (t.words[r] = 67108863 & e), (e = 64 * n + ((e / 67108864) | 0))
            }
            return 0 === t.words[t.length - 1] && (t.length--, 0 === t.words[t.length - 1] && t.length--), t
        }),
        n(b, v),
        n(w, v),
        n(_, v),
        (_.prototype.imulK = function (t) {
            for (var e = 0, r = 0; r < t.length; r++) {
                var n = 19 * (0 | t.words[r]) + e,
                    i = 67108863 & n
                ;(n >>>= 26), (t.words[r] = i), (e = n)
            }
            return 0 !== e && (t.words[t.length++] = e), t
        }),
        (i._prime = function (t) {
            if (g[t]) return g[t]
            var e
            if ("k256" === t) e = new y()
            else if ("p224" === t) e = new b()
            else if ("p192" === t) e = new w()
            else {
                if ("p25519" !== t) throw new Error("Unknown prime " + t)
                e = new _()
            }
            return (g[t] = e), e
        }),
        (E.prototype._verify1 = function (t) {
            r(0 === t.negative, "red works only with positives"), r(t.red, "red works only with red numbers")
        }),
        (E.prototype._verify2 = function (t, e) {
            r(0 == (t.negative | e.negative), "red works only with positives"), r(t.red && t.red === e.red, "red works only with red numbers")
        }),
        (E.prototype.imod = function (t) {
            return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this)
        }),
        (E.prototype.neg = function (t) {
            return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this)
        }),
        (E.prototype.add = function (t, e) {
            this._verify2(t, e)
            var r = t.add(e)
            return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this)
        }),
        (E.prototype.iadd = function (t, e) {
            this._verify2(t, e)
            var r = t.iadd(e)
            return r.cmp(this.m) >= 0 && r.isub(this.m), r
        }),
        (E.prototype.sub = function (t, e) {
            this._verify2(t, e)
            var r = t.sub(e)
            return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this)
        }),
        (E.prototype.isub = function (t, e) {
            this._verify2(t, e)
            var r = t.isub(e)
            return r.cmpn(0) < 0 && r.iadd(this.m), r
        }),
        (E.prototype.shl = function (t, e) {
            return this._verify1(t), this.imod(t.ushln(e))
        }),
        (E.prototype.imul = function (t, e) {
            return this._verify2(t, e), this.imod(t.imul(e))
        }),
        (E.prototype.mul = function (t, e) {
            return this._verify2(t, e), this.imod(t.mul(e))
        }),
        (E.prototype.isqr = function (t) {
            return this.imul(t, t.clone())
        }),
        (E.prototype.sqr = function (t) {
            return this.mul(t, t)
        }),
        (E.prototype.sqrt = function (t) {
            if (t.isZero()) return t.clone()
            var e = this.m.andln(3)
            if ((r(e % 2 == 1), 3 === e)) {
                var n = this.m.add(new i(1)).iushrn(2)
                return this.pow(t, n)
            }
            for (var o = this.m.subn(1), s = 0; !o.isZero() && 0 === o.andln(1); ) s++, o.iushrn(1)
            r(!o.isZero())
            var a = new i(1).toRed(this),
                l = a.redNeg(),
                u = this.m.subn(1).iushrn(1),
                h = this.m.bitLength()
            for (h = new i(2 * h * h).toRed(this); 0 !== this.pow(h, u).cmp(l); ) h.redIAdd(l)
            for (var c = this.pow(h, o), f = this.pow(t, o.addn(1).iushrn(1)), d = this.pow(t, o), p = s; 0 !== d.cmp(a); ) {
                for (var m = d, g = 0; 0 !== m.cmp(a); g++) m = m.redSqr()
                r(g < p)
                var v = this.pow(c, new i(1).iushln(p - g - 1))
                ;(f = f.redMul(v)), (c = v.redSqr()), (d = d.redMul(c)), (p = g)
            }
            return f
        }),
        (E.prototype.invm = function (t) {
            var e = t._invmp(this.m)
            return 0 !== e.negative ? ((e.negative = 0), this.imod(e).redNeg()) : this.imod(e)
        }),
        (E.prototype.pow = function (t, e) {
            if (e.isZero()) return new i(1).toRed(this)
            if (0 === e.cmpn(1)) return t.clone()
            var r = new Array(16)
            ;(r[0] = new i(1).toRed(this)), (r[1] = t)
            for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], t)
            var o = r[0],
                s = 0,
                a = 0,
                l = e.bitLength() % 26
            for (0 === l && (l = 26), n = e.length - 1; n >= 0; n--) {
                for (var u = e.words[n], h = l - 1; h >= 0; h--) {
                    var c = (u >> h) & 1
                    o !== r[0] && (o = this.sqr(o)),
                        0 !== c || 0 !== s
                            ? ((s <<= 1), (s |= c), (4 == ++a || (0 === n && 0 === h)) && ((o = this.mul(o, r[s])), (a = 0), (s = 0)))
                            : (a = 0)
                }
                l = 26
            }
            return o
        }),
        (E.prototype.convertTo = function (t) {
            var e = t.umod(this.m)
            return e === t ? e.clone() : e
        }),
        (E.prototype.convertFrom = function (t) {
            var e = t.clone()
            return (e.red = null), e
        }),
        (i.mont = function (t) {
            return new k(t)
        }),
        n(k, E),
        (k.prototype.convertTo = function (t) {
            return this.imod(t.ushln(this.shift))
        }),
        (k.prototype.convertFrom = function (t) {
            var e = this.imod(t.mul(this.rinv))
            return (e.red = null), e
        }),
        (k.prototype.imul = function (t, e) {
            if (t.isZero() || e.isZero()) return (t.words[0] = 0), (t.length = 1), t
            var r = t.imul(e),
                n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                i = r.isub(n).iushrn(this.shift),
                o = i
            return i.cmp(this.m) >= 0 ? (o = i.isub(this.m)) : i.cmpn(0) < 0 && (o = i.iadd(this.m)), o._forceRed(this)
        }),
        (k.prototype.mul = function (t, e) {
            if (t.isZero() || e.isZero()) return new i(0)._forceRed(this)
            var r = t.mul(e),
                n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                o = r.isub(n).iushrn(this.shift),
                s = o
            return o.cmp(this.m) >= 0 ? (s = o.isub(this.m)) : o.cmpn(0) < 0 && (s = o.iadd(this.m)), s._forceRed(this)
        }),
        (k.prototype.invm = function (t) {
            return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this)
        })
})(oi, ni)
var ai = oi.exports
let li = !1,
    ui = !1
const hi = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 }
let ci = hi.default,
    fi = null
const di = (function () {
    try {
        const t = []
        if (
            (["NFD", "NFC", "NFKD", "NFKC"].forEach((e) => {
                try {
                    if ("test" !== "test".normalize(e)) throw new Error("bad normalize")
                } catch (r) {
                    t.push(e)
                }
            }),
            t.length)
        )
            throw new Error("missing " + t.join(", "))
        if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw new Error("broken implementation")
    } catch (t) {
        return t.message
    }
    return null
})()
var pi, mi, gi, vi
;((mi = pi || (pi = {})).DEBUG = "DEBUG"),
    (mi.INFO = "INFO"),
    (mi.WARNING = "WARNING"),
    (mi.ERROR = "ERROR"),
    (mi.OFF = "OFF"),
    ((vi = gi || (gi = {})).UNKNOWN_ERROR = "UNKNOWN_ERROR"),
    (vi.NOT_IMPLEMENTED = "NOT_IMPLEMENTED"),
    (vi.UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION"),
    (vi.NETWORK_ERROR = "NETWORK_ERROR"),
    (vi.SERVER_ERROR = "SERVER_ERROR"),
    (vi.TIMEOUT = "TIMEOUT"),
    (vi.BUFFER_OVERRUN = "BUFFER_OVERRUN"),
    (vi.NUMERIC_FAULT = "NUMERIC_FAULT"),
    (vi.MISSING_NEW = "MISSING_NEW"),
    (vi.INVALID_ARGUMENT = "INVALID_ARGUMENT"),
    (vi.MISSING_ARGUMENT = "MISSING_ARGUMENT"),
    (vi.UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT"),
    (vi.CALL_EXCEPTION = "CALL_EXCEPTION"),
    (vi.INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS"),
    (vi.NONCE_EXPIRED = "NONCE_EXPIRED"),
    (vi.REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED"),
    (vi.UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT"),
    (vi.TRANSACTION_REPLACED = "TRANSACTION_REPLACED")
class yi {
    constructor(t) {
        Object.defineProperty(this, "version", { enumerable: !0, value: t, writable: !1 })
    }
    _log(t, e) {
        const r = t.toLowerCase()
        null == hi[r] && this.throwArgumentError("invalid log level name", "logLevel", t), ci > hi[r] || console.log.apply(console, e)
    }
    debug(...t) {
        this._log(yi.levels.DEBUG, t)
    }
    info(...t) {
        this._log(yi.levels.INFO, t)
    }
    warn(...t) {
        this._log(yi.levels.WARNING, t)
    }
    makeError(t, e, r) {
        if (ui) return this.makeError("censored error", e, {})
        e || (e = yi.errors.UNKNOWN_ERROR), r || (r = {})
        const n = []
        Object.keys(r).forEach((t) => {
            try {
                n.push(t + "=" + JSON.stringify(r[t]))
            } catch (e) {
                n.push(t + "=" + JSON.stringify(r[t].toString()))
            }
        }),
            n.push(`code=${e}`),
            n.push(`version=${this.version}`)
        const i = t
        n.length && (t += " (" + n.join(", ") + ")")
        const o = new Error(t)
        return (
            (o.reason = i),
            (o.code = e),
            Object.keys(r).forEach(function (t) {
                o[t] = r[t]
            }),
            o
        )
    }
    throwError(t, e, r) {
        throw this.makeError(t, e, r)
    }
    throwArgumentError(t, e, r) {
        return this.throwError(t, yi.errors.INVALID_ARGUMENT, { argument: e, value: r })
    }
    assert(t, e, r, n) {
        t || this.throwError(e, r, n)
    }
    assertArgument(t, e, r, n) {
        t || this.throwArgumentError(e, r, n)
    }
    checkNormalize(t) {
        di &&
            this.throwError("platform missing String.prototype.normalize", yi.errors.UNSUPPORTED_OPERATION, {
                operation: "String.prototype.normalize",
                form: di,
            })
    }
    checkSafeUint53(t, e) {
        "number" == typeof t &&
            (null == e && (e = "value not safe"),
            (t < 0 || t >= 9007199254740991) &&
                this.throwError(e, yi.errors.NUMERIC_FAULT, { operation: "checkSafeInteger", fault: "out-of-safe-range", value: t }),
            t % 1 && this.throwError(e, yi.errors.NUMERIC_FAULT, { operation: "checkSafeInteger", fault: "non-integer", value: t }))
    }
    checkArgumentCount(t, e, r) {
        ;(r = r ? ": " + r : ""),
            t < e && this.throwError("missing argument" + r, yi.errors.MISSING_ARGUMENT, { count: t, expectedCount: e }),
            t > e && this.throwError("too many arguments" + r, yi.errors.UNEXPECTED_ARGUMENT, { count: t, expectedCount: e })
    }
    checkNew(t, e) {
        ;(t !== Object && null != t) || this.throwError("missing new", yi.errors.MISSING_NEW, { name: e.name })
    }
    checkAbstract(t, e) {
        t === e
            ? this.throwError(
                  "cannot instantiate abstract class " + JSON.stringify(e.name) + " directly; use a sub-class",
                  yi.errors.UNSUPPORTED_OPERATION,
                  { name: t.name, operation: "new" }
              )
            : (t !== Object && null != t) || this.throwError("missing new", yi.errors.MISSING_NEW, { name: e.name })
    }
    static globalLogger() {
        return fi || (fi = new yi("logger/5.4.0")), fi
    }
    static setCensorship(t, e) {
        if (
            (!t &&
                e &&
                this.globalLogger().throwError("cannot permanently disable censorship", yi.errors.UNSUPPORTED_OPERATION, {
                    operation: "setCensorship",
                }),
            li)
        ) {
            if (!t) return
            this.globalLogger().throwError("error censorship permanent", yi.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" })
        }
        ;(ui = !!t), (li = !!e)
    }
    static setLogLevel(t) {
        const e = hi[t.toLowerCase()]
        null != e ? (ci = e) : yi.globalLogger().warn("invalid log level - " + t)
    }
    static from(t) {
        return new yi(t)
    }
}
;(yi.errors = gi), (yi.levels = pi)
const bi = new yi("bytes/5.4.0")
function wi(t) {
    return !!t.toHexString
}
function _i(t) {
    return (
        t.slice ||
            (t.slice = function () {
                const e = Array.prototype.slice.call(arguments)
                return _i(new Uint8Array(Array.prototype.slice.apply(t, e)))
            }),
        t
    )
}
function Ei(t) {
    return (Ni(t) && !(t.length % 2)) || ki(t)
}
function ki(t) {
    if (null == t) return !1
    if (t.constructor === Uint8Array) return !0
    if ("string" == typeof t) return !1
    if (null == t.length) return !1
    for (let e = 0; e < t.length; e++) {
        const r = t[e]
        if ("number" != typeof r || r < 0 || r >= 256 || r % 1) return !1
    }
    return !0
}
function Mi(t, e) {
    if ((e || (e = {}), "number" == typeof t)) {
        bi.checkSafeUint53(t, "invalid arrayify value")
        const e = []
        for (; t; ) e.unshift(255 & t), (t = parseInt(String(t / 256)))
        return 0 === e.length && e.push(0), _i(new Uint8Array(e))
    }
    if ((e.allowMissingPrefix && "string" == typeof t && "0x" !== t.substring(0, 2) && (t = "0x" + t), wi(t) && (t = t.toHexString()), Ni(t))) {
        let r = t.substring(2)
        r.length % 2 &&
            ("left" === e.hexPad
                ? (r = "0x0" + r.substring(2))
                : "right" === e.hexPad
                ? (r += "0")
                : bi.throwArgumentError("hex data is odd-length", "value", t))
        const n = []
        for (let t = 0; t < r.length; t += 2) n.push(parseInt(r.substring(t, t + 2), 16))
        return _i(new Uint8Array(n))
    }
    return ki(t) ? _i(new Uint8Array(t)) : bi.throwArgumentError("invalid arrayify value", "value", t)
}
function xi(t) {
    const e = t.map((t) => Mi(t)),
        r = e.reduce((t, e) => t + e.length, 0),
        n = new Uint8Array(r)
    return e.reduce((t, e) => (n.set(e, t), t + e.length), 0), _i(n)
}
function Ai(t) {
    let e = Mi(t)
    if (0 === e.length) return e
    let r = 0
    for (; r < e.length && 0 === e[r]; ) r++
    return r && (e = e.slice(r)), e
}
function Ni(t, e) {
    return !("string" != typeof t || !t.match(/^0x[0-9A-Fa-f]*$/)) && (!e || t.length === 2 + 2 * e)
}
function Pi(t, e) {
    if ((e || (e = {}), "number" == typeof t)) {
        bi.checkSafeUint53(t, "invalid hexlify value")
        let e = ""
        for (; t; ) (e = "0123456789abcdef"[15 & t] + e), (t = Math.floor(t / 16))
        return e.length ? (e.length % 2 && (e = "0" + e), "0x" + e) : "0x00"
    }
    if ("bigint" == typeof t) return (t = t.toString(16)).length % 2 ? "0x0" + t : "0x" + t
    if ((e.allowMissingPrefix && "string" == typeof t && "0x" !== t.substring(0, 2) && (t = "0x" + t), wi(t))) return t.toHexString()
    if (Ni(t))
        return (
            t.length % 2 &&
                ("left" === e.hexPad
                    ? (t = "0x0" + t.substring(2))
                    : "right" === e.hexPad
                    ? (t += "0")
                    : bi.throwArgumentError("hex data is odd-length", "value", t)),
            t.toLowerCase()
        )
    if (ki(t)) {
        let e = "0x"
        for (let r = 0; r < t.length; r++) {
            let n = t[r]
            e += "0123456789abcdef"[(240 & n) >> 4] + "0123456789abcdef"[15 & n]
        }
        return e
    }
    return bi.throwArgumentError("invalid hexlify value", "value", t)
}
function Si(t) {
    if ("string" != typeof t) t = Pi(t)
    else if (!Ni(t) || t.length % 2) return null
    return (t.length - 2) / 2
}
function Ii(t, e, r) {
    return (
        "string" != typeof t ? (t = Pi(t)) : (!Ni(t) || t.length % 2) && bi.throwArgumentError("invalid hexData", "value", t),
        (e = 2 + 2 * e),
        null != r ? "0x" + t.substring(e, 2 + 2 * r) : "0x" + t.substring(e)
    )
}
function Ri(t) {
    let e = "0x"
    return (
        t.forEach((t) => {
            e += Pi(t).substring(2)
        }),
        e
    )
}
function Ti(t) {
    const e = (function (t) {
        "string" != typeof t && (t = Pi(t))
        Ni(t) || bi.throwArgumentError("invalid hex string", "value", t)
        t = t.substring(2)
        let e = 0
        for (; e < t.length && "0" === t[e]; ) e++
        return "0x" + t.substring(e)
    })(Pi(t, { hexPad: "left" }))
    return "0x" === e ? "0x0" : e
}
function Oi(t, e) {
    for (
        "string" != typeof t ? (t = Pi(t)) : Ni(t) || bi.throwArgumentError("invalid hex string", "value", t),
            t.length > 2 * e + 2 && bi.throwArgumentError("value out of range", "value", arguments[1]);
        t.length < 2 * e + 2;

    )
        t = "0x0" + t.substring(2)
    return t
}
function Ci(t) {
    const e = { r: "0x", s: "0x", _vs: "0x", recoveryParam: 0, v: 0 }
    if (Ei(t)) {
        const r = Mi(t)
        65 !== r.length && bi.throwArgumentError("invalid signature string; must be 65 bytes", "signature", t),
            (e.r = Pi(r.slice(0, 32))),
            (e.s = Pi(r.slice(32, 64))),
            (e.v = r[64]),
            e.v < 27 && (0 === e.v || 1 === e.v ? (e.v += 27) : bi.throwArgumentError("signature invalid v byte", "signature", t)),
            (e.recoveryParam = 1 - (e.v % 2)),
            e.recoveryParam && (r[32] |= 128),
            (e._vs = Pi(r.slice(32, 64)))
    } else {
        if (((e.r = t.r), (e.s = t.s), (e.v = t.v), (e.recoveryParam = t.recoveryParam), (e._vs = t._vs), null != e._vs)) {
            const r = (function (t, e) {
                ;(t = Mi(t)).length > e && bi.throwArgumentError("value out of range", "value", arguments[0])
                const r = new Uint8Array(e)
                return r.set(t, e - t.length), _i(r)
            })(Mi(e._vs), 32)
            e._vs = Pi(r)
            const n = r[0] >= 128 ? 1 : 0
            null == e.recoveryParam
                ? (e.recoveryParam = n)
                : e.recoveryParam !== n && bi.throwArgumentError("signature recoveryParam mismatch _vs", "signature", t),
                (r[0] &= 127)
            const i = Pi(r)
            null == e.s ? (e.s = i) : e.s !== i && bi.throwArgumentError("signature v mismatch _vs", "signature", t)
        }
        null == e.recoveryParam
            ? null == e.v
                ? bi.throwArgumentError("signature missing v and recoveryParam", "signature", t)
                : 0 === e.v || 1 === e.v
                ? (e.recoveryParam = e.v)
                : (e.recoveryParam = 1 - (e.v % 2))
            : null == e.v
            ? (e.v = 27 + e.recoveryParam)
            : e.recoveryParam !== 1 - (e.v % 2) && bi.throwArgumentError("signature recoveryParam mismatch v", "signature", t),
            null != e.r && Ni(e.r) ? (e.r = Oi(e.r, 32)) : bi.throwArgumentError("signature missing or invalid r", "signature", t),
            null != e.s && Ni(e.s) ? (e.s = Oi(e.s, 32)) : bi.throwArgumentError("signature missing or invalid s", "signature", t)
        const r = Mi(e.s)
        r[0] >= 128 && bi.throwArgumentError("signature s out of range", "signature", t), e.recoveryParam && (r[0] |= 128)
        const n = Pi(r)
        e._vs && (Ni(e._vs) || bi.throwArgumentError("signature invalid _vs", "signature", t), (e._vs = Oi(e._vs, 32))),
            null == e._vs ? (e._vs = n) : e._vs !== n && bi.throwArgumentError("signature _vs mismatch v and s", "signature", t)
    }
    return e
}
var Bi = ai.BN
const Fi = new yi("bignumber/5.4.0"),
    Li = {}
let Ui = !1
class qi {
    constructor(t, e) {
        Fi.checkNew(new.target, qi),
            t !== Li &&
                Fi.throwError("cannot call constructor directly; use BigNumber.from", yi.errors.UNSUPPORTED_OPERATION, {
                    operation: "new (BigNumber)",
                }),
            (this._hex = e),
            (this._isBigNumber = !0),
            Object.freeze(this)
    }
    fromTwos(t) {
        return Di(zi(this).fromTwos(t))
    }
    toTwos(t) {
        return Di(zi(this).toTwos(t))
    }
    abs() {
        return "-" === this._hex[0] ? qi.from(this._hex.substring(1)) : this
    }
    add(t) {
        return Di(zi(this).add(zi(t)))
    }
    sub(t) {
        return Di(zi(this).sub(zi(t)))
    }
    div(t) {
        return qi.from(t).isZero() && Gi("division by zero", "div"), Di(zi(this).div(zi(t)))
    }
    mul(t) {
        return Di(zi(this).mul(zi(t)))
    }
    mod(t) {
        const e = zi(t)
        return e.isNeg() && Gi("cannot modulo negative values", "mod"), Di(zi(this).umod(e))
    }
    pow(t) {
        const e = zi(t)
        return e.isNeg() && Gi("cannot raise to negative values", "pow"), Di(zi(this).pow(e))
    }
    and(t) {
        const e = zi(t)
        return (this.isNegative() || e.isNeg()) && Gi("cannot 'and' negative values", "and"), Di(zi(this).and(e))
    }
    or(t) {
        const e = zi(t)
        return (this.isNegative() || e.isNeg()) && Gi("cannot 'or' negative values", "or"), Di(zi(this).or(e))
    }
    xor(t) {
        const e = zi(t)
        return (this.isNegative() || e.isNeg()) && Gi("cannot 'xor' negative values", "xor"), Di(zi(this).xor(e))
    }
    mask(t) {
        return (this.isNegative() || t < 0) && Gi("cannot mask negative values", "mask"), Di(zi(this).maskn(t))
    }
    shl(t) {
        return (this.isNegative() || t < 0) && Gi("cannot shift negative values", "shl"), Di(zi(this).shln(t))
    }
    shr(t) {
        return (this.isNegative() || t < 0) && Gi("cannot shift negative values", "shr"), Di(zi(this).shrn(t))
    }
    eq(t) {
        return zi(this).eq(zi(t))
    }
    lt(t) {
        return zi(this).lt(zi(t))
    }
    lte(t) {
        return zi(this).lte(zi(t))
    }
    gt(t) {
        return zi(this).gt(zi(t))
    }
    gte(t) {
        return zi(this).gte(zi(t))
    }
    isNegative() {
        return "-" === this._hex[0]
    }
    isZero() {
        return zi(this).isZero()
    }
    toNumber() {
        try {
            return zi(this).toNumber()
        } catch (t) {
            Gi("overflow", "toNumber", this.toString())
        }
        return null
    }
    toBigInt() {
        try {
            return BigInt(this.toString())
        } catch (t) {}
        return Fi.throwError("this platform does not support BigInt", yi.errors.UNSUPPORTED_OPERATION, { value: this.toString() })
    }
    toString() {
        return (
            arguments.length > 0 &&
                (10 === arguments[0]
                    ? Ui || ((Ui = !0), Fi.warn("BigNumber.toString does not accept any parameters; base-10 is assumed"))
                    : 16 === arguments[0]
                    ? Fi.throwError(
                          "BigNumber.toString does not accept any parameters; use bigNumber.toHexString()",
                          yi.errors.UNEXPECTED_ARGUMENT,
                          {}
                      )
                    : Fi.throwError("BigNumber.toString does not accept parameters", yi.errors.UNEXPECTED_ARGUMENT, {})),
            zi(this).toString(10)
        )
    }
    toHexString() {
        return this._hex
    }
    toJSON(t) {
        return { type: "BigNumber", hex: this.toHexString() }
    }
    static from(t) {
        if (t instanceof qi) return t
        if ("string" == typeof t)
            return t.match(/^-?0x[0-9a-f]+$/i)
                ? new qi(Li, ji(t))
                : t.match(/^-?[0-9]+$/)
                ? new qi(Li, ji(new Bi(t)))
                : Fi.throwArgumentError("invalid BigNumber string", "value", t)
        if ("number" == typeof t)
            return (
                t % 1 && Gi("underflow", "BigNumber.from", t),
                (t >= 9007199254740991 || t <= -9007199254740991) && Gi("overflow", "BigNumber.from", t),
                qi.from(String(t))
            )
        const e = t
        if ("bigint" == typeof e) return qi.from(e.toString())
        if (ki(e)) return qi.from(Pi(e))
        if (e)
            if (e.toHexString) {
                const t = e.toHexString()
                if ("string" == typeof t) return qi.from(t)
            } else {
                let t = e._hex
                if (
                    (null == t && "BigNumber" === e.type && (t = e.hex), "string" == typeof t && (Ni(t) || ("-" === t[0] && Ni(t.substring(1)))))
                )
                    return qi.from(t)
            }
        return Fi.throwArgumentError("invalid BigNumber value", "value", t)
    }
    static isBigNumber(t) {
        return !(!t || !t._isBigNumber)
    }
}
function ji(t) {
    if ("string" != typeof t) return ji(t.toString(16))
    if ("-" === t[0])
        return "-" === (t = t.substring(1))[0] && Fi.throwArgumentError("invalid hex", "value", t), "0x00" === (t = ji(t)) ? t : "-" + t
    if (("0x" !== t.substring(0, 2) && (t = "0x" + t), "0x" === t)) return "0x00"
    for (t.length % 2 && (t = "0x0" + t.substring(2)); t.length > 4 && "0x00" === t.substring(0, 4); ) t = "0x" + t.substring(4)
    return t
}
function Di(t) {
    return qi.from(ji(t))
}
function zi(t) {
    const e = qi.from(t).toHexString()
    return "-" === e[0] ? new Bi("-" + e.substring(3), 16) : new Bi(e.substring(2), 16)
}
function Gi(t, e, r) {
    const n = { fault: t, operation: e }
    return null != r && (n.value = r), Fi.throwError(t, yi.errors.NUMERIC_FAULT, n)
}
var $i = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const Hi = new yi("properties/5.4.0")
function Vi(t, e, r) {
    Object.defineProperty(t, e, { enumerable: !0, value: r, writable: !1 })
}
function Wi(t, e) {
    for (let r = 0; r < 32; r++) {
        if (t[e]) return t[e]
        if (!t.prototype || "object" != typeof t.prototype) break
        t = Object.getPrototypeOf(t.prototype).constructor
    }
    return null
}
function Ki(t) {
    return $i(this, void 0, void 0, function* () {
        const e = Object.keys(t).map((e) => {
            const r = t[e]
            return Promise.resolve(r).then((t) => ({ key: e, value: t }))
        })
        return (yield Promise.all(e)).reduce((t, e) => ((t[e.key] = e.value), t), {})
    })
}
function Ji(t) {
    const e = {}
    for (const r in t) e[r] = t[r]
    return e
}
const Xi = { bigint: !0, boolean: !0, function: !0, number: !0, string: !0 }
function Zi(t) {
    if (null == t || Xi[typeof t]) return !0
    if (Array.isArray(t) || "object" == typeof t) {
        if (!Object.isFrozen(t)) return !1
        const e = Object.keys(t)
        for (let r = 0; r < e.length; r++) if (!Zi(t[e[r]])) return !1
        return !0
    }
    return Hi.throwArgumentError("Cannot deepCopy " + typeof t, "object", t)
}
function Qi(t) {
    if (Zi(t)) return t
    if (Array.isArray(t)) return Object.freeze(t.map((t) => Yi(t)))
    if ("object" == typeof t) {
        const e = {}
        for (const r in t) {
            const n = t[r]
            void 0 !== n && Vi(e, r, Yi(n))
        }
        return e
    }
    return Hi.throwArgumentError("Cannot deepCopy " + typeof t, "object", t)
}
function Yi(t) {
    return Qi(t)
}
var to,
    eo = { exports: {} }
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.5.7
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2016
 * @license MIT
 */ ;(to = eo),
    (function () {
        var t = "object" == typeof window ? window : {}
        !t.JS_SHA3_NO_NODE_JS && "object" == typeof process && process.versions && process.versions.node && (t = ni)
        for (
            var e = !t.JS_SHA3_NO_COMMON_JS && to.exports,
                r = "0123456789abcdef".split(""),
                n = [0, 8, 16, 24],
                i = [
                    1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777,
                    2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
                    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648,
                    2147483649, 0, 2147516424, 2147483648,
                ],
                o = [224, 256, 384, 512],
                s = ["hex", "buffer", "arrayBuffer", "array"],
                a = function (t, e, r) {
                    return function (n) {
                        return new y(t, e, t).update(n)[r]()
                    }
                },
                l = function (t, e, r) {
                    return function (n, i) {
                        return new y(t, e, i).update(n)[r]()
                    }
                },
                u = function (t, e) {
                    var r = a(t, e, "hex")
                    ;(r.create = function () {
                        return new y(t, e, t)
                    }),
                        (r.update = function (t) {
                            return r.create().update(t)
                        })
                    for (var n = 0; n < s.length; ++n) {
                        var i = s[n]
                        r[i] = a(t, e, i)
                    }
                    return r
                },
                h = [
                    { name: "keccak", padding: [1, 256, 65536, 16777216], bits: o, createMethod: u },
                    { name: "sha3", padding: [6, 1536, 393216, 100663296], bits: o, createMethod: u },
                    {
                        name: "shake",
                        padding: [31, 7936, 2031616, 520093696],
                        bits: [128, 256],
                        createMethod: function (t, e) {
                            var r = l(t, e, "hex")
                            ;(r.create = function (r) {
                                return new y(t, e, r)
                            }),
                                (r.update = function (t, e) {
                                    return r.create(e).update(t)
                                })
                            for (var n = 0; n < s.length; ++n) {
                                var i = s[n]
                                r[i] = l(t, e, i)
                            }
                            return r
                        },
                    },
                ],
                c = {},
                f = [],
                d = 0;
            d < h.length;
            ++d
        )
            for (var p = h[d], m = p.bits, g = 0; g < m.length; ++g) {
                var v = p.name + "_" + m[g]
                f.push(v), (c[v] = p.createMethod(m[g], p.padding))
            }
        function y(t, e, r) {
            ;(this.blocks = []),
                (this.s = []),
                (this.padding = e),
                (this.outputBits = r),
                (this.reset = !0),
                (this.block = 0),
                (this.start = 0),
                (this.blockCount = (1600 - (t << 1)) >> 5),
                (this.byteCount = this.blockCount << 2),
                (this.outputBlocks = r >> 5),
                (this.extraBytes = (31 & r) >> 3)
            for (var n = 0; n < 50; ++n) this.s[n] = 0
        }
        ;(y.prototype.update = function (t) {
            var e = "string" != typeof t
            e && t.constructor === ArrayBuffer && (t = new Uint8Array(t))
            for (var r, i, o = t.length, s = this.blocks, a = this.byteCount, l = this.blockCount, u = 0, h = this.s; u < o; ) {
                if (this.reset) for (this.reset = !1, s[0] = this.block, r = 1; r < l + 1; ++r) s[r] = 0
                if (e) for (r = this.start; u < o && r < a; ++u) s[r >> 2] |= t[u] << n[3 & r++]
                else
                    for (r = this.start; u < o && r < a; ++u)
                        (i = t.charCodeAt(u)) < 128
                            ? (s[r >> 2] |= i << n[3 & r++])
                            : i < 2048
                            ? ((s[r >> 2] |= (192 | (i >> 6)) << n[3 & r++]), (s[r >> 2] |= (128 | (63 & i)) << n[3 & r++]))
                            : i < 55296 || i >= 57344
                            ? ((s[r >> 2] |= (224 | (i >> 12)) << n[3 & r++]),
                              (s[r >> 2] |= (128 | ((i >> 6) & 63)) << n[3 & r++]),
                              (s[r >> 2] |= (128 | (63 & i)) << n[3 & r++]))
                            : ((i = 65536 + (((1023 & i) << 10) | (1023 & t.charCodeAt(++u)))),
                              (s[r >> 2] |= (240 | (i >> 18)) << n[3 & r++]),
                              (s[r >> 2] |= (128 | ((i >> 12) & 63)) << n[3 & r++]),
                              (s[r >> 2] |= (128 | ((i >> 6) & 63)) << n[3 & r++]),
                              (s[r >> 2] |= (128 | (63 & i)) << n[3 & r++]))
                if (((this.lastByteIndex = r), r >= a)) {
                    for (this.start = r - a, this.block = s[l], r = 0; r < l; ++r) h[r] ^= s[r]
                    b(h), (this.reset = !0)
                } else this.start = r
            }
            return this
        }),
            (y.prototype.finalize = function () {
                var t = this.blocks,
                    e = this.lastByteIndex,
                    r = this.blockCount,
                    n = this.s
                if (((t[e >> 2] |= this.padding[3 & e]), this.lastByteIndex === this.byteCount))
                    for (t[0] = t[r], e = 1; e < r + 1; ++e) t[e] = 0
                for (t[r - 1] |= 2147483648, e = 0; e < r; ++e) n[e] ^= t[e]
                b(n)
            }),
            (y.prototype.toString = y.prototype.hex =
                function () {
                    this.finalize()
                    for (var t, e = this.blockCount, n = this.s, i = this.outputBlocks, o = this.extraBytes, s = 0, a = 0, l = ""; a < i; ) {
                        for (s = 0; s < e && a < i; ++s, ++a)
                            (t = n[s]),
                                (l +=
                                    r[(t >> 4) & 15] +
                                    r[15 & t] +
                                    r[(t >> 12) & 15] +
                                    r[(t >> 8) & 15] +
                                    r[(t >> 20) & 15] +
                                    r[(t >> 16) & 15] +
                                    r[(t >> 28) & 15] +
                                    r[(t >> 24) & 15])
                        a % e == 0 && (b(n), (s = 0))
                    }
                    return (
                        o &&
                            ((t = n[s]),
                            o > 0 && (l += r[(t >> 4) & 15] + r[15 & t]),
                            o > 1 && (l += r[(t >> 12) & 15] + r[(t >> 8) & 15]),
                            o > 2 && (l += r[(t >> 20) & 15] + r[(t >> 16) & 15])),
                        l
                    )
                }),
            (y.prototype.arrayBuffer = function () {
                this.finalize()
                var t,
                    e = this.blockCount,
                    r = this.s,
                    n = this.outputBlocks,
                    i = this.extraBytes,
                    o = 0,
                    s = 0,
                    a = this.outputBits >> 3
                t = i ? new ArrayBuffer((n + 1) << 2) : new ArrayBuffer(a)
                for (var l = new Uint32Array(t); s < n; ) {
                    for (o = 0; o < e && s < n; ++o, ++s) l[s] = r[o]
                    s % e == 0 && b(r)
                }
                return i && ((l[o] = r[o]), (t = t.slice(0, a))), t
            }),
            (y.prototype.buffer = y.prototype.arrayBuffer),
            (y.prototype.digest = y.prototype.array =
                function () {
                    this.finalize()
                    for (var t, e, r = this.blockCount, n = this.s, i = this.outputBlocks, o = this.extraBytes, s = 0, a = 0, l = []; a < i; ) {
                        for (s = 0; s < r && a < i; ++s, ++a)
                            (t = a << 2),
                                (e = n[s]),
                                (l[t] = 255 & e),
                                (l[t + 1] = (e >> 8) & 255),
                                (l[t + 2] = (e >> 16) & 255),
                                (l[t + 3] = (e >> 24) & 255)
                        a % r == 0 && b(n)
                    }
                    return (
                        o &&
                            ((t = a << 2),
                            (e = n[s]),
                            o > 0 && (l[t] = 255 & e),
                            o > 1 && (l[t + 1] = (e >> 8) & 255),
                            o > 2 && (l[t + 2] = (e >> 16) & 255)),
                        l
                    )
                })
        var b = function (t) {
            var e,
                r,
                n,
                o,
                s,
                a,
                l,
                u,
                h,
                c,
                f,
                d,
                p,
                m,
                g,
                v,
                y,
                b,
                w,
                _,
                E,
                k,
                M,
                x,
                A,
                N,
                P,
                S,
                I,
                R,
                T,
                O,
                C,
                B,
                F,
                L,
                U,
                q,
                j,
                D,
                z,
                G,
                $,
                H,
                V,
                W,
                K,
                J,
                X,
                Z,
                Q,
                Y,
                tt,
                et,
                rt,
                nt,
                it,
                ot,
                st,
                at,
                lt,
                ut,
                ht
            for (n = 0; n < 48; n += 2)
                (o = t[0] ^ t[10] ^ t[20] ^ t[30] ^ t[40]),
                    (s = t[1] ^ t[11] ^ t[21] ^ t[31] ^ t[41]),
                    (a = t[2] ^ t[12] ^ t[22] ^ t[32] ^ t[42]),
                    (l = t[3] ^ t[13] ^ t[23] ^ t[33] ^ t[43]),
                    (u = t[4] ^ t[14] ^ t[24] ^ t[34] ^ t[44]),
                    (h = t[5] ^ t[15] ^ t[25] ^ t[35] ^ t[45]),
                    (c = t[6] ^ t[16] ^ t[26] ^ t[36] ^ t[46]),
                    (f = t[7] ^ t[17] ^ t[27] ^ t[37] ^ t[47]),
                    (e = (d = t[8] ^ t[18] ^ t[28] ^ t[38] ^ t[48]) ^ ((a << 1) | (l >>> 31))),
                    (r = (p = t[9] ^ t[19] ^ t[29] ^ t[39] ^ t[49]) ^ ((l << 1) | (a >>> 31))),
                    (t[0] ^= e),
                    (t[1] ^= r),
                    (t[10] ^= e),
                    (t[11] ^= r),
                    (t[20] ^= e),
                    (t[21] ^= r),
                    (t[30] ^= e),
                    (t[31] ^= r),
                    (t[40] ^= e),
                    (t[41] ^= r),
                    (e = o ^ ((u << 1) | (h >>> 31))),
                    (r = s ^ ((h << 1) | (u >>> 31))),
                    (t[2] ^= e),
                    (t[3] ^= r),
                    (t[12] ^= e),
                    (t[13] ^= r),
                    (t[22] ^= e),
                    (t[23] ^= r),
                    (t[32] ^= e),
                    (t[33] ^= r),
                    (t[42] ^= e),
                    (t[43] ^= r),
                    (e = a ^ ((c << 1) | (f >>> 31))),
                    (r = l ^ ((f << 1) | (c >>> 31))),
                    (t[4] ^= e),
                    (t[5] ^= r),
                    (t[14] ^= e),
                    (t[15] ^= r),
                    (t[24] ^= e),
                    (t[25] ^= r),
                    (t[34] ^= e),
                    (t[35] ^= r),
                    (t[44] ^= e),
                    (t[45] ^= r),
                    (e = u ^ ((d << 1) | (p >>> 31))),
                    (r = h ^ ((p << 1) | (d >>> 31))),
                    (t[6] ^= e),
                    (t[7] ^= r),
                    (t[16] ^= e),
                    (t[17] ^= r),
                    (t[26] ^= e),
                    (t[27] ^= r),
                    (t[36] ^= e),
                    (t[37] ^= r),
                    (t[46] ^= e),
                    (t[47] ^= r),
                    (e = c ^ ((o << 1) | (s >>> 31))),
                    (r = f ^ ((s << 1) | (o >>> 31))),
                    (t[8] ^= e),
                    (t[9] ^= r),
                    (t[18] ^= e),
                    (t[19] ^= r),
                    (t[28] ^= e),
                    (t[29] ^= r),
                    (t[38] ^= e),
                    (t[39] ^= r),
                    (t[48] ^= e),
                    (t[49] ^= r),
                    (m = t[0]),
                    (g = t[1]),
                    (W = (t[11] << 4) | (t[10] >>> 28)),
                    (K = (t[10] << 4) | (t[11] >>> 28)),
                    (S = (t[20] << 3) | (t[21] >>> 29)),
                    (I = (t[21] << 3) | (t[20] >>> 29)),
                    (at = (t[31] << 9) | (t[30] >>> 23)),
                    (lt = (t[30] << 9) | (t[31] >>> 23)),
                    (G = (t[40] << 18) | (t[41] >>> 14)),
                    ($ = (t[41] << 18) | (t[40] >>> 14)),
                    (B = (t[2] << 1) | (t[3] >>> 31)),
                    (F = (t[3] << 1) | (t[2] >>> 31)),
                    (v = (t[13] << 12) | (t[12] >>> 20)),
                    (y = (t[12] << 12) | (t[13] >>> 20)),
                    (J = (t[22] << 10) | (t[23] >>> 22)),
                    (X = (t[23] << 10) | (t[22] >>> 22)),
                    (R = (t[33] << 13) | (t[32] >>> 19)),
                    (T = (t[32] << 13) | (t[33] >>> 19)),
                    (ut = (t[42] << 2) | (t[43] >>> 30)),
                    (ht = (t[43] << 2) | (t[42] >>> 30)),
                    (et = (t[5] << 30) | (t[4] >>> 2)),
                    (rt = (t[4] << 30) | (t[5] >>> 2)),
                    (L = (t[14] << 6) | (t[15] >>> 26)),
                    (U = (t[15] << 6) | (t[14] >>> 26)),
                    (b = (t[25] << 11) | (t[24] >>> 21)),
                    (w = (t[24] << 11) | (t[25] >>> 21)),
                    (Z = (t[34] << 15) | (t[35] >>> 17)),
                    (Q = (t[35] << 15) | (t[34] >>> 17)),
                    (O = (t[45] << 29) | (t[44] >>> 3)),
                    (C = (t[44] << 29) | (t[45] >>> 3)),
                    (x = (t[6] << 28) | (t[7] >>> 4)),
                    (A = (t[7] << 28) | (t[6] >>> 4)),
                    (nt = (t[17] << 23) | (t[16] >>> 9)),
                    (it = (t[16] << 23) | (t[17] >>> 9)),
                    (q = (t[26] << 25) | (t[27] >>> 7)),
                    (j = (t[27] << 25) | (t[26] >>> 7)),
                    (_ = (t[36] << 21) | (t[37] >>> 11)),
                    (E = (t[37] << 21) | (t[36] >>> 11)),
                    (Y = (t[47] << 24) | (t[46] >>> 8)),
                    (tt = (t[46] << 24) | (t[47] >>> 8)),
                    (H = (t[8] << 27) | (t[9] >>> 5)),
                    (V = (t[9] << 27) | (t[8] >>> 5)),
                    (N = (t[18] << 20) | (t[19] >>> 12)),
                    (P = (t[19] << 20) | (t[18] >>> 12)),
                    (ot = (t[29] << 7) | (t[28] >>> 25)),
                    (st = (t[28] << 7) | (t[29] >>> 25)),
                    (D = (t[38] << 8) | (t[39] >>> 24)),
                    (z = (t[39] << 8) | (t[38] >>> 24)),
                    (k = (t[48] << 14) | (t[49] >>> 18)),
                    (M = (t[49] << 14) | (t[48] >>> 18)),
                    (t[0] = m ^ (~v & b)),
                    (t[1] = g ^ (~y & w)),
                    (t[10] = x ^ (~N & S)),
                    (t[11] = A ^ (~P & I)),
                    (t[20] = B ^ (~L & q)),
                    (t[21] = F ^ (~U & j)),
                    (t[30] = H ^ (~W & J)),
                    (t[31] = V ^ (~K & X)),
                    (t[40] = et ^ (~nt & ot)),
                    (t[41] = rt ^ (~it & st)),
                    (t[2] = v ^ (~b & _)),
                    (t[3] = y ^ (~w & E)),
                    (t[12] = N ^ (~S & R)),
                    (t[13] = P ^ (~I & T)),
                    (t[22] = L ^ (~q & D)),
                    (t[23] = U ^ (~j & z)),
                    (t[32] = W ^ (~J & Z)),
                    (t[33] = K ^ (~X & Q)),
                    (t[42] = nt ^ (~ot & at)),
                    (t[43] = it ^ (~st & lt)),
                    (t[4] = b ^ (~_ & k)),
                    (t[5] = w ^ (~E & M)),
                    (t[14] = S ^ (~R & O)),
                    (t[15] = I ^ (~T & C)),
                    (t[24] = q ^ (~D & G)),
                    (t[25] = j ^ (~z & $)),
                    (t[34] = J ^ (~Z & Y)),
                    (t[35] = X ^ (~Q & tt)),
                    (t[44] = ot ^ (~at & ut)),
                    (t[45] = st ^ (~lt & ht)),
                    (t[6] = _ ^ (~k & m)),
                    (t[7] = E ^ (~M & g)),
                    (t[16] = R ^ (~O & x)),
                    (t[17] = T ^ (~C & A)),
                    (t[26] = D ^ (~G & B)),
                    (t[27] = z ^ (~$ & F)),
                    (t[36] = Z ^ (~Y & H)),
                    (t[37] = Q ^ (~tt & V)),
                    (t[46] = at ^ (~ut & et)),
                    (t[47] = lt ^ (~ht & rt)),
                    (t[8] = k ^ (~m & v)),
                    (t[9] = M ^ (~g & y)),
                    (t[18] = O ^ (~x & N)),
                    (t[19] = C ^ (~A & P)),
                    (t[28] = G ^ (~B & L)),
                    (t[29] = $ ^ (~F & U)),
                    (t[38] = Y ^ (~H & W)),
                    (t[39] = tt ^ (~V & K)),
                    (t[48] = ut ^ (~et & nt)),
                    (t[49] = ht ^ (~rt & it)),
                    (t[0] ^= i[n]),
                    (t[1] ^= i[n + 1])
        }
        if (e) to.exports = c
        else for (d = 0; d < f.length; ++d) t[f[d]] = c[f[d]]
    })()
var ro = eo.exports
function no(t) {
    return "0x" + ro.keccak_256(Mi(t))
}
const io = new yi("rlp/5.4.0")
function oo(t) {
    const e = []
    for (; t; ) e.unshift(255 & t), (t >>= 8)
    return e
}
function so(t, e, r) {
    let n = 0
    for (let i = 0; i < r; i++) n = 256 * n + t[e + i]
    return n
}
function ao(t) {
    if (Array.isArray(t)) {
        let e = []
        if (
            (t.forEach(function (t) {
                e = e.concat(ao(t))
            }),
            e.length <= 55)
        )
            return e.unshift(192 + e.length), e
        const r = oo(e.length)
        return r.unshift(247 + r.length), r.concat(e)
    }
    Ei(t) || io.throwArgumentError("RLP object must be BytesLike", "object", t)
    const e = Array.prototype.slice.call(Mi(t))
    if (1 === e.length && e[0] <= 127) return e
    if (e.length <= 55) return e.unshift(128 + e.length), e
    const r = oo(e.length)
    return r.unshift(183 + r.length), r.concat(e)
}
function lo(t) {
    return Pi(ao(t))
}
function uo(t, e, r, n) {
    const i = []
    for (; r < e + 1 + n; ) {
        const o = ho(t, r)
        i.push(o.result), (r += o.consumed) > e + 1 + n && io.throwError("child data too short", yi.errors.BUFFER_OVERRUN, {})
    }
    return { consumed: 1 + n, result: i }
}
function ho(t, e) {
    if ((0 === t.length && io.throwError("data too short", yi.errors.BUFFER_OVERRUN, {}), t[e] >= 248)) {
        const r = t[e] - 247
        e + 1 + r > t.length && io.throwError("data short segment too short", yi.errors.BUFFER_OVERRUN, {})
        const n = so(t, e + 1, r)
        return e + 1 + r + n > t.length && io.throwError("data long segment too short", yi.errors.BUFFER_OVERRUN, {}), uo(t, e, e + 1 + r, r + n)
    }
    if (t[e] >= 192) {
        const r = t[e] - 192
        return e + 1 + r > t.length && io.throwError("data array too short", yi.errors.BUFFER_OVERRUN, {}), uo(t, e, e + 1, r)
    }
    if (t[e] >= 184) {
        const r = t[e] - 183
        e + 1 + r > t.length && io.throwError("data array too short", yi.errors.BUFFER_OVERRUN, {})
        const n = so(t, e + 1, r)
        e + 1 + r + n > t.length && io.throwError("data array too short", yi.errors.BUFFER_OVERRUN, {})
        return { consumed: 1 + r + n, result: Pi(t.slice(e + 1 + r, e + 1 + r + n)) }
    }
    if (t[e] >= 128) {
        const r = t[e] - 128
        e + 1 + r > t.length && io.throwError("data too short", yi.errors.BUFFER_OVERRUN, {})
        return { consumed: 1 + r, result: Pi(t.slice(e + 1, e + 1 + r)) }
    }
    return { consumed: 1, result: Pi(t[e]) }
}
function co(t) {
    const e = Mi(t),
        r = ho(e, 0)
    return r.consumed !== e.length && io.throwArgumentError("invalid rlp data", "data", t), r.result
}
const fo = new yi("address/5.4.0")
function po(t) {
    Ni(t, 20) || fo.throwArgumentError("invalid address", "address", t)
    const e = (t = t.toLowerCase()).substring(2).split(""),
        r = new Uint8Array(40)
    for (let i = 0; i < 40; i++) r[i] = e[i].charCodeAt(0)
    const n = Mi(no(r))
    for (let i = 0; i < 40; i += 2)
        n[i >> 1] >> 4 >= 8 && (e[i] = e[i].toUpperCase()), (15 & n[i >> 1]) >= 8 && (e[i + 1] = e[i + 1].toUpperCase())
    return "0x" + e.join("")
}
const mo = {}
for (let of = 0; of < 10; of++) mo[String(of)] = String(of)
for (let of = 0; of < 26; of++) mo[String.fromCharCode(65 + of)] = String(10 + of)
const go = Math.floor(
    (function (t) {
        return Math.log10 ? Math.log10(t) : Math.log(t) / Math.LN10
    })(9007199254740991)
)
function vo(t) {
    let e = null
    if (("string" != typeof t && fo.throwArgumentError("invalid address", "address", t), t.match(/^(0x)?[0-9a-fA-F]{40}$/)))
        "0x" !== t.substring(0, 2) && (t = "0x" + t),
            (e = po(t)),
            t.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && e !== t && fo.throwArgumentError("bad address checksum", "address", t)
    else if (t.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
        for (
            t.substring(2, 4) !==
                (function (t) {
                    let e = (t = (t = t.toUpperCase()).substring(4) + t.substring(0, 2) + "00")
                        .split("")
                        .map((t) => mo[t])
                        .join("")
                    for (; e.length >= go; ) {
                        let t = e.substring(0, go)
                        e = (parseInt(t, 10) % 97) + e.substring(t.length)
                    }
                    let r = String(98 - (parseInt(e, 10) % 97))
                    for (; r.length < 2; ) r = "0" + r
                    return r
                })(t) && fo.throwArgumentError("bad icap checksum", "address", t),
                r = t.substring(4),
                e = new Bi(r, 36).toString(16);
            e.length < 40;

        )
            e = "0" + e
        e = po("0x" + e)
    } else fo.throwArgumentError("invalid address", "address", t)
    var r
    return e
}
const yo = qi.from(0),
    bo = new yi("strings/5.4.0")
var wo, _o, Eo, ko
function Mo(t, e, r, n, i) {
    if (t === Eo.BAD_PREFIX || t === Eo.UNEXPECTED_CONTINUE) {
        let t = 0
        for (let n = e + 1; n < r.length && r[n] >> 6 == 2; n++) t++
        return t
    }
    return t === Eo.OVERRUN ? r.length - e - 1 : 0
}
;((_o = wo || (wo = {})).current = ""),
    (_o.NFC = "NFC"),
    (_o.NFD = "NFD"),
    (_o.NFKC = "NFKC"),
    (_o.NFKD = "NFKD"),
    ((ko = Eo || (Eo = {})).UNEXPECTED_CONTINUE = "unexpected continuation byte"),
    (ko.BAD_PREFIX = "bad codepoint prefix"),
    (ko.OVERRUN = "string overrun"),
    (ko.MISSING_CONTINUE = "missing continuation byte"),
    (ko.OUT_OF_RANGE = "out of UTF-8 range"),
    (ko.UTF16_SURROGATE = "UTF-16 surrogate"),
    (ko.OVERLONG = "overlong representation")
const xo = Object.freeze({
    error: function (t, e, r, n, i) {
        return bo.throwArgumentError(`invalid codepoint at offset ${e}; ${t}`, "bytes", r)
    },
    ignore: Mo,
    replace: function (t, e, r, n, i) {
        return t === Eo.OVERLONG ? (n.push(i), 0) : (n.push(65533), Mo(t, e, r))
    },
})
function Ao(t, e) {
    null == e && (e = xo.error), (t = Mi(t))
    const r = []
    let n = 0
    for (; n < t.length; ) {
        const i = t[n++]
        if (i >> 7 == 0) {
            r.push(i)
            continue
        }
        let o = null,
            s = null
        if (192 == (224 & i)) (o = 1), (s = 127)
        else if (224 == (240 & i)) (o = 2), (s = 2047)
        else {
            if (240 != (248 & i)) {
                n += e(128 == (192 & i) ? Eo.UNEXPECTED_CONTINUE : Eo.BAD_PREFIX, n - 1, t, r)
                continue
            }
            ;(o = 3), (s = 65535)
        }
        if (n - 1 + o >= t.length) {
            n += e(Eo.OVERRUN, n - 1, t, r)
            continue
        }
        let a = i & ((1 << (8 - o - 1)) - 1)
        for (let l = 0; l < o; l++) {
            let i = t[n]
            if (128 != (192 & i)) {
                ;(n += e(Eo.MISSING_CONTINUE, n, t, r)), (a = null)
                break
            }
            ;(a = (a << 6) | (63 & i)), n++
        }
        null !== a &&
            (a > 1114111
                ? (n += e(Eo.OUT_OF_RANGE, n - 1 - o, t, r, a))
                : a >= 55296 && a <= 57343
                ? (n += e(Eo.UTF16_SURROGATE, n - 1 - o, t, r, a))
                : a <= s
                ? (n += e(Eo.OVERLONG, n - 1 - o, t, r, a))
                : r.push(a))
    }
    return r
}
function No(t, e = wo.current) {
    e != wo.current && (bo.checkNormalize(), (t = t.normalize(e)))
    let r = []
    for (let n = 0; n < t.length; n++) {
        const e = t.charCodeAt(n)
        if (e < 128) r.push(e)
        else if (e < 2048) r.push((e >> 6) | 192), r.push((63 & e) | 128)
        else if (55296 == (64512 & e)) {
            n++
            const i = t.charCodeAt(n)
            if (n >= t.length || 56320 != (64512 & i)) throw new Error("invalid utf-8 string")
            const o = 65536 + ((1023 & e) << 10) + (1023 & i)
            r.push((o >> 18) | 240), r.push(((o >> 12) & 63) | 128), r.push(((o >> 6) & 63) | 128), r.push((63 & o) | 128)
        } else r.push((e >> 12) | 224), r.push(((e >> 6) & 63) | 128), r.push((63 & e) | 128)
    }
    return Mi(r)
}
function Po(t) {
    return t
        .map((t) => (t <= 65535 ? String.fromCharCode(t) : ((t -= 65536), String.fromCharCode(55296 + ((t >> 10) & 1023), 56320 + (1023 & t)))))
        .join("")
}
function So(t, e) {
    return Po(Ao(t, e))
}
function Io(t, e = wo.current) {
    return Ao(No(t, e))
}
function Ro(t, e) {
    e ||
        (e = function (t) {
            return [parseInt(t, 16)]
        })
    let r = 0,
        n = {}
    return (
        t.split(",").forEach((t) => {
            let i = t.split(":")
            ;(r += parseInt(i[0], 16)), (n[r] = e(i[1]))
        }),
        n
    )
}
function To(t) {
    let e = 0
    return t.split(",").map((t) => {
        let r = t.split("-")
        1 === r.length ? (r[1] = "0") : "" === r[1] && (r[1] = "1")
        let n = e + parseInt(r[0], 16)
        return (e = parseInt(r[1], 16)), { l: n, h: e }
    })
}
function Oo(t, e) {
    let r = 0
    for (let n = 0; n < e.length; n++) {
        let i = e[n]
        if (((r += i.l), t >= r && t <= r + i.h && (t - r) % (i.d || 1) == 0)) {
            if (i.e && -1 !== i.e.indexOf(t - r)) continue
            return i
        }
    }
    return null
}
const Co = To(
        "221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d"
    ),
    Bo = "ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff".split(",").map((t) => parseInt(t, 16)),
    Fo = [
        { h: 25, s: 32, l: 65 },
        { h: 30, s: 32, e: [23], l: 127 },
        { h: 54, s: 1, e: [48], l: 64, d: 2 },
        { h: 14, s: 1, l: 57, d: 2 },
        { h: 44, s: 1, l: 17, d: 2 },
        { h: 10, s: 1, e: [2, 6, 8], l: 61, d: 2 },
        { h: 16, s: 1, l: 68, d: 2 },
        { h: 84, s: 1, e: [18, 24, 66], l: 19, d: 2 },
        { h: 26, s: 32, e: [17], l: 435 },
        { h: 22, s: 1, l: 71, d: 2 },
        { h: 15, s: 80, l: 40 },
        { h: 31, s: 32, l: 16 },
        { h: 32, s: 1, l: 80, d: 2 },
        { h: 52, s: 1, l: 42, d: 2 },
        { h: 12, s: 1, l: 55, d: 2 },
        { h: 40, s: 1, e: [38], l: 15, d: 2 },
        { h: 14, s: 1, l: 48, d: 2 },
        { h: 37, s: 48, l: 49 },
        { h: 148, s: 1, l: 6351, d: 2 },
        { h: 88, s: 1, l: 160, d: 2 },
        { h: 15, s: 16, l: 704 },
        { h: 25, s: 26, l: 854 },
        { h: 25, s: 32, l: 55915 },
        { h: 37, s: 40, l: 1247 },
        { h: 25, s: -119711, l: 53248 },
        { h: 25, s: -119763, l: 52 },
        { h: 25, s: -119815, l: 52 },
        { h: 25, s: -119867, e: [1, 4, 5, 7, 8, 11, 12, 17], l: 52 },
        { h: 25, s: -119919, l: 52 },
        { h: 24, s: -119971, e: [2, 7, 8, 17], l: 52 },
        { h: 24, s: -120023, e: [2, 7, 13, 15, 16, 17], l: 52 },
        { h: 25, s: -120075, l: 52 },
        { h: 25, s: -120127, l: 52 },
        { h: 25, s: -120179, l: 52 },
        { h: 25, s: -120231, l: 52 },
        { h: 25, s: -120283, l: 52 },
        { h: 25, s: -120335, l: 52 },
        { h: 24, s: -119543, e: [17], l: 56 },
        { h: 24, s: -119601, e: [17], l: 58 },
        { h: 24, s: -119659, e: [17], l: 58 },
        { h: 24, s: -119717, e: [17], l: 58 },
        { h: 24, s: -119775, e: [17], l: 58 },
    ],
    Lo = Ro(
        "b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3"
    ),
    Uo = Ro(
        "179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7"
    ),
    qo = Ro(
        "df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D",
        function (t) {
            if (t.length % 4 != 0) throw new Error("bad data")
            let e = []
            for (let r = 0; r < t.length; r += 4) e.push(parseInt(t.substring(r, r + 4), 16))
            return e
        }
    ),
    jo = To(
        "80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001"
    )
function Do(t) {
    if (t.match(/^[a-z0-9-]*$/i) && t.length <= 59) return t.toLowerCase()
    let e = Io(t)
    var r
    ;(r = e.map((t) => {
        if (Bo.indexOf(t) >= 0) return []
        if (t >= 65024 && t <= 65039) return []
        let e = (function (t) {
            let e = Oo(t, Fo)
            if (e) return [t + e.s]
            let r = Lo[t]
            if (r) return r
            let n = Uo[t]
            return n ? [t + n[0]] : qo[t] || null
        })(t)
        return e || [t]
    })),
        (e = r.reduce(
            (t, e) => (
                e.forEach((e) => {
                    t.push(e)
                }),
                t
            ),
            []
        )),
        (e = Io(Po(e), wo.NFKC)),
        e.forEach((t) => {
            if (Oo(t, jo)) throw new Error("STRINGPREP_CONTAINS_PROHIBITED")
        }),
        e.forEach((t) => {
            if (Oo(t, Co)) throw new Error("STRINGPREP_CONTAINS_UNASSIGNED")
        })
    let n = Po(e)
    if ("-" === n.substring(0, 1) || "--" === n.substring(2, 4) || "-" === n.substring(n.length - 1)) throw new Error("invalid hyphen")
    if (n.length > 63) throw new Error("too long")
    return n
}
function zo(t) {
    return no(No(t))
}
const Go = new yi("hash/5.4.0"),
    $o = new Uint8Array(32)
$o.fill(0)
const Ho = new RegExp("^((.*)\\.)?([^.]+)$")
function Vo(t) {
    "string" != typeof t && Go.throwArgumentError("invalid ENS name; not a string", "name", t)
    let e = t,
        r = $o
    for (; e.length; ) {
        const n = e.match(Ho)
        ;(null != n && "" !== n[2]) || Go.throwArgumentError("invalid ENS address; missing component", "name", t)
        ;(r = no(xi([r, no(No(Do(n[3])))]))), (e = n[2] || "")
    }
    return Pi(r)
}
var Wo = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const Ko = new yi("hash/5.4.0"),
    Jo = new Uint8Array(32)
Jo.fill(0)
const Xo = qi.from(-1),
    Zo = qi.from(0),
    Qo = qi.from(1),
    Yo = qi.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
const ts = Oi(Qo.toHexString(), 32),
    es = Oi(Zo.toHexString(), 32),
    rs = { name: "string", version: "string", chainId: "uint256", verifyingContract: "address", salt: "bytes32" },
    ns = ["name", "version", "chainId", "verifyingContract", "salt"]
function is(t) {
    return function (e) {
        return "string" != typeof e && Ko.throwArgumentError(`invalid domain value for ${JSON.stringify(t)}`, `domain.${t}`, e), e
    }
}
const os = {
    name: is("name"),
    version: is("version"),
    chainId: function (t) {
        try {
            return qi.from(t).toString()
        } catch (e) {}
        return Ko.throwArgumentError('invalid domain value for "chainId"', "domain.chainId", t)
    },
    verifyingContract: function (t) {
        try {
            return vo(t).toLowerCase()
        } catch (e) {}
        return Ko.throwArgumentError('invalid domain value "verifyingContract"', "domain.verifyingContract", t)
    },
    salt: function (t) {
        try {
            const e = Mi(t)
            if (32 !== e.length) throw new Error("bad length")
            return Pi(e)
        } catch (e) {}
        return Ko.throwArgumentError('invalid domain value "salt"', "domain.salt", t)
    },
}
function ss(t) {
    {
        const e = t.match(/^(u?)int(\d*)$/)
        if (e) {
            const r = "" === e[1],
                n = parseInt(e[2] || "256")
            ;(n % 8 != 0 || n > 256 || (e[2] && e[2] !== String(n))) && Ko.throwArgumentError("invalid numeric width", "type", t)
            const i = Yo.mask(r ? n - 1 : n),
                o = r ? i.add(Qo).mul(Xo) : Zo
            return function (e) {
                const r = qi.from(e)
                return (
                    (r.lt(o) || r.gt(i)) && Ko.throwArgumentError(`value out-of-bounds for ${t}`, "value", e),
                    Oi(r.toTwos(256).toHexString(), 32)
                )
            }
        }
    }
    {
        const e = t.match(/^bytes(\d+)$/)
        if (e) {
            const r = parseInt(e[1])
            return (
                (0 === r || r > 32 || e[1] !== String(r)) && Ko.throwArgumentError("invalid bytes width", "type", t),
                function (e) {
                    return (
                        Mi(e).length !== r && Ko.throwArgumentError(`invalid length for ${t}`, "value", e),
                        (function (t) {
                            const e = Mi(t),
                                r = e.length % 32
                            return r ? Ri([e, Jo.slice(r)]) : Pi(e)
                        })(e)
                    )
                }
            )
        }
    }
    switch (t) {
        case "address":
            return function (t) {
                return Oi(vo(t), 32)
            }
        case "bool":
            return function (t) {
                return t ? ts : es
            }
        case "bytes":
            return function (t) {
                return no(t)
            }
        case "string":
            return function (t) {
                return zo(t)
            }
    }
    return null
}
function as(t, e) {
    return `${t}(${e.map(({ name: t, type: e }) => e + " " + t).join(",")})`
}
class ls {
    constructor(t) {
        Vi(this, "types", Object.freeze(Yi(t))), Vi(this, "_encoderCache", {}), Vi(this, "_types", {})
        const e = {},
            r = {},
            n = {}
        Object.keys(t).forEach((t) => {
            ;(e[t] = {}), (r[t] = []), (n[t] = {})
        })
        for (const o in t) {
            const n = {}
            t[o].forEach((i) => {
                n[i.name] && Ko.throwArgumentError(`duplicate variable name ${JSON.stringify(i.name)} in ${JSON.stringify(o)}`, "types", t),
                    (n[i.name] = !0)
                const s = i.type.match(/^([^\x5b]*)(\x5b|$)/)[1]
                s === o && Ko.throwArgumentError(`circular type reference to ${JSON.stringify(s)}`, "types", t)
                ss(s) || (r[s] || Ko.throwArgumentError(`unknown type ${JSON.stringify(s)}`, "types", t), r[s].push(o), (e[o][s] = !0))
            })
        }
        const i = Object.keys(r).filter((t) => 0 === r[t].length)
        0 === i.length
            ? Ko.throwArgumentError("missing primary type", "types", t)
            : i.length > 1 &&
              Ko.throwArgumentError(`ambiguous primary types or unused types: ${i.map((t) => JSON.stringify(t)).join(", ")}`, "types", t),
            Vi(this, "primaryType", i[0]),
            (function i(o, s) {
                s[o] && Ko.throwArgumentError(`circular type reference to ${JSON.stringify(o)}`, "types", t),
                    (s[o] = !0),
                    Object.keys(e[o]).forEach((t) => {
                        r[t] &&
                            (i(t, s),
                            Object.keys(s).forEach((e) => {
                                n[e][t] = !0
                            }))
                    }),
                    delete s[o]
            })(this.primaryType, {})
        for (const o in n) {
            const e = Object.keys(n[o])
            e.sort(), (this._types[o] = as(o, t[o]) + e.map((e) => as(e, t[e])).join(""))
        }
    }
    getEncoder(t) {
        let e = this._encoderCache[t]
        return e || (e = this._encoderCache[t] = this._getEncoder(t)), e
    }
    _getEncoder(t) {
        {
            const e = ss(t)
            if (e) return e
        }
        const e = t.match(/^(.*)(\x5b(\d*)\x5d)$/)
        if (e) {
            const t = e[1],
                r = this.getEncoder(t),
                n = parseInt(e[3])
            return (e) => {
                n >= 0 && e.length !== n && Ko.throwArgumentError("array length mismatch; expected length ${ arrayLength }", "value", e)
                let i = e.map(r)
                return this._types[t] && (i = i.map(no)), no(Ri(i))
            }
        }
        const r = this.types[t]
        if (r) {
            const e = zo(this._types[t])
            return (t) => {
                const n = r.map(({ name: e, type: r }) => {
                    const n = this.getEncoder(r)(t[e])
                    return this._types[r] ? no(n) : n
                })
                return n.unshift(e), Ri(n)
            }
        }
        return Ko.throwArgumentError(`unknown type: ${t}`, "type", t)
    }
    encodeType(t) {
        const e = this._types[t]
        return e || Ko.throwArgumentError(`unknown type: ${JSON.stringify(t)}`, "name", t), e
    }
    encodeData(t, e) {
        return this.getEncoder(t)(e)
    }
    hashStruct(t, e) {
        return no(this.encodeData(t, e))
    }
    encode(t) {
        return this.encodeData(this.primaryType, t)
    }
    hash(t) {
        return this.hashStruct(this.primaryType, t)
    }
    _visit(t, e, r) {
        if (ss(t)) return r(t, e)
        const n = t.match(/^(.*)(\x5b(\d*)\x5d)$/)
        if (n) {
            const t = n[1],
                i = parseInt(n[3])
            return (
                i >= 0 && e.length !== i && Ko.throwArgumentError("array length mismatch; expected length ${ arrayLength }", "value", e),
                e.map((e) => this._visit(t, e, r))
            )
        }
        const i = this.types[t]
        return i
            ? i.reduce((t, { name: n, type: i }) => ((t[n] = this._visit(i, e[n], r)), t), {})
            : Ko.throwArgumentError(`unknown type: ${t}`, "type", t)
    }
    visit(t, e) {
        return this._visit(this.primaryType, t, e)
    }
    static from(t) {
        return new ls(t)
    }
    static getPrimaryType(t) {
        return ls.from(t).primaryType
    }
    static hashStruct(t, e, r) {
        return ls.from(e).hashStruct(t, r)
    }
    static hashDomain(t) {
        const e = []
        for (const r in t) {
            const n = rs[r]
            n || Ko.throwArgumentError(`invalid typed-data domain key: ${JSON.stringify(r)}`, "domain", t), e.push({ name: r, type: n })
        }
        return e.sort((t, e) => ns.indexOf(t.name) - ns.indexOf(e.name)), ls.hashStruct("EIP712Domain", { EIP712Domain: e }, t)
    }
    static encode(t, e, r) {
        return Ri(["0x1901", ls.hashDomain(t), ls.from(e).hash(r)])
    }
    static hash(t, e, r) {
        return no(ls.encode(t, e, r))
    }
    static resolveNames(t, e, r, n) {
        return Wo(this, void 0, void 0, function* () {
            t = Ji(t)
            const i = {}
            t.verifyingContract && !Ni(t.verifyingContract, 20) && (i[t.verifyingContract] = "0x")
            const o = ls.from(e)
            o.visit(r, (t, e) => ("address" !== t || Ni(e, 20) || (i[e] = "0x"), e))
            for (const t in i) i[t] = yield n(t)
            return (
                t.verifyingContract && i[t.verifyingContract] && (t.verifyingContract = i[t.verifyingContract]),
                (r = o.visit(r, (t, e) => ("address" === t && i[e] ? i[e] : e))),
                { domain: t, value: r }
            )
        })
    }
    static getPayload(t, e, r) {
        ls.hashDomain(t)
        const n = {},
            i = []
        ns.forEach((e) => {
            const r = t[e]
            null != r && ((n[e] = os[e](r)), i.push({ name: e, type: rs[e] }))
        })
        const o = ls.from(e),
            s = Ji(e)
        return (
            s.EIP712Domain ? Ko.throwArgumentError("types must not contain EIP712Domain type", "types.EIP712Domain", e) : (s.EIP712Domain = i),
            o.encode(r),
            {
                types: s,
                domain: n,
                primaryType: o.primaryType,
                message: o.visit(r, (t, e) => {
                    if (t.match(/^bytes(\d*)/)) return Pi(Mi(e))
                    if (t.match(/^u?int/)) return qi.from(e).toString()
                    switch (t) {
                        case "address":
                            return e.toLowerCase()
                        case "bool":
                            return !!e
                        case "string":
                            return "string" != typeof e && Ko.throwArgumentError("invalid string", "value", e), e
                    }
                    return Ko.throwArgumentError("unsupported type", "type", t)
                }),
            }
        )
    }
}
var us = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const hs = new yi("abstract-provider/5.4.0")
class cs {
    constructor() {
        hs.checkAbstract(new.target, cs), Vi(this, "_isProvider", !0)
    }
    getFeeData() {
        return us(this, void 0, void 0, function* () {
            const { block: t, gasPrice: e } = yield Ki({ block: this.getBlock("latest"), gasPrice: this.getGasPrice().catch((t) => null) })
            let r = null,
                n = null
            return (
                t && t.baseFeePerGas && ((n = qi.from("1000000000")), (r = t.baseFeePerGas.mul(2).add(n))),
                { maxFeePerGas: r, maxPriorityFeePerGas: n, gasPrice: e }
            )
        })
    }
    addListener(t, e) {
        return this.on(t, e)
    }
    removeListener(t, e) {
        return this.off(t, e)
    }
    static isProvider(t) {
        return !(!t || !t._isProvider)
    }
}
var fs = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const ds = new yi("abstract-signer/5.4.0"),
    ps = [
        "accessList",
        "chainId",
        "data",
        "from",
        "gasLimit",
        "gasPrice",
        "maxFeePerGas",
        "maxPriorityFeePerGas",
        "nonce",
        "to",
        "type",
        "value",
    ],
    ms = [yi.errors.INSUFFICIENT_FUNDS, yi.errors.NONCE_EXPIRED, yi.errors.REPLACEMENT_UNDERPRICED]
class gs {
    constructor() {
        ds.checkAbstract(new.target, gs), Vi(this, "_isSigner", !0)
    }
    getBalance(t) {
        return fs(this, void 0, void 0, function* () {
            return this._checkProvider("getBalance"), yield this.provider.getBalance(this.getAddress(), t)
        })
    }
    getTransactionCount(t) {
        return fs(this, void 0, void 0, function* () {
            return this._checkProvider("getTransactionCount"), yield this.provider.getTransactionCount(this.getAddress(), t)
        })
    }
    estimateGas(t) {
        return fs(this, void 0, void 0, function* () {
            this._checkProvider("estimateGas")
            const e = yield Ki(this.checkTransaction(t))
            return yield this.provider.estimateGas(e)
        })
    }
    call(t, e) {
        return fs(this, void 0, void 0, function* () {
            this._checkProvider("call")
            const r = yield Ki(this.checkTransaction(t))
            return yield this.provider.call(r, e)
        })
    }
    sendTransaction(t) {
        return (
            this._checkProvider("sendTransaction"),
            this.populateTransaction(t).then((t) => this.signTransaction(t).then((t) => this.provider.sendTransaction(t)))
        )
    }
    getChainId() {
        return fs(this, void 0, void 0, function* () {
            this._checkProvider("getChainId")
            return (yield this.provider.getNetwork()).chainId
        })
    }
    getGasPrice() {
        return fs(this, void 0, void 0, function* () {
            return this._checkProvider("getGasPrice"), yield this.provider.getGasPrice()
        })
    }
    getFeeData() {
        return fs(this, void 0, void 0, function* () {
            return this._checkProvider("getFeeData"), yield this.provider.getFeeData()
        })
    }
    resolveName(t) {
        return fs(this, void 0, void 0, function* () {
            return this._checkProvider("resolveName"), yield this.provider.resolveName(t)
        })
    }
    checkTransaction(t) {
        for (const r in t) -1 === ps.indexOf(r) && ds.throwArgumentError("invalid transaction key: " + r, "transaction", t)
        const e = Ji(t)
        return (
            null == e.from
                ? (e.from = this.getAddress())
                : (e.from = Promise.all([Promise.resolve(e.from), this.getAddress()]).then(
                      (e) => (
                          e[0].toLowerCase() !== e[1].toLowerCase() && ds.throwArgumentError("from address mismatch", "transaction", t), e[0]
                      )
                  )),
            e
        )
    }
    populateTransaction(t) {
        return fs(this, void 0, void 0, function* () {
            const e = yield Ki(this.checkTransaction(t))
            null != e.to &&
                (e.to = Promise.resolve(e.to).then((t) =>
                    fs(this, void 0, void 0, function* () {
                        if (null == t) return null
                        const e = yield this.resolveName(t)
                        return null == e && ds.throwArgumentError("provided ENS name resolves to null", "tx.to", t), e
                    })
                ))
            const r = null != e.maxFeePerGas || null != e.maxPriorityFeePerGas
            if (
                (null == e.gasPrice || (2 !== e.type && !r)
                    ? (0 !== e.type && 1 !== e.type) ||
                      !r ||
                      ds.throwArgumentError("pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas", "transaction", t)
                    : ds.throwArgumentError("eip-1559 transaction do not support gasPrice", "transaction", t),
                (2 !== e.type && null != e.type) || null == e.maxFeePerGas || null == e.maxPriorityFeePerGas)
            )
                if (0 === e.type || 1 === e.type) null == e.gasPrice && (e.gasPrice = this.getGasPrice())
                else {
                    const t = yield this.getFeeData()
                    if (null == e.type)
                        if (null != t.maxFeePerGas && null != t.maxPriorityFeePerGas)
                            if (((e.type = 2), null != e.gasPrice)) {
                                const t = e.gasPrice
                                delete e.gasPrice, (e.maxFeePerGas = t), (e.maxPriorityFeePerGas = t)
                            } else
                                null == e.maxFeePerGas && (e.maxFeePerGas = t.maxFeePerGas),
                                    null == e.maxPriorityFeePerGas && (e.maxPriorityFeePerGas = t.maxPriorityFeePerGas)
                        else
                            null != t.gasPrice
                                ? (r &&
                                      ds.throwError("network does not support EIP-1559", yi.errors.UNSUPPORTED_OPERATION, {
                                          operation: "populateTransaction",
                                      }),
                                  null == e.gasPrice && (e.gasPrice = t.gasPrice),
                                  (e.type = 0))
                                : ds.throwError("failed to get consistent fee data", yi.errors.UNSUPPORTED_OPERATION, {
                                      operation: "signer.getFeeData",
                                  })
                    else
                        2 === e.type &&
                            (null == e.maxFeePerGas && (e.maxFeePerGas = t.maxFeePerGas),
                            null == e.maxPriorityFeePerGas && (e.maxPriorityFeePerGas = t.maxPriorityFeePerGas))
                }
            else e.type = 2
            return (
                null == e.nonce && (e.nonce = this.getTransactionCount("pending")),
                null == e.gasLimit &&
                    (e.gasLimit = this.estimateGas(e).catch((t) => {
                        if (ms.indexOf(t.code) >= 0) throw t
                        return ds.throwError(
                            "cannot estimate gas; transaction may fail or may require manual gas limit",
                            yi.errors.UNPREDICTABLE_GAS_LIMIT,
                            { error: t, tx: e }
                        )
                    })),
                null == e.chainId
                    ? (e.chainId = this.getChainId())
                    : (e.chainId = Promise.all([Promise.resolve(e.chainId), this.getChainId()]).then(
                          (e) => (0 !== e[1] && e[0] !== e[1] && ds.throwArgumentError("chainId address mismatch", "transaction", t), e[0])
                      )),
                yield Ki(e)
            )
        })
    }
    _checkProvider(t) {
        this.provider || ds.throwError("missing provider", yi.errors.UNSUPPORTED_OPERATION, { operation: t || "_checkProvider" })
    }
    static isSigner(t) {
        return !(!t || !t._isSigner)
    }
}
var vs = {},
    ys = {},
    bs = ws
function ws(t, e) {
    if (!t) throw new Error(e || "Assertion failed")
}
ws.equal = function (t, e, r) {
    if (t != e) throw new Error(r || "Assertion failed: " + t + " != " + e)
}
var _s = { exports: {} }
"function" == typeof Object.create
    ? (_s.exports = function (t, e) {
          e &&
              ((t.super_ = e),
              (t.prototype = Object.create(e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })))
      })
    : (_s.exports = function (t, e) {
          if (e) {
              t.super_ = e
              var r = function () {}
              ;(r.prototype = e.prototype), (t.prototype = new r()), (t.prototype.constructor = t)
          }
      })
var Es = bs,
    ks = _s.exports
function Ms(t, e) {
    return 55296 == (64512 & t.charCodeAt(e)) && !(e < 0 || e + 1 >= t.length) && 56320 == (64512 & t.charCodeAt(e + 1))
}
function xs(t) {
    return ((t >>> 24) | ((t >>> 8) & 65280) | ((t << 8) & 16711680) | ((255 & t) << 24)) >>> 0
}
function As(t) {
    return 1 === t.length ? "0" + t : t
}
function Ns(t) {
    return 7 === t.length
        ? "0" + t
        : 6 === t.length
        ? "00" + t
        : 5 === t.length
        ? "000" + t
        : 4 === t.length
        ? "0000" + t
        : 3 === t.length
        ? "00000" + t
        : 2 === t.length
        ? "000000" + t
        : 1 === t.length
        ? "0000000" + t
        : t
}
;(ys.inherits = ks),
    (ys.toArray = function (t, e) {
        if (Array.isArray(t)) return t.slice()
        if (!t) return []
        var r = []
        if ("string" == typeof t)
            if (e) {
                if ("hex" === e)
                    for ((t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (t = "0" + t), i = 0; i < t.length; i += 2)
                        r.push(parseInt(t[i] + t[i + 1], 16))
            } else
                for (var n = 0, i = 0; i < t.length; i++) {
                    var o = t.charCodeAt(i)
                    o < 128
                        ? (r[n++] = o)
                        : o < 2048
                        ? ((r[n++] = (o >> 6) | 192), (r[n++] = (63 & o) | 128))
                        : Ms(t, i)
                        ? ((o = 65536 + ((1023 & o) << 10) + (1023 & t.charCodeAt(++i))),
                          (r[n++] = (o >> 18) | 240),
                          (r[n++] = ((o >> 12) & 63) | 128),
                          (r[n++] = ((o >> 6) & 63) | 128),
                          (r[n++] = (63 & o) | 128))
                        : ((r[n++] = (o >> 12) | 224), (r[n++] = ((o >> 6) & 63) | 128), (r[n++] = (63 & o) | 128))
                }
        else for (i = 0; i < t.length; i++) r[i] = 0 | t[i]
        return r
    }),
    (ys.toHex = function (t) {
        for (var e = "", r = 0; r < t.length; r++) e += As(t[r].toString(16))
        return e
    }),
    (ys.htonl = xs),
    (ys.toHex32 = function (t, e) {
        for (var r = "", n = 0; n < t.length; n++) {
            var i = t[n]
            "little" === e && (i = xs(i)), (r += Ns(i.toString(16)))
        }
        return r
    }),
    (ys.zero2 = As),
    (ys.zero8 = Ns),
    (ys.join32 = function (t, e, r, n) {
        var i = r - e
        Es(i % 4 == 0)
        for (var o = new Array(i / 4), s = 0, a = e; s < o.length; s++, a += 4) {
            var l
            ;(l =
                "big" === n
                    ? (t[a] << 24) | (t[a + 1] << 16) | (t[a + 2] << 8) | t[a + 3]
                    : (t[a + 3] << 24) | (t[a + 2] << 16) | (t[a + 1] << 8) | t[a]),
                (o[s] = l >>> 0)
        }
        return o
    }),
    (ys.split32 = function (t, e) {
        for (var r = new Array(4 * t.length), n = 0, i = 0; n < t.length; n++, i += 4) {
            var o = t[n]
            "big" === e
                ? ((r[i] = o >>> 24), (r[i + 1] = (o >>> 16) & 255), (r[i + 2] = (o >>> 8) & 255), (r[i + 3] = 255 & o))
                : ((r[i + 3] = o >>> 24), (r[i + 2] = (o >>> 16) & 255), (r[i + 1] = (o >>> 8) & 255), (r[i] = 255 & o))
        }
        return r
    }),
    (ys.rotr32 = function (t, e) {
        return (t >>> e) | (t << (32 - e))
    }),
    (ys.rotl32 = function (t, e) {
        return (t << e) | (t >>> (32 - e))
    }),
    (ys.sum32 = function (t, e) {
        return (t + e) >>> 0
    }),
    (ys.sum32_3 = function (t, e, r) {
        return (t + e + r) >>> 0
    }),
    (ys.sum32_4 = function (t, e, r, n) {
        return (t + e + r + n) >>> 0
    }),
    (ys.sum32_5 = function (t, e, r, n, i) {
        return (t + e + r + n + i) >>> 0
    }),
    (ys.sum64 = function (t, e, r, n) {
        var i = t[e],
            o = (n + t[e + 1]) >>> 0,
            s = (o < n ? 1 : 0) + r + i
        ;(t[e] = s >>> 0), (t[e + 1] = o)
    }),
    (ys.sum64_hi = function (t, e, r, n) {
        return (((e + n) >>> 0 < e ? 1 : 0) + t + r) >>> 0
    }),
    (ys.sum64_lo = function (t, e, r, n) {
        return (e + n) >>> 0
    }),
    (ys.sum64_4_hi = function (t, e, r, n, i, o, s, a) {
        var l = 0,
            u = e
        return (
            (l += (u = (u + n) >>> 0) < e ? 1 : 0),
            (l += (u = (u + o) >>> 0) < o ? 1 : 0),
            (t + r + i + s + (l += (u = (u + a) >>> 0) < a ? 1 : 0)) >>> 0
        )
    }),
    (ys.sum64_4_lo = function (t, e, r, n, i, o, s, a) {
        return (e + n + o + a) >>> 0
    }),
    (ys.sum64_5_hi = function (t, e, r, n, i, o, s, a, l, u) {
        var h = 0,
            c = e
        return (
            (h += (c = (c + n) >>> 0) < e ? 1 : 0),
            (h += (c = (c + o) >>> 0) < o ? 1 : 0),
            (h += (c = (c + a) >>> 0) < a ? 1 : 0),
            (t + r + i + s + l + (h += (c = (c + u) >>> 0) < u ? 1 : 0)) >>> 0
        )
    }),
    (ys.sum64_5_lo = function (t, e, r, n, i, o, s, a, l, u) {
        return (e + n + o + a + u) >>> 0
    }),
    (ys.rotr64_hi = function (t, e, r) {
        return ((e << (32 - r)) | (t >>> r)) >>> 0
    }),
    (ys.rotr64_lo = function (t, e, r) {
        return ((t << (32 - r)) | (e >>> r)) >>> 0
    }),
    (ys.shr64_hi = function (t, e, r) {
        return t >>> r
    }),
    (ys.shr64_lo = function (t, e, r) {
        return ((t << (32 - r)) | (e >>> r)) >>> 0
    })
var Ps = {},
    Ss = ys,
    Is = bs
function Rs() {
    ;(this.pending = null),
        (this.pendingTotal = 0),
        (this.blockSize = this.constructor.blockSize),
        (this.outSize = this.constructor.outSize),
        (this.hmacStrength = this.constructor.hmacStrength),
        (this.padLength = this.constructor.padLength / 8),
        (this.endian = "big"),
        (this._delta8 = this.blockSize / 8),
        (this._delta32 = this.blockSize / 32)
}
;(Ps.BlockHash = Rs),
    (Rs.prototype.update = function (t, e) {
        if (
            ((t = Ss.toArray(t, e)),
            this.pending ? (this.pending = this.pending.concat(t)) : (this.pending = t),
            (this.pendingTotal += t.length),
            this.pending.length >= this._delta8)
        ) {
            var r = (t = this.pending).length % this._delta8
            ;(this.pending = t.slice(t.length - r, t.length)),
                0 === this.pending.length && (this.pending = null),
                (t = Ss.join32(t, 0, t.length - r, this.endian))
            for (var n = 0; n < t.length; n += this._delta32) this._update(t, n, n + this._delta32)
        }
        return this
    }),
    (Rs.prototype.digest = function (t) {
        return this.update(this._pad()), Is(null === this.pending), this._digest(t)
    }),
    (Rs.prototype._pad = function () {
        var t = this.pendingTotal,
            e = this._delta8,
            r = e - ((t + this.padLength) % e),
            n = new Array(r + this.padLength)
        n[0] = 128
        for (var i = 1; i < r; i++) n[i] = 0
        if (((t <<= 3), "big" === this.endian)) {
            for (var o = 8; o < this.padLength; o++) n[i++] = 0
            ;(n[i++] = 0),
                (n[i++] = 0),
                (n[i++] = 0),
                (n[i++] = 0),
                (n[i++] = (t >>> 24) & 255),
                (n[i++] = (t >>> 16) & 255),
                (n[i++] = (t >>> 8) & 255),
                (n[i++] = 255 & t)
        } else
            for (
                n[i++] = 255 & t,
                    n[i++] = (t >>> 8) & 255,
                    n[i++] = (t >>> 16) & 255,
                    n[i++] = (t >>> 24) & 255,
                    n[i++] = 0,
                    n[i++] = 0,
                    n[i++] = 0,
                    n[i++] = 0,
                    o = 8;
                o < this.padLength;
                o++
            )
                n[i++] = 0
        return n
    })
var Ts = {},
    Os = {},
    Cs = ys.rotr32
function Bs(t, e, r) {
    return (t & e) ^ (~t & r)
}
function Fs(t, e, r) {
    return (t & e) ^ (t & r) ^ (e & r)
}
function Ls(t, e, r) {
    return t ^ e ^ r
}
;(Os.ft_1 = function (t, e, r, n) {
    return 0 === t ? Bs(e, r, n) : 1 === t || 3 === t ? Ls(e, r, n) : 2 === t ? Fs(e, r, n) : void 0
}),
    (Os.ch32 = Bs),
    (Os.maj32 = Fs),
    (Os.p32 = Ls),
    (Os.s0_256 = function (t) {
        return Cs(t, 2) ^ Cs(t, 13) ^ Cs(t, 22)
    }),
    (Os.s1_256 = function (t) {
        return Cs(t, 6) ^ Cs(t, 11) ^ Cs(t, 25)
    }),
    (Os.g0_256 = function (t) {
        return Cs(t, 7) ^ Cs(t, 18) ^ (t >>> 3)
    }),
    (Os.g1_256 = function (t) {
        return Cs(t, 17) ^ Cs(t, 19) ^ (t >>> 10)
    })
var Us = ys,
    qs = Ps,
    js = Os,
    Ds = Us.rotl32,
    zs = Us.sum32,
    Gs = Us.sum32_5,
    $s = js.ft_1,
    Hs = qs.BlockHash,
    Vs = [1518500249, 1859775393, 2400959708, 3395469782]
function Ws() {
    if (!(this instanceof Ws)) return new Ws()
    Hs.call(this), (this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]), (this.W = new Array(80))
}
Us.inherits(Ws, Hs)
var Ks = Ws
;(Ws.blockSize = 512),
    (Ws.outSize = 160),
    (Ws.hmacStrength = 80),
    (Ws.padLength = 64),
    (Ws.prototype._update = function (t, e) {
        for (var r = this.W, n = 0; n < 16; n++) r[n] = t[e + n]
        for (; n < r.length; n++) r[n] = Ds(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1)
        var i = this.h[0],
            o = this.h[1],
            s = this.h[2],
            a = this.h[3],
            l = this.h[4]
        for (n = 0; n < r.length; n++) {
            var u = ~~(n / 20),
                h = Gs(Ds(i, 5), $s(u, o, s, a), l, r[n], Vs[u])
            ;(l = a), (a = s), (s = Ds(o, 30)), (o = i), (i = h)
        }
        ;(this.h[0] = zs(this.h[0], i)),
            (this.h[1] = zs(this.h[1], o)),
            (this.h[2] = zs(this.h[2], s)),
            (this.h[3] = zs(this.h[3], a)),
            (this.h[4] = zs(this.h[4], l))
    }),
    (Ws.prototype._digest = function (t) {
        return "hex" === t ? Us.toHex32(this.h, "big") : Us.split32(this.h, "big")
    })
var Js = ys,
    Xs = Ps,
    Zs = Os,
    Qs = bs,
    Ys = Js.sum32,
    ta = Js.sum32_4,
    ea = Js.sum32_5,
    ra = Zs.ch32,
    na = Zs.maj32,
    ia = Zs.s0_256,
    oa = Zs.s1_256,
    sa = Zs.g0_256,
    aa = Zs.g1_256,
    la = Xs.BlockHash,
    ua = [
        1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278,
        1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122,
        1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205,
        773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771,
        3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
        1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
    ]
function ha() {
    if (!(this instanceof ha)) return new ha()
    la.call(this),
        (this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
        (this.k = ua),
        (this.W = new Array(64))
}
Js.inherits(ha, la)
var ca = ha
;(ha.blockSize = 512),
    (ha.outSize = 256),
    (ha.hmacStrength = 192),
    (ha.padLength = 64),
    (ha.prototype._update = function (t, e) {
        for (var r = this.W, n = 0; n < 16; n++) r[n] = t[e + n]
        for (; n < r.length; n++) r[n] = ta(aa(r[n - 2]), r[n - 7], sa(r[n - 15]), r[n - 16])
        var i = this.h[0],
            o = this.h[1],
            s = this.h[2],
            a = this.h[3],
            l = this.h[4],
            u = this.h[5],
            h = this.h[6],
            c = this.h[7]
        for (Qs(this.k.length === r.length), n = 0; n < r.length; n++) {
            var f = ea(c, oa(l), ra(l, u, h), this.k[n], r[n]),
                d = Ys(ia(i), na(i, o, s))
            ;(c = h), (h = u), (u = l), (l = Ys(a, f)), (a = s), (s = o), (o = i), (i = Ys(f, d))
        }
        ;(this.h[0] = Ys(this.h[0], i)),
            (this.h[1] = Ys(this.h[1], o)),
            (this.h[2] = Ys(this.h[2], s)),
            (this.h[3] = Ys(this.h[3], a)),
            (this.h[4] = Ys(this.h[4], l)),
            (this.h[5] = Ys(this.h[5], u)),
            (this.h[6] = Ys(this.h[6], h)),
            (this.h[7] = Ys(this.h[7], c))
    }),
    (ha.prototype._digest = function (t) {
        return "hex" === t ? Js.toHex32(this.h, "big") : Js.split32(this.h, "big")
    })
var fa = ys,
    da = ca
function pa() {
    if (!(this instanceof pa)) return new pa()
    da.call(this), (this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
}
fa.inherits(pa, da)
var ma = pa
;(pa.blockSize = 512),
    (pa.outSize = 224),
    (pa.hmacStrength = 192),
    (pa.padLength = 64),
    (pa.prototype._digest = function (t) {
        return "hex" === t ? fa.toHex32(this.h.slice(0, 7), "big") : fa.split32(this.h.slice(0, 7), "big")
    })
var ga = ys,
    va = Ps,
    ya = bs,
    ba = ga.rotr64_hi,
    wa = ga.rotr64_lo,
    _a = ga.shr64_hi,
    Ea = ga.shr64_lo,
    ka = ga.sum64,
    Ma = ga.sum64_hi,
    xa = ga.sum64_lo,
    Aa = ga.sum64_4_hi,
    Na = ga.sum64_4_lo,
    Pa = ga.sum64_5_hi,
    Sa = ga.sum64_5_lo,
    Ia = va.BlockHash,
    Ra = [
        1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993,
        3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764,
        1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401,
        2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235,
        1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671,
        3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964,
        773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350,
        1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008,
        3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616,
        1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995,
        1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474,
        593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711,
        3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269,
        320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158,
        1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591,
    ]
function Ta() {
    if (!(this instanceof Ta)) return new Ta()
    Ia.call(this),
        (this.h = [
            1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924,
            725511199, 528734635, 4215389547, 1541459225, 327033209,
        ]),
        (this.k = Ra),
        (this.W = new Array(160))
}
ga.inherits(Ta, Ia)
var Oa = Ta
function Ca(t, e, r, n, i) {
    var o = (t & r) ^ (~t & i)
    return o < 0 && (o += 4294967296), o
}
function Ba(t, e, r, n, i, o) {
    var s = (e & n) ^ (~e & o)
    return s < 0 && (s += 4294967296), s
}
function Fa(t, e, r, n, i) {
    var o = (t & r) ^ (t & i) ^ (r & i)
    return o < 0 && (o += 4294967296), o
}
function La(t, e, r, n, i, o) {
    var s = (e & n) ^ (e & o) ^ (n & o)
    return s < 0 && (s += 4294967296), s
}
function Ua(t, e) {
    var r = ba(t, e, 28) ^ ba(e, t, 2) ^ ba(e, t, 7)
    return r < 0 && (r += 4294967296), r
}
function qa(t, e) {
    var r = wa(t, e, 28) ^ wa(e, t, 2) ^ wa(e, t, 7)
    return r < 0 && (r += 4294967296), r
}
function ja(t, e) {
    var r = ba(t, e, 14) ^ ba(t, e, 18) ^ ba(e, t, 9)
    return r < 0 && (r += 4294967296), r
}
function Da(t, e) {
    var r = wa(t, e, 14) ^ wa(t, e, 18) ^ wa(e, t, 9)
    return r < 0 && (r += 4294967296), r
}
function za(t, e) {
    var r = ba(t, e, 1) ^ ba(t, e, 8) ^ _a(t, e, 7)
    return r < 0 && (r += 4294967296), r
}
function Ga(t, e) {
    var r = wa(t, e, 1) ^ wa(t, e, 8) ^ Ea(t, e, 7)
    return r < 0 && (r += 4294967296), r
}
function $a(t, e) {
    var r = ba(t, e, 19) ^ ba(e, t, 29) ^ _a(t, e, 6)
    return r < 0 && (r += 4294967296), r
}
function Ha(t, e) {
    var r = wa(t, e, 19) ^ wa(e, t, 29) ^ Ea(t, e, 6)
    return r < 0 && (r += 4294967296), r
}
;(Ta.blockSize = 1024),
    (Ta.outSize = 512),
    (Ta.hmacStrength = 192),
    (Ta.padLength = 128),
    (Ta.prototype._prepareBlock = function (t, e) {
        for (var r = this.W, n = 0; n < 32; n++) r[n] = t[e + n]
        for (; n < r.length; n += 2) {
            var i = $a(r[n - 4], r[n - 3]),
                o = Ha(r[n - 4], r[n - 3]),
                s = r[n - 14],
                a = r[n - 13],
                l = za(r[n - 30], r[n - 29]),
                u = Ga(r[n - 30], r[n - 29]),
                h = r[n - 32],
                c = r[n - 31]
            ;(r[n] = Aa(i, o, s, a, l, u, h, c)), (r[n + 1] = Na(i, o, s, a, l, u, h, c))
        }
    }),
    (Ta.prototype._update = function (t, e) {
        this._prepareBlock(t, e)
        var r = this.W,
            n = this.h[0],
            i = this.h[1],
            o = this.h[2],
            s = this.h[3],
            a = this.h[4],
            l = this.h[5],
            u = this.h[6],
            h = this.h[7],
            c = this.h[8],
            f = this.h[9],
            d = this.h[10],
            p = this.h[11],
            m = this.h[12],
            g = this.h[13],
            v = this.h[14],
            y = this.h[15]
        ya(this.k.length === r.length)
        for (var b = 0; b < r.length; b += 2) {
            var w = v,
                _ = y,
                E = ja(c, f),
                k = Da(c, f),
                M = Ca(c, f, d, p, m),
                x = Ba(c, f, d, p, m, g),
                A = this.k[b],
                N = this.k[b + 1],
                P = r[b],
                S = r[b + 1],
                I = Pa(w, _, E, k, M, x, A, N, P, S),
                R = Sa(w, _, E, k, M, x, A, N, P, S)
            ;(w = Ua(n, i)), (_ = qa(n, i)), (E = Fa(n, i, o, s, a)), (k = La(n, i, o, s, a, l))
            var T = Ma(w, _, E, k),
                O = xa(w, _, E, k)
            ;(v = m),
                (y = g),
                (m = d),
                (g = p),
                (d = c),
                (p = f),
                (c = Ma(u, h, I, R)),
                (f = xa(h, h, I, R)),
                (u = a),
                (h = l),
                (a = o),
                (l = s),
                (o = n),
                (s = i),
                (n = Ma(I, R, T, O)),
                (i = xa(I, R, T, O))
        }
        ka(this.h, 0, n, i),
            ka(this.h, 2, o, s),
            ka(this.h, 4, a, l),
            ka(this.h, 6, u, h),
            ka(this.h, 8, c, f),
            ka(this.h, 10, d, p),
            ka(this.h, 12, m, g),
            ka(this.h, 14, v, y)
    }),
    (Ta.prototype._digest = function (t) {
        return "hex" === t ? ga.toHex32(this.h, "big") : ga.split32(this.h, "big")
    })
var Va = ys,
    Wa = Oa
function Ka() {
    if (!(this instanceof Ka)) return new Ka()
    Wa.call(this),
        (this.h = [
            3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231,
            1750603025, 3675008525, 1694076839, 1203062813, 3204075428,
        ])
}
Va.inherits(Ka, Wa)
var Ja = Ka
;(Ka.blockSize = 1024),
    (Ka.outSize = 384),
    (Ka.hmacStrength = 192),
    (Ka.padLength = 128),
    (Ka.prototype._digest = function (t) {
        return "hex" === t ? Va.toHex32(this.h.slice(0, 12), "big") : Va.split32(this.h.slice(0, 12), "big")
    }),
    (Ts.sha1 = Ks),
    (Ts.sha224 = ma),
    (Ts.sha256 = ca),
    (Ts.sha384 = Ja),
    (Ts.sha512 = Oa)
var Xa = {},
    Za = ys,
    Qa = Ps,
    Ya = Za.rotl32,
    tl = Za.sum32,
    el = Za.sum32_3,
    rl = Za.sum32_4,
    nl = Qa.BlockHash
function il() {
    if (!(this instanceof il)) return new il()
    nl.call(this), (this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]), (this.endian = "little")
}
function ol(t, e, r, n) {
    return t <= 15 ? e ^ r ^ n : t <= 31 ? (e & r) | (~e & n) : t <= 47 ? (e | ~r) ^ n : t <= 63 ? (e & n) | (r & ~n) : e ^ (r | ~n)
}
function sl(t) {
    return t <= 15 ? 0 : t <= 31 ? 1518500249 : t <= 47 ? 1859775393 : t <= 63 ? 2400959708 : 2840853838
}
function al(t) {
    return t <= 15 ? 1352829926 : t <= 31 ? 1548603684 : t <= 47 ? 1836072691 : t <= 63 ? 2053994217 : 0
}
Za.inherits(il, nl),
    (Xa.ripemd160 = il),
    (il.blockSize = 512),
    (il.outSize = 160),
    (il.hmacStrength = 192),
    (il.padLength = 64),
    (il.prototype._update = function (t, e) {
        for (
            var r = this.h[0], n = this.h[1], i = this.h[2], o = this.h[3], s = this.h[4], a = r, l = n, u = i, h = o, c = s, f = 0;
            f < 80;
            f++
        ) {
            var d = tl(Ya(rl(r, ol(f, n, i, o), t[ll[f] + e], sl(f)), hl[f]), s)
            ;(r = s),
                (s = o),
                (o = Ya(i, 10)),
                (i = n),
                (n = d),
                (d = tl(Ya(rl(a, ol(79 - f, l, u, h), t[ul[f] + e], al(f)), cl[f]), c)),
                (a = c),
                (c = h),
                (h = Ya(u, 10)),
                (u = l),
                (l = d)
        }
        ;(d = el(this.h[1], i, h)),
            (this.h[1] = el(this.h[2], o, c)),
            (this.h[2] = el(this.h[3], s, a)),
            (this.h[3] = el(this.h[4], r, l)),
            (this.h[4] = el(this.h[0], n, u)),
            (this.h[0] = d)
    }),
    (il.prototype._digest = function (t) {
        return "hex" === t ? Za.toHex32(this.h, "little") : Za.split32(this.h, "little")
    })
var ll = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2,
        7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
    ],
    ul = [
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11,
        8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
    ],
    hl = [
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13,
        15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8,
        5, 6,
    ],
    cl = [
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6,
        14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13,
        11, 11,
    ],
    fl = ys,
    dl = bs
function pl(t, e, r) {
    if (!(this instanceof pl)) return new pl(t, e, r)
    ;(this.Hash = t),
        (this.blockSize = t.blockSize / 8),
        (this.outSize = t.outSize / 8),
        (this.inner = null),
        (this.outer = null),
        this._init(fl.toArray(e, r))
}
var ml,
    gl = pl
function vl(t, e, r) {
    return (
        t(
            (r = {
                path: e,
                exports: {},
                require: function (t, e) {
                    return (function () {
                        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")
                    })(null == e && r.path)
                },
            }),
            r.exports
        ),
        r.exports
    )
}
;(pl.prototype._init = function (t) {
    t.length > this.blockSize && (t = new this.Hash().update(t).digest()), dl(t.length <= this.blockSize)
    for (var e = t.length; e < this.blockSize; e++) t.push(0)
    for (e = 0; e < t.length; e++) t[e] ^= 54
    for (this.inner = new this.Hash().update(t), e = 0; e < t.length; e++) t[e] ^= 106
    this.outer = new this.Hash().update(t)
}),
    (pl.prototype.update = function (t, e) {
        return this.inner.update(t, e), this
    }),
    (pl.prototype.digest = function (t) {
        return this.outer.update(this.inner.digest()), this.outer.digest(t)
    }),
    ((ml = vs).utils = ys),
    (ml.common = Ps),
    (ml.sha = Ts),
    (ml.ripemd = Xa),
    (ml.hmac = gl),
    (ml.sha1 = ml.sha.sha1),
    (ml.sha256 = ml.sha.sha256),
    (ml.sha224 = ml.sha.sha224),
    (ml.sha384 = ml.sha.sha384),
    (ml.sha512 = ml.sha.sha512),
    (ml.ripemd160 = ml.ripemd.ripemd160)
var yl = bl
function bl(t, e) {
    if (!t) throw new Error(e || "Assertion failed")
}
bl.equal = function (t, e, r) {
    if (t != e) throw new Error(r || "Assertion failed: " + t + " != " + e)
}
var wl = vl(function (t, e) {
        var r = e
        function n(t) {
            return 1 === t.length ? "0" + t : t
        }
        function i(t) {
            for (var e = "", r = 0; r < t.length; r++) e += n(t[r].toString(16))
            return e
        }
        ;(r.toArray = function (t, e) {
            if (Array.isArray(t)) return t.slice()
            if (!t) return []
            var r = []
            if ("string" != typeof t) {
                for (var n = 0; n < t.length; n++) r[n] = 0 | t[n]
                return r
            }
            if ("hex" === e) {
                ;(t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (t = "0" + t)
                for (n = 0; n < t.length; n += 2) r.push(parseInt(t[n] + t[n + 1], 16))
            } else
                for (n = 0; n < t.length; n++) {
                    var i = t.charCodeAt(n),
                        o = i >> 8,
                        s = 255 & i
                    o ? r.push(o, s) : r.push(s)
                }
            return r
        }),
            (r.zero2 = n),
            (r.toHex = i),
            (r.encode = function (t, e) {
                return "hex" === e ? i(t) : t
            })
    }),
    _l = vl(function (t, e) {
        var r = e
        ;(r.assert = yl),
            (r.toArray = wl.toArray),
            (r.zero2 = wl.zero2),
            (r.toHex = wl.toHex),
            (r.encode = wl.encode),
            (r.getNAF = function (t, e, r) {
                var n = new Array(Math.max(t.bitLength(), r) + 1)
                n.fill(0)
                for (var i = 1 << (e + 1), o = t.clone(), s = 0; s < n.length; s++) {
                    var a,
                        l = o.andln(i - 1)
                    o.isOdd() ? ((a = l > (i >> 1) - 1 ? (i >> 1) - l : l), o.isubn(a)) : (a = 0), (n[s] = a), o.iushrn(1)
                }
                return n
            }),
            (r.getJSF = function (t, e) {
                var r = [[], []]
                ;(t = t.clone()), (e = e.clone())
                for (var n, i = 0, o = 0; t.cmpn(-i) > 0 || e.cmpn(-o) > 0; ) {
                    var s,
                        a,
                        l = (t.andln(3) + i) & 3,
                        u = (e.andln(3) + o) & 3
                    3 === l && (l = -1),
                        3 === u && (u = -1),
                        (s = 0 == (1 & l) ? 0 : (3 !== (n = (t.andln(7) + i) & 7) && 5 !== n) || 2 !== u ? l : -l),
                        r[0].push(s),
                        (a = 0 == (1 & u) ? 0 : (3 !== (n = (e.andln(7) + o) & 7) && 5 !== n) || 2 !== l ? u : -u),
                        r[1].push(a),
                        2 * i === s + 1 && (i = 1 - i),
                        2 * o === a + 1 && (o = 1 - o),
                        t.iushrn(1),
                        e.iushrn(1)
                }
                return r
            }),
            (r.cachedProperty = function (t, e, r) {
                var n = "_" + e
                t.prototype[e] = function () {
                    return void 0 !== this[n] ? this[n] : (this[n] = r.call(this))
                }
            }),
            (r.parseBytes = function (t) {
                return "string" == typeof t ? r.toArray(t, "hex") : t
            }),
            (r.intFromLE = function (t) {
                return new ai(t, "hex", "le")
            })
    }),
    El = _l.getNAF,
    kl = _l.getJSF,
    Ml = _l.assert
function xl(t, e) {
    ;(this.type = t),
        (this.p = new ai(e.p, 16)),
        (this.red = e.prime ? ai.red(e.prime) : ai.mont(this.p)),
        (this.zero = new ai(0).toRed(this.red)),
        (this.one = new ai(1).toRed(this.red)),
        (this.two = new ai(2).toRed(this.red)),
        (this.n = e.n && new ai(e.n, 16)),
        (this.g = e.g && this.pointFromJSON(e.g, e.gRed)),
        (this._wnafT1 = new Array(4)),
        (this._wnafT2 = new Array(4)),
        (this._wnafT3 = new Array(4)),
        (this._wnafT4 = new Array(4)),
        (this._bitLength = this.n ? this.n.bitLength() : 0)
    var r = this.n && this.p.div(this.n)
    !r || r.cmpn(100) > 0 ? (this.redN = null) : ((this._maxwellTrick = !0), (this.redN = this.n.toRed(this.red)))
}
var Al = xl
function Nl(t, e) {
    ;(this.curve = t), (this.type = e), (this.precomputed = null)
}
;(xl.prototype.point = function () {
    throw new Error("Not implemented")
}),
    (xl.prototype.validate = function () {
        throw new Error("Not implemented")
    }),
    (xl.prototype._fixedNafMul = function (t, e) {
        Ml(t.precomputed)
        var r = t._getDoubles(),
            n = El(e, 1, this._bitLength),
            i = (1 << (r.step + 1)) - (r.step % 2 == 0 ? 2 : 1)
        i /= 3
        var o,
            s,
            a = []
        for (o = 0; o < n.length; o += r.step) {
            s = 0
            for (var l = o + r.step - 1; l >= o; l--) s = (s << 1) + n[l]
            a.push(s)
        }
        for (var u = this.jpoint(null, null, null), h = this.jpoint(null, null, null), c = i; c > 0; c--) {
            for (o = 0; o < a.length; o++) (s = a[o]) === c ? (h = h.mixedAdd(r.points[o])) : s === -c && (h = h.mixedAdd(r.points[o].neg()))
            u = u.add(h)
        }
        return u.toP()
    }),
    (xl.prototype._wnafMul = function (t, e) {
        var r = 4,
            n = t._getNAFPoints(r)
        r = n.wnd
        for (var i = n.points, o = El(e, r, this._bitLength), s = this.jpoint(null, null, null), a = o.length - 1; a >= 0; a--) {
            for (var l = 0; a >= 0 && 0 === o[a]; a--) l++
            if ((a >= 0 && l++, (s = s.dblp(l)), a < 0)) break
            var u = o[a]
            Ml(0 !== u),
                (s =
                    "affine" === t.type
                        ? u > 0
                            ? s.mixedAdd(i[(u - 1) >> 1])
                            : s.mixedAdd(i[(-u - 1) >> 1].neg())
                        : u > 0
                        ? s.add(i[(u - 1) >> 1])
                        : s.add(i[(-u - 1) >> 1].neg()))
        }
        return "affine" === t.type ? s.toP() : s
    }),
    (xl.prototype._wnafMulAdd = function (t, e, r, n, i) {
        var o,
            s,
            a,
            l = this._wnafT1,
            u = this._wnafT2,
            h = this._wnafT3,
            c = 0
        for (o = 0; o < n; o++) {
            var f = (a = e[o])._getNAFPoints(t)
            ;(l[o] = f.wnd), (u[o] = f.points)
        }
        for (o = n - 1; o >= 1; o -= 2) {
            var d = o - 1,
                p = o
            if (1 === l[d] && 1 === l[p]) {
                var m = [e[d], null, null, e[p]]
                0 === e[d].y.cmp(e[p].y)
                    ? ((m[1] = e[d].add(e[p])), (m[2] = e[d].toJ().mixedAdd(e[p].neg())))
                    : 0 === e[d].y.cmp(e[p].y.redNeg())
                    ? ((m[1] = e[d].toJ().mixedAdd(e[p])), (m[2] = e[d].add(e[p].neg())))
                    : ((m[1] = e[d].toJ().mixedAdd(e[p])), (m[2] = e[d].toJ().mixedAdd(e[p].neg())))
                var g = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                    v = kl(r[d], r[p])
                for (c = Math.max(v[0].length, c), h[d] = new Array(c), h[p] = new Array(c), s = 0; s < c; s++) {
                    var y = 0 | v[0][s],
                        b = 0 | v[1][s]
                    ;(h[d][s] = g[3 * (y + 1) + (b + 1)]), (h[p][s] = 0), (u[d] = m)
                }
            } else
                (h[d] = El(r[d], l[d], this._bitLength)),
                    (h[p] = El(r[p], l[p], this._bitLength)),
                    (c = Math.max(h[d].length, c)),
                    (c = Math.max(h[p].length, c))
        }
        var w = this.jpoint(null, null, null),
            _ = this._wnafT4
        for (o = c; o >= 0; o--) {
            for (var E = 0; o >= 0; ) {
                var k = !0
                for (s = 0; s < n; s++) (_[s] = 0 | h[s][o]), 0 !== _[s] && (k = !1)
                if (!k) break
                E++, o--
            }
            if ((o >= 0 && E++, (w = w.dblp(E)), o < 0)) break
            for (s = 0; s < n; s++) {
                var M = _[s]
                0 !== M &&
                    (M > 0 ? (a = u[s][(M - 1) >> 1]) : M < 0 && (a = u[s][(-M - 1) >> 1].neg()),
                    (w = "affine" === a.type ? w.mixedAdd(a) : w.add(a)))
            }
        }
        for (o = 0; o < n; o++) u[o] = null
        return i ? w : w.toP()
    }),
    (xl.BasePoint = Nl),
    (Nl.prototype.eq = function () {
        throw new Error("Not implemented")
    }),
    (Nl.prototype.validate = function () {
        return this.curve.validate(this)
    }),
    (xl.prototype.decodePoint = function (t, e) {
        t = _l.toArray(t, e)
        var r = this.p.byteLength()
        if ((4 === t[0] || 6 === t[0] || 7 === t[0]) && t.length - 1 == 2 * r)
            return (
                6 === t[0] ? Ml(t[t.length - 1] % 2 == 0) : 7 === t[0] && Ml(t[t.length - 1] % 2 == 1),
                this.point(t.slice(1, 1 + r), t.slice(1 + r, 1 + 2 * r))
            )
        if ((2 === t[0] || 3 === t[0]) && t.length - 1 === r) return this.pointFromX(t.slice(1, 1 + r), 3 === t[0])
        throw new Error("Unknown point format")
    }),
    (Nl.prototype.encodeCompressed = function (t) {
        return this.encode(t, !0)
    }),
    (Nl.prototype._encode = function (t) {
        var e = this.curve.p.byteLength(),
            r = this.getX().toArray("be", e)
        return t ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", e))
    }),
    (Nl.prototype.encode = function (t, e) {
        return _l.encode(this._encode(e), t)
    }),
    (Nl.prototype.precompute = function (t) {
        if (this.precomputed) return this
        var e = { doubles: null, naf: null, beta: null }
        return (e.naf = this._getNAFPoints(8)), (e.doubles = this._getDoubles(4, t)), (e.beta = this._getBeta()), (this.precomputed = e), this
    }),
    (Nl.prototype._hasDoubles = function (t) {
        if (!this.precomputed) return !1
        var e = this.precomputed.doubles
        return !!e && e.points.length >= Math.ceil((t.bitLength() + 1) / e.step)
    }),
    (Nl.prototype._getDoubles = function (t, e) {
        if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles
        for (var r = [this], n = this, i = 0; i < e; i += t) {
            for (var o = 0; o < t; o++) n = n.dbl()
            r.push(n)
        }
        return { step: t, points: r }
    }),
    (Nl.prototype._getNAFPoints = function (t) {
        if (this.precomputed && this.precomputed.naf) return this.precomputed.naf
        for (var e = [this], r = (1 << t) - 1, n = 1 === r ? null : this.dbl(), i = 1; i < r; i++) e[i] = e[i - 1].add(n)
        return { wnd: t, points: e }
    }),
    (Nl.prototype._getBeta = function () {
        return null
    }),
    (Nl.prototype.dblp = function (t) {
        for (var e = this, r = 0; r < t; r++) e = e.dbl()
        return e
    })
var Pl = vl(function (t) {
        "function" == typeof Object.create
            ? (t.exports = function (t, e) {
                  e &&
                      ((t.super_ = e),
                      (t.prototype = Object.create(e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } })))
              })
            : (t.exports = function (t, e) {
                  if (e) {
                      t.super_ = e
                      var r = function () {}
                      ;(r.prototype = e.prototype), (t.prototype = new r()), (t.prototype.constructor = t)
                  }
              })
    }),
    Sl = _l.assert
function Il(t) {
    Al.call(this, "short", t),
        (this.a = new ai(t.a, 16).toRed(this.red)),
        (this.b = new ai(t.b, 16).toRed(this.red)),
        (this.tinv = this.two.redInvm()),
        (this.zeroA = 0 === this.a.fromRed().cmpn(0)),
        (this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3)),
        (this.endo = this._getEndomorphism(t)),
        (this._endoWnafT1 = new Array(4)),
        (this._endoWnafT2 = new Array(4))
}
Pl(Il, Al)
var Rl = Il
function Tl(t, e, r, n) {
    Al.BasePoint.call(this, t, "affine"),
        null === e && null === r
            ? ((this.x = null), (this.y = null), (this.inf = !0))
            : ((this.x = new ai(e, 16)),
              (this.y = new ai(r, 16)),
              n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)),
              this.x.red || (this.x = this.x.toRed(this.curve.red)),
              this.y.red || (this.y = this.y.toRed(this.curve.red)),
              (this.inf = !1))
}
function Ol(t, e, r, n) {
    Al.BasePoint.call(this, t, "jacobian"),
        null === e && null === r && null === n
            ? ((this.x = this.curve.one), (this.y = this.curve.one), (this.z = new ai(0)))
            : ((this.x = new ai(e, 16)), (this.y = new ai(r, 16)), (this.z = new ai(n, 16))),
        this.x.red || (this.x = this.x.toRed(this.curve.red)),
        this.y.red || (this.y = this.y.toRed(this.curve.red)),
        this.z.red || (this.z = this.z.toRed(this.curve.red)),
        (this.zOne = this.z === this.curve.one)
}
;(Il.prototype._getEndomorphism = function (t) {
    if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
        var e, r
        if (t.beta) e = new ai(t.beta, 16).toRed(this.red)
        else {
            var n = this._getEndoRoots(this.p)
            e = (e = n[0].cmp(n[1]) < 0 ? n[0] : n[1]).toRed(this.red)
        }
        if (t.lambda) r = new ai(t.lambda, 16)
        else {
            var i = this._getEndoRoots(this.n)
            0 === this.g.mul(i[0]).x.cmp(this.g.x.redMul(e)) ? (r = i[0]) : ((r = i[1]), Sl(0 === this.g.mul(r).x.cmp(this.g.x.redMul(e))))
        }
        return {
            beta: e,
            lambda: r,
            basis: t.basis
                ? t.basis.map(function (t) {
                      return { a: new ai(t.a, 16), b: new ai(t.b, 16) }
                  })
                : this._getEndoBasis(r),
        }
    }
}),
    (Il.prototype._getEndoRoots = function (t) {
        var e = t === this.p ? this.red : ai.mont(t),
            r = new ai(2).toRed(e).redInvm(),
            n = r.redNeg(),
            i = new ai(3).toRed(e).redNeg().redSqrt().redMul(r)
        return [n.redAdd(i).fromRed(), n.redSub(i).fromRed()]
    }),
    (Il.prototype._getEndoBasis = function (t) {
        for (
            var e,
                r,
                n,
                i,
                o,
                s,
                a,
                l,
                u,
                h = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
                c = t,
                f = this.n.clone(),
                d = new ai(1),
                p = new ai(0),
                m = new ai(0),
                g = new ai(1),
                v = 0;
            0 !== c.cmpn(0);

        ) {
            var y = f.div(c)
            ;(l = f.sub(y.mul(c))), (u = m.sub(y.mul(d)))
            var b = g.sub(y.mul(p))
            if (!n && l.cmp(h) < 0) (e = a.neg()), (r = d), (n = l.neg()), (i = u)
            else if (n && 2 == ++v) break
            ;(a = l), (f = c), (c = l), (m = d), (d = u), (g = p), (p = b)
        }
        ;(o = l.neg()), (s = u)
        var w = n.sqr().add(i.sqr())
        return (
            o.sqr().add(s.sqr()).cmp(w) >= 0 && ((o = e), (s = r)),
            n.negative && ((n = n.neg()), (i = i.neg())),
            o.negative && ((o = o.neg()), (s = s.neg())),
            [
                { a: n, b: i },
                { a: o, b: s },
            ]
        )
    }),
    (Il.prototype._endoSplit = function (t) {
        var e = this.endo.basis,
            r = e[0],
            n = e[1],
            i = n.b.mul(t).divRound(this.n),
            o = r.b.neg().mul(t).divRound(this.n),
            s = i.mul(r.a),
            a = o.mul(n.a),
            l = i.mul(r.b),
            u = o.mul(n.b)
        return { k1: t.sub(s).sub(a), k2: l.add(u).neg() }
    }),
    (Il.prototype.pointFromX = function (t, e) {
        ;(t = new ai(t, 16)).red || (t = t.toRed(this.red))
        var r = t.redSqr().redMul(t).redIAdd(t.redMul(this.a)).redIAdd(this.b),
            n = r.redSqrt()
        if (0 !== n.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point")
        var i = n.fromRed().isOdd()
        return ((e && !i) || (!e && i)) && (n = n.redNeg()), this.point(t, n)
    }),
    (Il.prototype.validate = function (t) {
        if (t.inf) return !0
        var e = t.x,
            r = t.y,
            n = this.a.redMul(e),
            i = e.redSqr().redMul(e).redIAdd(n).redIAdd(this.b)
        return 0 === r.redSqr().redISub(i).cmpn(0)
    }),
    (Il.prototype._endoWnafMulAdd = function (t, e, r) {
        for (var n = this._endoWnafT1, i = this._endoWnafT2, o = 0; o < t.length; o++) {
            var s = this._endoSplit(e[o]),
                a = t[o],
                l = a._getBeta()
            s.k1.negative && (s.k1.ineg(), (a = a.neg(!0))),
                s.k2.negative && (s.k2.ineg(), (l = l.neg(!0))),
                (n[2 * o] = a),
                (n[2 * o + 1] = l),
                (i[2 * o] = s.k1),
                (i[2 * o + 1] = s.k2)
        }
        for (var u = this._wnafMulAdd(1, n, i, 2 * o, r), h = 0; h < 2 * o; h++) (n[h] = null), (i[h] = null)
        return u
    }),
    Pl(Tl, Al.BasePoint),
    (Il.prototype.point = function (t, e, r) {
        return new Tl(this, t, e, r)
    }),
    (Il.prototype.pointFromJSON = function (t, e) {
        return Tl.fromJSON(this, t, e)
    }),
    (Tl.prototype._getBeta = function () {
        if (this.curve.endo) {
            var t = this.precomputed
            if (t && t.beta) return t.beta
            var e = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y)
            if (t) {
                var r = this.curve,
                    n = function (t) {
                        return r.point(t.x.redMul(r.endo.beta), t.y)
                    }
                ;(t.beta = e),
                    (e.precomputed = {
                        beta: null,
                        naf: t.naf && { wnd: t.naf.wnd, points: t.naf.points.map(n) },
                        doubles: t.doubles && { step: t.doubles.step, points: t.doubles.points.map(n) },
                    })
            }
            return e
        }
    }),
    (Tl.prototype.toJSON = function () {
        return this.precomputed
            ? [
                  this.x,
                  this.y,
                  this.precomputed && {
                      doubles: this.precomputed.doubles && {
                          step: this.precomputed.doubles.step,
                          points: this.precomputed.doubles.points.slice(1),
                      },
                      naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) },
                  },
              ]
            : [this.x, this.y]
    }),
    (Tl.fromJSON = function (t, e, r) {
        "string" == typeof e && (e = JSON.parse(e))
        var n = t.point(e[0], e[1], r)
        if (!e[2]) return n
        function i(e) {
            return t.point(e[0], e[1], r)
        }
        var o = e[2]
        return (
            (n.precomputed = {
                beta: null,
                doubles: o.doubles && { step: o.doubles.step, points: [n].concat(o.doubles.points.map(i)) },
                naf: o.naf && { wnd: o.naf.wnd, points: [n].concat(o.naf.points.map(i)) },
            }),
            n
        )
    }),
    (Tl.prototype.inspect = function () {
        return this.isInfinity()
            ? "<EC Point Infinity>"
            : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">"
    }),
    (Tl.prototype.isInfinity = function () {
        return this.inf
    }),
    (Tl.prototype.add = function (t) {
        if (this.inf) return t
        if (t.inf) return this
        if (this.eq(t)) return this.dbl()
        if (this.neg().eq(t)) return this.curve.point(null, null)
        if (0 === this.x.cmp(t.x)) return this.curve.point(null, null)
        var e = this.y.redSub(t.y)
        0 !== e.cmpn(0) && (e = e.redMul(this.x.redSub(t.x).redInvm()))
        var r = e.redSqr().redISub(this.x).redISub(t.x),
            n = e.redMul(this.x.redSub(r)).redISub(this.y)
        return this.curve.point(r, n)
    }),
    (Tl.prototype.dbl = function () {
        if (this.inf) return this
        var t = this.y.redAdd(this.y)
        if (0 === t.cmpn(0)) return this.curve.point(null, null)
        var e = this.curve.a,
            r = this.x.redSqr(),
            n = t.redInvm(),
            i = r.redAdd(r).redIAdd(r).redIAdd(e).redMul(n),
            o = i.redSqr().redISub(this.x.redAdd(this.x)),
            s = i.redMul(this.x.redSub(o)).redISub(this.y)
        return this.curve.point(o, s)
    }),
    (Tl.prototype.getX = function () {
        return this.x.fromRed()
    }),
    (Tl.prototype.getY = function () {
        return this.y.fromRed()
    }),
    (Tl.prototype.mul = function (t) {
        return (
            (t = new ai(t, 16)),
            this.isInfinity()
                ? this
                : this._hasDoubles(t)
                ? this.curve._fixedNafMul(this, t)
                : this.curve.endo
                ? this.curve._endoWnafMulAdd([this], [t])
                : this.curve._wnafMul(this, t)
        )
    }),
    (Tl.prototype.mulAdd = function (t, e, r) {
        var n = [this, e],
            i = [t, r]
        return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2)
    }),
    (Tl.prototype.jmulAdd = function (t, e, r) {
        var n = [this, e],
            i = [t, r]
        return this.curve.endo ? this.curve._endoWnafMulAdd(n, i, !0) : this.curve._wnafMulAdd(1, n, i, 2, !0)
    }),
    (Tl.prototype.eq = function (t) {
        return this === t || (this.inf === t.inf && (this.inf || (0 === this.x.cmp(t.x) && 0 === this.y.cmp(t.y))))
    }),
    (Tl.prototype.neg = function (t) {
        if (this.inf) return this
        var e = this.curve.point(this.x, this.y.redNeg())
        if (t && this.precomputed) {
            var r = this.precomputed,
                n = function (t) {
                    return t.neg()
                }
            e.precomputed = {
                naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(n) },
                doubles: r.doubles && { step: r.doubles.step, points: r.doubles.points.map(n) },
            }
        }
        return e
    }),
    (Tl.prototype.toJ = function () {
        return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one)
    }),
    Pl(Ol, Al.BasePoint),
    (Il.prototype.jpoint = function (t, e, r) {
        return new Ol(this, t, e, r)
    }),
    (Ol.prototype.toP = function () {
        if (this.isInfinity()) return this.curve.point(null, null)
        var t = this.z.redInvm(),
            e = t.redSqr(),
            r = this.x.redMul(e),
            n = this.y.redMul(e).redMul(t)
        return this.curve.point(r, n)
    }),
    (Ol.prototype.neg = function () {
        return this.curve.jpoint(this.x, this.y.redNeg(), this.z)
    }),
    (Ol.prototype.add = function (t) {
        if (this.isInfinity()) return t
        if (t.isInfinity()) return this
        var e = t.z.redSqr(),
            r = this.z.redSqr(),
            n = this.x.redMul(e),
            i = t.x.redMul(r),
            o = this.y.redMul(e.redMul(t.z)),
            s = t.y.redMul(r.redMul(this.z)),
            a = n.redSub(i),
            l = o.redSub(s)
        if (0 === a.cmpn(0)) return 0 !== l.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl()
        var u = a.redSqr(),
            h = u.redMul(a),
            c = n.redMul(u),
            f = l.redSqr().redIAdd(h).redISub(c).redISub(c),
            d = l.redMul(c.redISub(f)).redISub(o.redMul(h)),
            p = this.z.redMul(t.z).redMul(a)
        return this.curve.jpoint(f, d, p)
    }),
    (Ol.prototype.mixedAdd = function (t) {
        if (this.isInfinity()) return t.toJ()
        if (t.isInfinity()) return this
        var e = this.z.redSqr(),
            r = this.x,
            n = t.x.redMul(e),
            i = this.y,
            o = t.y.redMul(e).redMul(this.z),
            s = r.redSub(n),
            a = i.redSub(o)
        if (0 === s.cmpn(0)) return 0 !== a.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl()
        var l = s.redSqr(),
            u = l.redMul(s),
            h = r.redMul(l),
            c = a.redSqr().redIAdd(u).redISub(h).redISub(h),
            f = a.redMul(h.redISub(c)).redISub(i.redMul(u)),
            d = this.z.redMul(s)
        return this.curve.jpoint(c, f, d)
    }),
    (Ol.prototype.dblp = function (t) {
        if (0 === t) return this
        if (this.isInfinity()) return this
        if (!t) return this.dbl()
        var e
        if (this.curve.zeroA || this.curve.threeA) {
            var r = this
            for (e = 0; e < t; e++) r = r.dbl()
            return r
        }
        var n = this.curve.a,
            i = this.curve.tinv,
            o = this.x,
            s = this.y,
            a = this.z,
            l = a.redSqr().redSqr(),
            u = s.redAdd(s)
        for (e = 0; e < t; e++) {
            var h = o.redSqr(),
                c = u.redSqr(),
                f = c.redSqr(),
                d = h.redAdd(h).redIAdd(h).redIAdd(n.redMul(l)),
                p = o.redMul(c),
                m = d.redSqr().redISub(p.redAdd(p)),
                g = p.redISub(m),
                v = d.redMul(g)
            v = v.redIAdd(v).redISub(f)
            var y = u.redMul(a)
            e + 1 < t && (l = l.redMul(f)), (o = m), (a = y), (u = v)
        }
        return this.curve.jpoint(o, u.redMul(i), a)
    }),
    (Ol.prototype.dbl = function () {
        return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl()
    }),
    (Ol.prototype._zeroDbl = function () {
        var t, e, r
        if (this.zOne) {
            var n = this.x.redSqr(),
                i = this.y.redSqr(),
                o = i.redSqr(),
                s = this.x.redAdd(i).redSqr().redISub(n).redISub(o)
            s = s.redIAdd(s)
            var a = n.redAdd(n).redIAdd(n),
                l = a.redSqr().redISub(s).redISub(s),
                u = o.redIAdd(o)
            ;(u = (u = u.redIAdd(u)).redIAdd(u)), (t = l), (e = a.redMul(s.redISub(l)).redISub(u)), (r = this.y.redAdd(this.y))
        } else {
            var h = this.x.redSqr(),
                c = this.y.redSqr(),
                f = c.redSqr(),
                d = this.x.redAdd(c).redSqr().redISub(h).redISub(f)
            d = d.redIAdd(d)
            var p = h.redAdd(h).redIAdd(h),
                m = p.redSqr(),
                g = f.redIAdd(f)
            ;(g = (g = g.redIAdd(g)).redIAdd(g)),
                (t = m.redISub(d).redISub(d)),
                (e = p.redMul(d.redISub(t)).redISub(g)),
                (r = (r = this.y.redMul(this.z)).redIAdd(r))
        }
        return this.curve.jpoint(t, e, r)
    }),
    (Ol.prototype._threeDbl = function () {
        var t, e, r
        if (this.zOne) {
            var n = this.x.redSqr(),
                i = this.y.redSqr(),
                o = i.redSqr(),
                s = this.x.redAdd(i).redSqr().redISub(n).redISub(o)
            s = s.redIAdd(s)
            var a = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a),
                l = a.redSqr().redISub(s).redISub(s)
            t = l
            var u = o.redIAdd(o)
            ;(u = (u = u.redIAdd(u)).redIAdd(u)), (e = a.redMul(s.redISub(l)).redISub(u)), (r = this.y.redAdd(this.y))
        } else {
            var h = this.z.redSqr(),
                c = this.y.redSqr(),
                f = this.x.redMul(c),
                d = this.x.redSub(h).redMul(this.x.redAdd(h))
            d = d.redAdd(d).redIAdd(d)
            var p = f.redIAdd(f),
                m = (p = p.redIAdd(p)).redAdd(p)
            ;(t = d.redSqr().redISub(m)), (r = this.y.redAdd(this.z).redSqr().redISub(c).redISub(h))
            var g = c.redSqr()
            ;(g = (g = (g = g.redIAdd(g)).redIAdd(g)).redIAdd(g)), (e = d.redMul(p.redISub(t)).redISub(g))
        }
        return this.curve.jpoint(t, e, r)
    }),
    (Ol.prototype._dbl = function () {
        var t = this.curve.a,
            e = this.x,
            r = this.y,
            n = this.z,
            i = n.redSqr().redSqr(),
            o = e.redSqr(),
            s = r.redSqr(),
            a = o.redAdd(o).redIAdd(o).redIAdd(t.redMul(i)),
            l = e.redAdd(e),
            u = (l = l.redIAdd(l)).redMul(s),
            h = a.redSqr().redISub(u.redAdd(u)),
            c = u.redISub(h),
            f = s.redSqr()
        f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f)
        var d = a.redMul(c).redISub(f),
            p = r.redAdd(r).redMul(n)
        return this.curve.jpoint(h, d, p)
    }),
    (Ol.prototype.trpl = function () {
        if (!this.curve.zeroA) return this.dbl().add(this)
        var t = this.x.redSqr(),
            e = this.y.redSqr(),
            r = this.z.redSqr(),
            n = e.redSqr(),
            i = t.redAdd(t).redIAdd(t),
            o = i.redSqr(),
            s = this.x.redAdd(e).redSqr().redISub(t).redISub(n),
            a = (s = (s = (s = s.redIAdd(s)).redAdd(s).redIAdd(s)).redISub(o)).redSqr(),
            l = n.redIAdd(n)
        l = (l = (l = l.redIAdd(l)).redIAdd(l)).redIAdd(l)
        var u = i.redIAdd(s).redSqr().redISub(o).redISub(a).redISub(l),
            h = e.redMul(u)
        h = (h = h.redIAdd(h)).redIAdd(h)
        var c = this.x.redMul(a).redISub(h)
        c = (c = c.redIAdd(c)).redIAdd(c)
        var f = this.y.redMul(u.redMul(l.redISub(u)).redISub(s.redMul(a)))
        f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f)
        var d = this.z.redAdd(s).redSqr().redISub(r).redISub(a)
        return this.curve.jpoint(c, f, d)
    }),
    (Ol.prototype.mul = function (t, e) {
        return (t = new ai(t, e)), this.curve._wnafMul(this, t)
    }),
    (Ol.prototype.eq = function (t) {
        if ("affine" === t.type) return this.eq(t.toJ())
        if (this === t) return !0
        var e = this.z.redSqr(),
            r = t.z.redSqr()
        if (0 !== this.x.redMul(r).redISub(t.x.redMul(e)).cmpn(0)) return !1
        var n = e.redMul(this.z),
            i = r.redMul(t.z)
        return 0 === this.y.redMul(i).redISub(t.y.redMul(n)).cmpn(0)
    }),
    (Ol.prototype.eqXToP = function (t) {
        var e = this.z.redSqr(),
            r = t.toRed(this.curve.red).redMul(e)
        if (0 === this.x.cmp(r)) return !0
        for (var n = t.clone(), i = this.curve.redN.redMul(e); ; ) {
            if ((n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0)) return !1
            if ((r.redIAdd(i), 0 === this.x.cmp(r))) return !0
        }
    }),
    (Ol.prototype.inspect = function () {
        return this.isInfinity()
            ? "<EC JPoint Infinity>"
            : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">"
    }),
    (Ol.prototype.isInfinity = function () {
        return 0 === this.z.cmpn(0)
    })
var Cl = vl(function (t, e) {
        var r = e
        ;(r.base = Al), (r.short = Rl), (r.mont = null), (r.edwards = null)
    }),
    Bl = vl(function (t, e) {
        var r,
            n = e,
            i = _l.assert
        function o(t) {
            "short" === t.type
                ? (this.curve = new Cl.short(t))
                : "edwards" === t.type
                ? (this.curve = new Cl.edwards(t))
                : (this.curve = new Cl.mont(t)),
                (this.g = this.curve.g),
                (this.n = this.curve.n),
                (this.hash = t.hash),
                i(this.g.validate(), "Invalid curve"),
                i(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O")
        }
        function s(t, e) {
            Object.defineProperty(n, t, {
                configurable: !0,
                enumerable: !0,
                get: function () {
                    var r = new o(e)
                    return Object.defineProperty(n, t, { configurable: !0, enumerable: !0, value: r }), r
                },
            })
        }
        ;(n.PresetCurve = o),
            s("p192", {
                type: "short",
                prime: "p192",
                p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
                a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
                b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
                n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
                hash: vs.sha256,
                gRed: !1,
                g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"],
            }),
            s("p224", {
                type: "short",
                prime: "p224",
                p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
                a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
                b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
                n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
                hash: vs.sha256,
                gRed: !1,
                g: [
                    "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
                    "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34",
                ],
            }),
            s("p256", {
                type: "short",
                prime: null,
                p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
                a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
                b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
                n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
                hash: vs.sha256,
                gRed: !1,
                g: [
                    "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
                    "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5",
                ],
            }),
            s("p384", {
                type: "short",
                prime: null,
                p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
                a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
                b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
                n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
                hash: vs.sha384,
                gRed: !1,
                g: [
                    "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
                    "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f",
                ],
            }),
            s("p521", {
                type: "short",
                prime: null,
                p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
                a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
                b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
                n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
                hash: vs.sha512,
                gRed: !1,
                g: [
                    "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
                    "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650",
                ],
            }),
            s("curve25519", {
                type: "mont",
                prime: "p25519",
                p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                a: "76d06",
                b: "1",
                n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                hash: vs.sha256,
                gRed: !1,
                g: ["9"],
            }),
            s("ed25519", {
                type: "edwards",
                prime: "p25519",
                p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                a: "-1",
                c: "1",
                d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
                n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                hash: vs.sha256,
                gRed: !1,
                g: [
                    "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
                    "6666666666666666666666666666666666666666666666666666666666666658",
                ],
            })
        try {
            r = null.crash()
        } catch (a) {
            r = void 0
        }
        s("secp256k1", {
            type: "short",
            prime: "k256",
            p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
            a: "0",
            b: "7",
            n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
            h: "1",
            hash: vs.sha256,
            beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
            basis: [
                { a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3" },
                { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" },
            ],
            gRed: !1,
            g: [
                "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
                r,
            ],
        })
    })
function Fl(t) {
    if (!(this instanceof Fl)) return new Fl(t)
    ;(this.hash = t.hash),
        (this.predResist = !!t.predResist),
        (this.outLen = this.hash.outSize),
        (this.minEntropy = t.minEntropy || this.hash.hmacStrength),
        (this._reseed = null),
        (this.reseedInterval = null),
        (this.K = null),
        (this.V = null)
    var e = wl.toArray(t.entropy, t.entropyEnc || "hex"),
        r = wl.toArray(t.nonce, t.nonceEnc || "hex"),
        n = wl.toArray(t.pers, t.persEnc || "hex")
    yl(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(e, r, n)
}
var Ll = Fl
;(Fl.prototype._init = function (t, e, r) {
    var n = t.concat(e).concat(r)
    ;(this.K = new Array(this.outLen / 8)), (this.V = new Array(this.outLen / 8))
    for (var i = 0; i < this.V.length; i++) (this.K[i] = 0), (this.V[i] = 1)
    this._update(n), (this._reseed = 1), (this.reseedInterval = 281474976710656)
}),
    (Fl.prototype._hmac = function () {
        return new vs.hmac(this.hash, this.K)
    }),
    (Fl.prototype._update = function (t) {
        var e = this._hmac().update(this.V).update([0])
        t && (e = e.update(t)),
            (this.K = e.digest()),
            (this.V = this._hmac().update(this.V).digest()),
            t && ((this.K = this._hmac().update(this.V).update([1]).update(t).digest()), (this.V = this._hmac().update(this.V).digest()))
    }),
    (Fl.prototype.reseed = function (t, e, r, n) {
        "string" != typeof e && ((n = r), (r = e), (e = null)),
            (t = wl.toArray(t, e)),
            (r = wl.toArray(r, n)),
            yl(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"),
            this._update(t.concat(r || [])),
            (this._reseed = 1)
    }),
    (Fl.prototype.generate = function (t, e, r, n) {
        if (this._reseed > this.reseedInterval) throw new Error("Reseed is required")
        "string" != typeof e && ((n = r), (r = e), (e = null)), r && ((r = wl.toArray(r, n || "hex")), this._update(r))
        for (var i = []; i.length < t; ) (this.V = this._hmac().update(this.V).digest()), (i = i.concat(this.V))
        var o = i.slice(0, t)
        return this._update(r), this._reseed++, wl.encode(o, e)
    })
var Ul = _l.assert
function ql(t, e) {
    ;(this.ec = t),
        (this.priv = null),
        (this.pub = null),
        e.priv && this._importPrivate(e.priv, e.privEnc),
        e.pub && this._importPublic(e.pub, e.pubEnc)
}
var jl = ql
;(ql.fromPublic = function (t, e, r) {
    return e instanceof ql ? e : new ql(t, { pub: e, pubEnc: r })
}),
    (ql.fromPrivate = function (t, e, r) {
        return e instanceof ql ? e : new ql(t, { priv: e, privEnc: r })
    }),
    (ql.prototype.validate = function () {
        var t = this.getPublic()
        return t.isInfinity()
            ? { result: !1, reason: "Invalid public key" }
            : t.validate()
            ? t.mul(this.ec.curve.n).isInfinity()
                ? { result: !0, reason: null }
                : { result: !1, reason: "Public key * N != O" }
            : { result: !1, reason: "Public key is not a point" }
    }),
    (ql.prototype.getPublic = function (t, e) {
        return (
            "string" == typeof t && ((e = t), (t = null)),
            this.pub || (this.pub = this.ec.g.mul(this.priv)),
            e ? this.pub.encode(e, t) : this.pub
        )
    }),
    (ql.prototype.getPrivate = function (t) {
        return "hex" === t ? this.priv.toString(16, 2) : this.priv
    }),
    (ql.prototype._importPrivate = function (t, e) {
        ;(this.priv = new ai(t, e || 16)), (this.priv = this.priv.umod(this.ec.curve.n))
    }),
    (ql.prototype._importPublic = function (t, e) {
        if (t.x || t.y)
            return (
                "mont" === this.ec.curve.type
                    ? Ul(t.x, "Need x coordinate")
                    : ("short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type) || Ul(t.x && t.y, "Need both x and y coordinate"),
                void (this.pub = this.ec.curve.point(t.x, t.y))
            )
        this.pub = this.ec.curve.decodePoint(t, e)
    }),
    (ql.prototype.derive = function (t) {
        return t.validate() || Ul(t.validate(), "public point not validated"), t.mul(this.priv).getX()
    }),
    (ql.prototype.sign = function (t, e, r) {
        return this.ec.sign(t, this, e, r)
    }),
    (ql.prototype.verify = function (t, e) {
        return this.ec.verify(t, e, this)
    }),
    (ql.prototype.inspect = function () {
        return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >"
    })
var Dl = _l.assert
function zl(t, e) {
    if (t instanceof zl) return t
    this._importDER(t, e) ||
        (Dl(t.r && t.s, "Signature without r or s"),
        (this.r = new ai(t.r, 16)),
        (this.s = new ai(t.s, 16)),
        void 0 === t.recoveryParam ? (this.recoveryParam = null) : (this.recoveryParam = t.recoveryParam))
}
var Gl = zl
function $l() {
    this.place = 0
}
function Hl(t, e) {
    var r = t[e.place++]
    if (!(128 & r)) return r
    var n = 15 & r
    if (0 === n || n > 4) return !1
    for (var i = 0, o = 0, s = e.place; o < n; o++, s++) (i <<= 8), (i |= t[s]), (i >>>= 0)
    return !(i <= 127) && ((e.place = s), i)
}
function Vl(t) {
    for (var e = 0, r = t.length - 1; !t[e] && !(128 & t[e + 1]) && e < r; ) e++
    return 0 === e ? t : t.slice(e)
}
function Wl(t, e) {
    if (e < 128) t.push(e)
    else {
        var r = 1 + ((Math.log(e) / Math.LN2) >>> 3)
        for (t.push(128 | r); --r; ) t.push((e >>> (r << 3)) & 255)
        t.push(e)
    }
}
;(zl.prototype._importDER = function (t, e) {
    t = _l.toArray(t, e)
    var r = new $l()
    if (48 !== t[r.place++]) return !1
    var n = Hl(t, r)
    if (!1 === n) return !1
    if (n + r.place !== t.length) return !1
    if (2 !== t[r.place++]) return !1
    var i = Hl(t, r)
    if (!1 === i) return !1
    var o = t.slice(r.place, i + r.place)
    if (((r.place += i), 2 !== t[r.place++])) return !1
    var s = Hl(t, r)
    if (!1 === s) return !1
    if (t.length !== s + r.place) return !1
    var a = t.slice(r.place, s + r.place)
    if (0 === o[0]) {
        if (!(128 & o[1])) return !1
        o = o.slice(1)
    }
    if (0 === a[0]) {
        if (!(128 & a[1])) return !1
        a = a.slice(1)
    }
    return (this.r = new ai(o)), (this.s = new ai(a)), (this.recoveryParam = null), !0
}),
    (zl.prototype.toDER = function (t) {
        var e = this.r.toArray(),
            r = this.s.toArray()
        for (128 & e[0] && (e = [0].concat(e)), 128 & r[0] && (r = [0].concat(r)), e = Vl(e), r = Vl(r); !(r[0] || 128 & r[1]); ) r = r.slice(1)
        var n = [2]
        Wl(n, e.length), (n = n.concat(e)).push(2), Wl(n, r.length)
        var i = n.concat(r),
            o = [48]
        return Wl(o, i.length), (o = o.concat(i)), _l.encode(o, t)
    })
var Kl = function () {
        throw new Error("unsupported")
    },
    Jl = _l.assert
function Xl(t) {
    if (!(this instanceof Xl)) return new Xl(t)
    "string" == typeof t && (Jl(Object.prototype.hasOwnProperty.call(Bl, t), "Unknown curve " + t), (t = Bl[t])),
        t instanceof Bl.PresetCurve && (t = { curve: t }),
        (this.curve = t.curve.curve),
        (this.n = this.curve.n),
        (this.nh = this.n.ushrn(1)),
        (this.g = this.curve.g),
        (this.g = t.curve.g),
        this.g.precompute(t.curve.n.bitLength() + 1),
        (this.hash = t.hash || t.curve.hash)
}
var Zl = Xl
;(Xl.prototype.keyPair = function (t) {
    return new jl(this, t)
}),
    (Xl.prototype.keyFromPrivate = function (t, e) {
        return jl.fromPrivate(this, t, e)
    }),
    (Xl.prototype.keyFromPublic = function (t, e) {
        return jl.fromPublic(this, t, e)
    }),
    (Xl.prototype.genKeyPair = function (t) {
        t || (t = {})
        for (
            var e = new Ll({
                    hash: this.hash,
                    pers: t.pers,
                    persEnc: t.persEnc || "utf8",
                    entropy: t.entropy || Kl(this.hash.hmacStrength),
                    entropyEnc: (t.entropy && t.entropyEnc) || "utf8",
                    nonce: this.n.toArray(),
                }),
                r = this.n.byteLength(),
                n = this.n.sub(new ai(2));
            ;

        ) {
            var i = new ai(e.generate(r))
            if (!(i.cmp(n) > 0)) return i.iaddn(1), this.keyFromPrivate(i)
        }
    }),
    (Xl.prototype._truncateToN = function (t, e) {
        var r = 8 * t.byteLength() - this.n.bitLength()
        return r > 0 && (t = t.ushrn(r)), !e && t.cmp(this.n) >= 0 ? t.sub(this.n) : t
    }),
    (Xl.prototype.sign = function (t, e, r, n) {
        "object" == typeof r && ((n = r), (r = null)), n || (n = {}), (e = this.keyFromPrivate(e, r)), (t = this._truncateToN(new ai(t, 16)))
        for (
            var i = this.n.byteLength(),
                o = e.getPrivate().toArray("be", i),
                s = t.toArray("be", i),
                a = new Ll({ hash: this.hash, entropy: o, nonce: s, pers: n.pers, persEnc: n.persEnc || "utf8" }),
                l = this.n.sub(new ai(1)),
                u = 0;
            ;
            u++
        ) {
            var h = n.k ? n.k(u) : new ai(a.generate(this.n.byteLength()))
            if (!((h = this._truncateToN(h, !0)).cmpn(1) <= 0 || h.cmp(l) >= 0)) {
                var c = this.g.mul(h)
                if (!c.isInfinity()) {
                    var f = c.getX(),
                        d = f.umod(this.n)
                    if (0 !== d.cmpn(0)) {
                        var p = h.invm(this.n).mul(d.mul(e.getPrivate()).iadd(t))
                        if (0 !== (p = p.umod(this.n)).cmpn(0)) {
                            var m = (c.getY().isOdd() ? 1 : 0) | (0 !== f.cmp(d) ? 2 : 0)
                            return n.canonical && p.cmp(this.nh) > 0 && ((p = this.n.sub(p)), (m ^= 1)), new Gl({ r: d, s: p, recoveryParam: m })
                        }
                    }
                }
            }
        }
    }),
    (Xl.prototype.verify = function (t, e, r, n) {
        ;(t = this._truncateToN(new ai(t, 16))), (r = this.keyFromPublic(r, n))
        var i = (e = new Gl(e, "hex")).r,
            o = e.s
        if (i.cmpn(1) < 0 || i.cmp(this.n) >= 0) return !1
        if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1
        var s,
            a = o.invm(this.n),
            l = a.mul(t).umod(this.n),
            u = a.mul(i).umod(this.n)
        return this.curve._maxwellTrick
            ? !(s = this.g.jmulAdd(l, r.getPublic(), u)).isInfinity() && s.eqXToP(i)
            : !(s = this.g.mulAdd(l, r.getPublic(), u)).isInfinity() && 0 === s.getX().umod(this.n).cmp(i)
    }),
    (Xl.prototype.recoverPubKey = function (t, e, r, n) {
        Jl((3 & r) === r, "The recovery param is more than two bits"), (e = new Gl(e, n))
        var i = this.n,
            o = new ai(t),
            s = e.r,
            a = e.s,
            l = 1 & r,
            u = r >> 1
        if (s.cmp(this.curve.p.umod(this.curve.n)) >= 0 && u) throw new Error("Unable to find sencond key candinate")
        s = u ? this.curve.pointFromX(s.add(this.curve.n), l) : this.curve.pointFromX(s, l)
        var h = e.r.invm(i),
            c = i.sub(o).mul(h).umod(i),
            f = a.mul(h).umod(i)
        return this.g.mulAdd(c, s, f)
    }),
    (Xl.prototype.getKeyRecoveryParam = function (t, e, r, n) {
        if (null !== (e = new Gl(e, n)).recoveryParam) return e.recoveryParam
        for (var i = 0; i < 4; i++) {
            var o
            try {
                o = this.recoverPubKey(t, e, i)
            } catch (s) {
                continue
            }
            if (o.eq(r)) return i
        }
        throw new Error("Unable to find valid recovery factor")
    })
var Ql = vl(function (t, e) {
    var r = e
    ;(r.version = "6.5.4"),
        (r.utils = _l),
        (r.rand = function () {
            throw new Error("unsupported")
        }),
        (r.curve = Cl),
        (r.curves = Bl),
        (r.ec = Zl),
        (r.eddsa = null)
}).ec
const Yl = new yi("signing-key/5.4.0")
let tu = null
function eu() {
    return tu || (tu = new Ql("secp256k1")), tu
}
class ru {
    constructor(t) {
        Vi(this, "curve", "secp256k1"), Vi(this, "privateKey", Pi(t))
        const e = eu().keyFromPrivate(Mi(this.privateKey))
        Vi(this, "publicKey", "0x" + e.getPublic(!1, "hex")),
            Vi(this, "compressedPublicKey", "0x" + e.getPublic(!0, "hex")),
            Vi(this, "_isSigningKey", !0)
    }
    _addPoint(t) {
        const e = eu().keyFromPublic(Mi(this.publicKey)),
            r = eu().keyFromPublic(Mi(t))
        return "0x" + e.pub.add(r.pub).encodeCompressed("hex")
    }
    signDigest(t) {
        const e = eu().keyFromPrivate(Mi(this.privateKey)),
            r = Mi(t)
        32 !== r.length && Yl.throwArgumentError("bad digest length", "digest", t)
        const n = e.sign(r, { canonical: !0 })
        return Ci({ recoveryParam: n.recoveryParam, r: Oi("0x" + n.r.toString(16), 32), s: Oi("0x" + n.s.toString(16), 32) })
    }
    computeSharedSecret(t) {
        const e = eu().keyFromPrivate(Mi(this.privateKey)),
            r = eu().keyFromPublic(Mi(nu(t)))
        return Oi("0x" + e.derive(r.getPublic()).toString(16), 32)
    }
    static isSigningKey(t) {
        return !(!t || !t._isSigningKey)
    }
}
function nu(t, e) {
    const r = Mi(t)
    if (32 === r.length) {
        const t = new ru(r)
        return e ? "0x" + eu().keyFromPrivate(r).getPublic(!0, "hex") : t.publicKey
    }
    return 33 === r.length
        ? e
            ? Pi(r)
            : "0x" + eu().keyFromPublic(r).getPublic(!1, "hex")
        : 65 === r.length
        ? e
            ? "0x" + eu().keyFromPublic(r).getPublic(!0, "hex")
            : Pi(r)
        : Yl.throwArgumentError("invalid public or private key", "key", "[REDACTED]")
}
const iu = new yi("transactions/5.4.0")
var ou, su
function au(t) {
    return "0x" === t ? null : vo(t)
}
function lu(t) {
    return "0x" === t ? yo : qi.from(t)
}
function uu(t, e) {
    return vo(
        Ii(
            no(
                Ii(
                    nu(
                        (function (t, e) {
                            const r = Ci(e),
                                n = { r: Mi(r.r), s: Mi(r.s) }
                            return "0x" + eu().recoverPubKey(Mi(t), n, r.recoveryParam).encode("hex", !1)
                        })(Mi(t), e)
                    ),
                    1
                )
            ),
            12
        )
    )
}
function hu(t, e) {
    const r = Ai(qi.from(t).toHexString())
    return r.length > 32 && iu.throwArgumentError("invalid length for " + e, "transaction:" + e, t), r
}
function cu(t, e) {
    return {
        address: vo(t),
        storageKeys: (e || []).map(
            (e, r) => (32 !== Si(e) && iu.throwArgumentError("invalid access list storageKey", `accessList[${t}:${r}]`, e), e.toLowerCase())
        ),
    }
}
function fu(t) {
    if (Array.isArray(t))
        return t.map((t, e) =>
            Array.isArray(t)
                ? (t.length > 2 && iu.throwArgumentError("access list expected to be [ address, storageKeys[] ]", `value[${e}]`, t),
                  cu(t[0], t[1]))
                : cu(t.address, t.storageKeys)
        )
    const e = Object.keys(t).map((e) => {
        const r = t[e].reduce((t, e) => ((t[e] = !0), t), {})
        return cu(e, Object.keys(r).sort())
    })
    return e.sort((t, e) => t.address.localeCompare(e.address)), e
}
function du(t) {
    return fu(t).map((t) => [t.address, t.storageKeys])
}
function pu(t, e) {
    if (null != t.gasPrice) {
        const e = qi.from(t.gasPrice),
            r = qi.from(t.maxFeePerGas || 0)
        e.eq(r) || iu.throwArgumentError("mismatch EIP-1559 gasPrice != maxFeePerGas", "tx", { gasPrice: e, maxFeePerGas: r })
    }
    const r = [
        hu(t.chainId || 0, "chainId"),
        hu(t.nonce || 0, "nonce"),
        hu(t.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"),
        hu(t.maxFeePerGas || 0, "maxFeePerGas"),
        hu(t.gasLimit || 0, "gasLimit"),
        null != t.to ? vo(t.to) : "0x",
        hu(t.value || 0, "value"),
        t.data || "0x",
        du(t.accessList || []),
    ]
    if (e) {
        const t = Ci(e)
        r.push(hu(t.recoveryParam, "recoveryParam")), r.push(Ai(t.r)), r.push(Ai(t.s))
    }
    return Ri(["0x02", lo(r)])
}
function mu(t, e) {
    const r = [
        hu(t.chainId || 0, "chainId"),
        hu(t.nonce || 0, "nonce"),
        hu(t.gasPrice || 0, "gasPrice"),
        hu(t.gasLimit || 0, "gasLimit"),
        null != t.to ? vo(t.to) : "0x",
        hu(t.value || 0, "value"),
        t.data || "0x",
        du(t.accessList || []),
    ]
    if (e) {
        const t = Ci(e)
        r.push(hu(t.recoveryParam, "recoveryParam")), r.push(Ai(t.r)), r.push(Ai(t.s))
    }
    return Ri(["0x01", lo(r)])
}
function gu(t, e, r) {
    try {
        const r = lu(e[0]).toNumber()
        if (0 !== r && 1 !== r) throw new Error("bad recid")
        t.v = r
    } catch (n) {
        iu.throwArgumentError("invalid v for transaction type: 1", "v", e[0])
    }
    ;(t.r = Oi(e[1], 32)), (t.s = Oi(e[2], 32))
    try {
        const e = no(r(t))
        t.from = uu(e, { r: t.r, s: t.s, recoveryParam: t.v })
    } catch (n) {
        console.log(n)
    }
}
function vu(t) {
    const e = Mi(t)
    if (e[0] > 127)
        return (function (t) {
            const e = co(t)
            9 !== e.length && 6 !== e.length && iu.throwArgumentError("invalid raw transaction", "rawTransaction", t)
            const r = {
                nonce: lu(e[0]).toNumber(),
                gasPrice: lu(e[1]),
                gasLimit: lu(e[2]),
                to: au(e[3]),
                value: lu(e[4]),
                data: e[5],
                chainId: 0,
            }
            if (6 === e.length) return r
            try {
                r.v = qi.from(e[6]).toNumber()
            } catch (n) {
                return console.log(n), r
            }
            if (((r.r = Oi(e[7], 32)), (r.s = Oi(e[8], 32)), qi.from(r.r).isZero() && qi.from(r.s).isZero())) (r.chainId = r.v), (r.v = 0)
            else {
                ;(r.chainId = Math.floor((r.v - 35) / 2)), r.chainId < 0 && (r.chainId = 0)
                let i = r.v - 27
                const o = e.slice(0, 6)
                0 !== r.chainId && (o.push(Pi(r.chainId)), o.push("0x"), o.push("0x"), (i -= 2 * r.chainId + 8))
                const s = no(lo(o))
                try {
                    r.from = uu(s, { r: Pi(r.r), s: Pi(r.s), recoveryParam: i })
                } catch (n) {
                    console.log(n)
                }
                r.hash = no(t)
            }
            return (r.type = null), r
        })(e)
    switch (e[0]) {
        case 1:
            return (function (t) {
                const e = co(t.slice(1))
                8 !== e.length && 11 !== e.length && iu.throwArgumentError("invalid component count for transaction type: 1", "payload", Pi(t))
                const r = {
                    type: 1,
                    chainId: lu(e[0]).toNumber(),
                    nonce: lu(e[1]).toNumber(),
                    gasPrice: lu(e[2]),
                    gasLimit: lu(e[3]),
                    to: au(e[4]),
                    value: lu(e[5]),
                    data: e[6],
                    accessList: fu(e[7]),
                }
                return 8 === e.length || ((r.hash = no(t)), gu(r, e.slice(8), mu)), r
            })(e)
        case 2:
            return (function (t) {
                const e = co(t.slice(1))
                9 !== e.length && 12 !== e.length && iu.throwArgumentError("invalid component count for transaction type: 2", "payload", Pi(t))
                const r = lu(e[2]),
                    n = lu(e[3]),
                    i = {
                        type: 2,
                        chainId: lu(e[0]).toNumber(),
                        nonce: lu(e[1]).toNumber(),
                        maxPriorityFeePerGas: r,
                        maxFeePerGas: n,
                        gasPrice: null,
                        gasLimit: lu(e[4]),
                        to: au(e[5]),
                        value: lu(e[6]),
                        data: e[7],
                        accessList: fu(e[8]),
                    }
                return 9 === e.length || ((i.hash = no(t)), gu(i, e.slice(9), pu)), i
            })(e)
    }
    return iu.throwError(`unsupported transaction type: ${e[0]}`, yi.errors.UNSUPPORTED_OPERATION, {
        operation: "parseTransaction",
        transactionType: e[0],
    })
}
;((su = ou || (ou = {}))[(su.legacy = 0)] = "legacy"), (su[(su.eip2930 = 1)] = "eip2930"), (su[(su.eip1559 = 2)] = "eip1559")
class yu {
    constructor(t) {
        Vi(this, "alphabet", t), Vi(this, "base", t.length), Vi(this, "_alphabetMap", {}), Vi(this, "_leader", t.charAt(0))
        for (let e = 0; e < t.length; e++) this._alphabetMap[t.charAt(e)] = e
    }
    encode(t) {
        let e = Mi(t)
        if (0 === e.length) return ""
        let r = [0]
        for (let i = 0; i < e.length; ++i) {
            let t = e[i]
            for (let e = 0; e < r.length; ++e) (t += r[e] << 8), (r[e] = t % this.base), (t = (t / this.base) | 0)
            for (; t > 0; ) r.push(t % this.base), (t = (t / this.base) | 0)
        }
        let n = ""
        for (let i = 0; 0 === e[i] && i < e.length - 1; ++i) n += this._leader
        for (let i = r.length - 1; i >= 0; --i) n += this.alphabet[r[i]]
        return n
    }
    decode(t) {
        if ("string" != typeof t) throw new TypeError("Expected String")
        let e = []
        if (0 === t.length) return new Uint8Array(e)
        e.push(0)
        for (let r = 0; r < t.length; r++) {
            let n = this._alphabetMap[t[r]]
            if (void 0 === n) throw new Error("Non-base" + this.base + " character")
            let i = n
            for (let t = 0; t < e.length; ++t) (i += e[t] * this.base), (e[t] = 255 & i), (i >>= 8)
            for (; i > 0; ) e.push(255 & i), (i >>= 8)
        }
        for (let r = 0; t[r] === this._leader && r < t.length - 1; ++r) e.push(0)
        return Mi(new Uint8Array(e.reverse()))
    }
}
new yu("abcdefghijklmnopqrstuvwxyz234567")
const bu = new yu("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
function wu(t) {
    return "0x" + vs.sha256().update(Mi(t)).digest("hex")
}
new yi("sha2/5.4.0")
const _u = new yi("networks/5.4.1")
function Eu(t) {
    const e = function (e, r) {
        null == r && (r = {})
        const n = []
        if (e.InfuraProvider)
            try {
                n.push(new e.InfuraProvider(t, r.infura))
            } catch (i) {}
        if (e.EtherscanProvider) {
            const r = ["ropsten"]
            try {
                const i = new e.EtherscanProvider(t)
                i.network && -1 === r.indexOf(i.network.name) && n.push(i)
            } catch (i) {}
        }
        if (e.AlchemyProvider)
            try {
                n.push(new e.AlchemyProvider(t, r.alchemy))
            } catch (i) {}
        if (e.PocketProvider) {
            const r = ["goerli", "ropsten", "rinkeby"]
            try {
                const i = new e.PocketProvider(t)
                i.network && -1 === r.indexOf(i.network.name) && n.push(i)
            } catch (i) {}
        }
        if (e.CloudflareProvider)
            try {
                n.push(new e.CloudflareProvider(t))
            } catch (i) {}
        if (0 === n.length) return null
        if (e.FallbackProvider) {
            let i = 1
            return null != r.quorum ? (i = r.quorum) : "homestead" === t && (i = 2), new e.FallbackProvider(n, i)
        }
        return n[0]
    }
    return (
        (e.renetwork = function (t) {
            return Eu(t)
        }),
        e
    )
}
function ku(t, e) {
    const r = function (r, n) {
        return r.JsonRpcProvider ? new r.JsonRpcProvider(t, e) : null
    }
    return (
        (r.renetwork = function (e) {
            return ku(t, e)
        }),
        r
    )
}
const Mu = { chainId: 1, ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", name: "homestead", _defaultProvider: Eu("homestead") },
    xu = { chainId: 3, ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", name: "ropsten", _defaultProvider: Eu("ropsten") },
    Au = { chainId: 63, name: "classicMordor", _defaultProvider: ku("https://www.ethercluster.com/mordor", "classicMordor") },
    Nu = {
        unspecified: { chainId: 0, name: "unspecified" },
        homestead: Mu,
        mainnet: Mu,
        morden: { chainId: 2, name: "morden" },
        ropsten: xu,
        testnet: xu,
        rinkeby: { chainId: 4, ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", name: "rinkeby", _defaultProvider: Eu("rinkeby") },
        kovan: { chainId: 42, name: "kovan", _defaultProvider: Eu("kovan") },
        goerli: { chainId: 5, ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", name: "goerli", _defaultProvider: Eu("goerli") },
        classic: { chainId: 61, name: "classic", _defaultProvider: ku("https://www.ethercluster.com/etc", "classic") },
        classicMorden: { chainId: 62, name: "classicMorden" },
        classicMordor: Au,
        classicTestnet: Au,
        classicKotti: { chainId: 6, name: "classicKotti", _defaultProvider: ku("https://www.ethercluster.com/kotti", "classicKotti") },
        xdai: { chainId: 100, name: "xdai" },
        matic: { chainId: 137, name: "matic" },
        maticmum: { chainId: 80001, name: "maticmum" },
        bnb: { chainId: 56, name: "bnb" },
        bnbt: { chainId: 97, name: "bnbt" },
    }
function Pu(t) {
    t = Mi(t)
    let e = ""
    for (let r = 0; r < t.length; r++) e += String.fromCharCode(t[r])
    return btoa(e)
}
var Su = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
function Iu(t, e) {
    return Su(this, void 0, void 0, function* () {
        null == e && (e = {})
        const r = {
                method: e.method || "GET",
                headers: e.headers || {},
                body: e.body || void 0,
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                redirect: "follow",
                referrer: "client",
            },
            n = yield fetch(t, r),
            i = yield n.arrayBuffer(),
            o = {}
        return (
            n.headers.forEach
                ? n.headers.forEach((t, e) => {
                      o[e.toLowerCase()] = t
                  })
                : n.headers.keys().forEach((t) => {
                      o[t.toLowerCase()] = n.headers.get(t)
                  }),
            { headers: o, statusCode: n.status, statusMessage: n.statusText, body: Mi(new Uint8Array(i)) }
        )
    })
}
var Ru = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const Tu = new yi("web/5.4.0")
function Ou(t) {
    return new Promise((e) => {
        setTimeout(e, t)
    })
}
function Cu(t, e) {
    if (null == t) return null
    if ("string" == typeof t) return t
    if (Ei(t)) {
        if (e && ("text" === e.split("/")[0] || "application/json" === e.split(";")[0].trim()))
            try {
                return So(t)
            } catch (r) {}
        return Pi(t)
    }
    return t
}
function Bu(t, e, r) {
    let n = null
    if (null != e) {
        n = No(e)
        const r = "string" == typeof t ? { url: t } : Ji(t)
        if (r.headers) {
            0 !== Object.keys(r.headers).filter((t) => "content-type" === t.toLowerCase()).length ||
                ((r.headers = Ji(r.headers)), (r.headers["content-type"] = "application/json"))
        } else r.headers = { "content-type": "application/json" }
        t = r
    }
    return (function (t, e, r) {
        const n = "object" == typeof t && null != t.throttleLimit ? t.throttleLimit : 12
        Tu.assertArgument(n > 0 && n % 1 == 0, "invalid connection throttle limit", "connection.throttleLimit", n)
        const i = "object" == typeof t ? t.throttleCallback : null,
            o = "object" == typeof t && "number" == typeof t.throttleSlotInterval ? t.throttleSlotInterval : 100
        Tu.assertArgument(o > 0 && o % 1 == 0, "invalid connection throttle slot interval", "connection.throttleSlotInterval", o)
        const s = {}
        let a = null
        const l = { method: "GET" }
        let u = !1,
            h = 12e4
        if ("string" == typeof t) a = t
        else if ("object" == typeof t) {
            if (
                ((null != t && null != t.url) || Tu.throwArgumentError("missing URL", "connection.url", t),
                (a = t.url),
                "number" == typeof t.timeout && t.timeout > 0 && (h = t.timeout),
                t.headers)
            )
                for (const e in t.headers)
                    (s[e.toLowerCase()] = { key: e, value: String(t.headers[e]) }),
                        ["if-none-match", "if-modified-since"].indexOf(e.toLowerCase()) >= 0 && (u = !0)
            if (((l.allowGzip = !!t.allowGzip), null != t.user && null != t.password)) {
                "https:" !== a.substring(0, 6) &&
                    !0 !== t.allowInsecureAuthentication &&
                    Tu.throwError("basic authentication requires a secure https url", yi.errors.INVALID_ARGUMENT, {
                        argument: "url",
                        url: a,
                        user: t.user,
                        password: "[REDACTED]",
                    })
                const e = t.user + ":" + t.password
                s.authorization = { key: "Authorization", value: "Basic " + Pu(No(e)) }
            }
        }
        e &&
            ((l.method = "POST"),
            (l.body = e),
            null == s["content-type"] && (s["content-type"] = { key: "Content-Type", value: "application/octet-stream" }),
            null == s["content-length"] && (s["content-length"] = { key: "Content-Length", value: String(e.length) }))
        const c = {}
        Object.keys(s).forEach((t) => {
            const e = s[t]
            c[e.key] = e.value
        }),
            (l.headers = c)
        const f = (function () {
                let t = null
                return {
                    promise: new Promise(function (e, r) {
                        h &&
                            (t = setTimeout(() => {
                                null != t &&
                                    ((t = null),
                                    r(
                                        Tu.makeError("timeout", yi.errors.TIMEOUT, {
                                            requestBody: Cu(l.body, c["content-type"]),
                                            requestMethod: l.method,
                                            timeout: h,
                                            url: a,
                                        })
                                    ))
                            }, h))
                    }),
                    cancel: function () {
                        null != t && (clearTimeout(t), (t = null))
                    },
                }
            })(),
            d = (function () {
                return Ru(this, void 0, void 0, function* () {
                    for (let e = 0; e < n; e++) {
                        let s = null
                        try {
                            if (((s = yield Iu(a, l)), 429 === s.statusCode && e < n)) {
                                let t = !0
                                if ((i && (t = yield i(e, a)), t)) {
                                    let t = 0
                                    const r = s.headers["retry-after"]
                                    ;(t =
                                        "string" == typeof r && r.match(/^[1-9][0-9]*$/)
                                            ? 1e3 * parseInt(r)
                                            : o * parseInt(String(Math.random() * Math.pow(2, e)))),
                                        yield Ou(t)
                                    continue
                                }
                            }
                        } catch (t) {
                            ;(s = t.response),
                                null == s &&
                                    (f.cancel(),
                                    Tu.throwError("missing response", yi.errors.SERVER_ERROR, {
                                        requestBody: Cu(l.body, c["content-type"]),
                                        requestMethod: l.method,
                                        serverError: t,
                                        url: a,
                                    }))
                        }
                        let h = s.body
                        if (
                            (u && 304 === s.statusCode
                                ? (h = null)
                                : (s.statusCode < 200 || s.statusCode >= 300) &&
                                  (f.cancel(),
                                  Tu.throwError("bad response", yi.errors.SERVER_ERROR, {
                                      status: s.statusCode,
                                      headers: s.headers,
                                      body: Cu(h, s.headers ? s.headers["content-type"] : null),
                                      requestBody: Cu(l.body, c["content-type"]),
                                      requestMethod: l.method,
                                      url: a,
                                  })),
                            r)
                        )
                            try {
                                const t = yield r(h, s)
                                return f.cancel(), t
                            } catch (t) {
                                if (t.throttleRetry && e < n) {
                                    let t = !0
                                    if ((i && (t = yield i(e, a)), t)) {
                                        const t = o * parseInt(String(Math.random() * Math.pow(2, e)))
                                        yield Ou(t)
                                        continue
                                    }
                                }
                                f.cancel(),
                                    Tu.throwError("processing response error", yi.errors.SERVER_ERROR, {
                                        body: Cu(h, s.headers ? s.headers["content-type"] : null),
                                        error: t,
                                        requestBody: Cu(l.body, c["content-type"]),
                                        requestMethod: l.method,
                                        url: a,
                                    })
                            }
                        return f.cancel(), h
                    }
                    return Tu.throwError("failed response", yi.errors.SERVER_ERROR, {
                        requestBody: Cu(l.body, c["content-type"]),
                        requestMethod: l.method,
                        url: a,
                    })
                })
            })()
        return Promise.race([f.promise, d])
    })(t, n, (t, e) => {
        let n = null
        if (null != t)
            try {
                n = JSON.parse(So(t))
            } catch (i) {
                Tu.throwError("invalid JSON", yi.errors.SERVER_ERROR, { body: t, error: i })
            }
        return r && (n = r(n, e)), n
    })
}
function Fu(t, e) {
    return (
        e || (e = {}),
        null == (e = Ji(e)).floor && (e.floor = 0),
        null == e.ceiling && (e.ceiling = 1e4),
        null == e.interval && (e.interval = 250),
        new Promise(function (r, n) {
            let i = null,
                o = !1
            const s = () => !o && ((o = !0), i && clearTimeout(i), !0)
            e.timeout &&
                (i = setTimeout(() => {
                    s() && n(new Error("timeout"))
                }, e.timeout))
            const a = e.retryLimit
            let l = 0
            !(function i() {
                return t().then(
                    function (t) {
                        if (void 0 !== t) s() && r(t)
                        else if (e.oncePoll) e.oncePoll.once("poll", i)
                        else if (e.onceBlock) e.onceBlock.once("block", i)
                        else if (!o) {
                            if ((l++, l > a)) return void (s() && n(new Error("retry limit reached")))
                            let t = e.interval * parseInt(String(Math.random() * Math.pow(2, l)))
                            t < e.floor && (t = e.floor), t > e.ceiling && (t = e.ceiling), setTimeout(i, t)
                        }
                        return null
                    },
                    function (t) {
                        s() && n(t)
                    }
                )
            })()
        })
    )
}
for (var Lu = "qpzry9x8gf2tvdw0s3jn54khce6mua7l", Uu = {}, qu = 0; qu < Lu.length; qu++) {
    var ju = Lu.charAt(qu)
    if (void 0 !== Uu[ju]) throw new TypeError(ju + " is ambiguous")
    Uu[ju] = qu
}
function Du(t) {
    var e = t >> 25
    return (
        ((33554431 & t) << 5) ^
        (996825010 & -((e >> 0) & 1)) ^
        (642813549 & -((e >> 1) & 1)) ^
        (513874426 & -((e >> 2) & 1)) ^
        (1027748829 & -((e >> 3) & 1)) ^
        (705979059 & -((e >> 4) & 1))
    )
}
function zu(t) {
    for (var e = 1, r = 0; r < t.length; ++r) {
        var n = t.charCodeAt(r)
        if (n < 33 || n > 126) return "Invalid prefix (" + t + ")"
        e = Du(e) ^ (n >> 5)
    }
    for (e = Du(e), r = 0; r < t.length; ++r) {
        var i = t.charCodeAt(r)
        e = Du(e) ^ (31 & i)
    }
    return e
}
function Gu(t, e) {
    if (((e = e || 90), t.length < 8)) return t + " too short"
    if (t.length > e) return "Exceeds length limit"
    var r = t.toLowerCase(),
        n = t.toUpperCase()
    if (t !== r && t !== n) return "Mixed-case string " + t
    var i = (t = r).lastIndexOf("1")
    if (-1 === i) return "No separator character for " + t
    if (0 === i) return "Missing prefix for " + t
    var o = t.slice(0, i),
        s = t.slice(i + 1)
    if (s.length < 6) return "Data too short"
    var a = zu(o)
    if ("string" == typeof a) return a
    for (var l = [], u = 0; u < s.length; ++u) {
        var h = s.charAt(u),
            c = Uu[h]
        if (void 0 === c) return "Unknown character " + h
        ;(a = Du(a) ^ c), u + 6 >= s.length || l.push(c)
    }
    return 1 !== a ? "Invalid checksum for " + t : { prefix: o, words: l }
}
function $u(t, e, r, n) {
    for (var i = 0, o = 0, s = (1 << r) - 1, a = [], l = 0; l < t.length; ++l)
        for (i = (i << e) | t[l], o += e; o >= r; ) (o -= r), a.push((i >> o) & s)
    if (n) o > 0 && a.push((i << (r - o)) & s)
    else {
        if (o >= e) return "Excess padding"
        if ((i << (r - o)) & s) return "Non-zero padding"
    }
    return a
}
var Hu = {
    decodeUnsafe: function () {
        var t = Gu.apply(null, arguments)
        if ("object" == typeof t) return t
    },
    decode: function (t) {
        var e = Gu.apply(null, arguments)
        if ("object" == typeof e) return e
        throw new Error(e)
    },
    encode: function (t, e, r) {
        if (((r = r || 90), t.length + 7 + e.length > r)) throw new TypeError("Exceeds length limit")
        var n = zu((t = t.toLowerCase()))
        if ("string" == typeof n) throw new Error(n)
        for (var i = t + "1", o = 0; o < e.length; ++o) {
            var s = e[o]
            if (s >> 5 != 0) throw new Error("Non 5-bit word")
            ;(n = Du(n) ^ s), (i += Lu.charAt(s))
        }
        for (o = 0; o < 6; ++o) n = Du(n)
        for (n ^= 1, o = 0; o < 6; ++o) {
            i += Lu.charAt((n >> (5 * (5 - o))) & 31)
        }
        return i
    },
    toWordsUnsafe: function (t) {
        var e = $u(t, 8, 5, !0)
        if (Array.isArray(e)) return e
    },
    toWords: function (t) {
        var e = $u(t, 8, 5, !0)
        if (Array.isArray(e)) return e
        throw new Error(e)
    },
    fromWordsUnsafe: function (t) {
        var e = $u(t, 5, 8, !1)
        if (Array.isArray(e)) return e
    },
    fromWords: function (t) {
        var e = $u(t, 5, 8, !1)
        if (Array.isArray(e)) return e
        throw new Error(e)
    },
}
const Vu = "providers/5.4.1",
    Wu = new yi(Vu)
class Ku {
    constructor() {
        Wu.checkNew(new.target, Ku), (this.formats = this.getDefaultFormats())
    }
    getDefaultFormats() {
        const t = {},
            e = this.address.bind(this),
            r = this.bigNumber.bind(this),
            n = this.blockTag.bind(this),
            i = this.data.bind(this),
            o = this.hash.bind(this),
            s = this.hex.bind(this),
            a = this.number.bind(this),
            l = this.type.bind(this)
        return (
            (t.transaction = {
                hash: o,
                type: l,
                accessList: Ku.allowNull(this.accessList.bind(this), null),
                blockHash: Ku.allowNull(o, null),
                blockNumber: Ku.allowNull(a, null),
                transactionIndex: Ku.allowNull(a, null),
                confirmations: Ku.allowNull(a, null),
                from: e,
                gasPrice: Ku.allowNull(r),
                maxPriorityFeePerGas: Ku.allowNull(r),
                maxFeePerGas: Ku.allowNull(r),
                gasLimit: r,
                to: Ku.allowNull(e, null),
                value: r,
                nonce: a,
                data: i,
                r: Ku.allowNull(this.uint256),
                s: Ku.allowNull(this.uint256),
                v: Ku.allowNull(a),
                creates: Ku.allowNull(e, null),
                raw: Ku.allowNull(i),
            }),
            (t.transactionRequest = {
                from: Ku.allowNull(e),
                nonce: Ku.allowNull(a),
                gasLimit: Ku.allowNull(r),
                gasPrice: Ku.allowNull(r),
                maxPriorityFeePerGas: Ku.allowNull(r),
                maxFeePerGas: Ku.allowNull(r),
                to: Ku.allowNull(e),
                value: Ku.allowNull(r),
                data: Ku.allowNull((t) => this.data(t, !0)),
                type: Ku.allowNull(a),
                accessList: Ku.allowNull(this.accessList.bind(this), null),
            }),
            (t.receiptLog = {
                transactionIndex: a,
                blockNumber: a,
                transactionHash: o,
                address: e,
                topics: Ku.arrayOf(o),
                data: i,
                logIndex: a,
                blockHash: o,
            }),
            (t.receipt = {
                to: Ku.allowNull(this.address, null),
                from: Ku.allowNull(this.address, null),
                contractAddress: Ku.allowNull(e, null),
                transactionIndex: a,
                root: Ku.allowNull(s),
                gasUsed: r,
                logsBloom: Ku.allowNull(i),
                blockHash: o,
                transactionHash: o,
                logs: Ku.arrayOf(this.receiptLog.bind(this)),
                blockNumber: a,
                confirmations: Ku.allowNull(a, null),
                cumulativeGasUsed: r,
                effectiveGasPrice: Ku.allowNull(r),
                status: Ku.allowNull(a),
                type: l,
            }),
            (t.block = {
                hash: o,
                parentHash: o,
                number: a,
                timestamp: a,
                nonce: Ku.allowNull(s),
                difficulty: this.difficulty.bind(this),
                gasLimit: r,
                gasUsed: r,
                miner: e,
                extraData: i,
                transactions: Ku.allowNull(Ku.arrayOf(o)),
                baseFeePerGas: Ku.allowNull(r),
            }),
            (t.blockWithTransactions = Ji(t.block)),
            (t.blockWithTransactions.transactions = Ku.allowNull(Ku.arrayOf(this.transactionResponse.bind(this)))),
            (t.filter = {
                fromBlock: Ku.allowNull(n, void 0),
                toBlock: Ku.allowNull(n, void 0),
                blockHash: Ku.allowNull(o, void 0),
                address: Ku.allowNull(e, void 0),
                topics: Ku.allowNull(this.topics.bind(this), void 0),
            }),
            (t.filterLog = {
                blockNumber: Ku.allowNull(a),
                blockHash: Ku.allowNull(o),
                transactionIndex: a,
                removed: Ku.allowNull(this.boolean.bind(this)),
                address: e,
                data: Ku.allowFalsish(i, "0x"),
                topics: Ku.arrayOf(o),
                transactionHash: o,
                logIndex: a,
            }),
            t
        )
    }
    accessList(t) {
        return fu(t || [])
    }
    number(t) {
        return "0x" === t ? 0 : qi.from(t).toNumber()
    }
    type(t) {
        return "0x" === t || null == t ? 0 : qi.from(t).toNumber()
    }
    bigNumber(t) {
        return qi.from(t)
    }
    boolean(t) {
        if ("boolean" == typeof t) return t
        if ("string" == typeof t) {
            if ("true" === (t = t.toLowerCase())) return !0
            if ("false" === t) return !1
        }
        throw new Error("invalid boolean - " + t)
    }
    hex(t, e) {
        return "string" == typeof t && (e || "0x" === t.substring(0, 2) || (t = "0x" + t), Ni(t))
            ? t.toLowerCase()
            : Wu.throwArgumentError("invalid hash", "value", t)
    }
    data(t, e) {
        const r = this.hex(t, e)
        if (r.length % 2 != 0) throw new Error("invalid data; odd-length - " + t)
        return r
    }
    address(t) {
        return vo(t)
    }
    callAddress(t) {
        if (!Ni(t, 32)) return null
        const e = vo(Ii(t, 12))
        return "0x0000000000000000000000000000000000000000" === e ? null : e
    }
    contractAddress(t) {
        return (function (t) {
            let e = null
            try {
                e = vo(t.from)
            } catch (r) {
                fo.throwArgumentError("missing from address", "transaction", t)
            }
            return vo(Ii(no(lo([e, Ai(Mi(qi.from(t.nonce).toHexString()))])), 12))
        })(t)
    }
    blockTag(t) {
        if (null == t) return "latest"
        if ("earliest" === t) return "0x0"
        if ("latest" === t || "pending" === t) return t
        if ("number" == typeof t || Ni(t)) return Ti(t)
        throw new Error("invalid blockTag")
    }
    hash(t, e) {
        const r = this.hex(t, e)
        return 32 !== Si(r) ? Wu.throwArgumentError("invalid hash", "value", t) : r
    }
    difficulty(t) {
        if (null == t) return null
        const e = qi.from(t)
        try {
            return e.toNumber()
        } catch (r) {}
        return null
    }
    uint256(t) {
        if (!Ni(t)) throw new Error("invalid uint256")
        return Oi(t, 32)
    }
    _block(t, e) {
        return null != t.author && null == t.miner && (t.miner = t.author), Ku.check(e, t)
    }
    block(t) {
        return this._block(t, this.formats.block)
    }
    blockWithTransactions(t) {
        return this._block(t, this.formats.blockWithTransactions)
    }
    transactionRequest(t) {
        return Ku.check(this.formats.transactionRequest, t)
    }
    transactionResponse(t) {
        null != t.gas && null == t.gasLimit && (t.gasLimit = t.gas),
            t.to && qi.from(t.to).isZero() && (t.to = "0x0000000000000000000000000000000000000000"),
            null != t.input && null == t.data && (t.data = t.input),
            null == t.to && null == t.creates && (t.creates = this.contractAddress(t)),
            1 === t.type && null == t.accessList && (t.accessList = [])
        const e = Ku.check(this.formats.transaction, t)
        if (null != t.chainId) {
            let r = t.chainId
            Ni(r) && (r = qi.from(r).toNumber()), (e.chainId = r)
        } else {
            let r = t.networkId
            null == r && null == e.v && (r = t.chainId),
                Ni(r) && (r = qi.from(r).toNumber()),
                "number" != typeof r && null != e.v && ((r = (e.v - 35) / 2), r < 0 && (r = 0), (r = parseInt(r))),
                "number" != typeof r && (r = 0),
                (e.chainId = r)
        }
        return e.blockHash && "x" === e.blockHash.replace(/0/g, "") && (e.blockHash = null), e
    }
    transaction(t) {
        return vu(t)
    }
    receiptLog(t) {
        return Ku.check(this.formats.receiptLog, t)
    }
    receipt(t) {
        const e = Ku.check(this.formats.receipt, t)
        if (null != e.root)
            if (e.root.length <= 4) {
                const t = qi.from(e.root).toNumber()
                0 === t || 1 === t
                    ? (null != e.status &&
                          e.status !== t &&
                          Wu.throwArgumentError("alt-root-status/status mismatch", "value", { root: e.root, status: e.status }),
                      (e.status = t),
                      delete e.root)
                    : Wu.throwArgumentError("invalid alt-root-status", "value.root", e.root)
            } else 66 !== e.root.length && Wu.throwArgumentError("invalid root hash", "value.root", e.root)
        return null != e.status && (e.byzantium = !0), e
    }
    topics(t) {
        return Array.isArray(t) ? t.map((t) => this.topics(t)) : null != t ? this.hash(t, !0) : null
    }
    filter(t) {
        return Ku.check(this.formats.filter, t)
    }
    filterLog(t) {
        return Ku.check(this.formats.filterLog, t)
    }
    static check(t, e) {
        const r = {}
        for (const i in t)
            try {
                const n = t[i](e[i])
                void 0 !== n && (r[i] = n)
            } catch (n) {
                throw ((n.checkKey = i), (n.checkValue = e[i]), n)
            }
        return r
    }
    static allowNull(t, e) {
        return function (r) {
            return null == r ? e : t(r)
        }
    }
    static allowFalsish(t, e) {
        return function (r) {
            return r ? t(r) : e
        }
    }
    static arrayOf(t) {
        return function (e) {
            if (!Array.isArray(e)) throw new Error("not an array")
            const r = []
            return (
                e.forEach(function (e) {
                    r.push(t(e))
                }),
                r
            )
        }
    }
}
var Ju = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const Xu = new yi(Vu)
function Zu(t) {
    return null == t ? "null" : (32 !== Si(t) && Xu.throwArgumentError("invalid topic", "topic", t), t.toLowerCase())
}
function Qu(t) {
    for (t = t.slice(); t.length > 0 && null == t[t.length - 1]; ) t.pop()
    return t
        .map((t) => {
            if (Array.isArray(t)) {
                const e = {}
                t.forEach((t) => {
                    e[Zu(t)] = !0
                })
                const r = Object.keys(e)
                return r.sort(), r.join("|")
            }
            return Zu(t)
        })
        .join("&")
}
function Yu(t) {
    if ("string" == typeof t) {
        if (32 === Si((t = t.toLowerCase()))) return "tx:" + t
        if (-1 === t.indexOf(":")) return t
    } else {
        if (Array.isArray(t)) return "filter:*:" + Qu(t)
        if (
            class extends class {
                constructor(t) {
                    for (const e in t) this[e] = Yi(t[e])
                }
            } {
                static isForkEvent(t) {
                    return !(!t || !t._isForkEvent)
                }
            }.isForkEvent(t)
        )
            throw (Xu.warn("not implemented"), new Error("not implemented"))
        if (t && "object" == typeof t) return "filter:" + (t.address || "*") + ":" + Qu(t.topics || [])
    }
    throw new Error("invalid event - " + t)
}
function th() {
    return new Date().getTime()
}
function eh(t) {
    return new Promise((e) => {
        setTimeout(e, t)
    })
}
const rh = ["block", "network", "pending", "poll"]
class nh {
    constructor(t, e, r) {
        Vi(this, "tag", t), Vi(this, "listener", e), Vi(this, "once", r)
    }
    get event() {
        switch (this.type) {
            case "tx":
                return this.hash
            case "filter":
                return this.filter
        }
        return this.tag
    }
    get type() {
        return this.tag.split(":")[0]
    }
    get hash() {
        const t = this.tag.split(":")
        return "tx" !== t[0] ? null : t[1]
    }
    get filter() {
        const t = this.tag.split(":")
        if ("filter" !== t[0]) return null
        const e = t[1],
            r =
                "" === (n = t[2])
                    ? []
                    : n.split(/&/g).map((t) => {
                          if ("" === t) return []
                          const e = t.split("|").map((t) => ("null" === t ? null : t))
                          return 1 === e.length ? e[0] : e
                      })
        var n
        const i = {}
        return r.length > 0 && (i.topics = r), e && "*" !== e && (i.address = e), i
    }
    pollable() {
        return this.tag.indexOf(":") >= 0 || rh.indexOf(this.tag) >= 0
    }
}
const ih = {
    0: { symbol: "btc", p2pkh: 0, p2sh: 5, prefix: "bc" },
    2: { symbol: "ltc", p2pkh: 48, p2sh: 50, prefix: "ltc" },
    3: { symbol: "doge", p2pkh: 30, p2sh: 22 },
    60: { symbol: "eth", ilk: "eth" },
    61: { symbol: "etc", ilk: "eth" },
    700: { symbol: "xdai", ilk: "eth" },
}
function oh(t) {
    return Oi(qi.from(t).toHexString(), 32)
}
function sh(t) {
    return bu.encode(xi([t, Ii(wu(wu(t)), 0, 4)]))
}
class ah {
    constructor(t, e, r) {
        Vi(this, "provider", t), Vi(this, "name", r), Vi(this, "address", t.formatter.address(e))
    }
    _fetchBytes(t, e) {
        return Ju(this, void 0, void 0, function* () {
            const r = { to: this.address, data: Ri([t, Vo(this.name), e || "0x"]) }
            try {
                const t = yield this.provider.call(r)
                if ("0x" === t) return null
                const e = qi.from(Ii(t, 0, 32)).toNumber(),
                    n = qi.from(Ii(t, e, e + 32)).toNumber()
                return Ii(t, e + 32, e + 32 + n)
            } catch (n) {
                return n.code, yi.errors.CALL_EXCEPTION, null
            }
        })
    }
    _getAddress(t, e) {
        const r = ih[String(t)]
        if (
            (null == r && Xu.throwError(`unsupported coin type: ${t}`, yi.errors.UNSUPPORTED_OPERATION, { operation: `getAddress(${t})` }),
            "eth" === r.ilk)
        )
            return this.provider.formatter.address(e)
        const n = Mi(e)
        if (null != r.p2pkh) {
            const t = e.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/)
            if (t) {
                const e = parseInt(t[1], 16)
                if (t[2].length === 2 * e && e >= 1 && e <= 75) return sh(xi([[r.p2pkh], "0x" + t[2]]))
            }
        }
        if (null != r.p2sh) {
            const t = e.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/)
            if (t) {
                const e = parseInt(t[1], 16)
                if (t[2].length === 2 * e && e >= 1 && e <= 75) return sh(xi([[r.p2sh], "0x" + t[2]]))
            }
        }
        if (null != r.prefix) {
            const t = n[1]
            let e = n[0]
            if ((0 === e ? 20 !== t && 32 !== t && (e = -1) : (e = -1), e >= 0 && n.length === 2 + t && t >= 1 && t <= 75)) {
                const t = Hu.toWords(n.slice(2))
                return t.unshift(e), Hu.encode(r.prefix, t)
            }
        }
        return null
    }
    getAddress(t) {
        return Ju(this, void 0, void 0, function* () {
            if ((null == t && (t = 60), 60 === t))
                try {
                    const t = { to: this.address, data: "0x3b3b57de" + Vo(this.name).substring(2) },
                        e = yield this.provider.call(t)
                    return "0x" === e || "0x0000000000000000000000000000000000000000000000000000000000000000" === e
                        ? null
                        : this.provider.formatter.callAddress(e)
                } catch (n) {
                    if (n.code === yi.errors.CALL_EXCEPTION) return null
                    throw n
                }
            const e = yield this._fetchBytes("0xf1cb7e06", oh(t))
            if (null == e || "0x" === e) return null
            const r = this._getAddress(t, e)
            return (
                null == r &&
                    Xu.throwError("invalid or unsupported coin data", yi.errors.UNSUPPORTED_OPERATION, {
                        operation: `getAddress(${t})`,
                        coinType: t,
                        data: e,
                    }),
                r
            )
        })
    }
    getContentHash() {
        return Ju(this, void 0, void 0, function* () {
            const t = yield this._fetchBytes("0xbc1c58d1")
            if (null == t || "0x" === t) return null
            const e = t.match(/^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/)
            if (e) {
                const t = parseInt(e[3], 16)
                if (e[4].length === 2 * t) return "ipfs://" + bu.encode("0x" + e[1])
            }
            const r = t.match(/^0xe40101fa011b20([0-9a-f]*)$/)
            return r && 64 === r[1].length
                ? "bzz://" + r[1]
                : Xu.throwError("invalid or unsupported content hash data", yi.errors.UNSUPPORTED_OPERATION, {
                      operation: "getContentHash()",
                      data: t,
                  })
        })
    }
    getText(t) {
        return Ju(this, void 0, void 0, function* () {
            let e = No(t)
            ;(e = xi([oh(64), oh(e.length), e])), e.length % 32 != 0 && (e = xi([e, Oi("0x", 32 - (t.length % 32))]))
            const r = yield this._fetchBytes("0x59d1d43c", Pi(e))
            return null == r || "0x" === r ? null : So(r)
        })
    }
}
let lh = null,
    uh = 1
class hh extends cs {
    constructor(t) {
        if (
            (Xu.checkNew(new.target, cs),
            super(),
            (this._events = []),
            (this._emitted = { block: -2 }),
            (this.formatter = new.target.getFormatter()),
            Vi(this, "anyNetwork", "any" === t),
            this.anyNetwork && (t = this.detectNetwork()),
            t instanceof Promise)
        )
            (this._networkPromise = t), t.catch((t) => {}), this._ready().catch((t) => {})
        else {
            const e = Wi(new.target, "getNetwork")(t)
            e ? (Vi(this, "_network", e), this.emit("network", e, null)) : Xu.throwArgumentError("invalid network", "network", t)
        }
        ;(this._maxInternalBlockNumber = -1024), (this._lastBlockNumber = -2), (this._pollingInterval = 4e3), (this._fastQueryDate = 0)
    }
    _ready() {
        return Ju(this, void 0, void 0, function* () {
            if (null == this._network) {
                let e = null
                if (this._networkPromise)
                    try {
                        e = yield this._networkPromise
                    } catch (t) {}
                null == e && (e = yield this.detectNetwork()),
                    e || Xu.throwError("no network detected", yi.errors.UNKNOWN_ERROR, {}),
                    null == this._network && (this.anyNetwork ? (this._network = e) : Vi(this, "_network", e), this.emit("network", e, null))
            }
            return this._network
        })
    }
    get ready() {
        return Fu(() =>
            this._ready().then(
                (t) => t,
                (t) => {
                    if (t.code !== yi.errors.NETWORK_ERROR || "noNetwork" !== t.event) throw t
                }
            )
        )
    }
    static getFormatter() {
        return null == lh && (lh = new Ku()), lh
    }
    static getNetwork(t) {
        return (function (t) {
            if (null == t) return null
            if ("number" == typeof t) {
                for (const e in Nu) {
                    const r = Nu[e]
                    if (r.chainId === t)
                        return {
                            name: r.name,
                            chainId: r.chainId,
                            ensAddress: r.ensAddress || null,
                            _defaultProvider: r._defaultProvider || null,
                        }
                }
                return { chainId: t, name: "unknown" }
            }
            if ("string" == typeof t) {
                const e = Nu[t]
                return null == e
                    ? null
                    : { name: e.name, chainId: e.chainId, ensAddress: e.ensAddress, _defaultProvider: e._defaultProvider || null }
            }
            const e = Nu[t.name]
            if (!e) return "number" != typeof t.chainId && _u.throwArgumentError("invalid network chainId", "network", t), t
            0 !== t.chainId && t.chainId !== e.chainId && _u.throwArgumentError("network chainId mismatch", "network", t)
            let r = t._defaultProvider || null
            var n
            return (
                null == r &&
                    e._defaultProvider &&
                    (r = (n = e._defaultProvider) && "function" == typeof n.renetwork ? e._defaultProvider.renetwork(t) : e._defaultProvider),
                { name: t.name, chainId: e.chainId, ensAddress: t.ensAddress || e.ensAddress || null, _defaultProvider: r }
            )
        })(null == t ? "homestead" : t)
    }
    _getInternalBlockNumber(t) {
        return Ju(this, void 0, void 0, function* () {
            if ((yield this._ready(), t > 0))
                for (; this._internalBlockNumber; ) {
                    const e = this._internalBlockNumber
                    try {
                        const r = yield e
                        if (th() - r.respTime <= t) return r.blockNumber
                        break
                    } catch (n) {
                        if (this._internalBlockNumber === e) break
                    }
                }
            const e = th(),
                r = Ki({
                    blockNumber: this.perform("getBlockNumber", {}),
                    networkError: this.getNetwork().then(
                        (t) => null,
                        (t) => t
                    ),
                }).then(({ blockNumber: t, networkError: n }) => {
                    if (n) throw (this._internalBlockNumber === r && (this._internalBlockNumber = null), n)
                    const i = th()
                    return (
                        (t = qi.from(t).toNumber()) < this._maxInternalBlockNumber && (t = this._maxInternalBlockNumber),
                        (this._maxInternalBlockNumber = t),
                        this._setFastBlockNumber(t),
                        { blockNumber: t, reqTime: e, respTime: i }
                    )
                })
            return (
                (this._internalBlockNumber = r),
                r.catch((t) => {
                    this._internalBlockNumber === r && (this._internalBlockNumber = null)
                }),
                (yield r).blockNumber
            )
        })
    }
    poll() {
        return Ju(this, void 0, void 0, function* () {
            const t = uh++,
                e = []
            let r = null
            try {
                r = yield this._getInternalBlockNumber(100 + this.pollingInterval / 2)
            } catch (n) {
                return void this.emit("error", n)
            }
            if ((this._setFastBlockNumber(r), this.emit("poll", t, r), r !== this._lastBlockNumber)) {
                if ((-2 === this._emitted.block && (this._emitted.block = r - 1), Math.abs(this._emitted.block - r) > 1e3))
                    Xu.warn(`network block skew detected; skipping block events (emitted=${this._emitted.block} blockNumber${r})`),
                        this.emit(
                            "error",
                            Xu.makeError("network block skew detected", yi.errors.NETWORK_ERROR, {
                                blockNumber: r,
                                event: "blockSkew",
                                previousBlockNumber: this._emitted.block,
                            })
                        ),
                        this.emit("block", r)
                else for (let t = this._emitted.block + 1; t <= r; t++) this.emit("block", t)
                this._emitted.block !== r &&
                    ((this._emitted.block = r),
                    Object.keys(this._emitted).forEach((t) => {
                        if ("block" === t) return
                        const e = this._emitted[t]
                        "pending" !== e && r - e > 12 && delete this._emitted[t]
                    })),
                    -2 === this._lastBlockNumber && (this._lastBlockNumber = r - 1),
                    this._events.forEach((t) => {
                        switch (t.type) {
                            case "tx": {
                                const r = t.hash
                                let n = this.getTransactionReceipt(r)
                                    .then((t) =>
                                        t && null != t.blockNumber ? ((this._emitted["t:" + r] = t.blockNumber), this.emit(r, t), null) : null
                                    )
                                    .catch((t) => {
                                        this.emit("error", t)
                                    })
                                e.push(n)
                                break
                            }
                            case "filter": {
                                const n = t.filter
                                ;(n.fromBlock = this._lastBlockNumber + 1), (n.toBlock = r)
                                const i = this.getLogs(n)
                                    .then((t) => {
                                        0 !== t.length &&
                                            t.forEach((t) => {
                                                ;(this._emitted["b:" + t.blockHash] = t.blockNumber),
                                                    (this._emitted["t:" + t.transactionHash] = t.blockNumber),
                                                    this.emit(n, t)
                                            })
                                    })
                                    .catch((t) => {
                                        this.emit("error", t)
                                    })
                                e.push(i)
                                break
                            }
                        }
                    }),
                    (this._lastBlockNumber = r),
                    Promise.all(e)
                        .then(() => {
                            this.emit("didPoll", t)
                        })
                        .catch((t) => {
                            this.emit("error", t)
                        })
            } else this.emit("didPoll", t)
        })
    }
    resetEventsBlock(t) {
        ;(this._lastBlockNumber = t - 1), this.polling && this.poll()
    }
    get network() {
        return this._network
    }
    detectNetwork() {
        return Ju(this, void 0, void 0, function* () {
            return Xu.throwError("provider does not support network detection", yi.errors.UNSUPPORTED_OPERATION, {
                operation: "provider.detectNetwork",
            })
        })
    }
    getNetwork() {
        return Ju(this, void 0, void 0, function* () {
            const t = yield this._ready(),
                e = yield this.detectNetwork()
            if (t.chainId !== e.chainId) {
                if (this.anyNetwork)
                    return (
                        (this._network = e),
                        (this._lastBlockNumber = -2),
                        (this._fastBlockNumber = null),
                        (this._fastBlockNumberPromise = null),
                        (this._fastQueryDate = 0),
                        (this._emitted.block = -2),
                        (this._maxInternalBlockNumber = -1024),
                        (this._internalBlockNumber = null),
                        this.emit("network", e, t),
                        yield eh(0),
                        this._network
                    )
                const r = Xu.makeError("underlying network changed", yi.errors.NETWORK_ERROR, {
                    event: "changed",
                    network: t,
                    detectedNetwork: e,
                })
                throw (this.emit("error", r), r)
            }
            return t
        })
    }
    get blockNumber() {
        return (
            this._getInternalBlockNumber(100 + this.pollingInterval / 2).then(
                (t) => {
                    this._setFastBlockNumber(t)
                },
                (t) => {}
            ),
            null != this._fastBlockNumber ? this._fastBlockNumber : -1
        )
    }
    get polling() {
        return null != this._poller
    }
    set polling(t) {
        t && !this._poller
            ? ((this._poller = setInterval(() => {
                  this.poll()
              }, this.pollingInterval)),
              this._bootstrapPoll ||
                  (this._bootstrapPoll = setTimeout(() => {
                      this.poll(),
                          (this._bootstrapPoll = setTimeout(() => {
                              this._poller || this.poll(), (this._bootstrapPoll = null)
                          }, this.pollingInterval))
                  }, 0)))
            : !t && this._poller && (clearInterval(this._poller), (this._poller = null))
    }
    get pollingInterval() {
        return this._pollingInterval
    }
    set pollingInterval(t) {
        if ("number" != typeof t || t <= 0 || parseInt(String(t)) != t) throw new Error("invalid polling interval")
        ;(this._pollingInterval = t),
            this._poller &&
                (clearInterval(this._poller),
                (this._poller = setInterval(() => {
                    this.poll()
                }, this._pollingInterval)))
    }
    _getFastBlockNumber() {
        const t = th()
        return (
            t - this._fastQueryDate > 2 * this._pollingInterval &&
                ((this._fastQueryDate = t),
                (this._fastBlockNumberPromise = this.getBlockNumber().then(
                    (t) => ((null == this._fastBlockNumber || t > this._fastBlockNumber) && (this._fastBlockNumber = t), this._fastBlockNumber)
                ))),
            this._fastBlockNumberPromise
        )
    }
    _setFastBlockNumber(t) {
        ;(null != this._fastBlockNumber && t < this._fastBlockNumber) ||
            ((this._fastQueryDate = th()),
            (null == this._fastBlockNumber || t > this._fastBlockNumber) &&
                ((this._fastBlockNumber = t), (this._fastBlockNumberPromise = Promise.resolve(t))))
    }
    waitForTransaction(t, e, r) {
        return Ju(this, void 0, void 0, function* () {
            return this._waitForTransaction(t, null == e ? 1 : e, r || 0, null)
        })
    }
    _waitForTransaction(t, e, r, n) {
        return Ju(this, void 0, void 0, function* () {
            const i = yield this.getTransactionReceipt(t)
            return (i ? i.confirmations : 0) >= e
                ? i
                : new Promise((i, o) => {
                      const s = []
                      let a = !1
                      const l = function () {
                              return (
                                  !!a ||
                                  ((a = !0),
                                  s.forEach((t) => {
                                      t()
                                  }),
                                  !1)
                              )
                          },
                          u = (t) => {
                              t.confirmations < e || l() || i(t)
                          }
                      if (
                          (this.on(t, u),
                          s.push(() => {
                              this.removeListener(t, u)
                          }),
                          n)
                      ) {
                          let r = n.startBlock,
                              i = null
                          const u = (s) =>
                              Ju(this, void 0, void 0, function* () {
                                  a ||
                                      (yield eh(1e3),
                                      this.getTransactionCount(n.from).then(
                                          (h) =>
                                              Ju(this, void 0, void 0, function* () {
                                                  if (!a) {
                                                      if (h <= n.nonce) r = s
                                                      else {
                                                          {
                                                              const e = yield this.getTransaction(t)
                                                              if (e && null != e.blockNumber) return
                                                          }
                                                          for (null == i && ((i = r - 3), i < n.startBlock && (i = n.startBlock)); i <= s; ) {
                                                              if (a) return
                                                              const r = yield this.getBlockWithTransactions(i)
                                                              for (let i = 0; i < r.transactions.length; i++) {
                                                                  const s = r.transactions[i]
                                                                  if (s.hash === t) return
                                                                  if (s.from === n.from && s.nonce === n.nonce) {
                                                                      if (a) return
                                                                      const r = yield this.waitForTransaction(s.hash, e)
                                                                      if (l()) return
                                                                      let i = "replaced"
                                                                      return (
                                                                          s.data === n.data && s.to === n.to && s.value.eq(n.value)
                                                                              ? (i = "repriced")
                                                                              : "0x" === s.data &&
                                                                                s.from === s.to &&
                                                                                s.value.isZero() &&
                                                                                (i = "cancelled"),
                                                                          void o(
                                                                              Xu.makeError(
                                                                                  "transaction was replaced",
                                                                                  yi.errors.TRANSACTION_REPLACED,
                                                                                  {
                                                                                      cancelled: "replaced" === i || "cancelled" === i,
                                                                                      reason: i,
                                                                                      replacement: this._wrapTransaction(s),
                                                                                      hash: t,
                                                                                      receipt: r,
                                                                                  }
                                                                              )
                                                                          )
                                                                      )
                                                                  }
                                                              }
                                                              i++
                                                          }
                                                      }
                                                      a || this.once("block", u)
                                                  }
                                              }),
                                          (t) => {
                                              a || this.once("block", u)
                                          }
                                      ))
                              })
                          if (a) return
                          this.once("block", u),
                              s.push(() => {
                                  this.removeListener("block", u)
                              })
                      }
                      if ("number" == typeof r && r > 0) {
                          const t = setTimeout(() => {
                              l() || o(Xu.makeError("timeout exceeded", yi.errors.TIMEOUT, { timeout: r }))
                          }, r)
                          t.unref && t.unref(),
                              s.push(() => {
                                  clearTimeout(t)
                              })
                      }
                  })
        })
    }
    getBlockNumber() {
        return Ju(this, void 0, void 0, function* () {
            return this._getInternalBlockNumber(0)
        })
    }
    getGasPrice() {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const t = yield this.perform("getGasPrice", {})
            try {
                return qi.from(t)
            } catch (e) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, { method: "getGasPrice", result: t, error: e })
            }
        })
    }
    getBalance(t, e) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const r = yield Ki({ address: this._getAddress(t), blockTag: this._getBlockTag(e) }),
                n = yield this.perform("getBalance", r)
            try {
                return qi.from(n)
            } catch (i) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, { method: "getBalance", params: r, result: n, error: i })
            }
        })
    }
    getTransactionCount(t, e) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const r = yield Ki({ address: this._getAddress(t), blockTag: this._getBlockTag(e) }),
                n = yield this.perform("getTransactionCount", r)
            try {
                return qi.from(n).toNumber()
            } catch (i) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, {
                    method: "getTransactionCount",
                    params: r,
                    result: n,
                    error: i,
                })
            }
        })
    }
    getCode(t, e) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const r = yield Ki({ address: this._getAddress(t), blockTag: this._getBlockTag(e) }),
                n = yield this.perform("getCode", r)
            try {
                return Pi(n)
            } catch (i) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, { method: "getCode", params: r, result: n, error: i })
            }
        })
    }
    getStorageAt(t, e, r) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const n = yield Ki({
                    address: this._getAddress(t),
                    blockTag: this._getBlockTag(r),
                    position: Promise.resolve(e).then((t) => Ti(t)),
                }),
                i = yield this.perform("getStorageAt", n)
            try {
                return Pi(i)
            } catch (o) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, {
                    method: "getStorageAt",
                    params: n,
                    result: i,
                    error: o,
                })
            }
        })
    }
    _wrapTransaction(t, e, r) {
        if (null != e && 32 !== Si(e)) throw new Error("invalid response - sendTransaction")
        const n = t
        return (
            null != e &&
                t.hash !== e &&
                Xu.throwError("Transaction hash mismatch from Provider.sendTransaction.", yi.errors.UNKNOWN_ERROR, {
                    expectedHash: t.hash,
                    returnedHash: e,
                }),
            (n.wait = (e, n) =>
                Ju(this, void 0, void 0, function* () {
                    let i
                    null == e && (e = 1),
                        null == n && (n = 0),
                        0 !== e && null != r && (i = { data: t.data, from: t.from, nonce: t.nonce, to: t.to, value: t.value, startBlock: r })
                    const o = yield this._waitForTransaction(t.hash, e, n, i)
                    return null == o && 0 === e
                        ? null
                        : ((this._emitted["t:" + t.hash] = o.blockNumber),
                          0 === o.status &&
                              Xu.throwError("transaction failed", yi.errors.CALL_EXCEPTION, {
                                  transactionHash: t.hash,
                                  transaction: t,
                                  receipt: o,
                              }),
                          o)
                })),
            n
        )
    }
    sendTransaction(t) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const e = yield Promise.resolve(t).then((t) => Pi(t)),
                r = this.formatter.transaction(t),
                n = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval)
            try {
                const t = yield this.perform("sendTransaction", { signedTransaction: e })
                return this._wrapTransaction(r, t, n)
            } catch (i) {
                throw ((i.transaction = r), (i.transactionHash = r.hash), i)
            }
        })
    }
    _getTransactionRequest(t) {
        return Ju(this, void 0, void 0, function* () {
            const e = yield t,
                r = {}
            return (
                ["from", "to"].forEach((t) => {
                    null != e[t] && (r[t] = Promise.resolve(e[t]).then((t) => (t ? this._getAddress(t) : null)))
                }),
                ["gasLimit", "gasPrice", "value"].forEach((t) => {
                    null != e[t] && (r[t] = Promise.resolve(e[t]).then((t) => (t ? qi.from(t) : null)))
                }),
                ["type"].forEach((t) => {
                    null != e[t] && (r[t] = Promise.resolve(e[t]).then((t) => (null != t ? t : null)))
                }),
                e.accessList && (r.accessList = this.formatter.accessList(e.accessList)),
                ["data"].forEach((t) => {
                    null != e[t] && (r[t] = Promise.resolve(e[t]).then((t) => (t ? Pi(t) : null)))
                }),
                this.formatter.transactionRequest(yield Ki(r))
            )
        })
    }
    _getFilter(t) {
        return Ju(this, void 0, void 0, function* () {
            t = yield t
            const e = {}
            return (
                null != t.address && (e.address = this._getAddress(t.address)),
                ["blockHash", "topics"].forEach((r) => {
                    null != t[r] && (e[r] = t[r])
                }),
                ["fromBlock", "toBlock"].forEach((r) => {
                    null != t[r] && (e[r] = this._getBlockTag(t[r]))
                }),
                this.formatter.filter(yield Ki(e))
            )
        })
    }
    call(t, e) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const r = yield Ki({ transaction: this._getTransactionRequest(t), blockTag: this._getBlockTag(e) }),
                n = yield this.perform("call", r)
            try {
                return Pi(n)
            } catch (i) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, { method: "call", params: r, result: n, error: i })
            }
        })
    }
    estimateGas(t) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const e = yield Ki({ transaction: this._getTransactionRequest(t) }),
                r = yield this.perform("estimateGas", e)
            try {
                return qi.from(r)
            } catch (n) {
                return Xu.throwError("bad result from backend", yi.errors.SERVER_ERROR, {
                    method: "estimateGas",
                    params: e,
                    result: r,
                    error: n,
                })
            }
        })
    }
    _getAddress(t) {
        return Ju(this, void 0, void 0, function* () {
            const e = yield this.resolveName(t)
            return (
                null == e &&
                    Xu.throwError("ENS name not configured", yi.errors.UNSUPPORTED_OPERATION, {
                        operation: `resolveName(${JSON.stringify(t)})`,
                    }),
                e
            )
        })
    }
    _getBlock(t, e) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork(), (t = yield t)
            let r = -128
            const n = { includeTransactions: !!e }
            if (Ni(t, 32)) n.blockHash = t
            else
                try {
                    ;(n.blockTag = this.formatter.blockTag(yield this._getBlockTag(t))),
                        Ni(n.blockTag) && (r = parseInt(n.blockTag.substring(2), 16))
                } catch (i) {
                    Xu.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", t)
                }
            return Fu(
                () =>
                    Ju(this, void 0, void 0, function* () {
                        const t = yield this.perform("getBlock", n)
                        if (null == t)
                            return (null != n.blockHash && null == this._emitted["b:" + n.blockHash]) ||
                                (null != n.blockTag && r > this._emitted.block)
                                ? null
                                : void 0
                        if (e) {
                            let e = null
                            for (let r = 0; r < t.transactions.length; r++) {
                                const n = t.transactions[r]
                                if (null == n.blockNumber) n.confirmations = 0
                                else if (null == n.confirmations) {
                                    null == e && (e = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval))
                                    let t = e - n.blockNumber + 1
                                    t <= 0 && (t = 1), (n.confirmations = t)
                                }
                            }
                            return this.formatter.blockWithTransactions(t)
                        }
                        return this.formatter.block(t)
                    }),
                { oncePoll: this }
            )
        })
    }
    getBlock(t) {
        return this._getBlock(t, !1)
    }
    getBlockWithTransactions(t) {
        return this._getBlock(t, !0)
    }
    getTransaction(t) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork(), (t = yield t)
            const e = { transactionHash: this.formatter.hash(t, !0) }
            return Fu(
                () =>
                    Ju(this, void 0, void 0, function* () {
                        const r = yield this.perform("getTransaction", e)
                        if (null == r) return null == this._emitted["t:" + t] ? null : void 0
                        const n = this.formatter.transactionResponse(r)
                        if (null == n.blockNumber) n.confirmations = 0
                        else if (null == n.confirmations) {
                            let t = (yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval)) - n.blockNumber + 1
                            t <= 0 && (t = 1), (n.confirmations = t)
                        }
                        return this._wrapTransaction(n)
                    }),
                { oncePoll: this }
            )
        })
    }
    getTransactionReceipt(t) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork(), (t = yield t)
            const e = { transactionHash: this.formatter.hash(t, !0) }
            return Fu(
                () =>
                    Ju(this, void 0, void 0, function* () {
                        const r = yield this.perform("getTransactionReceipt", e)
                        if (null == r) return null == this._emitted["t:" + t] ? null : void 0
                        if (null == r.blockHash) return
                        const n = this.formatter.receipt(r)
                        if (null == n.blockNumber) n.confirmations = 0
                        else if (null == n.confirmations) {
                            let t = (yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval)) - n.blockNumber + 1
                            t <= 0 && (t = 1), (n.confirmations = t)
                        }
                        return n
                    }),
                { oncePoll: this }
            )
        })
    }
    getLogs(t) {
        return Ju(this, void 0, void 0, function* () {
            yield this.getNetwork()
            const e = yield Ki({ filter: this._getFilter(t) }),
                r = yield this.perform("getLogs", e)
            return (
                r.forEach((t) => {
                    null == t.removed && (t.removed = !1)
                }),
                Ku.arrayOf(this.formatter.filterLog.bind(this.formatter))(r)
            )
        })
    }
    getEtherPrice() {
        return Ju(this, void 0, void 0, function* () {
            return yield this.getNetwork(), this.perform("getEtherPrice", {})
        })
    }
    _getBlockTag(t) {
        return Ju(this, void 0, void 0, function* () {
            if ("number" == typeof (t = yield t) && t < 0) {
                t % 1 && Xu.throwArgumentError("invalid BlockTag", "blockTag", t)
                let e = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval)
                return (e += t), e < 0 && (e = 0), this.formatter.blockTag(e)
            }
            return this.formatter.blockTag(t)
        })
    }
    getResolver(t) {
        return Ju(this, void 0, void 0, function* () {
            try {
                const e = yield this._getResolver(t)
                return null == e ? null : new ah(this, e, t)
            } catch (e) {
                return e.code, yi.errors.CALL_EXCEPTION, null
            }
        })
    }
    _getResolver(t) {
        return Ju(this, void 0, void 0, function* () {
            const e = yield this.getNetwork()
            e.ensAddress || Xu.throwError("network does not support ENS", yi.errors.UNSUPPORTED_OPERATION, { operation: "ENS", network: e.name })
            const r = { to: e.ensAddress, data: "0x0178b8bf" + Vo(t).substring(2) }
            try {
                return this.formatter.callAddress(yield this.call(r))
            } catch (n) {
                if (n.code === yi.errors.CALL_EXCEPTION) return null
                throw n
            }
        })
    }
    resolveName(t) {
        return Ju(this, void 0, void 0, function* () {
            t = yield t
            try {
                return Promise.resolve(this.formatter.address(t))
            } catch (r) {
                if (Ni(t)) throw r
            }
            "string" != typeof t && Xu.throwArgumentError("invalid ENS name", "name", t)
            const e = yield this.getResolver(t)
            return e ? yield e.getAddress() : null
        })
    }
    lookupAddress(t) {
        return Ju(this, void 0, void 0, function* () {
            t = yield t
            const e = (t = this.formatter.address(t)).substring(2).toLowerCase() + ".addr.reverse",
                r = yield this._getResolver(e)
            if (!r) return null
            let n = Mi(yield this.call({ to: r, data: "0x691f3431" + Vo(e).substring(2) }))
            if (n.length < 32 || !qi.from(n.slice(0, 32)).eq(32)) return null
            if (((n = n.slice(32)), n.length < 32)) return null
            const i = qi.from(n.slice(0, 32)).toNumber()
            if (((n = n.slice(32)), i > n.length)) return null
            const o = So(n.slice(0, i))
            return (yield this.resolveName(o)) != t ? null : o
        })
    }
    perform(t, e) {
        return Xu.throwError(t + " not implemented", yi.errors.NOT_IMPLEMENTED, { operation: t })
    }
    _startEvent(t) {
        this.polling = this._events.filter((t) => t.pollable()).length > 0
    }
    _stopEvent(t) {
        this.polling = this._events.filter((t) => t.pollable()).length > 0
    }
    _addEventListener(t, e, r) {
        const n = new nh(Yu(t), e, r)
        return this._events.push(n), this._startEvent(n), this
    }
    on(t, e) {
        return this._addEventListener(t, e, !1)
    }
    once(t, e) {
        return this._addEventListener(t, e, !0)
    }
    emit(t, ...e) {
        let r = !1,
            n = [],
            i = Yu(t)
        return (
            (this._events = this._events.filter(
                (t) =>
                    t.tag !== i ||
                    (setTimeout(() => {
                        t.listener.apply(this, e)
                    }, 0),
                    (r = !0),
                    !t.once || (n.push(t), !1))
            )),
            n.forEach((t) => {
                this._stopEvent(t)
            }),
            r
        )
    }
    listenerCount(t) {
        if (!t) return this._events.length
        let e = Yu(t)
        return this._events.filter((t) => t.tag === e).length
    }
    listeners(t) {
        if (null == t) return this._events.map((t) => t.listener)
        let e = Yu(t)
        return this._events.filter((t) => t.tag === e).map((t) => t.listener)
    }
    off(t, e) {
        if (null == e) return this.removeAllListeners(t)
        const r = []
        let n = !1,
            i = Yu(t)
        return (
            (this._events = this._events.filter((t) => t.tag !== i || t.listener != e || !!n || ((n = !0), r.push(t), !1))),
            r.forEach((t) => {
                this._stopEvent(t)
            }),
            this
        )
    }
    removeAllListeners(t) {
        let e = []
        if (null == t) (e = this._events), (this._events = [])
        else {
            const r = Yu(t)
            this._events = this._events.filter((t) => t.tag !== r || (e.push(t), !1))
        }
        return (
            e.forEach((t) => {
                this._stopEvent(t)
            }),
            this
        )
    }
}
var ch = function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
        function s(t) {
            try {
                l(n.next(t))
            } catch (e) {
                o(e)
            }
        }
        function a(t) {
            try {
                l(n.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function l(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof r
                      ? e
                      : new r(function (t) {
                            t(e)
                        })).then(s, a)
        }
        l((n = n.apply(t, e || [])).next())
    })
}
const fh = new yi(Vu),
    dh = ["call", "estimateGas"]
function ph(t, e, r) {
    if ("call" === t && e.code === yi.errors.SERVER_ERROR) {
        const t = e.error
        if (t && t.message.match("reverted") && Ni(t.data)) return t.data
        fh.throwError("missing revert data in call exception", yi.errors.CALL_EXCEPTION, { error: e, data: "0x" })
    }
    let n = e.message
    e.code === yi.errors.SERVER_ERROR && e.error && "string" == typeof e.error.message
        ? (n = e.error.message)
        : "string" == typeof e.body
        ? (n = e.body)
        : "string" == typeof e.responseText && (n = e.responseText),
        (n = (n || "").toLowerCase())
    const i = r.transaction || r.signedTransaction
    throw (
        (n.match(/insufficient funds/) &&
            fh.throwError("insufficient funds for intrinsic transaction cost", yi.errors.INSUFFICIENT_FUNDS, {
                error: e,
                method: t,
                transaction: i,
            }),
        n.match(/nonce too low/) &&
            fh.throwError("nonce has already been used", yi.errors.NONCE_EXPIRED, { error: e, method: t, transaction: i }),
        n.match(/replacement transaction underpriced/) &&
            fh.throwError("replacement fee too low", yi.errors.REPLACEMENT_UNDERPRICED, { error: e, method: t, transaction: i }),
        n.match(/only replay-protected/) &&
            fh.throwError("legacy pre-eip-155 transactions not supported", yi.errors.UNSUPPORTED_OPERATION, {
                error: e,
                method: t,
                transaction: i,
            }),
        dh.indexOf(t) >= 0 &&
            n.match(/gas required exceeds allowance|always failing transaction|execution reverted/) &&
            fh.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", yi.errors.UNPREDICTABLE_GAS_LIMIT, {
                error: e,
                method: t,
                transaction: i,
            }),
        e)
    )
}
function mh(t) {
    return new Promise(function (e) {
        setTimeout(e, t)
    })
}
function gh(t) {
    if (t.error) {
        const e = new Error(t.error.message)
        throw ((e.code = t.error.code), (e.data = t.error.data), e)
    }
    return t.result
}
function vh(t) {
    return t ? t.toLowerCase() : t
}
const yh = {}
class bh extends gs {
    constructor(t, e, r) {
        if ((fh.checkNew(new.target, bh), super(), t !== yh))
            throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner")
        Vi(this, "provider", e),
            null == r && (r = 0),
            "string" == typeof r
                ? (Vi(this, "_address", this.provider.formatter.address(r)), Vi(this, "_index", null))
                : "number" == typeof r
                ? (Vi(this, "_index", r), Vi(this, "_address", null))
                : fh.throwArgumentError("invalid address or index", "addressOrIndex", r)
    }
    connect(t) {
        return fh.throwError("cannot alter JSON-RPC Signer connection", yi.errors.UNSUPPORTED_OPERATION, { operation: "connect" })
    }
    connectUnchecked() {
        return new wh(yh, this.provider, this._address || this._index)
    }
    getAddress() {
        return this._address
            ? Promise.resolve(this._address)
            : this.provider
                  .send("eth_accounts", [])
                  .then(
                      (t) => (
                          t.length <= this._index &&
                              fh.throwError("unknown account #" + this._index, yi.errors.UNSUPPORTED_OPERATION, { operation: "getAddress" }),
                          this.provider.formatter.address(t[this._index])
                      )
                  )
    }
    sendUncheckedTransaction(t) {
        t = Ji(t)
        const e = this.getAddress().then((t) => (t && (t = t.toLowerCase()), t))
        if (null == t.gasLimit) {
            const r = Ji(t)
            ;(r.from = e), (t.gasLimit = this.provider.estimateGas(r))
        }
        return (
            null != t.to &&
                (t.to = Promise.resolve(t.to).then((t) =>
                    ch(this, void 0, void 0, function* () {
                        if (null == t) return null
                        const e = yield this.provider.resolveName(t)
                        return null == e && fh.throwArgumentError("provided ENS name resolves to null", "tx.to", t), e
                    })
                )),
            Ki({ tx: Ki(t), sender: e }).then(({ tx: e, sender: r }) => {
                null != e.from ? e.from.toLowerCase() !== r && fh.throwArgumentError("from address mismatch", "transaction", t) : (e.from = r)
                const n = this.provider.constructor.hexlifyTransaction(e, { from: !0 })
                return this.provider.send("eth_sendTransaction", [n]).then(
                    (t) => t,
                    (t) => ph("sendTransaction", t, n)
                )
            })
        )
    }
    signTransaction(t) {
        return fh.throwError("signing transactions is unsupported", yi.errors.UNSUPPORTED_OPERATION, { operation: "signTransaction" })
    }
    sendTransaction(t) {
        return ch(this, void 0, void 0, function* () {
            const e = yield this.provider._getInternalBlockNumber(100 + 2 * this.provider.pollingInterval),
                r = yield this.sendUncheckedTransaction(t)
            try {
                return yield Fu(
                    () =>
                        ch(this, void 0, void 0, function* () {
                            const t = yield this.provider.getTransaction(r)
                            if (null !== t) return this.provider._wrapTransaction(t, r, e)
                        }),
                    { oncePoll: this.provider }
                )
            } catch (n) {
                throw ((n.transactionHash = r), n)
            }
        })
    }
    signMessage(t) {
        return ch(this, void 0, void 0, function* () {
            const e = "string" == typeof t ? No(t) : t,
                r = yield this.getAddress()
            return yield this.provider.send("eth_sign", [r.toLowerCase(), Pi(e)])
        })
    }
    _signTypedData(t, e, r) {
        return ch(this, void 0, void 0, function* () {
            const n = yield ls.resolveNames(t, e, r, (t) => this.provider.resolveName(t)),
                i = yield this.getAddress()
            return yield this.provider.send("eth_signTypedData_v4", [i.toLowerCase(), JSON.stringify(ls.getPayload(n.domain, e, n.value))])
        })
    }
    unlock(t) {
        return ch(this, void 0, void 0, function* () {
            const e = this.provider,
                r = yield this.getAddress()
            return e.send("personal_unlockAccount", [r.toLowerCase(), t, null])
        })
    }
}
class wh extends bh {
    sendTransaction(t) {
        return this.sendUncheckedTransaction(t).then((t) => ({
            hash: t,
            nonce: null,
            gasLimit: null,
            gasPrice: null,
            data: null,
            value: null,
            chainId: null,
            confirmations: 0,
            from: null,
            wait: (e) => this.provider.waitForTransaction(t, e),
        }))
    }
}
const _h = {
    chainId: !0,
    data: !0,
    gasLimit: !0,
    gasPrice: !0,
    nonce: !0,
    to: !0,
    value: !0,
    type: !0,
    accessList: !0,
    maxFeePerGas: !0,
    maxPriorityFeePerGas: !0,
}
class Eh extends hh {
    constructor(t, e) {
        fh.checkNew(new.target, Eh)
        let r = e
        null == r &&
            (r = new Promise((t, e) => {
                setTimeout(() => {
                    this.detectNetwork().then(
                        (e) => {
                            t(e)
                        },
                        (t) => {
                            e(t)
                        }
                    )
                }, 0)
            })),
            super(r),
            t || (t = Wi(this.constructor, "defaultUrl")()),
            Vi(this, "connection", "string" == typeof t ? Object.freeze({ url: t }) : Object.freeze(Ji(t))),
            (this._nextId = 42)
    }
    get _cache() {
        return null == this._eventLoopCache && (this._eventLoopCache = {}), this._eventLoopCache
    }
    static defaultUrl() {
        return "http://localhost:8545"
    }
    detectNetwork() {
        return (
            this._cache.detectNetwork ||
                ((this._cache.detectNetwork = this._uncachedDetectNetwork()),
                setTimeout(() => {
                    this._cache.detectNetwork = null
                }, 0)),
            this._cache.detectNetwork
        )
    }
    _uncachedDetectNetwork() {
        return ch(this, void 0, void 0, function* () {
            yield mh(0)
            let t = null
            try {
                t = yield this.send("eth_chainId", [])
            } catch (e) {
                try {
                    t = yield this.send("net_version", [])
                } catch (r) {}
            }
            if (null != t) {
                const r = Wi(this.constructor, "getNetwork")
                try {
                    return r(qi.from(t).toNumber())
                } catch (e) {
                    return fh.throwError("could not detect network", yi.errors.NETWORK_ERROR, {
                        chainId: t,
                        event: "invalidNetwork",
                        serverError: e,
                    })
                }
            }
            return fh.throwError("could not detect network", yi.errors.NETWORK_ERROR, { event: "noNetwork" })
        })
    }
    getSigner(t) {
        return new bh(yh, this, t)
    }
    getUncheckedSigner(t) {
        return this.getSigner(t).connectUnchecked()
    }
    listAccounts() {
        return this.send("eth_accounts", []).then((t) => t.map((t) => this.formatter.address(t)))
    }
    send(t, e) {
        const r = { method: t, params: e, id: this._nextId++, jsonrpc: "2.0" }
        this.emit("debug", { action: "request", request: Yi(r), provider: this })
        const n = ["eth_chainId", "eth_blockNumber"].indexOf(t) >= 0
        if (n && this._cache[t]) return this._cache[t]
        const i = Bu(this.connection, JSON.stringify(r), gh).then(
            (t) => (this.emit("debug", { action: "response", request: r, response: t, provider: this }), t),
            (t) => {
                throw (this.emit("debug", { action: "response", error: t, request: r, provider: this }), t)
            }
        )
        return (
            n &&
                ((this._cache[t] = i),
                setTimeout(() => {
                    this._cache[t] = null
                }, 0)),
            i
        )
    }
    prepareRequest(t, e) {
        switch (t) {
            case "getBlockNumber":
                return ["eth_blockNumber", []]
            case "getGasPrice":
                return ["eth_gasPrice", []]
            case "getBalance":
                return ["eth_getBalance", [vh(e.address), e.blockTag]]
            case "getTransactionCount":
                return ["eth_getTransactionCount", [vh(e.address), e.blockTag]]
            case "getCode":
                return ["eth_getCode", [vh(e.address), e.blockTag]]
            case "getStorageAt":
                return ["eth_getStorageAt", [vh(e.address), e.position, e.blockTag]]
            case "sendTransaction":
                return ["eth_sendRawTransaction", [e.signedTransaction]]
            case "getBlock":
                return e.blockTag
                    ? ["eth_getBlockByNumber", [e.blockTag, !!e.includeTransactions]]
                    : e.blockHash
                    ? ["eth_getBlockByHash", [e.blockHash, !!e.includeTransactions]]
                    : null
            case "getTransaction":
                return ["eth_getTransactionByHash", [e.transactionHash]]
            case "getTransactionReceipt":
                return ["eth_getTransactionReceipt", [e.transactionHash]]
            case "call":
                return ["eth_call", [Wi(this.constructor, "hexlifyTransaction")(e.transaction, { from: !0 }), e.blockTag]]
            case "estimateGas":
                return ["eth_estimateGas", [Wi(this.constructor, "hexlifyTransaction")(e.transaction, { from: !0 })]]
            case "getLogs":
                return e.filter && null != e.filter.address && (e.filter.address = vh(e.filter.address)), ["eth_getLogs", [e.filter]]
        }
        return null
    }
    perform(t, e) {
        return ch(this, void 0, void 0, function* () {
            const r = this.prepareRequest(t, e)
            null == r && fh.throwError(t + " not implemented", yi.errors.NOT_IMPLEMENTED, { operation: t })
            try {
                return yield this.send(r[0], r[1])
            } catch (n) {
                return ph(t, n, e)
            }
        })
    }
    _startEvent(t) {
        "pending" === t.tag && this._startPending(), super._startEvent(t)
    }
    _startPending() {
        if (null != this._pendingFilter) return
        const t = this,
            e = this.send("eth_newPendingTransactionFilter", [])
        ;(this._pendingFilter = e),
            e
                .then(function (r) {
                    return (
                        (function n() {
                            t.send("eth_getFilterChanges", [r])
                                .then(function (r) {
                                    if (t._pendingFilter != e) return null
                                    let n = Promise.resolve()
                                    return (
                                        r.forEach(function (e) {
                                            ;(t._emitted["t:" + e.toLowerCase()] = "pending"),
                                                (n = n.then(function () {
                                                    return t.getTransaction(e).then(function (e) {
                                                        return t.emit("pending", e), null
                                                    })
                                                }))
                                        }),
                                        n.then(function () {
                                            return mh(1e3)
                                        })
                                    )
                                })
                                .then(function () {
                                    if (t._pendingFilter == e)
                                        return (
                                            setTimeout(function () {
                                                n()
                                            }, 0),
                                            null
                                        )
                                    t.send("eth_uninstallFilter", [r])
                                })
                                .catch((t) => {})
                        })(),
                        r
                    )
                })
                .catch((t) => {})
    }
    _stopEvent(t) {
        "pending" === t.tag && 0 === this.listenerCount("pending") && (this._pendingFilter = null), super._stopEvent(t)
    }
    static hexlifyTransaction(t, e) {
        const r = Ji(_h)
        if (e) for (const s in e) e[s] && (r[s] = !0)
        var n, i
        ;(i = r),
            ((n = t) && "object" == typeof n) || Hi.throwArgumentError("invalid object", "object", n),
            Object.keys(n).forEach((t) => {
                i[t] || Hi.throwArgumentError("invalid object key - " + t, "transaction:" + t, n)
            })
        const o = {}
        return (
            ["gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach(function (e) {
                if (null == t[e]) return
                const r = Ti(t[e])
                "gasLimit" === e && (e = "gas"), (o[e] = r)
            }),
            ["from", "to", "data"].forEach(function (e) {
                null != t[e] && (o[e] = Pi(t[e]))
            }),
            t.accessList && (o.accessList = fu(t.accessList)),
            o
        )
    }
}
const kh = new yi(Vu)
let Mh = 1
function xh(t, e) {
    const r = "Web3LegacyFetcher"
    return function (n, i) {
        "eth_sign" == n && (t.isMetaMask || t.isStatus) && ((n = "personal_sign"), (i = [i[1], i[0]]))
        const o = { method: n, params: i, id: Mh++, jsonrpc: "2.0" }
        return new Promise((t, n) => {
            this.emit("debug", { action: "request", fetcher: r, request: Yi(o), provider: this }),
                e(o, (e, i) => {
                    if (e) return this.emit("debug", { action: "response", fetcher: r, error: e, request: o, provider: this }), n(e)
                    if ((this.emit("debug", { action: "response", fetcher: r, request: o, response: i, provider: this }), i.error)) {
                        const t = new Error(i.error.message)
                        return (t.code = i.error.code), (t.data = i.error.data), n(t)
                    }
                    t(i.result)
                })
        })
    }
}
class Ah extends Eh {
    constructor(t, e) {
        kh.checkNew(new.target, Ah), null == t && kh.throwArgumentError("missing provider", "provider", t)
        let r = null,
            n = null,
            i = null
        "function" == typeof t
            ? ((r = "unknown:"), (n = t))
            : ((r = t.host || t.path || ""),
              !r && t.isMetaMask && (r = "metamask"),
              (i = t),
              t.request
                  ? ("" === r && (r = "eip-1193:"),
                    (n = (function (t) {
                        return function (e, r) {
                            null == r && (r = []), "eth_sign" == e && (t.isMetaMask || t.isStatus) && ((e = "personal_sign"), (r = [r[1], r[0]]))
                            const n = { method: e, params: r }
                            return (
                                this.emit("debug", { action: "request", fetcher: "Eip1193Fetcher", request: Yi(n), provider: this }),
                                t.request(n).then(
                                    (t) => (
                                        this.emit("debug", {
                                            action: "response",
                                            fetcher: "Eip1193Fetcher",
                                            request: n,
                                            response: t,
                                            provider: this,
                                        }),
                                        t
                                    ),
                                    (t) => {
                                        throw (
                                            (this.emit("debug", {
                                                action: "response",
                                                fetcher: "Eip1193Fetcher",
                                                request: n,
                                                error: t,
                                                provider: this,
                                            }),
                                            t)
                                        )
                                    }
                                )
                            )
                        }
                    })(t)))
                  : t.sendAsync
                  ? (n = xh(t, t.sendAsync.bind(t)))
                  : t.send
                  ? (n = xh(t, t.send.bind(t)))
                  : kh.throwArgumentError("unsupported provider", "provider", t),
              r || (r = "unknown:")),
            super(r, e),
            Vi(this, "jsonRpcFetchFunc", n),
            Vi(this, "provider", i)
    }
    send(t, e) {
        return this.jsonRpcFetchFunc(t, e)
    }
}
new yi("ethers/5.4.1")
/*!
 * vue-router v4.0.10
 * (c) 2021 Eduardo San Martin Morote
 * @license MIT
 */
const Nh = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag,
    Ph = (t) => (Nh ? Symbol(t) : "_vr_" + t),
    Sh = Ph("rvlm"),
    Ih = Ph("rvd"),
    Rh = Ph("r"),
    Th = Ph("rl"),
    Oh = Ph("rvl"),
    Ch = "undefined" != typeof window
const Bh = Object.assign
function Fh(t, e) {
    const r = {}
    for (const n in e) {
        const i = e[n]
        r[n] = Array.isArray(i) ? i.map(t) : t(i)
    }
    return r
}
let Lh = () => {}
const Uh = /\/$/
function qh(t, e, r = "/") {
    let n,
        i = {},
        o = "",
        s = ""
    const a = e.indexOf("?"),
        l = e.indexOf("#", a > -1 ? a : 0)
    return (
        a > -1 && ((n = e.slice(0, a)), (o = e.slice(a + 1, l > -1 ? l : e.length)), (i = t(o))),
        l > -1 && ((n = n || e.slice(0, l)), (s = e.slice(l, e.length))),
        (n = (function (t, e) {
            if (t.startsWith("/")) return t
            if (!t) return e
            const r = e.split("/"),
                n = t.split("/")
            let i,
                o,
                s = r.length - 1
            for (i = 0; i < n.length; i++)
                if (((o = n[i]), 1 !== s && "." !== o)) {
                    if (".." !== o) break
                    s--
                }
            return r.slice(0, s).join("/") + "/" + n.slice(i - (i === n.length ? 1 : 0)).join("/")
        })(null != n ? n : e, r)),
        { fullPath: n + (o && "?") + o + s, path: n, query: i, hash: s }
    )
}
function jh(t, e) {
    return e && t.toLowerCase().startsWith(e.toLowerCase()) ? t.slice(e.length) || "/" : t
}
function Dh(t, e) {
    return (t.aliasOf || t) === (e.aliasOf || e)
}
function zh(t, e) {
    if (Object.keys(t).length !== Object.keys(e).length) return !1
    for (let r in t) if (!Gh(t[r], e[r])) return !1
    return !0
}
function Gh(t, e) {
    return Array.isArray(t) ? $h(t, e) : Array.isArray(e) ? $h(e, t) : t === e
}
function $h(t, e) {
    return Array.isArray(e) ? t.length === e.length && t.every((t, r) => t === e[r]) : 1 === t.length && t[0] === e
}
var Hh, Vh, Wh, Kh
function Jh(t) {
    if (!t)
        if (Ch) {
            const e = document.querySelector("base")
            t = (t = (e && e.getAttribute("href")) || "/").replace(/^\w+:\/\/[^\/]+/, "")
        } else t = "/"
    return "/" !== t[0] && "#" !== t[0] && (t = "/" + t), t.replace(Uh, "")
}
;((Vh = Hh || (Hh = {})).pop = "pop"), (Vh.push = "push"), ((Kh = Wh || (Wh = {})).back = "back"), (Kh.forward = "forward"), (Kh.unknown = "")
const Xh = /^[^#]+#/
function Zh(t, e) {
    return t.replace(Xh, "#") + e
}
const Qh = () => ({ left: window.pageXOffset, top: window.pageYOffset })
function Yh(t) {
    let e
    if ("el" in t) {
        let r = t.el
        const n = "string" == typeof r && r.startsWith("#"),
            i = "string" == typeof r ? (n ? document.getElementById(r.slice(1)) : document.querySelector(r)) : r
        if (!i) return
        e = (function (t, e) {
            const r = document.documentElement.getBoundingClientRect(),
                n = t.getBoundingClientRect()
            return { behavior: e.behavior, left: n.left - r.left - (e.left || 0), top: n.top - r.top - (e.top || 0) }
        })(i, t)
    } else e = t
    "scrollBehavior" in document.documentElement.style
        ? window.scrollTo(e)
        : window.scrollTo(null != e.left ? e.left : window.pageXOffset, null != e.top ? e.top : window.pageYOffset)
}
function tc(t, e) {
    return (history.state ? history.state.position - e : -1) + t
}
const ec = new Map()
function rc(t, e) {
    const { pathname: r, search: n, hash: i } = e,
        o = t.indexOf("#")
    if (o > -1) {
        let e = i.includes(t.slice(o)) ? t.slice(o).length : 1,
            r = i.slice(e)
        return "/" !== r[0] && (r = "/" + r), jh(r, "")
    }
    return jh(r, t) + n + i
}
function nc(t, e, r, n = !1, i = !1) {
    return { back: t, current: e, forward: r, replaced: n, position: window.history.length, scroll: i ? Qh() : null }
}
function ic(t) {
    const { history: e, location: r } = window
    let n = { value: rc(t, r) },
        i = { value: e.state }
    function o(n, o, s) {
        const a = t.indexOf("#"),
            l = a > -1 ? (r.host && document.querySelector("base") ? t : t.slice(a)) + n : location.protocol + "//" + location.host + t + n
        try {
            e[s ? "replaceState" : "pushState"](o, "", l), (i.value = o)
        } catch (u) {
            console.error(u), r[s ? "replace" : "assign"](l)
        }
    }
    return (
        i.value || o(n.value, { back: null, current: n.value, forward: null, position: e.length - 1, replaced: !0, scroll: null }, !0),
        {
            location: n,
            state: i,
            push: function (t, r) {
                const s = Bh({}, i.value, e.state, { forward: t, scroll: Qh() })
                o(s.current, s, !0), o(t, Bh({}, nc(n.value, t, null), { position: s.position + 1 }, r), !1), (n.value = t)
            },
            replace: function (t, r) {
                o(t, Bh({}, e.state, nc(i.value.back, t, i.value.forward, !0), r, { position: i.value.position }), !0), (n.value = t)
            },
        }
    )
}
function oc(t) {
    const e = ic((t = Jh(t))),
        r = (function (t, e, r, n) {
            let i = [],
                o = [],
                s = null
            const a = ({ state: o }) => {
                const a = rc(t, location),
                    l = r.value,
                    u = e.value
                let h = 0
                if (o) {
                    if (((r.value = a), (e.value = o), s && s === l)) return void (s = null)
                    h = u ? o.position - u.position : 0
                } else n(a)
                i.forEach((t) => {
                    t(r.value, l, { delta: h, type: Hh.pop, direction: h ? (h > 0 ? Wh.forward : Wh.back) : Wh.unknown })
                })
            }
            function l() {
                const { history: t } = window
                t.state && t.replaceState(Bh({}, t.state, { scroll: Qh() }), "")
            }
            return (
                window.addEventListener("popstate", a),
                window.addEventListener("beforeunload", l),
                {
                    pauseListeners: function () {
                        s = r.value
                    },
                    listen: function (t) {
                        i.push(t)
                        const e = () => {
                            const e = i.indexOf(t)
                            e > -1 && i.splice(e, 1)
                        }
                        return o.push(e), e
                    },
                    destroy: function () {
                        for (const t of o) t()
                        ;(o = []), window.removeEventListener("popstate", a), window.removeEventListener("beforeunload", l)
                    },
                }
            )
        })(t, e.state, e.location, e.replace)
    const n = Bh(
        {
            location: "",
            base: t,
            go: function (t, e = !0) {
                e || r.pauseListeners(), history.go(t)
            },
            createHref: Zh.bind(null, t),
        },
        e,
        r
    )
    return (
        Object.defineProperty(n, "location", { enumerable: !0, get: () => e.location.value }),
        Object.defineProperty(n, "state", { enumerable: !0, get: () => e.state.value }),
        n
    )
}
function sc(t) {
    return (t = location.host ? t || location.pathname + location.search : "").includes("#") || (t += "#"), oc(t)
}
function ac(t) {
    return "string" == typeof t || "symbol" == typeof t
}
const lc = { path: "/", name: void 0, params: {}, query: {}, hash: "", fullPath: "/", matched: [], meta: {}, redirectedFrom: void 0 },
    uc = Ph("nf")
var hc, cc
function fc(t, e) {
    return Bh(new Error(), { type: t, [uc]: !0 }, e)
}
function dc(t, e) {
    return t instanceof Error && uc in t && (null == e || !!(t.type & e))
}
;((cc = hc || (hc = {}))[(cc.aborted = 4)] = "aborted"), (cc[(cc.cancelled = 8)] = "cancelled"), (cc[(cc.duplicated = 16)] = "duplicated")
const pc = { sensitive: !1, strict: !1, start: !0, end: !0 },
    mc = /[.+*?^${}()[\]/\\]/g
function gc(t, e) {
    let r = 0
    for (; r < t.length && r < e.length; ) {
        const n = e[r] - t[r]
        if (n) return n
        r++
    }
    return t.length < e.length ? (1 === t.length && 80 === t[0] ? -1 : 1) : t.length > e.length ? (1 === e.length && 80 === e[0] ? 1 : -1) : 0
}
function vc(t, e) {
    let r = 0
    const n = t.score,
        i = e.score
    for (; r < n.length && r < i.length; ) {
        const t = gc(n[r], i[r])
        if (t) return t
        r++
    }
    return i.length - n.length
}
const yc = { type: 0, value: "" },
    bc = /[a-zA-Z0-9_]/
function wc(t, e, r) {
    const n = (function (t, e) {
            const r = Bh({}, pc, e)
            let n = [],
                i = r.start ? "^" : ""
            const o = []
            for (const l of t) {
                const t = l.length ? [] : [90]
                r.strict && !l.length && (i += "/")
                for (let e = 0; e < l.length; e++) {
                    const n = l[e]
                    let s = 40 + (r.sensitive ? 0.25 : 0)
                    if (0 === n.type) e || (i += "/"), (i += n.value.replace(mc, "\\$&")), (s += 40)
                    else if (1 === n.type) {
                        const { value: t, repeatable: r, optional: u, regexp: h } = n
                        o.push({ name: t, repeatable: r, optional: u })
                        const c = h || "[^/]+?"
                        if ("[^/]+?" !== c) {
                            s += 10
                            try {
                                new RegExp(`(${c})`)
                            } catch (a) {
                                throw new Error(`Invalid custom RegExp for param "${t}" (${c}): ` + a.message)
                            }
                        }
                        let f = r ? `((?:${c})(?:/(?:${c}))*)` : `(${c})`
                        e || (f = u && l.length < 2 ? `(?:/${f})` : "/" + f),
                            u && (f += "?"),
                            (i += f),
                            (s += 20),
                            u && (s += -8),
                            r && (s += -20),
                            ".*" === c && (s += -50)
                    }
                    t.push(s)
                }
                n.push(t)
            }
            if (r.strict && r.end) {
                const t = n.length - 1
                n[t][n[t].length - 1] += 0.7000000000000001
            }
            r.strict || (i += "/?"), r.end ? (i += "$") : r.strict && (i += "(?:/|$)")
            const s = new RegExp(i, r.sensitive ? "" : "i")
            return {
                re: s,
                score: n,
                keys: o,
                parse: function (t) {
                    const e = t.match(s),
                        r = {}
                    if (!e) return null
                    for (let n = 1; n < e.length; n++) {
                        const t = e[n] || "",
                            i = o[n - 1]
                        r[i.name] = t && i.repeatable ? t.split("/") : t
                    }
                    return r
                },
                stringify: function (e) {
                    let r = "",
                        n = !1
                    for (const i of t) {
                        ;(n && r.endsWith("/")) || (r += "/"), (n = !1)
                        for (const t of i)
                            if (0 === t.type) r += t.value
                            else if (1 === t.type) {
                                const { value: o, repeatable: s, optional: a } = t,
                                    l = o in e ? e[o] : ""
                                if (Array.isArray(l) && !s)
                                    throw new Error(`Provided param "${o}" is an array but it is not repeatable (* or + modifiers)`)
                                const u = Array.isArray(l) ? l.join("/") : l
                                if (!u) {
                                    if (!a) throw new Error(`Missing required param "${o}"`)
                                    i.length < 2 && (r.endsWith("/") ? (r = r.slice(0, -1)) : (n = !0))
                                }
                                r += u
                            }
                    }
                    return r
                },
            }
        })(
            (function (t) {
                if (!t) return [[]]
                if ("/" === t) return [[yc]]
                if (!t.startsWith("/")) throw new Error(`Invalid path "${t}"`)
                function e(t) {
                    throw new Error(`ERR (${r})/"${u}": ${t}`)
                }
                let r = 0,
                    n = r
                const i = []
                let o
                function s() {
                    o && i.push(o), (o = [])
                }
                let a,
                    l = 0,
                    u = "",
                    h = ""
                function c() {
                    u &&
                        (0 === r
                            ? o.push({ type: 0, value: u })
                            : 1 === r || 2 === r || 3 === r
                            ? (o.length > 1 &&
                                  ("*" === a || "+" === a) &&
                                  e(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`),
                              o.push({ type: 1, value: u, regexp: h, repeatable: "*" === a || "+" === a, optional: "*" === a || "?" === a }))
                            : e("Invalid state to consume buffer"),
                        (u = ""))
                }
                function f() {
                    u += a
                }
                for (; l < t.length; )
                    if (((a = t[l++]), "\\" !== a || 2 === r))
                        switch (r) {
                            case 0:
                                "/" === a ? (u && c(), s()) : ":" === a ? (c(), (r = 1)) : f()
                                break
                            case 4:
                                f(), (r = n)
                                break
                            case 1:
                                "(" === a ? (r = 2) : bc.test(a) ? f() : (c(), (r = 0), "*" !== a && "?" !== a && "+" !== a && l--)
                                break
                            case 2:
                                ")" === a ? ("\\" == h[h.length - 1] ? (h = h.slice(0, -1) + a) : (r = 3)) : (h += a)
                                break
                            case 3:
                                c(), (r = 0), "*" !== a && "?" !== a && "+" !== a && l--, (h = "")
                                break
                            default:
                                e("Unknown state")
                        }
                    else (n = r), (r = 4)
                return 2 === r && e(`Unfinished custom RegExp for param "${u}"`), c(), s(), i
            })(t.path),
            r
        ),
        i = Bh(n, { record: t, parent: e, children: [], alias: [] })
    return e && !i.record.aliasOf == !e.record.aliasOf && e.children.push(i), i
}
function _c(t, e) {
    const r = [],
        n = new Map()
    function i(t, r, n) {
        let a = !n,
            l = (function (t) {
                return {
                    path: t.path,
                    redirect: t.redirect,
                    name: t.name,
                    meta: t.meta || {},
                    aliasOf: void 0,
                    beforeEnter: t.beforeEnter,
                    props: Ec(t),
                    children: t.children || [],
                    instances: {},
                    leaveGuards: new Set(),
                    updateGuards: new Set(),
                    enterCallbacks: {},
                    components: "components" in t ? t.components || {} : { default: t.component },
                }
            })(t)
        l.aliasOf = n && n.record
        const u = xc(e, t),
            h = [l]
        if ("alias" in t) {
            const e = "string" == typeof t.alias ? [t.alias] : t.alias
            for (const t of e) h.push(Bh({}, l, { components: n ? n.record.components : l.components, path: t, aliasOf: n ? n.record : l }))
        }
        let c, f
        for (const e of h) {
            let { path: h } = e
            if (r && "/" !== h[0]) {
                let t = r.record.path,
                    n = "/" === t[t.length - 1] ? "" : "/"
                e.path = r.record.path + (h && n + h)
            }
            if (
                ((c = wc(e, r, u)),
                n ? n.alias.push(c) : ((f = f || c), f !== c && f.alias.push(c), a && t.name && !kc(c) && o(t.name)),
                "children" in l)
            ) {
                let t = l.children
                for (let e = 0; e < t.length; e++) i(t[e], c, n && n.children[e])
            }
            ;(n = n || c), s(c)
        }
        return f
            ? () => {
                  o(f)
              }
            : Lh
    }
    function o(t) {
        if (ac(t)) {
            const e = n.get(t)
            e && (n.delete(t), r.splice(r.indexOf(e), 1), e.children.forEach(o), e.alias.forEach(o))
        } else {
            let e = r.indexOf(t)
            e > -1 && (r.splice(e, 1), t.record.name && n.delete(t.record.name), t.children.forEach(o), t.alias.forEach(o))
        }
    }
    function s(t) {
        let e = 0
        for (; e < r.length && vc(t, r[e]) >= 0; ) e++
        r.splice(e, 0, t), t.record.name && !kc(t) && n.set(t.record.name, t)
    }
    return (
        (e = xc({ strict: !1, end: !0, sensitive: !1 }, e)),
        t.forEach((t) => i(t)),
        {
            addRoute: i,
            resolve: function (t, e) {
                let i,
                    o,
                    s,
                    a = {}
                if ("name" in t && t.name) {
                    if (((i = n.get(t.name)), !i)) throw fc(1, { location: t })
                    ;(s = i.record.name),
                        (a = Bh(
                            (function (t, e) {
                                let r = {}
                                for (let n of e) n in t && (r[n] = t[n])
                                return r
                            })(
                                e.params,
                                i.keys.filter((t) => !t.optional).map((t) => t.name)
                            ),
                            t.params
                        )),
                        (o = i.stringify(a))
                } else if ("path" in t) (o = t.path), (i = r.find((t) => t.re.test(o))), i && ((a = i.parse(o)), (s = i.record.name))
                else {
                    if (((i = e.name ? n.get(e.name) : r.find((t) => t.re.test(e.path))), !i)) throw fc(1, { location: t, currentLocation: e })
                    ;(s = i.record.name), (a = Bh({}, e.params, t.params)), (o = i.stringify(a))
                }
                const l = []
                let u = i
                for (; u; ) l.unshift(u.record), (u = u.parent)
                return { name: s, path: o, params: a, matched: l, meta: Mc(l) }
            },
            removeRoute: o,
            getRoutes: function () {
                return r
            },
            getRecordMatcher: function (t) {
                return n.get(t)
            },
        }
    )
}
function Ec(t) {
    const e = {},
        r = t.props || !1
    if ("component" in t) e.default = r
    else for (let n in t.components) e[n] = "boolean" == typeof r ? r : r[n]
    return e
}
function kc(t) {
    for (; t; ) {
        if (t.record.aliasOf) return !0
        t = t.parent
    }
    return !1
}
function Mc(t) {
    return t.reduce((t, e) => Bh(t, e.meta), {})
}
function xc(t, e) {
    let r = {}
    for (let n in t) r[n] = n in e ? e[n] : t[n]
    return r
}
const Ac = /#/g,
    Nc = /&/g,
    Pc = /\//g,
    Sc = /=/g,
    Ic = /\?/g,
    Rc = /\+/g,
    Tc = /%5B/g,
    Oc = /%5D/g,
    Cc = /%5E/g,
    Bc = /%60/g,
    Fc = /%7B/g,
    Lc = /%7C/g,
    Uc = /%7D/g,
    qc = /%20/g
function jc(t) {
    return encodeURI("" + t)
        .replace(Lc, "|")
        .replace(Tc, "[")
        .replace(Oc, "]")
}
function Dc(t) {
    return jc(t)
        .replace(Rc, "%2B")
        .replace(qc, "+")
        .replace(Ac, "%23")
        .replace(Nc, "%26")
        .replace(Bc, "`")
        .replace(Fc, "{")
        .replace(Uc, "}")
        .replace(Cc, "^")
}
function zc(t) {
    return (function (t) {
        return jc(t).replace(Ac, "%23").replace(Ic, "%3F")
    })(t).replace(Pc, "%2F")
}
function Gc(t) {
    try {
        return decodeURIComponent("" + t)
    } catch (e) {}
    return "" + t
}
function $c(t) {
    const e = {}
    if ("" === t || "?" === t) return e
    const r = ("?" === t[0] ? t.slice(1) : t).split("&")
    for (let n = 0; n < r.length; ++n) {
        const t = r[n].replace(Rc, " ")
        let i = t.indexOf("="),
            o = Gc(i < 0 ? t : t.slice(0, i)),
            s = i < 0 ? null : Gc(t.slice(i + 1))
        if (o in e) {
            let t = e[o]
            Array.isArray(t) || (t = e[o] = [t]), t.push(s)
        } else e[o] = s
    }
    return e
}
function Hc(t) {
    let e = ""
    for (let r in t) {
        const n = t[r]
        if (((r = Dc(r).replace(Sc, "%3D")), null == n)) {
            void 0 !== n && (e += (e.length ? "&" : "") + r)
            continue
        }
        ;(Array.isArray(n) ? n.map((t) => t && Dc(t)) : [n && Dc(n)]).forEach((t) => {
            void 0 !== t && ((e += (e.length ? "&" : "") + r), null != t && (e += "=" + t))
        })
    }
    return e
}
function Vc(t) {
    const e = {}
    for (let r in t) {
        let n = t[r]
        void 0 !== n && (e[r] = Array.isArray(n) ? n.map((t) => (null == t ? null : "" + t)) : null == n ? n : "" + n)
    }
    return e
}
function Wc() {
    let t = []
    return {
        add: function (e) {
            return (
                t.push(e),
                () => {
                    const r = t.indexOf(e)
                    r > -1 && t.splice(r, 1)
                }
            )
        },
        list: () => t,
        reset: function () {
            t = []
        },
    }
}
function Kc(t, e, r, n, i) {
    const o = n && (n.enterCallbacks[i] = n.enterCallbacks[i] || [])
    return () =>
        new Promise((s, a) => {
            const l = (t) => {
                    var l
                    !1 === t
                        ? a(fc(4, { from: r, to: e }))
                        : t instanceof Error
                        ? a(t)
                        : "string" == typeof (l = t) || (l && "object" == typeof l)
                        ? a(fc(2, { from: e, to: t }))
                        : (o && n.enterCallbacks[i] === o && "function" == typeof t && o.push(t), s())
                },
                u = t.call(n && n.instances[i], e, r, l)
            let h = Promise.resolve(u)
            t.length < 3 && (h = h.then(l)), h.catch((t) => a(t))
        })
}
function Jc(t, e, r, n) {
    const i = []
    for (const s of t)
        for (const t in s.components) {
            let a = s.components[t]
            if ("beforeRouteEnter" === e || s.instances[t])
                if ("object" == typeof (o = a) || "displayName" in o || "props" in o || "__vccOpts" in o) {
                    const o = (a.__vccOpts || a)[e]
                    o && i.push(Kc(o, r, n, s, t))
                } else {
                    let o = a()
                    i.push(() =>
                        o.then((i) => {
                            if (!i) return Promise.reject(new Error(`Couldn't resolve component "${t}" at "${s.path}"`))
                            const o = (a = i).__esModule || (Nh && "Module" === a[Symbol.toStringTag]) ? i.default : i
                            var a
                            s.components[t] = o
                            const l = (o.__vccOpts || o)[e]
                            return l && Kc(l, r, n, s, t)()
                        })
                    )
                }
        }
    var o
    return i
}
function Xc(t) {
    const e = De(Rh),
        r = De(Th),
        n = Bn(() => e.resolve(ee(t.to))),
        i = Bn(() => {
            let { matched: t } = n.value,
                { length: e } = t
            const i = t[e - 1]
            let o = r.matched
            if (!i || !o.length) return -1
            let s = o.findIndex(Dh.bind(null, i))
            if (s > -1) return s
            let a = Qc(t[e - 2])
            return e > 1 && Qc(i) === a && o[o.length - 1].path !== a ? o.findIndex(Dh.bind(null, t[e - 2])) : s
        }),
        o = Bn(
            () =>
                i.value > -1 &&
                (function (t, e) {
                    for (let r in e) {
                        let n = e[r],
                            i = t[r]
                        if ("string" == typeof n) {
                            if (n !== i) return !1
                        } else if (!Array.isArray(i) || i.length !== n.length || n.some((t, e) => t !== i[e])) return !1
                    }
                    return !0
                })(r.params, n.value.params)
        ),
        s = Bn(() => i.value > -1 && i.value === r.matched.length - 1 && zh(r.params, n.value.params))
    return {
        route: n,
        href: Bn(() => n.value.href),
        isActive: o,
        isExactActive: s,
        navigate: function (r = {}) {
            return (function (t) {
                if (t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) return
                if (t.defaultPrevented) return
                if (void 0 !== t.button && 0 !== t.button) return
                if (t.currentTarget && t.currentTarget.getAttribute) {
                    const e = t.currentTarget.getAttribute("target")
                    if (/\b_blank\b/i.test(e)) return
                }
                t.preventDefault && t.preventDefault()
                return !0
            })(r)
                ? e[ee(t.replace) ? "replace" : "push"](ee(t.to)).catch(Lh)
                : Promise.resolve()
        },
    }
}
const Zc = Ke({
    name: "RouterLink",
    props: {
        to: { type: [String, Object], required: !0 },
        replace: Boolean,
        activeClass: String,
        exactActiveClass: String,
        custom: Boolean,
        ariaCurrentValue: { type: String, default: "page" },
    },
    useLink: Xc,
    setup(t, { slots: e }) {
        const r = zt(Xc(t)),
            { options: n } = De(Rh),
            i = Bn(() => ({
                [Yc(t.activeClass, n.linkActiveClass, "router-link-active")]: r.isActive,
                [Yc(t.exactActiveClass, n.linkExactActiveClass, "router-link-exact-active")]: r.isExactActive,
            }))
        return () => {
            const n = e.default && e.default(r)
            return t.custom
                ? n
                : Fn("a", { "aria-current": r.isExactActive ? t.ariaCurrentValue : null, href: r.href, onClick: r.navigate, class: i.value }, n)
        }
    },
})
function Qc(t) {
    return t ? (t.aliasOf ? t.aliasOf.path : t.path) : ""
}
const Yc = (t, e, r) => (null != t ? t : null != e ? e : r)
function tf(t, e) {
    if (!t) return null
    const r = t(e)
    return 1 === r.length ? r[0] : r
}
const ef = Ke({
    name: "RouterView",
    inheritAttrs: !1,
    props: { name: { type: String, default: "default" }, route: Object },
    setup(t, { attrs: e, slots: r }) {
        const n = De(Oh),
            i = Bn(() => t.route || n.value),
            o = De(Ih, 0),
            s = Bn(() => i.value.matched[o])
        je(Ih, o + 1), je(Sh, s), je(Oh, i)
        const a = Qt()
        return (
            Ge(
                () => [a.value, s.value, t.name],
                ([t, e, r], [n, i, o]) => {
                    e &&
                        ((e.instances[r] = t),
                        i &&
                            i !== e &&
                            t &&
                            t === n &&
                            (e.leaveGuards.size || (e.leaveGuards = i.leaveGuards), e.updateGuards.size || (e.updateGuards = i.updateGuards))),
                        !t || !e || (i && Dh(e, i) && n) || (e.enterCallbacks[r] || []).forEach((e) => e(t))
                },
                { flush: "post" }
            ),
            () => {
                const n = i.value,
                    o = s.value,
                    l = o && o.components[t.name],
                    u = t.name
                if (!l) return tf(r.default, { Component: l, route: n })
                const h = o.props[t.name],
                    c = h ? (!0 === h ? n.params : "function" == typeof h ? h(n) : h) : null,
                    f = Fn(
                        l,
                        Bh({}, c, e, {
                            onVnodeUnmounted: (t) => {
                                t.component.isUnmounted && (o.instances[u] = null)
                            },
                            ref: a,
                        })
                    )
                return tf(r.default, { Component: f, route: n }) || f
            }
        )
    },
})
function rf(t) {
    const e = _c(t.routes, t)
    let r = t.parseQuery || $c,
        n = t.stringifyQuery || Hc,
        i = t.history
    const o = Wc(),
        s = Wc(),
        a = Wc(),
        l = te(lc, !0)
    let u = lc
    Ch && t.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual")
    const h = Fh.bind(null, (t) => "" + t),
        c = Fh.bind(null, zc),
        f = Fh.bind(null, Gc)
    function d(t, o) {
        if (((o = Bh({}, o || l.value)), "string" == typeof t)) {
            let n = qh(r, t, o.path),
                s = e.resolve({ path: n.path }, o),
                a = i.createHref(n.fullPath)
            return Bh(n, s, { params: f(s.params), hash: Gc(n.hash), redirectedFrom: void 0, href: a })
        }
        let s
        "path" in t
            ? (s = Bh({}, t, { path: qh(r, t.path, o.path).path }))
            : ((s = Bh({}, t, { params: c(t.params) })), (o.params = c(o.params)))
        let a = e.resolve(s, o)
        const u = t.hash || ""
        a.params = h(f(a.params))
        const d = (function (t, e) {
            let r = e.query ? t(e.query) : ""
            return e.path + (r && "?") + r + (e.hash || "")
        })(n, Bh({}, t, { hash: ((p = u), jc(p).replace(Fc, "{").replace(Uc, "}").replace(Cc, "^")), path: a.path }))
        var p
        let m = i.createHref(d)
        return Bh({ fullPath: d, hash: u, query: n === Hc ? Vc(t.query) : t.query }, a, { redirectedFrom: void 0, href: m })
    }
    function p(t) {
        return "string" == typeof t ? qh(r, t, l.value.path) : Bh({}, t)
    }
    function m(t, e) {
        if (u !== t) return fc(8, { from: e, to: t })
    }
    function g(t) {
        return y(t)
    }
    function v(t) {
        const e = t.matched[t.matched.length - 1]
        if (e && e.redirect) {
            const { redirect: r } = e
            let n = "function" == typeof r ? r(t) : r
            return (
                "string" == typeof n && ((n = n.includes("?") || n.includes("#") ? (n = p(n)) : { path: n }), (n.params = {})),
                Bh({ query: t.query, hash: t.hash, params: t.params }, n)
            )
        }
    }
    function y(t, e) {
        const r = (u = d(t)),
            i = l.value,
            o = t.state,
            s = t.force,
            a = !0 === t.replace,
            h = v(r)
        if (h) return y(Bh(p(h), { state: o, force: s, replace: a }), e || r)
        const c = r
        let f
        return (
            (c.redirectedFrom = e),
            !s &&
                (function (t, e, r) {
                    let n = e.matched.length - 1,
                        i = r.matched.length - 1
                    return (
                        n > -1 &&
                        n === i &&
                        Dh(e.matched[n], r.matched[i]) &&
                        zh(e.params, r.params) &&
                        t(e.query) === t(r.query) &&
                        e.hash === r.hash
                    )
                })(n, i, r) &&
                ((f = fc(16, { to: c, from: i })), I(i, i, !0, !1)),
            (f ? Promise.resolve(f) : w(c, i))
                .catch((t) => (dc(t) ? t : P(t, c, i)))
                .then((t) => {
                    if (t) {
                        if (dc(t, 2)) return y(Bh(p(t.to), { state: o, force: s, replace: a }), e || c)
                    } else t = E(c, i, !0, a, o)
                    return _(c, i, t), t
                })
        )
    }
    function b(t, e) {
        const r = m(t, e)
        return r ? Promise.reject(r) : Promise.resolve()
    }
    function w(t, e) {
        let r
        const [n, i, a] = (function (t, e) {
            const r = [],
                n = [],
                i = [],
                o = Math.max(e.matched.length, t.matched.length)
            for (let s = 0; s < o; s++) {
                const o = e.matched[s]
                o && (t.matched.find((t) => Dh(t, o)) ? n.push(o) : r.push(o))
                const a = t.matched[s]
                a && (e.matched.find((t) => Dh(t, a)) || i.push(a))
            }
            return [r, n, i]
        })(t, e)
        r = Jc(n.reverse(), "beforeRouteLeave", t, e)
        for (const o of n)
            o.leaveGuards.forEach((n) => {
                r.push(Kc(n, t, e))
            })
        const l = b.bind(null, t, e)
        return (
            r.push(l),
            nf(r)
                .then(() => {
                    r = []
                    for (const n of o.list()) r.push(Kc(n, t, e))
                    return r.push(l), nf(r)
                })
                .then(() => {
                    r = Jc(i, "beforeRouteUpdate", t, e)
                    for (const n of i)
                        n.updateGuards.forEach((n) => {
                            r.push(Kc(n, t, e))
                        })
                    return r.push(l), nf(r)
                })
                .then(() => {
                    r = []
                    for (const n of t.matched)
                        if (n.beforeEnter && !e.matched.includes(n))
                            if (Array.isArray(n.beforeEnter)) for (const i of n.beforeEnter) r.push(Kc(i, t, e))
                            else r.push(Kc(n.beforeEnter, t, e))
                    return r.push(l), nf(r)
                })
                .then(() => (t.matched.forEach((t) => (t.enterCallbacks = {})), (r = Jc(a, "beforeRouteEnter", t, e)), r.push(l), nf(r)))
                .then(() => {
                    r = []
                    for (const n of s.list()) r.push(Kc(n, t, e))
                    return r.push(l), nf(r)
                })
                .catch((t) => (dc(t, 8) ? t : Promise.reject(t)))
        )
    }
    function _(t, e, r) {
        for (const n of a.list()) n(t, e, r)
    }
    function E(t, e, r, n, o) {
        const s = m(t, e)
        if (s) return s
        const a = e === lc,
            u = Ch ? history.state : {}
        r && (n || a ? i.replace(t.fullPath, Bh({ scroll: a && u && u.scroll }, o)) : i.push(t.fullPath, o)), (l.value = t), I(t, e, r, a), S()
    }
    let k
    function M() {
        k = i.listen((t, e, r) => {
            let n = d(t)
            const o = v(n)
            if (o) return void y(Bh(o, { replace: !0 }), n).catch(Lh)
            u = n
            const s = l.value
            var a, h
            Ch && ((a = tc(s.fullPath, r.delta)), (h = Qh()), ec.set(a, h)),
                w(n, s)
                    .catch((t) =>
                        dc(t, 12)
                            ? t
                            : dc(t, 2)
                            ? (y(t.to, n)
                                  .then((t) => {
                                      dc(t, 20) && !r.delta && r.type === Hh.pop && i.go(-1, !1)
                                  })
                                  .catch(Lh),
                              Promise.reject())
                            : (r.delta && i.go(-r.delta, !1), P(t, n, s))
                    )
                    .then((t) => {
                        ;(t = t || E(n, s, !1)) && (r.delta ? i.go(-r.delta, !1) : r.type === Hh.pop && dc(t, 20) && i.go(-1, !1)), _(n, s, t)
                    })
                    .catch(Lh)
        })
    }
    let x,
        A = Wc(),
        N = Wc()
    function P(t, e, r) {
        S(t)
        const n = N.list()
        return n.length ? n.forEach((n) => n(t, e, r)) : console.error(t), Promise.reject(t)
    }
    function S(t) {
        x || ((x = !0), M(), A.list().forEach(([e, r]) => (t ? r(t) : e())), A.reset())
    }
    function I(e, r, n, i) {
        const { scrollBehavior: o } = t
        if (!Ch || !o) return Promise.resolve()
        let s =
            (!n &&
                (function (t) {
                    const e = ec.get(t)
                    return ec.delete(t), e
                })(tc(e.fullPath, 0))) ||
            ((i || !n) && history.state && history.state.scroll) ||
            null
        return _e()
            .then(() => o(e, r, s))
            .then((t) => t && Yh(t))
            .catch((t) => P(t, e, r))
    }
    const R = (t) => i.go(t)
    let T
    const O = new Set()
    return {
        currentRoute: l,
        addRoute: function (t, r) {
            let n, i
            return ac(t) ? ((n = e.getRecordMatcher(t)), (i = r)) : (i = t), e.addRoute(i, n)
        },
        removeRoute: function (t) {
            let r = e.getRecordMatcher(t)
            r && e.removeRoute(r)
        },
        hasRoute: function (t) {
            return !!e.getRecordMatcher(t)
        },
        getRoutes: function () {
            return e.getRoutes().map((t) => t.record)
        },
        resolve: d,
        options: t,
        push: g,
        replace: function (t) {
            return g(Bh(p(t), { replace: !0 }))
        },
        go: R,
        back: () => R(-1),
        forward: () => R(1),
        beforeEach: o.add,
        beforeResolve: s.add,
        afterEach: a.add,
        onError: N.add,
        isReady: function () {
            return x && l.value !== lc
                ? Promise.resolve()
                : new Promise((t, e) => {
                      A.add([t, e])
                  })
        },
        install(t) {
            t.component("RouterLink", Zc),
                t.component("RouterView", ef),
                (t.config.globalProperties.$router = this),
                Object.defineProperty(t.config.globalProperties, "$route", { enumerable: !0, get: () => ee(l) }),
                Ch && !T && l.value === lc && ((T = !0), g(i.location).catch((t) => {}))
            const e = {}
            for (let n in lc) e[n] = Bn(() => l.value[n])
            t.provide(Rh, this), t.provide(Th, zt(e)), t.provide(Oh, l)
            let r = t.unmount
            O.add(t),
                (t.unmount = function () {
                    O.delete(t), O.size < 1 && (k(), (l.value = lc), (T = !1), (x = !1)), r()
                })
        },
    }
}
function nf(t) {
    return t.reduce((t, e) => t.then(() => e()), Promise.resolve())
}
export { qi as B, Xr as F, Ah as W, Qt as a, fn as b, sn as c, Ke as d, Wr as e, pn as f, rf as g, sc as h, ri as i, rn as o, yn as r, Be as w }
