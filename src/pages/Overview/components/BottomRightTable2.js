import React from 'react';

import { BorderBox6, ScrollBoard } from '@jiaminghi/data-view-react'
import icon from '@/pages/Overview/img/icon3.png'
import './BottomRightTable1.less'


const BottomLeftTable2 = () => {

  const config = {
    header: ['计划v', '构件', '重量'],
    data: [
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],
      ['08:30', '中铁二十一局沈阳东路快速通道工程', '2.79'],

    ],
    index: false,
    columnWidth: [80, 300, 50],
    align: ['center'],
    headerBGC: 'rgba(50, 37, 50, 0.4)',
    oddRowBGC: 'rgba(9, 37, 50, 0.4)',
    evenRowBGC: 'rgba(10, 32, 50, 0.3)',
  };


  return (
    <div >
      <BorderBox6 className="bottom-right-table-1">
        <div className="table-name">
          <img src={icon} alt="icon" />
          待出库
        </div >
        <ScrollBoard config={config}  style={{width: '400px', height: '300px'}}/>
      </BorderBox6>
    </div>
  )
};

export default BottomLeftTable2;
