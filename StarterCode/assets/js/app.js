// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); // extra padding for third label

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosen_x_axis = "poverty";
var chosen_y_axis = "healthcare";


// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(state_data) {
    //console.log(state_data)
    // Step 4: Parse the date and 
    // =================================
    // Format the data/cast as numbers now
    state_data.forEach(function(data) {
        data.poverty    = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age        = +data.age;
        data.smokes     = +data.smokes;
        data.obesity    = +data.obesity;
        data.income     = +data.income;

        console.log(data)
    })

    // 

// Initialize scale functions
 var x_scale = d3.scaleLinear()
   .domain(d3.extent(state_data, data => data.poverty))
   .range([0, width]);

//configue a y scale
  var y_scale = d3.scaleLinear()
    .domain([0, d3.max(state_data, data => data.healthcare)])
    .range([height, 0]);
// Create two new functions passing the scales in as arguments
// These will be used to create the chart's axes
  var bottom_axis = d3.axisBottom(x_scale);
  var left_axis = d3.axisLeft(y_scale);

//add our x and y scales to the chart
  var xAxis = chartGroup.append("g");
    xAxis
    .attr("transform", `translate(0, ${height})`)
    .call(bottom_axis);

// Y scale appendage
  var y_axis = chartGroup.append('g');
  y_axis
    .call(left_axis);

//create the scatterplot and append the initial circles
  var circles_group = chartGroup.selectAll('circle');

  circles_group
  .data(state_data)
  .enter()
  .append('circle')
  .attr('cx', d => x_scale(d.poverty))
  .attr('cy', d => y_scale(d.healthcare))
  .attr('r', '15')
  .attr('stroke', 'black')
  .attr("opacity", ".5")
  .attr('fill', 'purple');

//initializing the tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.healthcare}<br>Poverty: ${d.poverty}<br>`);});
  
  chartGroup.call(toolTip);

  circles_group.on("click", function(data) {
    toolTip.show(data, this);
  })
// onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

//try adding our state abbr.
    var texts = svg.selectAll(null);
    texts
    .data(state_data)
    .enter()
    .append('text')
    .text(d => d.state)
    .attr('color', 'black')
    .attr('font-size', 15);

// Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks HealthCare");
  chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("States Poverty(%)");


}).catch(function(error) {
   console.log(error);

 });
