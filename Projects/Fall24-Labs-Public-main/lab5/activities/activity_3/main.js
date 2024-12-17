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
    var chart1 = d3.select("#chart1").append("svg").attr("id", "svg1").attr("width", width2).attr("height", 600);
    var chart2 = d3.select("#chart2").append("svg").attr("id", "svg2").attr("width", width).attr("height", height);

   
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

    chart1.append("text").attr("x", barChartWidth / 2 + 50).attr("y", 20).attr("text-anchor", "middle").attr("stroke", "black").attr("stroke-width", 1).style("font-size", "16px").text("Fat Percentage by Cereal");
    chart1.append("text").attr("x", barChartWidth / 2 + 50).attr("y", height + 50).attr("text-anchor", "middle").attr("stroke", "black").attr("stroke-width", 1).style("font-size", "12px").text("Cereal Name");
    chart1.append("g").attr("transform", "translate(50, 0)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("x", -chartHeight / 2).attr("stroke", "black").style("text-anchor", "middle").style("fill", "black").text("Fat");

    chart2.append("text").attr("x", barChartWidth / 2).attr("y", 20).attr("text-anchor", "middle").attr("stroke", "black").attr("stroke-width", 1).style("font-size", "16px").text("Protein vs Carb");
    chart2.append("g").attr("transform", "translate(0," + (width - 30) + ")").call(xAxis2).append("text").attr("class", "label").attr("x", width / 2).attr("y", + 30).attr("stroke", "black").attr("stroke-width", 1).style("text-anchor", "middle").style("fill", "black").text("Protein");
    chart2.append("g").attr("transform", "translate(50, 0)").call(yAxis2).append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("x", -height / 2).attr("stroke", "black").style("text-anchor", "middle").style("fill", "black").text("Carb");

    /******************************************
            Create Bars for the Histogram
    ******************************************/
    var bars = chart1.append("g").attr("transform", "translate(50, 0)").selectAll("rect").data(csv).enter().append("rect")
        .attr("x", d => xScale(d.CerealName))
        .attr("y", d => yScale(d.Fat))
        .attr("width", xScale.bandwidth() * 0.8)
        .attr("height", d => chartHeight - yScale(d.Fat))
        .attr("fill", d => d.Calories <= 100 ? "red" : d.Calories <= 130 ? "orange" : "yellow")
        .attr("class", "bar");

    /******************************************
            Create Circles for the Scatterplot
    ******************************************/
    var circles = chart2.selectAll("circle").data(csv).enter().append("circle")
        .attr("cx", d => xScale2(d.Protein))
        .attr("cy", d => yScale2(d.Carb))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", d => d.Calories <= 100 ? "red" : d.Calories <= 130 ? "orange" : "yellow")
        .attr("class", "circle");

    //Brushing, Activity 2 & 3 included
    var brush1 = d3.brushX()
    .extent([[0, 0], [barChartWidth + 50, chartHeight]])
    .on("brush", brushedFromBars)
    .on("end", brushEnded);

    var brush2 = d3.brush().on("brush", brushedFromCircles).on("end", brushEnded);
    var infoSection = d3.select("#info-section");

    function brushedFromBars() {
        var selection = d3.event.selection;
        if (!selection) return;

        var [x0, x1] = selection;
        var selectedNames = new Set();

        bars.style("opacity", d => {
            var bx = xScale(d.CerealName) + 50;
            var isSelected = bx + (xScale.bandwidth() * 0.8) >= x0 && bx <= x1;
            if (isSelected) {
                selectedNames.add(d.CerealName);
            }
            return isSelected ? 1 : 0.1;
        });
        circles.style("opacity", d => selectedNames.has(d.CerealName) ? 1 : 0.1);
        handleSelectedData(selectedNames, csv);
    }

    function brushedFromCircles() {
        var selection = d3.event.selection;
        if (!selection) return;

        var [[x0, y0], [x1, y1]] = selection;
        var selectedNames = new Set();

        circles.style("opacity", d => {
            var cx = xScale2(d.Protein);
            var cy = yScale2(d.Carb);
            var isSelected = cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
            if (isSelected) {
                selectedNames.add(d.CerealName);
            }
            return isSelected ? 1 : 0.1;
        });
        bars.style("opacity", d => selectedNames.has(d.CerealName) ? 1 : 0.1);
        handleSelectedData(selectedNames, csv);
    }

    function handleSelectedData(selectedNames, data) {
        var selectedCereals = data.filter(d => selectedNames.has(d.CerealName));
        if (selectedCereals.length === 1) {
            clearInfoSection();
            populateInfoSection(selectedCereals[0]);
        } else {
            clearInfoSection();
        }
    }
    function clearInfoSection() {
        infoSection.select("#cereal-name").text("Cereal: ");
        infoSection.select("#cereal-calories").text("Calories: ");
        infoSection.select("#cereal-fat").text("Fat Value: ");
        infoSection.select("#cereal-carb").text("Carb Value: ");
        infoSection.select("#cereal-protein").text("Protein Value: ");
        infoSection.select("#cereal-fiber").text("Fiber Value: ");
    }
    function populateInfoSection(cereal) {
        infoSection.select("#cereal-name").text("Cereal: " + cereal.CerealName);
        infoSection.select("#cereal-calories").text("Calories: " + cereal.Calories);
        infoSection.select("#cereal-fat").text("Fat Value: " + cereal.Fat);
        infoSection.select("#cereal-carb").text("Carb Value: " + cereal.Carb);
        infoSection.select("#cereal-protein").text("Protein Value: " + cereal.Protein);
        infoSection.select("#cereal-fiber").text("Fiber Value: " + cereal.Fiber);
    }
    function brushEnded() {
        if (!d3.event.selection) {
            bars.style("opacity", 1);
            circles.style("opacity", 1);
            clearInfoSection();
        }
    }
    chart1.append("g").attr("class", "brush").call(brush1);
    chart2.append("g").attr("class", "brush").call(brush2);
});