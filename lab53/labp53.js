$(function(){
    main();

    let start = document.getElementById("start");
    start.onchange = changeDate;
});

function main(){
    $("#course").append("<tr><th>場次</th><th>時間</th><th>主題</th></tr>");
    let topicCount = topic.length;
    // JS Date()是以millisecond紀錄, 故先設定一天的毫秒數
    let msPerDay = 1000*60*60*24;
    for(let x=0;x<topicCount;x++){
        let hostDay = new Date(startDate.getTime()+7*x*msPerDay);
        let atd = '<td>';
        if (topic[x].includes("停課") == true){
            atd = `<td class="td1">`;
        };
        let atr = `<tr class="tr2">`;
        if (x%2 == 0) {
            atr =  `<tr class="tr1">`;
        };
        $("#course").append(
            atr +
            `<td>${x+1}</td>` + // 陣列從0開始,場次從1開始
            // `<td>${startDate+7*x}</td>` + // 會有錯誤(型態不同)
            // `<td>${hostDay}</td>` +
            //
            // `<td>${hostDay.toLocaleDateString()}</td>` +
            // `<td>${hostDay.toLocaleDateString().slice(5)}</td>` +
            // `<td>${hostDay.toDateString().slice(4,-5)}</td>` +
            `<td>${hostDay.getMonth()+1}月${hostDay.getDate()}日</td>` +
            atd +`${topic[x]}</td>` +
            `</tr>`);
    };
}