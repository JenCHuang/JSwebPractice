let ctx, currentImgMain;
const gridLengthV = 50;
const gridLengthH = 40;
let mapArray = new Array(16);
for(let i =0;i<16;i++){
    mapArray[i] = new Array(25);
};

let sources = {
    spriteSheet: "lab75/images/spriteSheet.png",
    material: "lab75/images/material.png",
    Enemy: "lab75/images/Enemy.png"
};
function loadImages(sources, callback) {
    let images = {};
    let loadedImages = 0;
    let numImages = 0;
    // get num of sources
    for(let src in sources) {
      numImages++;
    }
    for(let src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
};
let mapMaterial = [1,2,3,4,7,7,7,11,12,13,13,14,15,21,22,22,23,31,32];
let nTreasure = 0;

$(function () {
    // Create Map
    for(let i=0; i<16;i++){
        for(let j=0; j<25;j++){
            let ind = Math.floor(Math.random()*45);
            if(ind >= mapMaterial.length){
                mapArray[i][j] = 0;
            }else{
                mapArray[i][j] = mapMaterial[ind];
            };
        };
    };
    mapArray[0][0]=0;
    mapArray[1][0]=0;
    mapArray[0][1]=0;
    mapArray[8][13]=16;
    mapArray[9][13]=0;
    mapArray[8][14]=0;
    mapArray[9][14]=0;
    mapArray[14][24]=0;
    mapArray[15][23]=0;
    mapArray[15][24]=40;

    // get Canvas
    ctx = $("#myCanvas")[0].getContext("2d");
    currentImgMain = { // 原點由左上角出發
        "x":0,
        "y":0
    };

    // drawImages
    loadImages(sources,function(images) {
        ctx.drawImage(images.spriteSheet, 0,0,80,130,currentImgMain.x,currentImgMain.y,gridLengthH,gridLengthV);
        for(let x in mapArray){
            for(let y in mapArray[x]){
                switch(mapArray[x][y]){
                    case 1:
                        ctx.drawImage(images.material, 0,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 2:
                        ctx.drawImage(images.material, 64,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 3:
                        ctx.drawImage(images.material,160,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 4:
                        ctx.drawImage(images.material,256,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 7:
                        ctx.drawImage(images.material,160,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 11:
                        ctx.drawImage(images.material, 0,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 12:
                        ctx.drawImage(images.material,32,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 13:
                        ctx.drawImage(images.material,64,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 14:
                        ctx.drawImage(images.material,192,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 15:
                        ctx.drawImage(images.material,320,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 16:
                        ctx.drawImage(images.material,96,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH*2,gridLengthV*2);
                        break;
                    case 21:
                        ctx.drawImage(images.Enemy, 7,40,104,135,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);    
                        break;
                    case 22:
                        ctx.drawImage(images.Enemy,111,40,94,135,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);    
                        break;
                    case 23:
                        ctx.drawImage(images.Enemy,276,40,80,135,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);    
                        break;
                    case 31:
                        ctx.drawImage(images.material,288,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 32:
                        ctx.drawImage(images.material,320,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                    case 40:
                        ctx.drawImage(images.material, 0,228,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                        break;
                }
            }
        }
    });
});

$(document).on("keydown", function (event) {
    mapArray[9][13]=16;
    mapArray[8][14]=16;
    mapArray[9][14]=16;
    let targetImg, targetBlock, cutImagePositionX;
    targetImg = { //主角的目標座標，先放個不會有動作的起始值(見最後一個if-else)
        "x":-1,
        "y":-1
    };
    targetBlock = { //主角的目標(對應2維陣列)
        "x":-1,
        "y":-1
    }
    event.preventDefault();
    switch (event.code){
        case "ArrowLeft":
            targetImg.x = currentImgMain.x - gridLengthH;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 175; // 臉朝左
            break;
        case "ArrowUp":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y - gridLengthV;
            cutImagePositionX = 355; // 臉朝上
            break;
        case "ArrowRight":
            targetImg.x = currentImgMain.x + gridLengthH;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 540; // 臉朝右
            break;
        case "ArrowDown":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y + gridLengthV;
            cutImagePositionX = 0; // 臉朝下
            break;
        default: // 其他按鍵不處理
            return; // 不做任何動作並離開 switch
    };

    //確認目標位置不會超過地圖
    if(targetImg.x<=960 && targetImg.x>=0 && targetImg.y<=750 && targetImg.y>=0){
        targetBlock.x = targetImg.y / gridLengthV;
        targetBlock.y = targetImg.x / gridLengthH;
    }else{
        targetBlock.x = -1;
        targetBlock.y = -1;
    };

    //清空主角原本所在的位置
    ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLengthH, gridLengthV);
    let x = currentImgMain.y/gridLengthV;
    let y = currentImgMain.x/gridLengthH
    if(mapArray[x][y]<9){
        loadImages(sources,function(images) {
            switch(mapArray[x][y]){
                case 1:
                    ctx.drawImage(images.material, 0,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                    break;
                case 2:
                    ctx.drawImage(images.material, 64,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                    break;
                case 3:
                    ctx.drawImage(images.material,160,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                    break;
                case 4:
                    ctx.drawImage(images.material,256,158,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                    break;
                case 7:
                    ctx.drawImage(images.material,160,192,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
                    break;
            }
        });
    };
    if(mapArray[x][y]==40){
        loadImages(sources,function(images) {
            ctx.drawImage(images.material, 0,228,32,32,y*gridLengthH,x*gridLengthV,gridLengthH,gridLengthV);
        });
    };

    if(targetBlock.x!=-1 && targetBlock.y!=-1){
        switch(Math.floor(mapArray[targetBlock.x][targetBlock.y]/10)){
            case 0: // 一般道路(可移動)
                $("#talkBox").text("");
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 1: // 有障礙物(不可移動)
                $("#talkBox").text("有山");
                break;
            case 2: // 敵人(不可移動)
                $("#talkBox").text("哈摟");
                break; 
            case 3: // 得到寶藏(可移動)
                $("#talkBox").text("找到寶藏了!");
                mapArray[targetBlock.x][targetBlock.y]=0;
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                nTreasure++;
                break; 
            case 4: // 終點(可移動)
                $("#talkBox").text("抵達終點! 一共取得"+nTreasure+"個寶藏");
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
        };
    }else{
        $("#talkBox").text("邊界");
    };

    //重新繪製主角
    loadImages(sources,function(images) {
        ctx.drawImage(images.spriteSheet, cutImagePositionX,0,80,130,currentImgMain.x,currentImgMain.y,gridLengthH,gridLengthV);
    });
    
});