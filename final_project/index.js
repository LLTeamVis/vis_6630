//Create table
d3.csv('../data/Group_Stage.csv').then(data=>{
    data.map(d=>{
        var id=d.Id;
        var width=100;
        var scale=d3.scaleOrdinal().domain(['0:2','1:1','2:0']).range(['LightPink','LightYellow','LightSkyBlue']);
        let svg=d3.select('#'+id).append('svg').attr('width',width*1.1).attr('height',width*1.1);
        svg.append('rect').attr('width',width).attr('height',width).style('fill',scale(d.Score));
        svg.append('text').text(d.Score).attr('x',width*0.25).attr('y',width*0.6);
        svg.append('title')
        .text(d.Team_A+' '+d.Score+' '+d.Team_B+'\n Heros: \n Game 1: '+d.G1H1+' '+d.G1H2+' '+d.G1H3+' '+d.G1H4+' '+d.G1H5+' versus '+d.G1H6+' '+d.G1H7+' '+d.G1H8+' '+d.G1H9+' '+d.G1H10+'\n Game 2: '+d.G2H1+' '+d.G2H2+' '+d.G2H3+' '+d.G2H4+' '+d.G2H5+' versus '+d.G2H6+' '+d.G2H7+' '+d.G2H8+' '+d.G2H9+' '+d.G2H10)
        .style('white-space','pre');

        svg=d3.select('#'+d.Id_ins).append('svg').attr('width',width*1.1).attr('height',width*1.1);
        svg.append('rect').attr('width',width).attr('height',width).style('fill',scale(d.Score.toString().split('').reverse().join('')));
        svg.append('text').text(d.Score.toString().split('').reverse().join('')).attr('x',width*0.25).attr('y',width*0.6);
        svg.append('title')
        .text(d.Team_A+' '+d.Score+' '+d.Team_B+'\n Heros: \n Game 1: '+d.G1H1+' '+d.G1H2+' '+d.G1H3+' '+d.G1H4+' '+d.G1H5+' versus '+d.G1H6+' '+d.G1H7+' '+d.G1H8+' '+d.G1H9+' '+d.G1H10+'\n Game 2: '+d.G2H1+' '+d.G2H2+' '+d.G2H3+' '+d.G2H4+' '+d.G2H5+' versus '+d.G2H6+' '+d.G2H7+' '+d.G2H8+' '+d.G2H9+' '+d.G2H10)
        .style('white-space','pre');
    });
});