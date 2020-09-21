import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import Scores from '/collections/scores';

var scoresList;


Template.scoresView.helpers ({
  isVisible: function() { 
    return Session.get('isGameOver');
  },
  scores: function() {
    return scoresList; 
  },
});                             

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
