scope.load = function(){

	write '<br/>IO Script Carregado Com Sucesso!!!';
	
  function calc(n){
    return (n.length > 4) ? true : false;
  }

  if(1 === 1):
     
     scope->nome = capture "Qual o seu nome??"

     scope.modules = require ["bind","helpers"];

     //print scope.modules;

     scope->modules->helpers(scope->nome);

     if(calc(scope->nome)):

         write scope->modules->hello("red");
         // print location->href

     ielse:

         write 'Nome não tem mais de 5 letras!! : {scope->nome}'

     ielse;

  endif;

};