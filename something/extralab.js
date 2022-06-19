// For 3nd Block (extra Lab 1)
const maleKeywords = ['飛','天','彬','世','全','昌','安','泰','濤','福','志','敬','明','良','雄',
                      '維','行','嘉','中','文','炎','若','杰','鵬','毅','生','輝','梓','誠','鈞',
                      '成','振','龍','才','利','順','武','宇','博','德','勇','致','邦','盛','鬆',
                      '承','學','茂','堅','仁','軍','富','波','信','策','凱','友','榮','功','以',
                      '和','國','厚','豪','弘','楠','軒','皓','進','清','剛','俊','平','慶','震',
                      '鋒','裕','峰','山','群','士','倫','航','誠','時','樂','樹','保','新','廣',
                      '海','祥','樑','榕','棟','強','星','騰','東','琛','澤','建','光','民','紹',
                      '斌','啟','興','冠','克','巖','力','旭','磊','偉','傑','元','朋','康','壯',
                      '發','勝','彪','達','先','風','浩','永','翔','辰','健','晨','義','伯','鳴'];
const femaleKeywords = ['嬌','翠','曉','筠','筱','希','悅','佳','莉','君','芬','竹','瑤','婭','羽',
                        '歡','舒','景','月','文','若','貞','洋','芝','瑛','映','雅','倩','瓊','美',
                        '芮','鳳','心','薇','宇','蘭','晗','萱','家','柔','彤','方','研','荔','寒',
                        '琴','芷','蓉','彩','娟','凝','嫣','思','子','欣','麗','可','涵','璇','巧',
                        '燕','靈','怡','淇','娜','潔','宜','慈','夢','慧','萍','霞','玉','穎','夕',
                        '晴','靄','春','清','盈','艾','依','靜','珠','珍','芸','紅','羨','樂','新',
                        '雨','琳','星','榕','楓','伊','雪','育','瑞','姬','亞','婷','菲','娥','瑩',
                        '玲','敏','枝','梅','霄','妍','玟','淑','茜','秀','佩','豔','瑄','歆','菊',
                        '惠','兒','芳','青','沫','永','善','辰','晨','容'];

// For 3nd Block (extra Lab 1)
let gofunc1 = () => {
    var inputText = $('#userinpute1').val();
    const isMale = maleKeywords.some(thisElement => inputText.includes(thisElement));
    const isFemale = femaleKeywords.some(thisElement => inputText.includes(thisElement));
    if(isMale && isFemale){
        $("#emoji").text("😁");
        $("#emojitext").text("似乎是通用的名子呢~");
    }else if(isMale){
        $("#emoji").text("🧑");
        $("#emojitext").text("像是男性的名子呢~");
    }else if(isFemale){
        $("#emoji").text("👩");
        $("#emojitext").text("像是女性的名子呢~");
    }else{
        $("#emoji").text("😎");
        $("#emojitext").text("似乎是有些罕見的名子呢~");
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

function demofunc(){
    Promise.all([
        asyncProcess("#image1","https://image.agentm.tw/images/movie/7f669c5771b2ef0d636877ef6e2d9fb2109c23bca2730429974d60337b0535c9/poster/image/px_0007.jpg"),
        asyncProcess("#image2","http://www.shareradio.co.uk/media/8344/top-gun-maverick.jpg"),
        asyncProcess("#image3","https://movies.yahoo.com.tw/i/o/production/movies/May2022/WT76Xu8RIQROWlvk5hz8-1080x1543.JPG")
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

function gofunc2(){
    // let a1 = asyncProcess("#image1","https://punchline.asia/wp-content/uploads/2.jpg");
    // console.log(a1);
    // debugger;

};