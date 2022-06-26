//空值處理
const parseNA = string => (string === 'NA' ? undefined : string);
//日期處理
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);
// 將數字資料轉為數字 / 處理空值 / 多欄資料處理
function type(d) {
    const date = parseDate(d.release_date);
    return {
        budget: +d.budget, // 在資料前給個 + 即轉為數字
        genre: parseNA(d.genre),  // 處理空值
        // 處理多欄資料
        genres:JSON.parse(d.genres).map(d=>d.name),
        // JSON.parse(): 將JSON格式字串 轉成 JSON
        // .map(d=>d.name): 將JSON內 標籤為name的值取出來
        homepage: parseNA(d.homepage),
        id: +d.id, // 轉為數字
        imdb_id: parseNA(d.imdb_id),
        original_language: parseNA(d.original_language),
        overview: parseNA(d.overview),
        popularity: +d.popularity, // 轉為數字
        poster_path: parseNA(d.poster_path),
        production_countries:JSON.parse(d.production_countries).map(d=>d.name),
        release_date: date,
        release_year: date.getFullYear(), // 增加資料: 取出年份
        revenue: +d.revenue, // 轉為數字
        runtime: +d.runtime, // 轉為數字
        tagline: parseNA(d.tagline),
        title: parseNA(d.title),
        vote_average: +d.vote_average, // 轉為數字
        vote_count: +d.vote_count // 轉為數字
    };
};

//資料篩選
function filterData(data) {
    return data.filter( // 設定條件: 滿足條件才回傳
        d => {  
            return (
                d.release_year > 1999 && d.release_year < 2010 &&
                d.revenue > 0 &&
                d.budget > 0 &&
                d.genre &&  // d.genre 要有值
                d.title     // d.title 要有值
            );
        }
    );
};

// 資料聚合
function prepareBarChartData(data){
    const dataMap = d3.rollup( 
        data, 
        v => d3.sum(v, detail => detail.revenue),
        d => d.genre //依電影分類groupby
    );
    const dataArray = Array.from(dataMap, d=>({genre:d[0], revenue:d[1]}));
    return dataArray;
};

// 轉換數字表示式 (刻度用)
function formatTicks(d){
    return d3.format('~s')(d)
    .replace('M','mil')
    .replace('G','bil')
    .replace('T','tri')
};

function setupCanvas1(data){
    // set svg
    const svg_width = 800;
    const svg_height = 500;
    const chart_margin = {top:100,bottom:40,left:80,right:40};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    // 在網頁中插入 svg元件 跟 g元件
    const this_svg = d3.select('.bar-chart-container1')
                        .append('svg')
                        .attr('width', svg_width).attr('height',svg_height)
                        .append('g')
                        .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`);
                        //                 as f-string in python
    
    //Set Scale: 
    const xMax = d3.max(data, d=>d.revenue);
    const xScale_v3 = d3.scaleLinear([0,xMax],[0, chart_width]);
    const yScale = d3.scaleBand()
                    .domain(data.map(d=>d.genre))               
                    .rangeRound([0, chart_height]) 
                    .paddingInner(0.25);  
    
    //設定 bars 並畫出 bars
    const bars = this_svg.selectAll('.bar')
                        .data(data)
                        .enter()  // 畫出來
                        .append('rect') // 加入 bar
                                .attr('class','bar')
                                .attr('x',0)
                                .attr('y',d=>yScale(d.genre))
                                .attr('width',d=>xScale_v3(d.revenue))
                                .attr('height',yScale.bandwidth())
                                .style('fill','green');
    // 寫出 header
    const header = this_svg.append('g')
                            .attr('class','bar-header')
                            .attr('transform',`translate(-50,${-chart_margin.top/2})`)
                            .append('text');
    header.append('tspan').text('Total revenue by genre in $US')
                        .style('font-size','1.5em');
    header.append('tspan').text('Years:2000-2009')
                        .attr('x',0).attr('y',30)
                        .style('font-size','0.8em').style('fill','red');
    // 設定格線
    const xAxis = d3.axisTop(xScale_v3)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height)
                    .tickSizeOuter(0)
    // 畫出格線
    const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickSize(0); // 設水平的格線
    const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis)
    yAxisDraw.selectAll('text').attr('dx','-0.6em');  // 讓文字跟圖分開一點
};

function cutText(string){
    return string.length<35 ? string : string.substring(0,35)+"...";
};

function setupCanvas2(data, moviesClean) {
    //一開始預設指標是revenue
    let metric = 'revenue';
    // 按下按鍵, 選用不同指標(metric)
    function click() {
        metric = this.dataset.name;
        const thisData = chooseData(metric, moviesClean);
        update(thisData);
    };
    d3.selectAll('button').on('click', click);

    function update(data) { // Main Part of this js
        console.log(data);
        xMax = d3.max(data, d => d[metric]);
        xScale_v3 = d3.scaleLinear([0, xMax], [0, chart_width]);
        yScale = d3.scaleBand().domain(data.map(d => cutText(d.title)))
            .rangeRound([0, chart_height])
            .paddingInner(0.25);

        //設立轉換時的延遲時間 
        const defaultDelay = 1000;
        const transitionDelay = d3.transition().duration(defaultDelay);

        //Update axis
        xAxisDraw.transition(transitionDelay).call(xAxis.scale(xScale_v3));
        yAxisDraw.transition(transitionDelay).call(yAxis.scale(yScale));
        //Update Header
        header.select('tspan').text(
            `Top 15 ${metric} movies ${metric === 'popularity' ? '' : 'in $US'}`
        );

        //Update Bars
        bars.selectAll('.bar').data(data, d => d.title)
            .join(
                enter => {
                    enter.append('rect')
                            .attr('class', 'bar')
                            .attr('x', 0).attr('y', d => yScale(cutText(d.title)))
                            .attr('height', yScale.bandwidth())
                            .style('fill', 'lightcyan')
                            .transition(transitionDelay)
                                .delay((d, i) => i * 20)
                                .attr('width', d => xScale_v3(d[metric]))
                                .style('fill', 'dodgerblue');
                },
                update => {
                    update.transition(transitionDelay)
                            .delay((d, i) => i * 20)
                            .attr('y', d => yScale(cutText(d.title)))
                            .attr('width', d => xScale_v3(d[metric]))
                },
                exit => {
                    exit.transition().duration(defaultDelay / 2)
                        .style('fill-opacity', 0)
                        .remove()
                }
            );
        
        //interactive 新增監聽
        d3.selectAll('.bar')
            .on('mouseover',mouseover)
            .on('mousemove',mousemove)
            .on('mouseout',mouseout);
    };

    // set svg
    const svg_width = 700;
    const svg_height = 500;
    const chart_margin = { top: 100, bottom: 40, left: 250, right: 40 };
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    const this_svg = d3.select('.bar-chart-container2')
        .append('svg')
        .attr('width', svg_width).attr('height', svg_height)
        .append('g')
        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    //Set Scale:  
    let xMax = d3.max(data, d => d.revenue);
    let xScale_v3 = d3.scaleLinear([0, xMax], [0, chart_width]);

    //垂直空間的分配- 平均分布給Top 15
    let yScale = d3.scaleBand()
        .domain(data.map(d => cutText(d.title))) // 電影種類                
        .rangeRound([0, chart_height]) // 塞圖表的空間, 平均分配給各bar
        .paddingInner(0.25);  // 圖裡各bar的間隔

    //設定 bars 並畫出 bars
    const bars = this_svg.append('g').attr('class', 'bars');

    // 寫出 header
    let header = this_svg.append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(-200,${-chart_margin.top / 2})`)
        .append('text');
    header.append('tspan').text('Top 15 XXX movies')
        .style('font-size', '1.5em');
    header.append('tspan').text('Years:2000-2009')
        .attr('x', 0).attr('y', 30)
        .style('font-size', '0.8em').style('fill', 'blue');

    // 設定格線
    //tickSizeInner : the length of the tick lines
    //tickSizeOuter : the length of the square ends of the domain path
    let xAxis = d3.axisTop(xScale_v3).ticks(5).tickFormat(formatTicks)
        .tickSizeInner(-chart_height)
        .tickSizeOuter(0);
    let yAxis = d3.axisLeft(yScale).tickSize(0);
    // 畫出格線
    let xAxisDraw = this_svg.append('g').attr('class', 'x axis');
    let yAxisDraw = this_svg.append('g').attr('class', 'y axis');
    yAxisDraw.selectAll('text').attr('dx', '-0.6em');

    update(data);


    // NEW in lab51
    //interactive 互動處理
    const tip = d3.select('.tooltip');
    function mouseover(e){
        // get data
        const thisBarData = d3.select(this).data()[0];
        const bodyData = [
            ['Budget', formatTicks(thisBarData.budget)],
            ['Revenue', formatTicks(thisBarData.revenue)],
            ['Profit', formatTicks(thisBarData.revenue - thisBarData.budget)],
            ['TMDB Popularity', Math.round(thisBarData.popularity)],
            ['IMDB Rating', thisBarData.vote_average],
            ['Genres', thisBarData.genres.join(', ')]
        ];
        tip.style('left',(e.clientX+15)+'px')
            .style('top',e.clientY+'px')
            .transition()
            .style('opacity',0.98);
            // .html("Hello");
        
        tip.select('.hh3').html(
            `${thisBarData.title}, ${thisBarData.release_year}`
            );
        tip.select('h4').html(
            `${thisBarData.tagline}, ${thisBarData.runtime} min.`
            );
        d3.select('.tip-body').selectAll('p').data(bodyData)
                .join('p')
                    .attr('class', 'tip-info')
                    .html(d=>`${d[0]} : ${d[1]}`);
    };
    function mousemove(e){
        tip.style('left',(e.clientX+15)+'px')
            .style('top',e.clientY+'px')
            .style('opacity',0.98);
            // .html("Hello")
    };
    function mouseout(e){
        tip.transition().style('opacity',0)
    };
    //interactive 新增監聽
    d3.selectAll('.bar')
            .on('mouseover',mouseover)
            .on('mousemove',mousemove)
            .on('mouseout',mouseout);

};

function chooseData(metric, moviesClean) {
    const topData = moviesClean.sort((a, b) => b[metric] - a[metric]).filter((d, i) => i < 15);
    return topData;
};


//Main Part
d3.csv('jsd3/movies.csv',type).then(
    movies => {
        const moviesClean = filterData(movies); 
        const barChartData = prepareBarChartData(moviesClean).sort( 
            (a,b)=> {return d3.descending(a.revenue, b.revenue)}
        ); 
        setupCanvas1(barChartData);

        const revenueData = chooseData("revenue", moviesClean);
        setupCanvas2(revenueData, moviesClean);
    }
);