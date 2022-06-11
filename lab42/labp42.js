
let ArrURL = [
    "https://storage.googleapis.com/www-cw-com-tw/article/202101/article-5ff76e12dff12.jpg",
    "https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000454/img/basic/a0000454_main.jpg", //?20170412195628&q=80&rw=750&rh=536",
    "https://img-global.cpcdn.com/recipes/f1cdeac14d14ced3b0b06fd0ff395869/680x482cq70/%E6%97%A5%E5%BC%8F%E5%92%96%E5%93%A9%E9%A3%AF-%E6%96%B0%E6%89%8B%E6%96%99%E7%90%86-%E9%A3%9F%E8%AD%9C%E6%88%90%E5%93%81%E7%85%A7%E7%89%87.jpg",
    "https://tokyo-kitchen.icook.network/uploads/recipe/cover/337760/6e4136651b2252ac.jpg",
    "https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000370/img/basic/a0000370_main.jpg" //?20201002142956&q=80&rw=750&rh=536"
];
let num = $("#choices li").length;

$(function(){
    $("input").on("click", function () {
        let ind = Math.floor(Math.random()*num);
    //  讓選項不重複出現
        while ($("h1").text() == $("#choices li").eq(ind).text()) {
            ind = Math.floor(Math.random()*num);
        };
        $("h1").text($("#choices li").eq(ind).text());
        $( "#photo" ).attr({
            title: $("#choices li").eq(ind).text(),
            alt: $("#choices li").eq(ind).text(),
            src: ArrURL[ind]
          });
    });
});

