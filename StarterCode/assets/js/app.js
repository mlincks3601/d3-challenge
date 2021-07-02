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
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); // extra padding for third label

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosen_x_axis = "poverty";
let chosen_y_axis = "healthcare";


// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(state_data) {
    console.log(state_data)
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
    })

    // 
// Initialize scale functions
//  var x_scale = d3.xLinearScale()
//    .domain(d3.extent(state_data, data => data.poverty))
//    .range([0, width]);

//configue a y scale
var y_scale = d3.scaleLinear()
  .domain([0, d3.max(state_data, data => data.healthcare)])
  .range([height, 0])
// Create two new functions passing the scales in as arguments
// These will be used to create the chart's axes
var bottom_axis = d3.axisBottom(x_scale);
var left_axis = d3.axisLeft(y_scale);

});