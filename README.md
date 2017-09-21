![enter image description here](https://i.imgur.com/y8m3HSj.gif)

----------------------------------------------


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/PaulaoDev/io-script-js/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/PaulaoDev/io-script-js.svg)](https://github.com/PaulaoDev/ChatBot-PHP-Facebook/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PaulaoDev/io-script-js.svg)](https://github.com/PaulaoDev/ChatBot-PHP-Facebook/fork)
[![GitHub issues](https://img.shields.io/github/issues/PaulaoDev/io-script-js.svg)](https://github.com/PaulaoDev/ChatBot-PHP-Facebook/issues)
[![GitHub watchers](https://img.shields.io/github/watchers/badges/shields.svg?style=social&label=Watch)](https://github.com/PaulaoDev/io-script-js/subscription)
[![Whatsapp](https://img.shields.io/badge/Whatsapp-On-green.svg)](https://bit.ly/whatsappdopaulo)
[![Donate Paypal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://goo.gl/ujU2QU)
[![Donate Bitcoin](https://img.shields.io/badge/Donate-Bitcoin-yellow.svg)](https://blockchain.info/address/37RWdwgsXK94pANXm9fHv722k4zQmtmCpH)


----------------------------------------------

# IO Script V1

_______________________________________

##### A "language" based on javascript, comes with an auto compiler, module support, easy way to write code, html join, endif among other functions.
But does it take time to compile? **Do not.**

_______________________________________


  #### [Demo](https://codepen.io/PaulaoDev/pen/GvVaRp?editors=1100)
	

_______________________________________

![enter image description here](https://imgur.com/yqi4HAI.png)

_______________________________________

#####  Security:
		
 - the scope of the code and storing within a closure
 
 
_______________________________________


```html
// IO Script Code
<script type="text/io-script" src="assets/js/app.io.js"></script>
// Script the Compiler
<script src="assets/js/io-script.min.js?version=1.0.0" charset="utf-8"></script>
<script type="text/javascript">
    // Start the Compiler
    const CodeCompile = IoScript.GetInstance(/* config */);
</script>
	  

```

_______________________________________


```javascript

	scope.load = function(){
		// Onload IO Script Function 
	};

```

_______________________________________


```javascript
	
	write == document.write
	Exemple: 
		write "Ola mundo!!"

```

_______________________________________


```javascript
	
	const App = $App(); // Generating a container to reuse objects
	Exemple: 
		App.set("msg", "Ola mundo!!");
		print App.get("msg");

```

_______________________________________


```javascript
	
	const DB = $DB(); // Generating a "Database" to be used with the code
	Exemple: 
	
		// Example Database Session ( It is only saved when the session is active )
		DB.Session().set("nome", "PaulaoDev");
		print print DB.Session().get("nome");
		DB.Session().remove("nome");
		
		// Example Database Storage ( It gets saved to the computer that accessed until someone removed )
		DB.Storage().set("nome", "PaulaoDev");
		print print DB.Storage().get("nome");
		DB.Storage().remove("nome");

```

_______________________________________


```javascript
	if / else
	Exemple:
		if(1 === 1):
			write "True!!"
		ielse:
			write "False!!"
		ielse;
		

```

_______________________________________


```javascript
	endif
	Exemple:
		if(cond === cond):
			write "ON!!";
		endif;

```

_______________________________________


```javascript
	print == console.log
	Exemple:
		print "Console World!!"

```

_______________________________________

```javascript
	// Modules stored in IO Script scope
	scope.modules = require ["bind","helpers", "module_name"];

```

_______________________________________

 
 
 ```
	// Module Dir: /io-modules/bind/src/bind.js
	// Module pattern
	exports.hello = function(color){
		// Changing the Modified HTML Module
		return <(<h1 style="color:${color}">Hello World!"</h1>)>;
	};

```
	
_______________________________________
