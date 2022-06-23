let topic = [
    "停課-尚未開學",
    "停課-國定假日",
    "環境準備",
    "隨機性",
    "重複性",
    "條件判斷"
];

let dn = 0;

let startDate = new Date();

function setMonthAndDay(startMonth,startDay){
// 一次設定好月份跟日期
    startDate.setMonth(startMonth-1,startDay); // 設定的月份要減一才符合JS的function
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
};

function changeDate(){
    let d = new Date(start.value);
    setMonthAndDay(d.getMonth()+1,d.getDate());
    $("#course").empty();
    dn++;
    main();
};
