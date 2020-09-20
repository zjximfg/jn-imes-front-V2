import React from 'react'

import { Decoration3, Charts } from '@jiaminghi/data-view-react'

import './TopRightCmp.less'

const option = {
  legend: {
    data: [
      {
        name: '剪切线',
        color: '#00baff',
      },
      {
        name: '弯曲中心',
        color: '#ff5ca9',
      },
      {
        name: '焊网机',
        color: '#3de7c9',
      },
      {
        name: '弯箍机',
        color: '#f5d94e',
      },
    ],
    textStyle: {
      fill: '#fff',
    },
  },
  xAxis: {
    data: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07'],
    axisLine: {
      style: {
        stroke: '#999',
      },
    },
    axisLabel: {
      style: {
        fill: '#999',
      },
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    data: 'value',
    splitLine: {
      show: false,
    },
    axisLine: {
      style: {
        stroke: '#999',
      },
    },
    axisLabel: {
      style: {
        fill: '#999',
      },
    },
    axisTick: {
      show: false,
    },
    min: 0,
    max: 8,
  },
  series: [
    {
      name: '剪切线',
      data: [2.5, 3.5, 6.5, 6.5, 7.5, 6.5, 2.5],
      type: 'bar',
      barStyle: {
        fill: 'rgba(0, 186, 255, 0.4)',
      },
    },
    {
      name: '弯曲中心',
      data: [2.5, 3.5, 6.5, 6.5, 7.5, 6.5, 2.5],
      type: 'line',
      lineStyle: {
        stroke: '#ff5ca9',
      },
      linePoint: {
        radius: 4,
        style: {
          fill: '#ff5ca9',
          stroke: 'transparent',
        },
      },
    },
    {
      name: '焊网机',
      data: [1.3, 2.3, 5.3, 5.3, 6.3, 5.3, 1.3],
      type: 'line',
      smooth: true,
      lineArea: {
        show: true,
        gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)'],
      },
      lineStyle: {
        lineDash: [5, 5],
      },
      linePoint: {
        radius: 4,
        style: {
          fill: '#00db95',
        },
      },
    },
    {
      data: [0.2, 1.2, 4.2, 4.2, 5.2, 4.2, 0.2],
      type: 'line',
      name: '弯箍机',
      lineArea: {
        show: true,
        gradient: ['rgba(245, 217, 79, 0.8)', 'rgba(245, 217, 79, 0.2)'],
      },
      lineStyle: {
        stroke: '#f5d94e',
      },
      linePoint: {
        radius: 4,
        style: {
          fill: '#f5d94e',
          stroke: 'transparent',
        },
      },
    },
  ],
}

const style = { width: '200px', height: '20px' }

export default () => (
  <div className="top-right-cmp">
    <div className="chart-name">
      近7天设备产能
      <Decoration3 style={style} />
    </div>
    <Charts option={option} />
  </div>
)
