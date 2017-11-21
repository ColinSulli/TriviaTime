// ==================== GLOBAL VARS ==================== //

// counters
var img_idx = 0;

// size and movement constants
var OBJECT_SPEED = 5;           // pixels per ms
var OBJECT_REFRESH_RATE = 50;   // ms

var state = "initial";          // options: "initial" or "running"
var mode  = "piano";            // options: "drum_kit", "orchestra", "piano", "FIXME"


var animations = [  animate_top_down,
                    animate_bottom_up,
                    animate_left_right,
                    animate_right_left,
                    random_pop_up,
                    animate_top_left_to_bottom_right,
                    animate_top_right_to_bottom_left,
                    animate_bottom_right_to_top_left,
                    animate_bottom_left_to_top_right
                 ];


// ==================== MAIN CODE ==================== //

$(document).ready( function() {
    console.log("Ready!");

    // event handlers
    $("#random").click(change_mode);
    $("#drum_kit").click(change_mode);
    $("#techno").click(change_mode);
    $("#piano").click(change_mode);

    $(window).keydown(keydown_router);


});//end document.ready()

// ==================== CALLBACK FUNCTIONS ==================== //

function keydown_router(e) {
    console.log("You hit the " + String.fromCharCode(e.which) + " key; index = " + e.which);
    var keypressed = KEYS[e.which];

    // make sure they pressed a key in KEYS dictionary
    if (!(e.which in KEYS)) {
        console.log(e.which, "is not a key in the KEYS dictionary");
        return;
    }//end if

    // transition from Start screen to Interactive one on first keypress
    if (state === "initial") {
        $("#instructions").hide();
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

}//end keydown_router()


function change_mode() {
    mode = $(this).attr("id");
    console.log("mode changed to", mode);

    // reset all borders, then highlight mode selected
    reset_genre_borders();
    $("#" + mode).css("border", "5px solid yellow");
}//end change_mode()


function reset_genre_borders() {
    // reset all .genre borders to 1px solid black
    $(".genre").each( function() {
        var curr_id = $(this).attr("id");
        $("#" + curr_id).css("border", "1px solid black");
    });//end genre_selector.each()
}//end reset_genre_borders()


function create_image(image_src) {
    var curr_img_id = "img-" + img_idx;
    var curr_image_div = "<div id='" + curr_img_id + "' class='images'></div>";
    $('#main').append(curr_image_div);
    img_idx++;

    $("#" + curr_img_id).append("<img src='" + image_src + "' height='" + "100px" + "'/>")

    // randomly animate image
    var random_animation_func = get_random_num(0, animations.length);
    var this_animation = animations[random_animation_func];
    this_animation(curr_img_id);
}//end create_image()


// image_id should be passed as something like: idx-99
function animate_top_down(image_id) {
    var this_img = $('#' + image_id);

    // randomly set horizontal position
    var starting_position = Math.random() * ($("#main").width() - this_img.width());
    this_img.css("left", starting_position + "px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + OBJECT_SPEED);

        // Check to see if the image has left the main window
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
    this_img.css("top", $("main").height());

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) - OBJECT_SPEED);

        if (parseInt(this_img.css('top')) < 0) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_up()


// image_id should be passed as something like: idx-99
function animate_left_right(image_id) {
    var this_img = $('#' + image_id);

    // randomly set vertical position
    var starting_position = Math.random() * ($("#main").height() - this_img.height());
    this_img.css("top", starting_position + "px");

    var img_animate = setInterval( function() {
        this_img.css("left", parseInt(this_img.css("left")) + OBJECT_SPEED);

        // Check to see if the image has left the main window
        if (parseInt(this_img.css('left')) > ($('#main').width() - this_img.width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_left_right()


// image_id should be passed as something like: idx-99
function animate_right_left(image_id) {
    var this_img = $('#' + image_id);

    // randomly set vertical position
    var starting_position = Math.random() * ($("#main").height() - this_img.height());
    this_img.css("top", starting_position + "px");

    this_img.css("right", "0px");

    var img_animate = setInterval( function() {
        this_img.css("right", parseInt(this_img.css("right")) + OBJECT_SPEED);

        // Check to see if the image has left the main window
        if (parseInt(this_img.css("right")) > ($('#main').width() - this_img.width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_right_left()


// image_id should be passed as something like: idx-99
function animate_top_left_to_bottom_right(image_id) {
    var this_img = $('#' + image_id);

    // make image start at top left
    this_img.css("left", "0px");
    this_img.css("top", "0px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + 0.6 * OBJECT_SPEED);
        this_img.css("left", parseInt(this_img.css('left')) + OBJECT_SPEED);

        if ((parseInt(this_img.css('top')) < 0) || (parseInt(this_img.css('left')) > $("#main").width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_top_left_to_bottom_right()


// image_id should be passed as something like: idx-99
function animate_top_right_to_bottom_left(image_id) {
    var this_img = $('#' + image_id);

    // make image start at top right
    this_img.css("right", "0px");
    this_img.css("top", "0px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + 0.6 * OBJECT_SPEED);
        this_img.css("right", parseInt(this_img.css('right')) + OBJECT_SPEED);

        if ((parseInt(this_img.css('top')) < 0) || (parseInt(this_img.css('right')) > $("#main").width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_top_right_to_bottom_left()


function random_pop_up(image_id) {
    var this_img = $('#' + image_id);

    // randomly set location
    var starting_positionW = Math.random() * ($("#main").width() - this_img.width());
    var starting_positionH = Math.random() * ($("#main").height() - this_img.height());

    this_img.css("left", starting_positionW + "px");
    this_img.css("top",  starting_positionH + "px");

    setTimeout(function() {
        this_img.remove();
    }, 800);
}//end random_pop_up()


// image_id should be passed as something like: idx-99
function animate_bottom_right_to_top_left(image_id) {
    var this_img = $('#' + image_id);

    // make image start at bottom right
    this_img.css("right", "0px");
    this_img.css("bottom", "0px");

    var img_animate = setInterval( function() {
        this_img.css("bottom", parseInt(this_img.css('bottom')) + 0.6 * OBJECT_SPEED);
        this_img.css("right", parseInt(this_img.css('right')) + OBJECT_SPEED);

        if ((parseInt(this_img.css('bottom')) > $("#main").height()) || (parseInt(this_img.css('right')) > $("#main").width()))  {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_right_to_top_left()


// image_id should be passed as something like: idx-99
function animate_bottom_left_to_top_right(image_id) {
    var this_img = $('#' + image_id);

    // make image start at bottom left
    this_img.css("left", "0px");
    this_img.css("bottom", "0px");

    var img_animate = setInterval( function() {
        this_img.css("bottom", parseInt(this_img.css('bottom')) + 0.6 * OBJECT_SPEED);
        this_img.css("left", parseInt(this_img.css('left')) + OBJECT_SPEED);

        if ((parseInt(this_img.css('bottom')) > $("#main").height()) || (parseInt(this_img.css('left')) > $("#main").width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_left_to_top_right()


function exit() {
    // remove all images currently on screen
    $(".images").remove();

    // stop all sounds FIXME

    // show main screen again
    $("#instructions").show();
    $("footer").css("visibility", "hidden");

    state = "initial";
}//end exit()


function get_random_num(min, max) {
    // borrowed from Stack Overflow
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.floor(Math.random() * (max - min) + min);
}//end get_random_num()
