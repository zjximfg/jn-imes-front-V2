import React from 'react';

import { BorderBox6, ScrollBoard } from '@jiaminghi/data-view-react'
import icon from '@/pages/Overview/img/icon3.png'
import './BottomRightTable1.less'


const BottomLeftTable1 = () => {

  const config = {
    header: ['构件', '重量', '进度'],
    data: [
      ['大世界商务广场', '0.20', '73%'],
      ['中铁二十一局', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
      ['大世界商务广场', '0.20', '73%'],
    ],
    index: false,
    columnWidth: [150, 80, 80],
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
          加工中的构件
        </div >
        <ScrollBoard config={config}  style={{width: '280px', height: '300px'}}/>
      </BorderBox6>
    </div>
  )
};

export default BottomLeftTable1;
