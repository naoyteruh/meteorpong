// CODE SERVEUR (Creation bdd) ET CLIENT (Accessors)

console.log("Cree une table de joueurs");
const Players = new Mongo.Collection("players");

// Fonction d'insertion d'un joueur
function insertPlayer(name, date) {
  Players.insert({
     name: name,
     date: date
  });
}

export default Players