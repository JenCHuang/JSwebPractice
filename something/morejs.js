// For 1st Block: None
// For 2nd Block
let count = 10;
let contral1 = 0;
let contral2 = 0;
let originhint = $('#hint').text();
let myVar;
let date = new Date();
let pm = date.getMonth()+1;
let pd = date.getDate();
if (pm < 10){pm = '0'+pm};
if (pd < 10){pd = '0'+pd};
let passwd = pm+pd;

$(function(){
    // For 1st Block
    $('#div_r').on("mouseover", mouseIn);
    $('#div_r').on("mouseout", mouseOut);
    $('#div_r').on("mousemove", mouseMove);

    // For 2nd Block
    $('#timer').text(count);
    $('.div2').on("mouseover", startcountdown);
    $('#getpw').on("click", checkPasswd);
    $('#userInput').on("keypress", function(e){
        if (e.key == 'Enter') checkPasswd();
    });
    $('#reset').on("click", resetc);

    // For 3nd Block (extra Lab 1)
    $("#buttone1").on("click",gofunc1);
    $('#userinpute1').on("keypress", function(e){
        if (e.key == 'Enter') gofunc1();
    });

    // For 4nd Block (extra Lab 2)
    $("#buttoneDemo").on("click",demofunc);
    $("#buttone2").on("click",gofunc2);

});

// For 1st Block
function mouseIn() {
    $("#info01").text("你進來了");
};

function mouseOut() {
    $("#info01").text("你出去了");
    $("#p1").text(" ");
};

function mouseMove(e) {
    $("#p1").text("你在裡面走來走去。位置: "+e.clientX+", "+e.clientY);
};

// For 2nd Block
function startcountdown(){
    if(contral1==0){
        myVar = setInterval(myTimer,1000);
    };
    contral1=1;
};

function myTimer(){
    count--;
    $('#timer').text(count);
    if(count == 0){
        $('#hint').text("You are dead !!!");
        clearInterval(myVar); //歸零後就不再 count--
    }
};

function checkPasswd(){
    if (contral2==0){
        $('#hint').text(" ");
        if (parseInt($('#userInput').val()) == passwd){
            alert("You got it!");
            clearInterval(myVar);
            contral2=1;
        }else{
            $('#hint').text("Try again !!");
        };
    };
    $('#userInput').val('');
};

// Reset to begining
function resetc(){
    clearInterval(myVar);
    $('#hint').text(originhint);
    count = 10;
    $('#timer').text(count);
    contral2 = 0;
    myVar = setInterval(myTimer,1000);
};