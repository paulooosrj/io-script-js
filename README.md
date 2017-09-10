![enter image description here](https://i.imgur.com/y8m3HSj.gif)

----------------------------------------------

# IO Script V1

_______________________________________

##### A "language" based on javascript, comes with an auto compiler, module support, easy way to write code, html join, endif among other functions.
But does it take time to compile? **Do not.**

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
    new IoScript({
      debug: true // Enable Debug Mode
    }); 
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

---------------------------------------
	
	if / else
	Exemple:
		if(1 === 1):
			write "True!!"
		ielse:
			write "False!!"
		ielse;

---------------------------------------

	endif
	Exemple:
		if(cond === cond):
			write "ON!!";
		endif;

---------------------------------------

	print == console.log
	Exemple:
		print "Console World!!"

---------------------------------------
	
	// Modules stored in IO Script scope
	scope.modules = require ["bind","helpers", "module_name"];

---------------------------------------

```

	```
	
	
	// Module Dir: /io-modules/bind/src/bind.js
	// Module pattern
	exports.hello = function(color){
		// Changing the Modified HTML Module
		return <(<h1 style="color:${color}">Hello World!"</h1>)>;
	};
	
	
	```
_______________________________________
