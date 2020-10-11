import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor'

Template.gameView.helpers ({
  isVisible: function() {   
    return Session.equals('isGameReady', true)
      && Session.equals('isGameOver', false);
  }
});                             

// Deps -> Tracker depuis la v0.9.1 de Meteor           
if(typeof(Deps) !== 'undefined') Tracker = Deps;
Tracker.autorun(function() {

  if (Session.get('isPlayerSet') 
    && !Session.get('isGameReady')
    && !Session.get("isGameOver")) {
  
      var width = window.innerWidth - 30;
      var height = window.innerHeight - 10;      
      
      var xBallSpeed = -600;
      var yBallSpeed = 0;
      
      Crafty.init(width, height, 'gameScene');
      Crafty.viewport.bounds = {min:{x:0, y:0}, max:{x:width, y:height}};
      
      Crafty.background("#000");
      
      Crafty.c("Rebound", function() {});
      
      Crafty.bind('KeyDown', function(e) {
          if(e.key == Crafty.keys.SPACE) {
              // Inverse l'etat pause / jeu automatiquement
              Crafty.pause();
          }
        });
            
      // Tableau de Scores
      var scorePanel = Crafty.e("2D, DOM, Text").attr({ w: width, h: 20, x: 0, y: 50 })
          .textFont({ size: '20px', weight: 'bold' })
          .textColor('rgba(0, 0, 255, 0.75)')
          .css("textAlign", "center");   
      // Incremente le tableau des scores         
      var incrementScorePanel = function() {
          var currentScore = Session.get('currentScore'); 
          if (typeof(currentScore) !== 'undefined') {
            Session.set('currentScore' , currentScore + 1);
          } else {
            Session.set('currentScore' , 0);   
          } 
          scorePanel.text(Session.get('currentPlayer').name + " - " + Session.get('currentScore'));
      }      
      incrementScorePanel();  
      var currentKey;      
      var player = Crafty.e("2D, Canvas, Color, Multiway, Rebound")   
          .attr({x:0, y:((2*height)/5), w:25, h:height/5})          
          .color("blue")
          .bind("EnterFrame", function(eventData) { 
            // Limitation du déplacement vertical du joueur
            if (currentKey == Crafty.keys.DOWN_ARROW && this.y > ((4 * height) / 5)) {
              this.disableControl();                                                    
            } else if (currentKey == Crafty.keys.UP_ARROW && this.y < 0) {
              this.disableControl();
            } else {
              this.enableControl();
            }
          })
          .bind('KeyDown', function(e) {
            currentKey = e.key;
          })
          // Commande le joueur avec les fleches haut et bas du clavier
          .multiway({x:0, y:4}, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 0});
          
      
      var opponentDestination = ((4*height)/10);
      var opponent = Crafty.e("2D, Canvas, Color, Rebound")
          .attr({x:width-25, y:opponentDestination, w:25, h:height/5})
          .color("red")
          .bind("EnterFrame", function(eventData) {                           
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
          });
          
      var ball = Crafty.e("2D, Canvas, Color, Collision")
          .attr({x:(width/2)-15, y:(height/2)-15, w:30, h:30})
          .color("green")
          .bind("EnterFrame", function(eventData) {
            // Sortie de balle
            if (this.x < 0 || this.x > width-25) {
              // Fin de la partie
              Session.set("isGameOver", true);
              Session.set('isGameReady', false);
            }
            // Rebond sur les bords 
            if (this.y < 0 || this.y > height) {
              yBallSpeed=-yBallSpeed;
            }
            this.x = this.x + xBallSpeed * (eventData.dt / 1000);
            this.y = this.y + yBallSpeed * (eventData.dt / 1000);             
          })
          .checkHits('Rebound')
          .bind("HitOn", function(hitData) {
            // Rebond
            xBallSpeed=-xBallSpeed; 
            if (this.x < width/2) {
              // Acceleration
              xBallSpeed += 50;
              // Deviation
              yBallSpeed += ((this.y - (height / 10)) - (player.y - 15)) * 5;
              // MAJ du score
              incrementScorePanel();              
              // Test 1 : MAJ de la destination cote client suite a l impact
              import '/shared/pong';
              opponentDestination = get_destination(this.x, this.y, xBallSpeed, yBallSpeed, width, height);    
              // Test 2 : MAJ de la destination cote serveur suite a l impact 
              // Meteor.call('get_destination', this.x, this.y, xBallSpeed, yBallSpeed, width, height, 
              //   function(error, result) {
              //     opponentDestination = result;
              //   }
              // );             
            } else {                        
              // MAJ de la vitesse verticale
              yBallSpeed += ((this.y - (height / 10)) - (opponent.y - 15)) * 5;
            }
            
          });
      // Desactivation du scroll
      window.onscroll = function () { window.scrollTo(0, 0); }
      // Affichage de la vue
      Session.set('isGameReady', true);
      
  }            
  
}); 


