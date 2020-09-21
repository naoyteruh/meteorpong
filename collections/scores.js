// CODE SERVEUR (Creation bdd) ET CLIENT (Accessors)

console.log("Cree une table de messages");
const Scores = new Meteor.Collection("scores");

// Fonction d'insertion d'un message
function insertScore(player, score, date) {

  Scores.insert({
     player: player,
     score: score,
     date: date
  });
  
}

//Scores.find().fetch()
// Empty (seulement dans le shell)
// Scores.remove({})

export default Scores