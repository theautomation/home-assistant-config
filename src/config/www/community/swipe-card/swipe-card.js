!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t()
    : "function" == typeof define && define.amd
    ? define(t)
    : t();
})(0, function () {
  "use strict";
  const e = new WeakMap(),
    t = (t) => "function" == typeof t && e.has(t),
    i =
      void 0 !== window.customElements &&
      void 0 !== window.customElements.polyfillWrapFlushCallback,
    s = (e, t, i = null) => {
      let s = t;
      for (; s !== i; ) {
        const t = s.nextSibling;
        e.removeChild(s), (s = t);
      }
    },
    a = {},
    r = {},
    n = `{{lit-${String(Math.random()).slice(2)}}}`,
    o = `\x3c!--${n}--\x3e`,
    l = new RegExp(`${n}|${o}`),
    d = "$lit$";
  class p {
    constructor(e, t) {
      (this.parts = []), (this.element = t);
      let i = -1,
        s = 0;
      const a = [],
        r = (t) => {
          const o = t.content,
            p = document.createTreeWalker(o, 133, null, !1);
          let c = 0;
          for (; p.nextNode(); ) {
            i++;
            const t = p.currentNode;
            if (1 === t.nodeType) {
              if (t.hasAttributes()) {
                const a = t.attributes;
                let r = 0;
                for (let e = 0; e < a.length; e++)
                  a[e].value.indexOf(n) >= 0 && r++;
                for (; r-- > 0; ) {
                  const a = e.strings[s],
                    r = u.exec(a)[2],
                    n = r.toLowerCase() + d,
                    o = t.getAttribute(n).split(l);
                  this.parts.push({
                    type: "attribute",
                    index: i,
                    name: r,
                    strings: o,
                  }),
                    t.removeAttribute(n),
                    (s += o.length - 1);
                }
              }
              "TEMPLATE" === t.tagName && r(t);
            } else if (3 === t.nodeType) {
              const e = t.data;
              if (e.indexOf(n) >= 0) {
                const r = t.parentNode,
                  n = e.split(l),
                  o = n.length - 1;
                for (let e = 0; e < o; e++)
                  r.insertBefore(
                    "" === n[e] ? h() : document.createTextNode(n[e]),
                    t
                  ),
                    this.parts.push({ type: "node", index: ++i });
                "" === n[o]
                  ? (r.insertBefore(h(), t), a.push(t))
                  : (t.data = n[o]),
                  (s += o);
              }
            } else if (8 === t.nodeType)
              if (t.data === n) {
                const e = t.parentNode;
                (null !== t.previousSibling && i !== c) ||
                  (i++, e.insertBefore(h(), t)),
                  (c = i),
                  this.parts.push({ type: "node", index: i }),
                  null === t.nextSibling ? (t.data = "") : (a.push(t), i--),
                  s++;
              } else {
                let e = -1;
                for (; -1 !== (e = t.data.indexOf(n, e + 1)); )
                  this.parts.push({ type: "node", index: -1 });
              }
          }
        };
      r(t);
      for (const e of a) e.parentNode.removeChild(e);
    }
  }
  const c = (e) => -1 !== e.index,
    h = () => document.createComment(""),
    u =
      /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
  class m {
    constructor(e, t, i) {
      (this._parts = []),
        (this.template = e),
        (this.processor = t),
        (this.options = i);
    }
    update(e) {
      let t = 0;
      for (const i of this._parts) void 0 !== i && i.setValue(e[t]), t++;
      for (const e of this._parts) void 0 !== e && e.commit();
    }
    _clone() {
      const e = i
          ? this.template.element.content.cloneNode(!0)
          : document.importNode(this.template.element.content, !0),
        t = this.template.parts;
      let s = 0,
        a = 0;
      const r = (e) => {
        const i = document.createTreeWalker(e, 133, null, !1);
        let n = i.nextNode();
        for (; s < t.length && null !== n; ) {
          const e = t[s];
          if (c(e))
            if (a === e.index) {
              if ("node" === e.type) {
                const e = this.processor.handleTextExpression(this.options);
                e.insertAfterNode(n.previousSibling), this._parts.push(e);
              } else
                this._parts.push(
                  ...this.processor.handleAttributeExpressions(
                    n,
                    e.name,
                    e.strings,
                    this.options
                  )
                );
              s++;
            } else
              a++,
                "TEMPLATE" === n.nodeName && r(n.content),
                (n = i.nextNode());
          else this._parts.push(void 0), s++;
        }
      };
      return r(e), i && (document.adoptNode(e), customElements.upgrade(e)), e;
    }
  }
  class g {
    constructor(e, t, i, s) {
      (this.strings = e),
        (this.values = t),
        (this.type = i),
        (this.processor = s);
    }
    getHTML() {
      const e = this.strings.length - 1;
      let t = "";
      for (let i = 0; i < e; i++) {
        const e = this.strings[i],
          s = u.exec(e);
        t += s ? e.substr(0, s.index) + s[1] + s[2] + d + s[3] + n : e + o;
      }
      return t + this.strings[e];
    }
    getTemplateElement() {
      const e = document.createElement("template");
      return (e.innerHTML = this.getHTML()), e;
    }
  }
  const f = (e) =>
    null === e || !("object" == typeof e || "function" == typeof e);
  class v {
    constructor(e, t, i) {
      (this.dirty = !0),
        (this.element = e),
        (this.name = t),
        (this.strings = i),
        (this.parts = []);
      for (let e = 0; e < i.length - 1; e++) this.parts[e] = this._createPart();
    }
    _createPart() {
      return new w(this);
    }
    _getValue() {
      const e = this.strings,
        t = e.length - 1;
      let i = "";
      for (let s = 0; s < t; s++) {
        i += e[s];
        const t = this.parts[s];
        if (void 0 !== t) {
          const e = t.value;
          if (
            null != e &&
            (Array.isArray(e) || ("string" != typeof e && e[Symbol.iterator]))
          )
            for (const t of e) i += "string" == typeof t ? t : String(t);
          else i += "string" == typeof e ? e : String(e);
        }
      }
      return (i += e[t]);
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1),
        this.element.setAttribute(this.name, this._getValue()));
    }
  }
  class w {
    constructor(e) {
      (this.value = void 0), (this.committer = e);
    }
    setValue(e) {
      e === a ||
        (f(e) && e === this.value) ||
        ((this.value = e), t(e) || (this.committer.dirty = !0));
    }
    commit() {
      for (; t(this.value); ) {
        const e = this.value;
        (this.value = a), e(this);
      }
      this.value !== a && this.committer.commit();
    }
  }
  class b {
    constructor(e) {
      (this.value = void 0), (this._pendingValue = void 0), (this.options = e);
    }
    appendInto(e) {
      (this.startNode = e.appendChild(h())),
        (this.endNode = e.appendChild(h()));
    }
    insertAfterNode(e) {
      (this.startNode = e), (this.endNode = e.nextSibling);
    }
    appendIntoPart(e) {
      e._insert((this.startNode = h())), e._insert((this.endNode = h()));
    }
    insertAfterPart(e) {
      e._insert((this.startNode = h())),
        (this.endNode = e.endNode),
        (e.endNode = this.startNode);
    }
    setValue(e) {
      this._pendingValue = e;
    }
    commit() {
      for (; t(this._pendingValue); ) {
        const e = this._pendingValue;
        (this._pendingValue = a), e(this);
      }
      const e = this._pendingValue;
      e !== a &&
        (f(e)
          ? e !== this.value && this._commitText(e)
          : e instanceof g
          ? this._commitTemplateResult(e)
          : e instanceof Node
          ? this._commitNode(e)
          : Array.isArray(e) || e[Symbol.iterator]
          ? this._commitIterable(e)
          : e === r
          ? ((this.value = r), this.clear())
          : this._commitText(e));
    }
    _insert(e) {
      this.endNode.parentNode.insertBefore(e, this.endNode);
    }
    _commitNode(e) {
      this.value !== e && (this.clear(), this._insert(e), (this.value = e));
    }
    _commitText(e) {
      const t = this.startNode.nextSibling;
      (e = null == e ? "" : e),
        t === this.endNode.previousSibling && 3 === t.nodeType
          ? (t.data = e)
          : this._commitNode(
              document.createTextNode("string" == typeof e ? e : String(e))
            ),
        (this.value = e);
    }
    _commitTemplateResult(e) {
      const t = this.options.templateFactory(e);
      if (this.value instanceof m && this.value.template === t)
        this.value.update(e.values);
      else {
        const i = new m(t, e.processor, this.options),
          s = i._clone();
        i.update(e.values), this._commitNode(s), (this.value = i);
      }
    }
    _commitIterable(e) {
      Array.isArray(this.value) || ((this.value = []), this.clear());
      const t = this.value;
      let i,
        s = 0;
      for (const a of e)
        void 0 === (i = t[s]) &&
          ((i = new b(this.options)),
          t.push(i),
          0 === s ? i.appendIntoPart(this) : i.insertAfterPart(t[s - 1])),
          i.setValue(a),
          i.commit(),
          s++;
      s < t.length && ((t.length = s), this.clear(i && i.endNode));
    }
    clear(e = this.startNode) {
      s(this.startNode.parentNode, e.nextSibling, this.endNode);
    }
  }
  class y {
    constructor(e, t, i) {
      if (
        ((this.value = void 0),
        (this._pendingValue = void 0),
        2 !== i.length || "" !== i[0] || "" !== i[1])
      )
        throw new Error(
          "Boolean attributes can only contain a single expression"
        );
      (this.element = e), (this.name = t), (this.strings = i);
    }
    setValue(e) {
      this._pendingValue = e;
    }
    commit() {
      for (; t(this._pendingValue); ) {
        const e = this._pendingValue;
        (this._pendingValue = a), e(this);
      }
      if (this._pendingValue === a) return;
      const e = !!this._pendingValue;
      this.value !== e &&
        (e
          ? this.element.setAttribute(this.name, "")
          : this.element.removeAttribute(this.name)),
        (this.value = e),
        (this._pendingValue = a);
    }
  }
  class x extends v {
    constructor(e, t, i) {
      super(e, t, i),
        (this.single = 2 === i.length && "" === i[0] && "" === i[1]);
    }
    _createPart() {
      return new C(this);
    }
    _getValue() {
      return this.single ? this.parts[0].value : super._getValue();
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1), (this.element[this.name] = this._getValue()));
    }
  }
  class C extends w {}
  let E = !1;
  try {
    const e = {
      get capture() {
        return (E = !0), !1;
      },
    };
    window.addEventListener("test", e, e),
      window.removeEventListener("test", e, e);
  } catch (e) {}
  class S {
    constructor(e, t, i) {
      (this.value = void 0),
        (this._pendingValue = void 0),
        (this.element = e),
        (this.eventName = t),
        (this.eventContext = i),
        (this._boundHandleEvent = (e) => this.handleEvent(e));
    }
    setValue(e) {
      this._pendingValue = e;
    }
    commit() {
      for (; t(this._pendingValue); ) {
        const e = this._pendingValue;
        (this._pendingValue = a), e(this);
      }
      if (this._pendingValue === a) return;
      const e = this._pendingValue,
        i = this.value,
        s =
          null == e ||
          (null != i &&
            (e.capture !== i.capture ||
              e.once !== i.once ||
              e.passive !== i.passive)),
        r = null != e && (null == i || s);
      s &&
        this.element.removeEventListener(
          this.eventName,
          this._boundHandleEvent,
          this._options
        ),
        r &&
          ((this._options = T(e)),
          this.element.addEventListener(
            this.eventName,
            this._boundHandleEvent,
            this._options
          )),
        (this.value = e),
        (this._pendingValue = a);
    }
    handleEvent(e) {
      "function" == typeof this.value
        ? this.value.call(this.eventContext || this.element, e)
        : this.value.handleEvent(e);
    }
  }
  const T = (e) =>
    e &&
    (E ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
  const k = new (class {
    handleAttributeExpressions(e, t, i, s) {
      const a = t[0];
      return "." === a
        ? new x(e, t.slice(1), i).parts
        : "@" === a
        ? [new S(e, t.slice(1), s.eventContext)]
        : "?" === a
        ? [new y(e, t.slice(1), i)]
        : new v(e, t, i).parts;
    }
    handleTextExpression(e) {
      return new b(e);
    }
  })();
  function $(e) {
    let t = M.get(e.type);
    void 0 === t &&
      ((t = { stringsArray: new WeakMap(), keyString: new Map() }),
      M.set(e.type, t));
    let i = t.stringsArray.get(e.strings);
    if (void 0 !== i) return i;
    const s = e.strings.join(n);
    return (
      void 0 === (i = t.keyString.get(s)) &&
        ((i = new p(e, e.getTemplateElement())), t.keyString.set(s, i)),
      t.stringsArray.set(e.strings, i),
      i
    );
  }
  const M = new Map(),
    P = new WeakMap();
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");
  const D = (e, ...t) => new g(e, t, "html", k),
    z = 133;
  function L(e, t) {
    const {
        element: { content: i },
        parts: s,
      } = e,
      a = document.createTreeWalker(i, z, null, !1);
    let r = A(s),
      n = s[r],
      o = -1,
      l = 0;
    const d = [];
    let p = null;
    for (; a.nextNode(); ) {
      o++;
      const e = a.currentNode;
      for (
        e.previousSibling === p && (p = null),
          t.has(e) && (d.push(e), null === p && (p = e)),
          null !== p && l++;
        void 0 !== n && n.index === o;

      )
        (n.index = null !== p ? -1 : n.index - l), (n = s[(r = A(s, r))]);
    }
    d.forEach((e) => e.parentNode.removeChild(e));
  }
  const _ = (e) => {
      let t = 11 === e.nodeType ? 0 : 1;
      const i = document.createTreeWalker(e, z, null, !1);
      for (; i.nextNode(); ) t++;
      return t;
    },
    A = (e, t = -1) => {
      for (let i = t + 1; i < e.length; i++) {
        const t = e[i];
        if (c(t)) return i;
      }
      return -1;
    };
  const I = (e, t) => `${e}--${t}`;
  let N = !0;
  void 0 === window.ShadyCSS
    ? (N = !1)
    : void 0 === window.ShadyCSS.prepareTemplateDom &&
      (console.warn(
        "Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."
      ),
      (N = !1));
  const O = (e) => (t) => {
      const i = I(t.type, e);
      let s = M.get(i);
      void 0 === s &&
        ((s = { stringsArray: new WeakMap(), keyString: new Map() }),
        M.set(i, s));
      let a = s.stringsArray.get(t.strings);
      if (void 0 !== a) return a;
      const r = t.strings.join(n);
      if (void 0 === (a = s.keyString.get(r))) {
        const i = t.getTemplateElement();
        N && window.ShadyCSS.prepareTemplateDom(i, e),
          (a = new p(t, i)),
          s.keyString.set(r, a);
      }
      return s.stringsArray.set(t.strings, a), a;
    },
    F = ["html", "svg"],
    H = new Set(),
    V = (e, t, i) => {
      H.add(i);
      const s = e.querySelectorAll("style");
      if (0 === s.length)
        return void window.ShadyCSS.prepareTemplateStyles(t.element, i);
      const a = document.createElement("style");
      for (let e = 0; e < s.length; e++) {
        const t = s[e];
        t.parentNode.removeChild(t), (a.textContent += t.textContent);
      }
      if (
        (((e) => {
          F.forEach((t) => {
            const i = M.get(I(t, e));
            void 0 !== i &&
              i.keyString.forEach((e) => {
                const {
                    element: { content: t },
                  } = e,
                  i = new Set();
                Array.from(t.querySelectorAll("style")).forEach((e) => {
                  i.add(e);
                }),
                  L(e, i);
              });
          });
        })(i),
        (function (e, t, i = null) {
          const {
            element: { content: s },
            parts: a,
          } = e;
          if (null == i) return void s.appendChild(t);
          const r = document.createTreeWalker(s, z, null, !1);
          let n = A(a),
            o = 0,
            l = -1;
          for (; r.nextNode(); )
            for (
              l++,
                r.currentNode === i &&
                  ((o = _(t)), i.parentNode.insertBefore(t, i));
              -1 !== n && a[n].index === l;

            ) {
              if (o > 0) {
                for (; -1 !== n; ) (a[n].index += o), (n = A(a, n));
                return;
              }
              n = A(a, n);
            }
        })(t, a, t.element.content.firstChild),
        window.ShadyCSS.prepareTemplateStyles(t.element, i),
        window.ShadyCSS.nativeShadow)
      ) {
        const i = t.element.content.querySelector("style");
        e.insertBefore(i.cloneNode(!0), e.firstChild);
      } else {
        t.element.content.insertBefore(a, t.element.content.firstChild);
        const e = new Set();
        e.add(a), L(t, e);
      }
    };
  window.JSCompiler_renameProperty = (e, t) => e;
  const Y = {
      toAttribute(e, t) {
        switch (t) {
          case Boolean:
            return e ? "" : null;
          case Object:
          case Array:
            return null == e ? e : JSON.stringify(e);
        }
        return e;
      },
      fromAttribute(e, t) {
        switch (t) {
          case Boolean:
            return null !== e;
          case Number:
            return null === e ? null : Number(e);
          case Object:
          case Array:
            return JSON.parse(e);
        }
        return e;
      },
    },
    B = (e, t) => t !== e && (t == t || e == e),
    G = {
      attribute: !0,
      type: String,
      converter: Y,
      reflect: !1,
      hasChanged: B,
    },
    R = Promise.resolve(!0),
    X = 1,
    q = 4,
    j = 8,
    W = 16,
    U = 32;
  class K extends HTMLElement {
    constructor() {
      super(),
        (this._updateState = 0),
        (this._instanceProperties = void 0),
        (this._updatePromise = R),
        (this._hasConnectedResolver = void 0),
        (this._changedProperties = new Map()),
        (this._reflectingProperties = void 0),
        this.initialize();
    }
    static get observedAttributes() {
      this.finalize();
      const e = [];
      return (
        this._classProperties.forEach((t, i) => {
          const s = this._attributeNameForProperty(i, t);
          void 0 !== s && (this._attributeToPropertyMap.set(s, i), e.push(s));
        }),
        e
      );
    }
    static _ensureClassProperties() {
      if (
        !this.hasOwnProperty(
          JSCompiler_renameProperty("_classProperties", this)
        )
      ) {
        this._classProperties = new Map();
        const e = Object.getPrototypeOf(this)._classProperties;
        void 0 !== e && e.forEach((e, t) => this._classProperties.set(t, e));
      }
    }
    static createProperty(e, t = G) {
      if (
        (this._ensureClassProperties(),
        this._classProperties.set(e, t),
        t.noAccessor || this.prototype.hasOwnProperty(e))
      )
        return;
      const i = "symbol" == typeof e ? Symbol() : `__${e}`;
      Object.defineProperty(this.prototype, e, {
        get() {
          return this[i];
        },
        set(t) {
          const s = this[e];
          (this[i] = t), this._requestUpdate(e, s);
        },
        configurable: !0,
        enumerable: !0,
      });
    }
    static finalize() {
      if (
        this.hasOwnProperty(JSCompiler_renameProperty("finalized", this)) &&
        this.finalized
      )
        return;
      const e = Object.getPrototypeOf(this);
      if (
        ("function" == typeof e.finalize && e.finalize(),
        (this.finalized = !0),
        this._ensureClassProperties(),
        (this._attributeToPropertyMap = new Map()),
        this.hasOwnProperty(JSCompiler_renameProperty("properties", this)))
      ) {
        const e = this.properties,
          t = [
            ...Object.getOwnPropertyNames(e),
            ...("function" == typeof Object.getOwnPropertySymbols
              ? Object.getOwnPropertySymbols(e)
              : []),
          ];
        for (const i of t) this.createProperty(i, e[i]);
      }
    }
    static _attributeNameForProperty(e, t) {
      const i = t.attribute;
      return !1 === i
        ? void 0
        : "string" == typeof i
        ? i
        : "string" == typeof e
        ? e.toLowerCase()
        : void 0;
    }
    static _valueHasChanged(e, t, i = B) {
      return i(e, t);
    }
    static _propertyValueFromAttribute(e, t) {
      const i = t.type,
        s = t.converter || Y,
        a = "function" == typeof s ? s : s.fromAttribute;
      return a ? a(e, i) : e;
    }
    static _propertyValueToAttribute(e, t) {
      if (void 0 === t.reflect) return;
      const i = t.type,
        s = t.converter;
      return ((s && s.toAttribute) || Y.toAttribute)(e, i);
    }
    initialize() {
      this._saveInstanceProperties(), this._requestUpdate();
    }
    _saveInstanceProperties() {
      this.constructor._classProperties.forEach((e, t) => {
        if (this.hasOwnProperty(t)) {
          const e = this[t];
          delete this[t],
            this._instanceProperties || (this._instanceProperties = new Map()),
            this._instanceProperties.set(t, e);
        }
      });
    }
    _applyInstanceProperties() {
      this._instanceProperties.forEach((e, t) => (this[t] = e)),
        (this._instanceProperties = void 0);
    }
    connectedCallback() {
      (this._updateState = this._updateState | U),
        this._hasConnectedResolver &&
          (this._hasConnectedResolver(), (this._hasConnectedResolver = void 0));
    }
    disconnectedCallback() {}
    attributeChangedCallback(e, t, i) {
      t !== i && this._attributeToProperty(e, i);
    }
    _propertyToAttribute(e, t, i = G) {
      const s = this.constructor,
        a = s._attributeNameForProperty(e, i);
      if (void 0 !== a) {
        const e = s._propertyValueToAttribute(t, i);
        if (void 0 === e) return;
        (this._updateState = this._updateState | j),
          null == e ? this.removeAttribute(a) : this.setAttribute(a, e),
          (this._updateState = this._updateState & ~j);
      }
    }
    _attributeToProperty(e, t) {
      if (this._updateState & j) return;
      const i = this.constructor,
        s = i._attributeToPropertyMap.get(e);
      if (void 0 !== s) {
        const e = i._classProperties.get(s) || G;
        (this._updateState = this._updateState | W),
          (this[s] = i._propertyValueFromAttribute(t, e)),
          (this._updateState = this._updateState & ~W);
      }
    }
    _requestUpdate(e, t) {
      let i = !0;
      if (void 0 !== e) {
        const s = this.constructor,
          a = s._classProperties.get(e) || G;
        s._valueHasChanged(this[e], t, a.hasChanged)
          ? (this._changedProperties.has(e) ||
              this._changedProperties.set(e, t),
            !0 !== a.reflect ||
              this._updateState & W ||
              (void 0 === this._reflectingProperties &&
                (this._reflectingProperties = new Map()),
              this._reflectingProperties.set(e, a)))
          : (i = !1);
      }
      !this._hasRequestedUpdate && i && this._enqueueUpdate();
    }
    requestUpdate(e, t) {
      return this._requestUpdate(e, t), this.updateComplete;
    }
    async _enqueueUpdate() {
      let e, t;
      this._updateState = this._updateState | q;
      const i = this._updatePromise;
      this._updatePromise = new Promise((i, s) => {
        (e = i), (t = s);
      });
      try {
        await i;
      } catch (e) {}
      this._hasConnected ||
        (await new Promise((e) => (this._hasConnectedResolver = e)));
      try {
        const e = this.performUpdate();
        null != e && (await e);
      } catch (e) {
        t(e);
      }
      e(!this._hasRequestedUpdate);
    }
    get _hasConnected() {
      return this._updateState & U;
    }
    get _hasRequestedUpdate() {
      return this._updateState & q;
    }
    get hasUpdated() {
      return this._updateState & X;
    }
    performUpdate() {
      this._instanceProperties && this._applyInstanceProperties();
      let e = !1;
      const t = this._changedProperties;
      try {
        (e = this.shouldUpdate(t)) && this.update(t);
      } catch (t) {
        throw ((e = !1), t);
      } finally {
        this._markUpdated();
      }
      e &&
        (this._updateState & X ||
          ((this._updateState = this._updateState | X), this.firstUpdated(t)),
        this.updated(t));
    }
    _markUpdated() {
      (this._changedProperties = new Map()),
        (this._updateState = this._updateState & ~q);
    }
    get updateComplete() {
      return this._updatePromise;
    }
    shouldUpdate(e) {
      return !0;
    }
    update(e) {
      void 0 !== this._reflectingProperties &&
        this._reflectingProperties.size > 0 &&
        (this._reflectingProperties.forEach((e, t) =>
          this._propertyToAttribute(t, this[t], e)
        ),
        (this._reflectingProperties = void 0));
    }
    updated(e) {}
    firstUpdated(e) {}
  }
  K.finalized = !0;
  const J =
      "adoptedStyleSheets" in Document.prototype &&
      "replace" in CSSStyleSheet.prototype,
    Z = Symbol();
  class Q {
    constructor(e, t) {
      if (t !== Z)
        throw new Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
        );
      this.cssText = e;
    }
    get styleSheet() {
      return (
        void 0 === this._styleSheet &&
          (J
            ? ((this._styleSheet = new CSSStyleSheet()),
              this._styleSheet.replaceSync(this.cssText))
            : (this._styleSheet = null)),
        this._styleSheet
      );
    }
    toString() {
      return this.cssText;
    }
  }
  const ee = (e) => new Q(String(e), Z),
    te = (e, ...t) => {
      const i = t.reduce(
        (t, i, s) =>
          t +
          ((e) => {
            if (e instanceof Q) return e.cssText;
            throw new Error(
              `Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`
            );
          })(i) +
          e[s + 1],
        e[0]
      );
      return new Q(i, Z);
    };
  (window.litElementVersions || (window.litElementVersions = [])).push("2.0.1");
  const ie = (e) =>
    e.flat
      ? e.flat(1 / 0)
      : (function e(t, i = []) {
          for (let s = 0, a = t.length; s < a; s++) {
            const a = t[s];
            Array.isArray(a) ? e(a, i) : i.push(a);
          }
          return i;
        })(e);
  class se extends K {
    static finalize() {
      super.finalize(),
        (this._styles = this.hasOwnProperty(
          JSCompiler_renameProperty("styles", this)
        )
          ? this._getUniqueStyles()
          : this._styles || []);
    }
    static _getUniqueStyles() {
      const e = this.styles,
        t = [];
      if (Array.isArray(e)) {
        ie(e)
          .reduceRight((e, t) => (e.add(t), e), new Set())
          .forEach((e) => t.unshift(e));
      } else e && t.push(e);
      return t;
    }
    initialize() {
      super.initialize(),
        (this.renderRoot = this.createRenderRoot()),
        window.ShadowRoot &&
          this.renderRoot instanceof window.ShadowRoot &&
          this.adoptStyles();
    }
    createRenderRoot() {
      return this.attachShadow({ mode: "open" });
    }
    adoptStyles() {
      const e = this.constructor._styles;
      0 !== e.length &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
          ? J
            ? (this.renderRoot.adoptedStyleSheets = e.map((e) => e.styleSheet))
            : (this._needsShimAdoptedStyleSheets = !0)
          : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
              e.map((e) => e.cssText),
              this.localName
            ));
    }
    connectedCallback() {
      super.connectedCallback(),
        this.hasUpdated &&
          void 0 !== window.ShadyCSS &&
          window.ShadyCSS.styleElement(this);
    }
    update(e) {
      super.update(e);
      const t = this.render();
      t instanceof g &&
        this.constructor.render(t, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this,
        }),
        this._needsShimAdoptedStyleSheets &&
          ((this._needsShimAdoptedStyleSheets = !1),
          this.constructor._styles.forEach((e) => {
            const t = document.createElement("style");
            (t.textContent = e.cssText), this.renderRoot.appendChild(t);
          }));
    }
    render() {}
  }
  (se.finalized = !0),
    (se.render = (e, t, i) => {
      const a = i.scopeName,
        r = P.has(t),
        n = t instanceof ShadowRoot && N && e instanceof g,
        o = n && !H.has(a),
        l = o ? document.createDocumentFragment() : t;
      if (
        (((e, t, i) => {
          let a = P.get(t);
          void 0 === a &&
            (s(t, t.firstChild),
            P.set(t, (a = new b(Object.assign({ templateFactory: $ }, i)))),
            a.appendInto(t)),
            a.setValue(e),
            a.commit();
        })(e, l, Object.assign({ templateFactory: O(a) }, i)),
        o)
      ) {
        const e = P.get(l);
        P.delete(l),
          e.value instanceof m && V(l, e.value.template, a),
          s(t, t.firstChild),
          t.appendChild(l),
          P.set(t, e);
      }
      !r && n && window.ShadyCSS.styleElement(t.host);
    });
  var ae =
      "undefined" == typeof document
        ? {
            body: {},
            addEventListener: function () {},
            removeEventListener: function () {},
            activeElement: { blur: function () {}, nodeName: "" },
            querySelector: function () {
              return null;
            },
            querySelectorAll: function () {
              return [];
            },
            getElementById: function () {
              return null;
            },
            createEvent: function () {
              return { initEvent: function () {} };
            },
            createElement: function () {
              return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute: function () {},
                getElementsByTagName: function () {
                  return [];
                },
              };
            },
            location: { hash: "" },
          }
        : document,
    re =
      "undefined" == typeof window
        ? {
            document: ae,
            navigator: { userAgent: "" },
            location: {},
            history: {},
            CustomEvent: function () {
              return this;
            },
            addEventListener: function () {},
            removeEventListener: function () {},
            getComputedStyle: function () {
              return {
                getPropertyValue: function () {
                  return "";
                },
              };
            },
            Image: function () {},
            Date: function () {},
            screen: {},
            setTimeout: function () {},
            clearTimeout: function () {},
          }
        : window;
  class ne {
    constructor(e) {
      const t = this;
      for (let i = 0; i < e.length; i += 1) t[i] = e[i];
      return (t.length = e.length), this;
    }
  }
  function oe(e, t) {
    const i = [];
    let s = 0;
    if (e && !t && e instanceof ne) return e;
    if (e)
      if ("string" == typeof e) {
        let a, r;
        const n = e.trim();
        if (n.indexOf("<") >= 0 && n.indexOf(">") >= 0) {
          let e = "div";
          for (
            0 === n.indexOf("<li") && (e = "ul"),
              0 === n.indexOf("<tr") && (e = "tbody"),
              (0 !== n.indexOf("<td") && 0 !== n.indexOf("<th")) || (e = "tr"),
              0 === n.indexOf("<tbody") && (e = "table"),
              0 === n.indexOf("<option") && (e = "select"),
              (r = ae.createElement(e)).innerHTML = n,
              s = 0;
            s < r.childNodes.length;
            s += 1
          )
            i.push(r.childNodes[s]);
        } else
          for (
            a =
              t || "#" !== e[0] || e.match(/[ .<>:~]/)
                ? (t || ae).querySelectorAll(e.trim())
                : [ae.getElementById(e.trim().split("#")[1])],
              s = 0;
            s < a.length;
            s += 1
          )
            a[s] && i.push(a[s]);
      } else if (e.nodeType || e === re || e === ae) i.push(e);
      else if (e.length > 0 && e[0].nodeType)
        for (s = 0; s < e.length; s += 1) i.push(e[s]);
    return new ne(i);
  }
  function le(e) {
    const t = [];
    for (let i = 0; i < e.length; i += 1)
      -1 === t.indexOf(e[i]) && t.push(e[i]);
    return t;
  }
  (oe.fn = ne.prototype), (oe.Class = ne), (oe.Dom7 = ne);
  const de = {
    addClass: function (e) {
      if (void 0 === e) return this;
      const t = e.split(" ");
      for (let e = 0; e < t.length; e += 1)
        for (let i = 0; i < this.length; i += 1)
          void 0 !== this[i] &&
            void 0 !== this[i].classList &&
            this[i].classList.add(t[e]);
      return this;
    },
    removeClass: function (e) {
      const t = e.split(" ");
      for (let e = 0; e < t.length; e += 1)
        for (let i = 0; i < this.length; i += 1)
          void 0 !== this[i] &&
            void 0 !== this[i].classList &&
            this[i].classList.remove(t[e]);
      return this;
    },
    hasClass: function (e) {
      return !!this[0] && this[0].classList.contains(e);
    },
    toggleClass: function (e) {
      const t = e.split(" ");
      for (let e = 0; e < t.length; e += 1)
        for (let i = 0; i < this.length; i += 1)
          void 0 !== this[i] &&
            void 0 !== this[i].classList &&
            this[i].classList.toggle(t[e]);
      return this;
    },
    attr: function (e, t) {
      if (1 === arguments.length && "string" == typeof e)
        return this[0] ? this[0].getAttribute(e) : void 0;
      for (let i = 0; i < this.length; i += 1)
        if (2 === arguments.length) this[i].setAttribute(e, t);
        else
          for (const t in e) (this[i][t] = e[t]), this[i].setAttribute(t, e[t]);
      return this;
    },
    removeAttr: function (e) {
      for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
      return this;
    },
    data: function (e, t) {
      let i;
      if (void 0 !== t) {
        for (let s = 0; s < this.length; s += 1)
          (i = this[s]).dom7ElementDataStorage ||
            (i.dom7ElementDataStorage = {}),
            (i.dom7ElementDataStorage[e] = t);
        return this;
      }
      if ((i = this[0])) {
        if (i.dom7ElementDataStorage && e in i.dom7ElementDataStorage)
          return i.dom7ElementDataStorage[e];
        const t = i.getAttribute(`data-${e}`);
        return t || void 0;
      }
    },
    transform: function (e) {
      for (let t = 0; t < this.length; t += 1) {
        const i = this[t].style;
        (i.webkitTransform = e), (i.transform = e);
      }
      return this;
    },
    transition: function (e) {
      "string" != typeof e && (e = `${e}ms`);
      for (let t = 0; t < this.length; t += 1) {
        const i = this[t].style;
        (i.webkitTransitionDuration = e), (i.transitionDuration = e);
      }
      return this;
    },
    on: function (...e) {
      let [t, i, s, a] = e;
      function r(e) {
        const t = e.target;
        if (!t) return;
        const a = e.target.dom7EventData || [];
        if ((a.indexOf(e) < 0 && a.unshift(e), oe(t).is(i))) s.apply(t, a);
        else {
          const e = oe(t).parents();
          for (let t = 0; t < e.length; t += 1)
            oe(e[t]).is(i) && s.apply(e[t], a);
        }
      }
      function n(e) {
        const t = (e && e.target && e.target.dom7EventData) || [];
        t.indexOf(e) < 0 && t.unshift(e), s.apply(this, t);
      }
      "function" == typeof e[1] && (([t, s, a] = e), (i = void 0)),
        a || (a = !1);
      const o = t.split(" ");
      let l;
      for (let e = 0; e < this.length; e += 1) {
        const t = this[e];
        if (i)
          for (l = 0; l < o.length; l += 1) {
            const e = o[l];
            t.dom7LiveListeners || (t.dom7LiveListeners = {}),
              t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []),
              t.dom7LiveListeners[e].push({ listener: s, proxyListener: r }),
              t.addEventListener(e, r, a);
          }
        else
          for (l = 0; l < o.length; l += 1) {
            const e = o[l];
            t.dom7Listeners || (t.dom7Listeners = {}),
              t.dom7Listeners[e] || (t.dom7Listeners[e] = []),
              t.dom7Listeners[e].push({ listener: s, proxyListener: n }),
              t.addEventListener(e, n, a);
          }
      }
      return this;
    },
    off: function (...e) {
      let [t, i, s, a] = e;
      "function" == typeof e[1] && (([t, s, a] = e), (i = void 0)),
        a || (a = !1);
      const r = t.split(" ");
      for (let e = 0; e < r.length; e += 1) {
        const t = r[e];
        for (let e = 0; e < this.length; e += 1) {
          const r = this[e];
          let n;
          if (
            (!i && r.dom7Listeners
              ? (n = r.dom7Listeners[t])
              : i && r.dom7LiveListeners && (n = r.dom7LiveListeners[t]),
            n && n.length)
          )
            for (let e = n.length - 1; e >= 0; e -= 1) {
              const i = n[e];
              s && i.listener === s
                ? (r.removeEventListener(t, i.proxyListener, a), n.splice(e, 1))
                : s &&
                  i.listener &&
                  i.listener.dom7proxy &&
                  i.listener.dom7proxy === s
                ? (r.removeEventListener(t, i.proxyListener, a), n.splice(e, 1))
                : s ||
                  (r.removeEventListener(t, i.proxyListener, a),
                  n.splice(e, 1));
            }
        }
      }
      return this;
    },
    trigger: function (...e) {
      const t = e[0].split(" "),
        i = e[1];
      for (let s = 0; s < t.length; s += 1) {
        const a = t[s];
        for (let t = 0; t < this.length; t += 1) {
          const s = this[t];
          let r;
          try {
            r = new re.CustomEvent(a, {
              detail: i,
              bubbles: !0,
              cancelable: !0,
            });
          } catch (e) {
            (r = ae.createEvent("Event")).initEvent(a, !0, !0), (r.detail = i);
          }
          (s.dom7EventData = e.filter((e, t) => t > 0)),
            s.dispatchEvent(r),
            (s.dom7EventData = []),
            delete s.dom7EventData;
        }
      }
      return this;
    },
    transitionEnd: function (e) {
      const t = ["webkitTransitionEnd", "transitionend"],
        i = this;
      let s;
      function a(r) {
        if (r.target === this)
          for (e.call(this, r), s = 0; s < t.length; s += 1) i.off(t[s], a);
      }
      if (e) for (s = 0; s < t.length; s += 1) i.on(t[s], a);
      return this;
    },
    outerWidth: function (e) {
      if (this.length > 0) {
        if (e) {
          const e = this.styles();
          return (
            this[0].offsetWidth +
            parseFloat(e.getPropertyValue("margin-right")) +
            parseFloat(e.getPropertyValue("margin-left"))
          );
        }
        return this[0].offsetWidth;
      }
      return null;
    },
    outerHeight: function (e) {
      if (this.length > 0) {
        if (e) {
          const e = this.styles();
          return (
            this[0].offsetHeight +
            parseFloat(e.getPropertyValue("margin-top")) +
            parseFloat(e.getPropertyValue("margin-bottom"))
          );
        }
        return this[0].offsetHeight;
      }
      return null;
    },
    offset: function () {
      if (this.length > 0) {
        const e = this[0],
          t = e.getBoundingClientRect(),
          i = ae.body,
          s = e.clientTop || i.clientTop || 0,
          a = e.clientLeft || i.clientLeft || 0,
          r = e === re ? re.scrollY : e.scrollTop,
          n = e === re ? re.scrollX : e.scrollLeft;
        return { top: t.top + r - s, left: t.left + n - a };
      }
      return null;
    },
    css: function (e, t) {
      let i;
      if (1 === arguments.length) {
        if ("string" != typeof e) {
          for (i = 0; i < this.length; i += 1)
            for (let t in e) this[i].style[t] = e[t];
          return this;
        }
        if (this[0])
          return re.getComputedStyle(this[0], null).getPropertyValue(e);
      }
      if (2 === arguments.length && "string" == typeof e) {
        for (i = 0; i < this.length; i += 1) this[i].style[e] = t;
        return this;
      }
      return this;
    },
    each: function (e) {
      if (!e) return this;
      for (let t = 0; t < this.length; t += 1)
        if (!1 === e.call(this[t], t, this[t])) return this;
      return this;
    },
    html: function (e) {
      if (void 0 === e) return this[0] ? this[0].innerHTML : void 0;
      for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
      return this;
    },
    text: function (e) {
      if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
      for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
      return this;
    },
    is: function (e) {
      const t = this[0];
      let i, s;
      if (!t || void 0 === e) return !1;
      if ("string" == typeof e) {
        if (t.matches) return t.matches(e);
        if (t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
        if (t.msMatchesSelector) return t.msMatchesSelector(e);
        for (i = oe(e), s = 0; s < i.length; s += 1) if (i[s] === t) return !0;
        return !1;
      }
      if (e === ae) return t === ae;
      if (e === re) return t === re;
      if (e.nodeType || e instanceof ne) {
        for (i = e.nodeType ? [e] : e, s = 0; s < i.length; s += 1)
          if (i[s] === t) return !0;
        return !1;
      }
      return !1;
    },
    index: function () {
      let e,
        t = this[0];
      if (t) {
        for (e = 0; null !== (t = t.previousSibling); )
          1 === t.nodeType && (e += 1);
        return e;
      }
    },
    eq: function (e) {
      if (void 0 === e) return this;
      const t = this.length;
      let i;
      return new ne(
        e > t - 1 ? [] : e < 0 ? ((i = t + e) < 0 ? [] : [this[i]]) : [this[e]]
      );
    },
    append: function (...e) {
      let t;
      for (let i = 0; i < e.length; i += 1) {
        t = e[i];
        for (let e = 0; e < this.length; e += 1)
          if ("string" == typeof t) {
            const i = ae.createElement("div");
            for (i.innerHTML = t; i.firstChild; )
              this[e].appendChild(i.firstChild);
          } else if (t instanceof ne)
            for (let i = 0; i < t.length; i += 1) this[e].appendChild(t[i]);
          else this[e].appendChild(t);
      }
      return this;
    },
    prepend: function (e) {
      let t, i;
      for (t = 0; t < this.length; t += 1)
        if ("string" == typeof e) {
          const s = ae.createElement("div");
          for (s.innerHTML = e, i = s.childNodes.length - 1; i >= 0; i -= 1)
            this[t].insertBefore(s.childNodes[i], this[t].childNodes[0]);
        } else if (e instanceof ne)
          for (i = 0; i < e.length; i += 1)
            this[t].insertBefore(e[i], this[t].childNodes[0]);
        else this[t].insertBefore(e, this[t].childNodes[0]);
      return this;
    },
    next: function (e) {
      return this.length > 0
        ? e
          ? this[0].nextElementSibling && oe(this[0].nextElementSibling).is(e)
            ? new ne([this[0].nextElementSibling])
            : new ne([])
          : this[0].nextElementSibling
          ? new ne([this[0].nextElementSibling])
          : new ne([])
        : new ne([]);
    },
    nextAll: function (e) {
      const t = [];
      let i = this[0];
      if (!i) return new ne([]);
      for (; i.nextElementSibling; ) {
        const s = i.nextElementSibling;
        e ? oe(s).is(e) && t.push(s) : t.push(s), (i = s);
      }
      return new ne(t);
    },
    prev: function (e) {
      if (this.length > 0) {
        const t = this[0];
        return e
          ? t.previousElementSibling && oe(t.previousElementSibling).is(e)
            ? new ne([t.previousElementSibling])
            : new ne([])
          : t.previousElementSibling
          ? new ne([t.previousElementSibling])
          : new ne([]);
      }
      return new ne([]);
    },
    prevAll: function (e) {
      const t = [];
      let i = this[0];
      if (!i) return new ne([]);
      for (; i.previousElementSibling; ) {
        const s = i.previousElementSibling;
        e ? oe(s).is(e) && t.push(s) : t.push(s), (i = s);
      }
      return new ne(t);
    },
    parent: function (e) {
      const t = [];
      for (let i = 0; i < this.length; i += 1)
        null !== this[i].parentNode &&
          (e
            ? oe(this[i].parentNode).is(e) && t.push(this[i].parentNode)
            : t.push(this[i].parentNode));
      return oe(le(t));
    },
    parents: function (e) {
      const t = [];
      for (let i = 0; i < this.length; i += 1) {
        let s = this[i].parentNode;
        for (; s; )
          e ? oe(s).is(e) && t.push(s) : t.push(s), (s = s.parentNode);
      }
      return oe(le(t));
    },
    closest: function (e) {
      let t = this;
      return void 0 === e
        ? new ne([])
        : (t.is(e) || (t = t.parents(e).eq(0)), t);
    },
    find: function (e) {
      const t = [];
      for (let i = 0; i < this.length; i += 1) {
        const s = this[i].querySelectorAll(e);
        for (let e = 0; e < s.length; e += 1) t.push(s[e]);
      }
      return new ne(t);
    },
    children: function (e) {
      const t = [];
      for (let i = 0; i < this.length; i += 1) {
        const s = this[i].childNodes;
        for (let i = 0; i < s.length; i += 1)
          e
            ? 1 === s[i].nodeType && oe(s[i]).is(e) && t.push(s[i])
            : 1 === s[i].nodeType && t.push(s[i]);
      }
      return new ne(le(t));
    },
    remove: function () {
      for (let e = 0; e < this.length; e += 1)
        this[e].parentNode && this[e].parentNode.removeChild(this[e]);
      return this;
    },
    add: function (...e) {
      const t = this;
      let i, s;
      for (i = 0; i < e.length; i += 1) {
        const a = oe(e[i]);
        for (s = 0; s < a.length; s += 1) (t[t.length] = a[s]), (t.length += 1);
      }
      return t;
    },
    styles: function () {
      return this[0] ? re.getComputedStyle(this[0], null) : {};
    },
  };
  Object.keys(de).forEach((e) => {
    oe.fn[e] = de[e];
  });
  const pe = {
      deleteProps(e) {
        const t = e;
        Object.keys(t).forEach((e) => {
          try {
            t[e] = null;
          } catch (e) {}
          try {
            delete t[e];
          } catch (e) {}
        });
      },
      nextTick: (e, t = 0) => setTimeout(e, t),
      now: () => Date.now(),
      getTranslate(e, t = "x") {
        let i, s, a;
        const r = re.getComputedStyle(e, null);
        return (
          re.WebKitCSSMatrix
            ? ((s = r.transform || r.webkitTransform).split(",").length > 6 &&
                (s = s
                  .split(", ")
                  .map((e) => e.replace(",", "."))
                  .join(", ")),
              (a = new re.WebKitCSSMatrix("none" === s ? "" : s)))
            : (i = (a =
                r.MozTransform ||
                r.OTransform ||
                r.MsTransform ||
                r.msTransform ||
                r.transform ||
                r
                  .getPropertyValue("transform")
                  .replace("translate(", "matrix(1, 0, 0, 1,"))
                .toString()
                .split(",")),
          "x" === t &&
            (s = re.WebKitCSSMatrix
              ? a.m41
              : 16 === i.length
              ? parseFloat(i[12])
              : parseFloat(i[4])),
          "y" === t &&
            (s = re.WebKitCSSMatrix
              ? a.m42
              : 16 === i.length
              ? parseFloat(i[13])
              : parseFloat(i[5])),
          s || 0
        );
      },
      parseUrlQuery(e) {
        const t = {};
        let i,
          s,
          a,
          r,
          n = e || re.location.href;
        if ("string" == typeof n && n.length)
          for (
            r = (s = (n = n.indexOf("?") > -1 ? n.replace(/\S*\?/, "") : "")
              .split("&")
              .filter((e) => "" !== e)).length,
              i = 0;
            i < r;
            i += 1
          )
            (a = s[i].replace(/#\S+/g, "").split("=")),
              (t[decodeURIComponent(a[0])] =
                void 0 === a[1] ? void 0 : decodeURIComponent(a[1]) || "");
        return t;
      },
      isObject: (e) =>
        "object" == typeof e &&
        null !== e &&
        e.constructor &&
        e.constructor === Object,
      extend(...e) {
        const t = Object(e[0]);
        for (let i = 1; i < e.length; i += 1) {
          const s = e[i];
          if (null != s) {
            const e = Object.keys(Object(s));
            for (let i = 0, a = e.length; i < a; i += 1) {
              const a = e[i],
                r = Object.getOwnPropertyDescriptor(s, a);
              void 0 !== r &&
                r.enumerable &&
                (pe.isObject(t[a]) && pe.isObject(s[a])
                  ? pe.extend(t[a], s[a])
                  : !pe.isObject(t[a]) && pe.isObject(s[a])
                  ? ((t[a] = {}), pe.extend(t[a], s[a]))
                  : (t[a] = s[a]));
            }
          }
        }
        return t;
      },
    },
    ce = (function () {
      const e = ae.createElement("div");
      return {
        touch:
          (re.Modernizr && !0 === re.Modernizr.touch) ||
          !!(
            re.navigator.maxTouchPoints > 0 ||
            "ontouchstart" in re ||
            (re.DocumentTouch && ae instanceof re.DocumentTouch)
          ),
        pointerEvents: !!(
          re.navigator.pointerEnabled ||
          re.PointerEvent ||
          ("maxTouchPoints" in re.navigator && re.navigator.maxTouchPoints > 0)
        ),
        prefixedPointerEvents: !!re.navigator.msPointerEnabled,
        transition: (function () {
          const t = e.style;
          return (
            "transition" in t || "webkitTransition" in t || "MozTransition" in t
          );
        })(),
        transforms3d:
          (re.Modernizr && !0 === re.Modernizr.csstransforms3d) ||
          (function () {
            const t = e.style;
            return (
              "webkitPerspective" in t ||
              "MozPerspective" in t ||
              "OPerspective" in t ||
              "MsPerspective" in t ||
              "perspective" in t
            );
          })(),
        flexbox: (function () {
          const t = e.style,
            i =
              "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(
                " "
              );
          for (let e = 0; e < i.length; e += 1) if (i[e] in t) return !0;
          return !1;
        })(),
        observer: "MutationObserver" in re || "WebkitMutationObserver" in re,
        passiveListener: (function () {
          let e = !1;
          try {
            const t = Object.defineProperty({}, "passive", {
              get() {
                e = !0;
              },
            });
            re.addEventListener("testPassiveListener", null, t);
          } catch (e) {}
          return e;
        })(),
        gestures: "ongesturestart" in re,
      };
    })(),
    he = (function () {
      return {
        isIE:
          !!re.navigator.userAgent.match(/Trident/g) ||
          !!re.navigator.userAgent.match(/MSIE/g),
        isEdge: !!re.navigator.userAgent.match(/Edge/g),
        isSafari: (function () {
          const e = re.navigator.userAgent.toLowerCase();
          return (
            e.indexOf("safari") >= 0 &&
            e.indexOf("chrome") < 0 &&
            e.indexOf("android") < 0
          );
        })(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
          re.navigator.userAgent
        ),
      };
    })();
  class ue {
    constructor(e = {}) {
      const t = this;
      (t.params = e),
        (t.eventsListeners = {}),
        t.params &&
          t.params.on &&
          Object.keys(t.params.on).forEach((e) => {
            t.on(e, t.params.on[e]);
          });
    }
    on(e, t, i) {
      const s = this;
      if ("function" != typeof t) return s;
      const a = i ? "unshift" : "push";
      return (
        e.split(" ").forEach((e) => {
          s.eventsListeners[e] || (s.eventsListeners[e] = []),
            s.eventsListeners[e][a](t);
        }),
        s
      );
    }
    once(e, t, i) {
      const s = this;
      if ("function" != typeof t) return s;
      function a(...i) {
        t.apply(s, i), s.off(e, a), a.f7proxy && delete a.f7proxy;
      }
      return (a.f7proxy = t), s.on(e, a, i);
    }
    off(e, t) {
      const i = this;
      return i.eventsListeners
        ? (e.split(" ").forEach((e) => {
            void 0 === t
              ? (i.eventsListeners[e] = [])
              : i.eventsListeners[e] &&
                i.eventsListeners[e].length &&
                i.eventsListeners[e].forEach((s, a) => {
                  (s === t || (s.f7proxy && s.f7proxy === t)) &&
                    i.eventsListeners[e].splice(a, 1);
                });
          }),
          i)
        : i;
    }
    emit(...e) {
      const t = this;
      if (!t.eventsListeners) return t;
      let i, s, a;
      return (
        "string" == typeof e[0] || Array.isArray(e[0])
          ? ((i = e[0]), (s = e.slice(1, e.length)), (a = t))
          : ((i = e[0].events), (s = e[0].data), (a = e[0].context || t)),
        (Array.isArray(i) ? i : i.split(" ")).forEach((e) => {
          if (t.eventsListeners && t.eventsListeners[e]) {
            const i = [];
            t.eventsListeners[e].forEach((e) => {
              i.push(e);
            }),
              i.forEach((e) => {
                e.apply(a, s);
              });
          }
        }),
        t
      );
    }
    useModulesParams(e) {
      const t = this;
      t.modules &&
        Object.keys(t.modules).forEach((i) => {
          const s = t.modules[i];
          s.params && pe.extend(e, s.params);
        });
    }
    useModules(e = {}) {
      const t = this;
      t.modules &&
        Object.keys(t.modules).forEach((i) => {
          const s = t.modules[i],
            a = e[i] || {};
          s.instance &&
            Object.keys(s.instance).forEach((e) => {
              const i = s.instance[e];
              t[e] = "function" == typeof i ? i.bind(t) : i;
            }),
            s.on &&
              t.on &&
              Object.keys(s.on).forEach((e) => {
                t.on(e, s.on[e]);
              }),
            s.create && s.create.bind(t)(a);
        });
    }
    static set components(e) {
      this.use && this.use(e);
    }
    static installModule(e, ...t) {
      const i = this;
      i.prototype.modules || (i.prototype.modules = {});
      const s =
        e.name || `${Object.keys(i.prototype.modules).length}_${pe.now()}`;
      return (
        (i.prototype.modules[s] = e),
        e.proto &&
          Object.keys(e.proto).forEach((t) => {
            i.prototype[t] = e.proto[t];
          }),
        e.static &&
          Object.keys(e.static).forEach((t) => {
            i[t] = e.static[t];
          }),
        e.install && e.install.apply(i, t),
        i
      );
    }
    static use(e, ...t) {
      const i = this;
      return Array.isArray(e)
        ? (e.forEach((e) => i.installModule(e)), i)
        : i.installModule(e, ...t);
    }
  }
  var me = {
    updateSize: function () {
      const e = this;
      let t, i;
      const s = e.$el;
      (t = void 0 !== e.params.width ? e.params.width : s[0].clientWidth),
        (i = void 0 !== e.params.height ? e.params.height : s[0].clientHeight),
        (0 === t && e.isHorizontal()) ||
          (0 === i && e.isVertical()) ||
          ((t =
            t -
            parseInt(s.css("padding-left"), 10) -
            parseInt(s.css("padding-right"), 10)),
          (i =
            i -
            parseInt(s.css("padding-top"), 10) -
            parseInt(s.css("padding-bottom"), 10)),
          pe.extend(e, {
            width: t,
            height: i,
            size: e.isHorizontal() ? t : i,
          }));
    },
    updateSlides: function () {
      const e = this,
        t = e.params,
        { $wrapperEl: i, size: s, rtlTranslate: a, wrongRTL: r } = e,
        n = e.virtual && t.virtual.enabled,
        o = n ? e.virtual.slides.length : e.slides.length,
        l = i.children(`.${e.params.slideClass}`),
        d = n ? e.virtual.slides.length : l.length;
      let p = [];
      const c = [],
        h = [];
      let u = t.slidesOffsetBefore;
      "function" == typeof u && (u = t.slidesOffsetBefore.call(e));
      let m = t.slidesOffsetAfter;
      "function" == typeof m && (m = t.slidesOffsetAfter.call(e));
      const g = e.snapGrid.length,
        f = e.snapGrid.length;
      let v,
        w,
        b = t.spaceBetween,
        y = -u,
        x = 0,
        C = 0;
      if (void 0 === s) return;
      "string" == typeof b &&
        b.indexOf("%") >= 0 &&
        (b = (parseFloat(b.replace("%", "")) / 100) * s),
        (e.virtualSize = -b),
        a
          ? l.css({ marginLeft: "", marginTop: "" })
          : l.css({ marginRight: "", marginBottom: "" }),
        t.slidesPerColumn > 1 &&
          ((v =
            Math.floor(d / t.slidesPerColumn) === d / e.params.slidesPerColumn
              ? d
              : Math.ceil(d / t.slidesPerColumn) * t.slidesPerColumn),
          "auto" !== t.slidesPerView &&
            "row" === t.slidesPerColumnFill &&
            (v = Math.max(v, t.slidesPerView * t.slidesPerColumn)));
      const E = t.slidesPerColumn,
        S = v / E,
        T = Math.floor(d / t.slidesPerColumn);
      for (let i = 0; i < d; i += 1) {
        w = 0;
        const a = l.eq(i);
        if (t.slidesPerColumn > 1) {
          let s, r, n;
          "column" === t.slidesPerColumnFill
            ? ((n = i - (r = Math.floor(i / E)) * E),
              (r > T || (r === T && n === E - 1)) &&
                (n += 1) >= E &&
                ((n = 0), (r += 1)),
              (s = r + (n * v) / E),
              a.css({
                "-webkit-box-ordinal-group": s,
                "-moz-box-ordinal-group": s,
                "-ms-flex-order": s,
                "-webkit-order": s,
                "order": s,
              }))
            : (r = i - (n = Math.floor(i / S)) * S),
            a
              .css(
                `margin-${e.isHorizontal() ? "top" : "left"}`,
                0 !== n && t.spaceBetween && `${t.spaceBetween}px`
              )
              .attr("data-swiper-column", r)
              .attr("data-swiper-row", n);
        }
        if ("none" !== a.css("display")) {
          if ("auto" === t.slidesPerView) {
            const i = re.getComputedStyle(a[0], null),
              s = a[0].style.transform,
              r = a[0].style.webkitTransform;
            if (
              (s && (a[0].style.transform = "none"),
              r && (a[0].style.webkitTransform = "none"),
              t.roundLengths)
            )
              w = e.isHorizontal() ? a.outerWidth(!0) : a.outerHeight(!0);
            else if (e.isHorizontal()) {
              const e = parseFloat(i.getPropertyValue("width")),
                t = parseFloat(i.getPropertyValue("padding-left")),
                s = parseFloat(i.getPropertyValue("padding-right")),
                a = parseFloat(i.getPropertyValue("margin-left")),
                r = parseFloat(i.getPropertyValue("margin-right")),
                n = i.getPropertyValue("box-sizing");
              w = n && "border-box" === n ? e + a + r : e + t + s + a + r;
            } else {
              const e = parseFloat(i.getPropertyValue("height")),
                t = parseFloat(i.getPropertyValue("padding-top")),
                s = parseFloat(i.getPropertyValue("padding-bottom")),
                a = parseFloat(i.getPropertyValue("margin-top")),
                r = parseFloat(i.getPropertyValue("margin-bottom")),
                n = i.getPropertyValue("box-sizing");
              w = n && "border-box" === n ? e + a + r : e + t + s + a + r;
            }
            s && (a[0].style.transform = s),
              r && (a[0].style.webkitTransform = r),
              t.roundLengths && (w = Math.floor(w));
          } else
            (w = (s - (t.slidesPerView - 1) * b) / t.slidesPerView),
              t.roundLengths && (w = Math.floor(w)),
              l[i] &&
                (e.isHorizontal()
                  ? (l[i].style.width = `${w}px`)
                  : (l[i].style.height = `${w}px`));
          l[i] && (l[i].swiperSlideSize = w),
            h.push(w),
            t.centeredSlides
              ? ((y = y + w / 2 + x / 2 + b),
                0 === x && 0 !== i && (y = y - s / 2 - b),
                0 === i && (y = y - s / 2 - b),
                Math.abs(y) < 0.001 && (y = 0),
                t.roundLengths && (y = Math.floor(y)),
                C % t.slidesPerGroup == 0 && p.push(y),
                c.push(y))
              : (t.roundLengths && (y = Math.floor(y)),
                C % t.slidesPerGroup == 0 && p.push(y),
                c.push(y),
                (y = y + w + b)),
            (e.virtualSize += w + b),
            (x = w),
            (C += 1);
        }
      }
      let k;
      if (
        ((e.virtualSize = Math.max(e.virtualSize, s) + m),
        a &&
          r &&
          ("slide" === t.effect || "coverflow" === t.effect) &&
          i.css({ width: `${e.virtualSize + t.spaceBetween}px` }),
        (ce.flexbox && !t.setWrapperSize) ||
          (e.isHorizontal()
            ? i.css({ width: `${e.virtualSize + t.spaceBetween}px` })
            : i.css({ height: `${e.virtualSize + t.spaceBetween}px` })),
        t.slidesPerColumn > 1 &&
          ((e.virtualSize = (w + t.spaceBetween) * v),
          (e.virtualSize =
            Math.ceil(e.virtualSize / t.slidesPerColumn) - t.spaceBetween),
          e.isHorizontal()
            ? i.css({ width: `${e.virtualSize + t.spaceBetween}px` })
            : i.css({ height: `${e.virtualSize + t.spaceBetween}px` }),
          t.centeredSlides))
      ) {
        k = [];
        for (let i = 0; i < p.length; i += 1) {
          let s = p[i];
          t.roundLengths && (s = Math.floor(s)),
            p[i] < e.virtualSize + p[0] && k.push(s);
        }
        p = k;
      }
      if (!t.centeredSlides) {
        k = [];
        for (let i = 0; i < p.length; i += 1) {
          let a = p[i];
          t.roundLengths && (a = Math.floor(a)),
            p[i] <= e.virtualSize - s && k.push(a);
        }
        (p = k),
          Math.floor(e.virtualSize - s) - Math.floor(p[p.length - 1]) > 1 &&
            p.push(e.virtualSize - s);
      }
      if (
        (0 === p.length && (p = [0]),
        0 !== t.spaceBetween &&
          (e.isHorizontal()
            ? a
              ? l.css({ marginLeft: `${b}px` })
              : l.css({ marginRight: `${b}px` })
            : l.css({ marginBottom: `${b}px` })),
        t.centerInsufficientSlides)
      ) {
        let e = 0;
        if (
          (h.forEach((i) => {
            e += i + (t.spaceBetween ? t.spaceBetween : 0);
          }),
          (e -= t.spaceBetween) < s)
        ) {
          const t = (s - e) / 2;
          p.forEach((e, i) => {
            p[i] = e - t;
          }),
            c.forEach((e, i) => {
              c[i] = e + t;
            });
        }
      }
      pe.extend(e, {
        slides: l,
        snapGrid: p,
        slidesGrid: c,
        slidesSizesGrid: h,
      }),
        d !== o && e.emit("slidesLengthChange"),
        p.length !== g &&
          (e.params.watchOverflow && e.checkOverflow(),
          e.emit("snapGridLengthChange")),
        c.length !== f && e.emit("slidesGridLengthChange"),
        (t.watchSlidesProgress || t.watchSlidesVisibility) &&
          e.updateSlidesOffset();
    },
    updateAutoHeight: function (e) {
      const t = this,
        i = [];
      let s,
        a = 0;
      if (
        ("number" == typeof e
          ? t.setTransition(e)
          : !0 === e && t.setTransition(t.params.speed),
        "auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
      )
        for (s = 0; s < Math.ceil(t.params.slidesPerView); s += 1) {
          const e = t.activeIndex + s;
          if (e > t.slides.length) break;
          i.push(t.slides.eq(e)[0]);
        }
      else i.push(t.slides.eq(t.activeIndex)[0]);
      for (s = 0; s < i.length; s += 1)
        if (void 0 !== i[s]) {
          const e = i[s].offsetHeight;
          a = e > a ? e : a;
        }
      a && t.$wrapperEl.css("height", `${a}px`);
    },
    updateSlidesOffset: function () {
      const e = this,
        t = e.slides;
      for (let i = 0; i < t.length; i += 1)
        t[i].swiperSlideOffset = e.isHorizontal()
          ? t[i].offsetLeft
          : t[i].offsetTop;
    },
    updateSlidesProgress: function (e = (this && this.translate) || 0) {
      const t = this,
        i = t.params,
        { slides: s, rtlTranslate: a } = t;
      if (0 === s.length) return;
      void 0 === s[0].swiperSlideOffset && t.updateSlidesOffset();
      let r = -e;
      a && (r = e),
        s.removeClass(i.slideVisibleClass),
        (t.visibleSlidesIndexes = []),
        (t.visibleSlides = []);
      for (let e = 0; e < s.length; e += 1) {
        const n = s[e],
          o =
            (r +
              (i.centeredSlides ? t.minTranslate() : 0) -
              n.swiperSlideOffset) /
            (n.swiperSlideSize + i.spaceBetween);
        if (i.watchSlidesVisibility) {
          const a = -(r - n.swiperSlideOffset),
            o = a + t.slidesSizesGrid[e];
          ((a >= 0 && a < t.size) ||
            (o > 0 && o <= t.size) ||
            (a <= 0 && o >= t.size)) &&
            (t.visibleSlides.push(n),
            t.visibleSlidesIndexes.push(e),
            s.eq(e).addClass(i.slideVisibleClass));
        }
        n.progress = a ? -o : o;
      }
      t.visibleSlides = oe(t.visibleSlides);
    },
    updateProgress: function (e = (this && this.translate) || 0) {
      const t = this,
        i = t.params,
        s = t.maxTranslate() - t.minTranslate();
      let { progress: a, isBeginning: r, isEnd: n } = t;
      const o = r,
        l = n;
      0 === s
        ? ((a = 0), (r = !0), (n = !0))
        : ((r = (a = (e - t.minTranslate()) / s) <= 0), (n = a >= 1)),
        pe.extend(t, { progress: a, isBeginning: r, isEnd: n }),
        (i.watchSlidesProgress || i.watchSlidesVisibility) &&
          t.updateSlidesProgress(e),
        r && !o && t.emit("reachBeginning toEdge"),
        n && !l && t.emit("reachEnd toEdge"),
        ((o && !r) || (l && !n)) && t.emit("fromEdge"),
        t.emit("progress", a);
    },
    updateSlidesClasses: function () {
      const e = this,
        {
          slides: t,
          params: i,
          $wrapperEl: s,
          activeIndex: a,
          realIndex: r,
        } = e,
        n = e.virtual && i.virtual.enabled;
      let o;
      t.removeClass(
        `${i.slideActiveClass} ${i.slideNextClass} ${i.slidePrevClass} ${i.slideDuplicateActiveClass} ${i.slideDuplicateNextClass} ${i.slideDuplicatePrevClass}`
      ),
        (o = n
          ? e.$wrapperEl.find(
              `.${i.slideClass}[data-swiper-slide-index="${a}"]`
            )
          : t.eq(a)).addClass(i.slideActiveClass),
        i.loop &&
          (o.hasClass(i.slideDuplicateClass)
            ? s
                .children(
                  `.${i.slideClass}:not(.${i.slideDuplicateClass})[data-swiper-slide-index="${r}"]`
                )
                .addClass(i.slideDuplicateActiveClass)
            : s
                .children(
                  `.${i.slideClass}.${i.slideDuplicateClass}[data-swiper-slide-index="${r}"]`
                )
                .addClass(i.slideDuplicateActiveClass));
      let l = o.nextAll(`.${i.slideClass}`).eq(0).addClass(i.slideNextClass);
      i.loop && 0 === l.length && (l = t.eq(0)).addClass(i.slideNextClass);
      let d = o.prevAll(`.${i.slideClass}`).eq(0).addClass(i.slidePrevClass);
      i.loop && 0 === d.length && (d = t.eq(-1)).addClass(i.slidePrevClass),
        i.loop &&
          (l.hasClass(i.slideDuplicateClass)
            ? s
                .children(
                  `.${i.slideClass}:not(.${
                    i.slideDuplicateClass
                  })[data-swiper-slide-index="${l.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(i.slideDuplicateNextClass)
            : s
                .children(
                  `.${i.slideClass}.${
                    i.slideDuplicateClass
                  }[data-swiper-slide-index="${l.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(i.slideDuplicateNextClass),
          d.hasClass(i.slideDuplicateClass)
            ? s
                .children(
                  `.${i.slideClass}:not(.${
                    i.slideDuplicateClass
                  })[data-swiper-slide-index="${d.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(i.slideDuplicatePrevClass)
            : s
                .children(
                  `.${i.slideClass}.${
                    i.slideDuplicateClass
                  }[data-swiper-slide-index="${d.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(i.slideDuplicatePrevClass));
    },
    updateActiveIndex: function (e) {
      const t = this,
        i = t.rtlTranslate ? t.translate : -t.translate,
        {
          slidesGrid: s,
          snapGrid: a,
          params: r,
          activeIndex: n,
          realIndex: o,
          snapIndex: l,
        } = t;
      let d,
        p = e;
      if (void 0 === p) {
        for (let e = 0; e < s.length; e += 1)
          void 0 !== s[e + 1]
            ? i >= s[e] && i < s[e + 1] - (s[e + 1] - s[e]) / 2
              ? (p = e)
              : i >= s[e] && i < s[e + 1] && (p = e + 1)
            : i >= s[e] && (p = e);
        r.normalizeSlideIndex && (p < 0 || void 0 === p) && (p = 0);
      }
      if (
        ((d =
          a.indexOf(i) >= 0
            ? a.indexOf(i)
            : Math.floor(p / r.slidesPerGroup)) >= a.length &&
          (d = a.length - 1),
        p === n)
      )
        return void (d !== l && ((t.snapIndex = d), t.emit("snapIndexChange")));
      const c = parseInt(
        t.slides.eq(p).attr("data-swiper-slide-index") || p,
        10
      );
      pe.extend(t, {
        snapIndex: d,
        realIndex: c,
        previousIndex: n,
        activeIndex: p,
      }),
        t.emit("activeIndexChange"),
        t.emit("snapIndexChange"),
        o !== c && t.emit("realIndexChange"),
        t.emit("slideChange");
    },
    updateClickedSlide: function (e) {
      const t = this,
        i = t.params,
        s = oe(e.target).closest(`.${i.slideClass}`)[0];
      let a = !1;
      if (s)
        for (let e = 0; e < t.slides.length; e += 1)
          t.slides[e] === s && (a = !0);
      if (!s || !a)
        return (t.clickedSlide = void 0), void (t.clickedIndex = void 0);
      (t.clickedSlide = s),
        t.virtual && t.params.virtual.enabled
          ? (t.clickedIndex = parseInt(
              oe(s).attr("data-swiper-slide-index"),
              10
            ))
          : (t.clickedIndex = oe(s).index()),
        i.slideToClickedSlide &&
          void 0 !== t.clickedIndex &&
          t.clickedIndex !== t.activeIndex &&
          t.slideToClickedSlide();
    },
  };
  var ge = {
    getTranslate: function (e = this.isHorizontal() ? "x" : "y") {
      const { params: t, rtlTranslate: i, translate: s, $wrapperEl: a } = this;
      if (t.virtualTranslate) return i ? -s : s;
      let r = pe.getTranslate(a[0], e);
      return i && (r = -r), r || 0;
    },
    setTranslate: function (e, t) {
      const i = this,
        { rtlTranslate: s, params: a, $wrapperEl: r, progress: n } = i;
      let o,
        l = 0,
        d = 0;
      i.isHorizontal() ? (l = s ? -e : e) : (d = e),
        a.roundLengths && ((l = Math.floor(l)), (d = Math.floor(d))),
        a.virtualTranslate ||
          (ce.transforms3d
            ? r.transform(`translate3d(${l}px, ${d}px, 0px)`)
            : r.transform(`translate(${l}px, ${d}px)`)),
        (i.previousTranslate = i.translate),
        (i.translate = i.isHorizontal() ? l : d);
      const p = i.maxTranslate() - i.minTranslate();
      (o = 0 === p ? 0 : (e - i.minTranslate()) / p) !== n &&
        i.updateProgress(e),
        i.emit("setTranslate", i.translate, t);
    },
    minTranslate: function () {
      return -this.snapGrid[0];
    },
    maxTranslate: function () {
      return -this.snapGrid[this.snapGrid.length - 1];
    },
  };
  var fe = {
    setTransition: function (e, t) {
      this.$wrapperEl.transition(e), this.emit("setTransition", e, t);
    },
    transitionStart: function (e = !0, t) {
      const i = this,
        { activeIndex: s, params: a, previousIndex: r } = i;
      a.autoHeight && i.updateAutoHeight();
      let n = t;
      if (
        (n || (n = s > r ? "next" : s < r ? "prev" : "reset"),
        i.emit("transitionStart"),
        e && s !== r)
      ) {
        if ("reset" === n) return void i.emit("slideResetTransitionStart");
        i.emit("slideChangeTransitionStart"),
          "next" === n
            ? i.emit("slideNextTransitionStart")
            : i.emit("slidePrevTransitionStart");
      }
    },
    transitionEnd: function (e = !0, t) {
      const i = this,
        { activeIndex: s, previousIndex: a } = i;
      (i.animating = !1), i.setTransition(0);
      let r = t;
      if (
        (r || (r = s > a ? "next" : s < a ? "prev" : "reset"),
        i.emit("transitionEnd"),
        e && s !== a)
      ) {
        if ("reset" === r) return void i.emit("slideResetTransitionEnd");
        i.emit("slideChangeTransitionEnd"),
          "next" === r
            ? i.emit("slideNextTransitionEnd")
            : i.emit("slidePrevTransitionEnd");
      }
    },
  };
  var ve = {
    slideTo: function (e = 0, t = this.params.speed, i = !0, s) {
      const a = this;
      let r = e;
      r < 0 && (r = 0);
      const {
        params: n,
        snapGrid: o,
        slidesGrid: l,
        previousIndex: d,
        activeIndex: p,
        rtlTranslate: c,
      } = a;
      if (a.animating && n.preventInteractionOnTransition) return !1;
      let h = Math.floor(r / n.slidesPerGroup);
      h >= o.length && (h = o.length - 1),
        (p || n.initialSlide || 0) === (d || 0) &&
          i &&
          a.emit("beforeSlideChangeStart");
      const u = -o[h];
      if ((a.updateProgress(u), n.normalizeSlideIndex))
        for (let e = 0; e < l.length; e += 1)
          -Math.floor(100 * u) >= Math.floor(100 * l[e]) && (r = e);
      if (a.initialized && r !== p) {
        if (!a.allowSlideNext && u < a.translate && u < a.minTranslate())
          return !1;
        if (
          !a.allowSlidePrev &&
          u > a.translate &&
          u > a.maxTranslate() &&
          (p || 0) !== r
        )
          return !1;
      }
      let m;
      return (
        (m = r > p ? "next" : r < p ? "prev" : "reset"),
        (c && -u === a.translate) || (!c && u === a.translate)
          ? (a.updateActiveIndex(r),
            n.autoHeight && a.updateAutoHeight(),
            a.updateSlidesClasses(),
            "slide" !== n.effect && a.setTranslate(u),
            "reset" !== m && (a.transitionStart(i, m), a.transitionEnd(i, m)),
            !1)
          : (0 !== t && ce.transition
              ? (a.setTransition(t),
                a.setTranslate(u),
                a.updateActiveIndex(r),
                a.updateSlidesClasses(),
                a.emit("beforeTransitionStart", t, s),
                a.transitionStart(i, m),
                a.animating ||
                  ((a.animating = !0),
                  a.onSlideToWrapperTransitionEnd ||
                    (a.onSlideToWrapperTransitionEnd = function (e) {
                      a &&
                        !a.destroyed &&
                        e.target === this &&
                        (a.$wrapperEl[0].removeEventListener(
                          "transitionend",
                          a.onSlideToWrapperTransitionEnd
                        ),
                        a.$wrapperEl[0].removeEventListener(
                          "webkitTransitionEnd",
                          a.onSlideToWrapperTransitionEnd
                        ),
                        (a.onSlideToWrapperTransitionEnd = null),
                        delete a.onSlideToWrapperTransitionEnd,
                        a.transitionEnd(i, m));
                    }),
                  a.$wrapperEl[0].addEventListener(
                    "transitionend",
                    a.onSlideToWrapperTransitionEnd
                  ),
                  a.$wrapperEl[0].addEventListener(
                    "webkitTransitionEnd",
                    a.onSlideToWrapperTransitionEnd
                  )))
              : (a.setTransition(0),
                a.setTranslate(u),
                a.updateActiveIndex(r),
                a.updateSlidesClasses(),
                a.emit("beforeTransitionStart", t, s),
                a.transitionStart(i, m),
                a.transitionEnd(i, m)),
            !0)
      );
    },
    slideToLoop: function (e = 0, t = this.params.speed, i = !0, s) {
      const a = this;
      let r = e;
      return a.params.loop && (r += a.loopedSlides), a.slideTo(r, t, i, s);
    },
    slideNext: function (e = this.params.speed, t = !0, i) {
      const s = this,
        { params: a, animating: r } = s;
      return a.loop
        ? !r &&
            (s.loopFix(),
            (s._clientLeft = s.$wrapperEl[0].clientLeft),
            s.slideTo(s.activeIndex + a.slidesPerGroup, e, t, i))
        : s.slideTo(s.activeIndex + a.slidesPerGroup, e, t, i);
    },
    slidePrev: function (e = this.params.speed, t = !0, i) {
      const s = this,
        {
          params: a,
          animating: r,
          snapGrid: n,
          slidesGrid: o,
          rtlTranslate: l,
        } = s;
      if (a.loop) {
        if (r) return !1;
        s.loopFix(), (s._clientLeft = s.$wrapperEl[0].clientLeft);
      }
      function d(e) {
        return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
      }
      const p = d(l ? s.translate : -s.translate),
        c = n.map((e) => d(e)),
        h = (o.map((e) => d(e)), n[c.indexOf(p)], n[c.indexOf(p) - 1]);
      let u;
      return (
        void 0 !== h && (u = o.indexOf(h)) < 0 && (u = s.activeIndex - 1),
        s.slideTo(u, e, t, i)
      );
    },
    slideReset: function (e = this.params.speed, t = !0, i) {
      return this.slideTo(this.activeIndex, e, t, i);
    },
    slideToClosest: function (e = this.params.speed, t = !0, i) {
      const s = this;
      let a = s.activeIndex;
      const r = Math.floor(a / s.params.slidesPerGroup);
      if (r < s.snapGrid.length - 1) {
        const e = s.rtlTranslate ? s.translate : -s.translate,
          t = s.snapGrid[r];
        e - t > (s.snapGrid[r + 1] - t) / 2 && (a = s.params.slidesPerGroup);
      }
      return s.slideTo(a, e, t, i);
    },
    slideToClickedSlide: function () {
      const e = this,
        { params: t, $wrapperEl: i } = e,
        s =
          "auto" === t.slidesPerView
            ? e.slidesPerViewDynamic()
            : t.slidesPerView;
      let a,
        r = e.clickedIndex;
      if (t.loop) {
        if (e.animating) return;
        (a = parseInt(oe(e.clickedSlide).attr("data-swiper-slide-index"), 10)),
          t.centeredSlides
            ? r < e.loopedSlides - s / 2 ||
              r > e.slides.length - e.loopedSlides + s / 2
              ? (e.loopFix(),
                (r = i
                  .children(
                    `.${t.slideClass}[data-swiper-slide-index="${a}"]:not(.${t.slideDuplicateClass})`
                  )
                  .eq(0)
                  .index()),
                pe.nextTick(() => {
                  e.slideTo(r);
                }))
              : e.slideTo(r)
            : r > e.slides.length - s
            ? (e.loopFix(),
              (r = i
                .children(
                  `.${t.slideClass}[data-swiper-slide-index="${a}"]:not(.${t.slideDuplicateClass})`
                )
                .eq(0)
                .index()),
              pe.nextTick(() => {
                e.slideTo(r);
              }))
            : e.slideTo(r);
      } else e.slideTo(r);
    },
  };
  var we = {
    loopCreate: function () {
      const e = this,
        { params: t, $wrapperEl: i } = e;
      i.children(`.${t.slideClass}.${t.slideDuplicateClass}`).remove();
      let s = i.children(`.${t.slideClass}`);
      if (t.loopFillGroupWithBlank) {
        const e = t.slidesPerGroup - (s.length % t.slidesPerGroup);
        if (e !== t.slidesPerGroup) {
          for (let s = 0; s < e; s += 1) {
            const e = oe(ae.createElement("div")).addClass(
              `${t.slideClass} ${t.slideBlankClass}`
            );
            i.append(e);
          }
          s = i.children(`.${t.slideClass}`);
        }
      }
      "auto" !== t.slidesPerView ||
        t.loopedSlides ||
        (t.loopedSlides = s.length),
        (e.loopedSlides = parseInt(t.loopedSlides || t.slidesPerView, 10)),
        (e.loopedSlides += t.loopAdditionalSlides),
        e.loopedSlides > s.length && (e.loopedSlides = s.length);
      const a = [],
        r = [];
      s.each((t, i) => {
        const n = oe(i);
        t < e.loopedSlides && r.push(i),
          t < s.length && t >= s.length - e.loopedSlides && a.push(i),
          n.attr("data-swiper-slide-index", t);
      });
      for (let e = 0; e < r.length; e += 1)
        i.append(oe(r[e].cloneNode(!0)).addClass(t.slideDuplicateClass));
      for (let e = a.length - 1; e >= 0; e -= 1)
        i.prepend(oe(a[e].cloneNode(!0)).addClass(t.slideDuplicateClass));
    },
    loopFix: function () {
      const e = this,
        {
          params: t,
          activeIndex: i,
          slides: s,
          loopedSlides: a,
          allowSlidePrev: r,
          allowSlideNext: n,
          snapGrid: o,
          rtlTranslate: l,
        } = e;
      let d;
      (e.allowSlidePrev = !0), (e.allowSlideNext = !0);
      const p = -o[i] - e.getTranslate();
      i < a
        ? ((d = s.length - 3 * a + i),
          (d += a),
          e.slideTo(d, 0, !1, !0) &&
            0 !== p &&
            e.setTranslate((l ? -e.translate : e.translate) - p))
        : (("auto" === t.slidesPerView && i >= 2 * a) || i >= s.length - a) &&
          ((d = -s.length + i + a),
          (d += a),
          e.slideTo(d, 0, !1, !0) &&
            0 !== p &&
            e.setTranslate((l ? -e.translate : e.translate) - p));
      (e.allowSlidePrev = r), (e.allowSlideNext = n);
    },
    loopDestroy: function () {
      const { $wrapperEl: e, params: t, slides: i } = this;
      e
        .children(
          `.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`
        )
        .remove(),
        i.removeAttr("data-swiper-slide-index");
    },
  };
  var be = {
    setGrabCursor: function (e) {
      if (
        ce.touch ||
        !this.params.simulateTouch ||
        (this.params.watchOverflow && this.isLocked)
      )
        return;
      const t = this.el;
      (t.style.cursor = "move"),
        (t.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab"),
        (t.style.cursor = e ? "-moz-grabbin" : "-moz-grab"),
        (t.style.cursor = e ? "grabbing" : "grab");
    },
    unsetGrabCursor: function () {
      ce.touch ||
        (this.params.watchOverflow && this.isLocked) ||
        (this.el.style.cursor = "");
    },
  };
  var ye = {
    appendSlide: function (e) {
      const t = this,
        { $wrapperEl: i, params: s } = t;
      if ((s.loop && t.loopDestroy(), "object" == typeof e && "length" in e))
        for (let t = 0; t < e.length; t += 1) e[t] && i.append(e[t]);
      else i.append(e);
      s.loop && t.loopCreate(), (s.observer && ce.observer) || t.update();
    },
    prependSlide: function (e) {
      const t = this,
        { params: i, $wrapperEl: s, activeIndex: a } = t;
      i.loop && t.loopDestroy();
      let r = a + 1;
      if ("object" == typeof e && "length" in e) {
        for (let t = 0; t < e.length; t += 1) e[t] && s.prepend(e[t]);
        r = a + e.length;
      } else s.prepend(e);
      i.loop && t.loopCreate(),
        (i.observer && ce.observer) || t.update(),
        t.slideTo(r, 0, !1);
    },
    addSlide: function (e, t) {
      const i = this,
        { $wrapperEl: s, params: a, activeIndex: r } = i;
      let n = r;
      a.loop &&
        ((n -= i.loopedSlides),
        i.loopDestroy(),
        (i.slides = s.children(`.${a.slideClass}`)));
      const o = i.slides.length;
      if (e <= 0) return void i.prependSlide(t);
      if (e >= o) return void i.appendSlide(t);
      let l = n > e ? n + 1 : n;
      const d = [];
      for (let t = o - 1; t >= e; t -= 1) {
        const e = i.slides.eq(t);
        e.remove(), d.unshift(e);
      }
      if ("object" == typeof t && "length" in t) {
        for (let e = 0; e < t.length; e += 1) t[e] && s.append(t[e]);
        l = n > e ? n + t.length : n;
      } else s.append(t);
      for (let e = 0; e < d.length; e += 1) s.append(d[e]);
      a.loop && i.loopCreate(),
        (a.observer && ce.observer) || i.update(),
        a.loop ? i.slideTo(l + i.loopedSlides, 0, !1) : i.slideTo(l, 0, !1);
    },
    removeSlide: function (e) {
      const t = this,
        { params: i, $wrapperEl: s, activeIndex: a } = t;
      let r = a;
      i.loop &&
        ((r -= t.loopedSlides),
        t.loopDestroy(),
        (t.slides = s.children(`.${i.slideClass}`)));
      let n,
        o = r;
      if ("object" == typeof e && "length" in e) {
        for (let i = 0; i < e.length; i += 1)
          (n = e[i]), t.slides[n] && t.slides.eq(n).remove(), n < o && (o -= 1);
        o = Math.max(o, 0);
      } else
        (n = e),
          t.slides[n] && t.slides.eq(n).remove(),
          n < o && (o -= 1),
          (o = Math.max(o, 0));
      i.loop && t.loopCreate(),
        (i.observer && ce.observer) || t.update(),
        i.loop ? t.slideTo(o + t.loopedSlides, 0, !1) : t.slideTo(o, 0, !1);
    },
    removeAllSlides: function () {
      const e = this,
        t = [];
      for (let i = 0; i < e.slides.length; i += 1) t.push(i);
      e.removeSlide(t);
    },
  };
  const xe = (function () {
    const e = re.navigator.userAgent,
      t = {
        ios: !1,
        android: !1,
        androidChrome: !1,
        desktop: !1,
        windows: !1,
        iphone: !1,
        ipod: !1,
        ipad: !1,
        cordova: re.cordova || re.phonegap,
        phonegap: re.cordova || re.phonegap,
      },
      i = e.match(/(Windows Phone);?[\s\/]+([\d.]+)?/),
      s = e.match(/(Android);?[\s\/]+([\d.]+)?/),
      a = e.match(/(iPad).*OS\s([\d_]+)/),
      r = e.match(/(iPod)(.*OS\s([\d_]+))?/),
      n = !a && e.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    if (
      (i && ((t.os = "windows"), (t.osVersion = i[2]), (t.windows = !0)),
      s &&
        !i &&
        ((t.os = "android"),
        (t.osVersion = s[2]),
        (t.android = !0),
        (t.androidChrome = e.toLowerCase().indexOf("chrome") >= 0)),
      (a || n || r) && ((t.os = "ios"), (t.ios = !0)),
      n && !r && ((t.osVersion = n[2].replace(/_/g, ".")), (t.iphone = !0)),
      a && ((t.osVersion = a[2].replace(/_/g, ".")), (t.ipad = !0)),
      r &&
        ((t.osVersion = r[3] ? r[3].replace(/_/g, ".") : null),
        (t.iphone = !0)),
      t.ios &&
        t.osVersion &&
        e.indexOf("Version/") >= 0 &&
        "10" === t.osVersion.split(".")[0] &&
        (t.osVersion = e.toLowerCase().split("version/")[1].split(" ")[0]),
      (t.desktop = !(t.os || t.android || t.webView)),
      (t.webView = (n || a || r) && e.match(/.*AppleWebKit(?!.*Safari)/i)),
      t.os && "ios" === t.os)
    ) {
      const e = t.osVersion.split("."),
        i = ae.querySelector('meta[name="viewport"]');
      t.minimalUi =
        !t.webView &&
        (r || n) &&
        (1 * e[0] == 7 ? 1 * e[1] >= 1 : 1 * e[0] > 7) &&
        i &&
        i.getAttribute("content").indexOf("minimal-ui") >= 0;
    }
    return (t.pixelRatio = re.devicePixelRatio || 1), t;
  })();
  function Ce() {
    const e = this,
      { params: t, el: i } = e;
    if (i && 0 === i.offsetWidth) return;
    t.breakpoints && e.setBreakpoint();
    const { allowSlideNext: s, allowSlidePrev: a, snapGrid: r } = e;
    if (
      ((e.allowSlideNext = !0),
      (e.allowSlidePrev = !0),
      e.updateSize(),
      e.updateSlides(),
      t.freeMode)
    ) {
      const i = Math.min(
        Math.max(e.translate, e.maxTranslate()),
        e.minTranslate()
      );
      e.setTranslate(i),
        e.updateActiveIndex(),
        e.updateSlidesClasses(),
        t.autoHeight && e.updateAutoHeight();
    } else e.updateSlidesClasses(), ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0);
    (e.allowSlidePrev = a),
      (e.allowSlideNext = s),
      e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
  }
  var Ee = {
    init: !0,
    direction: "horizontal",
    touchEventsTarget: "container",
    initialSlide: 0,
    speed: 300,
    preventInteractionOnTransition: !1,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    freeMode: !1,
    freeModeMomentum: !0,
    freeModeMomentumRatio: 1,
    freeModeMomentumBounce: !0,
    freeModeMomentumBounceRatio: 1,
    freeModeMomentumVelocityRatio: 1,
    freeModeSticky: !1,
    freeModeMinimumVelocity: 0.02,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsInverse: !1,
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerColumnFill: "column",
    slidesPerGroup: 1,
    centeredSlides: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !1,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 0,
    touchMoveStopPropagation: !0,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: 0.85,
    watchSlidesProgress: !1,
    watchSlidesVisibility: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    preloadImages: !0,
    updateOnImagesReady: !0,
    loop: !1,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopFillGroupWithBlank: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    containerModifierClass: "swiper-container-",
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-invisible-blank",
    slideActiveClass: "swiper-slide-active",
    slideDuplicateActiveClass: "swiper-slide-duplicate-active",
    slideVisibleClass: "swiper-slide-visible",
    slideDuplicateClass: "swiper-slide-duplicate",
    slideNextClass: "swiper-slide-next",
    slideDuplicateNextClass: "swiper-slide-duplicate-next",
    slidePrevClass: "swiper-slide-prev",
    slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
    wrapperClass: "swiper-wrapper",
    runCallbacksOnInit: !0,
  };
  const Se = {
      update: me,
      translate: ge,
      transition: fe,
      slide: ve,
      loop: we,
      grabCursor: be,
      manipulation: ye,
      events: {
        attachEvents: function () {
          const e = this,
            { params: t, touchEvents: i, el: s, wrapperEl: a } = e;
          (e.onTouchStart = function (e) {
            const t = this,
              i = t.touchEventsData,
              { params: s, touches: a } = t;
            if (t.animating && s.preventInteractionOnTransition) return;
            let r = e;
            if (
              (r.originalEvent && (r = r.originalEvent),
              (i.isTouchEvent = "touchstart" === r.type),
              !i.isTouchEvent && "which" in r && 3 === r.which)
            )
              return;
            if (!i.isTouchEvent && "button" in r && r.button > 0) return;
            if (i.isTouched && i.isMoved) return;
            if (
              s.noSwiping &&
              oe(r.target).closest(
                s.noSwipingSelector
                  ? s.noSwipingSelector
                  : `.${s.noSwipingClass}`
              )[0]
            )
              return void (t.allowClick = !0);
            if (s.swipeHandler && !oe(r).closest(s.swipeHandler)[0]) return;
            (a.currentX =
              "touchstart" === r.type ? r.targetTouches[0].pageX : r.pageX),
              (a.currentY =
                "touchstart" === r.type ? r.targetTouches[0].pageY : r.pageY);
            const n = a.currentX,
              o = a.currentY,
              l = s.edgeSwipeDetection || s.iOSEdgeSwipeDetection,
              d = s.edgeSwipeThreshold || s.iOSEdgeSwipeThreshold;
            if (!l || !(n <= d || n >= re.screen.width - d)) {
              if (
                (pe.extend(i, {
                  isTouched: !0,
                  isMoved: !1,
                  allowTouchCallbacks: !0,
                  isScrolling: void 0,
                  startMoving: void 0,
                }),
                (a.startX = n),
                (a.startY = o),
                (i.touchStartTime = pe.now()),
                (t.allowClick = !0),
                t.updateSize(),
                (t.swipeDirection = void 0),
                s.threshold > 0 && (i.allowThresholdMove = !1),
                "touchstart" !== r.type)
              ) {
                let e = !0;
                oe(r.target).is(i.formElements) && (e = !1),
                  ae.activeElement &&
                    oe(ae.activeElement).is(i.formElements) &&
                    ae.activeElement !== r.target &&
                    ae.activeElement.blur();
                const a = e && t.allowTouchMove && s.touchStartPreventDefault;
                (s.touchStartForcePreventDefault || a) && r.preventDefault();
              }
              t.emit("touchStart", r);
            }
          }.bind(e)),
            (e.onTouchMove = function (e) {
              const t = this,
                i = t.touchEventsData,
                { params: s, touches: a, rtlTranslate: r } = t;
              let n = e;
              if ((n.originalEvent && (n = n.originalEvent), !i.isTouched))
                return void (
                  i.startMoving &&
                  i.isScrolling &&
                  t.emit("touchMoveOpposite", n)
                );
              if (i.isTouchEvent && "mousemove" === n.type) return;
              const o =
                  "touchmove" === n.type ? n.targetTouches[0].pageX : n.pageX,
                l = "touchmove" === n.type ? n.targetTouches[0].pageY : n.pageY;
              if (n.preventedByNestedSwiper)
                return (a.startX = o), void (a.startY = l);
              if (!t.allowTouchMove)
                return (
                  (t.allowClick = !1),
                  void (
                    i.isTouched &&
                    (pe.extend(a, {
                      startX: o,
                      startY: l,
                      currentX: o,
                      currentY: l,
                    }),
                    (i.touchStartTime = pe.now()))
                  )
                );
              if (i.isTouchEvent && s.touchReleaseOnEdges && !s.loop)
                if (t.isVertical()) {
                  if (
                    (l < a.startY && t.translate <= t.maxTranslate()) ||
                    (l > a.startY && t.translate >= t.minTranslate())
                  )
                    return (i.isTouched = !1), void (i.isMoved = !1);
                } else if (
                  (o < a.startX && t.translate <= t.maxTranslate()) ||
                  (o > a.startX && t.translate >= t.minTranslate())
                )
                  return;
              if (
                i.isTouchEvent &&
                ae.activeElement &&
                n.target === ae.activeElement &&
                oe(n.target).is(i.formElements)
              )
                return (i.isMoved = !0), void (t.allowClick = !1);
              if (
                (i.allowTouchCallbacks && t.emit("touchMove", n),
                n.targetTouches && n.targetTouches.length > 1)
              )
                return;
              (a.currentX = o), (a.currentY = l);
              const d = a.currentX - a.startX,
                p = a.currentY - a.startY;
              if (
                t.params.threshold &&
                Math.sqrt(d ** 2 + p ** 2) < t.params.threshold
              )
                return;
              if (void 0 === i.isScrolling) {
                let e;
                (t.isHorizontal() && a.currentY === a.startY) ||
                (t.isVertical() && a.currentX === a.startX)
                  ? (i.isScrolling = !1)
                  : d * d + p * p >= 25 &&
                    ((e =
                      (180 * Math.atan2(Math.abs(p), Math.abs(d))) / Math.PI),
                    (i.isScrolling = t.isHorizontal()
                      ? e > s.touchAngle
                      : 90 - e > s.touchAngle));
              }
              if (
                (i.isScrolling && t.emit("touchMoveOpposite", n),
                void 0 === i.startMoving &&
                  ((a.currentX === a.startX && a.currentY === a.startY) ||
                    (i.startMoving = !0)),
                i.isScrolling)
              )
                return void (i.isTouched = !1);
              if (!i.startMoving) return;
              (t.allowClick = !1),
                n.preventDefault(),
                s.touchMoveStopPropagation && !s.nested && n.stopPropagation(),
                i.isMoved ||
                  (s.loop && t.loopFix(),
                  (i.startTranslate = t.getTranslate()),
                  t.setTransition(0),
                  t.animating &&
                    t.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
                  (i.allowMomentumBounce = !1),
                  !s.grabCursor ||
                    (!0 !== t.allowSlideNext && !0 !== t.allowSlidePrev) ||
                    t.setGrabCursor(!0),
                  t.emit("sliderFirstMove", n)),
                t.emit("sliderMove", n),
                (i.isMoved = !0);
              let c = t.isHorizontal() ? d : p;
              (a.diff = c),
                (c *= s.touchRatio),
                r && (c = -c),
                (t.swipeDirection = c > 0 ? "prev" : "next"),
                (i.currentTranslate = c + i.startTranslate);
              let h = !0,
                u = s.resistanceRatio;
              if (
                (s.touchReleaseOnEdges && (u = 0),
                c > 0 && i.currentTranslate > t.minTranslate()
                  ? ((h = !1),
                    s.resistance &&
                      (i.currentTranslate =
                        t.minTranslate() -
                        1 +
                        (-t.minTranslate() + i.startTranslate + c) ** u))
                  : c < 0 &&
                    i.currentTranslate < t.maxTranslate() &&
                    ((h = !1),
                    s.resistance &&
                      (i.currentTranslate =
                        t.maxTranslate() +
                        1 -
                        (t.maxTranslate() - i.startTranslate - c) ** u)),
                h && (n.preventedByNestedSwiper = !0),
                !t.allowSlideNext &&
                  "next" === t.swipeDirection &&
                  i.currentTranslate < i.startTranslate &&
                  (i.currentTranslate = i.startTranslate),
                !t.allowSlidePrev &&
                  "prev" === t.swipeDirection &&
                  i.currentTranslate > i.startTranslate &&
                  (i.currentTranslate = i.startTranslate),
                s.threshold > 0)
              ) {
                if (!(Math.abs(c) > s.threshold || i.allowThresholdMove))
                  return void (i.currentTranslate = i.startTranslate);
                if (!i.allowThresholdMove)
                  return (
                    (i.allowThresholdMove = !0),
                    (a.startX = a.currentX),
                    (a.startY = a.currentY),
                    (i.currentTranslate = i.startTranslate),
                    void (a.diff = t.isHorizontal()
                      ? a.currentX - a.startX
                      : a.currentY - a.startY)
                  );
              }
              s.followFinger &&
                ((s.freeMode ||
                  s.watchSlidesProgress ||
                  s.watchSlidesVisibility) &&
                  (t.updateActiveIndex(), t.updateSlidesClasses()),
                s.freeMode &&
                  (0 === i.velocities.length &&
                    i.velocities.push({
                      position: a[t.isHorizontal() ? "startX" : "startY"],
                      time: i.touchStartTime,
                    }),
                  i.velocities.push({
                    position: a[t.isHorizontal() ? "currentX" : "currentY"],
                    time: pe.now(),
                  })),
                t.updateProgress(i.currentTranslate),
                t.setTranslate(i.currentTranslate));
            }.bind(e)),
            (e.onTouchEnd = function (e) {
              const t = this,
                i = t.touchEventsData,
                {
                  params: s,
                  touches: a,
                  rtlTranslate: r,
                  $wrapperEl: n,
                  slidesGrid: o,
                  snapGrid: l,
                } = t;
              let d = e;
              if (
                (d.originalEvent && (d = d.originalEvent),
                i.allowTouchCallbacks && t.emit("touchEnd", d),
                (i.allowTouchCallbacks = !1),
                !i.isTouched)
              )
                return (
                  i.isMoved && s.grabCursor && t.setGrabCursor(!1),
                  (i.isMoved = !1),
                  void (i.startMoving = !1)
                );
              s.grabCursor &&
                i.isMoved &&
                i.isTouched &&
                (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) &&
                t.setGrabCursor(!1);
              const p = pe.now(),
                c = p - i.touchStartTime;
              if (
                (t.allowClick &&
                  (t.updateClickedSlide(d),
                  t.emit("tap", d),
                  c < 300 &&
                    p - i.lastClickTime > 300 &&
                    (i.clickTimeout && clearTimeout(i.clickTimeout),
                    (i.clickTimeout = pe.nextTick(() => {
                      t && !t.destroyed && t.emit("click", d);
                    }, 300))),
                  c < 300 &&
                    p - i.lastClickTime < 300 &&
                    (i.clickTimeout && clearTimeout(i.clickTimeout),
                    t.emit("doubleTap", d))),
                (i.lastClickTime = pe.now()),
                pe.nextTick(() => {
                  t.destroyed || (t.allowClick = !0);
                }),
                !i.isTouched ||
                  !i.isMoved ||
                  !t.swipeDirection ||
                  0 === a.diff ||
                  i.currentTranslate === i.startTranslate)
              )
                return (
                  (i.isTouched = !1),
                  (i.isMoved = !1),
                  void (i.startMoving = !1)
                );
              let h;
              if (
                ((i.isTouched = !1),
                (i.isMoved = !1),
                (i.startMoving = !1),
                (h = s.followFinger
                  ? r
                    ? t.translate
                    : -t.translate
                  : -i.currentTranslate),
                s.freeMode)
              ) {
                if (h < -t.minTranslate()) return void t.slideTo(t.activeIndex);
                if (h > -t.maxTranslate())
                  return void (t.slides.length < l.length
                    ? t.slideTo(l.length - 1)
                    : t.slideTo(t.slides.length - 1));
                if (s.freeModeMomentum) {
                  if (i.velocities.length > 1) {
                    const e = i.velocities.pop(),
                      a = i.velocities.pop(),
                      r = e.position - a.position,
                      n = e.time - a.time;
                    (t.velocity = r / n),
                      (t.velocity /= 2),
                      Math.abs(t.velocity) < s.freeModeMinimumVelocity &&
                        (t.velocity = 0),
                      (n > 150 || pe.now() - e.time > 300) && (t.velocity = 0);
                  } else t.velocity = 0;
                  (t.velocity *= s.freeModeMomentumVelocityRatio),
                    (i.velocities.length = 0);
                  let e = 1e3 * s.freeModeMomentumRatio;
                  const a = t.velocity * e;
                  let o = t.translate + a;
                  r && (o = -o);
                  let d,
                    p = !1;
                  const c =
                    20 * Math.abs(t.velocity) * s.freeModeMomentumBounceRatio;
                  let h;
                  if (o < t.maxTranslate())
                    s.freeModeMomentumBounce
                      ? (o + t.maxTranslate() < -c &&
                          (o = t.maxTranslate() - c),
                        (d = t.maxTranslate()),
                        (p = !0),
                        (i.allowMomentumBounce = !0))
                      : (o = t.maxTranslate()),
                      s.loop && s.centeredSlides && (h = !0);
                  else if (o > t.minTranslate())
                    s.freeModeMomentumBounce
                      ? (o - t.minTranslate() > c && (o = t.minTranslate() + c),
                        (d = t.minTranslate()),
                        (p = !0),
                        (i.allowMomentumBounce = !0))
                      : (o = t.minTranslate()),
                      s.loop && s.centeredSlides && (h = !0);
                  else if (s.freeModeSticky) {
                    let e;
                    for (let t = 0; t < l.length; t += 1)
                      if (l[t] > -o) {
                        e = t;
                        break;
                      }
                    o = -(o =
                      Math.abs(l[e] - o) < Math.abs(l[e - 1] - o) ||
                      "next" === t.swipeDirection
                        ? l[e]
                        : l[e - 1]);
                  }
                  if (
                    (h &&
                      t.once("transitionEnd", () => {
                        t.loopFix();
                      }),
                    0 !== t.velocity)
                  )
                    e = r
                      ? Math.abs((-o - t.translate) / t.velocity)
                      : Math.abs((o - t.translate) / t.velocity);
                  else if (s.freeModeSticky) return void t.slideToClosest();
                  s.freeModeMomentumBounce && p
                    ? (t.updateProgress(d),
                      t.setTransition(e),
                      t.setTranslate(o),
                      t.transitionStart(!0, t.swipeDirection),
                      (t.animating = !0),
                      n.transitionEnd(() => {
                        t &&
                          !t.destroyed &&
                          i.allowMomentumBounce &&
                          (t.emit("momentumBounce"),
                          t.setTransition(s.speed),
                          t.setTranslate(d),
                          n.transitionEnd(() => {
                            t && !t.destroyed && t.transitionEnd();
                          }));
                      }))
                    : t.velocity
                    ? (t.updateProgress(o),
                      t.setTransition(e),
                      t.setTranslate(o),
                      t.transitionStart(!0, t.swipeDirection),
                      t.animating ||
                        ((t.animating = !0),
                        n.transitionEnd(() => {
                          t && !t.destroyed && t.transitionEnd();
                        })))
                    : t.updateProgress(o),
                    t.updateActiveIndex(),
                    t.updateSlidesClasses();
                } else if (s.freeModeSticky) return void t.slideToClosest();
                return void (
                  (!s.freeModeMomentum || c >= s.longSwipesMs) &&
                  (t.updateProgress(),
                  t.updateActiveIndex(),
                  t.updateSlidesClasses())
                );
              }
              let u = 0,
                m = t.slidesSizesGrid[0];
              for (let e = 0; e < o.length; e += s.slidesPerGroup)
                void 0 !== o[e + s.slidesPerGroup]
                  ? h >= o[e] &&
                    h < o[e + s.slidesPerGroup] &&
                    ((u = e), (m = o[e + s.slidesPerGroup] - o[e]))
                  : h >= o[e] &&
                    ((u = e), (m = o[o.length - 1] - o[o.length - 2]));
              const g = (h - o[u]) / m;
              if (c > s.longSwipesMs) {
                if (!s.longSwipes) return void t.slideTo(t.activeIndex);
                "next" === t.swipeDirection &&
                  (g >= s.longSwipesRatio
                    ? t.slideTo(u + s.slidesPerGroup)
                    : t.slideTo(u)),
                  "prev" === t.swipeDirection &&
                    (g > 1 - s.longSwipesRatio
                      ? t.slideTo(u + s.slidesPerGroup)
                      : t.slideTo(u));
              } else {
                if (!s.shortSwipes) return void t.slideTo(t.activeIndex);
                "next" === t.swipeDirection && t.slideTo(u + s.slidesPerGroup),
                  "prev" === t.swipeDirection && t.slideTo(u);
              }
            }.bind(e)),
            (e.onClick = function (e) {
              const t = this;
              t.allowClick ||
                (t.params.preventClicks && e.preventDefault(),
                t.params.preventClicksPropagation &&
                  t.animating &&
                  (e.stopPropagation(), e.stopImmediatePropagation()));
            }.bind(e));
          const r = "container" === t.touchEventsTarget ? s : a,
            n = !!t.nested;
          if (ce.touch || (!ce.pointerEvents && !ce.prefixedPointerEvents)) {
            if (ce.touch) {
              const s = !(
                "touchstart" !== i.start ||
                !ce.passiveListener ||
                !t.passiveListeners
              ) && { passive: !0, capture: !1 };
              r.addEventListener(i.start, e.onTouchStart, s),
                r.addEventListener(
                  i.move,
                  e.onTouchMove,
                  ce.passiveListener ? { passive: !1, capture: n } : n
                ),
                r.addEventListener(i.end, e.onTouchEnd, s);
            }
            ((t.simulateTouch && !xe.ios && !xe.android) ||
              (t.simulateTouch && !ce.touch && xe.ios)) &&
              (r.addEventListener("mousedown", e.onTouchStart, !1),
              ae.addEventListener("mousemove", e.onTouchMove, n),
              ae.addEventListener("mouseup", e.onTouchEnd, !1));
          } else
            r.addEventListener(i.start, e.onTouchStart, !1),
              ae.addEventListener(i.move, e.onTouchMove, n),
              ae.addEventListener(i.end, e.onTouchEnd, !1);
          (t.preventClicks || t.preventClicksPropagation) &&
            r.addEventListener("click", e.onClick, !0),
            e.on(
              xe.ios || xe.android
                ? "resize orientationchange observerUpdate"
                : "resize observerUpdate",
              Ce,
              !0
            );
        },
        detachEvents: function () {
          const e = this,
            { params: t, touchEvents: i, el: s, wrapperEl: a } = e,
            r = "container" === t.touchEventsTarget ? s : a,
            n = !!t.nested;
          if (ce.touch || (!ce.pointerEvents && !ce.prefixedPointerEvents)) {
            if (ce.touch) {
              const s = !(
                "onTouchStart" !== i.start ||
                !ce.passiveListener ||
                !t.passiveListeners
              ) && { passive: !0, capture: !1 };
              r.removeEventListener(i.start, e.onTouchStart, s),
                r.removeEventListener(i.move, e.onTouchMove, n),
                r.removeEventListener(i.end, e.onTouchEnd, s);
            }
            ((t.simulateTouch && !xe.ios && !xe.android) ||
              (t.simulateTouch && !ce.touch && xe.ios)) &&
              (r.removeEventListener("mousedown", e.onTouchStart, !1),
              ae.removeEventListener("mousemove", e.onTouchMove, n),
              ae.removeEventListener("mouseup", e.onTouchEnd, !1));
          } else
            r.removeEventListener(i.start, e.onTouchStart, !1),
              ae.removeEventListener(i.move, e.onTouchMove, n),
              ae.removeEventListener(i.end, e.onTouchEnd, !1);
          (t.preventClicks || t.preventClicksPropagation) &&
            r.removeEventListener("click", e.onClick, !0),
            e.off(
              xe.ios || xe.android
                ? "resize orientationchange observerUpdate"
                : "resize observerUpdate",
              Ce
            );
        },
      },
      breakpoints: {
        setBreakpoint: function () {
          const e = this,
            {
              activeIndex: t,
              initialized: i,
              loopedSlides: s = 0,
              params: a,
            } = e,
            r = a.breakpoints;
          if (!r || (r && 0 === Object.keys(r).length)) return;
          const n = e.getBreakpoint(r);
          if (n && e.currentBreakpoint !== n) {
            const o = n in r ? r[n] : void 0;
            o &&
              ["slidesPerView", "spaceBetween", "slidesPerGroup"].forEach(
                (e) => {
                  const t = o[e];
                  void 0 !== t &&
                    (o[e] =
                      "slidesPerView" !== e || ("AUTO" !== t && "auto" !== t)
                        ? "slidesPerView" === e
                          ? parseFloat(t)
                          : parseInt(t, 10)
                        : "auto");
                }
              );
            const l = o || e.originalParams,
              d = l.direction && l.direction !== a.direction,
              p = a.loop && (l.slidesPerView !== a.slidesPerView || d);
            d && i && e.changeDirection(),
              pe.extend(e.params, l),
              pe.extend(e, {
                allowTouchMove: e.params.allowTouchMove,
                allowSlideNext: e.params.allowSlideNext,
                allowSlidePrev: e.params.allowSlidePrev,
              }),
              (e.currentBreakpoint = n),
              p &&
                i &&
                (e.loopDestroy(),
                e.loopCreate(),
                e.updateSlides(),
                e.slideTo(t - s + e.loopedSlides, 0, !1)),
              e.emit("breakpoint", l);
          }
        },
        getBreakpoint: function (e) {
          const t = this;
          if (!e) return;
          let i = !1;
          const s = [];
          Object.keys(e).forEach((e) => {
            s.push(e);
          }),
            s.sort((e, t) => parseInt(e, 10) - parseInt(t, 10));
          for (let e = 0; e < s.length; e += 1) {
            const a = s[e];
            t.params.breakpointsInverse
              ? a <= re.innerWidth && (i = a)
              : a >= re.innerWidth && !i && (i = a);
          }
          return i || "max";
        },
      },
      checkOverflow: {
        checkOverflow: function () {
          const e = this,
            t = e.isLocked;
          (e.isLocked = 1 === e.snapGrid.length),
            (e.allowSlideNext = !e.isLocked),
            (e.allowSlidePrev = !e.isLocked),
            t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock"),
            t && t !== e.isLocked && ((e.isEnd = !1), e.navigation.update());
        },
      },
      classes: {
        addClasses: function () {
          const { classNames: e, params: t, rtl: i, $el: s } = this,
            a = [];
          a.push("initialized"),
            a.push(t.direction),
            t.freeMode && a.push("free-mode"),
            ce.flexbox || a.push("no-flexbox"),
            t.autoHeight && a.push("autoheight"),
            i && a.push("rtl"),
            t.slidesPerColumn > 1 && a.push("multirow"),
            xe.android && a.push("android"),
            xe.ios && a.push("ios"),
            (he.isIE || he.isEdge) &&
              (ce.pointerEvents || ce.prefixedPointerEvents) &&
              a.push(`wp8-${t.direction}`),
            a.forEach((i) => {
              e.push(t.containerModifierClass + i);
            }),
            s.addClass(e.join(" "));
        },
        removeClasses: function () {
          const { $el: e, classNames: t } = this;
          e.removeClass(t.join(" "));
        },
      },
      images: {
        loadImage: function (e, t, i, s, a, r) {
          let n;
          function o() {
            r && r();
          }
          e.complete && a
            ? o()
            : t
            ? (((n = new re.Image()).onload = o),
              (n.onerror = o),
              s && (n.sizes = s),
              i && (n.srcset = i),
              t && (n.src = t))
            : o();
        },
        preloadImages: function () {
          const e = this;
          function t() {
            null != e &&
              e &&
              !e.destroyed &&
              (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
              e.imagesLoaded === e.imagesToLoad.length &&
                (e.params.updateOnImagesReady && e.update(),
                e.emit("imagesReady")));
          }
          e.imagesToLoad = e.$el.find("img");
          for (let i = 0; i < e.imagesToLoad.length; i += 1) {
            const s = e.imagesToLoad[i];
            e.loadImage(
              s,
              s.currentSrc || s.getAttribute("src"),
              s.srcset || s.getAttribute("srcset"),
              s.sizes || s.getAttribute("sizes"),
              !0,
              t
            );
          }
        },
      },
    },
    Te = {};
  class ke extends ue {
    constructor(...e) {
      let t, i;
      1 === e.length && e[0].constructor && e[0].constructor === Object
        ? (i = e[0])
        : ([t, i] = e),
        i || (i = {}),
        (i = pe.extend({}, i)),
        t && !i.el && (i.el = t),
        super(i),
        Object.keys(Se).forEach((e) => {
          Object.keys(Se[e]).forEach((t) => {
            ke.prototype[t] || (ke.prototype[t] = Se[e][t]);
          });
        });
      const s = this;
      void 0 === s.modules && (s.modules = {}),
        Object.keys(s.modules).forEach((e) => {
          const t = s.modules[e];
          if (t.params) {
            const e = Object.keys(t.params)[0],
              s = t.params[e];
            if ("object" != typeof s || null === s) return;
            if (!(e in i && "enabled" in s)) return;
            !0 === i[e] && (i[e] = { enabled: !0 }),
              "object" != typeof i[e] ||
                "enabled" in i[e] ||
                (i[e].enabled = !0),
              i[e] || (i[e] = { enabled: !1 });
          }
        });
      const a = pe.extend({}, Ee);
      s.useModulesParams(a),
        (s.params = pe.extend({}, a, Te, i)),
        (s.originalParams = pe.extend({}, s.params)),
        (s.passedParams = pe.extend({}, i)),
        (s.$ = oe);
      const r = oe(s.params.el);
      if (!(t = r[0])) return;
      if (r.length > 1) {
        const e = [];
        return (
          r.each((t, s) => {
            const a = pe.extend({}, i, { el: s });
            e.push(new ke(a));
          }),
          e
        );
      }
      (t.swiper = s), r.data("swiper", s);
      const n = r.children(`.${s.params.wrapperClass}`);
      return (
        pe.extend(s, {
          $el: r,
          el: t,
          $wrapperEl: n,
          wrapperEl: n[0],
          classNames: [],
          slides: oe(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: () => "horizontal" === s.params.direction,
          isVertical: () => "vertical" === s.params.direction,
          rtl: "rtl" === t.dir.toLowerCase() || "rtl" === r.css("direction"),
          rtlTranslate:
            "horizontal" === s.params.direction &&
            ("rtl" === t.dir.toLowerCase() || "rtl" === r.css("direction")),
          wrongRTL: "-webkit-box" === n.css("display"),
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: s.params.allowSlideNext,
          allowSlidePrev: s.params.allowSlidePrev,
          touchEvents: (function () {
            const e = ["touchstart", "touchmove", "touchend"];
            let t = ["mousedown", "mousemove", "mouseup"];
            return (
              ce.pointerEvents
                ? (t = ["pointerdown", "pointermove", "pointerup"])
                : ce.prefixedPointerEvents &&
                  (t = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]),
              (s.touchEventsTouch = { start: e[0], move: e[1], end: e[2] }),
              (s.touchEventsDesktop = { start: t[0], move: t[1], end: t[2] }),
              ce.touch || !s.params.simulateTouch
                ? s.touchEventsTouch
                : s.touchEventsDesktop
            );
          })(),
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            formElements: "input, select, option, textarea, button, video",
            lastClickTime: pe.now(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            isTouchEvent: void 0,
            startMoving: void 0,
          },
          allowClick: !0,
          allowTouchMove: s.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        s.useModules(),
        s.params.init && s.init(),
        s
      );
    }
    slidesPerViewDynamic() {
      const {
        params: e,
        slides: t,
        slidesGrid: i,
        size: s,
        activeIndex: a,
      } = this;
      let r = 1;
      if (e.centeredSlides) {
        let e,
          i = t[a].swiperSlideSize;
        for (let n = a + 1; n < t.length; n += 1)
          t[n] && !e && ((r += 1), (i += t[n].swiperSlideSize) > s && (e = !0));
        for (let n = a - 1; n >= 0; n -= 1)
          t[n] && !e && ((r += 1), (i += t[n].swiperSlideSize) > s && (e = !0));
      } else for (let e = a + 1; e < t.length; e += 1) i[e] - i[a] < s && (r += 1);
      return r;
    }
    update() {
      const e = this;
      if (!e || e.destroyed) return;
      const { snapGrid: t, params: i } = e;
      function s() {
        const t = e.rtlTranslate ? -1 * e.translate : e.translate,
          i = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
        e.setTranslate(i), e.updateActiveIndex(), e.updateSlidesClasses();
      }
      let a;
      i.breakpoints && e.setBreakpoint(),
        e.updateSize(),
        e.updateSlides(),
        e.updateProgress(),
        e.updateSlidesClasses(),
        e.params.freeMode
          ? (s(), e.params.autoHeight && e.updateAutoHeight())
          : (a =
              ("auto" === e.params.slidesPerView ||
                e.params.slidesPerView > 1) &&
              e.isEnd &&
              !e.params.centeredSlides
                ? e.slideTo(e.slides.length - 1, 0, !1, !0)
                : e.slideTo(e.activeIndex, 0, !1, !0)) || s(),
        i.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
        e.emit("update");
    }
    changeDirection(e, t = !0) {
      const i = this,
        s = i.params.direction;
      return (
        e || (e = "horizontal" === s ? "vertical" : "horizontal"),
        e === s || ("horizontal" !== e && "vertical" !== e)
          ? i
          : ("vertical" === s &&
              (i.$el
                .removeClass(
                  `${i.params.containerModifierClass}vertical wp8-vertical`
                )
                .addClass(`${i.params.containerModifierClass}${e}`),
              (he.isIE || he.isEdge) &&
                (ce.pointerEvents || ce.prefixedPointerEvents) &&
                i.$el.addClass(`${i.params.containerModifierClass}wp8-${e}`)),
            "horizontal" === s &&
              (i.$el
                .removeClass(
                  `${i.params.containerModifierClass}horizontal wp8-horizontal`
                )
                .addClass(`${i.params.containerModifierClass}${e}`),
              (he.isIE || he.isEdge) &&
                (ce.pointerEvents || ce.prefixedPointerEvents) &&
                i.$el.addClass(`${i.params.containerModifierClass}wp8-${e}`)),
            (i.params.direction = e),
            i.slides.each((t, i) => {
              "vertical" === e ? (i.style.width = "") : (i.style.height = "");
            }),
            i.emit("changeDirection"),
            t && i.update(),
            i)
      );
    }
    init() {
      const e = this;
      e.initialized ||
        (e.emit("beforeInit"),
        e.params.breakpoints && e.setBreakpoint(),
        e.addClasses(),
        e.params.loop && e.loopCreate(),
        e.updateSize(),
        e.updateSlides(),
        e.params.watchOverflow && e.checkOverflow(),
        e.params.grabCursor && e.setGrabCursor(),
        e.params.preloadImages && e.preloadImages(),
        e.params.loop
          ? e.slideTo(
              e.params.initialSlide + e.loopedSlides,
              0,
              e.params.runCallbacksOnInit
            )
          : e.slideTo(e.params.initialSlide, 0, e.params.runCallbacksOnInit),
        e.attachEvents(),
        (e.initialized = !0),
        e.emit("init"));
    }
    destroy(e = !0, t = !0) {
      const i = this,
        { params: s, $el: a, $wrapperEl: r, slides: n } = i;
      return void 0 === i.params || i.destroyed
        ? null
        : (i.emit("beforeDestroy"),
          (i.initialized = !1),
          i.detachEvents(),
          s.loop && i.loopDestroy(),
          t &&
            (i.removeClasses(),
            a.removeAttr("style"),
            r.removeAttr("style"),
            n &&
              n.length &&
              n
                .removeClass(
                  [
                    s.slideVisibleClass,
                    s.slideActiveClass,
                    s.slideNextClass,
                    s.slidePrevClass,
                  ].join(" ")
                )
                .removeAttr("style")
                .removeAttr("data-swiper-slide-index")
                .removeAttr("data-swiper-column")
                .removeAttr("data-swiper-row")),
          i.emit("destroy"),
          Object.keys(i.eventsListeners).forEach((e) => {
            i.off(e);
          }),
          !1 !== e &&
            ((i.$el[0].swiper = null),
            i.$el.data("swiper", null),
            pe.deleteProps(i)),
          (i.destroyed = !0),
          null);
    }
    static extendDefaults(e) {
      pe.extend(Te, e);
    }
    static get extendedDefaults() {
      return Te;
    }
    static get defaults() {
      return Ee;
    }
    static get Class() {
      return ue;
    }
    static get $() {
      return oe;
    }
  }
  var $e = { name: "device", proto: { device: xe }, static: { device: xe } },
    Me = { name: "support", proto: { support: ce }, static: { support: ce } },
    Pe = { name: "browser", proto: { browser: he }, static: { browser: he } },
    De = {
      name: "resize",
      create() {
        const e = this;
        pe.extend(e, {
          resize: {
            resizeHandler() {
              e &&
                !e.destroyed &&
                e.initialized &&
                (e.emit("beforeResize"), e.emit("resize"));
            },
            orientationChangeHandler() {
              e && !e.destroyed && e.initialized && e.emit("orientationchange");
            },
          },
        });
      },
      on: {
        init() {
          re.addEventListener("resize", this.resize.resizeHandler),
            re.addEventListener(
              "orientationchange",
              this.resize.orientationChangeHandler
            );
        },
        destroy() {
          re.removeEventListener("resize", this.resize.resizeHandler),
            re.removeEventListener(
              "orientationchange",
              this.resize.orientationChangeHandler
            );
        },
      },
    };
  const ze = {
    func: re.MutationObserver || re.WebkitMutationObserver,
    attach(e, t = {}) {
      const i = this,
        s = new (0, ze.func)((e) => {
          if (1 === e.length) return void i.emit("observerUpdate", e[0]);
          const t = function () {
            i.emit("observerUpdate", e[0]);
          };
          re.requestAnimationFrame
            ? re.requestAnimationFrame(t)
            : re.setTimeout(t, 0);
        });
      s.observe(e, {
        attributes: void 0 === t.attributes || t.attributes,
        childList: void 0 === t.childList || t.childList,
        characterData: void 0 === t.characterData || t.characterData,
      }),
        i.observer.observers.push(s);
    },
    init() {
      const e = this;
      if (ce.observer && e.params.observer) {
        if (e.params.observeParents) {
          const t = e.$el.parents();
          for (let i = 0; i < t.length; i += 1) e.observer.attach(t[i]);
        }
        e.observer.attach(e.$el[0], {
          childList: e.params.observeSlideChildren,
        }),
          e.observer.attach(e.$wrapperEl[0], { attributes: !1 });
      }
    },
    destroy() {
      this.observer.observers.forEach((e) => {
        e.disconnect();
      }),
        (this.observer.observers = []);
    },
  };
  var Le = {
    name: "observer",
    params: { observer: !1, observeParents: !1, observeSlideChildren: !1 },
    create() {
      pe.extend(this, {
        observer: {
          init: ze.init.bind(this),
          attach: ze.attach.bind(this),
          destroy: ze.destroy.bind(this),
          observers: [],
        },
      });
    },
    on: {
      init() {
        this.observer.init();
      },
      destroy() {
        this.observer.destroy();
      },
    },
  };
  const _e = {
    update(e) {
      const t = this,
        { slidesPerView: i, slidesPerGroup: s, centeredSlides: a } = t.params,
        { addSlidesBefore: r, addSlidesAfter: n } = t.params.virtual,
        {
          from: o,
          to: l,
          slides: d,
          slidesGrid: p,
          renderSlide: c,
          offset: h,
        } = t.virtual;
      t.updateActiveIndex();
      const u = t.activeIndex || 0;
      let m, g, f;
      (m = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top"),
        a
          ? ((g = Math.floor(i / 2) + s + r), (f = Math.floor(i / 2) + s + n))
          : ((g = i + (s - 1) + r), (f = s + n));
      const v = Math.max((u || 0) - f, 0),
        w = Math.min((u || 0) + g, d.length - 1),
        b = (t.slidesGrid[v] || 0) - (t.slidesGrid[0] || 0);
      function y() {
        t.updateSlides(),
          t.updateProgress(),
          t.updateSlidesClasses(),
          t.lazy && t.params.lazy.enabled && t.lazy.load();
      }
      if (
        (pe.extend(t.virtual, {
          from: v,
          to: w,
          offset: b,
          slidesGrid: t.slidesGrid,
        }),
        o === v && l === w && !e)
      )
        return (
          t.slidesGrid !== p && b !== h && t.slides.css(m, `${b}px`),
          void t.updateProgress()
        );
      if (t.params.virtual.renderExternal)
        return (
          t.params.virtual.renderExternal.call(t, {
            offset: b,
            from: v,
            to: w,
            slides: (function () {
              const e = [];
              for (let t = v; t <= w; t += 1) e.push(d[t]);
              return e;
            })(),
          }),
          void y()
        );
      const x = [],
        C = [];
      if (e) t.$wrapperEl.find(`.${t.params.slideClass}`).remove();
      else
        for (let e = o; e <= l; e += 1)
          (e < v || e > w) &&
            t.$wrapperEl
              .find(`.${t.params.slideClass}[data-swiper-slide-index="${e}"]`)
              .remove();
      for (let t = 0; t < d.length; t += 1)
        t >= v &&
          t <= w &&
          (void 0 === l || e
            ? C.push(t)
            : (t > l && C.push(t), t < o && x.push(t)));
      C.forEach((e) => {
        t.$wrapperEl.append(c(d[e], e));
      }),
        x
          .sort((e, t) => t - e)
          .forEach((e) => {
            t.$wrapperEl.prepend(c(d[e], e));
          }),
        t.$wrapperEl.children(".swiper-slide").css(m, `${b}px`),
        y();
    },
    renderSlide(e, t) {
      const i = this,
        s = i.params.virtual;
      if (s.cache && i.virtual.cache[t]) return i.virtual.cache[t];
      const a = s.renderSlide
        ? oe(s.renderSlide.call(i, e, t))
        : oe(
            `<div class="${i.params.slideClass}" data-swiper-slide-index="${t}">${e}</div>`
          );
      return (
        a.attr("data-swiper-slide-index") ||
          a.attr("data-swiper-slide-index", t),
        s.cache && (i.virtual.cache[t] = a),
        a
      );
    },
    appendSlide(e) {
      const t = this;
      if ("object" == typeof e && "length" in e)
        for (let i = 0; i < e.length; i += 1)
          e[i] && t.virtual.slides.push(e[i]);
      else t.virtual.slides.push(e);
      t.virtual.update(!0);
    },
    prependSlide(e) {
      const t = this,
        i = t.activeIndex;
      let s = i + 1,
        a = 1;
      if (Array.isArray(e)) {
        for (let i = 0; i < e.length; i += 1)
          e[i] && t.virtual.slides.unshift(e[i]);
        (s = i + e.length), (a = e.length);
      } else t.virtual.slides.unshift(e);
      if (t.params.virtual.cache) {
        const e = t.virtual.cache,
          i = {};
        Object.keys(e).forEach((t) => {
          i[parseInt(t, 10) + a] = e[t];
        }),
          (t.virtual.cache = i);
      }
      t.virtual.update(!0), t.slideTo(s, 0);
    },
    removeSlide(e) {
      const t = this;
      if (null == e) return;
      let i = t.activeIndex;
      if (Array.isArray(e))
        for (let s = e.length - 1; s >= 0; s -= 1)
          t.virtual.slides.splice(e[s], 1),
            t.params.virtual.cache && delete t.virtual.cache[e[s]],
            e[s] < i && (i -= 1),
            (i = Math.max(i, 0));
      else
        t.virtual.slides.splice(e, 1),
          t.params.virtual.cache && delete t.virtual.cache[e],
          e < i && (i -= 1),
          (i = Math.max(i, 0));
      t.virtual.update(!0), t.slideTo(i, 0);
    },
    removeAllSlides() {
      const e = this;
      (e.virtual.slides = []),
        e.params.virtual.cache && (e.virtual.cache = {}),
        e.virtual.update(!0),
        e.slideTo(0, 0);
    },
  };
  var Ae = {
    name: "virtual",
    params: {
      virtual: {
        enabled: !1,
        slides: [],
        cache: !0,
        renderSlide: null,
        renderExternal: null,
        addSlidesBefore: 0,
        addSlidesAfter: 0,
      },
    },
    create() {
      pe.extend(this, {
        virtual: {
          update: _e.update.bind(this),
          appendSlide: _e.appendSlide.bind(this),
          prependSlide: _e.prependSlide.bind(this),
          removeSlide: _e.removeSlide.bind(this),
          removeAllSlides: _e.removeAllSlides.bind(this),
          renderSlide: _e.renderSlide.bind(this),
          slides: this.params.virtual.slides,
          cache: {},
        },
      });
    },
    on: {
      beforeInit() {
        const e = this;
        if (!e.params.virtual.enabled) return;
        e.classNames.push(`${e.params.containerModifierClass}virtual`);
        const t = { watchSlidesProgress: !0 };
        pe.extend(e.params, t),
          pe.extend(e.originalParams, t),
          e.params.initialSlide || e.virtual.update();
      },
      setTranslate() {
        this.params.virtual.enabled && this.virtual.update();
      },
    },
  };
  const Ie = {
    handle(e) {
      const t = this,
        { rtlTranslate: i } = t;
      let s = e;
      s.originalEvent && (s = s.originalEvent);
      const a = s.keyCode || s.charCode;
      if (
        !t.allowSlideNext &&
        ((t.isHorizontal() && 39 === a) || (t.isVertical() && 40 === a))
      )
        return !1;
      if (
        !t.allowSlidePrev &&
        ((t.isHorizontal() && 37 === a) || (t.isVertical() && 38 === a))
      )
        return !1;
      if (
        !(
          s.shiftKey ||
          s.altKey ||
          s.ctrlKey ||
          s.metaKey ||
          (ae.activeElement &&
            ae.activeElement.nodeName &&
            ("input" === ae.activeElement.nodeName.toLowerCase() ||
              "textarea" === ae.activeElement.nodeName.toLowerCase()))
        )
      ) {
        if (
          t.params.keyboard.onlyInViewport &&
          (37 === a || 39 === a || 38 === a || 40 === a)
        ) {
          let e = !1;
          if (
            t.$el.parents(`.${t.params.slideClass}`).length > 0 &&
            0 === t.$el.parents(`.${t.params.slideActiveClass}`).length
          )
            return;
          const s = re.innerWidth,
            a = re.innerHeight,
            r = t.$el.offset();
          i && (r.left -= t.$el[0].scrollLeft);
          const n = [
            [r.left, r.top],
            [r.left + t.width, r.top],
            [r.left, r.top + t.height],
            [r.left + t.width, r.top + t.height],
          ];
          for (let t = 0; t < n.length; t += 1) {
            const i = n[t];
            i[0] >= 0 && i[0] <= s && i[1] >= 0 && i[1] <= a && (e = !0);
          }
          if (!e) return;
        }
        t.isHorizontal()
          ? ((37 !== a && 39 !== a) ||
              (s.preventDefault ? s.preventDefault() : (s.returnValue = !1)),
            ((39 === a && !i) || (37 === a && i)) && t.slideNext(),
            ((37 === a && !i) || (39 === a && i)) && t.slidePrev())
          : ((38 !== a && 40 !== a) ||
              (s.preventDefault ? s.preventDefault() : (s.returnValue = !1)),
            40 === a && t.slideNext(),
            38 === a && t.slidePrev()),
          t.emit("keyPress", a);
      }
    },
    enable() {
      this.keyboard.enabled ||
        (oe(ae).on("keydown", this.keyboard.handle),
        (this.keyboard.enabled = !0));
    },
    disable() {
      this.keyboard.enabled &&
        (oe(ae).off("keydown", this.keyboard.handle),
        (this.keyboard.enabled = !1));
    },
  };
  var Ne = {
    name: "keyboard",
    params: { keyboard: { enabled: !1, onlyInViewport: !0 } },
    create() {
      pe.extend(this, {
        keyboard: {
          enabled: !1,
          enable: Ie.enable.bind(this),
          disable: Ie.disable.bind(this),
          handle: Ie.handle.bind(this),
        },
      });
    },
    on: {
      init() {
        const e = this;
        e.params.keyboard.enabled && e.keyboard.enable();
      },
      destroy() {
        const e = this;
        e.keyboard.enabled && e.keyboard.disable();
      },
    },
  };
  const Oe = {
    lastScrollTime: pe.now(),
    event:
      re.navigator.userAgent.indexOf("firefox") > -1
        ? "DOMMouseScroll"
        : (function () {
            let e = "onwheel" in ae;
            if (!e) {
              const t = ae.createElement("div");
              t.setAttribute("onwheel", "return;"),
                (e = "function" == typeof t.onwheel);
            }
            return (
              !e &&
                ae.implementation &&
                ae.implementation.hasFeature &&
                !0 !== ae.implementation.hasFeature("", "") &&
                (e = ae.implementation.hasFeature("Events.wheel", "3.0")),
              e
            );
          })()
        ? "wheel"
        : "mousewheel",
    normalize(e) {
      let t = 0,
        i = 0,
        s = 0,
        a = 0;
      return (
        "detail" in e && (i = e.detail),
        "wheelDelta" in e && (i = -e.wheelDelta / 120),
        "wheelDeltaY" in e && (i = -e.wheelDeltaY / 120),
        "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120),
        "axis" in e && e.axis === e.HORIZONTAL_AXIS && ((t = i), (i = 0)),
        (s = 10 * t),
        (a = 10 * i),
        "deltaY" in e && (a = e.deltaY),
        "deltaX" in e && (s = e.deltaX),
        (s || a) &&
          e.deltaMode &&
          (1 === e.deltaMode
            ? ((s *= 40), (a *= 40))
            : ((s *= 800), (a *= 800))),
        s && !t && (t = s < 1 ? -1 : 1),
        a && !i && (i = a < 1 ? -1 : 1),
        { spinX: t, spinY: i, pixelX: s, pixelY: a }
      );
    },
    handleMouseEnter() {
      this.mouseEntered = !0;
    },
    handleMouseLeave() {
      this.mouseEntered = !1;
    },
    handle(e) {
      let t = e;
      const i = this,
        s = i.params.mousewheel;
      if (!i.mouseEntered && !s.releaseOnEdges) return !0;
      t.originalEvent && (t = t.originalEvent);
      let a = 0;
      const r = i.rtlTranslate ? -1 : 1,
        n = Oe.normalize(t);
      if (s.forceToAxis)
        if (i.isHorizontal()) {
          if (!(Math.abs(n.pixelX) > Math.abs(n.pixelY))) return !0;
          a = n.pixelX * r;
        } else {
          if (!(Math.abs(n.pixelY) > Math.abs(n.pixelX))) return !0;
          a = n.pixelY;
        }
      else
        a = Math.abs(n.pixelX) > Math.abs(n.pixelY) ? -n.pixelX * r : -n.pixelY;
      if (0 === a) return !0;
      if ((s.invert && (a = -a), i.params.freeMode)) {
        i.params.loop && i.loopFix();
        let e = i.getTranslate() + a * s.sensitivity;
        const r = i.isBeginning,
          n = i.isEnd;
        if (
          (e >= i.minTranslate() && (e = i.minTranslate()),
          e <= i.maxTranslate() && (e = i.maxTranslate()),
          i.setTransition(0),
          i.setTranslate(e),
          i.updateProgress(),
          i.updateActiveIndex(),
          i.updateSlidesClasses(),
          ((!r && i.isBeginning) || (!n && i.isEnd)) && i.updateSlidesClasses(),
          i.params.freeModeSticky &&
            (clearTimeout(i.mousewheel.timeout),
            (i.mousewheel.timeout = pe.nextTick(() => {
              i.slideToClosest();
            }, 300))),
          i.emit("scroll", t),
          i.params.autoplay &&
            i.params.autoplayDisableOnInteraction &&
            i.autoplay.stop(),
          e === i.minTranslate() || e === i.maxTranslate())
        )
          return !0;
      } else {
        if (pe.now() - i.mousewheel.lastScrollTime > 60)
          if (a < 0)
            if ((i.isEnd && !i.params.loop) || i.animating) {
              if (s.releaseOnEdges) return !0;
            } else i.slideNext(), i.emit("scroll", t);
          else if ((i.isBeginning && !i.params.loop) || i.animating) {
            if (s.releaseOnEdges) return !0;
          } else i.slidePrev(), i.emit("scroll", t);
        i.mousewheel.lastScrollTime = new re.Date().getTime();
      }
      return t.preventDefault ? t.preventDefault() : (t.returnValue = !1), !1;
    },
    enable() {
      const e = this;
      if (!Oe.event) return !1;
      if (e.mousewheel.enabled) return !1;
      let t = e.$el;
      return (
        "container" !== e.params.mousewheel.eventsTarged &&
          (t = oe(e.params.mousewheel.eventsTarged)),
        t.on("mouseenter", e.mousewheel.handleMouseEnter),
        t.on("mouseleave", e.mousewheel.handleMouseLeave),
        t.on(Oe.event, e.mousewheel.handle),
        (e.mousewheel.enabled = !0),
        !0
      );
    },
    disable() {
      const e = this;
      if (!Oe.event) return !1;
      if (!e.mousewheel.enabled) return !1;
      let t = e.$el;
      return (
        "container" !== e.params.mousewheel.eventsTarged &&
          (t = oe(e.params.mousewheel.eventsTarged)),
        t.off(Oe.event, e.mousewheel.handle),
        (e.mousewheel.enabled = !1),
        !0
      );
    },
  };
  const Fe = {
    update() {
      const e = this,
        t = e.params.navigation;
      if (e.params.loop) return;
      const { $nextEl: i, $prevEl: s } = e.navigation;
      s &&
        s.length > 0 &&
        (e.isBeginning
          ? s.addClass(t.disabledClass)
          : s.removeClass(t.disabledClass),
        s[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](
          t.lockClass
        )),
        i &&
          i.length > 0 &&
          (e.isEnd
            ? i.addClass(t.disabledClass)
            : i.removeClass(t.disabledClass),
          i[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](
            t.lockClass
          ));
    },
    onPrevClick(e) {
      e.preventDefault(),
        (this.isBeginning && !this.params.loop) || this.slidePrev();
    },
    onNextClick(e) {
      e.preventDefault(), (this.isEnd && !this.params.loop) || this.slideNext();
    },
    init() {
      const e = this,
        t = e.params.navigation;
      if (!t.nextEl && !t.prevEl) return;
      let i, s;
      t.nextEl &&
        ((i = oe(t.nextEl)),
        e.params.uniqueNavElements &&
          "string" == typeof t.nextEl &&
          i.length > 1 &&
          1 === e.$el.find(t.nextEl).length &&
          (i = e.$el.find(t.nextEl))),
        t.prevEl &&
          ((s = oe(t.prevEl)),
          e.params.uniqueNavElements &&
            "string" == typeof t.prevEl &&
            s.length > 1 &&
            1 === e.$el.find(t.prevEl).length &&
            (s = e.$el.find(t.prevEl))),
        i && i.length > 0 && i.on("click", e.navigation.onNextClick),
        s && s.length > 0 && s.on("click", e.navigation.onPrevClick),
        pe.extend(e.navigation, {
          $nextEl: i,
          nextEl: i && i[0],
          $prevEl: s,
          prevEl: s && s[0],
        });
    },
    destroy() {
      const e = this,
        { $nextEl: t, $prevEl: i } = e.navigation;
      t &&
        t.length &&
        (t.off("click", e.navigation.onNextClick),
        t.removeClass(e.params.navigation.disabledClass)),
        i &&
          i.length &&
          (i.off("click", e.navigation.onPrevClick),
          i.removeClass(e.params.navigation.disabledClass));
    },
  };
  const He = {
    update() {
      const e = this,
        t = e.rtl,
        i = e.params.pagination;
      if (
        !i.el ||
        !e.pagination.el ||
        !e.pagination.$el ||
        0 === e.pagination.$el.length
      )
        return;
      const s =
          e.virtual && e.params.virtual.enabled
            ? e.virtual.slides.length
            : e.slides.length,
        a = e.pagination.$el;
      let r;
      const n = e.params.loop
        ? Math.ceil((s - 2 * e.loopedSlides) / e.params.slidesPerGroup)
        : e.snapGrid.length;
      if (
        (e.params.loop
          ? ((r = Math.ceil(
              (e.activeIndex - e.loopedSlides) / e.params.slidesPerGroup
            )) >
              s - 1 - 2 * e.loopedSlides && (r -= s - 2 * e.loopedSlides),
            r > n - 1 && (r -= n),
            r < 0 && "bullets" !== e.params.paginationType && (r = n + r))
          : (r = void 0 !== e.snapIndex ? e.snapIndex : e.activeIndex || 0),
        "bullets" === i.type &&
          e.pagination.bullets &&
          e.pagination.bullets.length > 0)
      ) {
        const s = e.pagination.bullets;
        let n, o, l;
        if (
          (i.dynamicBullets &&
            ((e.pagination.bulletSize = s
              .eq(0)
              [e.isHorizontal() ? "outerWidth" : "outerHeight"](!0)),
            a.css(
              e.isHorizontal() ? "width" : "height",
              `${e.pagination.bulletSize * (i.dynamicMainBullets + 4)}px`
            ),
            i.dynamicMainBullets > 1 &&
              void 0 !== e.previousIndex &&
              ((e.pagination.dynamicBulletIndex += r - e.previousIndex),
              e.pagination.dynamicBulletIndex > i.dynamicMainBullets - 1
                ? (e.pagination.dynamicBulletIndex = i.dynamicMainBullets - 1)
                : e.pagination.dynamicBulletIndex < 0 &&
                  (e.pagination.dynamicBulletIndex = 0)),
            (n = r - e.pagination.dynamicBulletIndex),
            (l =
              ((o = n + (Math.min(s.length, i.dynamicMainBullets) - 1)) + n) /
              2)),
          s.removeClass(
            `${i.bulletActiveClass} ${i.bulletActiveClass}-next ${i.bulletActiveClass}-next-next ${i.bulletActiveClass}-prev ${i.bulletActiveClass}-prev-prev ${i.bulletActiveClass}-main`
          ),
          a.length > 1)
        )
          s.each((e, t) => {
            const s = oe(t),
              a = s.index();
            a === r && s.addClass(i.bulletActiveClass),
              i.dynamicBullets &&
                (a >= n && a <= o && s.addClass(`${i.bulletActiveClass}-main`),
                a === n &&
                  s
                    .prev()
                    .addClass(`${i.bulletActiveClass}-prev`)
                    .prev()
                    .addClass(`${i.bulletActiveClass}-prev-prev`),
                a === o &&
                  s
                    .next()
                    .addClass(`${i.bulletActiveClass}-next`)
                    .next()
                    .addClass(`${i.bulletActiveClass}-next-next`));
          });
        else {
          if ((s.eq(r).addClass(i.bulletActiveClass), i.dynamicBullets)) {
            const e = s.eq(n),
              t = s.eq(o);
            for (let e = n; e <= o; e += 1)
              s.eq(e).addClass(`${i.bulletActiveClass}-main`);
            e
              .prev()
              .addClass(`${i.bulletActiveClass}-prev`)
              .prev()
              .addClass(`${i.bulletActiveClass}-prev-prev`),
              t
                .next()
                .addClass(`${i.bulletActiveClass}-next`)
                .next()
                .addClass(`${i.bulletActiveClass}-next-next`);
          }
        }
        if (i.dynamicBullets) {
          const a = Math.min(s.length, i.dynamicMainBullets + 4),
            r =
              (e.pagination.bulletSize * a - e.pagination.bulletSize) / 2 -
              l * e.pagination.bulletSize,
            n = t ? "right" : "left";
          s.css(e.isHorizontal() ? n : "top", `${r}px`);
        }
      }
      if (
        ("fraction" === i.type &&
          (a.find(`.${i.currentClass}`).text(i.formatFractionCurrent(r + 1)),
          a.find(`.${i.totalClass}`).text(i.formatFractionTotal(n))),
        "progressbar" === i.type)
      ) {
        let t;
        t = i.progressbarOpposite
          ? e.isHorizontal()
            ? "vertical"
            : "horizontal"
          : e.isHorizontal()
          ? "horizontal"
          : "vertical";
        const s = (r + 1) / n;
        let o = 1,
          l = 1;
        "horizontal" === t ? (o = s) : (l = s),
          a
            .find(`.${i.progressbarFillClass}`)
            .transform(`translate3d(0,0,0) scaleX(${o}) scaleY(${l})`)
            .transition(e.params.speed);
      }
      "custom" === i.type && i.renderCustom
        ? (a.html(i.renderCustom(e, r + 1, n)),
          e.emit("paginationRender", e, a[0]))
        : e.emit("paginationUpdate", e, a[0]),
        a[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](
          i.lockClass
        );
    },
    render() {
      const e = this,
        t = e.params.pagination;
      if (
        !t.el ||
        !e.pagination.el ||
        !e.pagination.$el ||
        0 === e.pagination.$el.length
      )
        return;
      const i =
          e.virtual && e.params.virtual.enabled
            ? e.virtual.slides.length
            : e.slides.length,
        s = e.pagination.$el;
      let a = "";
      if ("bullets" === t.type) {
        const r = e.params.loop
          ? Math.ceil((i - 2 * e.loopedSlides) / e.params.slidesPerGroup)
          : e.snapGrid.length;
        for (let i = 0; i < r; i += 1)
          t.renderBullet
            ? (a += t.renderBullet.call(e, i, t.bulletClass))
            : (a += `<${t.bulletElement} class="${t.bulletClass}"></${t.bulletElement}>`);
        s.html(a), (e.pagination.bullets = s.find(`.${t.bulletClass}`));
      }
      "fraction" === t.type &&
        ((a = t.renderFraction
          ? t.renderFraction.call(e, t.currentClass, t.totalClass)
          : `<span class="${t.currentClass}"></span>` +
            " / " +
            `<span class="${t.totalClass}"></span>`),
        s.html(a)),
        "progressbar" === t.type &&
          ((a = t.renderProgressbar
            ? t.renderProgressbar.call(e, t.progressbarFillClass)
            : `<span class="${t.progressbarFillClass}"></span>`),
          s.html(a)),
        "custom" !== t.type && e.emit("paginationRender", e.pagination.$el[0]);
    },
    init() {
      const e = this,
        t = e.params.pagination;
      if (!t.el) return;
      let i = oe(t.el);
      0 !== i.length &&
        (e.params.uniqueNavElements &&
          "string" == typeof t.el &&
          i.length > 1 &&
          1 === e.$el.find(t.el).length &&
          (i = e.$el.find(t.el)),
        "bullets" === t.type && t.clickable && i.addClass(t.clickableClass),
        i.addClass(t.modifierClass + t.type),
        "bullets" === t.type &&
          t.dynamicBullets &&
          (i.addClass(`${t.modifierClass}${t.type}-dynamic`),
          (e.pagination.dynamicBulletIndex = 0),
          t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)),
        "progressbar" === t.type &&
          t.progressbarOpposite &&
          i.addClass(t.progressbarOppositeClass),
        t.clickable &&
          i.on("click", `.${t.bulletClass}`, function (t) {
            t.preventDefault();
            let i = oe(this).index() * e.params.slidesPerGroup;
            e.params.loop && (i += e.loopedSlides), e.slideTo(i);
          }),
        pe.extend(e.pagination, { $el: i, el: i[0] }));
    },
    destroy() {
      const e = this.params.pagination;
      if (
        !e.el ||
        !this.pagination.el ||
        !this.pagination.$el ||
        0 === this.pagination.$el.length
      )
        return;
      const t = this.pagination.$el;
      t.removeClass(e.hiddenClass),
        t.removeClass(e.modifierClass + e.type),
        this.pagination.bullets &&
          this.pagination.bullets.removeClass(e.bulletActiveClass),
        e.clickable && t.off("click", `.${e.bulletClass}`);
    },
  };
  const Ve = {
    setTranslate() {
      const e = this;
      if (!e.params.scrollbar.el || !e.scrollbar.el) return;
      const { scrollbar: t, rtlTranslate: i, progress: s } = e,
        { dragSize: a, trackSize: r, $dragEl: n, $el: o } = t,
        l = e.params.scrollbar;
      let d = a,
        p = (r - a) * s;
      i
        ? (p = -p) > 0
          ? ((d = a - p), (p = 0))
          : -p + a > r && (d = r + p)
        : p < 0
        ? ((d = a + p), (p = 0))
        : p + a > r && (d = r - p),
        e.isHorizontal()
          ? (ce.transforms3d
              ? n.transform(`translate3d(${p}px, 0, 0)`)
              : n.transform(`translateX(${p}px)`),
            (n[0].style.width = `${d}px`))
          : (ce.transforms3d
              ? n.transform(`translate3d(0px, ${p}px, 0)`)
              : n.transform(`translateY(${p}px)`),
            (n[0].style.height = `${d}px`)),
        l.hide &&
          (clearTimeout(e.scrollbar.timeout),
          (o[0].style.opacity = 1),
          (e.scrollbar.timeout = setTimeout(() => {
            (o[0].style.opacity = 0), o.transition(400);
          }, 1e3)));
    },
    setTransition(e) {
      this.params.scrollbar.el &&
        this.scrollbar.el &&
        this.scrollbar.$dragEl.transition(e);
    },
    updateSize() {
      const e = this;
      if (!e.params.scrollbar.el || !e.scrollbar.el) return;
      const { scrollbar: t } = e,
        { $dragEl: i, $el: s } = t;
      (i[0].style.width = ""), (i[0].style.height = "");
      const a = e.isHorizontal() ? s[0].offsetWidth : s[0].offsetHeight,
        r = e.size / e.virtualSize,
        n = r * (a / e.size);
      let o;
      (o =
        "auto" === e.params.scrollbar.dragSize
          ? a * r
          : parseInt(e.params.scrollbar.dragSize, 10)),
        e.isHorizontal()
          ? (i[0].style.width = `${o}px`)
          : (i[0].style.height = `${o}px`),
        (s[0].style.display = r >= 1 ? "none" : ""),
        e.params.scrollbar.hide && (s[0].style.opacity = 0),
        pe.extend(t, { trackSize: a, divider: r, moveDivider: n, dragSize: o }),
        t.$el[
          e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"
        ](e.params.scrollbar.lockClass);
    },
    setDragPosition(e) {
      const { scrollbar: t, rtlTranslate: i } = this,
        { $el: s, dragSize: a, trackSize: r } = t;
      let n, o;
      (o =
        ((n = this.isHorizontal()
          ? "touchstart" === e.type || "touchmove" === e.type
            ? e.targetTouches[0].pageX
            : e.pageX || e.clientX
          : "touchstart" === e.type || "touchmove" === e.type
          ? e.targetTouches[0].pageY
          : e.pageY || e.clientY) -
          s.offset()[this.isHorizontal() ? "left" : "top"] -
          a / 2) /
        (r - a)),
        (o = Math.max(Math.min(o, 1), 0)),
        i && (o = 1 - o);
      const l =
        this.minTranslate() + (this.maxTranslate() - this.minTranslate()) * o;
      this.updateProgress(l),
        this.setTranslate(l),
        this.updateActiveIndex(),
        this.updateSlidesClasses();
    },
    onDragStart(e) {
      const t = this.params.scrollbar,
        { scrollbar: i, $wrapperEl: s } = this,
        { $el: a, $dragEl: r } = i;
      (this.scrollbar.isTouched = !0),
        e.preventDefault(),
        e.stopPropagation(),
        s.transition(100),
        r.transition(100),
        i.setDragPosition(e),
        clearTimeout(this.scrollbar.dragTimeout),
        a.transition(0),
        t.hide && a.css("opacity", 1),
        this.emit("scrollbarDragStart", e);
    },
    onDragMove(e) {
      const { scrollbar: t, $wrapperEl: i } = this,
        { $el: s, $dragEl: a } = t;
      this.scrollbar.isTouched &&
        (e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
        t.setDragPosition(e),
        i.transition(0),
        s.transition(0),
        a.transition(0),
        this.emit("scrollbarDragMove", e));
    },
    onDragEnd(e) {
      const t = this,
        i = t.params.scrollbar,
        { scrollbar: s } = t,
        { $el: a } = s;
      t.scrollbar.isTouched &&
        ((t.scrollbar.isTouched = !1),
        i.hide &&
          (clearTimeout(t.scrollbar.dragTimeout),
          (t.scrollbar.dragTimeout = pe.nextTick(() => {
            a.css("opacity", 0), a.transition(400);
          }, 1e3))),
        t.emit("scrollbarDragEnd", e),
        i.snapOnRelease && t.slideToClosest());
    },
    enableDraggable() {
      const e = this;
      if (!e.params.scrollbar.el) return;
      const {
          scrollbar: t,
          touchEventsTouch: i,
          touchEventsDesktop: s,
          params: a,
        } = e,
        r = t.$el[0],
        n = !(!ce.passiveListener || !a.passiveListeners) && {
          passive: !1,
          capture: !1,
        },
        o = !(!ce.passiveListener || !a.passiveListeners) && {
          passive: !0,
          capture: !1,
        };
      ce.touch
        ? (r.addEventListener(i.start, e.scrollbar.onDragStart, n),
          r.addEventListener(i.move, e.scrollbar.onDragMove, n),
          r.addEventListener(i.end, e.scrollbar.onDragEnd, o))
        : (r.addEventListener(s.start, e.scrollbar.onDragStart, n),
          ae.addEventListener(s.move, e.scrollbar.onDragMove, n),
          ae.addEventListener(s.end, e.scrollbar.onDragEnd, o));
    },
    disableDraggable() {
      const e = this;
      if (!e.params.scrollbar.el) return;
      const {
          scrollbar: t,
          touchEventsTouch: i,
          touchEventsDesktop: s,
          params: a,
        } = e,
        r = t.$el[0],
        n = !(!ce.passiveListener || !a.passiveListeners) && {
          passive: !1,
          capture: !1,
        },
        o = !(!ce.passiveListener || !a.passiveListeners) && {
          passive: !0,
          capture: !1,
        };
      ce.touch
        ? (r.removeEventListener(i.start, e.scrollbar.onDragStart, n),
          r.removeEventListener(i.move, e.scrollbar.onDragMove, n),
          r.removeEventListener(i.end, e.scrollbar.onDragEnd, o))
        : (r.removeEventListener(s.start, e.scrollbar.onDragStart, n),
          ae.removeEventListener(s.move, e.scrollbar.onDragMove, n),
          ae.removeEventListener(s.end, e.scrollbar.onDragEnd, o));
    },
    init() {
      const e = this;
      if (!e.params.scrollbar.el) return;
      const { scrollbar: t, $el: i } = e,
        s = e.params.scrollbar;
      let a = oe(s.el);
      e.params.uniqueNavElements &&
        "string" == typeof s.el &&
        a.length > 1 &&
        1 === i.find(s.el).length &&
        (a = i.find(s.el));
      let r = a.find(`.${e.params.scrollbar.dragClass}`);
      0 === r.length &&
        ((r = oe(`<div class="${e.params.scrollbar.dragClass}"></div>`)),
        a.append(r)),
        pe.extend(t, { $el: a, el: a[0], $dragEl: r, dragEl: r[0] }),
        s.draggable && t.enableDraggable();
    },
    destroy() {
      this.scrollbar.disableDraggable();
    },
  };
  const Ye = {
    setTransform(e, t) {
      const { rtl: i } = this,
        s = oe(e),
        a = i ? -1 : 1,
        r = s.attr("data-swiper-parallax") || "0";
      let n = s.attr("data-swiper-parallax-x"),
        o = s.attr("data-swiper-parallax-y");
      const l = s.attr("data-swiper-parallax-scale"),
        d = s.attr("data-swiper-parallax-opacity");
      if (
        (n || o
          ? ((n = n || "0"), (o = o || "0"))
          : this.isHorizontal()
          ? ((n = r), (o = "0"))
          : ((o = r), (n = "0")),
        (n =
          n.indexOf("%") >= 0
            ? `${parseInt(n, 10) * t * a}%`
            : `${n * t * a}px`),
        (o = o.indexOf("%") >= 0 ? `${parseInt(o, 10) * t}%` : `${o * t}px`),
        null != d)
      ) {
        const e = d - (d - 1) * (1 - Math.abs(t));
        s[0].style.opacity = e;
      }
      if (null == l) s.transform(`translate3d(${n}, ${o}, 0px)`);
      else {
        const e = l - (l - 1) * (1 - Math.abs(t));
        s.transform(`translate3d(${n}, ${o}, 0px) scale(${e})`);
      }
    },
    setTranslate() {
      const e = this,
        { $el: t, slides: i, progress: s, snapGrid: a } = e;
      t
        .children(
          "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]"
        )
        .each((t, i) => {
          e.parallax.setTransform(i, s);
        }),
        i.each((t, i) => {
          let r = i.progress;
          e.params.slidesPerGroup > 1 &&
            "auto" !== e.params.slidesPerView &&
            (r += Math.ceil(t / 2) - s * (a.length - 1)),
            (r = Math.min(Math.max(r, -1), 1)),
            oe(i)
              .find(
                "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]"
              )
              .each((t, i) => {
                e.parallax.setTransform(i, r);
              });
        });
    },
    setTransition(e = this.params.speed) {
      const { $el: t } = this;
      t.find(
        "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]"
      ).each((t, i) => {
        const s = oe(i);
        let a = parseInt(s.attr("data-swiper-parallax-duration"), 10) || e;
        0 === e && (a = 0), s.transition(a);
      });
    },
  };
  const Be = {
    getDistanceBetweenTouches(e) {
      if (e.targetTouches.length < 2) return 1;
      const t = e.targetTouches[0].pageX,
        i = e.targetTouches[0].pageY,
        s = e.targetTouches[1].pageX,
        a = e.targetTouches[1].pageY;
      return Math.sqrt((s - t) ** 2 + (a - i) ** 2);
    },
    onGestureStart(e) {
      const t = this,
        i = t.params.zoom,
        s = t.zoom,
        { gesture: a } = s;
      if (
        ((s.fakeGestureTouched = !1), (s.fakeGestureMoved = !1), !ce.gestures)
      ) {
        if (
          "touchstart" !== e.type ||
          ("touchstart" === e.type && e.targetTouches.length < 2)
        )
          return;
        (s.fakeGestureTouched = !0),
          (a.scaleStart = Be.getDistanceBetweenTouches(e));
      }
      (a.$slideEl && a.$slideEl.length) ||
      ((a.$slideEl = oe(e.target).closest(".swiper-slide")),
      0 === a.$slideEl.length && (a.$slideEl = t.slides.eq(t.activeIndex)),
      (a.$imageEl = a.$slideEl.find("img, svg, canvas")),
      (a.$imageWrapEl = a.$imageEl.parent(`.${i.containerClass}`)),
      (a.maxRatio = a.$imageWrapEl.attr("data-swiper-zoom") || i.maxRatio),
      0 !== a.$imageWrapEl.length)
        ? (a.$imageEl.transition(0), (t.zoom.isScaling = !0))
        : (a.$imageEl = void 0);
    },
    onGestureChange(e) {
      const t = this.params.zoom,
        i = this.zoom,
        { gesture: s } = i;
      if (!ce.gestures) {
        if (
          "touchmove" !== e.type ||
          ("touchmove" === e.type && e.targetTouches.length < 2)
        )
          return;
        (i.fakeGestureMoved = !0),
          (s.scaleMove = Be.getDistanceBetweenTouches(e));
      }
      s.$imageEl &&
        0 !== s.$imageEl.length &&
        (ce.gestures
          ? (i.scale = e.scale * i.currentScale)
          : (i.scale = (s.scaleMove / s.scaleStart) * i.currentScale),
        i.scale > s.maxRatio &&
          (i.scale = s.maxRatio - 1 + (i.scale - s.maxRatio + 1) ** 0.5),
        i.scale < t.minRatio &&
          (i.scale = t.minRatio + 1 - (t.minRatio - i.scale + 1) ** 0.5),
        s.$imageEl.transform(`translate3d(0,0,0) scale(${i.scale})`));
    },
    onGestureEnd(e) {
      const t = this.params.zoom,
        i = this.zoom,
        { gesture: s } = i;
      if (!ce.gestures) {
        if (!i.fakeGestureTouched || !i.fakeGestureMoved) return;
        if (
          "touchend" !== e.type ||
          ("touchend" === e.type && e.changedTouches.length < 2 && !xe.android)
        )
          return;
        (i.fakeGestureTouched = !1), (i.fakeGestureMoved = !1);
      }
      s.$imageEl &&
        0 !== s.$imageEl.length &&
        ((i.scale = Math.max(Math.min(i.scale, s.maxRatio), t.minRatio)),
        s.$imageEl
          .transition(this.params.speed)
          .transform(`translate3d(0,0,0) scale(${i.scale})`),
        (i.currentScale = i.scale),
        (i.isScaling = !1),
        1 === i.scale && (s.$slideEl = void 0));
    },
    onTouchStart(e) {
      const t = this.zoom,
        { gesture: i, image: s } = t;
      i.$imageEl &&
        0 !== i.$imageEl.length &&
        (s.isTouched ||
          (xe.android && e.preventDefault(),
          (s.isTouched = !0),
          (s.touchesStart.x =
            "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX),
          (s.touchesStart.y =
            "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY)));
    },
    onTouchMove(e) {
      const t = this,
        i = t.zoom,
        { gesture: s, image: a, velocity: r } = i;
      if (!s.$imageEl || 0 === s.$imageEl.length) return;
      if (((t.allowClick = !1), !a.isTouched || !s.$slideEl)) return;
      a.isMoved ||
        ((a.width = s.$imageEl[0].offsetWidth),
        (a.height = s.$imageEl[0].offsetHeight),
        (a.startX = pe.getTranslate(s.$imageWrapEl[0], "x") || 0),
        (a.startY = pe.getTranslate(s.$imageWrapEl[0], "y") || 0),
        (s.slideWidth = s.$slideEl[0].offsetWidth),
        (s.slideHeight = s.$slideEl[0].offsetHeight),
        s.$imageWrapEl.transition(0),
        t.rtl && ((a.startX = -a.startX), (a.startY = -a.startY)));
      const n = a.width * i.scale,
        o = a.height * i.scale;
      if (!(n < s.slideWidth && o < s.slideHeight)) {
        if (
          ((a.minX = Math.min(s.slideWidth / 2 - n / 2, 0)),
          (a.maxX = -a.minX),
          (a.minY = Math.min(s.slideHeight / 2 - o / 2, 0)),
          (a.maxY = -a.minY),
          (a.touchesCurrent.x =
            "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX),
          (a.touchesCurrent.y =
            "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY),
          !a.isMoved && !i.isScaling)
        ) {
          if (
            t.isHorizontal() &&
            ((Math.floor(a.minX) === Math.floor(a.startX) &&
              a.touchesCurrent.x < a.touchesStart.x) ||
              (Math.floor(a.maxX) === Math.floor(a.startX) &&
                a.touchesCurrent.x > a.touchesStart.x))
          )
            return void (a.isTouched = !1);
          if (
            !t.isHorizontal() &&
            ((Math.floor(a.minY) === Math.floor(a.startY) &&
              a.touchesCurrent.y < a.touchesStart.y) ||
              (Math.floor(a.maxY) === Math.floor(a.startY) &&
                a.touchesCurrent.y > a.touchesStart.y))
          )
            return void (a.isTouched = !1);
        }
        e.preventDefault(),
          e.stopPropagation(),
          (a.isMoved = !0),
          (a.currentX = a.touchesCurrent.x - a.touchesStart.x + a.startX),
          (a.currentY = a.touchesCurrent.y - a.touchesStart.y + a.startY),
          a.currentX < a.minX &&
            (a.currentX = a.minX + 1 - (a.minX - a.currentX + 1) ** 0.8),
          a.currentX > a.maxX &&
            (a.currentX = a.maxX - 1 + (a.currentX - a.maxX + 1) ** 0.8),
          a.currentY < a.minY &&
            (a.currentY = a.minY + 1 - (a.minY - a.currentY + 1) ** 0.8),
          a.currentY > a.maxY &&
            (a.currentY = a.maxY - 1 + (a.currentY - a.maxY + 1) ** 0.8),
          r.prevPositionX || (r.prevPositionX = a.touchesCurrent.x),
          r.prevPositionY || (r.prevPositionY = a.touchesCurrent.y),
          r.prevTime || (r.prevTime = Date.now()),
          (r.x =
            (a.touchesCurrent.x - r.prevPositionX) /
            (Date.now() - r.prevTime) /
            2),
          (r.y =
            (a.touchesCurrent.y - r.prevPositionY) /
            (Date.now() - r.prevTime) /
            2),
          Math.abs(a.touchesCurrent.x - r.prevPositionX) < 2 && (r.x = 0),
          Math.abs(a.touchesCurrent.y - r.prevPositionY) < 2 && (r.y = 0),
          (r.prevPositionX = a.touchesCurrent.x),
          (r.prevPositionY = a.touchesCurrent.y),
          (r.prevTime = Date.now()),
          s.$imageWrapEl.transform(
            `translate3d(${a.currentX}px, ${a.currentY}px,0)`
          );
      }
    },
    onTouchEnd() {
      const e = this.zoom,
        { gesture: t, image: i, velocity: s } = e;
      if (!t.$imageEl || 0 === t.$imageEl.length) return;
      if (!i.isTouched || !i.isMoved)
        return (i.isTouched = !1), void (i.isMoved = !1);
      (i.isTouched = !1), (i.isMoved = !1);
      let a = 300,
        r = 300;
      const n = s.x * a,
        o = i.currentX + n,
        l = s.y * r,
        d = i.currentY + l;
      0 !== s.x && (a = Math.abs((o - i.currentX) / s.x)),
        0 !== s.y && (r = Math.abs((d - i.currentY) / s.y));
      const p = Math.max(a, r);
      (i.currentX = o), (i.currentY = d);
      const c = i.width * e.scale,
        h = i.height * e.scale;
      (i.minX = Math.min(t.slideWidth / 2 - c / 2, 0)),
        (i.maxX = -i.minX),
        (i.minY = Math.min(t.slideHeight / 2 - h / 2, 0)),
        (i.maxY = -i.minY),
        (i.currentX = Math.max(Math.min(i.currentX, i.maxX), i.minX)),
        (i.currentY = Math.max(Math.min(i.currentY, i.maxY), i.minY)),
        t.$imageWrapEl
          .transition(p)
          .transform(`translate3d(${i.currentX}px, ${i.currentY}px,0)`);
    },
    onTransitionEnd() {
      const e = this.zoom,
        { gesture: t } = e;
      t.$slideEl &&
        this.previousIndex !== this.activeIndex &&
        (t.$imageEl.transform("translate3d(0,0,0) scale(1)"),
        t.$imageWrapEl.transform("translate3d(0,0,0)"),
        (e.scale = 1),
        (e.currentScale = 1),
        (t.$slideEl = void 0),
        (t.$imageEl = void 0),
        (t.$imageWrapEl = void 0));
    },
    toggle(e) {
      const t = this.zoom;
      t.scale && 1 !== t.scale ? t.out() : t.in(e);
    },
    in(e) {
      const t = this,
        i = t.zoom,
        s = t.params.zoom,
        { gesture: a, image: r } = i;
      if (
        (a.$slideEl ||
          ((a.$slideEl = t.clickedSlide
            ? oe(t.clickedSlide)
            : t.slides.eq(t.activeIndex)),
          (a.$imageEl = a.$slideEl.find("img, svg, canvas")),
          (a.$imageWrapEl = a.$imageEl.parent(`.${s.containerClass}`))),
        !a.$imageEl || 0 === a.$imageEl.length)
      )
        return;
      let n, o, l, d, p, c, h, u, m, g, f, v, w, b, y, x, C, E;
      a.$slideEl.addClass(`${s.zoomedSlideClass}`),
        void 0 === r.touchesStart.x && e
          ? ((n = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX),
            (o = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY))
          : ((n = r.touchesStart.x), (o = r.touchesStart.y)),
        (i.scale = a.$imageWrapEl.attr("data-swiper-zoom") || s.maxRatio),
        (i.currentScale =
          a.$imageWrapEl.attr("data-swiper-zoom") || s.maxRatio),
        e
          ? ((C = a.$slideEl[0].offsetWidth),
            (E = a.$slideEl[0].offsetHeight),
            (p = (l = a.$slideEl.offset().left) + C / 2 - n),
            (c = (d = a.$slideEl.offset().top) + E / 2 - o),
            (m = a.$imageEl[0].offsetWidth),
            (g = a.$imageEl[0].offsetHeight),
            (f = m * i.scale),
            (v = g * i.scale),
            (y = -(w = Math.min(C / 2 - f / 2, 0))),
            (x = -(b = Math.min(E / 2 - v / 2, 0))),
            (h = p * i.scale) < w && (h = w),
            h > y && (h = y),
            (u = c * i.scale) < b && (u = b),
            u > x && (u = x))
          : ((h = 0), (u = 0)),
        a.$imageWrapEl
          .transition(300)
          .transform(`translate3d(${h}px, ${u}px,0)`),
        a.$imageEl
          .transition(300)
          .transform(`translate3d(0,0,0) scale(${i.scale})`);
    },
    out() {
      const e = this,
        t = e.zoom,
        i = e.params.zoom,
        { gesture: s } = t;
      s.$slideEl ||
        ((s.$slideEl = e.clickedSlide
          ? oe(e.clickedSlide)
          : e.slides.eq(e.activeIndex)),
        (s.$imageEl = s.$slideEl.find("img, svg, canvas")),
        (s.$imageWrapEl = s.$imageEl.parent(`.${i.containerClass}`))),
        s.$imageEl &&
          0 !== s.$imageEl.length &&
          ((t.scale = 1),
          (t.currentScale = 1),
          s.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),
          s.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),
          s.$slideEl.removeClass(`${i.zoomedSlideClass}`),
          (s.$slideEl = void 0));
    },
    enable() {
      const e = this,
        t = e.zoom;
      if (t.enabled) return;
      t.enabled = !0;
      const i = !(
        "touchstart" !== e.touchEvents.start ||
        !ce.passiveListener ||
        !e.params.passiveListeners
      ) && { passive: !0, capture: !1 };
      ce.gestures
        ? (e.$wrapperEl.on(
            "gesturestart",
            ".swiper-slide",
            t.onGestureStart,
            i
          ),
          e.$wrapperEl.on(
            "gesturechange",
            ".swiper-slide",
            t.onGestureChange,
            i
          ),
          e.$wrapperEl.on("gestureend", ".swiper-slide", t.onGestureEnd, i))
        : "touchstart" === e.touchEvents.start &&
          (e.$wrapperEl.on(
            e.touchEvents.start,
            ".swiper-slide",
            t.onGestureStart,
            i
          ),
          e.$wrapperEl.on(
            e.touchEvents.move,
            ".swiper-slide",
            t.onGestureChange,
            i
          ),
          e.$wrapperEl.on(
            e.touchEvents.end,
            ".swiper-slide",
            t.onGestureEnd,
            i
          )),
        e.$wrapperEl.on(
          e.touchEvents.move,
          `.${e.params.zoom.containerClass}`,
          t.onTouchMove
        );
    },
    disable() {
      const e = this,
        t = e.zoom;
      if (!t.enabled) return;
      e.zoom.enabled = !1;
      const i = !(
        "touchstart" !== e.touchEvents.start ||
        !ce.passiveListener ||
        !e.params.passiveListeners
      ) && { passive: !0, capture: !1 };
      ce.gestures
        ? (e.$wrapperEl.off(
            "gesturestart",
            ".swiper-slide",
            t.onGestureStart,
            i
          ),
          e.$wrapperEl.off(
            "gesturechange",
            ".swiper-slide",
            t.onGestureChange,
            i
          ),
          e.$wrapperEl.off("gestureend", ".swiper-slide", t.onGestureEnd, i))
        : "touchstart" === e.touchEvents.start &&
          (e.$wrapperEl.off(
            e.touchEvents.start,
            ".swiper-slide",
            t.onGestureStart,
            i
          ),
          e.$wrapperEl.off(
            e.touchEvents.move,
            ".swiper-slide",
            t.onGestureChange,
            i
          ),
          e.$wrapperEl.off(
            e.touchEvents.end,
            ".swiper-slide",
            t.onGestureEnd,
            i
          )),
        e.$wrapperEl.off(
          e.touchEvents.move,
          `.${e.params.zoom.containerClass}`,
          t.onTouchMove
        );
    },
  };
  const Ge = {
    loadInSlide(e, t = !0) {
      const i = this,
        s = i.params.lazy;
      if (void 0 === e) return;
      if (0 === i.slides.length) return;
      const a =
        i.virtual && i.params.virtual.enabled
          ? i.$wrapperEl.children(
              `.${i.params.slideClass}[data-swiper-slide-index="${e}"]`
            )
          : i.slides.eq(e);
      let r = a.find(
        `.${s.elementClass}:not(.${s.loadedClass}):not(.${s.loadingClass})`
      );
      !a.hasClass(s.elementClass) ||
        a.hasClass(s.loadedClass) ||
        a.hasClass(s.loadingClass) ||
        (r = r.add(a[0])),
        0 !== r.length &&
          r.each((e, r) => {
            const n = oe(r);
            n.addClass(s.loadingClass);
            const o = n.attr("data-background"),
              l = n.attr("data-src"),
              d = n.attr("data-srcset"),
              p = n.attr("data-sizes");
            i.loadImage(n[0], l || o, d, p, !1, () => {
              if (null != i && i && (!i || i.params) && !i.destroyed) {
                if (
                  (o
                    ? (n.css("background-image", `url("${o}")`),
                      n.removeAttr("data-background"))
                    : (d && (n.attr("srcset", d), n.removeAttr("data-srcset")),
                      p && (n.attr("sizes", p), n.removeAttr("data-sizes")),
                      l && (n.attr("src", l), n.removeAttr("data-src"))),
                  n.addClass(s.loadedClass).removeClass(s.loadingClass),
                  a.find(`.${s.preloaderClass}`).remove(),
                  i.params.loop && t)
                ) {
                  const e = a.attr("data-swiper-slide-index");
                  if (a.hasClass(i.params.slideDuplicateClass)) {
                    const t = i.$wrapperEl.children(
                      `[data-swiper-slide-index="${e}"]:not(.${i.params.slideDuplicateClass})`
                    );
                    i.lazy.loadInSlide(t.index(), !1);
                  } else {
                    const t = i.$wrapperEl.children(
                      `.${i.params.slideDuplicateClass}[data-swiper-slide-index="${e}"]`
                    );
                    i.lazy.loadInSlide(t.index(), !1);
                  }
                }
                i.emit("lazyImageReady", a[0], n[0]);
              }
            }),
              i.emit("lazyImageLoad", a[0], n[0]);
          });
    },
    load() {
      const e = this,
        { $wrapperEl: t, params: i, slides: s, activeIndex: a } = e,
        r = e.virtual && i.virtual.enabled,
        n = i.lazy;
      let o = i.slidesPerView;
      function l(e) {
        if (r) {
          if (
            t.children(`.${i.slideClass}[data-swiper-slide-index="${e}"]`)
              .length
          )
            return !0;
        } else if (s[e]) return !0;
        return !1;
      }
      function d(e) {
        return r ? oe(e).attr("data-swiper-slide-index") : oe(e).index();
      }
      if (
        ("auto" === o && (o = 0),
        e.lazy.initialImageLoaded || (e.lazy.initialImageLoaded = !0),
        e.params.watchSlidesVisibility)
      )
        t.children(`.${i.slideVisibleClass}`).each((t, i) => {
          const s = r ? oe(i).attr("data-swiper-slide-index") : oe(i).index();
          e.lazy.loadInSlide(s);
        });
      else if (o > 1)
        for (let t = a; t < a + o; t += 1) l(t) && e.lazy.loadInSlide(t);
      else e.lazy.loadInSlide(a);
      if (n.loadPrevNext)
        if (o > 1 || (n.loadPrevNextAmount && n.loadPrevNextAmount > 1)) {
          const t = n.loadPrevNextAmount,
            i = o,
            r = Math.min(a + i + Math.max(t, i), s.length),
            d = Math.max(a - Math.max(i, t), 0);
          for (let t = a + o; t < r; t += 1) l(t) && e.lazy.loadInSlide(t);
          for (let t = d; t < a; t += 1) l(t) && e.lazy.loadInSlide(t);
        } else {
          const s = t.children(`.${i.slideNextClass}`);
          s.length > 0 && e.lazy.loadInSlide(d(s));
          const a = t.children(`.${i.slidePrevClass}`);
          a.length > 0 && e.lazy.loadInSlide(d(a));
        }
    },
  };
  const Re = {
    LinearSpline: function (e, t) {
      const i = (function () {
        let e, t, i;
        return (s, a) => {
          for (t = -1, e = s.length; e - t > 1; )
            s[(i = (e + t) >> 1)] <= a ? (t = i) : (e = i);
          return e;
        };
      })();
      let s, a;
      return (
        (this.x = e),
        (this.y = t),
        (this.lastIndex = e.length - 1),
        (this.interpolate = function (e) {
          return e
            ? ((a = i(this.x, e)),
              (s = a - 1),
              ((e - this.x[s]) * (this.y[a] - this.y[s])) /
                (this.x[a] - this.x[s]) +
                this.y[s])
            : 0;
        }),
        this
      );
    },
    getInterpolateFunction(e) {
      const t = this;
      t.controller.spline ||
        (t.controller.spline = t.params.loop
          ? new Re.LinearSpline(t.slidesGrid, e.slidesGrid)
          : new Re.LinearSpline(t.snapGrid, e.snapGrid));
    },
    setTranslate(e, t) {
      const i = this,
        s = i.controller.control;
      let a, r;
      function n(e) {
        const t = i.rtlTranslate ? -i.translate : i.translate;
        "slide" === i.params.controller.by &&
          (i.controller.getInterpolateFunction(e),
          (r = -i.controller.spline.interpolate(-t))),
          (r && "container" !== i.params.controller.by) ||
            ((a =
              (e.maxTranslate() - e.minTranslate()) /
              (i.maxTranslate() - i.minTranslate())),
            (r = (t - i.minTranslate()) * a + e.minTranslate())),
          i.params.controller.inverse && (r = e.maxTranslate() - r),
          e.updateProgress(r),
          e.setTranslate(r, i),
          e.updateActiveIndex(),
          e.updateSlidesClasses();
      }
      if (Array.isArray(s))
        for (let e = 0; e < s.length; e += 1)
          s[e] !== t && s[e] instanceof ke && n(s[e]);
      else s instanceof ke && t !== s && n(s);
    },
    setTransition(e, t) {
      const i = this,
        s = i.controller.control;
      let a;
      function r(t) {
        t.setTransition(e, i),
          0 !== e &&
            (t.transitionStart(),
            t.params.autoHeight &&
              pe.nextTick(() => {
                t.updateAutoHeight();
              }),
            t.$wrapperEl.transitionEnd(() => {
              s &&
                (t.params.loop &&
                  "slide" === i.params.controller.by &&
                  t.loopFix(),
                t.transitionEnd());
            }));
      }
      if (Array.isArray(s))
        for (a = 0; a < s.length; a += 1)
          s[a] !== t && s[a] instanceof ke && r(s[a]);
      else s instanceof ke && t !== s && r(s);
    },
  };
  const Xe = {
    makeElFocusable: (e) => (e.attr("tabIndex", "0"), e),
    addElRole: (e, t) => (e.attr("role", t), e),
    addElLabel: (e, t) => (e.attr("aria-label", t), e),
    disableEl: (e) => (e.attr("aria-disabled", !0), e),
    enableEl: (e) => (e.attr("aria-disabled", !1), e),
    onEnterKey(e) {
      const t = this,
        i = t.params.a11y;
      if (13 !== e.keyCode) return;
      const s = oe(e.target);
      t.navigation &&
        t.navigation.$nextEl &&
        s.is(t.navigation.$nextEl) &&
        ((t.isEnd && !t.params.loop) || t.slideNext(),
        t.isEnd
          ? t.a11y.notify(i.lastSlideMessage)
          : t.a11y.notify(i.nextSlideMessage)),
        t.navigation &&
          t.navigation.$prevEl &&
          s.is(t.navigation.$prevEl) &&
          ((t.isBeginning && !t.params.loop) || t.slidePrev(),
          t.isBeginning
            ? t.a11y.notify(i.firstSlideMessage)
            : t.a11y.notify(i.prevSlideMessage)),
        t.pagination &&
          s.is(`.${t.params.pagination.bulletClass}`) &&
          s[0].click();
    },
    notify(e) {
      const t = this.a11y.liveRegion;
      0 !== t.length && (t.html(""), t.html(e));
    },
    updateNavigation() {
      const e = this;
      if (e.params.loop) return;
      const { $nextEl: t, $prevEl: i } = e.navigation;
      i &&
        i.length > 0 &&
        (e.isBeginning ? e.a11y.disableEl(i) : e.a11y.enableEl(i)),
        t &&
          t.length > 0 &&
          (e.isEnd ? e.a11y.disableEl(t) : e.a11y.enableEl(t));
    },
    updatePagination() {
      const e = this,
        t = e.params.a11y;
      e.pagination &&
        e.params.pagination.clickable &&
        e.pagination.bullets &&
        e.pagination.bullets.length &&
        e.pagination.bullets.each((i, s) => {
          const a = oe(s);
          e.a11y.makeElFocusable(a),
            e.a11y.addElRole(a, "button"),
            e.a11y.addElLabel(
              a,
              t.paginationBulletMessage.replace(/{{index}}/, a.index() + 1)
            );
        });
    },
    init() {
      const e = this;
      e.$el.append(e.a11y.liveRegion);
      const t = e.params.a11y;
      let i, s;
      e.navigation && e.navigation.$nextEl && (i = e.navigation.$nextEl),
        e.navigation && e.navigation.$prevEl && (s = e.navigation.$prevEl),
        i &&
          (e.a11y.makeElFocusable(i),
          e.a11y.addElRole(i, "button"),
          e.a11y.addElLabel(i, t.nextSlideMessage),
          i.on("keydown", e.a11y.onEnterKey)),
        s &&
          (e.a11y.makeElFocusable(s),
          e.a11y.addElRole(s, "button"),
          e.a11y.addElLabel(s, t.prevSlideMessage),
          s.on("keydown", e.a11y.onEnterKey)),
        e.pagination &&
          e.params.pagination.clickable &&
          e.pagination.bullets &&
          e.pagination.bullets.length &&
          e.pagination.$el.on(
            "keydown",
            `.${e.params.pagination.bulletClass}`,
            e.a11y.onEnterKey
          );
    },
    destroy() {
      const e = this;
      let t, i;
      e.a11y.liveRegion &&
        e.a11y.liveRegion.length > 0 &&
        e.a11y.liveRegion.remove(),
        e.navigation && e.navigation.$nextEl && (t = e.navigation.$nextEl),
        e.navigation && e.navigation.$prevEl && (i = e.navigation.$prevEl),
        t && t.off("keydown", e.a11y.onEnterKey),
        i && i.off("keydown", e.a11y.onEnterKey),
        e.pagination &&
          e.params.pagination.clickable &&
          e.pagination.bullets &&
          e.pagination.bullets.length &&
          e.pagination.$el.off(
            "keydown",
            `.${e.params.pagination.bulletClass}`,
            e.a11y.onEnterKey
          );
    },
  };
  const qe = {
    init() {
      const e = this;
      if (!e.params.history) return;
      if (!re.history || !re.history.pushState)
        return (
          (e.params.history.enabled = !1),
          void (e.params.hashNavigation.enabled = !0)
        );
      const t = e.history;
      (t.initialized = !0),
        (t.paths = qe.getPathValues()),
        (t.paths.key || t.paths.value) &&
          (t.scrollToSlide(0, t.paths.value, e.params.runCallbacksOnInit),
          e.params.history.replaceState ||
            re.addEventListener("popstate", e.history.setHistoryPopState));
    },
    destroy() {
      const e = this;
      e.params.history.replaceState ||
        re.removeEventListener("popstate", e.history.setHistoryPopState);
    },
    setHistoryPopState() {
      (this.history.paths = qe.getPathValues()),
        this.history.scrollToSlide(
          this.params.speed,
          this.history.paths.value,
          !1
        );
    },
    getPathValues() {
      const e = re.location.pathname
          .slice(1)
          .split("/")
          .filter((e) => "" !== e),
        t = e.length;
      return { key: e[t - 2], value: e[t - 1] };
    },
    setHistory(e, t) {
      if (!this.history.initialized || !this.params.history.enabled) return;
      const i = this.slides.eq(t);
      let s = qe.slugify(i.attr("data-history"));
      re.location.pathname.includes(e) || (s = `${e}/${s}`);
      const a = re.history.state;
      (a && a.value === s) ||
        (this.params.history.replaceState
          ? re.history.replaceState({ value: s }, null, s)
          : re.history.pushState({ value: s }, null, s));
    },
    slugify: (e) =>
      e
        .toString()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, ""),
    scrollToSlide(e, t, i) {
      const s = this;
      if (t)
        for (let a = 0, r = s.slides.length; a < r; a += 1) {
          const r = s.slides.eq(a);
          if (
            qe.slugify(r.attr("data-history")) === t &&
            !r.hasClass(s.params.slideDuplicateClass)
          ) {
            const t = r.index();
            s.slideTo(t, e, i);
          }
        }
      else s.slideTo(0, e, i);
    },
  };
  const je = {
    onHashCange() {
      const e = this,
        t = ae.location.hash.replace("#", "");
      if (t !== e.slides.eq(e.activeIndex).attr("data-hash")) {
        const i = e.$wrapperEl
          .children(`.${e.params.slideClass}[data-hash="${t}"]`)
          .index();
        if (void 0 === i) return;
        e.slideTo(i);
      }
    },
    setHash() {
      const e = this;
      if (e.hashNavigation.initialized && e.params.hashNavigation.enabled)
        if (
          e.params.hashNavigation.replaceState &&
          re.history &&
          re.history.replaceState
        )
          re.history.replaceState(
            null,
            null,
            `#${e.slides.eq(e.activeIndex).attr("data-hash")}` || ""
          );
        else {
          const t = e.slides.eq(e.activeIndex),
            i = t.attr("data-hash") || t.attr("data-history");
          ae.location.hash = i || "";
        }
    },
    init() {
      const e = this;
      if (
        !e.params.hashNavigation.enabled ||
        (e.params.history && e.params.history.enabled)
      )
        return;
      e.hashNavigation.initialized = !0;
      const t = ae.location.hash.replace("#", "");
      if (t) {
        const i = 0;
        for (let s = 0, a = e.slides.length; s < a; s += 1) {
          const a = e.slides.eq(s);
          if (
            (a.attr("data-hash") || a.attr("data-history")) === t &&
            !a.hasClass(e.params.slideDuplicateClass)
          ) {
            const t = a.index();
            e.slideTo(t, i, e.params.runCallbacksOnInit, !0);
          }
        }
      }
      e.params.hashNavigation.watchState &&
        oe(re).on("hashchange", e.hashNavigation.onHashCange);
    },
    destroy() {
      const e = this;
      e.params.hashNavigation.watchState &&
        oe(re).off("hashchange", e.hashNavigation.onHashCange);
    },
  };
  const We = {
    run() {
      const e = this,
        t = e.slides.eq(e.activeIndex);
      let i = e.params.autoplay.delay;
      t.attr("data-swiper-autoplay") &&
        (i = t.attr("data-swiper-autoplay") || e.params.autoplay.delay),
        (e.autoplay.timeout = pe.nextTick(() => {
          e.params.autoplay.reverseDirection
            ? e.params.loop
              ? (e.loopFix(),
                e.slidePrev(e.params.speed, !0, !0),
                e.emit("autoplay"))
              : e.isBeginning
              ? e.params.autoplay.stopOnLastSlide
                ? e.autoplay.stop()
                : (e.slideTo(e.slides.length - 1, e.params.speed, !0, !0),
                  e.emit("autoplay"))
              : (e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay"))
            : e.params.loop
            ? (e.loopFix(),
              e.slideNext(e.params.speed, !0, !0),
              e.emit("autoplay"))
            : e.isEnd
            ? e.params.autoplay.stopOnLastSlide
              ? e.autoplay.stop()
              : (e.slideTo(0, e.params.speed, !0, !0), e.emit("autoplay"))
            : (e.slideNext(e.params.speed, !0, !0), e.emit("autoplay"));
        }, i));
    },
    start() {
      return (
        void 0 === this.autoplay.timeout &&
        !this.autoplay.running &&
        ((this.autoplay.running = !0),
        this.emit("autoplayStart"),
        this.autoplay.run(),
        !0)
      );
    },
    stop() {
      const e = this;
      return (
        !!e.autoplay.running &&
        void 0 !== e.autoplay.timeout &&
        (e.autoplay.timeout &&
          (clearTimeout(e.autoplay.timeout), (e.autoplay.timeout = void 0)),
        (e.autoplay.running = !1),
        e.emit("autoplayStop"),
        !0)
      );
    },
    pause(e) {
      const t = this;
      t.autoplay.running &&
        (t.autoplay.paused ||
          (t.autoplay.timeout && clearTimeout(t.autoplay.timeout),
          (t.autoplay.paused = !0),
          0 !== e && t.params.autoplay.waitForTransition
            ? (t.$wrapperEl[0].addEventListener(
                "transitionend",
                t.autoplay.onTransitionEnd
              ),
              t.$wrapperEl[0].addEventListener(
                "webkitTransitionEnd",
                t.autoplay.onTransitionEnd
              ))
            : ((t.autoplay.paused = !1), t.autoplay.run())));
    },
  };
  const Ue = {
    setTranslate() {
      const e = this,
        { slides: t } = e;
      for (let i = 0; i < t.length; i += 1) {
        const t = e.slides.eq(i);
        let s = -t[0].swiperSlideOffset;
        e.params.virtualTranslate || (s -= e.translate);
        let a = 0;
        e.isHorizontal() || ((a = s), (s = 0));
        const r = e.params.fadeEffect.crossFade
          ? Math.max(1 - Math.abs(t[0].progress), 0)
          : 1 + Math.min(Math.max(t[0].progress, -1), 0);
        t.css({ opacity: r }).transform(`translate3d(${s}px, ${a}px, 0px)`);
      }
    },
    setTransition(e) {
      const t = this,
        { slides: i, $wrapperEl: s } = t;
      if ((i.transition(e), t.params.virtualTranslate && 0 !== e)) {
        let e = !1;
        i.transitionEnd(() => {
          if (e) return;
          if (!t || t.destroyed) return;
          (e = !0), (t.animating = !1);
          const i = ["webkitTransitionEnd", "transitionend"];
          for (let e = 0; e < i.length; e += 1) s.trigger(i[e]);
        });
      }
    },
  };
  const Ke = {
    setTranslate() {
      const {
          $el: e,
          $wrapperEl: t,
          slides: i,
          width: s,
          height: a,
          rtlTranslate: r,
          size: n,
        } = this,
        o = this.params.cubeEffect,
        l = this.isHorizontal(),
        d = this.virtual && this.params.virtual.enabled;
      let p,
        c = 0;
      o.shadow &&
        (l
          ? (0 === (p = t.find(".swiper-cube-shadow")).length &&
              ((p = oe('<div class="swiper-cube-shadow"></div>')), t.append(p)),
            p.css({ height: `${s}px` }))
          : 0 === (p = e.find(".swiper-cube-shadow")).length &&
            ((p = oe('<div class="swiper-cube-shadow"></div>')), e.append(p)));
      for (let e = 0; e < i.length; e += 1) {
        const t = i.eq(e);
        let s = e;
        d && (s = parseInt(t.attr("data-swiper-slide-index"), 10));
        let a = 90 * s,
          p = Math.floor(a / 360);
        r && ((a = -a), (p = Math.floor(-a / 360)));
        const h = Math.max(Math.min(t[0].progress, 1), -1);
        let u = 0,
          m = 0,
          g = 0;
        s % 4 == 0
          ? ((u = 4 * -p * n), (g = 0))
          : (s - 1) % 4 == 0
          ? ((u = 0), (g = 4 * -p * n))
          : (s - 2) % 4 == 0
          ? ((u = n + 4 * p * n), (g = n))
          : (s - 3) % 4 == 0 && ((u = -n), (g = 3 * n + 4 * n * p)),
          r && (u = -u),
          l || ((m = u), (u = 0));
        const f = `rotateX(${l ? 0 : -a}deg) rotateY(${
          l ? a : 0
        }deg) translate3d(${u}px, ${m}px, ${g}px)`;
        if (
          (h <= 1 &&
            h > -1 &&
            ((c = 90 * s + 90 * h), r && (c = 90 * -s - 90 * h)),
          t.transform(f),
          o.slideShadows)
        ) {
          let e = l
              ? t.find(".swiper-slide-shadow-left")
              : t.find(".swiper-slide-shadow-top"),
            i = l
              ? t.find(".swiper-slide-shadow-right")
              : t.find(".swiper-slide-shadow-bottom");
          0 === e.length &&
            ((e = oe(
              `<div class="swiper-slide-shadow-${l ? "left" : "top"}"></div>`
            )),
            t.append(e)),
            0 === i.length &&
              ((i = oe(
                `<div class="swiper-slide-shadow-${
                  l ? "right" : "bottom"
                }"></div>`
              )),
              t.append(i)),
            e.length && (e[0].style.opacity = Math.max(-h, 0)),
            i.length && (i[0].style.opacity = Math.max(h, 0));
        }
      }
      if (
        (t.css({
          "-webkit-transform-origin": `50% 50% -${n / 2}px`,
          "-moz-transform-origin": `50% 50% -${n / 2}px`,
          "-ms-transform-origin": `50% 50% -${n / 2}px`,
          "transform-origin": `50% 50% -${n / 2}px`,
        }),
        o.shadow)
      )
        if (l)
          p.transform(
            `translate3d(0px, ${s / 2 + o.shadowOffset}px, ${
              -s / 2
            }px) rotateX(90deg) rotateZ(0deg) scale(${o.shadowScale})`
          );
        else {
          const e = Math.abs(c) - 90 * Math.floor(Math.abs(c) / 90),
            t =
              1.5 -
              (Math.sin((2 * e * Math.PI) / 360) / 2 +
                Math.cos((2 * e * Math.PI) / 360) / 2),
            i = o.shadowScale,
            s = o.shadowScale / t,
            r = o.shadowOffset;
          p.transform(
            `scale3d(${i}, 1, ${s}) translate3d(0px, ${a / 2 + r}px, ${
              -a / 2 / s
            }px) rotateX(-90deg)`
          );
        }
      const h = he.isSafari || he.isUiWebView ? -n / 2 : 0;
      t.transform(
        `translate3d(0px,0,${h}px) rotateX(${
          this.isHorizontal() ? 0 : c
        }deg) rotateY(${this.isHorizontal() ? -c : 0}deg)`
      );
    },
    setTransition(e) {
      const { $el: t, slides: i } = this;
      i
        .transition(e)
        .find(
          ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
        )
        .transition(e),
        this.params.cubeEffect.shadow &&
          !this.isHorizontal() &&
          t.find(".swiper-cube-shadow").transition(e);
    },
  };
  const Je = {
    setTranslate() {
      const e = this,
        { slides: t, rtlTranslate: i } = e;
      for (let s = 0; s < t.length; s += 1) {
        const a = t.eq(s);
        let r = a[0].progress;
        e.params.flipEffect.limitRotation &&
          (r = Math.max(Math.min(a[0].progress, 1), -1));
        let n = -180 * r,
          o = 0,
          l = -a[0].swiperSlideOffset,
          d = 0;
        if (
          (e.isHorizontal()
            ? i && (n = -n)
            : ((d = l), (l = 0), (o = -n), (n = 0)),
          (a[0].style.zIndex = -Math.abs(Math.round(r)) + t.length),
          e.params.flipEffect.slideShadows)
        ) {
          let t = e.isHorizontal()
              ? a.find(".swiper-slide-shadow-left")
              : a.find(".swiper-slide-shadow-top"),
            i = e.isHorizontal()
              ? a.find(".swiper-slide-shadow-right")
              : a.find(".swiper-slide-shadow-bottom");
          0 === t.length &&
            ((t = oe(
              `<div class="swiper-slide-shadow-${
                e.isHorizontal() ? "left" : "top"
              }"></div>`
            )),
            a.append(t)),
            0 === i.length &&
              ((i = oe(
                `<div class="swiper-slide-shadow-${
                  e.isHorizontal() ? "right" : "bottom"
                }"></div>`
              )),
              a.append(i)),
            t.length && (t[0].style.opacity = Math.max(-r, 0)),
            i.length && (i[0].style.opacity = Math.max(r, 0));
        }
        a.transform(
          `translate3d(${l}px, ${d}px, 0px) rotateX(${o}deg) rotateY(${n}deg)`
        );
      }
    },
    setTransition(e) {
      const t = this,
        { slides: i, activeIndex: s, $wrapperEl: a } = t;
      if (
        (i
          .transition(e)
          .find(
            ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
          )
          .transition(e),
        t.params.virtualTranslate && 0 !== e)
      ) {
        let e = !1;
        i.eq(s).transitionEnd(function () {
          if (e) return;
          if (!t || t.destroyed) return;
          (e = !0), (t.animating = !1);
          const i = ["webkitTransitionEnd", "transitionend"];
          for (let e = 0; e < i.length; e += 1) a.trigger(i[e]);
        });
      }
    },
  };
  const Ze = {
    setTranslate() {
      const {
          width: e,
          height: t,
          slides: i,
          $wrapperEl: s,
          slidesSizesGrid: a,
        } = this,
        r = this.params.coverflowEffect,
        n = this.isHorizontal(),
        o = this.translate,
        l = n ? e / 2 - o : t / 2 - o,
        d = n ? r.rotate : -r.rotate,
        p = r.depth;
      for (let e = 0, t = i.length; e < t; e += 1) {
        const t = i.eq(e),
          s = a[e],
          o = ((l - t[0].swiperSlideOffset - s / 2) / s) * r.modifier;
        let c = n ? d * o : 0,
          h = n ? 0 : d * o,
          u = -p * Math.abs(o),
          m = n ? 0 : r.stretch * o,
          g = n ? r.stretch * o : 0;
        Math.abs(g) < 0.001 && (g = 0),
          Math.abs(m) < 0.001 && (m = 0),
          Math.abs(u) < 0.001 && (u = 0),
          Math.abs(c) < 0.001 && (c = 0),
          Math.abs(h) < 0.001 && (h = 0);
        const f = `translate3d(${g}px,${m}px,${u}px)  rotateX(${h}deg) rotateY(${c}deg)`;
        if (
          (t.transform(f),
          (t[0].style.zIndex = 1 - Math.abs(Math.round(o))),
          r.slideShadows)
        ) {
          let e = n
              ? t.find(".swiper-slide-shadow-left")
              : t.find(".swiper-slide-shadow-top"),
            i = n
              ? t.find(".swiper-slide-shadow-right")
              : t.find(".swiper-slide-shadow-bottom");
          0 === e.length &&
            ((e = oe(
              `<div class="swiper-slide-shadow-${n ? "left" : "top"}"></div>`
            )),
            t.append(e)),
            0 === i.length &&
              ((i = oe(
                `<div class="swiper-slide-shadow-${
                  n ? "right" : "bottom"
                }"></div>`
              )),
              t.append(i)),
            e.length && (e[0].style.opacity = o > 0 ? o : 0),
            i.length && (i[0].style.opacity = -o > 0 ? -o : 0);
        }
      }
      if (ce.pointerEvents || ce.prefixedPointerEvents) {
        s[0].style.perspectiveOrigin = `${l}px 50%`;
      }
    },
    setTransition(e) {
      this.slides
        .transition(e)
        .find(
          ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
        )
        .transition(e);
    },
  };
  const Qe = {
    init() {
      const e = this,
        { thumbs: t } = e.params,
        i = e.constructor;
      t.swiper instanceof i
        ? ((e.thumbs.swiper = t.swiper),
          pe.extend(e.thumbs.swiper.originalParams, {
            watchSlidesProgress: !0,
            slideToClickedSlide: !1,
          }),
          pe.extend(e.thumbs.swiper.params, {
            watchSlidesProgress: !0,
            slideToClickedSlide: !1,
          }))
        : pe.isObject(t.swiper) &&
          ((e.thumbs.swiper = new i(
            pe.extend({}, t.swiper, {
              watchSlidesVisibility: !0,
              watchSlidesProgress: !0,
              slideToClickedSlide: !1,
            })
          )),
          (e.thumbs.swiperCreated = !0)),
        e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass),
        e.thumbs.swiper.on("tap", e.thumbs.onThumbClick);
    },
    onThumbClick() {
      const e = this,
        t = e.thumbs.swiper;
      if (!t) return;
      const i = t.clickedIndex,
        s = t.clickedSlide;
      if (s && oe(s).hasClass(e.params.thumbs.slideThumbActiveClass)) return;
      if (null == i) return;
      let a;
      if (
        ((a = t.params.loop
          ? parseInt(oe(t.clickedSlide).attr("data-swiper-slide-index"), 10)
          : i),
        e.params.loop)
      ) {
        let t = e.activeIndex;
        e.slides.eq(t).hasClass(e.params.slideDuplicateClass) &&
          (e.loopFix(),
          (e._clientLeft = e.$wrapperEl[0].clientLeft),
          (t = e.activeIndex));
        const i = e.slides
            .eq(t)
            .prevAll(`[data-swiper-slide-index="${a}"]`)
            .eq(0)
            .index(),
          s = e.slides
            .eq(t)
            .nextAll(`[data-swiper-slide-index="${a}"]`)
            .eq(0)
            .index();
        a = void 0 === i ? s : void 0 === s ? i : s - t < t - i ? s : i;
      }
      e.slideTo(a);
    },
    update(e) {
      const t = this,
        i = t.thumbs.swiper;
      if (!i) return;
      const s =
        "auto" === i.params.slidesPerView
          ? i.slidesPerViewDynamic()
          : i.params.slidesPerView;
      if (t.realIndex !== i.realIndex) {
        let a,
          r = i.activeIndex;
        if (i.params.loop) {
          i.slides.eq(r).hasClass(i.params.slideDuplicateClass) &&
            (i.loopFix(),
            (i._clientLeft = i.$wrapperEl[0].clientLeft),
            (r = i.activeIndex));
          const e = i.slides
              .eq(r)
              .prevAll(`[data-swiper-slide-index="${t.realIndex}"]`)
              .eq(0)
              .index(),
            s = i.slides
              .eq(r)
              .nextAll(`[data-swiper-slide-index="${t.realIndex}"]`)
              .eq(0)
              .index();
          a =
            void 0 === e
              ? s
              : void 0 === s
              ? e
              : s - r == r - e
              ? r
              : s - r < r - e
              ? s
              : e;
        } else a = t.realIndex;
        i.visibleSlidesIndexes.indexOf(a) < 0 &&
          (i.params.centeredSlides
            ? (a =
                a > r ? a - Math.floor(s / 2) + 1 : a + Math.floor(s / 2) - 1)
            : a > r && (a = a - s + 1),
          i.slideTo(a, e ? 0 : void 0));
      }
      let a = 1;
      const r = t.params.thumbs.slideThumbActiveClass;
      if (
        (t.params.slidesPerView > 1 &&
          !t.params.centeredSlides &&
          (a = t.params.slidesPerView),
        i.slides.removeClass(r),
        i.params.loop)
      )
        for (let e = 0; e < a; e += 1)
          i.$wrapperEl
            .children(`[data-swiper-slide-index="${t.realIndex + e}"]`)
            .addClass(r);
      else
        for (let e = 0; e < a; e += 1) i.slides.eq(t.realIndex + e).addClass(r);
    },
  };
  const et = [
    $e,
    Me,
    Pe,
    De,
    Le,
    Ae,
    Ne,
    {
      name: "mousewheel",
      params: {
        mousewheel: {
          enabled: !1,
          releaseOnEdges: !1,
          invert: !1,
          forceToAxis: !1,
          sensitivity: 1,
          eventsTarged: "container",
        },
      },
      create() {
        pe.extend(this, {
          mousewheel: {
            enabled: !1,
            enable: Oe.enable.bind(this),
            disable: Oe.disable.bind(this),
            handle: Oe.handle.bind(this),
            handleMouseEnter: Oe.handleMouseEnter.bind(this),
            handleMouseLeave: Oe.handleMouseLeave.bind(this),
            lastScrollTime: pe.now(),
          },
        });
      },
      on: {
        init() {
          this.params.mousewheel.enabled && this.mousewheel.enable();
        },
        destroy() {
          this.mousewheel.enabled && this.mousewheel.disable();
        },
      },
    },
    {
      name: "navigation",
      params: {
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: !1,
          disabledClass: "swiper-button-disabled",
          hiddenClass: "swiper-button-hidden",
          lockClass: "swiper-button-lock",
        },
      },
      create() {
        pe.extend(this, {
          navigation: {
            init: Fe.init.bind(this),
            update: Fe.update.bind(this),
            destroy: Fe.destroy.bind(this),
            onNextClick: Fe.onNextClick.bind(this),
            onPrevClick: Fe.onPrevClick.bind(this),
          },
        });
      },
      on: {
        init() {
          this.navigation.init(), this.navigation.update();
        },
        toEdge() {
          this.navigation.update();
        },
        fromEdge() {
          this.navigation.update();
        },
        destroy() {
          this.navigation.destroy();
        },
        click(e) {
          const t = this,
            { $nextEl: i, $prevEl: s } = t.navigation;
          if (
            t.params.navigation.hideOnClick &&
            !oe(e.target).is(s) &&
            !oe(e.target).is(i)
          ) {
            let e;
            i
              ? (e = i.hasClass(t.params.navigation.hiddenClass))
              : s && (e = s.hasClass(t.params.navigation.hiddenClass)),
              !0 === e
                ? t.emit("navigationShow", t)
                : t.emit("navigationHide", t),
              i && i.toggleClass(t.params.navigation.hiddenClass),
              s && s.toggleClass(t.params.navigation.hiddenClass);
          }
        },
      },
    },
    {
      name: "pagination",
      params: {
        pagination: {
          el: null,
          bulletElement: "span",
          clickable: !1,
          hideOnClick: !1,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: !1,
          type: "bullets",
          dynamicBullets: !1,
          dynamicMainBullets: 1,
          formatFractionCurrent: (e) => e,
          formatFractionTotal: (e) => e,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
          modifierClass: "swiper-pagination-",
          currentClass: "swiper-pagination-current",
          totalClass: "swiper-pagination-total",
          hiddenClass: "swiper-pagination-hidden",
          progressbarFillClass: "swiper-pagination-progressbar-fill",
          progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
          clickableClass: "swiper-pagination-clickable",
          lockClass: "swiper-pagination-lock",
        },
      },
      create() {
        pe.extend(this, {
          pagination: {
            init: He.init.bind(this),
            render: He.render.bind(this),
            update: He.update.bind(this),
            destroy: He.destroy.bind(this),
            dynamicBulletIndex: 0,
          },
        });
      },
      on: {
        init() {
          this.pagination.init(),
            this.pagination.render(),
            this.pagination.update();
        },
        activeIndexChange() {
          const e = this;
          e.params.loop
            ? e.pagination.update()
            : void 0 === e.snapIndex && e.pagination.update();
        },
        snapIndexChange() {
          const e = this;
          e.params.loop || e.pagination.update();
        },
        slidesLengthChange() {
          const e = this;
          e.params.loop && (e.pagination.render(), e.pagination.update());
        },
        snapGridLengthChange() {
          const e = this;
          e.params.loop || (e.pagination.render(), e.pagination.update());
        },
        destroy() {
          this.pagination.destroy();
        },
        click(e) {
          const t = this;
          if (
            t.params.pagination.el &&
            t.params.pagination.hideOnClick &&
            t.pagination.$el.length > 0 &&
            !oe(e.target).hasClass(t.params.pagination.bulletClass)
          ) {
            !0 === t.pagination.$el.hasClass(t.params.pagination.hiddenClass)
              ? t.emit("paginationShow", t)
              : t.emit("paginationHide", t),
              t.pagination.$el.toggleClass(t.params.pagination.hiddenClass);
          }
        },
      },
    },
    {
      name: "scrollbar",
      params: {
        scrollbar: {
          el: null,
          dragSize: "auto",
          hide: !1,
          draggable: !1,
          snapOnRelease: !0,
          lockClass: "swiper-scrollbar-lock",
          dragClass: "swiper-scrollbar-drag",
        },
      },
      create() {
        pe.extend(this, {
          scrollbar: {
            init: Ve.init.bind(this),
            destroy: Ve.destroy.bind(this),
            updateSize: Ve.updateSize.bind(this),
            setTranslate: Ve.setTranslate.bind(this),
            setTransition: Ve.setTransition.bind(this),
            enableDraggable: Ve.enableDraggable.bind(this),
            disableDraggable: Ve.disableDraggable.bind(this),
            setDragPosition: Ve.setDragPosition.bind(this),
            onDragStart: Ve.onDragStart.bind(this),
            onDragMove: Ve.onDragMove.bind(this),
            onDragEnd: Ve.onDragEnd.bind(this),
            isTouched: !1,
            timeout: null,
            dragTimeout: null,
          },
        });
      },
      on: {
        init() {
          this.scrollbar.init(),
            this.scrollbar.updateSize(),
            this.scrollbar.setTranslate();
        },
        update() {
          this.scrollbar.updateSize();
        },
        resize() {
          this.scrollbar.updateSize();
        },
        observerUpdate() {
          this.scrollbar.updateSize();
        },
        setTranslate() {
          this.scrollbar.setTranslate();
        },
        setTransition(e) {
          this.scrollbar.setTransition(e);
        },
        destroy() {
          this.scrollbar.destroy();
        },
      },
    },
    {
      name: "parallax",
      params: { parallax: { enabled: !1 } },
      create() {
        pe.extend(this, {
          parallax: {
            setTransform: Ye.setTransform.bind(this),
            setTranslate: Ye.setTranslate.bind(this),
            setTransition: Ye.setTransition.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          this.params.parallax.enabled &&
            ((this.params.watchSlidesProgress = !0),
            (this.originalParams.watchSlidesProgress = !0));
        },
        init() {
          this.params.parallax.enabled && this.parallax.setTranslate();
        },
        setTranslate() {
          this.params.parallax.enabled && this.parallax.setTranslate();
        },
        setTransition(e) {
          this.params.parallax.enabled && this.parallax.setTransition(e);
        },
      },
    },
    {
      name: "zoom",
      params: {
        zoom: {
          enabled: !1,
          maxRatio: 3,
          minRatio: 1,
          toggle: !0,
          containerClass: "swiper-zoom-container",
          zoomedSlideClass: "swiper-slide-zoomed",
        },
      },
      create() {
        const e = this,
          t = {
            enabled: !1,
            scale: 1,
            currentScale: 1,
            isScaling: !1,
            gesture: {
              $slideEl: void 0,
              slideWidth: void 0,
              slideHeight: void 0,
              $imageEl: void 0,
              $imageWrapEl: void 0,
              maxRatio: 3,
            },
            image: {
              isTouched: void 0,
              isMoved: void 0,
              currentX: void 0,
              currentY: void 0,
              minX: void 0,
              minY: void 0,
              maxX: void 0,
              maxY: void 0,
              width: void 0,
              height: void 0,
              startX: void 0,
              startY: void 0,
              touchesStart: {},
              touchesCurrent: {},
            },
            velocity: {
              x: void 0,
              y: void 0,
              prevPositionX: void 0,
              prevPositionY: void 0,
              prevTime: void 0,
            },
          };
        "onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out"
          .split(" ")
          .forEach((i) => {
            t[i] = Be[i].bind(e);
          }),
          pe.extend(e, { zoom: t });
        let i = 1;
        Object.defineProperty(e.zoom, "scale", {
          get: () => i,
          set(t) {
            if (i !== t) {
              const i = e.zoom.gesture.$imageEl
                  ? e.zoom.gesture.$imageEl[0]
                  : void 0,
                s = e.zoom.gesture.$slideEl
                  ? e.zoom.gesture.$slideEl[0]
                  : void 0;
              e.emit("zoomChange", t, i, s);
            }
            i = t;
          },
        });
      },
      on: {
        init() {
          const e = this;
          e.params.zoom.enabled && e.zoom.enable();
        },
        destroy() {
          this.zoom.disable();
        },
        touchStart(e) {
          this.zoom.enabled && this.zoom.onTouchStart(e);
        },
        touchEnd(e) {
          this.zoom.enabled && this.zoom.onTouchEnd(e);
        },
        doubleTap(e) {
          const t = this;
          t.params.zoom.enabled &&
            t.zoom.enabled &&
            t.params.zoom.toggle &&
            t.zoom.toggle(e);
        },
        transitionEnd() {
          const e = this;
          e.zoom.enabled && e.params.zoom.enabled && e.zoom.onTransitionEnd();
        },
      },
    },
    {
      name: "lazy",
      params: {
        lazy: {
          enabled: !1,
          loadPrevNext: !1,
          loadPrevNextAmount: 1,
          loadOnTransitionStart: !1,
          elementClass: "swiper-lazy",
          loadingClass: "swiper-lazy-loading",
          loadedClass: "swiper-lazy-loaded",
          preloaderClass: "swiper-lazy-preloader",
        },
      },
      create() {
        pe.extend(this, {
          lazy: {
            initialImageLoaded: !1,
            load: Ge.load.bind(this),
            loadInSlide: Ge.loadInSlide.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          const e = this;
          e.params.lazy.enabled &&
            e.params.preloadImages &&
            (e.params.preloadImages = !1);
        },
        init() {
          const e = this;
          e.params.lazy.enabled &&
            !e.params.loop &&
            0 === e.params.initialSlide &&
            e.lazy.load();
        },
        scroll() {
          const e = this;
          e.params.freeMode && !e.params.freeModeSticky && e.lazy.load();
        },
        resize() {
          const e = this;
          e.params.lazy.enabled && e.lazy.load();
        },
        scrollbarDragMove() {
          const e = this;
          e.params.lazy.enabled && e.lazy.load();
        },
        transitionStart() {
          const e = this;
          e.params.lazy.enabled &&
            (e.params.lazy.loadOnTransitionStart ||
              (!e.params.lazy.loadOnTransitionStart &&
                !e.lazy.initialImageLoaded)) &&
            e.lazy.load();
        },
        transitionEnd() {
          const e = this;
          e.params.lazy.enabled &&
            !e.params.lazy.loadOnTransitionStart &&
            e.lazy.load();
        },
      },
    },
    {
      name: "controller",
      params: { controller: { control: void 0, inverse: !1, by: "slide" } },
      create() {
        pe.extend(this, {
          controller: {
            control: this.params.controller.control,
            getInterpolateFunction: Re.getInterpolateFunction.bind(this),
            setTranslate: Re.setTranslate.bind(this),
            setTransition: Re.setTransition.bind(this),
          },
        });
      },
      on: {
        update() {
          const e = this;
          e.controller.control &&
            e.controller.spline &&
            ((e.controller.spline = void 0), delete e.controller.spline);
        },
        resize() {
          const e = this;
          e.controller.control &&
            e.controller.spline &&
            ((e.controller.spline = void 0), delete e.controller.spline);
        },
        observerUpdate() {
          const e = this;
          e.controller.control &&
            e.controller.spline &&
            ((e.controller.spline = void 0), delete e.controller.spline);
        },
        setTranslate(e, t) {
          this.controller.control && this.controller.setTranslate(e, t);
        },
        setTransition(e, t) {
          this.controller.control && this.controller.setTransition(e, t);
        },
      },
    },
    {
      name: "a11y",
      params: {
        a11y: {
          enabled: !0,
          notificationClass: "swiper-notification",
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          firstSlideMessage: "This is the first slide",
          lastSlideMessage: "This is the last slide",
          paginationBulletMessage: "Go to slide {{index}}",
        },
      },
      create() {
        const e = this;
        pe.extend(e, {
          a11y: {
            liveRegion: oe(
              `<span class="${e.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`
            ),
          },
        }),
          Object.keys(Xe).forEach((t) => {
            e.a11y[t] = Xe[t].bind(e);
          });
      },
      on: {
        init() {
          this.params.a11y.enabled &&
            (this.a11y.init(), this.a11y.updateNavigation());
        },
        toEdge() {
          this.params.a11y.enabled && this.a11y.updateNavigation();
        },
        fromEdge() {
          this.params.a11y.enabled && this.a11y.updateNavigation();
        },
        paginationUpdate() {
          this.params.a11y.enabled && this.a11y.updatePagination();
        },
        destroy() {
          this.params.a11y.enabled && this.a11y.destroy();
        },
      },
    },
    {
      name: "history",
      params: { history: { enabled: !1, replaceState: !1, key: "slides" } },
      create() {
        pe.extend(this, {
          history: {
            init: qe.init.bind(this),
            setHistory: qe.setHistory.bind(this),
            setHistoryPopState: qe.setHistoryPopState.bind(this),
            scrollToSlide: qe.scrollToSlide.bind(this),
            destroy: qe.destroy.bind(this),
          },
        });
      },
      on: {
        init() {
          const e = this;
          e.params.history.enabled && e.history.init();
        },
        destroy() {
          const e = this;
          e.params.history.enabled && e.history.destroy();
        },
        transitionEnd() {
          const e = this;
          e.history.initialized &&
            e.history.setHistory(e.params.history.key, e.activeIndex);
        },
      },
    },
    {
      name: "hash-navigation",
      params: {
        hashNavigation: { enabled: !1, replaceState: !1, watchState: !1 },
      },
      create() {
        pe.extend(this, {
          hashNavigation: {
            initialized: !1,
            init: je.init.bind(this),
            destroy: je.destroy.bind(this),
            setHash: je.setHash.bind(this),
            onHashCange: je.onHashCange.bind(this),
          },
        });
      },
      on: {
        init() {
          const e = this;
          e.params.hashNavigation.enabled && e.hashNavigation.init();
        },
        destroy() {
          const e = this;
          e.params.hashNavigation.enabled && e.hashNavigation.destroy();
        },
        transitionEnd() {
          const e = this;
          e.hashNavigation.initialized && e.hashNavigation.setHash();
        },
      },
    },
    {
      name: "autoplay",
      params: {
        autoplay: {
          enabled: !1,
          delay: 3e3,
          waitForTransition: !0,
          disableOnInteraction: !0,
          stopOnLastSlide: !1,
          reverseDirection: !1,
        },
      },
      create() {
        const e = this;
        pe.extend(e, {
          autoplay: {
            running: !1,
            paused: !1,
            run: We.run.bind(e),
            start: We.start.bind(e),
            stop: We.stop.bind(e),
            pause: We.pause.bind(e),
            onTransitionEnd(t) {
              e &&
                !e.destroyed &&
                e.$wrapperEl &&
                t.target === this &&
                (e.$wrapperEl[0].removeEventListener(
                  "transitionend",
                  e.autoplay.onTransitionEnd
                ),
                e.$wrapperEl[0].removeEventListener(
                  "webkitTransitionEnd",
                  e.autoplay.onTransitionEnd
                ),
                (e.autoplay.paused = !1),
                e.autoplay.running ? e.autoplay.run() : e.autoplay.stop());
            },
          },
        });
      },
      on: {
        init() {
          const e = this;
          e.params.autoplay.enabled && e.autoplay.start();
        },
        beforeTransitionStart(e, t) {
          const i = this;
          i.autoplay.running &&
            (t || !i.params.autoplay.disableOnInteraction
              ? i.autoplay.pause(e)
              : i.autoplay.stop());
        },
        sliderFirstMove() {
          const e = this;
          e.autoplay.running &&
            (e.params.autoplay.disableOnInteraction
              ? e.autoplay.stop()
              : e.autoplay.pause());
        },
        destroy() {
          const e = this;
          e.autoplay.running && e.autoplay.stop();
        },
      },
    },
    {
      name: "effect-fade",
      params: { fadeEffect: { crossFade: !1 } },
      create() {
        pe.extend(this, {
          fadeEffect: {
            setTranslate: Ue.setTranslate.bind(this),
            setTransition: Ue.setTransition.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          if ("fade" !== this.params.effect) return;
          this.classNames.push(`${this.params.containerModifierClass}fade`);
          const e = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: !0,
            spaceBetween: 0,
            virtualTranslate: !0,
          };
          pe.extend(this.params, e), pe.extend(this.originalParams, e);
        },
        setTranslate() {
          "fade" === this.params.effect && this.fadeEffect.setTranslate();
        },
        setTransition(e) {
          "fade" === this.params.effect && this.fadeEffect.setTransition(e);
        },
      },
    },
    {
      name: "effect-cube",
      params: {
        cubeEffect: {
          slideShadows: !0,
          shadow: !0,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
      },
      create() {
        pe.extend(this, {
          cubeEffect: {
            setTranslate: Ke.setTranslate.bind(this),
            setTransition: Ke.setTransition.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          if ("cube" !== this.params.effect) return;
          this.classNames.push(`${this.params.containerModifierClass}cube`),
            this.classNames.push(`${this.params.containerModifierClass}3d`);
          const e = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: !0,
            resistanceRatio: 0,
            spaceBetween: 0,
            centeredSlides: !1,
            virtualTranslate: !0,
          };
          pe.extend(this.params, e), pe.extend(this.originalParams, e);
        },
        setTranslate() {
          "cube" === this.params.effect && this.cubeEffect.setTranslate();
        },
        setTransition(e) {
          "cube" === this.params.effect && this.cubeEffect.setTransition(e);
        },
      },
    },
    {
      name: "effect-flip",
      params: { flipEffect: { slideShadows: !0, limitRotation: !0 } },
      create() {
        pe.extend(this, {
          flipEffect: {
            setTranslate: Je.setTranslate.bind(this),
            setTransition: Je.setTransition.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          if ("flip" !== this.params.effect) return;
          this.classNames.push(`${this.params.containerModifierClass}flip`),
            this.classNames.push(`${this.params.containerModifierClass}3d`);
          const e = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: !0,
            spaceBetween: 0,
            virtualTranslate: !0,
          };
          pe.extend(this.params, e), pe.extend(this.originalParams, e);
        },
        setTranslate() {
          "flip" === this.params.effect && this.flipEffect.setTranslate();
        },
        setTransition(e) {
          "flip" === this.params.effect && this.flipEffect.setTransition(e);
        },
      },
    },
    {
      name: "effect-coverflow",
      params: {
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: !0,
        },
      },
      create() {
        pe.extend(this, {
          coverflowEffect: {
            setTranslate: Ze.setTranslate.bind(this),
            setTransition: Ze.setTransition.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          "coverflow" === this.params.effect &&
            (this.classNames.push(
              `${this.params.containerModifierClass}coverflow`
            ),
            this.classNames.push(`${this.params.containerModifierClass}3d`),
            (this.params.watchSlidesProgress = !0),
            (this.originalParams.watchSlidesProgress = !0));
        },
        setTranslate() {
          "coverflow" === this.params.effect &&
            this.coverflowEffect.setTranslate();
        },
        setTransition(e) {
          "coverflow" === this.params.effect &&
            this.coverflowEffect.setTransition(e);
        },
      },
    },
    {
      name: "thumbs",
      params: {
        thumbs: {
          swiper: null,
          slideThumbActiveClass: "swiper-slide-thumb-active",
          thumbsContainerClass: "swiper-container-thumbs",
        },
      },
      create() {
        pe.extend(this, {
          thumbs: {
            swiper: null,
            init: Qe.init.bind(this),
            update: Qe.update.bind(this),
            onThumbClick: Qe.onThumbClick.bind(this),
          },
        });
      },
      on: {
        beforeInit() {
          const { thumbs: e } = this.params;
          e && e.swiper && (this.thumbs.init(), this.thumbs.update(!0));
        },
        slideChange() {
          this.thumbs.swiper && this.thumbs.update();
        },
        update() {
          this.thumbs.swiper && this.thumbs.update();
        },
        resize() {
          this.thumbs.swiper && this.thumbs.update();
        },
        observerUpdate() {
          this.thumbs.swiper && this.thumbs.update();
        },
        setTransition(e) {
          const t = this.thumbs.swiper;
          t && t.setTransition(e);
        },
        beforeDestroy() {
          const e = this.thumbs.swiper;
          e && this.thumbs.swiperCreated && e && e.destroy();
        },
      },
    },
  ];
  void 0 === ke.use &&
    ((ke.use = ke.Class.use), (ke.installModule = ke.Class.installModule)),
    ke.use(et);
  var tt =
    "/**\n * Swiper 4.5.0\n * Most modern mobile touch slider and framework with hardware accelerated transitions\n * http://www.idangero.us/swiper/\n *\n * Copyright 2014-2019 Vladimir Kharlampidi\n *\n * Released under the MIT License\n *\n * Released on: February 22, 2019\n */\n.swiper-container{margin:0 auto;position:relative;overflow:hidden;list-style:none;padding:0;z-index:1}.swiper-container-no-flexbox .swiper-slide{float:left}.swiper-container-vertical>.swiper-wrapper{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.swiper-container-multirow>.swiper-wrapper{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.swiper-container-free-mode>.swiper-wrapper{-webkit-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out;margin:0 auto}.swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:100%;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform}.swiper-slide-invisible-blank{visibility:hidden}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;-webkit-transition-property:height,-webkit-transform;transition-property:height,-webkit-transform;-o-transition-property:transform,height;transition-property:transform,height;transition-property:transform,height,-webkit-transform}.swiper-container-3d{-webkit-perspective:1200px;perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:-webkit-gradient(linear,right top,left top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-right{background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-top{background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-wp8-horizontal,.swiper-container-wp8-horizontal>.swiper-wrapper{-ms-touch-action:pan-y;touch-action:pan-y}.swiper-container-wp8-vertical,.swiper-container-wp8-vertical>.swiper-wrapper{-ms-touch-action:pan-x;touch-action:pan-x}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:27px;height:44px;margin-top:-22px;z-index:10;cursor:pointer;background-size:27px 44px;background-position:center;background-repeat:no-repeat}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");left:10px;right:auto}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");right:10px;left:auto}.swiper-button-prev.swiper-button-white,.swiper-container-rtl .swiper-button-next.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-next.swiper-button-white,.swiper-container-rtl .swiper-button-prev.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-prev.swiper-button-black,.swiper-container-rtl .swiper-button-next.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-next.swiper-button-black,.swiper-container-rtl .swiper-button-prev.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-lock{display:none}.swiper-pagination{position:absolute;text-align:center;-webkit-transition:.3s opacity;-o-transition:.3s opacity;transition:.3s opacity;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullets-dynamic{overflow:hidden;font-size:0}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{-webkit-transform:scale(.33);-ms-transform:scale(.33);transform:scale(.33);position:relative}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev{-webkit-transform:scale(.66);-ms-transform:scale(.66);transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev{-webkit-transform:scale(.33);-ms-transform:scale(.33);transform:scale(.33)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next{-webkit-transform:scale(.66);-ms-transform:scale(.66);transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next{-webkit-transform:scale(.33);-ms-transform:scale(.33);transform:scale(.33)}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;-webkit-box-shadow:none;box-shadow:none;-webkit-appearance:none;-moz-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-bullet-active{opacity:1;background:#007aff}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:6px 0;display:block}.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:8px}.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{display:inline-block;-webkit-transition:.2s top,.2s -webkit-transform;transition:.2s top,.2s -webkit-transform;-o-transition:.2s transform,.2s top;transition:.2s transform,.2s top;transition:.2s transform,.2s top,.2s -webkit-transform}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 4px}.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);white-space:nowrap}.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{-webkit-transition:.2s left,.2s -webkit-transform;transition:.2s left,.2s -webkit-transform;-o-transition:.2s transform,.2s left;transition:.2s transform,.2s left;transition:.2s transform,.2s left,.2s -webkit-transform}.swiper-container-horizontal.swiper-container-rtl>.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{-webkit-transition:.2s right,.2s -webkit-transform;transition:.2s right,.2s -webkit-transform;-o-transition:.2s transform,.2s right;transition:.2s transform,.2s right;transition:.2s transform,.2s right,.2s -webkit-transform}.swiper-pagination-progressbar{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progressbar .swiper-pagination-progressbar-fill{background:#007aff;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transform-origin:left top;-ms-transform-origin:left top;transform-origin:left top}.swiper-container-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{-webkit-transform-origin:right top;-ms-transform-origin:right top;transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progressbar,.swiper-container-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{width:100%;height:4px;left:0;top:0}.swiper-container-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,.swiper-container-vertical>.swiper-pagination-progressbar{width:4px;height:100%;left:0;top:0}.swiper-pagination-white .swiper-pagination-bullet-active{background:#fff}.swiper-pagination-progressbar.swiper-pagination-white{background:rgba(255,255,255,.25)}.swiper-pagination-progressbar.swiper-pagination-white .swiper-pagination-progressbar-fill{background:#fff}.swiper-pagination-black .swiper-pagination-bullet-active{background:#000}.swiper-pagination-progressbar.swiper-pagination-black{background:rgba(0,0,0,.25)}.swiper-pagination-progressbar.swiper-pagination-black .swiper-pagination-progressbar-fill{background:#000}.swiper-pagination-lock{display:none}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-scrollbar-lock{display:none}.swiper-zoom-container{width:100%;height:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;-o-object-fit:contain;object-fit:contain}.swiper-slide-zoomed{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;-webkit-animation:swiper-preloader-spin 1s steps(12,end) infinite;animation:swiper-preloader-spin 1s steps(12,end) infinite}.swiper-lazy-preloader:after{display:block;content:'';width:100%;height:100%;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");background-position:50%;background-size:100%;background-repeat:no-repeat}.swiper-lazy-preloader-white:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\")}@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-container-fade.swiper-container-free-mode .swiper-slide{-webkit-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;-webkit-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube{overflow:visible}.swiper-container-cube .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;visibility:hidden;-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube.swiper-container-rtl .swiper-slide{-webkit-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-flip{overflow:visible}.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-coverflow .swiper-wrapper{-ms-perspective:1200px}";
  function it(e) {
    if (!e || "object" != typeof e) return e;
    if ("[object Date]" == Object.prototype.toString.call(e))
      return new Date(e.getTime());
    if (Array.isArray(e)) return e.map(it);
    var t = {};
    return (
      Object.keys(e).forEach(function (i) {
        t[i] = it(e[i]);
      }),
      t
    );
  }
  !(function (e, t) {
    void 0 === t && (t = {});
    var i = t.insertAt;
    if (e && "undefined" != typeof document) {
      var s = document.head || document.getElementsByTagName("head")[0],
        a = document.createElement("style");
      (a.type = "text/css"),
        "top" === i && s.firstChild
          ? s.insertBefore(a, s.firstChild)
          : s.appendChild(a),
        a.styleSheet
          ? (a.styleSheet.cssText = e)
          : a.appendChild(document.createTextNode(e));
    }
  })(tt);
  var st = {},
    at =
      /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
    rt = "[^\\s]+",
    nt = /\[([^]*?)\]/gm,
    ot = function () {};
  function lt(e, t) {
    for (var i = [], s = 0, a = e.length; s < a; s++) i.push(e[s].substr(0, t));
    return i;
  }
  function dt(e) {
    return function (t, i, s) {
      var a = s[e].indexOf(
        i.charAt(0).toUpperCase() + i.substr(1).toLowerCase()
      );
      ~a && (t.month = a);
    };
  }
  function pt(e, t) {
    for (e = String(e), t = t || 2; e.length < t; ) e = "0" + e;
    return e;
  }
  var ct = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    ht = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    ut = lt(ht, 3),
    mt = lt(ct, 3);
  st.i18n = {
    dayNamesShort: mt,
    dayNames: ct,
    monthNamesShort: ut,
    monthNames: ht,
    amPm: ["am", "pm"],
    DoFn: function (e) {
      return (
        e +
        ["th", "st", "nd", "rd"][
          e % 10 > 3 ? 0 : ((e - (e % 10) != 10) * e) % 10
        ]
      );
    },
  };
  var gt = {
      D: function (e) {
        return e.getDate();
      },
      DD: function (e) {
        return pt(e.getDate());
      },
      Do: function (e, t) {
        return t.DoFn(e.getDate());
      },
      d: function (e) {
        return e.getDay();
      },
      dd: function (e) {
        return pt(e.getDay());
      },
      ddd: function (e, t) {
        return t.dayNamesShort[e.getDay()];
      },
      dddd: function (e, t) {
        return t.dayNames[e.getDay()];
      },
      M: function (e) {
        return e.getMonth() + 1;
      },
      MM: function (e) {
        return pt(e.getMonth() + 1);
      },
      MMM: function (e, t) {
        return t.monthNamesShort[e.getMonth()];
      },
      MMMM: function (e, t) {
        return t.monthNames[e.getMonth()];
      },
      YY: function (e) {
        return pt(String(e.getFullYear()), 4).substr(2);
      },
      YYYY: function (e) {
        return pt(e.getFullYear(), 4);
      },
      h: function (e) {
        return e.getHours() % 12 || 12;
      },
      hh: function (e) {
        return pt(e.getHours() % 12 || 12);
      },
      H: function (e) {
        return e.getHours();
      },
      HH: function (e) {
        return pt(e.getHours());
      },
      m: function (e) {
        return e.getMinutes();
      },
      mm: function (e) {
        return pt(e.getMinutes());
      },
      s: function (e) {
        return e.getSeconds();
      },
      ss: function (e) {
        return pt(e.getSeconds());
      },
      S: function (e) {
        return Math.round(e.getMilliseconds() / 100);
      },
      SS: function (e) {
        return pt(Math.round(e.getMilliseconds() / 10), 2);
      },
      SSS: function (e) {
        return pt(e.getMilliseconds(), 3);
      },
      a: function (e, t) {
        return e.getHours() < 12 ? t.amPm[0] : t.amPm[1];
      },
      A: function (e, t) {
        return e.getHours() < 12
          ? t.amPm[0].toUpperCase()
          : t.amPm[1].toUpperCase();
      },
      ZZ: function (e) {
        var t = e.getTimezoneOffset();
        return (
          (t > 0 ? "-" : "+") +
          pt(100 * Math.floor(Math.abs(t) / 60) + (Math.abs(t) % 60), 4)
        );
      },
    },
    ft = {
      D: [
        "\\d\\d?",
        function (e, t) {
          e.day = t;
        },
      ],
      Do: [
        "\\d\\d?" + rt,
        function (e, t) {
          e.day = parseInt(t, 10);
        },
      ],
      M: [
        "\\d\\d?",
        function (e, t) {
          e.month = t - 1;
        },
      ],
      YY: [
        "\\d\\d?",
        function (e, t) {
          var i = +("" + new Date().getFullYear()).substr(0, 2);
          e.year = "" + (t > 68 ? i - 1 : i) + t;
        },
      ],
      h: [
        "\\d\\d?",
        function (e, t) {
          e.hour = t;
        },
      ],
      m: [
        "\\d\\d?",
        function (e, t) {
          e.minute = t;
        },
      ],
      s: [
        "\\d\\d?",
        function (e, t) {
          e.second = t;
        },
      ],
      YYYY: [
        "\\d{4}",
        function (e, t) {
          e.year = t;
        },
      ],
      S: [
        "\\d",
        function (e, t) {
          e.millisecond = 100 * t;
        },
      ],
      SS: [
        "\\d{2}",
        function (e, t) {
          e.millisecond = 10 * t;
        },
      ],
      SSS: [
        "\\d{3}",
        function (e, t) {
          e.millisecond = t;
        },
      ],
      d: ["\\d\\d?", ot],
      ddd: [rt, ot],
      MMM: [rt, dt("monthNamesShort")],
      MMMM: [rt, dt("monthNames")],
      a: [
        rt,
        function (e, t, i) {
          var s = t.toLowerCase();
          s === i.amPm[0] ? (e.isPm = !1) : s === i.amPm[1] && (e.isPm = !0);
        },
      ],
      ZZ: [
        "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",
        function (e, t) {
          var i,
            s = (t + "").match(/([+-]|\d\d)/gi);
          s &&
            ((i = 60 * s[1] + parseInt(s[2], 10)),
            (e.timezoneOffset = "+" === s[0] ? i : -i));
        },
      ],
    };
  (ft.dd = ft.d),
    (ft.dddd = ft.ddd),
    (ft.DD = ft.D),
    (ft.mm = ft.m),
    (ft.hh = ft.H = ft.HH = ft.h),
    (ft.MM = ft.M),
    (ft.ss = ft.s),
    (ft.A = ft.a),
    (st.masks = {
      default: "ddd MMM DD YYYY HH:mm:ss",
      shortDate: "M/D/YY",
      mediumDate: "MMM D, YYYY",
      longDate: "MMMM D, YYYY",
      fullDate: "dddd, MMMM D, YYYY",
      shortTime: "HH:mm",
      mediumTime: "HH:mm:ss",
      longTime: "HH:mm:ss.SSS",
    }),
    (st.format = function (e, t, i) {
      var s = i || st.i18n;
      if (
        ("number" == typeof e && (e = new Date(e)),
        "[object Date]" !== Object.prototype.toString.call(e) ||
          isNaN(e.getTime()))
      )
        throw new Error("Invalid Date in fecha.format");
      t = st.masks[t] || t || st.masks.default;
      var a = [];
      return (t = (t = t.replace(nt, function (e, t) {
        return a.push(t), "@@@";
      })).replace(at, function (t) {
        return t in gt ? gt[t](e, s) : t.slice(1, t.length - 1);
      })).replace(/@@@/g, function () {
        return a.shift();
      });
    }),
    (st.parse = function (e, t, i) {
      var s = i || st.i18n;
      if ("string" != typeof t)
        throw new Error("Invalid format in fecha.parse");
      if (((t = st.masks[t] || t), e.length > 1e3)) return null;
      var a = {},
        r = [],
        n = [];
      t = t.replace(nt, function (e, t) {
        return n.push(t), "@@@";
      });
      var o,
        l = ((o = t), o.replace(/[|\\{()[^$+*?.-]/g, "\\$&")).replace(
          at,
          function (e) {
            if (ft[e]) {
              var t = ft[e];
              return r.push(t[1]), "(" + t[0] + ")";
            }
            return e;
          }
        );
      l = l.replace(/@@@/g, function () {
        return n.shift();
      });
      var d = e.match(new RegExp(l, "i"));
      if (!d) return null;
      for (var p = 1; p < d.length; p++) r[p - 1](a, d[p], s);
      var c,
        h = new Date();
      return (
        !0 === a.isPm && null != a.hour && 12 != +a.hour
          ? (a.hour = +a.hour + 12)
          : !1 === a.isPm && 12 == +a.hour && (a.hour = 0),
        null != a.timezoneOffset
          ? ((a.minute = +(a.minute || 0) - +a.timezoneOffset),
            (c = new Date(
              Date.UTC(
                a.year || h.getFullYear(),
                a.month || 0,
                a.day || 1,
                a.hour || 0,
                a.minute || 0,
                a.second || 0,
                a.millisecond || 0
              )
            )))
          : (c = new Date(
              a.year || h.getFullYear(),
              a.month || 0,
              a.day || 1,
              a.hour || 0,
              a.minute || 0,
              a.second || 0,
              a.millisecond || 0
            )),
        c
      );
    });
  (function () {
    try {
      new Date().toLocaleDateString("i");
    } catch (e) {
      return "RangeError" === e.name;
    }
  })(),
    (function () {
      try {
        new Date().toLocaleString("i");
      } catch (e) {
        return "RangeError" === e.name;
      }
    })(),
    (function () {
      try {
        new Date().toLocaleTimeString("i");
      } catch (e) {
        return "RangeError" === e.name;
      }
    })();
  var vt = function (e, t, i, s) {
    (s = s || {}), (i = null == i ? {} : i);
    var a = new Event(t, {
      bubbles: void 0 === s.bubbles || s.bubbles,
      cancelable: Boolean(s.cancelable),
      composed: void 0 === s.composed || s.composed,
    });
    return (a.detail = i), e.dispatchEvent(a), a;
  };
  String(Math.random()).slice(2);
  try {
    const e = {
      get capture() {
        return !1;
      },
    };
    window.addEventListener("test", e, e),
      window.removeEventListener("test", e, e);
  } catch (e) {}
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");
  var wt =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0,
    bt = (function (e) {
      function t() {
        e.call(this),
          (this.holdTime = 500),
          (this.ripple = document.createElement("paper-ripple")),
          (this.timer = void 0),
          (this.held = !1),
          (this.cooldownStart = !1),
          (this.cooldownEnd = !1),
          (this.nbClicks = 0);
      }
      return (
        e && (t.__proto__ = e),
        ((t.prototype = Object.create(e && e.prototype)).constructor = t),
        (t.prototype.connectedCallback = function () {
          var e = this;
          Object.assign(this.style, {
            borderRadius: "50%",
            position: "absolute",
            width: wt ? "100px" : "50px",
            height: wt ? "100px" : "50px",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }),
            this.appendChild(this.ripple),
            (this.ripple.style.color = "#03a9f4"),
            (this.ripple.style.color = "var(--primary-color)"),
            [
              "touchcancel",
              "mouseout",
              "mouseup",
              "touchmove",
              "mousewheel",
              "wheel",
              "scroll",
            ].forEach(function (t) {
              document.addEventListener(
                t,
                function () {
                  clearTimeout(e.timer), e.stopAnimation(), (e.timer = void 0);
                },
                { passive: !0 }
              );
            });
        }),
        (t.prototype.bind = function (e) {
          var t = this;
          if (!e.longPress) {
            (e.longPress = !0),
              e.addEventListener("contextmenu", function (e) {
                var t = e || window.event;
                return (
                  t.preventDefault && t.preventDefault(),
                  t.stopPropagation && t.stopPropagation(),
                  (t.cancelBubble = !0),
                  (t.returnValue = !1),
                  !1
                );
              });
            var i = function (i) {
                var s, a;
                t.cooldownStart ||
                  ((t.held = !1),
                  i.touches
                    ? ((s = i.touches[0].pageX), (a = i.touches[0].pageY))
                    : ((s = i.pageX), (a = i.pageY)),
                  (t.timer = window.setTimeout(function () {
                    t.startAnimation(s, a),
                      (t.held = !0),
                      e.repeat &&
                        !e.isRepeating &&
                        ((e.isRepeating = !0),
                        (t.repeatTimeout = setInterval(function () {
                          e.dispatchEvent(new Event("ha-hold"));
                        }, e.repeat)));
                  }, t.holdTime)),
                  (t.cooldownStart = !0),
                  window.setTimeout(function () {
                    return (t.cooldownStart = !1);
                  }, 100));
              },
              s = function (i) {
                t.cooldownEnd ||
                (["touchend", "touchcancel"].includes(i.type) &&
                  void 0 === t.timer)
                  ? e.isRepeating &&
                    t.repeatTimeout &&
                    (clearInterval(t.repeatTimeout), (e.isRepeating = !1))
                  : (clearTimeout(t.timer),
                    e.isRepeating &&
                      t.repeatTimeout &&
                      clearInterval(t.repeatTimeout),
                    (e.isRepeating = !1),
                    t.stopAnimation(),
                    (t.timer = void 0),
                    t.held
                      ? e.repeat || e.dispatchEvent(new Event("ha-hold"))
                      : e.hasDblClick
                      ? 0 === t.nbClicks
                        ? ((t.nbClicks += 1),
                          (t.dblClickTimeout = window.setTimeout(function () {
                            1 === t.nbClicks &&
                              ((t.nbClicks = 0),
                              e.dispatchEvent(new Event("ha-click")));
                          }, 250)))
                        : ((t.nbClicks = 0),
                          clearTimeout(t.dblClickTimeout),
                          e.dispatchEvent(new Event("ha-dblclick")))
                      : e.dispatchEvent(new Event("ha-click")),
                    (t.cooldownEnd = !0),
                    window.setTimeout(function () {
                      return (t.cooldownEnd = !1);
                    }, 100));
              };
            e.addEventListener("touchstart", i, { passive: !0 }),
              e.addEventListener("touchend", s),
              e.addEventListener("touchcancel", s),
              e.addEventListener("mousedown", i, { passive: !0 }),
              e.addEventListener("click", s);
          }
        }),
        (t.prototype.startAnimation = function (e, t) {
          Object.assign(this.style, {
            left: e + "px",
            top: t + "px",
            display: null,
          }),
            (this.ripple.holdDown = !0),
            this.ripple.simulatedRipple();
        }),
        (t.prototype.stopAnimation = function () {
          (this.ripple.holdDown = !1), (this.style.display = "none");
        }),
        t
      );
    })(HTMLElement);
  customElements.get("long-press-custom-card-helpers") ||
    customElements.define("long-press-custom-card-helpers", bt);
  const yt = "custom:";
  customElements.define(
    "swipe-card",
    class extends se {
      static get properties() {
        return { _config: {}, _cards: {}, _hass: {} };
      }
      static get styles() {
        return [
          te`
        ${ee(tt)}
      `,
          te`
        .swiper-pagination-bullet-active {
          background: var(--primary-color);
        }
        .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
          background: var(--primary-color);
        }
        .swiper-scrollbar-drag {
          background: var(--primary-color);
        }
        .swiper-button-prev {
          background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z' fill='var(--primary-color)'/></svg>");
        }
        .swiper-button-next {
          background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z' fill='var(--primary-color)'/></svg>");
        }
      `,
        ];
      }
      setConfig(e) {
        if (!e || !e.cards || !Array.isArray(e.cards))
          throw new Error("Card config incorrect");
        (this._config = it(e)),
          (this._parameters = this._config.parameters || {}),
          (this._cards = this._config.cards.map((e) =>
            this._createCardElement(e)
          ));
      }
      set hass(e) {
        (this._hass = e),
          this._cards &&
            this._cards.forEach((e) => {
              e.hass = this._hass;
            });
      }
      connectedCallback() {
        super.connectedCallback(),
          this._config && this._hass && this._updated && !this._loaded
            ? this._initialLoad()
            : this.swiper && this.swiper.update();
      }
      updated(e) {
        super.updated(e),
          (this._updated = !0),
          this._config && this._hass && this.isConnected && !this._loaded
            ? this._initialLoad()
            : this.swiper && this.swiper.update();
      }
      render() {
        return this._config && this._hass
          ? D`
      <div
        class="swiper-container"
        dir="${
          this._hass.translationMetadata.translations[
            this._hass.selectedLanguage || this._hass.language
          ].isRTL
            ? "rtl"
            : "ltr"
        }"
      >
        <div class="swiper-wrapper">
          ${this._cards}
        </div>
        ${
          "pagination" in this._parameters
            ? D`
              <div class="swiper-pagination"></div>
            `
            : ""
        }
        ${
          "navigation" in this._parameters
            ? D`
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            `
            : ""
        }
        ${
          "scrollbar" in this._parameters
            ? D`
              <div class="swiper-scrollbar"></div>
            `
            : ""
        }
      </div>
    `
          : D``;
      }
      async _initialLoad() {
        (this._loaded = !0),
          await this.updateComplete,
          "pagination" in this._parameters &&
            (null === this._parameters.pagination &&
              (this._parameters.pagination = {}),
            (this._parameters.pagination.el =
              this.shadowRoot.querySelector(".swiper-pagination"))),
          "navigation" in this._parameters &&
            (null === this._parameters.navigation &&
              (this._parameters.navigation = {}),
            (this._parameters.navigation.nextEl = this.shadowRoot.querySelector(
              ".swiper-button-next"
            )),
            (this._parameters.navigation.prevEl = this.shadowRoot.querySelector(
              ".swiper-button-prev"
            ))),
          "scrollbar" in this._parameters &&
            (null === this._parameters.scrollbar &&
              (this._parameters.scrollbar = {}),
            (this._parameters.scrollbar.el =
              this.shadowRoot.querySelector(".swiper-scrollbar"))),
          "start_card" in this._config &&
            (this._parameters.initialSlide = this._config.start_card - 1),
          (this.swiper = new ke(
            this.shadowRoot.querySelector(".swiper-container"),
            this._parameters
          ));
      }
      _createCardElement(e) {
        let t, i;
        if (e.type.startsWith(yt)) {
          const s = e.type.substr(yt.length);
          if (customElements.get(s)) t = window.document.createElement(`${s}`);
          else {
            (i = {
              type: "error",
              error: `Custom element doesn't exist: ${s}.`,
              cardConfig: e,
            }),
              ((t =
                window.document.createElement("hui-error-card")).style.display =
                "None");
            const a = window.setTimeout(() => {
              t.style.display = "";
            }, 5e3);
            customElements.whenDefined(s).then(() => {
              clearTimeout(a), vt(t, "ll-rebuild"), vt(t, "rebuild-view");
            });
          }
        } else t = window.document.createElement(`hui-${e.type}-card`);
        return (
          (t.className = "swiper-slide"),
          "card_width" in this._config &&
            (t.style.width = this._config.card_width),
          i ? t.setConfig(i) : t.setConfig(e),
          this._hass && (t.hass = this._hass),
          t.addEventListener(
            "ll-rebuild",
            (i) => {
              i.stopPropagation(), this._rebuildCard(t, e);
            },
            { once: !0 }
          ),
          t
        );
      }
      _rebuildCard(e, t) {
        const i = this._createCardElement(t);
        e.replaceWith(i), this._cards.splice(this._cards.indexOf(e), 1, i);
      }
      getCardSize() {
        return 2;
      }
    }
  );
});
