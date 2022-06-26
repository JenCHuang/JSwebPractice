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
        genres: JSON.parse(d.genres).map(d => d.name),
        homepage: parseNA(d.homepage),
        id: +d.id, // 轉為數字
        imdb_id: parseNA(d.imdb_id),
        original_language: parseNA(d.original_language),
        overview: parseNA(d.overview),
        popularity: +d.popularity, // 轉為數字
        poster_path: parseNA(d.poster_path),
        production_countries: JSON.parse(d.production_countries).map(d => d.name),
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

// 資料
function prepareLineChartData(data) {
    //取得發行年份
    const groupByYear = d => d.release_year;

    //只取出revenue加總
    const sumOfRevenue = values => d3.sum(values, d => d.revenue);
    //依年份加總revenue
    const sumOfRevenueByYear = d3.rollup(data, sumOfRevenue, groupByYear);

    //只取出budget加總
    const sumOfBudget = values => d3.sum(values, d => d.budget);
    //依年份加總budget
    const sumOfBudgetByYear = d3.rollup(data, sumOfBudget, groupByYear);

    //放進array並排序
    const revenueArray = Array.from(sumOfRevenueByYear).sort((a, b) => a[0] - b[0]);
    const budgetArray = Array.from(sumOfBudgetByYear).sort((a, b) => a[0] - b[0]);

    //用年份來產生日期時間格式的資料，作為後續繪圖的X軸
    //year string --> date object
    const parseYear = d3.timeParse('%Y');
    const dates = revenueArray.map(d => parseYear(d[0]));

    //找出最大值 (為了畫折線圖時, 不要超過頂端)
    // (把各年份的revenue與各年份的budget都先放在一起, 再抓最大值)
    const allDataArray = revenueArray.map(d => d[1]).concat(budgetArray.map(d => d[1]));
    const yMax = d3.max(allDataArray);
    
    // Return final data
    const lineData = {
        series: [
            {
                name: 'Revenue',
                color: 'dodgerblue',
                values: revenueArray.map(d => ({ date: parseYear(d[0]), value: d[1] }))
            },
            {
                name: 'Budget',
                color: 'darkorange',
                values: budgetArray.map(d => ({ date: parseYear(d[0]), value: d[1] }))
            }
        ],
        dates: dates,
        yMax: yMax
    };
    return lineData;
};

// 轉換數字表示式 (刻度用)
function formatTicks(d) {
    return d3.format('~s')(d)
        .replace('M', 'mil')
        .replace('G', 'bil')
        .replace('T', 'tri')
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
            .style('font-size', '1.2em')
            .style('fill','#555');
};

function setupCanvas1(data) {
    const svg_width = 850;
    const svg_height = 700;
    const chart_margin = { top: 100, bottom: 40, left: 80, right: 60 };
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    // Draw Scatter Base
    const this_svg = d3.select('.line-chart-container1')
        .append('svg')
        .attr('width', svg_width).attr('height', svg_height)
        .append('g')
        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    //Set Scale: 
    //用時間來做X軸
    const xExtent = d3.extent(data.dates);
    const xScale = d3.scaleTime()  // 改為對時間分配
        .domain(xExtent)
        .range([0, chart_width-40]);

    //垂直空間(Y軸)的分配
    const yScale = d3.scaleLinear()
        .domain([0,data.yMax])
        .range([chart_height, 0]);

    //line generator
    const lineGen = d3.line()
                .x(d=>xScale(d.date))
                .y(d=>yScale(d.value));

    //Draw Line
    const chartGroup = this_svg.append('g').attr('class','line-chart');
    chartGroup.selectAll('.line-series')
        .data(data.series).enter()
        .append('path')
            .attr('class',d=>`line-series ${d.name.toLowerCase()}`)
            .attr('d',d=>lineGen(d.values))
            .style('fill','none')
            .style('stroke',d=>d.color);

    // 格線&刻度
    //畫 X axis
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    this_svg.append('g')
            .attr('class','x axis')
            .attr('transform',`translate(0,${chart_height})`)
            .call(xAxis)
            .call(addLabel,'Year',-320,30);
    //畫 Y axis
    const yAxis = d3.axisLeft(yScale)
                .ticks(5).tickFormat(formatTicks)
                .tickSizeInner(-chart_width+40)
                .tickSizeOuter(0);
    this_svg.append('g')
                .attr('class','y axis')
                .call(yAxis)
                .call(addLabel,'$US',-60,200);
                

    // 標上 Label
    //放在最後一個點的旁邊(x+5,y不變)
    chartGroup.append('g')
                .attr('class','series-labels')
                .selectAll('.series-label')
                .data(data.series).enter()
                .append('text')
                    // 算出最後一個點的座標, 再調整位置
                    .attr('x',d=>xScale(d.values[d.values.length-1].date)+10)
                    .attr('y',d=>yScale(d.values[d.values.length-1].value))
                    .text(d=>d.name)
                        .style('dominant-baseline','central')
                        .style('font-size','0.8em').style('font-weight','bold')
                        .style('fill',d=>d.color);

    // 寫出 header
    const header = this_svg.append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(0,${-chart_margin.top / 2})`)
        .style('font-size', '1.5em')
        .append('text');
    header.append('tspan').text('Budget and Revenue over time in $US')
    header.append('tspan').text('Films w/ budget and revenue, 2000-2009')
        .attr('x', 0).attr('y', 35)
        .style('font-size', '0.7em').style('fill', 'red');
};


function setupCanvas2(data) {
    const svg_width = 800;
    const svg_height = 700;
    const chart_margin = { top: 100, bottom: 40, left: 80, right: 60 };
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    // Draw Base
    const this_svg = d3.select('.line-chart-container2')
        .append('svg')
        .attr('width', svg_width).attr('height', svg_height)
        .attr('class','eventregion')
        .append('g')
        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    //Set Scale: 
    //用時間來做X軸
    const xExtent = d3.extent(data.dates);
    const xScale = d3.scaleTime()  // 改為對時間分配
        .domain(xExtent)
        .range([0, chart_width-40]);

    //垂直空間(Y軸)的分配
    const yScale = d3.scaleLinear()
        .domain([0,data.yMax])
        .range([chart_height, 0]);

    //line generator
    const lineGen = d3.line()
                .x(d=>xScale(d.date))
                .y(d=>yScale(d.value));

    //Draw Line
    const chartGroup = this_svg.append('g').attr('class','line-chart');
    chartGroup.selectAll('.line-series')
        .data(data.series).enter()
        .append('path')
            .attr('class',d=>`line-series ${d.name.toLowerCase()}`)
            .attr('d',d=>lineGen(d.values))
            .style('fill','none')
            .style('stroke',d=>d.color);
    
    //Draw Scatters
    // const dotGroup = this_svg.append('g').attr('class','scatter');
    chartGroup.selectAll('.dots1')
            .data(data.series[0].values).enter()
            .append('circle')
            .attr('class', `dots1`)
            .attr('id', d=>`dr${Math.floor(xScale(d.date))}`)
            .attr('cx', d=>xScale(d.date))
            .attr('cy', d=>yScale(d.value))
            .attr('r', 5)
            .style('fill','dodgerblue')
            .style('fill-opacity', 0);
    chartGroup.selectAll('.dots2')
            .data(data.series[1].values).enter()
            .append('circle')
            .attr('class', `dots2`)
            .attr('id', d=>`db${Math.floor(xScale(d.date))}`)
            .attr('cx', d=>xScale(d.date))
            .attr('cy', d=>yScale(d.value))
            .attr('r', 5)
            .style('fill','darkorange')
            .style('fill-opacity', 0);

    // 格線&刻度
    //畫 X axis
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    this_svg.append('g')
            .attr('class','x axis')
            .attr('transform',`translate(0,${chart_height})`)
            .call(xAxis)
            .call(addLabel,'Year',-320,30);
    //畫 Y axis
    const yAxis = d3.axisLeft(yScale)
                .ticks(5).tickFormat(formatTicks)
                .tickSizeInner(-chart_width+40)
                .tickSizeOuter(0);
    this_svg.append('g')
                .attr('class','y axis')
                .call(yAxis)
                .call(addLabel,'$US',-60,200);

    // 標上 Label
    //放在最後一個點的旁邊(x+5,y不變)
    chartGroup.append('g')
                .attr('class','series-labels')
                .selectAll('.series-label')
                .data(data.series).enter()
                .append('text')
                    // 算出最後一個點的座標, 再調整位置
                    .attr('x',d=>xScale(d.values[d.values.length-1].date)+10)
                    .attr('y',d=>yScale(d.values[d.values.length-1].value))
                    .text(d=>d.name)
                        .style('dominant-baseline','central')
                        .style('font-size','0.8em').style('font-weight','bold')
                        .style('fill',d=>d.color);

    // 寫出 header
    const header = this_svg.append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(0,${-chart_margin.top / 2})`)
        .style('font-size', '1.5em')
        .append('text');
    header.append('tspan').text('Budget and Revenue over time in $US');
    header.append('tspan').text('Films w/ budget and revenue, 2000-2009')
        .attr('x', 0).attr('y', 30)
        .style('font-size', '0.7em').style('fill', 'blue');
    
    //interactive 互動處理
    // 希望做到滑鼠靠近某年分時, 該年分的資料點亮起(兩個點), 並於兩個點旁顯示該金額
    // 此區塊沒有成功
    const tip1 = d3.select('.tooltip1');
    const tip2 = d3.select('.tooltip2');

    function highlightDots(yearid){
        const selectedX = Math.floor(xScale(yearid));
        d3.select(`#dr${selectedX}`).style('fill-opacity', 0.5);
        d3.select(`#db${selectedX}`).style('fill-opacity', 0.5);

        let i = yearid.getYear() - 100;
        let datar = data.series[0].values[i].value;
        let y1 = yScale(datar) + $('.eventregion').offset().top + chart_margin.top - document.documentElement.scrollTop;
        let datab = data.series[1].values[i].value;
        let y2 = yScale(datab) + $('.eventregion').offset().top + chart_margin.top - document.documentElement.scrollTop;
        let x0 = xScale(yearid) + $('.eventregion').offset().left + chart_margin.left;
        tip1.style('left',x0+'px')
            .style('top',y1+'px')
            .style('opacity',0.98)
            .style('font-size', '0.7em')
            .style('color', 'dodgerblue')
            .html(datar);
        tip2.style('left',x0+'px')
            .style('top',y2+'px')
            .style('opacity',0.98)
            .style('font-size', '0.7em')
            .style('color', 'darkorange')
            .html(datab);
    };

    function mousemove(e){
        d3.selectAll('.dots1').style('fill-opacity', 0);
        d3.selectAll('.dots2').style('fill-opacity', 0);
        
        let X = e.clientX - $('.eventregion').offset().left - chart_margin.left ;
        const yearid = data.dates.find(d => Math.abs(xScale(d)-X) <= 20 );
        highlightDots(yearid);
    };
    function mouseout(e){
        tip1.transition().style('opacity',0);
        tip2.transition().style('opacity',0);
        d3.selectAll('.dots1').style('fill-opacity', 0);
        d3.selectAll('.dots2').style('fill-opacity', 0);
    };
    // //interactive 新增監聽
    d3.selectAll('.eventregion')
            .on('mousemove',mousemove)
            .on('mouseout',mouseout);
    
    $(window).on('wheel', function(){
        tip1.transition().style('opacity',0);
        tip2.transition().style('opacity',0);
    });
};

// Main 區塊 + Load 區塊
d3.csv('jsd3/movies.csv', type).then(
    movies => {
        const moviesClean = filterData(movies);
        const lineChartData = prepareLineChartData(moviesClean);
        setupCanvas1(lineChartData);
        setupCanvas2(lineChartData);
    }
);