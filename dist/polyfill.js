(function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  (function () {
    var k,
        l = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, d) {
      a != Array.prototype && a != Object.prototype && (a[b] = d.value);
    },
        m = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;function n() {
      n = function n() {};m.Symbol || (m.Symbol = p);
    }var p = function () {
      var a = 0;return function (b) {
        return "jscomp_symbol_" + (b || "") + a++;
      };
    }();
    function r() {
      n();var a = m.Symbol.iterator;a || (a = m.Symbol.iterator = m.Symbol("iterator"));"function" != typeof Array.prototype[a] && l(Array.prototype, a, { configurable: !0, writable: !0, value: function value() {
          return u(this);
        } });r = function r() {};
    }function u(a) {
      var b = 0;return v(function () {
        return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
      });
    }function v(a) {
      r();a = { next: a };a[m.Symbol.iterator] = function () {
        return this;
      };return a;
    }function w(a) {
      r();n();r();var b = a[Symbol.iterator];return b ? b.call(a) : u(a);
    }var x;
    if ("function" == typeof Object.setPrototypeOf) x = Object.setPrototypeOf;else {
      var z;a: {
        var A = { o: !0 },
            B = {};try {
          B.__proto__ = A;z = B.o;break a;
        } catch (a) {}z = !1;
      }x = z ? function (a, b) {
        a.__proto__ = b;if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");return a;
      } : null;
    }var C = x;function D() {
      this.g = !1;this.c = null;this.m = void 0;this.b = 1;this.l = this.s = 0;this.f = null;
    }function E(a) {
      if (a.g) throw new TypeError("Generator is already running");a.g = !0;
    }D.prototype.h = function (a) {
      this.m = a;
    };
    D.prototype.i = function (a) {
      this.f = { u: a, v: !0 };this.b = this.s || this.l;
    };D.prototype["return"] = function (a) {
      this.f = { "return": a };this.b = this.l;
    };function F(a, b, d) {
      a.b = d;return { value: b };
    }function G(a) {
      this.w = a;this.j = [];for (var b in a) {
        this.j.push(b);
      }this.j.reverse();
    }function H(a) {
      this.a = new D();this.A = a;
    }H.prototype.h = function (a) {
      E(this.a);if (this.a.c) return I(this, this.a.c.next, a, this.a.h);this.a.h(a);return J(this);
    };
    function K(a, b) {
      E(a.a);var d = a.a.c;if (d) return I(a, "return" in d ? d["return"] : function (a) {
        return { value: a, done: !0 };
      }, b, a.a["return"]);a.a["return"](b);return J(a);
    }H.prototype.i = function (a) {
      E(this.a);if (this.a.c) return I(this, this.a.c["throw"], a, this.a.h);this.a.i(a);return J(this);
    };
    function I(a, b, d, c) {
      try {
        var e = b.call(a.a.c, d);if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");if (!e.done) return a.a.g = !1, e;var f = e.value;
      } catch (g) {
        return a.a.c = null, a.a.i(g), J(a);
      }a.a.c = null;c.call(a.a, f);return J(a);
    }function J(a) {
      for (; a.a.b;) {
        try {
          var b = a.A(a.a);if (b) return a.a.g = !1, { value: b.value, done: !1 };
        } catch (d) {
          a.a.m = void 0, a.a.i(d);
        }
      }a.a.g = !1;if (a.a.f) {
        b = a.a.f;a.a.f = null;if (b.v) throw b.u;return { value: b["return"], done: !0 };
      }return { value: void 0, done: !0 };
    }
    function L(a) {
      this.next = function (b) {
        return a.h(b);
      };this["throw"] = function (b) {
        return a.i(b);
      };this["return"] = function (b) {
        return K(a, b);
      };r();this[Symbol.iterator] = function () {
        return this;
      };
    }function M(a, b) {
      var d = new L(new H(b));C && C(d, a.prototype);return d;
    }
    if ("undefined" === typeof FormData || !FormData.prototype.keys) {
      var N = function N(a, b, d) {
        if (2 > arguments.length) throw new TypeError("2 arguments required, but only " + arguments.length + " present.");return b instanceof Blob ? [a + "", b, void 0 !== d ? d + "" : "string" === typeof b.name ? b.name : "blob"] : [a + "", b + ""];
      },
          O = function O(a) {
        if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");return [a + ""];
      },
          P = function P(a) {
        var b = w(a);a = b.next().value;b = b.next().value;a instanceof Blob && (a = new File([a], b, { type: a.type,
          lastModified: a.lastModified }));return a;
      },
          Q = "object" === (typeof window === "undefined" ? "undefined" : _typeof(window)) ? window : "object" === (typeof self === "undefined" ? "undefined" : _typeof(self)) ? self : this,
          R = Q.FormData,
          S = Q.XMLHttpRequest && Q.XMLHttpRequest.prototype.send,
          T = Q.Request && Q.fetch;n();var U = Q.Symbol && Symbol.toStringTag,
          V = new WeakMap(),
          W = Array.from || function (a) {
        return [].slice.call(a);
      };U && (Blob.prototype[U] || (Blob.prototype[U] = "Blob"), "File" in Q && !File.prototype[U] && (File.prototype[U] = "File"));try {
        new File([], "");
      } catch (a) {
        Q.File = function (b, d, c) {
          b = new Blob(b, c);c = c && void 0 !== c.lastModified ? new Date(c.lastModified) : new Date();Object.defineProperties(b, { name: { value: d }, lastModifiedDate: { value: c }, lastModified: { value: +c }, toString: { value: function value() {
                return "[object File]";
              } } });U && Object.defineProperty(b, U, { value: "File" });return b;
        };
      }var X = function X(a) {
        V.set(this, Object.create(null));if (!a) return this;a = w(W(a.elements));for (var b = a.next(); !b.done; b = a.next()) {
          if (b = b.value, b.name && !b.disabled) if ("file" === b.type) for (var d = w(b.files), c = d.next(); !c.done; c = d.next()) {
            this.append(b.name, c.value);
          } else if ("select-multiple" === b.type || "select-one" === b.type) for (d = w(W(b.options)), c = d.next(); !c.done; c = d.next()) {
            c = c.value, !c.disabled && c.selected && this.append(b.name, c.value);
          } else "checkbox" === b.type || "radio" === b.type ? b.checked && this.append(b.name, b.value) : this.append(b.name, b.value);
        }
      };k = X.prototype;k.append = function (a, b, d) {
        var c = V.get(this);c[a] || (c[a] = []);c[a].push([b, d]);
      };k["delete"] = function (a) {
        delete V.get(this)[a];
      };k.entries = function b() {
        var d = this,
            c,
            e,
            f,
            g,
            h,
            q;return M(b, function (b) {
          switch (b.b) {case 1:
              c = V.get(d), f = new G(c);
            case 2:
              var t;a: {
                for (t = f; 0 < t.j.length;) {
                  var y = t.j.pop();if (y in t.w) {
                    t = y;break a;
                  }
                }t = null;
              }if (null == (e = t)) {
                b.b = 0;break;
              }g = w(c[e]);h = g.next();case 5:
              if (h.done) {
                b.b = 2;break;
              }q = h.value;return F(b, [e, P(q)], 6);case 6:
              h = g.next(), b.b = 5;}
        });
      };k.forEach = function (b, d) {
        for (var c = w(this), e = c.next(); !e.done; e = c.next()) {
          var f = w(e.value);e = f.next().value;f = f.next().value;b.call(d, f, e, this);
        }
      };k.get = function (b) {
        var d = V.get(this);return d[b] ? P(d[b][0]) : null;
      };k.getAll = function (b) {
        return (V.get(this)[b] || []).map(P);
      };k.has = function (b) {
        return b in V.get(this);
      };k.keys = function d() {
        var c = this,
            e,
            f,
            g,
            h,
            q;return M(d, function (d) {
          1 == d.b && (e = w(c), f = e.next());if (3 != d.b) {
            if (f.done) {
              d.b = 0;return;
            }g = f.value;h = w(g);q = h.next().value;return F(d, q, 3);
          }f = e.next();d.b = 2;
        });
      };k.set = function (d, c, e) {
        V.get(this)[d] = [[c, e]];
      };k.values = function c() {
        var e = this,
            f,
            g,
            h,
            q,
            y;return M(c, function (c) {
          1 == c.b && (f = w(e), g = f.next());if (3 != c.b) {
            if (g.done) {
              c.b = 0;return;
            }h = g.value;q = w(h);q.next();y = q.next().value;return F(c, y, 3);
          }g = f.next();c.b = 2;
        });
      };X.prototype._asNative = function () {
        for (var c = new R(), e = w(this), f = e.next(); !f.done; f = e.next()) {
          var g = w(f.value);f = g.next().value;g = g.next().value;c.append(f, g);
        }return c;
      };X.prototype._blob = function () {
        for (var c = "----formdata-polyfill-" + Math.random(), e = [], f = w(this), g = f.next(); !g.done; g = f.next()) {
          var h = w(g.value);g = h.next().value;h = h.next().value;e.push("--" + c + "\r\n");h instanceof Blob ? e.push('Content-Disposition: form-data; name="' + g + '"; filename="' + h.name + '"\r\n', "Content-Type: " + (h.type || "application/octet-stream") + "\r\n\r\n", h, "\r\n") : e.push('Content-Disposition: form-data; name="' + g + '"\r\n\r\n' + h + "\r\n");
        }e.push("--" + c + "--");return new Blob(e, { type: "multipart/form-data; boundary=" + c });
      };n();r();X.prototype[Symbol.iterator] = function () {
        return this.entries();
      };X.prototype.toString = function () {
        return "[object FormData]";
      };U && (X.prototype[U] = "FormData");[["append", N], ["delete", O], ["get", O], ["getAll", O], ["has", O], ["set", N]].forEach(function (c) {
        var e = X.prototype[c[0]];X.prototype[c[0]] = function () {
          return e.apply(this, c[1].apply(this, W(arguments)));
        };
      });S && (XMLHttpRequest.prototype.send = function (c) {
        c instanceof X ? (c = c._blob(), this.setRequestHeader("Content-Type", c.type), S.call(this, c)) : S.call(this, c);
      });if (T) {
        var Y = Q.fetch;Q.fetch = function (c, e) {
          e && e.body && e.body instanceof X && (e.body = e.body._blob());return Y(c, e);
        };
      }Q.FormData = X;
    }})();

}());
