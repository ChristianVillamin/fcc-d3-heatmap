const dataURL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const svgWidth = 1600;
const svgHeight = 800;
const svgPadding = 60;
const svgPaddingTop = 90;

d3.select('#container')
  .style('width', `${svgWidth}px`)
  .style('height', `${svgHeight}px`);

d3.select('#title').style('left', `${svgWidth / 2}px`);
d3.select('#description').style('left', `${svgWidth / 2}px`);

// Data
d3.json(dataURL).then(dataset => visualize(dataset));

const visualize = dataset => {
  const yearsFiltered = dataset.monthlyVariance
    .map(d => d.year)
    .filter((d, i, s) => s.indexOf(d) === i);

  const barWidth = (svgWidth - svgPadding * 2) / yearsFiltered.length;
  const barHeight = (svgHeight - svgPadding - svgPaddingTop) / 12;
  const baseTemp = dataset.baseTemperature;

  d3.select('#description').text(
    `1753 - 2015: Base Temp: ${dataset.baseTemperature}°C`
  );

  // SVG
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'svg-container');

  // X-AXIS
  const years = dataset.monthlyVariance.map(d => new Date(d.year, 0));

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([svgPadding, svgWidth - svgPadding]);

  const xAxis = d3.axisBottom().scale(xScale);

  svg
    .append('g')
    .attr('transform', `translate(0, ${svgHeight - svgPadding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  // Y-AXIS
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const yScale = d3
    .scaleBand()
    .domain(months)
    .range([svgHeight - svgPadding, svgPaddingTop]);

  const yAxis = d3.axisLeft().scale(yScale);

  svg
    .append('g')
    .attr('transform', `translate(${svgPadding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  // Bars
  const colorRange = [
    // '#fff6e5',
    // '#ffedcc',
    '#ffe4b2',
    '#ffdb99',
    '#ffd27f',
    '#ffc966',
    // '#ffc04c',
    '#ffb732',
    // '#ffae19',
    '#ffa500'
  ];

  const colorScale = d3
    .scaleQuantize()
    // .domain(d3.range(1, 13, 1))
    .domain([1, 13])
    .range(colorRange);

  const tooltip = d3.select('#tooltip');

  const selector = d3
    .select('#selector')
    .style('width', `${barWidth}px`)
    .style('height', `${barHeight}px`);

  // Legend
  const legend = d3
    .select('#container')
    .append('svg')
    .attr('id', 'legend')
    .style('width', svgWidth)
    .style('height', '100px')
    .style('background', 'pink');

  legend
    .selectAll('rect')
    .data(colorRange)
    .enter()
    .append('rect')
    .attr('x', (d, i) => (svgWidth / colorRange.length) * i)
    .attr('y', 0)
    .attr('width', `${svgWidth / colorRange.length}px`)
    .attr('height', '100px')
    .attr('class', 'legend')
    .attr('fill', (d, i) => colorRange[i]);

  const degs = [1, 3, 5, 7, 9, 11];

  d3.select('#container')
    .selectAll('h4')
    .data(colorRange)
    .enter()
    .append('h4')
    .text((d, i) =>
      i != degs.length - 1
        ? `${degs[i]}°C - ${degs[i + 1]}°C `
        : `${degs[i]}°C +`
    )
    .style('left', (d, i) => `${(svgWidth / colorRange.length) * i}px`)
    .style('top', (d, i) => `${svgHeight + 40}px`)
    .style('width', `${svgWidth / colorRange.length}px`);

  // Bars
  svg
    .selectAll('rect')
    .data(dataset.monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', d => d.month - 1)
    .attr('data-year', d => d.year)
    .attr('data-temp', d => d.variance)
    .attr('x', (d, i) => xScale(years[i]))
    .attr('y', (d, i) => yScale(months[d.month - 1]))
    .attr('width', `${barWidth}px`)
    .attr('height', `${barHeight}px`)
    .attr('fill', d => colorScale(Math.floor(baseTemp + d.variance)))
    .on('mouseover', (d, i) => {
      tooltip
        .html(
          `${months[d.month - 1]}: ${d.year}<br/>Temp: ${(
            baseTemp + d.variance
          ).toFixed(2)}℃`
        )
        .attr('data-year', d.year)
        .style('left', `${xScale(years[i])}px`)
        .style('top', `${yScale(months[d.month - 1]) - 25}px`)
        .style('visibility', 'visible');

      selector
        .style('top', `${yScale(months[d.month - 1])}px`)
        .style('left', `${xScale(years[i])}px`)
        .style('visibility', 'visible');
    })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden');
      selector.style('visibility', 'hidden');
    });
};
