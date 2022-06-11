$(function(){
    // 紀錄目前到第幾題
    let currentQ = null;
    // 按下按鈕後要做的事
    $("#startButton").on("click",function(){
        // 首次開始
        if(currentQ == null){
            // 從第0題開始
            currentQ = 0;
            // Show Question
            $("#question").text(questions[0].question);
            // 先將選項區清空, 因為若是重玩時會有殘留
            $("#options").empty();
            // 將選項逐個加入, 請google (w3c JavaScript forEach)
            questions[0].answers.forEach(function(element,index,arr){ 
                $("#options").append(
                    `<input name='options' type='radio' value='${index}'>` +
                    `<label>${element[0]}</label><br><br>`
                );
            });
            // 將按鈕上的文字換成Next
            $("#startButton").attr("value","Next");
        }else{
        // 非首次開始
            // 巡訪所有radio元件: 哪一個選項有被選取
            $.each($(":radio"),function(i,val){
                if(val.checked){
                    // 確認是否已走到終點 (A~D)
                    if(isNaN(questions[currentQ].answers[i][1])){
                        // 若是, 就確認是哪個結果
                        let finalResult = questions[currentQ].answers[i][1];
                        // 結果的標題
                        $("#question").text(finalAnswers[finalResult][0]);
                        $("#options").empty();
                        $("#options").append(
                            `${finalAnswers[finalResult][1]}<br><br>`
                        );
                        currentQ = null;
                        $("#startButton").attr("value","重新開始");
                    }else{ 
                    // 正常跳下一題
                        //指定下一題, 注意原始資料是從1開始, 給電腦吃要-1
                        currentQ = questions[currentQ].answers[i][1]-1;
                        //顯示新的題目
                        $("#question").text(questions[currentQ].question);
                        //顯示新的選項
                        $("#options").empty();
                        questions[currentQ].answers.forEach(function(element,index,arr){ 
                            $("#options").append(
                                `<input name='options' type='radio' value='${index}'>` +
                                `<label>${element[0]}</label><br><br>`
                            );
                        });
                    };
                    return false;
                };
            });

        };
    });
});