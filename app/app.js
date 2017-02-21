import * as d3 from 'd3';
/* eslint-disable */
// Load foundation
$(document).foundation();
// App css
require('style!css!sass!applicationStyles');
/* eslint-enable */
const height = window.innerHeight - 100;
const width = window.innerWidth - 200;
const svg = d3.select('body').append('svg').attr('height', '100%').attr('width', '100%');
const tooltip = d3.select('body').append('div')
                .style('opacity', '0')
                .style('position', 'absolute')
                .attr('class', 'toolTip')
                .style('padding', '5px')
                .style('background', 'lightgray');
fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then((data) => {
    const minTime = d3.min(data, d => d.Seconds);
    const maxTime = d3.max(data, d => d.Seconds);
    const margin = { top: 50, left: 50, right: 20, bottom: 0 };
    const y = d3.scaleLinear()
                .domain([1, 36])
                .range([0, height]);
    const x = d3.scaleLinear()
                .domain([(maxTime - minTime) + 15, 0])
                .range([0, width]);
    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x);
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    chartGroup.selectAll('circle')
      .data(data)
      .enter().append('circle')
        .attr('class', 'circle')
        .attr('fill', d => d.Doping ? 'red' : 'darkgreen') // eslint-disable-line
        .attr('r', 5)
        .attr('cx', d => x(d.Seconds - minTime))
        .attr('cy', d => y(d.Place))
        .on('mousemove', (d) => {
          tooltip.style('opacity', '1')
                 .style('left', `${d3.event.pageX}px`)
                 .style('top', `${d3.event.pageY}px`);
                 // .style('left', `${width - (margin.right + margin.left)}px`)
                 // .style('top', `${height / 2}px`);
          tooltip.html(`<p><strong>Biker:</strong> ${d.Name}, ${d.Nationality}
                        <p><strong>Year:</strong>  ${d.Year}</p>
                        <p><strong>Seconds Behind:</strong> ${d.Seconds - minTime}</p>
                        <p><strong>Headline:</strong> ${d.Doping || 'None'}</p>
                        <a href="${d.URL}" target="_blank">Wikipedia Article</a>
                      `);
        });
    chartGroup.selectAll('text')
      .data(data)
      .enter().append('text')
      .attr('x', d => x(d.Seconds - minTime - 3))
      .attr('y', d => y(d.Place + 0.25))
      .text(d => d.Name);
    chartGroup.append('g')
      .attr('class', 'axis')
      .call(yAxis);
    chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'axis')
      .call(xAxis);
    chartGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${width / 2}, -30)`)
                .text('DOPING IN PROFESSIONAL RACING');
    chartGroup.append('text')
              .attr('text-anchor', 'middle')
              .attr('transform', `translate(${width / 2}, -10)`)
              .text("35 Fastest Times up Alpe d'Huez");
    chartGroup.append('text')
              .attr('text-anchor', 'middle')
              .attr('transform', `translate(${width / 2}, ${height + margin.top})`)
              .text('Seconds Behind Fastest Time');
    chartGroup.append('text')
              .attr('transform', `translate(-${margin.left / 2}, ${height / 2})rotate(-90)`)
              .text('Ranking');
  });
