import '/shared/pong';

import Players from '/collections/players';
import Scores from '/collections/scores';

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

Meteor.startup(() => {
});

// Securisation
Meteor.publish("players", function() {
  return Players.find();
});
Meteor.publish("scores", function() {
  return Scores.find();
});

Players.allow({
  insert: function(name) 
  {
    var playerDb = Players.findOne({"player.name": name});
    return (typeof(playerDb) === 'undefined');   
  }
});
Scores.allow({
  insert: function(player) 
  {
    var playerDb = Players.findOne({player: player});    
    return (typeof(playerDb) !== 'undefined');   
  }
});

