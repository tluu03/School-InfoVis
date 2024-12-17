var width = 900, height = 600, sidebarWidth = 300;
var padding = { t: 80, r: 40, b: 80, l: 80 };
var chartWidth = width - padding.l - padding.r;
var chartHeight = height - padding.t - padding.b;

//Load the dataset
d3.csv("colleges.csv").then(function (data) {
    //Parse numeric columns, ran into faulty data here
    data.forEach(d => {
        for (const key in d) {
            if (!isNaN(+d[key])) d[key] = +d[key];
        }
    });

    //Get unique regions and assign colors(from csv)
    const regions = Array.from(new Set(data.map(d => d.Region).filter(Boolean)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(regions);

    //Categories for the axes
    const yCategories = ["Admission Rate", "Mean Earnings 8 years After Entry", "Median Debt"];
    const xCategories = ["Median Family Income", "% Federal Loans", "SAT Average", "ACT Median", "Average Cost"];

    //Create initial scales and SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + sidebarWidth)
        .attr("height", height)
        .on("click", clearSelection); //Detect clicks outside circles

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${padding.l}, ${padding.t})`);

    const xAxisGroup = chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`);
    const yAxisGroup = chartGroup.append("g");

    const xLabel = chartGroup.append("text")
        .attr("class", "x-axis-label")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px");

    const yLabel = chartGroup.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -chartHeight / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "14px");

    const xScale = d3.scaleLinear().range([0, chartWidth]);
    const yScale = d3.scaleLinear().range([chartHeight, 0]);

    //Populate dropdowns
    d3.select("#x-axis-selector").selectAll("option").data(xCategories).enter().append("option").text(d => d);
    d3.select("#y-axis-selector").selectAll("option").data(yCategories).enter().append("option").text(d => d);

    //Sidebar for region filter and hover information
    const sidebar = d3.select("#sidebar");
    sidebar.append("div").attr("id", "region-filter").append("p").text("Filter by Region:");

    regions.forEach(region => {
        const label = sidebar.select("#region-filter").append("label").style("display", "block");
        label.append("input")
            .attr("type", "checkbox")
            .attr("value", region)
            .property("checked", true)
            .on("change", updateChart);
        label.append("span").text(region).style("color", colorScale(region));
    });

    sidebar.append("p").attr("id", "sidebar-name").text("College Name: ");
    const detailsContainer = sidebar.append("div").attr("id", "sidebar-details");

    function initializeDetails() {
        detailsContainer.html(
            `<p>Region: </p>` +
            [...xCategories, ...yCategories].map(attr => `<p>${attr}: </p>`).join("")
        );
    }

    function styleAxisText(axisSelection) {
        axisSelection.selectAll("text")
            .attr("transform", "rotate(0)")
            .style("text-anchor", "middle")
            .style("font-size", "10px");
    }

    function updateChart() {
        const xAttr = d3.select("#x-axis-selector").node().value;
        const yAttr = d3.select("#y-axis-selector").node().value;

        const selectedRegions = new Set(
            d3.selectAll("#region-filter input:checked").nodes().map(input => input.value)
        );

        const filteredData = data.filter(d => selectedRegions.has(d.Region) && d[xAttr] > 0 && d[yAttr] > 0);

        xScale.domain(d3.extent(filteredData, d => d[xAttr]));
        yScale.domain(d3.extent(filteredData, d => d[yAttr]));

        xLabel.text(xAttr);
        yLabel.text(yAttr);

        styleAxisText(xAxisGroup.call(d3.axisBottom(xScale)));
        yAxisGroup.call(d3.axisLeft(yScale));

        const circles = chartGroup.selectAll(".circle").data(filteredData, d => d.Name);

        circles.enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", d => xScale(d[xAttr]))
            .attr("cy", d => yScale(d[yAttr]))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.Region))
            .on("mouseover", function (event, d) {
                if (state.selectedCircle !== this) {
                    d3.select(this).attr("stroke", "black").attr("stroke-width", 1.5);
                }
            })
            .on("mouseout", function () {
                if (state.selectedCircle !== this) {
                    d3.select(this).attr("stroke", null);
                }
            })
            .on("click", function (event, d) {
                event.stopPropagation();
                if (state.selectedCircle === this) {
                    clearSelection();
                } else {
                    if (state.selectedCircle) d3.select(state.selectedCircle).attr("stroke", null);

                    state.selectedCircle = this;
                    d3.select(this).attr("stroke", "black").attr("stroke-width", 2);

                    sidebar.select("#sidebar-name").text("College: " + d.Name);
                    detailsContainer.html(
                        `<p>Region: ${d.Region}</p>` +
                        [...xCategories, ...yCategories].map(attr => `<p>${attr}: ${d[attr] || ""}</p>`).join("")
                    );
                }
            });

        circles.transition()
            .duration(500)
            .attr("cx", d => xScale(d[xAttr]))
            .attr("cy", d => yScale(d[yAttr]))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.Region));

        circles.exit().remove();
    }

    function clearSelection() {
        if (state.selectedCircle) {
            d3.select(state.selectedCircle).attr("stroke", null);
            state.selectedCircle = null;
            sidebar.select("#sidebar-name").text("College: ");
            initializeDetails();
        }
    }

    const state = { selectedCircle: null };

    d3.select("#x-axis-selector").on("change", updateChart);
    d3.select("#y-axis-selector").on("change", updateChart);

    initializeDetails();
    updateChart();
});
