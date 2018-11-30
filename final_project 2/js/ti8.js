function info(){



    document.getElementById("right").innerHTML='';

    var div = document.createElement("div");
    div.id = "info";
    document.getElementById("right").appendChild(div);

    var h3 = document.createElement("H2");
    var t3 = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'+"Ti Daily Price Track");      // Create a text node
    h3.appendChild(t3);
    document.getElementById("info").appendChild(h3);

    var h4 = document.createElement("H2");
    var t4 = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'+"Ti8 Price Pool");// Create a text node
    h3.appendChild(t4);
    document.getElementById("info").appendChild(h4);

    console.log(d3)
    const computed = getComputedStyle(div)
    const Width = parseInt(computed.width)
    const Height = parseInt(computed.height)

    console.log(Width, Height)



    const div_stack = d3.select('div#info').append('div').attr('id','stack')
    div_stack.style({
        width: 49+'%',
        height: Height-50 + 'px',
        position: 'relative',
        left: '10px',
        top: '-18px',
        float:'left',
        border: '1px solid red'
    })

    const div_part = d3.select('div#info').append('div').style({
        width: 49+'%',
        height: Height-50 + 'px',
        position: 'relative',
        left: 50+'%',
        top: '-18px',
        border: '1px solid green'
    })

    const w = Width / 2-5
    const h = Height-50

    const stack_svg = div_stack.append('svg').attr({
        width: w,
        height: h
    })

    var padding = [ 20, 10, 30, 100 ];

    var xScale = d3.scale.linear()
        .range([ padding[3], w - padding[1]]);

    var yScale = d3.scale.linear()
        .range([ padding[0], h - padding[2] ]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(15);

    var area = d3.svg.area()
        .x(function(d) {
            return xScale(d.x);
        })
        .y0(() => {
            return h - padding[2]
        })
        .y1(function(d) {
            return yScale(d.y);  //Updated
        });
    //var color = d3.scale.category10();
    d3.csv('data/dailyPriceTrack.csv', (err, data) => {
        if (err) throw err
        console.log(data)
        let xTicks = []
        let dataset = [{
            name: '2018',
            values: []
        }, {
            name: '2017',
            values: []
        }, {
            name: '2016',
            values: []
        }, {
            name: '2015',
            values: []
        }, {
            name: '2014',
            values: []
        }]
        data.forEach((d) => {
            xTicks.push(+d.Day)
            dataset[0].values.push({
                x: +d.Day,
                y: +d['2018']
            })
            dataset[1].values.push({
                x: +d.Day,
                y: +d['2017']
            })
            dataset[2].values.push({
                x: +d.Day,
                y: +d['2016']
            })
            dataset[3].values.push({
                x: +d.Day,
                y: +d['2015']
            })
            dataset[4].values.push({
                x: +d.Day,
                y: +d['2014']
            })
        })
        let max = 0
        dataset.forEach((d) => {
            d.values.forEach((dd) => {
                if (dd.y > max) {
                    max = dd.y
                }
            })
        })
        yScale.domain([max, 0])
        xScale.domain(d3.extent(xTicks))
        console.log(xTicks)
        let pathG = stack_svg.append('g')
        let tip = stack_svg.append('g')
            .attr('opacity', 0)
            .attr('transform', () => {
                return `translate(${padding[3] + 10}, ${30})`
            })
        tip.append('text').attr('class', 'day')
        tip.append('text').attr('class', 'y_2018').attr('dy', 15).attr('fill',"#1b9e77")
        tip.append('text').attr('class', 'y_2017').attr('dy', 30).attr('fill',"#fdcdac")
        tip.append('text').attr('class', 'y_2016').attr('dy', 45).attr('fill',"#7570b3")
        tip.append('text').attr('class', 'y_2015').attr('dy', 60).attr('fill',"#fb8072")
        tip.append('text').attr('class', 'y_2014').attr('dy', 75).attr('fill',"#80b1d3")


        pathG.selectAll('path.area')
            .data(dataset).enter().append('path')
            .attr('class', 'area')
            .attr('id','pathArea')
            .attr('d', (d) => {
                return area(d.values)
            })

            .attr('fill', (d, i) => {
                switch (i) {
                    case 0:
                        return '#1b9e77'
                        break;
                    case 1:
                        return '#fdcdac'
                        break;
                    case 2:
                        return '#7570b3'
                        break;
                    case 3:
                        return '#fb8072'
                        break;
                    case 4:
                        return '#80b1d3'
                        break;

                }
            }).attr('opacity', (d, i)=>{
                if (i===3 || i===4)
                {
                    return i;
                }
                return 1.0-0.1*i;
        })

            .on('onclick',(d)=>{
                stack_svg.append("rect")
                    .attr('id','line1')
                    .attr("x",d3.event.offsetX)
                    .attr("y",10)
                    .attr("width", 2)
                    .attr("height", 550)
                    .style("stroke", "none")
                    .style("fill", "#4355cd");
            })
            .on('mousemove', (d) => {
                d3.select('#line').remove();
                stack_svg.append("rect")
                    .attr('id','line')
                    .attr("x",d3.event.offsetX)
                    .attr("y",10)
                    .attr("width", 2)
                    .attr("height", 550)
                    .style("stroke", "none")
                    .style("fill", "#0c3863");

                let day = Math.round(xScale.invert(d3.event.offsetX))
                tip.select('.day').text(`Day: ${day}`)

                tip.select('.y_2018').text(`2018: $${dataset[0].values[day].y}`)
                tip.select('.y_2017').text(`2017: $${dataset[1].values[day].y}`)
                tip.select('.y_2016').text(`2016: $${dataset[2].values[day].y}`)
                tip.select('.y_2015').text(`2015: $${dataset[3].values[day].y}`)
                tip.select('.y_2014').text(`2014: $${dataset[4].values[day].y}`)

                tip.attr('opacity', 1)
            })
            .on('mouseout',(d)=>{
                d3.select('#line').remove();
            })


        stack_svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h - padding[2]) + ")")
            .call(xAxis);

        stack_svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding[3] + ",0)")
            .call(yAxis);
    })


    // const part_svg = div_part.append('svg').attr({
    //     width: w,
    //     height: h
    // })
    var partition = d3.layout.treemap()
        .size([w, h])
        .value(function(d) { return d.Prize; });

    d3.csv('data/TI8_Prize_Pool.csv', (err, data) => {
        console.log(data)
        data = d3.shuffle(data)
        const root = {}
        data.forEach((d) => {
            d.Prize = +d.Prize
        })
        root.children = data
        console.log(partition(root))
        let items = div_part.selectAll('div.item_treemap')
            .data(partition(root)).enter()
            .append('div').classed('item_treemap', 'true')
            .style({
                position: 'absolute',
                overflow: 'hidden',
                width: (d) => {
                    return d.dx - 4 + 'px'
                },
                height: (d) => {
                    return d.dy - 4 + 'px'
                },
                left: (d) => {
                    return d.x + 2 + 'px'
                },
                top: (d) => {
                    return d.y + 2 + 'px'
                },
                'line-height': (d) => {
                    return d.dy - 4 + 'px'
                },
                'text-align': 'center',
                border: '1px solid #ccc'
            })
            .attr('title', (d) => {
                if (d.depth !==0) {
                    return d.Team  + '  ' + '$' + d.Prize
                }
            })
        items.on('mouseover', function(d) {
            d3.select(this).style({
                border: '2px solid #4682B4'
            })
        })
        items.on('mouseout', function(d) {
            d3.select(this).style({
                border: '1px solid #ccc'
            })
        })
        items.append('span').html((d) => {
            if (d.depth !==0) {
                return d.Team
            }
        })
    })
}