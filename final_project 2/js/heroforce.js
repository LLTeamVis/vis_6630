

function f(file) {


    document.getElementById("right").innerHTML='';

    var div = document.createElement("div");
    var div2 = document.createElement("div");
    div.id = "section";
    div2.id = 'graph';
    document.getElementById("right").appendChild(div);
    document.getElementById("right").appendChild(div2);

    changeHeroPage();

    var h3 = document.createElement("H3");
    var t3 = document.createTextNode("Hero");      // Create a text node
    h3.appendChild(t3);
    var h4 = document.createElement("H4");
    var t4 = document.createTextNode("Type");      // Create a text node
    h3.appendChild(t4);
    var h5 = document.createElement("H5");
    var t5 = document.createTextNode("");      // Create a text node
    h3.appendChild(t5);

    document.getElementById("graph").appendChild(h3);
    document.getElementById("graph").appendChild(h4);
    document.getElementById("graph").appendChild(h5);

    var sub_div = document.createElement("div");
    sub_div.id="sub_div";
    document.getElementById("graph").appendChild(sub_div);

    var h33 = document.createElement("H3");
    var t33 = document.createTextNode("Ti8 performance");
    h33.appendChild(t33);
    document.getElementById("graph").appendChild(h33);

    var sub_div2 = document.createElement("div");
    sub_div2.id="sub_div2";
    document.getElementById("graph").appendChild(sub_div2);


// some colour variables
    var tcBlack = "#130C0E";

// rest of vars
    var w = 680,
        h = 580,
        maxNodeSize = 60,
        x_browser = 20,
        y_browser = 25,
        root;

    var vis;
    var force = d3.layout.force();

    vis = d3.select("#section").append("svg").attr("width", w).attr("height", h);

    d3.json(file, function (json) {

        root = json;
        root.fixed = true;
        root.x = w / 2;
        root.y = h /2;


        // Build the path
        var defs = vis.insert("svg:defs")
            .data(["end"]);


        defs.enter().append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        update();
    });


    /**
     *
     */
    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force.nodes(nodes)
            .links(links)
            .gravity(0.05)
            .charge(-1500)
            .linkDistance(80)
            .friction(0.5)
            .linkStrength(function (l, i) {
                return 1;
            })
            .size([w, h])
            .on("tick", tick)
            .start();

        var path = vis.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });

        path.enter().insert("svg:path")
            .attr("class", "link")
            // .attr("marker-end", "url(#end)")
            .style("stroke", function (d) {
                if (d.target.name === "Agility") {
                    return "green"
                }
                else {
                    return d.target.name === "Strength" ? "AF2830" : "#4d79ff"

                }
            });


        // Exit any old paths.
        path.exit().remove();


        // Update the nodes…
        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id;
            });


        // Enter any new nodes.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", click)
            .call(force.drag);

        // Append a circle


        // Append images
        var images = nodeEnter.append("svg:image")
            .attr("xlink:href", function (d) {
                return d.img;
            })
            .attr("x", function (d) {
                return -25;
            })
            .attr("y", function (d) {
                return -25;
            })
            .attr("height", 50)
            .attr("width", 50);

        // make the image grow a little on mouse over and add the text details on click
        var setEvents = images
        // Append hero text
            .on('click', function (d) {

                d3.select("h3").html(d.hero);
                d3.select("h4").html(d.introduction);
                // d3.select("h4").html(d.introduction);
                d3.select("h5").html("Take me to " + "<a href='" + d.link + "' >" + d.hero + " web page ⇢" + "</a>");
                draw(d);
                draw_ti8(d);
            })

            .on('mouseenter', function () {
                // select element in current context
                d3.select(this)
                    .transition()
                    .attr("x", function (d) {
                        return -60;
                    })
                    .attr("y", function (d) {
                        return -60;
                    })
                    .attr("height", 100)
                    .attr("width", 100)
            })
            // set back
            .on('mouseleave', function () {
                d3.select(this)
                    .transition()
                    .attr("x", function (d) {
                        return -25;
                    })
                    .attr("y", function (d) {
                        return -25;
                    })
                    .attr("height", 50)
                    .attr("width", 50)
                    .style("z-index", -1);
            });

        // Append hero name on roll over next to the node as well
        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("x", x_browser-50)
            .attr("y", y_browser + 15)
            .attr("fill", function (d) {
                if (d.name === "Agility") {
                    return "#FF00FF"
                }
                else {
                    return d.name === "Strength" ? "#FF00FF" : "#FF00FF"
                }
            })
            .text(function (d) {
                return d.hero;
            });


        // Exit any old nodes.
        node.exit().remove();


        // Re-select for update.
        path = vis.selectAll("path.link");
        node = vis.selectAll("g.node");

        function tick() {


            path.attr("d", function (d) {

                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + d.source.x + ","
                    + d.source.y
                    + "A" + dr + ","
                    + dr + " 0 0,1 "
                    + d.target.x + ","
                    + d.target.y;
            });
            node.attr("transform", nodeTransform);
        }
    }


    function draw(d){
        var scolorrateScale = d3.scale.linear().domain([3, 10]).range(['#fea882', '#af0417']);
        var acolorrateScale = d3.scale.linear().domain([3, 10]).range(['#80fe8a', '#1daf09']);
        var icolorrateScale = d3.scale.linear().domain([3, 10]).range(['#bbe4fe', '#2248af']);

        if(document.getElementById("heroattr")){
            d3.select("#heroattr").remove();
        }

        heroScale = d3.scale.linear()
                .domain([0, 12])
                .range([0, 140]);

        let data = d.point
        let attribut=["Dps",'Support',"Push","Gank","Tank","Group"]
        let name = d.name
        arr=[data.DPS,data.support,data.Push,data.gank,data.tank,data.group]

        margin = {top: 10, right: 20, bottom: 20, left: 50};
        let info = d3.select("#sub_div").classed("sub_content", true);
        svgBounds = info.node().getBoundingClientRect();
        svgWidth = this.svgBounds.width - this.margin.left;
        svgHeight = 100;
        svg = info.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("id","heroattr")

        svg.append('g').selectAll("rect")
                    .data(arr)
            .enter()
            .append("rect")
            .attr("x",60)
            .attr('y',function(d,i){
                return i*20+2
            })
            .attr("width",function (d) {
                return  heroScale(parseFloat(d));
            })
            .attr("height",12)
            .attr("fill",function(d){
                if(name==="Strength"){return scolorrateScale(parseFloat(d))}
                else if(name==="Intelligence"){return icolorrateScale(parseFloat(d))}
                else return acolorrateScale(parseFloat(d))
            })
            .style("heroattr",true);

        svg.append('g').selectAll("text")
            .data(attribut)
            .enter()
            .append("text")
            .text(d=>{
                return d
            })
            .attr('x',0)
            .attr('y',function(d,i){
                return i*20+14
            })
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")

        svg.append('g').selectAll("text")
            .data(arr)
            .enter()
            .append("text")
            .text(d=>{
                return d
            })
            .attr('x',function (d) {
                return  heroScale(parseFloat(d)+6);
            })
            .attr('y',function(d,i){
                return i*20+14
            })



    }
    function draw_ti8(d){

        if(document.getElementById("heropefor")){
            d3.select("#heropefor").remove();
        }
        rateScale = d3.scale.linear().domain([0, 1.3]).range([0, 140]);


        gameScale = d3.scale.linear().domain([0, 500]).range([0, 140]);
        pmScale = d3.scale.linear().domain([0, 1000]).range([0, 140]);

        var sratioScale = d3.scale.linear().domain([0, 1]).range(['#fea882', '#af0417']);
        var aratioScale = d3.scale.linear().domain([0, 1]).range(['#80fe8a', '#1daf09']);
        var iratioScale = d3.scale.linear().domain([0, 1]).range(['#bbe4fe', '#2248af']);

        var spbScale = d3.scale.linear().domain([0, 400]).range(['#fea882', '#af0417']);
        var apbtioScale = d3.scale.linear().domain([0, 400]).range(['#80fe8a', '#1daf09']);
        var ipbtioScale = d3.scale.linear().domain([0, 400]).range(['#bbe4fe', '#2248af']);

        var aspbScale = d3.scale.linear().domain([0, 800]).range(['#fea882', '#af0417']);
        var aapbtioScale = d3.scale.linear().domain([0, 800]).range(['#80fe8a', '#1daf09']);
        var aipbtioScale = d3.scale.linear().domain([0, 800]).range(['#bbe4fe', '#2248af']);

        let data = d.attr
        let attribut=["Win","PickWin","BanWin","RVD","Picks","Ban","XPM","GPM"]

        let name = d.name
        arr=[data.combined_win,data.pick_win,data.ban_win,data.RVD,data.picks,data.ban,data.XPM,data.GPM]


        margin = {top: 10, right: 20, bottom: 20, left: 50};
        let info = d3.select("#sub_div2").classed("sub_content", true);
        svgBounds = info.node().getBoundingClientRect();
        svgWidth = this.svgBounds.width - this.margin.left;
        svgHeight = 280;
        svg = info.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("id","heropefor")

        svg.append('g').selectAll("rect")
            .data(arr)
            .enter()
            .append("rect")
            .attr("x",60)
            .attr('y',function(d,i){
                if (i==4 || i==5){
                    return (i+1)*20+2
                }
                if(i==6 || i==7){
                    return (i+2)*20+2
                }
                else{
                    return i*20+2
                }

            })
            .attr("width",function (d,i) {
                if(i<=3){ return  rateScale(parseFloat(d));}
                if(i<=5){return  gameScale(parseFloat(d));}
                return  pmScale(parseFloat(d));
            })
            .attr("height",12)
            .attr("fill",function(d,i){
                if(i==0 || i==1 ||i==2 ||i==3){
                    if(name==="Strength"){return sratioScale(parseFloat(d))}
                    else if(name==="Intelligence"){return iratioScale(parseFloat(d))}
                    else{
                        return aratioScale(parseFloat(d))
                    }
                }
                else if(i==4 || i==5){
                    if(name==="Strength"){return spbScale(parseFloat(d))}
                    else if(name==="Intelligence"){return ipbtioScale(parseFloat(d))}
                    else{
                        return apbtioScale(parseFloat(d))
                    }
                }
                else{
                    if(name==="Strength"){return aspbScale(parseFloat(d))}
                else if(name==="Intelligence"){return aipbtioScale(parseFloat(d))}
                else{
                    return aapbtioScale(parseFloat(d))
                }

                }


            })
            .style("heropefor",true);

        svg.append('g').selectAll("text")
            .data(attribut)
            .enter()
            .append("text")
            .text(d=>{
                return d
            })
            .attr('x',0)
            .attr('y',function(d,i){
                if (i==4 || i==5){
                    return (i+1)*20+14
                }
                if(i==6 || i==7){
                    return (i+2)*20+14
                }
                else{
                    return i*20+14
                }

            })
            .attr("font-family", "Arial")
            .style("font-size", "16px")

        svg.append('g').selectAll("text")
            .data(arr)
            .enter()
            .append("text")
            .text(d=>{
                if(parseFloat(d)<1){
                return (parseFloat(d)*100).toFixed(2)+"%"}
                return d
            })
            .attr('x',function (d,i) {
                if(i<=3){ return  rateScale(parseFloat(d)+0.6);}
                if(i<=5){return  gameScale(parseFloat(d)+220);}
                return  pmScale(parseFloat(d)+500);
            })
            .attr('y',function(d,i){
                if (i==4 || i==5){
                    return (i+1)*20+14
                }
                if(i==6 || i==7){
                    return (i+2)*20+14
                }
                else{
                    return i*20+14
                }

            })

    }


    /**
     * Gives the coordinates of the border for keeping the nodes inside a frame
     * http://bl.ocks.org/mbostock/1129492
     */
    function nodeTransform(d) {
        d.x = Math.max(maxNodeSize, Math.min(w - (d.imgwidth / 2 || 16), d.x));
        d.y = Math.max(maxNodeSize, Math.min(h - (d.imgheight / 2 || 16), d.y));
        return "translate(" + d.x + "," + d.y + ")";
    }

    /**
     * Toggle children on click.
     */
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }

        update();
    }


    /**
     * Returns a list of all nodes under the root.
     */
    function flatten(root) {
        var nodes = [];
        var i = 0;

        function recurse(node) {
            if (node.children)
                node.children.forEach(recurse);
            if (!node.id)
                node.id = ++i;
            nodes.push(node);
        }

        recurse(root);
        return nodes;
    }

    function clearHighlight() {

        //TODO - Your code goes here -
        this.div.selectAll('*').remove()
    }


    function changeHeroPage(){

        var type = document.createElement("div");
        type.id = "heroType"
        document.getElementById("graph").appendChild(type);



        var button_agility = document. createElement("button");
        button_agility. innerHTML = "Agility";
        type.appendChild(button_agility);
        button_agility. addEventListener ("click", function() {
            f("data/Agility.json");
        });

        var button_strength = document. createElement("button");
        button_strength. innerHTML = "Strength";
        type.appendChild(button_strength);
        button_strength. addEventListener ("click", function() {
            f("data/Strength.json");
        });
        var button_inte = document. createElement("button");
        button_inte. innerHTML = "Intelligence";
        type.appendChild(button_inte);
        button_inte. addEventListener ("click", function() {
            f("data/Intellegence.json");
        });
    }

}
