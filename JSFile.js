// function that retrieves the data and calls drawScatterPlot
const getData = () => {
  let req = new XMLHttpRequest();
  let jsonData = [];
  req.open('GET',
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  true);
  req.send();
  req.onload = () => {
    jsonData = JSON.parse(req.responseText);
    let parser = d3.timeParse('%M:%S');
    let data = jsonData.reduce((acc, item) => acc.concat([{
      ...item,
      time: parser(item.Time),
    },
    ]), []);
    drawScatterPlot(data);
  };
};

getData();

const drawScatterPlot = (data) => {
  //dimensions of the chart element
  console.log(data[0]);
  const w = 700;
  const h = 500;
  const margin = { top: 20, right: 80, bottom: 20, left: 100, };
  const r = 5;
  const minYear = d3.min(data, (d) => d.Year);

  //svg container for the charset
  const container = d3.select('body')
    .append('div')
    .attr('class', 'container')
    .style('width', `${w + margin.left + margin.right}px`);

  //svg element including the graph
  const svg = container
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr('class', 'containerSVG');

  //scales for the x and y axes
  let xScale = d3.scaleLinear();
  let yScale = d3.scaleTime();
  xScale.domain([minYear - 1, d3.max(data, (d) => d.Year) + 1])
    .range([0, w]);//domain increased to introduce padding laterally
  yScale.domain([d3.max(data, (d) => d.time), d3.min(data, (d) => d.time)])
    .range([h, 0]);

  //tooltip - a group wrapping a rect and text inside it
  let tooltip = container.append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden');

  let paragraph1 = tooltip.append('p');
  let paragraph2 = tooltip.append('p');
  let paragraph3 = tooltip.append('p');

  //scatter plots added to the graph
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.Year) + margin.left)
    .attr('cy', (d) => margin.top + yScale(d.time))
    .attr('r', r)
    .attr('class', 'dot')
    .style('fill', (d) => d.Doping ? 'red' : 'blue')
    .style('stroke', 'black')
    .style('fill-opacity', 0.6)
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => d.time)
    .on('mouseover', (d, i) => {//tooltip appears when mouse over item
      console.log(d.Year);
      tooltip.style('visibility', 'visible')
        .style('left', `${margin.left + xScale(d.Year)}px`)
        .style('top', `${margin.top + yScale(d.time)}px`)
        .attr('data-year', `${d.Year}`);
      paragraph1.text(`${d.Name} (${d.Nationality})`);
      paragraph2.text(`${d.Year} - ${d.Time}`);
      paragraph3.text(`${d.Doping}`);
    })
    .on('mouseout', (d) => {
      tooltip.style('visibility', 'hidden');
    });

  //x and y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg.append('g').attr('transform', `translate(${margin.left}, ${h + margin.top})`)
    .attr('id', 'x-axis')
    .call(xAxis.tickFormat(d3.format('d')));
  svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'y-axis')
    .call(yAxis.tickFormat(d3.timeFormat('%M:%S')));

  //adding legend
  const legend = container.append('div')
    .attr('id', 'legend')
    .attr('class', 'legend')
    .style('left', `${w + margin.left - 260}px`)
    .style('top', `${margin.top + 30}px`);

  const rowTop = legend.append('div');
  const rowBottom = legend.append('div');
  rowTop.append('div').text('No doping allegations').attr('class', 'textLegend');
  rowTop.append('div').attr('class', 'rect noAllegations');
  rowBottom.append('div').text('Doping allegations').attr('class', 'textLegend');
  rowBottom.append('div').attr('class', 'rect allegations');
};
