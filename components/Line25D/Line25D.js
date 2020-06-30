import { axisBottom, axisLeft } from 'd3-axis/src/axis';
import area from 'd3-shape/src/area';
// 控制折线连接是否平滑
import { monotoneX } from 'd3-shape/src/curve/monotone';
import select from 'd3-selection/src/select';
import scaleLinear from 'd3-scale/src/linear';
import scaleTime from 'd3-scale/src/time';
import config from './config';
import dayjs from 'dayjs';
import Tooltip from './tooltip';
import addLabels from './addLabels';

// todo
// 1. wrap尺寸发生改变 重新绘制图形
// 2. 编写vue插件
// 3. 打成包

const colors = config.colors
const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};
const Z_STEP = 30; // 折线图沿z轴的距离
const Y_STEP = 40; // 折线图沿x轴的距离  和 Z_STEP 要配合好
const AXIOS_LINE_COLOR = '#809BB9'; // 坐标轴的颜色
const STAGE_OFFSET = 12;

class Line25D {
  constructor(container, { title, xLabel, yLabel, data: { datasets }, options }) {
    if (title) {
      this.title = title;
      margin.top = 60;
    }
    if (xLabel) {
      this.xLabel = xLabel;
      margin.bottom = 70;
    }
    if (yLabel) {
      this.yLabel = yLabel;
      margin.left = 60;
    }
    this.datasets = datasets;
    this.options = options;

    // 获取父级元素的宽高，与svg的相等
    const containerWidth = container.clientWidth,
      containerHeight = container.clientHeight;
    // 插入 svg 元素
    this.svgEl = select(container)
      .append('svg')
      .style('stroke-width', 1)
      .attr('width', containerWidth)
      .attr('height', containerHeight);
    this.svgEl.selectAll('*').remove();

    // 图表的宽高
    this.width = containerWidth - margin.left - margin.right;
    this.height = containerHeight - margin.top - margin.bottom;

    // 将 图表 偏移一定距离
    this.chart = this.svgEl
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // init tooltip
    this.tooltip = new Tooltip({
      parent: this.svgEl,
      title: title || '',
      items: [
        { color: '', text: '' },
        { color: '', text: '' },
      ],
      position: { x: 60, y: 60, type: config.positionType.downRight },
    });

    // render
    this.render();
  }

  render() {
    if (this.title) addLabels.title(this.svgEl, this.title);
    if (this.xLabel) addLabels.xLabel(this.svgEl, this.xLabel);
    if (this.yLabel) addLabels.yLabel(this.svgEl, this.yLabel);
    // handle datasets 现在只考虑一种情况 就是 x轴为时间
    // 将时间字符串改成dayjs对象
    this.datasets.forEach((item) => {
      if (item.data) {
        item.data.forEach((subItem) => (subItem.x = dayjs(subItem.x)));
      }
    });
    // 将不同指标的数据合到一起 是为了计算x轴的比例尺
    const allData = this.datasets.reduce((pre, cur) => pre.concat(cur.data), []);

    const allDataX = allData.map((item) => item.x);

    const allDataY = allData.map((item) => item.y);

    const graphPart = this.chart.append('g').attr('pointer-events', 'all');

    // 定义坐标轴比例尺
    const xScale = scaleTime()
      .domain([Math.min(...allDataX), Math.max(...allDataX)])
      .range([0, this.width]);
    const yScale = scaleLinear()
      .domain([Math.min(...allDataY), Math.max(...allDataY)])
      .range([this.height, 0]);

    // 算出y轴一格的间距
    // const yUnit = Math.ceil(Math.max(...allDataY) / 10 / this.options.yTickCount) * 10
    // this.yUnit = yUnit

    // 插入坐标轴
    graphPart
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .attr('class', 'x-axis')
      .call(
        axisBottom(xScale)
          .tickSize(0)
          .tickFormat((d) => dayjs(d).format('HH:mm'))
      );
    graphPart
      .append('g')
      .attr('class', 'y-axis')
      .call(axisLeft(yScale).tickSize(-this.width).ticks(this.options.yTickCount, 's'));

    // 插入底座
    graphPart
      .append('path')
      .attr(
        'd',
        `M0 ${this.height} L${Y_STEP + STAGE_OFFSET} ${this.height + Z_STEP + STAGE_OFFSET} 
        L${this.width + Y_STEP + STAGE_OFFSET} ${this.height + Z_STEP + STAGE_OFFSET}
        L${this.width} ${this.height} `
      )
      .style('stroke', AXIOS_LINE_COLOR)
      .style('fill', AXIOS_LINE_COLOR)
      .style('opacity', '0.4');

    // 插入分割线
    // this.appendXLine(graphPart, yScale)
    this.appendYLine(graphPart, xScale);

    // 折线图 带填充
    const theArea = area()
      .x((d) => xScale(d.x)) // x 轴坐标
      .y0(this.height) // y 轴坐标
      .y1((d) => yScale(d.y)) // y 轴坐标
    
    if (this.options.useMonotoneX) {
      theArea.curve(monotoneX)
    } 

    // render line
    graphPart
      .selectAll('.sam-chart-xyline')
      .data(this.datasets)
      .enter()
      .append('path')
      .attr('class', 'sam-chart-xyline')
      .attr('d', (d) => theArea(d.data)) // 'M1,0L20,40'
      .attr('fill', (d, i) => colors[i])
      .attr('fill-opacity', 0.8) // 透明度
      .attr('stroke', (d, i) => colors[i])
      .attr('transform', (d, i) => `translate(${i * Y_STEP}, ${i * Z_STEP})`);

    // render dots
    const dotInitSize = 3.5 * (this.options.dotSize === undefined ? 1 : this.options.dotSize);
    const dotHoverSize = 6 * (this.options.dotSize === undefined ? 1 : this.options.dotSize);
    graphPart
      .selectAll('.sam-chart-xycircle-group')
      .data(this.datasets)
      .enter()
      .append('g')
      .attr('class', '.sam-chart-xycircle-group')
      .attr('xy-group-index', (d, i) => i)
      .attr('transform', (d, i) => `translate(${i * Y_STEP}, ${i * Z_STEP})`)
      .selectAll('.sam-chart-xycircle-circle')
      .data((dataset) => dataset.data)
      .enter()
      .append('circle')
      .style('stroke', (d, i, nodes) => {
        // const xyGroupIndex = Number(select(nodes[i].parentElement).attr('xy-group-index'));
        return 'white';
      })
      .style('fill', (d, i, nodes) => {
        const xyGroupIndex = Number(select(nodes[i].parentElement).attr('xy-group-index'));
        return colors[xyGroupIndex];
      })
      .attr('r', dotInitSize)
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('pointer-events', 'all')
      .on('mouseover', (d, i, nodes) => {
        const xyGroupIndex = Number(select(nodes[i].parentElement).attr('xy-group-index'));
        select(nodes[i]).attr('r', dotHoverSize);

        const tipX = xScale(d.x) + margin.left + 5;
        const tipY = yScale(d.y) + margin.top + 5;
        let tooltipPositionType = config.positionType.downRight;
        if (tipX > this.width / 2 && tipY < this.height / 2) {
          tooltipPositionType = config.positionType.downLeft;
        } else if (tipX > this.width / 2 && tipY > this.height / 2) {
          tooltipPositionType = config.positionType.upLeft;
        } else if (tipX < this.width / 2 && tipY > this.height / 2) {
          tooltipPositionType = config.positionType.upRight;
        }
        this.tooltip.update({
          title: this.options.timeFormat
            ? dayjs(this.datasets[xyGroupIndex].data[i].x).format(this.options.timeFormat)
            : `${this.datasets[xyGroupIndex].data[i].x}`,
          items: [
            {
              color: colors[xyGroupIndex],
              text: `${this.datasets[xyGroupIndex].label || ''}: ${d.y}`,
            },
          ],
          position: {
            x: tipX,
            y: tipY,
            type: tooltipPositionType,
          },
        });
        this.tooltip.show();
      })
      .on('mouseout', (d, i, nodes) => {
        select(nodes[i]).attr('r', dotInitSize);

        this.tooltip.hide();
      });
  }

  // 插入x轴分割线 splitLine
  // appendXLine(wrap, yScale) {
  //   for (let i = 0; i < this.options.yTickCount; i++) {
  //     wrap.append("line")
  //     .attr("transform", `translate(0, ${yScale(this.yUnit * i)})`)
  //     .attr('x1', 0)
  //     .attr('y1', 0)
  //     .attr('x2', this.width)
  //     .attr('y2', 0)
  //     .attr("stroke", AXIOS_LINE_COLOR)
  //   }
  // }

  // 插入y轴分割线 splitLine
  appendYLine(wrap, xScale) {
    wrap
      .selectAll('.split-line-y')
      .data(this.datasets[0].data)
      .enter()
      .append('line')
      .attr('transform', (d) => `translate(${xScale(d.x)}, 0)`)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', this.height)
      .attr('stroke', AXIOS_LINE_COLOR);
  }
}

export { Line25D };
