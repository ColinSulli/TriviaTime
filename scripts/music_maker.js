// - - - - -  GLOBAL VARS - - - - - //

// Counters


// Size Constants
var OBJECT_SPEED = 5;           // pixels per ms
var OBJECT_REFRESH_RATE = 50;   // ms
var SCORE_UNIT = 100;           // scoring is in 100-point units

var state = "initial";         // change based on game state: "initial", "running", "game_over"




// - - - - -  MAIN CODE - - - - - //

$(document).ready( function() {
    console.log("Ready!");

    // event handlers
    $(window).keydown(keydownRouter);


});//end document.ready()


function keydownRouter(e) {
    console.log("You hit the " + String.fromCharCode(e.which) + " key; index = " + e.which);

    switch (e.which) {
        case KEYS.escape:
            e.preventDefault();
            exit();
            break;
        default:
            break;
    }
}//end keydownRouter()




function exit() {
    // show main screen again

    // stop all animations

    // stop all sounds

    state = "initial";

}//end exit()


function get_random_num(min, max) {
    // borrowed from Stack Overflow
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.random() * (max - min) + min;
}//end get_random_num()
