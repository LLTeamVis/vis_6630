

function f() {

    document.getElementById("right").innerHTML='';

    var div = document.createElement("div");
    var div2 = document.createElement("div");
    div.id = "section";
    div2.id = 'graph';
    document.getElementById("right").appendChild(div);
    document.getElementById("right").appendChild(div2);


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
    sub_div2.id="sub_div";
    document.getElementById("graph").appendChild(sub_div2);


// some colour variables
    var tcBlack = "#130C0E";

// rest of vars
    var w = 700,
        h = 580,
        maxNodeSize = 60,
        x_browser = 20,
        y_browser = 25,
        root;

    var vis;
    var force = d3.layout.force();

    vis = d3.select("#section").append("svg").attr("width", w).attr("height", h);

    d3.json("marvel.json", function (json) {

        root = json;
        root.fixed = true;
        root.x = w / 2;
        root.y = h / 4;


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
            .linkDistance(100)
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
                    return d.target.name === "strength" ? "red" : "blue"

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
                d3.select("h4").html(d.name);
                d3.select("h5").html("Take me to " + "<a href='" + d.link + "' >" + d.hero + " web page ⇢" + "</a>");
                draw(d);
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
                    .attr("width", 100);
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
                    .attr("width", 50);
            });

        // Append hero name on roll over next to the node as well
        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("x", x_browser)
            .attr("y", y_browser + 15)
            .attr("fill", function (d) {
                if (d.name === "Agility") {
                    return "green"
                }
                else {
                    return d.name === "strength" ? "red" : "blue"
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

        if(document.getElementById("heroattr")){
            d3.select("#heroattr").remove();
        }

        heroScale = d3.scale.linear()
                .domain([0, 10])
                .range([0, 140]);

        let data = d.point
        let attribut=["Dps",'Support',"Push","Gank","Tank","Group"]
        let name = d.name
        arr=[data.DPS,data.support,data.Push,data.gank,data.tank,data.group]

        margin = {top: 10, right: 20, bottom: 20, left: 50};
        let info = d3.select("#sub_div").classed("sub_content", true);
        svgBounds = info.node().getBoundingClientRect();
        svgWidth = this.svgBounds.width - this.margin.left;
        svgHeight = 150;
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
                return  heroScale(parseInt(d));
            })
            .attr("height",10)
            .attr("fill",function(d){
                if(name==="strength"){return "red"}
                else if(name==="Intelligence"){return "blue"}
                else return "green"
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
                return  heroScale(parseInt(d)+4.5);
            })
            .attr('y',function(d,i){
                return i*20+14
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

}
