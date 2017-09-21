exports.hello = function(color){
	return <( <h1 style="color:{ color }">Hello World!! { scope->nome }</h1> )>;
};

exports.imgLoad = function(dir){
	var e = document.createElement("img");
	e.src = dir;
	return e;
	//<( <img src="https://{ dir }" /> )>;
};
