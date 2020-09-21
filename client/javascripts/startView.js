import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import Players from '/collections/players';


Template.startView.helpers({
  isVisible() {
    return !Session.get('isPlayerSet');
  },
});
 
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