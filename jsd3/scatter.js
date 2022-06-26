//遇到NA就設定為undefined(JS的空值), 要不然就維持原本的字串
const parseNA = string => (string === 'NA' ? undefined : string);

//日期處理
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);

// 資料轉換
function type(d) {
    const date = parseDate(d.release_date);
    return {
        budget: +d.budget, // 在資料前給個 + 即轉為數字
        genre: parseNA(d.genre),  // 處理空值
        genres:JSON.parse(d.genres).map(d=>d.name),
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
// 取預算排行前100的資料
function prepareScatterData(data){
    return data.sort((a,b)=>b.budget-a.budget).filter((d,i)=>i<100);
};

// 轉換數字表示式 (刻度用)
function formatTicks(d){
    return d3.format('~s')(d)
    .replace('M','mil')
    .replace('G','bil')
    .replace('T','tri')
};

// 控制軸標題位置用的函數
function addLabel(axis, label, x, y){
    /* axis 是呼叫者- 哪一個軸*/
    axis.selectAll('.tick:last-of-type text')
            .clone() // copy 一份
            .text(label)
            .attr('x',x).attr('y',y)
            .style('text-anchor','start')
            .style('font-weight','bold')
            .style('fill','#555');
};

function setupCanvas1(data){
    const svg_width = 800;
    const svg_height = 700;
    const chart_margin = {top:120,bottom:40,left:80,right:40};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    // Draw Scatter Base
    const this_svg = d3.select('.scatter-plot-container1')
                        .append('svg')
                        .attr('width', svg_width).attr('height',svg_height)
                        .append('g')
                        .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`);
    
    //Set Scale: 
    const xExtent = d3.extent(data, d=>d.budget);
    const xScale = d3.scaleLinear()
                        .domain(xExtent)
                        .range([0, chart_width]);

    //垂直空間的分配
    const yExtent = d3.extent(data, d=>d.revenue);
    const yScale = d3.scaleLinear()
                    .domain(yExtent) 
                    .range([chart_height,0]);
                    // 營收最小的放最下方，與座標相反
    
    //Draw Scatters
    this_svg.selectAll('.scatter')
                .data(data).enter()
                .append('circle')
                    .attr('class','scatter')
                    .attr('cx',d=>xScale(d.budget))
                    .attr('cy',d=>yScale(d.revenue))
                    .attr('r',4)
                    .style('fill','green')
                    .style('fill-opacity',0.5); 
                        // 降低一點透明度, 讓重疊的看得清楚
    
    // 格線&刻度
    const xAxis = d3.axisBottom(xScale)
                    .ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height) // 刻度線;  負號表示往下長 
                    .tickSizeOuter(0);
    const xAxisDraw = this_svg.append('g')
                                .attr('class','x axis')
                                .attr('transform',`translate(-10,${chart_height+10})`)
                                .call(xAxis)
                                .call(addLabel,'Budget',25,0);
    xAxisDraw.selectAll('text').attr('dy','2em'); 

    const yAxis = d3.axisLeft(yScale)
                    .ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_width)
                    .tickSizeOuter(0);
    const yAxisDraw = this_svg.append('g')
                                .attr('class','y axis')
                                .attr('transform',`translate(-10,10)`)
                                .call(yAxis)
                                .call(addLabel,'Revenue',-30,-30);
    yAxisDraw.selectAll('text').attr('dx','-2em');

    // 寫出 header
    const header = this_svg.append('g')
                            .attr('class','bar-header')
                            .attr('transform',`translate(-30,${-chart_margin.top/2})`)
                            .append('text');
    header.append('tspan').text('Budget vs. Revenue in $US')
                        .style('font-size','1.5em');
    header.append('tspan').text('Top 100 films by budget, 2000-2009')
                        .attr('x',0).attr('y',30)
                        .style('font-size','0.8em').style('fill','red');
};


function setupCanvas2(data) {
    const svg_width = 700;
    const svg_height = 700;
    const chart_margin = { top: 120, bottom: 40, left: 80, right: 40 };
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    // Draw Scatter Base
    const this_svg = d3.select('.scatter-plot-container2')
        .append('svg')
        .attr('width', svg_width).attr('height', svg_height)
        .append('g')
        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    //Set Scale: 
    const xExtent = d3.extent(data, d => d.budget);
    const xScale = d3.scaleLinear()
        .domain(xExtent)
        .range([0, chart_width]);

    //垂直空間的分配
    const yExtent = d3.extent(data, d => d.revenue);
    const yScale = d3.scaleLinear()
        .domain(yExtent)
        .range([chart_height, 0]);
    // 營收最小的放最下方，與座標相反

    //Draw Scatters
    this_svg.selectAll('.scatter2')
        .data(data).enter()
        .append('circle')
        .attr('class', 'scatter2')
        .attr('cx', d => xScale(d.budget))
        .attr('cy', d => yScale(d.revenue))
        .attr('r', 4)
        .style('fill', 'dodgerblue')
        .style('fill-opacity', 0.5);
    // 降低一點透明度, 讓重疊的看得清楚

    // 格線&刻度
    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(formatTicks)
        .tickSizeInner(-chart_height) // 刻度線;  負號表示往下長 
        .tickSizeOuter(0);
    const xAxisDraw = this_svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(-10,${chart_height + 10})`)
        .call(xAxis)
        .call(addLabel, 'Budget', 25, 0);
    xAxisDraw.selectAll('text').attr('dy', '2em');

    const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(formatTicks)
        .tickSizeInner(-chart_width)
        .tickSizeOuter(0);
    const yAxisDraw = this_svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(-10,10)`)
        .call(yAxis)
        .call(addLabel, 'Revenue', -30, -30);
    yAxisDraw.selectAll('text').attr('dx', '-2em');


    // 寫出 header
    const header = this_svg.append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(-60,${-chart_margin.top/2})`)
        .append('text');
    header.append('tspan').text('Budget vs. Revenue in $US')
        .style('font-size', '2em');
    header.append('tspan').text('Top 100 films by budget, 2000-2009')
        .attr('x', 0).attr('y', 30)
        .style('font-size', '0.8em').style('fill', 'blue');

    // lab61 Adding Main
    let selectedId;
    function mouseoverListItem(){
        selectedId = d3.select(this).data()[0].id;
        d3.selectAll('.scatter2')
            .filter(d=>d.id === selectedId)
            .transition().attr('r',7).style('fill','red');
    };
    function mouseoutListItem(){
        selectedId = d3.select(this).data()[0].id;
        d3.selectAll('.scatter2')
            .filter(d=>d.id === selectedId)
            .transition().attr('r',4).style('fill','green');
    };


    function updateSelected(data) {
        d3.select('.selected-body')
            .selectAll('.selected-element')
            //右邊清單選擇項目，左邊對應點放大
            .on('mouseover',mouseoverListItem)
            .on('mouseout',mouseoutListItem)
                .data(data, d => d.id)
                .join(
                    enter => {
                        enter.append('p')
                            .attr('class', 'selected-element')
                            .html(d => 
                                `<span class="selected-title">${d.title}</span>,
                                ${d.release_year}<br>
                                budget: ${formatTicks(d.budget)} |
                                revenue: ${formatTicks(d.revenue)}`
                            );
                    },
                    update => {
                        update
                    },
                    exit => {
                        exit.remove();
                    }
                );
    };

    function highlightSelected(data){
        const selectedIDs = data.map(d=>d.id);
        d3.selectAll('.scatter2')
                .filter(d=>selectedIDs.includes(d.id))
                .style('fill','green');
        d3.selectAll('.scatter2')
                .filter(d=>!selectedIDs.includes(d.id))
                .style('fill','dodgerblue');
    };

    function brushed(e) {
        // debugger;
        if (e.selection) {
            //取得選取的矩形座標
            const [[x0, y0], [x1, y1]] = e.selection;
            //判斷有哪些資料落在選取範圍中
            const selected = data.filter(
                d =>
                    x0 <= xScale(d.budget) && xScale(d.budget) < x1 &&
                    y0 <= yScale(d.revenue) && yScale(d.revenue) < y1
            );
            updateSelected(selected);
            highlightSelected(selected);
        }else{
            d3.select('.selected-body').html('');
            highlightSelected([]);
        };
    };
    //Add brush
    const brush = d3.brush()
        .extent([[-20, -20], [svg_width-80, svg_height-80]])
        // .on('brush', brushed);
        .on('brush end', brushed);
    this_svg.append('g').attr('class', 'brush').call(brush);

    d3.select('.selected-container')
        .style('width', `350px`)
        .style('height', `${svg_height}px`);

};


// 將 Main 區塊 跟 Load 區塊結合
d3.csv('jsd3/movies.csv',type).then(
    movies => {
        const moviesClean = filterData(movies); 
        const scatterData = prepareScatterData(moviesClean);
        console.log(scatterData);
        setupCanvas1(scatterData);
        setupCanvas2(scatterData);
    }
);