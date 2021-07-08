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

//X function for updating the x-scale var upon click on axis label
function xScale(state_data, chosen_x_axis) {
    // create scales
    var x_linear_scale = d3.scaleLinear()
      .domain([d3.min(state_data, d => d[chosen_x_axis]) * 0.8,
        d3.max(state_data, d => d[chosen_x_axis]) * 1.2
      ])
      .range([0, width]);
  
    return x_linear_scale;
  }

// function used for updating xAxis var upon click on axis label
function renderAxes(new_x_scale, x_axis) {
    var bottom_axis = d3.axisBottom(new_x_scale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottom_axis);
  
    return x_axis;
  }
// function used for updating circles group with a transition to
// new circles
function renderCircles(circles_group, new_x_scale, chosen_x_axis) {

    circles_group.transition()
      .duration(1000)
      .attr("cx", d => new_x_scale(d[chosen_x_axis]));
  
    return circles_group;
}

//////////////////////////////////////////////////////////////////
// function used for updating circles group with new tooltip
function updateToolTip(chosen_x_axis, circles_group) {

    var label;
  
    if (chosen_x_axis === "state") {
      label = "state:";
    }
    else {
      label = "poverty:";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state_data}<br>${label} ${d[chosen_x_axis]}`);
  });

    circles_group.call(toolTip);

    circles_group.on("mouseover", function(data) {
    toolTip.show(data);
    })
    // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
  return circles_group;
}
////////////////////////////////////////////////////////////////////
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(state_data, err) {
    if (err) throw err;

    //parse the data
    state_data.forEach(function(data) {
        data.poverty    = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age        = +data.age;
        data.smokes     = +data.smokes;
        data.obesity    = +data.obesity;
        data.income     = +data.income;
        console.log(data)
    });

    var x_linear_scale = xScale(state_data, chosen_x_axis);

    //create our Y scale
    var y_linear_scale = d3.scaleLinear()
    .domain([0, d3.max(state_data, d => d.healthcare)])
    .range([height, 0]);

    //create initial axis functions
    var bottom_axis = d3.axisBottom(x_linear_scale);

    var left_axis = d3.axisLeft(y_linear_scale);

    //append the x axis
    var x_axis = chartGroup.append('g');
    x_axis
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottom_axis);

    //append the y axis
    chartGroup.append('g');
    chartGroup
        .call(left_axis);

    //append initial circles
    var circles_group = chartGroup.selectAll("circle");
    circles_group
        .data(state_data)
        .enter()
        .append('circle')
        .attr('cx', d => x_linear_scale(d[chosen_x_axis]))
        .attr('cy', d => y_linear_scale(d.healthcare))
        .attr('r', 20)
        .attr('fill', 'pink')
        .attr('opacity', '.5');

    //create a group for 2 x axis labels
    var labels_group = chartGroup.append('g');
    labels_group
            .attr('transform', `translate(${width}, ${height + 20})`);
    
});


