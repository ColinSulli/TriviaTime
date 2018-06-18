// ==================== GLOBAL VARS ==================== //

// counters
var img_idx = 0;
var acker_img_index = 0;
var correct = 0;

// size and movement constants
var MIN_IMG_SPEED = 3;
var MAX_IMG_SPEED = 15;
var OBJECT_REFRESH_RATE = 40;   // ms

var state = "initial";          // options: "initial" or "running"
var mode  = "random";           // options: "random", "drum_kit", "techno", "piano", "tutorial"
var num_lines_traversed = 0;

// ==================== MAIN CODE ==================== //

$(document).ready( function() {
    console.log("Ready!");

    $("#logo").click(exit);

    //$("#random").click(change_mode);
    //$("#drum_kit").click(change_mode);
    //$("#questions").click(change_mode);
    //$("#scores").click(change_mode);
    $("#owner").click(change_mode);

// buttons--------------------------
    $("#submitButton").click(team_submit);
    $(".btn").click(change_bar_team);
    $("#submitButtonAdmin").click(admin_submit);
    $("#submitButtonAdminQuestions").click(admin_submit_quiz);
    $("#make_new_quiz").click(admin_make_new_quiz);
    $("#submitanswers").click(question_submit);

    
});//end document.ready()

// ==================== CALLBACK FUNCTIONS ==================== //

function admin_submit() {
    window.open("admin_menu.html","_self")
    $("#admin_owner").css("visibility", "hidden");

    user_name = document.getElementById('username');
    pass = document.getElementById('pass');
    $("#admin_menu").css("visibility","visible");
    // $("#quiz_maker").css("visibility","visible");
}
function admin_make_new_quiz() {
    window.open("quiz_maker.html","_self")
    $("#admin_menu").css("visibility","hidden");
    $("#quiz_maker").css("visibility","visible");
}
function admin_submit_quiz() {

    var new_button = "<input id='new_quiz_published' type=\"submit\" value=\"Random Trivia\">"
    $("#staticDiv").append(new_button);
    $("#admin_menu").css("visibility", "visible");
    $("#quiz_maker").css("visibility", "hidden");
}

function is_correct(correct_answer, user_answer) 
{
    // lower case inputs
    correct_answer = correct_answer.toLowerCase();
    user_answer = user_answer.toLowerCase();

    // remove the
    correct_answer = correct_answer.replace('the ', '');
    user_answer = user_answer.replace('the ', '');

    // remove a
    correct_answer = correct_answer.replace('a ', '');
    user_answer = user_answer.replace('a ', '');

    if (user_answer == correct_answer)
    {
        correct += 1;
        return "Correct";
    }

    return "Incorrect";
}

function team_submit() {
    window.open("quiz.html","_self")
    team_name = document.getElementById('teams').value;
    player_names = document.getElementById('player').value;

    reset_genre_borders();
    $("#" + "questions").css("border", "5px solid yellow");
    $("#instructions").css("visibility","hidden");
    $("#img_div").css("visibility", "hidden"); 
    $("#team").css("visibility", "hidden");
    $("#quiz").css("visibility", "visible");
    document.getElementById('team_n').value = team_name;
    document.getElementById('players').value = player_names;
}

function question_submit() {
    window.open("score.html","_self")





    answer1 = document.getElementById('q1').value;
    answer2 = document.getElementById('q2').value;
    answer3 = document.getElementById('q3').value;
    answer4 = document.getElementById('q4').value;
    answer5 = document.getElementById('q5').value;
    answer6 = document.getElementById('q6').value;
    answer7 = document.getElementById('q7').value;
    answer8 = document.getElementById('q8').value;
    answer9 = document.getElementById('q9').value;
    answer10 = document.getElementById('q10').value;
    document.getElementById('a1').value = answer1;
    document.getElementById('c1').value = is_correct("The Great Wall of China", answer1);

    document.getElementById('a2').value = answer2;
    document.getElementById('c2').value = is_correct("Uranus", answer2);

    document.getElementById('a3').value = answer3;
    document.getElementById('c3').value = is_correct("Canberra", answer3);

    document.getElementById('a4').value = answer4;
    document.getElementById('c4').value = is_correct("Type O", answer4);

    document.getElementById('a5').value = answer5;
    document.getElementById('c5').value = is_correct("Whale Shark", answer5);

    document.getElementById('a6').value = answer6;
    document.getElementById('c6').value = is_correct("Dreamt", answer6);

    document.getElementById('a7').value = answer7;
    document.getElementById('c7').value = is_correct("Nepal", answer7);

    document.getElementById('a8').value = answer8;
    document.getElementById('c8').value = is_correct("Polish", answer8);

    document.getElementById('a9').value = answer9;
    document.getElementById('c9').value = is_correct("Coffee", answer9);

    document.getElementById('a10').value = answer10;
    document.getElementById('c10').value = is_correct("Steel", answer10);

    document.getElementById('c11').value = correct;

    reset_genre_borders();
    $("#" + "score").css("border", "5px solid yellow");
    $("#instructions").css("visibility","hidden");
    $("#img_div").css("visibility", "hidden"); 
    $("#team").css("visibility", "hidden");
    $("#quiz").css("visibility", "hidden");
    $("#score_body").css("visibility", "visible");
}

function change_bar_team() {
    window.open("team.html","_self")
    reset_genre_borders();
    $("#" + "drum_kit").css("border", "5px solid yellow");
    $("#instructions").css("visibility","hidden");
    $("#img_div").css("visibility", "hidden");
    $("#select").css("visibility", "hidden");
    $("#team").css("visibility", "visible");
}

function change_mode() {
    mode = $(this).attr("id");
    // tutorial_state = "initial";
    // num_lines_traversed = 0;

    // reset all borders, then highlight mode selected
    reset_genre_borders();
    $("#" + mode).css("border", "5px solid yellow");

    // show footer (will be hidden immediately if still in "initial" state)
    $("footer").css("visibility", "visible");

    // re-display instructions & hide footer if state === "initial"
    if (state === "initial") {
        $("#instructions").css("visibility", "visible");
        $("footer").css("visibility", "hidden");
    }//end if   

    // Change image_on_screen depending on mode
    if (mode === "random")   { 
        $("#quiz").css("visibility", "hidden");
        $("#score_body").css("visibility", "hidden");
        $("#instructions").css("visibility","visible");
        $("#img_div").css("visibility", "visible");
        $("#image_on_screen").attr("src", "./img/charleys.png");
        $("#image_on_screen").attr("style", "width:35%;height:auto"); 
        $("#team").css("visibility", "hidden"); 
        $("#admin_owner").css("visibility", "hidden");
        $("#admin_menu").css("visibility", "hidden");
        $("#quiz_maker").css("visibility", "hidden");
    }
    if (mode === "drum_kit") {
        // $("#image_on_screen").attr("src", "./img/drums.png");
        $("#instructions").css("visibility","hidden");
        $("#img_div").css("visibility", "hidden");
        $("#quiz").css("visibility", "hidden");
        $("#score_body").css("visibility", "hidden");
        $("#team").css("visibility", "visible"); 
        $("#admin_owner").css("visibility", "hidden");
        $("#admin_menu").css("visibility", "hidden");
        $("#quiz_maker").css("visibility", "hidden");
    }
    if (mode === "questions")   { 
        $("#instructions").css("visibility","hidden");
        $("#img_div").css("visibility", "hidden");
        $("#team").css("visibility", "hidden");
        $("#score_body").css("visibility", "hidden");
        $("#quiz").css("visibility", "visible");
        $("#admin_owner").css("visibility", "hidden");
        $("#admin_menu").css("visibility", "hidden");
        $("#quiz_maker").css("visibility", "hidden");
    }
    if (mode === "owner")   { 
        $("#instructions").css("visibility","hidden");
        $("#img_div").css("visibility", "hidden"); 
        $("#team").css("visibility", "hidden");
        $("#admin_owner").css("visibility", "visible");
        $("#quiz").css("visibility", "hidden");
        $("#score_body").css("visibility", "hidden");
    }
    if (mode === "score")   { 
        $("#instructions").css("visibility","hidden");
        $("#img_div").css("visibility", "hidden");
        $("#team").css("visibility", "hidden");
        $("#quiz").css("visibility", "hidden");
        $("#score").css("visibility", "visible");
        $("#admin_owner").css("visibility", "hidden");
        $("#admin_menu").css("visibility", "hidden");
        $("#quiz_maker").css("visibility", "hidden");
    }
}//end change_mode()


function reset_genre_borders() {
    // reset all .genre borders to 2px solid black
    $(".genre").each( function() {
        var curr_id = $(this).attr("id");
        $("#" + curr_id).css("border", "2px solid black");
    });
}//end reset_genre_borders()

function exit() {
    // remove all images currently on screen
    $(".images").remove();

    $("#start_tutorial").css("visibility", "hidden");
    stop_tutorial_mode_animation();

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
    tutorial_state = "initial";
}//end exit()


function play_random_sound() {
    // select a random mode to get a sound from
    var modes = ["drum_kit", "techno", "piano", "extra"];
    var random_mode = modes[Math.floor(Math.random() * modes.length)];

    // select a random key to get a sound from
    var keys = Object.keys(master_dict[random_mode]);
    var random_key = keys[Math.floor(Math.random() * keys.length)];

    var sound = master_dict[random_mode][random_key];
    var audio = new Audio(sound);
    // console.log("random sound is =", sound);
    audio.play();
}//end get_random_sound()

