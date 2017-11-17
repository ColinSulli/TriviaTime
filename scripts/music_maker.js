// ==================== GLOBAL VARS ==================== //

// counters
var img_idx = 0;

// size and movement constants
var OBJECT_SPEED = 5;           // pixels per ms
var OBJECT_REFRESH_RATE = 50;   // ms

var state = "initial";          // options: "initial" or "running"
var mode  = "piano";            // options: "drum_kit", "orchestra", "piano", "FIXME"



// ==================== MAIN CODE ==================== //

$(document).ready( function() {
    console.log("Ready!");

    // event handlers
    $(window).keydown(keydownRouter);


});//end document.ready()

// ==================== CALLBACK FUNCTIONS ==================== //

function keydownRouter(e) {
    console.log("You hit the " + String.fromCharCode(e.which) + " key; index = " + e.which);
    var keypressed = KEYS[e.which];

    // make sure they pressed a key in KEYS dictionary
    if (!(e.which in KEYS)) {
        console.log(e.which, "is not a key in the KEYS dictionary");
        return;
    }//end if

    // transition from Start screen to Interactive one on first keypress
    if (state === "initial") {
        $("#start-screen").hide();
        $("footer").css("visibility", "visible");
        state = "running";
    }//end if

    if (keypressed === "escape") {
        exit();
        return;
    }//end if

    console.log("key   =", keypressed);
    console.log("image =", master_dict["images"][keypressed]);
    console.log("tone  =", master_dict[mode][keypressed]);
    
    create_image(master_dict["images"][keypressed]);
    // master_dict[mode][keypressed].play();

}//end keydownRouter()


function create_image(image_src) {
    var curr_img_id = "img-" + img_idx;
    var curr_image_div = "<div id='" + curr_img_id + "' class='images'></div>";
    $('#main').append(curr_image_div);
    img_idx++;
                                                                        // FIXME: use certain height for all?
    $("#" + curr_img_id).append("<img src='" + image_src + "' height='" + "100px" + "'/>")


    // FIXME: need some kind of switch here for the 8 animation functions, or just do random animations
        // maybe if the keypresses key index is divisible by a certain number?
    // animate_top_down(curr_img_id);
    //animate_bottom_up(curr_img_id);
    animate_top_left_to_bottom_right(curr_img_id);

}//end create_image()


// image_id should be passed as something like: idx-99
function animate_top_down(image_id) {
    var this_img = $('#' + image_id);

    // randomly set horizontal position
    var starting_position = Math.random() * ($("#main").width() - this_img.width());
    this_img.css("left", starting_position + "px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + OBJECT_SPEED);
        // console.log("inside setInterval, function is FIXME");
        // console.log("curr css top =", this_img.css('top'));
        // console.log("main height =", $('.main').height());
        // Check to see if the image has left the game/viewing window
        if (parseInt(this_img.css('top')) > ($('#main').height() - this_img.height())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_top_down()


// image_id should be passed as something like: idx-99
function animate_bottom_up(image_id) {
    var this_img = $('#' + image_id);

    // randomly set horizontal position
    var starting_position = Math.random() * ($("#main").width() - this_img.width());
    this_img.css("left", starting_position + "px");

    // make image start at bottom of main screen
    this_img.css("top", $("#main").height());

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) - OBJECT_SPEED);
        if (parseInt(this_img.css('top')) < 0) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_up()

// image_id should be passed as something like: idx-99
function animate_top_left_to_bottom_right(image_id) {
    var this_img = $('#' + image_id);

    // randomly set horizontal position
    var starting_position = 0; 

    // make image start 150 px left of edge of screen
    this_img.css("left", 0 + "px");

    // make image start in topmost part of screen
    this_img.css("top", 0+"px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + 0.6*OBJECT_SPEED);
        this_img.css("left", parseInt(this_img.css('left')) + OBJECT_SPEED);
        if (parseInt(this_img.css('top')) < 0) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
        if (parseInt(this_img.css('left')) > $("#main").width()) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_up()


function exit() {
    // remove all images currently on screen
    $(".images").remove();

    // stop all sounds FIXME

    // show main screen again
    $("#start-screen").show();
    $("footer").css("visibility", "hidden");

    state = "initial";
}//end exit()


function get_random_num(min, max) {
    // borrowed from Stack Overflow
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.floor(Math.random() * (max - min) + min);
}//end get_random_num()
