scope.load = function(){

  const App = $App(),
        DB = new $DB();

  App.set("msg", '<br/>IO Script Carregado Com Sucesso!!!');
  App.set("pergunta", "Qual o seu nome??");

  Public::Maior = (i) => (i > 18) ? "Maior" : "Menor";

	document.body.innerHTML += App.get("msg");

  Public::calc = (n) => (n->length > 4) ? true : false;

  if(1 === 1):

     scope->nome = capture App.get("pergunta")

     if(scope->nome->length > 4):
        //DB.Session().remove("pergunta");
        DB.Session().set("pergunta", scope->nome);
        if(DB.Session().exists("pergunta")):
            print "Set Item DB: {DB.Session().get('pergunta')}";
        endif;
     endif;

     scope->modules = require([ "bind" , "helpers" ])
     const {hello, imgLoad, helpers} = scope->modules;

     //print scope.modules;

     //helpers(scope->nome);
     //document.body.appendChild(imgLoad("//i.imgur.com/upEa6Ds.png"));

     if(Public::calc(scope->nome)):

        document.body.innerHTML += hello("red");
        Public::Nome = "Paulao Dev";
        Private::Idade = 19;
        print Public::Maior(Private::Idade);

        // print location->href

     ielse:

         write 'Nome não tem mais de 5 letras!! : {scope->nome}'

     ielse;

  endif;

};
