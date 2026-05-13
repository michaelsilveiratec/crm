(function () {
  const r = document.createElement("link").relList;
  if (r && r.supports && r.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) o(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === "childList")
        for (const s of i.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && o(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(n) {
    const i = {};
    return (
      n.integrity && (i.integrity = n.integrity),
      n.referrerPolicy && (i.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : n.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function o(n) {
    if (n.ep) return;
    n.ep = !0;
    const i = a(n);
    fetch(n.href, i);
  }
})();
var Qe,
  L,
  tr,
  me,
  kt,
  rr,
  ar,
  at,
  Oe,
  Be,
  ir,
  vt,
  ht,
  ut,
  qe = {},
  Ge = [],
  Rr = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  Xe = Array.isArray;
function se(t, r) {
  for (var a in r) t[a] = r[a];
  return t;
}
function _t(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function Fr(t, r, a) {
  var o,
    n,
    i,
    s = {};
  for (i in r)
    i == "key" ? (o = r[i]) : i == "ref" ? (n = r[i]) : (s[i] = r[i]);
  if (
    (arguments.length > 2 &&
      (s.children = arguments.length > 3 ? Qe.call(arguments, 2) : a),
    typeof t == "function" && t.defaultProps != null)
  )
    for (i in t.defaultProps) s[i] === void 0 && (s[i] = t.defaultProps[i]);
  return Le(t, s, o, n, null);
}
function Le(t, r, a, o, n) {
  var i = {
    type: t,
    props: r,
    key: a,
    ref: o,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: n ?? ++tr,
    __i: -1,
    __u: 0,
  };
  return (n == null && L.vnode != null && L.vnode(i), i);
}
function J(t) {
  return t.children;
}
function Ve(t, r) {
  ((this.props = t), (this.context = r));
}
function xe(t, r) {
  if (r == null) return t.__ ? xe(t.__, t.__i + 1) : null;
  for (var a; r < t.__k.length; r++)
    if ((a = t.__k[r]) != null && a.__e != null) return a.__e;
  return typeof t.type == "function" ? xe(t) : null;
}
function Wr(t) {
  if (t.__P && t.__d) {
    var r = t.__v,
      a = r.__e,
      o = [],
      n = [],
      i = se({}, r);
    ((i.__v = r.__v + 1),
      L.vnode && L.vnode(i),
      xt(
        t.__P,
        i,
        r,
        t.__n,
        t.__P.namespaceURI,
        32 & r.__u ? [a] : null,
        o,
        a ?? xe(r),
        !!(32 & r.__u),
        n,
      ),
      (i.__v = r.__v),
      (i.__.__k[i.__i] = i),
      sr(o, i, n),
      (r.__e = r.__ = null),
      i.__e != a && or(i));
  }
}
function or(t) {
  if ((t = t.__) != null && t.__c != null)
    return (
      (t.__e = t.__c.base = null),
      t.__k.some(function (r) {
        if (r != null && r.__e != null) return (t.__e = t.__c.base = r.__e);
      }),
      or(t)
    );
}
function At(t) {
  ((!t.__d && (t.__d = !0) && me.push(t) && !Je.__r++) ||
    kt != L.debounceRendering) &&
    ((kt = L.debounceRendering) || rr)(Je);
}
function Je() {
  try {
    for (var t, r = 1; me.length; )
      (me.length > r && me.sort(ar), (t = me.shift()), (r = me.length), Wr(t));
  } finally {
    me.length = Je.__r = 0;
  }
}
function nr(t, r, a, o, n, i, s, d, f, h, p) {
  var l,
    m,
    u,
    y,
    k,
    T,
    v,
    b = (o && o.__k) || Ge,
    x = r.length;
  for (f = Pr(a, r, b, f, x), l = 0; l < x; l++)
    (u = a.__k[l]) != null &&
      ((m = (u.__i != -1 && b[u.__i]) || qe),
      (u.__i = l),
      (T = xt(t, u, m, n, i, s, d, f, h, p)),
      (y = u.__e),
      u.ref &&
        m.ref != u.ref &&
        (m.ref && St(m.ref, null, u), p.push(u.ref, u.__c || y, u)),
      k == null && y != null && (k = y),
      (v = !!(4 & u.__u)) || m.__k === u.__k
        ? ((f = lr(u, f, t, v)), v && m.__e && (m.__e = null))
        : typeof u.type == "function" && T !== void 0
          ? (f = T)
          : y && (f = y.nextSibling),
      (u.__u &= -7));
  return ((a.__e = k), f);
}
function Pr(t, r, a, o, n) {
  var i,
    s,
    d,
    f,
    h,
    p = a.length,
    l = p,
    m = 0;
  for (t.__k = new Array(n), i = 0; i < n; i++)
    (s = r[i]) != null && typeof s != "boolean" && typeof s != "function"
      ? (typeof s == "string" ||
        typeof s == "number" ||
        typeof s == "bigint" ||
        s.constructor == String
          ? (s = t.__k[i] = Le(null, s, null, null, null))
          : Xe(s)
            ? (s = t.__k[i] = Le(J, { children: s }, null, null, null))
            : s.constructor === void 0 && s.__b > 0
              ? (s = t.__k[i] =
                  Le(s.type, s.props, s.key, s.ref ? s.ref : null, s.__v))
              : (t.__k[i] = s),
        (f = i + m),
        (s.__ = t),
        (s.__b = t.__b + 1),
        (d = null),
        (h = s.__i = jr(s, a, f, l)) != -1 && (l--, (d = a[h]) && (d.__u |= 2)),
        d == null || d.__v == null
          ? (h == -1 && (n > p ? m-- : n < p && m++),
            typeof s.type != "function" && (s.__u |= 4))
          : h != f &&
            (h == f - 1
              ? m--
              : h == f + 1
                ? m++
                : (h > f ? m-- : m++, (s.__u |= 4))))
      : (t.__k[i] = null);
  if (l)
    for (i = 0; i < p; i++)
      (d = a[i]) != null &&
        !(2 & d.__u) &&
        (d.__e == o && (o = xe(d)), cr(d, d));
  return o;
}
function lr(t, r, a, o) {
  var n, i;
  if (typeof t.type == "function") {
    for (n = t.__k, i = 0; n && i < n.length; i++)
      n[i] && ((n[i].__ = t), (r = lr(n[i], r, a, o)));
    return r;
  }
  t.__e != r &&
    (o &&
      (r && t.type && !r.parentNode && (r = xe(t)),
      a.insertBefore(t.__e, r || null)),
    (r = t.__e));
  do r = r && r.nextSibling;
  while (r != null && r.nodeType == 8);
  return r;
}
function jr(t, r, a, o) {
  var n,
    i,
    s,
    d = t.key,
    f = t.type,
    h = r[a],
    p = h != null && (2 & h.__u) == 0;
  if ((h === null && d == null) || (p && d == h.key && f == h.type)) return a;
  if (o > (p ? 1 : 0)) {
    for (n = a - 1, i = a + 1; n >= 0 || i < r.length; )
      if (
        (h = r[(s = n >= 0 ? n-- : i++)]) != null &&
        !(2 & h.__u) &&
        d == h.key &&
        f == h.type
      )
        return s;
  }
  return -1;
}
function Et(t, r, a) {
  r[0] == "-"
    ? t.setProperty(r, a ?? "")
    : (t[r] =
        a == null ? "" : typeof a != "number" || Rr.test(r) ? a : a + "px");
}
function We(t, r, a, o, n) {
  var i, s;
  e: if (r == "style")
    if (typeof a == "string") t.style.cssText = a;
    else {
      if ((typeof o == "string" && (t.style.cssText = o = ""), o))
        for (r in o) (a && r in a) || Et(t.style, r, "");
      if (a) for (r in a) (o && a[r] == o[r]) || Et(t.style, r, a[r]);
    }
  else if (r[0] == "o" && r[1] == "n")
    ((i = r != (r = r.replace(ir, "$1"))),
      (s = r.toLowerCase()),
      (r =
        s in t || r == "onFocusOut" || r == "onFocusIn"
          ? s.slice(2)
          : r.slice(2)),
      t.l || (t.l = {}),
      (t.l[r + i] = a),
      a
        ? o
          ? (a[Be] = o[Be])
          : ((a[Be] = vt), t.addEventListener(r, i ? ut : ht, i))
        : t.removeEventListener(r, i ? ut : ht, i));
  else {
    if (n == "http://www.w3.org/2000/svg")
      r = r.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      r != "width" &&
      r != "height" &&
      r != "href" &&
      r != "list" &&
      r != "form" &&
      r != "tabIndex" &&
      r != "download" &&
      r != "rowSpan" &&
      r != "colSpan" &&
      r != "role" &&
      r != "popover" &&
      r in t
    )
      try {
        t[r] = a ?? "";
        break e;
      } catch {}
    typeof a == "function" ||
      (a == null || (a === !1 && r[4] != "-")
        ? t.removeAttribute(r)
        : t.setAttribute(r, r == "popover" && a == 1 ? "" : a));
  }
}
function Nt(t) {
  return function (r) {
    if (this.l) {
      var a = this.l[r.type + t];
      if (r[Oe] == null) r[Oe] = vt++;
      else if (r[Oe] < a[Be]) return;
      return a(L.event ? L.event(r) : r);
    }
  };
}
function xt(t, r, a, o, n, i, s, d, f, h) {
  var p,
    l,
    m,
    u,
    y,
    k,
    T,
    v,
    b,
    x,
    C,
    z,
    A,
    R,
    P,
    I = r.type;
  if (r.constructor !== void 0) return null;
  (128 & a.__u && ((f = !!(32 & a.__u)), (i = [(d = r.__e = a.__e)])),
    (p = L.__b) && p(r));
  e: if (typeof I == "function")
    try {
      if (
        ((v = r.props),
        (b = I.prototype && I.prototype.render),
        (x = (p = I.contextType) && o[p.__c]),
        (C = p ? (x ? x.props.value : p.__) : o),
        a.__c
          ? (T = (l = r.__c = a.__c).__ = l.__E)
          : (b
              ? (r.__c = l = new I(v, C))
              : ((r.__c = l = new Ve(v, C)),
                (l.constructor = I),
                (l.render = Or)),
            x && x.sub(l),
            l.state || (l.state = {}),
            (l.__n = o),
            (m = l.__d = !0),
            (l.__h = []),
            (l._sb = [])),
        b && l.__s == null && (l.__s = l.state),
        b &&
          I.getDerivedStateFromProps != null &&
          (l.__s == l.state && (l.__s = se({}, l.__s)),
          se(l.__s, I.getDerivedStateFromProps(v, l.__s))),
        (u = l.props),
        (y = l.state),
        (l.__v = r),
        m)
      )
        (b &&
          I.getDerivedStateFromProps == null &&
          l.componentWillMount != null &&
          l.componentWillMount(),
          b && l.componentDidMount != null && l.__h.push(l.componentDidMount));
      else {
        if (
          (b &&
            I.getDerivedStateFromProps == null &&
            v !== u &&
            l.componentWillReceiveProps != null &&
            l.componentWillReceiveProps(v, C),
          r.__v == a.__v ||
            (!l.__e &&
              l.shouldComponentUpdate != null &&
              l.shouldComponentUpdate(v, l.__s, C) === !1))
        ) {
          (r.__v != a.__v && ((l.props = v), (l.state = l.__s), (l.__d = !1)),
            (r.__e = a.__e),
            (r.__k = a.__k),
            r.__k.some(function (j) {
              j && (j.__ = r);
            }),
            Ge.push.apply(l.__h, l._sb),
            (l._sb = []),
            l.__h.length && s.push(l));
          break e;
        }
        (l.componentWillUpdate != null && l.componentWillUpdate(v, l.__s, C),
          b &&
            l.componentDidUpdate != null &&
            l.__h.push(function () {
              l.componentDidUpdate(u, y, k);
            }));
      }
      if (
        ((l.context = C),
        (l.props = v),
        (l.__P = t),
        (l.__e = !1),
        (z = L.__r),
        (A = 0),
        b)
      )
        ((l.state = l.__s),
          (l.__d = !1),
          z && z(r),
          (p = l.render(l.props, l.state, l.context)),
          Ge.push.apply(l.__h, l._sb),
          (l._sb = []));
      else
        do
          ((l.__d = !1),
            z && z(r),
            (p = l.render(l.props, l.state, l.context)),
            (l.state = l.__s));
        while (l.__d && ++A < 25);
      ((l.state = l.__s),
        l.getChildContext != null && (o = se(se({}, o), l.getChildContext())),
        b &&
          !m &&
          l.getSnapshotBeforeUpdate != null &&
          (k = l.getSnapshotBeforeUpdate(u, y)),
        (R =
          p != null && p.type === J && p.key == null
            ? dr(p.props.children)
            : p),
        (d = nr(t, Xe(R) ? R : [R], r, a, o, n, i, s, d, f, h)),
        (l.base = r.__e),
        (r.__u &= -161),
        l.__h.length && s.push(l),
        T && (l.__E = l.__ = null));
    } catch (j) {
      if (((r.__v = null), f || i != null))
        if (j.then) {
          for (r.__u |= f ? 160 : 128; d && d.nodeType == 8 && d.nextSibling; )
            d = d.nextSibling;
          ((i[i.indexOf(d)] = null), (r.__e = d));
        } else {
          for (P = i.length; P--; ) _t(i[P]);
          pt(r);
        }
      else ((r.__e = a.__e), (r.__k = a.__k), j.then || pt(r));
      L.__e(j, r, a);
    }
  else
    i == null && r.__v == a.__v
      ? ((r.__k = a.__k), (r.__e = a.__e))
      : (d = r.__e = $r(a.__e, r, a, o, n, i, s, f, h));
  return ((p = L.diffed) && p(r), 128 & r.__u ? void 0 : d);
}
function pt(t) {
  t && (t.__c && (t.__c.__e = !0), t.__k && t.__k.some(pt));
}
function sr(t, r, a) {
  for (var o = 0; o < a.length; o++) St(a[o], a[++o], a[++o]);
  (L.__c && L.__c(r, t),
    t.some(function (n) {
      try {
        ((t = n.__h),
          (n.__h = []),
          t.some(function (i) {
            i.call(n);
          }));
      } catch (i) {
        L.__e(i, n.__v);
      }
    }));
}
function dr(t) {
  return typeof t != "object" || t == null || t.__b > 0
    ? t
    : Xe(t)
      ? t.map(dr)
      : se({}, t);
}
function $r(t, r, a, o, n, i, s, d, f) {
  var h,
    p,
    l,
    m,
    u,
    y,
    k,
    T = a.props || qe,
    v = r.props,
    b = r.type;
  if (
    (b == "svg"
      ? (n = "http://www.w3.org/2000/svg")
      : b == "math"
        ? (n = "http://www.w3.org/1998/Math/MathML")
        : n || (n = "http://www.w3.org/1999/xhtml"),
    i != null)
  ) {
    for (h = 0; h < i.length; h++)
      if (
        (u = i[h]) &&
        "setAttribute" in u == !!b &&
        (b ? u.localName == b : u.nodeType == 3)
      ) {
        ((t = u), (i[h] = null));
        break;
      }
  }
  if (t == null) {
    if (b == null) return document.createTextNode(v);
    ((t = document.createElementNS(n, b, v.is && v)),
      d && (L.__m && L.__m(r, i), (d = !1)),
      (i = null));
  }
  if (b == null) T === v || (d && t.data == v) || (t.data = v);
  else {
    if (((i = i && Qe.call(t.childNodes)), !d && i != null))
      for (T = {}, h = 0; h < t.attributes.length; h++)
        T[(u = t.attributes[h]).name] = u.value;
    for (h in T)
      ((u = T[h]),
        h == "dangerouslySetInnerHTML"
          ? (l = u)
          : h == "children" ||
            h in v ||
            (h == "value" && "defaultValue" in v) ||
            (h == "checked" && "defaultChecked" in v) ||
            We(t, h, null, u, n));
    for (h in v)
      ((u = v[h]),
        h == "children"
          ? (m = u)
          : h == "dangerouslySetInnerHTML"
            ? (p = u)
            : h == "value"
              ? (y = u)
              : h == "checked"
                ? (k = u)
                : (d && typeof u != "function") ||
                  T[h] === u ||
                  We(t, h, u, T[h], n));
    if (p)
      (d ||
        (l && (p.__html == l.__html || p.__html == t.innerHTML)) ||
        (t.innerHTML = p.__html),
        (r.__k = []));
    else if (
      (l && (t.innerHTML = ""),
      nr(
        r.type == "template" ? t.content : t,
        Xe(m) ? m : [m],
        r,
        a,
        o,
        b == "foreignObject" ? "http://www.w3.org/1999/xhtml" : n,
        i,
        s,
        i ? i[0] : a.__k && xe(a, 0),
        d,
        f,
      ),
      i != null)
    )
      for (h = i.length; h--; ) _t(i[h]);
    d ||
      ((h = "value"),
      b == "progress" && y == null
        ? t.removeAttribute("value")
        : y != null &&
          (y !== t[h] ||
            (b == "progress" && !y) ||
            (b == "option" && y != T[h])) &&
          We(t, h, y, T[h], n),
      (h = "checked"),
      k != null && k != t[h] && We(t, h, k, T[h], n));
  }
  return t;
}
function St(t, r, a) {
  try {
    if (typeof t == "function") {
      var o = typeof t.__u == "function";
      (o && t.__u(), (o && r == null) || (t.__u = t(r)));
    } else t.current = r;
  } catch (n) {
    L.__e(n, a);
  }
}
function cr(t, r, a) {
  var o, n;
  if (
    (L.unmount && L.unmount(t),
    (o = t.ref) && ((o.current && o.current != t.__e) || St(o, null, r)),
    (o = t.__c) != null)
  ) {
    if (o.componentWillUnmount)
      try {
        o.componentWillUnmount();
      } catch (i) {
        L.__e(i, r);
      }
    o.base = o.__P = null;
  }
  if ((o = t.__k))
    for (n = 0; n < o.length; n++)
      o[n] && cr(o[n], r, a || typeof t.type != "function");
  (a || _t(t.__e), (t.__c = t.__ = t.__e = void 0));
}
function Or(t, r, a) {
  return this.constructor(t, a);
}
function Lr(t, r, a) {
  var o, n, i, s;
  (r == document && (r = document.documentElement),
    L.__ && L.__(t, r),
    (n = (o = !1) ? null : r.__k),
    (i = []),
    (s = []),
    xt(
      r,
      (t = r.__k = Fr(J, null, [t])),
      n || qe,
      qe,
      r.namespaceURI,
      n ? null : r.firstChild ? Qe.call(r.childNodes) : null,
      i,
      n ? n.__e : r.firstChild,
      o,
      s,
    ),
    sr(i, t, s));
}
((Qe = Ge.slice),
  (L = {
    __e: function (t, r, a, o) {
      for (var n, i, s; (r = r.__); )
        if ((n = r.__c) && !n.__)
          try {
            if (
              ((i = n.constructor) &&
                i.getDerivedStateFromError != null &&
                (n.setState(i.getDerivedStateFromError(t)), (s = n.__d)),
              n.componentDidCatch != null &&
                (n.componentDidCatch(t, o || {}), (s = n.__d)),
              s)
            )
              return (n.__E = n);
          } catch (d) {
            t = d;
          }
      throw t;
    },
  }),
  (tr = 0),
  (Ve.prototype.setState = function (t, r) {
    var a;
    ((a =
      this.__s != null && this.__s != this.state
        ? this.__s
        : (this.__s = se({}, this.state))),
      typeof t == "function" && (t = t(se({}, a), this.props)),
      t && se(a, t),
      t != null && this.__v && (r && this._sb.push(r), At(this)));
  }),
  (Ve.prototype.forceUpdate = function (t) {
    this.__v && ((this.__e = !0), t && this.__h.push(t), At(this));
  }),
  (Ve.prototype.render = J),
  (me = []),
  (rr =
    typeof Promise == "function"
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  (ar = function (t, r) {
    return t.__v.__b - r.__v.__b;
  }),
  (Je.__r = 0),
  (at = Math.random().toString(8)),
  (Oe = "__d" + at),
  (Be = "__a" + at),
  (ir = /(PointerCapture)$|Capture$/i),
  (vt = 0),
  (ht = Nt(!1)),
  (ut = Nt(!0)));
var Vr = 0;
function e(t, r, a, o, n, i) {
  r || (r = {});
  var s,
    d,
    f = r;
  if ("ref" in f)
    for (d in ((f = {}), r)) d == "ref" ? (s = r[d]) : (f[d] = r[d]);
  var h = {
    type: t,
    props: f,
    key: a,
    ref: s,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: --Vr,
    __i: -1,
    __u: 0,
    __source: n,
    __self: i,
  };
  if (typeof t == "function" && (s = t.defaultProps))
    for (d in s) f[d] === void 0 && (f[d] = s[d]);
  return (L.vnode && L.vnode(h), h);
}
var ze,
  q,
  it,
  Bt,
  Ye = 0,
  mr = [],
  G = L,
  Tt = G.__b,
  zt = G.__r,
  Dt = G.diffed,
  It = G.__c,
  Mt = G.unmount,
  Rt = G.__;
function Ct(t, r) {
  (G.__h && G.__h(q, t, Ye || r), (Ye = 0));
  var a = q.__H || (q.__H = { __: [], __h: [] });
  return (t >= a.__.length && a.__.push({}), a.__[t]);
}
function g(t) {
  return ((Ye = 1), Ur(ur, t));
}
function Ur(t, r, a) {
  var o = Ct(ze++, 2);
  if (
    ((o.t = t),
    !o.__c &&
      ((o.__ = [
        ur(void 0, r),
        function (d) {
          var f = o.__N ? o.__N[0] : o.__[0],
            h = o.t(f, d);
          f !== h && ((o.__N = [h, o.__[1]]), o.__c.setState({}));
        },
      ]),
      (o.__c = q),
      !q.__f))
  ) {
    var n = function (d, f, h) {
      if (!o.__c.__H) return !0;
      var p = o.__c.__H.__.filter(function (m) {
        return m.__c;
      });
      if (
        p.every(function (m) {
          return !m.__N;
        })
      )
        return !i || i.call(this, d, f, h);
      var l = o.__c.props !== d;
      return (
        p.some(function (m) {
          if (m.__N) {
            var u = m.__[0];
            ((m.__ = m.__N), (m.__N = void 0), u !== m.__[0] && (l = !0));
          }
        }),
        (i && i.call(this, d, f, h)) || l
      );
    };
    q.__f = !0;
    var i = q.shouldComponentUpdate,
      s = q.componentWillUpdate;
    ((q.componentWillUpdate = function (d, f, h) {
      if (this.__e) {
        var p = i;
        ((i = void 0), n(d, f, h), (i = p));
      }
      s && s.call(this, d, f, h);
    }),
      (q.shouldComponentUpdate = n));
  }
  return o.__N || o.__;
}
function Z(t, r) {
  var a = Ct(ze++, 3);
  !G.__s && hr(a.__H, r) && ((a.__ = t), (a.u = r), q.__H.__h.push(a));
}
function De(t, r) {
  var a = Ct(ze++, 7);
  return (hr(a.__H, r) && ((a.__ = t()), (a.__H = r), (a.__h = t)), a.__);
}
function he(t, r) {
  return (
    (Ye = 8),
    De(function () {
      return t;
    }, r)
  );
}
function Hr() {
  for (var t; (t = mr.shift()); ) {
    var r = t.__H;
    if (t.__P && r)
      try {
        (r.__h.some(Ue), r.__h.some(gt), (r.__h = []));
      } catch (a) {
        ((r.__h = []), G.__e(a, t.__v));
      }
  }
}
((G.__b = function (t) {
  ((q = null), Tt && Tt(t));
}),
  (G.__ = function (t, r) {
    (t && r.__k && r.__k.__m && (t.__m = r.__k.__m), Rt && Rt(t, r));
  }),
  (G.__r = function (t) {
    (zt && zt(t), (ze = 0));
    var r = (q = t.__c).__H;
    (r &&
      (it === q
        ? ((r.__h = []),
          (q.__h = []),
          r.__.some(function (a) {
            (a.__N && (a.__ = a.__N), (a.u = a.__N = void 0));
          }))
        : (r.__h.some(Ue), r.__h.some(gt), (r.__h = []), (ze = 0))),
      (it = q));
  }),
  (G.diffed = function (t) {
    Dt && Dt(t);
    var r = t.__c;
    (r &&
      r.__H &&
      (r.__H.__h.length &&
        ((mr.push(r) !== 1 && Bt === G.requestAnimationFrame) ||
          ((Bt = G.requestAnimationFrame) || qr)(Hr)),
      r.__H.__.some(function (a) {
        (a.u && (a.__H = a.u), (a.u = void 0));
      })),
      (it = q = null));
  }),
  (G.__c = function (t, r) {
    (r.some(function (a) {
      try {
        (a.__h.some(Ue),
          (a.__h = a.__h.filter(function (o) {
            return !o.__ || gt(o);
          })));
      } catch (o) {
        (r.some(function (n) {
          n.__h && (n.__h = []);
        }),
          (r = []),
          G.__e(o, a.__v));
      }
    }),
      It && It(t, r));
  }),
  (G.unmount = function (t) {
    Mt && Mt(t);
    var r,
      a = t.__c;
    a &&
      a.__H &&
      (a.__H.__.some(function (o) {
        try {
          Ue(o);
        } catch (n) {
          r = n;
        }
      }),
      (a.__H = void 0),
      r && G.__e(r, a.__v));
  }));
var Ft = typeof requestAnimationFrame == "function";
function qr(t) {
  var r,
    a = function () {
      (clearTimeout(o), Ft && cancelAnimationFrame(r), setTimeout(t));
    },
    o = setTimeout(a, 35);
  Ft && (r = requestAnimationFrame(a));
}
function Ue(t) {
  var r = q,
    a = t.__c;
  (typeof a == "function" && ((t.__c = void 0), a()), (q = r));
}
function gt(t) {
  var r = q;
  ((t.__c = t.__()), (q = r));
}
function hr(t, r) {
  return (
    !t ||
    t.length !== r.length ||
    r.some(function (a, o) {
      return a !== t[o];
    })
  );
}
function ur(t, r) {
  return typeof r == "function" ? r(t) : r;
}
function Gr({ onLoginSuccess: t, onNavigate: r }) {
  const [a, o] = g(
      localStorage.getItem("crm-church-slug") || "bom-samaritano-matriz",
    ),
    [n, i] = g(""),
    [s, d] = g(""),
    [f, h] = g(""),
    [p, l] = g(!1),
    [m, u] = g(!1),
    [y, k] = g(""),
    [T, v] = g("");
  return e("main", {
    style: {
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      background:
        "radial-gradient(circle at top left, rgba(124,58,237,0.26), transparent 35%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)",
      color: "#fff",
      fontFamily: "Inter, sans-serif",
    },
    children: [
      e("section", {
        style: {
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
        children: [
          e("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 900,
              fontSize: "1.25rem",
            },
            children: [
              e("div", {
                style: {
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 28px rgba(124,58,237,0.45)",
                  color: "#fff",
                  fontWeight: 900,
                },
                children: "✚",
              }),
              "CRM Bom Samaritano",
            ],
          }),
          e("div", {
            style: { maxWidth: 560 },
            children: [
              e("span", {
                style: {
                  display: "inline-flex",
                  padding: "0.42rem 0.85rem",
                  borderRadius: 999,
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.36)",
                  color: "#C4B5FD",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  marginBottom: "1.3rem",
                },
                children: "Plataforma pastoral segura",
              }),
              e("h1", {
                style: {
                  fontSize: "3rem",
                  lineHeight: 1.08,
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  margin: 0,
                },
                children:
                  "Acesse o painel da sua igreja com segurança e cuidado.",
              }),
              e("p", {
                style: {
                  color: "#9CA3AF",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  marginTop: "1.4rem",
                },
                children:
                  "Gerencie visitantes, membros, mensagens pastorais, aniversariantes, pedidos de oração e acompanhamento espiritual em um único lugar.",
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginTop: "2rem",
                },
                children: [
                  e(nt, {
                    title: "Seguro",
                    desc: "Login protegido",
                    color: "#10B981",
                  }),
                  e(nt, {
                    title: "Pastoral",
                    desc: "Cuidado real",
                    color: "#7C3AED",
                  }),
                  e(nt, {
                    title: "WhatsApp",
                    desc: "Mensagens rápidas",
                    color: "#2563EB",
                  }),
                ],
              }),
            ],
          }),
          e("p", {
            style: { color: "#6B7280", fontSize: "0.8rem" },
            children:
              "© 2026 CRM Bom Samaritano. Feito para igrejas que cuidam de pessoas.",
          }),
        ],
      }),
      e("section", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        },
        children: e("article", {
          style: {
            width: "100%",
            maxWidth: 430,
            padding: "2rem",
            borderRadius: 26,
            background: "rgba(17,24,39,0.76)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.48)",
            backdropFilter: "blur(18px)",
          },
          children: m
            ? e(J, {
                children: [
                  e("header", {
                    style: { textAlign: "center", marginBottom: "1.8rem" },
                    children: [
                      e("div", {
                        style: {
                          width: 62,
                          height: 62,
                          borderRadius: 20,
                          background: "linear-gradient(135deg,#F59E0B,#7C3AED)",
                          margin: "0 auto 1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          boxShadow: "0 0 32px rgba(245,158,11,0.35)",
                        },
                        children: "🔐",
                      }),
                      e("h2", {
                        style: {
                          margin: 0,
                          fontSize: "1.5rem",
                          fontWeight: 900,
                          color: "#fff",
                        },
                        children: "Recuperar acesso",
                      }),
                      e("p", {
                        style: {
                          color: "#9CA3AF",
                          fontSize: "0.88rem",
                          marginTop: 6,
                        },
                        children: "Informe seu e-mail ou telefone cadastrado",
                      }),
                    ],
                  }),
                  e("form", {
                    onSubmit: async (C) => {
                      (C.preventDefault(), l(!0), h(""), v(""));
                      try {
                        const A = await (
                          await fetch("/api/forgot-password", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ target: y }),
                          })
                        ).json();
                        v(
                          A.message ||
                            "Se os dados estiverem corretos, enviaremos as instruções de recuperação.",
                        );
                      } catch {
                        h("Erro ao processar recuperação. Tente novamente.");
                      } finally {
                        l(!1);
                      }
                    },
                    children: [
                      e(je, {
                        text: "E-mail ou telefone",
                        children: e("input", {
                          type: "text",
                          value: y,
                          onInput: (C) => k(C.currentTarget.value),
                          placeholder: "Ex: pastor@email.com",
                          required: !0,
                          style: Pe,
                        }),
                      }),
                      T && e(ot, { type: "success", message: T }),
                      f && e(ot, { type: "error", message: f }),
                      e("button", {
                        type: "submit",
                        disabled: p,
                        style: {
                          width: "100%",
                          height: 52,
                          marginTop: "0.5rem",
                          borderRadius: 14,
                          border: "none",
                          background: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          cursor: p ? "not-allowed" : "pointer",
                          boxShadow: "0 14px 32px rgba(124,58,237,0.38)",
                        },
                        children: p ? "Enviando..." : "Enviar instruções",
                      }),
                      e("button", {
                        type: "button",
                        onClick: () => {
                          (u(!1), k(""), v(""), h(""));
                        },
                        style: {
                          width: "100%",
                          marginTop: 12,
                          height: 48,
                          borderRadius: 14,
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.04)",
                          color: "#D1D5DB",
                          fontWeight: 800,
                          cursor: "pointer",
                        },
                        children: "Voltar para login",
                      }),
                    ],
                  }),
                ],
              })
            : e(J, {
                children: [
                  e("header", {
                    style: { textAlign: "center", marginBottom: "1.8rem" },
                    children: [
                      e("div", {
                        style: {
                          width: 62,
                          height: 62,
                          borderRadius: 20,
                          background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                          margin: "0 auto 1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.6rem",
                          boxShadow: "0 0 32px rgba(124,58,237,0.5)",
                        },
                        children: "⛪",
                      }),
                      e("h2", {
                        style: {
                          margin: 0,
                          fontSize: "1.5rem",
                          fontWeight: 900,
                          color: "#fff",
                          letterSpacing: "-0.03em",
                        },
                        children: "Entrar no Sistema",
                      }),
                      e("p", {
                        style: {
                          color: "#9CA3AF",
                          fontSize: "0.88rem",
                          marginTop: 6,
                        },
                        children:
                          "Acesse o painel administrativo da sua igreja",
                      }),
                    ],
                  }),
                  e("form", {
                    onSubmit: async (C) => {
                      (C.preventDefault(), h(""), l(!0));
                      try {
                        const z = await fetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              church_slug: a,
                              username: n,
                              password: s,
                            }),
                          }),
                          A = await z.json();
                        z.ok
                          ? (localStorage.setItem("crm-church-slug", a), t())
                          : h(A.error || "Usuário, senha ou igreja inválidos.");
                      } catch {
                        h("Erro de conexão com o servidor. Tente novamente.");
                      } finally {
                        l(!1);
                      }
                    },
                    children: [
                      e(je, {
                        text: "ID da Igreja",
                        children: e("input", {
                          type: "text",
                          placeholder: "ex: bom-samaritano-matriz",
                          value: a,
                          onInput: (C) => o(C.currentTarget.value),
                          required: !0,
                          style: Pe,
                        }),
                      }),
                      e(je, {
                        text: "Usuário",
                        children: e("input", {
                          type: "text",
                          placeholder: "Digite seu usuário",
                          value: n,
                          onInput: (C) => i(C.currentTarget.value),
                          required: !0,
                          style: Pe,
                        }),
                      }),
                      e(je, {
                        text: "Senha",
                        children: e("input", {
                          type: "password",
                          placeholder: "Digite sua senha",
                          value: s,
                          onInput: (C) => d(C.currentTarget.value),
                          required: !0,
                          style: Pe,
                        }),
                      }),
                      e("div", {
                        style: { textAlign: "right", marginBottom: "1rem" },
                        children: e("button", {
                          type: "button",
                          onClick: () => {
                            (u(!0), h(""), v(""));
                          },
                          style: {
                            background: "none",
                            border: "none",
                            color: "#A78BFA",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            padding: 0,
                            fontWeight: 700,
                          },
                          children: "Esqueceu seu login ou senha?",
                        }),
                      }),
                      f && e(ot, { type: "error", message: f }),
                      e("button", {
                        type: "submit",
                        disabled: p,
                        style: {
                          width: "100%",
                          height: 52,
                          marginTop: "0.5rem",
                          borderRadius: 14,
                          border: "none",
                          background: p
                            ? "rgba(124,58,237,0.55)"
                            : "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          cursor: p ? "not-allowed" : "pointer",
                          boxShadow: "0 14px 32px rgba(124,58,237,0.38)",
                        },
                        children: p ? "Autenticando..." : "Entrar no Sistema",
                      }),
                    ],
                  }),
                  e("div", {
                    style: { marginTop: "1.4rem", textAlign: "center" },
                    children: e("button", {
                      type: "button",
                      onClick: () => r("/"),
                      style: {
                        background: "transparent",
                        border: "none",
                        color: "#6B7280",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      },
                      children: "Voltar para a página inicial",
                    }),
                  }),
                ],
              }),
        }),
      }),
    ],
  });
}
const Pe = {
  width: "100%",
  height: 48,
  marginTop: 6,
  marginBottom: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(15,23,42,0.88)",
  color: "#fff",
  padding: "0 1rem",
  outline: "none",
  fontSize: "0.9rem",
};
function je({ text: t, children: r }) {
  return e("label", {
    style: {
      display: "block",
      color: "#CBD5E1",
      fontWeight: 700,
      fontSize: "0.82rem",
      marginBottom: 2,
    },
    children: [t, r],
  });
}
function ot({ type: t, message: r }) {
  const a = t === "success";
  return e("div", {
    style: {
      padding: "0.85rem 1rem",
      borderRadius: 14,
      background: a ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.14)",
      border: a
        ? "1px solid rgba(16,185,129,0.3)"
        : "1px solid rgba(239,68,68,0.3)",
      color: a ? "#34D399" : "#F87171",
      fontSize: "0.84rem",
      fontWeight: 700,
      marginBottom: "1rem",
    },
    children: [a ? "✅" : "⚠️", " ", r],
  });
}
function nt({ title: t, desc: r, color: a }) {
  return e("div", {
    style: {
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${a}44`,
      borderRadius: 18,
      padding: "1rem",
    },
    children: [
      e("div", {
        style: { color: a, fontSize: "1rem", fontWeight: 900 },
        children: t,
      }),
      e("div", {
        style: { color: "#9CA3AF", fontSize: "0.78rem", marginTop: 4 },
        children: r,
      }),
    ],
  });
}
function Jr({ onNavigate: t }) {
  const [r, a] = g({
      church_name: "",
      church_slug: "",
      admin_name: "",
      username: "",
      email: "",
      password: "",
    }),
    [o, n] = g(!1),
    [i, s] = g(""),
    [d, f] = g(!1),
    h = (m, u) => {
      a({ ...r, [m]: u });
    },
    p = (m) =>
      m
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    l = async (m) => {
      (m.preventDefault(), n(!0), s(""));
      try {
        const u = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
          }),
          y = await u.json();
        u.ok ? f(!0) : s(y.error || "Erro ao realizar cadastro.");
      } catch {
        s("Erro de conexão com o servidor. Tente novamente.");
      } finally {
        n(!1);
      }
    };
  return d
    ? e("main", {
        style: Wt,
        children: e("section", {
          style: da,
          children: [
            e("div", { style: ca, children: "✓" }),
            e("h1", { style: ma, children: "Igreja cadastrada com sucesso!" }),
            e("p", {
              style: ha,
              children: [
                "O painel da ",
                e("strong", { children: r.church_name }),
                " está pronto para começar.",
              ],
            }),
            e("div", {
              style: ua,
              children: [
                e("p", {
                  style: { margin: 0, color: "#9CA3AF", fontSize: "0.85rem" },
                  children: "ID da igreja",
                }),
                e("strong", {
                  style: { color: "#fff" },
                  children: r.church_slug,
                }),
              ],
            }),
            e("button", {
              onClick: () => t("/login"),
              style: jt,
              children: "Ir para o Login",
            }),
          ],
        }),
      })
    : e("main", {
        style: Wt,
        children: [
          e("section", {
            style: Yr,
            children: [
              e("div", {
                style: Xr,
                children: [
                  e("div", { style: Zr, children: "✚" }),
                  e("span", { children: "CRM Bom Samaritano" }),
                ],
              }),
              e("div", {
                style: { maxWidth: 560 },
                children: [
                  e("span", { style: Kr, children: "Teste grátis por 7 dias" }),
                  e("h1", {
                    style: ea,
                    children:
                      "Cadastre sua igreja e comece a cuidar melhor das pessoas.",
                  }),
                  e("p", {
                    style: ta,
                    children:
                      "Crie seu painel pastoral em poucos minutos. Organize visitantes, acompanhe membros, envie mensagens e fortaleça o cuidado espiritual da sua igreja.",
                  }),
                  e("div", {
                    style: ra,
                    children: [
                      e(st, {
                        title: "Sem instalação",
                        desc: "Acesse direto pelo navegador",
                        color: "#7C3AED",
                      }),
                      e(st, {
                        title: "Multiusuário",
                        desc: "Pastor e obreiros separados",
                        color: "#2563EB",
                      }),
                      e(st, {
                        title: "Pastoral",
                        desc: "Cuidado, visitas e mensagens",
                        color: "#10B981",
                      }),
                    ],
                  }),
                ],
              }),
              e("p", {
                style: { color: "#6B7280", fontSize: "0.8rem" },
                children:
                  "© 2026 CRM Bom Samaritano. Plataforma para igrejas que cuidam de pessoas.",
              }),
            ],
          }),
          e("section", {
            style: Qr,
            children: e("article", {
              style: aa,
              children: [
                e("header", {
                  style: { textAlign: "center", marginBottom: "1.8rem" },
                  children: [
                    e("div", { style: ia, children: "⛪" }),
                    e("h2", { style: oa, children: "Criar conta da igreja" }),
                    e("p", {
                      style: na,
                      children:
                        "Configure sua igreja e o primeiro Pastor Administrador.",
                    }),
                  ],
                }),
                e("form", {
                  onSubmit: l,
                  children: [
                    e("div", { style: Pt, children: "Dados da Igreja" }),
                    e("div", {
                      style: lt,
                      children: [
                        e(ye, {
                          text: "Nome da Igreja",
                          children: e("input", {
                            type: "text",
                            placeholder: "Ex: Igreja da Graça Rochdale",
                            value: r.church_name,
                            onInput: (m) => {
                              const u = m.currentTarget.value;
                              (h("church_name", u),
                                r.church_slug || h("church_slug", p(u)));
                            },
                            required: !0,
                            style: be,
                          }),
                        }),
                        e(ye, {
                          text: "ID da Igreja",
                          children: e("input", {
                            type: "text",
                            placeholder: "ex: igreja-graca-rochdale",
                            value: r.church_slug,
                            onInput: (m) =>
                              h("church_slug", p(m.currentTarget.value)),
                            required: !0,
                            style: be,
                          }),
                        }),
                      ],
                    }),
                    e("div", { style: la }),
                    e("div", { style: Pt, children: "Pastor Administrador" }),
                    e("div", {
                      style: lt,
                      children: [
                        e(ye, {
                          text: "Nome completo",
                          children: e("input", {
                            type: "text",
                            placeholder: "Nome do Pastor",
                            value: r.admin_name,
                            onInput: (m) =>
                              h("admin_name", m.currentTarget.value),
                            required: !0,
                            style: be,
                          }),
                        }),
                        e(ye, {
                          text: "E-mail",
                          children: e("input", {
                            type: "email",
                            placeholder: "pastor@email.com",
                            value: r.email,
                            onInput: (m) => h("email", m.currentTarget.value),
                            required: !0,
                            style: be,
                          }),
                        }),
                      ],
                    }),
                    e("div", {
                      style: lt,
                      children: [
                        e(ye, {
                          text: "Usuário de login",
                          children: e("input", {
                            type: "text",
                            placeholder: "ex: pastor.michael",
                            value: r.username,
                            onInput: (m) =>
                              h("username", m.currentTarget.value),
                            required: !0,
                            style: be,
                          }),
                        }),
                        e(ye, {
                          text: "Senha",
                          children: e("input", {
                            type: "password",
                            placeholder: "Mínimo 6 caracteres",
                            value: r.password,
                            onInput: (m) =>
                              h("password", m.currentTarget.value),
                            required: !0,
                            minLength: 6,
                            style: be,
                          }),
                        }),
                      ],
                    }),
                    i && e(pa, { message: i }),
                    e("button", {
                      type: "submit",
                      disabled: o,
                      style: {
                        ...jt,
                        marginTop: "0.5rem",
                        cursor: o ? "not-allowed" : "pointer",
                        opacity: o ? 0.75 : 1,
                      },
                      children: o
                        ? "Criando igreja..."
                        : "Criar minha igreja agora",
                    }),
                  ],
                }),
                e("footer", {
                  style: { textAlign: "center", marginTop: "1.5rem" },
                  children: e("p", {
                    style: { color: "#9CA3AF", fontSize: "0.85rem" },
                    children: [
                      "Já tem uma conta?",
                      " ",
                      e("button", {
                        type: "button",
                        onClick: () => t("/login"),
                        style: sa,
                        children: "Fazer login",
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        ],
      });
}
const Wt = {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    background:
      "radial-gradient(circle at top left, rgba(124,58,237,0.26), transparent 35%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
  },
  Yr = {
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid rgba(255,255,255,0.08)",
  },
  Qr = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  Xr = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 900,
    fontSize: "1.25rem",
  },
  Zr = {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: "linear-gradient(135deg,#7C3AED,#2563EB)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 28px rgba(124,58,237,0.45)",
    color: "#fff",
    fontWeight: 900,
  },
  Kr = {
    display: "inline-flex",
    padding: "0.42rem 0.85rem",
    borderRadius: 999,
    background: "rgba(124,58,237,0.15)",
    border: "1px solid rgba(124,58,237,0.36)",
    color: "#C4B5FD",
    fontSize: "0.82rem",
    fontWeight: 800,
    marginBottom: "1.3rem",
  },
  ea = {
    fontSize: "3rem",
    lineHeight: 1.08,
    letterSpacing: "-0.05em",
    fontWeight: 900,
    margin: 0,
  },
  ta = {
    color: "#9CA3AF",
    fontSize: "1rem",
    lineHeight: 1.7,
    marginTop: "1.4rem",
  },
  ra = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: "2rem",
  },
  aa = {
    width: "100%",
    maxWidth: 620,
    padding: "2rem",
    borderRadius: 26,
    background: "rgba(17,24,39,0.76)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.48)",
    backdropFilter: "blur(18px)",
  },
  ia = {
    width: 62,
    height: 62,
    borderRadius: 20,
    background: "linear-gradient(135deg,#7C3AED,#2563EB)",
    margin: "0 auto 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    boxShadow: "0 0 32px rgba(124,58,237,0.5)",
  },
  oa = {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 900,
    color: "#fff",
    letterSpacing: "-0.03em",
  },
  na = { color: "#9CA3AF", fontSize: "0.88rem", marginTop: 6 },
  Pt = {
    color: "#C4B5FD",
    fontSize: "0.78rem",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "0.8rem",
  },
  lt = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  la = { height: 1, background: "rgba(255,255,255,0.08)", margin: "1.2rem 0" },
  be = {
    width: "100%",
    height: 48,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(15,23,42,0.88)",
    color: "#fff",
    padding: "0 1rem",
    outline: "none",
    fontSize: "0.9rem",
  },
  jt = {
    width: "100%",
    height: 52,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
    color: "#fff",
    fontWeight: 900,
    fontSize: "0.95rem",
    boxShadow: "0 14px 32px rgba(124,58,237,0.38)",
  },
  sa = {
    background: "transparent",
    border: "none",
    color: "#A78BFA",
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
  },
  da = {
    width: "100%",
    maxWidth: 520,
    margin: "auto",
    padding: "2.4rem",
    borderRadius: 28,
    background: "rgba(17,24,39,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.48)",
    backdropFilter: "blur(18px)",
    textAlign: "center",
  },
  ca = {
    width: 76,
    height: 76,
    borderRadius: 24,
    margin: "0 auto 1.2rem",
    background: "linear-gradient(135deg,#10B981,#7C3AED)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: 900,
    boxShadow: "0 0 36px rgba(16,185,129,0.38)",
  },
  ma = {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  ha = { color: "#9CA3AF", lineHeight: 1.7, margin: "1rem 0" },
  ua = {
    padding: "1rem",
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    margin: "1.2rem 0",
  };
function ye({ text: t, children: r }) {
  return e("label", {
    style: {
      display: "block",
      color: "#CBD5E1",
      fontWeight: 700,
      fontSize: "0.82rem",
      marginBottom: 2,
    },
    children: [t, r],
  });
}
function pa({ message: t }) {
  return e("div", {
    style: {
      padding: "0.85rem 1rem",
      borderRadius: 14,
      background: "rgba(239,68,68,0.14)",
      border: "1px solid rgba(239,68,68,0.3)",
      color: "#F87171",
      fontSize: "0.84rem",
      fontWeight: 700,
      marginBottom: "1rem",
    },
    children: ["⚠️ ", t],
  });
}
function st({ title: t, desc: r, color: a }) {
  return e("div", {
    style: {
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${a}44`,
      borderRadius: 18,
      padding: "1rem",
    },
    children: [
      e("div", {
        style: { color: a, fontSize: "1rem", fontWeight: 900 },
        children: t,
      }),
      e("div", {
        style: { color: "#9CA3AF", fontSize: "0.78rem", marginTop: 4 },
        children: r,
      }),
    ],
  });
}
function ga({ onNavigate: t }) {
  return e("div", {
    style: {
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
      color: "#fff",
      background:
        "radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 35%), radial-gradient(circle at top right, rgba(37,99,235,0.2), transparent 30%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)",
    },
    children: [
      e("nav", {
        style: {
          maxWidth: 1180,
          margin: "0 auto",
          padding: "1.2rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        children: [
          e("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 900,
              fontSize: "1.2rem",
            },
            children: [
              e("div", {
                style: {
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 25px rgba(124,58,237,0.45)",
                },
                children: "✚",
              }),
              "CRM Bom Samaritano",
            ],
          }),
          e("div", {
            style: { display: "flex", gap: "1rem", alignItems: "center" },
            children: [
              e("a", {
                href: "#features",
                style: {
                  color: "#9CA3AF",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                },
                children: "Funcionalidades",
              }),
              e("a", {
                href: "#pricing",
                style: {
                  color: "#9CA3AF",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                },
                children: "Planos",
              }),
              e("button", {
                onClick: () => t("/login"),
                style: {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  borderRadius: 10,
                  fontWeight: 700,
                },
                children: "Entrar",
              }),
              e("button", {
                onClick: () => t("/register"),
                style: {
                  background: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                  border: "none",
                  color: "#fff",
                  padding: "0.65rem 1.4rem",
                  borderRadius: 10,
                  fontWeight: 800,
                  boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
                },
                children: "Começar grátis",
              }),
            ],
          }),
        ],
      }),
      e("header", {
        style: {
          maxWidth: 1180,
          margin: "0 auto",
          padding: "5rem 1.5rem 4rem",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "3rem",
          alignItems: "center",
        },
        children: [
          e("div", {
            children: [
              e("div", {
                style: {
                  display: "inline-flex",
                  padding: "0.4rem 0.8rem",
                  borderRadius: 999,
                  background: "rgba(124,58,237,0.14)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  color: "#C4B5FD",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  marginBottom: "1.2rem",
                },
                children: "Plataforma SaaS para igrejas que cuidam de pessoas",
              }),
              e("h1", {
                style: {
                  fontSize: "3.7rem",
                  lineHeight: 1.05,
                  margin: 0,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                },
                children:
                  "O CRM pastoral inteligente para igrejas que desejam cuidar melhor.",
              }),
              e("p", {
                style: {
                  color: "#9CA3AF",
                  fontSize: "1.15rem",
                  lineHeight: 1.7,
                  margin: "1.5rem 0 2rem",
                  maxWidth: 620,
                },
                children:
                  "Organize visitantes, acompanhe membros, envie mensagens pelo WhatsApp, cuide de aniversariantes, afastados, doentes e fortaleça o pastoreio da sua igreja.",
              }),
              e("div", {
                style: { display: "flex", gap: "1rem", flexWrap: "wrap" },
                children: [
                  e("button", {
                    onClick: () => t("/register"),
                    style: {
                      padding: "1rem 2rem",
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "1rem",
                      boxShadow: "0 15px 35px rgba(124,58,237,0.4)",
                    },
                    children: "Criar conta grátis por 7 dias",
                  }),
                  e("button", {
                    style: {
                      padding: "1rem 2rem",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1rem",
                    },
                    children: "Ver demonstração",
                  }),
                ],
              }),
              e("p", {
                style: {
                  color: "#6B7280",
                  marginTop: "1.5rem",
                  fontSize: "0.9rem",
                },
                children:
                  "Sem instalação. Acesse pelo computador, tablet ou celular.",
              }),
            ],
          }),
          e("div", {
            style: {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 26,
              padding: "1rem",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              backdropFilter: "blur(18px)",
            },
            children: e("div", {
              style: {
                borderRadius: 20,
                background: "#111827",
                padding: "1.2rem",
                minHeight: 360,
                border: "1px solid rgba(255,255,255,0.08)",
              },
              children: [
                e("div", {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 18,
                  },
                  children: [
                    e("strong", { children: "Dashboard Pastoral" }),
                    e("span", {
                      style: { color: "#10B981", fontSize: "0.8rem" },
                      children: "● Online",
                    }),
                  ],
                }),
                e("div", {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  },
                  children: [
                    e($e, {
                      title: "Membros",
                      value: "1.248",
                      color: "#2563EB",
                    }),
                    e($e, {
                      title: "Visitantes",
                      value: "86",
                      color: "#7C3AED",
                    }),
                    e($e, {
                      title: "Aniversários",
                      value: "24",
                      color: "#F59E0B",
                    }),
                    e($e, { title: "Orações", value: "17", color: "#10B981" }),
                  ],
                }),
                e("div", {
                  style: {
                    marginTop: 18,
                    height: 140,
                    borderRadius: 18,
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.12))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C4B5FD",
                    fontWeight: 800,
                  },
                  children: "Gráfico de crescimento da igreja",
                }),
                e("div", {
                  style: { marginTop: 18, display: "grid", gap: 10 },
                  children: [
                    e(dt, { text: "Novo visitante cadastrado" }),
                    e(dt, { text: "Mensagem enviada para aniversariante" }),
                    e(dt, { text: "Pedido de oração recebido" }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      e("section", {
        id: "features",
        style: { padding: "5rem 1.5rem" },
        children: e("div", {
          style: { maxWidth: 1180, margin: "0 auto" },
          children: [
            e("div", {
              style: { textAlign: "center", marginBottom: "3rem" },
              children: [
                e("h2", {
                  style: { fontSize: "2.4rem", margin: 0, fontWeight: 900 },
                  children: "Tudo para cuidar melhor da igreja",
                }),
                e("p", {
                  style: { color: "#9CA3AF", marginTop: 10 },
                  children:
                    "Um sistema criado para a rotina real de pastores, obreiros e equipes ministeriais.",
                }),
              ],
            }),
            e("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.2rem",
              },
              children: [
                e(ve, {
                  title: "WhatsApp Pastoral",
                  desc: "Envie boas-vindas, aniversários, avisos, oração e acompanhamento automaticamente.",
                }),
                e(ve, {
                  title: "Gestão de Visitantes",
                  desc: "O obreiro cadastra visitantes e o pastor acompanha tudo no painel.",
                }),
                e(ve, {
                  title: "Membros Afastados",
                  desc: "Crie mensagens de cuidado para quem precisa retornar à comunhão.",
                }),
                e(ve, {
                  title: "Membros Doentes",
                  desc: "Organize orações, visitas e mensagens de apoio pastoral.",
                }),
                e(ve, {
                  title: "Visitas Pastorais",
                  desc: "Agende visitas, acompanhe status e registre Santa Ceia nas casas.",
                }),
                e(ve, {
                  title: "Dashboard Inteligente",
                  desc: "Veja crescimento, aniversariantes, pedidos de oração e relatórios.",
                }),
              ],
            }),
          ],
        }),
      }),
      e("section", {
        id: "pricing",
        style: {
          padding: "5rem 1.5rem",
          background: "rgba(255,255,255,0.025)",
        },
        children: e("div", {
          style: { maxWidth: 1180, margin: "0 auto" },
          children: [
            e("div", {
              style: { textAlign: "center", marginBottom: "3rem" },
              children: [
                e("h2", {
                  style: { fontSize: "2.4rem", margin: 0, fontWeight: 900 },
                  children: "Planos para cada fase da sua igreja",
                }),
                e("p", {
                  style: { color: "#9CA3AF", marginTop: 10 },
                  children:
                    "Comece simples e evolua conforme sua igreja cresce.",
                }),
              ],
            }),
            e("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.3rem",
              },
              children: [
                {
                  name: "Essencial",
                  price: "R$ 49",
                  desc: "Para igrejas pequenas começarem com organização pastoral.",
                  features: [
                    "Cadastro de visitantes",
                    "Cadastro de membros",
                    "Pedidos de oração",
                    "Aniversariantes",
                    "Até 3 obreiros",
                    "Mensagens pastorais básicas",
                  ],
                  highlight: !1,
                },
                {
                  name: "Pastoreio",
                  price: "R$ 97",
                  desc: "O plano mais completo para igrejas em crescimento.",
                  features: [
                    "Tudo do Essencial",
                    "WhatsApp automático",
                    "Membros afastados",
                    "Membros doentes",
                    "Visitas pastorais",
                    "Santa Ceia nas casas",
                    "Até 10 obreiros",
                  ],
                  highlight: !0,
                },
                {
                  name: "Avivamento",
                  price: "R$ 197",
                  desc: "Para igrejas maiores, ministérios e sedes regionais.",
                  features: [
                    "Tudo do Pastoreio",
                    "Multi pastores",
                    "Multi unidades",
                    "Relatórios avançados",
                    "Backup automático",
                    "Suporte prioritário",
                    "Acessos ilimitados",
                  ],
                  highlight: !1,
                },
              ].map((a) =>
                e(
                  "div",
                  {
                    style: {
                      position: "relative",
                      padding: "2rem",
                      borderRadius: 24,
                      background: a.highlight
                        ? "linear-gradient(180deg, rgba(124,58,237,0.25), rgba(17,24,39,0.95))"
                        : "rgba(17,24,39,0.78)",
                      border: a.highlight
                        ? "1px solid rgba(139,92,246,0.65)"
                        : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: a.highlight
                        ? "0 0 45px rgba(124,58,237,0.32)"
                        : "0 20px 40px rgba(0,0,0,0.25)",
                    },
                    children: [
                      a.highlight &&
                        e("div", {
                          style: {
                            position: "absolute",
                            top: -14,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background:
                              "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                            padding: "0.35rem 0.9rem",
                            borderRadius: 999,
                            fontSize: "0.75rem",
                            fontWeight: 900,
                          },
                          children: "MAIS ESCOLHIDO",
                        }),
                      e("h3", {
                        style: { fontSize: "1.5rem", margin: 0 },
                        children: a.name,
                      }),
                      e("p", {
                        style: { color: "#9CA3AF", minHeight: 48 },
                        children: a.desc,
                      }),
                      e("div", {
                        style: { margin: "1.5rem 0" },
                        children: [
                          e("span", {
                            style: { fontSize: "2.5rem", fontWeight: 900 },
                            children: a.price,
                          }),
                          e("span", {
                            style: { color: "#9CA3AF" },
                            children: "/mês",
                          }),
                        ],
                      }),
                      e("button", {
                        onClick: () => t("/register"),
                        style: {
                          width: "100%",
                          padding: "0.9rem",
                          borderRadius: 14,
                          border: "none",
                          background: a.highlight
                            ? "linear-gradient(135deg,#7C3AED,#8B5CF6)"
                            : "rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontWeight: 900,
                          marginBottom: "1.5rem",
                        },
                        children: "Começar agora",
                      }),
                      e("div", {
                        style: { display: "grid", gap: 10 },
                        children: a.features.map((o) =>
                          e(
                            "div",
                            {
                              style: { color: "#D1D5DB", fontSize: "0.9rem" },
                              children: ["✓ ", o],
                            },
                            o,
                          ),
                        ),
                      }),
                    ],
                  },
                  a.name,
                ),
              ),
            }),
          ],
        }),
      }),
      e("footer", {
        style: {
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "#6B7280",
        },
        children:
          "© 2026 CRM Bom Samaritano. Feito para igrejas que cuidam de pessoas.",
      }),
    ],
  });
}
function ve({ title: t, desc: r }) {
  return e("div", {
    style: {
      background: "rgba(17,24,39,0.76)",
      padding: "1.7rem",
      borderRadius: 22,
      border: "1px solid rgba(255,255,255,0.09)",
      boxShadow: "0 20px 45px rgba(0,0,0,0.28)",
      backdropFilter: "blur(16px)",
    },
    children: [
      e("div", {
        style: {
          width: 42,
          height: 42,
          borderRadius: 14,
          background: "linear-gradient(135deg,#7C3AED,#2563EB)",
          marginBottom: "1rem",
          boxShadow: "0 0 22px rgba(124,58,237,0.4)",
        },
      }),
      e("h3", {
        style: { fontSize: "1.15rem", fontWeight: 900, marginBottom: "0.6rem" },
        children: t,
      }),
      e("p", {
        style: { color: "#9CA3AF", lineHeight: 1.6, fontSize: "0.93rem" },
        children: r,
      }),
    ],
  });
}
function $e({ title: t, value: r, color: a }) {
  return e("div", {
    style: {
      background: `${a}20`,
      border: `1px solid ${a}55`,
      borderRadius: 16,
      padding: "1rem",
    },
    children: [
      e("div", {
        style: { color: a, fontWeight: 900, fontSize: "1.3rem" },
        children: r,
      }),
      e("div", {
        style: { color: "#9CA3AF", fontSize: "0.78rem" },
        children: t,
      }),
    ],
  });
}
function dt({ text: t }) {
  return e("div", {
    style: {
      padding: "0.8rem",
      borderRadius: 14,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#D1D5DB",
      fontSize: "0.85rem",
    },
    children: t,
  });
}
function O({ title: t, value: r, icon: a, color: o, accentColor: n }) {
  const i = o || n;
  return e("div", {
    className: "stat-card",
    style: { position: "relative", overflow: "hidden" },
    children: [
      i &&
        e("div", {
          style: {
            position: "absolute",
            right: -20,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: i,
            opacity: 0.12,
            filter: "blur(22px)",
            pointerEvents: "none",
          },
        }),
      a &&
        e("div", {
          style: {
            width: 50,
            height: 50,
            borderRadius: 16,
            background: i ? `${i}20` : "rgba(255,255,255,0.08)",
            border: `1px solid ${i ? `${i}55` : "rgba(255,255,255,0.12)"}`,
            color: i || "var(--text-main)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            flexShrink: 0,
          },
          children: a,
        }),
      e("div", {
        children: [
          e("h3", {
            style: {
              margin: 0,
              fontSize: "1.65rem",
              fontWeight: 900,
              color: i || "var(--text-main)",
            },
            children: r,
          }),
          e("p", {
            style: {
              margin: 0,
              color: "var(--text-muted)",
              fontSize: "0.78rem",
            },
            children: t,
          }),
        ],
      }),
    ],
  });
}
const fa = {
  CONVERTIDO: { label: "Convertido", color: "#3B82F6" },
  BATIZADO: { label: "Batizado", color: "#10B981" },
  MEMBRO_ATIVO: { label: "Membro Ativo", color: "#10B981" },
  DISCIPULADO: { label: "Em Discipulado", color: "#F59E0B" },
};
function U({ label: t, color: r, icon: a, status: o }) {
  let n = t,
    i = r;
  if (o && !t) {
    const s = fa[o];
    ((n = (s == null ? void 0 : s.label) ?? o),
      (i = i ?? (s == null ? void 0 : s.color) ?? "#6B7280"));
  }
  return (
    (n = n ?? ""),
    (i = i ?? "#6B7280"),
    e("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "0.25rem 0.65rem",
        borderRadius: 999,
        background: `${i}20`,
        border: `1px solid ${i}55`,
        color: i,
        fontSize: "0.72rem",
        fontWeight: 900,
        whiteSpace: "nowrap",
      },
      children: [a && e("span", { children: a }), n],
    })
  );
}
function pe({ rows: t = 3, height: r = 56 }) {
  return e("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      padding: "0.5rem 0",
    },
    children: Array.from({ length: t }).map((a, o) =>
      e(
        "div",
        {
          style: {
            height: r,
            borderRadius: 12,
            background: `rgba(255,255,255,${0.05 - o * 0.005})`,
            animation: "pulse 1.6s ease-in-out infinite",
            animationDelay: `${o * 0.1}s`,
          },
        },
        o,
      ),
    ),
  });
}
function te({
  icon: t = "📭",
  title: r,
  description: a,
  actionLabel: o,
  onAction: n,
}) {
  return e("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3.5rem 1rem",
      gap: "0.75rem",
      textAlign: "center",
    },
    children: [
      e("div", { style: { fontSize: "3rem", lineHeight: 1 }, children: t }),
      e("strong", {
        style: { color: "var(--text-main)", fontSize: "1rem" },
        children: r,
      }),
      a &&
        e("p", {
          style: {
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            maxWidth: 340,
            lineHeight: 1.65,
            margin: 0,
          },
          children: a,
        }),
      o &&
        n &&
        e("button", {
          type: "button",
          className: "btn-primary",
          onClick: n,
          style: { marginTop: "0.5rem" },
          children: o,
        }),
    ],
  });
}
const ba = {
  success: {
    bg: "rgba(16,185,129,0.14)",
    border: "rgba(16,185,129,0.3)",
    text: "#34D399",
    icon: "✅",
  },
  error: {
    bg: "rgba(239,68,68,0.14)",
    border: "rgba(239,68,68,0.3)",
    text: "#F87171",
    icon: "⚠️",
  },
  warning: {
    bg: "rgba(245,158,11,0.14)",
    border: "rgba(245,158,11,0.3)",
    text: "#FCD34D",
    icon: "⚠️",
  },
  info: {
    bg: "rgba(59,130,246,0.14)",
    border: "rgba(59,130,246,0.3)",
    text: "#60A5FA",
    icon: "ℹ️",
  },
};
function K({ type: t, message: r, onClose: a, autoDismiss: o, fixed: n }) {
  const i = ba[t];
  Z(() => {
    if (o && a) {
      const d = setTimeout(a, o);
      return () => clearTimeout(d);
    }
  }, [r, o, a]);
  const s = {
    padding: "0.9rem 1rem",
    borderRadius: 16,
    background: i.bg,
    border: `1px solid ${i.border}`,
    color: i.text,
    fontWeight: 800,
    fontSize: "0.85rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
  };
  return (
    n
      ? Object.assign(s, {
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 2e3,
          maxWidth: 400,
          boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
        })
      : (s.marginBottom = "1rem"),
    e("div", {
      style: s,
      children: [
        e("span", { children: [i.icon, " ", r] }),
        a &&
          e("button", {
            type: "button",
            onClick: a,
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              color: i.text,
              fontSize: "1rem",
              lineHeight: 1,
              padding: "0 0.2rem",
              flexShrink: 0,
            },
            "aria-label": "Fechar",
            children: "✕",
          }),
      ],
    })
  );
}
function Te({ name: t, photo: r, size: a = 46, gradient: o, isVisitor: n }) {
  const i = (t || "PS")
    .split(" ")
    .slice(0, 2)
    .map((d) => d[0])
    .join("")
    .toUpperCase();
  return e("div", {
    style: {
      width: a,
      height: a,
      borderRadius: "50%",
      background:
        o ??
        (n
          ? "linear-gradient(135deg,#F59E0B,#8B5CF6)"
          : "linear-gradient(135deg,#10B981,#2563EB)"),
      border: "3px solid rgba(255,255,255,0.12)",
      boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 900,
      fontSize: a >= 80 ? "1.3rem" : a >= 60 ? "0.95rem" : "0.78rem",
      overflow: "hidden",
      flexShrink: 0,
      userSelect: "none",
    },
    children: r
      ? e("img", {
          src: r,
          alt: `Foto de ${t || "pessoa"}`,
          style: { width: "100%", height: "100%", objectFit: "cover" },
        })
      : i,
  });
}
const ya = {
  purple: {
    bg: "rgba(124,58,237,0.14)",
    border: "rgba(124,58,237,0.35)",
    text: "#C4B5FD",
  },
  green: {
    bg: "rgba(16,185,129,0.14)",
    border: "rgba(16,185,129,0.35)",
    text: "#34D399",
  },
  blue: {
    bg: "rgba(37,99,235,0.14)",
    border: "rgba(37,99,235,0.35)",
    text: "#93C5FD",
  },
  red: {
    bg: "rgba(239,68,68,0.14)",
    border: "rgba(239,68,68,0.35)",
    text: "#FCA5A5",
  },
  amber: {
    bg: "rgba(245,158,11,0.14)",
    border: "rgba(245,158,11,0.35)",
    text: "#FCD34D",
  },
  yellow: {
    bg: "rgba(245,158,11,0.14)",
    border: "rgba(245,158,11,0.35)",
    text: "#FCD34D",
  },
  orange: {
    bg: "rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.35)",
    text: "#FDB97D",
  },
};
function de({ color: t = "purple", children: r }) {
  const a = ya[t];
  return e("span", {
    style: {
      display: "inline-flex",
      padding: "0.35rem 0.75rem",
      borderRadius: 999,
      background: a.bg,
      border: `1px solid ${a.border}`,
      color: a.text,
      fontSize: "0.75rem",
      fontWeight: 800,
      marginBottom: "0.75rem",
    },
    children: r,
  });
}
function ne({
  title: t,
  subtitle: r,
  onClose: a,
  maxWidth: o = 540,
  footer: n,
  children: i,
}) {
  return e("div", {
    className: "modal-overlay",
    style: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.68)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e3,
      padding: "1rem",
    },
    children: e("div", {
      className: "modern-card",
      style: {
        width: o,
        maxWidth: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        margin: 0,
        boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
      },
      children: [
        e("div", {
          className: "modern-card-header",
          children: [
            e("div", {
              children: [
                e("h2", { className: "modern-card-title", children: t }),
                r &&
                  e("p", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      marginTop: 4,
                    },
                    children: r,
                  }),
              ],
            }),
            e("button", {
              className: "btn-icon",
              type: "button",
              onClick: a,
              "aria-label": "Fechar",
              children: "✕",
            }),
          ],
        }),
        i,
        n && e("div", { className: "form-actions", children: n }),
      ],
    }),
  });
}
function Se({
  title: t,
  message: r,
  onConfirm: a,
  onCancel: o,
  danger: n = !1,
  confirmLabel: i = "Confirmar",
  cancelLabel: s = "Cancelar",
}) {
  return e("div", {
    style: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.72)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: "1rem",
    },
    children: e("div", {
      className: "modern-card",
      style: {
        width: 420,
        maxWidth: "100%",
        margin: 0,
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
      },
      children: [
        e("h2", {
          className: "modern-card-title",
          style: { marginBottom: "0.75rem" },
          children: t,
        }),
        e("p", {
          style: {
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            margin: "0 0 1.5rem",
          },
          children: r,
        }),
        e("div", {
          className: "form-actions",
          children: [
            e("button", {
              type: "button",
              className: "btn-secondary",
              onClick: o,
              children: s,
            }),
            e("button", {
              type: "button",
              className: "btn-primary",
              onClick: a,
              style: n
                ? {
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 10px 24px rgba(239,68,68,0.35)",
                  }
                : void 0,
              children: i,
            }),
          ],
        }),
      ],
    }),
  });
}
function ue() {
  const [t, r] = g(""),
    [a, o] = g(""),
    n = (u, y = 3500) => {
      (r(u), o(""), setTimeout(() => r((k) => (k === u ? "" : k)), y));
    },
    i = (u, y = 4e3) => {
      (o(u), r(""), setTimeout(() => o((k) => (k === u ? "" : k)), y));
    };
  return {
    success: t,
    error: a,
    clearSuccess: () => r(""),
    clearError: () => o(""),
    showSuccess: n,
    showError: i,
    showWarning: (u) => i(u),
    showInfo: (u) => n(u),
    notification: t
      ? { type: "success", message: t }
      : a
        ? { type: "error", message: a }
        : null,
    clear: () => {
      (r(""), o(""));
    },
    show: (u, y = "success") => {
      y === "success" || y === "info" ? n(u) : i(u);
    },
  };
}
const ft = [
    {
      value: "BOAS_VINDAS",
      label: "Boas-vindas",
      icon: "👋",
      color: "#10B981",
    },
    { value: "VISITANTE", label: "Visitante", icon: "🚶", color: "#2563EB" },
    {
      value: "ANIVERSARIANTE",
      label: "Aniversariante",
      icon: "🎁",
      color: "#F59E0B",
    },
    {
      value: "MEMBRO_AFASTADO",
      label: "Membro Afastado",
      icon: "☁️",
      color: "#8B5CF6",
    },
    {
      value: "MEMBRO_DOENTE",
      label: "Membro Doente",
      icon: "🩹",
      color: "#EF4444",
    },
    {
      value: "GRUPOS_IGREJA",
      label: "Grupos da Igreja",
      icon: "👥",
      color: "#2563EB",
    },
    {
      value: "BATISMO_NAS_AGUAS",
      label: "Batismo nas Águas",
      icon: "💧",
      color: "#06B6D4",
    },
    { value: "CASAMENTO", label: "Casamento", icon: "❤️", color: "#EC4899" },
    { value: "SANTA_CEIA", label: "Santa Ceia", icon: "🍷", color: "#F59E0B" },
    {
      value: "PEDIDO_ORACAO",
      label: "Pedido de Oração",
      icon: "🙏",
      color: "#10B981",
    },
    {
      value: "CONVITE_CULTO",
      label: "Convite para Culto",
      icon: "⛪",
      color: "#8B5CF6",
    },
  ],
  pr = [
    { value: "visitors", label: "Visitantes" },
    { value: "birthdays", label: "Aniversariantes do Mês" },
    { value: "away", label: "Membros Afastados" },
    { value: "sick", label: "Membros Doentes" },
    { value: "youth", label: "Grupo de Jovens" },
    { value: "everyone", label: "Todos os Membros" },
  ];
function va() {
  var wt;
  const [t, r] = g([]),
    [a, o] = g([]),
    [n, i] = g([]),
    [s, d] = g(!0),
    [f, h] = g(!1),
    [p, l] = g(!1),
    { notification: m, showSuccess: u, showError: y, clear: k } = ue(),
    [T, v] = g(null),
    [b, x] = g(""),
    [C, z] = g(""),
    [A, R] = g(""),
    [P, I] = g(!0),
    [j, E] = g("Todas as categorias"),
    [M, F] = g(""),
    [D, Y] = g("center"),
    [N, $] = g(null),
    [H, Q] = g(null),
    [_, c] = g(!1),
    [B, V] = g(!1),
    [ae, le] = g(!1),
    [Ce, we] = g(null),
    [Ie, Ze] = g("single"),
    [Me, w] = g(""),
    [W, ee] = g("visitors"),
    [ge, Re] = g("Maria"),
    [ke, _r] = g("");
  Z(() => {
    (Ke(), xr());
  }, []);
  const Ke = async () => {
      d(!0);
      try {
        const S = await fetch("/api/pastor/pastoral-messages");
        if (!S.ok) throw new Error();
        const X = await S.json();
        r(X || []);
      } catch {
        y("Erro ao carregar mensagens pastorais.");
      } finally {
        d(!1);
      }
    },
    et = async () => {
      try {
        const S = await fetch("/api/pastor/pastoral-history");
        if (S.ok) {
          const X = await S.json();
          o(X || []);
        }
      } catch {
        y("Erro ao carregar histórico de envios.");
      }
    },
    xr = async () => {
      try {
        const S = await fetch("/api/pastor/members");
        if (S.ok) {
          const X = await S.json();
          i(X || []);
        }
      } catch {
        console.error("Erro ao carregar membros");
      }
    },
    tt = () => {
      (v(null), x(""), z(""), R(""), I(!0));
    },
    Sr = async (S) => {
      if ((S.preventDefault(), !b.trim())) {
        y("Selecione uma categoria para a mensagem.");
        return;
      }
      if (!C.trim()) {
        y("Informe o título da mensagem.");
        return;
      }
      if (!A.trim()) {
        y("Escreva o conteúdo da mensagem.");
        return;
      }
      h(!0);
      try {
        const X = T ? "PUT" : "POST",
          fe = T
            ? `/api/pastor/pastoral-messages/${T}`
            : "/api/pastor/pastoral-messages";
        if (
          !(
            await fetch(fe, {
              method: X,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                categoria: b,
                titulo: C,
                mensagem: A,
                status: P ? "ATIVA" : "INATIVA",
              }),
            })
          ).ok
        )
          throw new Error();
        (u(
          T
            ? "Mensagem atualizada com sucesso."
            : "Mensagem cadastrada com sucesso.",
        ),
          tt(),
          Ke());
      } catch {
        y("Erro ao salvar mensagem pastoral.");
      } finally {
        h(!1);
      }
    },
    Cr = (S) => {
      (v(S.id),
        x(S.categoria),
        z(S.titulo),
        R(S.mensagem),
        I(S.status === "ATIVA"));
    },
    wr = (S) => we(S),
    kr = async () => {
      if (Ce === null) return;
      const S = Ce;
      we(null);
      try {
        if (
          !(
            await fetch(`/api/pastor/pastoral-messages/${S}`, {
              method: "DELETE",
            })
          ).ok
        )
          throw new Error();
        (u("Mensagem excluída com sucesso."), Ke());
      } catch {
        y("Erro ao excluir mensagem.");
      }
    },
    Ar = (S) => {
      (Q(S), c(!0));
    },
    Er = (S) => {
      (Q(S), V(!0));
    },
    Nr = () => {
      if (!H) return;
      if (!ke.trim()) {
        y("Informe um número de WhatsApp.");
        return;
      }
      const S = Ae(H.mensagem, ge),
        X = $t(ke);
      window.open(
        `https://wa.me/55${X}?text=${encodeURIComponent(S)}`,
        "_blank",
      );
    },
    Br = async () => {
      if (H) {
        if (Ie === "list") {
          le(!0);
          return;
        }
        l(!0);
        try {
          const S = n.find((Fe) => Fe.id.toString() === Me);
          if (!S) {
            y("Selecione uma pessoa.");
            return;
          }
          const X = $t(S.whatsapp || S.phone || ""),
            fe = Ae(H.mensagem, S.name);
          if (!X) {
            y("O membro selecionado não possui WhatsApp cadastrado.");
            return;
          }
          (window.open(
            `https://wa.me/55${X}?text=${encodeURIComponent(fe)}`,
            "_blank",
          ),
            await fetch("/api/pastor/pastoral-bulk-send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message_id: H.id,
                target: "single",
                target_id: S.id,
                mensagem_final: fe,
                telefone: X,
              }),
            }),
            u("Mensagem aberta no WhatsApp e registrada no histórico."),
            c(!1),
            Q(null),
            et());
        } catch {
          y("Erro ao enviar mensagem pastoral.");
        } finally {
          l(!1);
        }
      }
    },
    Tr = async () => {
      if (H) {
        (le(!1), l(!0));
        try {
          if (
            !(
              await fetch("/api/pastor/pastoral-bulk-send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message_id: H.id,
                  target: "list",
                  list: W,
                }),
              })
            ).ok
          )
            throw new Error();
          (u("Disparo em massa registrado para processamento."),
            c(!1),
            Q(null),
            et());
        } catch {
          y("Erro ao enviar mensagem pastoral.");
        } finally {
          l(!1);
        }
      }
    },
    rt = t.filter((S) => {
      const X = bt(S.categoria),
        fe = j === "Todas as categorias" || X.label === j,
        Fe =
          S.titulo.toLowerCase().includes(M.toLowerCase()) ||
          S.mensagem.toLowerCase().includes(M.toLowerCase());
      return fe && Fe;
    }),
    zr = t.length,
    Dr = t.filter((S) => S.status === "ATIVA").length,
    Ir = t.filter((S) => S.status !== "ATIVA").length,
    Mr = new Set(t.map((S) => S.categoria)).size;
  return e("div", {
    className: "main-content",
    children: [
      m &&
        e(K, {
          type: m.type,
          message: m.message,
          onClose: k,
          autoDismiss: 3500,
          fixed: !0,
        }),
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "purple", children: "Comunicação pastoral" }),
              e("h1", { children: "💬 Central de Mensagens Pastorais" }),
              e("p", {
                children:
                  "Crie, edite, visualize e envie mensagens para visitantes, membros, aniversariantes, afastados, doentes e grupos da igreja.",
              }),
            ],
          }),
          e("div", {
            style: {
              display: "flex",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.04)",
              padding: "0.4rem",
              borderRadius: 14,
              border: "1px solid var(--border)",
            },
            children: [
              e("button", {
                className: D === "center" ? "btn-primary" : "btn-secondary",
                style: { padding: "0.55rem 1rem", fontSize: "0.85rem" },
                onClick: () => Y("center"),
                children: "📱 Central",
              }),
              e("button", {
                className: D === "history" ? "btn-primary" : "btn-secondary",
                style: { padding: "0.55rem 1rem", fontSize: "0.85rem" },
                onClick: () => {
                  (Y("history"), et());
                },
                children: "📜 Histórico",
              }),
            ],
          }),
        ],
      }),
      e("div", {
        className: "stats-grid",
        style: {
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        },
        children: [
          e(O, { title: "Mensagens", value: zr, color: "#8B5CF6", icon: "💬" }),
          e(O, { title: "Ativas", value: Dr, color: "#10B981", icon: "✅" }),
          e(O, { title: "Inativas", value: Ir, color: "#EF4444", icon: "🔒" }),
          e(O, {
            title: "Categorias",
            value: Mr,
            color: "#F59E0B",
            icon: "🏷️",
          }),
        ],
      }),
      D === "center"
        ? e("div", {
            className: "content-grid",
            style: { gridTemplateColumns: "1.4fr 0.9fr", alignItems: "start" },
            children: [
              e("div", {
                className: "modern-card",
                children: [
                  e("div", {
                    className: "modern-card-header",
                    children: [
                      e("div", {
                        children: [
                          e("h2", {
                            className: "modern-card-title",
                            children: "Mensagens Cadastradas",
                          }),
                          e("p", {
                            style: {
                              color: "var(--text-muted)",
                              fontSize: "0.8rem",
                              marginTop: 4,
                            },
                            children: [
                              rt.length,
                              " mensagem(ns) encontrada(s).",
                            ],
                          }),
                        ],
                      }),
                      e("button", {
                        className: "btn-primary",
                        onClick: tt,
                        children: "+ Nova Mensagem",
                      }),
                    ],
                  }),
                  e("div", {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1.3fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    },
                    children: [
                      e("select", {
                        value: j,
                        onChange: (S) => E(S.currentTarget.value),
                        children: [
                          e("option", { children: "Todas as categorias" }),
                          ft.map((S) =>
                            e("option", { children: S.label }, S.value),
                          ),
                        ],
                      }),
                      e("input", {
                        type: "text",
                        placeholder: "Buscar por título ou conteúdo...",
                        value: M,
                        onInput: (S) => F(S.currentTarget.value),
                      }),
                    ],
                  }),
                  s
                    ? e(pe, { rows: 6, height: 62 })
                    : rt.length === 0
                      ? e(te, {
                          icon: "💬",
                          title: "Nenhuma mensagem encontrada",
                          description:
                            "Cadastre mensagens pastorais para visitantes, aniversariantes, afastados, doentes e grupos.",
                        })
                      : e("div", {
                          style: { overflowX: "auto" },
                          children: e("table", {
                            className: "modern-table",
                            children: [
                              e("thead", {
                                children: e("tr", {
                                  children: [
                                    e("th", { children: "Categoria" }),
                                    e("th", { children: "Título" }),
                                    e("th", { children: "Status" }),
                                    e("th", { children: "Ações" }),
                                  ],
                                }),
                              }),
                              e("tbody", {
                                children: rt.map((S) => {
                                  const X = bt(S.categoria);
                                  return e(
                                    "tr",
                                    {
                                      children: [
                                        e("td", {
                                          children: e(gr, { category: X }),
                                        }),
                                        e("td", {
                                          children: e("div", {
                                            children: [
                                              e("strong", {
                                                style: {
                                                  color: "var(--text-main)",
                                                  fontSize: "0.9rem",
                                                },
                                                children: S.titulo,
                                              }),
                                              e("div", {
                                                style: {
                                                  color: "var(--text-muted)",
                                                  fontSize: "0.75rem",
                                                  maxWidth: 260,
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  whiteSpace: "nowrap",
                                                  marginTop: 3,
                                                },
                                                children: S.mensagem,
                                              }),
                                            ],
                                          }),
                                        }),
                                        e("td", {
                                          children:
                                            S.status === "ATIVA"
                                              ? e(U, {
                                                  label: "Ativa",
                                                  color: "#10B981",
                                                  icon: "✅",
                                                })
                                              : e(U, {
                                                  label: "Inativa",
                                                  color: "#EF4444",
                                                  icon: "🔒",
                                                }),
                                        }),
                                        e("td", {
                                          children: e("div", {
                                            className: "action-btns",
                                            children: [
                                              e("button", {
                                                className: "btn-icon",
                                                title: "Enviar",
                                                onClick: () => Ar(S),
                                                children: "✈️",
                                              }),
                                              e("button", {
                                                className: "btn-icon",
                                                title: "Testar",
                                                onClick: () => Er(S),
                                                children: "🚀",
                                              }),
                                              e("button", {
                                                className: "btn-icon",
                                                title: "Visualizar",
                                                onClick: () => $(S),
                                                children: "👁️",
                                              }),
                                              e("button", {
                                                className: "btn-icon",
                                                title: "Editar",
                                                onClick: () => Cr(S),
                                                children: "✏️",
                                              }),
                                              e("button", {
                                                className: "btn-icon delete",
                                                title: "Excluir",
                                                onClick: () => wr(S.id),
                                                children: "🗑️",
                                              }),
                                            ],
                                          }),
                                        }),
                                      ],
                                    },
                                    S.id,
                                  );
                                }),
                              }),
                            ],
                          }),
                        }),
                ],
              }),
              e("div", {
                className: "modern-card",
                children: [
                  e("div", {
                    className: "modern-card-header",
                    children: e("div", {
                      children: [
                        e("h2", {
                          className: "modern-card-title",
                          children: T ? "Editar Mensagem" : "Nova Mensagem",
                        }),
                        e("p", {
                          style: {
                            color: "var(--text-muted)",
                            fontSize: "0.8rem",
                            marginTop: 4,
                          },
                          children: [
                            "Use variáveis como ",
                            "{nome}",
                            ", ",
                            "{igreja}",
                            " e ",
                            "{data}",
                            ".",
                          ],
                        }),
                      ],
                    }),
                  }),
                  e("form", {
                    onSubmit: Sr,
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    },
                    children: [
                      e("label", {
                        children: [
                          "Categoria *",
                          e("select", {
                            value: b,
                            onChange: (S) => x(S.currentTarget.value),
                            required: !0,
                            children: [
                              e("option", {
                                value: "",
                                children: "Selecione...",
                              }),
                              ft.map((S) =>
                                e(
                                  "option",
                                  { value: S.value, children: S.label },
                                  S.value,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                      e("label", {
                        children: [
                          "Título Interno *",
                          e("input", {
                            type: "text",
                            placeholder: "Ex: Boas-vindas para visitante",
                            value: C,
                            onInput: (S) => z(S.currentTarget.value),
                            required: !0,
                          }),
                        ],
                      }),
                      e("label", {
                        children: [
                          "Mensagem *",
                          e("textarea", {
                            style: { minHeight: 170, resize: "vertical" },
                            placeholder:
                              "Olá, {nome}! Seja bem-vindo à {igreja}...",
                            value: A,
                            onInput: (S) => R(S.currentTarget.value),
                            required: !0,
                          }),
                        ],
                      }),
                      e("label", {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.9rem 1rem",
                          borderRadius: 16,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                        },
                        children: [
                          e("input", {
                            type: "checkbox",
                            checked: P,
                            onChange: (S) => I(S.currentTarget.checked),
                            style: { width: 18, height: 18 },
                          }),
                          e("span", {
                            style: {
                              color: "var(--text-main)",
                              fontWeight: 800,
                            },
                            children: "Mensagem ativa",
                          }),
                        ],
                      }),
                      e("div", {
                        style: {
                          padding: "1rem",
                          borderRadius: 18,
                          background: "rgba(124,58,237,0.08)",
                          border: "1px solid rgba(124,58,237,0.22)",
                        },
                        children: [
                          e("strong", {
                            style: { color: "#C4B5FD", fontSize: "0.85rem" },
                            children: "Prévia com variáveis",
                          }),
                          e("p", {
                            style: {
                              margin: "0.5rem 0 0",
                              color: "var(--text-muted)",
                              fontSize: "0.85rem",
                              lineHeight: 1.6,
                              whiteSpace: "pre-wrap",
                            },
                            children: A
                              ? Ae(A, "Maria")
                              : "A prévia da mensagem aparecerá aqui.",
                          }),
                        ],
                      }),
                      e("div", {
                        className: "form-actions",
                        children: [
                          e("button", {
                            type: "button",
                            className: "btn-secondary",
                            onClick: tt,
                            children: "Limpar",
                          }),
                          e("button", {
                            type: "submit",
                            className: "btn-primary",
                            disabled: f,
                            children: f
                              ? "Salvando..."
                              : T
                                ? "Atualizar Mensagem"
                                : "Salvar Mensagem",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        : e(_a, { history: a }),
      _ &&
        H &&
        e(xa, {
          message: H,
          members: n,
          sendType: Ie,
          selectedMember: Me,
          selectedList: W,
          sending: p,
          onSendTypeChange: Ze,
          onMemberChange: w,
          onListChange: ee,
          onClose: () => {
            (c(!1), Q(null));
          },
          onSend: Br,
          replaceVariables: Ae,
        }),
      N && e(Sa, { message: N, onClose: () => $(null) }),
      B &&
        H &&
        e(Ca, {
          message: H,
          testName: ge,
          testPhone: ke,
          setTestName: Re,
          setTestPhone: _r,
          onClose: () => {
            (V(!1), Q(null));
          },
          onOpenWhatsApp: Nr,
          replaceVariables: Ae,
        }),
      ae &&
        e(Se, {
          title: "Confirmar Disparo em Massa",
          message: `Deseja realmente enviar esta mensagem para a lista "${((wt = pr.find((S) => S.value === W)) == null ? void 0 : wt.label) || W}"? Esta ação não pode ser desfeita.`,
          confirmLabel: "Enviar para todos",
          onConfirm: Tr,
          onCancel: () => le(!1),
        }),
      Ce !== null &&
        e(Se, {
          title: "Excluir Mensagem",
          message:
            "Tem certeza que deseja excluir esta mensagem pastoral? Essa ação não poderá ser desfeita.",
          confirmLabel: "Excluir",
          onConfirm: kr,
          onCancel: () => we(null),
          danger: !0,
        }),
    ],
  });
}
function bt(t) {
  return (
    ft.find((r) => r.value === t) || {
      value: t,
      label: t,
      icon: "📄",
      color: "#6B7280",
    }
  );
}
function Ae(t, r) {
  return t
    .replace(/{nome}/g, r)
    .replace(/{igreja}/g, "Igreja da Graça")
    .replace(/{data}/g, new Date().toLocaleDateString("pt-BR"));
}
function $t(t) {
  return t.replace(/\D/g, "");
}
function gr({ category: t }) {
  return e("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: "0.82rem",
      fontWeight: 800,
      color: "var(--text-main)",
    },
    children: [
      e("span", {
        style: {
          width: 34,
          height: 34,
          borderRadius: 12,
          background: `${t.color}20`,
          border: `1px solid ${t.color}55`,
          color: t.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: t.icon,
      }),
      t.label,
    ],
  });
}
function _a({ history: t }) {
  return e("div", {
    className: "modern-card",
    children: [
      e("div", {
        className: "modern-card-header",
        children: e("div", {
          children: [
            e("h2", {
              className: "modern-card-title",
              children: "Histórico de Envios",
            }),
            e("p", {
              style: {
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 4,
              },
              children: "Últimos registros de mensagens pastorais enviadas.",
            }),
          ],
        }),
      }),
      t.length === 0
        ? e(te, {
            icon: "📜",
            title: "Nenhum envio registrado",
            description:
              "Quando mensagens pastorais forem enviadas, o histórico aparecerá aqui.",
          })
        : e("div", {
            style: { overflowX: "auto" },
            children: e("table", {
              className: "modern-table",
              children: [
                e("thead", {
                  children: e("tr", {
                    children: [
                      e("th", { children: "Data/Hora" }),
                      e("th", { children: "Mensagem" }),
                      e("th", { children: "Destinatário" }),
                      e("th", { children: "Status" }),
                      e("th", { children: "Autor" }),
                    ],
                  }),
                }),
                e("tbody", {
                  children: t.map((r) =>
                    e(
                      "tr",
                      {
                        children: [
                          e("td", {
                            style: {
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            },
                            children: r.enviado_em
                              ? new Date(r.enviado_em).toLocaleString("pt-BR")
                              : "-",
                          }),
                          e("td", {
                            children: e("strong", {
                              style: {
                                color: "var(--text-main)",
                                fontSize: "0.85rem",
                              },
                              children: r.message_title || "Mensagem",
                            }),
                          }),
                          e("td", {
                            children: [
                              e("strong", {
                                style: {
                                  color: "var(--text-main)",
                                  fontSize: "0.85rem",
                                },
                                children: r.member_name || "Destinatário",
                              }),
                              e("br", {}),
                              e("small", {
                                style: { color: "var(--text-muted)" },
                                children: r.telefone || "-",
                              }),
                            ],
                          }),
                          e("td", {
                            children:
                              r.status === "Enviado" || r.status === "success"
                                ? e(U, {
                                    label: "Enviado",
                                    color: "#10B981",
                                    icon: "✅",
                                  })
                                : e(U, {
                                    label: r.status || "Falhou",
                                    color: "#EF4444",
                                    icon: "⚠️",
                                  }),
                          }),
                          e("td", {
                            children: e("small", {
                              style: { color: "var(--text-muted)" },
                              children: r.enviado_por || "-",
                            }),
                          }),
                        ],
                      },
                      r.id,
                    ),
                  ),
                }),
              ],
            }),
          }),
    ],
  });
}
function xa(t) {
  const r = t.members.find((a) => a.id.toString() === t.selectedMember);
  return e(ne, {
    title: "✈️ Enviar Mensagem Pastoral",
    subtitle: "Escolha o destino e pré-visualize antes de enviar.",
    onClose: t.onClose,
    maxWidth: 620,
    children: e("div", {
      style: { display: "grid", gap: "1rem" },
      children: [
        e("label", {
          children: [
            "Escolha o destino",
            e("div", {
              style: { display: "flex", gap: "1rem", marginTop: "0.6rem" },
              children: [
                e("label", {
                  style: { display: "flex", alignItems: "center", gap: 8 },
                  children: [
                    e("input", {
                      type: "radio",
                      checked: t.sendType === "single",
                      onChange: () => t.onSendTypeChange("single"),
                    }),
                    "Pessoa específica",
                  ],
                }),
                e("label", {
                  style: { display: "flex", alignItems: "center", gap: 8 },
                  children: [
                    e("input", {
                      type: "radio",
                      checked: t.sendType === "list",
                      onChange: () => t.onSendTypeChange("list"),
                    }),
                    "Lista",
                  ],
                }),
              ],
            }),
          ],
        }),
        t.sendType === "single"
          ? e("label", {
              children: [
                "Membro / Visitante",
                e("select", {
                  value: t.selectedMember,
                  onChange: (a) => t.onMemberChange(a.currentTarget.value),
                  children: [
                    e("option", {
                      value: "",
                      children: "Selecione um nome...",
                    }),
                    t.members.map((a) =>
                      e(
                        "option",
                        {
                          value: a.id,
                          children: [
                            a.name,
                            " (",
                            a.whatsapp || a.phone || "sem WhatsApp",
                            ")",
                          ],
                        },
                        a.id,
                      ),
                    ),
                  ],
                }),
              ],
            })
          : e("label", {
              children: [
                "Lista de Envio",
                e("select", {
                  value: t.selectedList,
                  onChange: (a) => t.onListChange(a.currentTarget.value),
                  children: pr.map((a) =>
                    e("option", { value: a.value, children: a.label }, a.value),
                  ),
                }),
              ],
            }),
        e("div", {
          style: {
            background: "rgba(16,185,129,0.08)",
            padding: "1rem",
            borderRadius: 18,
            border: "1px solid rgba(16,185,129,0.22)",
          },
          children: [
            e("strong", {
              style: { color: "#34D399" },
              children: "Prévia da mensagem",
            }),
            e("p", {
              style: {
                color: "var(--text-muted)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                marginBottom: 0,
              },
              children: t.replaceVariables(
                t.message.mensagem,
                (r == null ? void 0 : r.name) || "Nome do Membro",
              ),
            }),
          ],
        }),
        e("div", {
          className: "form-actions",
          children: [
            e("button", {
              className: "btn-secondary",
              onClick: t.onClose,
              children: "Cancelar",
            }),
            e("button", {
              className: "btn-primary",
              onClick: t.onSend,
              disabled: t.sending,
              children: t.sending
                ? "Enviando..."
                : t.sendType === "list"
                  ? "Enviar para Lista"
                  : "Enviar Agora",
            }),
          ],
        }),
      ],
    }),
  });
}
function Sa({ message: t, onClose: r }) {
  const a = bt(t.categoria);
  return e(ne, {
    title: t.titulo,
    onClose: r,
    maxWidth: 540,
    children: [
      e(gr, { category: a }),
      e("div", {
        style: {
          background: "rgba(255,255,255,0.04)",
          padding: "1rem",
          borderRadius: 16,
          border: "1px solid var(--border)",
          marginTop: "1rem",
          whiteSpace: "pre-wrap",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        },
        children: t.mensagem,
      }),
      e("div", {
        className: "form-actions",
        style: { marginTop: "1.5rem" },
        children: e("button", {
          className: "btn-secondary",
          onClick: r,
          children: "Fechar",
        }),
      }),
    ],
  });
}
function Ca(t) {
  return e(ne, {
    title: "🚀 Testar WhatsApp",
    subtitle: "Visualize como a mensagem chegará ao destinatário.",
    onClose: t.onClose,
    maxWidth: 430,
    children: e("div", {
      style: { display: "grid", gap: "1rem" },
      children: [
        e("label", {
          children: [
            "Nome de teste",
            e("input", {
              value: t.testName,
              onInput: (r) => t.setTestName(r.currentTarget.value),
            }),
          ],
        }),
        e("label", {
          children: [
            "Número WhatsApp com DDD",
            e("input", {
              placeholder: "Ex: 11999999999",
              value: t.testPhone,
              onInput: (r) => t.setTestPhone(r.currentTarget.value),
            }),
          ],
        }),
        e("div", {
          style: {
            background: "rgba(255,255,255,0.04)",
            padding: "1rem",
            borderRadius: 16,
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          },
          children: t.replaceVariables(t.message.mensagem, t.testName),
        }),
        e("button", {
          className: "btn-primary",
          onClick: t.onOpenWhatsApp,
          children: "Abrir WhatsApp Web",
        }),
        e("button", {
          className: "btn-secondary",
          onClick: t.onClose,
          children: "Fechar",
        }),
      ],
    }),
  });
}
function He(t) {
  return `${t}-${Math.random().toString(36).slice(2, 9)}`;
}
function wa({ data: t }) {
  const r = He("lineGradient"),
    a = He("areaGradient"),
    o = He("glowLine");
  if (!(t != null && t.length))
    return e("div", {
      className: "skeleton",
      style: {
        height: 190,
        borderRadius: 18,
        background: "rgba(255,255,255,0.03)",
      },
    });
  const n = 560,
    i = 180,
    s = 38,
    d = 26,
    f = t.map((v) => v.count),
    h = Math.max(...f, 1),
    p = Math.min(...f, 0),
    l = h - p || 1,
    m = (v) =>
      t.length === 1 ? n / 2 : s + (v / (t.length - 1)) * (n - s * 2),
    u = (v) => i - d - ((v - p) / l) * (i - d * 2),
    y = t.map((v, b) => ({ x: m(b), y: u(v.count), ...v })),
    k = y.map((v, b) => `${b ? "L" : "M"}${v.x},${v.y}`).join(" "),
    T =
      y.length > 1
        ? `${k} L${y[y.length - 1].x},${i - d} L${y[0].x},${i - d} Z`
        : "";
  return e("svg", {
    viewBox: `0 0 ${n} ${i}`,
    style: { width: "100%", height: 190, display: "block" },
    role: "img",
    "aria-label": "Gráfico de crescimento",
    children: [
      e("defs", {
        children: [
          e("linearGradient", {
            id: r,
            x1: "0",
            y1: "0",
            x2: "1",
            y2: "0",
            children: [
              e("stop", { offset: "0%", stopColor: "#7C3AED" }),
              e("stop", { offset: "50%", stopColor: "#8B5CF6" }),
              e("stop", { offset: "100%", stopColor: "#A78BFA" }),
            ],
          }),
          e("linearGradient", {
            id: a,
            x1: "0",
            y1: "0",
            x2: "0",
            y2: "1",
            children: [
              e("stop", {
                offset: "0%",
                stopColor: "#8B5CF6",
                stopOpacity: "0.42",
              }),
              e("stop", {
                offset: "55%",
                stopColor: "#7C3AED",
                stopOpacity: "0.16",
              }),
              e("stop", {
                offset: "100%",
                stopColor: "#7C3AED",
                stopOpacity: "0",
              }),
            ],
          }),
          e("filter", {
            id: o,
            children: [
              e("feGaussianBlur", { stdDeviation: "4", result: "coloredBlur" }),
              e("feMerge", {
                children: [
                  e("feMergeNode", { in: "coloredBlur" }),
                  e("feMergeNode", { in: "SourceGraphic" }),
                ],
              }),
            ],
          }),
        ],
      }),
      [0, 1, 2, 3].map((v) => {
        const b = d + (v * (i - d * 2)) / 3;
        return e(
          "line",
          {
            x1: s,
            x2: n - s,
            y1: b,
            y2: b,
            stroke: "rgba(255,255,255,0.06)",
            strokeWidth: "1",
          },
          v,
        );
      }),
      T && e("path", { d: T, fill: `url(#${a})` }),
      y.length > 1 &&
        e("path", {
          d: k,
          fill: "none",
          stroke: `url(#${r})`,
          strokeWidth: "4",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          filter: `url(#${o})`,
        }),
      y.map((v, b) =>
        e(
          "g",
          {
            children: [
              e("circle", {
                cx: v.x,
                cy: v.y,
                r: "9",
                fill: "#8B5CF6",
                opacity: "0.16",
              }),
              e("circle", {
                cx: v.x,
                cy: v.y,
                r: "5",
                fill: "#8B5CF6",
                stroke: "#070B1A",
                strokeWidth: "2",
              }),
            ],
          },
          b,
        ),
      ),
      y.map((v, b) =>
        e(
          "text",
          {
            x: v.x,
            y: v.y - 14,
            textAnchor: "middle",
            fill: "#CBD5E1",
            fontSize: "10",
            fontWeight: "700",
            fontFamily: "Inter",
            children: v.count,
          },
          b,
        ),
      ),
      y.map((v, b) =>
        e(
          "text",
          {
            x: v.x,
            y: i - 4,
            textAnchor: "middle",
            fill: "#64748B",
            fontSize: "10",
            fontWeight: "600",
            fontFamily: "Inter",
            children: v.month,
          },
          `month-${b}`,
        ),
      ),
    ],
  });
}
function Ot({ segments: t, total: r, label: a }) {
  const o = He("donutGlow"),
    n = 54,
    i = 72,
    s = 72,
    d = 2 * Math.PI * n,
    f = Math.max(r, 1);
  let h = 0;
  const p = t.map((l) => {
    const m = Math.max(0, (l.value / f) * d),
      u = { ...l, dash: m, offset: h };
    return ((h += m), u);
  });
  return e("svg", {
    viewBox: "0 0 144 144",
    width: "144",
    height: "144",
    role: "img",
    "aria-label": `Gráfico de ${a}`,
    children: [
      e("defs", {
        children: e("filter", {
          id: o,
          children: [
            e("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
            e("feMerge", {
              children: [
                e("feMergeNode", { in: "coloredBlur" }),
                e("feMergeNode", { in: "SourceGraphic" }),
              ],
            }),
          ],
        }),
      }),
      e("circle", {
        cx: i,
        cy: s,
        r: n,
        fill: "none",
        stroke: "rgba(255,255,255,0.06)",
        strokeWidth: "17",
      }),
      p.map((l, m) =>
        e(
          "circle",
          {
            cx: i,
            cy: s,
            r: n,
            fill: "none",
            stroke: l.color,
            strokeWidth: "17",
            strokeLinecap: "round",
            strokeDasharray: `${l.dash} ${d - l.dash}`,
            strokeDashoffset: -l.offset,
            transform: `rotate(-90 ${i} ${s})`,
            filter: `url(#${o})`,
            style: { transition: "all 0.8s ease" },
          },
          m,
        ),
      ),
      e("circle", { cx: i, cy: s, r: "39", fill: "rgba(7,11,26,0.88)" }),
      e("text", {
        x: i,
        y: s - 6,
        textAnchor: "middle",
        fill: "#FFFFFF",
        fontSize: "20",
        fontWeight: "900",
        fontFamily: "Inter",
        children: r.toLocaleString("pt-BR"),
      }),
      e("text", {
        x: i,
        y: s + 13,
        textAnchor: "middle",
        fill: "#9CA3AF",
        fontSize: "10",
        fontWeight: "600",
        fontFamily: "Inter",
        children: a,
      }),
    ],
  });
}
function ka({ label: t, value: r, max: a, color: o }) {
  const n = Math.min(100, Math.max(0, Math.round((r / Math.max(a, 1)) * 100)));
  return e("div", {
    style: { marginBottom: 13 },
    children: [
      e("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        },
        children: [
          e("span", {
            style: {
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            },
            children: t,
          }),
          e("span", {
            style: {
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "var(--text-main)",
            },
            children: r,
          }),
        ],
      }),
      e("div", {
        style: {
          height: 8,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 999,
          overflow: "hidden",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.35)",
        },
        children: e("div", {
          style: {
            height: "100%",
            width: `${n}%`,
            background: `linear-gradient(90deg, ${o}, ${o}cc)`,
            borderRadius: 999,
            transition: "width 1s ease",
            boxShadow: `0 0 14px ${o}80`,
          },
        }),
      }),
    ],
  });
}
function oe({ w: t = "100%", h: r = "1rem", r: a = "8px" }) {
  return e("div", {
    className: "skeleton",
    style: { width: t, height: r, borderRadius: a },
  });
}
const Aa = (t) =>
    t >= 1e3 ? `${(t / 1e3).toFixed(1).replace(".", ",")}k` : String(t),
  Lt = ["#7C3AED", "#2563EB", "#10B981", "#F59E0B", "#EC4899", "#EF4444"];
function Ea(t) {
  const r = t.toLowerCase();
  return r.includes("visita")
    ? "🏠"
    : r.includes("membro")
      ? "👤"
      : r.includes("visitan")
        ? "🚶"
        : r.includes("mensagem")
          ? "✉️"
          : r.includes("oração") || r.includes("oracao")
            ? "🙏"
            : r.includes("batismo") || r.includes("batiz")
              ? "💧"
              : r.includes("aniversár") || r.includes("aniversar")
                ? "🎂"
                : r.includes("configur")
                  ? "⚙️"
                  : r.includes("login") || r.includes("entrou")
                    ? "🔑"
                    : r.includes("saiu") || r.includes("logout")
                      ? "🚪"
                      : r.includes("exclu") || r.includes("remov")
                        ? "🗑️"
                        : r.includes("editou") || r.includes("atualiz")
                          ? "✏️"
                          : r.includes("criou") || r.includes("cadastr")
                            ? "✅"
                            : "📋";
}
function Na(t) {
  const r = t.toLowerCase();
  return r.includes("exclu") || r.includes("remov")
    ? "#EF4444"
    : r.includes("criou") || r.includes("cadastr")
      ? "#10B981"
      : r.includes("editou") || r.includes("atualiz")
        ? "#3B82F6"
        : r.includes("visita")
          ? "#8B5CF6"
          : "#6B7280";
}
function Ba({ onNavigate: t, userName: r, userRole: a }) {
  const [o, n] = g(null),
    [i, s] = g([]),
    [d, f] = g([]),
    [h, p] = g([]),
    [l, m] = g([]),
    [u, y] = g(!0),
    [k, T] = g(""),
    [v, b] = g(!0),
    [x, C] = g(!1);
  Z(() => {
    A();
  }, []);
  const z = async (c, B) => {
      try {
        const V = await fetch(c);
        return V.ok ? await V.json() : B;
      } catch {
        return B;
      }
    },
    A = he(async () => {
      (y(!0), T(""), b(!0));
      const [c, B, V, ae, le] = await Promise.all([
        z("/api/pastor/dashboard-stats", null),
        z("/api/pastor/visits", []),
        z("/api/pastor/members", []),
        z("/api/pastor/activities", []),
        z("/api/team/messages", []),
      ]);
      (n(c),
        s(B || []),
        f(V || []),
        p(ae || []),
        m(le || []),
        c || T("Algumas informações do dashboard não foram carregadas."),
        y(!1));
    }, []),
    R = he(async () => {
      C(!0);
      try {
        const c = await fetch("/api/pastor/export-report", { method: "GET" });
        if (c.ok) {
          const B = await c.blob(),
            V = URL.createObjectURL(B),
            ae = document.createElement("a");
          ((ae.href = V),
            (ae.download = `relatorio-${new Date().toISOString().slice(0, 10)}.pdf`),
            ae.click(),
            URL.revokeObjectURL(V));
        } else t("relatorios");
      } catch {
        t("relatorios");
      } finally {
        C(!1);
      }
    }, [t]),
    P = d.filter((c) => c.is_visitor).length,
    I =
      (o == null ? void 0 : o.total_members) ??
      d.filter((c) => !c.is_visitor).length,
    j = i.filter((c) => c.status === "Realizada").length,
    E = i.filter((c) => c.status === "Agendada").length,
    M = i.filter((c) => ["Pendente", "Reagendada"].includes(c.status)).length,
    F = i.filter((c) => c.carried_holy_communion).length,
    D = l.filter((c) =>
      ["ORACAO", "URGENTE", "AJUDA", "ENFERMIDADE"].includes(c.msg_type),
    ).length,
    Y = d.filter((c) => c.spiritual_status === "BATIZADO").length,
    N = [
      { label: "Agendadas", value: E, color: "#8B5CF6" },
      { label: "Realizadas", value: j, color: "#10B981" },
      { label: "Pendentes", value: M, color: "#F59E0B" },
      {
        label: "Canceladas",
        value: i.filter((c) => c.status === "Cancelada").length,
        color: "#EF4444",
      },
    ],
    $ = [
      { label: "Visitantes", value: P, color: "#8B5CF6" },
      { label: "Membros", value: I, color: "#10B981" },
      { label: "Batizados", value: Y, color: "#06B6D4" },
      { label: "Pedidos de oração", value: D, color: "#F59E0B" },
      { label: "Visitas", value: i.length, color: "#2563EB" },
    ],
    H = Math.max(...$.map((c) => c.value), 1),
    Q = Pa(d),
    _ = l
      .filter((c) =>
        ["ORACAO", "URGENTE", "AJUDA", "ENFERMIDADE"].includes(c.msg_type),
      )
      .slice(0, 5);
  return e("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) 292px",
      minHeight: "100vh",
    },
    children: [
      e("div", {
        style: { overflowY: "auto", padding: "1.5rem 2rem" },
        children: [
          e("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: 12,
            },
            children: [
              e("div", {
                children: [
                  e("span", {
                    style: {
                      display: "inline-flex",
                      padding: "0.35rem 0.75rem",
                      borderRadius: 999,
                      background: "rgba(124,58,237,0.14)",
                      border: "1px solid rgba(124,58,237,0.35)",
                      color: "#C4B5FD",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      marginBottom: "0.75rem",
                    },
                    children: "Painel pastoral",
                  }),
                  e("h1", {
                    style: {
                      fontSize: "1.65rem",
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      margin: 0,
                      background: "linear-gradient(135deg,#fff 40%,#9CA3AF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    },
                    children: [
                      "Bem-vindo,",
                      " ",
                      a === "pastor" ? `Pr. ${r || ""}` : r || "usuário",
                      " ",
                      "👋",
                    ],
                  }),
                  e("p", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.88rem",
                      margin: "4px 0 0",
                    },
                    children:
                      "Que Deus abençoe o seu dia e o cuidado com as pessoas da igreja.",
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                },
                children: [
                  e(Ee, {
                    icon: "👤",
                    label: "Novo Visitante",
                    color: "#8B5CF6",
                    onClick: () => t("visitantes"),
                  }),
                  e(Ee, {
                    icon: "🏠",
                    label: "Nova Visita",
                    color: "#10B981",
                    onClick: () => t("visitas"),
                  }),
                  e(Ee, {
                    icon: "✉️",
                    label: "Mensagem",
                    color: "#3B82F6",
                    onClick: () => t("mensagens"),
                  }),
                  e(Ee, {
                    icon: "🔄",
                    label: "Atualizar",
                    color: "#F59E0B",
                    onClick: A,
                  }),
                  e(Ee, {
                    icon: x ? "⏳" : "📤",
                    label: x ? "Exportando…" : "Exportar Relatório",
                    color: "#6366F1",
                    onClick: R,
                    disabled: x,
                  }),
                ],
              }),
            ],
          }),
          k && v && e(K, { message: k, type: "warning", onClose: () => b(!1) }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: "1.5rem",
            },
            children: u
              ? Array.from({ length: 6 }).map((c, B) => e(Fa, {}, B))
              : e(J, {
                  children: [
                    e(_e, {
                      icon: "👥",
                      label: "Membros",
                      value: I,
                      sub: `+${(o == null ? void 0 : o.new_members_month) ?? 0} este mês`,
                      color: "#2563EB",
                    }),
                    e(_e, {
                      icon: "🚶",
                      label: "Visitantes",
                      value: P,
                      sub: "Cadastrados",
                      color: "#8B5CF6",
                    }),
                    e(_e, {
                      icon: "🎂",
                      label: "Aniversariantes",
                      value:
                        (o == null ? void 0 : o.birthdays_month) ?? Q.length,
                      sub: "Este mês",
                      color: "#F59E0B",
                    }),
                    e(_e, {
                      icon: "🏠",
                      label: "Visitas",
                      value: j,
                      sub: `${E} agendadas`,
                      color: "#10B981",
                    }),
                    e(_e, {
                      icon: "🙏",
                      label: "Oração",
                      value: D,
                      sub: "Em acompanhamento",
                      color: "#EF4444",
                    }),
                    e(_e, {
                      icon: "🍇",
                      label: "Santa Ceia",
                      value: F,
                      sub: "Nas casas",
                      color: "#EC4899",
                    }),
                  ],
                }),
          }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 2fr) minmax(260px, 1fr) minmax(260px, 1fr)",
              gap: 12,
              marginBottom: 12,
            },
            children: [
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("div", {
                    className: "modern-card-header",
                    children: e("div", {
                      children: [
                        e("h2", {
                          className: "modern-card-title",
                          children: "📈 Crescimento da Igreja",
                        }),
                        e("p", {
                          style: {
                            color: "var(--text-muted)",
                            fontSize: "0.78rem",
                            marginTop: 4,
                          },
                          children: "Evolução dos últimos meses",
                        }),
                      ],
                    }),
                  }),
                  u
                    ? e(oe, { h: "190px", r: "16px" })
                    : e(wa, {
                        data: (o == null ? void 0 : o.growth_data) ?? [],
                      }),
                ],
              }),
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    style: { marginBottom: 12 },
                    children: "🎯 Visão Geral",
                  }),
                  e("div", {
                    style: { display: "flex", justifyContent: "center" },
                    children: e(Ot, {
                      segments: [
                        { label: "Membros", value: I, color: "#10B981" },
                        { label: "Visitantes", value: P, color: "#8B5CF6" },
                        { label: "Oração", value: D, color: "#F59E0B" },
                      ],
                      total: Math.max(I + P + D, 1),
                      label: "Pessoas",
                    }),
                  }),
                  e(Vt, {
                    items: [
                      { label: "Membros", value: I, color: "#10B981" },
                      { label: "Visitantes", value: P, color: "#8B5CF6" },
                      { label: "Oração", value: D, color: "#F59E0B" },
                    ],
                  }),
                ],
              }),
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    style: { marginBottom: 14 },
                    children: "📋 Resumo do Mês",
                  }),
                  [
                    {
                      label: "Novos membros",
                      value: (o == null ? void 0 : o.new_members_month) ?? 0,
                      color: "#10B981",
                    },
                    { label: "Novos visitantes", value: P, color: "#8B5CF6" },
                    { label: "Visitas realizadas", value: j, color: "#3B82F6" },
                    { label: "Batismos", value: Y, color: "#06B6D4" },
                    { label: "Santa Ceia em casa", value: F, color: "#EC4899" },
                  ].map((c) => e(Ta, { ...c }, c.label)),
                ],
              }),
            ],
          }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns:
                "minmax(260px, 1.3fr) minmax(260px, 1.2fr) minmax(250px, 1fr) minmax(260px, 1.2fr)",
              gap: 12,
            },
            children: [
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    style: { marginBottom: 12 },
                    children: "⚡ Atividade Recente",
                  }),
                  u
                    ? Array.from({ length: 5 }).map((c, B) => e(Wa, {}, B))
                    : h.length === 0
                      ? e(te, {
                          icon: "📋",
                          title: "Sem atividades",
                          description: "Nenhuma atividade recente registrada.",
                        })
                      : h.slice(0, 5).map((c) => e(za, { activity: c }, c.id)),
                ],
              }),
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    style: { marginBottom: 14 },
                    children: "👥 Indicadores Pastorais",
                  }),
                  $.map((c) =>
                    e(
                      ka,
                      {
                        label: c.label,
                        value: c.value,
                        max: H,
                        color: c.color,
                      },
                      c.label,
                    ),
                  ),
                ],
              }),
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    style: { marginBottom: 10 },
                    children: "🏠 Visitas",
                  }),
                  e("div", {
                    style: {
                      display: "flex",
                      justifyContent: "center",
                      margin: "8px 0",
                    },
                    children: e(Ot, {
                      segments: N,
                      total: Math.max(i.length, 1),
                      label: "Total",
                    }),
                  }),
                  e(Vt, { items: N, total: i.length }),
                ],
              }),
              e("div", {
                className: "modern-card",
                style: { margin: 0 },
                children: [
                  e("div", {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    },
                    children: [
                      e("h2", {
                        className: "modern-card-title",
                        children: "🙏 Pedidos de Oração",
                      }),
                      e("button", {
                        className: "btn-help",
                        style: { fontSize: "0.7rem", padding: "2px 8px" },
                        onClick: () => t("recados"),
                        children: "Ver todos",
                      }),
                    ],
                  }),
                  _.length === 0
                    ? e(te, {
                        icon: "🙏",
                        title: "Nenhum pedido",
                        description: "Nenhum pedido de oração em aberto.",
                      })
                    : _.map((c) => e(Da, { msg: c }, c.id)),
                ],
              }),
            ],
          }),
        ],
      }),
      e(Ia, { loading: u, upcoming: Q, msgs: l, onNavigate: t }),
    ],
  });
}
function _e({ icon: t, label: r, value: a, sub: o, color: n }) {
  return e("div", {
    className: "stat-card",
    style: { position: "relative", overflow: "hidden" },
    children: [
      e("div", {
        style: {
          position: "absolute",
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: n,
          opacity: 0.12,
          filter: "blur(22px)",
        },
      }),
      e("div", {
        style: {
          width: 50,
          height: 50,
          borderRadius: 16,
          background: `${n}20`,
          border: `1px solid ${n}55`,
          color: n,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          flexShrink: 0,
        },
        children: t,
      }),
      e("div", {
        children: [
          e("div", {
            style: {
              fontSize: "1.65rem",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              background: `linear-gradient(135deg, var(--text-main) 30%, ${n})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
            children: typeof a == "number" ? Aa(a) : a,
          }),
          e("div", {
            style: {
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: 2,
            },
            children: r,
          }),
          o &&
            e("div", {
              style: {
                fontSize: "0.7rem",
                color: n,
                fontWeight: 700,
                marginTop: 3,
              },
              children: o,
            }),
        ],
      }),
    ],
  });
}
function Ee({ icon: t, label: r, color: a, onClick: o, disabled: n = !1 }) {
  return e("button", {
    "aria-label": r,
    title: r,
    onClick: o,
    disabled: n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0.6rem 1rem",
      borderRadius: 12,
      border: `1px solid ${a}44`,
      background: `${a}18`,
      color: a,
      fontWeight: 800,
      fontSize: "0.8rem",
      cursor: n ? "not-allowed" : "pointer",
      whiteSpace: "nowrap",
      opacity: n ? 0.6 : 1,
      transition: "background 0.15s, transform 0.1s, box-shadow 0.15s",
    },
    onMouseEnter: (i) => {
      if (!n) {
        const s = i.currentTarget;
        ((s.style.background = `${a}30`),
          (s.style.boxShadow = `0 4px 16px ${a}30`),
          (s.style.transform = "translateY(-1px)"));
      }
    },
    onMouseLeave: (i) => {
      const s = i.currentTarget;
      ((s.style.background = `${a}18`),
        (s.style.boxShadow = "none"),
        (s.style.transform = "none"));
    },
    children: [
      e("span", { role: "img", "aria-hidden": "true", children: t }),
      r,
    ],
  });
}
function fr({ type: t }) {
  const r = {
      URGENTE: ["#EF4444", "Urgente"],
      AJUDA: ["#F59E0B", "Ajuda"],
      ORACAO: ["#10B981", "Oração"],
      ENFERMIDADE: ["#F59E0B", "Enfermidade"],
      VISITA: ["#3B82F6", "Visita"],
    },
    [a, o] = r[t] || ["#6B7280", t || "Info"];
  return e("span", {
    style: {
      background: `${a}20`,
      color: a,
      border: `1px solid ${a}40`,
      borderRadius: 999,
      padding: "2px 8px",
      fontSize: "0.68rem",
      fontWeight: 800,
      whiteSpace: "nowrap",
    },
    children: o,
  });
}
function Vt({ items: t, total: r }) {
  return e("div", {
    style: { marginTop: 10, display: "flex", flexDirection: "column", gap: 5 },
    children: t.map((a) =>
      e(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.72rem",
          },
          children: [
            e("div", {
              style: {
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: a.color,
                flexShrink: 0,
              },
            }),
            e("span", {
              style: { color: "var(--text-muted)", flex: 1 },
              children: a.label,
            }),
            e("span", {
              style: { color: "var(--text-main)", fontWeight: 700 },
              children: [
                a.value,
                typeof r == "number" && r > 0
                  ? ` (${Math.round((a.value / r) * 100)}%)`
                  : "",
              ],
            }),
          ],
        },
        a.label,
      ),
    ),
  });
}
function Ta({ label: t, value: r, color: a }) {
  return e("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 0",
      borderBottom: "1px solid var(--border)",
    },
    children: [
      e("div", {
        style: { display: "flex", alignItems: "center", gap: 8 },
        children: [
          e("div", {
            style: { width: 7, height: 7, borderRadius: "50%", background: a },
          }),
          e("span", {
            style: { fontSize: "0.78rem", color: "var(--text-muted)" },
            children: t,
          }),
        ],
      }),
      e("span", {
        style: { fontSize: "0.875rem", fontWeight: 800, color: a },
        children: ["+", r],
      }),
    ],
  });
}
function za({ activity: t }) {
  const r = Ea(t.action),
    a = Na(t.action);
  return e("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 10,
      alignItems: "flex-start",
      padding: "6px 8px",
      borderRadius: 10,
      transition: "background 0.15s",
    },
    onMouseEnter: (o) => {
      o.currentTarget.style.background = "rgba(255,255,255,0.04)";
    },
    onMouseLeave: (o) => {
      o.currentTarget.style.background = "transparent";
    },
    children: [
      e("div", {
        title: t.action,
        style: {
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: `${a}20`,
          border: `1px solid ${a}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          flexShrink: 0,
        },
        children: r,
      }),
      e("div", {
        style: { flex: 1, minWidth: 0 },
        children: [
          e("p", {
            style: {
              margin: 0,
              fontSize: "0.78rem",
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "var(--text-main)",
            },
            children: t.action,
          }),
          e("div", {
            style: {
              display: "flex",
              gap: 6,
              alignItems: "center",
              marginTop: 2,
            },
            children: [
              e("span", {
                style: {
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                },
                children: t.user_name,
              }),
              e("span", {
                style: { color: "var(--border)", fontSize: "0.6rem" },
                children: "•",
              }),
              e("span", {
                style: { fontSize: "0.68rem", color: "var(--text-muted)" },
                children: ja(t.created_at),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Da({ msg: t }) {
  return e("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
      gap: 6,
    },
    children: [
      e("div", {
        style: { flex: 1, minWidth: 0 },
        children: [
          e("p", {
            style: {
              margin: 0,
              fontSize: "0.78rem",
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            children: t.subject || "Pedido de oração",
          }),
          e("p", {
            style: {
              margin: 0,
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            children: t.message,
          }),
        ],
      }),
      e(fr, { type: t.msg_type }),
    ],
  });
}
function Ia({ loading: t, upcoming: r, msgs: a, onNavigate: o }) {
  return e("aside", {
    style: {
      borderLeft: "1px solid var(--border)",
      overflowY: "auto",
      padding: "1.5rem 1rem",
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    children: [
      e(Ut, {
        title: "🎂 Próximos Aniversariantes",
        button: "Ver todos",
        onClick: () => o("aniversariantes"),
        children: t
          ? Array.from({ length: 5 }).map((n, i) => e(Ht, {}, i))
          : r.length === 0
            ? e(te, {
                icon: "🎂",
                title: "Sem aniversariantes",
                description: "Nenhum aniversariante nos próximos 30 dias.",
              })
            : r.map((n) => e(Ma, { member: n }, n.id)),
      }),
      e("div", { style: { borderTop: "1px solid var(--border)" } }),
      e(Ut, {
        title: "📝 Recados dos Obreiros",
        button: "Ver todos",
        onClick: () => o("recados"),
        children: t
          ? Array.from({ length: 3 }).map((n, i) => e(Ht, {}, i))
          : a.length === 0
            ? e(te, {
                icon: "📝",
                title: "Sem recados",
                description: "Nenhum recado no momento.",
              })
            : a.slice(0, 5).map((n) => e(Ra, { msg: n }, n.id)),
      }),
    ],
  });
}
function Ut({ title: t, button: r, onClick: a, children: o }) {
  return e("div", {
    children: [
      e("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        },
        children: [
          e("h3", {
            style: { margin: 0, fontSize: "0.875rem", fontWeight: 800 },
            children: t,
          }),
          e("button", {
            className: "btn-help",
            style: { fontSize: "0.7rem", padding: "2px 8px" },
            onClick: a,
            children: r,
          }),
        ],
      }),
      o,
    ],
  });
}
function Ma({ member: t }) {
  const r = (t.name || "AN")
      .split(" ")
      .slice(0, 2)
      .map((o) => o[0])
      .join("")
      .toUpperCase(),
    a = Lt[t.id % Lt.length];
  return e("div", {
    style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
    children: [
      e("div", {
        style: {
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: a,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 900,
          color: "#fff",
          flexShrink: 0,
        },
        children: r,
      }),
      e("div", {
        style: { flex: 1, minWidth: 0 },
        children: [
          e("p", {
            style: {
              margin: 0,
              fontSize: "0.8rem",
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            children: t.name,
          }),
          e("p", {
            style: {
              margin: 0,
              fontSize: "0.7rem",
              color: "var(--text-muted)",
            },
            children: [t.day, "/", t.month],
          }),
        ],
      }),
      e("span", {
        style: {
          fontSize: "0.68rem",
          fontWeight: 800,
          color: t.diff === 0 ? "#F59E0B" : "var(--text-muted)",
          whiteSpace: "nowrap",
        },
        children: t.diff === 0 ? "Hoje! 🎉" : `${t.diff} dias`,
      }),
    ],
  });
}
function Ra({ msg: t }) {
  return e("div", {
    style: {
      marginBottom: 12,
      padding: "8px 10px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 12,
      border: "1px solid var(--border)",
    },
    children: [
      e("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
          gap: 6,
        },
        children: [
          e("span", {
            style: {
              fontSize: "0.78rem",
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "70%",
            },
            children: t.subject || "Recado",
          }),
          e(fr, { type: t.msg_type }),
        ],
      }),
      e("p", {
        style: {
          margin: 0,
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        },
        children: t.message,
      }),
    ],
  });
}
function Fa() {
  return e("div", {
    className: "stat-card",
    children: [
      e(oe, { w: "50px", h: "50px", r: "16px" }),
      e("div", {
        style: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
        children: [e(oe, { h: "26px", w: "60%" }), e(oe, { h: "12px" })],
      }),
    ],
  });
}
function Wa() {
  return e("div", {
    style: { display: "flex", gap: 8, marginBottom: 10 },
    children: [
      e(oe, { w: "30px", h: "30px", r: "50%" }),
      e("div", {
        style: { flex: 1, display: "flex", flexDirection: "column", gap: 5 },
        children: [
          e(oe, { h: "11px", w: "70%" }),
          e(oe, { h: "10px", w: "50%" }),
        ],
      }),
    ],
  });
}
function Ht() {
  return e("div", {
    style: { display: "flex", gap: 8, marginBottom: 10 },
    children: [
      e(oe, { w: "36px", h: "36px", r: "50%" }),
      e("div", {
        style: { flex: 1, display: "flex", flexDirection: "column", gap: 5 },
        children: [
          e(oe, { h: "12px", w: "80%" }),
          e(oe, { h: "10px", w: "50%" }),
        ],
      }),
    ],
  });
}
function Pa(t) {
  const r = new Date();
  return t
    .map((a) => {
      if (!a.birth_date) return null;
      const o = a.birth_date.split("-"),
        n = o[1],
        i = o[2];
      if (!n || !i) return null;
      const s = new Date(r.getFullYear(), Number(n) - 1, Number(i));
      if (Number.isNaN(s.getTime())) return null;
      s < qt(r) && s.setFullYear(r.getFullYear() + 1);
      const d = Math.ceil((s.getTime() - qt(r).getTime()) / 864e5);
      return d < 0 || d > 30 ? null : { ...a, diff: d, day: i, month: n };
    })
    .filter(Boolean)
    .sort((a, o) => a.diff - o.diff)
    .slice(0, 6);
}
function qt(t) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
function ja(t) {
  if (!t) return "-";
  const r = new Date(t);
  return Number.isNaN(r.getTime()) ? t : r.toLocaleDateString("pt-BR");
}
const $a = {
  essencial: { label: "Essencial", color: "#2563EB" },
  pastoreio: { label: "Pastoreio", color: "#8B5CF6" },
  avivamento: { label: "Avivamento", color: "#F59E0B" },
  enterprise: { label: "Enterprise", color: "#10B981" },
};
function Oa() {
  const [t, r] = g([]),
    [a, o] = g(null),
    [n, i] = g(!0),
    [s, d] = g(!1),
    [f, h] = g(null),
    [p, l] = g(""),
    {
      success: m,
      error: u,
      showSuccess: y,
      showError: k,
      clearSuccess: T,
      clearError: v,
    } = ue(),
    [b, x] = g(null);
  Z(() => {
    C();
  }, []);
  const C = async (E = !1) => {
      (E ? d(!0) : i(!0), v());
      try {
        const [M, F] = await Promise.all([
          fetch("/api/superadmin/churches"),
          fetch("/api/superadmin/stats"),
        ]);
        if (!M.ok || !F.ok)
          throw new Error("Erro ao carregar dados do Super Admin.");
        (r(await M.json()), o(await F.json()));
      } catch (M) {
        k(M.message || "Não foi possível carregar os dados.");
      } finally {
        (i(!1), d(!1));
      }
    },
    z = (E) => {
      const M = E.status === "active" ? "blocked" : "active";
      x({ church: E, newStatus: M });
    },
    A = async () => {
      if (!b) return;
      const { church: E, newStatus: M } = b;
      (x(null), h(E.id), v(), T());
      try {
        if (
          !(
            await fetch(`/api/superadmin/churches/${E.id}/status`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: M }),
            })
          ).ok
        )
          throw new Error("Erro ao atualizar status da igreja.");
        (y(
          M === "blocked"
            ? "Igreja bloqueada com sucesso."
            : "Igreja ativada com sucesso.",
        ),
          await C());
      } catch (F) {
        k(F.message || "Não foi possível atualizar o status.");
      } finally {
        h(null);
      }
    },
    R = t.filter((E) => E.status === "active").length,
    P = t.filter((E) => E.status !== "active").length,
    I = t.reduce((E, M) => {
      const F = (M.plan || "").toLowerCase();
      return F === "essencial"
        ? E + 49
        : F === "pastoreio"
          ? E + 97
          : F === "avivamento"
            ? E + 197
            : F === "enterprise"
              ? E + 297
              : E;
    }, 0),
    j = De(() => {
      if (!p.trim()) return t;
      const E = p.toLowerCase().trim();
      return t.filter(
        (M) =>
          (M.name || "").toLowerCase().includes(E) ||
          (M.slug || "").toLowerCase().includes(E) ||
          (M.email || "").toLowerCase().includes(E),
      );
    }, [t, p]);
  return e("div", {
    className: "main-content",
    children: [
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "yellow", children: "Plataforma SaaS Global" }),
              e("h1", { children: "👑 Painel Super Admin" }),
              e("p", {
                children:
                  "Gerencie igrejas, assinaturas, bloqueios, usuários e crescimento da plataforma CRM Bom Samaritano.",
              }),
            ],
          }),
          e("button", {
            className: "btn-help",
            onClick: () => C(!0),
            disabled: s,
            style: { display: "flex", alignItems: "center", gap: "0.4rem" },
            children: s
              ? e(J, {
                  children: [
                    e("span", {
                      style: {
                        display: "inline-block",
                        width: 13,
                        height: 13,
                        border: "2px solid currentColor",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      },
                    }),
                    "Atualizando...",
                  ],
                })
              : "↻ Atualizar",
          }),
        ],
      }),
      m && e(K, { type: "success", message: m, onClose: T, autoDismiss: 3500 }),
      u && e(K, { type: "error", message: u, onClose: v, autoDismiss: 4e3 }),
      e("div", {
        className: "stats-grid",
        style: {
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        },
        children: [
          e(O, {
            title: "Igrejas Cadastradas",
            value: (a == null ? void 0 : a.total_churches) || 0,
            color: "#8B5CF6",
            icon: "⛪",
          }),
          e(O, {
            title: "Igrejas Ativas",
            value: R,
            color: "#10B981",
            icon: "✅",
          }),
          e(O, {
            title: "Igrejas Bloqueadas",
            value: P,
            color: "#EF4444",
            icon: "🔒",
          }),
          e(O, {
            title: "Usuários Totais",
            value: (a == null ? void 0 : a.total_users) || 0,
            color: "#2563EB",
            icon: "👥",
          }),
          e(O, {
            title: "Membros no SaaS",
            value: (a == null ? void 0 : a.total_members) || 0,
            color: "#F59E0B",
            icon: "💎",
          }),
          e(O, {
            title: "Receita Estimada",
            value: `R$ ${I.toLocaleString("pt-BR")}`,
            color: "#10B981",
            icon: "💰",
          }),
        ],
      }),
      e("div", {
        className: "modern-card",
        children: [
          e("div", {
            className: "modern-card-header",
            children: [
              e("div", {
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    children: "Igrejas e Assinaturas",
                  }),
                  e("p", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      marginTop: 4,
                    },
                    children:
                      "Controle o status das igrejas cadastradas, planos e acesso à plataforma.",
                  }),
                ],
              }),
              !n &&
                t.length > 0 &&
                e("div", {
                  style: { position: "relative", flexShrink: 0 },
                  children: [
                    e("input", {
                      type: "text",
                      placeholder: "🔍 Buscar igreja...",
                      value: p,
                      onInput: (E) => l(E.currentTarget.value),
                      style: {
                        padding: "0.45rem 0.9rem",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "var(--text-main)",
                        fontSize: "0.85rem",
                        width: 220,
                        outline: "none",
                      },
                    }),
                    p &&
                      e("button", {
                        onClick: () => l(""),
                        style: {
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          lineHeight: 1,
                          padding: 0,
                        },
                        "aria-label": "Limpar busca",
                        children: "✕",
                      }),
                  ],
                }),
            ],
          }),
          n
            ? e(pe, { rows: 6, height: 62 })
            : t.length === 0
              ? e(te, {
                  icon: "⛪",
                  title: "Nenhuma igreja cadastrada",
                  description:
                    "Quando novas igrejas criarem conta na plataforma, elas aparecerão nesta área para controle de planos, acessos e bloqueios.",
                })
              : j.length === 0
                ? e(te, {
                    icon: "🔍",
                    title: "Nenhuma igreja encontrada",
                    description: `Não há igrejas correspondendo a "${p}".`,
                    actionLabel: "Limpar busca",
                    onAction: () => l(""),
                  })
                : e("div", {
                    style: { overflowX: "auto" },
                    children: [
                      e("table", {
                        className: "modern-table",
                        children: [
                          e("thead", {
                            children: e("tr", {
                              children: [
                                e("th", { children: "Igreja" }),
                                e("th", { children: "Slug / ID" }),
                                e("th", { children: "Contato" }),
                                e("th", { children: "Plano" }),
                                e("th", { children: "Status" }),
                                e("th", { children: "Cadastro" }),
                                e("th", { children: "Ações" }),
                              ],
                            }),
                          }),
                          e("tbody", {
                            children: j.map((E) => {
                              const M = $a[(E.plan || "").toLowerCase()] || {
                                  label: E.plan || "Sem plano",
                                  color: "#6B7280",
                                },
                                F = E.status === "active",
                                D = f === E.id;
                              return e(
                                "tr",
                                {
                                  children: [
                                    e("td", {
                                      children: e("div", {
                                        style: {
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 10,
                                        },
                                        children: [
                                          e(Te, { name: E.name }),
                                          e("div", {
                                            children: [
                                              e("strong", {
                                                style: {
                                                  color: "var(--text-main)",
                                                  fontSize: "0.9rem",
                                                },
                                                children:
                                                  E.name || "Igreja sem nome",
                                              }),
                                              e("div", {
                                                style: {
                                                  color: "var(--text-muted)",
                                                  fontSize: "0.72rem",
                                                },
                                                children: ["ID #", E.id],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    }),
                                    e("td", {
                                      children: e("code", {
                                        style: {
                                          fontSize: "0.78rem",
                                          color: "#C4B5FD",
                                          background: "rgba(124,58,237,0.12)",
                                          padding: "0.25rem 0.55rem",
                                          borderRadius: 8,
                                          border:
                                            "1px solid rgba(124,58,237,0.25)",
                                        },
                                        children: E.slug,
                                      }),
                                    }),
                                    e("td", {
                                      children: e("div", {
                                        style: {
                                          display: "flex",
                                          flexDirection: "column",
                                        },
                                        children: [
                                          e("span", {
                                            style: {
                                              color: "var(--text-main)",
                                              fontSize: "0.82rem",
                                            },
                                            children: E.email || "Sem e-mail",
                                          }),
                                          e("span", {
                                            style: {
                                              color: "var(--text-muted)",
                                              fontSize: "0.72rem",
                                            },
                                            children: E.phone || "Sem telefone",
                                          }),
                                        ],
                                      }),
                                    }),
                                    e("td", {
                                      children: e(U, {
                                        label: M.label,
                                        color: M.color,
                                        icon: "💼",
                                      }),
                                    }),
                                    e("td", {
                                      children: F
                                        ? e(U, {
                                            label: "Ativa",
                                            color: "#10B981",
                                            icon: "✅",
                                          })
                                        : e(U, {
                                            label: "Bloqueada",
                                            color: "#EF4444",
                                            icon: "🔒",
                                          }),
                                    }),
                                    e("td", {
                                      style: {
                                        color: "var(--text-muted)",
                                        fontSize: "0.82rem",
                                      },
                                      children: E.created_at
                                        ? new Date(
                                            E.created_at,
                                          ).toLocaleDateString("pt-BR")
                                        : "-",
                                    }),
                                    e("td", {
                                      children: e("div", {
                                        className: "action-btns",
                                        children: e("button", {
                                          type: "button",
                                          onClick: () => z(E),
                                          disabled: D,
                                          className: F
                                            ? "btn-danger-soft"
                                            : "btn-success-soft",
                                          style: {
                                            padding: "0.45rem 0.75rem",
                                            borderRadius: 10,
                                            border: F
                                              ? "1px solid rgba(239,68,68,0.35)"
                                              : "1px solid rgba(16,185,129,0.35)",
                                            background: F
                                              ? "rgba(239,68,68,0.14)"
                                              : "rgba(16,185,129,0.14)",
                                            color: F ? "#F87171" : "#34D399",
                                            fontSize: "0.75rem",
                                            fontWeight: 900,
                                            cursor: D
                                              ? "not-allowed"
                                              : "pointer",
                                            opacity: D ? 0.65 : 1,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.3rem",
                                          },
                                          children: D
                                            ? e(J, {
                                                children: [
                                                  e("span", {
                                                    style: {
                                                      display: "inline-block",
                                                      width: 11,
                                                      height: 11,
                                                      border:
                                                        "2px solid currentColor",
                                                      borderTopColor:
                                                        "transparent",
                                                      borderRadius: "50%",
                                                      animation:
                                                        "spin 0.7s linear infinite",
                                                    },
                                                  }),
                                                  "Atualizando...",
                                                ],
                                              })
                                            : F
                                              ? "🔒 Bloquear"
                                              : "✅ Ativar",
                                        }),
                                      }),
                                    }),
                                  ],
                                },
                                E.id,
                              );
                            }),
                          }),
                        ],
                      }),
                      p &&
                        e("p", {
                          style: {
                            textAlign: "center",
                            color: "var(--text-muted)",
                            fontSize: "0.78rem",
                            marginTop: "1rem",
                            paddingTop: "0.75rem",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                          },
                          children: [
                            "Exibindo ",
                            j.length,
                            " de ",
                            t.length,
                            " igrejas",
                          ],
                        }),
                    ],
                  }),
        ],
      }),
      b &&
        e(Se, {
          title:
            b.newStatus === "blocked"
              ? "Bloquear esta igreja?"
              : "Ativar esta igreja?",
          message:
            b.newStatus === "blocked"
              ? `Deseja realmente bloquear "${b.church.name}"? O pastor e os obreiros perderão o acesso imediatamente.`
              : `Deseja realmente ativar "${b.church.name}" novamente? O acesso será restaurado.`,
          onConfirm: A,
          onCancel: () => x(null),
          danger: b.newStatus === "blocked",
          confirmLabel:
            b.newStatus === "blocked" ? "Sim, bloquear" : "Sim, ativar",
        }),
    ],
  });
}
const La = {
  sent: { label: "Enviado", color: "#10B981", icon: "✅" },
  simulated: { label: "Simulado", color: "#8B5CF6", icon: "🧪" },
  error: { label: "Erro", color: "#EF4444", icon: "⚠️" },
  pending: { label: "Pendente", color: "#F59E0B", icon: "⏳" },
};
function Va(t) {
  if (!t) return "-";
  const r = t.replace(/\D/g, "");
  return r.length === 13
    ? `+${r.slice(0, 2)} (${r.slice(2, 4)}) ${r.slice(4, 9)}-${r.slice(9)}`
    : r.length === 12
      ? `+${r.slice(0, 2)} (${r.slice(2, 4)}) ${r.slice(4, 8)}-${r.slice(8)}`
      : r.length === 11
        ? `(${r.slice(0, 2)}) ${r.slice(2, 7)}-${r.slice(7)}`
        : r.length === 10
          ? `(${r.slice(0, 2)}) ${r.slice(2, 6)}-${r.slice(6)}`
          : t;
}
function Ua(t, r) {
  if (r === "all" || !t) return !0;
  const a = new Date(t),
    o = new Date(),
    n = (i) => new Date(i.getFullYear(), i.getMonth(), i.getDate());
  if (r === "today") return a >= n(o);
  if (r === "week") {
    const i = new Date(o);
    return (i.setDate(i.getDate() - 7), a >= i);
  }
  if (r === "month") {
    const i = new Date(o);
    return (i.setMonth(i.getMonth() - 1), a >= i);
  }
  return !0;
}
function Ha() {
  const [t, r] = g([]),
    [a, o] = g(!0),
    [n, i] = g(!1),
    [s, d] = g(""),
    [f, h] = g("all"),
    [p, l] = g("all");
  Z(() => {
    m();
  }, []);
  const m = async (x = !1) => {
      (x ? i(!0) : o(!0), d(""));
      try {
        const z = await (await fetch("/api/pastor/whatsapp/logs")).json();
        r(z || []);
      } catch {
        d("Não foi possível carregar o histórico de envios.");
      } finally {
        (o(!1), i(!1));
      }
    },
    u = t.filter((x) => x.status === "sent").length,
    y = t.filter((x) => x.status === "simulated").length,
    k = t.filter((x) => x.status === "error").length,
    T = t.filter((x) => x.status === "pending").length,
    v = De(
      () =>
        t.filter((x) => {
          const C = f === "all" || x.status === f,
            z = Ua(x.sent_at, p);
          return C && z;
        }),
      [t, f, p],
    ),
    b = {
      all: "Todas as datas",
      today: "Hoje",
      week: "Última semana",
      month: "Último mês",
    };
  return e("div", {
    className: "main-content",
    children: [
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "blue", children: "WhatsApp Pastoral" }),
              e("h1", { children: "📜 Histórico de Envios" }),
              e("p", {
                children:
                  "Acompanhe mensagens automáticas e manuais enviadas para visitantes, membros, aniversariantes e grupos da igreja.",
              }),
            ],
          }),
          e("button", {
            className: "btn-help",
            onClick: () => m(!0),
            disabled: n,
            style: { display: "flex", alignItems: "center", gap: "0.4rem" },
            children: n
              ? e(J, {
                  children: [
                    e("span", {
                      style: {
                        display: "inline-block",
                        width: 13,
                        height: 13,
                        border: "2px solid currentColor",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      },
                    }),
                    "Atualizando...",
                  ],
                })
              : "↻ Atualizar",
          }),
        ],
      }),
      s && e(K, { type: "error", message: s, onClose: () => d("") }),
      e("div", {
        className: "stats-grid",
        style: {
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        },
        children: [
          e(O, {
            title: "Total de Envios",
            value: t.length,
            color: "#8B5CF6",
            icon: "📨",
          }),
          e(O, { title: "Enviadas", value: u, color: "#10B981", icon: "✅" }),
          e(O, { title: "Simuladas", value: y, color: "#8B5CF6", icon: "🧪" }),
          e(O, { title: "Erros", value: k, color: "#EF4444", icon: "⚠️" }),
          T > 0 &&
            e(O, {
              title: "Pendentes",
              value: T,
              color: "#F59E0B",
              icon: "⏳",
            }),
        ],
      }),
      e("div", {
        className: "modern-card",
        children: [
          e("div", {
            className: "modern-card-header",
            children: [
              e("div", {
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    children: "Relatório de Mensagens",
                  }),
                  e("p", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      marginTop: 4,
                    },
                    children:
                      "Veja o status, telefone, conteúdo e possíveis erros de envio.",
                  }),
                ],
              }),
              !a &&
                t.length > 0 &&
                e("div", {
                  style: {
                    display: "flex",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                  },
                  children: [
                    e("select", {
                      value: f,
                      onChange: (x) => h(x.currentTarget.value),
                      style: {
                        padding: "0.4rem 0.75rem",
                        borderRadius: 10,
                        background: "var(--card-bg)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "var(--text-main)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      },
                      children: [
                        e("option", {
                          value: "all",
                          children: "Todos os status",
                        }),
                        e("option", { value: "sent", children: "✅ Enviado" }),
                        e("option", {
                          value: "simulated",
                          children: "🧪 Simulado",
                        }),
                        e("option", { value: "error", children: "⚠️ Erro" }),
                        e("option", {
                          value: "pending",
                          children: "⏳ Pendente",
                        }),
                      ],
                    }),
                    e("select", {
                      value: p,
                      onChange: (x) => l(x.currentTarget.value),
                      style: {
                        padding: "0.4rem 0.75rem",
                        borderRadius: 10,
                        background: "var(--card-bg)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "var(--text-main)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      },
                      children: Object.keys(b).map((x) =>
                        e("option", { value: x, children: b[x] }, x),
                      ),
                    }),
                    (f !== "all" || p !== "all") &&
                      e("span", {
                        style: {
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          background: "rgba(255,255,255,0.06)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.1)",
                        },
                        children: [
                          v.length,
                          " resultado",
                          v.length !== 1 ? "s" : "",
                          " ",
                          e("button", {
                            onClick: () => {
                              (h("all"), l("all"));
                            },
                            style: {
                              background: "none",
                              border: "none",
                              color: "var(--text-muted)",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: "0.7rem",
                              textDecoration: "underline",
                            },
                            children: "limpar",
                          }),
                        ],
                      }),
                  ],
                }),
            ],
          }),
          a
            ? e(pe, { rows: 6, height: 58 })
            : t.length === 0
              ? e(te, {
                  icon: "💬",
                  title: "Nenhum envio registrado ainda",
                  description:
                    "Assim que mensagens forem enviadas pelo WhatsApp, o histórico aparecerá aqui com status, telefone, horário e detalhes do envio.",
                })
              : v.length === 0
                ? e(te, {
                    icon: "🔍",
                    title: "Nenhum resultado para este filtro",
                    description:
                      "Tente alterar o filtro de status ou de data para ver mais registros.",
                    actionLabel: "Limpar filtros",
                    onAction: () => {
                      (h("all"), l("all"));
                    },
                  })
                : e("div", {
                    style: { overflowX: "auto" },
                    children: e("table", {
                      className: "modern-table",
                      children: [
                        e("thead", {
                          children: e("tr", {
                            children: [
                              e("th", { children: "Data/Hora" }),
                              e("th", { children: "Destinatário" }),
                              e("th", { children: "Mensagem" }),
                              e("th", { children: "Status" }),
                              e("th", { children: "Erro/Detalhe" }),
                            ],
                          }),
                        }),
                        e("tbody", {
                          children: v.map((x, C) => {
                            const z = La[x.status] || {
                              label: x.status || "Desconhecido",
                              color: "#6B7280",
                              icon: "•",
                            };
                            return e(
                              "tr",
                              {
                                children: [
                                  e("td", {
                                    style: {
                                      fontSize: "0.8rem",
                                      color: "var(--text-muted)",
                                      whiteSpace: "nowrap",
                                    },
                                    children: x.sent_at
                                      ? new Date(x.sent_at).toLocaleString(
                                          "pt-BR",
                                        )
                                      : "-",
                                  }),
                                  e("td", {
                                    children: e("div", {
                                      style: {
                                        display: "flex",
                                        flexDirection: "column",
                                      },
                                      children: [
                                        e("strong", {
                                          style: {
                                            color: "var(--text-main)",
                                            fontSize: "0.88rem",
                                            fontFamily: "monospace",
                                            letterSpacing: "0.02em",
                                          },
                                          children: Va(x.phone),
                                        }),
                                        e("span", {
                                          style: {
                                            color: "var(--text-muted)",
                                            fontSize: "0.72rem",
                                          },
                                          children: "WhatsApp",
                                        }),
                                      ],
                                    }),
                                  }),
                                  e("td", {
                                    children: e("div", {
                                      style: {
                                        maxWidth: 360,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: "0.85rem",
                                        color: "var(--text-muted)",
                                      },
                                      title: x.message,
                                      children:
                                        x.message || "Mensagem não informada",
                                    }),
                                  }),
                                  e("td", {
                                    children: e(U, {
                                      label: z.label,
                                      color: z.color,
                                      icon: z.icon,
                                    }),
                                  }),
                                  e("td", {
                                    children: x.error_msg
                                      ? e("span", {
                                          style: {
                                            color: "#F87171",
                                            fontSize: "0.78rem",
                                            fontWeight: 700,
                                          },
                                          children: x.error_msg,
                                        })
                                      : e("span", {
                                          style: {
                                            color: "var(--text-sub)",
                                            fontSize: "0.78rem",
                                          },
                                          children: "Sem erro",
                                        }),
                                  }),
                                ],
                              },
                              C,
                            );
                          }),
                        }),
                      ],
                    }),
                  }),
        ],
      }),
    ],
  });
}
const qa = [
  {
    key: "theme-navy",
    icon: "🌊",
    title: "Azul",
    desc: "Tema padrão — paleta aurora premium com tons de azul e rosa",
    preview: "navy",
  },
  {
    key: "theme-dark",
    icon: "🌙",
    title: "Escuro",
    desc: "Visual preto total — moderno e elegante",
    preview: "dark",
  },
];
function Ga() {
  const t = localStorage.getItem("crm_theme");
  return t === "theme-navy" || t === "theme-dark" ? t : "theme-navy";
}
function Ja(t) {
  (document.body.classList.remove("theme-navy", "theme-dark", "theme-light"),
    document.body.classList.add(t),
    localStorage.setItem("crm_theme", t));
}
function Ya() {
  return e("div", {
    className: "modern-card",
    children: [
      e("div", {
        className: "modern-card-header",
        children: e("div", {
          children: [
            e("h2", {
              className: "modern-card-title",
              children: "🎨 Aparência do Sistema",
            }),
            e("p", {
              style: {
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                marginTop: 4,
              },
              children:
                "Escolha o tema visual. A preferência é salva neste navegador. O seletor rápido também fica no painel lateral.",
            }),
          ],
        }),
      }),
      e("div", {
        className: "theme-option-grid",
        style: { gridTemplateColumns: "1fr 1fr" },
        children: qa.map((t) => {
          const r = Ga() === t.key;
          return e(
            "button",
            {
              type: "button",
              className: `theme-option-card ${r ? "active" : ""}`,
              onClick: () => {
                (Ja(t.key), window.dispatchEvent(new Event("storage")));
              },
              children: [
                e("div", { className: `theme-preview ${t.preview}` }),
                e("div", {
                  className: "theme-option-info",
                  children: [
                    e("strong", { children: [t.icon, " ", t.title] }),
                    e("span", { children: t.desc }),
                  ],
                }),
              ],
            },
            t.key,
          );
        }),
      }),
    ],
  });
}
function Qa() {
  const [t, r] = g({
      whatsapp: "",
      name: "Bom Samaritano Matriz",
      slug: "bom-samaritano-matriz",
    }),
    [a, o] = g(!1),
    [n, i] = g(!0),
    { success: s, error: d, showSuccess: f, showError: h } = ue();
  Z(() => {
    fetch("/api/church/settings")
      .then((l) => (l.ok ? l.json() : null))
      .then((l) => {
        l &&
          r((m) => ({
            ...m,
            whatsapp: l.whatsapp || "",
            name: l.name || m.name,
            slug: l.slug || m.slug,
          }));
      })
      .catch(() => {})
      .finally(() => i(!1));
  }, []);
  const p = async () => {
    if (!a) {
      o(!0);
      try {
        const l = await fetch("/api/church/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ whatsapp: t.whatsapp }),
        });
        if (l.ok) f("Configurações salvas com sucesso!");
        else {
          const m = await l.json().catch(() => ({}));
          h(m.error || "Erro ao salvar configurações.");
        }
      } catch {
        h("Erro de conexão com o servidor.");
      } finally {
        o(!1);
      }
    }
  };
  return e("div", {
    className: "main-content",
    children: [
      e("div", {
        className: "page-header",
        children: e("div", {
          children: [
            e(de, { color: "purple", children: "Configurações da igreja" }),
            e("h1", { children: "⚙️ Configurações" }),
            e("p", {
              children:
                "Personalize a aparência do CRM e ajuste informações principais da igreja.",
            }),
          ],
        }),
      }),
      s && e(K, { type: "success", message: s, autoDismiss: 3500 }),
      d && e(K, { type: "error", message: d, autoDismiss: 4e3 }),
      e(Ya, {}),
      e("div", {
        className: "content-grid",
        style: { gridTemplateColumns: "1fr 1fr", alignItems: "start" },
        children: [
          e("div", {
            className: "modern-card",
            children: [
              e("div", {
                className: "modern-card-header",
                children: e("div", {
                  children: [
                    e("h2", {
                      className: "modern-card-title",
                      children: "🏛️ Perfil da Igreja",
                    }),
                    e("p", {
                      style: {
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        marginTop: 4,
                      },
                      children:
                        "Informações principais da congregação e integração WhatsApp.",
                    }),
                  ],
                }),
              }),
              e("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                },
                children: [
                  e("div", {
                    className: "form-group",
                    children: e("label", {
                      children: [
                        "Nome da Congregação",
                        e("input", {
                          type: "text",
                          value: n ? "…" : (t.name ?? ""),
                          disabled: !0,
                        }),
                      ],
                    }),
                  }),
                  e("div", {
                    className: "form-group",
                    children: e("label", {
                      children: [
                        "Slug SaaS",
                        e("input", {
                          type: "text",
                          value: n ? "…" : (t.slug ?? ""),
                          disabled: !0,
                        }),
                      ],
                    }),
                  }),
                  e("div", {
                    className: "form-group",
                    children: e("label", {
                      children: [
                        "WhatsApp Oficial",
                        e("input", {
                          type: "text",
                          placeholder: "Ex: 11999999999",
                          value: t.whatsapp,
                          onInput: (l) =>
                            r((m) => ({
                              ...m,
                              whatsapp: l.currentTarget.value,
                            })),
                          disabled: n,
                        }),
                      ],
                    }),
                  }),
                  e("div", {
                    style: {
                      padding: "1rem",
                      borderRadius: 18,
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.22)",
                    },
                    children: [
                      e("strong", {
                        style: { color: "#34D399", fontSize: "0.9rem" },
                        children: "Segurança ativa",
                      }),
                      e("p", {
                        style: {
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                          margin: "0.35rem 0 0",
                        },
                        children:
                          "Os acessos são separados por perfil: Pastor Administrador e Obreiro.",
                      }),
                    ],
                  }),
                  e("button", {
                    className: "btn-primary",
                    style: { width: "fit-content" },
                    onClick: p,
                    disabled: a || n,
                    children: a ? "💾 Salvando…" : "Salvar Alterações",
                  }),
                ],
              }),
            ],
          }),
          e("div", {
            className: "modern-card",
            children: [
              e("div", {
                className: "modern-card-header",
                children: e("div", {
                  children: [
                    e("h2", {
                      className: "modern-card-title",
                      children: "🛡️ Controle de Acessos",
                    }),
                    e("p", {
                      style: {
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        marginTop: 4,
                      },
                      children:
                        "O CRUD de usuários fica na tela Obreiros, acessível somente ao Pastor Administrador.",
                    }),
                  ],
                }),
              }),
              e("div", {
                style: {
                  padding: "1rem",
                  borderRadius: 18,
                  background: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.22)",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                },
                children: [
                  "Para criar, editar, resetar senha, bloquear ou excluir obreiros, acesse o menu:",
                  e("br", {}),
                  e("strong", {
                    style: { color: "var(--text-main)" },
                    children: "Obreiros",
                  }),
                ],
              }),
              e("div", {
                style: {
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: 18,
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.22)",
                },
                children: [
                  e(de, { color: "purple", children: "Níveis de acesso" }),
                  e("ul", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      lineHeight: 1.8,
                      margin: 0,
                      paddingLeft: "1.2rem",
                    },
                    children: [
                      e("li", {
                        children: [
                          e("strong", {
                            style: { color: "var(--text-main)" },
                            children: "Pastor Administrador",
                          }),
                          " ",
                          "— acesso total ao CRM",
                        ],
                      }),
                      e("li", {
                        children: [
                          e("strong", {
                            style: { color: "var(--text-main)" },
                            children: "Obreiro",
                          }),
                          " — cadastro de visitantes e mensagens",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const Xa = ["image/jpeg", "image/png", "image/webp"],
  Za = 2 * 1024 * 1024;
function yt() {
  const [t, r] = g("");
  return {
    photoPreview: t,
    setPhotoPreview: r,
    handlePhotoChange: (i, s, d) => {
      var p;
      const f = (p = i.currentTarget.files) == null ? void 0 : p[0];
      if (!f) return;
      if (!Xa.includes(f.type)) {
        const l = "Formato inválido. Envie uma imagem JPG, PNG ou WEBP.";
        d ? d(l) : alert(l);
        return;
      }
      if (f.size > Za) {
        const l = "A foto deve ter no máximo 2 MB.";
        d ? d(l) : alert(l);
        return;
      }
      const h = new FileReader();
      ((h.onload = () => {
        const l = String(h.result || "");
        (r(l), s(l));
      }),
        h.readAsDataURL(f));
    },
    removePhoto: (i) => {
      (r(""), i == null || i());
    },
    resetPhoto: () => r(""),
  };
}
const Gt = {
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    neighborhood: "",
    city: "",
    birth_date: "",
    is_visitor: !0,
    spiritual_status: "NOVO",
    observations: "",
    photo_url: "",
  },
  Ka = {
    CONVERTIDO: "Convertido",
    BATIZADO: "Batizado",
    MEMBRO_ATIVO: "Membro Ativo",
    DISCIPULADO: "Em Discipulado",
    NOVO: "Novo na Igreja",
  };
function ei(t) {
  return Ka[t] ?? "Visitante";
}
function ce({ label: t, value: r }) {
  return e("div", {
    children: [
      e("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        },
        children: t,
      }),
      e("div", {
        style: {
          color: "var(--text-main)",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginTop: 2,
        },
        children: r || "—",
      }),
    ],
  });
}
function Jt({ role: t }) {
  const r = t === "pastor" ? "/api/pastor" : "/api/worker",
    [a, o] = g([]),
    [n, i] = g(!0),
    [s, d] = g("all"),
    [f, h] = g(""),
    [p, l] = g(!1),
    [m, u] = g(null),
    [y, k] = g(null),
    [T, v] = g(!1),
    [b, x] = g(Gt),
    {
      photoPreview: C,
      setPhotoPreview: z,
      handlePhotoChange: A,
      removePhoto: R,
      resetPhoto: P,
    } = yt(),
    { success: I, error: j, showSuccess: E, showError: M } = ue();
  Z(() => {
    F();
  }, []);
  const F = () => {
      (i(!0),
        fetch(`${r}/members`)
          .then((c) => c.json())
          .then((c) => o(Array.isArray(c) ? c : []))
          .catch(() => M("Erro ao carregar membros."))
          .finally(() => i(!1)));
    },
    D = () => {
      (x(Gt), P());
    },
    Y = () => {
      (D(), l(!0));
    },
    N = (c) => {
      (x({
        id: c.id,
        name: c.name,
        email: c.email || "",
        whatsapp: c.whatsapp || "",
        address: c.address || "",
        neighborhood: c.neighborhood || "",
        city: c.city || "",
        birth_date: c.birth_date || "",
        is_visitor: c.is_visitor,
        spiritual_status: c.spiritual_status || "NOVO",
        observations: c.observations || c.follow_up_notes || "",
        photo_url: c.photo_url || "",
      }),
        z(c.photo_url || ""),
        l(!0));
    },
    $ = async (c) => {
      if ((c.preventDefault(), !b.name.trim())) {
        M("Nome completo é obrigatório.");
        return;
      }
      if (!b.whatsapp.trim()) {
        M("WhatsApp é obrigatório.");
        return;
      }
      v(!0);
      const B = !!b.id,
        V = B ? `${r}/members/${b.id}` : `${r}/members`;
      try {
        const ae = await fetch(V, {
          method: B ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(b),
        });
        if (ae.ok)
          (E(
            B
              ? "Cadastro atualizado com sucesso!"
              : "Membro cadastrado com sucesso!",
          ),
            l(!1),
            D(),
            F());
        else {
          const le = await ae.json().catch(() => ({}));
          M(le.error || "Erro ao salvar cadastro.");
        }
      } catch {
        M("Erro de conexão com o servidor.");
      } finally {
        v(!1);
      }
    },
    H = async () => {
      if (y)
        try {
          (await fetch(`${r}/members/${y.id}`, { method: "DELETE" })).ok
            ? (E(`${y.name} foi excluído(a) com sucesso!`), F())
            : M("Erro ao excluir membro.");
        } catch {
          M("Erro de conexão.");
        } finally {
          k(null);
        }
    },
    Q = a.filter((c) => {
      if (
        (s === "members" && c.is_visitor) ||
        (s === "visitors" && !c.is_visitor)
      )
        return !1;
      if (f.trim()) {
        const B = f.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(B) ||
          (c.whatsapp || "").toLowerCase().includes(B)
        );
      }
      return !0;
    }),
    _ = C || b.photo_url;
  return e("div", {
    className: "main-content",
    children: [
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "blue", children: "Membros e Visitantes" }),
              e("h1", { children: "👥 Gestão de Membros e Visitantes" }),
              e("p", {
                children:
                  "Acompanhe a jornada espiritual de cada pessoa na igreja.",
              }),
            ],
          }),
          e("button", {
            className: "btn-primary",
            onClick: Y,
            children: "+ Novo Cadastro",
          }),
        ],
      }),
      I && e(K, { type: "success", message: I, autoDismiss: 3500 }),
      j && e(K, { type: "error", message: j, autoDismiss: 4e3 }),
      e("div", {
        className: "filters-bar",
        style: {
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        },
        children: [
          e("button", {
            className: `btn-secondary ${s === "all" ? "active" : ""}`,
            onClick: () => d("all"),
            children: "Todos",
          }),
          e("button", {
            className: `btn-secondary ${s === "members" ? "active" : ""}`,
            onClick: () => d("members"),
            children: "Apenas Membros",
          }),
          e("button", {
            className: `btn-secondary ${s === "visitors" ? "active" : ""}`,
            onClick: () => d("visitors"),
            children: "Apenas Visitantes",
          }),
          e("input", {
            type: "text",
            placeholder: "🔍 Buscar por nome ou WhatsApp…",
            value: f,
            onInput: (c) => h(c.currentTarget.value),
            style: {
              marginLeft: "auto",
              padding: "0.45rem 0.9rem",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              minWidth: 220,
            },
          }),
        ],
      }),
      e("div", {
        className: "modern-card",
        children: n
          ? e(pe, { rows: 5, height: 56 })
          : Q.length === 0
            ? e(te, {
                icon: "👥",
                title: "Nenhum registro encontrado",
                description: f
                  ? `Nenhum resultado para "${f}".`
                  : "Cadastre membros e visitantes para começar o acompanhamento.",
                actionLabel: f ? void 0 : "+ Novo Cadastro",
                onAction: f ? void 0 : Y,
              })
            : e("table", {
                className: "modern-table",
                children: [
                  e("thead", {
                    children: e("tr", {
                      children: [
                        e("th", { children: "Nome" }),
                        e("th", { children: "Tipo" }),
                        e("th", { children: "Status Espiritual" }),
                        e("th", { children: "Último Contato" }),
                        e("th", { children: "Ações" }),
                      ],
                    }),
                  }),
                  e("tbody", {
                    children: Q.map((c) =>
                      e(
                        "tr",
                        {
                          children: [
                            e("td", {
                              children: e("div", {
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                },
                                children: [
                                  e(Te, {
                                    name: c.name,
                                    photo: c.photo_url,
                                    size: 46,
                                    isVisitor: c.is_visitor,
                                  }),
                                  e("div", {
                                    children: [
                                      e("div", {
                                        style: {
                                          fontWeight: 700,
                                          color: "var(--text-main)",
                                        },
                                        children: c.name,
                                      }),
                                      e("div", {
                                        style: {
                                          fontSize: "0.75rem",
                                          color: "#64748b",
                                        },
                                        children:
                                          c.whatsapp ||
                                          c.phone ||
                                          "Sem WhatsApp",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            e("td", {
                              children: e("span", {
                                style: {
                                  fontSize: "0.85rem",
                                  color: c.is_visitor ? "#f59e0b" : "#10b981",
                                  fontWeight: 600,
                                },
                                children: c.is_visitor
                                  ? "🔸 Visitante"
                                  : "🔹 Membro",
                              }),
                            }),
                            e("td", {
                              children: e(U, { status: c.spiritual_status }),
                            }),
                            e("td", {
                              children: [
                                e("div", {
                                  style: { fontSize: "0.85rem" },
                                  children: c.last_contact_date || "Nunca",
                                }),
                                c.follow_up_notes &&
                                  e("div", {
                                    style: {
                                      fontSize: "0.7rem",
                                      color: "#94a3b8",
                                      maxWidth: 150,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    },
                                    title: c.follow_up_notes,
                                    children: c.follow_up_notes,
                                  }),
                              ],
                            }),
                            e("td", {
                              children: e("div", {
                                className: "action-btns",
                                children: [
                                  e("button", {
                                    className: "btn-icon",
                                    title: "Visualizar detalhes",
                                    onClick: () => u(c),
                                    children: "📋",
                                  }),
                                  e("button", {
                                    className: "btn-icon",
                                    title: "Editar",
                                    onClick: () => N(c),
                                    children: "✏️",
                                  }),
                                  e("button", {
                                    className: "btn-icon delete",
                                    title: "Excluir",
                                    onClick: () => k(c),
                                    children: "🗑️",
                                  }),
                                ],
                              }),
                            }),
                          ],
                        },
                        c.id,
                      ),
                    ),
                  }),
                ],
              }),
      }),
      p &&
        e(ne, {
          title: b.id ? "✏️ Editar Cadastro" : "➕ Novo Cadastro",
          onClose: () => {
            (l(!1), D());
          },
          maxWidth: 580,
          footer: e(J, {
            children: [
              e("button", {
                type: "button",
                className: "btn-secondary",
                onClick: () => {
                  (l(!1), D());
                },
                disabled: T,
                children: "Cancelar",
              }),
              e("button", {
                type: "submit",
                form: "member-form",
                className: "btn-primary",
                disabled: T,
                children: T
                  ? "Salvando…"
                  : b.id
                    ? "Atualizar"
                    : "Salvar Cadastro",
              }),
            ],
          }),
          children: e("form", {
            id: "member-form",
            onSubmit: $,
            style: { display: "flex", flexDirection: "column", gap: "1rem" },
            children: [
              e("div", {
                style: {
                  padding: "1rem",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                },
                children: [
                  e(Te, {
                    name: b.name,
                    photo: _,
                    size: 80,
                    isVisitor: b.is_visitor,
                  }),
                  e("div", {
                    style: { flex: 1 },
                    children: [
                      e("strong", {
                        style: {
                          display: "block",
                          color: "var(--text-main)",
                          fontSize: "0.95rem",
                          marginBottom: 4,
                        },
                        children: "Foto do Membro / Visitante",
                      }),
                      e("p", {
                        style: {
                          color: "var(--text-muted)",
                          fontSize: "0.78rem",
                          lineHeight: 1.5,
                          margin: "0 0 0.8rem",
                        },
                        children: "JPG, PNG ou WEBP até 2 MB.",
                      }),
                      e("div", {
                        style: {
                          display: "flex",
                          gap: "0.6rem",
                          flexWrap: "wrap",
                        },
                        children: [
                          e("label", {
                            className: "btn-primary",
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              cursor: "pointer",
                              width: "fit-content",
                            },
                            children: [
                              "Escolher Foto",
                              e("input", {
                                type: "file",
                                accept: "image/jpeg,image/png,image/webp",
                                onChange: (c) =>
                                  A(
                                    c,
                                    (B) => x((V) => ({ ...V, photo_url: B })),
                                    M,
                                  ),
                                style: { display: "none" },
                              }),
                            ],
                          }),
                          _ &&
                            e("button", {
                              type: "button",
                              className: "btn-secondary",
                              onClick: () =>
                                R(() => x((c) => ({ ...c, photo_url: "" }))),
                              children: "Remover",
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                },
                children: [
                  e("label", {
                    children: [
                      "Nome Completo *",
                      e("input", {
                        type: "text",
                        value: b.name,
                        onInput: (c) =>
                          x((B) => ({ ...B, name: c.currentTarget.value })),
                        placeholder: "Nome completo",
                        required: !0,
                      }),
                    ],
                  }),
                  e("label", {
                    children: [
                      "E-mail",
                      e("input", {
                        type: "email",
                        placeholder: "email@exemplo.com",
                        value: b.email,
                        onInput: (c) =>
                          x((B) => ({ ...B, email: c.currentTarget.value })),
                      }),
                    ],
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                },
                children: [
                  e("label", {
                    children: [
                      "WhatsApp *",
                      e("input", {
                        type: "text",
                        placeholder: "Ex: 21999999999",
                        value: b.whatsapp,
                        onInput: (c) =>
                          x((B) => ({ ...B, whatsapp: c.currentTarget.value })),
                        required: !0,
                      }),
                    ],
                  }),
                  e("label", {
                    children: [
                      "Endereço",
                      e("input", {
                        type: "text",
                        placeholder: "Rua, Número…",
                        value: b.address,
                        onInput: (c) =>
                          x((B) => ({ ...B, address: c.currentTarget.value })),
                      }),
                    ],
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                },
                children: [
                  e("label", {
                    children: [
                      "Bairro",
                      e("input", {
                        type: "text",
                        placeholder: "Ex: Engenho Novo",
                        value: b.neighborhood,
                        onInput: (c) =>
                          x((B) => ({
                            ...B,
                            neighborhood: c.currentTarget.value,
                          })),
                      }),
                    ],
                  }),
                  e("label", {
                    children: [
                      "Cidade",
                      e("input", {
                        type: "text",
                        placeholder: "Ex: Rio de Janeiro",
                        value: b.city,
                        onInput: (c) =>
                          x((B) => ({ ...B, city: c.currentTarget.value })),
                      }),
                    ],
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Data de Nascimento",
                  e("input", {
                    type: "date",
                    value: b.birth_date,
                    onInput: (c) =>
                      x((B) => ({ ...B, birth_date: c.currentTarget.value })),
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Tipo de Cadastro",
                  e("select", {
                    value: b.is_visitor ? "true" : "false",
                    onChange: (c) =>
                      x((B) => ({
                        ...B,
                        is_visitor: c.currentTarget.value === "true",
                      })),
                    children: [
                      e("option", {
                        value: "true",
                        children: "Visitante (Primeira Vez)",
                      }),
                      e("option", {
                        value: "false",
                        children: "Membro (Batizado/Convertido)",
                      }),
                    ],
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Status Espiritual",
                  e("select", {
                    value: b.spiritual_status,
                    onChange: (c) =>
                      x((B) => ({
                        ...B,
                        spiritual_status: c.currentTarget.value,
                      })),
                    children: [
                      e("option", {
                        value: "NOVO",
                        children: "Novo na Igreja",
                      }),
                      e("option", {
                        value: "CONVERTIDO",
                        children: "Convertido",
                      }),
                      e("option", { value: "BATIZADO", children: "Batizado" }),
                      e("option", {
                        value: "DISCIPULADO",
                        children: "Em Discipulado",
                      }),
                      e("option", {
                        value: "MEMBRO_ATIVO",
                        children: "Membro Ativo",
                      }),
                    ],
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Observações",
                  e("textarea", {
                    value: b.observations,
                    onInput: (c) =>
                      x((B) => ({ ...B, observations: c.currentTarget.value })),
                    rows: 3,
                    placeholder: "Pedidos de oração, observações pastorais…",
                  }),
                ],
              }),
            ],
          }),
        }),
      m &&
        e(ne, {
          title: "📋 Detalhes do Cadastro",
          onClose: () => u(null),
          maxWidth: 520,
          footer: e(J, {
            children: [
              e("button", {
                type: "button",
                className: "btn-secondary",
                onClick: () => u(null),
                children: "Fechar",
              }),
              e("button", {
                type: "button",
                className: "btn-primary",
                onClick: () => {
                  (u(null), N(m));
                },
                children: "✏️ Editar",
              }),
            ],
          }),
          children: e("div", {
            style: { display: "flex", flexDirection: "column", gap: "1.5rem" },
            children: [
              e("div", {
                style: { display: "flex", alignItems: "center", gap: "1rem" },
                children: [
                  e(Te, {
                    name: m.name,
                    photo: m.photo_url,
                    size: 72,
                    isVisitor: m.is_visitor,
                  }),
                  e("div", {
                    children: [
                      e("h3", {
                        style: {
                          margin: 0,
                          color: "var(--text-main)",
                          fontSize: "1.1rem",
                        },
                        children: m.name,
                      }),
                      e("span", {
                        style: {
                          fontSize: "0.85rem",
                          color: m.is_visitor ? "#f59e0b" : "#10b981",
                          fontWeight: 600,
                        },
                        children: m.is_visitor ? "🔸 Visitante" : "🔹 Membro",
                      }),
                      e("div", {
                        style: { marginTop: 4 },
                        children: e(U, { status: m.spiritual_status }),
                      }),
                    ],
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                },
                children: [
                  e(ce, { label: "WhatsApp", value: m.whatsapp || m.phone }),
                  e(ce, { label: "E-mail", value: m.email }),
                  e(ce, {
                    label: "Status Espiritual",
                    value: ei(m.spiritual_status),
                  }),
                  e(ce, {
                    label: "Último Contato",
                    value: m.last_contact_date,
                  }),
                  m.address && e(ce, { label: "Endereço", value: m.address }),
                  m.neighborhood &&
                    e(ce, { label: "Bairro", value: m.neighborhood }),
                  m.city && e(ce, { label: "Cidade", value: m.city }),
                  m.birth_date &&
                    e(ce, { label: "Data de Nascimento", value: m.birth_date }),
                ],
              }),
              (m.follow_up_notes || m.observations) &&
                e("div", {
                  children: [
                    e("div", {
                      style: {
                        color: "var(--text-muted)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 4,
                      },
                      children: "Observações",
                    }),
                    e("p", {
                      style: {
                        color: "var(--text-main)",
                        fontSize: "0.9rem",
                        lineHeight: 1.65,
                        margin: 0,
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                      },
                      children: m.observations || m.follow_up_notes,
                    }),
                  ],
                }),
            ],
          }),
        }),
      y &&
        e(Se, {
          title: "Excluir Cadastro",
          message: `Tem certeza que deseja excluir "${y.name}"? Esta ação não pode ser desfeita.`,
          onConfirm: H,
          onCancel: () => k(null),
          danger: !0,
        }),
    ],
  });
}
const br = {
    Agendada: { label: "Agendada", color: "#8B5CF6", icon: "📅" },
    Realizada: { label: "Realizada", color: "#10B981", icon: "✅" },
    Cancelada: { label: "Cancelada", color: "#EF4444", icon: "✕" },
    Reagendada: { label: "Reagendada", color: "#F59E0B", icon: "🔁" },
    Pendente: { label: "Pendente", color: "#F59E0B", icon: "⏳" },
  },
  Yt = {
    member_id: 0,
    address: "",
    visit_date: "",
    visit_time: "",
    responsible_id: 0,
    conducted_by: "",
    notes: "",
    result: "",
    status: "Agendada",
    carried_holy_communion: !1,
  };
function ti({ role: t }) {
  var Q;
  const [r, a] = g([]),
    [o, n] = g([]),
    [i, s] = g(!0),
    [d, f] = g(!1),
    [h, p] = g(!1),
    [l, m] = g(null),
    [u, y] = g(null),
    [k, T] = g(""),
    { notification: v, showSuccess: b, showError: x, clear: C } = ue(),
    z = t === "pastor" ? "/api/pastor" : "/api/worker",
    [A, R] = g({ ...Yt });
  Z(() => {
    P();
  }, []);
  const P = async () => {
      s(!0);
      try {
        const [_, c] = await Promise.all([
          fetch(`${z}/visits`),
          fetch(`${z}/members`),
        ]);
        if (!_.ok || !c.ok)
          throw new Error("Erro ao carregar visitas pastorais.");
        const B = await _.json(),
          V = await c.json();
        (a(B || []), n(V || []));
      } catch (_) {
        x(
          _ instanceof Error
            ? _.message
            : "Não foi possível carregar os dados de visitas.",
        );
      } finally {
        s(!1);
      }
    },
    I = () => {
      (R({ ...Yt }), m(null));
    },
    j = () => {
      (I(), p(!0));
    },
    E = (_) => {
      (m(_),
        R({
          member_id: _.member_id,
          address: _.address,
          visit_date: _.visit_date,
          visit_time: _.visit_time,
          responsible_id: _.responsible_id,
          conducted_by: _.conducted_by,
          notes: _.notes,
          result: _.result,
          status: _.status,
          carried_holy_communion: _.carried_holy_communion,
        }),
        p(!0));
    },
    M = async (_) => {
      (_.preventDefault(), f(!0));
      try {
        const c = l ? "PUT" : "POST",
          B = l ? `${z}/visits/${l.id}` : `${z}/visits`;
        if (
          !(
            await fetch(B, {
              method: c,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(A),
            })
          ).ok
        )
          throw new Error(
            l
              ? "Erro ao atualizar visita pastoral."
              : "Erro ao agendar visita pastoral.",
          );
        (p(!1),
          I(),
          b(
            l
              ? "Visita pastoral atualizada com sucesso."
              : "Visita pastoral agendada com sucesso.",
          ),
          await P());
      } catch (c) {
        x(c instanceof Error ? c.message : "Erro de conexão ao salvar visita.");
      } finally {
        f(!1);
      }
    },
    F = r.filter((_) => {
      if (!k.trim()) return !0;
      const c = o.find((B) => B.id === _.member_id);
      return (
        (c == null ? void 0 : c.name.toLowerCase().includes(k.toLowerCase())) ??
        !1
      );
    }),
    D = r.length,
    Y = r.filter((_) => _.status === "Agendada").length,
    N = r.filter((_) => _.status === "Realizada").length,
    $ = r.filter((_) => _.carried_holy_communion).length,
    H = r.filter((_) => ["Pendente", "Reagendada"].includes(_.status)).length;
  return e("div", {
    className: "main-content",
    children: [
      v &&
        e(K, {
          type: v.type,
          message: v.message,
          onClose: C,
          autoDismiss: 3500,
        }),
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "green", children: "Cuidado pastoral nas casas" }),
              e("h1", { children: "🏠 Visitas Pastorais" }),
              e("p", {
                children:
                  "Organize visitas, acompanhamento espiritual, Santa Ceia nas casas e cuidado com membros que precisam de atenção pastoral.",
              }),
            ],
          }),
          e("div", {
            style: { display: "flex", gap: 10 },
            children: [
              e("button", {
                className: "btn-help",
                onClick: P,
                children: "Atualizar",
              }),
              e("button", {
                className: "btn-primary",
                onClick: j,
                children: "+ Agendar Visita",
              }),
            ],
          }),
        ],
      }),
      e("div", {
        className: "stats-grid",
        style: {
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        },
        children: [
          e(O, {
            title: "Total de Visitas",
            value: D,
            color: "#8B5CF6",
            icon: "🏠",
          }),
          e(O, { title: "Agendadas", value: Y, color: "#2563EB", icon: "📅" }),
          e(O, { title: "Realizadas", value: N, color: "#10B981", icon: "✅" }),
          e(O, { title: "Santa Ceia", value: $, color: "#F59E0B", icon: "🍇" }),
          e(O, { title: "Pendências", value: H, color: "#EF4444", icon: "⏳" }),
        ],
      }),
      e("div", {
        className: "modern-card",
        children: [
          e("div", {
            className: "modern-card-header",
            children: [
              e("div", {
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    children: "Agenda de Visitas",
                  }),
                  e("p", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      marginTop: 4,
                    },
                    children:
                      "Acompanhe visitas agendadas, realizadas e pedidos de Santa Ceia.",
                  }),
                ],
              }),
              e("input", {
                type: "text",
                placeholder: "Buscar por nome do membro...",
                value: k,
                onInput: (_) => T(_.currentTarget.value),
                style: { maxWidth: 260 },
              }),
            ],
          }),
          i
            ? e(pe, { rows: 6, height: 62 })
            : F.length === 0
              ? e(te, {
                  icon: "🏠",
                  title: k
                    ? "Nenhuma visita encontrada"
                    : "Nenhuma visita pastoral agendada",
                  description: k
                    ? `Não encontramos visitas para "${k}". Tente outro nome.`
                    : "Agende visitas para membros, enfermos, afastados ou famílias que precisam de cuidado pastoral.",
                  actionLabel: k ? void 0 : "Agendar primeira visita",
                  onAction: k ? void 0 : j,
                })
              : e("div", {
                  style: { overflowX: "auto" },
                  children: e("table", {
                    className: "modern-table",
                    children: [
                      e("thead", {
                        children: e("tr", {
                          children: [
                            e("th", { children: "Membro" }),
                            e("th", { children: "Data/Hora" }),
                            e("th", { children: "Local" }),
                            e("th", { children: "Status" }),
                            e("th", { children: "Santa Ceia" }),
                            e("th", { children: "Observações" }),
                            e("th", { children: "Ações" }),
                          ],
                        }),
                      }),
                      e("tbody", {
                        children: F.map((_) => {
                          const c = o.find((V) => V.id === _.member_id),
                            B = br[_.status] || {
                              label: _.status || "Sem status",
                              color: "#6B7280",
                              icon: "•",
                            };
                          return e(
                            "tr",
                            {
                              children: [
                                e("td", {
                                  children: e("div", {
                                    style: {
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                    },
                                    children: [
                                      e(ri, {
                                        name:
                                          (c == null ? void 0 : c.name) ||
                                          "Membro",
                                      }),
                                      e("div", {
                                        children: [
                                          e("strong", {
                                            style: {
                                              color: "var(--text-main)",
                                              fontSize: "0.9rem",
                                            },
                                            children: c
                                              ? c.name
                                              : "Membro não encontrado",
                                          }),
                                          e("div", {
                                            style: {
                                              color: "var(--text-muted)",
                                              fontSize: "0.72rem",
                                            },
                                            children: [
                                              "Por:",
                                              " ",
                                              _.conducted_by ||
                                                "Responsável não informado",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                                e("td", {
                                  children: [
                                    e("div", {
                                      style: {
                                        color: "var(--text-main)",
                                        fontSize: "0.86rem",
                                        fontWeight: 700,
                                      },
                                      children: yr(_.visit_date),
                                    }),
                                    e("div", {
                                      style: {
                                        color: "var(--text-muted)",
                                        fontSize: "0.72rem",
                                      },
                                      children: _.visit_time || "--:--",
                                    }),
                                  ],
                                }),
                                e("td", {
                                  children: e("div", {
                                    style: {
                                      maxWidth: 220,
                                      color: "var(--text-muted)",
                                      fontSize: "0.84rem",
                                      lineHeight: 1.45,
                                    },
                                    children:
                                      _.address || "Endereço não informado",
                                  }),
                                }),
                                e("td", {
                                  children: e(U, {
                                    label: B.label,
                                    color: B.color,
                                    icon: B.icon,
                                  }),
                                }),
                                e("td", {
                                  children: _.carried_holy_communion
                                    ? e(U, {
                                        label: "Sim",
                                        color: "#F59E0B",
                                        icon: "🍇",
                                      })
                                    : e(U, {
                                        label: "Não",
                                        color: "#6B7280",
                                        icon: "—",
                                      }),
                                }),
                                e("td", {
                                  children: e("div", {
                                    style: {
                                      maxWidth: 220,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      color: "var(--text-muted)",
                                      fontSize: "0.82rem",
                                    },
                                    title: _.notes || _.result,
                                    children:
                                      _.notes || _.result || "Sem observações",
                                  }),
                                }),
                                e("td", {
                                  children: e("div", {
                                    className: "action-btns",
                                    children: [
                                      e("button", {
                                        className: "btn-icon",
                                        title: "Ver detalhes",
                                        type: "button",
                                        onClick: () => y(_),
                                        children: "👁️",
                                      }),
                                      e("button", {
                                        className: "btn-icon",
                                        title: "Editar visita",
                                        type: "button",
                                        onClick: () => E(_),
                                        children: "✏️",
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            },
                            _.id,
                          );
                        }),
                      }),
                    ],
                  }),
                }),
        ],
      }),
      h &&
        e(ne, {
          title: l ? "Editar Visita Pastoral" : "Agendar Nova Visita",
          subtitle:
            "Registre a visita pastoral e informe se será levada Santa Ceia.",
          onClose: () => {
            (p(!1), I());
          },
          maxWidth: 560,
          children: e("form", {
            onSubmit: M,
            style: { display: "flex", flexDirection: "column", gap: "1rem" },
            children: [
              e("label", {
                children: [
                  "Membro",
                  e("select", {
                    value: A.member_id,
                    onChange: (_) =>
                      R({ ...A, member_id: parseInt(_.currentTarget.value) }),
                    required: !0,
                    children: [
                      e("option", { value: "", children: "Selecione..." }),
                      o.map((_) =>
                        e("option", { value: _.id, children: _.name }, _.id),
                      ),
                    ],
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Endereço da visita",
                  e("input", {
                    type: "text",
                    placeholder: "Informe o endereço completo",
                    value: A.address,
                    onInput: (_) => R({ ...A, address: _.currentTarget.value }),
                    required: !0,
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                },
                children: [
                  e("label", {
                    children: [
                      "Data",
                      e("input", {
                        type: "date",
                        value: A.visit_date,
                        onInput: (_) =>
                          R({ ...A, visit_date: _.currentTarget.value }),
                        required: !0,
                      }),
                    ],
                  }),
                  e("label", {
                    children: [
                      "Horário",
                      e("input", {
                        type: "time",
                        value: A.visit_time,
                        onInput: (_) =>
                          R({ ...A, visit_time: _.currentTarget.value }),
                        required: !0,
                      }),
                    ],
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Responsável / Realizado por",
                  e("input", {
                    type: "text",
                    placeholder: "Ex: Pr. João ou Obreira Maria",
                    value: A.conducted_by,
                    onInput: (_) =>
                      R({ ...A, conducted_by: _.currentTarget.value }),
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Status",
                  e("select", {
                    value: A.status,
                    onChange: (_) => R({ ...A, status: _.currentTarget.value }),
                    children: [
                      e("option", { value: "Agendada", children: "Agendada" }),
                      e("option", {
                        value: "Realizada",
                        children: "Realizada",
                      }),
                      e("option", { value: "Pendente", children: "Pendente" }),
                      e("option", {
                        value: "Reagendada",
                        children: "Reagendada",
                      }),
                      e("option", {
                        value: "Cancelada",
                        children: "Cancelada",
                      }),
                    ],
                  }),
                ],
              }),
              e("label", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  padding: "0.9rem 1rem",
                  borderRadius: 16,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.22)",
                },
                children: [
                  e("input", {
                    type: "checkbox",
                    checked: A.carried_holy_communion,
                    onChange: (_) =>
                      R({
                        ...A,
                        carried_holy_communion: _.currentTarget.checked,
                      }),
                    style: { width: 18, height: 18 },
                  }),
                  e("span", {
                    style: { color: "#FCD34D", fontWeight: 800 },
                    children: "Levar Santa Ceia nesta visita?",
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Observações Pastorais",
                  e("textarea", {
                    placeholder:
                      "Descreva a necessidade, pedido de oração ou situação pastoral...",
                    value: A.notes,
                    onInput: (_) => R({ ...A, notes: _.currentTarget.value }),
                    style: { minHeight: 110, resize: "vertical" },
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Resultado da visita",
                  e("textarea", {
                    placeholder: "Preencha após a visita ser realizada...",
                    value: A.result,
                    onInput: (_) => R({ ...A, result: _.currentTarget.value }),
                    style: { minHeight: 90, resize: "vertical" },
                  }),
                ],
              }),
              e("div", {
                className: "form-actions",
                children: [
                  e("button", {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => {
                      (p(!1), I());
                    },
                    children: "Cancelar",
                  }),
                  e("button", {
                    type: "submit",
                    className: "btn-primary",
                    disabled: d,
                    children: d
                      ? "Salvando..."
                      : l
                        ? "Atualizar Visita"
                        : "Agendar Visita",
                  }),
                ],
              }),
            ],
          }),
        }),
      u &&
        e(ai, {
          visit: u,
          memberName:
            (Q = o.find((_) => _.id === u.member_id)) == null ? void 0 : Q.name,
          onClose: () => y(null),
          onEdit: () => {
            (y(null), E(u));
          },
        }),
    ],
  });
}
function ri({ name: t }) {
  const r = (t || "MB")
    .split(" ")
    .slice(0, 2)
    .map((a) => a[0])
    .join("")
    .toUpperCase();
  return e("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#10B981,#2563EB)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 900,
      fontSize: "0.8rem",
      boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
      flexShrink: 0,
    },
    children: r,
  });
}
function ai({ visit: t, memberName: r, onClose: a, onEdit: o }) {
  const n = br[t.status] || { label: t.status, color: "#6B7280", icon: "•" },
    i = ({ label: s, value: d }) =>
      e("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: "0.5rem",
          padding: "0.6rem 0",
          borderBottom: "1px solid var(--border)",
        },
        children: [
          e("span", {
            style: {
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 800,
            },
            children: s,
          }),
          e("span", {
            style: { color: "var(--text-main)", fontSize: "0.88rem" },
            children: d || "-",
          }),
        ],
      });
  return e(ne, {
    title: "📋 Detalhes da Visita",
    subtitle: r ? `Visita para: ${r}` : void 0,
    onClose: a,
    maxWidth: 520,
    children: [
      e("div", {
        style: { display: "flex", flexDirection: "column" },
        children: [
          e(i, { label: "Membro", value: r || "Não identificado" }),
          e(i, { label: "Data", value: yr(t.visit_date) }),
          e(i, { label: "Horário", value: t.visit_time || "--:--" }),
          e(i, { label: "Endereço", value: t.address }),
          e(i, { label: "Responsável", value: t.conducted_by }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "0.5rem",
              padding: "0.6rem 0",
              borderBottom: "1px solid var(--border)",
            },
            children: [
              e("span", {
                style: {
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                },
                children: "Status",
              }),
              e(U, { label: n.label, color: n.color, icon: n.icon }),
            ],
          }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "0.5rem",
              padding: "0.6rem 0",
              borderBottom: "1px solid var(--border)",
            },
            children: [
              e("span", {
                style: {
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                },
                children: "Santa Ceia",
              }),
              t.carried_holy_communion
                ? e(U, { label: "Sim", color: "#F59E0B", icon: "🍇" })
                : e(U, { label: "Não", color: "#6B7280", icon: "—" }),
            ],
          }),
          t.notes &&
            e("div", {
              style: { padding: "0.75rem 0" },
              children: [
                e("p", {
                  style: {
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    margin: "0 0 0.35rem",
                  },
                  children: "Observações",
                }),
                e("p", {
                  style: {
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    margin: 0,
                  },
                  children: t.notes,
                }),
              ],
            }),
          t.result &&
            e("div", {
              style: { padding: "0.75rem 0" },
              children: [
                e("p", {
                  style: {
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    margin: "0 0 0.35rem",
                  },
                  children: "Resultado",
                }),
                e("p", {
                  style: {
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    margin: 0,
                  },
                  children: t.result,
                }),
              ],
            }),
        ],
      }),
      e("div", {
        className: "form-actions",
        style: { marginTop: "1rem" },
        children: [
          e("button", {
            className: "btn-secondary",
            onClick: a,
            children: "Fechar",
          }),
          e("button", {
            className: "btn-primary",
            onClick: o,
            children: "✏️ Editar Visita",
          }),
        ],
      }),
    ],
  });
}
function yr(t) {
  if (!t) return "-";
  const r = new Date(`${t}T00:00:00`);
  return Number.isNaN(r.getTime()) ? t : r.toLocaleDateString("pt-BR");
}
const Qt = {
    URGENTE: { label: "Urgente", color: "#EF4444", icon: "🚨" },
    ENFERMIDADE: { label: "Enfermidade", color: "#F59E0B", icon: "🤒" },
    ORACAO: { label: "Oração", color: "#10B981", icon: "🙏" },
    AJUDA: { label: "Ajuda", color: "#3B82F6", icon: "🤝" },
    VISITA: { label: "Visita", color: "#8B5CF6", icon: "🏠" },
  },
  Xt = { recipient_id: 0, subject: "", message: "", msg_type: "VISITA" };
function ii() {
  const [t, r] = g([]),
    [a, o] = g(!0),
    [n, i] = g(!1),
    [s, d] = g(!1),
    { notification: f, showSuccess: h, showError: p, clear: l } = ue(),
    [m, u] = g({ ...Xt });
  Z(() => {
    y();
  }, []);
  const y = async () => {
      o(!0);
      try {
        const z = await (await fetch("/api/team/messages")).json();
        r(z || []);
      } catch {
        p("Não foi possível carregar os recados internos.");
      } finally {
        o(!1);
      }
    },
    k = () => u({ ...Xt }),
    T = async (C) => {
      if ((C.preventDefault(), !m.subject.trim())) {
        p("Informe o assunto do recado.");
        return;
      }
      if (!m.message.trim()) {
        p("Escreva o conteúdo do recado.");
        return;
      }
      i(!0);
      try {
        if (
          !(
            await fetch("/api/team/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(m),
            })
          ).ok
        )
          throw new Error("Não foi possível enviar o recado.");
        (d(!1), k(), h("Recado enviado com sucesso."), y());
      } catch (z) {
        p(z instanceof Error ? z.message : "Erro de conexão ao enviar recado.");
      } finally {
        i(!1);
      }
    },
    v = t.filter((C) => !C.is_read).length,
    b = t.filter((C) => C.msg_type === "URGENTE").length,
    x = t.filter((C) => C.msg_type === "ORACAO").length;
  return e("div", {
    className: "main-content",
    children: [
      f &&
        e(K, {
          type: f.type,
          message: f.message,
          onClose: l,
          autoDismiss: 3500,
        }),
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "purple", children: "Comunicação da equipe" }),
              e("h1", { children: "📝 Recados dos Obreiros" }),
              e("p", {
                children:
                  "Registre pedidos de oração, visitas, enfermidades, alertas urgentes e informações importantes para o pastor.",
              }),
            ],
          }),
          e("button", {
            className: "btn-primary",
            onClick: () => d(!0),
            children: "+ Novo Recado",
          }),
        ],
      }),
      e("div", {
        className: "stats-grid",
        style: {
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        },
        children: [
          e(O, {
            title: "Total de Recados",
            value: t.length,
            color: "#8B5CF6",
            icon: "📨",
          }),
          e(O, {
            title: "Novos Recados",
            value: v,
            color: "#10B981",
            icon: "🟢",
          }),
          e(O, { title: "Urgentes", value: b, color: "#EF4444", icon: "🚨" }),
          e(O, {
            title: "Pedidos de Oração",
            value: x,
            color: "#F59E0B",
            icon: "🙏",
          }),
        ],
      }),
      e("div", {
        className: "modern-card",
        children: [
          e("div", {
            className: "modern-card-header",
            children: [
              e("div", {
                children: [
                  e("h2", {
                    className: "modern-card-title",
                    children: "Histórico de Recados",
                  }),
                  e("p", {
                    style: {
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      marginTop: 4,
                    },
                    children:
                      "Acompanhe as informações enviadas pela equipe da igreja.",
                  }),
                ],
              }),
              e("button", {
                className: "btn-help",
                onClick: y,
                children: "Atualizar",
              }),
            ],
          }),
          a
            ? e(pe, { rows: 5, height: 86 })
            : t.length === 0
              ? e(te, {
                  icon: "📝",
                  title: "Nenhum recado registrado ainda",
                  description:
                    "Use esta área para que obreiros enviem informações importantes ao pastor, como visitas, enfermidades, pedidos de oração e alertas.",
                  actionLabel: "Criar primeiro recado",
                  onAction: () => d(!0),
                })
              : e("div", {
                  style: { display: "grid", gap: 12 },
                  children: t.map((C) => e(oi, { msg: C }, C.id)),
                }),
        ],
      }),
      s &&
        e(ne, {
          title: "Novo Recado Interno",
          subtitle: "Envie uma informação importante para o pastor.",
          onClose: () => {
            (d(!1), k());
          },
          maxWidth: 520,
          children: e("form", {
            onSubmit: T,
            style: { display: "flex", flexDirection: "column", gap: "1rem" },
            children: [
              e("label", {
                children: [
                  "Tipo de Recado",
                  e("select", {
                    value: m.msg_type,
                    onChange: (C) =>
                      u({ ...m, msg_type: C.currentTarget.value }),
                    children: [
                      e("option", {
                        value: "VISITA",
                        children: "Pedido de Visita",
                      }),
                      e("option", {
                        value: "URGENTE",
                        children: "Urgência / Alerta",
                      }),
                      e("option", {
                        value: "ORACAO",
                        children: "Pedido de Oração",
                      }),
                      e("option", {
                        value: "ENFERMIDADE",
                        children: "Membro Enfermo",
                      }),
                      e("option", {
                        value: "AJUDA",
                        children: "Ajuda Social / Apoio",
                      }),
                    ],
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Assunto *",
                  e("input", {
                    type: "text",
                    placeholder: "Ex: Membro precisa de visita",
                    value: m.subject,
                    onInput: (C) => u({ ...m, subject: C.currentTarget.value }),
                    required: !0,
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Mensagem Detalhada *",
                  e("textarea", {
                    style: { height: 130, resize: "vertical" },
                    placeholder:
                      "Descreva a situação com clareza para o pastor...",
                    value: m.message,
                    onInput: (C) => u({ ...m, message: C.currentTarget.value }),
                    required: !0,
                  }),
                ],
              }),
              e("div", {
                className: "form-actions",
                children: [
                  e("button", {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => {
                      (d(!1), k());
                    },
                    children: "Cancelar",
                  }),
                  e("button", {
                    type: "submit",
                    className: "btn-primary",
                    disabled: n,
                    children: n ? "Enviando..." : "Enviar Recado",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function oi({ msg: t }) {
  const r = Qt[t.msg_type] || Qt.VISITA;
  return e("div", {
    style: {
      position: "relative",
      padding: "1rem 1.1rem",
      borderRadius: 18,
      background: t.is_read
        ? "rgba(255,255,255,0.03)"
        : "linear-gradient(135deg, rgba(124,58,237,0.13), rgba(17,24,39,0.88))",
      border: t.is_read
        ? "1px solid var(--border)"
        : "1px solid rgba(124,58,237,0.35)",
      boxShadow: t.is_read ? "none" : "0 14px 34px rgba(124,58,237,0.14)",
    },
    children: e("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "flex-start",
      },
      children: e("div", {
        style: { minWidth: 0, flex: 1 },
        children: [
          e("div", {
            style: {
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 8,
            },
            children: [
              e(U, { color: r.color, icon: r.icon, label: r.label }),
              !t.is_read &&
                e("span", { className: "badge active", children: "Novo" }),
              e("span", {
                style: { fontSize: "0.72rem", color: "var(--text-muted)" },
                children: new Date(t.created_at).toLocaleString("pt-BR"),
              }),
            ],
          }),
          e("h3", {
            style: {
              margin: 0,
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--text-main)",
            },
            children: t.subject || "Recado sem assunto",
          }),
          e("p", {
            style: {
              margin: "0.45rem 0 0",
              color: "var(--text-muted)",
              lineHeight: 1.55,
              fontSize: "0.9rem",
            },
            children: t.message,
          }),
        ],
      }),
    }),
  });
}
function ni() {
  const [t, r] = g([]),
    [a, o] = g(!0),
    [n, i] = g(null),
    [s, d] = g("");
  Z(() => {
    f();
  }, []);
  const f = async () => {
      (o(!0), d(""));
      try {
        const p = await fetch("/api/pastor/birthdays");
        if (!p.ok) throw new Error("Erro ao obter aniversariantes.");
        const l = await p.json();
        r(l || []);
      } catch (p) {
        d(p.message || "Não foi possível carregar aniversariantes.");
      } finally {
        o(!1);
      }
    },
    h = async (p, l) => {
      (i(p), d(""));
      const m = `Olá, ${l}! 🎉

A Igreja da Graça deseja a você um feliz aniversário!

Que o Senhor te abençoe, te guarde, ilumine seus caminhos e derrame sobre sua vida graça, paz, saúde e muitas vitórias.

“Ensina-nos a contar os nossos dias, de tal maneira que alcancemos coração sábio.” Salmo 90:12`;
      try {
        const u = await fetch("/api/pastor/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ member_id: p, template: m }),
        });
        if (!u.ok) throw new Error("Falha ao gerar link do WhatsApp.");
        const { url: y } = await u.json();
        window.open(y, "_blank");
      } catch (u) {
        d(u.message || "Erro ao enviar mensagem.");
      } finally {
        i(null);
      }
    };
  return e("section", {
    className: "modern-card",
    style: { marginBottom: "1.5rem" },
    children: [
      e("div", {
        className: "modern-card-header",
        children: [
          e("div", {
            children: [
              e("span", {
                style: {
                  display: "inline-flex",
                  padding: "0.35rem 0.75rem",
                  borderRadius: 999,
                  background: "rgba(245,158,11,0.14)",
                  border: "1px solid rgba(245,158,11,0.35)",
                  color: "#FCD34D",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                },
                children: "Cuidado pastoral",
              }),
              e("h2", {
                className: "modern-card-title",
                children: "🎂 Aniversariantes do Dia",
              }),
              e("p", {
                style: {
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  marginTop: 4,
                },
                children:
                  "Envie uma mensagem de carinho e bênção para quem está completando mais um ano de vida.",
              }),
            ],
          }),
          !a &&
            t.length > 0 &&
            e("div", {
              style: {
                minWidth: 56,
                height: 56,
                borderRadius: 18,
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.35)",
                color: "#FCD34D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                fontWeight: 900,
              },
              children: t.length,
            }),
        ],
      }),
      s && e(mi, { message: s }),
      a
        ? e(di, {})
        : t.length === 0
          ? e(ci, {})
          : e("div", {
              style: { display: "grid", gap: 12 },
              children: t.map((p) =>
                e(
                  li,
                  {
                    birthday: p,
                    sending: n === p.id,
                    onSend: () => h(p.id, p.name),
                  },
                  p.id,
                ),
              ),
            }),
    ],
  });
}
function li({ birthday: t, sending: r, onSend: a }) {
  return e("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      borderRadius: 18,
      background:
        "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(17,24,39,0.88))",
      border: "1px solid rgba(245,158,11,0.24)",
    },
    children: [
      e("div", {
        style: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
        children: [
          e(si, { name: t.name }),
          e("div", {
            style: { minWidth: 0 },
            children: [
              e("strong", {
                style: {
                  display: "block",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
                children: t.name,
              }),
              e("span", {
                style: { color: "var(--text-muted)", fontSize: "0.78rem" },
                children: [hi(t.birth_date), " · ", ui(t.whatsapp)],
              }),
            ],
          }),
        ],
      }),
      e("button", {
        className: "btn-primary",
        type: "button",
        onClick: a,
        disabled: r,
        style: {
          whiteSpace: "nowrap",
          background: "linear-gradient(135deg,#10B981,#059669)",
        },
        children: r ? "Abrindo..." : "Enviar WhatsApp",
      }),
    ],
  });
}
function si({ name: t }) {
  const r = (t || "AN")
    .split(" ")
    .slice(0, 2)
    .map((a) => a[0])
    .join("")
    .toUpperCase();
  return e("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#F59E0B,#EC4899)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 900,
      fontSize: "0.82rem",
      boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
      flexShrink: 0,
    },
    children: r,
  });
}
function di() {
  return e("div", {
    style: { display: "grid", gap: 12 },
    children: Array.from({ length: 3 }).map((t, r) =>
      e(
        "div",
        { className: "skeleton", style: { height: 72, borderRadius: 18 } },
        r,
      ),
    ),
  });
}
function ci() {
  return e("div", {
    style: {
      textAlign: "center",
      padding: "2.5rem 1rem",
      borderRadius: 20,
      background: "rgba(255,255,255,0.03)",
      border: "1px dashed rgba(255,255,255,0.12)",
    },
    children: [
      e("div", {
        style: { fontSize: "2.4rem", marginBottom: "0.8rem" },
        children: "🎂",
      }),
      e("h3", {
        style: { margin: 0, color: "var(--text-main)" },
        children: "Nenhum aniversariante hoje",
      }),
      e("p", {
        style: {
          color: "var(--text-muted)",
          fontSize: "0.88rem",
          margin: "0.5rem auto 0",
          maxWidth: 420,
        },
        children:
          "Quando houver aniversariantes cadastrados para o dia, eles aparecerão aqui para envio rápido de mensagem pastoral.",
      }),
    ],
  });
}
function mi({ message: t }) {
  return e("div", {
    style: {
      padding: "0.9rem 1rem",
      borderRadius: 16,
      background: "rgba(239,68,68,0.14)",
      border: "1px solid rgba(239,68,68,0.3)",
      color: "#F87171",
      fontWeight: 800,
      fontSize: "0.85rem",
      marginBottom: "1rem",
    },
    children: ["⚠️ ", t],
  });
}
function hi(t) {
  if (!t) return "Data não informada";
  const r = new Date(`${t}T00:00:00`);
  return Number.isNaN(r.getTime()) ? t : r.toLocaleDateString("pt-BR");
}
function ui(t) {
  if (!t) return "Sem WhatsApp";
  const r = t.replace(/\D/g, "");
  return r.length === 11
    ? `(${r.slice(0, 2)}) ${r.slice(2, 7)}-${r.slice(7)}`
    : r.length === 13
      ? `+${r.slice(0, 2)} (${r.slice(2, 4)}) ${r.slice(4, 9)}-${r.slice(9)}`
      : t;
}
const ct = { name: "", username: "", email: "", phone: "", password: "" };
function pi() {
  const [t, r] = g([]),
    [a, o] = g(!0),
    [n, i] = g(!1),
    [s, d] = g(!1),
    [f, h] = g(null),
    {
      success: p,
      error: l,
      showSuccess: m,
      showError: u,
      clearSuccess: y,
      clearError: k,
    } = ue(),
    [T, v] = g(!1),
    [b, x] = g("create"),
    [C, z] = g(null),
    [A, R] = g(ct),
    [P, I] = g(""),
    [j, E] = g(!1),
    [M, F] = g(""),
    [D, Y] = g(null);
  Z(() => {
    N();
  }, []);
  const N = async (w = !1) => {
      try {
        (w ? i(!0) : o(!0), k());
        const W = await fetch("/api/pastor/users");
        if (!W.ok) throw new Error("Erro ao carregar usuários da equipe.");
        const ee = await W.json();
        r(ee || []);
      } catch (W) {
        u(W.message || "Não foi possível carregar a equipe.");
      } finally {
        (o(!1), i(!1));
      }
    },
    $ = () => {
      (x("create"), z(null), R(ct), I(""), k(), y(), v(!0));
    },
    H = (w) => {
      if (w.role !== "obreiro") {
        u("Somente obreiros podem ser editados por esta tela.");
        return;
      }
      (x("edit"),
        z(w),
        R({
          name: w.name || "",
          username: w.username || "",
          email: w.email || "",
          phone: w.phone || "",
          password: "",
        }),
        I(""),
        k(),
        y(),
        v(!0));
    },
    Q = () => {
      (v(!1), z(null), R(ct), I(""), d(!1));
    },
    _ = async (w) => {
      (w.preventDefault(), I(""));
      try {
        if ((d(!0), !A.name.trim() || !A.username.trim()))
          throw new Error("Nome e login são obrigatórios.");
        if (b === "create" && A.password.length < 6)
          throw new Error("A senha precisa ter no mínimo 6 caracteres.");
        const W =
            b === "create"
              ? "/api/pastor/users"
              : `/api/pastor/users/${C == null ? void 0 : C.id}`,
          ee = b === "create" ? "POST" : "PUT",
          ge =
            b === "create"
              ? A
              : {
                  name: A.name,
                  username: A.username,
                  email: A.email,
                  phone: A.phone,
                },
          Re = await fetch(W, {
            method: ee,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ge),
          }),
          ke = await Re.json().catch(() => ({}));
        if (!Re.ok) throw new Error(ke.error || "Erro ao salvar usuário.");
        (Q(),
          await N(),
          m(
            b === "create"
              ? "Obreiro criado com sucesso."
              : "Obreiro atualizado com sucesso.",
          ));
      } catch (W) {
        I(W.message || "Erro ao salvar usuário.");
      } finally {
        d(!1);
      }
    },
    c = async (w, W) => {
      try {
        (h(w), k(), y());
        const ee = await fetch(`/api/pastor/users/${w}/grant-admin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ grant: !W }),
          }),
          ge = await ee.json().catch(() => ({}));
        if (!ee.ok) throw new Error(ge.error || "Erro ao atualizar permissão.");
        (await N(),
          m(
            W
              ? "Acesso provisório bloqueado com sucesso."
              : "Acesso provisório liberado com sucesso.",
          ));
      } catch (ee) {
        u(ee.message || "Não foi possível atualizar a permissão.");
      } finally {
        h(null);
      }
    },
    B = (w) => {
      if (w.role !== "obreiro") {
        u("Somente senha de obreiros pode ser resetada por esta tela.");
        return;
      }
      (z(w), F(""), I(""), k(), y(), E(!0));
    },
    V = () => {
      (E(!1), z(null), F(""), I(""));
    },
    ae = async (w) => {
      (w.preventDefault(), I(""));
      try {
        if ((d(!0), M.length < 6))
          throw new Error("A nova senha precisa ter no mínimo 6 caracteres.");
        const W = await fetch(
            `/api/pastor/users/${C == null ? void 0 : C.id}/password`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password: M }),
            },
          ),
          ee = await W.json().catch(() => ({}));
        if (!W.ok) throw new Error(ee.error || "Erro ao resetar senha.");
        (V(), m("Senha resetada com sucesso."));
      } catch (W) {
        I(W.message || "Erro ao resetar senha.");
      } finally {
        d(!1);
      }
    },
    le = (w) => {
      if (w.role !== "obreiro") {
        u("Pastor não pode ser excluído por esta tela.");
        return;
      }
      Y(w);
    },
    Ce = async () => {
      if (!D) return;
      const w = D;
      Y(null);
      try {
        (h(w.id), k(), y());
        const W = await fetch(`/api/pastor/users/${w.id}`, {
            method: "DELETE",
          }),
          ee = await W.json().catch(() => ({}));
        if (!W.ok) throw new Error(ee.error || "Erro ao excluir usuário.");
        (await N(), m("Obreiro excluído com sucesso."));
      } catch (W) {
        u(W.message || "Erro ao excluir usuário.");
      } finally {
        h(null);
      }
    },
    we = t.length,
    Ie = t.filter((w) => w.role === "pastor").length,
    Ze = t.filter((w) => w.role === "obreiro").length,
    Me = t.filter((w) => w.role === "obreiro" && w.provisional_access).length;
  return e("div", {
    className: "main-content",
    children: [
      e("div", {
        className: "page-header",
        children: [
          e("div", {
            children: [
              e(de, { color: "green", children: "Gestão da equipe" }),
              e("h1", { children: "🛡️ Obreiros e Acessos" }),
              e("p", {
                children:
                  "Somente o Pastor Administrador pode criar, editar, resetar senha, excluir e liberar acessos dos obreiros.",
              }),
            ],
          }),
          e("div", {
            style: { display: "flex", gap: "0.6rem", flexWrap: "wrap" },
            children: [
              e("button", {
                className: "btn-secondary",
                onClick: () => N(!0),
                disabled: n,
                style: { display: "flex", alignItems: "center", gap: "0.4rem" },
                children: n
                  ? e(J, {
                      children: [
                        e("span", {
                          style: {
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            border: "2px solid currentColor",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          },
                        }),
                        "Atualizando...",
                      ],
                    })
                  : "↻ Atualizar",
              }),
              e("button", {
                className: "btn-primary",
                onClick: $,
                children: "+ Novo Obreiro",
              }),
            ],
          }),
        ],
      }),
      p && e(K, { type: "success", message: p, onClose: y, autoDismiss: 3500 }),
      l && e(K, { type: "error", message: l, onClose: k, autoDismiss: 4e3 }),
      e("div", {
        className: "stats-grid",
        style: {
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        },
        children: [
          e(O, {
            title: "Total de Usuários",
            value: we,
            color: "#8B5CF6",
            icon: "👥",
          }),
          e(O, { title: "Pastores", value: Ie, color: "#2563EB", icon: "⛪" }),
          e(O, { title: "Obreiros", value: Ze, color: "#10B981", icon: "🤝" }),
          e(O, {
            title: "Acessos Liberados",
            value: Me,
            color: "#F59E0B",
            icon: "🔓",
          }),
        ],
      }),
      e("div", {
        className: "modern-card",
        children: [
          e("div", {
            className: "modern-card-header",
            children: e("div", {
              children: [
                e("h2", {
                  className: "modern-card-title",
                  children: "Equipe da Igreja",
                }),
                e("p", {
                  style: {
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginTop: 4,
                  },
                  children:
                    "O obreiro não possui CRUD. Ele só acessa as áreas permitidas pelo Pastor.",
                }),
              ],
            }),
          }),
          a
            ? e(pe, { rows: 5, height: 62 })
            : t.length === 0
              ? e(te, {
                  icon: "🤝",
                  title: "Nenhum usuário encontrado",
                  description:
                    "Quando obreiros forem cadastrados, eles aparecerão nesta área para gerenciamento.",
                  actionLabel: "+ Novo Obreiro",
                  onAction: $,
                })
              : e("div", {
                  style: { overflowX: "auto" },
                  children: e("table", {
                    className: "modern-table",
                    children: [
                      e("thead", {
                        children: e("tr", {
                          children: [
                            e("th", { children: "Nome" }),
                            e("th", { children: "Login" }),
                            e("th", { children: "Contato" }),
                            e("th", { children: "Cargo" }),
                            e("th", { children: "Status" }),
                            e("th", { children: "Ações do Pastor" }),
                          ],
                        }),
                      }),
                      e("tbody", {
                        children: t.map((w) => {
                          const W = w.role === "pastor";
                          return e(
                            "tr",
                            {
                              style: W
                                ? {
                                    background: "rgba(124,58,237,0.06)",
                                    borderLeft:
                                      "3px solid rgba(124,58,237,0.45)",
                                  }
                                : {},
                              children: [
                                e("td", {
                                  children: e("div", {
                                    style: {
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                    },
                                    children: [
                                      e(Te, {
                                        name: w.name,
                                        gradient: W
                                          ? "linear-gradient(135deg,#7C3AED,#2563EB)"
                                          : "linear-gradient(135deg,#10B981,#2563EB)",
                                      }),
                                      e("div", {
                                        children: [
                                          e("strong", {
                                            style: {
                                              color: "var(--text-main)",
                                              fontSize: "0.9rem",
                                            },
                                            children:
                                              w.name || "Usuário sem nome",
                                          }),
                                          e("div", {
                                            style: {
                                              color: "var(--text-muted)",
                                              fontSize: "0.72rem",
                                            },
                                            children: ["ID #", w.id],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                                e("td", {
                                  children: e("span", {
                                    style: {
                                      color: "var(--text-muted)",
                                      fontSize: "0.85rem",
                                    },
                                    children: w.username,
                                  }),
                                }),
                                e("td", {
                                  children: [
                                    e("div", {
                                      style: {
                                        color: "var(--text-muted)",
                                        fontSize: "0.78rem",
                                      },
                                      children: w.email || "Sem e-mail",
                                    }),
                                    e("div", {
                                      style: {
                                        color: "var(--text-muted)",
                                        fontSize: "0.78rem",
                                      },
                                      children: w.phone || "Sem telefone",
                                    }),
                                  ],
                                }),
                                e("td", {
                                  children: W
                                    ? e(U, {
                                        label: "Pastor Admin",
                                        color: "#8B5CF6",
                                        icon: "⛪",
                                      })
                                    : e(U, {
                                        label: "Obreiro",
                                        color: "#10B981",
                                        icon: "🤝",
                                      }),
                                }),
                                e("td", {
                                  children: W
                                    ? e(U, {
                                        label: "Administrador",
                                        color: "#2563EB",
                                        icon: "🛡️",
                                      })
                                    : w.provisional_access
                                      ? e(U, {
                                          label: "Liberado",
                                          color: "#10B981",
                                          icon: "✅",
                                        })
                                      : e(U, {
                                          label: "Bloqueado",
                                          color: "#EF4444",
                                          icon: "🔒",
                                        }),
                                }),
                                e("td", {
                                  children:
                                    w.role === "obreiro"
                                      ? e("div", {
                                          className: "action-btns",
                                          children: [
                                            e("button", {
                                              className: "btn-icon",
                                              title: "Editar",
                                              onClick: () => H(w),
                                              children: "✏️",
                                            }),
                                            e("button", {
                                              className: "btn-icon",
                                              title: "Resetar senha",
                                              onClick: () => B(w),
                                              children: "🔑",
                                            }),
                                            e("button", {
                                              className: "btn-icon",
                                              title: w.provisional_access
                                                ? "Bloquear acesso"
                                                : "Liberar acesso",
                                              disabled: f === w.id,
                                              onClick: () =>
                                                c(w.id, w.provisional_access),
                                              children:
                                                f === w.id
                                                  ? "⏳"
                                                  : w.provisional_access
                                                    ? "🔒"
                                                    : "🔓",
                                            }),
                                            e("button", {
                                              className: "btn-icon delete",
                                              title: "Excluir",
                                              disabled: f === w.id,
                                              onClick: () => le(w),
                                              children: "🗑️",
                                            }),
                                          ],
                                        })
                                      : e("span", {
                                          style: {
                                            color: "var(--text-muted)",
                                            fontSize: "0.82rem",
                                          },
                                          children:
                                            "Acesso principal do Pastor",
                                        }),
                                }),
                              ],
                            },
                            w.id,
                          );
                        }),
                      }),
                    ],
                  }),
                }),
        ],
      }),
      T &&
        e(ne, {
          title: b === "create" ? "Novo Obreiro" : "Editar Obreiro",
          subtitle:
            "O acesso criado será de obreiro. Ele não terá permissão de CRUD administrativo.",
          onClose: Q,
          maxWidth: 560,
          children: e("form", {
            onSubmit: _,
            style: { display: "grid", gap: "1rem", padding: "0.25rem 0" },
            children: [
              P && e(K, { type: "error", message: P }),
              e("label", {
                children: [
                  "Nome completo *",
                  e("input", {
                    type: "text",
                    value: A.name,
                    onInput: (w) => R({ ...A, name: w.currentTarget.value }),
                    required: !0,
                  }),
                ],
              }),
              e("label", {
                children: [
                  "Login *",
                  e("input", {
                    type: "text",
                    value: A.username,
                    onInput: (w) =>
                      R({ ...A, username: w.currentTarget.value }),
                    required: !0,
                  }),
                ],
              }),
              e("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                },
                children: [
                  e("label", {
                    children: [
                      "E-mail",
                      e("input", {
                        type: "email",
                        value: A.email,
                        onInput: (w) =>
                          R({ ...A, email: w.currentTarget.value }),
                      }),
                    ],
                  }),
                  e("label", {
                    children: [
                      "Telefone / WhatsApp",
                      e("input", {
                        type: "text",
                        value: A.phone,
                        onInput: (w) =>
                          R({ ...A, phone: w.currentTarget.value }),
                      }),
                    ],
                  }),
                ],
              }),
              b === "create" &&
                e("label", {
                  children: [
                    "Senha inicial *",
                    e("input", {
                      type: "password",
                      value: A.password,
                      minLength: 6,
                      onInput: (w) =>
                        R({ ...A, password: w.currentTarget.value }),
                      required: !0,
                    }),
                  ],
                }),
              e("div", {
                style: {
                  padding: "1rem",
                  borderRadius: 16,
                  background: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.28)",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                },
                children: [
                  "✅ Este usuário será cadastrado como ",
                  e("strong", { children: "Obreiro" }),
                  ". Ele não poderá criar, editar ou excluir usuários. Somente o Pastor Administrador terá esse CRUD.",
                ],
              }),
              e("div", {
                className: "form-actions",
                children: [
                  e("button", {
                    type: "button",
                    className: "btn-secondary",
                    onClick: Q,
                    children: "Cancelar",
                  }),
                  e("button", {
                    type: "submit",
                    className: "btn-primary",
                    disabled: s,
                    children: s
                      ? "Salvando..."
                      : b === "create"
                        ? "Criar Obreiro"
                        : "Salvar Alterações",
                  }),
                ],
              }),
            ],
          }),
        }),
      j &&
        C &&
        e(ne, {
          title: "Resetar Senha",
          subtitle: `Defina uma nova senha para ${C.name}.`,
          onClose: V,
          maxWidth: 440,
          children: e("form", {
            onSubmit: ae,
            style: { display: "grid", gap: "1rem", padding: "0.25rem 0" },
            children: [
              P && e(K, { type: "error", message: P }),
              e("label", {
                children: [
                  "Nova senha *",
                  e("input", {
                    type: "password",
                    value: M,
                    minLength: 6,
                    onInput: (w) => F(w.currentTarget.value),
                    required: !0,
                  }),
                ],
              }),
              e("div", {
                className: "form-actions",
                children: [
                  e("button", {
                    type: "button",
                    className: "btn-secondary",
                    onClick: V,
                    children: "Cancelar",
                  }),
                  e("button", {
                    type: "submit",
                    className: "btn-primary",
                    disabled: s,
                    children: s ? "Salvando..." : "Resetar Senha",
                  }),
                ],
              }),
            ],
          }),
        }),
      D &&
        e(Se, {
          title: "Excluir obreiro?",
          message: `Deseja realmente excluir o acesso de "${D.name}"? Esta ação não pode ser desfeita.`,
          onConfirm: Ce,
          onCancel: () => Y(null),
          danger: !0,
          confirmLabel: "Sim, excluir",
        }),
    ],
  });
}
const vr = {
    Grid: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("rect", { x: "3", y: "3", width: "7", height: "7" }),
          e("rect", { x: "14", y: "3", width: "7", height: "7" }),
          e("rect", { x: "14", y: "14", width: "7", height: "7" }),
          e("rect", { x: "3", y: "14", width: "7", height: "7" }),
        ],
      }),
    Users: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
          e("circle", { cx: "9", cy: "7", r: "4" }),
          e("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
          e("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }),
        ],
      }),
    UserCheck: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
          e("circle", { cx: "8.5", cy: "7", r: "4" }),
          e("polyline", { points: "17 11 19 13 23 9" }),
        ],
      }),
    Gift: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("polyline", { points: "20 12 20 22 4 22 4 12" }),
          e("rect", { x: "2", y: "7", width: "20", height: "5" }),
          e("path", { d: "M12 22V7" }),
          e("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }),
          e("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }),
        ],
      }),
    MessageCircle: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: e("path", {
          d: "M21 11.5a8.5 8.5 0 1 1-8.5-8.5A8.38 8.38 0 0 1 21 11.5z",
        }),
      }),
    Home: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
          e("polyline", { points: "9 22 9 12 15 12 15 22" }),
        ],
      }),
    Cup: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("path", { d: "M17 8h1a4 4 0 1 1 0 8h-1" }),
          e("path", { d: "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" }),
          e("line", { x1: "6", y1: "2", x2: "6", y2: "4" }),
          e("line", { x1: "10", y1: "2", x2: "10", y2: "4" }),
          e("line", { x1: "14", y1: "2", x2: "14", y2: "4" }),
        ],
      }),
    Layers: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
          e("polyline", { points: "2 17 12 22 22 17" }),
          e("polyline", { points: "2 12 12 17 22 12" }),
        ],
      }),
    Shield: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: e("path", {
          d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        }),
      }),
    BarChart: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("line", { x1: "18", y1: "20", x2: "18", y2: "10" }),
          e("line", { x1: "12", y1: "20", x2: "12", y2: "4" }),
          e("line", { x1: "6", y1: "20", x2: "6", y2: "14" }),
        ],
      }),
    Settings: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("circle", { cx: "12", cy: "12", r: "3" }),
          e("path", {
            d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
          }),
        ],
      }),
    LogOut: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
          e("polyline", { points: "16 17 21 12 16 7" }),
          e("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
        ],
      }),
    Globe: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("circle", { cx: "12", cy: "12", r: "10" }),
          e("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
          e("path", {
            d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
          }),
        ],
      }),
    Mail: () =>
      e("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          e("path", {
            d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
          }),
          e("polyline", { points: "22,6 12,13 2,6" }),
        ],
      }),
  },
  Zt = [
    { id: "theme-navy", label: "Azul", icon: "🌊" },
    { id: "theme-dark", label: "Escuro", icon: "🌙" },
  ];
function Kt({ label: t, onRemove: r }) {
  return e("button", {
    onClick: r,
    "aria-label": t,
    style: {
      width: "100%",
      padding: "6px 8px",
      fontSize: "0.72rem",
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(239,68,68,0.35)",
      color: "#F87171",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 700,
      transition: "background 0.15s",
    },
    onMouseEnter: (a) => {
      a.currentTarget.style.background = "rgba(239,68,68,0.22)";
    },
    onMouseLeave: (a) => {
      a.currentTarget.style.background = "rgba(239,68,68,0.12)";
    },
    children: t,
  });
}
function re({ icon: t, label: r, tab: a, activeTab: o, onClick: n, badge: i }) {
  const s = vr[t];
  return e("button", {
    className: `sidebar-item ${o === a ? "active" : ""}`,
    onClick: () => n(a),
    title: r,
    "aria-label": i ? `${r} — ${i} hoje` : r,
    "aria-current": o === a ? "page" : void 0,
    style: { position: "relative" },
    children: [
      e(s, {}),
      e("span", { children: r }),
      i != null &&
        i > 0 &&
        e("span", {
          "aria-hidden": "true",
          style: {
            position: "absolute",
            top: 6,
            right: 8,
            minWidth: 18,
            height: 18,
            borderRadius: 999,
            background: "#F59E0B",
            color: "#000",
            fontSize: "0.62rem",
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            lineHeight: 1,
            boxShadow: "0 2px 6px rgba(245,158,11,0.5)",
          },
          children: i > 99 ? "99+" : i,
        }),
    ],
  });
}
function gi({ name: t, role: r, photo_url: a }) {
  if (a)
    return e("img", {
      src: a,
      alt: t,
      style: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
        border: "2px solid rgba(255,255,255,0.1)",
      },
    });
  const o = (t || "US")
    .split(" ")
    .slice(0, 2)
    .map((i) => i[0])
    .join("")
    .toUpperCase();
  return e("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background:
        r === "super_admin"
          ? "linear-gradient(135deg,#9333ea,#6D28D9)"
          : r === "pastor"
            ? "linear-gradient(135deg,#7C3AED,#2563EB)"
            : "linear-gradient(135deg,#10B981,#2563EB)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "0.9rem",
      color: "#fff",
      flexShrink: 0,
      boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
      border: "2px solid rgba(255,255,255,0.1)",
    },
    children: o,
  });
}
function mt({ label: t }) {
  return e("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
      gap: 16,
      color: "var(--text-muted)",
    },
    children: [
      e("div", { style: { fontSize: "3rem" }, children: "🚧" }),
      e("h2", { style: { color: "var(--text-main)", margin: 0 }, children: t }),
      e("p", {
        style: { margin: 0, fontSize: "0.875rem" },
        children: "Módulo em desenvolvimento — em breve!",
      }),
    ],
  });
}
function fi() {
  return e("div", {
    style: { minHeight: "100vh", display: "flex", background: "#070B1A" },
    children: [
      e("style", {
        children: `
        @keyframes shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position:  600px 0 }
        }
        .sk-app {
          background: linear-gradient(90deg,#111827 25%,#1F2937 50%,#111827 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }
      `,
      }),
      e("div", {
        style: {
          width: 220,
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flexShrink: 0,
        },
        children: [
          e("div", {
            style: {
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 8,
            },
            children: [
              e("div", {
                className: "sk-app",
                style: {
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  flexShrink: 0,
                },
              }),
              e("div", {
                style: {
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                },
                children: [
                  e("div", {
                    className: "sk-app",
                    style: { height: 12, width: "80%" },
                  }),
                  e("div", {
                    className: "sk-app",
                    style: { height: 10, width: "60%" },
                  }),
                ],
              }),
            ],
          }),
          Array.from({ length: 10 }).map((t, r) =>
            e(
              "div",
              {
                className: "sk-app",
                style: { height: 36, borderRadius: 10, opacity: 1 - r * 0.06 },
              },
              r,
            ),
          ),
        ],
      }),
      e("div", {
        style: {
          flex: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        },
        children: [
          e("div", {
            style: { display: "flex", flexDirection: "column", gap: 10 },
            children: [
              e("div", {
                className: "sk-app",
                style: { height: 18, width: 140 },
              }),
              e("div", {
                className: "sk-app",
                style: { height: 32, width: 360 },
              }),
              e("div", {
                className: "sk-app",
                style: { height: 14, width: 280 },
              }),
            ],
          }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: 12,
            },
            children: Array.from({ length: 6 }).map((t, r) =>
              e(
                "div",
                {
                  className: "sk-app",
                  style: { height: 88, borderRadius: 16 },
                },
                r,
              ),
            ),
          }),
          e("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: 12,
            },
            children: [
              e("div", {
                className: "sk-app",
                style: { height: 220, borderRadius: 20 },
              }),
              e("div", {
                className: "sk-app",
                style: { height: 220, borderRadius: 20 },
              }),
              e("div", {
                className: "sk-app",
                style: { height: 220, borderRadius: 20 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function bi({ onLogout: t }) {
  const [r, a] = g(null),
    [o, n] = g(() => {
      const N = localStorage.getItem("crm_theme");
      return N === "theme-navy" || N === "theme-dark" ? N : "theme-navy";
    }),
    [i, s] = g(!0),
    [d, f] = g("dashboard"),
    [h, p] = g(0),
    [l, m] = g(!1),
    {
      notification: u,
      showSuccess: y,
      showError: k,
      showInfo: T,
      clear: v,
    } = ue(),
    [b, x] = g(""),
    { handlePhotoChange: C } = yt();
  Z(() => {
    if (!(r != null && r.user_id)) return;
    const N = localStorage.getItem(`crm_profile_photo_${r.user_id}`) || "";
    x(N);
  }, [r == null ? void 0 : r.user_id]);
  const z = he(
      (N) => {
        C(
          N,
          ($) => {
            (x($),
              r != null &&
                r.user_id &&
                localStorage.setItem(`crm_profile_photo_${r.user_id}`, $),
              y("Foto do perfil atualizada!"));
          },
          k,
        );
      },
      [C, y, k, r == null ? void 0 : r.user_id],
    ),
    A = he(() => {
      (x(""),
        r != null &&
          r.user_id &&
          localStorage.removeItem(`crm_profile_photo_${r.user_id}`));
    }, [r == null ? void 0 : r.user_id]),
    [R, P] = g(() => localStorage.getItem("crm_church_logo") || ""),
    { handlePhotoChange: I } = yt(),
    j = he(
      (N) => {
        I(
          N,
          ($) => {
            (P($),
              localStorage.setItem("crm_church_logo", $),
              y("Logo da igreja atualizado!"));
          },
          k,
        );
      },
      [I, y, k],
    ),
    E = he(() => {
      (P(""), localStorage.removeItem("crm_church_logo"));
    }, []);
  Z(() => {
    (document.body.classList.remove("theme-navy", "theme-dark", "theme-light"),
      document.body.classList.add(o),
      localStorage.setItem("crm_theme", o));
  }, [o]);
  const M = he(
    (N) => {
      var $;
      (n(N),
        T(
          `Tema ${(($ = Zt.find((H) => H.id === N)) == null ? void 0 : $.label) ?? N} aplicado.`,
        ));
    },
    [T],
  );
  (Z(() => {
    fetch("/api/me")
      .then((N) => (N.ok ? N.json() : null))
      .then((N) => {
        N
          ? (a(N), f(N.role === "super_admin" ? "superadmin" : "dashboard"))
          : a(null);
      })
      .catch(() => a(null))
      .finally(() => s(!1));
  }, []),
    Z(() => {
      !r ||
        r.role === "super_admin" ||
        fetch("/api/pastor/dashboard-stats")
          .then((N) => (N.ok ? N.json() : null))
          .then((N) => {
            N != null &&
              N.birthdays_today &&
              p(
                Array.isArray(N.birthdays_today)
                  ? N.birthdays_today.length
                  : Number(N.birthdays_today) || 0,
              );
          })
          .catch(() => {});
    }, [r]));
  const F = he(async () => {
    (m(!1),
      await fetch("/api/logout", { method: "POST" }),
      t(),
      (window.location.href = "/login"));
  }, [t]);
  if (i) return e(fi, {});
  if (!r) return null;
  const D = r.role === "super_admin",
    Y = r.role === "pastor";
  return e("div", {
    className: "app-layout",
    children: [
      u &&
        e(K, {
          type: u.type,
          message: u.message,
          fixed: !0,
          onClose: v,
          autoDismiss: 3500,
        }),
      l &&
        e(Se, {
          title: "Sair do sistema",
          message:
            "Tem certeza que deseja encerrar sua sessão? Você precisará fazer login novamente.",
          confirmLabel: "Sair",
          cancelLabel: "Cancelar",
          danger: !0,
          onConfirm: F,
          onCancel: () => m(!1),
        }),
      e("aside", {
        className: "sidebar",
        children: [
          e("div", {
            className: "sidebar-header",
            children: [
              e("div", {
                style: { position: "relative", flexShrink: 0 },
                children: [
                  R
                    ? e("img", {
                        src: R,
                        alt: "Logo da igreja",
                        style: {
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          objectFit: "cover",
                          boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                        },
                      })
                    : e("div", {
                        style: {
                          width: 42,
                          height: 42,
                          background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                        },
                        children: e("svg", {
                          width: "20",
                          height: "20",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "white",
                          strokeWidth: "2.5",
                          children: e("path", { d: "M12 2v20M2 12h20" }),
                        }),
                      }),
                  e("label", {
                    title: "Trocar logo da igreja",
                    style: {
                      position: "absolute",
                      right: -6,
                      bottom: -6,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.68rem",
                      cursor: "pointer",
                      border: "2px solid var(--sidebar-bg)",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                      zIndex: 2,
                    },
                    children: [
                      "📷",
                      e("input", {
                        type: "file",
                        accept: "image/*",
                        onChange: j,
                        style: { display: "none" },
                      }),
                    ],
                  }),
                ],
              }),
              e("div", {
                children: [
                  e("h2", {
                    children: D
                      ? "Eclesia SaaS"
                      : r.church_name || "Igreja Rochdale",
                  }),
                  e("p", {
                    children: D ? "Painel Global" : "Sistema Pastoral",
                  }),
                ],
              }),
            ],
          }),
          e("nav", {
            className: "sidebar-nav",
            children: [
              D
                ? e(re, {
                    icon: "Globe",
                    label: "Gestão SaaS",
                    tab: "superadmin",
                    activeTab: d,
                    onClick: f,
                  })
                : e(J, {
                    children: [
                      e("span", {
                        className: "section-label",
                        children: "Principal",
                      }),
                      e(re, {
                        icon: "Grid",
                        label: "Dashboard",
                        tab: "dashboard",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Users",
                        label: "Membros",
                        tab: "membros",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "UserCheck",
                        label: "Visitantes",
                        tab: "visitantes",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Gift",
                        label: "Aniversariantes",
                        tab: "aniversariantes",
                        activeTab: d,
                        onClick: f,
                        badge: h,
                      }),
                      e(re, {
                        icon: "MessageCircle",
                        label: "Mensagens Pastorais",
                        tab: "mensagens",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Home",
                        label: "Visitas Pastorais",
                        tab: "visitas",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Cup",
                        label: "Santa Ceia",
                        tab: "santa_ceia",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Layers",
                        label: "Grupos",
                        tab: "grupos",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Shield",
                        label: "Obreiros",
                        tab: "obreiros",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Mail",
                        label: "Recados da Equipe",
                        tab: "recados",
                        activeTab: d,
                        onClick: f,
                      }),
                      e("span", {
                        className: "section-label",
                        style: { marginTop: 8 },
                        children: "Sistema",
                      }),
                      e(re, {
                        icon: "BarChart",
                        label: "Relatórios",
                        tab: "relatorios",
                        activeTab: d,
                        onClick: f,
                      }),
                      e(re, {
                        icon: "Settings",
                        label: "Configurações",
                        tab: "config",
                        activeTab: d,
                        onClick: f,
                      }),
                    ],
                  }),
              e("div", { style: { flex: 1 } }),
              e("button", {
                className: "sidebar-item",
                onClick: () => m(!0),
                title: "Sair do sistema",
                style: { color: "#F87171" },
                children: [e(vr.LogOut, {}), e("span", { children: "Sair" })],
              }),
            ],
          }),
          e("div", {
            className: "sidebar-profile",
            style: {
              margin: "8px 16px 12px",
              padding: "12px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            },
            children: [
              e("div", {
                style: { display: "flex", alignItems: "center", gap: "12px" },
                children: [
                  e("div", {
                    style: { position: "relative" },
                    children: [
                      e(gi, {
                        name: r.user_name || "US",
                        role: r.role,
                        photo_url: b || r.photo_url,
                      }),
                      e("label", {
                        title: "Trocar foto",
                        style: {
                          position: "absolute",
                          right: -4,
                          bottom: -4,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--primary)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.72rem",
                          cursor: "pointer",
                          border: "2px solid var(--bg-card)",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                        },
                        children: [
                          "📷",
                          e("input", {
                            type: "file",
                            accept: "image/*",
                            onChange: z,
                            style: { display: "none" },
                          }),
                        ],
                      }),
                    ],
                  }),
                  e("div", {
                    children: [
                      e("h3", {
                        style: {
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#F3F4F6",
                        },
                        children: Y
                          ? `Pr. ${r.user_name || "Michael"}`
                          : r.user_name || "Usuário",
                      }),
                      e("p", {
                        style: {
                          margin: 0,
                          fontSize: "0.75rem",
                          color: "#9CA3AF",
                        },
                        children: D
                          ? "Super Admin"
                          : Y
                            ? "Pastor Administrador"
                            : "Obreiro · Equipe",
                      }),
                      e("p", {
                        style: {
                          margin: "4px 0 0 0",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.75rem",
                          color: "#10B981",
                          fontWeight: 500,
                        },
                        children: [
                          e("span", {
                            className: "status-online",
                            style: {
                              background: "#10B981",
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              display: "inline-block",
                              marginRight: 6,
                              boxShadow: "0 0 8px #10B981",
                            },
                          }),
                          "Online",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e("div", {
                style: {
                  paddingTop: "10px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                },
                children: [
                  e("p", {
                    style: {
                      margin: "0 0 8px",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "rgba(255,255,255,0.35)",
                    },
                    children: "Aparência",
                  }),
                  e("div", {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                    },
                    children: Zt.map((N) => {
                      const $ = o === N.id;
                      return e(
                        "button",
                        {
                          onClick: () => M(N.id),
                          title: `Tema ${N.label}`,
                          "aria-pressed": $,
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                            padding: "7px 4px",
                            fontSize: "0.75rem",
                            fontWeight: $ ? 800 : 500,
                            borderRadius: "10px",
                            border: $
                              ? "1.5px solid var(--primary)"
                              : "1px solid rgba(255,255,255,0.1)",
                            background: $
                              ? "linear-gradient(135deg, var(--primary), var(--primary-hover))"
                              : "rgba(255,255,255,0.05)",
                            color: $ ? "#fff" : "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                            boxShadow: $
                              ? "0 4px 12px rgba(0,0,0,0.25)"
                              : "none",
                          },
                          children: [
                            e("span", {
                              style: { fontSize: "0.9rem" },
                              children: N.icon,
                            }),
                            N.label,
                          ],
                        },
                        N.id,
                      );
                    }),
                  }),
                ],
              }),
              b && e(Kt, { label: "Remover foto", onRemove: A }),
              R && e(Kt, { label: "Remover logo", onRemove: E }),
            ],
          }),
        ],
      }),
      d === "superadmin" && D && e(Oa, {}),
      d === "dashboard" &&
        !D &&
        e(Ba, { onNavigate: f, userName: r.user_name || "", userRole: r.role }),
      d === "membros" && !D && e(Jt, { role: r.role }),
      d === "visitantes" && !D && e(Jt, { role: r.role }),
      d === "aniversariantes" && !D && e(ni, {}),
      d === "mensagens" && !D && e(va, {}),
      d === "visitas" && !D && e(ti, { role: r.role }),
      d === "santa_ceia" && !D && e(mt, { label: "Santa Ceia" }),
      d === "grupos" && !D && e(mt, { label: "Grupos" }),
      d === "obreiros" && !D && Y && e(pi, {}),
      d === "obreiros" &&
        !D &&
        !Y &&
        e(mt, { label: "Acesso restrito ao Pastor Administrador" }),
      d === "recados" && !D && e(ii, {}),
      d === "relatorios" && !D && e(Ha, {}),
      d === "config" && !D && e(Qa, {}),
    ],
  });
}
function ie(t, r) {
  return Math.random() * (r - t) + t;
}
function Ne() {
  const t = De(() => {
      const a = [
        "#ffffff",
        "#f8fafc",
        "#c7d2fe",
        "#bfdbfe",
        "#fef3c7",
        "#fda4af",
        "#99f6e4",
        "#facc15",
      ];
      return Array.from({ length: 260 }).map(() => {
        const o = Math.random() > 0.88,
          n = Math.random() > 0.78;
        return {
          left: `${ie(0, 100)}%`,
          top: `${ie(0, 100)}%`,
          size: o ? ie(2.4, 5.2) : ie(0.7, 2.1),
          opacity: n ? ie(0.65, 1) : ie(0.18, 0.55),
          blur: o ? ie(0.5, 1.8) : ie(0, 0.6),
          color: a[Math.floor(Math.random() * a.length)],
          duration: ie(4, 11),
          delay: ie(0, 8),
        };
      });
    }, []),
    r = De(
      () => [
        {
          left: "8%",
          top: "18%",
          width: 90,
          height: 38,
          rotate: -25,
          color: "rgba(191,219,254,0.45)",
        },
        {
          left: "26%",
          top: "35%",
          width: 120,
          height: 46,
          rotate: 18,
          color: "rgba(254,243,199,0.42)",
        },
        {
          left: "72%",
          top: "24%",
          width: 110,
          height: 42,
          rotate: -12,
          color: "rgba(153,246,228,0.34)",
        },
        {
          left: "78%",
          top: "70%",
          width: 130,
          height: 50,
          rotate: 20,
          color: "rgba(253,164,175,0.32)",
        },
        {
          left: "45%",
          top: "78%",
          width: 95,
          height: 34,
          rotate: -18,
          color: "rgba(191,219,254,0.35)",
        },
        {
          left: "56%",
          top: "48%",
          width: 140,
          height: 52,
          rotate: 12,
          color: "rgba(254,243,199,0.28)",
        },
      ],
      [],
    );
  return e(J, {
    children: e("div", {
      className: "deep-space-bg",
      "aria-hidden": "true",
      children: [
        e("div", { className: "space-nebula" }),
        r.map((a, o) =>
          e(
            "span",
            {
              className: "space-galaxy",
              style: {
                left: a.left,
                top: a.top,
                width: `${a.width}px`,
                height: `${a.height}px`,
                transform: `rotate(${a.rotate}deg)`,
                background: `radial-gradient(ellipse at center, ${a.color}, rgba(255,255,255,0.12) 22%, transparent 70%)`,
              },
            },
            `galaxy-${o}`,
          ),
        ),
        t.map((a, o) =>
          e(
            "span",
            {
              className: "space-star",
              style: {
                left: a.left,
                top: a.top,
                width: `${a.size}px`,
                height: `${a.size}px`,
                opacity: a.opacity,
                filter: `blur(${a.blur}px)`,
                background: a.color,
                boxShadow: `0 0 ${a.size * 5}px ${a.color}`,
                animationDuration: `${a.duration}s`,
                animationDelay: `${a.delay}s`,
              },
            },
            o,
          ),
        ),
        e("span", { className: "shooting-star shooting-star-1" }),
        e("span", { className: "shooting-star shooting-star-2" }),
      ],
    }),
  });
}
function yi() {
  const [t, r] = g(window.location.pathname),
    [a, o] = g(!1),
    [n, i] = g(!0),
    s = (p) => {
      (window.history.pushState({}, "", p), r(p));
    },
    d = async () => {
      try {
        const l = (await fetch("/api/me")).ok;
        (o(l),
          l &&
            ["/login", "/register", "/"].includes(window.location.pathname) &&
            s("/app"));
      } catch {
        o(!1);
      } finally {
        i(!1);
      }
    };
  Z(() => {
    d();
    const p = () => {
      r(window.location.pathname);
    };
    return (
      window.addEventListener("popstate", p),
      () => {
        window.removeEventListener("popstate", p);
      }
    );
  }, []);
  const f = () => {
      (o(!0), s("/app"));
    },
    h = () => {
      (o(!1), s("/login"));
    };
  return n
    ? e(J, {
        children: [
          e(Ne, {}),
          e("main", {
            style: {
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              position: "relative",
              zIndex: 1,
            },
            children: e("section", {
              style: {
                textAlign: "center",
                padding: "2rem",
                borderRadius: 24,
                background: "rgba(17,24,39,0.75)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                backdropFilter: "blur(18px)",
              },
              children: [
                e("div", {
                  style: {
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "4px solid rgba(124,58,237,0.2)",
                    borderTopColor: "#8B5CF6",
                    margin: "0 auto 1rem",
                    animation: "spin 0.8s linear infinite",
                  },
                }),
                e("h2", {
                  style: { margin: 0, fontSize: "1.2rem", fontWeight: 900 },
                  children: "Carregando CRM Bom Samaritano",
                }),
                e("p", {
                  style: {
                    color: "#9CA3AF",
                    fontSize: "0.85rem",
                    marginTop: 6,
                  },
                  children: "Preparando o painel da sua igreja...",
                }),
                e("style", {
                  children: `
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `,
                }),
              ],
            }),
          }),
        ],
      })
    : a
      ? e(J, { children: [e(Ne, {}), e(bi, { onLogout: h })] })
      : t === "/login"
        ? e(J, {
            children: [e(Ne, {}), e(Gr, { onLoginSuccess: f, onNavigate: s })],
          })
        : t === "/register"
          ? e(J, { children: [e(Ne, {}), e(Jr, { onNavigate: s })] })
          : e(J, { children: [e(Ne, {}), e(ga, { onNavigate: s })] });
}
const vi = ["theme-navy", "theme-dark", "theme-light"],
  er = localStorage.getItem("crm_theme"),
  _i = vi.includes(er) ? er : "theme-navy";
document.body.classList.remove("theme-navy", "theme-dark", "theme-light");
document.body.classList.add(_i);
Lr(e(yi, {}), document.getElementById("app"));
