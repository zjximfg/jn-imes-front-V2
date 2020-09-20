import React, {useEffect} from 'react';
import {
  FullScreenContainer,
  BorderBox1,
  BorderBox2,
} from '@jiaminghi/data-view-react'

import {Row} from 'antd';
import './index.less'
import {BorderLeftOutlined} from "@ant-design/icons/lib";
import {fullScreen} from "../../utils/dataVUtils";
import TopLeftCmp from "./components/TopLeftCmp";
import BottomLeftTable1 from "./components/BottomLeftTable1";
import TopMiddleCmp from "./components/TopMiddleCmp";
import TopRightCmp from "./components/TopRightCmp";
import BottomRightTable1 from './components/BottomRightTable1';
import BottomRightTable2 from './components/BottomRightTable2';
import {history} from "umi";



const style = { width: '5px', height: '45%' };

const style2 = {
  width: '120px',
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
  marginLeft: '200px',
};



const Overview = () => {

  useEffect(() => {
    fullScreen()
  });




  return (
    <>
      <div id="data-view">
        <FullScreenContainer>
          <div className="main-header" style={{marginBottom:50, marginLeft:20}}>
            <div className="mh-left">
              <BorderLeftOutlined />
              <a onClick={ () => {
                history.push('/company');
              }} style={{marginLeft: 20}}>
                返回管理系统
              </a>
            </div>
            <div className="mh-middle">Demo-钢筋加工信息化平台</div>
            <div className="mh-right">
              <BorderBox2 style={style2}>设备档案馆</BorderBox2>
            </div>
          </div>

          <BorderBox1 className="main-container">
            <div className="mc-top">
              <TopLeftCmp />
              <TopMiddleCmp />
              <TopRightCmp />
            </div>
            <div className="mc-bottom">
              <div className="bottom-left-container">
              {/*<Decoration4 className="mcb-decoration-1" style={style} />*/}
              {/*<Decoration4 className="mcb-decoration-2" style={style} />*/}
              {/*<BottomLeftChart2 />*/}
                <BottomLeftTable1 />
                <BottomLeftTable1 style={{marginTop: 40}}/>
                <BottomLeftTable1 style={{marginTop: 40}}/>
              </div>

              <Row>
                <div className="bottom-right-container">
                  <BottomRightTable1 />
                  <BottomRightTable2 />
                  <BottomRightTable1 />
                  <BottomRightTable1 />
                </div>
              </Row>

            </div>
          </BorderBox1>
        </FullScreenContainer>
      </div>

    </>
  )
};

export default Overview;
