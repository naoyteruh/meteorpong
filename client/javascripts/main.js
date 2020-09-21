import { Session } from 'meteor/session';

import '../main.html';
import './startView';
import './gameView';
import './scoresView';

import '/lib/players';
import '/lib/scores';

Meteor.startup(function () {
  Session.set("isPlayerSet", false);
  Session.set("isGameReady", false);
  Session.set("isGameOver", false);
});