import React from 'react';

import { BorderBox6, ScrollBoard } from '@jiaminghi/data-view-react'
import icon from '@/pages/Overview/img/icon3.png'
import './BottomLeftTable1.less'


const BottomLeftTable1 = () => {

  const config = {
    header: ['规格/直径', '9mm', '12mm'],
    data: [
      ['φ16', '12.8', '0'],
      ['φ17', '12.8', '0'],
      ['φ18', '12.8', '0'],
      ['φ19', '12.8', '0'],
      ['φ20', '12.8', '0'],
      ['φ12', '12.8', '0'],
      ['φ22', '12.8', '0'],
      ['φ23', '12.8', '0'],
    ],
    index: false,
    columnWidth: [80, 80, 80],
    align: ['center'],
    headerBGC: 'rgba(50, 37, 50, 0.4)',
    oddRowBGC: 'rgba(9, 37, 50, 0.4)',
    evenRowBGC: 'rgba(10, 32, 50, 0.3)',
  };


  return (
    <div >
      <BorderBox6 className="bottom-left-table-1">
        <div className="table-name">
          <img src={icon} alt="icon" />
          原材库存统计
        </div >
        <ScrollBoard config={config}  style={{width: '280px', height: '130px'}}/>
      </BorderBox6>
    </div>
  )
};

export default BottomLeftTable1;
