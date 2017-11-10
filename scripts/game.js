////  Page-scoped globals  ////

// Counters
var num_lives   = 5;
var num_jumps   = 0;             // could be interesting to store their stats
var num_crouch  = 0;             // and display them on the Game Over page
var bad_obj_idx = 0;
var powerup_idx = 0;

// Size Constants
var OBJECT_SPEED = 5;           // pixels per ms
var OBJECT_REFRESH_RATE = 50;   // ms
var SCORE_UNIT = 100;           // scoring is in 100-point units

// Global game variables
var player = 0;                 // gets set to $("#player") after page load
var state  = "initial";         // change based on game state: "initial", "running", "game_over"
var score  = 0;
var mute   = true;
var difficulty = 3;             // default... 1 = easiest, 5 = hardest

// image arrays
var high_imgs = ["bird1.png", "bird2.png"];     // FIXME: add more, they are randomly chosen in function
var low_imgs  = ["crate1.png"];                 // FIXME: add more, they are randomly chosen in function

var KEYS = {
  up:       38,  // jump
  down:     40,  // crouch
  spacebar: 32   // currrently unused - gun maybe?
}


////  Main Code  ////

$(document).ready( function() {
    console.log("Ready!");

    player = $("#player");  // FIXME


    // event handlers
    $(window).keydown(keydownRouter);
    $("#start-button").click(update_settings);  // update_settings() calls start game

    // $("#replay-button").click();
    // $("#back-to-main").click();

    // dynamic event handlers (for things that get dynamically created)
    // $(document).on("this_event", "this_class_or_id", function_variable);  // i.e. var jump = function() { ... }



    // check for collisions every 100 ms
    setInterval( function() {
        // check_collisions_birds();
        // check_collisions_crates();
        // check_collisions_powerup();
    }, 100);

});//end document.ready()


/// Callback Functions ///

function keydownRouter(e) {
    switch (e.which) {
        case KEYS.up:
            jump();
            break;
        case KEYS.down:
            crouch();
            break;
        case KEYS.spacebar:
            // currently unused
            break;
        default:
            break;
    }
}//end keydownRouter()


// apply settings chosen by user on splash screen, then start the game
function update_settings() {

    // update character
    console.log("Character selected was", "FIXME");

    // update difficulty
    difficulty = Math.floor($(".difficulty-slider").val());
    console.log("Difficulty set to", difficulty);
    // difficulty increases number of crates/birds per second
    // fixme: DO something with difficutly (i.e. increase number of crates, increase speed, etc.)

    // store name or initials for keeping high score?

    start_game();
}//end update_settings()


var start_game = function() {
    console.log("Starting Game!");
    state = "running";

    $(".splash-screen").hide();
    $(".game-screen").show();

    // randomly spawn a "bad object" every min - max seconds
    // difficulty = 1 (easy)   -> create 1 bad obj every 2.0 - 4.0 seconds ...
    // difficulty = 3 (medium) -> create 1 bad obj every 0.6 - 1.3 seconds ...
    // difficulty = 5 (hard)   -> create 1 bad obj every 0.4 - 0.8 seconds
    var min_interval_B = 2.0 / difficulty;
    var max_interval_B = 4.0 / difficulty;
    auto_spawn_bad_obj = setInterval(function() { create_bad_obj() }, (1000 * get_random_num(min_interval_B, max_interval_B) ));

    // randomly spawn a powerup every min - max seconds
    // var min_interval_P = 10.0 * difficulty;
    // var max_interval_P = 15.0 * difficulty;
    // auto_spawn_bad_obj = setInterval(function() { create_powerup() }, (1000 * get_random_num(min_interval_P, max_interva_P) ));

}//end start_game()


// create birds, crates, etc. that character should avoid
function create_bad_obj() {
    var this_img = "";

    // if 0: generate low image; if 1: generate high image
    var hi_lo = get_random_num(0, 1);
    if (hi_lo === 0) {
        // select random "low image" to generate
        var img_index = Math.floor(Math.random() * low_imgs.length);
        this_image = low_imgs[img_index];
    }//end if

    else {
        // select random "high image" to generate
        var img_index = Math.floor(Math.random() * high_imgs.length);
        this_image = high_imgs[img_index];
    }//end else

    // create object div and add to screen
    var obj_div_str = "<div id='obj-" + bad_obj_idx + "' class='bad-obj'></div>"
    $(".game-screen").append(obj_div_str);

    // Create bad-obj id based on newest index
    var cur_bad_obj = $('#bad-obj-' + bad_obj_idx);
    bad_obj_idx++;

    // FIXME: need to figure out where to position bottom of obj (pixel-wise) 
    // based on if it's a high obj or a low one
    var position = (hi_lo) ? "50px" : "0px";
    cur_bad_obj.css("bottom", position);

    // Make the objects move left toward player
    setInterval( function() {
        cur_bad_obj.css("right", parseInt(cur_bad_obj.css("right")) + OBJECT_SPEED);
        // Check to see if the obj has left the game/viewing window
        if (parseInt(cur_bad_obj.css("right")) > ($(".game-screen").width() - cur_bad_obj.width())) {
            cur_bad_obj.remove();
        }//end if
  }, OBJECT_REFRESH_RATE);
}//end create_bad_obj()


var jump = function() {
    if (state !== "running") {
        return;
    }//end if

    console.log("jumping...");
    num_jumps++;
}//end jump()


var crouch = function() {
    if (state !== "running") {
        return;
    }//end if

    console.log("crouching...");
    num_crouch++;
}//end crouch()


// from Assignment 3
function is_colliding(o1, o2) {
    // Define input direction mappings for easier referencing
    o1D = { 'left':   parseInt(o1.css('left')),
            'right':  parseInt(o1.css('left')) + o1.width(),
            'top':    parseInt(o1.css('top')),
            'bottom': parseInt(o1.css('top'))  + o1.height()
        };
    o2D = { 'left':   parseInt(o2.css('left')),
            'right':  parseInt(o2.css('left')) + o2.width(),
            'top':    parseInt(o2.css('top')),
            'bottom': parseInt(o2.css('top'))  + o2.height()
        };

    // If horizontally overlapping...
    if ( (o1D.left < o2D.left  && o1D.right > o2D.left)  ||
         (o1D.left < o2D.right && o1D.right > o2D.right) ||
         (o1D.left < o2D.right && o1D.right > o2D.left) ) {

        // if vertically overlapping also
        if ( (o1D.top > o2D.top && o1D.top    < o2D.bottom) ||
             (o1D.top < o2D.top && o1D.top    > o2D.bottom) ||
             (o1D.top > o2D.top && o1D.bottom < o2D.bottom) ) {

            // Collision!
            return true;
        }//end if vertical
    }//end if horizontal

    return false;
}//end is_colliding()


// Check for collisions with birds and perform animation
function check_collisions_birds() {
    $('.bird').each( function() {
        var cur_bird = $(this);

        if (isColliding(cur_bird, player)) {
            cur_bird.remove();
            handle_collision_bad("high");
            return false;           // stop checking for collisions once we've found one
        }//end if isColliding

    });//end bird.each
}//end check_collisions_birds()


function handle_collision_bad(where) {
  if (where === "high") {
    // do stuff for high collisions

  }//end if high

  else {
    // do stuff for low collisions

  }//end else

  // FIXME: we could add animation or add blood/scrapes to the player after each collision
  // num_lives--;
}//end handle_collision_bad()


function handle_collision_powerup(power_up_type) {

    // FIXME: we could add animation when they earn a power up
    // need to add gun in their hand if that's the power up they got (if we're still doing this)
    // num_lives++;
}//end handle_collision_powerup()


var game_over = function() {
    state = "game_over";

    // stop auto-generating birds, crates, and powerups
    clearInterval(auto_spawn_bad_obj);
    clearInterval(auto_spawn_powerup);

    // remove all game things from screen
    $(".crate").remove();
    $(".bird").remove();
    $(".power-up").remove();

    $(".game-screen").hide();

    // Show "Game Over" screen
    $("#game-over-score").text("Your Score: " + SCORE);
    $(".game-over-screen").show(); 

  // if (!MUTE) { game_over_music.play(); }
}//end game_over()


function get_random_num(min, max) {
    // borrowed from Stack Overflow
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.random() * (max - min) + min;
}//end get_random_num()
