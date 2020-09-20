import React from 'react';

import { BorderBox5, Decoration3} from '@jiaminghi/data-view-react';

const style = {width: '150px', height: '20px'};

import './TopLeftCmp.less';

const TopLeftCmp = () => {

  return (
    <div className={"top-left-cmp"}>
      <div className={"dc-left"}>
        <BorderBox5>
          <div className={"main-value"}>
            <span>0</span>件
          </div>
          <div className={"compare-value"}>
            <span>同比</span>81
          </div>
          <div className={"compare-value"}>
            <span>环比</span>15
          </div>
        </BorderBox5>
        <div className={"dc-text"}>
          累计产能
          <Decoration3 style={style}/>
        </div>
      </div>
      <div className={"dc-right"}>
        <div className={"dc-text"}>
          近7天平均产能
          <Decoration3 style={style}/>
        </div>
        <BorderBox5 reverse={true}>
          <div className={"main-value"}>
            <span>0/1</span>件 / 日
          </div>
          <div className={"compare-value"}>
            <span>同比</span>66
          </div>
          <div className={"compare-value"}>
            <span>环比</span>9
          </div>
        </BorderBox5>

      </div>
    </div>
  )

};

export default TopLeftCmp
