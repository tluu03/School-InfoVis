// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of temperatures
    updateChart(category);
}

// This function converts strings to numeric temperatures during data preprocessing
function dataPreprocessor(row) {
    return {
        country: row.Country,
        continent: row.Continent,
        temperature: +row['Average Temperature (°C)']
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 120};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Compute the spacing for bar bands based on the number of countries (20 in this case)
var barBand = chartHeight / 20;
var barHeight = barBand * 0.7;

var countries;
//Create a linear-scale for the `Average Temperature (°C)` data attribute. 
//You will want the output range of this scale to be `[0, chartWidth]`. 
//**You might want this to be a global variable.** 
//THIS TRIPPED ME UP SO BAD >:(
var scale = d3.scaleLinear()
        .range([0, chartWidth]);
d3.csv('countries_avg_temp.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and initialize the chart
    countries = dataset
    scale.domain([0, d3.max(countries, function(d) {return d.temperature})])

    // **** Your JavaScript code goes here ****
    var xAxisTop = d3.axisTop(scale).ticks(5).tickFormat(d => `${d}C`);
    var xAxisBottom = d3.axisBottom(scale).ticks(5).tickFormat(d => `${d}C`);
    svg.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", padding.t / 2)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Average Temperature (°C)");

    chartG.append("g")
        .attr("class", "x-axis-top")
        .attr("transform", "translate(0, 0)")
        .call(xAxisTop);

    chartG.append("g")
        .attr("class", "x-axis-bottom")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxisBottom);
    //Dynamically coding this was so much easier than trying to do a listener ;P
    d3.select('#main')
        .append('div')
        .attr('id', 'cutoff-form')
        .html(`
            <label for="cutoffFilter">Cutoff:</label>
            <input type="text" id="cutoff">
            <button id="cutoffButton" style="border: 1px solid black">Apply Cutoff</button>
        `);

    d3.select('#cutoffButton').on('click', function() {
        var select = d3.select('#categorySelect').node();
        var category = select.options[select.selectedIndex].value;
        updateChart(category);
    });
    updateChart('all-continents');
});

function updateChart(filterKey) {
    // Create a filtered array of countries based on the filterKey
    var cutoff = parseFloat(document.getElementById('cutoff').value) || 0;
    // Changing statements to accomadate activity 3
    var filteredCountries = countries.filter(d => 
        (filterKey === 'all-continents' || d.continent === filterKey) && 
        d.temperature >= cutoff
    );

    // **** Draw and Update your chart here ****
    scale.domain([0, d3.max(filteredCountries, d => d.temperature)]);

    var bars = chartG.selectAll('.bar')
        .data(filteredCountries, d => d.country);
    bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('height', barHeight)
        .attr('fill', '#00008b')
        .merge(bars)
        .attr('width', d => scale(d.temperature))
        .attr('y', (d, i) => i * barBand);
    bars.exit().remove();

    // Handle the text labels for each country
    var labels = chartG.selectAll('.label')
        .data(filteredCountries, d => d.country);
    labels.enter().append('text')
        .attr('class', 'label')
        .attr('x', 0)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .merge(labels)
        .text(d => d.country)
        .attr('y', (d, i) => i * barBand + barHeight / 2);
    labels.exit().remove();
    chartG.select(".x-axis-top").call(xAxisTop);
    chartG.select(".x-axis-bottom").call(xAxisBottom);
}

// Remember code outside of the data callback function will run before the data loads
