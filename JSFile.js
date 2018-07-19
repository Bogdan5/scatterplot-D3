let req = new XMLHttpRequest();
let jsonData = [];
req.open('GET',
'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
true);
req.send();
req.onload = () => {
  jsonData = JSON.parse(req.responseText);
  console.log(jsonData);
  let parser = d3.timeParse('%M:%S');
  let data = jsonData.reduce((acc, item) => acc.concat([{
    time: parser(item.Time),
    place: item.Place,
    seconds: item.Seconds,
    name: item.Name,
    year: new Date(`${(item.Year)}`),
    doping: item.Doping,
  },
  ]), []);
  drawScatterPlot(data);
};

const drawScatterPlot = (data) => {
console.log(data);
  //dimensions of the chart element
  const w = 700;
  const h = 500;
  const margin = { top: 20, right: 80, bottom: 20, left: 100, };
  const r = 5;


  //svg container for the charset
  const svg = d3.select('body')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr('class', 'containerSVG');

  //scales for the x and y axes
  let xScale = d3.scaleTime();
  let yScale = d3.scaleTime();
  xScale.domain([d3.min(data, (d) => d.year),
    new Date(`${d3.max(data, (d) => d.year).getFullYear() + 1}`)])
    .range([0, w]);
  yScale.domain([d3.min(data, (d) => d.time), d3.max(data, (d) => d.time)])
    .range([h, 0]);
console.log(d3.min(data, (d) => d.year), d3.max(data, (d) => d.year));
  //scatter plots added to the graph
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.year) + margin.left)
    .attr('cy', (d) => h + margin.top - yScale(d.time))
    .attr('r', r)
    .attr('class', 'dot')
    .style('fill', (d) => d.doping ? 'blue' : 'red')
    .attr('data-xvalue', (d) => d.year)
    .attr('data-yvalue', (d) => d.time);

  //x and y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg.append('g').attr('transform', `translate(${margin.left}, ${h + margin.top})`)
    .call(xAxis);
  svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);
};
