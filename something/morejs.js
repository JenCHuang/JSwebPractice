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
    $('#div_r').on("mouseover", mouseIn);
    $('#div_r').on("mouseout", mouseOut);
    $('#div_r').on("mousemove", mouseMove);

    $('#timer').text(count);
    $('.div2').on("mouseover", startcountdown);
    $('#getpw').on("click", checkPasswd);
    $('#userInput').on("keypress", checkkey);
    $('#reset').on("click", resetc);
});

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

function checkkey(keyin){
    if (keyin.key == 'Enter'){
        checkPasswd();
    };
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
