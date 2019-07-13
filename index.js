d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
).then(dataset => {
  const svgWidth = 1200;
  const svgHeight = 800;
  const svgPadding = 75;
  const svgPaddingTop = 90;

  const barHeight = (svgHeight - svgPadding - svgPaddingTop) / 12;
  const baseTemp = dataset.baseTemperature;

  const years2 = dataset.monthlyVariance
    .map(d => d.year)
    .filter((d, i, s) => s.indexOf(d) === i);

  const barWidth = (svgWidth - svgPadding * 2) / years2.length;

  // CONTAINER
  d3.select('body')
    .append('div')
    .attr('id', 'container')
    .style('position', 'absolute')
    .style('width', `${svgWidth}px`)
    .style('height', `${svgHeight}px`)
    .style('top', '50%')
    .style('left', '50%')
    .style('transform', 'translate(-50%, -50%)')
    .style('box-shadow', '0 0 5px gray');

  // SVG
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'svg-container')
    .style('background-color', 'white');

  // TITLE
  d3.select('#container')
    .append('h1')
    .text('Heat Map | Global Land-Surface Temperature')
    .attr('id', 'title')
    .style('position', 'absolute')
    .style('left', `${svgWidth / 2}px`)
    .style('top', '10px')
    .style('width', '100%')
    .style('transform', `translateX(-50%)`)
    .style('font-size', '25px')
    .style('text-align', 'center');

  d3.select('#container')
    .append('h2')
    .text(`1753 - 2015: Base Temp: ${dataset.baseTemperature}℃`)
    .attr('id', 'description')
    .style('position', 'absolute')
    .style('left', `${svgWidth / 2}px`)
    .style('top', '50px')
    .style('width', '100%')
    .style('transform', `translateX(-50%)`)
    .style('font-size', '18px')
    .style('text-align', 'center');

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

  const colorRange = [
    '#fff6e5',
    '#ffedcc',
    '#ffe4b2',
    '#ffdb99',
    '#ffd27f',
    '#ffc966',
    '#ffc04c',
    '#ffb732',
    '#ffae19',
    '#ffa500'
  ];

  const hotDomain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  // const temperatures = dataset.monthlyVariance
  //   .map(d => baseTemp + d.variance)
  //   .sort((a, b) => a - b);

  const colorScale = d3
    .scaleLinear()
    .domain(hotDomain)
    .range(colorRange);

  const tooltip = d3
    .select('#container')
    .append('h2')
    .text('')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    // .style('left', `${svgWidth / 2}px`)
    // .style('top', '50px')
    .style('transform', `translateX(-50%)`);

  const selector = d3
    .select('#container')
    .append('div')
    .style('position', 'absolute')
    .style('width', `${barWidth}px`)
    .style('height', `${barHeight}px`)
    .style('background-color', 'black')
    .style('opacity', '0.5')
    .style('pointer-events', 'none');

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
    // .attr('fill', d => d)
    .attr('class', 'legend')
    .attr('fill', (d, i) => {
      console.log(i * 1.3);
      return colorScale(Math.floor(i * 1.3 + 1));
    });

  legend
    .selectAll('rect')
    .data(colorRange)
    .enter()
    .append('h3')
    .html('HIHII')
    .attr('x', (d, i) => (svgWidth / colorRange.length) * i)
    .attr('y', 0);

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
      // tooltip
      // .style('top', `${yScale(months[d.month - 1]) - 125}px`)
      // .style('left', `${xScale(years[i]) - 100}px`)
      // .attr('data-year', d.year)
      // .style('opacity', 0.5);

      tooltip
        .html(
          `${d.year}: ${months[d.month - 1]} <br/> Temp: ${baseTemp +
            d.variance}℃`
        )
        .attr('data-year', d.year)
        .style('left', `${xScale(years[i])}px`)
        .style('top', `${yScale(months[d.month - 1]) - 50}px`)
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

  d3.select('body').on('mouseout', () => console.log('ddd'));
});
