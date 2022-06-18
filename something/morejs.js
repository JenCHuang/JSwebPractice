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
// For 3nd Block (extra Lab 1)
const maleKeywords = ["雄","強","賢","志"];
const femaleKeywords = ["芸","芬","佩","嬌"];
// For 4nd Block (extra Lab 2)


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

// For 3nd Block (extra Lab 1)
let gofunc1 = () => {
    var inputText = $('#userinpute1').val();
    const isMale = maleKeywords.some(thisElement => inputText.includes(thisElement));
    const isFemale = femaleKeywords.some(thisElement => inputText.includes(thisElement));
    if(isMale && isFemale){
        $("#emoji").text("😁");
    }else if(isMale){
        $("#emoji").text("🧑");
    }else if(isFemale){
        $("#emoji").text("👩");
    }else{
        $("#emoji").text("😎");
    };
};

// For 4nd Block (extra Lab 2)
function asyncProcess(imageID, imageURL){
    return new Promise(  
        (resolve,reject) => {
            $(imageID).attr('src',imageURL);
            $(imageID).on('load',function(){
                resolve(this.naturalWidth);
            });
            $(imageID).on('error',function(){
                // reject("Image Source error!");
                reject(0);
            });
        }
    );
};

function gofunc2(){
    // let a1 = asyncProcess("#image1","https://punchline.asia/wp-content/uploads/2.jpg");
    // console.log(a1);
    // debugger;
    Promise.all([
        asyncProcess("#image1","https://punchline.asia/wp-content/uploads/2.jpg"),
        // asyncProcess("#image1","https://punchline.asia/wp-content/uploads/2017/09/it-movie-poster-1.jpg"),
        asyncProcess("#image2","https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c618cd88432989.5dd5e72e505d1.jpg"),
        asyncProcess("#image3","https://www.u-buy.com.tw/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNzFIQk9PN3RZNUwuX0FDX1NMMTUwMF8uanBn.jpg")
    ])
    .then(
        response => {
            $("#widthResult").text('圖片寬度: ');
            var totalWidth = 0;
            for(let x=0;x<response.length;x++){
                $("#widthResult").append(response[x]);
                totalWidth += response[x];
                if(x<response.length-1){
                    $("#widthResult").append("px + ");
                }else{
                    $("#widthResult").append("px = "+totalWidth+"px");
                };
            };
        },
        error => {
            console.log(`Error:${error}`);
        }
    );
};