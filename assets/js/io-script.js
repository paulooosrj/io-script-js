"use strict";

class IoScript {

  constructor(config = {}) {
    this.config = config;
    this.Prefixes = [ "=" , "->" , "capture" , "print" , "write" , "require" , "scope" ];
    this.AutoCompile();
    this.Helpers();
    this.Patterns();
    return this;
  }

  AutoCompile(){
    var io = this;
    addEventListener("DOMContentLoaded", () => {
      const codes = Array.from(document.querySelectorAll("[type='text/io-script']"));
      codes.map((c) => {
        // Static Compile
        if(c.innerText.length > 0) io.Compile(c.innerText);
        // Fetch Compile
        if(c.getAttribute("src")){
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

      keys.map((v, i) => {
        fn(s[v], v);
      });

    }

    Object.prototype.toJson = function(){
        var obj = this;

        var tabjson=[];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                tabjson.push('"'+p +'"'+ ':' + obj[p]);
            }
        }  tabjson.push()
        return '{'+tabjson.join(',')+'}';

    }

  }

  Patterns() {
    return {
      "):": "){",
      "endif;": "}",
      "ielse:": "}else{",
      "ielse;": "}",
      "->": ".",
      "<(": "`",
      ")>": "`"
    }
  }

  Regexs() {
    const ParsedModule = function(module){

      const prefix = function(p){
        return `io-modules/`+p+`/src/`+p+`.js`;
      };

      const binder = function(module){
        if(module.includes(`"`)){
          module = module.replace(new RegExp(`"`, "gi"), "");
        } else if(module.includes(`'`)){
          module = module.replace(new RegExp(`'`, "gi"), "");
        } else if(module.includes("{") && module.includes("}")){
          module = module.replace(new RegExp(`[{}]`, "gi"), "");
        }
        return module;
      };

      var modular = [];

      if(module.includes('[') && module.includes(']')){
        var modules = module.replace(/\[/gi, "").replace(/\]/gi, "").split(",");
        modules.map((m) => { modular.push(prefix(binder(m))); });
      }else{
        modular.push(prefix(binder(m)));
      }
      
      return modular;

    };
    const ParsedTemplate = function($_code){
        if($_code.includes("{") && $_code.includes("}")){
            if($_code.includes(`"`)){
              $_code = $_code.replace(new RegExp(`"`, "gi"), "");
            } else if($_code.includes(`'`)){
              $_code = $_code.replace(new RegExp(`'`, "gi"), "");
            }
            $_code = $_code.replace(/\{/gi, "${");
		        if(!$_code.includes("`")){
              $_code = "`" + $_code + "`";
            }
        }else{
            $_code = false;
        }
        return $_code;
    };
    var s = this;
    return {
      "print(.*);": function($_code){
        if(ParsedTemplate($_code)){
          $_code = ParsedTemplate($_code);
        }
        return `console.log(${$_code});`;
      },
      "capture(.*);": function($_code){
        if(ParsedTemplate($_code)){
          $_code = ParsedTemplate($_code);
        }
        return `prompt(${$_code});`;
      },
      "write(.*);": function($_code){
        if(ParsedTemplate($_code)){
          $_code = ParsedTemplate($_code);
        }
        return `document.write(${$_code});`;
      },
      "require (.*);": function($_code){
        $_code = $_code.trim();
        if(ParsedTemplate($_code)){
          $_code = ParsedTemplate($_code);
        }
        var c = ParsedModule($_code);
        var imported = {};
        c.map((PATH) => {

          console.log(PATH);

          fetch(PATH).then((res) => {
            return res.text();
          }).then((module) => {
            var prefix = (code) => { return `var exports = {}; ${code} return exports;`; };
            if(sessionStorage.getItem(PATH)){
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

  CompilePattern(glob){

        if(glob.includes("//")){ return ""; }

        // Verifica o ponto e Virgula

        const Prefixes = this.Prefixes;
        var pfA = 0;

        var PrefixeDefine = Prefixes.map((p) => {
          if(glob.includes(p)){
            pfA++;
            return p;
          }
        });

        //console.log(PrefixeDefine);
        PrefixeDefine.map((p) => {
          //console.log(clone.includes(";"), "\n", p);
          //if(!clone.includes(";")) console.log(clone, '\n', pfA);
          if(glob.includes(";") === false && pfA > 1){
            glob += ";";
          }
        });

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
          if(t){
            var va = t[1].trim(),
                compiled = ret(va);
            glob = glob.replace(reg, compiled);
          }
        });
        return glob;
  }

  Compile( code, type = "exec") {

    // Performance do Compilador
    var startTimeCompile = window.performance.now();

    // Variavel Global com o Codigo
    var global = code.split('\n'),
        _turn = ``;

    global.map((glob, index) => {

        glob = glob.trim();
        var clone = glob;

        glob = this.CompilePattern(glob);

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
      "scope": {}
    };

    //if(type == "module") return _turn;

    _turn += `
      (function(io, io2){
        if('load' in io){
          io.load();
        } else if('load' in io2){
          io2.load();
        }
      })(this, scope);
    `;
    _turn = _turn.replace(/\s\s/gi, "");


    var callback = new Function(Object.keys(Binds), _turn);
    callback = callback.bind(Binds.scope);
    var vs = Object.values(Binds);

    if("debug" in this.config && this.config.debug){
      console.log("%c💻 IO Script 💻 %cCompile in: %c"+parseInt((window.performance.now() - startTimeCompile))+" ms", "color:#f1c40f;font-size:17px;font-weight:bold;font-family:'Verdana';", "color:#3498db;font-size:17px;", "color:green;font-size:17px");
    }

    if(type == "exec") callback(...vs);

  }

}