# Meteor - Web Express ! #

## Introduction ##

Ceci est un projet de découverte de meteor via le développement d'un jeu de type "pong". 

Vous pouvez récupérer le projet en local en cliquant sur **Téléchargements** dans le menu de gauche puis **Télécharger le dépôt**.

Une partie des sources est décrite dans le tutorial ci-dessous.

Le reste est d'une part abondamment commenté, et d'autre part, ne concerne pas spécifiquement meteor.

A ce jour une version est déployée sur GCP [ici](https://meteorpong.ew.r.appspot.com/).

## Théorie ##

*Qu'est ce que Meteor ? *

Aucun rapport avec ce qui se déroule au dessus de nos têtes.
Je pourrais parler de Framework, les puristes parleront de Stack. 

*Mais... une stack, c'est quoi ?*

Une stack, c'est un framework complet qui assemble des outils pour assurer la persistance, la présentation et parfois même le déploiement.
On parle entre autre de MEAN Stack, qui est un assemblage de MongoDB, Express, Angular et NodeJS. Les puristes me diront que l'acronyme est désordonné (BDD - Serveur - Vue - Serveur ??) mais qu'est ce que vous voulez MEAN, ça fait mieux que MNEA !
Si vous voulez en savoir plus sur cette stack, c'est par [ici](http://mean.io/), en attendant, on va parler de Meteor.

*Tiens au fait... qu'est ce que Meteor !?*

Donc Meteor c'est une stack... ok j'arrête.

Meteor est un assemblage de MongoDB, NodeJS et Spacebar (anciennement Handlebar). 
C'est du javascript à n'en plus finir de la base de donnée jusqu’à la vue.
Si ce langage vous cause de l'urticaire, cela risque d'être compliqué.
Dernier point, Meteor est par défault temps réel. Il utilise les web sockets introduits par le HTML5 et des mécanismes de fallback sont mis en place pour certains navigateurs (dont je tairai le nom !).

## Pratique ##

### Installation ###

Au menu, comme on est pas des rigolards, nous allons essayer de créer un pong avec une IA basique coté serveur.

Pour installer meteor, suivez les étapes décrites ci après :
[https://www.meteor.com/install](https://www.meteor.com/install)

### Structuration ###

Commençons par créer un projet, placez vous à l'endroit approprié et tapez la commande suivante :

```
#!dos

###\pong>meteor create pong
pong: created.
To run your new app:
   cd pong
   meteor
```

Vous pouvez faire ce qu'il dit... 

```
#!dos

###>cd pong
###\pong>meteor
[[[[[ ###\pong ]]]]]
=> Started proxy.
=> Started MongoDB.
=> Started your app.
=> App running at: http://localhost:3000/
```


et voi-là !

![first_launch.jpg](https://bitbucket.org/repo/a45zx7/images/740348319-first_launch.jpg)

Si on clique sur le bouton, il nous affiche un message dans la console.
Voyons ce qu'il a sous le capot :

![init_arbo.png](https://bitbucket.org/repo/a45zx7/images/624946448-init_arbo.png)

La commande create nous a crée :

* Un répertoire .meteor qui contient une sorte de sous environnement de meteor (si vous connaissez virtualenv en python) avec les packages propres au projet.

* Un fichier main.css qui ne contient rien ou presque rien...

* Un fichier main.html qui contient le template de la page que l'on vient de voir. Comme je le disais plus haut le langage de template utilisé s'appelle Spacebar. C'est l'un des forks de Handlebar pour la petite histoire. Les développeurs jugent les langages de templating actuels trop complexes à mettre en œuvre, je vous laisserai vous faire votre propre opinion. La syntaxe ici parait clair, le "{{ toto }}" permet d'afficher une valeur (comme en angular), le "{{> toto }}" permet d'afficher <template name="toto">...</template>. Mais nous y reviendront plus en détail ensuite.

* Un fichier main.js qui est divisé en deux parties if (Meteor.isClient) {...} et if (Meteor.isServer) {...}. Pour rappel, Meteor utilise exclusivement du code Javascript mais de là à tout mettre dans le même fichier ! La partie cliente déclare une fonction dont on affiche la valeur dans la vue et un block d'events qui contient un événement de click sur le bouton qui dépose un doux message dans la console...

Voila, easy non ?
Subsiste un petit souci de structure comme je l'évoquais...
Heureusement pour nous, meteor est bien pensé. Les fichiers unique c’est bien pour l’apprentissage mais on est des experts pas vrai !?

Alors voici les règles de chargement des fichiers meteor :

* Les fichiers les plus loin dans l’arborescence sont chargés en priorité.

* Ensuite vient le code javascript possiblement contenu dans un répertoire lib/.

* Ensuite le code javascript d’un fichier main.js.

* De manière générale, à priorité équivalente l’ordre alphabétique départage les prétendants.

Et... comme si c’était pas suffisant :

* Tout code contenu dans un répertoire server/ est executé par NodeJS.

* Tout code dans un répertoire client/ par votre navigateur préféré.

* Tout code dans un répertoire autre sera exécute par les deux parties.

* Tout fichier dans un répertoire public/ est chargé coté client.

Créez l’arborescence suivante :

* Un répertoire client/ avec un répertoire stylesheets/ et un répertoire javascripts/. Placez le fichier pong.html à la racine, le fichier pong.js sous javascripts/ et le fichier pong.css sous stylesheets/.

* Un répertoire collections/.

* Un répertoire public/.

* Un répertoire server/ avec un fichier main.js.

* Un répertoire shared/.

![final_arbo.png](https://bitbucket.org/repo/a45zx7/images/26325351-final_arbo.png)

Ensuite on prend le code serveur du fichier client/main.js et on le colle dans server/main.js.

Let’s launch meteor !

```
#!dos

###\pong>meteor
```

Tada... rien n’a changé !

**Note:** Vous pouvez aussi laisser meteor allumé, il se redémarre automatiquement à chaque changement des sources.

### Navigation entre les vues ###

Le jeu va se composer de 3 vues. La vue préliminaire où le joueur devra saisir son pseudo, la vue de jeu et la vue de score. Nous allons créer 3 fichiers sous client/ :

* startView.js

* gameView.js

* scoresView.js

Le mécanisme de navigation va s’opérer au moyen de booléens stockés en session : isPlayerSet, isGameReady et isGameOver. Nous allons initialiser ces booléens dans le fichier client/pong.js, vous pouvez vider le fichier existant et y ajouter le code qui suit :

```
#!javascript

// client/pong.js
Meteor.startup(function () {
  Session.set("isPlayerSet", false);
  Session.set("isGameReady", false);
  Session.set("isGameOver", false);
});
```


On ajoute un helper dans chacun des 3 fichiers associées aux vues. Ces helpers auront pour but de rafraîchir un booléen (isVisible) qui affichera l’un ou l’autre des templates. 

```
#!javascript

// client/startView.js
Template.startView.helpers ({
  isVisible: function() { 
    return !Session.get('isPlayerSet');
  },
});   

```

```
#!javascript

// client/gameView.js
Template.gameView.helpers ({
  isVisible: function() {   
    return Session.equals('isGameReady', true)
      && Session.equals('isGameOver', false);
  }
});   

```

```
#!javascript

// client/scoresView.js
Template.scoresView.helpers ({
  isVisible: function() { 
    return Session.get('isGameOver');
  }
});  
```

On met à jour le code de la vue avec les 3 templates et la logique d’affichage.
Videz le fichier client/pong.html et ajoutez y le code qui suit :

```
#!html

< !-- client/pong.html -->
<head>
  <title>pong</title>
</head>
<body>      
  {{> startView}}
  {{> gameView}}
  {{> scoresView}}
</body>
<template name="startView">
  {{#if isVisible}}
    <!-- Contenu de la vue de départ -->
  {{/if}}
</template>
<template name="gameView">
  {{#if isVisible}} 
    <!-- Contenu de la vue de jeu -->
  {{/if}} 
</template> 
<template name="scoresView">
  {{#if isVisible}} 
    <!-- Contenu du tableau des scores -->
  {{/if}}
</template>
```
   

### La vue de départ ###

La vue de départ va comporter un libellé et un champs de texte. 

```
#!html

<!-- client/pong.html -->
[...]
<!-- Contenu de la vue de départ -->
<label for="code">Votre Pseudo</label>
<input id="name" type="text">
[…]
```


A l’appui sur la touche entrée du clavier. On va stocker la valeur courante du joueur dans la base et dans la session puis mettre à jour le booléen pour basculer sur la vue suivante. On « attache » le code suivant à l’événement d’appui sur une touche du clavier.


```
#!javascript

// client/startView.js
[...]
Template.startView.events ({
 'keydown': function(event) {
  if(event.which == 13) {
    var name = document.getElementById('name').value;
    if(name != '') {
      // Recupération du joueur correspondant au nom saisi
      var player = Players.findOne({ name: name });
      if(typeof(player) === 'undefined') {
        // Stockage du joueur en BDD 
        var playerId = Players.insert({
           name: name,
           date: Date.now()
        });
        //  Récupération joueur stocké
        player = Players.findOne({ _id: playerId });
      }
      // Stockage du joueur en session        
      Session.set('currentPlayer', player);
      // MAJ du flag d'état
      Session.set('isPlayerSet', true);
    }
  }
 }
});
```

On va créer le fichier collections/players.js avec le code qui suit dedans pour créer la table des joueurs.

```
#!javascript

// collections/players.js
// Crée une table de joueurs
Players = new Meteor.Collection("players");
```

Première vue, done ! Vous pouvez relancer le projet au moyen de la commande meteor pour voir ce que cela donne.

Saisissez un pseudo et cliquez sur le bouton, le champs de texte disparaît et normalement, le joueur est en base.

Vérifions, ouvrez la console javascript (sur Chrome ctrl+shift+J, sur firefox ctrl+shift+I, sur IE... euh ouvrez dont Chrome !).

Tapez le commande suivante :

```
#!javascript

Players.find().fetch()
```

Votre joueur doit s'afficher.

### La vue de jeu ###

Pour la vue de jeu, j’ai utilisé une librairie appelée CraftyJS. Je vais passer sur les spécificités de celle ci ainsi que sur toute la mise au point même si c’est ce qui m’a pris le plus de temps au final....

Récupérez la librairie :
[https://github.com/craftyjs/Crafty/releases/download/0.6.3/crafty-min.js](https://github.com/craftyjs/Crafty/releases/download/0.6.3/crafty-min.js)

On va ajouter la librairie sous public/ et modifier la vue comme suit :

```
#!html

< !-- client/pong.html -->
<head>
  <title>pong</title>
  <script type="text/javascript" src="crafty-min.js"></script>
</head>
[...]
<!-- Contenu de la vue de jeu -->
    <div id="gameScene"></div>
[...]
```

Récupérez le code du fichier client/javascripts/gameView.js en cliquant sur **Source** dans le menu de gauche. Je vais détailler ce qui concerne meteor dans la suite.

La difficulté de cette vue est que l’on utilise une librairie tierce. Il faut pouvoir « instancier » le conteneur de jeu quand la vue s’affiche. Pour ce faire, on va utiliser Tracker (appelé Deps jusqu’en v0.9.1), il va détecter les changement d’états des variables de session et exécuter le code adéquat. 


```
#!javascript

// client/gameView.js
// Deps -> Tracker depuis la v0.9.1 de Meteor           
if(typeof(Deps) !== 'undefined') Tracker = Deps;
Tracker.autorun(function() {

  if (Session.get('isPlayerSet') 
    && !Session.get('isGameReady')
    && !Session.get("isGameOver")) {
	[...]
  }

}
```


Nous allons réaliser plusieurs tests sur le positionnement du code de l’IA. Pour ce faire, créez le fichier shared/pong.js qui va contenir les fonctions d’IA. Ce code pourra indifféremment être appelé depuis server/*.js ou client/*.js et ca... c’est kiffant !

Récupérez le code du fichier shared/pong.js en cliquant sur **Source** dans le menu de gauche. 

Le fichier comporte 3 méthodes liées à l'IA accessibles de la vue et du serveur.

```
#!javascript

// shared/pong.js
(function(){
  get_destination = function(x, y, xBallSpeed, yBallSpeed, width, height) {
    [...] 
  };
  get_move_step = function(destination, y, height) {
    [...] 
  };
  move_to = function(x, y, xBallSpeed, yBallSpeed, width, height) { 
    [...] 
  };
}).call(this);
```

Dans un premier temps, on va faire s’exécuter le code coté client. L’avantage c’est que c’est plus rapide, plus facile à débogguer. L’inconvénient c’est que c’est visible et potentiellement stocké en cache navigateur...

Décommentez les lignes qui suivent "Test 1" et commentez les blocs qui suivent "Test 2" dans le fichier client/gameView.js 

```
#!javascript

// client/gameView.js
[...]
// Test 1 : MAJ position cote client
this.y += get_move_step(opponentDestination, this.y, height); 
[…]
// Test 1 : MAJ de la destination cote client suite a l impact
opponentDestination = get_destination(this.x, this.y, xBallSpeed, yBallSpeed, width, height);
[...]
```

Le second bloc est appelé au rebond de la balle sur la raquette du joueur. Il calcule la destination prévue de la balle.
Le premier bloc est appelé à chaque frame (boucle) pour déplacer la raquette de l’ordinateur vers le point calculé précédemment.

Allez, lancez meteor ! On va jouer !

C’était bien ? 

Passons à la suite, on va faire appeler ces méthodes depuis le serveur maintenant. 
On va ajouter le code ci-dessous dans le fichier server/pong.js. Il déclare 3 méthodes appelables depuis le client qui interagissent avec le fichier sous shared/ .

**Note :** On a utilisé un fichier sous shared/ pour faciliter le passage d’un mode d’appel à l’autre mais on aurait très bien pu utiliser un fichier coté serveur invisible du client.


Videz le fichier pong.js et ajoutez y le code ci dessous.

```
#!javascript

// server/pong.js
Meteor.methods({
  // Retourne le pas de déplacement en fonction de la destination prévisionnelle de la balle
  get_move_step:function(destination, y, height) {
    return get_move_step(destination, y, height);
  },
  // Retourne la destination prévisionnelle de la balle
  get_destination:function(x, y, xBallSpeed, yBallSpeed, width, height) {
    return get_destination(x, y, xBallSpeed, yBallSpeed, width, height);
  },
  // Retourne le pas de déplacement en fonction du mouvement de la balle  (get_destination + move_to)
  move_to:function(x, y, xBallSpeed, yBallSpeed, width, height) {
    return move_to(x, y, xBallSpeed, yBallSpeed, width, height);
  } 
});
```

Ensuite on fait appeler les méthodes serveur ci-dessus depuis le client. La méthode « call » prend une méthode de rappel en paramètre comme en Ajax. 

```
#!javascript

// client/gameView.js
[...]
// Test 1 : MAJ position cote client
//this.y += get_move_step(opponentDestination, this.y, height); 
// Test 2 : MAJ position cote serveur
if(xBallSpeed > 0) {
  Meteor.call('get_move_step', opponentDestination, this.y, height, 
     function(error, result) {
      opponent.y += result;
    }
  );
}
[…]
// Test 1 : MAJ de la destination cote client suite a l impact
//opponentDestination = get_destination(this.x, this.y, xBallSpeed, yBallSpeed, width, height);
// Test 2 : MAJ de la destination cote serveur suite a l impact 
Meteor.call('get_destination',this.x, this.y, xBallSpeed, yBallSpeed, width, height, 
  function(error, result) {
    opponentDestination = result;
  }
);  
[…]
```

Allez, on joue !

Réactif hein !? Malgré des appels hyper intensifs à chaque frame, même pas mal. Après, relativisons, nous sommes en local ! Mais globalement vous avez pu apercevoir l’un des points forts du développement avec meteor. Le déport des traitements du client au serveur est un jeu d’enfant. 
Reste à conclure avec la vue de score qui va afficher le top des meilleurs scores sur notre dantesque jeu !

### La vue de score ###

Comme notre application est mono-page et que je ne voulais pas que le score soit rafraîchit en permanence donc j’ai mis le code de récupération des données dans un bloc Tracker (Deps) également. Ajoutez le code qui suit au fichier client/scoresView.js.

```
#!javascript

// client/scoresView.js
[...]
var scoresList;

// Deps -> Tracker depuis la v0.9.1 de Meteor           
if(typeof(Deps) !== 'undefined') Tracker = Deps;
Tracker.autorun(function() {

  if (Session.get('isGameOver') && typeof(scoresList) === 'undefined') {
  
    // Destruction de la scene
    Crafty.stop(true);
    var currentPlayer = Session.get('currentPlayer');
    // Insertion du score du joueur
    Scores.insert({
       player: currentPlayer,
       score: Session.get('currentScore'), 
       date: Date.now()
    });
    // Affichage de la table des scores du joueur courant
    scoresList = Scores.find({ player: currentPlayer}, {sort: {score: -1}, limit: 5});
    
  }  
});
```

Le reste du code n’est pas sorcier. On détruit la scène Crafty, on insère le score dans la base MongoDB et on restitue les 5 plus hauts scores du joueur courant.

On met ensuite à jour la vue avec le code suivant :

```
#!html

<!-- client/pong.html -->
[...]
<!-- Contenu de la vue de départ -->
<h1>Wall of Fame</h1> 
{{#each scores}}
 <div>
  <strong>{{player.name}}</strong> : {{score}}
 </div>
{{/each}}
[...]
```

Enfin, n'oubliez pas d'ajouter un fichier scores.js sous collections/.

```
#!javascript

// collections/scores.js
Scores = new Meteor.Collection("scores");
```

Vous pouvez relancer meteor s'il ne l'est pas déjà.

## Style ##

J'ai un peu modifié les fichiers client/pong.html et client/stylesheets/pong.css pour y ajouter du style si le coeur vous en dit.

## Sécurisation ##

Un dernier point concerne la sécurisation. Certains d’entre vous ont du tomber de leur chaise en voyant qu’on pouvait requêter Mongo depuis la console JS.

Là encore c’est une facilité pour les phases de développement. Pour la prod, il faut supprimer un package automatiquement ajouté à la création d’une nouvelle application meteor. Tapez la commande suivante dans l’invite :

```
#!dos

###\pong>meteor remove autopublish
autopublish: removed

```

Maintenant, il faut publier ce que l’on veut exposer de notre BDD coté serveur pour players et scores.

```
#!javascript

// server/pong.js
[...]
// Mode Secure
Meteor.publish("players", function() {
   return Players.find();
});
Meteor.publish("scores", function() {
   return Scores.find();
});

```

Et on va ajouter les fichiers client/lib/scores.js et client/lib/players.js pour consommer le service comme suit :

```
#!javascript

// client/lib/players.js
Meteor.subscribe('players');
```

et

```
#!javascript

// client/lib/scores.js
Meteor.subscribe('scores');
```

Désormais les requêtes exécutées coté client sur les tables seront un sous ensemble de ce qui est retourné par le serveur.

En complément, nous allons supprimer un second package :

```
#!dos

###\pong>meteor remove insecure
insecure: removed
```

Ce package levait les interdictions sur toutes les opérations d'écriture vers la mongoDB. Désormais, il faut explicitement autoriser chaque opération via la méthode "allow". L'opération est autorisée si cette méthode renvoit true. Nous allons déclarer une première méthode pour éviter les doublons de joueurs :

```
#!javascript

Players.allow({
  insert: function(name) 
  {
    var playerDb = Players.findOne({"player.name": name});
    return (typeof(playerDb) === 'undefined');   
  }
});
```


Et une seconde méthode pour n’authoriser l’insertion de scores que dont le joueur est connu :

```
#!javascript

Scores.allow({
  insert: function(player) 
  {
    var playerDb = Players.findOne({player: player});    
    return (typeof(playerDb) !== 'undefined');   
  }
});
```

## Mot de la fin ##

Notre tour d’horizon touche à sa fin. Vous avez pu appréhender le développement d’une application mono page avec meteor. Le projet présente une communauté active et une équipe d’ingénieurs du MIT qui travaillent à plein temps sur le sujet.
Peu de frameworks actuels peuvent se targuer d’une approche aussi unifiée et efficace du développement web.

## Références ##

Documentation générale :
[http://docs.meteor.com/#/full/](http://docs.meteor.com/#/full/)

Recueil de bonnes pratiques :
[https://dweldon.silvrback.com/common-mistakes](https://dweldon.silvrback.com/common-mistakes)