////  Page-scoped globals  ////

// Counters
var item_index = 1;
var num_jumps  = 0;             // could be interesting to store their stats
var num_crouch = 0;             // and display them on the Game Over page

// Size Constants
var OBJECT_SPEED = 5;           // pixels per ms
var OBJECT_REFRESH_RATE = 50;   // ms
var SCORE_UNIT = 100;           // scoring is in 100-point units

// Global game variables
var state = "initial";  // change based on game state: "initial", "running", "game_over"
var score = 0;
var mute  = true;

var KEYS = {
  up: 38,         // jump
  down: 40,       // crouch
  spacebar: 32,   // currrently unused - gun maybe?
  F5: 116         // refresh page
}


////  Main Code  ////


// Main
$(document).ready( function() {
  console.log("Ready!");
  
  $(window).keydown(keydownRouter);
  $("#start").click(start_game);



  // From Assignment 3 -- keeping this here cuz we'll definitely need it
  setInterval( function() {
    // do stuff every 100 ms / 0.1 sec
  }, 100);


});//end document.ready()


/// Callback Functions ///


var start_game = function() {
  console.log("Starting Game!");

}//end start_game()





function keydownRouter(e) {
  switch (e.which) {
    case KEYS.up:
      num_jumps++;
      // call jump function
      break;
    case KEYS.down:
      num_crouch++;
      // call crouch function
      break;
    case KEYS.spacebar:
      // currently unused
      break;
    case KEYS.F5:
      console.log("Refreshing page...");
      break;
    default:
      console.log("Invalid input!");
  }
}//end keydownRouter()
