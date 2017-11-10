
var course = {
    "start": 1,
    "middle": 2,
    "end": 3
}

// variables declared outside of functions automatically get globally scoped
var global_var = "GLOBAL";

// variables declared inside of functions BUT without "var" have global scope
// NOTE: this variable will not be created until this function runs
function a() {
    global_var2 = "GLOBAL 2";
}

// variables declared inside of functions WITH "var" only have local scope
function b() {
    var local_var  = "LOCAL";
    let local_var2 = "LOCAL 2";

    // code here can use local_var & local_var2 & global_var
    console.log("local variable =",   local_var);
    console.log("local variable2 =",  local_var2);
    console.log("global variable1 =", global_var);

    // NOTE: you can only use global_var2 (created in function a) IFF
    // that function has been called previously
    console.log("global variable2 =", global_var2);
}

function c() {
    console.log(course);
    console.log("adding to course...");

    course.abc = 0;
    console.log(course);

    // // code here can use global_var
    // console.log("global variable1 =", global_var);

    // // Code here can use global_var2 IFF function a was already called
    // console.log("global variable2 =", global_var2);

    // // code here CANNOT use local_var because it is only scoped to function b
    // try        { console.log("local variable =", local_var); }
    // catch(err) { console.log("Error:", err); }

    // // code here CANNOT use local_var2 because it is only scoped to function b
    // try        { console.log("local variable 2 =", local_var2); }
    // catch(err) { console.log("Error:", err); }
}




