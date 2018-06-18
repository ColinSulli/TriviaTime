// ==================== GLOBAL VARS ==================== //

// counters
var img_idx = 0;
var acker_img_index = 0;
var correct = 0;
var question_number = 2;

// size and movement constants
var MIN_IMG_SPEED = 3;
var MAX_IMG_SPEED = 15;
var OBJECT_REFRESH_RATE = 40;   // ms

var state = "initial";          // options: "initial" or "running"
var mode  = "bars";           // options: "bars", "drum_kit", "techno", "piano", "tutorial"
var num_lines_traversed = 0;

var admin_UserName = '' 

var quizName;
// ==================== MAIN CODE ==================== //

$(document).ready( function() {
    console.log("Ready!");

    $("#logo").click(exit);

// buttons--------------------------
    $("#submitButton").click(team_submit);
    $(".btnC").click(change_bar_team_C);
    $(".btnM").click(change_bar_team_M);
    $(".btnB").click(change_bar_team_B);
    $("#submitButtonAdmin").click(admin_submit);
    // $("#submitButtonAdminQuestions").click(admin_submit_quiz);
    $("#make_new_quiz").click(admin_make_new_quiz);
    $("#submitanswers").click(question_submit);
    $("#codesubmit").click(change_from_code);
    // $("#update_quiz").click(update_quiz);
    $("#go_back").click(go_back);
    $("#score_btn").click(score);
    $("#score_btn_back").click(score_back);

    $("#submitButtonPreScreen").click(admin_enter_questions);

    
});//end document.ready()

// ==================== CALLBACK FUNCTIONS ==================== //
function score_back()
{
    document.getElementById("inject_div_score_board").innerHTML =""
    $(".scoreboard_class").css("visibility","hidden");
    $("#quiz").css("visibility", "visible");
    $(".inject_div").css("visibility", "visible");
    $(".score_body").css("visibility", "visible");
    $("#score_btn").css("visibility", "visible");
}

function score()
{
    score_board()
    $(".scoreboard_class").css("visibility","visible");
    $("#quiz").css("visibility", "hidden");
    $(".inject_div").css("visibility", "hidden");
    $(".score_body").css("visibility", "hidden");
    $("#score_btn").css("visibility", "hidden");
}

function go_back() {
    window.open("index.html", "_self")
}

// Timer start
function startTimer() {
  var presentTime = document.getElementById('timer').innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond(m, (timeArray[1] - 1));
  if(s==59){m=m-1}
  //if(m<0){alert('timer completed')}
  
  document.getElementById('timer').innerHTML = m + ":" + s;
  setTimeout(startTimer, 1000);
}

function checkSecond(min, sec) {
  if(min == 0 && sec == 0)
  {
    doc = localStorage.getItem('doc')
    if(doc == "quiz.html")
    {
        window.open(doc, "_self"); 
    }

   var teamName = document.getElementById('team_n').value 

    barName = localStorage.getItem('admin_user')
    quizName = localStorage.getItem('quizName')
    var uaRef = firebase.database().ref("Hosts/" + barName +"/Users/" + teamName + "/Answers/")

    var roundGetter = firebase.database().ref("Hosts/" + barName + "/Quizzes/" + quizName + "/Parameters")

    var index = 0
    roundGetter.on('child_added', snap => {
        if (index == 0) {
            rounds = snap.val()
            localStorage.setItem('num_rounds', rounds)
        }
        else if (index == 1){
            q_per_round = snap.val()
            localStorage.setItem('num_qs', q_per_round)
        }
        index += 1
    })

    var qs = localStorage.getItem('num_qs')
    

    for (i = 1; i <= qs; i++){
    
        if (qs >= 10){
            if (i == 1){
                answerNum = i
            }
            else if (i == 2){
                answerNum = 10; 
            }
            else if (i == 10){
                answerNum = 2
            }
            else{
                answerNum = i - 1
            }
        }
        else{
            answerNum = i
        }

        var userAnswer = document.getElementById("a" + answerNum).value

        uaRef.child("A" + answerNum).set(userAnswer)
    }
    window.open(doc, "_self");

  }
  if (sec == 00)
  {
    // unhide questions
    $("#q" + question_number).css("visibility","visible");
    $("#a" + question_number).css("visibility","visible");
    $("#h" + question_number).css("visibility","visible");
    question_number += 1;
  }
  if (sec == "30")
  {
    $("#q" + question_number).css("visibility","visible");
    $("#a" + question_number).css("visibility","visible");
    $("#h" + question_number).css("visibility","visible");
    question_number += 1;
  }
  if (sec < 10 && sec >= 0) 
  {
    sec = "0" + sec
  }; // add zero in front of numbers < 10
  if (sec < 0) 
  {
    sec = "59"
  };
  return sec;
}
// End of Timer

function change_from_code() {
    
    barCode = document.getElementById('barcode').value; 

    barName = localStorage.getItem("admin_user")

    UserRef = firebase.database().ref("Hosts/" + barName + "/Quizzes/")

    UserRef.child(barCode).once('value', function(snapshot){
        var exists = (snapshot.val() != null)  
        if (exists) {
            localStorage.setItem('bar_code', document.getElementById('barcode').value)
            $("#code").css("visibility","hidden");
            $("#team").css("visibility","visible");
        }
        else {
            alert("That isn't a valid Bar Code! Find the Bartender and get the right Code!")
            location.reload()
        }
    })
    
}

function admin_submit() {
    var userID = document.getElementById('username').value;
    var p_word = document.getElementById('pass').value;

    var usersRef = firebase.database().ref("Hosts/")
    usersRef.child(userID).once('value', function(snapshot) {
        var pw_checker = null; 
        var exists = (snapshot.val() != null); 
        if (exists){
            pw_checker = snapshot.val().Password
            if (pw_checker == p_word) {
                admin_UserName = userID
                console.log("SUCCESSFUL");
                //published();
                $("#admin_owner").css("visibility", "hidden");
                $("#admin_menu").css("visibility","visible");
                window.open("admin.html", "_self")

            }
            else{
                alert("Wrong password, try again")
                location.reload();
                //Could just make this a reload on the input texts
            }
        }
        else{
            alert("Wrong Username, contact your TriviaTime Associate or try again");
            location.reload();

        }
    })
    localStorage.setItem('admin_user', userID);
}
function admin_make_new_quiz() {
    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }
    }
    $(".published_quizzes").css("visibility","hidden");
    $("#quiz_maker_pre_screen").css("visibility","visible");
    // $(".published_quizzes").css("visibility","hidden");
    // $("#quiz_maker").css("visibility","visible");
}

function admin_enter_questions() {
    var rounds = document.getElementById('rounds').value;
    var q_per_round = document.getElementById('qPerRound').value;
    localStorage.setItem('num_rounds', rounds)
    localStorage.setItem('num_qs', q_per_round)
    $("#quiz_maker_pre_screen").css("visibility","hidden");
    $("#submit_questions").css("visibility","visible");

    if(rounds >= 1) {
        for (z = 1; z <= rounds; z++){
            var temp_holder_main = "";
            var temp_holder_end = "";
            for(x=1; x <= q_per_round; x++) {
                temp_holder_end = "<text style = 'color: #565656; font-size: 20px'>Question " + x + ":</text>"
                + "<div id = 'quiz_maker'><input class='form-control' id='q" + (x+((z-1)*1000)) + "'" + "type='text' name='team' placeholder='Enter Question " + x + "'/></div>"
                + "<br><br>"
                + "<text style = 'color: #565656; font-size: 20px'>Answer " + x + ":</text>"
                + "<div id = 'quiz_maker'><input class='form-control' id='a" + (x+((z-1)*1000)) + "'" + "type='text' name='team' placeholder='Enter Answer " + x + " Answer'/></div><br><br>"
                + "<hr style='height:1px; border:none;'>"
              
              temp_holder_main = temp_holder_main.concat(temp_holder_end);
            }
            temp_holder_main = temp_holder_main.concat("</div>");

            var beginning = "<div id='quiz_maker'>" +
              "<h2>Round " + z + "</h2><br>"

            beginning = beginning.concat(temp_holder_main);

            $("#tmp_maker").append(beginning)
        }
    }
    $("#tmp_maker").append("<div id='submit_questions'> " +
      "<input id='submitButtonAdminQuestions' style = 'height:50px;' class = 'btn btn-primary btn-block' type='submit' value='Submit Quiz'>"
        + "<br><br>" +
        "</div>")
    $("#tmp_maker").css("visibility","visible");
    setTimeout(make_tmp_maker_visible,1000);
}

function make_tmp_maker_visible() {
    $("#submitButtonAdminQuestions").click(admin_submit_quiz);
    $("#tmp_maker").css("visibility","visible");
}

function admin_submit_quiz() {
    // var rootQuizRef = firebase.database().ref().child("Quizzes");
    done = true
    quizName = document.getElementById('qname').value;

    try {
        var rounds = document.getElementById('rounds').value;
        var q_per_round = document.getElementById('num_qs').value;
        }
    catch(err) {
        var rounds = localStorage.getItem('num_rounds');
        var q_per_round = localStorage.getItem('num_qs');
    }

    if(quizName.includes('.') || quizName.includes('#') || quizName.includes('$') 
                        || quizName.includes('[') || quizName.includes(']')){
        alert("Please make sure that the Quiz Name doesn't contain any special characters such as " +
            "any '.', '#', '$', '[, or ']'"); 
    }
    else{
            //Here we can use another input box to record how many quizes they want to make and then have
            // window refresh under the same quiz heading, to have multiple quizzes
            
        admin_UserName = localStorage.getItem('admin_user')
        firebase.database().ref("Hosts/" + admin_UserName + "/Quizzes/" + quizName + "/Parameters/").set({
                Number_Of_Rounds: rounds,
                Number_of_Questions: q_per_round
        })
        for (j = 0; j < rounds; j++){
            var quizVal = "Quiz" + j
             for (i = 1; i <= q_per_round; i++){
                var questionVal = document.getElementById('q' + (i + 1000*j)).value; 
                var answerVal = document.getElementById('a' + (i + 1000*j)).value;  

                if (questionVal === '' || answerVal === ''){
                    alert("Forgot to input Question or Answer for Question Number: " + i)
                    done = false;
                    break
                }
                else {
                    var questionNumber = 'Q' + i; 

                    admin_UserName = localStorage.getItem('admin_user')
                    firebase.database().ref("Hosts/" + admin_UserName + "/Quizzes/" + quizName + "/" + 
                                                        quizVal + "/" + 
                                                        questionNumber +"/").set({
                            Question: questionVal,
                            Answer: answerVal
                    })
                }
            }
        }
    }

    // redirect back to main page
    if(done)
    {
        $("#staticDiv").append("<input id='"+quizName+"' type='submit' value='"+quizName+"'>")
        // $('#'+quizName).click(pull_quiz_for_edit(quizName));
        $(".published_quizzes").css("visibility","visible");
        $("#tmp_maker").css("visibility","hidden");
        // $("#quiz_maker").css("visibility","hidden");
        // $(".published_quizzes").css("visibility", "visible");
        try {
            var elmnt = document.getElementById("make_new_quiz");
            elmnt.scrollIntoView();
        }
        catch(err) {}
    }
}

// delay
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
// end delay

function update_quiz() {
    // delete old table
    admin_UserName = localStorage.getItem("admin_user")
    firebase.database().ref().child("Hosts/" + admin_UserName + "/Quizzes/" + localStorage.getItem('quiz_data')).remove()
    // create new table with new data
    admin_submit_quiz()
    alert("Quiz updated!")
    window.open("admin.html", "_self")
}

function published() {
    admin_UserName = localStorage.getItem("admin_user")
    var published_quizes = firebase.database().ref().child("Hosts/" + admin_UserName + "/Quizzes")
    var quiz_num = 0
    published_quizes.on('child_added', function(snapshot) {
        quiz_num += 1
        var each_quiz = snapshot.key
        //alert("<input id = 'published_quiz" + quiz_num + "' type= 'submit' value= '" + each_quiz + "'>")
        $(".published_quizzes").append("<text style='font-size:24px;color:#646464'>" + quiz_num + ".&ensp;</text> <input id = 'published_quiz" + quiz_num + "' onclick = 'set_quiz_storage(" + quiz_num + ")' type= 'submit' class = 'btn btn-primary btn-lg' value= '" + each_quiz + "'/>  "+"<input style = float:right;' class='btn btn-danger btn-lg' id = 'delete" + quiz_num + "' onclick = 'delete_selected_quiz("+quiz_num+")' type= 'submit' value= 'Delete'/><hr style='height:1px;border:none;'>")
        //$(".delete_quiz").append("<input id = 'delete" + quiz_num + "' type= 'submit' value= 'delete'/>")
    })
}

function set_quiz_storage(quiz_num) {
    var rounds
    var q_per_round

    var quiz_data = document.getElementById("published_quiz" + quiz_num).value
    localStorage.setItem('quiz_data', quiz_data);
//alert(quiz_data);

    admin_UserName = localStorage.getItem("admin_user")
    var root_quiz2 = firebase.database().ref("Hosts/" + admin_UserName + "/Quizzes/" + quiz_data + "/Parameters/");
    index = 0
    root_quiz2.on('child_added', snap =>{
        if (index == 0) {
            rounds = snap.val()
            localStorage.setItem('num_rounds', rounds);
        }
        else if (index == 1) {
            q_per_round = snap.val()
            localStorage.setItem('num_qs', q_per_round);
        }
        index += 1
    })

    
// alert(rounds);
    window.open("edit_quiz.html","_self")

    

    
}

function edit_selected_quiz()
{
    

    var beginning = "<div id='quiz_maker'>" +
                "<text style = 'color: #565656; font-size: 20px'>Quiz Name:</text><div><input id='qname' class='form-control' type='text'/></div><br><br><hr style='height:1px; border:none;'>";

    if(localStorage.getItem('num_rounds') >= 1) {
        for (z = 1; z <= localStorage.getItem('num_rounds'); z++){
            beginning = beginning.concat("<h2 style= \"color:#565656;\">Round #" +z+ "</h2><br>")
            var temp_holder_main = "";
            var temp_holder_end = "";
            for(x=1; x <= localStorage.getItem('num_qs'); x++) {
                temp_holder_end = "<text style = 'color: #565656; font-size: 20px'>Question " + x + ":</text>"
                + "<div id = 'quiz_maker'><input class='form-control' id='q" + (x+((z-1)*1000)) + "'" + "type='text' name='team' placeholder='Enter Question " + x + "'/></div>"
                + "<br><br>"
                + "<text style = 'color: #565656; font-size: 20px'>Answer " + x + ":</text>"
                + "<div id = 'quiz_maker'><input class='form-control' id='a" + (x+((z-1)*1000)) + "'" + "type='text' name='team' placeholder='Enter Answer " + x + " Answer'/></div><br><br>"
                + "<hr style='height:1px; border:none;'>"
              temp_holder_main = temp_holder_main.concat(temp_holder_end);
            }
            // temp_holder_main = temp_holder_main.concat("</div>");

            beginning = beginning.concat(temp_holder_main);
            
            
        }
    }
    beginning = beginning.concat("<input id='update_quiz' style = 'height:50px;' class = 'btn btn-primary btn-block' type=\"submit\" value=\"Update Quiz\"><br><br>");
    beginning = beginning.concat("</div>");
    $("#tmp_maker").append(beginning)
    $("#update_quiz").click(update_quiz);



    quiz = localStorage.getItem('quiz_data');
    // var root_quiz = firebase.database().ref().child("Hosts/Bdubs/Quizzes/" + quiz + "/Quiz0"); 
    var num_question = 0;

    // set quiz name
    document.getElementById("qname").value = quiz
    barName = localStorage.getItem("admin_user")

    var round_bull = 1;
    for(p=1; p <=localStorage.getItem('num_rounds'); ++p) {
        admin_UserName = localStorage.getItem("admin_user")
        var root_quiz = firebase.database().ref().child("Hosts/" + barName + "/Quizzes/" + quiz + "/Quiz" + (p-1)); 
        root_quiz.on('child_added', snap =>{
            num_question += 1
            //alert(num_question);
            if(num_question > localStorage.getItem('num_qs')) {
                num_question = 1;
                round_bull = round_bull + 1;
            }
            each_question = snap.val()
            var question = each_question.Question
            var answer = each_question.Answer
            // alert("math "+(num_question+((round_bull-1)*1000)));
            // alert("round_bull "+round_bull);
            // alert("num_question "+num_question);
            document.getElementById("q" + (num_question+((round_bull-1)*1000))).value = question
            document.getElementById("a" + (num_question+((round_bull-1)*1000))).value = answer
        })
    }
    //$("#edit").css("visibility", "hidden");
    $("#admin_menu").css("visibility", "visible");
}

function delete_selected_quiz(quiz_num) {
    var txt;
    var r = confirm("Are you sure you want to delete this quiz?");
    if (r == false) {
        return;
    } 
    var quiz = document.getElementById("published_quiz" + quiz_num).value
    admin_UserName = localStorage.getItem("admin_user")
    firebase.database().ref().child("Hosts/" + admin_UserName +  "/Quizzes/" + quiz).remove()
    window.open("admin.html", "_self")
    
    $("#admin_owner").css("visibility", "hidden");
    $("#admin_menu").css("visibility", "visible");
}

function score_board()
{
    barName = localStorage.getItem('admin_user')
    var users = firebase.database().ref().child("Hosts/" + barName + "/Users/"); 

    // create table format
    final = "<table class='table table-bordered'><thead><tr><th>Team Name</th><th>Team Members</th><th>Total Score</th></tr></thead><tbody><tr>"
    count = 0
    final_length = users.count
    users.on('child_added', snap =>{
        count += 1
        team_name = snap.key
        score = snap.val().Score
        members = snap.val().Members
        final += "<tr>" + String.fromCharCode(60,116,100,62) + team_name + String.fromCharCode(60,47,116,100,62)
        final += String.fromCharCode(60,116,100,62) + members + String.fromCharCode(60,47,116,100,62)
        final += String.fromCharCode(60,116,100,62) + score + String.fromCharCode(60,47,116,100,62) + "</tr>"
        document.getElementById("inject_div_score_board").innerHTML = final + "</tr><tr></tr></tbody></table>"
    })
}

function load_me_up() {
    //Abstraction based on the button the User Clicks and the QuizName they input
    localStorage.setItem('doc', 'score.html')
    round_number = localStorage.getItem('round_number')
    quizName = localStorage.getItem('bar_code')
    barName = localStorage.getItem('admin_user')
    teamName = localStorage.getItem('teamName')
    teamMembers = localStorage.getItem('teamMembers')

    var value = firebase.database().ref().child("Hosts/" + barName + "/Quizzes/" + quizName + "/Parameters/")
    value.on('child_added', snap =>{
        number_questions = snap.val()
        minutes = ((number_questions / 2) | 0)
        seconds = 0
        if(number_questions % 2 != 0)
        {
            seconds = 30
        }
        document.getElementById('timer').innerHTML = minutes + ":" + seconds;
    })
    startTimer();
    document.getElementById('team_n').value = teamName;
    document.getElementById('players').value = teamMembers


    var rootQuiz = firebase.database().ref().child("Hosts/" + barName + "/Quizzes/" + quizName + "/Quiz" + round_number + "/"); 

    var numQuestions = 0;
    rootQuiz.on('child_added', snap =>{
        numQuestions += 1
        var eachQ = snap.val()

        var Question = eachQ.Question

        $(".inject_div").append("<div id = q" + numQuestions +"><h4> Question #" + numQuestions + ": " + Question + "</h4></div>")
        $(".inject_div").append("<input id='a" + numQuestions + "' type='text' class='form-control' style='width:75%' name='team' placeholder='Answer " + numQuestions + "'/><br><hr id = 'h" + numQuestions + "' style='height:1px;border:none;'>")
        
        // hide questions and input
        if(numQuestions != 1)
        {
            $("#q" + numQuestions).css("visibility","hidden");
            $("#a" + numQuestions).css("visibility","hidden");
            $("#h" + numQuestions).css("visibility","hidden");
        }
    })
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

function score_Loader(){
    // Timer
    round_number = localStorage.getItem('round_number')
    round_number = parseInt(round_number)
    total_rounds = localStorage.getItem('num_rounds')
    if (round_number < total_rounds - 1)
    {
        document.getElementById('timer').innerHTML = 05 + ":" + 00;
        localStorage.setItem('doc', "quiz.html")
        startTimer();
    }
    else
    {
        document.getElementById('timer').innerHTML = "All Rounds Complete!";
    }

    quizName = localStorage.getItem('bar_code')
    barName = localStorage.getItem('admin_user')
    teamName = localStorage.getItem('teamName')

    var rootQuiz = firebase.database().ref().child("Hosts/" + barName + "/Quizzes/" + quizName + "/Quiz" + round_number + "/")

    var UserRef = firebase.database().ref("Hosts/" + barName + "/Users/" + teamName + "/Answers/")

    var ScoreRef = firebase.database().ref("Hosts/" + barName + "/Users/" + teamName)

    var numCorrect = 0
    var numQuestions = 0; 
    ScoreRef.child("Score").once('value', function(snapshot) {

        tempScore = snapshot.val()
    
        rootQuiz.on('child_added', snap => {
            numQuestions += 1
            var eachQ = snap.val()

            var Question = eachQ.Question
            var Answer = eachQ.Answer

            Answer = Answer.toLowerCase()

            console.log(numQuestions)

            $(".score_body").append("<br><h4 id = 'question_center'> Question #" + numQuestions + ": " + Question + "</h4>")
            $(".score_body").append("<div class='row answers' id = ans" + numQuestions + "></div>")
            index = 0
            UserRef.child("A" + numQuestions).once('value', function(snapshot){
                index += 1
                console.log(index)
                userAnswer = snapshot.val()
                userAnswer = userAnswer.toLowerCase()

                Answer = Answer.replace('the ', '');
                userAnswer = userAnswer.replace('the ', '');

                Answer = Answer.replace('what ', '');
                userAnswer = userAnswer.replace('what ', '');

                Answer = Answer.replace('is ', '');
                userAnswer = userAnswer.replace('is ', '');


                // remove a
                Answer = Answer.replace('a ', '');
                userAnswer = userAnswer.replace('a ', '');

                if (Answer === userAnswer){
                    numCorrect += 1
                    console.log(numCorrect)
                    ScoreRef.child("Score").set(tempScore + numCorrect)
                    $("#ans"+index).css('background-color', 'green')
                }
                else{
                    $("#ans"+index).css('background-color', 'red')
                }

                $("#ans"+index).append("<div class ='col-xs-12'><div class='col-xs-6' id='correctAnswer'><h4> Correct Answer: " + Answer + "</h4></div><div class='col-xs-6' id='yourAnswer'><h4> Your Answer: "+ userAnswer + "</h4></div></div>")
             })
            console.log(numCorrect)

        })
    })
    round_number += 1
    localStorage.setItem('round_number', round_number)
}

function team_submit() {
    localStorage.setItem('round_number', 0)
    teamName = document.getElementById('teams').value;
    teamMembers = document.getElementById('player').value 

    quizName = localStorage.getItem('bar_code')

    localStorage.setItem('teamName', teamName)
    localStorage.setItem('quizName', quizName)
    localStorage.setItem('teamMembers', teamMembers)


    //HardCoded the Bdubs part

    barName = localStorage.getItem("admin_user")

    UserRef = firebase.database().ref("Hosts/" + barName + "/Users/"); 

    UserRef.child(teamName).once('value', function(snapshot) {
        var exists = (snapshot.val() != null); 
        if (exists){
            alert("That TeamName already exists, try another"); 
            //Could find a way to clear out the input field here if don't want to reload. is_c
            location.reload()
        }
        else{
            UserRef.child(teamName).set({
                Score: 0, 
                Members: teamMembers
            })
            window.open("quiz.html", "_self"); 
        }

    })
}
function question_submit() {
    window.open("score.html","_self")
}

function change_bar_team_C() {
    localStorage.setItem('admin_user', "Charley's")
    window.open("team.html","_self")
}
function change_bar_team_M() {
    localStorage.setItem('admin_user', "Mash")
    window.open("team.html","_self")
}
function change_bar_team_B() {
    localStorage.setItem('admin_user', "Bdubs")
    window.open("team.html","_self")
}

// scroll feature
$(window).scroll(function () {
      //if you hard code, then use console
      //.log to determine when you want the 
      //nav bar to stick.  
      // console.log($(window).scrollTop())
    if ($(window).scrollTop() > 133) {
      $('#timer_div').addClass('navbar-fixed');
    }
    if ($(window).scrollTop() < 134) {
      $('#timer_div').removeClass('navbar-fixed');
    }
  });

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

    // reset mode to bars
    mode = "bars";
    reset_genre_borders();
    $("#" + mode).css("border", "5px solid yellow");

    state = "initial";
    tutorial_state = "initial";
}//end exit()