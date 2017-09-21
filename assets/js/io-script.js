"use strict";

class IoScript {

  constructor(config = {}) {
    this.config = config;
    this.Prettify = (code) => `      ${code.replace(/;/gi, ";\n\n")}`;
    this.Prefixes = ["=", "->", "capture", "print", "write", "require", "scope"];
    if(config.AutoCompile) this.AutoCompile();
    this.Helpers();
    this.Patterns();
    return this;
  }

  static GetInstance(
    config = {
      debug: true,
      protected: true,
      pretty: false,
      AutoCompile: true
    }
  ){
    if(!IoScript.instance){
      IoScript.instance = new IoScript(config);
    }
    return IoScript.instance;
  }

  AutoCompile() {
    var io = this;
    addEventListener("DOMContentLoaded", () => {
      const codes = Array.from(document.querySelectorAll("[type='text/io-script']"));
      codes.map((c) => {
        // Static Compile
        if (c.innerText.length > 0) io.Compile(c.innerText);
        // Fetch Compile
        if (c.getAttribute("src")) {
          fetch(c.getAttribute("src")).then((res) => {
            return res.text();
          }).then((response) => {
            io.Compile(response.toString());
          });
        }
      });
    });
  }

  Helpers() {

    Object.prototype.each = function(fn) {
      var s = this,
        keys = Object.keys(s);
      keys.map((v, i) => fn(s[v], v));
    }

    Object.prototype.toJson = function() {
      var obj = this;
      var tabjson = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          tabjson.push(`"${p}":${obj[p]}`);
        }
      }
      return '{' + tabjson.join(',') + '}';
    }

  }

  Patterns() {
    return {
      "):": "){",
      "endif;": "}",
      "ielse:": "}else{",
      "ielse;": "}",
      "->": ".",
      "Private::": "scope.Private.",
      "Public::": "scope.Public.",
      "<(": "`",
      ")>": "`"
    }
  }

  Regexs() {
    const ParsedModule = (module) => {

      const prefix = (p) => `io-modules/` + p + `/src/` + p + `.js`;

      const binder = function(module) {
        if (module.includes(`"`)) {
          module = module.replace(new RegExp(`"`, "gi"), "");
        } else if (module.includes(`'`)) {
          module = module.replace(new RegExp(`'`, "gi"), "");
        } else if (module.includes("{") && module.includes("}")) {
          module = module.replace(new RegExp(`[{}]`, "gi"), "");
        }
        return module;
      };

      var modular = [];

      if (module.includes('[') && module.includes(']')) {
        var modules = module.replace(/\[/gi, "").replace(/\]/gi, "").split(",");
        modules.map((m) => {
          modular.push(prefix(binder(m)));
        });
      } else {
        modular.push(prefix(binder(m)));
      }

      return modular;

    };
    const ParsedTemplate = ($_code) => {
      if ($_code.includes("{") && $_code.includes("}")) {
        if ($_code.includes(`"`)) {
          $_code = $_code.replace(new RegExp(`"`, "gi"), "");
        } else if ($_code.includes(`'`)) {
          $_code = $_code.replace(new RegExp(`'`, "gi"), "");
        }
        $_code = $_code.replace(/\{/gi, "${");
        if (!$_code.includes("`")) {
          $_code = "`" + $_code + "`";
        }
      } else {
        $_code = false;
      }
      return $_code;
    };
    var s = this;
    return {
      "print(.*);": function($_code) {
        if (ParsedTemplate($_code)) {
          $_code = ParsedTemplate($_code);
        }
        return `console.log(${$_code});`;
      },
      "capture(.*);": function($_code) {
        if (ParsedTemplate($_code)) {
          $_code = ParsedTemplate($_code);
        }
        return `prompt(${$_code});`;
      },
      "write(.*);": function($_code) {
        if (ParsedTemplate($_code)) {
          $_code = ParsedTemplate($_code);
        }
        return `document.write(${$_code});`;
      },
      "require((.*));": function($_code) {

        $_code = $_code.trim().replace(/[()]/gi, "").replace(/\s/gi, "");

        if (ParsedTemplate($_code)) {
          $_code = ParsedTemplate($_code);
        }
        var c = ParsedModule($_code);
        var imported = {};
        c.map((PATH) => {

          if ("debug" in s.config && s.config.debug) {
            console.log("IMPORT MODULE : " + PATH);
          }

          fetch(PATH).then((res) => {
            return res.text();
          }).then((module) => {
            var prefix = (code) => {
              return `var exports = {}; ${code} return exports;`;
            };
            if (sessionStorage.getItem(PATH)) {
              sessionStorage.removeItem(PATH)
            }

            var rt = "";

            module.split('\n').map((c) => {
              rt += s.CompilePattern(c);
            });

            sessionStorage.setItem(PATH, prefix(rt));

          });
          imported = Object.assign(imported, new Function("", sessionStorage.getItem(PATH))());
        });
        var m = `${imported.toJson()};`;
        return m;
      }
    }
  }

  CompilePattern(glob) {

    if (glob.includes("//")) {
      return "";
    }

    // Verifica o ponto e Virgula

    const Prefixes = this.Prefixes;
    var pfA = 0;

    var PrefixeDefine = Prefixes.map((p) => {
      if (glob.includes(p)) {
        pfA++;
        return p;
      }
    });

    //console.log(PrefixeDefine);
    PrefixeDefine.map((p) => {
      //console.log(clone.includes(";"), "\n", p);
      //if(!clone.includes(";")) console.log(clone, '\n', pfA);
      if (glob.includes(";") === false && pfA > 1) {
        glob += ";";
      }
    });

    // Modulos JSX using Template String
    if (glob.includes("<(") && glob.includes(")>")) {
      if (glob.includes("{") && glob.includes("}")) {
        glob = glob.replace(/{/gi, "${");
      }
    }

    // Compila os Padrões
    this.Patterns().each((exp, ret) => {
      var reg = new RegExp(ret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      //console.log(glob.includes(ret), glob);
      if (glob.includes(ret)) {
        glob = glob.replace(reg, exp);
      }
    });

    // Compila os Regex's
    this.Regexs().each((ret, reg) => {
      reg = new RegExp(reg, "gi");
      var t = reg.exec(glob);
      if (t) {
        var va = t[1].trim(),
          compiled = ret(va);
        glob = glob.replace(reg, compiled);
      }
    });
    return glob;
  }

  Compile(code, type = "exec") {

    // Performance do Compilador
    var startTimeCompile = window.performance.now();

    // Variavel Global com o Codigo
    var global = code.split('\n'),
      _turn = ``,
      selfed = this;

    global.map((glob, index) => {

      glob = glob.trim();
      var clone = glob;

      glob = selfed.CompilePattern(glob);

      if ("pretty" in selfed.config && selfed.config.pretty) {
        glob = selfed.Prettify(glob);
      } else {
        glob = glob.replace(/\s\s/gi, "");
      }

      _turn += glob;

    });

    // Retorna codigo Compilado
    var Binds = {
      "window": window,
      "self": window,
      "document": document,
      "location": location,
      "sessionStorage": sessionStorage,
      "localStorage": localStorage,
      "log": console,
      "scope": {
        "Public": {},
        "Private": {}
      },
      "$DB": class {

        constructor() {
          this._Session = sessionStorage;
          this._Storage = localStorage;
          return this;
        }

        Session(name) {
          var selfed = this;
          return {
            set(name, value) {
              selfed._Session.setItem(name, value);
              return this;
            },
            get(name) {
              return selfed._Session.getItem(name);
            },
            remove(name) {
              selfed._Session.removeItem(name);
            },
            exists(name) {
              if (selfed._Session.getItem(name)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }

        Storage(name) {
          var selfed = this;
          return {
            set(name, value) {
              selfed._Storage.setItem(name, value);
              return this;
            },
            get(name) {
              return selfed._Storage.getItem(name);
            },
            remove(name) {
              selfed._Storage.removeItem(name);
            },
            exists(name) {
              if (selfed._Storage.getItem(name)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }

      },
      "$App": () => new Map()
    };

    var PROTECTED = `{"scope": io2.Public}`;

    //if(type == "module") return _turn;

    if ("protected" in this.config && !this.config.protected) {
      if (this.config.protected === false) {
        PROTECTED = `{"scope": io2}`;
      }
    }

    _turn += `
      (function(io, io2){
        window.IO = Object.freeze(${PROTECTED});
        if('load' in io){
          io.load();
        } else if('load' in io2){
          io2.load();
        }
      })(this, scope, window);
    `;

    _turn = _turn.replace(/{;/gi, "{");
    _turn = `      "use strict";\n\n${_turn}`;

    var callback = new Function(Object.keys(Binds), _turn);
    callback = callback.bind(Binds.scope);
    var vs = Object.values(Binds);

    Binds.scope.time_load = parseInt((window.performance.now() - startTimeCompile));

    if ("debug" in this.config && this.config.debug) {
      console.log("%c💻 IO Script 💻 %cCompile in: %c" + Binds.scope.time_load + " ms", "color:#f1c40f;font-size:17px;font-weight:bold;font-family:'Verdana';", "color:#3498db;font-size:17px;", "color:green;font-size:17px");

      Binds.scope["time_load"] = parseInt((window.performance.now() - startTimeCompile));

      if ("debug" in this.config && this.config.debug) {
        console.log("%c💻 IO Script 💻 %cCompile in: %c" + Binds.scope["time_load"] + " ms", "color:#f1c40f;font-size:17px;font-weight:bold;font-family:'Verdana';", "color:#3498db;font-size:17px;", "color:green;font-size:17px");

      }

      if (type == "exec") {
        try {
          callback(...vs);
        } catch (e) {
          throw e.message;
        }
      }

    }

  }
}
