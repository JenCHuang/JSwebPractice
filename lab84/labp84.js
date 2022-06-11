let player; //YouTube Player
let currentPlay = 0; //記錄目前撥到第幾首歌

// 當Youtube API準備好時，設定播放器
// Youtube 載入 framework 後自動呼叫的 (In Youtube iframe API)
function onYouTubeIframeAPIReady(){
    // YT.Player 是 Youtube iframe API 中的物件
    // 首個參數為 id (Labp84.html line:15)
    // 見 https://developers.google.com/youtube/player_parameters#Parameters
    player = new YT.Player("player",{
        height:"390",
        width:"640",
        // 待撥的歌曲
        videoId:playList[currentPlay],
            playerVars:{
                autoplay:0, // 是否自動撥放, "0" 表示 "否"
                controls:0, // 是否顯示控制項
                start:playTime[currentPlay][0], // 開始的秒數
                end:playTime[currentPlay][1],   // 結束的秒數
                iv_load_policy:3,
                rel:0 // 結束後, 顯示的連結均為同頻道
            },
            events:{ // 列出要偵測的事件
                // 播放器準備好時, 執行 onPlayerReady
                onReady:onPlayerReady,
                // 播放狀態改變時, 執行 onPlayerStateChange
                onStateChange:onPlayerStateChange 
            }
    });   
};

// 當播放器準備好時，設定按鈕事件
function onPlayerReady(event){
    $("#playButton").on("click",function(){
        // 修改<h2> 顯示播放影片的 title
        $("h2").text(player.getVideoData().title);
        // 正式播放
        player.playVideo();
    });   
};

// 一首播完就跳下一首
function onPlayerStateChange(event){
    // 很多時候會觸發 onPlayerStateChange
    // console.log(event);

    // player.getCurrentTime() 取得現在撥放到的秒數
    // 現在秒數為設定的結束秒數時, 執行"跳下一首歌"
    if(Math.floor(player.getCurrentTime())==playTime[currentPlay][1]){
        if(currentPlay<playList.length-1){
            currentPlay++;
            player.loadVideoById({ // 跳下一首歌
                videoId:playList[currentPlay],
                startSeconds:playTime[currentPlay][0],
                endSeconds:playTime[currentPlay][1],
                suggestedQuality:"large"
            });
        }else {  // currentPlay 已經到list的最後一首了, 跳回第一首
            currentPlay=0;
            player.cueVideoById({ // 載入, 但先別撥放
                videoId:playList[currentPlay],
                startSeconds:playTime[currentPlay][0],
                endSeconds:playTime[currentPlay][1],
                suggestedQuality:"large"
            });
        };
    };
    // 由於會多次觸發 onPlayerStateChange, 有時會抓不到標題造成錯誤
    // 因此在這裡限制: 只有歌曲已經開始撥放時, 才抓標題並顯示
    if (event.data == 1){
        $("h2").text(player.getVideoData().title);
    };
}