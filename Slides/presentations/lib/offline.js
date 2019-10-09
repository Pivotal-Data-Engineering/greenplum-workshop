!function (t) {
    function e(t, e, r, n, i) {
        this._listener = e, this._isOnce = r, this.context = n, this._signal = t, this._priority = i || 0
    }

    function r(t, e) {
        if ("function" != typeof t) throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", e))
    }

    function n() {
        this._bindings = [], this._prevParams = null;
        var t = this;
        this.dispatch = function () {
            n.prototype.dispatch.apply(t, arguments)
        }
    }

    e.prototype = {
        active: !0, params: null, execute: function (t) {
            var e, r;
            return this.active && this._listener && (r = this.params ? this.params.concat(t) : t, e = this._listener.apply(this.context, r), this._isOnce && this.detach()), e
        }, detach: function () {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null
        }, isBound: function () {
            return !!this._signal && !!this._listener
        }, isOnce: function () {
            return this._isOnce
        }, getListener: function () {
            return this._listener
        }, getSignal: function () {
            return this._signal
        }, _destroy: function () {
            delete this._signal, delete this._listener, delete this.context
        }, toString: function () {
            return "[SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]"
        }
    }, n.prototype = {
        VERSION: "1.0.0", memorize: !1, _shouldPropagate: !0, active: !0, _registerListener: function (t, r, n, i) {
            var a, o = this._indexOfListener(t, n);
            if (o !== -1) {
                if (a = this._bindings[o], a.isOnce() !== r) throw new Error("You cannot add" + (r ? "" : "Once") + "() then add" + (r ? "Once" : "") + "() the same listener without removing the relationship first.")
            } else a = new e(this, t, r, n, i), this._addBinding(a);
            return this.memorize && this._prevParams && a.execute(this._prevParams), a
        }, _addBinding: function (t) {
            var e = this._bindings.length;
            do --e; while (this._bindings[e] && t._priority <= this._bindings[e]._priority);
            this._bindings.splice(e + 1, 0, t)
        }, _indexOfListener: function (t, e) {
            for (var r, n = this._bindings.length; n--;) if (r = this._bindings[n], r._listener === t && r.context === e) return n;
            return -1
        }, has: function (t, e) {
            return this._indexOfListener(t, e) !== -1
        }, add: function (t, e, n) {
            return r(t, "add"), this._registerListener(t, !1, e, n)
        }, addOnce: function (t, e, n) {
            return r(t, "addOnce"), this._registerListener(t, !0, e, n)
        }, remove: function (t, e) {
            r(t, "remove");
            var n = this._indexOfListener(t, e);
            return n !== -1 && (this._bindings[n]._destroy(), this._bindings.splice(n, 1)), t
        }, removeAll: function () {
            for (var t = this._bindings.length; t--;) this._bindings[t]._destroy();
            this._bindings.length = 0
        }, getNumListeners: function () {
            return this._bindings.length
        }, halt: function () {
            this._shouldPropagate = !1
        }, dispatch: function () {
            if (this.active) {
                var t, e = Array.prototype.slice.call(arguments), r = this._bindings.length;
                if (this.memorize && (this._prevParams = e), r) {
                    t = this._bindings.slice(), this._shouldPropagate = !0;
                    do r--; while (t[r] && this._shouldPropagate && t[r].execute(e) !== !1)
                }
            }
        }, forget: function () {
            this._prevParams = null
        }, dispose: function () {
            this.removeAll(), delete this._bindings, delete this._prevParams
        }, toString: function () {
            return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]"
        }
    };
    var i = n;
    i.Signal = n, "function" == typeof define && define.amd ? define(function () {
        return i
    }) : "undefined" != typeof module && module.exports ? module.exports = i : t.signals = i
}(this), function (t, e, r) {
    function n(t, e) {
        return typeof t === e
    }

    function i() {
        var t, e, r, i, a, o, s;
        for (var l in w) if (w.hasOwnProperty(l)) {
            if (t = [], e = w[l], e.name && (t.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length)) for (r = 0; r < e.options.aliases.length; r++) t.push(e.options.aliases[r].toLowerCase());
            for (i = n(e.fn, "function") ? e.fn() : e.fn, a = 0; a < t.length; a++) o = t[a], s = o.split("."), 1 === s.length ? S[s[0]] = i : (!S[s[0]] || S[s[0]] instanceof Boolean || (S[s[0]] = new Boolean(S[s[0]])), S[s[0]][s[1]] = i), b.push((i ? "" : "no-") + s.join("-"))
        }
    }

    function a(t) {
        var e = A.className, r = S._config.classPrefix || "";
        if (z && (e = e.baseVal), S._config.enableJSClass) {
            var n = new RegExp("(^|\\s)" + r + "no-js(\\s|$)");
            e = e.replace(n, "$1" + r + "js$2")
        }
        S._config.enableClasses && (e += " " + r + t.join(" " + r), z ? A.className.baseVal = e : A.className = e)
    }

    function o() {
        return "function" != typeof e.createElement ? e.createElement(arguments[0]) : z ? e.createElementNS.call(e, "http://www.w3.org/2000/svg", arguments[0]) : e.createElement.apply(e, arguments)
    }

    function s(t, e) {
        return !!~("" + t).indexOf(e)
    }

    function l(t) {
        return t.replace(/([a-z])-([a-z])/g, function (t, e, r) {
            return e + r.toUpperCase()
        }).replace(/^-/, "")
    }

    function h() {
        var t = e.body;
        return t || (t = o(z ? "svg" : "body"), t.fake = !0), t
    }

    function c(t, r, n, i) {
        var a, s, l, c, m = "modernizr", u = o("div"), d = h();
        if (parseInt(n, 10)) for (; n--;) l = o("div"), l.id = i ? i[n] : m + (n + 1), u.appendChild(l);
        return a = o("style"), a.type = "text/css", a.id = "s" + m, (d.fake ? d : u).appendChild(a), d.appendChild(u), a.styleSheet ? a.styleSheet.cssText = t : a.appendChild(e.createTextNode(t)), u.id = m, d.fake && (d.style.background = "", d.style.overflow = "hidden", c = A.style.overflow, A.style.overflow = "hidden", A.appendChild(d)), s = r(u, t), d.fake ? (d.parentNode.removeChild(d), A.style.overflow = c, A.offsetHeight) : u.parentNode.removeChild(u), !!s
    }

    function m(t, e) {
        if ("object" == typeof t) for (var r in t) I(t, r) && m(r, t[r]); else {
            t = t.toLowerCase();
            var n = t.split("."), i = S[n[0]];
            if (2 == n.length && (i = i[n[1]]), "undefined" != typeof i) return S;
            e = "function" == typeof e ? e() : e, 1 == n.length ? S[n[0]] = e : (!S[n[0]] || S[n[0]] instanceof Boolean || (S[n[0]] = new Boolean(S[n[0]])), S[n[0]][n[1]] = e), a([(e && 0 != e ? "" : "no-") + n.join("-")]), S._trigger(t, e)
        }
        return S
    }

    function u(t, e) {
        return function () {
            return t.apply(e, arguments)
        }
    }

    function d(t, e, r) {
        var i;
        for (var a in t) if (t[a] in e) return r === !1 ? t[a] : (i = e[t[a]], n(i, "function") ? u(i, r || e) : i);
        return !1
    }

    function p(t) {
        return t.replace(/([A-Z])/g, function (t, e) {
            return "-" + e.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function f(e, r, n) {
        var i;
        if ("getComputedStyle" in t) {
            i = getComputedStyle.call(t, e, r);
            var a = t.console;
            if (null !== i) n && (i = i.getPropertyValue(n)); else if (a) {
                var o = a.error ? "error" : "log";
                a[o].call(a, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
            }
        } else i = !r && e.currentStyle && e.currentStyle[n];
        return i
    }

    function g(e, n) {
        var i = e.length;
        if ("CSS" in t && "supports" in t.CSS) {
            for (; i--;) if (t.CSS.supports(p(e[i]), n)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in t) {
            for (var a = []; i--;) a.push("(" + p(e[i]) + ":" + n + ")");
            return a = a.join(" or "), c("@supports (" + a + ") { #modernizr { position: absolute; } }", function (t) {
                return "absolute" == f(t, null, "position")
            })
        }
        return r
    }

    function v(t, e, i, a) {
        function h() {
            m && (delete _.style, delete _.modElem)
        }

        if (a = !n(a, "undefined") && a, !n(i, "undefined")) {
            var c = g(t, i);
            if (!n(c, "undefined")) return c
        }
        for (var m, u, d, p, f, v = ["modernizr", "tspan", "samp"]; !_.style && v.length;) m = !0, _.modElem = o(v.shift()), _.style = _.modElem.style;
        for (d = t.length, u = 0; u < d; u++) if (p = t[u], f = _.style[p], s(p, "-") && (p = l(p)), _.style[p] !== r) {
            if (a || n(i, "undefined")) return h(), "pfx" != e || p;
            try {
                _.style[p] = i
            } catch (t) {
            }
            if (_.style[p] != f) return h(), "pfx" != e || p
        }
        return h(), !1
    }

    function x(t, e, r, i, a) {
        var o = t.charAt(0).toUpperCase() + t.slice(1), s = (t + " " + L.join(o + " ") + o).split(" ");
        return n(e, "string") || n(e, "undefined") ? v(s, e, i, a) : (s = (t + " " + C.join(o + " ") + o).split(" "), d(s, e, r))
    }

    function y(t, e, n) {
        return x(t, r, r, e, n)
    }

    var b = [], w = [], k = {
        _version: "3.5.0",
        _config: {classPrefix: "mz-", enableClasses: !0, enableJSClass: !0, usePrefixes: !0},
        _q: [],
        on: function (t, e) {
            var r = this;
            setTimeout(function () {
                e(r[t])
            }, 0)
        },
        addTest: function (t, e, r) {
            w.push({name: t, fn: e, options: r})
        },
        addAsyncTest: function (t) {
            w.push({name: null, fn: t})
        }
    }, S = function () {
    };
    S.prototype = k, S = new S, S.addTest("history", function () {
        var e = navigator.userAgent;
        return (e.indexOf("Android 2.") === -1 && e.indexOf("Android 4.0") === -1 || e.indexOf("Mobile Safari") === -1 || e.indexOf("Chrome") !== -1 || e.indexOf("Windows Phone") !== -1 || "file:" === location.protocol) && (t.history && "pushState" in t.history)
    }), S.addTest("svg", !!e.createElementNS && !!e.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect), S.addTest("localstorage", function () {
        var t = "modernizr";
        try {
            return localStorage.setItem(t, t), localStorage.removeItem(t), !0
        } catch (t) {
            return !1
        }
    });
    var M = k._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
    k._prefixes = M;
    var A = e.documentElement, z = "svg" === A.nodeName.toLowerCase(), T = "Moz O ms Webkit",
        C = k._config.usePrefixes ? T.toLowerCase().split(" ") : [];
    k._domPrefixes = C, S.addTest("csspositionsticky", function () {
        var t = "position:", e = "sticky", r = o("a"), n = r.style;
        return n.cssText = t + M.join(e + ";" + t).slice(0, -t.length), n.position.indexOf(e) !== -1
    });
    var B = "CSS" in t && "supports" in t.CSS, N = "supportsCSS" in t;
    S.addTest("supports", B || N);
    var L = k._config.usePrefixes ? T.split(" ") : [];
    k._cssomPrefixes = L;
    var E = k.testStyles = c, O = function (e) {
        var n, i = M.length, a = t.CSSRule;
        if ("undefined" == typeof a) return r;
        if (!e) return !1;
        if (e = e.replace(/^@/, ""), n = e.replace(/-/g, "_").toUpperCase() + "_RULE", n in a) return "@" + e;
        for (var o = 0; o < i; o++) {
            var s = M[o], l = s.toUpperCase() + "_" + n;
            if (l in a) return "@-" + s.toLowerCase() + "-" + e
        }
        return !1
    };
    k.atRule = O;
    var I;
    !function () {
        var t = {}.hasOwnProperty;
        I = n(t, "undefined") || n(t.call, "undefined") ? function (t, e) {
            return e in t && n(t.constructor.prototype[e], "undefined")
        } : function (e, r) {
            return t.call(e, r)
        }
    }(), k._l = {}, k.on = function (t, e) {
        this._l[t] || (this._l[t] = []), this._l[t].push(e), S.hasOwnProperty(t) && setTimeout(function () {
            S._trigger(t, S[t])
        }, 0)
    }, k._trigger = function (t, e) {
        if (this._l[t]) {
            var r = this._l[t];
            setTimeout(function () {
                var t, n;
                for (t = 0; t < r.length; t++) (n = r[t])(e)
            }, 0), delete this._l[t]
        }
    }, S._q.push(function () {
        k.addTest = m
    }), S.addAsyncTest(function () {
        var t = new Image;
        t.onerror = function () {
            m("webpanimation", !1, {aliases: ["webp-animation"]})
        }, t.onload = function () {
            m("webpanimation", 1 == t.width, {aliases: ["webp-animation"]})
        }, t.src = "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    });
    var q = {elem: o("modernizr")};
    S._q.push(function () {
        delete q.elem
    });
    var _ = {style: q.elem.style};
    S._q.unshift(function () {
        delete _.style
    });
    k.testProp = function (t, e, n) {
        return v([t], r, e, n)
    };
    k.testAllProps = x, k.testAllProps = y, S.addTest("cssanimations", y("animationName", "a", !0)), S.addTest("backgroundsize", y("backgroundSize", "100%", !0)), S.addTest("cssgridlegacy", y("grid-columns", "10px", !0)), S.addTest("cssgrid", y("grid-template-rows", "none", !0)), S.addTest("flexbox", y("flexBasis", "1px", !0)), S.addTest("csstransforms", function () {
        return navigator.userAgent.indexOf("Android 2.") === -1 && y("transform", "scale(1)", !0)
    }), S.addTest("csstransforms3d", function () {
        var t = !!y("perspective", "1px", !0), e = S._config.usePrefixes;
        if (t && (!e || "webkitPerspective" in A.style)) {
            var r, n = "#modernizr{width:0;height:0}";
            S.supports ? r = "@supports (perspective: 1px)" : (r = "@media (transform-3d)", e && (r += ",(-webkit-transform-3d)")), r += "{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}", E(n + r, function (e) {
                t = 7 === e.offsetWidth && 18 === e.offsetHeight
            })
        }
        return t
    }), S.addTest("csstransitions", y("transition", "all", !0));
    var P = k.prefixed = function (t, e, r) {
        return 0 === t.indexOf("@") ? O(t) : (t.indexOf("-") != -1 && (t = l(t)), e ? x(t, e, r) : x(t, "pfx"))
    };
    S.addTest("fullscreen", !(!P("exitFullscreen", e, !1) && !P("cancelFullScreen", e, !1))), i(), a(b), delete k.addTest, delete k.addAsyncTest;
    for (var R = 0; R < S._q.length; R++) S._q[R]();
    t.Modernizr = S
}(window, document), !function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.katex = e() : t.katex = e()
}("undefined" != typeof self ? self : this, function () {
    return function (t) {
        function e(n) {
            if (r[n]) return r[n].exports;
            var i = r[n] = {i: n, l: !1, exports: {}};
            return t[n].call(i.exports, i, i.exports, e), i.l = !0, i.exports
        }

        var r = {};
        return e.m = t, e.c = r, e.d = function (t, r, n) {
            e.o(t, r) || Object.defineProperty(t, r, {enumerable: !0, get: n})
        }, e.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
        }, e.t = function (t, r) {
            if (1 & r && (t = e(t)), 8 & r) return t;
            if (4 & r && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if (e.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: t
            }), 2 & r && "string" != typeof t) for (var i in t) e.d(n, i, function (e) {
                return t[e]
            }.bind(null, i));
            return n
        }, e.n = function (t) {
            var r = t && t.__esModule ? function () {
                return t["default"]
            } : function () {
                return t
            };
            return e.d(r, "a", r), r
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 1)
    }([function () {
    }, function (t, e, r) {
        "use strict";

        function n(t) {
            for (var e = 0; e < G.length; e += 2) if (t >= G[e] && t <= G[e + 1]) return !0;
            return !1
        }

        function i(t, e, r) {
            if (!at[e]) throw new Error("Font metrics not found for font: " + e + ".");
            var i = t.charCodeAt(0);
            t[0] in st && (i = st[t[0]].charCodeAt(0));
            var a = at[e][i];
            if (a || "text" !== r || n(i) && (a = at[e][77]), a) return {
                depth: a[0],
                height: a[1],
                italic: a[2],
                skew: a[3],
                width: a[4]
            }
        }

        function a(t, e, r, n, i, a) {
            mt[t][i] = {font: e, group: r, replace: n}, a && n && (mt[t][n] = mt[t][i])
        }

        function o(t, e) {
            var r = s(t, e);
            if (!r) throw new Error("Expected node of type " + e + ", but got " + (t ? "node of type " + t.type : String(t)));
            return r
        }

        function s(t, e) {
            return t && t.type === e ? t : null
        }

        function l(t, e) {
            var r = function (t, e) {
                return t && "atom" === t.type && t.family === e ? t : null
            }(t, e);
            if (!r) throw new Error('Expected node of type "atom" and family "' + e + '", but got ' + (t ? "atom" === t.type ? "atom of family " + t.family : "node of type " + t.type : String(t)));
            return r
        }

        function h(t) {
            return t && ("atom" === t.type || ct.hasOwnProperty(t.type)) ? t : null
        }

        function c(t) {
            for (var e = t.type, r = (t.nodeType, t.names), n = t.props, i = t.handler, a = t.htmlBuilder, o = t.mathmlBuilder, s = {
                type: e,
                numArgs: n.numArgs,
                argTypes: n.argTypes,
                greediness: void 0 === n.greediness ? 1 : n.greediness,
                allowedInText: !!n.allowedInText,
                allowedInMath: void 0 === n.allowedInMath || n.allowedInMath,
                numOptionalArgs: n.numOptionalArgs || 0,
                infix: !!n.infix,
                consumeMode: n.consumeMode,
                handler: i
            }, l = 0; l < r.length; ++l) le[r[l]] = s;
            e && (a && (he[e] = a), o && (ce[e] = o))
        }

        function m(t) {
            c({
                type: t.type, names: [], props: {numArgs: 0}, handler: function () {
                    throw new Error("Should never be called.")
                }, htmlBuilder: t.htmlBuilder, mathmlBuilder: t.mathmlBuilder
            })
        }

        function u(t, e) {
            var r = ue(["base"], t, e), n = ue(["strut"]);
            return n.style.height = r.height + r.depth + "em", n.style.verticalAlign = -r.depth + "em", r.children.unshift(n), r
        }

        function d(t, e) {
            var r = null;
            1 === t.length && "tag" === t[0].type && (r = t[0].tag, t = t[0].body);
            for (var n, i = ve(t, e, !0), a = [], o = [], s = 0; s < i.length; s++) if (o.push(i[s]), i[s].hasClass("mbin") || i[s].hasClass("mrel") || i[s].hasClass("allowbreak")) {
                for (var l = !1; s < i.length - 1 && i[s + 1].hasClass("mspace") && !i[s + 1].hasClass("newline");) s++, o.push(i[s]), i[s].hasClass("nobreak") && (l = !0);
                l || (a.push(u(o, e)), o = [])
            } else i[s].hasClass("newline") && (o.pop(), o.length > 0 && (a.push(u(o, e)), o = []), a.push(i[s]));
            o.length > 0 && a.push(u(o, e)), r && ((n = u(ve(r, e, !0))).classes = ["tag"], a.push(n));
            var h = ue(["katex-html"], a);
            if (h.setAttribute("aria-hidden", "true"), n) {
                var c = n.children[0];
                c.style.height = h.height + h.depth + "em", c.style.verticalAlign = -h.depth + "em"
            }
            return h
        }

        function p(t) {
            return new X(t)
        }

        function f(t, e) {
            var r = h(t);
            if (r && O.contains(pr, r.text)) return r;
            throw new C("Invalid delimiter: '" + (r ? r.text : JSON.stringify(t)) + "' after '" + e.funcName + "'", t)
        }

        function g(t) {
            if (!t.body) throw new Error("Bug: The leftright ParseNode wasn't fully parsed.")
        }

        function v(t) {
            for (var e = t.type, r = t.names, n = t.props, i = t.handler, a = t.htmlBuilder, o = t.mathmlBuilder, s = {
                type: e,
                numArgs: n.numArgs || 0,
                greediness: 1,
                allowedInText: !1,
                numOptionalArgs: 0,
                handler: i
            }, l = 0; l < r.length; ++l) vr[r[l]] = s;
            a && (he[e] = a), o && (ce[e] = o)
        }

        function x(t) {
            var e = [];
            t.consumeSpaces();
            for (var r = t.nextToken.text; "\\hline" === r || "\\hdashline" === r;) t.consume(), e.push("\\hdashline" === r), t.consumeSpaces(), r = t.nextToken.text;
            return e
        }

        function y(t, e, r) {
            var n = e.hskipBeforeAndAfter, i = e.addJot, a = e.cols, s = e.arraystretch;
            if (t.gullet.beginGroup(), t.gullet.macros.set("\\\\", "\\cr"), !s) {
                var l = t.gullet.expandMacroAsText("\\arraystretch");
                if (null == l) s = 1; else if (!(s = parseFloat(l)) || s < 0) throw new C("Invalid \\arraystretch: " + l)
            }
            var h = [], c = [h], m = [], u = [];
            for (u.push(x(t)); ;) {
                var d = t.parseExpression(!1, "\\cr");
                d = {type: "ordgroup", mode: t.mode, body: d}, r && (d = {
                    type: "styling",
                    mode: t.mode,
                    style: r,
                    body: [d]
                }), h.push(d);
                var p = t.nextToken.text;
                if ("&" === p) t.consume(); else {
                    if ("\\end" === p) {
                        1 === h.length && "styling" === d.type && 0 === d.body[0].body.length && c.pop(), u.length < c.length + 1 && u.push([]);
                        break
                    }
                    if ("\\cr" !== p) throw new C("Expected & or \\\\ or \\cr or \\end", t.nextToken);
                    var f = o(t.parseFunction(), "cr");
                    m.push(f.size), u.push(x(t)), h = [], c.push(h)
                }
            }
            return t.gullet.endGroup(), {
                type: "array",
                mode: t.mode,
                addJot: i,
                arraystretch: s,
                body: c,
                cols: a,
                rowGaps: m,
                hskipBeforeAndAfter: n,
                hLinesBeforeRow: u
            }
        }

        function b(t) {
            return "d" === t.substr(0, 1) ? "display" : "text"
        }

        function w(t, e) {
            var r = ve(t.body, e, !0);
            return kr([t.mclass], r, e)
        }

        function k(t, e) {
            var r = Be(t.body, e);
            return Ae.newDocumentFragment(r)
        }

        function S(t, e, r) {
            for (var n = ve(t, e, !1), i = e.sizeMultiplier / r.sizeMultiplier, a = 0; a < n.length; a++) {
                var o = n[a].classes.indexOf("sizing");
                o < 0 ? Array.prototype.push.apply(n[a].classes, e.sizingClasses(r)) : n[a].classes[o + 1] === "reset-size" + e.size && (n[a].classes[o + 1] = "reset-size" + r.size), n[a].height *= i, n[a].depth *= i
            }
            return re.makeFragment(n)
        }

        function M(t, e) {
            tn[t] = e
        }

        r.r(e), r(0);
        var A = function () {
            function t(t, e, r) {
                this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = t, this.start = e, this.end = r
            }

            return t.range = function (e, r) {
                return r ? e && e.loc && r.loc && e.loc.lexer === r.loc.lexer ? new t(e.loc.lexer, e.loc.start, r.loc.end) : null : e && e.loc
            }, t
        }(), z = function () {
            function t(t, e) {
                this.text = void 0, this.loc = void 0, this.text = t, this.loc = e
            }

            return t.prototype.range = function (e, r) {
                return new t(r, A.range(this, e))
            }, t
        }(), T = function t(e, r) {
            this.position = void 0;
            var n, i = "KaTeX parse error: " + e, a = r && r.loc;
            if (a && a.start <= a.end) {
                var o = a.lexer.input;
                n = a.start;
                var s = a.end;
                i += n === o.length ? " at end of input: " : " at position " + (n + 1) + ": ";
                var l = o.slice(n, s).replace(/[^]/g, "$&\u0332");
                i += (n > 15 ? "\u2026" + o.slice(n - 15, n) : o.slice(0, n)) + l + (s + 15 < o.length ? o.slice(s, s + 15) + "\u2026" : o.slice(s))
            }
            var h = new Error(i);
            return h.name = "ParseError", h.__proto__ = t.prototype, h.position = n, h
        };
        T.prototype.__proto__ = Error.prototype;
        var C = T, B = /([A-Z])/g, N = {"&": "&amp;", ">": "&gt;", "<": "&lt;", '"': "&quot;", "'": "&#x27;"},
            L = /[&><"']/g, E = function t(e) {
                return "ordgroup" === e.type ? 1 === e.body.length ? t(e.body[0]) : e : "color" === e.type ? 1 === e.body.length ? t(e.body[0]) : e : "font" === e.type ? t(e.body) : e
            }, O = {
                contains: function (t, e) {
                    return -1 !== t.indexOf(e)
                }, deflt: function (t, e) {
                    return void 0 === t ? e : t
                }, escape: function (t) {
                    return String(t).replace(L, function (t) {
                        return N[t]
                    })
                }, hyphenate: function (t) {
                    return t.replace(B, "-$1").toLowerCase()
                }, getBaseElem: E, isCharacterBox: function (t) {
                    var e = E(t);
                    return "mathord" === e.type || "textord" === e.type || "atom" === e.type
                }
            }, I = function () {
                function t(t) {
                    this.displayMode = void 0, this.leqno = void 0, this.fleqn = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.allowedProtocols = void 0, t = t || {}, this.displayMode = O.deflt(t.displayMode, !1), this.leqno = O.deflt(t.leqno, !1), this.fleqn = O.deflt(t.fleqn, !1), this.throwOnError = O.deflt(t.throwOnError, !0), this.errorColor = O.deflt(t.errorColor, "#cc0000"), this.macros = t.macros || {}, this.colorIsTextColor = O.deflt(t.colorIsTextColor, !1), this.strict = O.deflt(t.strict, "warn"), this.maxSize = Math.max(0, O.deflt(t.maxSize, 1 / 0)), this.maxExpand = Math.max(0, O.deflt(t.maxExpand, 1e3)), this.allowedProtocols = O.deflt(t.allowedProtocols, ["http", "https", "mailto", "_relative"])
                }

                var e = t.prototype;
                return e.reportNonstrict = function (t, e, r) {
                    var n = this.strict;
                    if ("function" == typeof n && (n = n(t, e, r)), n && "ignore" !== n) {
                        if (!0 === n || "error" === n) throw new C("LaTeX-incompatible input and strict mode is set to 'error': " + e + " [" + t + "]", r);
                        "warn" === n ? "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + e + " [" + t + "]") : "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '" + n + "': " + e + " [" + t + "]")
                    }
                }, e.useStrictBehavior = function (t, e, r) {
                    var n = this.strict;
                    if ("function" == typeof n) try {
                        n = n(t, e, r)
                    } catch (t) {
                        n = "error"
                    }
                    return !(!n || "ignore" === n || !0 !== n && "error" !== n && ("warn" === n ? ("undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + e + " [" + t + "]"), 1) : ("undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '" + n + "': " + e + " [" + t + "]"), 1)))
                }, t
            }(), q = function () {
                function t(t, e, r) {
                    this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = t, this.size = e, this.cramped = r
                }

                var e = t.prototype;
                return e.sup = function () {
                    return _[P[this.id]]
                }, e.sub = function () {
                    return _[R[this.id]]
                }, e.fracNum = function () {
                    return _[F[this.id]]
                }, e.fracDen = function () {
                    return _[D[this.id]]
                }, e.cramp = function () {
                    return _[H[this.id]]
                }, e.text = function () {
                    return _[j[this.id]]
                }, e.isTight = function () {
                    return this.size >= 2
                }, t
            }(),
            _ = [new q(0, 0, !1), new q(1, 0, !0), new q(2, 1, !1), new q(3, 1, !0), new q(4, 2, !1), new q(5, 2, !0), new q(6, 3, !1), new q(7, 3, !0)],
            P = [4, 5, 4, 5, 6, 7, 6, 7], R = [5, 5, 5, 5, 7, 7, 7, 7], F = [2, 3, 4, 5, 6, 7, 6, 7],
            D = [3, 3, 5, 5, 7, 7, 7, 7], H = [1, 1, 3, 3, 5, 5, 7, 7], j = [0, 1, 2, 3, 2, 3, 2, 3],
            V = {DISPLAY: _[0], TEXT: _[2], SCRIPT: _[4], SCRIPTSCRIPT: _[6]},
            U = [{name: "latin", blocks: [[256, 591], [768, 879]]}, {
                name: "cyrillic",
                blocks: [[1024, 1279]]
            }, {name: "brahmic", blocks: [[2304, 4255]]}, {name: "georgian", blocks: [[4256, 4351]]}, {
                name: "cjk",
                blocks: [[12288, 12543], [19968, 40879], [65280, 65376]]
            }, {name: "hangul", blocks: [[44032, 55215]]}], G = [];
        U.forEach(function (t) {
            return t.blocks.forEach(function (t) {
                return G.push.apply(G, t)
            })
        });
        var W = {
                path: {
                    sqrtMain: "M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,\n-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,\n-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,\n35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,\n-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467\ns-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422\ns-65,47,-65,47z M834 80H400000v40H845z",
                    sqrtSize1: "M263,681c0.7,0,18,39.7,52,119c34,79.3,68.167,\n158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120c340,-704.7,510.7,-1060.3,512,-1067\nc4.7,-7.3,11,-11,19,-11H40000v40H1012.3s-271.3,567,-271.3,567c-38.7,80.7,-84,\n175,-136,283c-52,108,-89.167,185.3,-111.5,232c-22.3,46.7,-33.8,70.3,-34.5,71\nc-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1s-109,-253,-109,-253c-72.7,-168,-109.3,\n-252,-110,-252c-10.7,8,-22,16.7,-34,26c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26\ns76,-59,76,-59s76,-60,76,-60z M1001 80H40000v40H1012z",
                    sqrtSize2: "M1001,80H400000v40H1013.1s-83.4,268,-264.1,840c-180.7,\n572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,\n-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744c-10,12,-21,25,-33,39s-32,39,-32,39\nc-6,-5.3,-15,-14,-27,-26s25,-30,25,-30c26.7,-32.7,52,-63,76,-91s52,-60,52,-60\ns208,722,208,722c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,\n-658.5c53.7,-170.3,84.5,-266.8,92.5,-289.5c4,-6.7,10,-10,18,-10z\nM1001 80H400000v40H1013z",
                    sqrtSize3: "M424,2478c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,\n-342,-109.8,-513.3,-110.5,-514c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,\n25c-5.7,9.3,-9.8,16,-12.5,20s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,\n-13s76,-122,76,-122s77,-121,77,-121s209,968,209,968c0,-2,84.7,-361.7,254,-1079\nc169.3,-717.3,254.7,-1077.7,256,-1081c4,-6.7,10,-10,18,-10H400000v40H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M1001 80H400000v40H1014z",
                    sqrtSize4: "M473,2793c339.3,-1799.3,509.3,-2700,510,-2702\nc3.3,-7.3,9.3,-11,18,-11H400000v40H1017.7s-90.5,478,-276.2,1466c-185.7,988,\n-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,\n-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200c0,-1.3,-5.3,8.7,-16,30c-10.7,\n21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26s76,-153,76,-153s77,-151,\n77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,606z\nM1001 80H400000v40H1017z",
                    doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",
                    doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",
                    leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",
                    leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",
                    leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",
                    leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",
                    leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",
                    leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",
                    leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",
                    leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",
                    leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",
                    lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",
                    leftlinesegment: "M40 281 V428 H0 V94 H40 V241 H400000 v40z\nM40 281 V428 H0 V94 H40 V241 H400000 v40z",
                    leftmapsto: "M40 281 V448H0V74H40V241H400000v40z\nM40 281 V448H0V74H40V241H400000v40z",
                    leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",
                    longequal: "M0 50 h400000 v40H0z m0 194h40000v40H0z\nM0 50 h400000 v40H0z m0 194h40000v40H0z",
                    midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",
                    midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",
                    oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",
                    oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",
                    oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",
                    oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",
                    rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",
                    rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",
                    rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",
                    rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",
                    rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",
                    rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",
                    rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",
                    rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",
                    rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",
                    righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",
                    rightlinesegment: "M399960 241 V94 h40 V428 h-40 V281 H0 v-40z\nM399960 241 V94 h40 V428 h-40 V281 H0 v-40z",
                    rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",
                    twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",
                    twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",
                    tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",
                    tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",
                    tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",
                    tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",
                    vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",
                    widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",
                    widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
                    widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
                    widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
                    widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",
                    widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
                    widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
                    widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
                    baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",
                    rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",
                    baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",
                    rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",
                    shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",
                    shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"
                }
            }, X = function () {
                function t(t) {
                    this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = t, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {}
                }

                var e = t.prototype;
                return e.hasClass = function (t) {
                    return O.contains(this.classes, t)
                }, e.toNode = function () {
                    for (var t = document.createDocumentFragment(), e = 0; e < this.children.length; e++) t.appendChild(this.children[e].toNode());
                    return t
                }, e.toMarkup = function () {
                    for (var t = "", e = 0; e < this.children.length; e++) t += this.children[e].toMarkup();
                    return t
                }, e.toText = function () {
                    var t = function (t) {
                        return t.toText()
                    };
                    return this.children.map(t).join("")
                }, t
            }(), Y = function (t) {
                return t.filter(function (t) {
                    return t
                }).join(" ")
            }, $ = function (t, e, r) {
                if (this.classes = t || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = r || {}, e) {
                    e.style.isTight() && this.classes.push("mtight");
                    var n = e.getColor();
                    n && (this.style.color = n)
                }
            }, K = function (t) {
                var e = document.createElement(t);
                for (var r in e.className = Y(this.classes), this.style) this.style.hasOwnProperty(r) && (e.style[r] = this.style[r]);
                for (var n in this.attributes) this.attributes.hasOwnProperty(n) && e.setAttribute(n, this.attributes[n]);
                for (var i = 0; i < this.children.length; i++) e.appendChild(this.children[i].toNode());
                return e
            }, Z = function (t) {
                var e = "<" + t;
                this.classes.length && (e += ' class="' + O.escape(Y(this.classes)) + '"');
                var r = "";
                for (var n in this.style) this.style.hasOwnProperty(n) && (r += O.hyphenate(n) + ":" + this.style[n] + ";");
                for (var i in r && (e += ' style="' + O.escape(r) + '"'), this.attributes) this.attributes.hasOwnProperty(i) && (e += " " + i + '="' + O.escape(this.attributes[i]) + '"');
                e += ">";
                for (var a = 0; a < this.children.length; a++) e += this.children[a].toMarkup();
                return e += "</" + t + ">"
            }, J = function () {
                function t(t, e, r, n) {
                    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, $.call(this, t, r, n), this.children = e || []
                }

                var e = t.prototype;
                return e.setAttribute = function (t, e) {
                    this.attributes[t] = e
                }, e.hasClass = function (t) {
                    return O.contains(this.classes, t)
                }, e.toNode = function () {
                    return K.call(this, "span")
                }, e.toMarkup = function () {
                    return Z.call(this, "span")
                }, t
            }(), Q = function () {
                function t(t, e, r, n) {
                    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, $.call(this, e, n), this.children = r || [], this.setAttribute("href", t)
                }

                var e = t.prototype;
                return e.setAttribute = function (t, e) {
                    this.attributes[t] = e
                }, e.hasClass = function (t) {
                    return O.contains(this.classes, t)
                }, e.toNode = function () {
                    return K.call(this, "a")
                }, e.toMarkup = function () {
                    return Z.call(this, "a")
                }, t
            }(), tt = {"\xee": "\u0131\u0302", "\xef": "\u0131\u0308", "\xed": "\u0131\u0301", "\xec": "\u0131\u0300"},
            et = function () {
                function t(t, e, r, n, i, a, o, s) {
                    this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = t, this.height = e || 0, this.depth = r || 0, this.italic = n || 0, this.skew = i || 0, this.width = a || 0, this.classes = o || [], this.style = s || {}, this.maxFontSize = 0;
                    var l = function (t) {
                        for (var e = 0; e < U.length; e++) for (var r = U[e], n = 0; n < r.blocks.length; n++) {
                            var i = r.blocks[n];
                            if (t >= i[0] && t <= i[1]) return r.name
                        }
                        return null
                    }(this.text.charCodeAt(0));
                    l && this.classes.push(l + "_fallback"), /[\xee\xef\xed\xec]/.test(this.text) && (this.text = tt[this.text])
                }

                var e = t.prototype;
                return e.hasClass = function (t) {
                    return O.contains(this.classes, t)
                }, e.toNode = function () {
                    var t = document.createTextNode(this.text), e = null;
                    for (var r in this.italic > 0 && ((e = document.createElement("span")).style.marginRight = this.italic + "em"), this.classes.length > 0 && ((e = e || document.createElement("span")).className = Y(this.classes)), this.style) this.style.hasOwnProperty(r) && ((e = e || document.createElement("span")).style[r] = this.style[r]);
                    return e ? (e.appendChild(t), e) : t
                }, e.toMarkup = function () {
                    var t = !1, e = "<span";
                    this.classes.length && (t = !0, e += ' class="', e += O.escape(Y(this.classes)), e += '"');
                    var r = "";
                    for (var n in this.italic > 0 && (r += "margin-right:" + this.italic + "em;"), this.style) this.style.hasOwnProperty(n) && (r += O.hyphenate(n) + ":" + this.style[n] + ";");
                    r && (t = !0, e += ' style="' + O.escape(r) + '"');
                    var i = O.escape(this.text);
                    return t ? (e += ">", e += i, e += "</span>") : i
                }, t
            }(), rt = function () {
                function t(t, e) {
                    this.children = void 0, this.attributes = void 0, this.children = t || [], this.attributes = e || {}
                }

                var e = t.prototype;
                return e.toNode = function () {
                    var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    for (var e in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, e) && t.setAttribute(e, this.attributes[e]);
                    for (var r = 0; r < this.children.length; r++) t.appendChild(this.children[r].toNode());
                    return t
                }, e.toMarkup = function () {
                    var t = "<svg";
                    for (var e in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, e) && (t += " " + e + "='" + this.attributes[e] + "'");
                    t += ">";
                    for (var r = 0; r < this.children.length; r++) t += this.children[r].toMarkup();
                    return t += "</svg>"
                }, t
            }(), nt = function () {
                function t(t, e) {
                    this.pathName = void 0, this.alternate = void 0, this.pathName = t, this.alternate = e
                }

                var e = t.prototype;
                return e.toNode = function () {
                    var t = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    return this.alternate ? t.setAttribute("d", this.alternate) : t.setAttribute("d", W.path[this.pathName]), t
                }, e.toMarkup = function () {
                    return this.alternate ? "<path d='" + this.alternate + "'/>" : "<path d='" + W.path[this.pathName] + "'/>"
                }, t
            }(), it = function () {
                function t(t) {
                    this.attributes = void 0, this.attributes = t || {}
                }

                var e = t.prototype;
                return e.toNode = function () {
                    var t = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    for (var e in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, e) && t.setAttribute(e, this.attributes[e]);
                    return t
                }, e.toMarkup = function () {
                    var t = "<line";
                    for (var e in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, e) && (t += " " + e + "='" + this.attributes[e] + "'");
                    return t += "/>"
                }, t
            }(), at = {
                "AMS-Regular": {
                    65: [0, .68889, 0, 0, .72222],
                    66: [0, .68889, 0, 0, .66667],
                    67: [0, .68889, 0, 0, .72222],
                    68: [0, .68889, 0, 0, .72222],
                    69: [0, .68889, 0, 0, .66667],
                    70: [0, .68889, 0, 0, .61111],
                    71: [0, .68889, 0, 0, .77778],
                    72: [0, .68889, 0, 0, .77778],
                    73: [0, .68889, 0, 0, .38889],
                    74: [.16667, .68889, 0, 0, .5],
                    75: [0, .68889, 0, 0, .77778],
                    76: [0, .68889, 0, 0, .66667],
                    77: [0, .68889, 0, 0, .94445],
                    78: [0, .68889, 0, 0, .72222],
                    79: [.16667, .68889, 0, 0, .77778],
                    80: [0, .68889, 0, 0, .61111],
                    81: [.16667, .68889, 0, 0, .77778],
                    82: [0, .68889, 0, 0, .72222],
                    83: [0, .68889, 0, 0, .55556],
                    84: [0, .68889, 0, 0, .66667],
                    85: [0, .68889, 0, 0, .72222],
                    86: [0, .68889, 0, 0, .72222],
                    87: [0, .68889, 0, 0, 1],
                    88: [0, .68889, 0, 0, .72222],
                    89: [0, .68889, 0, 0, .72222],
                    90: [0, .68889, 0, 0, .66667],
                    107: [0, .68889, 0, 0, .55556],
                    165: [0, .675, .025, 0, .75],
                    174: [.15559, .69224, 0, 0, .94666],
                    240: [0, .68889, 0, 0, .55556],
                    295: [0, .68889, 0, 0, .54028],
                    710: [0, .825, 0, 0, 2.33334],
                    732: [0, .9, 0, 0, 2.33334],
                    770: [0, .825, 0, 0, 2.33334],
                    771: [0, .9, 0, 0, 2.33334],
                    989: [.08167, .58167, 0, 0, .77778],
                    1008: [0, .43056, .04028, 0, .66667],
                    8245: [0, .54986, 0, 0, .275],
                    8463: [0, .68889, 0, 0, .54028],
                    8487: [0, .68889, 0, 0, .72222],
                    8498: [0, .68889, 0, 0, .55556],
                    8502: [0, .68889, 0, 0, .66667],
                    8503: [0, .68889, 0, 0, .44445],
                    8504: [0, .68889, 0, 0, .66667],
                    8513: [0, .68889, 0, 0, .63889],
                    8592: [-.03598, .46402, 0, 0, .5],
                    8594: [-.03598, .46402, 0, 0, .5],
                    8602: [-.13313, .36687, 0, 0, 1],
                    8603: [-.13313, .36687, 0, 0, 1],
                    8606: [.01354, .52239, 0, 0, 1],
                    8608: [.01354, .52239, 0, 0, 1],
                    8610: [.01354, .52239, 0, 0, 1.11111],
                    8611: [.01354, .52239, 0, 0, 1.11111],
                    8619: [0, .54986, 0, 0, 1],
                    8620: [0, .54986, 0, 0, 1],
                    8621: [-.13313, .37788, 0, 0, 1.38889],
                    8622: [-.13313, .36687, 0, 0, 1],
                    8624: [0, .69224, 0, 0, .5],
                    8625: [0, .69224, 0, 0, .5],
                    8630: [0, .43056, 0, 0, 1],
                    8631: [0, .43056, 0, 0, 1],
                    8634: [.08198, .58198, 0, 0, .77778],
                    8635: [.08198, .58198, 0, 0, .77778],
                    8638: [.19444, .69224, 0, 0, .41667],
                    8639: [.19444, .69224, 0, 0, .41667],
                    8642: [.19444, .69224, 0, 0, .41667],
                    8643: [.19444, .69224, 0, 0, .41667],
                    8644: [.1808, .675, 0, 0, 1],
                    8646: [.1808, .675, 0, 0, 1],
                    8647: [.1808, .675, 0, 0, 1],
                    8648: [.19444, .69224, 0, 0, .83334],
                    8649: [.1808, .675, 0, 0, 1],
                    8650: [.19444, .69224, 0, 0, .83334],
                    8651: [.01354, .52239, 0, 0, 1],
                    8652: [.01354, .52239, 0, 0, 1],
                    8653: [-.13313, .36687, 0, 0, 1],
                    8654: [-.13313, .36687, 0, 0, 1],
                    8655: [-.13313, .36687, 0, 0, 1],
                    8666: [.13667, .63667, 0, 0, 1],
                    8667: [.13667, .63667, 0, 0, 1],
                    8669: [-.13313, .37788, 0, 0, 1],
                    8672: [-.064, .437, 0, 0, 1.334],
                    8674: [-.064, .437, 0, 0, 1.334],
                    8705: [0, .825, 0, 0, .5],
                    8708: [0, .68889, 0, 0, .55556],
                    8709: [.08167, .58167, 0, 0, .77778],
                    8717: [0, .43056, 0, 0, .42917],
                    8722: [-.03598, .46402, 0, 0, .5],
                    8724: [.08198, .69224, 0, 0, .77778],
                    8726: [.08167, .58167, 0, 0, .77778],
                    8733: [0, .69224, 0, 0, .77778],
                    8736: [0, .69224, 0, 0, .72222],
                    8737: [0, .69224, 0, 0, .72222],
                    8738: [.03517, .52239, 0, 0, .72222],
                    8739: [.08167, .58167, 0, 0, .22222],
                    8740: [.25142, .74111, 0, 0, .27778],
                    8741: [.08167, .58167, 0, 0, .38889],
                    8742: [.25142, .74111, 0, 0, .5],
                    8756: [0, .69224, 0, 0, .66667],
                    8757: [0, .69224, 0, 0, .66667],
                    8764: [-.13313, .36687, 0, 0, .77778],
                    8765: [-.13313, .37788, 0, 0, .77778],
                    8769: [-.13313, .36687, 0, 0, .77778],
                    8770: [-.03625, .46375, 0, 0, .77778],
                    8774: [.30274, .79383, 0, 0, .77778],
                    8776: [-.01688, .48312, 0, 0, .77778],
                    8778: [.08167, .58167, 0, 0, .77778],
                    8782: [.06062, .54986, 0, 0, .77778],
                    8783: [.06062, .54986, 0, 0, .77778],
                    8785: [.08198, .58198, 0, 0, .77778],
                    8786: [.08198, .58198, 0, 0, .77778],
                    8787: [.08198, .58198, 0, 0, .77778],
                    8790: [0, .69224, 0, 0, .77778],
                    8791: [.22958, .72958, 0, 0, .77778],
                    8796: [.08198, .91667, 0, 0, .77778],
                    8806: [.25583, .75583, 0, 0, .77778],
                    8807: [.25583, .75583, 0, 0, .77778],
                    8808: [.25142, .75726, 0, 0, .77778],
                    8809: [.25142, .75726, 0, 0, .77778],
                    8812: [.25583, .75583, 0, 0, .5],
                    8814: [.20576, .70576, 0, 0, .77778],
                    8815: [.20576, .70576, 0, 0, .77778],
                    8816: [.30274, .79383, 0, 0, .77778],
                    8817: [.30274, .79383, 0, 0, .77778],
                    8818: [.22958, .72958, 0, 0, .77778],
                    8819: [.22958, .72958, 0, 0, .77778],
                    8822: [.1808, .675, 0, 0, .77778],
                    8823: [.1808, .675, 0, 0, .77778],
                    8828: [.13667, .63667, 0, 0, .77778],
                    8829: [.13667, .63667, 0, 0, .77778],
                    8830: [.22958, .72958, 0, 0, .77778],
                    8831: [.22958, .72958, 0, 0, .77778],
                    8832: [.20576, .70576, 0, 0, .77778],
                    8833: [.20576, .70576, 0, 0, .77778],
                    8840: [.30274, .79383, 0, 0, .77778],
                    8841: [.30274, .79383, 0, 0, .77778],
                    8842: [.13597, .63597, 0, 0, .77778],
                    8843: [.13597, .63597, 0, 0, .77778],
                    8847: [.03517, .54986, 0, 0, .77778],
                    8848: [.03517, .54986, 0, 0, .77778],
                    8858: [.08198, .58198, 0, 0, .77778],
                    8859: [.08198, .58198, 0, 0, .77778],
                    8861: [.08198, .58198, 0, 0, .77778],
                    8862: [0, .675, 0, 0, .77778],
                    8863: [0, .675, 0, 0, .77778],
                    8864: [0, .675, 0, 0, .77778],
                    8865: [0, .675, 0, 0, .77778],
                    8872: [0, .69224, 0, 0, .61111],
                    8873: [0, .69224, 0, 0, .72222],
                    8874: [0, .69224, 0, 0, .88889],
                    8876: [0, .68889, 0, 0, .61111],
                    8877: [0, .68889, 0, 0, .61111],
                    8878: [0, .68889, 0, 0, .72222],
                    8879: [0, .68889, 0, 0, .72222],
                    8882: [.03517, .54986, 0, 0, .77778],
                    8883: [.03517, .54986, 0, 0, .77778],
                    8884: [.13667, .63667, 0, 0, .77778],
                    8885: [.13667, .63667, 0, 0, .77778],
                    8888: [0, .54986, 0, 0, 1.11111],
                    8890: [.19444, .43056, 0, 0, .55556],
                    8891: [.19444, .69224, 0, 0, .61111],
                    8892: [.19444, .69224, 0, 0, .61111],
                    8901: [0, .54986, 0, 0, .27778],
                    8903: [.08167, .58167, 0, 0, .77778],
                    8905: [.08167, .58167, 0, 0, .77778],
                    8906: [.08167, .58167, 0, 0, .77778],
                    8907: [0, .69224, 0, 0, .77778],
                    8908: [0, .69224, 0, 0, .77778],
                    8909: [-.03598, .46402, 0, 0, .77778],
                    8910: [0, .54986, 0, 0, .76042],
                    8911: [0, .54986, 0, 0, .76042],
                    8912: [.03517, .54986, 0, 0, .77778],
                    8913: [.03517, .54986, 0, 0, .77778],
                    8914: [0, .54986, 0, 0, .66667],
                    8915: [0, .54986, 0, 0, .66667],
                    8916: [0, .69224, 0, 0, .66667],
                    8918: [.0391, .5391, 0, 0, .77778],
                    8919: [.0391, .5391, 0, 0, .77778],
                    8920: [.03517, .54986, 0, 0, 1.33334],
                    8921: [.03517, .54986, 0, 0, 1.33334],
                    8922: [.38569, .88569, 0, 0, .77778],
                    8923: [.38569, .88569, 0, 0, .77778],
                    8926: [.13667, .63667, 0, 0, .77778],
                    8927: [.13667, .63667, 0, 0, .77778],
                    8928: [.30274, .79383, 0, 0, .77778],
                    8929: [.30274, .79383, 0, 0, .77778],
                    8934: [.23222, .74111, 0, 0, .77778],
                    8935: [.23222, .74111, 0, 0, .77778],
                    8936: [.23222, .74111, 0, 0, .77778],
                    8937: [.23222, .74111, 0, 0, .77778],
                    8938: [.20576, .70576, 0, 0, .77778],
                    8939: [.20576, .70576, 0, 0, .77778],
                    8940: [.30274, .79383, 0, 0, .77778],
                    8941: [.30274, .79383, 0, 0, .77778],
                    8994: [.19444, .69224, 0, 0, .77778],
                    8995: [.19444, .69224, 0, 0, .77778],
                    9416: [.15559, .69224, 0, 0, .90222],
                    9484: [0, .69224, 0, 0, .5],
                    9488: [0, .69224, 0, 0, .5],
                    9492: [0, .37788, 0, 0, .5],
                    9496: [0, .37788, 0, 0, .5],
                    9585: [.19444, .68889, 0, 0, .88889],
                    9586: [.19444, .74111, 0, 0, .88889],
                    9632: [0, .675, 0, 0, .77778],
                    9633: [0, .675, 0, 0, .77778],
                    9650: [0, .54986, 0, 0, .72222],
                    9651: [0, .54986, 0, 0, .72222],
                    9654: [.03517, .54986, 0, 0, .77778],
                    9660: [0, .54986, 0, 0, .72222],
                    9661: [0, .54986, 0, 0, .72222],
                    9664: [.03517, .54986, 0, 0, .77778],
                    9674: [.11111, .69224, 0, 0, .66667],
                    9733: [.19444, .69224, 0, 0, .94445],
                    10003: [0, .69224, 0, 0, .83334],
                    10016: [0, .69224, 0, 0, .83334],
                    10731: [.11111, .69224, 0, 0, .66667],
                    10846: [.19444, .75583, 0, 0, .61111],
                    10877: [.13667, .63667, 0, 0, .77778],
                    10878: [.13667, .63667, 0, 0, .77778],
                    10885: [.25583, .75583, 0, 0, .77778],
                    10886: [.25583, .75583, 0, 0, .77778],
                    10887: [.13597, .63597, 0, 0, .77778],
                    10888: [.13597, .63597, 0, 0, .77778],
                    10889: [.26167, .75726, 0, 0, .77778],
                    10890: [.26167, .75726, 0, 0, .77778],
                    10891: [.48256, .98256, 0, 0, .77778],
                    10892: [.48256, .98256, 0, 0, .77778],
                    10901: [.13667, .63667, 0, 0, .77778],
                    10902: [.13667, .63667, 0, 0, .77778],
                    10933: [.25142, .75726, 0, 0, .77778],
                    10934: [.25142, .75726, 0, 0, .77778],
                    10935: [.26167, .75726, 0, 0, .77778],
                    10936: [.26167, .75726, 0, 0, .77778],
                    10937: [.26167, .75726, 0, 0, .77778],
                    10938: [.26167, .75726, 0, 0, .77778],
                    10949: [.25583, .75583, 0, 0, .77778],
                    10950: [.25583, .75583, 0, 0, .77778],
                    10955: [.28481, .79383, 0, 0, .77778],
                    10956: [.28481, .79383, 0, 0, .77778],
                    57350: [.08167, .58167, 0, 0, .22222],
                    57351: [.08167, .58167, 0, 0, .38889],
                    57352: [.08167, .58167, 0, 0, .77778],
                    57353: [0, .43056, .04028, 0, .66667],
                    57356: [.25142, .75726, 0, 0, .77778],
                    57357: [.25142, .75726, 0, 0, .77778],
                    57358: [.41951, .91951, 0, 0, .77778],
                    57359: [.30274, .79383, 0, 0, .77778],
                    57360: [.30274, .79383, 0, 0, .77778],
                    57361: [.41951, .91951, 0, 0, .77778],
                    57366: [.25142, .75726, 0, 0, .77778],
                    57367: [.25142, .75726, 0, 0, .77778],
                    57368: [.25142, .75726, 0, 0, .77778],
                    57369: [.25142, .75726, 0, 0, .77778],
                    57370: [.13597, .63597, 0, 0, .77778],
                    57371: [.13597, .63597, 0, 0, .77778]
                },
                "Caligraphic-Regular": {
                    48: [0, .43056, 0, 0, .5],
                    49: [0, .43056, 0, 0, .5],
                    50: [0, .43056, 0, 0, .5],
                    51: [.19444, .43056, 0, 0, .5],
                    52: [.19444, .43056, 0, 0, .5],
                    53: [.19444, .43056, 0, 0, .5],
                    54: [0, .64444, 0, 0, .5],
                    55: [.19444, .43056, 0, 0, .5],
                    56: [0, .64444, 0, 0, .5],
                    57: [.19444, .43056, 0, 0, .5],
                    65: [0, .68333, 0, .19445, .79847],
                    66: [0, .68333, .03041, .13889, .65681],
                    67: [0, .68333, .05834, .13889, .52653],
                    68: [0, .68333, .02778, .08334, .77139],
                    69: [0, .68333, .08944, .11111, .52778],
                    70: [0, .68333, .09931, .11111, .71875],
                    71: [.09722, .68333, .0593, .11111, .59487],
                    72: [0, .68333, .00965, .11111, .84452],
                    73: [0, .68333, .07382, 0, .54452],
                    74: [.09722, .68333, .18472, .16667, .67778],
                    75: [0, .68333, .01445, .05556, .76195],
                    76: [0, .68333, 0, .13889, .68972],
                    77: [0, .68333, 0, .13889, 1.2009],
                    78: [0, .68333, .14736, .08334, .82049],
                    79: [0, .68333, .02778, .11111, .79611],
                    80: [0, .68333, .08222, .08334, .69556],
                    81: [.09722, .68333, 0, .11111, .81667],
                    82: [0, .68333, 0, .08334, .8475],
                    83: [0, .68333, .075, .13889, .60556],
                    84: [0, .68333, .25417, 0, .54464],
                    85: [0, .68333, .09931, .08334, .62583],
                    86: [0, .68333, .08222, 0, .61278],
                    87: [0, .68333, .08222, .08334, .98778],
                    88: [0, .68333, .14643, .13889, .7133],
                    89: [.09722, .68333, .08222, .08334, .66834],
                    90: [0, .68333, .07944, .13889, .72473]
                },
                "Fraktur-Regular": {
                    33: [0, .69141, 0, 0, .29574],
                    34: [0, .69141, 0, 0, .21471],
                    38: [0, .69141, 0, 0, .73786],
                    39: [0, .69141, 0, 0, .21201],
                    40: [.24982, .74947, 0, 0, .38865],
                    41: [.24982, .74947, 0, 0, .38865],
                    42: [0, .62119, 0, 0, .27764],
                    43: [.08319, .58283, 0, 0, .75623],
                    44: [0, .10803, 0, 0, .27764],
                    45: [.08319, .58283, 0, 0, .75623],
                    46: [0, .10803, 0, 0, .27764],
                    47: [.24982, .74947, 0, 0, .50181],
                    48: [0, .47534, 0, 0, .50181],
                    49: [0, .47534, 0, 0, .50181],
                    50: [0, .47534, 0, 0, .50181],
                    51: [.18906, .47534, 0, 0, .50181],
                    52: [.18906, .47534, 0, 0, .50181],
                    53: [.18906, .47534, 0, 0, .50181],
                    54: [0, .69141, 0, 0, .50181],
                    55: [.18906, .47534, 0, 0, .50181],
                    56: [0, .69141, 0, 0, .50181],
                    57: [.18906, .47534, 0, 0, .50181],
                    58: [0, .47534, 0, 0, .21606],
                    59: [.12604, .47534, 0, 0, .21606],
                    61: [-.13099, .36866, 0, 0, .75623],
                    63: [0, .69141, 0, 0, .36245],
                    65: [0, .69141, 0, 0, .7176],
                    66: [0, .69141, 0, 0, .88397],
                    67: [0, .69141, 0, 0, .61254],
                    68: [0, .69141, 0, 0, .83158],
                    69: [0, .69141, 0, 0, .66278],
                    70: [.12604, .69141, 0, 0, .61119],
                    71: [0, .69141, 0, 0, .78539],
                    72: [.06302, .69141, 0, 0, .7203],
                    73: [0, .69141, 0, 0, .55448],
                    74: [.12604, .69141, 0, 0, .55231],
                    75: [0, .69141, 0, 0, .66845],
                    76: [0, .69141, 0, 0, .66602],
                    77: [0, .69141, 0, 0, 1.04953],
                    78: [0, .69141, 0, 0, .83212],
                    79: [0, .69141, 0, 0, .82699],
                    80: [.18906, .69141, 0, 0, .82753],
                    81: [.03781, .69141, 0, 0, .82699],
                    82: [0, .69141, 0, 0, .82807],
                    83: [0, .69141, 0, 0, .82861],
                    84: [0, .69141, 0, 0, .66899],
                    85: [0, .69141, 0, 0, .64576],
                    86: [0, .69141, 0, 0, .83131],
                    87: [0, .69141, 0, 0, 1.04602],
                    88: [0, .69141, 0, 0, .71922],
                    89: [.18906, .69141, 0, 0, .83293],
                    90: [.12604, .69141, 0, 0, .60201],
                    91: [.24982, .74947, 0, 0, .27764],
                    93: [.24982, .74947, 0, 0, .27764],
                    94: [0, .69141, 0, 0, .49965],
                    97: [0, .47534, 0, 0, .50046],
                    98: [0, .69141, 0, 0, .51315],
                    99: [0, .47534, 0, 0, .38946],
                    100: [0, .62119, 0, 0, .49857],
                    101: [0, .47534, 0, 0, .40053],
                    102: [.18906, .69141, 0, 0, .32626],
                    103: [.18906, .47534, 0, 0, .5037],
                    104: [.18906, .69141, 0, 0, .52126],
                    105: [0, .69141, 0, 0, .27899],
                    106: [0, .69141, 0, 0, .28088],
                    107: [0, .69141, 0, 0, .38946],
                    108: [0, .69141, 0, 0, .27953],
                    109: [0, .47534, 0, 0, .76676],
                    110: [0, .47534, 0, 0, .52666],
                    111: [0, .47534, 0, 0, .48885],
                    112: [.18906, .52396, 0, 0, .50046],
                    113: [.18906, .47534, 0, 0, .48912],
                    114: [0, .47534, 0, 0, .38919],
                    115: [0, .47534, 0, 0, .44266],
                    116: [0, .62119, 0, 0, .33301],
                    117: [0, .47534, 0, 0, .5172],
                    118: [0, .52396, 0, 0, .5118],
                    119: [0, .52396, 0, 0, .77351],
                    120: [.18906, .47534, 0, 0, .38865],
                    121: [.18906, .47534, 0, 0, .49884],
                    122: [.18906, .47534, 0, 0, .39054],
                    8216: [0, .69141, 0, 0, .21471],
                    8217: [0, .69141, 0, 0, .21471],
                    58112: [0, .62119, 0, 0, .49749],
                    58113: [0, .62119, 0, 0, .4983],
                    58114: [.18906, .69141, 0, 0, .33328],
                    58115: [.18906, .69141, 0, 0, .32923],
                    58116: [.18906, .47534, 0, 0, .50343],
                    58117: [0, .69141, 0, 0, .33301],
                    58118: [0, .62119, 0, 0, .33409],
                    58119: [0, .47534, 0, 0, .50073]
                },
                "Main-Bold": {
                    33: [0, .69444, 0, 0, .35],
                    34: [0, .69444, 0, 0, .60278],
                    35: [.19444, .69444, 0, 0, .95833],
                    36: [.05556, .75, 0, 0, .575],
                    37: [.05556, .75, 0, 0, .95833],
                    38: [0, .69444, 0, 0, .89444],
                    39: [0, .69444, 0, 0, .31944],
                    40: [.25, .75, 0, 0, .44722],
                    41: [.25, .75, 0, 0, .44722],
                    42: [0, .75, 0, 0, .575],
                    43: [.13333, .63333, 0, 0, .89444],
                    44: [.19444, .15556, 0, 0, .31944],
                    45: [0, .44444, 0, 0, .38333],
                    46: [0, .15556, 0, 0, .31944],
                    47: [.25, .75, 0, 0, .575],
                    48: [0, .64444, 0, 0, .575],
                    49: [0, .64444, 0, 0, .575],
                    50: [0, .64444, 0, 0, .575],
                    51: [0, .64444, 0, 0, .575],
                    52: [0, .64444, 0, 0, .575],
                    53: [0, .64444, 0, 0, .575],
                    54: [0, .64444, 0, 0, .575],
                    55: [0, .64444, 0, 0, .575],
                    56: [0, .64444, 0, 0, .575],
                    57: [0, .64444, 0, 0, .575],
                    58: [0, .44444, 0, 0, .31944],
                    59: [.19444, .44444, 0, 0, .31944],
                    60: [.08556, .58556, 0, 0, .89444],
                    61: [-.10889, .39111, 0, 0, .89444],
                    62: [.08556, .58556, 0, 0, .89444],
                    63: [0, .69444, 0, 0, .54305],
                    64: [0, .69444, 0, 0, .89444],
                    65: [0, .68611, 0, 0, .86944],
                    66: [0, .68611, 0, 0, .81805],
                    67: [0, .68611, 0, 0, .83055],
                    68: [0, .68611, 0, 0, .88194],
                    69: [0, .68611, 0, 0, .75555],
                    70: [0, .68611, 0, 0, .72361],
                    71: [0, .68611, 0, 0, .90416],
                    72: [0, .68611, 0, 0, .9],
                    73: [0, .68611, 0, 0, .43611],
                    74: [0, .68611, 0, 0, .59444],
                    75: [0, .68611, 0, 0, .90138],
                    76: [0, .68611, 0, 0, .69166],
                    77: [0, .68611, 0, 0, 1.09166],
                    78: [0, .68611, 0, 0, .9],
                    79: [0, .68611, 0, 0, .86388],
                    80: [0, .68611, 0, 0, .78611],
                    81: [.19444, .68611, 0, 0, .86388],
                    82: [0, .68611, 0, 0, .8625],
                    83: [0, .68611, 0, 0, .63889],
                    84: [0, .68611, 0, 0, .8],
                    85: [0, .68611, 0, 0, .88472],
                    86: [0, .68611, .01597, 0, .86944],
                    87: [0, .68611, .01597, 0, 1.18888],
                    88: [0, .68611, 0, 0, .86944],
                    89: [0, .68611, .02875, 0, .86944],
                    90: [0, .68611, 0, 0, .70277],
                    91: [.25, .75, 0, 0, .31944],
                    92: [.25, .75, 0, 0, .575],
                    93: [.25, .75, 0, 0, .31944],
                    94: [0, .69444, 0, 0, .575],
                    95: [.31, .13444, .03194, 0, .575],
                    97: [0, .44444, 0, 0, .55902],
                    98: [0, .69444, 0, 0, .63889],
                    99: [0, .44444, 0, 0, .51111],
                    100: [0, .69444, 0, 0, .63889],
                    101: [0, .44444, 0, 0, .52708],
                    102: [0, .69444, .10903, 0, .35139],
                    103: [.19444, .44444, .01597, 0, .575],
                    104: [0, .69444, 0, 0, .63889],
                    105: [0, .69444, 0, 0, .31944],
                    106: [.19444, .69444, 0, 0, .35139],
                    107: [0, .69444, 0, 0, .60694],
                    108: [0, .69444, 0, 0, .31944],
                    109: [0, .44444, 0, 0, .95833],
                    110: [0, .44444, 0, 0, .63889],
                    111: [0, .44444, 0, 0, .575],
                    112: [.19444, .44444, 0, 0, .63889],
                    113: [.19444, .44444, 0, 0, .60694],
                    114: [0, .44444, 0, 0, .47361],
                    115: [0, .44444, 0, 0, .45361],
                    116: [0, .63492, 0, 0, .44722],
                    117: [0, .44444, 0, 0, .63889],
                    118: [0, .44444, .01597, 0, .60694],
                    119: [0, .44444, .01597, 0, .83055],
                    120: [0, .44444, 0, 0, .60694],
                    121: [.19444, .44444, .01597, 0, .60694],
                    122: [0, .44444, 0, 0, .51111],
                    123: [.25, .75, 0, 0, .575],
                    124: [.25, .75, 0, 0, .31944],
                    125: [.25, .75, 0, 0, .575],
                    126: [.35, .34444, 0, 0, .575],
                    168: [0, .69444, 0, 0, .575],
                    172: [0, .44444, 0, 0, .76666],
                    176: [0, .69444, 0, 0, .86944],
                    177: [.13333, .63333, 0, 0, .89444],
                    184: [.17014, 0, 0, 0, .51111],
                    198: [0, .68611, 0, 0, 1.04166],
                    215: [.13333, .63333, 0, 0, .89444],
                    216: [.04861, .73472, 0, 0, .89444],
                    223: [0, .69444, 0, 0, .59722],
                    230: [0, .44444, 0, 0, .83055],
                    247: [.13333, .63333, 0, 0, .89444],
                    248: [.09722, .54167, 0, 0, .575],
                    305: [0, .44444, 0, 0, .31944],
                    338: [0, .68611, 0, 0, 1.16944],
                    339: [0, .44444, 0, 0, .89444],
                    567: [.19444, .44444, 0, 0, .35139],
                    710: [0, .69444, 0, 0, .575],
                    711: [0, .63194, 0, 0, .575],
                    713: [0, .59611, 0, 0, .575],
                    714: [0, .69444, 0, 0, .575],
                    715: [0, .69444, 0, 0, .575],
                    728: [0, .69444, 0, 0, .575],
                    729: [0, .69444, 0, 0, .31944],
                    730: [0, .69444, 0, 0, .86944],
                    732: [0, .69444, 0, 0, .575],
                    733: [0, .69444, 0, 0, .575],
                    915: [0, .68611, 0, 0, .69166],
                    916: [0, .68611, 0, 0, .95833],
                    920: [0, .68611, 0, 0, .89444],
                    923: [0, .68611, 0, 0, .80555],
                    926: [0, .68611, 0, 0, .76666],
                    928: [0, .68611, 0, 0, .9],
                    931: [0, .68611, 0, 0, .83055],
                    933: [0, .68611, 0, 0, .89444],
                    934: [0, .68611, 0, 0, .83055],
                    936: [0, .68611, 0, 0, .89444],
                    937: [0, .68611, 0, 0, .83055],
                    8211: [0, .44444, .03194, 0, .575],
                    8212: [0, .44444, .03194, 0, 1.14999],
                    8216: [0, .69444, 0, 0, .31944],
                    8217: [0, .69444, 0, 0, .31944],
                    8220: [0, .69444, 0, 0, .60278],
                    8221: [0, .69444, 0, 0, .60278],
                    8224: [.19444, .69444, 0, 0, .51111],
                    8225: [.19444, .69444, 0, 0, .51111],
                    8242: [0, .55556, 0, 0, .34444],
                    8407: [0, .72444, .15486, 0, .575],
                    8463: [0, .69444, 0, 0, .66759],
                    8465: [0, .69444, 0, 0, .83055],
                    8467: [0, .69444, 0, 0, .47361],
                    8472: [.19444, .44444, 0, 0, .74027],
                    8476: [0, .69444, 0, 0, .83055],
                    8501: [0, .69444, 0, 0, .70277],
                    8592: [-.10889, .39111, 0, 0, 1.14999],
                    8593: [.19444, .69444, 0, 0, .575],
                    8594: [-.10889, .39111, 0, 0, 1.14999],
                    8595: [.19444, .69444, 0, 0, .575],
                    8596: [-.10889, .39111, 0, 0, 1.14999],
                    8597: [.25, .75, 0, 0, .575],
                    8598: [.19444, .69444, 0, 0, 1.14999],
                    8599: [.19444, .69444, 0, 0, 1.14999],
                    8600: [.19444, .69444, 0, 0, 1.14999],
                    8601: [.19444, .69444, 0, 0, 1.14999],
                    8636: [-.10889, .39111, 0, 0, 1.14999],
                    8637: [-.10889, .39111, 0, 0, 1.14999],
                    8640: [-.10889, .39111, 0, 0, 1.14999],
                    8641: [-.10889, .39111, 0, 0, 1.14999],
                    8656: [-.10889, .39111, 0, 0, 1.14999],
                    8657: [.19444, .69444, 0, 0, .70277],
                    8658: [-.10889, .39111, 0, 0, 1.14999],
                    8659: [.19444, .69444, 0, 0, .70277],
                    8660: [-.10889, .39111, 0, 0, 1.14999],
                    8661: [.25, .75, 0, 0, .70277],
                    8704: [0, .69444, 0, 0, .63889],
                    8706: [0, .69444, .06389, 0, .62847],
                    8707: [0, .69444, 0, 0, .63889],
                    8709: [.05556, .75, 0, 0, .575],
                    8711: [0, .68611, 0, 0, .95833],
                    8712: [.08556, .58556, 0, 0, .76666],
                    8715: [.08556, .58556, 0, 0, .76666],
                    8722: [.13333, .63333, 0, 0, .89444],
                    8723: [.13333, .63333, 0, 0, .89444],
                    8725: [.25, .75, 0, 0, .575],
                    8726: [.25, .75, 0, 0, .575],
                    8727: [-.02778, .47222, 0, 0, .575],
                    8728: [-.02639, .47361, 0, 0, .575],
                    8729: [-.02639, .47361, 0, 0, .575],
                    8730: [.18, .82, 0, 0, .95833],
                    8733: [0, .44444, 0, 0, .89444],
                    8734: [0, .44444, 0, 0, 1.14999],
                    8736: [0, .69224, 0, 0, .72222],
                    8739: [.25, .75, 0, 0, .31944],
                    8741: [.25, .75, 0, 0, .575],
                    8743: [0, .55556, 0, 0, .76666],
                    8744: [0, .55556, 0, 0, .76666],
                    8745: [0, .55556, 0, 0, .76666],
                    8746: [0, .55556, 0, 0, .76666],
                    8747: [.19444, .69444, .12778, 0, .56875],
                    8764: [-.10889, .39111, 0, 0, .89444],
                    8768: [.19444, .69444, 0, 0, .31944],
                    8771: [.00222, .50222, 0, 0, .89444],
                    8776: [.02444, .52444, 0, 0, .89444],
                    8781: [.00222, .50222, 0, 0, .89444],
                    8801: [.00222, .50222, 0, 0, .89444],
                    8804: [.19667, .69667, 0, 0, .89444],
                    8805: [.19667, .69667, 0, 0, .89444],
                    8810: [.08556, .58556, 0, 0, 1.14999],
                    8811: [.08556, .58556, 0, 0, 1.14999],
                    8826: [.08556, .58556, 0, 0, .89444],
                    8827: [.08556, .58556, 0, 0, .89444],
                    8834: [.08556, .58556, 0, 0, .89444],
                    8835: [.08556, .58556, 0, 0, .89444],
                    8838: [.19667, .69667, 0, 0, .89444],
                    8839: [.19667, .69667, 0, 0, .89444],
                    8846: [0, .55556, 0, 0, .76666],
                    8849: [.19667, .69667, 0, 0, .89444],
                    8850: [.19667, .69667, 0, 0, .89444],
                    8851: [0, .55556, 0, 0, .76666],
                    8852: [0, .55556, 0, 0, .76666],
                    8853: [.13333, .63333, 0, 0, .89444],
                    8854: [.13333, .63333, 0, 0, .89444],
                    8855: [.13333, .63333, 0, 0, .89444],
                    8856: [.13333, .63333, 0, 0, .89444],
                    8857: [.13333, .63333, 0, 0, .89444],
                    8866: [0, .69444, 0, 0, .70277],
                    8867: [0, .69444, 0, 0, .70277],
                    8868: [0, .69444, 0, 0, .89444],
                    8869: [0, .69444, 0, 0, .89444],
                    8900: [-.02639, .47361, 0, 0, .575],
                    8901: [-.02639, .47361, 0, 0, .31944],
                    8902: [-.02778, .47222, 0, 0, .575],
                    8968: [.25, .75, 0, 0, .51111],
                    8969: [.25, .75, 0, 0, .51111],
                    8970: [.25, .75, 0, 0, .51111],
                    8971: [.25, .75, 0, 0, .51111],
                    8994: [-.13889, .36111, 0, 0, 1.14999],
                    8995: [-.13889, .36111, 0, 0, 1.14999],
                    9651: [.19444, .69444, 0, 0, 1.02222],
                    9657: [-.02778, .47222, 0, 0, .575],
                    9661: [.19444, .69444, 0, 0, 1.02222],
                    9667: [-.02778, .47222, 0, 0, .575],
                    9711: [.19444, .69444, 0, 0, 1.14999],
                    9824: [.12963, .69444, 0, 0, .89444],
                    9825: [.12963, .69444, 0, 0, .89444],
                    9826: [.12963, .69444, 0, 0, .89444],
                    9827: [.12963, .69444, 0, 0, .89444],
                    9837: [0, .75, 0, 0, .44722],
                    9838: [.19444, .69444, 0, 0, .44722],
                    9839: [.19444, .69444, 0, 0, .44722],
                    10216: [.25, .75, 0, 0, .44722],
                    10217: [.25, .75, 0, 0, .44722],
                    10815: [0, .68611, 0, 0, .9],
                    10927: [.19667, .69667, 0, 0, .89444],
                    10928: [.19667, .69667, 0, 0, .89444],
                    57376: [.19444, .69444, 0, 0, 0]
                },
                "Main-BoldItalic": {
                    33: [0, .69444, .11417, 0, .38611],
                    34: [0, .69444, .07939, 0, .62055],
                    35: [.19444, .69444, .06833, 0, .94444],
                    37: [.05556, .75, .12861, 0, .94444],
                    38: [0, .69444, .08528, 0, .88555],
                    39: [0, .69444, .12945, 0, .35555],
                    40: [.25, .75, .15806, 0, .47333],
                    41: [.25, .75, .03306, 0, .47333],
                    42: [0, .75, .14333, 0, .59111],
                    43: [.10333, .60333, .03306, 0, .88555],
                    44: [.19444, .14722, 0, 0, .35555],
                    45: [0, .44444, .02611, 0, .41444],
                    46: [0, .14722, 0, 0, .35555],
                    47: [.25, .75, .15806, 0, .59111],
                    48: [0, .64444, .13167, 0, .59111],
                    49: [0, .64444, .13167, 0, .59111],
                    50: [0, .64444, .13167, 0, .59111],
                    51: [0, .64444, .13167, 0, .59111],
                    52: [.19444, .64444, .13167, 0, .59111],
                    53: [0, .64444, .13167, 0, .59111],
                    54: [0, .64444, .13167, 0, .59111],
                    55: [.19444, .64444, .13167, 0, .59111],
                    56: [0, .64444, .13167, 0, .59111],
                    57: [0, .64444, .13167, 0, .59111],
                    58: [0, .44444, .06695, 0, .35555],
                    59: [.19444, .44444, .06695, 0, .35555],
                    61: [-.10889, .39111, .06833, 0, .88555],
                    63: [0, .69444, .11472, 0, .59111],
                    64: [0, .69444, .09208, 0, .88555],
                    65: [0, .68611, 0, 0, .86555],
                    66: [0, .68611, .0992, 0, .81666],
                    67: [0, .68611, .14208, 0, .82666],
                    68: [0, .68611, .09062, 0, .87555],
                    69: [0, .68611, .11431, 0, .75666],
                    70: [0, .68611, .12903, 0, .72722],
                    71: [0, .68611, .07347, 0, .89527],
                    72: [0, .68611, .17208, 0, .8961],
                    73: [0, .68611, .15681, 0, .47166],
                    74: [0, .68611, .145, 0, .61055],
                    75: [0, .68611, .14208, 0, .89499],
                    76: [0, .68611, 0, 0, .69777],
                    77: [0, .68611, .17208, 0, 1.07277],
                    78: [0, .68611, .17208, 0, .8961],
                    79: [0, .68611, .09062, 0, .85499],
                    80: [0, .68611, .0992, 0, .78721],
                    81: [.19444, .68611, .09062, 0, .85499],
                    82: [0, .68611, .02559, 0, .85944],
                    83: [0, .68611, .11264, 0, .64999],
                    84: [0, .68611, .12903, 0, .7961],
                    85: [0, .68611, .17208, 0, .88083],
                    86: [0, .68611, .18625, 0, .86555],
                    87: [0, .68611, .18625, 0, 1.15999],
                    88: [0, .68611, .15681, 0, .86555],
                    89: [0, .68611, .19803, 0, .86555],
                    90: [0, .68611, .14208, 0, .70888],
                    91: [.25, .75, .1875, 0, .35611],
                    93: [.25, .75, .09972, 0, .35611],
                    94: [0, .69444, .06709, 0, .59111],
                    95: [.31, .13444, .09811, 0, .59111],
                    97: [0, .44444, .09426, 0, .59111],
                    98: [0, .69444, .07861, 0, .53222],
                    99: [0, .44444, .05222, 0, .53222],
                    100: [0, .69444, .10861, 0, .59111],
                    101: [0, .44444, .085, 0, .53222],
                    102: [.19444, .69444, .21778, 0, .4],
                    103: [.19444, .44444, .105, 0, .53222],
                    104: [0, .69444, .09426, 0, .59111],
                    105: [0, .69326, .11387, 0, .35555],
                    106: [.19444, .69326, .1672, 0, .35555],
                    107: [0, .69444, .11111, 0, .53222],
                    108: [0, .69444, .10861, 0, .29666],
                    109: [0, .44444, .09426, 0, .94444],
                    110: [0, .44444, .09426, 0, .64999],
                    111: [0, .44444, .07861, 0, .59111],
                    112: [.19444, .44444, .07861, 0, .59111],
                    113: [.19444, .44444, .105, 0, .53222],
                    114: [0, .44444, .11111, 0, .50167],
                    115: [0, .44444, .08167, 0, .48694],
                    116: [0, .63492, .09639, 0, .385],
                    117: [0, .44444, .09426, 0, .62055],
                    118: [0, .44444, .11111, 0, .53222],
                    119: [0, .44444, .11111, 0, .76777],
                    120: [0, .44444, .12583, 0, .56055],
                    121: [.19444, .44444, .105, 0, .56166],
                    122: [0, .44444, .13889, 0, .49055],
                    126: [.35, .34444, .11472, 0, .59111],
                    163: [0, .69444, 0, 0, .86853],
                    168: [0, .69444, .11473, 0, .59111],
                    176: [0, .69444, 0, 0, .94888],
                    184: [.17014, 0, 0, 0, .53222],
                    198: [0, .68611, .11431, 0, 1.02277],
                    216: [.04861, .73472, .09062, 0, .88555],
                    223: [.19444, .69444, .09736, 0, .665],
                    230: [0, .44444, .085, 0, .82666],
                    248: [.09722, .54167, .09458, 0, .59111],
                    305: [0, .44444, .09426, 0, .35555],
                    338: [0, .68611, .11431, 0, 1.14054],
                    339: [0, .44444, .085, 0, .82666],
                    567: [.19444, .44444, .04611, 0, .385],
                    710: [0, .69444, .06709, 0, .59111],
                    711: [0, .63194, .08271, 0, .59111],
                    713: [0, .59444, .10444, 0, .59111],
                    714: [0, .69444, .08528, 0, .59111],
                    715: [0, .69444, 0, 0, .59111],
                    728: [0, .69444, .10333, 0, .59111],
                    729: [0, .69444, .12945, 0, .35555],
                    730: [0, .69444, 0, 0, .94888],
                    732: [0, .69444, .11472, 0, .59111],
                    733: [0, .69444, .11472, 0, .59111],
                    915: [0, .68611, .12903, 0, .69777],
                    916: [0, .68611, 0, 0, .94444],
                    920: [0, .68611, .09062, 0, .88555],
                    923: [0, .68611, 0, 0, .80666],
                    926: [0, .68611, .15092, 0, .76777],
                    928: [0, .68611, .17208, 0, .8961],
                    931: [0, .68611, .11431, 0, .82666],
                    933: [0, .68611, .10778, 0, .88555],
                    934: [0, .68611, .05632, 0, .82666],
                    936: [0, .68611, .10778, 0, .88555],
                    937: [0, .68611, .0992, 0, .82666],
                    8211: [0, .44444, .09811, 0, .59111],
                    8212: [0, .44444, .09811, 0, 1.18221],
                    8216: [0, .69444, .12945, 0, .35555],
                    8217: [0, .69444, .12945, 0, .35555],
                    8220: [0, .69444, .16772, 0, .62055],
                    8221: [0, .69444, .07939, 0, .62055]
                },
                "Main-Italic": {
                    33: [0, .69444, .12417, 0, .30667],
                    34: [0, .69444, .06961, 0, .51444],
                    35: [.19444, .69444, .06616, 0, .81777],
                    37: [.05556, .75, .13639, 0, .81777],
                    38: [0, .69444, .09694, 0, .76666],
                    39: [0, .69444, .12417, 0, .30667],
                    40: [.25, .75, .16194, 0, .40889],
                    41: [.25, .75, .03694, 0, .40889],
                    42: [0, .75, .14917, 0, .51111],
                    43: [.05667, .56167, .03694, 0, .76666],
                    44: [.19444, .10556, 0, 0, .30667],
                    45: [0, .43056, .02826, 0, .35778],
                    46: [0, .10556, 0, 0, .30667],
                    47: [.25, .75, .16194, 0, .51111],
                    48: [0, .64444, .13556, 0, .51111],
                    49: [0, .64444, .13556, 0, .51111],
                    50: [0, .64444, .13556, 0, .51111],
                    51: [0, .64444, .13556, 0, .51111],
                    52: [.19444, .64444, .13556, 0, .51111],
                    53: [0, .64444, .13556, 0, .51111],
                    54: [0, .64444, .13556, 0, .51111],
                    55: [.19444, .64444, .13556, 0, .51111],
                    56: [0, .64444, .13556, 0, .51111],
                    57: [0, .64444, .13556, 0, .51111],
                    58: [0, .43056, .0582, 0, .30667],
                    59: [.19444, .43056, .0582, 0, .30667],
                    61: [-.13313, .36687, .06616, 0, .76666],
                    63: [0, .69444, .1225, 0, .51111],
                    64: [0, .69444, .09597, 0, .76666],
                    65: [0, .68333, 0, 0, .74333],
                    66: [0, .68333, .10257, 0, .70389],
                    67: [0, .68333, .14528, 0, .71555],
                    68: [0, .68333, .09403, 0, .755],
                    69: [0, .68333, .12028, 0, .67833],
                    70: [0, .68333, .13305, 0, .65277],
                    71: [0, .68333, .08722, 0, .77361],
                    72: [0, .68333, .16389, 0, .74333],
                    73: [0, .68333, .15806, 0, .38555],
                    74: [0, .68333, .14028, 0, .525],
                    75: [0, .68333, .14528, 0, .76888],
                    76: [0, .68333, 0, 0, .62722],
                    77: [0, .68333, .16389, 0, .89666],
                    78: [0, .68333, .16389, 0, .74333],
                    79: [0, .68333, .09403, 0, .76666],
                    80: [0, .68333, .10257, 0, .67833],
                    81: [.19444, .68333, .09403, 0, .76666],
                    82: [0, .68333, .03868, 0, .72944],
                    83: [0, .68333, .11972, 0, .56222],
                    84: [0, .68333, .13305, 0, .71555],
                    85: [0, .68333, .16389, 0, .74333],
                    86: [0, .68333, .18361, 0, .74333],
                    87: [0, .68333, .18361, 0, .99888],
                    88: [0, .68333, .15806, 0, .74333],
                    89: [0, .68333, .19383, 0, .74333],
                    90: [0, .68333, .14528, 0, .61333],
                    91: [.25, .75, .1875, 0, .30667],
                    93: [.25, .75, .10528, 0, .30667],
                    94: [0, .69444, .06646, 0, .51111],
                    95: [.31, .12056, .09208, 0, .51111],
                    97: [0, .43056, .07671, 0, .51111],
                    98: [0, .69444, .06312, 0, .46],
                    99: [0, .43056, .05653, 0, .46],
                    100: [0, .69444, .10333, 0, .51111],
                    101: [0, .43056, .07514, 0, .46],
                    102: [.19444, .69444, .21194, 0, .30667],
                    103: [.19444, .43056, .08847, 0, .46],
                    104: [0, .69444, .07671, 0, .51111],
                    105: [0, .65536, .1019, 0, .30667],
                    106: [.19444, .65536, .14467, 0, .30667],
                    107: [0, .69444, .10764, 0, .46],
                    108: [0, .69444, .10333, 0, .25555],
                    109: [0, .43056, .07671, 0, .81777],
                    110: [0, .43056, .07671, 0, .56222],
                    111: [0, .43056, .06312, 0, .51111],
                    112: [.19444, .43056, .06312, 0, .51111],
                    113: [.19444, .43056, .08847, 0, .46],
                    114: [0, .43056, .10764, 0, .42166],
                    115: [0, .43056, .08208, 0, .40889],
                    116: [0, .61508, .09486, 0, .33222],
                    117: [0, .43056, .07671, 0, .53666],
                    118: [0, .43056, .10764, 0, .46],
                    119: [0, .43056, .10764, 0, .66444],
                    120: [0, .43056, .12042, 0, .46389],
                    121: [.19444, .43056, .08847, 0, .48555],
                    122: [0, .43056, .12292, 0, .40889],
                    126: [.35, .31786, .11585, 0, .51111],
                    163: [0, .69444, 0, 0, .76909],
                    168: [0, .66786, .10474, 0, .51111],
                    176: [0, .69444, 0, 0, .83129],
                    184: [.17014, 0, 0, 0, .46],
                    198: [0, .68333, .12028, 0, .88277],
                    216: [.04861, .73194, .09403, 0, .76666],
                    223: [.19444, .69444, .10514, 0, .53666],
                    230: [0, .43056, .07514, 0, .71555],
                    248: [.09722, .52778, .09194, 0, .51111],
                    305: [0, .43056, 0, .02778, .32246],
                    338: [0, .68333, .12028, 0, .98499],
                    339: [0, .43056, .07514, 0, .71555],
                    567: [.19444, .43056, 0, .08334, .38403],
                    710: [0, .69444, .06646, 0, .51111],
                    711: [0, .62847, .08295, 0, .51111],
                    713: [0, .56167, .10333, 0, .51111],
                    714: [0, .69444, .09694, 0, .51111],
                    715: [0, .69444, 0, 0, .51111],
                    728: [0, .69444, .10806, 0, .51111],
                    729: [0, .66786, .11752, 0, .30667],
                    730: [0, .69444, 0, 0, .83129],
                    732: [0, .66786, .11585, 0, .51111],
                    733: [0, .69444, .1225, 0, .51111],
                    915: [0, .68333, .13305, 0, .62722],
                    916: [0, .68333, 0, 0, .81777],
                    920: [0, .68333, .09403, 0, .76666],
                    923: [0, .68333, 0, 0, .69222],
                    926: [0, .68333, .15294, 0, .66444],
                    928: [0, .68333, .16389, 0, .74333],
                    931: [0, .68333, .12028, 0, .71555],
                    933: [0, .68333, .11111, 0, .76666],
                    934: [0, .68333, .05986, 0, .71555],
                    936: [0, .68333, .11111, 0, .76666],
                    937: [0, .68333, .10257, 0, .71555],
                    8211: [0, .43056, .09208, 0, .51111],
                    8212: [0, .43056, .09208, 0, 1.02222],
                    8216: [0, .69444, .12417, 0, .30667],
                    8217: [0, .69444, .12417, 0, .30667],
                    8220: [0, .69444, .1685, 0, .51444],
                    8221: [0, .69444, .06961, 0, .51444],
                    8463: [0, .68889, 0, 0, .54028]
                },
                "Main-Regular": {
                    32: [0, 0, 0, 0, .25],
                    33: [0, .69444, 0, 0, .27778],
                    34: [0, .69444, 0, 0, .5],
                    35: [.19444, .69444, 0, 0, .83334],
                    36: [.05556, .75, 0, 0, .5],
                    37: [.05556, .75, 0, 0, .83334],
                    38: [0, .69444, 0, 0, .77778],
                    39: [0, .69444, 0, 0, .27778],
                    40: [.25, .75, 0, 0, .38889],
                    41: [.25, .75, 0, 0, .38889],
                    42: [0, .75, 0, 0, .5],
                    43: [.08333, .58333, 0, 0, .77778],
                    44: [.19444, .10556, 0, 0, .27778],
                    45: [0, .43056, 0, 0, .33333],
                    46: [0, .10556, 0, 0, .27778],
                    47: [.25, .75, 0, 0, .5],
                    48: [0, .64444, 0, 0, .5],
                    49: [0, .64444, 0, 0, .5],
                    50: [0, .64444, 0, 0, .5],
                    51: [0, .64444, 0, 0, .5],
                    52: [0, .64444, 0, 0, .5],
                    53: [0, .64444, 0, 0, .5],
                    54: [0, .64444, 0, 0, .5],
                    55: [0, .64444, 0, 0, .5],
                    56: [0, .64444, 0, 0, .5],
                    57: [0, .64444, 0, 0, .5],
                    58: [0, .43056, 0, 0, .27778],
                    59: [.19444, .43056, 0, 0, .27778],
                    60: [.0391, .5391, 0, 0, .77778],
                    61: [-.13313, .36687, 0, 0, .77778],
                    62: [.0391, .5391, 0, 0, .77778],
                    63: [0, .69444, 0, 0, .47222],
                    64: [0, .69444, 0, 0, .77778],
                    65: [0, .68333, 0, 0, .75],
                    66: [0, .68333, 0, 0, .70834],
                    67: [0, .68333, 0, 0, .72222],
                    68: [0, .68333, 0, 0, .76389],
                    69: [0, .68333, 0, 0, .68056],
                    70: [0, .68333, 0, 0, .65278],
                    71: [0, .68333, 0, 0, .78472],
                    72: [0, .68333, 0, 0, .75],
                    73: [0, .68333, 0, 0, .36111],
                    74: [0, .68333, 0, 0, .51389],
                    75: [0, .68333, 0, 0, .77778],
                    76: [0, .68333, 0, 0, .625],
                    77: [0, .68333, 0, 0, .91667],
                    78: [0, .68333, 0, 0, .75],
                    79: [0, .68333, 0, 0, .77778],
                    80: [0, .68333, 0, 0, .68056],
                    81: [.19444, .68333, 0, 0, .77778],
                    82: [0, .68333, 0, 0, .73611],
                    83: [0, .68333, 0, 0, .55556],
                    84: [0, .68333, 0, 0, .72222],
                    85: [0, .68333, 0, 0, .75],
                    86: [0, .68333, .01389, 0, .75],
                    87: [0, .68333, .01389, 0, 1.02778],
                    88: [0, .68333, 0, 0, .75],
                    89: [0, .68333, .025, 0, .75],
                    90: [0, .68333, 0, 0, .61111],
                    91: [.25, .75, 0, 0, .27778],
                    92: [.25, .75, 0, 0, .5],
                    93: [.25, .75, 0, 0, .27778],
                    94: [0, .69444, 0, 0, .5],
                    95: [.31, .12056, .02778, 0, .5],
                    97: [0, .43056, 0, 0, .5],
                    98: [0, .69444, 0, 0, .55556],
                    99: [0, .43056, 0, 0, .44445],
                    100: [0, .69444, 0, 0, .55556],
                    101: [0, .43056, 0, 0, .44445],
                    102: [0, .69444, .07778, 0, .30556],
                    103: [.19444, .43056, .01389, 0, .5],
                    104: [0, .69444, 0, 0, .55556],
                    105: [0, .66786, 0, 0, .27778],
                    106: [.19444, .66786, 0, 0, .30556],
                    107: [0, .69444, 0, 0, .52778],
                    108: [0, .69444, 0, 0, .27778],
                    109: [0, .43056, 0, 0, .83334],
                    110: [0, .43056, 0, 0, .55556],
                    111: [0, .43056, 0, 0, .5],
                    112: [.19444, .43056, 0, 0, .55556],
                    113: [.19444, .43056, 0, 0, .52778],
                    114: [0, .43056, 0, 0, .39167],
                    115: [0, .43056, 0, 0, .39445],
                    116: [0, .61508, 0, 0, .38889],
                    117: [0, .43056, 0, 0, .55556],
                    118: [0, .43056, .01389, 0, .52778],
                    119: [0, .43056, .01389, 0, .72222],
                    120: [0, .43056, 0, 0, .52778],
                    121: [.19444, .43056, .01389, 0, .52778],
                    122: [0, .43056, 0, 0, .44445],
                    123: [.25, .75, 0, 0, .5],
                    124: [.25, .75, 0, 0, .27778],
                    125: [.25, .75, 0, 0, .5],
                    126: [.35, .31786, 0, 0, .5],
                    160: [0, 0, 0, 0, .25],
                    167: [.19444, .69444, 0, 0, .44445],
                    168: [0, .66786, 0, 0, .5],
                    172: [0, .43056, 0, 0, .66667],
                    176: [0, .69444, 0, 0, .75],
                    177: [.08333, .58333, 0, 0, .77778],
                    182: [.19444, .69444, 0, 0, .61111],
                    184: [.17014, 0, 0, 0, .44445],
                    198: [0, .68333, 0, 0, .90278],
                    215: [.08333, .58333, 0, 0, .77778],
                    216: [.04861, .73194, 0, 0, .77778],
                    223: [0, .69444, 0, 0, .5],
                    230: [0, .43056, 0, 0, .72222],
                    247: [.08333, .58333, 0, 0, .77778],
                    248: [.09722, .52778, 0, 0, .5],
                    305: [0, .43056, 0, 0, .27778],
                    338: [0, .68333, 0, 0, 1.01389],
                    339: [0, .43056, 0, 0, .77778],
                    567: [.19444, .43056, 0, 0, .30556],
                    710: [0, .69444, 0, 0, .5],
                    711: [0, .62847, 0, 0, .5],
                    713: [0, .56778, 0, 0, .5],
                    714: [0, .69444, 0, 0, .5],
                    715: [0, .69444, 0, 0, .5],
                    728: [0, .69444, 0, 0, .5],
                    729: [0, .66786, 0, 0, .27778],
                    730: [0, .69444, 0, 0, .75],
                    732: [0, .66786, 0, 0, .5],
                    733: [0, .69444, 0, 0, .5],
                    915: [0, .68333, 0, 0, .625],
                    916: [0, .68333, 0, 0, .83334],
                    920: [0, .68333, 0, 0, .77778],
                    923: [0, .68333, 0, 0, .69445],
                    926: [0, .68333, 0, 0, .66667],
                    928: [0, .68333, 0, 0, .75],
                    931: [0, .68333, 0, 0, .72222],
                    933: [0, .68333, 0, 0, .77778],
                    934: [0, .68333, 0, 0, .72222],
                    936: [0, .68333, 0, 0, .77778],
                    937: [0, .68333, 0, 0, .72222],
                    8211: [0, .43056, .02778, 0, .5],
                    8212: [0, .43056, .02778, 0, 1],
                    8216: [0, .69444, 0, 0, .27778],
                    8217: [0, .69444, 0, 0, .27778],
                    8220: [0, .69444, 0, 0, .5],
                    8221: [0, .69444, 0, 0, .5],
                    8224: [.19444, .69444, 0, 0, .44445],
                    8225: [.19444, .69444, 0, 0, .44445],
                    8230: [0, .12, 0, 0, 1.172],
                    8242: [0, .55556, 0, 0, .275],
                    8407: [0, .71444, .15382, 0, .5],
                    8463: [0, .68889, 0, 0, .54028],
                    8465: [0, .69444, 0, 0, .72222],
                    8467: [0, .69444, 0, .11111, .41667],
                    8472: [.19444, .43056, 0, .11111, .63646],
                    8476: [0, .69444, 0, 0, .72222],
                    8501: [0, .69444, 0, 0, .61111],
                    8592: [-.13313, .36687, 0, 0, 1],
                    8593: [.19444, .69444, 0, 0, .5],
                    8594: [-.13313, .36687, 0, 0, 1],
                    8595: [.19444, .69444, 0, 0, .5],
                    8596: [-.13313, .36687, 0, 0, 1],
                    8597: [.25, .75, 0, 0, .5],
                    8598: [.19444, .69444, 0, 0, 1],
                    8599: [.19444, .69444, 0, 0, 1],
                    8600: [.19444, .69444, 0, 0, 1],
                    8601: [.19444, .69444, 0, 0, 1],
                    8614: [.011, .511, 0, 0, 1],
                    8617: [.011, .511, 0, 0, 1.126],
                    8618: [.011, .511, 0, 0, 1.126],
                    8636: [-.13313, .36687, 0, 0, 1],
                    8637: [-.13313, .36687, 0, 0, 1],
                    8640: [-.13313, .36687, 0, 0, 1],
                    8641: [-.13313, .36687, 0, 0, 1],
                    8652: [.011, .671, 0, 0, 1],
                    8656: [-.13313, .36687, 0, 0, 1],
                    8657: [.19444, .69444, 0, 0, .61111],
                    8658: [-.13313, .36687, 0, 0, 1],
                    8659: [.19444, .69444, 0, 0, .61111],
                    8660: [-.13313, .36687, 0, 0, 1],
                    8661: [.25, .75, 0, 0, .61111],
                    8704: [0, .69444, 0, 0, .55556],
                    8706: [0, .69444, .05556, .08334, .5309],
                    8707: [0, .69444, 0, 0, .55556],
                    8709: [.05556, .75, 0, 0, .5],
                    8711: [0, .68333, 0, 0, .83334],
                    8712: [.0391, .5391, 0, 0, .66667],
                    8715: [.0391, .5391, 0, 0, .66667],
                    8722: [.08333, .58333, 0, 0, .77778],
                    8723: [.08333, .58333, 0, 0, .77778],
                    8725: [.25, .75, 0, 0, .5],
                    8726: [.25, .75, 0, 0, .5],
                    8727: [-.03472, .46528, 0, 0, .5],
                    8728: [-.05555, .44445, 0, 0, .5],
                    8729: [-.05555, .44445, 0, 0, .5],
                    8730: [.2, .8, 0, 0, .83334],
                    8733: [0, .43056, 0, 0, .77778],
                    8734: [0, .43056, 0, 0, 1],
                    8736: [0, .69224, 0, 0, .72222],
                    8739: [.25, .75, 0, 0, .27778],
                    8741: [.25, .75, 0, 0, .5],
                    8743: [0, .55556, 0, 0, .66667],
                    8744: [0, .55556, 0, 0, .66667],
                    8745: [0, .55556, 0, 0, .66667],
                    8746: [0, .55556, 0, 0, .66667],
                    8747: [.19444, .69444, .11111, 0, .41667],
                    8764: [-.13313, .36687, 0, 0, .77778],
                    8768: [.19444, .69444, 0, 0, .27778],
                    8771: [-.03625, .46375, 0, 0, .77778],
                    8773: [-.022, .589, 0, 0, 1],
                    8776: [-.01688, .48312, 0, 0, .77778],
                    8781: [-.03625, .46375, 0, 0, .77778],
                    8784: [-.133, .67, 0, 0, .778],
                    8801: [-.03625, .46375, 0, 0, .77778],
                    8804: [.13597, .63597, 0, 0, .77778],
                    8805: [.13597, .63597, 0, 0, .77778],
                    8810: [.0391, .5391, 0, 0, 1],
                    8811: [.0391, .5391, 0, 0, 1],
                    8826: [.0391, .5391, 0, 0, .77778],
                    8827: [.0391, .5391, 0, 0, .77778],
                    8834: [.0391, .5391, 0, 0, .77778],
                    8835: [.0391, .5391, 0, 0, .77778],
                    8838: [.13597, .63597, 0, 0, .77778],
                    8839: [.13597, .63597, 0, 0, .77778],
                    8846: [0, .55556, 0, 0, .66667],
                    8849: [.13597, .63597, 0, 0, .77778],
                    8850: [.13597, .63597, 0, 0, .77778],
                    8851: [0, .55556, 0, 0, .66667],
                    8852: [0, .55556, 0, 0, .66667],
                    8853: [.08333, .58333, 0, 0, .77778],
                    8854: [.08333, .58333, 0, 0, .77778],
                    8855: [.08333, .58333, 0, 0, .77778],
                    8856: [.08333, .58333, 0, 0, .77778],
                    8857: [.08333, .58333, 0, 0, .77778],
                    8866: [0, .69444, 0, 0, .61111],
                    8867: [0, .69444, 0, 0, .61111],
                    8868: [0, .69444, 0, 0, .77778],
                    8869: [0, .69444, 0, 0, .77778],
                    8872: [.249, .75, 0, 0, .867],
                    8900: [-.05555, .44445, 0, 0, .5],
                    8901: [-.05555, .44445, 0, 0, .27778],
                    8902: [-.03472, .46528, 0, 0, .5],
                    8904: [.005, .505, 0, 0, .9],
                    8942: [.03, .9, 0, 0, .278],
                    8943: [-.19, .31, 0, 0, 1.172],
                    8945: [-.1, .82, 0, 0, 1.282],
                    8968: [.25, .75, 0, 0, .44445],
                    8969: [.25, .75, 0, 0, .44445],
                    8970: [.25, .75, 0, 0, .44445],
                    8971: [.25, .75, 0, 0, .44445],
                    8994: [-.14236, .35764, 0, 0, 1],
                    8995: [-.14236, .35764, 0, 0, 1],
                    9136: [.244, .744, 0, 0, .412],
                    9137: [.244, .744, 0, 0, .412],
                    9651: [.19444, .69444, 0, 0, .88889],
                    9657: [-.03472, .46528, 0, 0, .5],
                    9661: [.19444, .69444, 0, 0, .88889],
                    9667: [-.03472, .46528, 0, 0, .5],
                    9711: [.19444, .69444, 0, 0, 1],
                    9824: [.12963, .69444, 0, 0, .77778],
                    9825: [.12963, .69444, 0, 0, .77778],
                    9826: [.12963, .69444, 0, 0, .77778],
                    9827: [.12963, .69444, 0, 0, .77778],
                    9837: [0, .75, 0, 0, .38889],
                    9838: [.19444, .69444, 0, 0, .38889],
                    9839: [.19444, .69444, 0, 0, .38889],
                    10216: [.25, .75, 0, 0, .38889],
                    10217: [.25, .75, 0, 0, .38889],
                    10222: [.244, .744, 0, 0, .412],
                    10223: [.244, .744, 0, 0, .412],
                    10229: [.011, .511, 0, 0, 1.609],
                    10230: [.011, .511, 0, 0, 1.638],
                    10231: [.011, .511, 0, 0, 1.859],
                    10232: [.024, .525, 0, 0, 1.609],
                    10233: [.024, .525, 0, 0, 1.638],
                    10234: [.024, .525, 0, 0, 1.858],
                    10236: [.011, .511, 0, 0, 1.638],
                    10815: [0, .68333, 0, 0, .75],
                    10927: [.13597, .63597, 0, 0, .77778],
                    10928: [.13597, .63597, 0, 0, .77778],
                    57376: [.19444, .69444, 0, 0, 0]
                },
                "Math-BoldItalic": {
                    65: [0, .68611, 0, 0, .86944],
                    66: [0, .68611, .04835, 0, .8664],
                    67: [0, .68611, .06979, 0, .81694],
                    68: [0, .68611, .03194, 0, .93812],
                    69: [0, .68611, .05451, 0, .81007],
                    70: [0, .68611, .15972, 0, .68889],
                    71: [0, .68611, 0, 0, .88673],
                    72: [0, .68611, .08229, 0, .98229],
                    73: [0, .68611, .07778, 0, .51111],
                    74: [0, .68611, .10069, 0, .63125],
                    75: [0, .68611, .06979, 0, .97118],
                    76: [0, .68611, 0, 0, .75555],
                    77: [0, .68611, .11424, 0, 1.14201],
                    78: [0, .68611, .11424, 0, .95034],
                    79: [0, .68611, .03194, 0, .83666],
                    80: [0, .68611, .15972, 0, .72309],
                    81: [.19444, .68611, 0, 0, .86861],
                    82: [0, .68611, .00421, 0, .87235],
                    83: [0, .68611, .05382, 0, .69271],
                    84: [0, .68611, .15972, 0, .63663],
                    85: [0, .68611, .11424, 0, .80027],
                    86: [0, .68611, .25555, 0, .67778],
                    87: [0, .68611, .15972, 0, 1.09305],
                    88: [0, .68611, .07778, 0, .94722],
                    89: [0, .68611, .25555, 0, .67458],
                    90: [0, .68611, .06979, 0, .77257],
                    97: [0, .44444, 0, 0, .63287],
                    98: [0, .69444, 0, 0, .52083],
                    99: [0, .44444, 0, 0, .51342],
                    100: [0, .69444, 0, 0, .60972],
                    101: [0, .44444, 0, 0, .55361],
                    102: [.19444, .69444, .11042, 0, .56806],
                    103: [.19444, .44444, .03704, 0, .5449],
                    104: [0, .69444, 0, 0, .66759],
                    105: [0, .69326, 0, 0, .4048],
                    106: [.19444, .69326, .0622, 0, .47083],
                    107: [0, .69444, .01852, 0, .6037],
                    108: [0, .69444, .0088, 0, .34815],
                    109: [0, .44444, 0, 0, 1.0324],
                    110: [0, .44444, 0, 0, .71296],
                    111: [0, .44444, 0, 0, .58472],
                    112: [.19444, .44444, 0, 0, .60092],
                    113: [.19444, .44444, .03704, 0, .54213],
                    114: [0, .44444, .03194, 0, .5287],
                    115: [0, .44444, 0, 0, .53125],
                    116: [0, .63492, 0, 0, .41528],
                    117: [0, .44444, 0, 0, .68102],
                    118: [0, .44444, .03704, 0, .56666],
                    119: [0, .44444, .02778, 0, .83148],
                    120: [0, .44444, 0, 0, .65903],
                    121: [.19444, .44444, .03704, 0, .59028],
                    122: [0, .44444, .04213, 0, .55509],
                    915: [0, .68611, .15972, 0, .65694],
                    916: [0, .68611, 0, 0, .95833],
                    920: [0, .68611, .03194, 0, .86722],
                    923: [0, .68611, 0, 0, .80555],
                    926: [0, .68611, .07458, 0, .84125],
                    928: [0, .68611, .08229, 0, .98229],
                    931: [0, .68611, .05451, 0, .88507],
                    933: [0, .68611, .15972, 0, .67083],
                    934: [0, .68611, 0, 0, .76666],
                    936: [0, .68611, .11653, 0, .71402],
                    937: [0, .68611, .04835, 0, .8789],
                    945: [0, .44444, 0, 0, .76064],
                    946: [.19444, .69444, .03403, 0, .65972],
                    947: [.19444, .44444, .06389, 0, .59003],
                    948: [0, .69444, .03819, 0, .52222],
                    949: [0, .44444, 0, 0, .52882],
                    950: [.19444, .69444, .06215, 0, .50833],
                    951: [.19444, .44444, .03704, 0, .6],
                    952: [0, .69444, .03194, 0, .5618],
                    953: [0, .44444, 0, 0, .41204],
                    954: [0, .44444, 0, 0, .66759],
                    955: [0, .69444, 0, 0, .67083],
                    956: [.19444, .44444, 0, 0, .70787],
                    957: [0, .44444, .06898, 0, .57685],
                    958: [.19444, .69444, .03021, 0, .50833],
                    959: [0, .44444, 0, 0, .58472],
                    960: [0, .44444, .03704, 0, .68241],
                    961: [.19444, .44444, 0, 0, .6118],
                    962: [.09722, .44444, .07917, 0, .42361],
                    963: [0, .44444, .03704, 0, .68588],
                    964: [0, .44444, .13472, 0, .52083],
                    965: [0, .44444, .03704, 0, .63055],
                    966: [.19444, .44444, 0, 0, .74722],
                    967: [.19444, .44444, 0, 0, .71805],
                    968: [.19444, .69444, .03704, 0, .75833],
                    969: [0, .44444, .03704, 0, .71782],
                    977: [0, .69444, 0, 0, .69155],
                    981: [.19444, .69444, 0, 0, .7125],
                    982: [0, .44444, .03194, 0, .975],
                    1009: [.19444, .44444, 0, 0, .6118],
                    1013: [0, .44444, 0, 0, .48333]
                },
                "Math-Italic": {
                    65: [0, .68333, 0, .13889, .75],
                    66: [0, .68333, .05017, .08334, .75851],
                    67: [0, .68333, .07153, .08334, .71472],
                    68: [0, .68333, .02778, .05556, .82792],
                    69: [0, .68333, .05764, .08334, .7382],
                    70: [0, .68333, .13889, .08334, .64306],
                    71: [0, .68333, 0, .08334, .78625],
                    72: [0, .68333, .08125, .05556, .83125],
                    73: [0, .68333, .07847, .11111, .43958],
                    74: [0, .68333, .09618, .16667, .55451],
                    75: [0, .68333, .07153, .05556, .84931],
                    76: [0, .68333, 0, .02778, .68056],
                    77: [0, .68333, .10903, .08334, .97014],
                    78: [0, .68333, .10903, .08334, .80347],
                    79: [0, .68333, .02778, .08334, .76278],
                    80: [0, .68333, .13889, .08334, .64201],
                    81: [.19444, .68333, 0, .08334, .79056],
                    82: [0, .68333, .00773, .08334, .75929],
                    83: [0, .68333, .05764, .08334, .6132],
                    84: [0, .68333, .13889, .08334, .58438],
                    85: [0, .68333, .10903, .02778, .68278],
                    86: [0, .68333, .22222, 0, .58333],
                    87: [0, .68333, .13889, 0, .94445],
                    88: [0, .68333, .07847, .08334, .82847],
                    89: [0, .68333, .22222, 0, .58056],
                    90: [0, .68333, .07153, .08334, .68264],
                    97: [0, .43056, 0, 0, .52859],
                    98: [0, .69444, 0, 0, .42917],
                    99: [0, .43056, 0, .05556, .43276],
                    100: [0, .69444, 0, .16667, .52049],
                    101: [0, .43056, 0, .05556, .46563],
                    102: [.19444, .69444, .10764, .16667, .48959],
                    103: [.19444, .43056, .03588, .02778, .47697],
                    104: [0, .69444, 0, 0, .57616],
                    105: [0, .65952, 0, 0, .34451],
                    106: [.19444, .65952, .05724, 0, .41181],
                    107: [0, .69444, .03148, 0, .5206],
                    108: [0, .69444, .01968, .08334, .29838],
                    109: [0, .43056, 0, 0, .87801],
                    110: [0, .43056, 0, 0, .60023],
                    111: [0, .43056, 0, .05556, .48472],
                    112: [.19444, .43056, 0, .08334, .50313],
                    113: [.19444, .43056, .03588, .08334, .44641],
                    114: [0, .43056, .02778, .05556, .45116],
                    115: [0, .43056, 0, .05556, .46875],
                    116: [0, .61508, 0, .08334, .36111],
                    117: [0, .43056, 0, .02778, .57246],
                    118: [0, .43056, .03588, .02778, .48472],
                    119: [0, .43056, .02691, .08334, .71592],
                    120: [0, .43056, 0, .02778, .57153],
                    121: [.19444, .43056, .03588, .05556, .49028],
                    122: [0, .43056, .04398, .05556, .46505],
                    915: [0, .68333, .13889, .08334, .61528],
                    916: [0, .68333, 0, .16667, .83334],
                    920: [0, .68333, .02778, .08334, .76278],
                    923: [0, .68333, 0, .16667, .69445],
                    926: [0, .68333, .07569, .08334, .74236],
                    928: [0, .68333, .08125, .05556, .83125],
                    931: [0, .68333, .05764, .08334, .77986],
                    933: [0, .68333, .13889, .05556, .58333],
                    934: [0, .68333, 0, .08334, .66667],
                    936: [0, .68333, .11, .05556, .61222],
                    937: [0, .68333, .05017, .08334, .7724],
                    945: [0, .43056, .0037, .02778, .6397],
                    946: [.19444, .69444, .05278, .08334, .56563],
                    947: [.19444, .43056, .05556, 0, .51773],
                    948: [0, .69444, .03785, .05556, .44444],
                    949: [0, .43056, 0, .08334, .46632],
                    950: [.19444, .69444, .07378, .08334, .4375],
                    951: [.19444, .43056, .03588, .05556, .49653],
                    952: [0, .69444, .02778, .08334, .46944],
                    953: [0, .43056, 0, .05556, .35394],
                    954: [0, .43056, 0, 0, .57616],
                    955: [0, .69444, 0, 0, .58334],
                    956: [.19444, .43056, 0, .02778, .60255],
                    957: [0, .43056, .06366, .02778, .49398],
                    958: [.19444, .69444, .04601, .11111, .4375],
                    959: [0, .43056, 0, .05556, .48472],
                    960: [0, .43056, .03588, 0, .57003],
                    961: [.19444, .43056, 0, .08334, .51702],
                    962: [.09722, .43056, .07986, .08334, .36285],
                    963: [0, .43056, .03588, 0, .57141],
                    964: [0, .43056, .1132, .02778, .43715],
                    965: [0, .43056, .03588, .02778, .54028],
                    966: [.19444, .43056, 0, .08334, .65417],
                    967: [.19444, .43056, 0, .05556, .62569],
                    968: [.19444, .69444, .03588, .11111, .65139],
                    969: [0, .43056, .03588, 0, .62245],
                    977: [0, .69444, 0, .08334, .59144],
                    981: [.19444, .69444, 0, .08334, .59583],
                    982: [0, .43056, .02778, 0, .82813],
                    1009: [.19444, .43056, 0, .08334, .51702],
                    1013: [0, .43056, 0, .05556, .4059]
                },
                "Math-Regular": {
                    65: [0, .68333, 0, .13889, .75],
                    66: [0, .68333, .05017, .08334, .75851],
                    67: [0, .68333, .07153, .08334, .71472],
                    68: [0, .68333, .02778, .05556, .82792],
                    69: [0, .68333, .05764, .08334, .7382],
                    70: [0, .68333, .13889, .08334, .64306],
                    71: [0, .68333, 0, .08334, .78625],
                    72: [0, .68333, .08125, .05556, .83125],
                    73: [0, .68333, .07847, .11111, .43958],
                    74: [0, .68333, .09618, .16667, .55451],
                    75: [0, .68333, .07153, .05556, .84931],
                    76: [0, .68333, 0, .02778, .68056],
                    77: [0, .68333, .10903, .08334, .97014],
                    78: [0, .68333, .10903, .08334, .80347],
                    79: [0, .68333, .02778, .08334, .76278],
                    80: [0, .68333, .13889, .08334, .64201],
                    81: [.19444, .68333, 0, .08334, .79056],
                    82: [0, .68333, .00773, .08334, .75929],
                    83: [0, .68333, .05764, .08334, .6132],
                    84: [0, .68333, .13889, .08334, .58438],
                    85: [0, .68333, .10903, .02778, .68278],
                    86: [0, .68333, .22222, 0, .58333],
                    87: [0, .68333, .13889, 0, .94445],
                    88: [0, .68333, .07847, .08334, .82847],
                    89: [0, .68333, .22222, 0, .58056],
                    90: [0, .68333, .07153, .08334, .68264],
                    97: [0, .43056, 0, 0, .52859],
                    98: [0, .69444, 0, 0, .42917],
                    99: [0, .43056, 0, .05556, .43276],
                    100: [0, .69444, 0, .16667, .52049],
                    101: [0, .43056, 0, .05556, .46563],
                    102: [.19444, .69444, .10764, .16667, .48959],
                    103: [.19444, .43056, .03588, .02778, .47697],
                    104: [0, .69444, 0, 0, .57616],
                    105: [0, .65952, 0, 0, .34451],
                    106: [.19444, .65952, .05724, 0, .41181],
                    107: [0, .69444, .03148, 0, .5206],
                    108: [0, .69444, .01968, .08334, .29838],
                    109: [0, .43056, 0, 0, .87801],
                    110: [0, .43056, 0, 0, .60023],
                    111: [0, .43056, 0, .05556, .48472],
                    112: [.19444, .43056, 0, .08334, .50313],
                    113: [.19444, .43056, .03588, .08334, .44641],
                    114: [0, .43056, .02778, .05556, .45116],
                    115: [0, .43056, 0, .05556, .46875],
                    116: [0, .61508, 0, .08334, .36111],
                    117: [0, .43056, 0, .02778, .57246],
                    118: [0, .43056, .03588, .02778, .48472],
                    119: [0, .43056, .02691, .08334, .71592],
                    120: [0, .43056, 0, .02778, .57153],
                    121: [.19444, .43056, .03588, .05556, .49028],
                    122: [0, .43056, .04398, .05556, .46505],
                    915: [0, .68333, .13889, .08334, .61528],
                    916: [0, .68333, 0, .16667, .83334],
                    920: [0, .68333, .02778, .08334, .76278],
                    923: [0, .68333, 0, .16667, .69445],
                    926: [0, .68333, .07569, .08334, .74236],
                    928: [0, .68333, .08125, .05556, .83125],
                    931: [0, .68333, .05764, .08334, .77986],
                    933: [0, .68333, .13889, .05556, .58333],
                    934: [0, .68333, 0, .08334, .66667],
                    936: [0, .68333, .11, .05556, .61222],
                    937: [0, .68333, .05017, .08334, .7724],
                    945: [0, .43056, .0037, .02778, .6397],
                    946: [.19444, .69444, .05278, .08334, .56563],
                    947: [.19444, .43056, .05556, 0, .51773],
                    948: [0, .69444, .03785, .05556, .44444],
                    949: [0, .43056, 0, .08334, .46632],
                    950: [.19444, .69444, .07378, .08334, .4375],
                    951: [.19444, .43056, .03588, .05556, .49653],
                    952: [0, .69444, .02778, .08334, .46944],
                    953: [0, .43056, 0, .05556, .35394],
                    954: [0, .43056, 0, 0, .57616],
                    955: [0, .69444, 0, 0, .58334],
                    956: [.19444, .43056, 0, .02778, .60255],
                    957: [0, .43056, .06366, .02778, .49398],
                    958: [.19444, .69444, .04601, .11111, .4375],
                    959: [0, .43056, 0, .05556, .48472],
                    960: [0, .43056, .03588, 0, .57003],
                    961: [.19444, .43056, 0, .08334, .51702],
                    962: [.09722, .43056, .07986, .08334, .36285],
                    963: [0, .43056, .03588, 0, .57141],
                    964: [0, .43056, .1132, .02778, .43715],
                    965: [0, .43056, .03588, .02778, .54028],
                    966: [.19444, .43056, 0, .08334, .65417],
                    967: [.19444, .43056, 0, .05556, .62569],
                    968: [.19444, .69444, .03588, .11111, .65139],
                    969: [0, .43056, .03588, 0, .62245],
                    977: [0, .69444, 0, .08334, .59144],
                    981: [.19444, .69444, 0, .08334, .59583],
                    982: [0, .43056, .02778, 0, .82813],
                    1009: [.19444, .43056, 0, .08334, .51702],
                    1013: [0, .43056, 0, .05556, .4059]
                },
                "SansSerif-Bold": {
                    33: [0, .69444, 0, 0, .36667],
                    34: [0, .69444, 0, 0, .55834],
                    35: [.19444, .69444, 0, 0, .91667],
                    36: [.05556, .75, 0, 0, .55],
                    37: [.05556, .75, 0, 0, 1.02912],
                    38: [0, .69444, 0, 0, .83056],
                    39: [0, .69444, 0, 0, .30556],
                    40: [.25, .75, 0, 0, .42778],
                    41: [.25, .75, 0, 0, .42778],
                    42: [0, .75, 0, 0, .55],
                    43: [.11667, .61667, 0, 0, .85556],
                    44: [.10556, .13056, 0, 0, .30556],
                    45: [0, .45833, 0, 0, .36667],
                    46: [0, .13056, 0, 0, .30556],
                    47: [.25, .75, 0, 0, .55],
                    48: [0, .69444, 0, 0, .55],
                    49: [0, .69444, 0, 0, .55],
                    50: [0, .69444, 0, 0, .55],
                    51: [0, .69444, 0, 0, .55],
                    52: [0, .69444, 0, 0, .55],
                    53: [0, .69444, 0, 0, .55],
                    54: [0, .69444, 0, 0, .55],
                    55: [0, .69444, 0, 0, .55],
                    56: [0, .69444, 0, 0, .55],
                    57: [0, .69444, 0, 0, .55],
                    58: [0, .45833, 0, 0, .30556],
                    59: [.10556, .45833, 0, 0, .30556],
                    61: [-.09375, .40625, 0, 0, .85556],
                    63: [0, .69444, 0, 0, .51945],
                    64: [0, .69444, 0, 0, .73334],
                    65: [0, .69444, 0, 0, .73334],
                    66: [0, .69444, 0, 0, .73334],
                    67: [0, .69444, 0, 0, .70278],
                    68: [0, .69444, 0, 0, .79445],
                    69: [0, .69444, 0, 0, .64167],
                    70: [0, .69444, 0, 0, .61111],
                    71: [0, .69444, 0, 0, .73334],
                    72: [0, .69444, 0, 0, .79445],
                    73: [0, .69444, 0, 0, .33056],
                    74: [0, .69444, 0, 0, .51945],
                    75: [0, .69444, 0, 0, .76389],
                    76: [0, .69444, 0, 0, .58056],
                    77: [0, .69444, 0, 0, .97778],
                    78: [0, .69444, 0, 0, .79445],
                    79: [0, .69444, 0, 0, .79445],
                    80: [0, .69444, 0, 0, .70278],
                    81: [.10556, .69444, 0, 0, .79445],
                    82: [0, .69444, 0, 0, .70278],
                    83: [0, .69444, 0, 0, .61111],
                    84: [0, .69444, 0, 0, .73334],
                    85: [0, .69444, 0, 0, .76389],
                    86: [0, .69444, .01528, 0, .73334],
                    87: [0, .69444, .01528, 0, 1.03889],
                    88: [0, .69444, 0, 0, .73334],
                    89: [0, .69444, .0275, 0, .73334],
                    90: [0, .69444, 0, 0, .67223],
                    91: [.25, .75, 0, 0, .34306],
                    93: [.25, .75, 0, 0, .34306],
                    94: [0, .69444, 0, 0, .55],
                    95: [.35, .10833, .03056, 0, .55],
                    97: [0, .45833, 0, 0, .525],
                    98: [0, .69444, 0, 0, .56111],
                    99: [0, .45833, 0, 0, .48889],
                    100: [0, .69444, 0, 0, .56111],
                    101: [0, .45833, 0, 0, .51111],
                    102: [0, .69444, .07639, 0, .33611],
                    103: [.19444, .45833, .01528, 0, .55],
                    104: [0, .69444, 0, 0, .56111],
                    105: [0, .69444, 0, 0, .25556],
                    106: [.19444, .69444, 0, 0, .28611],
                    107: [0, .69444, 0, 0, .53056],
                    108: [0, .69444, 0, 0, .25556],
                    109: [0, .45833, 0, 0, .86667],
                    110: [0, .45833, 0, 0, .56111],
                    111: [0, .45833, 0, 0, .55],
                    112: [.19444, .45833, 0, 0, .56111],
                    113: [.19444, .45833, 0, 0, .56111],
                    114: [0, .45833, .01528, 0, .37222],
                    115: [0, .45833, 0, 0, .42167],
                    116: [0, .58929, 0, 0, .40417],
                    117: [0, .45833, 0, 0, .56111],
                    118: [0, .45833, .01528, 0, .5],
                    119: [0, .45833, .01528, 0, .74445],
                    120: [0, .45833, 0, 0, .5],
                    121: [.19444, .45833, .01528, 0, .5],
                    122: [0, .45833, 0, 0, .47639],
                    126: [.35, .34444, 0, 0, .55],
                    168: [0, .69444, 0, 0, .55],
                    176: [0, .69444, 0, 0, .73334],
                    180: [0, .69444, 0, 0, .55],
                    184: [.17014, 0, 0, 0, .48889],
                    305: [0, .45833, 0, 0, .25556],
                    567: [.19444, .45833, 0, 0, .28611],
                    710: [0, .69444, 0, 0, .55],
                    711: [0, .63542, 0, 0, .55],
                    713: [0, .63778, 0, 0, .55],
                    728: [0, .69444, 0, 0, .55],
                    729: [0, .69444, 0, 0, .30556],
                    730: [0, .69444, 0, 0, .73334],
                    732: [0, .69444, 0, 0, .55],
                    733: [0, .69444, 0, 0, .55],
                    915: [0, .69444, 0, 0, .58056],
                    916: [0, .69444, 0, 0, .91667],
                    920: [0, .69444, 0, 0, .85556],
                    923: [0, .69444, 0, 0, .67223],
                    926: [0, .69444, 0, 0, .73334],
                    928: [0, .69444, 0, 0, .79445],
                    931: [0, .69444, 0, 0, .79445],
                    933: [0, .69444, 0, 0, .85556],
                    934: [0, .69444, 0, 0, .79445],
                    936: [0, .69444, 0, 0, .85556],
                    937: [0, .69444, 0, 0, .79445],
                    8211: [0, .45833, .03056, 0, .55],
                    8212: [0, .45833, .03056, 0, 1.10001],
                    8216: [0, .69444, 0, 0, .30556],
                    8217: [0, .69444, 0, 0, .30556],
                    8220: [0, .69444, 0, 0, .55834],
                    8221: [0, .69444, 0, 0, .55834]
                },
                "SansSerif-Italic": {
                    33: [0, .69444, .05733, 0, .31945],
                    34: [0, .69444, .00316, 0, .5],
                    35: [.19444, .69444, .05087, 0, .83334],
                    36: [.05556, .75, .11156, 0, .5],
                    37: [.05556, .75, .03126, 0, .83334],
                    38: [0, .69444, .03058, 0, .75834],
                    39: [0, .69444, .07816, 0, .27778],
                    40: [.25, .75, .13164, 0, .38889],
                    41: [.25, .75, .02536, 0, .38889],
                    42: [0, .75, .11775, 0, .5],
                    43: [.08333, .58333, .02536, 0, .77778],
                    44: [.125, .08333, 0, 0, .27778],
                    45: [0, .44444, .01946, 0, .33333],
                    46: [0, .08333, 0, 0, .27778],
                    47: [.25, .75, .13164, 0, .5],
                    48: [0, .65556, .11156, 0, .5],
                    49: [0, .65556, .11156, 0, .5],
                    50: [0, .65556, .11156, 0, .5],
                    51: [0, .65556, .11156, 0, .5],
                    52: [0, .65556, .11156, 0, .5],
                    53: [0, .65556, .11156, 0, .5],
                    54: [0, .65556, .11156, 0, .5],
                    55: [0, .65556, .11156, 0, .5],
                    56: [0, .65556, .11156, 0, .5],
                    57: [0, .65556, .11156, 0, .5],
                    58: [0, .44444, .02502, 0, .27778],
                    59: [.125, .44444, .02502, 0, .27778],
                    61: [-.13, .37, .05087, 0, .77778],
                    63: [0, .69444, .11809, 0, .47222],
                    64: [0, .69444, .07555, 0, .66667],
                    65: [0, .69444, 0, 0, .66667],
                    66: [0, .69444, .08293, 0, .66667],
                    67: [0, .69444, .11983, 0, .63889],
                    68: [0, .69444, .07555, 0, .72223],
                    69: [0, .69444, .11983, 0, .59722],
                    70: [0, .69444, .13372, 0, .56945],
                    71: [0, .69444, .11983, 0, .66667],
                    72: [0, .69444, .08094, 0, .70834],
                    73: [0, .69444, .13372, 0, .27778],
                    74: [0, .69444, .08094, 0, .47222],
                    75: [0, .69444, .11983, 0, .69445],
                    76: [0, .69444, 0, 0, .54167],
                    77: [0, .69444, .08094, 0, .875],
                    78: [0, .69444, .08094, 0, .70834],
                    79: [0, .69444, .07555, 0, .73611],
                    80: [0, .69444, .08293, 0, .63889],
                    81: [.125, .69444, .07555, 0, .73611],
                    82: [0, .69444, .08293, 0, .64584],
                    83: [0, .69444, .09205, 0, .55556],
                    84: [0, .69444, .13372, 0, .68056],
                    85: [0, .69444, .08094, 0, .6875],
                    86: [0, .69444, .1615, 0, .66667],
                    87: [0, .69444, .1615, 0, .94445],
                    88: [0, .69444, .13372, 0, .66667],
                    89: [0, .69444, .17261, 0, .66667],
                    90: [0, .69444, .11983, 0, .61111],
                    91: [.25, .75, .15942, 0, .28889],
                    93: [.25, .75, .08719, 0, .28889],
                    94: [0, .69444, .0799, 0, .5],
                    95: [.35, .09444, .08616, 0, .5],
                    97: [0, .44444, .00981, 0, .48056],
                    98: [0, .69444, .03057, 0, .51667],
                    99: [0, .44444, .08336, 0, .44445],
                    100: [0, .69444, .09483, 0, .51667],
                    101: [0, .44444, .06778, 0, .44445],
                    102: [0, .69444, .21705, 0, .30556],
                    103: [.19444, .44444, .10836, 0, .5],
                    104: [0, .69444, .01778, 0, .51667],
                    105: [0, .67937, .09718, 0, .23889],
                    106: [.19444, .67937, .09162, 0, .26667],
                    107: [0, .69444, .08336, 0, .48889],
                    108: [0, .69444, .09483, 0, .23889],
                    109: [0, .44444, .01778, 0, .79445],
                    110: [0, .44444, .01778, 0, .51667],
                    111: [0, .44444, .06613, 0, .5],
                    112: [.19444, .44444, .0389, 0, .51667],
                    113: [.19444, .44444, .04169, 0, .51667],
                    114: [0, .44444, .10836, 0, .34167],
                    115: [0, .44444, .0778, 0, .38333],
                    116: [0, .57143, .07225, 0, .36111],
                    117: [0, .44444, .04169, 0, .51667],
                    118: [0, .44444, .10836, 0, .46111],
                    119: [0, .44444, .10836, 0, .68334],
                    120: [0, .44444, .09169, 0, .46111],
                    121: [.19444, .44444, .10836, 0, .46111],
                    122: [0, .44444, .08752, 0, .43472],
                    126: [.35, .32659, .08826, 0, .5],
                    168: [0, .67937, .06385, 0, .5],
                    176: [0, .69444, 0, 0, .73752],
                    184: [.17014, 0, 0, 0, .44445],
                    305: [0, .44444, .04169, 0, .23889],
                    567: [.19444, .44444, .04169, 0, .26667],
                    710: [0, .69444, .0799, 0, .5],
                    711: [0, .63194, .08432, 0, .5],
                    713: [0, .60889, .08776, 0, .5],
                    714: [0, .69444, .09205, 0, .5],
                    715: [0, .69444, 0, 0, .5],
                    728: [0, .69444, .09483, 0, .5],
                    729: [0, .67937, .07774, 0, .27778],
                    730: [0, .69444, 0, 0, .73752],
                    732: [0, .67659, .08826, 0, .5],
                    733: [0, .69444, .09205, 0, .5],
                    915: [0, .69444, .13372, 0, .54167],
                    916: [0, .69444, 0, 0, .83334],
                    920: [0, .69444, .07555, 0, .77778],
                    923: [0, .69444, 0, 0, .61111],
                    926: [0, .69444, .12816, 0, .66667],
                    928: [0, .69444, .08094, 0, .70834],
                    931: [0, .69444, .11983, 0, .72222],
                    933: [0, .69444, .09031, 0, .77778],
                    934: [0, .69444, .04603, 0, .72222],
                    936: [0, .69444, .09031, 0, .77778],
                    937: [0, .69444, .08293, 0, .72222],
                    8211: [0, .44444, .08616, 0, .5],
                    8212: [0, .44444, .08616, 0, 1],
                    8216: [0, .69444, .07816, 0, .27778],
                    8217: [0, .69444, .07816, 0, .27778],
                    8220: [0, .69444, .14205, 0, .5],
                    8221: [0, .69444, .00316, 0, .5]
                },
                "SansSerif-Regular": {
                    33: [0, .69444, 0, 0, .31945],
                    34: [0, .69444, 0, 0, .5],
                    35: [.19444, .69444, 0, 0, .83334],
                    36: [.05556, .75, 0, 0, .5],
                    37: [.05556, .75, 0, 0, .83334],
                    38: [0, .69444, 0, 0, .75834],
                    39: [0, .69444, 0, 0, .27778],
                    40: [.25, .75, 0, 0, .38889],
                    41: [.25, .75, 0, 0, .38889],
                    42: [0, .75, 0, 0, .5],
                    43: [.08333, .58333, 0, 0, .77778],
                    44: [.125, .08333, 0, 0, .27778],
                    45: [0, .44444, 0, 0, .33333],
                    46: [0, .08333, 0, 0, .27778],
                    47: [.25, .75, 0, 0, .5],
                    48: [0, .65556, 0, 0, .5],
                    49: [0, .65556, 0, 0, .5],
                    50: [0, .65556, 0, 0, .5],
                    51: [0, .65556, 0, 0, .5],
                    52: [0, .65556, 0, 0, .5],
                    53: [0, .65556, 0, 0, .5],
                    54: [0, .65556, 0, 0, .5],
                    55: [0, .65556, 0, 0, .5],
                    56: [0, .65556, 0, 0, .5],
                    57: [0, .65556, 0, 0, .5],
                    58: [0, .44444, 0, 0, .27778],
                    59: [.125, .44444, 0, 0, .27778],
                    61: [-.13, .37, 0, 0, .77778],
                    63: [0, .69444, 0, 0, .47222],
                    64: [0, .69444, 0, 0, .66667],
                    65: [0, .69444, 0, 0, .66667],
                    66: [0, .69444, 0, 0, .66667],
                    67: [0, .69444, 0, 0, .63889],
                    68: [0, .69444, 0, 0, .72223],
                    69: [0, .69444, 0, 0, .59722],
                    70: [0, .69444, 0, 0, .56945],
                    71: [0, .69444, 0, 0, .66667],
                    72: [0, .69444, 0, 0, .70834],
                    73: [0, .69444, 0, 0, .27778],
                    74: [0, .69444, 0, 0, .47222],
                    75: [0, .69444, 0, 0, .69445],
                    76: [0, .69444, 0, 0, .54167],
                    77: [0, .69444, 0, 0, .875],
                    78: [0, .69444, 0, 0, .70834],
                    79: [0, .69444, 0, 0, .73611],
                    80: [0, .69444, 0, 0, .63889],
                    81: [.125, .69444, 0, 0, .73611],
                    82: [0, .69444, 0, 0, .64584],
                    83: [0, .69444, 0, 0, .55556],
                    84: [0, .69444, 0, 0, .68056],
                    85: [0, .69444, 0, 0, .6875],
                    86: [0, .69444, .01389, 0, .66667],
                    87: [0, .69444, .01389, 0, .94445],
                    88: [0, .69444, 0, 0, .66667],
                    89: [0, .69444, .025, 0, .66667],
                    90: [0, .69444, 0, 0, .61111],
                    91: [.25, .75, 0, 0, .28889],
                    93: [.25, .75, 0, 0, .28889],
                    94: [0, .69444, 0, 0, .5],
                    95: [.35, .09444, .02778, 0, .5],
                    97: [0, .44444, 0, 0, .48056],
                    98: [0, .69444, 0, 0, .51667],
                    99: [0, .44444, 0, 0, .44445],
                    100: [0, .69444, 0, 0, .51667],
                    101: [0, .44444, 0, 0, .44445],
                    102: [0, .69444, .06944, 0, .30556],
                    103: [.19444, .44444, .01389, 0, .5],
                    104: [0, .69444, 0, 0, .51667],
                    105: [0, .67937, 0, 0, .23889],
                    106: [.19444, .67937, 0, 0, .26667],
                    107: [0, .69444, 0, 0, .48889],
                    108: [0, .69444, 0, 0, .23889],
                    109: [0, .44444, 0, 0, .79445],
                    110: [0, .44444, 0, 0, .51667],
                    111: [0, .44444, 0, 0, .5],
                    112: [.19444, .44444, 0, 0, .51667],
                    113: [.19444, .44444, 0, 0, .51667],
                    114: [0, .44444, .01389, 0, .34167],
                    115: [0, .44444, 0, 0, .38333],
                    116: [0, .57143, 0, 0, .36111],
                    117: [0, .44444, 0, 0, .51667],
                    118: [0, .44444, .01389, 0, .46111],
                    119: [0, .44444, .01389, 0, .68334],
                    120: [0, .44444, 0, 0, .46111],
                    121: [.19444, .44444, .01389, 0, .46111],
                    122: [0, .44444, 0, 0, .43472],
                    126: [.35, .32659, 0, 0, .5],
                    168: [0, .67937, 0, 0, .5],
                    176: [0, .69444, 0, 0, .66667],
                    184: [.17014, 0, 0, 0, .44445],
                    305: [0, .44444, 0, 0, .23889],
                    567: [.19444, .44444, 0, 0, .26667],
                    710: [0, .69444, 0, 0, .5],
                    711: [0, .63194, 0, 0, .5],
                    713: [0, .60889, 0, 0, .5],
                    714: [0, .69444, 0, 0, .5],
                    715: [0, .69444, 0, 0, .5],
                    728: [0, .69444, 0, 0, .5],
                    729: [0, .67937, 0, 0, .27778],
                    730: [0, .69444, 0, 0, .66667],
                    732: [0, .67659, 0, 0, .5],
                    733: [0, .69444, 0, 0, .5],
                    915: [0, .69444, 0, 0, .54167],
                    916: [0, .69444, 0, 0, .83334],
                    920: [0, .69444, 0, 0, .77778],
                    923: [0, .69444, 0, 0, .61111],
                    926: [0, .69444, 0, 0, .66667],
                    928: [0, .69444, 0, 0, .70834],
                    931: [0, .69444, 0, 0, .72222],
                    933: [0, .69444, 0, 0, .77778],
                    934: [0, .69444, 0, 0, .72222],
                    936: [0, .69444, 0, 0, .77778],
                    937: [0, .69444, 0, 0, .72222],
                    8211: [0, .44444, .02778, 0, .5],
                    8212: [0, .44444, .02778, 0, 1],
                    8216: [0, .69444, 0, 0, .27778],
                    8217: [0, .69444, 0, 0, .27778],
                    8220: [0, .69444, 0, 0, .5],
                    8221: [0, .69444, 0, 0, .5]
                },
                "Script-Regular": {
                    65: [0, .7, .22925, 0, .80253],
                    66: [0, .7, .04087, 0, .90757],
                    67: [0, .7, .1689, 0, .66619],
                    68: [0, .7, .09371, 0, .77443],
                    69: [0, .7, .18583, 0, .56162],
                    70: [0, .7, .13634, 0, .89544],
                    71: [0, .7, .17322, 0, .60961],
                    72: [0, .7, .29694, 0, .96919],
                    73: [0, .7, .19189, 0, .80907],
                    74: [.27778, .7, .19189, 0, 1.05159],
                    75: [0, .7, .31259, 0, .91364],
                    76: [0, .7, .19189, 0, .87373],
                    77: [0, .7, .15981, 0, 1.08031],
                    78: [0, .7, .3525, 0, .9015],
                    79: [0, .7, .08078, 0, .73787],
                    80: [0, .7, .08078, 0, 1.01262],
                    81: [0, .7, .03305, 0, .88282],
                    82: [0, .7, .06259, 0, .85],
                    83: [0, .7, .19189, 0, .86767],
                    84: [0, .7, .29087, 0, .74697],
                    85: [0, .7, .25815, 0, .79996],
                    86: [0, .7, .27523, 0, .62204],
                    87: [0, .7, .27523, 0, .80532],
                    88: [0, .7, .26006, 0, .94445],
                    89: [0, .7, .2939, 0, .70961],
                    90: [0, .7, .24037, 0, .8212]
                },
                "Size1-Regular": {
                    40: [.35001, .85, 0, 0, .45834],
                    41: [.35001, .85, 0, 0, .45834],
                    47: [.35001, .85, 0, 0, .57778],
                    91: [.35001, .85, 0, 0, .41667],
                    92: [.35001, .85, 0, 0, .57778],
                    93: [.35001, .85, 0, 0, .41667],
                    123: [.35001, .85, 0, 0, .58334],
                    125: [.35001, .85, 0, 0, .58334],
                    710: [0, .72222, 0, 0, .55556],
                    732: [0, .72222, 0, 0, .55556],
                    770: [0, .72222, 0, 0, .55556],
                    771: [0, .72222, 0, 0, .55556],
                    8214: [-99e-5, .601, 0, 0, .77778],
                    8593: [1e-5, .6, 0, 0, .66667],
                    8595: [1e-5, .6, 0, 0, .66667],
                    8657: [1e-5, .6, 0, 0, .77778],
                    8659: [1e-5, .6, 0, 0, .77778],
                    8719: [.25001, .75, 0, 0, .94445],
                    8720: [.25001, .75, 0, 0, .94445],
                    8721: [.25001, .75, 0, 0, 1.05556],
                    8730: [.35001, .85, 0, 0, 1],
                    8739: [-.00599, .606, 0, 0, .33333],
                    8741: [-.00599, .606, 0, 0, .55556],
                    8747: [.30612, .805, .19445, 0, .47222],
                    8748: [.306, .805, .19445, 0, .47222],
                    8749: [.306, .805, .19445, 0, .47222],
                    8750: [.30612, .805, .19445, 0, .47222],
                    8896: [.25001, .75, 0, 0, .83334],
                    8897: [.25001, .75, 0, 0, .83334],
                    8898: [.25001, .75, 0, 0, .83334],
                    8899: [.25001, .75, 0, 0, .83334],
                    8968: [.35001, .85, 0, 0, .47222],
                    8969: [.35001, .85, 0, 0, .47222],
                    8970: [.35001, .85, 0, 0, .47222],
                    8971: [.35001, .85, 0, 0, .47222],
                    9168: [-99e-5, .601, 0, 0, .66667],
                    10216: [.35001, .85, 0, 0, .47222],
                    10217: [.35001, .85, 0, 0, .47222],
                    10752: [.25001, .75, 0, 0, 1.11111],
                    10753: [.25001, .75, 0, 0, 1.11111],
                    10754: [.25001, .75, 0, 0, 1.11111],
                    10756: [.25001, .75, 0, 0, .83334],
                    10758: [.25001, .75, 0, 0, .83334]
                },
                "Size2-Regular": {
                    40: [.65002, 1.15, 0, 0, .59722],
                    41: [.65002, 1.15, 0, 0, .59722],
                    47: [.65002, 1.15, 0, 0, .81111],
                    91: [.65002, 1.15, 0, 0, .47222],
                    92: [.65002, 1.15, 0, 0, .81111],
                    93: [.65002, 1.15, 0, 0, .47222],
                    123: [.65002, 1.15, 0, 0, .66667],
                    125: [.65002, 1.15, 0, 0, .66667],
                    710: [0, .75, 0, 0, 1],
                    732: [0, .75, 0, 0, 1],
                    770: [0, .75, 0, 0, 1],
                    771: [0, .75, 0, 0, 1],
                    8719: [.55001, 1.05, 0, 0, 1.27778],
                    8720: [.55001, 1.05, 0, 0, 1.27778],
                    8721: [.55001, 1.05, 0, 0, 1.44445],
                    8730: [.65002, 1.15, 0, 0, 1],
                    8747: [.86225, 1.36, .44445, 0, .55556],
                    8748: [.862, 1.36, .44445, 0, .55556],
                    8749: [.862, 1.36, .44445, 0, .55556],
                    8750: [.86225, 1.36, .44445, 0, .55556],
                    8896: [.55001, 1.05, 0, 0, 1.11111],
                    8897: [.55001, 1.05, 0, 0, 1.11111],
                    8898: [.55001, 1.05, 0, 0, 1.11111],
                    8899: [.55001, 1.05, 0, 0, 1.11111],
                    8968: [.65002, 1.15, 0, 0, .52778],
                    8969: [.65002, 1.15, 0, 0, .52778],
                    8970: [.65002, 1.15, 0, 0, .52778],
                    8971: [.65002, 1.15, 0, 0, .52778],
                    10216: [.65002, 1.15, 0, 0, .61111],
                    10217: [.65002, 1.15, 0, 0, .61111],
                    10752: [.55001, 1.05, 0, 0, 1.51112],
                    10753: [.55001, 1.05, 0, 0, 1.51112],
                    10754: [.55001, 1.05, 0, 0, 1.51112],
                    10756: [.55001, 1.05, 0, 0, 1.11111],
                    10758: [.55001, 1.05, 0, 0, 1.11111]
                },
                "Size3-Regular": {
                    40: [.95003, 1.45, 0, 0, .73611],
                    41: [.95003, 1.45, 0, 0, .73611],
                    47: [.95003, 1.45, 0, 0, 1.04445],
                    91: [.95003, 1.45, 0, 0, .52778],
                    92: [.95003, 1.45, 0, 0, 1.04445],
                    93: [.95003, 1.45, 0, 0, .52778],
                    123: [.95003, 1.45, 0, 0, .75],
                    125: [.95003, 1.45, 0, 0, .75],
                    710: [0, .75, 0, 0, 1.44445],
                    732: [0, .75, 0, 0, 1.44445],
                    770: [0, .75, 0, 0, 1.44445],
                    771: [0, .75, 0, 0, 1.44445],
                    8730: [.95003, 1.45, 0, 0, 1],
                    8968: [.95003, 1.45, 0, 0, .58334],
                    8969: [.95003, 1.45, 0, 0, .58334],
                    8970: [.95003, 1.45, 0, 0, .58334],
                    8971: [.95003, 1.45, 0, 0, .58334],
                    10216: [.95003, 1.45, 0, 0, .75],
                    10217: [.95003, 1.45, 0, 0, .75]
                },
                "Size4-Regular": {
                    40: [1.25003, 1.75, 0, 0, .79167],
                    41: [1.25003, 1.75, 0, 0, .79167],
                    47: [1.25003, 1.75, 0, 0, 1.27778],
                    91: [1.25003, 1.75, 0, 0, .58334],
                    92: [1.25003, 1.75, 0, 0, 1.27778],
                    93: [1.25003, 1.75, 0, 0, .58334],
                    123: [1.25003, 1.75, 0, 0, .80556],
                    125: [1.25003, 1.75, 0, 0, .80556],
                    710: [0, .825, 0, 0, 1.8889],
                    732: [0, .825, 0, 0, 1.8889],
                    770: [0, .825, 0, 0, 1.8889],
                    771: [0, .825, 0, 0, 1.8889],
                    8730: [1.25003, 1.75, 0, 0, 1],
                    8968: [1.25003, 1.75, 0, 0, .63889],
                    8969: [1.25003, 1.75, 0, 0, .63889],
                    8970: [1.25003, 1.75, 0, 0, .63889],
                    8971: [1.25003, 1.75, 0, 0, .63889],
                    9115: [.64502, 1.155, 0, 0, .875],
                    9116: [1e-5, .6, 0, 0, .875],
                    9117: [.64502, 1.155, 0, 0, .875],
                    9118: [.64502, 1.155, 0, 0, .875],
                    9119: [1e-5, .6, 0, 0, .875],
                    9120: [.64502, 1.155, 0, 0, .875],
                    9121: [.64502, 1.155, 0, 0, .66667],
                    9122: [-99e-5, .601, 0, 0, .66667],
                    9123: [.64502, 1.155, 0, 0, .66667],
                    9124: [.64502, 1.155, 0, 0, .66667],
                    9125: [-99e-5, .601, 0, 0, .66667],
                    9126: [.64502, 1.155, 0, 0, .66667],
                    9127: [1e-5, .9, 0, 0, .88889],
                    9128: [.65002, 1.15, 0, 0, .88889],
                    9129: [.90001, 0, 0, 0, .88889],
                    9130: [0, .3, 0, 0, .88889],
                    9131: [1e-5, .9, 0, 0, .88889],
                    9132: [.65002, 1.15, 0, 0, .88889],
                    9133: [.90001, 0, 0, 0, .88889],
                    9143: [.88502, .915, 0, 0, 1.05556],
                    10216: [1.25003, 1.75, 0, 0, .80556],
                    10217: [1.25003, 1.75, 0, 0, .80556],
                    57344: [-.00499, .605, 0, 0, 1.05556],
                    57345: [-.00499, .605, 0, 0, 1.05556],
                    57680: [0, .12, 0, 0, .45],
                    57681: [0, .12, 0, 0, .45],
                    57682: [0, .12, 0, 0, .45],
                    57683: [0, .12, 0, 0, .45]
                },
                "Typewriter-Regular": {
                    32: [0, 0, 0, 0, .525],
                    33: [0, .61111, 0, 0, .525],
                    34: [0, .61111, 0, 0, .525],
                    35: [0, .61111, 0, 0, .525],
                    36: [.08333, .69444, 0, 0, .525],
                    37: [.08333, .69444, 0, 0, .525],
                    38: [0, .61111, 0, 0, .525],
                    39: [0, .61111, 0, 0, .525],
                    40: [.08333, .69444, 0, 0, .525],
                    41: [.08333, .69444, 0, 0, .525],
                    42: [0, .52083, 0, 0, .525],
                    43: [-.08056, .53055, 0, 0, .525],
                    44: [.13889, .125, 0, 0, .525],
                    45: [-.08056, .53055, 0, 0, .525],
                    46: [0, .125, 0, 0, .525],
                    47: [.08333, .69444, 0, 0, .525],
                    48: [0, .61111, 0, 0, .525],
                    49: [0, .61111, 0, 0, .525],
                    50: [0, .61111, 0, 0, .525],
                    51: [0, .61111, 0, 0, .525],
                    52: [0, .61111, 0, 0, .525],
                    53: [0, .61111, 0, 0, .525],
                    54: [0, .61111, 0, 0, .525],
                    55: [0, .61111, 0, 0, .525],
                    56: [0, .61111, 0, 0, .525],
                    57: [0, .61111, 0, 0, .525],
                    58: [0, .43056, 0, 0, .525],
                    59: [.13889, .43056, 0, 0, .525],
                    60: [-.05556, .55556, 0, 0, .525],
                    61: [-.19549, .41562, 0, 0, .525],
                    62: [-.05556, .55556, 0, 0, .525],
                    63: [0, .61111, 0, 0, .525],
                    64: [0, .61111, 0, 0, .525],
                    65: [0, .61111, 0, 0, .525],
                    66: [0, .61111, 0, 0, .525],
                    67: [0, .61111, 0, 0, .525],
                    68: [0, .61111, 0, 0, .525],
                    69: [0, .61111, 0, 0, .525],
                    70: [0, .61111, 0, 0, .525],
                    71: [0, .61111, 0, 0, .525],
                    72: [0, .61111, 0, 0, .525],
                    73: [0, .61111, 0, 0, .525],
                    74: [0, .61111, 0, 0, .525],
                    75: [0, .61111, 0, 0, .525],
                    76: [0, .61111, 0, 0, .525],
                    77: [0, .61111, 0, 0, .525],
                    78: [0, .61111, 0, 0, .525],
                    79: [0, .61111, 0, 0, .525],
                    80: [0, .61111, 0, 0, .525],
                    81: [.13889, .61111, 0, 0, .525],
                    82: [0, .61111, 0, 0, .525],
                    83: [0, .61111, 0, 0, .525],
                    84: [0, .61111, 0, 0, .525],
                    85: [0, .61111, 0, 0, .525],
                    86: [0, .61111, 0, 0, .525],
                    87: [0, .61111, 0, 0, .525],
                    88: [0, .61111, 0, 0, .525],
                    89: [0, .61111, 0, 0, .525],
                    90: [0, .61111, 0, 0, .525],
                    91: [.08333, .69444, 0, 0, .525],
                    92: [.08333, .69444, 0, 0, .525],
                    93: [.08333, .69444, 0, 0, .525],
                    94: [0, .61111, 0, 0, .525],
                    95: [.09514, 0, 0, 0, .525],
                    96: [0, .61111, 0, 0, .525],
                    97: [0, .43056, 0, 0, .525],
                    98: [0, .61111, 0, 0, .525],
                    99: [0, .43056, 0, 0, .525],
                    100: [0, .61111, 0, 0, .525],
                    101: [0, .43056, 0, 0, .525],
                    102: [0, .61111, 0, 0, .525],
                    103: [.22222, .43056, 0, 0, .525],
                    104: [0, .61111, 0, 0, .525],
                    105: [0, .61111, 0, 0, .525],
                    106: [.22222, .61111, 0, 0, .525],
                    107: [0, .61111, 0, 0, .525],
                    108: [0, .61111, 0, 0, .525],
                    109: [0, .43056, 0, 0, .525],
                    110: [0, .43056, 0, 0, .525],
                    111: [0, .43056, 0, 0, .525],
                    112: [.22222, .43056, 0, 0, .525],
                    113: [.22222, .43056, 0, 0, .525],
                    114: [0, .43056, 0, 0, .525],
                    115: [0, .43056, 0, 0, .525],
                    116: [0, .55358, 0, 0, .525],
                    117: [0, .43056, 0, 0, .525],
                    118: [0, .43056, 0, 0, .525],
                    119: [0, .43056, 0, 0, .525],
                    120: [0, .43056, 0, 0, .525],
                    121: [.22222, .43056, 0, 0, .525],
                    122: [0, .43056, 0, 0, .525],
                    123: [.08333, .69444, 0, 0, .525],
                    124: [.08333, .69444, 0, 0, .525],
                    125: [.08333, .69444, 0, 0, .525],
                    126: [0, .61111, 0, 0, .525],
                    127: [0, .61111, 0, 0, .525],
                    160: [0, 0, 0, 0, .525],
                    176: [0, .61111, 0, 0, .525],
                    184: [.19445, 0, 0, 0, .525],
                    305: [0, .43056, 0, 0, .525],
                    567: [.22222, .43056, 0, 0, .525],
                    711: [0, .56597, 0, 0, .525],
                    713: [0, .56555, 0, 0, .525],
                    714: [0, .61111, 0, 0, .525],
                    715: [0, .61111, 0, 0, .525],
                    728: [0, .61111, 0, 0, .525],
                    730: [0, .61111, 0, 0, .525],
                    770: [0, .61111, 0, 0, .525],
                    771: [0, .61111, 0, 0, .525],
                    776: [0, .61111, 0, 0, .525],
                    915: [0, .61111, 0, 0, .525],
                    916: [0, .61111, 0, 0, .525],
                    920: [0, .61111, 0, 0, .525],
                    923: [0, .61111, 0, 0, .525],
                    926: [0, .61111, 0, 0, .525],
                    928: [0, .61111, 0, 0, .525],
                    931: [0, .61111, 0, 0, .525],
                    933: [0, .61111, 0, 0, .525],
                    934: [0, .61111, 0, 0, .525],
                    936: [0, .61111, 0, 0, .525],
                    937: [0, .61111, 0, 0, .525],
                    8216: [0, .61111, 0, 0, .525],
                    8217: [0, .61111, 0, 0, .525],
                    8242: [0, .61111, 0, 0, .525],
                    9251: [.11111, .21944, 0, 0, .525]
                }
            }, ot = {
                slant: [.25, .25, .25],
                space: [0, 0, 0],
                stretch: [0, 0, 0],
                shrink: [0, 0, 0],
                xHeight: [.431, .431, .431],
                quad: [1, 1.171, 1.472],
                extraSpace: [0, 0, 0],
                num1: [.677, .732, .925],
                num2: [.394, .384, .387],
                num3: [.444, .471, .504],
                denom1: [.686, .752, 1.025],
                denom2: [.345, .344, .532],
                sup1: [.413, .503, .504],
                sup2: [.363, .431, .404],
                sup3: [.289, .286, .294],
                sub1: [.15, .143, .2],
                sub2: [.247, .286, .4],
                supDrop: [.386, .353, .494],
                subDrop: [.05, .071, .1],
                delim1: [2.39, 1.7, 1.98],
                delim2: [1.01, 1.157, 1.42],
                axisHeight: [.25, .25, .25],
                defaultRuleThickness: [.04, .049, .049],
                bigOpSpacing1: [.111, .111, .111],
                bigOpSpacing2: [.166, .166, .166],
                bigOpSpacing3: [.2, .2, .2],
                bigOpSpacing4: [.6, .611, .611],
                bigOpSpacing5: [.1, .143, .143],
                sqrtRuleThickness: [.04, .04, .04],
                ptPerEm: [10, 10, 10],
                doubleRuleSep: [.2, .2, .2]
            }, st = {
                "\xc5": "A",
                "\xc7": "C",
                "\xd0": "D",
                "\xde": "o",
                "\xe5": "a",
                "\xe7": "c",
                "\xf0": "d",
                "\xfe": "o",
                "\u0410": "A",
                "\u0411": "B",
                "\u0412": "B",
                "\u0413": "F",
                "\u0414": "A",
                "\u0415": "E",
                "\u0416": "K",
                "\u0417": "3",
                "\u0418": "N",
                "\u0419": "N",
                "\u041a": "K",
                "\u041b": "N",
                "\u041c": "M",
                "\u041d": "H",
                "\u041e": "O",
                "\u041f": "N",
                "\u0420": "P",
                "\u0421": "C",
                "\u0422": "T",
                "\u0423": "y",
                "\u0424": "O",
                "\u0425": "X",
                "\u0426": "U",
                "\u0427": "h",
                "\u0428": "W",
                "\u0429": "W",
                "\u042a": "B",
                "\u042b": "X",
                "\u042c": "B",
                "\u042d": "3",
                "\u042e": "X",
                "\u042f": "R",
                "\u0430": "a",
                "\u0431": "b",
                "\u0432": "a",
                "\u0433": "r",
                "\u0434": "y",
                "\u0435": "e",
                "\u0436": "m",
                "\u0437": "e",
                "\u0438": "n",
                "\u0439": "n",
                "\u043a": "n",
                "\u043b": "n",
                "\u043c": "m",
                "\u043d": "n",
                "\u043e": "o",
                "\u043f": "n",
                "\u0440": "p",
                "\u0441": "c",
                "\u0442": "o",
                "\u0443": "y",
                "\u0444": "b",
                "\u0445": "x",
                "\u0446": "n",
                "\u0447": "n",
                "\u0448": "w",
                "\u0449": "w",
                "\u044a": "a",
                "\u044b": "m",
                "\u044c": "a",
                "\u044d": "e",
                "\u044e": "m",
                "\u044f": "r"
            }, lt = {}, ht = {bin: 1, close: 1, inner: 1, open: 1, punct: 1, rel: 1},
            ct = {"accent-token": 1, mathord: 1, "op-token": 1, spacing: 1, textord: 1}, mt = {math: {}, text: {}},
            ut = mt, dt = "main", pt = "ams", ft = "bin", gt = "mathord", vt = "op-token", xt = "rel", yt = "spacing";
        a("math", dt, xt, "\u2261", "\\equiv", !0), a("math", dt, xt, "\u227a", "\\prec", !0), a("math", dt, xt, "\u227b", "\\succ", !0), a("math", dt, xt, "\u223c", "\\sim", !0), a("math", dt, xt, "\u22a5", "\\perp"), a("math", dt, xt, "\u2aaf", "\\preceq", !0), a("math", dt, xt, "\u2ab0", "\\succeq", !0), a("math", dt, xt, "\u2243", "\\simeq", !0), a("math", dt, xt, "\u2223", "\\mid", !0), a("math", dt, xt, "\u226a", "\\ll", !0), a("math", dt, xt, "\u226b", "\\gg", !0), a("math", dt, xt, "\u224d", "\\asymp", !0), a("math", dt, xt, "\u2225", "\\parallel"), a("math", dt, xt, "\u22c8", "\\bowtie", !0), a("math", dt, xt, "\u2323", "\\smile", !0), a("math", dt, xt, "\u2291", "\\sqsubseteq", !0), a("math", dt, xt, "\u2292", "\\sqsupseteq", !0), a("math", dt, xt, "\u2250", "\\doteq", !0), a("math", dt, xt, "\u2322", "\\frown", !0), a("math", dt, xt, "\u220b", "\\ni", !0), a("math", dt, xt, "\u221d", "\\propto", !0), a("math", dt, xt, "\u22a2", "\\vdash", !0), a("math", dt, xt, "\u22a3", "\\dashv", !0), a("math", dt, xt, "\u220b", "\\owns"), a("math", dt, "punct", ".", "\\ldotp"), a("math", dt, "punct", "\u22c5", "\\cdotp"), a("math", dt, "textord", "#", "\\#"), a("text", dt, "textord", "#", "\\#"), a("math", dt, "textord", "&", "\\&"), a("text", dt, "textord", "&", "\\&"), a("math", dt, "textord", "\u2135", "\\aleph", !0), a("math", dt, "textord", "\u2200", "\\forall", !0), a("math", dt, "textord", "\u210f", "\\hbar", !0), a("math", dt, "textord", "\u2203", "\\exists", !0), a("math", dt, "textord", "\u2207", "\\nabla", !0), a("math", dt, "textord", "\u266d", "\\flat", !0), a("math", dt, "textord", "\u2113", "\\ell", !0), a("math", dt, "textord", "\u266e", "\\natural", !0), a("math", dt, "textord", "\u2663", "\\clubsuit", !0), a("math", dt, "textord", "\u2118", "\\wp", !0), a("math", dt, "textord", "\u266f", "\\sharp", !0), a("math", dt, "textord", "\u2662", "\\diamondsuit", !0), a("math", dt, "textord", "\u211c", "\\Re", !0), a("math", dt, "textord", "\u2661", "\\heartsuit", !0), a("math", dt, "textord", "\u2111", "\\Im", !0), a("math", dt, "textord", "\u2660", "\\spadesuit", !0), a("text", dt, "textord", "\xa7", "\\S", !0), a("text", dt, "textord", "\xb6", "\\P", !0), a("math", dt, "textord", "\u2020", "\\dag"), a("text", dt, "textord", "\u2020", "\\dag"), a("text", dt, "textord", "\u2020", "\\textdagger"), a("math", dt, "textord", "\u2021", "\\ddag"), a("text", dt, "textord", "\u2021", "\\ddag"), a("text", dt, "textord", "\u2021", "\\textdaggerdbl"), a("math", dt, "close", "\u23b1", "\\rmoustache", !0), a("math", dt, "open", "\u23b0", "\\lmoustache", !0), a("math", dt, "close", "\u27ef", "\\rgroup", !0), a("math", dt, "open", "\u27ee", "\\lgroup", !0), a("math", dt, ft, "\u2213", "\\mp", !0), a("math", dt, ft, "\u2296", "\\ominus", !0), a("math", dt, ft, "\u228e", "\\uplus", !0), a("math", dt, ft, "\u2293", "\\sqcap", !0), a("math", dt, ft, "\u2217", "\\ast"), a("math", dt, ft, "\u2294", "\\sqcup", !0), a("math", dt, ft, "\u25ef", "\\bigcirc"), a("math", dt, ft, "\u2219", "\\bullet"), a("math", dt, ft, "\u2021", "\\ddagger"), a("math", dt, ft, "\u2240", "\\wr", !0), a("math", dt, ft, "\u2a3f", "\\amalg"), a("math", dt, ft, "&", "\\And"), a("math", dt, xt, "\u27f5", "\\longleftarrow", !0), a("math", dt, xt, "\u21d0", "\\Leftarrow", !0), a("math", dt, xt, "\u27f8", "\\Longleftarrow", !0), a("math", dt, xt, "\u27f6", "\\longrightarrow", !0), a("math", dt, xt, "\u21d2", "\\Rightarrow", !0), a("math", dt, xt, "\u27f9", "\\Longrightarrow", !0), a("math", dt, xt, "\u2194", "\\leftrightarrow", !0), a("math", dt, xt, "\u27f7", "\\longleftrightarrow", !0), a("math", dt, xt, "\u21d4", "\\Leftrightarrow", !0), a("math", dt, xt, "\u27fa", "\\Longleftrightarrow", !0), a("math", dt, xt, "\u21a6", "\\mapsto", !0), a("math", dt, xt, "\u27fc", "\\longmapsto", !0), a("math", dt, xt, "\u2197", "\\nearrow", !0), a("math", dt, xt, "\u21a9", "\\hookleftarrow", !0), a("math", dt, xt, "\u21aa", "\\hookrightarrow", !0), a("math", dt, xt, "\u2198", "\\searrow", !0), a("math", dt, xt, "\u21bc", "\\leftharpoonup", !0), a("math", dt, xt, "\u21c0", "\\rightharpoonup", !0), a("math", dt, xt, "\u2199", "\\swarrow", !0), a("math", dt, xt, "\u21bd", "\\leftharpoondown", !0), a("math", dt, xt, "\u21c1", "\\rightharpoondown", !0), a("math", dt, xt, "\u2196", "\\nwarrow", !0), a("math", dt, xt, "\u21cc", "\\rightleftharpoons", !0), a("math", pt, xt, "\u226e", "\\nless", !0), a("math", pt, xt, "\ue010", "\\nleqslant"), a("math", pt, xt, "\ue011", "\\nleqq"), a("math", pt, xt, "\u2a87", "\\lneq", !0), a("math", pt, xt, "\u2268", "\\lneqq", !0), a("math", pt, xt, "\ue00c", "\\lvertneqq"), a("math", pt, xt, "\u22e6", "\\lnsim", !0), a("math", pt, xt, "\u2a89", "\\lnapprox", !0),a("math", pt, xt, "\u2280", "\\nprec", !0),a("math", pt, xt, "\u22e0", "\\npreceq", !0),a("math", pt, xt, "\u22e8", "\\precnsim", !0),a("math", pt, xt, "\u2ab9", "\\precnapprox", !0),a("math", pt, xt, "\u2241", "\\nsim", !0),a("math", pt, xt, "\ue006", "\\nshortmid"),a("math", pt, xt, "\u2224", "\\nmid", !0),a("math", pt, xt, "\u22ac", "\\nvdash", !0),a("math", pt, xt, "\u22ad", "\\nvDash", !0),a("math", pt, xt, "\u22ea", "\\ntriangleleft"),a("math", pt, xt, "\u22ec", "\\ntrianglelefteq", !0),a("math", pt, xt, "\u228a", "\\subsetneq", !0),a("math", pt, xt, "\ue01a", "\\varsubsetneq"),a("math", pt, xt, "\u2acb", "\\subsetneqq", !0),a("math", pt, xt, "\ue017", "\\varsubsetneqq"),a("math", pt, xt, "\u226f", "\\ngtr", !0),a("math", pt, xt, "\ue00f", "\\ngeqslant"),a("math", pt, xt, "\ue00e", "\\ngeqq"),a("math", pt, xt, "\u2a88", "\\gneq", !0),a("math", pt, xt, "\u2269", "\\gneqq", !0),a("math", pt, xt, "\ue00d", "\\gvertneqq"),a("math", pt, xt, "\u22e7", "\\gnsim", !0),a("math", pt, xt, "\u2a8a", "\\gnapprox", !0),a("math", pt, xt, "\u2281", "\\nsucc", !0),a("math", pt, xt, "\u22e1", "\\nsucceq", !0),a("math", pt, xt, "\u22e9", "\\succnsim", !0),a("math", pt, xt, "\u2aba", "\\succnapprox", !0),a("math", pt, xt, "\u2246", "\\ncong", !0),a("math", pt, xt, "\ue007", "\\nshortparallel"),a("math", pt, xt, "\u2226", "\\nparallel", !0),a("math", pt, xt, "\u22af", "\\nVDash", !0),a("math", pt, xt, "\u22eb", "\\ntriangleright"),a("math", pt, xt, "\u22ed", "\\ntrianglerighteq", !0),a("math", pt, xt, "\ue018", "\\nsupseteqq"),a("math", pt, xt, "\u228b", "\\supsetneq", !0),a("math", pt, xt, "\ue01b", "\\varsupsetneq"),a("math", pt, xt, "\u2acc", "\\supsetneqq", !0),a("math", pt, xt, "\ue019", "\\varsupsetneqq"),a("math", pt, xt, "\u22ae", "\\nVdash", !0),a("math", pt, xt, "\u2ab5", "\\precneqq", !0),a("math", pt, xt, "\u2ab6", "\\succneqq", !0),a("math", pt, xt, "\ue016", "\\nsubseteqq"),a("math", pt, ft, "\u22b4", "\\unlhd"),a("math", pt, ft, "\u22b5", "\\unrhd"),a("math", pt, xt, "\u219a", "\\nleftarrow", !0),a("math", pt, xt, "\u219b", "\\nrightarrow", !0),a("math", pt, xt, "\u21cd", "\\nLeftarrow", !0),a("math", pt, xt, "\u21cf", "\\nRightarrow", !0),a("math", pt, xt, "\u21ae", "\\nleftrightarrow", !0),a("math", pt, xt, "\u21ce", "\\nLeftrightarrow", !0),a("math", pt, xt, "\u25b3", "\\vartriangle"),a("math", pt, "textord", "\u210f", "\\hslash"),a("math", pt, "textord", "\u25bd", "\\triangledown"),a("math", pt, "textord", "\u25ca", "\\lozenge"),a("math", pt, "textord", "\u24c8", "\\circledS"),a("math", pt, "textord", "\xae", "\\circledR"),a("text", pt, "textord", "\xae", "\\circledR"),a("math", pt, "textord", "\u2221", "\\measuredangle", !0),a("math", pt, "textord", "\u2204", "\\nexists"),a("math", pt, "textord", "\u2127", "\\mho"),a("math", pt, "textord", "\u2132", "\\Finv", !0),a("math", pt, "textord", "\u2141", "\\Game", !0),a("math", pt, "textord", "k", "\\Bbbk"),a("math", pt, "textord", "\u2035", "\\backprime"),a("math", pt, "textord", "\u25b2", "\\blacktriangle"),a("math", pt, "textord", "\u25bc", "\\blacktriangledown"),a("math", pt, "textord", "\u25a0", "\\blacksquare"),a("math", pt, "textord", "\u29eb", "\\blacklozenge"),a("math", pt, "textord", "\u2605", "\\bigstar"),a("math", pt, "textord", "\u2222", "\\sphericalangle", !0),a("math", pt, "textord", "\u2201", "\\complement", !0),a("math", pt, "textord", "\xf0", "\\eth", !0),a("math", pt, "textord", "\u2571", "\\diagup"),a("math", pt, "textord", "\u2572", "\\diagdown"),a("math", pt, "textord", "\u25a1", "\\square"),a("math", pt, "textord", "\u25a1", "\\Box"),a("math", pt, "textord", "\u25ca", "\\Diamond"),a("math", pt, "textord", "\xa5", "\\yen", !0),a("text", pt, "textord", "\xa5", "\\yen", !0),a("math", pt, "textord", "\u2713", "\\checkmark", !0),a("text", pt, "textord", "\u2713", "\\checkmark"),a("math", pt, "textord", "\u2136", "\\beth", !0),a("math", pt, "textord", "\u2138", "\\daleth", !0),a("math", pt, "textord", "\u2137", "\\gimel", !0),a("math", pt, "textord", "\u03dd", "\\digamma"),a("math", pt, "textord", "\u03f0", "\\varkappa"),a("math", pt, "open", "\u250c", "\\ulcorner", !0),a("math", pt, "close", "\u2510", "\\urcorner", !0),a("math", pt, "open", "\u2514", "\\llcorner", !0),a("math", pt, "close", "\u2518", "\\lrcorner", !0),a("math", pt, xt, "\u2266", "\\leqq", !0),a("math", pt, xt, "\u2a7d", "\\leqslant", !0),a("math", pt, xt, "\u2a95", "\\eqslantless", !0),a("math", pt, xt, "\u2272", "\\lesssim", !0),a("math", pt, xt, "\u2a85", "\\lessapprox", !0),a("math", pt, xt, "\u224a", "\\approxeq", !0),a("math", pt, ft, "\u22d6", "\\lessdot"),a("math", pt, xt, "\u22d8", "\\lll", !0),a("math", pt, xt, "\u2276", "\\lessgtr", !0),a("math", pt, xt, "\u22da", "\\lesseqgtr", !0),a("math", pt, xt, "\u2a8b", "\\lesseqqgtr", !0),a("math", pt, xt, "\u2251", "\\doteqdot"),a("math", pt, xt, "\u2253", "\\risingdotseq", !0),a("math", pt, xt, "\u2252", "\\fallingdotseq", !0),a("math", pt, xt, "\u223d", "\\backsim", !0),a("math", pt, xt, "\u22cd", "\\backsimeq", !0),a("math", pt, xt, "\u2ac5", "\\subseteqq", !0),a("math", pt, xt, "\u22d0", "\\Subset", !0),a("math", pt, xt, "\u228f", "\\sqsubset", !0),a("math", pt, xt, "\u227c", "\\preccurlyeq", !0),a("math", pt, xt, "\u22de", "\\curlyeqprec", !0),a("math", pt, xt, "\u227e", "\\precsim", !0),a("math", pt, xt, "\u2ab7", "\\precapprox", !0),a("math", pt, xt, "\u22b2", "\\vartriangleleft"),a("math", pt, xt, "\u22b4", "\\trianglelefteq"),a("math", pt, xt, "\u22a8", "\\vDash", !0),a("math", pt, xt, "\u22aa", "\\Vvdash", !0),a("math", pt, xt, "\u2323", "\\smallsmile"),a("math", pt, xt, "\u2322", "\\smallfrown"),a("math", pt, xt, "\u224f", "\\bumpeq", !0),a("math", pt, xt, "\u224e", "\\Bumpeq", !0),a("math", pt, xt, "\u2267", "\\geqq", !0),a("math", pt, xt, "\u2a7e", "\\geqslant", !0),a("math", pt, xt, "\u2a96", "\\eqslantgtr", !0),a("math", pt, xt, "\u2273", "\\gtrsim", !0),a("math", pt, xt, "\u2a86", "\\gtrapprox", !0),a("math", pt, ft, "\u22d7", "\\gtrdot"),a("math", pt, xt, "\u22d9", "\\ggg", !0),a("math", pt, xt, "\u2277", "\\gtrless", !0),a("math", pt, xt, "\u22db", "\\gtreqless", !0),a("math", pt, xt, "\u2a8c", "\\gtreqqless", !0),a("math", pt, xt, "\u2256", "\\eqcirc", !0),a("math", pt, xt, "\u2257", "\\circeq", !0),a("math", pt, xt, "\u225c", "\\triangleq", !0),a("math", pt, xt, "\u223c", "\\thicksim"),a("math", pt, xt, "\u2248", "\\thickapprox"),a("math", pt, xt, "\u2ac6", "\\supseteqq", !0),a("math", pt, xt, "\u22d1", "\\Supset", !0),a("math", pt, xt, "\u2290", "\\sqsupset", !0),a("math", pt, xt, "\u227d", "\\succcurlyeq", !0),a("math", pt, xt, "\u22df", "\\curlyeqsucc", !0),a("math", pt, xt, "\u227f", "\\succsim", !0),a("math", pt, xt, "\u2ab8", "\\succapprox", !0),a("math", pt, xt, "\u22b3", "\\vartriangleright"),a("math", pt, xt, "\u22b5", "\\trianglerighteq"),a("math", pt, xt, "\u22a9", "\\Vdash", !0),a("math", pt, xt, "\u2223", "\\shortmid"),a("math", pt, xt, "\u2225", "\\shortparallel"),a("math", pt, xt, "\u226c", "\\between", !0),a("math", pt, xt, "\u22d4", "\\pitchfork", !0),a("math", pt, xt, "\u221d", "\\varpropto"),a("math", pt, xt, "\u25c0", "\\blacktriangleleft"),a("math", pt, xt, "\u2234", "\\therefore", !0),a("math", pt, xt, "\u220d", "\\backepsilon"),a("math", pt, xt, "\u25b6", "\\blacktriangleright"),a("math", pt, xt, "\u2235", "\\because", !0),a("math", pt, xt, "\u22d8", "\\llless"),a("math", pt, xt, "\u22d9", "\\gggtr"),a("math", pt, ft, "\u22b2", "\\lhd"),a("math", pt, ft, "\u22b3", "\\rhd"),a("math", pt, xt, "\u2242", "\\eqsim", !0),a("math", dt, xt, "\u22c8", "\\Join"),a("math", pt, xt, "\u2251", "\\Doteq", !0),a("math", pt, ft, "\u2214", "\\dotplus", !0),a("math", pt, ft, "\u2216", "\\smallsetminus"),a("math", pt, ft, "\u22d2", "\\Cap", !0),a("math", pt, ft, "\u22d3", "\\Cup", !0),a("math", pt, ft, "\u2a5e", "\\doublebarwedge", !0),a("math", pt, ft, "\u229f", "\\boxminus", !0),a("math", pt, ft, "\u229e", "\\boxplus", !0),a("math", pt, ft, "\u22c7", "\\divideontimes", !0),a("math", pt, ft, "\u22c9", "\\ltimes", !0),a("math", pt, ft, "\u22ca", "\\rtimes", !0),a("math", pt, ft, "\u22cb", "\\leftthreetimes", !0),a("math", pt, ft, "\u22cc", "\\rightthreetimes", !0),a("math", pt, ft, "\u22cf", "\\curlywedge", !0),a("math", pt, ft, "\u22ce", "\\curlyvee", !0),a("math", pt, ft, "\u229d", "\\circleddash", !0),a("math", pt, ft, "\u229b", "\\circledast", !0),a("math", pt, ft, "\u22c5", "\\centerdot"),a("math", pt, ft, "\u22ba", "\\intercal", !0),a("math", pt, ft, "\u22d2", "\\doublecap"),a("math", pt, ft, "\u22d3", "\\doublecup"),a("math", pt, ft, "\u22a0", "\\boxtimes", !0),a("math", pt, xt, "\u21e2", "\\dashrightarrow", !0),a("math", pt, xt, "\u21e0", "\\dashleftarrow", !0),a("math", pt, xt, "\u21c7", "\\leftleftarrows", !0),a("math", pt, xt, "\u21c6", "\\leftrightarrows", !0),a("math", pt, xt, "\u21da", "\\Lleftarrow", !0),a("math", pt, xt, "\u219e", "\\twoheadleftarrow", !0),a("math", pt, xt, "\u21a2", "\\leftarrowtail", !0),a("math", pt, xt, "\u21ab", "\\looparrowleft", !0),a("math", pt, xt, "\u21cb", "\\leftrightharpoons", !0),a("math", pt, xt, "\u21b6", "\\curvearrowleft", !0),a("math", pt, xt, "\u21ba", "\\circlearrowleft", !0),a("math", pt, xt, "\u21b0", "\\Lsh", !0),a("math", pt, xt, "\u21c8", "\\upuparrows", !0),a("math", pt, xt, "\u21bf", "\\upharpoonleft", !0),a("math", pt, xt, "\u21c3", "\\downharpoonleft", !0),a("math", pt, xt, "\u22b8", "\\multimap", !0),a("math", pt, xt, "\u21ad", "\\leftrightsquigarrow", !0),a("math", pt, xt, "\u21c9", "\\rightrightarrows", !0),a("math", pt, xt, "\u21c4", "\\rightleftarrows", !0),a("math", pt, xt, "\u21a0", "\\twoheadrightarrow", !0),a("math", pt, xt, "\u21a3", "\\rightarrowtail", !0),a("math", pt, xt, "\u21ac", "\\looparrowright", !0),a("math", pt, xt, "\u21b7", "\\curvearrowright", !0),a("math", pt, xt, "\u21bb", "\\circlearrowright", !0),a("math", pt, xt, "\u21b1", "\\Rsh", !0),a("math", pt, xt, "\u21ca", "\\downdownarrows", !0),a("math", pt, xt, "\u21be", "\\upharpoonright", !0),a("math", pt, xt, "\u21c2", "\\downharpoonright", !0),a("math", pt, xt, "\u21dd", "\\rightsquigarrow", !0),a("math", pt, xt, "\u21dd", "\\leadsto"),a("math", pt, xt, "\u21db", "\\Rrightarrow", !0),a("math", pt, xt, "\u21be", "\\restriction"),a("math", dt, "textord", "\u2018", "`"),a("math", dt, "textord", "$", "\\$"),a("text", dt, "textord", "$", "\\$"),a("text", dt, "textord", "$", "\\textdollar"),a("math", dt, "textord", "%", "\\%"),a("text", dt, "textord", "%", "\\%"),a("math", dt, "textord", "_", "\\_"),a("text", dt, "textord", "_", "\\_"),a("text", dt, "textord", "_", "\\textunderscore"),a("math", dt, "textord", "\u2220", "\\angle", !0),a("math", dt, "textord", "\u221e", "\\infty", !0),a("math", dt, "textord", "\u2032", "\\prime"),a("math", dt, "textord", "\u25b3", "\\triangle"),a("math", dt, "textord", "\u0393", "\\Gamma", !0),a("math", dt, "textord", "\u0394", "\\Delta", !0),a("math", dt, "textord", "\u0398", "\\Theta", !0),a("math", dt, "textord", "\u039b", "\\Lambda", !0),a("math", dt, "textord", "\u039e", "\\Xi", !0),a("math", dt, "textord", "\u03a0", "\\Pi", !0),a("math", dt, "textord", "\u03a3", "\\Sigma", !0),a("math", dt, "textord", "\u03a5", "\\Upsilon", !0),a("math", dt, "textord", "\u03a6", "\\Phi", !0),a("math", dt, "textord", "\u03a8", "\\Psi", !0),a("math", dt, "textord", "\u03a9", "\\Omega", !0),a("math", dt, "textord", "A", "\u0391"),a("math", dt, "textord", "B", "\u0392"),a("math", dt, "textord", "E", "\u0395"),a("math", dt, "textord", "Z", "\u0396"),a("math", dt, "textord", "H", "\u0397"),a("math", dt, "textord", "I", "\u0399"),a("math", dt, "textord", "K", "\u039a"),a("math", dt, "textord", "M", "\u039c"),a("math", dt, "textord", "N", "\u039d"),a("math", dt, "textord", "O", "\u039f"),a("math", dt, "textord", "P", "\u03a1"),a("math", dt, "textord", "T", "\u03a4"),a("math", dt, "textord", "X", "\u03a7"),a("math", dt, "textord", "\xac", "\\neg", !0),a("math", dt, "textord", "\xac", "\\lnot"),a("math", dt, "textord", "\u22a4", "\\top"),a("math", dt, "textord", "\u22a5", "\\bot"),a("math", dt, "textord", "\u2205", "\\emptyset"),a("math", pt, "textord", "\u2205", "\\varnothing"),a("math", dt, gt, "\u03b1", "\\alpha", !0),a("math", dt, gt, "\u03b2", "\\beta", !0),a("math", dt, gt, "\u03b3", "\\gamma", !0),a("math", dt, gt, "\u03b4", "\\delta", !0),a("math", dt, gt, "\u03f5", "\\epsilon", !0),a("math", dt, gt, "\u03b6", "\\zeta", !0),a("math", dt, gt, "\u03b7", "\\eta", !0),a("math", dt, gt, "\u03b8", "\\theta", !0),a("math", dt, gt, "\u03b9", "\\iota", !0),a("math", dt, gt, "\u03ba", "\\kappa", !0),a("math", dt, gt, "\u03bb", "\\lambda", !0),a("math", dt, gt, "\u03bc", "\\mu", !0),a("math", dt, gt, "\u03bd", "\\nu", !0),a("math", dt, gt, "\u03be", "\\xi", !0),a("math", dt, gt, "\u03bf", "\\omicron", !0),a("math", dt, gt, "\u03c0", "\\pi", !0),a("math", dt, gt, "\u03c1", "\\rho", !0),a("math", dt, gt, "\u03c3", "\\sigma", !0),a("math", dt, gt, "\u03c4", "\\tau", !0),a("math", dt, gt, "\u03c5", "\\upsilon", !0),a("math", dt, gt, "\u03d5", "\\phi", !0),a("math", dt, gt, "\u03c7", "\\chi", !0),a("math", dt, gt, "\u03c8", "\\psi", !0),a("math", dt, gt, "\u03c9", "\\omega", !0),a("math", dt, gt, "\u03b5", "\\varepsilon", !0),a("math", dt, gt, "\u03d1", "\\vartheta", !0),a("math", dt, gt, "\u03d6", "\\varpi", !0),a("math", dt, gt, "\u03f1", "\\varrho", !0),a("math", dt, gt, "\u03c2", "\\varsigma", !0),a("math", dt, gt, "\u03c6", "\\varphi", !0),a("math", dt, ft, "\u2217", "*"),a("math", dt, ft, "+", "+"),a("math", dt, ft, "\u2212", "-"),a("math", dt, ft, "\u22c5", "\\cdot", !0),a("math", dt, ft, "\u2218", "\\circ"),a("math", dt, ft, "\xf7", "\\div", !0),a("math", dt, ft, "\xb1", "\\pm", !0),a("math", dt, ft, "\xd7", "\\times", !0),a("math", dt, ft, "\u2229", "\\cap", !0),a("math", dt, ft, "\u222a", "\\cup", !0),a("math", dt, ft, "\u2216", "\\setminus"),a("math", dt, ft, "\u2227", "\\land"),a("math", dt, ft, "\u2228", "\\lor"),a("math", dt, ft, "\u2227", "\\wedge", !0),a("math", dt, ft, "\u2228", "\\vee", !0),a("math", dt, "textord", "\u221a", "\\surd"),a("math", dt, "open", "(", "("),a("math", dt, "open", "[", "["),a("math", dt, "open", "\u27e8", "\\langle", !0),a("math", dt, "open", "\u2223", "\\lvert"),a("math", dt, "open", "\u2225", "\\lVert"),a("math", dt, "close", ")", ")"),a("math", dt, "close", "]", "]"),a("math", dt, "close", "?", "?"),a("math", dt, "close", "!", "!"),a("math", dt, "close", "\u27e9", "\\rangle", !0),a("math", dt, "close", "\u2223", "\\rvert"),a("math", dt, "close", "\u2225", "\\rVert"),a("math", dt, xt, "=", "="),a("math", dt, xt, "<", "<"),a("math", dt, xt, ">", ">"),a("math", dt, xt, ":", ":"),a("math", dt, xt, "\u2248", "\\approx", !0),a("math", dt, xt, "\u2245", "\\cong", !0),a("math", dt, xt, "\u2265", "\\ge"),a("math", dt, xt, "\u2265", "\\geq", !0),a("math", dt, xt, "\u2190", "\\gets"),a("math", dt, xt, ">", "\\gt"),a("math", dt, xt, "\u2208", "\\in", !0),a("math", dt, xt, "\ue020", "\\@not"),a("math", dt, xt, "\u2282", "\\subset", !0),a("math", dt, xt, "\u2283", "\\supset", !0),a("math", dt, xt, "\u2286", "\\subseteq", !0),a("math", dt, xt, "\u2287", "\\supseteq", !0),a("math", pt, xt, "\u2288", "\\nsubseteq", !0),a("math", pt, xt, "\u2289", "\\nsupseteq", !0),a("math", dt, xt, "\u22a8", "\\models"),a("math", dt, xt, "\u2190", "\\leftarrow", !0),a("math", dt, xt, "\u2264", "\\le"),a("math", dt, xt, "\u2264", "\\leq", !0),a("math", dt, xt, "<", "\\lt"),a("math", dt, xt, "\u2192", "\\rightarrow", !0),a("math", dt, xt, "\u2192", "\\to"),a("math", pt, xt, "\u2271", "\\ngeq", !0),a("math", pt, xt, "\u2270", "\\nleq", !0),a("math", dt, yt, "\xa0", "\\ "),a("math", dt, yt, "\xa0", "~"),a("math", dt, yt, "\xa0", "\\space"),a("math", dt, yt, "\xa0", "\\nobreakspace"),a("text", dt, yt, "\xa0", "\\ "),a("text", dt, yt, "\xa0", "~"),a("text", dt, yt, "\xa0", "\\space"),a("text", dt, yt, "\xa0", "\\nobreakspace"),a("math", dt, yt, null, "\\nobreak"),a("math", dt, yt, null, "\\allowbreak"),a("math", dt, "punct", ",", ","),a("math", dt, "punct", ";", ";"),a("math", pt, ft, "\u22bc", "\\barwedge", !0),a("math", pt, ft, "\u22bb", "\\veebar", !0),a("math", dt, ft, "\u2299", "\\odot", !0),a("math", dt, ft, "\u2295", "\\oplus", !0),a("math", dt, ft, "\u2297", "\\otimes", !0),a("math", dt, "textord", "\u2202", "\\partial", !0),a("math", dt, ft, "\u2298", "\\oslash", !0),a("math", pt, ft, "\u229a", "\\circledcirc", !0),a("math", pt, ft, "\u22a1", "\\boxdot", !0),a("math", dt, ft, "\u25b3", "\\bigtriangleup"),a("math", dt, ft, "\u25bd", "\\bigtriangledown"),a("math", dt, ft, "\u2020", "\\dagger"),a("math", dt, ft, "\u22c4", "\\diamond"),a("math", dt, ft, "\u22c6", "\\star"),a("math", dt, ft, "\u25c3", "\\triangleleft"),a("math", dt, ft, "\u25b9", "\\triangleright"),a("math", dt, "open", "{", "\\{"),a("text", dt, "textord", "{", "\\{"),a("text", dt, "textord", "{", "\\textbraceleft"),a("math", dt, "close", "}", "\\}"),a("text", dt, "textord", "}", "\\}"),a("text", dt, "textord", "}", "\\textbraceright"),a("math", dt, "open", "{", "\\lbrace"),a("math", dt, "close", "}", "\\rbrace"),a("math", dt, "open", "[", "\\lbrack"),a("text", dt, "textord", "[", "\\lbrack"),a("math", dt, "close", "]", "\\rbrack"),a("text", dt, "textord", "]", "\\rbrack"),a("math", dt, "open", "(", "\\lparen"),a("math", dt, "close", ")", "\\rparen"),a("text", dt, "textord", "<", "\\textless"),a("text", dt, "textord", ">", "\\textgreater"),a("math", dt, "open", "\u230a", "\\lfloor", !0),a("math", dt, "close", "\u230b", "\\rfloor", !0),a("math", dt, "open", "\u2308", "\\lceil", !0),a("math", dt, "close", "\u2309", "\\rceil", !0),a("math", dt, "textord", "\\", "\\backslash"),a("math", dt, "textord", "\u2223", "|"),a("math", dt, "textord", "\u2223", "\\vert"),a("text", dt, "textord", "|", "\\textbar"),a("math", dt, "textord", "\u2225", "\\|"),a("math", dt, "textord", "\u2225", "\\Vert"),a("text", dt, "textord", "\u2225", "\\textbardbl"),a("text", dt, "textord", "~", "\\textasciitilde"),a("text", dt, "textord", "\\", "\\textbackslash"),a("text", dt, "textord", "^", "\\textasciicircum"),a("math", dt, xt, "\u2191", "\\uparrow", !0),a("math", dt, xt, "\u21d1", "\\Uparrow", !0),a("math", dt, xt, "\u2193", "\\downarrow", !0),a("math", dt, xt, "\u21d3", "\\Downarrow", !0),a("math", dt, xt, "\u2195", "\\updownarrow", !0),a("math", dt, xt, "\u21d5", "\\Updownarrow", !0),a("math", dt, vt, "\u2210", "\\coprod"),a("math", dt, vt, "\u22c1", "\\bigvee"),a("math", dt, vt, "\u22c0", "\\bigwedge"),a("math", dt, vt, "\u2a04", "\\biguplus"),a("math", dt, vt, "\u22c2", "\\bigcap"),a("math", dt, vt, "\u22c3", "\\bigcup"),a("math", dt, vt, "\u222b", "\\int"),a("math", dt, vt, "\u222b", "\\intop"),a("math", dt, vt, "\u222c", "\\iint"),a("math", dt, vt, "\u222d", "\\iiint"),a("math", dt, vt, "\u220f", "\\prod"),a("math", dt, vt, "\u2211", "\\sum"),a("math", dt, vt, "\u2a02", "\\bigotimes"),a("math", dt, vt, "\u2a01", "\\bigoplus"),a("math", dt, vt, "\u2a00", "\\bigodot"),a("math", dt, vt, "\u222e", "\\oint"),a("math", dt, vt, "\u222f", "\\oiint"),a("math", dt, vt, "\u2230", "\\oiiint"),a("math", dt, vt, "\u2a06", "\\bigsqcup"),a("math", dt, vt, "\u222b", "\\smallint"),a("text", dt, "inner", "\u2026", "\\textellipsis"),a("math", dt, "inner", "\u2026", "\\mathellipsis"),a("text", dt, "inner", "\u2026", "\\ldots", !0),a("math", dt, "inner", "\u2026", "\\ldots", !0),a("math", dt, "inner", "\u22ef", "\\@cdots", !0),a("math", dt, "inner", "\u22f1", "\\ddots", !0),a("math", dt, "textord", "\u22ee", "\\varvdots"),a("math", dt, "accent-token", "\u02ca", "\\acute"),a("math", dt, "accent-token", "\u02cb", "\\grave"),a("math", dt, "accent-token", "\xa8", "\\ddot"),a("math", dt, "accent-token", "~", "\\tilde"),a("math", dt, "accent-token", "\u02c9", "\\bar"),a("math", dt, "accent-token", "\u02d8", "\\breve"),a("math", dt, "accent-token", "\u02c7", "\\check"),a("math", dt, "accent-token", "^", "\\hat"),a("math", dt, "accent-token", "\u20d7", "\\vec"),a("math", dt, "accent-token", "\u02d9", "\\dot"),a("math", dt, "accent-token", "\u02da", "\\mathring"),a("math", dt, gt, "\u0131", "\\imath", !0),a("math", dt, gt, "\u0237", "\\jmath", !0),a("text", dt, "textord", "\u0131", "\\i", !0),a("text", dt, "textord", "\u0237", "\\j", !0),a("text", dt, "textord", "\xdf", "\\ss", !0),a("text", dt, "textord", "\xe6", "\\ae", !0),a("text", dt, "textord", "\xe6", "\\ae", !0),a("text", dt, "textord", "\u0153", "\\oe", !0),a("text", dt, "textord", "\xf8", "\\o", !0),a("text", dt, "textord", "\xc6", "\\AE", !0),a("text", dt, "textord", "\u0152", "\\OE", !0),a("text", dt, "textord", "\xd8", "\\O", !0),a("text", dt, "accent-token", "\u02ca", "\\'"),a("text", dt, "accent-token", "\u02cb", "\\`"),a("text", dt, "accent-token", "\u02c6", "\\^"),a("text", dt, "accent-token", "\u02dc", "\\~"),a("text", dt, "accent-token", "\u02c9", "\\="),a("text", dt, "accent-token", "\u02d8", "\\u"),a("text", dt, "accent-token", "\u02d9", "\\."),a("text", dt, "accent-token", "\u02da", "\\r"),a("text", dt, "accent-token", "\u02c7", "\\v"),a("text", dt, "accent-token", "\xa8", '\\"'),a("text", dt, "accent-token", "\u02dd", "\\H"),a("text", dt, "accent-token", "\u25ef", "\\textcircled");
        var bt = {"--": !0, "---": !0, "``": !0, "''": !0};
        a("text", dt, "textord", "\u2013", "--"), a("text", dt, "textord", "\u2013", "\\textendash"), a("text", dt, "textord", "\u2014", "---"), a("text", dt, "textord", "\u2014", "\\textemdash"), a("text", dt, "textord", "\u2018", "`"), a("text", dt, "textord", "\u2018", "\\textquoteleft"), a("text", dt, "textord", "\u2019", "'"), a("text", dt, "textord", "\u2019", "\\textquoteright"), a("text", dt, "textord", "\u201c", "``"), a("text", dt, "textord", "\u201c", "\\textquotedblleft"), a("text", dt, "textord", "\u201d", "''"), a("text", dt, "textord", "\u201d", "\\textquotedblright"), a("math", dt, "textord", "\xb0", "\\degree", !0), a("text", dt, "textord", "\xb0", "\\degree"), a("text", dt, "textord", "\xb0", "\\textdegree", !0), a("math", dt, gt, "\xa3", "\\pounds"), a("math", dt, gt, "\xa3", "\\mathsterling", !0), a("text", dt, gt, "\xa3", "\\pounds"), a("text", dt, gt, "\xa3", "\\textsterling", !0), a("math", pt, "textord", "\u2720", "\\maltese"), a("text", pt, "textord", "\u2720", "\\maltese"), a("text", dt, yt, "\xa0", "\\ "), a("text", dt, yt, "\xa0", " "), a("text", dt, yt, "\xa0", "~");
        for (var wt = 0; wt < '0123456789/@."'.length; wt++) {
            var kt = '0123456789/@."'.charAt(wt);
            a("math", dt, "textord", kt, kt)
        }
        for (var St = 0; St < '0123456789!@*()-=+[]<>|";:?/.,'.length; St++) {
            var Mt = '0123456789!@*()-=+[]<>|";:?/.,'.charAt(St);
            a("text", dt, "textord", Mt, Mt)
        }
        for (var At = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", zt = 0; zt < At.length; zt++) {
            var Tt = At.charAt(zt);
            a("math", dt, gt, Tt, Tt), a("text", dt, "textord", Tt, Tt)
        }
        a("math", pt, "textord", "C", "\u2102"), a("text", pt, "textord", "C", "\u2102"), a("math", pt, "textord", "H", "\u210d"), a("text", pt, "textord", "H", "\u210d"), a("math", pt, "textord", "N", "\u2115"), a("text", pt, "textord", "N", "\u2115"), a("math", pt, "textord", "P", "\u2119"), a("text", pt, "textord", "P", "\u2119"),
            a("math", pt, "textord", "Q", "\u211a"), a("text", pt, "textord", "Q", "\u211a"), a("math", pt, "textord", "R", "\u211d"), a("text", pt, "textord", "R", "\u211d"), a("math", pt, "textord", "Z", "\u2124"), a("text", pt, "textord", "Z", "\u2124"), a("math", dt, gt, "h", "\u210e"), a("text", dt, gt, "h", "\u210e");
        for (var Ct = "", Bt = 0; Bt < At.length; Bt++) {
            var Nt = At.charAt(Bt);
            a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56320 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56372 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56424 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56580 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56736 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56788 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56840 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56944 + Bt)), a("text", dt, "textord", Nt, Ct), Bt < 26 && (a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56632 + Bt)), a("text", dt, "textord", Nt, Ct), a("math", dt, gt, Nt, Ct = String.fromCharCode(55349, 56476 + Bt)), a("text", dt, "textord", Nt, Ct))
        }
        a("math", dt, gt, "k", Ct = String.fromCharCode(55349, 56668)), a("text", dt, "textord", "k", Ct);
        for (var Lt = 0; Lt < 10; Lt++) {
            var Et = Lt.toString();
            a("math", dt, gt, Et, Ct = String.fromCharCode(55349, 57294 + Lt)), a("text", dt, "textord", Et, Ct), a("math", dt, gt, Et, Ct = String.fromCharCode(55349, 57314 + Lt)), a("text", dt, "textord", Et, Ct), a("math", dt, gt, Et, Ct = String.fromCharCode(55349, 57324 + Lt)), a("text", dt, "textord", Et, Ct), a("math", dt, gt, Et, Ct = String.fromCharCode(55349, 57334 + Lt)), a("text", dt, "textord", Et, Ct)
        }
        for (var Ot = 0; Ot < "\xc7\xd0\xde\xe7\xfe".length; Ot++) {
            var It = "\xc7\xd0\xde\xe7\xfe".charAt(Ot);
            a("math", dt, gt, It, It), a("text", dt, "textord", It, It)
        }
        a("text", dt, "textord", "\xf0", "\xf0"), a("text", dt, "textord", "\u2013", "\u2013"), a("text", dt, "textord", "\u2014", "\u2014"), a("text", dt, "textord", "\u2018", "\u2018"), a("text", dt, "textord", "\u2019", "\u2019"), a("text", dt, "textord", "\u201c", "\u201c"), a("text", dt, "textord", "\u201d", "\u201d");
        var qt = [["mathbf", "textbf", "Main-Bold"], ["mathbf", "textbf", "Main-Bold"], ["mathdefault", "textit", "Math-Italic"], ["mathdefault", "textit", "Math-Italic"], ["boldsymbol", "boldsymbol", "Main-BoldItalic"], ["boldsymbol", "boldsymbol", "Main-BoldItalic"], ["mathscr", "textscr", "Script-Regular"], ["", "", ""], ["", "", ""], ["", "", ""], ["mathfrak", "textfrak", "Fraktur-Regular"], ["mathfrak", "textfrak", "Fraktur-Regular"], ["mathbb", "textbb", "AMS-Regular"], ["mathbb", "textbb", "AMS-Regular"], ["", "", ""], ["", "", ""], ["mathsf", "textsf", "SansSerif-Regular"], ["mathsf", "textsf", "SansSerif-Regular"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathitsf", "textitsf", "SansSerif-Italic"], ["mathitsf", "textitsf", "SansSerif-Italic"], ["", "", ""], ["", "", ""], ["mathtt", "texttt", "Typewriter-Regular"], ["mathtt", "texttt", "Typewriter-Regular"]],
            _t = [["mathbf", "textbf", "Main-Bold"], ["", "", ""], ["mathsf", "textsf", "SansSerif-Regular"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathtt", "texttt", "Typewriter-Regular"]],
            Pt = [[1, 1, 1], [2, 1, 1], [3, 1, 1], [4, 2, 1], [5, 2, 1], [6, 3, 1], [7, 4, 2], [8, 6, 3], [9, 7, 6], [10, 8, 7], [11, 10, 9]],
            Rt = [.5, .6, .7, .8, .9, 1, 1.2, 1.44, 1.728, 2.074, 2.488], Ft = function (t, e) {
                return e.size < 2 ? t : Pt[t - 1][e.size - 1]
            }, Dt = function () {
                function t(e) {
                    this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this._fontMetrics = void 0, this.style = e.style, this.color = e.color, this.size = e.size || t.BASESIZE, this.textSize = e.textSize || this.size, this.phantom = !!e.phantom, this.font = e.font || "", this.fontFamily = e.fontFamily || "", this.fontWeight = e.fontWeight || "", this.fontShape = e.fontShape || "", this.sizeMultiplier = Rt[this.size - 1], this.maxSize = e.maxSize, this._fontMetrics = void 0
                }

                var e = t.prototype;
                return e.extend = function (e) {
                    var r = {
                        style: this.style,
                        size: this.size,
                        textSize: this.textSize,
                        color: this.color,
                        phantom: this.phantom,
                        font: this.font,
                        fontFamily: this.fontFamily,
                        fontWeight: this.fontWeight,
                        fontShape: this.fontShape,
                        maxSize: this.maxSize
                    };
                    for (var n in e) e.hasOwnProperty(n) && (r[n] = e[n]);
                    return new t(r)
                }, e.havingStyle = function (t) {
                    return this.style === t ? this : this.extend({style: t, size: Ft(this.textSize, t)})
                }, e.havingCrampedStyle = function () {
                    return this.havingStyle(this.style.cramp())
                }, e.havingSize = function (t) {
                    return this.size === t && this.textSize === t ? this : this.extend({
                        style: this.style.text(),
                        size: t,
                        textSize: t,
                        sizeMultiplier: Rt[t - 1]
                    })
                }, e.havingBaseStyle = function (e) {
                    e = e || this.style.text();
                    var r = Ft(t.BASESIZE, e);
                    return this.size === r && this.textSize === t.BASESIZE && this.style === e ? this : this.extend({
                        style: e,
                        size: r
                    })
                }, e.havingBaseSizing = function () {
                    var t;
                    switch (this.style.id) {
                        case 4:
                        case 5:
                            t = 3;
                            break;
                        case 6:
                        case 7:
                            t = 1;
                            break;
                        default:
                            t = 6
                    }
                    return this.extend({style: this.style.text(), size: t})
                }, e.withColor = function (t) {
                    return this.extend({color: t})
                }, e.withPhantom = function () {
                    return this.extend({phantom: !0})
                }, e.withFont = function (t) {
                    return this.extend({font: t})
                }, e.withTextFontFamily = function (t) {
                    return this.extend({fontFamily: t, font: ""})
                }, e.withTextFontWeight = function (t) {
                    return this.extend({fontWeight: t, font: ""})
                }, e.withTextFontShape = function (t) {
                    return this.extend({fontShape: t, font: ""})
                }, e.sizingClasses = function (t) {
                    return t.size !== this.size ? ["sizing", "reset-size" + t.size, "size" + this.size] : []
                }, e.baseSizingClasses = function () {
                    return this.size !== t.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + t.BASESIZE] : []
                }, e.fontMetrics = function () {
                    return this._fontMetrics || (this._fontMetrics = function (t) {
                        var e;
                        if (!lt[e = t >= 5 ? 0 : t >= 3 ? 1 : 2]) {
                            var r = lt[e] = {cssEmPerMu: ot.quad[e] / 18};
                            for (var n in ot) ot.hasOwnProperty(n) && (r[n] = ot[n][e])
                        }
                        return lt[e]
                    }(this.size)), this._fontMetrics
                }, e.getColor = function () {
                    return this.phantom ? "transparent" : null != this.color && t.colorMap.hasOwnProperty(this.color) ? t.colorMap[this.color] : this.color
                }, t
            }();
        Dt.BASESIZE = 6, Dt.colorMap = {
            "katex-blue": "#6495ed",
            "katex-orange": "#ffa500",
            "katex-pink": "#ff00af",
            "katex-red": "#df0030",
            "katex-green": "#28ae7b",
            "katex-gray": "gray",
            "katex-purple": "#9d38bd",
            "katex-blueA": "#ccfaff",
            "katex-blueB": "#80f6ff",
            "katex-blueC": "#63d9ea",
            "katex-blueD": "#11accd",
            "katex-blueE": "#0c7f99",
            "katex-tealA": "#94fff5",
            "katex-tealB": "#26edd5",
            "katex-tealC": "#01d1c1",
            "katex-tealD": "#01a995",
            "katex-tealE": "#208170",
            "katex-greenA": "#b6ffb0",
            "katex-greenB": "#8af281",
            "katex-greenC": "#74cf70",
            "katex-greenD": "#1fab54",
            "katex-greenE": "#0d923f",
            "katex-goldA": "#ffd0a9",
            "katex-goldB": "#ffbb71",
            "katex-goldC": "#ff9c39",
            "katex-goldD": "#e07d10",
            "katex-goldE": "#a75a05",
            "katex-redA": "#fca9a9",
            "katex-redB": "#ff8482",
            "katex-redC": "#f9685d",
            "katex-redD": "#e84d39",
            "katex-redE": "#bc2612",
            "katex-maroonA": "#ffbde0",
            "katex-maroonB": "#ff92c6",
            "katex-maroonC": "#ed5fa6",
            "katex-maroonD": "#ca337c",
            "katex-maroonE": "#9e034e",
            "katex-purpleA": "#ddd7ff",
            "katex-purpleB": "#c6b9fc",
            "katex-purpleC": "#aa87ff",
            "katex-purpleD": "#7854ab",
            "katex-purpleE": "#543b78",
            "katex-mintA": "#f5f9e8",
            "katex-mintB": "#edf2df",
            "katex-mintC": "#e0e5cc",
            "katex-grayA": "#f6f7f7",
            "katex-grayB": "#f0f1f2",
            "katex-grayC": "#e3e5e6",
            "katex-grayD": "#d6d8da",
            "katex-grayE": "#babec2",
            "katex-grayF": "#888d93",
            "katex-grayG": "#626569",
            "katex-grayH": "#3b3e40",
            "katex-grayI": "#21242c",
            "katex-kaBlue": "#314453",
            "katex-kaGreen": "#71B307"
        };
        var Ht = Dt, jt = {
                pt: 1,
                mm: 7227 / 2540,
                cm: 7227 / 254,
                "in": 72.27,
                bp: 1.00375,
                pc: 12,
                dd: 1238 / 1157,
                cc: 14856 / 1157,
                nd: 685 / 642,
                nc: 1370 / 107,
                sp: 1 / 65536,
                px: 1.00375
            }, Vt = {ex: !0, em: !0, mu: !0}, Ut = function (t, e) {
                var r;
                if (t.unit in jt) r = jt[t.unit] / e.fontMetrics().ptPerEm / e.sizeMultiplier; else if ("mu" === t.unit) r = e.fontMetrics().cssEmPerMu; else {
                    var n;
                    if (n = e.style.isTight() ? e.havingStyle(e.style.text()) : e, "ex" === t.unit) r = n.fontMetrics().xHeight; else {
                        if ("em" !== t.unit) throw new C("Invalid unit: '" + t.unit + "'");
                        r = n.fontMetrics().quad
                    }
                    n !== e && (r *= n.sizeMultiplier / e.sizeMultiplier)
                }
                return Math.min(t.number * r, e.maxSize)
            }, Gt = ["\\imath", "\u0131", "\\jmath", "\u0237", "\\pounds", "\\mathsterling", "\\textsterling", "\xa3"],
            Wt = function (t, e, r) {
                return ut[r][t] && ut[r][t].replace && (t = ut[r][t].replace), {value: t, metrics: i(t, e, r)}
            }, Xt = function (t, e, r, n, i) {
                var a, o = Wt(t, e, r), s = o.metrics;
                if (t = o.value, s) {
                    var l = s.italic;
                    ("text" === r || n && "mathit" === n.font) && (l = 0), a = new et(t, s.height, s.depth, l, s.skew, s.width, i)
                } else "undefined" != typeof console && console.warn("No character metrics for '" + t + "' in style '" + e + "'"), a = new et(t, 0, 0, 0, 0, 0, i);
                if (n) {
                    a.maxFontSize = n.sizeMultiplier, n.style.isTight() && a.classes.push("mtight");
                    var h = n.getColor();
                    h && (a.style.color = h)
                }
                return a
            }, Yt = function (t, e) {
                if (Y(t.classes) !== Y(e.classes) || t.skew !== e.skew || t.maxFontSize !== e.maxFontSize) return !1;
                for (var r in t.style) if (t.style.hasOwnProperty(r) && t.style[r] !== e.style[r]) return !1;
                for (var n in e.style) if (e.style.hasOwnProperty(n) && t.style[n] !== e.style[n]) return !1;
                return !0
            }, $t = function (t) {
                for (var e = 0, r = 0, n = 0, i = 0; i < t.children.length; i++) {
                    var a = t.children[i];
                    a.height > e && (e = a.height), a.depth > r && (r = a.depth), a.maxFontSize > n && (n = a.maxFontSize)
                }
                t.height = e, t.depth = r, t.maxFontSize = n
            }, Kt = function (t, e, r, n) {
                var i = new J(t, e, r, n);
                return $t(i), i
            }, Zt = function (t, e, r, n) {
                return new J(t, e, r, n)
            }, Jt = function (t) {
                var e = new X(t);
                return $t(e), e
            }, Qt = function (t, e, r) {
                var n = "";
                switch (t) {
                    case"amsrm":
                        n = "AMS";
                        break;
                    case"textrm":
                        n = "Main";
                        break;
                    case"textsf":
                        n = "SansSerif";
                        break;
                    case"texttt":
                        n = "Typewriter";
                        break;
                    default:
                        n = t
                }
                return n + "-" + ("textbf" === e && "textit" === r ? "BoldItalic" : "textbf" === e ? "Bold" : "textit" === e ? "Italic" : "Regular")
            }, te = {
                mathbf: {variant: "bold", fontName: "Main-Bold"},
                mathrm: {variant: "normal", fontName: "Main-Regular"},
                textit: {variant: "italic", fontName: "Main-Italic"},
                mathit: {variant: "italic", fontName: "Main-Italic"},
                mathbb: {variant: "double-struck", fontName: "AMS-Regular"},
                mathcal: {variant: "script", fontName: "Caligraphic-Regular"},
                mathfrak: {variant: "fraktur", fontName: "Fraktur-Regular"},
                mathscr: {variant: "script", fontName: "Script-Regular"},
                mathsf: {variant: "sans-serif", fontName: "SansSerif-Regular"},
                mathtt: {variant: "monospace", fontName: "Typewriter-Regular"}
            }, ee = {
                vec: ["vec", .471, .714],
                oiintSize1: ["oiintSize1", .957, .499],
                oiintSize2: ["oiintSize2", 1.472, .659],
                oiiintSize1: ["oiiintSize1", 1.304, .499],
                oiiintSize2: ["oiiintSize2", 1.98, .659]
            }, re = {
                fontMap: te, makeSymbol: Xt, mathsym: function (t, e, r, n) {
                    return void 0 === n && (n = []), r && r.font && "boldsymbol" === r.font && Wt(t, "Main-Bold", e).metrics ? Xt(t, "Main-Bold", e, r, n.concat(["mathbf"])) : "\\" === t || "main" === ut[e][t].font ? Xt(t, "Main-Regular", e, r, n) : Xt(t, "AMS-Regular", e, r, n.concat(["amsrm"]))
                }, makeSpan: Kt, makeSvgSpan: Zt, makeLineSpan: function (t, e, r) {
                    var n = Kt([t], [], e);
                    return n.height = r || e.fontMetrics().defaultRuleThickness, n.style.borderBottomWidth = n.height + "em", n.maxFontSize = 1, n
                }, makeAnchor: function (t, e, r, n) {
                    var i = new Q(t, e, r, n);
                    return $t(i), i
                }, makeFragment: Jt, wrapFragment: function (t, e) {
                    return t instanceof X ? Kt([], [t], e) : t
                }, makeVList: function (t) {
                    for (var e = function (t) {
                        if ("individualShift" === t.positionType) {
                            for (var e = t.children, r = [e[0]], n = -e[0].shift - e[0].elem.depth, i = n, a = 1; a < e.length; a++) {
                                var o = -e[a].shift - i - e[a].elem.depth,
                                    s = o - (e[a - 1].elem.height + e[a - 1].elem.depth);
                                i += o, r.push({type: "kern", size: s}), r.push(e[a])
                            }
                            return {children: r, depth: n}
                        }
                        var l;
                        if ("top" === t.positionType) {
                            for (var h = t.positionData, c = 0; c < t.children.length; c++) {
                                var m = t.children[c];
                                h -= "kern" === m.type ? m.size : m.elem.height + m.elem.depth
                            }
                            l = h
                        } else if ("bottom" === t.positionType) l = -t.positionData; else {
                            var u = t.children[0];
                            if ("elem" !== u.type) throw new Error('First child must have type "elem".');
                            if ("shift" === t.positionType) l = -u.elem.depth - t.positionData; else {
                                if ("firstBaseline" !== t.positionType) throw new Error("Invalid positionType " + t.positionType + ".");
                                l = -u.elem.depth
                            }
                        }
                        return {children: t.children, depth: l}
                    }(t), r = e.children, n = e.depth, i = 0, a = 0; a < r.length; a++) {
                        var o = r[a];
                        if ("elem" === o.type) {
                            var s = o.elem;
                            i = Math.max(i, s.maxFontSize, s.height)
                        }
                    }
                    i += 2;
                    var l = Kt(["pstrut"], []);
                    l.style.height = i + "em";
                    for (var h = [], c = n, m = n, u = n, d = 0; d < r.length; d++) {
                        var p = r[d];
                        if ("kern" === p.type) u += p.size; else {
                            var f = p.elem, g = p.wrapperClasses || [], v = p.wrapperStyle || {},
                                x = Kt(g, [l, f], void 0, v);
                            x.style.top = -i - u - f.depth + "em", p.marginLeft && (x.style.marginLeft = p.marginLeft), p.marginRight && (x.style.marginRight = p.marginRight), h.push(x), u += f.height + f.depth
                        }
                        c = Math.min(c, u), m = Math.max(m, u)
                    }
                    var y, b = Kt(["vlist"], h);
                    if (b.style.height = m + "em", c < 0) {
                        var w = Kt([], []), k = Kt(["vlist"], [w]);
                        k.style.height = -c + "em";
                        var S = Kt(["vlist-s"], [new et("\u200b")]);
                        y = [Kt(["vlist-r"], [b, S]), Kt(["vlist-r"], [k])]
                    } else y = [Kt(["vlist-r"], [b])];
                    var M = Kt(["vlist-t"], y);
                    return 2 === y.length && M.classes.push("vlist-t2"), M.height = m, M.depth = -c, M
                }, makeOrd: function (t, e, r) {
                    var n, i = t.mode, a = t.text, o = ["mord"], s = "math" === i || "text" === i && e.font,
                        l = s ? e.font : e.fontFamily;
                    if (55349 === a.charCodeAt(0)) {
                        var h = function (t, e) {
                            var r = 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320) + 65536,
                                n = "math" === e ? 0 : 1;
                            if (119808 <= r && r < 120484) {
                                var i = Math.floor((r - 119808) / 26);
                                return [qt[i][2], qt[i][n]]
                            }
                            if (120782 <= r && r <= 120831) {
                                var a = Math.floor((r - 120782) / 10);
                                return [_t[a][2], _t[a][n]]
                            }
                            if (120485 === r || 120486 === r) return [qt[0][2], qt[0][n]];
                            if (120486 < r && r < 120782) return ["", ""];
                            throw new C("Unsupported character: " + t)
                        }(a, i), c = h[0], m = h[1];
                        return Xt(a, c, i, e, o.concat(m))
                    }
                    if (l) {
                        var u, d;
                        if ("boldsymbol" === l || "mathnormal" === l) {
                            var p = "boldsymbol" === l ? function (t, e) {
                                return Wt(t, "Math-BoldItalic", e).metrics ? {
                                    fontName: "Math-BoldItalic",
                                    fontClass: "boldsymbol"
                                } : {fontName: "Main-Bold", fontClass: "mathbf"}
                            }(a, i) : (n = a, O.contains(Gt, n) ? {
                                fontName: "Main-Italic",
                                fontClass: "mathit"
                            } : /[0-9]/.test(n.charAt(0)) ? {
                                fontName: "Caligraphic-Regular",
                                fontClass: "mathcal"
                            } : {fontName: "Math-Italic", fontClass: "mathdefault"});
                            u = p.fontName, d = [p.fontClass]
                        } else O.contains(Gt, a) ? (u = "Main-Italic", d = ["mathit"]) : s ? (u = te[l].fontName, d = [l]) : (u = Qt(l, e.fontWeight, e.fontShape), d = [l, e.fontWeight, e.fontShape]);
                        if (Wt(a, u, i).metrics) return Xt(a, u, i, e, o.concat(d));
                        if (bt.hasOwnProperty(a) && "Typewriter" === u.substr(0, 10)) {
                            for (var f = [], g = 0; g < a.length; g++) f.push(Xt(a[g], u, i, e, o.concat(d)));
                            return Jt(f)
                        }
                    }
                    if ("mathord" === r) {
                        var v = function (t) {
                            return /[0-9]/.test(t.charAt(0)) || O.contains(Gt, t) ? {
                                fontName: "Main-Italic",
                                fontClass: "mathit"
                            } : {fontName: "Math-Italic", fontClass: "mathdefault"}
                        }(a);
                        return Xt(a, v.fontName, i, e, o.concat([v.fontClass]))
                    }
                    if ("textord" === r) {
                        var x = ut[i][a] && ut[i][a].font;
                        if ("ams" === x) {
                            var y = Qt("amsrm", e.fontWeight, e.fontShape);
                            return Xt(a, y, i, e, o.concat("amsrm", e.fontWeight, e.fontShape))
                        }
                        if ("main" !== x && x) {
                            var b = Qt(x, e.fontWeight, e.fontShape);
                            return Xt(a, b, i, e, o.concat(b, e.fontWeight, e.fontShape))
                        }
                        var w = Qt("textrm", e.fontWeight, e.fontShape);
                        return Xt(a, w, i, e, o.concat(e.fontWeight, e.fontShape))
                    }
                    throw new Error("unexpected type: " + r + " in makeOrd")
                }, makeGlue: function (t, e) {
                    var r = Kt(["mspace"], [], e), n = Ut(t, e);
                    return r.style.marginRight = n + "em", r
                }, staticSvg: function (t, e) {
                    var r = ee[t], n = r[0], i = r[1], a = r[2], o = new nt(n), s = new rt([o], {
                        width: i + "em",
                        height: a + "em",
                        style: "width:" + i + "em",
                        viewBox: "0 0 " + 1e3 * i + " " + 1e3 * a,
                        preserveAspectRatio: "xMinYMin"
                    }), l = Zt(["overlay"], [s], e);
                    return l.height = a, l.style.height = a + "em", l.style.width = i + "em", l
                }, svgData: ee, tryCombineChars: function (t) {
                    for (var e = 0; e < t.length - 1; e++) {
                        var r = t[e], n = t[e + 1];
                        r instanceof et && n instanceof et && Yt(r, n) && (r.text += n.text, r.height = Math.max(r.height, n.height), r.depth = Math.max(r.depth, n.depth), r.italic = n.italic, t.splice(e + 1, 1), e--)
                    }
                    return t
                }
            }, ne = {number: 3, unit: "mu"}, ie = {number: 4, unit: "mu"}, ae = {number: 5, unit: "mu"}, oe = {
                mord: {mop: ne, mbin: ie, mrel: ae, minner: ne},
                mop: {mord: ne, mop: ne, mrel: ae, minner: ne},
                mbin: {mord: ie, mop: ie, mopen: ie, minner: ie},
                mrel: {mord: ae, mop: ae, mopen: ae, minner: ae},
                mopen: {},
                mclose: {mop: ne, mbin: ie, mrel: ae, minner: ne},
                mpunct: {mord: ne, mop: ne, mrel: ae, mopen: ne, mclose: ne, mpunct: ne, minner: ne},
                minner: {mord: ne, mop: ne, mbin: ie, mrel: ae, mopen: ne, mpunct: ne, minner: ne}
            }, se = {
                mord: {mop: ne},
                mop: {mord: ne, mop: ne},
                mbin: {},
                mrel: {},
                mopen: {},
                mclose: {mop: ne},
                mpunct: {},
                minner: {mop: ne}
            }, le = {}, he = {}, ce = {}, me = function (t) {
                var e = s(t, "ordgroup");
                return e ? e.body : [t]
            }, ue = re.makeSpan, de = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"],
            pe = ["rightmost", "mrel", "mclose", "mpunct"],
            fe = {display: V.DISPLAY, text: V.TEXT, script: V.SCRIPT, scriptscript: V.SCRIPTSCRIPT}, ge = {
                mord: "mord",
                mop: "mop",
                mbin: "mbin",
                mrel: "mrel",
                mopen: "mopen",
                mclose: "mclose",
                mpunct: "mpunct",
                minner: "minner"
            }, ve = function (t, e, r, n) {
                void 0 === n && (n = [null, null]);
                for (var i = [], a = 0; a < t.length; a++) {
                    var o = ke(t[a], e);
                    if (o instanceof X) {
                        var l = o.children;
                        i.push.apply(i, l)
                    } else i.push(o)
                }
                if (!r) return i;
                var h = e;
                if (1 === t.length) {
                    var c = s(t[0], "sizing") || s(t[0], "styling");
                    c && ("sizing" === c.type ? h = e.havingSize(c.size) : "styling" === c.type && (h = e.havingStyle(fe[c.style])))
                }
                var m = ue([n[0] || "leftmost"], [], e), u = ue([n[1] || "rightmost"], [], e);
                return xe(i, function (t, e) {
                    var r = e.classes[0], n = t.classes[0];
                    "mbin" === r && O.contains(pe, n) ? e.classes[0] = "mord" : "mbin" === n && O.contains(de, r) && (t.classes[0] = "mord")
                }, {node: m}, u), xe(i, function (t, e) {
                    var r = be(e), n = be(t), i = r && n ? t.hasClass("mtight") ? se[r][n] : oe[r][n] : null;
                    if (i) return re.makeGlue(i, h)
                }, {node: m}, u), i
            }, xe = function t(e, r, n, i) {
                i && e.push(i);
                for (var a = 0; a < e.length; a++) {
                    var o = e[a], s = ye(o);
                    if (s) t(s.children, r, n); else if ("mspace" !== o.classes[0]) {
                        var l = r(o, n.node);
                        l && (n.insertAfter ? n.insertAfter(l) : (e.unshift(l), a++)), n.node = o, n.insertAfter = function (t) {
                            return function (r) {
                                e.splice(t + 1, 0, r), a++
                            }
                        }(a)
                    }
                }
                i && e.pop()
            }, ye = function (t) {
                return t instanceof X || t instanceof Q ? t : null
            }, be = function (t, e) {
                return t ? (e && (t = function t(e, r) {
                    var n = ye(e);
                    if (n) {
                        var i = n.children;
                        if (i.length) {
                            if ("right" === r) return t(i[i.length - 1], "right");
                            if ("left" === r) return t(i[0], "left")
                        }
                    }
                    return e
                }(t, e)), ge[t.classes[0]] || null) : null
            }, we = function (t, e) {
                var r = ["nulldelimiter"].concat(t.baseSizingClasses());
                return ue(e.concat(r))
            }, ke = function (t, e, r) {
                if (!t) return ue();
                if (he[t.type]) {
                    var n = he[t.type](t, e);
                    if (r && e.size !== r.size) {
                        n = ue(e.sizingClasses(r), [n], e);
                        var i = e.sizeMultiplier / r.sizeMultiplier;
                        n.height *= i, n.depth *= i
                    }
                    return n
                }
                throw new C("Got group of unknown type: '" + t.type + "'")
            }, Se = function () {
                function t(t, e) {
                    this.type = void 0, this.attributes = void 0, this.children = void 0, this.type = t, this.attributes = {}, this.children = e || []
                }

                var e = t.prototype;
                return e.setAttribute = function (t, e) {
                    this.attributes[t] = e
                }, e.getAttribute = function (t) {
                    return this.attributes[t]
                }, e.toNode = function () {
                    var t = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
                    for (var e in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, e) && t.setAttribute(e, this.attributes[e]);
                    for (var r = 0; r < this.children.length; r++) t.appendChild(this.children[r].toNode());
                    return t
                }, e.toMarkup = function () {
                    var t = "<" + this.type;
                    for (var e in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, e) && (t += " " + e + '="', t += O.escape(this.attributes[e]), t += '"');
                    t += ">";
                    for (var r = 0; r < this.children.length; r++) t += this.children[r].toMarkup();
                    return t += "</" + this.type + ">"
                }, e.toText = function () {
                    return this.children.map(function (t) {
                        return t.toText()
                    }).join("")
                }, t
            }(), Me = function () {
                function t(t) {
                    this.text = void 0, this.text = t
                }

                var e = t.prototype;
                return e.toNode = function () {
                    return document.createTextNode(this.text)
                }, e.toMarkup = function () {
                    return O.escape(this.toText())
                }, e.toText = function () {
                    return this.text
                }, t
            }(), Ae = {
                MathNode: Se, TextNode: Me, SpaceNode: function () {
                    function t(t) {
                        this.width = void 0, this.character = void 0, this.width = t, this.character = t >= .05555 && t <= .05556 ? "\u200a" : t >= .1666 && t <= .1667 ? "\u2009" : t >= .2222 && t <= .2223 ? "\u2005" : t >= .2777 && t <= .2778 ? "\u2005\u200a" : t >= -.05556 && t <= -.05555 ? "\u200a\u2063" : t >= -.1667 && t <= -.1666 ? "\u2009\u2063" : t >= -.2223 && t <= -.2222 ? "\u205f\u2063" : t >= -.2778 && t <= -.2777 ? "\u2005\u2063" : null
                    }

                    var e = t.prototype;
                    return e.toNode = function () {
                        if (this.character) return document.createTextNode(this.character);
                        var t = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
                        return t.setAttribute("width", this.width + "em"), t
                    }, e.toMarkup = function () {
                        return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + this.width + 'em"/>'
                    }, e.toText = function () {
                        return this.character ? this.character : " "
                    }, t
                }(), newDocumentFragment: p
            }, ze = function (t, e, r) {
                return !ut[e][t] || !ut[e][t].replace || 55349 === t.charCodeAt(0) || bt.hasOwnProperty(t) && r && (r.fontFamily && "tt" === r.fontFamily.substr(4, 2) || r.font && "tt" === r.font.substr(4, 2)) || (t = ut[e][t].replace), new Ae.TextNode(t)
            }, Te = function (t) {
                return 1 === t.length ? t[0] : new Ae.MathNode("mrow", t)
            }, Ce = function (t, e) {
                if ("texttt" === e.fontFamily) return "monospace";
                if ("textsf" === e.fontFamily) return "textit" === e.fontShape && "textbf" === e.fontWeight ? "sans-serif-bold-italic" : "textit" === e.fontShape ? "sans-serif-italic" : "textbf" === e.fontWeight ? "bold-sans-serif" : "sans-serif";
                if ("textit" === e.fontShape && "textbf" === e.fontWeight) return "bold-italic";
                if ("textit" === e.fontShape) return "italic";
                if ("textbf" === e.fontWeight) return "bold";
                var r = e.font;
                if (!r || "mathnormal" === r) return null;
                var n = t.mode;
                if ("mathit" === r) return "italic";
                if ("boldsymbol" === r) return "bold-italic";
                var a = t.text;
                return O.contains(["\\imath", "\\jmath"], a) ? null : (ut[n][a] && ut[n][a].replace && (a = ut[n][a].replace), i(a, re.fontMap[r].fontName, n) ? re.fontMap[r].variant : null)
            }, Be = function (t, e) {
                for (var r, n = [], i = 0; i < t.length; i++) {
                    var a = Le(t[i], e);
                    if (a instanceof Se && r instanceof Se) {
                        if ("mtext" === a.type && "mtext" === r.type && a.getAttribute("mathvariant") === r.getAttribute("mathvariant")) {
                            var o;
                            (o = r.children).push.apply(o, a.children);
                            continue
                        }
                        if ("mn" === a.type && "mn" === r.type) {
                            var s;
                            (s = r.children).push.apply(s, a.children);
                            continue
                        }
                        if ("mi" === a.type && 1 === a.children.length && "mn" === r.type) {
                            var l = a.children[0];
                            if (l instanceof Me && "." === l.text) {
                                var h;
                                (h = r.children).push.apply(h, a.children);
                                continue
                            }
                        }
                    }
                    n.push(a), r = a
                }
                return n
            }, Ne = function (t, e) {
                return Te(Be(t, e))
            }, Le = function (t, e) {
                if (!t) return new Ae.MathNode("mrow");
                if (ce[t.type]) return ce[t.type](t, e);
                throw new C("Got group of unknown type: '" + t.type + "'")
            }, Ee = function (t) {
                return new Ht({style: t.displayMode ? V.DISPLAY : V.TEXT, maxSize: t.maxSize})
            }, Oe = function (t, e) {
                if (e.displayMode) {
                    var r = ["katex-display"];
                    e.leqno && r.push("leqno"), e.fleqn && r.push("fleqn"), t = re.makeSpan(r, [t])
                }
                return t
            }, Ie = function (t, e, r) {
                var n = Ee(r), i = function (t, e, r) {
                    var n, i = Be(t, r);
                    n = 1 === i.length && i[0] instanceof Se && O.contains(["mrow", "mtable"], i[0].type) ? i[0] : new Ae.MathNode("mrow", i);
                    var a = new Ae.MathNode("annotation", [new Ae.TextNode(e)]);
                    a.setAttribute("encoding", "application/x-tex");
                    var o = new Ae.MathNode("semantics", [n, a]), s = new Ae.MathNode("math", [o]);
                    return re.makeSpan(["katex-mathml"], [s])
                }(t, e, n), a = d(t, n), o = re.makeSpan(["katex"], [i, a]);
                return Oe(o, r)
            }, qe = {
                widehat: "^",
                widecheck: "\u02c7",
                widetilde: "~",
                utilde: "~",
                overleftarrow: "\u2190",
                underleftarrow: "\u2190",
                xleftarrow: "\u2190",
                overrightarrow: "\u2192",
                underrightarrow: "\u2192",
                xrightarrow: "\u2192",
                underbrace: "\u23b5",
                overbrace: "\u23de",
                overleftrightarrow: "\u2194",
                underleftrightarrow: "\u2194",
                xleftrightarrow: "\u2194",
                Overrightarrow: "\u21d2",
                xRightarrow: "\u21d2",
                overleftharpoon: "\u21bc",
                xleftharpoonup: "\u21bc",
                overrightharpoon: "\u21c0",
                xrightharpoonup: "\u21c0",
                xLeftarrow: "\u21d0",
                xLeftrightarrow: "\u21d4",
                xhookleftarrow: "\u21a9",
                xhookrightarrow: "\u21aa",
                xmapsto: "\u21a6",
                xrightharpoondown: "\u21c1",
                xleftharpoondown: "\u21bd",
                xrightleftharpoons: "\u21cc",
                xleftrightharpoons: "\u21cb",
                xtwoheadleftarrow: "\u219e",
                xtwoheadrightarrow: "\u21a0",
                xlongequal: "=",
                xtofrom: "\u21c4",
                xrightleftarrows: "\u21c4",
                xrightequilibrium: "\u21cc",
                xleftequilibrium: "\u21cb"
            }, _e = {
                overrightarrow: [["rightarrow"], .888, 522, "xMaxYMin"],
                overleftarrow: [["leftarrow"], .888, 522, "xMinYMin"],
                underrightarrow: [["rightarrow"], .888, 522, "xMaxYMin"],
                underleftarrow: [["leftarrow"], .888, 522, "xMinYMin"],
                xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
                xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
                Overrightarrow: [["doublerightarrow"], .888, 560, "xMaxYMin"],
                xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
                xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
                overleftharpoon: [["leftharpoon"], .888, 522, "xMinYMin"],
                xleftharpoonup: [["leftharpoon"], .888, 522, "xMinYMin"],
                xleftharpoondown: [["leftharpoondown"], .888, 522, "xMinYMin"],
                overrightharpoon: [["rightharpoon"], .888, 522, "xMaxYMin"],
                xrightharpoonup: [["rightharpoon"], .888, 522, "xMaxYMin"],
                xrightharpoondown: [["rightharpoondown"], .888, 522, "xMaxYMin"],
                xlongequal: [["longequal"], .888, 334, "xMinYMin"],
                xtwoheadleftarrow: [["twoheadleftarrow"], .888, 334, "xMinYMin"],
                xtwoheadrightarrow: [["twoheadrightarrow"], .888, 334, "xMaxYMin"],
                overleftrightarrow: [["leftarrow", "rightarrow"], .888, 522],
                overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
                underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
                underleftrightarrow: [["leftarrow", "rightarrow"], .888, 522],
                xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
                xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
                xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
                xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
                xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
                xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
                overlinesegment: [["leftlinesegment", "rightlinesegment"], .888, 522],
                underlinesegment: [["leftlinesegment", "rightlinesegment"], .888, 522],
                overgroup: [["leftgroup", "rightgroup"], .888, 342],
                undergroup: [["leftgroupunder", "rightgroupunder"], .888, 342],
                xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
                xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
                xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
                xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
                xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
            }, Pe = function (t) {
                return "ordgroup" === t.type ? t.body.length : 1
            }, Re = function (t, e, r, n) {
                var i, a = t.height + t.depth + 2 * r;
                if (/fbox|color/.test(e)) {
                    if (i = re.makeSpan(["stretchy", e], [], n), "fbox" === e) {
                        var o = n.color && n.getColor();
                        o && (i.style.borderColor = o)
                    }
                } else {
                    var s = [];
                    /^[bx]cancel$/.test(e) && s.push(new it({
                        x1: "0",
                        y1: "0",
                        x2: "100%",
                        y2: "100%",
                        "stroke-width": "0.046em"
                    })), /^x?cancel$/.test(e) && s.push(new it({
                        x1: "0",
                        y1: "100%",
                        x2: "100%",
                        y2: "0",
                        "stroke-width": "0.046em"
                    }));
                    var l = new rt(s, {width: "100%", height: a + "em"});
                    i = re.makeSvgSpan([], [l], n)
                }
                return i.height = a, i.style.height = a + "em", i
            }, Fe = function (t) {
                var e = new Ae.MathNode("mo", [new Ae.TextNode(qe[t.substr(1)])]);
                return e.setAttribute("stretchy", "true"), e
            }, De = function (t, e) {
                var r = function () {
                    var r = 4e5, n = t.label.substr(1);
                    if (O.contains(["widehat", "widecheck", "widetilde", "utilde"], n)) {
                        var i, a, o, s = Pe(t.base);
                        if (s > 5) "widehat" === n || "widecheck" === n ? (i = 420, r = 2364, o = .42, a = n + "4") : (i = 312, r = 2340, o = .34, a = "tilde4"); else {
                            var l = [1, 1, 2, 2, 3, 3][s];
                            "widehat" === n || "widecheck" === n ? (r = [0, 1062, 2364, 2364, 2364][l], i = [0, 239, 300, 360, 420][l], o = [0, .24, .3, .3, .36, .42][l], a = n + l) : (r = [0, 600, 1033, 2339, 2340][l], i = [0, 260, 286, 306, 312][l], o = [0, .26, .286, .3, .306, .34][l], a = "tilde" + l)
                        }
                        var h = new nt(a), c = new rt([h], {
                            width: "100%",
                            height: o + "em",
                            viewBox: "0 0 " + r + " " + i,
                            preserveAspectRatio: "none"
                        });
                        return {span: re.makeSvgSpan([], [c], e), minWidth: 0, height: o}
                    }
                    var m, u, d = [], p = _e[n], f = p[0], g = p[1], v = p[2], x = v / 1e3, y = f.length;
                    if (1 === y) m = ["hide-tail"], u = [p[3]]; else if (2 === y) m = ["halfarrow-left", "halfarrow-right"], u = ["xMinYMin", "xMaxYMin"]; else {
                        if (3 !== y) throw new Error("Correct katexImagesData or update code here to support\n                    " + y + " children.");
                        m = ["brace-left", "brace-center", "brace-right"], u = ["xMinYMin", "xMidYMin", "xMaxYMin"]
                    }
                    for (var b = 0; b < y; b++) {
                        var w = new nt(f[b]), k = new rt([w], {
                            width: "400em",
                            height: x + "em",
                            viewBox: "0 0 " + r + " " + v,
                            preserveAspectRatio: u[b] + " slice"
                        }), S = re.makeSvgSpan([m[b]], [k], e);
                        if (1 === y) return {span: S, minWidth: g, height: x};
                        S.style.height = x + "em", d.push(S)
                    }
                    return {span: re.makeSpan(["stretchy"], d, e), minWidth: g, height: x}
                }(), n = r.span, i = r.minWidth, a = r.height;
                return n.height = a, n.style.height = a + "em", i > 0 && (n.style.minWidth = i + "em"), n
            }, He = function (t, e) {
                var r, n, i, a = s(t, "supsub");
                a ? (r = (n = o(a.base, "accent")).base, a.base = r, i = function (t) {
                    if (t instanceof J) return t;
                    throw new Error("Expected span<HtmlDomNode> but got " + String(t) + ".")
                }(ke(a, e)), a.base = n) : r = (n = o(t, "accent")).base;
                var l = ke(r, e.havingCrampedStyle()), h = 0;
                if (n.isShifty && O.isCharacterBox(r)) {
                    var c = O.getBaseElem(r);
                    h = function (t) {
                        if (t instanceof et) return t;
                        throw new Error("Expected symbolNode but got " + String(t) + ".")
                    }(ke(c, e.havingCrampedStyle())).skew
                }
                var m, u = Math.min(l.height, e.fontMetrics().xHeight);
                if (n.isStretchy) m = De(n, e), m = re.makeVList({
                    positionType: "firstBaseline",
                    children: [{type: "elem", elem: l}, {
                        type: "elem",
                        elem: m,
                        wrapperClasses: ["svg-align"],
                        wrapperStyle: h > 0 ? {width: "calc(100% - " + 2 * h + "em)", marginLeft: 2 * h + "em"} : void 0
                    }]
                }, e); else {
                    var d, p;
                    "\\vec" === n.label ? (d = re.staticSvg("vec", e), p = re.svgData.vec[1]) : ((d = re.makeSymbol(n.label, "Main-Regular", n.mode, e)).italic = 0, p = d.width), m = re.makeSpan(["accent-body"], [d]);
                    var f = "\\textcircled" === n.label;
                    f && (m.classes.push("accent-full"), u = l.height);
                    var g = h;
                    f || (g -= p / 2), m.style.left = g + "em", "\\textcircled" === n.label && (m.style.top = ".2em"), m = re.makeVList({
                        positionType: "firstBaseline",
                        children: [{type: "elem", elem: l}, {type: "kern", size: -u}, {type: "elem", elem: m}]
                    }, e)
                }
                var v = re.makeSpan(["mord", "accent"], [m], e);
                return i ? (i.children[0] = v, i.height = Math.max(v.height, i.height), i.classes[0] = "mord", i) : v
            }, je = function (t, e) {
                var r = t.isStretchy ? Fe(t.label) : new Ae.MathNode("mo", [ze(t.label, t.mode)]),
                    n = new Ae.MathNode("mover", [Le(t.base, e), r]);
                return n.setAttribute("accent", "true"), n
            },
            Ve = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map(function (t) {
                return "\\" + t
            }).join("|"));
        c({
            type: "accent",
            names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
            props: {numArgs: 1},
            handler: function (t, e) {
                var r = e[0], n = !Ve.test(t.funcName),
                    i = !n || "\\widehat" === t.funcName || "\\widetilde" === t.funcName || "\\widecheck" === t.funcName;
                return {type: "accent", mode: t.parser.mode, label: t.funcName, isStretchy: n, isShifty: i, base: r}
            },
            htmlBuilder: He,
            mathmlBuilder: je
        }), c({
            type: "accent",
            names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\r", "\\H", "\\v", "\\textcircled"],
            props: {numArgs: 1, allowedInText: !0, allowedInMath: !1},
            handler: function (t, e) {
                var r = e[0];
                return {type: "accent", mode: t.parser.mode, label: t.funcName, isStretchy: !1, isShifty: !0, base: r}
            },
            htmlBuilder: He,
            mathmlBuilder: je
        }), c({
            type: "accentUnder",
            names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
            props: {numArgs: 1},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                return {type: "accentUnder", mode: r.mode, label: n, base: i}
            },
            htmlBuilder: function (t, e) {
                var r = ke(t.base, e), n = De(t, e), i = "\\utilde" === t.label ? .12 : 0, a = re.makeVList({
                    positionType: "bottom",
                    positionData: n.height + i,
                    children: [{type: "elem", elem: n, wrapperClasses: ["svg-align"]}, {
                        type: "kern",
                        size: i
                    }, {type: "elem", elem: r}]
                }, e);
                return re.makeSpan(["mord", "accentunder"], [a], e)
            },
            mathmlBuilder: function (t, e) {
                var r = Fe(t.label), n = new Ae.MathNode("munder", [Le(t.base, e), r]);
                return n.setAttribute("accentunder", "true"), n
            }
        }), c({
            type: "xArrow",
            names: ["\\xleftarrow", "\\xrightarrow", "\\xLeftarrow", "\\xRightarrow", "\\xleftrightarrow", "\\xLeftrightarrow", "\\xhookleftarrow", "\\xhookrightarrow", "\\xmapsto", "\\xrightharpoondown", "\\xrightharpoonup", "\\xleftharpoondown", "\\xleftharpoonup", "\\xrightleftharpoons", "\\xleftrightharpoons", "\\xlongequal", "\\xtwoheadrightarrow", "\\xtwoheadleftarrow", "\\xtofrom", "\\xrightleftarrows", "\\xrightequilibrium", "\\xleftequilibrium"],
            props: {numArgs: 1, numOptionalArgs: 1},
            handler: function (t, e, r) {
                var n = t.parser, i = t.funcName;
                return {type: "xArrow", mode: n.mode, label: i, body: e[0], below: r[0]}
            },
            htmlBuilder: function (t, e) {
                var r, n = e.style, i = e.havingStyle(n.sup()), a = re.wrapFragment(ke(t.body, i, e), e);
                a.classes.push("x-arrow-pad"), t.below && (i = e.havingStyle(n.sub()), (r = re.wrapFragment(ke(t.below, i, e), e)).classes.push("x-arrow-pad"));
                var o, s = De(t, e), l = -e.fontMetrics().axisHeight + .5 * s.height,
                    h = -e.fontMetrics().axisHeight - .5 * s.height - .111;
                if ((a.depth > .25 || "\\xleftequilibrium" === t.label) && (h -= a.depth), r) {
                    var c = -e.fontMetrics().axisHeight + r.height + .5 * s.height + .111;
                    o = re.makeVList({
                        positionType: "individualShift",
                        children: [{type: "elem", elem: a, shift: h}, {type: "elem", elem: s, shift: l}, {
                            type: "elem",
                            elem: r,
                            shift: c
                        }]
                    }, e)
                } else o = re.makeVList({
                    positionType: "individualShift",
                    children: [{type: "elem", elem: a, shift: h}, {type: "elem", elem: s, shift: l}]
                }, e);
                return o.children[0].children[0].children[1].classes.push("svg-align"), re.makeSpan(["mrel", "x-arrow"], [o], e)
            },
            mathmlBuilder: function (t, e) {
                var r, n, i = Fe(t.label);
                if (t.body) {
                    var a = Le(t.body, e);
                    t.below ? (n = Le(t.below, e), r = new Ae.MathNode("munderover", [i, n, a])) : r = new Ae.MathNode("mover", [i, a])
                } else t.below ? (n = Le(t.below, e), r = new Ae.MathNode("munder", [i, n])) : r = new Ae.MathNode("mover", [i]);
                return r
            }
        }), c({
            type: "textord", names: ["\\@char"], props: {numArgs: 1, allowedInText: !0}, handler: function (t, e) {
                for (var r = t.parser, n = o(e[0], "ordgroup").body, i = "", a = 0; a < n.length; a++) i += o(n[a], "textord").text;
                var s = parseInt(i);
                if (isNaN(s)) throw new C("\\@char has non-numeric argument " + i);
                return {type: "textord", mode: r.mode, text: String.fromCharCode(s)}
            }
        });
        var Ue = function (t, e) {
            var r = ve(t.body, e.withColor(t.color), !1);
            return re.makeFragment(r)
        }, Ge = function (t, e) {
            var r = Be(t.body, e), n = new Ae.MathNode("mstyle", r);
            return n.setAttribute("mathcolor", t.color), n
        };
        c({
            type: "color",
            names: ["\\textcolor"],
            props: {numArgs: 2, allowedInText: !0, greediness: 3, argTypes: ["color", "original"]},
            handler: function (t, e) {
                var r = t.parser, n = o(e[0], "color-token").color, i = e[1];
                return {type: "color", mode: r.mode, color: n, body: me(i)}
            },
            htmlBuilder: Ue,
            mathmlBuilder: Ge
        }), c({
            type: "color",
            names: ["\\blue", "\\orange", "\\pink", "\\red", "\\green", "\\gray", "\\purple", "\\blueA", "\\blueB", "\\blueC", "\\blueD", "\\blueE", "\\tealA", "\\tealB", "\\tealC", "\\tealD", "\\tealE", "\\greenA", "\\greenB", "\\greenC", "\\greenD", "\\greenE", "\\goldA", "\\goldB", "\\goldC", "\\goldD", "\\goldE", "\\redA", "\\redB", "\\redC", "\\redD", "\\redE", "\\maroonA", "\\maroonB", "\\maroonC", "\\maroonD", "\\maroonE", "\\purpleA", "\\purpleB", "\\purpleC", "\\purpleD", "\\purpleE", "\\mintA", "\\mintB", "\\mintC", "\\grayA", "\\grayB", "\\grayC", "\\grayD", "\\grayE", "\\grayF", "\\grayG", "\\grayH", "\\grayI", "\\kaBlue", "\\kaGreen"],
            props: {numArgs: 1, allowedInText: !0, greediness: 3},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                return {type: "color", mode: r.mode, color: "katex-" + n.slice(1), body: me(i)}
            },
            htmlBuilder: Ue,
            mathmlBuilder: Ge
        }), c({
            type: "color",
            names: ["\\color"],
            props: {numArgs: 1, allowedInText: !0, greediness: 3, argTypes: ["color"]},
            handler: function (t, e) {
                var r = t.parser, n = t.breakOnTokenText, i = o(e[0], "color-token").color,
                    a = r.parseExpression(!0, n);
                return {type: "color", mode: r.mode, color: i, body: a}
            },
            htmlBuilder: Ue,
            mathmlBuilder: Ge
        }), c({
            type: "cr",
            names: ["\\cr", "\\newline"],
            props: {numArgs: 0, numOptionalArgs: 1, argTypes: ["size"], allowedInText: !0},
            handler: function (t, e, r) {
                var n = t.parser, i = t.funcName, a = r[0], s = "\\cr" === i, l = !1;
                return s || (l = !n.settings.displayMode || !n.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode")), {
                    type: "cr",
                    mode: n.mode,
                    newLine: l,
                    newRow: s,
                    size: a && o(a, "size").value
                }
            },
            htmlBuilder: function (t, e) {
                if (t.newRow) throw new C("\\cr valid only within a tabular/array environment");
                var r = re.makeSpan(["mspace"], [], e);
                return t.newLine && (r.classes.push("newline"), t.size && (r.style.marginTop = Ut(t.size, e) + "em")), r
            },
            mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mspace");
                return t.newLine && (r.setAttribute("linebreak", "newline"), t.size && r.setAttribute("height", Ut(t.size, e) + "em")), r
            }
        });
        var We = function (t, e, r) {
                var n = i(ut.math[t] && ut.math[t].replace || t, e, r);
                if (!n) throw new Error("Unsupported symbol " + t + " and font size " + e + ".");
                return n
            }, Xe = function (t, e, r, n) {
                var i = r.havingBaseStyle(e), a = re.makeSpan(n.concat(i.sizingClasses(r)), [t], r),
                    o = i.sizeMultiplier / r.sizeMultiplier;
                return a.height *= o, a.depth *= o, a.maxFontSize = i.sizeMultiplier, a
            }, Ye = function (t, e, r) {
                var n = e.havingBaseStyle(r), i = (1 - e.sizeMultiplier / n.sizeMultiplier) * e.fontMetrics().axisHeight;
                t.classes.push("delimcenter"), t.style.top = i + "em", t.height -= i, t.depth += i
            }, $e = function (t, e, r, n, i, a) {
                var o = function (t, e, r, n) {
                    return re.makeSymbol(t, "Size" + e + "-Regular", r, n)
                }(t, e, i, n), s = Xe(re.makeSpan(["delimsizing", "size" + e], [o], n), V.TEXT, n, a);
                return r && Ye(s, n, V.TEXT), s
            }, Ke = function (t, e, r) {
                var n;
                return n = "Size1-Regular" === e ? "delim-size1" : "delim-size4", {
                    type: "elem",
                    elem: re.makeSpan(["delimsizinginner", n], [re.makeSpan([], [re.makeSymbol(t, e, r)])])
                }
            }, Ze = function (t, e, r, n, i, a) {
                var o, s, l, h;
                o = l = h = t, s = null;
                var c = "Size1-Regular";
                "\\uparrow" === t ? l = h = "\u23d0" : "\\Uparrow" === t ? l = h = "\u2016" : "\\downarrow" === t ? o = l = "\u23d0" : "\\Downarrow" === t ? o = l = "\u2016" : "\\updownarrow" === t ? (o = "\\uparrow", l = "\u23d0", h = "\\downarrow") : "\\Updownarrow" === t ? (o = "\\Uparrow", l = "\u2016", h = "\\Downarrow") : "[" === t || "\\lbrack" === t ? (o = "\u23a1", l = "\u23a2", h = "\u23a3", c = "Size4-Regular") : "]" === t || "\\rbrack" === t ? (o = "\u23a4", l = "\u23a5", h = "\u23a6", c = "Size4-Regular") : "\\lfloor" === t || "\u230a" === t ? (l = o = "\u23a2", h = "\u23a3", c = "Size4-Regular") : "\\lceil" === t || "\u2308" === t ? (o = "\u23a1", l = h = "\u23a2", c = "Size4-Regular") : "\\rfloor" === t || "\u230b" === t ? (l = o = "\u23a5", h = "\u23a6", c = "Size4-Regular") : "\\rceil" === t || "\u2309" === t ? (o = "\u23a4", l = h = "\u23a5", c = "Size4-Regular") : "(" === t || "\\lparen" === t ? (o = "\u239b", l = "\u239c", h = "\u239d", c = "Size4-Regular") : ")" === t || "\\rparen" === t ? (o = "\u239e", l = "\u239f", h = "\u23a0", c = "Size4-Regular") : "\\{" === t || "\\lbrace" === t ? (o = "\u23a7", s = "\u23a8", h = "\u23a9", l = "\u23aa", c = "Size4-Regular") : "\\}" === t || "\\rbrace" === t ? (o = "\u23ab", s = "\u23ac", h = "\u23ad", l = "\u23aa", c = "Size4-Regular") : "\\lgroup" === t || "\u27ee" === t ? (o = "\u23a7", h = "\u23a9", l = "\u23aa", c = "Size4-Regular") : "\\rgroup" === t || "\u27ef" === t ? (o = "\u23ab", h = "\u23ad", l = "\u23aa", c = "Size4-Regular") : "\\lmoustache" === t || "\u23b0" === t ? (o = "\u23a7", h = "\u23ad", l = "\u23aa", c = "Size4-Regular") : "\\rmoustache" !== t && "\u23b1" !== t || (o = "\u23ab", h = "\u23a9", l = "\u23aa", c = "Size4-Regular");
                var m = We(o, c, i), u = m.height + m.depth, d = We(l, c, i), p = d.height + d.depth, f = We(h, c, i),
                    g = f.height + f.depth, v = 0, x = 1;
                if (null !== s) {
                    var y = We(s, c, i);
                    v = y.height + y.depth, x = 2
                }
                var b = u + g + v, w = Math.ceil((e - b) / (x * p)), k = b + w * x * p, S = n.fontMetrics().axisHeight;
                r && (S *= n.sizeMultiplier);
                var M = k / 2 - S, A = [];
                if (A.push(Ke(h, c, i)), null === s) for (var z = 0; z < w; z++) A.push(Ke(l, c, i)); else {
                    for (var T = 0; T < w; T++) A.push(Ke(l, c, i));
                    A.push(Ke(s, c, i));
                    for (var C = 0; C < w; C++) A.push(Ke(l, c, i))
                }
                A.push(Ke(o, c, i));
                var B = n.havingBaseStyle(V.TEXT),
                    N = re.makeVList({positionType: "bottom", positionData: M, children: A}, B);
                return Xe(re.makeSpan(["delimsizing", "mult"], [N], B), V.TEXT, n, a)
            }, Je = function (t, e, r, n) {
                var i;
                "sqrtTall" === t && (i = "M702 80H400000v40H742v" + (r - 54 - 80) + "l-4 4-4 4c-.667.7\n-2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1h-12l-28-84c-16.667-52-96.667\n-294.333-240-727l-212 -643 -85 170c-4-3.333-8.333-7.667-13 -13l-13-13l77-155\n 77-156c66 199.333 139 419.667 219 661 l218 661zM702 80H400000v40H742z");
                var a = new nt(t, i), o = new rt([a], {
                    width: "400em",
                    height: e + "em",
                    viewBox: "0 0 400000 " + r,
                    preserveAspectRatio: "xMinYMin slice"
                });
                return re.makeSvgSpan(["hide-tail"], [o], n)
            },
            Qe = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230a", "\u230b", "\\lceil", "\\rceil", "\u2308", "\u2309", "\\surd"],
            tr = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27ee", "\u27ef", "\\lmoustache", "\\rmoustache", "\u23b0", "\u23b1"],
            er = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"], rr = [0, 1.2, 1.8, 2.4, 3],
            nr = [{type: "small", style: V.SCRIPTSCRIPT}, {type: "small", style: V.SCRIPT}, {
                type: "small",
                style: V.TEXT
            }, {type: "large", size: 1}, {type: "large", size: 2}, {type: "large", size: 3}, {type: "large", size: 4}],
            ir = [{type: "small", style: V.SCRIPTSCRIPT}, {type: "small", style: V.SCRIPT}, {
                type: "small",
                style: V.TEXT
            }, {type: "stack"}], ar = [{type: "small", style: V.SCRIPTSCRIPT}, {type: "small", style: V.SCRIPT}, {
                type: "small",
                style: V.TEXT
            }, {type: "large", size: 1}, {type: "large", size: 2}, {type: "large", size: 3}, {
                type: "large",
                size: 4
            }, {type: "stack"}], or = function (t) {
                if ("small" === t.type) return "Main-Regular";
                if ("large" === t.type) return "Size" + t.size + "-Regular";
                if ("stack" === t.type) return "Size4-Regular";
                throw new Error("Add support for delim type '" + t.type + "' here.")
            }, sr = function (t, e, r, n) {
                for (var i = Math.min(2, 3 - n.style.size); i < r.length && "stack" !== r[i].type; i++) {
                    var a = We(t, or(r[i]), "math"), o = a.height + a.depth;
                    if ("small" === r[i].type && (o *= n.havingBaseStyle(r[i].style).sizeMultiplier), o > e) return r[i]
                }
                return r[r.length - 1]
            }, lr = function (t, e, r, n, i, a) {
                var o;
                "<" === t || "\\lt" === t || "\u27e8" === t ? t = "\\langle" : ">" !== t && "\\gt" !== t && "\u27e9" !== t || (t = "\\rangle"), o = O.contains(er, t) ? nr : O.contains(Qe, t) ? ar : ir;
                var s = sr(t, e, o, n);
                return "small" === s.type ? function (t, e, r, n, i, a) {
                    var o = re.makeSymbol(t, "Main-Regular", i, n), s = Xe(o, e, n, a);
                    return r && Ye(s, n, e), s
                }(t, s.style, r, n, i, a) : "large" === s.type ? $e(t, s.size, r, n, i, a) : Ze(t, e, r, n, i, a)
            }, hr = function (t, e) {
                var r, n, i = e.havingBaseSizing(), a = sr("\\surd", t * i.sizeMultiplier, ar, i), o = i.sizeMultiplier,
                    s = 0, l = 0, h = 0;
                return "small" === a.type ? (t < 1 ? o = 1 : t < 1.4 && (o = .7), l = 1 / o, (r = Je("sqrtMain", s = 1.08 / o, h = 1080, e)).style.minWidth = "0.853em", n = .833 / o) : "large" === a.type ? (h = 1080 * rr[a.size], l = rr[a.size] / o, s = (rr[a.size] + .08) / o, (r = Je("sqrtSize" + a.size, s, h, e)).style.minWidth = "1.02em", n = 1 / o) : (s = t + .08, l = t, h = Math.floor(1e3 * t) + 80, (r = Je("sqrtTall", s, h, e)).style.minWidth = "0.742em", n = 1.056), r.height = l, r.style.height = s + "em", {
                    span: r,
                    advanceWidth: n,
                    ruleWidth: e.fontMetrics().sqrtRuleThickness * o
                }
            }, cr = function (t, e, r, n, i) {
                if ("<" === t || "\\lt" === t || "\u27e8" === t ? t = "\\langle" : ">" !== t && "\\gt" !== t && "\u27e9" !== t || (t = "\\rangle"), O.contains(Qe, t) || O.contains(er, t)) return $e(t, e, !1, r, n, i);
                if (O.contains(tr, t)) return Ze(t, rr[e], !1, r, n, i);
                throw new C("Illegal delimiter: '" + t + "'")
            }, mr = lr, ur = function (t, e, r, n, i, a) {
                var o = n.fontMetrics().axisHeight * n.sizeMultiplier, s = 5 / n.fontMetrics().ptPerEm,
                    l = Math.max(e - o, r + o), h = Math.max(l / 500 * 901, 2 * l - s);
                return lr(t, h, !0, n, i, a)
            }, dr = {
                "\\bigl": {mclass: "mopen", size: 1},
                "\\Bigl": {mclass: "mopen", size: 2},
                "\\biggl": {mclass: "mopen", size: 3},
                "\\Biggl": {mclass: "mopen", size: 4},
                "\\bigr": {mclass: "mclose", size: 1},
                "\\Bigr": {mclass: "mclose", size: 2},
                "\\biggr": {mclass: "mclose", size: 3},
                "\\Biggr": {mclass: "mclose", size: 4},
                "\\bigm": {mclass: "mrel", size: 1},
                "\\Bigm": {mclass: "mrel", size: 2},
                "\\biggm": {mclass: "mrel", size: 3},
                "\\Biggm": {mclass: "mrel", size: 4},
                "\\big": {mclass: "mord", size: 1},
                "\\Big": {mclass: "mord", size: 2},
                "\\bigg": {mclass: "mord", size: 3},
                "\\Bigg": {mclass: "mord", size: 4}
            },
            pr = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230a", "\u230b", "\\lceil", "\\rceil", "\u2308", "\u2309", "<", ">", "\\langle", "\u27e8", "\\rangle", "\u27e9", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27ee", "\u27ef", "\\lmoustache", "\\rmoustache", "\u23b0", "\u23b1", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
        c({
            type: "delimsizing",
            names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
            props: {numArgs: 1},
            handler: function (t, e) {
                var r = f(e[0], t);
                return {
                    type: "delimsizing",
                    mode: t.parser.mode,
                    size: dr[t.funcName].size,
                    mclass: dr[t.funcName].mclass,
                    delim: r.text
                }
            },
            htmlBuilder: function (t, e) {
                return "." === t.delim ? re.makeSpan([t.mclass]) : cr(t.delim, t.size, e, t.mode, [t.mclass])
            },
            mathmlBuilder: function (t) {
                var e = [];
                "." !== t.delim && e.push(ze(t.delim, t.mode));
                var r = new Ae.MathNode("mo", e);
                return "mopen" === t.mclass || "mclose" === t.mclass ? r.setAttribute("fence", "true") : r.setAttribute("fence", "false"), r
            }
        }), c({
            type: "leftright-right", names: ["\\right"], props: {numArgs: 1}, handler: function (t, e) {
                return {type: "leftright-right", mode: t.parser.mode, delim: f(e[0], t).text}
            }
        }), c({
            type: "leftright", names: ["\\left"], props: {numArgs: 1}, handler: function (t, e) {
                var r = f(e[0], t), n = t.parser;
                ++n.leftrightDepth;
                var i = n.parseExpression(!1);
                --n.leftrightDepth, n.expect("\\right", !1);
                var a = o(n.parseFunction(), "leftright-right");
                return {type: "leftright", mode: n.mode, body: i, left: r.text, right: a.delim}
            }, htmlBuilder: function (t, e) {
                g(t);
                for (var r, n, i = ve(t.body, e, !0, ["mopen", "mclose"]), a = 0, o = 0, s = !1, l = 0; l < i.length; l++) i[l].isMiddle ? s = !0 : (a = Math.max(i[l].height, a), o = Math.max(i[l].depth, o));
                if (a *= e.sizeMultiplier, o *= e.sizeMultiplier, r = "." === t.left ? we(e, ["mopen"]) : ur(t.left, a, o, e, t.mode, ["mopen"]), i.unshift(r), s) for (var h = 1; h < i.length; h++) {
                    var c = i[h].isMiddle;
                    c && (i[h] = ur(c.delim, a, o, c.options, t.mode, []))
                }
                return n = "." === t.right ? we(e, ["mclose"]) : ur(t.right, a, o, e, t.mode, ["mclose"]), i.push(n), re.makeSpan(["minner"], i, e)
            }, mathmlBuilder: function (t, e) {
                g(t);
                var r = Be(t.body, e);
                if ("." !== t.left) {
                    var n = new Ae.MathNode("mo", [ze(t.left, t.mode)]);
                    n.setAttribute("fence", "true"), r.unshift(n)
                }
                if ("." !== t.right) {
                    var i = new Ae.MathNode("mo", [ze(t.right, t.mode)]);
                    i.setAttribute("fence", "true"), r.push(i)
                }
                return Te(r)
            }
        }), c({
            type: "middle", names: ["\\middle"], props: {numArgs: 1}, handler: function (t, e) {
                var r = f(e[0], t);
                if (!t.parser.leftrightDepth) throw new C("\\middle without preceding \\left", r);
                return {type: "middle", mode: t.parser.mode, delim: r.text}
            }, htmlBuilder: function (t, e) {
                var r;
                if ("." === t.delim) r = we(e, []); else {
                    r = cr(t.delim, 1, e, t.mode, []);
                    var n = {delim: t.delim, options: e};
                    r.isMiddle = n
                }
                return r
            }, mathmlBuilder: function (t) {
                var e = new Ae.MathNode("mo", [ze(t.delim, t.mode)]);
                return e.setAttribute("fence", "true"), e
            }
        });
        var fr = function (t, e) {
            var r, n, i = re.wrapFragment(ke(t.body, e), e), a = t.label.substr(1), o = e.sizeMultiplier, s = 0,
                l = O.isCharacterBox(t.body);
            if ("sout" === a) (r = re.makeSpan(["stretchy", "sout"])).height = e.fontMetrics().defaultRuleThickness / o, s = -.5 * e.fontMetrics().xHeight; else {
                /cancel/.test(a) ? l || i.classes.push("cancel-pad") : i.classes.push("boxpad");
                var h = 0;
                h = /box/.test(a) ? "colorbox" === a ? .3 : .34 : l ? .2 : 0, r = Re(i, a, h, e), s = i.depth + h, t.backgroundColor && (r.style.backgroundColor = t.backgroundColor, t.borderColor && (r.style.borderColor = t.borderColor))
            }
            return n = t.backgroundColor ? re.makeVList({
                positionType: "individualShift",
                children: [{type: "elem", elem: r, shift: s}, {type: "elem", elem: i, shift: 0}]
            }, e) : re.makeVList({
                positionType: "individualShift",
                children: [{type: "elem", elem: i, shift: 0}, {
                    type: "elem",
                    elem: r,
                    shift: s,
                    wrapperClasses: /cancel/.test(a) ? ["svg-align"] : []
                }]
            }, e), /cancel/.test(a) && (n.height = i.height, n.depth = i.depth), /cancel/.test(a) && !l ? re.makeSpan(["mord", "cancel-lap"], [n], e) : re.makeSpan(["mord"], [n], e)
        }, gr = function (t, e) {
            var r = new Ae.MathNode("menclose", [Le(t.body, e)]);
            switch (t.label) {
                case"\\cancel":
                    r.setAttribute("notation", "updiagonalstrike");
                    break;
                case"\\bcancel":
                    r.setAttribute("notation", "downdiagonalstrike");
                    break;
                case"\\sout":
                    r.setAttribute("notation", "horizontalstrike");
                    break;
                case"\\fbox":
                case"\\fcolorbox":
                    r.setAttribute("notation", "box");
                    break;
                case"\\xcancel":
                    r.setAttribute("notation", "updiagonalstrike downdiagonalstrike")
            }
            return t.backgroundColor && r.setAttribute("mathbackground", t.backgroundColor), r
        };
        c({
            type: "enclose",
            names: ["\\colorbox"],
            props: {numArgs: 2, allowedInText: !0, greediness: 3, argTypes: ["color", "text"]},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = o(e[0], "color-token").color, a = e[1];
                return {type: "enclose", mode: r.mode, label: n, backgroundColor: i, body: a}
            },
            htmlBuilder: fr,
            mathmlBuilder: gr
        }), c({
            type: "enclose",
            names: ["\\fcolorbox"],
            props: {numArgs: 3, allowedInText: !0, greediness: 3, argTypes: ["color", "color", "text"]},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = o(e[0], "color-token").color, a = o(e[1], "color-token").color,
                    s = e[2];
                return {type: "enclose", mode: r.mode, label: n, backgroundColor: a, borderColor: i, body: s}
            },
            htmlBuilder: fr,
            mathmlBuilder: gr
        }), c({
            type: "enclose",
            names: ["\\fbox"],
            props: {numArgs: 1, argTypes: ["text"], allowedInText: !0},
            handler: function (t, e) {
                return {type: "enclose", mode: t.parser.mode, label: "\\fbox", body: e[0]}
            }
        }), c({
            type: "enclose",
            names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout"],
            props: {numArgs: 1},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                return {type: "enclose", mode: r.mode, label: n, body: i}
            },
            htmlBuilder: fr,
            mathmlBuilder: gr
        });
        var vr = {}, xr = function (t, e) {
            function r(t) {
                for (var e = 0; e < t.length; ++e) e > 0 && (v += .25), h.push({pos: v, isDashed: t[e]})
            }

            var n, i, a = t.body.length, o = t.hLinesBeforeRow, s = 0, l = new Array(a), h = [],
                c = 1 / e.fontMetrics().ptPerEm, m = 5 * c, u = 12 * c, d = 3 * c, p = t.arraystretch * u, f = .7 * p,
                g = .3 * p, v = 0;
            for (r(o[0]), n = 0; n < t.body.length; ++n) {
                var x = t.body[n], y = f, b = g;
                s < x.length && (s = x.length);
                var w = new Array(x.length);
                for (i = 0; i < x.length; ++i) {
                    var k = ke(x[i], e);
                    b < k.depth && (b = k.depth), y < k.height && (y = k.height), w[i] = k
                }
                var S = t.rowGaps[n], M = 0;
                S && (M = Ut(S, e)) > 0 && (b < (M += g) && (b = M), M = 0), t.addJot && (b += d), w.height = y, w.depth = b, v += y, w.pos = v, v += b + M, l[n] = w, r(o[n + 1])
            }
            var A, z, T = v / 2 + e.fontMetrics().axisHeight, B = t.cols || [], N = [];
            for (i = 0, z = 0; i < s || z < B.length; ++i, ++z) {
                for (var L = B[z] || {}, E = !0; "separator" === L.type;) {
                    if (E || ((A = re.makeSpan(["arraycolsep"], [])).style.width = e.fontMetrics().doubleRuleSep + "em", N.push(A)), "|" === L.separator) {
                        var I = re.makeSpan(["vertical-separator"], [], e);
                        I.style.height = v + "em", I.style.verticalAlign = -(v - T) + "em", N.push(I)
                    } else {
                        if (":" !== L.separator) throw new C("Invalid separator type: " + L.separator);
                        var q = re.makeSpan(["vertical-separator", "vs-dashed"], [], e);
                        q.style.height = v + "em", q.style.verticalAlign = -(v - T) + "em", N.push(q)
                    }
                    L = B[++z] || {}, E = !1
                }
                if (!(i >= s)) {
                    var _ = void 0;
                    (i > 0 || t.hskipBeforeAndAfter) && 0 !== (_ = O.deflt(L.pregap, m)) && ((A = re.makeSpan(["arraycolsep"], [])).style.width = _ + "em", N.push(A));
                    var P = [];
                    for (n = 0; n < a; ++n) {
                        var R = l[n], F = R[i];
                        if (F) {
                            var D = R.pos - T;
                            F.depth = R.depth, F.height = R.height, P.push({type: "elem", elem: F, shift: D})
                        }
                    }
                    P = re.makeVList({
                        positionType: "individualShift",
                        children: P
                    }, e), P = re.makeSpan(["col-align-" + (L.align || "c")], [P]), N.push(P), (i < s - 1 || t.hskipBeforeAndAfter) && 0 !== (_ = O.deflt(L.postgap, m)) && ((A = re.makeSpan(["arraycolsep"], [])).style.width = _ + "em", N.push(A))
                }
            }
            if (l = re.makeSpan(["mtable"], N), h.length > 0) {
                for (var H = re.makeLineSpan("hline", e, .05), j = re.makeLineSpan("hdashline", e, .05), V = [{
                    type: "elem",
                    elem: l,
                    shift: 0
                }]; h.length > 0;) {
                    var U = h.pop(), G = U.pos - T;
                    U.isDashed ? V.push({type: "elem", elem: j, shift: G}) : V.push({type: "elem", elem: H, shift: G})
                }
                l = re.makeVList({positionType: "individualShift", children: V}, e)
            }
            return re.makeSpan(["mord"], [l], e)
        }, yr = function (t, e) {
            return new Ae.MathNode("mtable", t.body.map(function (t) {
                return new Ae.MathNode("mtr", t.map(function (t) {
                    return new Ae.MathNode("mtd", [Le(t, e)])
                }))
            }))
        }, br = function (t, e) {
            var r, n = [], i = y(t.parser, {cols: n, addJot: !0}, "display"), a = 0,
                l = {type: "ordgroup", mode: t.mode, body: []}, h = s(e[0], "ordgroup");
            if (h) {
                for (var c = "", m = 0; m < h.body.length; m++) c += o(h.body[m], "textord").text;
                r = Number(c), a = 2 * r
            }
            var u = !a;
            i.body.forEach(function (t) {
                for (var e = 1; e < t.length; e += 2) {
                    var n = o(t[e], "styling");
                    o(n.body[0], "ordgroup").body.unshift(l)
                }
                if (u) a < t.length && (a = t.length); else {
                    var i = t.length / 2;
                    if (r < i) throw new C("Too many math in a row: expected " + r + ", but got " + i, t[0])
                }
            });
            for (var d = 0; d < a; ++d) {
                var p = "r", f = 0;
                d % 2 == 1 ? p = "l" : d > 0 && u && (f = 1), n[d] = {type: "align", align: p, pregap: f, postgap: 0}
            }
            return i
        };
        v({
            type: "array", names: ["array", "darray"], props: {numArgs: 1}, handler: function (t, e) {
                var r = {
                    cols: (h(e[0]) ? [e[0]] : o(e[0], "ordgroup").body).map(function (t) {
                        var e = function (t) {
                            var e = h(t);
                            if (!e) throw new Error("Expected node of symbol group type, but got " + (t ? "node of type " + t.type : String(t)));
                            return e
                        }(t).text;
                        if (-1 !== "lcr".indexOf(e)) return {type: "align", align: e};
                        if ("|" === e) return {type: "separator", separator: "|"};
                        if (":" === e) return {type: "separator", separator: ":"};
                        throw new C("Unknown column alignment: " + e, t)
                    }), hskipBeforeAndAfter: !0
                };
                return y(t.parser, r, b(t.envName))
            }, htmlBuilder: xr, mathmlBuilder: yr
        }), v({
            type: "array",
            names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix"],
            props: {numArgs: 0},
            handler: function (t) {
                var e = {
                    matrix: null,
                    pmatrix: ["(", ")"],
                    bmatrix: ["[", "]"],
                    Bmatrix: ["\\{", "\\}"],
                    vmatrix: ["|", "|"],
                    Vmatrix: ["\\Vert", "\\Vert"]
                }[t.envName], r = y(t.parser, {hskipBeforeAndAfter: !1}, b(t.envName));
                return e ? {type: "leftright", mode: t.mode, body: [r], left: e[0], right: e[1]} : r
            },
            htmlBuilder: xr,
            mathmlBuilder: yr
        }), v({
            type: "array", names: ["cases", "dcases"], props: {numArgs: 0}, handler: function (t) {
                var e = y(t.parser, {
                    arraystretch: 1.2,
                    cols: [{type: "align", align: "l", pregap: 0, postgap: 1}, {
                        type: "align",
                        align: "l",
                        pregap: 0,
                        postgap: 0
                    }]
                }, b(t.envName));
                return {type: "leftright", mode: t.mode, body: [e], left: "\\{", right: "."}
            }, htmlBuilder: xr, mathmlBuilder: yr
        }), v({
            type: "array",
            names: ["aligned"],
            props: {numArgs: 0},
            handler: br,
            htmlBuilder: xr,
            mathmlBuilder: yr
        }), v({
            type: "array", names: ["gathered"], props: {numArgs: 0}, handler: function (t) {
                return y(t.parser, {cols: [{type: "align", align: "c"}], addJot: !0}, "display")
            }, htmlBuilder: xr, mathmlBuilder: yr
        }), v({
            type: "array",
            names: ["alignedat"],
            props: {numArgs: 1},
            handler: br,
            htmlBuilder: xr,
            mathmlBuilder: yr
        }), c({
            type: "text",
            names: ["\\hline", "\\hdashline"],
            props: {numArgs: 0, allowedInText: !0, allowedInMath: !0},
            handler: function (t) {
                throw new C(t.funcName + " valid only within array environment")
            }
        });
        var wr = vr;
        c({
            type: "environment",
            names: ["\\begin", "\\end"],
            props: {numArgs: 1, argTypes: ["text"]},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                if ("ordgroup" !== i.type) throw new C("Invalid environment name", i);
                for (var a = "", s = 0; s < i.body.length; ++s) a += o(i.body[s], "textord").text;
                if ("\\begin" === n) {
                    if (!wr.hasOwnProperty(a)) throw new C("No such environment: " + a, i);
                    var l = wr[a], h = r.parseArguments("\\begin{" + a + "}", l), c = h.args, m = h.optArgs,
                        u = {mode: r.mode, envName: a, parser: r}, d = l.handler(u, c, m);
                    r.expect("\\end", !1);
                    var p = r.nextToken, f = o(r.parseFunction(), "environment");
                    if (f.name !== a) throw new C("Mismatch: \\begin{" + a + "} matched by \\end{" + f.name + "}", p);
                    return d
                }
                return {type: "environment", mode: r.mode, name: a, nameGroup: i}
            }
        });
        var kr = re.makeSpan;
        c({
            type: "mclass",
            names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
            props: {numArgs: 1},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                return {type: "mclass", mode: r.mode, mclass: "m" + n.substr(5), body: me(i)}
            },
            htmlBuilder: w,
            mathmlBuilder: k
        });
        var Sr = function (t) {
            var e = "ordgroup" === t.type && t.body.length ? t.body[0] : t;
            return "atom" !== e.type || "bin" !== e.family && "rel" !== e.family ? "mord" : "m" + e.family
        };
        c({
            type: "mclass", names: ["\\@binrel"], props: {numArgs: 2}, handler: function (t, e) {
                return {type: "mclass", mode: t.parser.mode, mclass: Sr(e[0]), body: [e[1]]}
            }
        }), c({
            type: "mclass",
            names: ["\\stackrel", "\\overset", "\\underset"],
            props: {numArgs: 2},
            handler: function (t, e) {
                var r, n = t.parser, i = t.funcName, a = e[1], o = e[0];
                r = "\\stackrel" !== i ? Sr(a) : "mrel";
                var s = {
                    type: "op",
                    mode: a.mode,
                    limits: !0,
                    alwaysHandleSupSub: !0,
                    symbol: !1,
                    suppressBaseShift: "\\stackrel" !== i,
                    body: me(a)
                }, l = {
                    type: "supsub",
                    mode: o.mode,
                    base: s,
                    sup: "\\underset" === i ? null : o,
                    sub: "\\underset" === i ? o : null
                };
                return {type: "mclass", mode: n.mode, mclass: r, body: [l]}
            },
            htmlBuilder: w,
            mathmlBuilder: k
        });
        var Mr = function (t, e) {
            var r = t.font, n = e.withFont(r);
            return ke(t.body, n)
        }, Ar = function (t, e) {
            var r = t.font, n = e.withFont(r);
            return Le(t.body, n)
        }, zr = {"\\Bbb": "\\mathbb", "\\bold": "\\mathbf", "\\frak": "\\mathfrak", "\\bm": "\\boldsymbol"};
        c({
            type: "font",
            names: ["\\mathrm", "\\mathit", "\\mathbf", "\\mathnormal", "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf", "\\mathtt", "\\Bbb", "\\bold", "\\frak"],
            props: {numArgs: 1, greediness: 2},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0], a = n;
                return a in zr && (a = zr[a]), {type: "font", mode: r.mode, font: a.slice(1), body: i}
            },
            htmlBuilder: Mr,
            mathmlBuilder: Ar
        }), c({
            type: "mclass",
            names: ["\\boldsymbol", "\\bm"],
            props: {numArgs: 1, greediness: 2},
            handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {
                    type: "mclass",
                    mode: r.mode,
                    mclass: Sr(n),
                    body: [{type: "font", mode: r.mode, font: "boldsymbol", body: n}]
                }
            }
        }), c({
            type: "font",
            names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it"],
            props: {numArgs: 0, allowedInText: !0},
            handler: function (t) {
                var e = t.parser, r = t.funcName, n = t.breakOnTokenText, i = e.mode, a = e.parseExpression(!0, n);
                return {
                    type: "font",
                    mode: i,
                    font: "math" + r.slice(1),
                    body: {type: "ordgroup", mode: e.mode, body: a}
                }
            },
            htmlBuilder: Mr,
            mathmlBuilder: Ar
        });
        var Tr = function (t, e) {
            var r = e.style;
            "display" === t.size ? r = V.DISPLAY : "text" === t.size && r.size === V.DISPLAY.size ? r = V.TEXT : "script" === t.size ? r = V.SCRIPT : "scriptscript" === t.size && (r = V.SCRIPTSCRIPT);
            var n, i = r.fracNum(), a = r.fracDen();
            n = e.havingStyle(i);
            var o = ke(t.numer, n, e);
            if (t.continued) {
                var s = 8.5 / e.fontMetrics().ptPerEm, l = 3.5 / e.fontMetrics().ptPerEm;
                o.height = o.height < s ? s : o.height, o.depth = o.depth < l ? l : o.depth
            }
            n = e.havingStyle(a);
            var h, c, m, u, d, p, f, g, v, x, y = ke(t.denom, n, e);
            if (t.hasBarLine ? (t.barSize ? (c = Ut(t.barSize, e), h = re.makeLineSpan("frac-line", e, c)) : h = re.makeLineSpan("frac-line", e), c = h.height, m = h.height) : (h = null, c = 0, m = e.fontMetrics().defaultRuleThickness), r.size === V.DISPLAY.size ? (u = e.fontMetrics().num1, d = c > 0 ? 3 * m : 7 * m, p = e.fontMetrics().denom1) : (c > 0 ? (u = e.fontMetrics().num2, d = m) : (u = e.fontMetrics().num3, d = 3 * m), p = e.fontMetrics().denom2), h) {
                var b = e.fontMetrics().axisHeight;
                u - o.depth - (b + .5 * c) < d && (u += d - (u - o.depth - (b + .5 * c))), b - .5 * c - (y.height - p) < d && (p += d - (b - .5 * c - (y.height - p)));
                var w = -(b - .5 * c);
                f = re.makeVList({
                    positionType: "individualShift",
                    children: [{type: "elem", elem: y, shift: p}, {type: "elem", elem: h, shift: w}, {
                        type: "elem",
                        elem: o,
                        shift: -u
                    }]
                }, e)
            } else {
                var k = u - o.depth - (y.height - p);
                k < d && (u += .5 * (d - k), p += .5 * (d - k)), f = re.makeVList({
                    positionType: "individualShift",
                    children: [{type: "elem", elem: y, shift: p}, {type: "elem", elem: o, shift: -u}]
                }, e)
            }
            return n = e.havingStyle(r), f.height *= n.sizeMultiplier / e.sizeMultiplier, f.depth *= n.sizeMultiplier / e.sizeMultiplier, g = r.size === V.DISPLAY.size ? e.fontMetrics().delim1 : e.fontMetrics().delim2, v = null == t.leftDelim ? we(e, ["mopen"]) : mr(t.leftDelim, g, !0, e.havingStyle(r), t.mode, ["mopen"]), x = t.continued ? re.makeSpan([]) : null == t.rightDelim ? we(e, ["mclose"]) : mr(t.rightDelim, g, !0, e.havingStyle(r), t.mode, ["mclose"]), re.makeSpan(["mord"].concat(n.sizingClasses(e)), [v, re.makeSpan(["mfrac"], [f]), x], e)
        }, Cr = function (t, e) {
            var r = new Ae.MathNode("mfrac", [Le(t.numer, e), Le(t.denom, e)]);
            if (t.hasBarLine) {
                if (t.barSize) {
                    var n = Ut(t.barSize, e);
                    r.setAttribute("linethickness", n + "em")
                }
            } else r.setAttribute("linethickness", "0px");
            if (null != t.leftDelim || null != t.rightDelim) {
                var i = [];
                if (null != t.leftDelim) {
                    var a = new Ae.MathNode("mo", [new Ae.TextNode(t.leftDelim)]);
                    a.setAttribute("fence", "true"), i.push(a)
                }
                if (i.push(r), null != t.rightDelim) {
                    var o = new Ae.MathNode("mo", [new Ae.TextNode(t.rightDelim)]);
                    o.setAttribute("fence", "true"), i.push(o)
                }
                return Te(i)
            }
            return r
        };
        c({
            type: "genfrac",
            names: ["\\cfrac", "\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom", "\\\\atopfrac", "\\\\bracefrac", "\\\\brackfrac"],
            props: {numArgs: 2, greediness: 2},
            handler: function (t, e) {
                var r, n = t.parser, i = t.funcName, a = e[0], o = e[1], s = null, l = null, h = "auto";
                switch (i) {
                    case"\\cfrac":
                    case"\\dfrac":
                    case"\\frac":
                    case"\\tfrac":
                        r = !0;
                        break;
                    case"\\\\atopfrac":
                        r = !1;
                        break;
                    case"\\dbinom":
                    case"\\binom":
                    case"\\tbinom":
                        r = !1, s = "(", l = ")";
                        break;
                    case"\\\\bracefrac":
                        r = !1, s = "\\{", l = "\\}";
                        break;
                    case"\\\\brackfrac":
                        r = !1, s = "[", l = "]";
                        break;
                    default:
                        throw new Error("Unrecognized genfrac command")
                }
                switch (i) {
                    case"\\cfrac":
                    case"\\dfrac":
                    case"\\dbinom":
                        h = "display";
                        break;
                    case"\\tfrac":
                    case"\\tbinom":
                        h = "text"
                }
                return {
                    type: "genfrac",
                    mode: n.mode,
                    continued: "\\cfrac" === i,
                    numer: a,
                    denom: o,
                    hasBarLine: r,
                    leftDelim: s,
                    rightDelim: l,
                    size: h,
                    barSize: null
                }
            },
            htmlBuilder: Tr,
            mathmlBuilder: Cr
        }), c({
            type: "infix",
            names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
            props: {numArgs: 0, infix: !0},
            handler: function (t) {
                var e, r = t.parser, n = t.funcName, i = t.token;
                switch (n) {
                    case"\\over":
                        e = "\\frac";
                        break;
                    case"\\choose":
                        e = "\\binom";
                        break;
                    case"\\atop":
                        e = "\\\\atopfrac";
                        break;
                    case"\\brace":
                        e = "\\\\bracefrac";
                        break;
                    case"\\brack":
                        e = "\\\\brackfrac";
                        break;
                    default:
                        throw new Error("Unrecognized infix genfrac command")
                }
                return {type: "infix", mode: r.mode, replaceWith: e, token: i}
            }
        });
        var Br = ["display", "text", "script", "scriptscript"], Nr = function (t) {
            var e = null;
            return t.length > 0 && (e = "." === (e = t) ? null : e), e
        };
        c({
            type: "genfrac",
            names: ["\\genfrac"],
            props: {numArgs: 6, greediness: 6, argTypes: ["math", "math", "size", "text", "math", "math"]},
            handler: function (t, e) {
                var r = t.parser, n = e[4], i = e[5], a = s(e[0], "atom");
                a && (a = l(e[0], "open"));
                var h = a ? Nr(a.text) : null, c = s(e[1], "atom");
                c && (c = l(e[1], "close"));
                var m, u = c ? Nr(c.text) : null, d = o(e[2], "size"), p = null;
                m = !!d.isBlank || (p = d.value).number > 0;
                var f = "auto", g = s(e[3], "ordgroup");
                if (g) {
                    if (g.body.length > 0) {
                        var v = o(g.body[0], "textord");
                        f = Br[Number(v.text)]
                    }
                } else g = o(e[3], "textord"), f = Br[Number(g.text)];
                return {
                    type: "genfrac",
                    mode: r.mode,
                    numer: n,
                    denom: i,
                    continued: !1,
                    hasBarLine: m,
                    barSize: p,
                    leftDelim: h,
                    rightDelim: u,
                    size: f
                }
            },
            htmlBuilder: Tr,
            mathmlBuilder: Cr
        }), c({
            type: "infix",
            names: ["\\above"],
            props: {numArgs: 1, argTypes: ["size"], infix: !0},
            handler: function (t, e) {
                var r = t.parser, n = (t.funcName, t.token);
                return {
                    type: "infix",
                    mode: r.mode,
                    replaceWith: "\\\\abovefrac",
                    size: o(e[0], "size").value,
                    token: n
                }
            }
        }), c({
            type: "genfrac",
            names: ["\\\\abovefrac"],
            props: {numArgs: 3, argTypes: ["math", "size", "math"]},
            handler: function (t, e) {
                var r = t.parser, n = (t.funcName, e[0]), i = function (t) {
                    if (!t) throw new Error("Expected non-null, but got " + String(t));
                    return t
                }(o(e[1], "infix").size), a = e[2], s = i.number > 0;
                return {
                    type: "genfrac",
                    mode: r.mode,
                    numer: n,
                    denom: a,
                    continued: !1,
                    hasBarLine: s,
                    barSize: i,
                    leftDelim: null,
                    rightDelim: null,
                    size: "auto"
                }
            },
            htmlBuilder: Tr,
            mathmlBuilder: Cr
        });
        var Lr = function (t, e) {
            var r, n, i = e.style, a = s(t, "supsub");
            a ? (r = a.sup ? ke(a.sup, e.havingStyle(i.sup()), e) : ke(a.sub, e.havingStyle(i.sub()), e), n = o(a.base, "horizBrace")) : n = o(t, "horizBrace");
            var l, h = ke(n.base, e.havingBaseStyle(V.DISPLAY)), c = De(n, e);
            if (n.isOver ? (l = re.makeVList({
                positionType: "firstBaseline",
                children: [{type: "elem", elem: h}, {type: "kern", size: .1}, {type: "elem", elem: c}]
            }, e)).children[0].children[0].children[1].classes.push("svg-align") : (l = re.makeVList({
                positionType: "bottom",
                positionData: h.depth + .1 + c.height,
                children: [{type: "elem", elem: c}, {type: "kern", size: .1}, {type: "elem", elem: h}]
            }, e)).children[0].children[0].children[0].classes.push("svg-align"), r) {
                var m = re.makeSpan(["mord", n.isOver ? "mover" : "munder"], [l], e);
                l = n.isOver ? re.makeVList({
                    positionType: "firstBaseline",
                    children: [{type: "elem", elem: m}, {type: "kern", size: .2}, {type: "elem", elem: r}]
                }, e) : re.makeVList({
                    positionType: "bottom",
                    positionData: m.depth + .2 + r.height + r.depth,
                    children: [{type: "elem", elem: r}, {type: "kern", size: .2}, {type: "elem", elem: m}]
                }, e)
            }
            return re.makeSpan(["mord", n.isOver ? "mover" : "munder"], [l], e)
        };
        c({
            type: "horizBrace", names: ["\\overbrace", "\\underbrace"], props: {numArgs: 1}, handler: function (t, e) {
                var r = t.parser, n = t.funcName;
                return {type: "horizBrace", mode: r.mode, label: n, isOver: /^\\over/.test(n), base: e[0]}
            }, htmlBuilder: Lr, mathmlBuilder: function (t, e) {
                var r = Fe(t.label);
                return new Ae.MathNode(t.isOver ? "mover" : "munder", [Le(t.base, e), r])
            }
        }), c({
            type: "href",
            names: ["\\href"],
            props: {numArgs: 2, argTypes: ["url", "original"], allowedInText: !0},
            handler: function (t, e) {
                var r = t.parser, n = e[1], i = o(e[0], "url").url;
                return {type: "href", mode: r.mode, href: i, body: me(n)}
            },
            htmlBuilder: function (t, e) {
                var r = ve(t.body, e, !1);
                return re.makeAnchor(t.href, [], r, e)
            },
            mathmlBuilder: function (t, e) {
                var r = Ne(t.body, e);
                return r instanceof Se || (r = new Se("mrow", [r])), r.setAttribute("href", t.href), r
            }
        }), c({
            type: "href",
            names: ["\\url"],
            props: {numArgs: 1, argTypes: ["url"], allowedInText: !0},
            handler: function (t, e) {
                for (var r = t.parser, n = o(e[0], "url").url, i = [], a = 0; a < n.length; a++) {
                    var s = n[a];
                    "~" === s && (s = "\\textasciitilde"), i.push({type: "textord", mode: "text", text: s})
                }
                var l = {type: "text", mode: r.mode, font: "\\texttt", body: i};
                return {type: "href", mode: r.mode, href: n, body: me(l)}
            }
        }), c({
            type: "htmlmathml",
            names: ["\\html@mathml"],
            props: {numArgs: 2, allowedInText: !0},
            handler: function (t, e) {
                return {type: "htmlmathml", mode: t.parser.mode, html: me(e[0]), mathml: me(e[1])}
            },
            htmlBuilder: function (t, e) {
                var r = ve(t.html, e, !1);
                return re.makeFragment(r)
            },
            mathmlBuilder: function (t, e) {
                return Ne(t.mathml, e)
            }
        }), c({
            type: "kern",
            names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
            props: {numArgs: 1, argTypes: ["size"], allowedInText: !0},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = o(e[0], "size");
                if (r.settings.strict) {
                    var a = "m" === n[1], s = "mu" === i.value.unit;
                    a ? (s || r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " supports only mu units, not " + i.value.unit + " units"), "math" !== r.mode && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " works only in math mode")) : s && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " doesn't support mu units")
                }
                return {type: "kern", mode: r.mode, dimension: i.value}
            },
            htmlBuilder: function (t, e) {
                return re.makeGlue(t.dimension, e)
            },
            mathmlBuilder: function (t, e) {
                var r = Ut(t.dimension, e);
                return new Ae.SpaceNode(r)
            }
        }), c({
            type: "lap",
            names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
            props: {numArgs: 1, allowedInText: !0},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                return {type: "lap", mode: r.mode, alignment: n.slice(5), body: i}
            },
            htmlBuilder: function (t, e) {
                var r;
                "clap" === t.alignment ? (r = re.makeSpan([], [ke(t.body, e)]), r = re.makeSpan(["inner"], [r], e)) : r = re.makeSpan(["inner"], [ke(t.body, e)]);
                var n = re.makeSpan(["fix"], []), i = re.makeSpan([t.alignment], [r, n], e), a = re.makeSpan(["strut"]);
                return a.style.height = i.height + i.depth + "em", a.style.verticalAlign = -i.depth + "em", i.children.unshift(a), i = re.makeVList({
                    positionType: "firstBaseline",
                    children: [{type: "elem", elem: i}]
                }, e), re.makeSpan(["mord"], [i], e)
            },
            mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mpadded", [Le(t.body, e)]);
                if ("rlap" !== t.alignment) {
                    var n = "llap" === t.alignment ? "-1" : "-0.5";
                    r.setAttribute("lspace", n + "width")
                }
                return r.setAttribute("width", "0px"), r
            }
        }), c({
            type: "styling",
            names: ["\\(", "$"],
            props: {numArgs: 0, allowedInText: !0, allowedInMath: !1, consumeMode: "math"},
            handler: function (t) {
                var e = t.funcName, r = t.parser, n = r.mode;
                r.switchMode("math");
                var i = "\\(" === e ? "\\)" : "$", a = r.parseExpression(!1, i);
                return r.expect(i, !1), r.switchMode(n), r.consume(), {
                    type: "styling",
                    mode: r.mode,
                    style: "text",
                    body: a
                }
            }
        }), c({
            type: "text",
            names: ["\\)", "\\]"],
            props: {numArgs: 0, allowedInText: !0, allowedInMath: !1},
            handler: function (t) {
                throw new C("Mismatched " + t.funcName)
            }
        });
        var Er = function (t, e) {
            switch (e.style.size) {
                case V.DISPLAY.size:
                    return t.display;
                case V.TEXT.size:
                    return t.text;
                case V.SCRIPT.size:
                    return t.script;
                case V.SCRIPTSCRIPT.size:
                    return t.scriptscript;
                default:
                    return t.text
            }
        };
        c({
            type: "mathchoice", names: ["\\mathchoice"], props: {
                numArgs: 4
            }, handler: function (t, e) {
                return {
                    type: "mathchoice",
                    mode: t.parser.mode,
                    display: me(e[0]),
                    text: me(e[1]),
                    script: me(e[2]),
                    scriptscript: me(e[3])
                }
            }, htmlBuilder: function (t, e) {
                var r = Er(t, e), n = ve(r, e, !1);
                return re.makeFragment(n)
            }, mathmlBuilder: function (t, e) {
                var r = Er(t, e);
                return Ne(r, e)
            }
        });
        var Or = function (t, e) {
            var r, n, i, a = !1, l = s(t, "supsub");
            l ? (r = l.sup, n = l.sub, i = o(l.base, "op"), a = !0) : i = o(t, "op");
            var h, c = e.style, m = !1;
            if (c.size === V.DISPLAY.size && i.symbol && !O.contains(["\\smallint"], i.name) && (m = !0), i.symbol) {
                var u = m ? "Size2-Regular" : "Size1-Regular", d = "";
                if ("\\oiint" !== i.name && "\\oiiint" !== i.name || (d = i.name.substr(1), i.name = "oiint" === d ? "\\iint" : "\\iiint"), h = re.makeSymbol(i.name, u, "math", e, ["mop", "op-symbol", m ? "large-op" : "small-op"]), d.length > 0) {
                    var p = h.italic, f = re.staticSvg(d + "Size" + (m ? "2" : "1"), e);
                    h = re.makeVList({
                        positionType: "individualShift",
                        children: [{type: "elem", elem: h, shift: 0}, {type: "elem", elem: f, shift: m ? .08 : 0}]
                    }, e), i.name = "\\" + d, h.classes.unshift("mop"), h.italic = p
                }
            } else if (i.body) {
                var g = ve(i.body, e, !0);
                1 === g.length && g[0] instanceof et ? (h = g[0]).classes[0] = "mop" : h = re.makeSpan(["mop"], re.tryCombineChars(g), e)
            } else {
                for (var v = [], x = 1; x < i.name.length; x++) v.push(re.mathsym(i.name[x], i.mode));
                h = re.makeSpan(["mop"], v, e)
            }
            var y = 0, b = 0;
            if ((h instanceof et || "\\oiint" === i.name || "\\oiiint" === i.name) && !i.suppressBaseShift && (y = (h.height - h.depth) / 2 - e.fontMetrics().axisHeight, b = h.italic), a) {
                var w, k, S;
                if (h = re.makeSpan([], [h]), r) {
                    var M = ke(r, e.havingStyle(c.sup()), e);
                    k = {
                        elem: M,
                        kern: Math.max(e.fontMetrics().bigOpSpacing1, e.fontMetrics().bigOpSpacing3 - M.depth)
                    }
                }
                if (n) {
                    var A = ke(n, e.havingStyle(c.sub()), e);
                    w = {
                        elem: A,
                        kern: Math.max(e.fontMetrics().bigOpSpacing2, e.fontMetrics().bigOpSpacing4 - A.height)
                    }
                }
                if (k && w) {
                    var z = e.fontMetrics().bigOpSpacing5 + w.elem.height + w.elem.depth + w.kern + h.depth + y;
                    S = re.makeVList({
                        positionType: "bottom",
                        positionData: z,
                        children: [{type: "kern", size: e.fontMetrics().bigOpSpacing5}, {
                            type: "elem",
                            elem: w.elem,
                            marginLeft: -b + "em"
                        }, {type: "kern", size: w.kern}, {type: "elem", elem: h}, {
                            type: "kern",
                            size: k.kern
                        }, {type: "elem", elem: k.elem, marginLeft: b + "em"}, {
                            type: "kern",
                            size: e.fontMetrics().bigOpSpacing5
                        }]
                    }, e)
                } else if (w) {
                    var T = h.height - y;
                    S = re.makeVList({
                        positionType: "top",
                        positionData: T,
                        children: [{type: "kern", size: e.fontMetrics().bigOpSpacing5}, {
                            type: "elem",
                            elem: w.elem,
                            marginLeft: -b + "em"
                        }, {type: "kern", size: w.kern}, {type: "elem", elem: h}]
                    }, e)
                } else {
                    if (!k) return h;
                    var C = h.depth + y;
                    S = re.makeVList({
                        positionType: "bottom",
                        positionData: C,
                        children: [{type: "elem", elem: h}, {type: "kern", size: k.kern}, {
                            type: "elem",
                            elem: k.elem,
                            marginLeft: b + "em"
                        }, {type: "kern", size: e.fontMetrics().bigOpSpacing5}]
                    }, e)
                }
                return re.makeSpan(["mop", "op-limits"], [S], e)
            }
            return y && (h.style.position = "relative", h.style.top = y + "em"), h
        }, Ir = function (t, e) {
            var r;
            if (t.symbol) r = new Se("mo", [ze(t.name, t.mode)]); else {
                if (!t.body) return p([r = new Se("mi", [new Me(t.name.slice(1))]), new Se("mo", [ze("\u2061", "text")])]);
                r = new Se("mo", Be(t.body, e))
            }
            return r
        }, qr = {
            "\u220f": "\\prod",
            "\u2210": "\\coprod",
            "\u2211": "\\sum",
            "\u22c0": "\\bigwedge",
            "\u22c1": "\\bigvee",
            "\u22c2": "\\bigcap",
            "\u22c3": "\\bigcup",
            "\u2a00": "\\bigodot",
            "\u2a01": "\\bigoplus",
            "\u2a02": "\\bigotimes",
            "\u2a04": "\\biguplus",
            "\u2a06": "\\bigsqcup"
        };
        c({
            type: "op",
            names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "\u220f", "\u2210", "\u2211", "\u22c0", "\u22c1", "\u22c2", "\u22c3", "\u2a00", "\u2a01", "\u2a02", "\u2a04", "\u2a06"],
            props: {numArgs: 0},
            handler: function (t) {
                var e = t.parser, r = t.funcName;
                return 1 === r.length && (r = qr[r]), {type: "op", mode: e.mode, limits: !0, symbol: !0, name: r}
            },
            htmlBuilder: Or,
            mathmlBuilder: Ir
        }), c({
            type: "op", names: ["\\mathop"], props: {numArgs: 1}, handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {type: "op", mode: r.mode, limits: !1, symbol: !1, body: me(n)}
            }, htmlBuilder: Or, mathmlBuilder: Ir
        });
        var _r = {
            "\u222b": "\\int",
            "\u222c": "\\iint",
            "\u222d": "\\iiint",
            "\u222e": "\\oint",
            "\u222f": "\\oiint",
            "\u2230": "\\oiiint"
        };
        c({
            type: "op",
            names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
            props: {numArgs: 0},
            handler: function (t) {
                var e = t.parser, r = t.funcName;
                return {type: "op", mode: e.mode, limits: !1, symbol: !1, name: r}
            },
            htmlBuilder: Or,
            mathmlBuilder: Ir
        }), c({
            type: "op",
            names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
            props: {numArgs: 0},
            handler: function (t) {
                var e = t.parser, r = t.funcName;
                return {type: "op", mode: e.mode, limits: !0, symbol: !1, name: r}
            },
            htmlBuilder: Or,
            mathmlBuilder: Ir
        }), c({
            type: "op",
            names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "\u222b", "\u222c", "\u222d", "\u222e", "\u222f", "\u2230"],
            props: {numArgs: 0},
            handler: function (t) {
                var e = t.parser, r = t.funcName;
                return 1 === r.length && (r = _r[r]), {type: "op", mode: e.mode, limits: !1, symbol: !0, name: r}
            },
            htmlBuilder: Or,
            mathmlBuilder: Ir
        }), c({
            type: "operatorname", names: ["\\operatorname"], props: {numArgs: 1}, handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {type: "operatorname", mode: r.mode, body: me(n)}
            }, htmlBuilder: function (t, e) {
                if (t.body.length > 0) {
                    for (var r = t.body.map(function (t) {
                        var e = t.text;
                        return "string" == typeof e ? {type: "textord", mode: t.mode, text: e} : t
                    }), n = ve(r, e.withFont("mathrm"), !0), i = 0; i < n.length; i++) {
                        var a = n[i];
                        a instanceof et && (a.text = a.text.replace(/\u2212/, "-").replace(/\u2217/, "*"))
                    }
                    return re.makeSpan(["mop"], n, e)
                }
                return re.makeSpan(["mop"], [], e)
            }, mathmlBuilder: function (t, e) {
                for (var r = Be(t.body, e.withFont("mathrm")), n = !0, i = 0; i < r.length; i++) {
                    var a = r[i];
                    if (a instanceof Ae.SpaceNode) ; else if (a instanceof Ae.MathNode) switch (a.type) {
                        case"mi":
                        case"mn":
                        case"ms":
                        case"mspace":
                        case"mtext":
                            break;
                        case"mo":
                            var o = a.children[0];
                            1 === a.children.length && o instanceof Ae.TextNode ? o.text = o.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : n = !1;
                            break;
                        default:
                            n = !1
                    } else n = !1
                }
                if (n) {
                    var s = r.map(function (t) {
                        return t.toText()
                    }).join("");
                    r = [new Ae.TextNode(s)]
                }
                var l = new Ae.MathNode("mi", r);
                l.setAttribute("mathvariant", "normal");
                var h = new Ae.MathNode("mo", [ze("\u2061", "text")]);
                return Ae.newDocumentFragment([l, h])
            }
        }), m({
            type: "ordgroup", htmlBuilder: function (t, e) {
                return t.semisimple ? re.makeFragment(ve(t.body, e, !1)) : re.makeSpan(["mord"], ve(t.body, e, !0), e)
            }, mathmlBuilder: function (t, e) {
                return Ne(t.body, e)
            }
        }), c({
            type: "overline", names: ["\\overline"], props: {numArgs: 1}, handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {type: "overline", mode: r.mode, body: n}
            }, htmlBuilder: function (t, e) {
                var r = ke(t.body, e.havingCrampedStyle()), n = re.makeLineSpan("overline-line", e), i = re.makeVList({
                    positionType: "firstBaseline",
                    children: [{type: "elem", elem: r}, {type: "kern", size: 3 * n.height}, {
                        type: "elem",
                        elem: n
                    }, {type: "kern", size: n.height}]
                }, e);
                return re.makeSpan(["mord", "overline"], [i], e)
            }, mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mo", [new Ae.TextNode("\u203e")]);
                r.setAttribute("stretchy", "true");
                var n = new Ae.MathNode("mover", [Le(t.body, e), r]);
                return n.setAttribute("accent", "true"), n
            }
        }), c({
            type: "phantom", names: ["\\phantom"], props: {numArgs: 1, allowedInText: !0}, handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {type: "phantom", mode: r.mode, body: me(n)}
            }, htmlBuilder: function (t, e) {
                var r = ve(t.body, e.withPhantom(), !1);
                return re.makeFragment(r)
            }, mathmlBuilder: function (t, e) {
                var r = Be(t.body, e);
                return new Ae.MathNode("mphantom", r)
            }
        }), c({
            type: "hphantom",
            names: ["\\hphantom"],
            props: {numArgs: 1, allowedInText: !0},
            handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {type: "hphantom", mode: r.mode, body: n}
            },
            htmlBuilder: function (t, e) {
                var r = re.makeSpan([], [ke(t.body, e.withPhantom())]);
                if (r.height = 0, r.depth = 0, r.children) for (var n = 0; n < r.children.length; n++) r.children[n].height = 0, r.children[n].depth = 0;
                return r = re.makeVList({
                    positionType: "firstBaseline",
                    children: [{type: "elem", elem: r}]
                }, e), re.makeSpan(["mord"], [r], e)
            },
            mathmlBuilder: function (t, e) {
                var r = Be(me(t.body), e), n = new Ae.MathNode("mphantom", r);
                return n.setAttribute("height", "0px"), n
            }
        }), c({
            type: "vphantom",
            names: ["\\vphantom"],
            props: {numArgs: 1, allowedInText: !0},
            handler: function (t, e) {
                var r = t.parser, n = e[0];
                return {type: "vphantom", mode: r.mode, body: n}
            },
            htmlBuilder: function (t, e) {
                var r = re.makeSpan(["inner"], [ke(t.body, e.withPhantom())]), n = re.makeSpan(["fix"], []);
                return re.makeSpan(["mord", "rlap"], [r, n], e)
            },
            mathmlBuilder: function (t, e) {
                var r = Be(me(t.body), e), n = new Ae.MathNode("mphantom", r);
                return n.setAttribute("width", "0px"), n
            }
        });
        var Pr = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
            Rr = function (t, e) {
                var r = e.havingSize(t.size);
                return S(t.body, r, e)
            };
        c({
            type: "sizing", names: Pr, props: {numArgs: 0, allowedInText: !0}, handler: function (t) {
                var e = t.breakOnTokenText, r = t.funcName, n = t.parser, i = n.parseExpression(!1, e);
                return {type: "sizing", mode: n.mode, size: Pr.indexOf(r) + 1, body: i}
            }, htmlBuilder: Rr, mathmlBuilder: function (t, e) {
                var r = e.havingSize(t.size), n = Be(t.body, r), i = new Ae.MathNode("mstyle", n);
                return i.setAttribute("mathsize", r.sizeMultiplier + "em"), i
            }
        }), c({
            type: "raisebox",
            names: ["\\raisebox"],
            props: {numArgs: 2, argTypes: ["size", "text"], allowedInText: !0},
            handler: function (t, e) {
                var r = t.parser, n = o(e[0], "size").value, i = e[1];
                return {type: "raisebox", mode: r.mode, dy: n, body: i}
            },
            htmlBuilder: function (t, e) {
                var r = {type: "text", mode: t.mode, body: me(t.body), font: "mathrm"},
                    n = {type: "sizing", mode: t.mode, body: [r], size: 6}, i = Rr(n, e), a = Ut(t.dy, e);
                return re.makeVList({positionType: "shift", positionData: -a, children: [{type: "elem", elem: i}]}, e)
            },
            mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mpadded", [Le(t.body, e)]), n = t.dy.number + t.dy.unit;
                return r.setAttribute("voffset", n), r
            }
        }), c({
            type: "rule",
            names: ["\\rule"],
            props: {numArgs: 2, numOptionalArgs: 1, argTypes: ["size", "size", "size"]},
            handler: function (t, e, r) {
                var n = t.parser, i = r[0], a = o(e[0], "size"), s = o(e[1], "size");
                return {type: "rule", mode: n.mode, shift: i && o(i, "size").value, width: a.value, height: s.value}
            },
            htmlBuilder: function (t, e) {
                var r = re.makeSpan(["mord", "rule"], [], e), n = 0;
                t.shift && (n = Ut(t.shift, e));
                var i = Ut(t.width, e), a = Ut(t.height, e);
                return r.style.borderRightWidth = i + "em", r.style.borderTopWidth = a + "em", r.style.bottom = n + "em", r.width = i, r.height = a + n, r.depth = -n, r.maxFontSize = 1.125 * a * e.sizeMultiplier, r
            },
            mathmlBuilder: function () {
                return new Ae.MathNode("mrow")
            }
        }), c({
            type: "smash",
            names: ["\\smash"],
            props: {numArgs: 1, numOptionalArgs: 1, allowedInText: !0},
            handler: function (t, e, r) {
                var n = t.parser, i = !1, a = !1, s = r[0] && o(r[0], "ordgroup");
                if (s) for (var l = "", h = 0; h < s.body.length; ++h) if ("t" === (l = s.body[h].text)) i = !0; else {
                    if ("b" !== l) {
                        i = !1, a = !1;
                        break
                    }
                    a = !0
                } else i = !0, a = !0;
                var c = e[0];
                return {type: "smash", mode: n.mode, body: c, smashHeight: i, smashDepth: a}
            },
            htmlBuilder: function (t, e) {
                var r = re.makeSpan([], [ke(t.body, e)]);
                if (!t.smashHeight && !t.smashDepth) return r;
                if (t.smashHeight && (r.height = 0, r.children)) for (var n = 0; n < r.children.length; n++) r.children[n].height = 0;
                if (t.smashDepth && (r.depth = 0, r.children)) for (var i = 0; i < r.children.length; i++) r.children[i].depth = 0;
                var a = re.makeVList({positionType: "firstBaseline", children: [{type: "elem", elem: r}]}, e);
                return re.makeSpan(["mord"], [a], e)
            },
            mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mpadded", [Le(t.body, e)]);
                return t.smashHeight && r.setAttribute("height", "0px"), t.smashDepth && r.setAttribute("depth", "0px"), r
            }
        }), c({
            type: "sqrt", names: ["\\sqrt"], props: {numArgs: 1, numOptionalArgs: 1}, handler: function (t, e, r) {
                var n = t.parser, i = r[0], a = e[0];
                return {type: "sqrt", mode: n.mode, body: a, index: i}
            }, htmlBuilder: function (t, e) {
                var r = ke(t.body, e.havingCrampedStyle());
                0 === r.height && (r.height = e.fontMetrics().xHeight), r = re.wrapFragment(r, e);
                var n = e.fontMetrics().defaultRuleThickness, i = n;
                e.style.id < V.TEXT.id && (i = e.fontMetrics().xHeight);
                var a = n + i / 4, o = r.height + r.depth + a + n, s = hr(o, e), l = s.span, h = s.ruleWidth,
                    c = s.advanceWidth, m = l.height - h;
                m > r.height + r.depth + a && (a = (a + m - r.height - r.depth) / 2);
                var u = l.height - r.height - a - h;
                r.style.paddingLeft = c + "em";
                var d = re.makeVList({
                    positionType: "firstBaseline",
                    children: [{type: "elem", elem: r, wrapperClasses: ["svg-align"]}, {
                        type: "kern",
                        size: -(r.height + u)
                    }, {type: "elem", elem: l}, {type: "kern", size: h}]
                }, e);
                if (t.index) {
                    var p = e.havingStyle(V.SCRIPTSCRIPT), f = ke(t.index, p, e), g = .6 * (d.height - d.depth),
                        v = re.makeVList({
                            positionType: "shift",
                            positionData: -g,
                            children: [{type: "elem", elem: f}]
                        }, e), x = re.makeSpan(["root"], [v]);
                    return re.makeSpan(["mord", "sqrt"], [x, d], e)
                }
                return re.makeSpan(["mord", "sqrt"], [d], e)
            }, mathmlBuilder: function (t, e) {
                var r = t.body, n = t.index;
                return n ? new Ae.MathNode("mroot", [Le(r, e), Le(n, e)]) : new Ae.MathNode("msqrt", [Le(r, e)])
            }
        });
        var Fr = {display: V.DISPLAY, text: V.TEXT, script: V.SCRIPT, scriptscript: V.SCRIPTSCRIPT};
        c({
            type: "styling",
            names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
            props: {numArgs: 0, allowedInText: !0},
            handler: function (t) {
                var e = t.breakOnTokenText, r = t.funcName, n = t.parser, i = n.parseExpression(!0, e),
                    a = r.slice(1, r.length - 5);
                return {type: "styling", mode: n.mode, style: a, body: i}
            },
            htmlBuilder: function (t, e) {
                var r = Fr[t.style], n = e.havingStyle(r).withFont("");
                return S(t.body, n, e)
            },
            mathmlBuilder: function (t, e) {
                var r = {display: V.DISPLAY, text: V.TEXT, script: V.SCRIPT, scriptscript: V.SCRIPTSCRIPT}[t.style],
                    n = e.havingStyle(r), i = Be(t.body, n), a = new Ae.MathNode("mstyle", i), o = {
                        display: ["0", "true"],
                        text: ["0", "false"],
                        script: ["1", "false"],
                        scriptscript: ["2", "false"]
                    }[t.style];
                return a.setAttribute("scriptlevel", o[0]), a.setAttribute("displaystyle", o[1]), a
            }
        }), m({
            type: "supsub", htmlBuilder: function (t, e) {
                var r = function (t, e) {
                    var r = t.base;
                    return r ? "op" === r.type ? r.limits && (e.style.size === V.DISPLAY.size || r.alwaysHandleSupSub) ? Or : null : "accent" === r.type ? O.isCharacterBox(r.base) ? He : null : "horizBrace" === r.type && !t.sub === r.isOver ? Lr : null : null
                }(t, e);
                if (r) return r(t, e);
                var n, i, a, o = t.base, s = t.sup, l = t.sub, h = ke(o, e), c = e.fontMetrics(), m = 0, u = 0,
                    d = o && O.isCharacterBox(o);
                if (s) {
                    var p = e.havingStyle(e.style.sup());
                    n = ke(s, p, e), d || (m = h.height - p.fontMetrics().supDrop * p.sizeMultiplier / e.sizeMultiplier)
                }
                if (l) {
                    var f = e.havingStyle(e.style.sub());
                    i = ke(l, f, e), d || (u = h.depth + f.fontMetrics().subDrop * f.sizeMultiplier / e.sizeMultiplier)
                }
                a = e.style === V.DISPLAY ? c.sup1 : e.style.cramped ? c.sup3 : c.sup2;
                var g, v = e.sizeMultiplier, x = .5 / c.ptPerEm / v + "em", y = null;
                if (i) {
                    var b = t.base && "op" === t.base.type && t.base.name && ("\\oiint" === t.base.name || "\\oiiint" === t.base.name);
                    (h instanceof et || b) && (y = -h.italic + "em")
                }
                if (n && i) {
                    m = Math.max(m, a, n.depth + .25 * c.xHeight), u = Math.max(u, c.sub2);
                    var w = 4 * c.defaultRuleThickness;
                    if (m - n.depth - (i.height - u) < w) {
                        u = w - (m - n.depth) + i.height;
                        var k = .8 * c.xHeight - (m - n.depth);
                        k > 0 && (m += k, u -= k)
                    }
                    var S = [{type: "elem", elem: i, shift: u, marginRight: x, marginLeft: y}, {
                        type: "elem",
                        elem: n,
                        shift: -m,
                        marginRight: x
                    }];
                    g = re.makeVList({positionType: "individualShift", children: S}, e)
                } else if (i) {
                    u = Math.max(u, c.sub1, i.height - .8 * c.xHeight);
                    var M = [{type: "elem", elem: i, marginLeft: y, marginRight: x}];
                    g = re.makeVList({positionType: "shift", positionData: u, children: M}, e)
                } else {
                    if (!n) throw new Error("supsub must have either sup or sub.");
                    m = Math.max(m, a, n.depth + .25 * c.xHeight), g = re.makeVList({
                        positionType: "shift",
                        positionData: -m,
                        children: [{type: "elem", elem: n, marginRight: x}]
                    }, e)
                }
                var A = be(h, "right") || "mord";
                return re.makeSpan([A], [h, re.makeSpan(["msupsub"], [g])], e)
            }, mathmlBuilder: function (t, e) {
                var r, n = !1, i = s(t.base, "horizBrace");
                i && !!t.sup === i.isOver && (n = !0, r = i.isOver);
                var a, o = [Le(t.base, e)];
                if (t.sub && o.push(Le(t.sub, e)), t.sup && o.push(Le(t.sup, e)), n) a = r ? "mover" : "munder"; else if (t.sub) if (t.sup) {
                    var l = t.base;
                    a = l && "op" === l.type && l.limits && e.style === V.DISPLAY ? "munderover" : "msubsup"
                } else {
                    var h = t.base;
                    a = h && "op" === h.type && h.limits && e.style === V.DISPLAY ? "munder" : "msub"
                } else {
                    var c = t.base;
                    a = c && "op" === c.type && c.limits && e.style === V.DISPLAY ? "mover" : "msup"
                }
                return new Ae.MathNode(a, o)
            }
        }), m({
            type: "atom", htmlBuilder: function (t, e) {
                return re.mathsym(t.text, t.mode, e, ["m" + t.family])
            }, mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mo", [ze(t.text, t.mode)]);
                if ("bin" === t.family) {
                    var n = Ce(t, e);
                    "bold-italic" === n && r.setAttribute("mathvariant", n)
                } else "punct" === t.family && r.setAttribute("separator", "true");
                return r
            }
        });
        var Dr = {mi: "italic", mn: "normal", mtext: "normal"};
        m({
            type: "mathord", htmlBuilder: function (t, e) {
                return re.makeOrd(t, e, "mathord")
            }, mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mi", [ze(t.text, t.mode, e)]), n = Ce(t, e) || "italic";
                return n !== Dr[r.type] && r.setAttribute("mathvariant", n), r
            }
        }), m({
            type: "textord", htmlBuilder: function (t, e) {
                return re.makeOrd(t, e, "textord")
            }, mathmlBuilder: function (t, e) {
                var r, n = ze(t.text, t.mode, e), i = Ce(t, e) || "normal";
                return r = "text" === t.mode ? new Ae.MathNode("mtext", [n]) : /[0-9]/.test(t.text) ? new Ae.MathNode("mn", [n]) : "\\prime" === t.text ? new Ae.MathNode("mo", [n]) : new Ae.MathNode("mi", [n]), i !== Dr[r.type] && r.setAttribute("mathvariant", i), r
            }
        });
        var Hr = {"\\nobreak": "nobreak", "\\allowbreak": "allowbreak"}, jr = {
            " ": {},
            "\\ ": {},
            "~": {className: "nobreak"},
            "\\space": {},
            "\\nobreakspace": {className: "nobreak"}
        };
        m({
            type: "spacing", htmlBuilder: function (t, e) {
                if (jr.hasOwnProperty(t.text)) {
                    var r = jr[t.text].className || "";
                    if ("text" === t.mode) {
                        var n = re.makeOrd(t, e, "textord");
                        return n.classes.push(r), n
                    }
                    return re.makeSpan(["mspace", r], [re.mathsym(t.text, t.mode, e)], e)
                }
                if (Hr.hasOwnProperty(t.text)) return re.makeSpan(["mspace", Hr[t.text]], [], e);
                throw new C('Unknown type of space "' + t.text + '"')
            }, mathmlBuilder: function (t) {
                if (!jr.hasOwnProperty(t.text)) {
                    if (Hr.hasOwnProperty(t.text)) return new Ae.MathNode("mspace");
                    throw new C('Unknown type of space "' + t.text + '"')
                }
                return new Ae.MathNode("mtext", [new Ae.TextNode("\xa0")])
            }
        }), m({
            type: "tag", mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mtable", [new Ae.MathNode("mlabeledtr", [new Ae.MathNode("mtd", [Ne(t.tag, e)]), new Ae.MathNode("mtd", [Ne(t.body, e)])])]);
                return r.setAttribute("side", "right"), r
            }
        });
        var Vr = {
            "\\text": void 0,
            "\\textrm": "textrm",
            "\\textsf": "textsf",
            "\\texttt": "texttt",
            "\\textnormal": "textrm"
        }, Ur = {"\\textbf": "textbf"}, Gr = {"\\textit": "textit"}, Wr = function (t, e) {
            var r = t.font;
            return r ? Vr[r] ? e.withTextFontFamily(Vr[r]) : Ur[r] ? e.withTextFontWeight(Ur[r]) : e.withTextFontShape(Gr[r]) : e
        };
        c({
            type: "text",
            names: ["\\text", "\\textrm", "\\textsf", "\\texttt", "\\textnormal", "\\textbf", "\\textit"],
            props: {numArgs: 1, argTypes: ["text"], greediness: 2, allowedInText: !0, consumeMode: "text"},
            handler: function (t, e) {
                var r = t.parser, n = t.funcName, i = e[0];
                return {type: "text", mode: r.mode, body: me(i), font: n}
            },
            htmlBuilder: function (t, e) {
                var r = Wr(t, e), n = ve(t.body, r, !0);
                return re.makeSpan(["mord", "text"], re.tryCombineChars(n), r)
            },
            mathmlBuilder: function (t, e) {
                var r = Wr(t, e);
                return Ne(t.body, r)
            }
        }), c({
            type: "underline",
            names: ["\\underline"],
            props: {numArgs: 1, allowedInText: !0},
            handler: function (t, e) {
                return {type: "underline", mode: t.parser.mode, body: e[0]}
            },
            htmlBuilder: function (t, e) {
                var r = ke(t.body, e), n = re.makeLineSpan("underline-line", e), i = re.makeVList({
                    positionType: "top",
                    positionData: r.height,
                    children: [{type: "kern", size: n.height}, {type: "elem", elem: n}, {
                        type: "kern",
                        size: 3 * n.height
                    }, {type: "elem", elem: r}]
                }, e);
                return re.makeSpan(["mord", "underline"], [i], e)
            },
            mathmlBuilder: function (t, e) {
                var r = new Ae.MathNode("mo", [new Ae.TextNode("\u203e")]);
                r.setAttribute("stretchy", "true");
                var n = new Ae.MathNode("munder", [Le(t.body, e), r]);
                return n.setAttribute("accentunder", "true"), n
            }
        }), c({
            type: "verb", names: ["\\verb"], props: {numArgs: 0, allowedInText: !0}, handler: function () {
                throw new C("\\verb ended by end of line instead of matching delimiter")
            }, htmlBuilder: function (t, e) {
                for (var r = Xr(t), n = [], i = e.havingStyle(e.style.text()), a = 0; a < r.length; a++) {
                    var o = r[a];
                    "~" === o && (o = "\\textasciitilde"), n.push(re.makeSymbol(o, "Typewriter-Regular", t.mode, i, ["mord", "texttt"]))
                }
                return re.makeSpan(["mord", "text"].concat(i.sizingClasses(e)), re.tryCombineChars(n), i)
            }, mathmlBuilder: function (t) {
                var e = new Ae.TextNode(Xr(t)), r = new Ae.MathNode("mtext", [e]);
                return r.setAttribute("mathvariant", "monospace"), r
            }
        });
        var Xr = function (t) {
                return t.body.replace(/ /g, t.star ? "\u2423" : "\xa0")
            }, Yr = le, $r = new RegExp("^(\\\\[a-zA-Z@]+)[ \r\n\t]*$"), Kr = new RegExp("[\u0300-\u036f]+$"),
            Zr = "([ \r\n\t]+)|([!-\\[\\]-\u2027\u202a-\ud7ff\uf900-\uffff][\u0300-\u036f]*|[\ud800-\udbff][\udc00-\udfff][\u0300-\u036f]*|\\\\verb\\*([^]).*?\\3|\\\\verb([^*a-zA-Z]).*?\\4|\\\\[a-zA-Z@]+[ \r\n\t]*|\\\\[^\ud800-\udfff])",
            Jr = function () {
                function t(t, e) {
                    this.input = void 0, this.settings = void 0, this.tokenRegex = void 0, this.catcodes = void 0, this.input = t, this.settings = e, this.tokenRegex = new RegExp(Zr, "g"), this.catcodes = {"%": 14}
                }

                var e = t.prototype;
                return e.setCatcode = function (t, e) {
                    this.catcodes[t] = e
                }, e.lex = function () {
                    var t = this.input, e = this.tokenRegex.lastIndex;
                    if (e === t.length) return new z("EOF", new A(this, e, e));
                    var r = this.tokenRegex.exec(t);
                    if (null === r || r.index !== e) throw new C("Unexpected character: '" + t[e] + "'", new z(t[e], new A(this, e, e + 1)));
                    var n = r[2] || " ";
                    if (14 === this.catcodes[n]) {
                        var i = t.indexOf("\n", this.tokenRegex.lastIndex);
                        return -1 === i ? (this.tokenRegex.lastIndex = t.length, this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")) : this.tokenRegex.lastIndex = i + 1, this.lex()
                    }
                    var a = n.match($r);
                    return a && (n = a[1]), new z(n, new A(this, e, this.tokenRegex.lastIndex))
                }, t
            }(), Qr = function () {
                function t(t, e) {
                    void 0 === t && (t = {}), void 0 === e && (e = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = e, this.builtins = t, this.undefStack = []
                }

                var e = t.prototype;
                return e.beginGroup = function () {
                    this.undefStack.push({})
                }, e.endGroup = function () {
                    if (0 === this.undefStack.length) throw new C("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
                    var t = this.undefStack.pop();
                    for (var e in t) t.hasOwnProperty(e) && (void 0 === t[e] ? delete this.current[e] : this.current[e] = t[e])
                }, e.has = function (t) {
                    return this.current.hasOwnProperty(t) || this.builtins.hasOwnProperty(t)
                }, e.get = function (t) {
                    return this.current.hasOwnProperty(t) ? this.current[t] : this.builtins[t]
                }, e.set = function (t, e, r) {
                    if (void 0 === r && (r = !1), r) {
                        for (var n = 0; n < this.undefStack.length; n++) delete this.undefStack[n][t];
                        this.undefStack.length > 0 && (this.undefStack[this.undefStack.length - 1][t] = e)
                    } else {
                        var i = this.undefStack[this.undefStack.length - 1];
                        i && !i.hasOwnProperty(t) && (i[t] = this.current[t])
                    }
                    this.current[t] = e
                }, t
            }(), tn = {}, en = tn;
        M("\\@firstoftwo", function (t) {
            return {tokens: t.consumeArgs(2)[0], numArgs: 0}
        }), M("\\@secondoftwo", function (t) {
            return {tokens: t.consumeArgs(2)[1], numArgs: 0}
        }), M("\\@ifnextchar", function (t) {
            var e = t.consumeArgs(3), r = t.future();
            return 1 === e[0].length && e[0][0].text === r.text ? {tokens: e[1], numArgs: 0} : {
                tokens: e[2],
                numArgs: 0
            }
        }), M("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}"), M("\\TextOrMath", function (t) {
            var e = t.consumeArgs(2);
            return "text" === t.mode ? {tokens: e[0], numArgs: 0} : {tokens: e[1], numArgs: 0}
        });
        var rn = {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            a: 10,
            A: 10,
            b: 11,
            B: 11,
            c: 12,
            C: 12,
            d: 13,
            D: 13,
            e: 14,
            E: 14,
            f: 15,
            F: 15
        };
        M("\\char", function (t) {
            var e, r = t.popToken(), n = "";
            if ("'" === r.text) e = 8, r = t.popToken(); else if ('"' === r.text) e = 16, r = t.popToken(); else if ("`" === r.text) if ("\\" === (r = t.popToken()).text[0]) n = r.text.charCodeAt(1); else {
                if ("EOF" === r.text) throw new C("\\char` missing argument");
                n = r.text.charCodeAt(0)
            } else e = 10;
            if (e) {
                if (null == (n = rn[r.text]) || n >= e) throw new C("Invalid base-" + e + " digit " + r.text);
                for (var i; null != (i = rn[t.future().text]) && i < e;) n *= e, n += i, t.popToken()
            }
            return "\\@char{" + n + "}"
        });
        var nn = function (t, e) {
            var r = t.consumeArgs(1)[0];
            if (1 !== r.length) throw new C("\\gdef's first argument must be a macro name");
            var n = r[0].text, i = 0;
            for (r = t.consumeArgs(1)[0]; 1 === r.length && "#" === r[0].text;) {
                if (1 !== (r = t.consumeArgs(1)[0]).length) throw new C('Invalid argument number length "' + r.length + '"');
                if (!/^[1-9]$/.test(r[0].text)) throw new C('Invalid argument number "' + r[0].text + '"');
                if (i++, parseInt(r[0].text) !== i) throw new C('Argument number "' + r[0].text + '" out of order');
                r = t.consumeArgs(1)[0]
            }
            return t.macros.set(n, {tokens: r, numArgs: i}, e), ""
        };
        M("\\gdef", function (t) {
            return nn(t, !0)
        }), M("\\def", function (t) {
            return nn(t, !1)
        }), M("\\global", function (t) {
            var e = t.consumeArgs(1)[0];
            if (1 !== e.length) throw new C("Invalid command after \\global");
            var r = e[0].text;
            if ("\\def" === r) return nn(t, !0);
            throw new C("Invalid command '" + r + "' after \\global")
        });
        var an = function (t, e, r) {
            var n = t.consumeArgs(1)[0];
            if (1 !== n.length) throw new C("\\newcommand's first argument must be a macro name");
            var i = n[0].text, a = t.isDefined(i);
            if (a && !e) throw new C("\\newcommand{" + i + "} attempting to redefine " + i + "; use \\renewcommand");
            if (!a && !r) throw new C("\\renewcommand{" + i + "} when command " + i + " does not yet exist; use \\newcommand");
            var o = 0;
            if (1 === (n = t.consumeArgs(1)[0]).length && "[" === n[0].text) {
                for (var s = "", l = t.expandNextToken(); "]" !== l.text && "EOF" !== l.text;) s += l.text, l = t.expandNextToken();
                if (!s.match(/^\s*[0-9]+\s*$/)) throw new C("Invalid number of arguments: " + s);
                o = parseInt(s), n = t.consumeArgs(1)[0]
            }
            return t.macros.set(i, {tokens: n, numArgs: o}), ""
        };
        M("\\newcommand", function (t) {
            return an(t, !1, !0)
        }), M("\\renewcommand", function (t) {
            return an(t, !0, !1)
        }), M("\\providecommand", function (t) {
            return an(t, !0, !0)
        }), M("\\bgroup", "{"), M("\\egroup", "}"), M("\\lq", "`"), M("\\rq", "'"), M("\\aa", "\\r a"), M("\\AA", "\\r A"), M("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`\xa9}"), M("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}"), M("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`\xae}"), M("\u212c", "\\mathscr{B}"), M("\u2130", "\\mathscr{E}"), M("\u2131", "\\mathscr{F}"), M("\u210b", "\\mathscr{H}"), M("\u2110", "\\mathscr{I}"), M("\u2112", "\\mathscr{L}"), M("\u2133", "\\mathscr{M}"), M("\u211b", "\\mathscr{R}"), M("\u212d", "\\mathfrak{C}"), M("\u210c", "\\mathfrak{H}"), M("\u2128", "\\mathfrak{Z}"), M("\xb7", "\\cdotp"), M("\\llap", "\\mathllap{\\textrm{#1}}"), M("\\rlap", "\\mathrlap{\\textrm{#1}}"), M("\\clap", "\\mathclap{\\textrm{#1}}"), M("\\not", "\\mathrel{\\mathrlap\\@not}"), M("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`\u2260}}"), M("\\ne", "\\neq"), M("\u2260", "\\neq"), M("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`\u2209}}"), M("\u2209", "\\notin"), M("\u2258", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`\u2258}}"), M("\u2259", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`\u2258}}"), M("\u225a", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`\u225a}}"), M("\u225b", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`\u225b}}"), M("\u225d", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`\u225d}}"), M("\u225e", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`\u225e}}"), M("\u225f", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`\u225f}}"), M("\u27c2", "\\perp"), M("\u203c", "\\mathclose{!\\mkern-0.8mu!}"), M("\u220c", "\\notni"), M("\u231c", "\\ulcorner"), M("\u231d", "\\urcorner"), M("\u231e", "\\llcorner"), M("\u231f", "\\lrcorner"), M("\xa9", "\\copyright"), M("\xae", "\\textregistered"), M("\ufe0f", "\\textregistered"), M("\\vdots", "\\mathord{\\varvdots\\rule{0pt}{15pt}}"), M("\u22ee", "\\vdots"), M("\\varGamma", "\\mathit{\\Gamma}"), M("\\varDelta", "\\mathit{\\Delta}"), M("\\varTheta", "\\mathit{\\Theta}"), M("\\varLambda", "\\mathit{\\Lambda}"), M("\\varXi", "\\mathit{\\Xi}"), M("\\varPi", "\\mathit{\\Pi}"), M("\\varSigma", "\\mathit{\\Sigma}"), M("\\varUpsilon", "\\mathit{\\Upsilon}"), M("\\varPhi", "\\mathit{\\Phi}"), M("\\varPsi", "\\mathit{\\Psi}"), M("\\varOmega", "\\mathit{\\Omega}"), M("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu"), M("\\boxed", "\\fbox{$\\displaystyle{#1}$}"), M("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;"), M("\\implies", "\\DOTSB\\;\\Longrightarrow\\;"), M("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
        var on = {
            ",": "\\dotsc",
            "\\not": "\\dotsb",
            "+": "\\dotsb",
            "=": "\\dotsb",
            "<": "\\dotsb",
            ">": "\\dotsb",
            "-": "\\dotsb",
            "*": "\\dotsb",
            ":": "\\dotsb",
            "\\DOTSB": "\\dotsb",
            "\\coprod": "\\dotsb",
            "\\bigvee": "\\dotsb",
            "\\bigwedge": "\\dotsb",
            "\\biguplus": "\\dotsb",
            "\\bigcap": "\\dotsb",
            "\\bigcup": "\\dotsb",
            "\\prod": "\\dotsb",
            "\\sum": "\\dotsb",
            "\\bigotimes": "\\dotsb",
            "\\bigoplus": "\\dotsb",
            "\\bigodot": "\\dotsb",
            "\\bigsqcup": "\\dotsb",
            "\\And": "\\dotsb",
            "\\longrightarrow": "\\dotsb",
            "\\Longrightarrow": "\\dotsb",
            "\\longleftarrow": "\\dotsb",
            "\\Longleftarrow": "\\dotsb",
            "\\longleftrightarrow": "\\dotsb",
            "\\Longleftrightarrow": "\\dotsb",
            "\\mapsto": "\\dotsb",
            "\\longmapsto": "\\dotsb",
            "\\hookrightarrow": "\\dotsb",
            "\\doteq": "\\dotsb",
            "\\mathbin": "\\dotsb",
            "\\mathrel": "\\dotsb",
            "\\relbar": "\\dotsb",
            "\\Relbar": "\\dotsb",
            "\\xrightarrow": "\\dotsb",
            "\\xleftarrow": "\\dotsb",
            "\\DOTSI": "\\dotsi",
            "\\int": "\\dotsi",
            "\\oint": "\\dotsi",
            "\\iint": "\\dotsi",
            "\\iiint": "\\dotsi",
            "\\iiiint": "\\dotsi",
            "\\idotsint": "\\dotsi",
            "\\DOTSX": "\\dotsx"
        };
        M("\\dots", function (t) {
            var e = "\\dotso", r = t.expandAfterFuture().text;
            return r in on ? e = on[r] : "\\not" === r.substr(0, 4) ? e = "\\dotsb" : r in ut.math && O.contains(["bin", "rel"], ut.math[r].group) && (e = "\\dotsb"), e
        });
        var sn = {
            ")": !0,
            "]": !0,
            "\\rbrack": !0,
            "\\}": !0,
            "\\rbrace": !0,
            "\\rangle": !0,
            "\\rceil": !0,
            "\\rfloor": !0,
            "\\rgroup": !0,
            "\\rmoustache": !0,
            "\\right": !0,
            "\\bigr": !0,
            "\\biggr": !0,
            "\\Bigr": !0,
            "\\Biggr": !0,
            $: !0,
            ";": !0,
            ".": !0,
            ",": !0
        };
        M("\\dotso", function (t) {
            return t.future().text in sn ? "\\ldots\\," : "\\ldots"
        }), M("\\dotsc", function (t) {
            var e = t.future().text;
            return e in sn && "," !== e ? "\\ldots\\," : "\\ldots"
        }), M("\\cdots", function (t) {
            return t.future().text in sn ? "\\@cdots\\," : "\\@cdots"
        }), M("\\dotsb", "\\cdots"), M("\\dotsm", "\\cdots"), M("\\dotsi", "\\!\\cdots"), M("\\dotsx", "\\ldots\\,"), M("\\DOTSI", "\\relax"), M("\\DOTSB", "\\relax"), M("\\DOTSX", "\\relax"), M("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax"), M("\\,", "\\tmspace+{3mu}{.1667em}"), M("\\thinspace", "\\,"), M("\\>", "\\mskip{4mu}"), M("\\:", "\\tmspace+{4mu}{.2222em}"), M("\\medspace", "\\:"), M("\\;", "\\tmspace+{5mu}{.2777em}"), M("\\thickspace", "\\;"), M("\\!", "\\tmspace-{3mu}{.1667em}"), M("\\negthinspace", "\\!"), M("\\negmedspace", "\\tmspace-{4mu}{.2222em}"), M("\\negthickspace", "\\tmspace-{5mu}{.277em}"), M("\\enspace", "\\kern.5em "), M("\\enskip", "\\hskip.5em\\relax"), M("\\quad", "\\hskip1em\\relax"), M("\\qquad", "\\hskip2em\\relax"), M("\\tag", "\\@ifstar\\tag@literal\\tag@paren"), M("\\tag@paren", "\\tag@literal{({#1})}"), M("\\tag@literal", function (t) {
            if (t.macros.get("\\df@tag")) throw new C("Multiple \\tag");
            return "\\gdef\\df@tag{\\text{#1}}"
        }), M("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}"), M("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)"), M("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}"), M("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1"), M("\\pmb", "\\html@mathml{\\@binrel{#1}{\\mathrlap{#1}\\mathrlap{\\mkern0.4mu\\raisebox{0.4mu}{$#1$}}{\\mkern0.8mu#1}}}{\\mathbf{#1}}"), M("\\\\", "\\newline"), M("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
        var ln = at["Main-Regular"]["T".charCodeAt(0)][1] - .7 * at["Main-Regular"]["A".charCodeAt(0)][1] + "em";
        M("\\LaTeX", "\\textrm{\\html@mathml{L\\kern-.36em\\raisebox{" + ln + "}{\\scriptsize A}\\kern-.15em\\TeX}{LaTeX}}"), M("\\KaTeX", "\\textrm{\\html@mathml{K\\kern-.17em\\raisebox{" + ln + "}{\\scriptsize A}\\kern-.15em\\TeX}{KaTeX}}"), M("\\hspace", "\\@ifstar\\@hspacer\\@hspace"), M("\\@hspace", "\\hskip #1\\relax"), M("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax"), M("\\ordinarycolon", ":"), M("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}"), M("\\dblcolon", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}"), M("\\coloneqq", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}"), M("\\Coloneqq", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}"), M("\\coloneq", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}"), M("\\Coloneq", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}"), M("\\eqqcolon", "\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), M("\\Eqqcolon", "\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}"), M("\\eqcolon", "\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), M("\\Eqcolon", "\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}"), M("\\colonapprox", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}"), M("\\Colonapprox", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}"), M("\\colonsim", "\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}"), M("\\Colonsim", "\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}"), M("\u2254", "\\coloneqq"), M("\u2255", "\\eqqcolon"), M("\u2a74", "\\Coloneqq"), M("\\ratio", "\\vcentcolon"), M("\\coloncolon", "\\dblcolon"), M("\\colonequals", "\\coloneqq"), M("\\coloncolonequals", "\\Coloneqq"), M("\\equalscolon", "\\eqqcolon"), M("\\equalscoloncolon", "\\Eqqcolon"), M("\\colonminus", "\\coloneq"), M("\\coloncolonminus", "\\Coloneq"), M("\\minuscolon", "\\eqcolon"), M("\\minuscoloncolon", "\\Eqcolon"), M("\\coloncolonapprox", "\\Colonapprox"), M("\\coloncolonsim", "\\Colonsim"), M("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), M("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}"), M("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}"),
            M("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}"), M("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`\u220c}}"), M("\\limsup", "\\DOTSB\\mathop{\\operatorname{lim\\,sup}}\\limits"), M("\\liminf", "\\DOTSB\\mathop{\\operatorname{lim\\,inf}}\\limits"), M("\u27e6", "\\mathopen{[\\mkern-3.2mu[}"), M("\u27e7", "\\mathclose{]\\mkern-3.2mu]}"), M("\\darr", "\\downarrow"), M("\\dArr", "\\Downarrow"), M("\\Darr", "\\Downarrow"), M("\\lang", "\\langle"), M("\\rang", "\\rangle"), M("\\uarr", "\\uparrow"), M("\\uArr", "\\Uparrow"), M("\\Uarr", "\\Uparrow"), M("\\N", "\\mathbb{N}"), M("\\R", "\\mathbb{R}"), M("\\Z", "\\mathbb{Z}"), M("\\alef", "\\aleph"), M("\\alefsym", "\\aleph"), M("\\Alpha", "\\mathrm{A}"), M("\\Beta", "\\mathrm{B}"), M("\\bull", "\\bullet"), M("\\Chi", "\\mathrm{X}"), M("\\clubs", "\\clubsuit"), M("\\cnums", "\\mathbb{C}"), M("\\Complex", "\\mathbb{C}"), M("\\Dagger", "\\ddagger"), M("\\diamonds", "\\diamondsuit"), M("\\empty", "\\emptyset"), M("\\Epsilon", "\\mathrm{E}"), M("\\Eta", "\\mathrm{H}"), M("\\exist", "\\exists"), M("\\harr", "\\leftrightarrow"), M("\\hArr", "\\Leftrightarrow"), M("\\Harr", "\\Leftrightarrow"), M("\\hearts", "\\heartsuit"), M("\\image", "\\Im"), M("\\infin", "\\infty"), M("\\Iota", "\\mathrm{I}"), M("\\isin", "\\in"), M("\\Kappa", "\\mathrm{K}"), M("\\larr", "\\leftarrow"), M("\\lArr", "\\Leftarrow"), M("\\Larr", "\\Leftarrow"), M("\\lrarr", "\\leftrightarrow"), M("\\lrArr", "\\Leftrightarrow"), M("\\Lrarr", "\\Leftrightarrow"), M("\\Mu", "\\mathrm{M}"), M("\\natnums", "\\mathbb{N}"), M("\\Nu", "\\mathrm{N}"), M("\\Omicron", "\\mathrm{O}"), M("\\plusmn", "\\pm"), M("\\rarr", "\\rightarrow"), M("\\rArr", "\\Rightarrow"), M("\\Rarr", "\\Rightarrow"), M("\\real", "\\Re"), M("\\reals", "\\mathbb{R}"), M("\\Reals", "\\mathbb{R}"), M("\\Rho", "\\mathrm{R}"), M("\\sdot", "\\cdot"), M("\\sect", "\\S"), M("\\spades", "\\spadesuit"), M("\\sub", "\\subset"),M("\\sube", "\\subseteq"),M("\\supe", "\\supseteq"),M("\\Tau", "\\mathrm{T}"),M("\\thetasym", "\\vartheta"),M("\\weierp", "\\wp"),M("\\Zeta", "\\mathrm{Z}"),M("\\argmin", "\\DOTSB\\mathop{\\operatorname{arg\\,min}}\\limits"),M("\\argmax", "\\DOTSB\\mathop{\\operatorname{arg\\,max}}\\limits");
        var hn = {"\\relax": !0, "^": !0, _: !0, "\\limits": !0, "\\nolimits": !0}, cn = function () {
            function t(t, e, r) {
                this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = e, this.expansionCount = 0, this.feed(t), this.macros = new Qr(en, e.macros), this.mode = r, this.stack = []
            }

            var e = t.prototype;
            return e.feed = function (t) {
                this.lexer = new Jr(t, this.settings)
            }, e.switchMode = function (t) {
                this.mode = t
            }, e.beginGroup = function () {
                this.macros.beginGroup()
            }, e.endGroup = function () {
                this.macros.endGroup()
            }, e.future = function () {
                return 0 === this.stack.length && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1]
            }, e.popToken = function () {
                return this.future(), this.stack.pop()
            }, e.pushToken = function (t) {
                this.stack.push(t)
            }, e.pushTokens = function (t) {
                var e;
                (e = this.stack).push.apply(e, t)
            }, e.consumeSpaces = function () {
                for (; " " === this.future().text;) this.stack.pop()
            }, e.consumeArgs = function (t) {
                for (var e = [], r = 0; r < t; ++r) {
                    this.consumeSpaces();
                    var n = this.popToken();
                    if ("{" === n.text) {
                        for (var i = [], a = 1; 0 !== a;) {
                            var o = this.popToken();
                            if (i.push(o), "{" === o.text) ++a; else if ("}" === o.text) --a; else if ("EOF" === o.text) throw new C("End of input in macro argument", n)
                        }
                        i.pop(), i.reverse(), e[r] = i
                    } else {
                        if ("EOF" === n.text) throw new C("End of input expecting macro argument");
                        e[r] = [n]
                    }
                }
                return e
            }, e.expandOnce = function () {
                var t = this.popToken(), e = t.text, r = this._getExpansion(e);
                if (null == r) return this.pushToken(t), t;
                if (this.expansionCount++, this.expansionCount > this.settings.maxExpand) throw new C("Too many expansions: infinite loop or need to increase maxExpand setting");
                var n = r.tokens;
                if (r.numArgs) for (var i = this.consumeArgs(r.numArgs), a = (n = n.slice()).length - 1; a >= 0; --a) {
                    var o = n[a];
                    if ("#" === o.text) {
                        if (0 === a) throw new C("Incomplete placeholder at end of macro body", o);
                        if ("#" === (o = n[--a]).text) n.splice(a + 1, 1); else {
                            if (!/^[1-9]$/.test(o.text)) throw new C("Not a valid argument number", o);
                            var s;
                            (s = n).splice.apply(s, [a, 2].concat(i[+o.text - 1]))
                        }
                    }
                }
                return this.pushTokens(n), n
            }, e.expandAfterFuture = function () {
                return this.expandOnce(), this.future()
            }, e.expandNextToken = function () {
                for (; ;) {
                    var t = this.expandOnce();
                    if (t instanceof z) {
                        if ("\\relax" !== t.text) return this.stack.pop();
                        this.stack.pop()
                    }
                }
                throw new Error
            }, e.expandMacro = function (t) {
                if (this.macros.get(t)) {
                    var e = [], r = this.stack.length;
                    for (this.pushToken(new z(t)); this.stack.length > r;) this.expandOnce() instanceof z && e.push(this.stack.pop());
                    return e
                }
            }, e.expandMacroAsText = function (t) {
                var e = this.expandMacro(t);
                return e ? e.map(function (t) {
                    return t.text
                }).join("") : e
            }, e._getExpansion = function (t) {
                var e = this.macros.get(t);
                if (null == e) return e;
                var r = "function" == typeof e ? e(this) : e;
                if ("string" == typeof r) {
                    var n = 0;
                    if (-1 !== r.indexOf("#")) for (var i = r.replace(/##/g, ""); -1 !== i.indexOf("#" + (n + 1));) ++n;
                    for (var a = new Jr(r, this.settings), o = [], s = a.lex(); "EOF" !== s.text;) o.push(s), s = a.lex();
                    return o.reverse(), {tokens: o, numArgs: n}
                }
                return r
            }, e.isDefined = function (t) {
                return this.macros.has(t) || Yr.hasOwnProperty(t) || ut.math.hasOwnProperty(t) || ut.text.hasOwnProperty(t) || hn.hasOwnProperty(t)
            }, t
        }(), mn = {
            "\u0301": {text: "\\'", math: "\\acute"},
            "\u0300": {text: "\\`", math: "\\grave"},
            "\u0308": {text: '\\"', math: "\\ddot"},
            "\u0303": {text: "\\~", math: "\\tilde"},
            "\u0304": {text: "\\=", math: "\\bar"},
            "\u0306": {text: "\\u", math: "\\breve"},
            "\u030c": {text: "\\v", math: "\\check"},
            "\u0302": {text: "\\^", math: "\\hat"},
            "\u0307": {text: "\\.", math: "\\dot"},
            "\u030a": {text: "\\r", math: "\\mathring"},
            "\u030b": {text: "\\H"}
        }, un = {
            "\xe1": "a\u0301",
            "\xe0": "a\u0300",
            "\xe4": "a\u0308",
            "\u01df": "a\u0308\u0304",
            "\xe3": "a\u0303",
            "\u0101": "a\u0304",
            "\u0103": "a\u0306",
            "\u1eaf": "a\u0306\u0301",
            "\u1eb1": "a\u0306\u0300",
            "\u1eb5": "a\u0306\u0303",
            "\u01ce": "a\u030c",
            "\xe2": "a\u0302",
            "\u1ea5": "a\u0302\u0301",
            "\u1ea7": "a\u0302\u0300",
            "\u1eab": "a\u0302\u0303",
            "\u0227": "a\u0307",
            "\u01e1": "a\u0307\u0304",
            "\xe5": "a\u030a",
            "\u01fb": "a\u030a\u0301",
            "\u1e03": "b\u0307",
            "\u0107": "c\u0301",
            "\u010d": "c\u030c",
            "\u0109": "c\u0302",
            "\u010b": "c\u0307",
            "\u010f": "d\u030c",
            "\u1e0b": "d\u0307",
            "\xe9": "e\u0301",
            "\xe8": "e\u0300",
            "\xeb": "e\u0308",
            "\u1ebd": "e\u0303",
            "\u0113": "e\u0304",
            "\u1e17": "e\u0304\u0301",
            "\u1e15": "e\u0304\u0300",
            "\u0115": "e\u0306",
            "\u011b": "e\u030c",
            "\xea": "e\u0302",
            "\u1ebf": "e\u0302\u0301",
            "\u1ec1": "e\u0302\u0300",
            "\u1ec5": "e\u0302\u0303",
            "\u0117": "e\u0307",
            "\u1e1f": "f\u0307",
            "\u01f5": "g\u0301",
            "\u1e21": "g\u0304",
            "\u011f": "g\u0306",
            "\u01e7": "g\u030c",
            "\u011d": "g\u0302",
            "\u0121": "g\u0307",
            "\u1e27": "h\u0308",
            "\u021f": "h\u030c",
            "\u0125": "h\u0302",
            "\u1e23": "h\u0307",
            "\xed": "i\u0301",
            "\xec": "i\u0300",
            "\xef": "i\u0308",
            "\u1e2f": "i\u0308\u0301",
            "\u0129": "i\u0303",
            "\u012b": "i\u0304",
            "\u012d": "i\u0306",
            "\u01d0": "i\u030c",
            "\xee": "i\u0302",
            "\u01f0": "j\u030c",
            "\u0135": "j\u0302",
            "\u1e31": "k\u0301",
            "\u01e9": "k\u030c",
            "\u013a": "l\u0301",
            "\u013e": "l\u030c",
            "\u1e3f": "m\u0301",
            "\u1e41": "m\u0307",
            "\u0144": "n\u0301",
            "\u01f9": "n\u0300",
            "\xf1": "n\u0303",
            "\u0148": "n\u030c",
            "\u1e45": "n\u0307",
            "\xf3": "o\u0301",
            "\xf2": "o\u0300",
            "\xf6": "o\u0308",
            "\u022b": "o\u0308\u0304",
            "\xf5": "o\u0303",
            "\u1e4d": "o\u0303\u0301",
            "\u1e4f": "o\u0303\u0308",
            "\u022d": "o\u0303\u0304",
            "\u014d": "o\u0304",
            "\u1e53": "o\u0304\u0301",
            "\u1e51": "o\u0304\u0300",
            "\u014f": "o\u0306",
            "\u01d2": "o\u030c",
            "\xf4": "o\u0302",
            "\u1ed1": "o\u0302\u0301",
            "\u1ed3": "o\u0302\u0300",
            "\u1ed7": "o\u0302\u0303",
            "\u022f": "o\u0307",
            "\u0231": "o\u0307\u0304",
            "\u0151": "o\u030b",
            "\u1e55": "p\u0301",
            "\u1e57": "p\u0307",
            "\u0155": "r\u0301",
            "\u0159": "r\u030c",
            "\u1e59": "r\u0307",
            "\u015b": "s\u0301",
            "\u1e65": "s\u0301\u0307",
            "\u0161": "s\u030c",
            "\u1e67": "s\u030c\u0307",
            "\u015d": "s\u0302",
            "\u1e61": "s\u0307",
            "\u1e97": "t\u0308",
            "\u0165": "t\u030c",
            "\u1e6b": "t\u0307",
            "\xfa": "u\u0301",
            "\xf9": "u\u0300",
            "\xfc": "u\u0308",
            "\u01d8": "u\u0308\u0301",
            "\u01dc": "u\u0308\u0300",
            "\u01d6": "u\u0308\u0304",
            "\u01da": "u\u0308\u030c",
            "\u0169": "u\u0303",
            "\u1e79": "u\u0303\u0301",
            "\u016b": "u\u0304",
            "\u1e7b": "u\u0304\u0308",
            "\u016d": "u\u0306",
            "\u01d4": "u\u030c",
            "\xfb": "u\u0302",
            "\u016f": "u\u030a",
            "\u0171": "u\u030b",
            "\u1e7d": "v\u0303",
            "\u1e83": "w\u0301",
            "\u1e81": "w\u0300",
            "\u1e85": "w\u0308",
            "\u0175": "w\u0302",
            "\u1e87": "w\u0307",
            "\u1e98": "w\u030a",
            "\u1e8d": "x\u0308",
            "\u1e8b": "x\u0307",
            "\xfd": "y\u0301",
            "\u1ef3": "y\u0300",
            "\xff": "y\u0308",
            "\u1ef9": "y\u0303",
            "\u0233": "y\u0304",
            "\u0177": "y\u0302",
            "\u1e8f": "y\u0307",
            "\u1e99": "y\u030a",
            "\u017a": "z\u0301",
            "\u017e": "z\u030c",
            "\u1e91": "z\u0302",
            "\u017c": "z\u0307",
            "\xc1": "A\u0301",
            "\xc0": "A\u0300",
            "\xc4": "A\u0308",
            "\u01de": "A\u0308\u0304",
            "\xc3": "A\u0303",
            "\u0100": "A\u0304",
            "\u0102": "A\u0306",
            "\u1eae": "A\u0306\u0301",
            "\u1eb0": "A\u0306\u0300",
            "\u1eb4": "A\u0306\u0303",
            "\u01cd": "A\u030c",
            "\xc2": "A\u0302",
            "\u1ea4": "A\u0302\u0301",
            "\u1ea6": "A\u0302\u0300",
            "\u1eaa": "A\u0302\u0303",
            "\u0226": "A\u0307",
            "\u01e0": "A\u0307\u0304",
            "\xc5": "A\u030a",
            "\u01fa": "A\u030a\u0301",
            "\u1e02": "B\u0307",
            "\u0106": "C\u0301",
            "\u010c": "C\u030c",
            "\u0108": "C\u0302",
            "\u010a": "C\u0307",
            "\u010e": "D\u030c",
            "\u1e0a": "D\u0307",
            "\xc9": "E\u0301",
            "\xc8": "E\u0300",
            "\xcb": "E\u0308",
            "\u1ebc": "E\u0303",
            "\u0112": "E\u0304",
            "\u1e16": "E\u0304\u0301",
            "\u1e14": "E\u0304\u0300",
            "\u0114": "E\u0306",
            "\u011a": "E\u030c",
            "\xca": "E\u0302",
            "\u1ebe": "E\u0302\u0301",
            "\u1ec0": "E\u0302\u0300",
            "\u1ec4": "E\u0302\u0303",
            "\u0116": "E\u0307",
            "\u1e1e": "F\u0307",
            "\u01f4": "G\u0301",
            "\u1e20": "G\u0304",
            "\u011e": "G\u0306",
            "\u01e6": "G\u030c",
            "\u011c": "G\u0302",
            "\u0120": "G\u0307",
            "\u1e26": "H\u0308",
            "\u021e": "H\u030c",
            "\u0124": "H\u0302",
            "\u1e22": "H\u0307",
            "\xcd": "I\u0301",
            "\xcc": "I\u0300",
            "\xcf": "I\u0308",
            "\u1e2e": "I\u0308\u0301",
            "\u0128": "I\u0303",
            "\u012a": "I\u0304",
            "\u012c": "I\u0306",
            "\u01cf": "I\u030c",
            "\xce": "I\u0302",
            "\u0130": "I\u0307",
            "\u0134": "J\u0302",
            "\u1e30": "K\u0301",
            "\u01e8": "K\u030c",
            "\u0139": "L\u0301",
            "\u013d": "L\u030c",
            "\u1e3e": "M\u0301",
            "\u1e40": "M\u0307",
            "\u0143": "N\u0301",
            "\u01f8": "N\u0300",
            "\xd1": "N\u0303",
            "\u0147": "N\u030c",
            "\u1e44": "N\u0307",
            "\xd3": "O\u0301",
            "\xd2": "O\u0300",
            "\xd6": "O\u0308",
            "\u022a": "O\u0308\u0304",
            "\xd5": "O\u0303",
            "\u1e4c": "O\u0303\u0301",
            "\u1e4e": "O\u0303\u0308",
            "\u022c": "O\u0303\u0304",
            "\u014c": "O\u0304",
            "\u1e52": "O\u0304\u0301",
            "\u1e50": "O\u0304\u0300",
            "\u014e": "O\u0306",
            "\u01d1": "O\u030c",
            "\xd4": "O\u0302",
            "\u1ed0": "O\u0302\u0301",
            "\u1ed2": "O\u0302\u0300",
            "\u1ed6": "O\u0302\u0303",
            "\u022e": "O\u0307",
            "\u0230": "O\u0307\u0304",
            "\u0150": "O\u030b",
            "\u1e54": "P\u0301",
            "\u1e56": "P\u0307",
            "\u0154": "R\u0301",
            "\u0158": "R\u030c",
            "\u1e58": "R\u0307",
            "\u015a": "S\u0301",
            "\u1e64": "S\u0301\u0307",
            "\u0160": "S\u030c",
            "\u1e66": "S\u030c\u0307",
            "\u015c": "S\u0302",
            "\u1e60": "S\u0307",
            "\u0164": "T\u030c",
            "\u1e6a": "T\u0307",
            "\xda": "U\u0301",
            "\xd9": "U\u0300",
            "\xdc": "U\u0308",
            "\u01d7": "U\u0308\u0301",
            "\u01db": "U\u0308\u0300",
            "\u01d5": "U\u0308\u0304",
            "\u01d9": "U\u0308\u030c",
            "\u0168": "U\u0303",
            "\u1e78": "U\u0303\u0301",
            "\u016a": "U\u0304",
            "\u1e7a": "U\u0304\u0308",
            "\u016c": "U\u0306",
            "\u01d3": "U\u030c",
            "\xdb": "U\u0302",
            "\u016e": "U\u030a",
            "\u0170": "U\u030b",
            "\u1e7c": "V\u0303",
            "\u1e82": "W\u0301",
            "\u1e80": "W\u0300",
            "\u1e84": "W\u0308",
            "\u0174": "W\u0302",
            "\u1e86": "W\u0307",
            "\u1e8c": "X\u0308",
            "\u1e8a": "X\u0307",
            "\xdd": "Y\u0301",
            "\u1ef2": "Y\u0300",
            "\u0178": "Y\u0308",
            "\u1ef8": "Y\u0303",
            "\u0232": "Y\u0304",
            "\u0176": "Y\u0302",
            "\u1e8e": "Y\u0307",
            "\u0179": "Z\u0301",
            "\u017d": "Z\u030c",
            "\u1e90": "Z\u0302",
            "\u017b": "Z\u0307",
            "\u03ac": "\u03b1\u0301",
            "\u1f70": "\u03b1\u0300",
            "\u1fb1": "\u03b1\u0304",
            "\u1fb0": "\u03b1\u0306",
            "\u03ad": "\u03b5\u0301",
            "\u1f72": "\u03b5\u0300",
            "\u03ae": "\u03b7\u0301",
            "\u1f74": "\u03b7\u0300",
            "\u03af": "\u03b9\u0301",
            "\u1f76": "\u03b9\u0300",
            "\u03ca": "\u03b9\u0308",
            "\u0390": "\u03b9\u0308\u0301",
            "\u1fd2": "\u03b9\u0308\u0300",
            "\u1fd1": "\u03b9\u0304",
            "\u1fd0": "\u03b9\u0306",
            "\u03cc": "\u03bf\u0301",
            "\u1f78": "\u03bf\u0300",
            "\u03cd": "\u03c5\u0301",
            "\u1f7a": "\u03c5\u0300",
            "\u03cb": "\u03c5\u0308",
            "\u03b0": "\u03c5\u0308\u0301",
            "\u1fe2": "\u03c5\u0308\u0300",
            "\u1fe1": "\u03c5\u0304",
            "\u1fe0": "\u03c5\u0306",
            "\u03ce": "\u03c9\u0301",
            "\u1f7c": "\u03c9\u0300",
            "\u038e": "\u03a5\u0301",
            "\u1fea": "\u03a5\u0300",
            "\u03ab": "\u03a5\u0308",
            "\u1fe9": "\u03a5\u0304",
            "\u1fe8": "\u03a5\u0306",
            "\u038f": "\u03a9\u0301",
            "\u1ffa": "\u03a9\u0300"
        }, dn = function () {
            function t(t, e) {
                this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new cn(t, e, this.mode), this.settings = e, this.leftrightDepth = 0
            }

            var e = t.prototype;
            return e.expect = function (t, e) {
                if (void 0 === e && (e = !0), this.nextToken.text !== t) throw new C("Expected '" + t + "', got '" + this.nextToken.text + "'", this.nextToken);
                e && this.consume()
            }, e.consume = function () {
                this.nextToken = this.gullet.expandNextToken()
            }, e.switchMode = function (t) {
                this.mode = t, this.gullet.switchMode(t)
            }, e.parse = function () {
                this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor"), this.consume();
                var t = this.parseExpression(!1);
                return this.expect("EOF", !1), this.gullet.endGroup(), t
            }, e.parseExpression = function (e, r) {
                for (var n = []; ;) {
                    "math" === this.mode && this.consumeSpaces();
                    var i = this.nextToken;
                    if (-1 !== t.endOfExpression.indexOf(i.text)) break;
                    if (r && i.text === r) break;
                    if (e && Yr[i.text] && Yr[i.text].infix) break;
                    var a = this.parseAtom(r);
                    if (!a) break;
                    n.push(a)
                }
                return "text" === this.mode && this.formLigatures(n), this.handleInfixNodes(n)
            }, e.handleInfixNodes = function (t) {
                for (var e, r = -1, n = 0; n < t.length; n++) {
                    var i = s(t[n], "infix");
                    if (i) {
                        if (-1 !== r) throw new C("only one infix operator per group", i.token);
                        r = n, e = i.replaceWith
                    }
                }
                if (-1 !== r && e) {
                    var a, o, l = t.slice(0, r), h = t.slice(r + 1);
                    return a = 1 === l.length && "ordgroup" === l[0].type ? l[0] : {
                        type: "ordgroup",
                        mode: this.mode,
                        body: l
                    }, o = 1 === h.length && "ordgroup" === h[0].type ? h[0] : {
                        type: "ordgroup",
                        mode: this.mode,
                        body: h
                    }, ["\\\\abovefrac" === e ? this.callFunction(e, [a, t[r], o], []) : this.callFunction(e, [a, o], [])]
                }
                return t
            }, e.handleSupSubscript = function (e) {
                var r = this.nextToken, n = r.text;
                this.consume(), this.consumeSpaces();
                var i = this.parseGroup(e, !1, t.SUPSUB_GREEDINESS);
                if (!i) throw new C("Expected group after '" + n + "'", r);
                return i
            }, e.handleUnsupportedCmd = function () {
                for (var t = this.nextToken.text, e = [], r = 0; r < t.length; r++) e.push({
                    type: "textord",
                    mode: "text",
                    text: t[r]
                });
                var n = {type: "text", mode: this.mode, body: e},
                    i = {type: "color", mode: this.mode, color: this.settings.errorColor, body: [n]};
                return this.consume(), i
            }, e.parseAtom = function (t) {
                var e, r, n = this.parseGroup("atom", !1, null, t);
                if ("text" === this.mode) return n;
                for (; ;) {
                    this.consumeSpaces();
                    var i = this.nextToken;
                    if ("\\limits" === i.text || "\\nolimits" === i.text) {
                        var a = s(n, "op");
                        if (!a) throw new C("Limit controls must follow a math operator", i);
                        var o = "\\limits" === i.text;
                        a.limits = o, a.alwaysHandleSupSub = !0, this.consume()
                    } else if ("^" === i.text) {
                        if (e) throw new C("Double superscript", i);
                        e = this.handleSupSubscript("superscript")
                    } else if ("_" === i.text) {
                        if (r) throw new C("Double subscript", i);
                        r = this.handleSupSubscript("subscript")
                    } else {
                        if ("'" !== i.text) break;
                        if (e) throw new C("Double superscript", i);
                        var l = {type: "textord", mode: this.mode, text: "\\prime"}, h = [l];
                        for (this.consume(); "'" === this.nextToken.text;) h.push(l), this.consume();
                        "^" === this.nextToken.text && h.push(this.handleSupSubscript("superscript")), e = {
                            type: "ordgroup",
                            mode: this.mode,
                            body: h
                        }
                    }
                }
                return e || r ? {type: "supsub", mode: this.mode, base: n, sup: e, sub: r} : n
            }, e.parseFunction = function (t, e, r) {
                var n = this.nextToken, i = n.text, a = Yr[i];
                if (!a) return null;
                if (null != r && a.greediness <= r) throw new C("Got function '" + i + "' with no arguments" + (e ? " as " + e : ""), n);
                if ("text" === this.mode && !a.allowedInText) throw new C("Can't use function '" + i + "' in text mode", n);
                if ("math" === this.mode && !1 === a.allowedInMath) throw new C("Can't use function '" + i + "' in math mode", n);
                if (a.argTypes && "url" === a.argTypes[0] && this.gullet.lexer.setCatcode("%", 13), a.consumeMode) {
                    var o = this.mode;
                    this.switchMode(a.consumeMode), this.consume(), this.switchMode(o)
                } else this.consume();
                var s = this.parseArguments(i, a), l = s.args, h = s.optArgs;
                return this.callFunction(i, l, h, n, t)
            }, e.callFunction = function (t, e, r, n, i) {
                var a = {funcName: t, parser: this, token: n, breakOnTokenText: i}, o = Yr[t];
                if (o && o.handler) return o.handler(a, e, r);
                throw new C("No function handler for " + t)
            }, e.parseArguments = function (t, e) {
                var r = e.numArgs + e.numOptionalArgs;
                if (0 === r) return {args: [], optArgs: []};
                for (var n = e.greediness, i = [], a = [], o = 0; o < r; o++) {
                    var s = e.argTypes && e.argTypes[o], l = o < e.numOptionalArgs;
                    o > 0 && !l && this.consumeSpaces(), 0 !== o || l || "math" !== this.mode || this.consumeSpaces();
                    var h = this.nextToken, c = this.parseGroupOfType("argument to '" + t + "'", s, l, n);
                    if (!c) {
                        if (l) {
                            a.push(null);
                            continue
                        }
                        throw new C("Expected group after '" + t + "'", h)
                    }
                    (l ? a : i).push(c)
                }
                return {args: i, optArgs: a}
            }, e.parseGroupOfType = function (t, e, r, n) {
                switch (e) {
                    case"color":
                        return this.parseColorGroup(r);
                    case"size":
                        return this.parseSizeGroup(r);
                    case"url":
                        return this.parseUrlGroup(r);
                    case"math":
                    case"text":
                        return this.parseGroup(t, r, n, void 0, e);
                    case"raw":
                        if (r && "{" === this.nextToken.text) return null;
                        var i = this.parseStringGroup("raw", r, !0);
                        if (i) return {type: "raw", mode: "text", string: i.text};
                        throw new C("Expected raw group", this.nextToken);
                    case"original":
                    case null:
                    case void 0:
                        return this.parseGroup(t, r, n);
                    default:
                        throw new C("Unknown group type as " + t, this.nextToken)
                }
            }, e.consumeSpaces = function () {
                for (; " " === this.nextToken.text;) this.consume()
            }, e.parseStringGroup = function (t, e, r) {
                var n = e ? "[" : "{", i = e ? "]" : "}", a = this.nextToken;
                if (a.text !== n) {
                    if (e) return null;
                    if (r && "EOF" !== a.text && /[^{}[\]]/.test(a.text)) return this.gullet.lexer.setCatcode("%", 14), this.consume(), a
                }
                var o = this.mode;
                this.mode = "text", this.expect(n);
                for (var s = "", l = this.nextToken, h = 0, c = l; r && h > 0 || this.nextToken.text !== i;) {
                    switch (this.nextToken.text) {
                        case"EOF":
                            throw new C("Unexpected end of input in " + t, l.range(c, s));
                        case n:
                            h++;
                            break;
                        case i:
                            h--
                    }
                    s += (c = this.nextToken).text, this.consume()
                }
                return this.mode = o, this.gullet.lexer.setCatcode("%", 14), this.expect(i), l.range(c, s)
            }, e.parseRegexGroup = function (t, e) {
                var r = this.mode;
                this.mode = "text";
                for (var n = this.nextToken, i = n, a = ""; "EOF" !== this.nextToken.text && t.test(a + this.nextToken.text);) a += (i = this.nextToken).text, this.consume();
                if ("" === a) throw new C("Invalid " + e + ": '" + n.text + "'", n);
                return this.mode = r, n.range(i, a)
            }, e.parseColorGroup = function (t) {
                var e = this.parseStringGroup("color", t);
                if (!e) return null;
                var r = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i.exec(e.text);
                if (!r) throw new C("Invalid color: '" + e.text + "'", e);
                var n = r[0];
                return /^[0-9a-f]{6}$/i.test(n) && (n = "#" + n), {type: "color-token", mode: this.mode, color: n}
            }, e.parseSizeGroup = function (t) {
                var e, r = !1;
                if (!(e = t || "{" === this.nextToken.text ? this.parseStringGroup("size", t) : this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size"))) return null;
                t || 0 !== e.text.length || (e.text = "0pt", r = !0);
                var n = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e.text);
                if (!n) throw new C("Invalid size: '" + e.text + "'", e);
                var i, a = {number: +(n[1] + n[2]), unit: n[3]};
                if ("string" != typeof (i = a) && (i = i.unit), !(i in jt || i in Vt || "ex" === i)) throw new C("Invalid unit: '" + a.unit + "'", e);
                return {type: "size", mode: this.mode, value: a, isBlank: r}
            }, e.parseUrlGroup = function (t) {
                var e = this.parseStringGroup("url", t, !0);
                if (!e) return null;
                var r = e.text.replace(/\\([#$%&~_^{}])/g, "$1"), n = /^\s*([^\\\/#]*?)(?::|&#0*58|&#x0*3a)/i.exec(r);
                n = null != n ? n[1] : "_relative";
                var i = this.settings.allowedProtocols;
                if (!O.contains(i, "*") && !O.contains(i, n)) throw new C("Forbidden protocol '" + n + "'", e);
                return {type: "url", mode: this.mode, url: r}
            }, e.parseGroup = function (e, r, n, i, a) {
                var o, s, l = this.mode, h = this.nextToken, c = h.text;
                if (a && this.switchMode(a), r ? "[" === c : "{" === c || "\\begingroup" === c) {
                    o = t.endOfGroup[c], this.gullet.beginGroup(), this.consume();
                    var m = this.parseExpression(!1, o), u = this.nextToken;
                    this.gullet.endGroup(), s = {
                        type: "ordgroup",
                        mode: this.mode,
                        loc: A.range(h, u),
                        body: m,
                        semisimple: "\\begingroup" === c || void 0
                    }
                } else if (r) s = null; else if (null == (s = this.parseFunction(i, e, n) || this.parseSymbol()) && "\\" === c[0] && !hn.hasOwnProperty(c)) {
                    if (this.settings.throwOnError) throw new C("Undefined control sequence: " + c, h);
                    s = this.handleUnsupportedCmd()
                }
                return a && this.switchMode(l), o && this.expect(o), s
            }, e.formLigatures = function (t) {
                for (var e = t.length - 1, r = 0; r < e; ++r) {
                    var n = t[r], i = n.text;
                    "-" === i && "-" === t[r + 1].text && (r + 1 < e && "-" === t[r + 2].text ? (t.splice(r, 3, {
                        type: "textord",
                        mode: "text",
                        loc: A.range(n, t[r + 2]),
                        text: "---"
                    }), e -= 2) : (t.splice(r, 2, {
                        type: "textord",
                        mode: "text",
                        loc: A.range(n, t[r + 1]),
                        text: "--"
                    }), e -= 1)), "'" !== i && "`" !== i || t[r + 1].text !== i || (t.splice(r, 2, {
                        type: "textord",
                        mode: "text",
                        loc: A.range(n, t[r + 1]),
                        text: i + i
                    }), e -= 1)
                }
            }, e.parseSymbol = function () {
                var t = this.nextToken, e = t.text;
                if (/^\\verb[^a-zA-Z]/.test(e)) {
                    this.consume();
                    var r = e.slice(5), i = "*" === r.charAt(0);
                    if (i && (r = r.slice(1)), r.length < 2 || r.charAt(0) !== r.slice(-1)) throw new C("\\verb assertion failed --\n                    please report what input caused this bug");
                    return {type: "verb", mode: "text", body: r = r.slice(1, -1), star: i}
                }
                un.hasOwnProperty(e[0]) && !ut[this.mode][e[0]] && (this.settings.strict && "math" === this.mode && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + e[0] + '" used in math mode', t), e = un[e[0]] + e.substr(1));
                var a, o = Kr.exec(e);
                if (o && ("i" === (e = e.substring(0, o.index)) ? e = "\u0131" : "j" === e && (e = "\u0237")), ut[this.mode][e]) {
                    this.settings.strict && "math" === this.mode && "\xc7\xd0\xde\xe7\xfe".indexOf(e) >= 0 && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + e[0] + '" used in math mode', t);
                    var s, l = ut[this.mode][e].group, h = A.range(t);
                    if (ht.hasOwnProperty(l)) {
                        var c = l;
                        s = {type: "atom", mode: this.mode, family: c, loc: h, text: e}
                    } else s = {type: l, mode: this.mode, loc: h, text: e};
                    a = s
                } else {
                    if (!(e.charCodeAt(0) >= 128)) return null;
                    this.settings.strict && (n(e.charCodeAt(0)) ? "math" === this.mode && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + e[0] + '" used in math mode', t) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + e[0] + '" (' + e.charCodeAt(0) + ")", t)), a = {
                        type: "textord",
                        mode: this.mode,
                        loc: A.range(t),
                        text: e
                    }
                }
                if (this.consume(), o) for (var m = 0; m < o[0].length; m++) {
                    var u = o[0][m];
                    if (!mn[u]) throw new C("Unknown accent ' " + u + "'", t);
                    var d = mn[u][this.mode];
                    if (!d) throw new C("Accent " + u + " unsupported in " + this.mode + " mode", t);
                    a = {
                        type: "accent",
                        mode: this.mode,
                        loc: A.range(t),
                        label: d,
                        isStretchy: !1,
                        isShifty: !0,
                        base: a
                    }
                }
                return a
            }, t
        }();
        dn.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"], dn.endOfGroup = {
            "[": "]",
            "{": "}",
            "\\begingroup": "\\endgroup"
        }, dn.SUPSUB_GREEDINESS = 1;
        var pn = function (t, e) {
            if (!("string" == typeof t || t instanceof String)) throw new TypeError("KaTeX can only parse string typed expression");
            var r = new dn(t, e);
            delete r.gullet.macros.current["\\df@tag"];
            var n = r.parse();
            if (r.gullet.macros.get("\\df@tag")) {
                if (!e.displayMode) throw new C("\\tag works only in display equations");
                r.gullet.feed("\\df@tag"), n = [{type: "tag", mode: "text", body: n, tag: r.parse()}]
            }
            return n
        }, fn = function (t, e, r) {
            e.textContent = "";
            var n = vn(t, r).toNode();
            e.appendChild(n)
        };
        "undefined" != typeof document && "CSS1Compat" !== document.compatMode && ("undefined" != typeof console && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), fn = function () {
            throw new C("KaTeX doesn't work in quirks mode.")
        });
        var gn = function (t, e, r) {
            if (r.throwOnError || !(t instanceof C)) throw t;
            var n = re.makeSpan(["katex-error"], [new et(e)]);
            return n.setAttribute("title", t.toString()), n.setAttribute("style", "color:" + r.errorColor), n
        }, vn = function (t, e) {
            var r = new I(e);
            try {
                var n = pn(t, r);
                return Ie(n, t, r)
            } catch (e) {
                return gn(e, t, r)
            }
        }, xn = {
            version: "0.10.1",
            render: fn,
            renderToString: function (t, e) {
                return vn(t, e).toMarkup()
            },
            ParseError: C,
            __parse: function (t, e) {
                var r = new I(e);
                return pn(t, r)
            },
            __renderToDomTree: vn,
            __renderToHTMLTree: function (t, e) {
                var r = new I(e);
                try {
                    return function (t, e, r) {
                        var n = d(t, Ee(r)), i = re.makeSpan(["katex"], [n]);
                        return Oe(i, r)
                    }(pn(t, r), 0, r)
                } catch (e) {
                    return gn(e, t, r)
                }
            },
            __setFontMetrics: function (t, e) {
                at[t] = e
            },
            __defineSymbol: a,
            __defineMacro: M,
            __domTree: {Span: J, Anchor: Q, SymbolNode: et, SvgNode: rt, PathNode: nt, LineNode: it}
        };
        e["default"] = xn
    }])["default"]
}), !function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("katex")) : "function" == typeof define && define.amd ? define(["katex"], e) : "object" == typeof exports ? exports.renderMathInElement = e(require("katex")) : t.renderMathInElement = e(t.katex)
}("undefined" != typeof self ? self : this, function (t) {
    return function (t) {
        function e(n) {
            if (r[n]) return r[n].exports;
            var i = r[n] = {i: n, l: !1, exports: {}};
            return t[n].call(i.exports, i, i.exports, e), i.l = !0, i.exports
        }

        var r = {};
        return e.m = t, e.c = r, e.d = function (t, r, n) {
            e.o(t, r) || Object.defineProperty(t, r, {enumerable: !0, get: n})
        }, e.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
        }, e.t = function (t, r) {
            if (1 & r && (t = e(t)), 8 & r) return t;
            if (4 & r && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if (e.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: t
            }), 2 & r && "string" != typeof t) for (var i in t) e.d(n, i, function (e) {
                return t[e]
            }.bind(null, i));
            return n
        }, e.n = function (t) {
            var r = t && t.__esModule ? function () {
                return t["default"]
            } : function () {
                return t
            };
            return e.d(r, "a", r), r
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 1)
    }([function (e) {
        e.exports = t
    }, function (t, e, r) {
        "use strict";
        r.r(e);
        var n = r(0), i = r.n(n), a = function (t, e, r) {
            for (var n = r, i = 0, a = t.length; n < e.length;) {
                var o = e[n];
                if (i <= 0 && e.slice(n, n + a) === t) return n;
                "\\" === o ? n++ : "{" === o ? i++ : "}" === o && i--, n++
            }
            return -1
        }, o = function (t, e, r, n) {
            for (var i = [], o = 0; o < t.length; o++) if ("text" === t[o].type) {
                var s = t[o].data, l = !0, h = 0, c = void 0;
                for (-1 !== (c = s.indexOf(e)) && (h = c, i.push({type: "text", data: s.slice(0, h)}), l = !1); ;) {
                    if (l) {
                        if (-1 === (c = s.indexOf(e, h))) break;
                        i.push({type: "text", data: s.slice(h, c)}), h = c
                    } else {
                        if (-1 === (c = a(r, s, h + e.length))) break;
                        i.push({
                            type: "math",
                            data: s.slice(h + e.length, c),
                            rawData: s.slice(h, c + r.length),
                            display: n
                        }), h = c + r.length
                    }
                    l = !l
                }
                i.push({type: "text", data: s.slice(h)})
            } else i.push(t[o]);
            return i
        }, s = function (t, e) {
            for (var r = function (t, e) {
                for (var r = [{type: "text", data: t}], n = 0; n < e.length; n++) {
                    var i = e[n];
                    r = o(r, i.left, i.right, i.display || !1)
                }
                return r
            }(t, e.delimiters), n = document.createDocumentFragment(), a = 0; a < r.length; a++) if ("text" === r[a].type) n.appendChild(document.createTextNode(r[a].data)); else {
                var s = document.createElement("span"), l = r[a].data;
                e.displayMode = r[a].display;
                try {
                    i.a.render(l, s, e)
                } catch (t) {
                    if (!(t instanceof i.a.ParseError)) throw t;
                    e.errorCallback("KaTeX auto-render: Failed to parse `" + r[a].data + "` with ", t), n.appendChild(document.createTextNode(r[a].rawData));
                    continue
                }
                n.appendChild(s)
            }
            return n
        };
        e["default"] = function (t, e) {
            if (!t) throw new Error("No element provided to render");
            var r = {};
            for (var n in e) e.hasOwnProperty(n) && (r[n] = e[n]);
            r.delimiters = r.delimiters || [{left: "$$", right: "$$", display: !0}, {
                left: "\\(",
                right: "\\)",
                display: !1
            }, {
                left: "\\[",
                right: "\\]",
                display: !0
            }], r.ignoredTags = r.ignoredTags || ["script", "noscript", "style", "textarea", "pre", "code"], r.ignoredClasses = r.ignoredClasses || [], r.errorCallback = r.errorCallback || console.error, r.macros = r.macros || {}, function t(e, r) {
                for (var n = 0; n < e.childNodes.length; n++) {
                    var i = e.childNodes[n];
                    if (3 === i.nodeType) {
                        var a = s(i.textContent, r);
                        n += a.childNodes.length - 1, e.replaceChild(a, i)
                    } else 1 === i.nodeType && function () {
                        var e = " " + i.className + " ";
                        -1 === r.ignoredTags.indexOf(i.nodeName.toLowerCase()) && r.ignoredClasses.every(function (t) {
                            return -1 === e.indexOf(" " + t + " ")
                        }) && t(i, r)
                    }()
                }
            }(t, r)
        }
    }])["default"]
}), function () {
    var t = !1, e = /xyz/.test(function () {
        xyz
    }) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    }, Class.extend = function (r) {
        function n() {
            !t && this.init && this.init.apply(this, arguments)
        }

        var i = this.prototype;
        t = !0;
        var a = new this;
        t = !1;
        for (var o in r) a[o] = "function" == typeof r[o] && "function" == typeof i[o] && e.test(r[o]) ? function (t, e) {
            return function () {
                var r = this._super;
                this._super = i[t];
                var n = e.apply(this, arguments);
                return this._super = r, n
            }
        }(o, r[o]) : r[o];
        return n.prototype = a, n.constructor = n, n.extend = arguments.callee, n
    }
}(), function (t, e, r) {
    e[t] = e[t] || r(), "undefined" != typeof module && module.exports ? module.exports = e[t] : "function" == typeof define && define.amd && define(function () {
        return e[t]
    })
}("Promise", "undefined" != typeof global ? global : this, function () {
    "use strict";

    function t(t, e) {
        u.add(t, e), m || (m = p(u.drain))
    }

    function e(t) {
        var e, r = typeof t;
        return null == t || "object" != r && "function" != r || (e = t.then), "function" == typeof e && e
    }

    function r() {
        for (var t = 0; t < this.chain.length; t++) n(this, 1 === this.state ? this.chain[t].success : this.chain[t].failure, this.chain[t]);
        this.chain.length = 0
    }

    function n(t, r, n) {
        var i, a;
        try {
            r === !1 ? n.reject(t.msg) : (i = r === !0 ? t.msg : r.call(void 0, t.msg), i === n.promise ? n.reject(TypeError("Promise-chain cycle")) : (a = e(i)) ? a.call(i, n.resolve, n.reject) : n.resolve(i))
        } catch (t) {
            n.reject(t)
        }
    }

    function i(n) {
        var o, l = this;
        if (!l.triggered) {
            l.triggered = !0, l.def && (l = l.def);
            try {
                (o = e(n)) ? t(function () {
                    var t = new s(l);
                    try {
                        o.call(n, function () {
                            i.apply(t, arguments)
                        }, function () {
                            a.apply(t, arguments)
                        })
                    } catch (e) {
                        a.call(t, e)
                    }
                }) : (l.msg = n, l.state = 1, l.chain.length > 0 && t(r, l))
            } catch (t) {
                a.call(new s(l), t)
            }
        }
    }

    function a(e) {
        var n = this;
        n.triggered || (n.triggered = !0, n.def && (n = n.def), n.msg = e, n.state = 2, n.chain.length > 0 && t(r, n))
    }

    function o(t, e, r, n) {
        for (var i = 0; i < e.length; i++) !function (i) {
            t.resolve(e[i]).then(function (t) {
                r(i, t)
            }, n)
        }(i)
    }

    function s(t) {
        this.def = t, this.triggered = !1
    }

    function l(t) {
        this.promise = t, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0
    }

    function h(e) {
        if ("function" != typeof e) throw TypeError("Not a function");
        if (0 !== this.__NPO__) throw TypeError("Not a promise");
        this.__NPO__ = 1;
        var n = new l(this);
        this.then = function (e, i) {
            var a = {success: "function" != typeof e || e, failure: "function" == typeof i && i};
            return a.promise = new this.constructor(function (t, e) {
                if ("function" != typeof t || "function" != typeof e) throw TypeError("Not a function");
                a.resolve = t, a.reject = e
            }), n.chain.push(a), 0 !== n.state && t(r, n), a.promise
        }, this["catch"] = function (t) {
            return this.then(void 0, t)
        };
        try {
            e.call(void 0, function (t) {
                i.call(n, t)
            }, function (t) {
                a.call(n, t)
            })
        } catch (t) {
            a.call(n, t)
        }
    }

    var c, m, u, d = Object.prototype.toString, p = "undefined" != typeof setImmediate ? function (t) {
        return setImmediate(t)
    } : setTimeout;
    try {
        Object.defineProperty({}, "x", {}), c = function (t, e, r, n) {
            return Object.defineProperty(t, e, {value: r, writable: !0, configurable: n !== !1})
        }
    } catch (t) {
        c = function (t, e, r) {
            return t[e] = r, t
        }
    }
    u = function () {
        function t(t, e) {
            this.fn = t, this.self = e, this.next = void 0
        }

        var e, r, n;
        return {
            add: function (i, a) {
                n = new t(i, a), r ? r.next = n : e = n, r = n, n = void 0
            }, drain: function () {
                var t = e;
                for (e = r = m = void 0; t;) t.fn.call(t.self), t = t.next
            }
        }
    }();
    var f = c({}, "constructor", h, !1);
    return h.prototype = f, c(f, "__NPO__", 0, !1), c(h, "resolve", function (t) {
        var e = this;
        return t && "object" == typeof t && 1 === t.__NPO__ ? t : new e(function (e, r) {
            if ("function" != typeof e || "function" != typeof r) throw TypeError("Not a function");
            e(t)
        })
    }), c(h, "reject", function (t) {
        return new this(function (e, r) {
            if ("function" != typeof e || "function" != typeof r) throw TypeError("Not a function");
            r(t)
        })
    }), c(h, "all", function (t) {
        var e = this;
        return "[object Array]" != d.call(t) ? e.reject(TypeError("Not an array")) : 0 === t.length ? e.resolve([]) : new e(function (r, n) {
            if ("function" != typeof r || "function" != typeof n) throw TypeError("Not a function");
            var i = t.length, a = Array(i), s = 0;
            o(e, t, function (t, e) {
                a[t] = e, ++s === i && r(a)
            }, n)
        })
    }), c(h, "race", function (t) {
        var e = this;
        return "[object Array]" != d.call(t) ? e.reject(TypeError("Not an array")) : new e(function (r, n) {
            if ("function" != typeof r || "function" != typeof n) throw TypeError("Not a function");
            o(e, t, function (t, e) {
                r(e)
            }, n)
        })
    }), h
}), function (t, e) {
    function r(t) {
        return t.call.apply(t.bind, arguments)
    }

    function n(t, e) {
        if (!t) throw Error();
        if (2 < arguments.length) {
            var r = Array.prototype.slice.call(arguments, 2);
            return function () {
                var n = Array.prototype.slice.call(arguments);
                return Array.prototype.unshift.apply(n, r), t.apply(e, n)
            }
        }
        return function () {
            return t.apply(e, arguments)
        }
    }

    function i() {
        return i = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? r : n, i.apply(null, arguments)
    }

    function a(t, e) {
        this.J = t, this.t = e || t, this.C = this.t.document
    }

    function o(t, r, n) {
        t = t.C.getElementsByTagName(r)[0], t || (t = e.documentElement), t && t.lastChild && t.insertBefore(n, t.lastChild)
    }

    function s(t, e) {
        function r() {
            t.C.body ? e() : setTimeout(r, 0)
        }

        r()
    }

    function l(t, e, r) {
        e = e || [], r = r || [];
        for (var n = t.className.split(/\s+/), i = 0; i < e.length; i += 1) {
            for (var a = !1, o = 0; o < n.length; o += 1) if (e[i] === n[o]) {
                a = !0;
                break
            }
            a || n.push(e[i])
        }
        for (e = [], i = 0; i < n.length; i += 1) {
            for (a = !1, o = 0; o < r.length; o += 1) if (n[i] === r[o]) {
                a = !0;
                break
            }
            a || e.push(n[i])
        }
        t.className = e.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "")
    }

    function h(t, e) {
        for (var r = t.className.split(/\s+/), n = 0, i = r.length; n < i; n++) if (r[n] == e) return !0;
        return !1
    }

    function c(t) {
        if ("string" == typeof t.ma) return t.ma;
        var e = t.t.location.protocol;
        return "about:" == e && (e = t.J.location.protocol), "https:" == e ? "https:" : "http:"
    }

    function m(t, e) {
        var r = t.createElement("link", {rel: "stylesheet", href: e}), n = !1;
        r.onload = function () {
            n || (n = !0)
        }, r.onerror = function () {
            n || (n = !0)
        }, o(t, "head", r)
    }

    function u(e, r, n, i) {
        var a = e.C.getElementsByTagName("head")[0];
        if (a) {
            var o = e.createElement("script", {src: r}), s = !1;
            return o.onload = o.onreadystatechange = function () {
                s || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (s = !0, n && n(null), o.onload = o.onreadystatechange = null, "HEAD" == o.parentNode.tagName && a.removeChild(o))
            }, a.appendChild(o), t.setTimeout(function () {
                s || (s = !0, n && n(Error("Script load timeout")))
            }, i || 5e3), o
        }
        return null
    }

    function d(t, e) {
        this.X = t, this.fa = e
    }

    function p(t, e, r, n) {
        this.c = null != t ? t : null, this.g = null != e ? e : null, this.A = null != r ? r : null, this.e = null != n ? n : null
    }

    function f(t) {
        t = Z.exec(t);
        var e = null, r = null, n = null, i = null;
        return t && (null !== t[1] && t[1] && (e = parseInt(t[1], 10)), null !== t[2] && t[2] && (r = parseInt(t[2], 10)), null !== t[3] && t[3] && (n = parseInt(t[3], 10)), null !== t[4] && t[4] && (i = /^[0-9]+$/.test(t[4]) ? parseInt(t[4], 10) : t[4])), new p(e, r, n, i)
    }

    function g(t, e, r, n, i, a, o, s) {
        this.M = t, this.k = s
    }

    function v(t) {
        this.a = t
    }

    function x(t) {
        var e = w(t.a, /(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/, 1);
        return "" != e ? (/BB\d{2}/.test(e) && (e = "BlackBerry"), e) : (t = w(t.a, /(Linux|Mac_PowerPC|Macintosh|Windows|CrOS|PlayStation|CrKey)/, 1), "" != t ? ("Mac_PowerPC" == t ? t = "Macintosh" : "PlayStation" == t && (t = "Linux"), t) : "Unknown")
    }

    function y(t) {
        var e = w(t.a, /(OS X|Windows NT|Android) ([^;)]+)/, 2);
        if (e || (e = w(t.a, /Windows Phone( OS)? ([^;)]+)/, 2)) || (e = w(t.a, /(iPhone )?OS ([\d_]+)/, 2))) return e;
        if (e = w(t.a, /(?:Linux|CrOS|CrKey) ([^;)]+)/, 1)) for (var e = e.split(/\s/), r = 0; r < e.length; r += 1) if (/^[\d\._]+$/.test(e[r])) return e[r];
        return (t = w(t.a, /(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/, 2)) ? t : "Unknown"
    }

    function b(t) {
        var e = x(t), r = f(y(t)), n = f(w(t.a, /AppleWeb(?:K|k)it\/([\d\.\+]+)/, 1)), i = "Unknown", a = new p,
            a = "Unknown", o = !1;
        return /OPR\/[\d.]+/.test(t.a) ? i = "Opera" : -1 != t.a.indexOf("Chrome") || -1 != t.a.indexOf("CrMo") || -1 != t.a.indexOf("CriOS") ? i = "Chrome" : /Silk\/\d/.test(t.a) ? i = "Silk" : "BlackBerry" == e || "Android" == e ? i = "BuiltinBrowser" : -1 != t.a.indexOf("PhantomJS") ? i = "PhantomJS" : -1 != t.a.indexOf("Safari") ? i = "Safari" : -1 != t.a.indexOf("AdobeAIR") ? i = "AdobeAIR" : -1 != t.a.indexOf("PlayStation") && (i = "BuiltinBrowser"), "BuiltinBrowser" == i ? a = "Unknown" : "Silk" == i ? a = w(t.a, /Silk\/([\d\._]+)/, 1) : "Chrome" == i ? a = w(t.a, /(Chrome|CrMo|CriOS)\/([\d\.]+)/, 2) : -1 != t.a.indexOf("Version/") ? a = w(t.a, /Version\/([\d\.\w]+)/, 1) : "AdobeAIR" == i ? a = w(t.a, /AdobeAIR\/([\d\.]+)/, 1) : "Opera" == i ? a = w(t.a, /OPR\/([\d.]+)/, 1) : "PhantomJS" == i && (a = w(t.a, /PhantomJS\/([\d.]+)/, 1)), a = f(a), o = "AdobeAIR" == i ? 2 < a.c || 2 == a.c && 5 <= a.g : "BlackBerry" == e ? 10 <= r.c : "Android" == e ? 2 < r.c || 2 == r.c && 1 < r.g : 526 <= n.c || 525 <= n.c && 13 <= n.g, new g(i, 0, 0, 0, 0, 0, 0, new d(o, 536 > n.c || 536 == n.c && 11 > n.g))
    }

    function w(t, e, r) {
        return (t = t.match(e)) && t[r] ? t[r] : ""
    }

    function k(t) {
        this.la = t || "-"
    }

    function S(t, e) {
        this.M = t, this.Y = 4, this.N = "n";
        var r = (e || "n4").match(/^([nio])([1-9])$/i);
        r && (this.N = r[1], this.Y = parseInt(r[2], 10))
    }

    function M(t) {
        return t.N + t.Y
    }

    function A(t) {
        var e = 4, r = "n", n = null;
        return t && ((n = t.match(/(normal|oblique|italic)/i)) && n[1] && (r = n[1].substr(0, 1).toLowerCase()), (n = t.match(/([1-9]00|normal|bold)/i)) && n[1] && (/bold/i.test(n[1]) ? e = 7 : /[1-9]00/.test(n[1]) && (e = parseInt(n[1].substr(0, 1), 10)))), r + e
    }

    function z(t, e) {
        this.d = t, this.p = t.t.document.documentElement, this.P = e, this.j = "wf", this.h = new k("-"), this.ga = !1 !== e.events, this.B = !1 !== e.classes
    }

    function T(t) {
        if (t.B) {
            var e = h(t.p, t.h.e(t.j, "active")), r = [], n = [t.h.e(t.j, "loading")];
            e || r.push(t.h.e(t.j, "inactive")), l(t.p, r, n)
        }
        C(t, "inactive")
    }

    function C(t, e, r) {
        t.ga && t.P[e] && (r ? t.P[e](r.getName(), M(r)) : t.P[e]())
    }

    function B() {
        this.w = {}
    }

    function N(t, e) {
        this.d = t, this.G = e, this.m = this.d.createElement("span", {"aria-hidden": "true"}, this.G)
    }

    function L(t) {
        o(t.d, "body", t.m)
    }

    function E(t) {
        var e;
        e = [];
        for (var r = t.M.split(/,\s*/), n = 0; n < r.length; n++) {
            var i = r[n].replace(/['"]/g, "");
            -1 == i.indexOf(" ") ? e.push(i) : e.push("'" + i + "'")
        }
        return e = e.join(","), r = "normal", "o" === t.N ? r = "oblique" : "i" === t.N && (r = "italic"), "display:block;position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + e + ";" + ("font-style:" + r + ";font-weight:" + (t.Y + "00") + ";")
    }

    function O(t, e, r, n, i, a, o, s) {
        this.Z = t, this.ja = e, this.d = r, this.s = n, this.G = s || "BESbswy", this.k = i, this.I = {}, this.W = a || 3e3, this.ba = o || null, this.F = this.D = null, t = new N(this.d, this.G), L(t);
        for (var l in Q) Q.hasOwnProperty(l) && (e = new S(Q[l], M(this.s)), e = E(e), t.m.style.cssText = e, this.I[Q[l]] = t.m.offsetWidth);
        t.remove()
    }

    function I(t, e, r) {
        for (var n in Q) if (Q.hasOwnProperty(n) && e === t.I[Q[n]] && r === t.I[Q[n]]) return !0;
        return !1
    }

    function q(t) {
        var e = t.D.m.offsetWidth, r = t.F.m.offsetWidth;
        e === t.I.serif && r === t.I["sans-serif"] || t.k.fa && I(t, e, r) ? K() - t.na >= t.W ? t.k.fa && I(t, e, r) && (null === t.ba || t.ba.hasOwnProperty(t.s.getName())) ? P(t, t.Z) : P(t, t.ja) : _(t) : P(t, t.Z)
    }

    function _(t) {
        setTimeout(i(function () {
            q(this)
        }, t), 25)
    }

    function P(t, e) {
        t.D.remove(), t.F.remove(), e(t.s)
    }

    function R(t, e, r, n) {
        this.d = e, this.u = r, this.R = 0, this.da = this.aa = !1, this.W = n, this.k = t.k
    }

    function F(t, e, r, n, a) {
        if (r = r || {}, 0 === e.length && a) T(t.u); else for (t.R += e.length, a && (t.aa = a), a = 0; a < e.length; a++) {
            var o = e[a], s = r[o.getName()], h = t.u, c = o;
            h.B && l(h.p, [h.h.e(h.j, c.getName(), M(c).toString(), "loading")]), C(h, "fontloading", c), h = null, h = new O(i(t.ha, t), i(t.ia, t), t.d, o, t.k, t.W, n, s), h.start()
        }
    }

    function D(t) {
        0 == --t.R && t.aa && (t.da ? (t = t.u, t.B && l(t.p, [t.h.e(t.j, "active")], [t.h.e(t.j, "loading"), t.h.e(t.j, "inactive")]), C(t, "active")) : T(t.u))
    }

    function H(t) {
        this.J = t, this.v = new B, this.oa = new v(t.navigator.userAgent), this.a = this.oa.parse(), this.T = this.U = 0, this.Q = this.S = !0
    }

    function j(t, e, r, n, i) {
        var a = 0 == --t.U;
        (t.Q || t.S) && setTimeout(function () {
            F(e, r, n || null, i || null, a)
        }, 0)
    }

    function V(t, e, r) {
        this.O = t ? t : e + tt, this.q = [], this.V = [], this.ea = r || ""
    }

    function U(t) {
        this.q = t, this.ca = [], this.L = {}
    }

    function G(t, e) {
        this.a = new v(navigator.userAgent).parse(), this.d = t, this.f = e
    }

    function W(t, e) {
        this.d = t, this.f = e, this.o = []
    }

    function X(t, e) {
        this.d = t, this.f = e, this.o = []
    }

    function Y(t, e) {
        this.d = t, this.f = e, this.o = []
    }

    function $(t, e) {
        this.d = t, this.f = e
    }

    var K = Date.now || function () {
        return +new Date
    };
    a.prototype.createElement = function (t, e, r) {
        if (t = this.C.createElement(t), e) for (var n in e) e.hasOwnProperty(n) && ("style" == n ? t.style.cssText = e[n] : t.setAttribute(n, e[n]));
        return r && t.appendChild(this.C.createTextNode(r)), t
    };
    var Z = /^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;
    p.prototype.compare = function (t) {
        return this.c > t.c || this.c === t.c && this.g > t.g || this.c === t.c && this.g === t.g && this.A > t.A ? 1 : this.c < t.c || this.c === t.c && this.g < t.g || this.c === t.c && this.g === t.g && this.A < t.A ? -1 : 0
    }, p.prototype.toString = function () {
        return [this.c, this.g || "", this.A || "", this.e || ""].join("")
    }, g.prototype.getName = function () {
        return this.M
    };
    var J = new g("Unknown", 0, 0, 0, 0, 0, 0, new d(!1, !1));
    v.prototype.parse = function () {
        var t;
        if (-1 != this.a.indexOf("MSIE") || -1 != this.a.indexOf("Trident/")) {
            t = x(this);
            var e = f(y(this)), r = null, n = w(this.a, /Trident\/([\d\w\.]+)/, 1),
                r = f(-1 != this.a.indexOf("MSIE") ? w(this.a, /MSIE ([\d\w\.]+)/, 1) : w(this.a, /rv:([\d\w\.]+)/, 1));
            "" != n && f(n), t = new g("MSIE", 0, 0, 0, 0, 0, 0, new d("Windows" == t && 6 <= r.c || "Windows Phone" == t && 8 <= e.c, !1))
        } else if (-1 != this.a.indexOf("Opera")) t:if (t = f(w(this.a, /Presto\/([\d\w\.]+)/, 1)), f(y(this)), null !== t.c || f(w(this.a, /rv:([^\)]+)/, 1)), -1 != this.a.indexOf("Opera Mini/")) t = f(w(this.a, /Opera Mini\/([\d\.]+)/, 1)), t = new g("OperaMini", 0, 0, 0, x(this), 0, 0, new d(!1, !1)); else {
            if (-1 != this.a.indexOf("Version/") && (t = f(w(this.a, /Version\/([\d\.]+)/, 1)), null !== t.c)) {
                t = new g("Opera", 0, 0, 0, x(this), 0, 0, new d(10 <= t.c, !1));
                break t
            }
            t = f(w(this.a, /Opera[\/ ]([\d\.]+)/, 1)), t = null !== t.c ? new g("Opera", 0, 0, 0, x(this), 0, 0, new d(10 <= t.c, !1)) : new g("Opera", 0, 0, 0, x(this), 0, 0, new d(!1, !1))
        } else /OPR\/[\d.]+/.test(this.a) ? t = b(this) : /AppleWeb(K|k)it/.test(this.a) ? t = b(this) : -1 != this.a.indexOf("Gecko") ? (t = "Unknown", e = new p, f(y(this)), e = !1, -1 != this.a.indexOf("Firefox") ? (t = "Firefox", e = f(w(this.a, /Firefox\/([\d\w\.]+)/, 1)), e = 3 <= e.c && 5 <= e.g) : -1 != this.a.indexOf("Mozilla") && (t = "Mozilla"), r = f(w(this.a, /rv:([^\)]+)/, 1)), e || (e = 1 < r.c || 1 == r.c && 9 < r.g || 1 == r.c && 9 == r.g && 2 <= r.A), t = new g(t, 0, 0, 0, x(this), 0, 0, new d(e, !1))) : t = J;
        return t
    }, k.prototype.e = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t.push(arguments[e].replace(/[\W_]+/g, "").toLowerCase());
        return t.join(this.la)
    }, S.prototype.getName = function () {
        return this.M
    }, N.prototype.remove = function () {
        var t = this.m;
        t.parentNode && t.parentNode.removeChild(t)
    };
    var Q = {ra: "serif", qa: "sans-serif", pa: "monospace"};
    O.prototype.start = function () {
        this.D = new N(this.d, this.G), L(this.D), this.F = new N(this.d, this.G), L(this.F), this.na = K();
        var t = new S(this.s.getName() + ",serif", M(this.s)), t = E(t);
        this.D.m.style.cssText = t, t = new S(this.s.getName() + ",sans-serif", M(this.s)), t = E(t), this.F.m.style.cssText = t, q(this)
    }, R.prototype.ha = function (t) {
        var e = this.u;
        e.B && l(e.p, [e.h.e(e.j, t.getName(), M(t).toString(), "active")], [e.h.e(e.j, t.getName(), M(t).toString(), "loading"), e.h.e(e.j, t.getName(), M(t).toString(), "inactive")]), C(e, "fontactive", t), this.da = !0, D(this)
    }, R.prototype.ia = function (t) {
        var e = this.u;
        if (e.B) {
            var r = h(e.p, e.h.e(e.j, t.getName(), M(t).toString(), "active")), n = [],
                i = [e.h.e(e.j, t.getName(), M(t).toString(), "loading")];
            r || n.push(e.h.e(e.j, t.getName(), M(t).toString(), "inactive")), l(e.p, n, i)
        }
        C(e, "fontinactive", t), D(this)
    }, H.prototype.load = function (t) {
        this.d = new a(this.J, t.context || this.J), this.S = !1 !== t.events, this.Q = !1 !== t.classes;
        var e = new z(this.d, t), r = [], n = t.timeout;
        e.B && l(e.p, [e.h.e(e.j, "loading")]), C(e, "loading");
        var o, r = this.v, s = this.d, h = [];
        for (o in t) if (t.hasOwnProperty(o)) {
            var c = r.w[o];
            c && h.push(c(t[o], s))
        }
        for (r = h, this.T = this.U = r.length, t = new R(this.a, this.d, e, n), n = 0, o = r.length; n < o; n++) s = r[n], s.K(this.a, i(this.ka, this, s, e, t))
    }, H.prototype.ka = function (t, e, r, n) {
        var i = this;
        n ? t.load(function (t, e, n) {
            j(i, r, t, e, n)
        }) : (t = 0 == --this.U, this.T--, t && 0 == this.T ? T(e) : (this.Q || this.S) && F(r, [], {}, null, t))
    };
    var tt = "//fonts.googleapis.com/css";
    V.prototype.e = function () {
        if (0 == this.q.length) throw Error("No fonts to load!");
        if (-1 != this.O.indexOf("kit=")) return this.O;
        for (var t = this.q.length, e = [], r = 0; r < t; r++) e.push(this.q[r].replace(/ /g, "+"));
        return t = this.O + "?family=" + e.join("%7C"), 0 < this.V.length && (t += "&subset=" + this.V.join(",")), 0 < this.ea.length && (t += "&text=" + encodeURIComponent(this.ea)), t
    };
    var et = {
            latin: "BESbswy",
            cyrillic: "&#1081;&#1103;&#1046;",
            greek: "&#945;&#946;&#931;",
            khmer: "&#x1780;&#x1781;&#x1782;",
            Hanuman: "&#x1780;&#x1781;&#x1782;"
        }, rt = {
            thin: "1",
            extralight: "2",
            "extra-light": "2",
            ultralight: "2",
            "ultra-light": "2",
            light: "3",
            regular: "4",
            book: "4",
            medium: "5",
            "semi-bold": "6",
            semibold: "6",
            "demi-bold": "6",
            demibold: "6",
            bold: "7",
            "extra-bold": "8",
            extrabold: "8",
            "ultra-bold": "8",
            ultrabold: "8",
            black: "9",
            heavy: "9",
            l: "3",
            r: "4",
            b: "7"
        }, nt = {i: "i", italic: "i", n: "n", normal: "n"},
        it = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
    U.prototype.parse = function () {
        for (var t = this.q.length, e = 0; e < t; e++) {
            var r = this.q[e].split(":"), n = r[0].replace(/\+/g, " "), i = ["n4"];
            if (2 <= r.length) {
                var a, o = r[1];
                if (a = [], o) for (var o = o.split(","), s = o.length, l = 0; l < s; l++) {
                    var h;
                    if (h = o[l], h.match(/^[\w-]+$/)) {
                        h = it.exec(h.toLowerCase());
                        var c = void 0;
                        if (null == h) c = ""; else {
                            if (c = void 0, c = h[1], null == c || "" == c) c = "4"; else var m = rt[c],
                                c = m ? m : isNaN(c) ? "4" : c.substr(0, 1);
                            h = h[2], c = [null == h || "" == h ? "n" : nt[h], c].join("")
                        }
                        h = c
                    } else h = "";
                    h && a.push(h)
                }
                0 < a.length && (i = a), 3 == r.length && (r = r[2], a = [], r = r ? r.split(",") : a, 0 < r.length && (r = et[r[0]]) && (this.L[n] = r))
            }
            for (this.L[n] || (r = et[n]) && (this.L[n] = r), r = 0; r < i.length; r += 1) this.ca.push(new S(n, i[r]))
        }
    };
    var at = {Arimo: !0, Cousine: !0, Tinos: !0};
    G.prototype.K = function (t, e) {
        e(t.k.X)
    }, G.prototype.load = function (t) {
        var e = this.d;
        "MSIE" == this.a.getName() && 1 != this.f.blocking ? s(e, i(this.$, this, t)) : this.$(t)
    }, G.prototype.$ = function (t) {
        for (var e = this.d, r = new V(this.f.api, c(e), this.f.text), n = this.f.families, i = n.length, a = 0; a < i; a++) {
            var o = n[a].split(":");
            3 == o.length && r.V.push(o.pop());
            var s = "";
            2 == o.length && "" != o[1] && (s = ":"), r.q.push(o.join(s))
        }
        n = new U(n), n.parse(), m(e, r.e()), t(n.ca, n.L, at)
    }, W.prototype.H = function (t) {
        var e = this.d;
        return c(this.d) + (this.f.api || "//f.fontdeck.com/s/css/js/") + (e.t.location.hostname || e.J.location.hostname) + "/" + t + ".js"
    }, W.prototype.K = function (t, e) {
        var r = this.f.id, n = this.d.t, i = this;
        r ? (n.__webfontfontdeckmodule__ || (n.__webfontfontdeckmodule__ = {}), n.__webfontfontdeckmodule__[r] = function (t, r) {
            for (var n = 0, a = r.fonts.length; n < a; ++n) {
                var o = r.fonts[n];
                i.o.push(new S(o.name, A("font-weight:" + o.weight + ";font-style:" + o.style)))
            }
            e(t)
        }, u(this.d, this.H(r), function (t) {
            t && e(!1)
        })) : e(!1)
    }, W.prototype.load = function (t) {
        t(this.o)
    }, X.prototype.H = function (t) {
        var e = c(this.d);
        return (this.f.api || e + "//use.typekit.net") + "/" + t + ".js"
    }, X.prototype.K = function (t, e) {
        var r = this.f.id, n = this.d.t, i = this;
        r ? u(this.d, this.H(r), function (t) {
            if (t) e(!1); else {
                if (n.Typekit && n.Typekit.config && n.Typekit.config.fn) {
                    t = n.Typekit.config.fn;
                    for (var r = 0; r < t.length; r += 2) for (var a = t[r], o = t[r + 1], s = 0; s < o.length; s++) i.o.push(new S(a, o[s]));
                    try {
                        n.Typekit.load({events: !1, classes: !1})
                    } catch (t) {
                    }
                }
                e(!0)
            }
        }, 2e3) : e(!1)
    }, X.prototype.load = function (t) {
        t(this.o)
    }, Y.prototype.K = function (t, e) {
        var r = this, n = r.f.projectId, i = r.f.version;
        if (n) {
            var a = r.d.t;
            u(this.d, r.H(n, i), function (i) {
                if (i) e(!1); else {
                    if (a["__mti_fntLst" + n] && (i = a["__mti_fntLst" + n]())) for (var o = 0; o < i.length; o++) r.o.push(new S(i[o].fontfamily));
                    e(t.k.X)
                }
            }).id = "__MonotypeAPIScript__" + n
        } else e(!1)
    }, Y.prototype.H = function (t, e) {
        var r = c(this.d), n = (this.f.api || "fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/, "");
        return r + "//" + n + "/" + t + ".js" + (e ? "?v=" + e : "")
    }, Y.prototype.load = function (t) {
        t(this.o)
    }, $.prototype.load = function (t) {
        var e, r, n = this.f.urls || [], i = this.f.families || [], a = this.f.testStrings || {};
        for (e = 0, r = n.length; e < r; e++) m(this.d, n[e]);
        for (n = [], e = 0, r = i.length; e < r; e++) {
            var o = i[e].split(":");
            if (o[1]) for (var s = o[1].split(","), l = 0; l < s.length; l += 1) n.push(new S(o[0], s[l])); else n.push(new S(o[0]))
        }
        t(n, a)
    }, $.prototype.K = function (t, e) {
        return e(t.k.X)
    };
    var ot = new H(this);
    ot.v.w.custom = function (t, e) {
        return new $(e, t)
    }, ot.v.w.fontdeck = function (t, e) {
        return new W(e, t)
    }, ot.v.w.monotype = function (t, e) {
        return new Y(e, t)
    }, ot.v.w.typekit = function (t, e) {
        return new X(e, t)
    }, ot.v.w.google = function (t, e) {
        return new G(e, t)
    }, this.WebFont || (this.WebFont = {}, this.WebFont.load = i(ot.load, ot), this.WebFontConfig && ot.load(this.WebFontConfig))
}(this, document), window.SL = function (t) {
    t = t.split(".");
    for (var e = SL; t.length;) {
        var r = t.shift();
        e[r] || (e[r] = {}), e = e[r]
    }
    return e
}, function () {
    function t() {
        e || (e = !0, "undefined" == typeof SLConfig && (window.SLConfig = {}), SL.fonts.init(), SL.view = new SL.views.decks.Export, SL.deck.Controller.init())
    }

    var e = !1;
    "complete" === document.readyState ? setTimeout(t, 1) : "interactive" === document.readyState ? (document.onreadystatechange = function () {
        "complete" == document.readyState && setTimeout(t, 1)
    }, window.addEventListener("load", t)) : (document.addEventListener("DOMContentLoaded", t), window.addEventListener("load", t))
}(), SL.fonts = {
    INIT_TIMEOUT: 5e3,
    FONTS_URL: SLConfig.fonts_url || "fonts/",
    FAMILIES: {
        montserrat: {id: "montserrat", name: "Montserrat", path: "montserrat/montserrat.css"},
        opensans: {id: "opensans", name: "Open Sans", path: "opensans/opensans.css"},
        lato: {id: "lato", name: "Lato", path: "lato/lato.css"},
        asul: {id: "asul", name: "Asul", path: "asul/asul.css"},
        josefinsans: {id: "josefinsans", name: "Josefin Sans", path: "josefinsans/josefinsans.css"},
        league: {id: "league", name: "League Gothic", path: "league/league_gothic.css"},
        merriweathersans: {
            id: "merriweathersans",
            name: "Merriweather Sans",
            path: "merriweathersans/merriweathersans.css"
        },
        overpass: {id: "overpass", name: "Overpass", path: "overpass/overpass.css"},
        overpass2: {id: "overpass2", name: "Overpass 2", path: "overpass2/overpass2.css"},
        quicksand: {id: "quicksand", name: "Quicksand", path: "quicksand/quicksand.css"},
        cabinsketch: {id: "cabinsketch", name: "Cabin Sketch", path: "cabinsketch/cabinsketch.css"},
        newscycle: {id: "newscycle", name: "News Cycle", path: "newscycle/newscycle.css"},
        oxygen: {id: "oxygen", name: "Oxygen", path: "oxygen/oxygen.css"}
    },
    PACKAGES: {
        asul: ["asul"],
        helvetica: [],
        josefine: ["josefinsans", "lato"],
        league: ["league", "lato"],
        merriweather: ["merriweathersans", "oxygen"],
        news: ["newscycle", "lato"],
        montserrat: ["montserrat", "opensans"],
        opensans: ["opensans"],
        overpass: ["overpass"],
        overpass2: ["overpass2"],
        palatino: [],
        quicksand: ["quicksand", "opensans"],
        sketch: ["cabinsketch", "oxygen"]
    },
    init: function () {
        if (this._isReady = !1, this.ready = new signals.Signal, this.loaded = new signals.Signal, this.fontactive = new signals.Signal, this.fontinactive = new signals.Signal, this.debugMode = !!/debug/gi.test(location.search), [].slice.call(document.querySelectorAll("link[data-application-font]")).forEach(function (t) {
            var e = t.getAttribute("data-application-font");
            SL.fonts.FAMILIES[e] && (SL.fonts.FAMILIES[e].loaded = !0)
        }), SLConfig && SLConfig.deck) {
            var t = SL.config ? SL.config.DEFAULT_THEME_FONT : "montserrat",
                e = this.loadDeckFont([SLConfig.deck.theme_font || t], {
                    active: this.onInitialFontsActive.bind(this),
                    inactive: this.onInitialFontsInactive.bind(this)
                });
            e ? this.initTimeout = setTimeout(function () {
                this.debugMode && console.log("SL.fonts", "timed out"), this.finishLoading()
            }.bind(this), SL.fonts.INIT_TIMEOUT) : this.finishLoading()
        } else this.finishLoading()
    },
    load: function (t, e) {
        var r = {
            classes: !1,
            fontactive: this.onFontActive.bind(this),
            fontinactive: this.onFontInactive.bind(this),
            custom: {families: [], urls: []}
        };
        for (var n in e) r[n] = e[n];
        SLConfig && SLConfig.deck && (SLConfig.deck.font_typekit && (r.typekit = {id: SLConfig.deck.font_typekit}), SLConfig.deck.font_google && (r.google = r.google || {families: []}, r.google.families = r.google.families.concat(SL.fonts.parseGoogleFontFamilies(SLConfig.deck.font_google)))), SLConfig && SLConfig.theme && (SLConfig.theme.font_typekit && (r.typekit = {id: SLConfig.theme.font_typekit}), SLConfig.theme.font_google && (r.google = r.google || {families: []}, r.google.families = r.google.families.concat(SL.fonts.parseGoogleFontFamilies(SLConfig.theme.font_google))));
        var i = [];
        return r.google && r.google.families && (i = r.google.families.map(function (t) {
            return t.split(":")[0]
        })), t.forEach(function (t) {
            var e = SL.fonts.FAMILIES[t];
            e ? e.loaded || i.indexOf(e.name) !== -1 ? "function" == typeof r.fontactive && r.fontactive(e.name) : (e.loaded = !0, r.custom.families.push(e.name), r.custom.urls.push(SL.fonts.FONTS_URL + e.path)) : console.warn('Could not find font family with id "' + t + '"')
        }), this.debugMode && console.log("SL.fonts.load", r.custom.families), !!(r.custom.families.length || r.typekit || r.google) && (WebFont.load(r), !0)
    },
    loadAll: function (t) {
        var e = [];
        for (var r in SL.fonts.FAMILIES) e.push(r);
        this.load(e, t)
    },
    loadDeckFont: function (t, e) {
        var r = SL.fonts.PACKAGES[t];
        return r ? SL.fonts.load(r, e) : SL.fonts.load([], e)
    },
    loadGoogleFont: function (t) {
        WebFont.load({google: {families: SL.fonts.parseGoogleFontFamilies(t)}})
    },
    loadTypekitFont: function (t) {
        WebFont.load({typekit: {id: t}})
    },
    parseGoogleFontFamilies: function (t) {
        return t = (t || "").trim().split(", "), t = t.map(function (t) {
            return t.trim().replace(/(^,)|(,$)/gi, "")
        }), t = t.filter(function (t) {
            return "string" == typeof t && t.length > 0
        })
    },
    unload: function (t) {
        t.forEach(function (t) {
            var e = SL.fonts.FAMILIES[t];
            e && (e.loaded = !1, [].slice.call(document.querySelectorAll('link[href="' + SL.fonts.FONTS_URL + e.path + '"]')).forEach(function (t) {
                t.parentNode.removeChild(t)
            }))
        })
    },
    finishLoading: function () {
        clearTimeout(this.initTimeout), document.documentElement.classList.add("fonts-are-ready"), this._isReady === !1 && (this._isReady = !0, this.ready.dispatch()), this.loaded.dispatch()
    },
    getPackageIDs: function () {
        return Object.keys(SL.fonts.PACKAGES)
    },
    getFamilyByName: function (t) {
        for (var e in SL.fonts.FAMILIES) {
            var r = SL.fonts.FAMILIES[e];
            if (t === r.name) return r
        }
    },
    isPackageLoaded: function (t) {
        var e = SL.fonts.PACKAGES[t];
        return !e || (0 === e.length || e.every(function (t) {
            var e = SL.fonts.FAMILIES[t];
            return e.active || e.inactive
        }))
    },
    isReady: function () {
        return this._isReady
    },
    onFontActive: function (t) {
        var e = SL.fonts.getFamilyByName(t);
        e && (e.active = !0), this.fontactive.dispatch(e)
    },
    onFontInactive: function (t) {
        var e = SL.fonts.getFamilyByName(t);
        e && (e.inactive = !0), this.fontinactive.dispatch(e)
    },
    onInitialFontsActive: function () {
        this.finishLoading()
    },
    onInitialFontsInactive: function () {
        this.finishLoading()
    }
}, SL("views.decks").Export = Class.extend({
    init: function () {
        SL.deck.util.injectNotes(), SL.deck.util.renderMath(), SL.deck.util.injectCodeCopyButtons(), window.Reveal && Reveal.isReady() && (Reveal.sync(), Reveal.layout())
    }
}), SL("deck").Animation = {
    init: function () {
        this.animationListeners = [], this.animationsEnabled = !0, this.run = this.run.bind(this), this.reset = this.reset.bind(this), this.toggle = this.toggle.bind(this), this.onSlideChanged = this.onSlideChanged.bind(this), Reveal.addEventListener("slidechanged", this.onSlideChanged), this.revealElement = document.querySelector(".reveal"), this.interactiveAnimationChanged = new signals.Signal
    }, sync: function () {
        this.animationsEnabled ? this.enableAnimations() : this.disableAnimations()
    }, enableAnimations: function () {
        this.animationsEnabled = !0, this.revealElement.classList.remove("block-animations-disabled"), this.reset(this.revealElement);
        var t = Reveal.getCurrentSlide();
        this.fastForwardAnimation(t, function () {
            this.run(t), this.bind(t)
        }.bind(this))
    }, disableAnimations: function () {
        this.animationsEnabled = !1, this.revealElement.classList.add("block-animations-disabled"), this.unbind(), this.fastForwardAnimation(this.revealElement)
    }, getAnimationTargets: function (t) {
        return t instanceof Array ? t : t.hasAttribute("data-animation-type") ? [t] : [].slice.call(t.querySelectorAll("[data-animation-type]"))
    }, getInteractiveAnimationTargets: function (t, e) {
        var r = e ? ".animate" : "";
        return [].slice.call(t.querySelectorAll(['[data-animation-trigger="click"]', '[data-animation-trigger="hover"]'].join(r + ",") + r))
    }, run: function (t, e) {
        this.getAnimationTargets(t).forEach(function (t) {
            !e && this.hasInteractiveAnimationTrigger(t) || t.classList.add("animate")
        }.bind(this))
    }, toggle: function (t, e) {
        this.getAnimationTargets(t).forEach(function (t) {
            !e && this.hasInteractiveAnimationTrigger(t) || t.classList.toggle("animate")
        }.bind(this))
    }, reset: function (t) {
        this.getAnimationTargets(t).forEach(function (t) {
            t.classList.remove("animate")
        }.bind(this))
    }, preview: function (t) {
        this.animationsEnabled === !1 && this.revealElement.classList.remove("block-animations-disabled"), this.getAnimationTargets(t).forEach(function (t) {
            t.classList.remove("animate"), this.fastForwardAnimation(t, function () {
                t.classList.add("animate"), this.animationsEnabled === !1 && this.revealElement.classList.add("block-animations-disabled")
            }.bind(this))
        }.bind(this))
    }, bind: function (t) {
        this.unbind(), this.getAnimationTargets(t).forEach(function (e) {
            if (this.hasInteractiveAnimationTrigger(e)) {
                var r = e.getAttribute("data-animation-trigger-id"),
                    n = "self" === r ? e : t.querySelector('.sl-block[data-block-id="' + r + '"] .sl-block-content');
                if (n) {
                    var i = e.getAttribute("data-animation-trigger");
                    "click" === i ? (this.addAnimationEventListener(n, "touchstart", this.onTriggerTouchStart.bind(this, e)), this.addAnimationEventListener(n, "click", this.onTriggerClick.bind(this, e))) : "hover" === i && (this.addAnimationEventListener(n, "mouseover", this.onTriggerMouseOver.bind(this, e)), this.addAnimationEventListener(n, "mouseout", this.onTriggerMouseOut.bind(this, e)))
                }
            }
        }.bind(this))
    }, addAnimationEventListener: function (t, e, r) {
        t.addEventListener(e, r), /click|touchstart/gi.test(e) && t.classList.add("animation-trigger"), this.animationListeners.push([t, e, r])
    }, unbind: function () {
        this.animationListeners.forEach(function (t) {
            var e = t[0], r = t[1], n = t[2];
            /click|touchstart/gi.test(r) && e.classList.remove("animation-trigger"), e.removeEventListener(r, n)
        }), this.animationListeners.length = 0
    }, hasInteractiveAnimationTrigger: function (t) {
        return /click|hover/gi.test(t.getAttribute("data-animation-trigger"))
    }, fastForwardAnimation: function (t, e) {
        t.classList.add("no-transition"), setTimeout(function () {
            t.classList.remove("no-transition"), "function" == typeof e && e()
        }, 1)
    }, getSerializedInteractiveState: function () {
        return this.getInteractiveAnimationTargets(Reveal.getCurrentSlide(), !0).map(function (t) {
            var e = this.getParentBlock(t);
            return e ? e.getAttribute("data-block-id") : null
        }, this).filter(function (t) {
            return "string" == typeof t
        }).join(",")
    }, setSerializedInteractiveState: function (t) {
        var e = this.getInteractiveAnimationTargets(Reveal.getCurrentSlide());
        if (e.length && "string" == typeof t) {
            t = t.split(",");
            var r = [], n = [];
            e.forEach(function (e) {
                var i = this.getParentBlock(e), a = i ? i.getAttribute("data-block-id") : null;
                "string" == typeof a && t.indexOf(a) !== -1 ? n.push(e) : r.push(e)
            }, this), this.reset(r), this.run(n, !0)
        }
    }, getParentBlock: function (t) {
        for (var e = t.parentNode; e && !e.hasAttribute("data-block-id");) e = e.parentNode;
        return e
    }, onSlideChanged: function (t) {
        this.animationsEnabled && (t.previousSlide && (this.reset(t.previousSlide), this.unbind()), t.currentSlide && (this.run(t.currentSlide), this.bind(t.currentSlide)))
    }, onTriggerTouchStart: function (t, e) {
        e.preventDefault(), this.toggle(t, !0), this.interactiveAnimationChanged.dispatch()
    }, onTriggerClick: function (t) {
        Reveal.isAutoSliding() && Reveal.getConfig().autoSlideStoppable && Reveal.toggleAutoSlide(!1), this.toggle(t, !0), this.interactiveAnimationChanged.dispatch()
    }, onTriggerMouseOver: function (t) {
        this.run(t, !0), this.interactiveAnimationChanged.dispatch()
    }, onTriggerMouseOut: function (t) {
        this.reset(t), this.interactiveAnimationChanged.dispatch()
    }
}, SL("deck").Controller = {
    MODE_VIEWING: "viewing",
    MODE_EDITING: "editing",
    MODE_PRINTING: "printing",
    init: function (t) {
        this.options = t || {}, this.mode = null, Reveal.isReady() ? this.setup() : Reveal.addEventListener("ready", this.setup.bind(this))
    },
    setup: function () {
        SL.deck.Animation.init(), this.setMode(this.options.mode || SL.deck.Controller.MODE_VIEWING)
    },
    setMode: function (t) {
        this.mode = t, this.mode === SL.deck.Controller.MODE_EDITING || this.mode === SL.deck.Controller.MODE_PRINTING ? SL.deck.Animation.disableAnimations() : SL.deck.Animation.enableAnimations()
    }
}, SL("deck").util = {
    renderMath: function (t) {
        SL.deck.util.renderMathBlocks(t), SL.deck.util.renderInlineMath(t)
    }, renderMathBlocks: function (t) {
        t || (t = document.querySelector(".reveal .slides")), window.katex && "function" == typeof window.katex.render && [].slice.call(t.querySelectorAll('.sl-block[data-block-type="math"]')).forEach(function (t) {
            var e = t.querySelector(".math-input"), r = t.querySelector(".math-output");
            e && !r && (r = document.createElement("div"), r.className = "math-output", e.parentNode.insertBefore(r, e)), e && r && katex.render(e.innerText, r)
        })
    }, renderInlineMath: function (t) {
        t || (t = document.querySelector(".reveal .slides")), "function" == typeof window.renderMathInElement && SL.deck.util.containsInlineMath(t) && renderMathInElement(t, {
            delimiters: [{
                left: "$$",
                right: "$$",
                display: !0
            }, {left: "\\[", right: "\\]", display: !0}, {left: "\\(", right: "\\)", display: !1}]
        })
    }, containsInlineMath: function (t) {
        return !!t && /\$\$.+\$\$|\\\[.+\\\]|\\\(.+\\\)/g.test(t.innerHTML)
    }, injectCodeCopyButtons: function () {
        var t = [].slice.call(document.querySelectorAll('.sl-block[data-block-type="code"] .sl-block-content:not(.has-copy-button)'));
        t.length && (this.copyButton = document.createElement("button"), this.copyButton.className = "copy-code-to-clipboard", this.copyButton.textContent = "Copy", this.copyButton.addEventListener("click", function () {
            this.copyButton.hasAttribute("data-code-to-copy") && (this.copyButton.textContent = "Copied!", this.copyButton.classList.add("bounce"), SL.deck.util.copyToClipboard(this.copyButton.getAttribute("data-code-to-copy")), setTimeout(function () {
                this.copyButton.textContent = "Copy", this.copyButton.classList.remove("bounce")
            }.bind(this), 1500))
        }.bind(this)), t.forEach(function (t) {
            var e, r = t.querySelector("pre code");
            r && (e = r.textContent), e && t.addEventListener("mouseenter", function (t) {
                this.copyButton.setAttribute("data-code-to-copy", e), t.currentTarget.classList.add("has-copy-button"), t.currentTarget.appendChild(this.copyButton)
            }.bind(this))
        }, this))
    }, hasNotes: function () {
        if (SLConfig.deck && SLConfig.deck.notes) for (var t in SLConfig.deck.notes) return !0;
        return document.querySelectorAll(".reveal .slides section[data-notes]").length > 0
    }, injectNotes: function () {
        SLConfig.deck && SLConfig.deck.notes && [].forEach.call(document.querySelectorAll(".reveal .slides section"), function (t) {
            var e = SLConfig.deck.notes[t.getAttribute("data-id")];
            e && "string" == typeof e && t.setAttribute("data-notes", e)
        })
    }, injectTranslationRules: function () {
        $(".sl-block .katex").addClass("notranslate")
    }, copyToClipboard: function (t) {
        var e = document.createElement("textarea");
        e.value = t, document.body.appendChild(e), e.select();
        var r = document.execCommand("copy");
        return document.body.removeChild(e), r
    }
};