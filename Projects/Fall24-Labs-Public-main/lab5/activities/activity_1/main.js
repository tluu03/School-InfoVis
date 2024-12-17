var width = 500;
var height = 500;

var width2 = 900;
var svg = d3.select('svg');

var padding = { t: 60, r: 40, b: 30, l: 120 };

// Compute chart dimensions
var barChartWidth = width2 - padding.l - padding.r;
var chartHeight = height - padding.t - padding.b;

/******************************************
Compute the spacing for bar bands based on the number of cereals below
******************************************/

d3.csv("cereals.csv", function (csv) {
    for (var i = 0; i < csv.length; ++i) {
        csv[i].Calories = Number(csv[i].Calories)
        /******************************************
        Convert the rest of the cereal data
        ******************************************/
        csv[i].Fat = Number(csv[i].Fat);
        csv[i].Carb = Number(csv[i].Carb);
        csv[i].Fiber = Number(csv[i].Fiber);
        csv[i].Protein = Number(csv[i].Protein);
       
    }

    console.log(csv);

    // Functions used for scaling axes +++++++++++++++
    var fatExtent = d3.extent(csv, function (row) {
        return row.Fat;
    });
    var carbExtent = d3.extent(csv, function (row) {
        return row.Carb;
    });
    var fiberExtent = d3.extent(csv, function (row) {
        return row.Fiber;
    });
    var proteinExtent = d3.extent(csv, function (row) {
        return row.Protein;
    });

    var cerealNames = csv.map(d => d.CerealName);


    // Axis setup
    var xScale = d3.scaleBand().domain(cerealNames).range([0, barChartWidth]);
    var yScale = d3.scaleLinear().domain(fatExtent).range([chartHeight, 30]);

    var xScale2 = d3.scaleLinear().domain([0, proteinExtent[1]]).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(carbExtent).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);
    /******************************************
       Create your legend below
    ******************************************/
    d3.select("#LowCalorie")
       .append("circle")
       .attr("cx", 6)
       .attr("cy", 6)
       .attr("r", 6)
       .attr("fill", "red")
       .attr("stroke", "black")
       .attr("stroke-width", 1);
   
   d3.select("#MedCalorie")
       .append("circle")
       .attr("cx", 6)
       .attr("cy", 6)
       .attr("r", 6)
       .attr("fill", "orange")
       .attr("stroke", "black")
       .attr("stroke-width", 1);
   
   d3.select("#HighCalorie")
       .append("circle")
       .attr("cx", 6)
       .attr("cy", 6)
       .attr("r", 6)
       .attr("fill", "yellow")
       .attr("stroke", "black")
       .attr("stroke-width", 1);

    //Create SVGs for charts
    var chart1 = d3
        .select("#chart1")
        .append("svg:svg")
        .attr("id", "svg1")
        .attr("width", width2)
        .attr("height", 600);

    var chart2 = d3
        .select("#chart2")
        .append("svg:svg")
        .attr("id", "svg2")
        .attr("width", width)
        .attr("height", height);

   
    /******************************************
        Axis added below (add labels)
    ******************************************/
    chart1 
        .append("g")
        .attr("transform", "translate(50," + (height - 90) + ")")
        .call(xAxis) 
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "translate(5, 0) rotate(55)");

    chart1 
        .append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    chart2
        .append("g") 
        .attr("transform", "translate(0," + (width - 30) + ")")
        .call(xAxis2)
        .append("text")
        .attr("class", "label")
        .attr("x", width - 16)
        .attr("y", -6)
        .style("text-anchor", "end");

    chart2 
        .append("g") 
        .attr("transform", "translate(50, 0)")
        .call(yAxis2)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    chart1 
        .append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -chartHeight / 2)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Fat");

    chart1.append("text")
        .attr("x", barChartWidth / 2 + 50)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("font-size", "16px")
        .text("Fat Percentage by Cereal");

    chart1.append("text")
        .attr("x", barChartWidth / 2 + 50)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("font-size", "12px")
        .style("fill", "black")
        .text("Cereal Name");

    chart2
        .append("g") 
        .attr("transform", "translate(0," + (width - 30) + ")")
        .call(xAxis2)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", + 30)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Protein");
    chart2.append("text")
        .attr("x", barChartWidth / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("font-size", "16px")
        .text("Protein vs Carb");
    chart2 
        .append("g") 
        .attr("transform", "translate(50, 0)")
        .call(yAxis2)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Carb");

    /******************************************
            Create Bars for the Histogram
    ******************************************/
    chart1.append("g")
        .attr("transform", "translate(50, 0)") // I dont know if anyone else had a bar shifting off the graph problem but this is my fix ;-;
        .selectAll("rect")
        .data(csv)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.CerealName))
        .attr("y", d => yScale(d.Fat))
        .attr("width", xScale.bandwidth() * 0.8)
        .attr("height", d => chartHeight - yScale(d.Fat))
        .attr("fill", d => {
            if (d.Calories <= 100) return "red";
            else if (d.Calories <= 130) return "orange";
            else return "yellow";
        });

    /******************************************
            Create Circles for the Scatterplot
    ******************************************/
    chart2.selectAll("circle")
        .data(csv)
        .enter()
        .append("circle")
        .attr("cx", d => xScale2(d.Protein))
        .attr("cy", d => yScale2(d.Carb))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", d => {
            if (d.Calories <= 100) return "red";
            else if (d.Calories <= 130) return "orange";
            else return "yellow";
        });
});

