// ==================== GLOBAL VARS ==================== //

// counters
var img_idx = 0;

// size and movement constants
var MIN_IMG_SPEED = 3;
var MAX_IMG_SPEED = 15;
var OBJECT_REFRESH_RATE = 40;   // ms

var state = "initial";          // options: "initial" or "running"
var mode  = "random";           // options: "random", "drum_kit", "techno", "piano", "tutorial"
var prev_keys_queue = [];
tutorial_animate = "";
tutorial_mode_timeout = "";

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

    $("#random").click(change_mode);
    $("#drum_kit").click(change_mode);
    $("#techno").click(change_mode);
    $("#piano").click(change_mode);
    $("#tutorial").click(change_mode);
    $("#tutorial2").click(change_mode);

    $(window).keydown(keydown_router);
});//end document.ready()

// ==================== CALLBACK FUNCTIONS ==================== //

function keydown_router(e) {
    // console.log("You hit the " + String.fromCharCode(e.which) + " key; index = " + e.which);
    var keypressed = KEYS[e.which];
    update_queue(keypressed);

    // make sure they pressed a key in KEYS dictionary
    if (!(e.which in KEYS)) {
        console.log(e.which, "is not a key in the KEYS dictionary");
        return;
    }//end if

    // transition from Start screen to Interactive one on first keypress
    if (state === "initial") {
        $("#instructions").css("visibility", "hidden");
        $("#prev_keys").show();
        $("footer").css("visibility", "visible");
        state = "running";
    }//end if

    if (keypressed === "escape") {
        exit();
        return;
    }//end if

    create_image(master_dict["images"][keypressed]);

    if (mode === "random") {
        play_random_sound();
        return;
    }//end if

    // console.log("tone should be =", master_dict[mode][keypressed]);
    let sound = master_dict[mode][keypressed];
    let audio = new Audio(sound);
    audio.play();
}//end keydown_router()


function update_queue(keypressed) {
    prev_keys_queue.push(keypressed);

    // only store previous 25 keys
    if (prev_keys_queue.length > 25) {
        var remove = prev_keys_queue.shift();
    }//end if

    $("#prev_keys").text("Previous Keys Pressed: " + prev_keys_queue);
}//end update_queue()


function tutorial_mode() {
    var line = $('#red_line');
    var this_speed = 3.8;

    // set red line to start at top left of sheet music
    line.css("left", "0px");
    line.css("top", "10px");

    var num_lines_traversed = 0;
    var new_css = ["top", "middle", "bottom"]; 

    tutorial_animate = setInterval( function() {
        // move line from left to right
        line.css("left", parseInt(line.css("left")) + this_speed);

        // Check to see if the image gone over the right edge of the image
        if (parseInt(line.css('left')) > ($('#image_on_screen').width())) {
            num_lines_traversed = ++num_lines_traversed % 3;

            // move red line to left of next line
            line.css("left", "0px");
            line.css("vertical-align", new_css[num_lines_traversed]);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end tutorial_mode()


function change_mode() {
    mode = $(this).attr("id");
    // console.log("mode changed to", mode);

    // reset all borders, then highlight mode selected
    reset_genre_borders();
    $("#" + mode).css("border", "5px solid yellow");

    // hide "[Esc] to exit" (in case prev mode was "tutorial")
    $("footer").css("visibility", "hidden");

    // re-display instructions if state === "initial"
    if (state === "initial") {
        $("#instructions").css("visibility", "visible");
    }//end if

    // hide/stop tutorial mode stuff
    $("#red_line").css("visibility", "hidden");
    clearInterval(tutorial_animate);
    clearTimeout(tutorial_mode_timeout);    

    // Change image_on_screen depending on mode
    if (mode === "random")   { $("#image_on_screen").attr("src", "./img/random.gif"); }
    if (mode === "drum_kit") { $("#image_on_screen").attr("src", "./img/drums.png"); }
    if (mode === "techno")   { $("#image_on_screen").attr("src", "./img/techno.jpg"); }
    if (mode === "piano")    { $("#image_on_screen").attr("src", "./img/piano_keyboard.png"); }
    
    // clicking the Tutorial box automatically puts the user into an interactive mode
    if (mode === "tutorial") {
        // hide instructions, show [Esc] to exit, display countdown.gif for 3 seconds
        $("#instructions").css("visibility", "hidden");
        $("footer").css("visibility", "visible");
        $("#image_on_screen").attr("src", "./img/countdown.gif");

        tutorial_mode_timeout = setTimeout(function() {   
            $("#red_line").css("visibility", "visible");
            $("#image_on_screen").attr("src", "./img/twinkle.png");
            tutorial_mode();
        }, 2650);
    }//end if tutorial
}//end change_mode()


function reset_genre_borders() {
    // reset all .genre borders to 2px solid black
    $(".genre").each( function() {
        var curr_id = $(this).attr("id");
        $("#" + curr_id).css("border", "2px solid black");
    });
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


// For ALL animation functions, image_id should be passed as something like: idx-99
function animate_top_down(image_id) {
    var this_img = $('#' + image_id);
    var this_speed = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // randomly set horizontal position
    var starting_position = Math.random() * ($("#main").width() - this_img.width());
    this_img.css("left", starting_position + "px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + this_speed);

        // Check to see if the image has left the main window
        if (parseInt(this_img.css('top')) > ($('#main').height() - this_img.height() + 40)) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_top_down()


function animate_bottom_up(image_id) {
    var this_img = $('#' + image_id);
    var this_speed = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // randomly set horizontal position
    var starting_position = Math.random() * ($("#main").width() - this_img.width());
    this_img.css("left", starting_position + "px");

    // make image start at bottom of main screen
    //console.log("top for main: !!!  "+ parseInt($("#main").height()));
    this_img.css("top", $("#main").height());

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) - this_speed);
        //console.log("top "+parseInt(this_img.css('top')));
        if (parseInt(this_img.css('top')) <= 80) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_up()


function animate_left_right(image_id) {
    var this_img = $('#' + image_id);
    var this_speed = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // randomly set vertical position
    var starting_position = (Math.random() + 0.2) * ($("#main").height() - this_img.height());
    this_img.css("top", starting_position + "px");

    var img_animate = setInterval( function() {
        this_img.css("left", parseInt(this_img.css("left")) + this_speed);

        // Check to see if the image has left the main window
        if (parseInt(this_img.css('left')) > ($('#main').width() - this_img.width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_left_right()


function animate_right_left(image_id) {
    var this_img = $('#' + image_id);
    var this_speed = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // randomly set vertical position
    var starting_position = (Math.random() + 0.2) * ($("#main").height() - this_img.height());
    this_img.css("top", starting_position + "px");

    this_img.css("right", "0px");

    var img_animate = setInterval( function() {
        this_img.css("right", parseInt(this_img.css("right")) + this_speed);

        // Check to see if the image has left the main window
        if (parseInt(this_img.css("right")) > ($('#main').width() - this_img.width())) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_right_left()


function animate_top_left_to_bottom_right(image_id) {
    var this_img = $('#' + image_id);
    var this_speed_top = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);
    var this_speed_left = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // make image start at top left
    this_img.css("left", "10px");
    this_img.css("top", "80px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + this_speed_top);
        this_img.css("left", parseInt(this_img.css('left')) + this_speed_left);

        if ((parseInt(this_img.css('top')) > $('#main').height()) || (parseInt(this_img.css('left')) > (-80 + $("#main").width()))) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_top_left_to_bottom_right()


function animate_top_right_to_bottom_left(image_id) {
    var this_img = $('#' + image_id);
    var this_speed_top = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);
    var this_speed_right = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // make image start at top right
    this_img.css("right", "0px");
    this_img.css("top", "80px");

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) + this_speed_top);
        this_img.css("right", parseInt(this_img.css('right')) + this_speed_right);

        if ((parseInt(this_img.css('top')) > $('#main').height()) || (parseInt(this_img.css('right')) > (-80 + $("#main").width()))) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_top_right_to_bottom_left()


function random_pop_up(image_id) {
    var this_img = $('#' + image_id);
    var this_time = get_random_num(500, 1000);

    // randomly set location
    var starting_positionW = (Math.random() + 0.2) * ($("#main").width() - this_img.width());
    var starting_positionH = (Math.random() + 0.2) * ($("#main").height() - this_img.height());

    this_img.css("left", starting_positionW + "px");
    this_img.css("top",  starting_positionH + "px");

    setTimeout(function() {
        this_img.remove();
    }, this_time);
}//end random_pop_up()


// image_id should be passed as something like: idx-99
function animate_bottom_right_to_top_left(image_id) {
    var this_img = $('#' + image_id);
    var this_speed_bott = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);
    var this_speed_right = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // make image start at bottom right
    this_img.css("right", "20px");
    this_img.css("top", $("#main").height() - 20);

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) - this_speed_bott);
        this_img.css("right", parseInt(this_img.css('right')) + this_speed_right);

         if ((parseInt(this_img.css('top')) <= 80) || (parseInt(this_img.css('right')) >= (-80 + $("#main").width()))) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_right_to_top_left()


// image_id should be passed as something like: idx-99
function animate_bottom_left_to_top_right(image_id) {
    var this_img = $('#' + image_id);
    var this_speed_bott = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);
    var this_speed_left = get_random_num(MIN_IMG_SPEED, MAX_IMG_SPEED);

    // make image start at bottom left
    this_img.css("left", "20px");
    this_img.css("top", $("#main").height() - 20);

    var img_animate = setInterval( function() {
        this_img.css("top", parseInt(this_img.css('top')) - this_speed_bott);
        this_img.css("left", parseInt(this_img.css('left')) + this_speed_left);

        if ((parseInt(this_img.css('top')) <= 80) || (parseInt(this_img.css('left')) >= (-80 + $("#main").width()))) {
            this_img.remove();
            clearInterval(img_animate);
        }//end if
    }, OBJECT_REFRESH_RATE);
}//end animate_bottom_left_to_top_right()


function exit() {
    // remove all images currently on screen
    $(".images").remove();

    // stop tutorial mode & red line animation
    $("#red_line").css("visibility", "hidden");
    clearInterval(tutorial_animate);
    clearTimeout(tutorial_mode_timeout);

    $("#prev_keys").hide();
    prev_keys_queue = [];

    // show main screen again
    $("#instructions").css("visibility", "visible");
    $("footer").css("visibility", "hidden");

    // reset mode to random
    mode = "random";
    reset_genre_borders();
    $("#" + mode).css("border", "5px solid yellow");
    $("#image_on_screen").attr("src", "./img/random.gif");

    state = "initial";
}//end exit()


function play_random_sound() {
    // select a random mode to get a sound from
    var modes = ["drum_kit", "techno", "piano", "extra"];
    var random_mode = modes[Math.floor(Math.random() * modes.length)];
    // console.log("random mode =", random_mode);

    // select a random key to get a sound from
    var keys = Object.keys(master_dict[random_mode]);
    var random_key = keys[Math.floor(Math.random() * keys.length)];
    // console.log("random key =", random_key);

    var sound = master_dict[random_mode][random_key];
    var audio = new Audio(sound);
    // console.log("random sound is =", sound);
    audio.play();
}//end get_random_sound()


function get_random_num(min, max) {
    // borrowed from Stack Overflow
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.floor(Math.random() * (max - min) + min);
}//end get_random_num()
