// ==================== GLOBAL VARS ==================== //

// Counters


// Size Constants
var OBJECT_SPEED = 5;           // pixels per ms
var OBJECT_REFRESH_RATE = 50;   // ms

var state = "initial";         // options: "initial" or "running"




// ==================== MAIN CODE ==================== //

$(document).ready( function() {
    console.log("Ready!");

    // event handlers
    $(window).keydown(keydownRouter);


});//end document.ready()

// ==================== CALLBACK FUNCTIONS ==================== //

function keydownRouter(e) {
    console.log("You hit the " + String.fromCharCode(e.which) + " key; index = " + e.which);

    // transition from Start screen to Interactive one on first keypress
    if (state === "initial") {
        $("#start-screen").hide();
        $("footer").css("visibility", "visible");
        state = "running";
    }//end if

    e.preventDefault();

    switch (e.which) {
        case KEYS.escape:
            exit();
            break;
        default:
            break;
    }
}//end keydownRouter()




function exit() {
    // stop all animations

    // stop all sounds

    // show main screen again
    $("#start-screen").show();
    $("footer").css("visibility", "hidden");

    state = "initial";
}//end exit()


function get_random_num(min, max) {
    // borrowed from Stack Overflow
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.random() * (max - min) + min;
}//end get_random_num()
