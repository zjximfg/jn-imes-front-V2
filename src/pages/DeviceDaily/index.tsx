import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Alert, Badge, Button, Calendar, Col, Layout, Menu, Row} from "antd";
import {EditOutlined, MailOutlined, SlidersOutlined} from "@ant-design/icons/lib";
import {DeviceDataType} from "@/pages/Device/data";
import {getDeviceListByCompanyId} from "@/pages/Device/service";
import {ClickParam} from "antd/lib/menu";
import moment, {Moment} from 'moment';
import {DeviceDailyDataType} from "@/pages/DeviceDaily/data";
import {
  getDeviceDailyByDeviceIdAndDate,
  getDeviceDailyList,
  insertDeviceDaily,
  updateDeviceDailyById
} from "@/pages/DeviceDaily/service";
import TextLoop from 'react-text-loop';
import DeviceDailyForm from "@/pages/DeviceDaily/components/DeviceDailyForm";

import styles from './index.less';

const {SubMenu} = Menu;
const {Content, Sider} = Layout;

const DeviceDaily: React.FC<{}> = () => {

  const [deviceList, setDeviceList] = useState<DeviceDataType[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [selectedYear, setSelectedYear] = useState<number>(moment().year());
  const [selectedMonth, setSelectedMonth] = useState<number>(moment().month());
  const [deviceDailyList, setDeviceDailyList] = useState<DeviceDailyDataType[]>([]);
  const [current, setCurrent] = useState<DeviceDailyDataType | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    getDeviceListByCompanyId().then(res => {
      setDeviceList(res);
      if (res && res.length > 0) {
        setSelectedKey(res[0].id);
      }
    })
  }, []);

  useEffect(() => {
    if (selectedKey !== undefined){
      // 获取当前月的所有的值
      getDeviceDailyList(selectedKey, selectedYear, selectedMonth).then(res => {
        setDeviceDailyList(res);
      });
      // 获取当前的值
      getDeviceDailyByDeviceIdAndDate(selectedKey, selectedDate.format("YYYY-MM-DD")).then(res => {
        setCurrent(res);
      });
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    if (selectedKey !== undefined){
      // 获取当前的值
      getDeviceDailyByDeviceIdAndDate(selectedKey, selectedDate.format("YYYY-MM-DD")).then(res => {
        setCurrent(res);
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedKey !== undefined) {
      // 获取当前月的所有的值
      getDeviceDailyList(selectedKey, selectedYear, selectedMonth).then(res => {
        setDeviceDailyList(res);
      });
    }
  },[selectedMonth, selectedYear]);


  const handleClick = (e: ClickParam) => {
    setSelectedKey(e.key);

  };

  const onSelect = (value: Moment) => {
    setSelectedDate(value);
  };

  const onPanelChange = (value: Moment)=> {
    setSelectedDate(value);
    setSelectedYear(value.year());
    setSelectedMonth(value.month());
  };

  const handleEdit = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setCurrent(undefined);
    setVisible(false);
  };

  const handleFinish = async (values: Partial<DeviceDailyDataType>) => {
    // 赋值当前时间
    values.date = selectedDate.format("YYYY-MM-DD");
    // 赋值设备id
    if (selectedKey === undefined) return;
    values.deviceId = selectedKey;
    if (current && current.id !== null) {
      // 编辑
      await updateDeviceDailyById(current.id, values);
    } else {
      // 新建
      await insertDeviceDaily(values);
    }
    setVisible(false);
    setCurrent(undefined);
    if (selectedKey === undefined) return;
    getDeviceDailyList(selectedKey, selectedYear, selectedMonth).then(res => {
      setDeviceDailyList(res);
    });
    // 获取当前的值
    getDeviceDailyByDeviceIdAndDate(selectedKey, selectedDate.format("YYYY-MM-DD")).then(res => {
      setCurrent(res);
    });
  };

  const renderCell = (date: Moment): React.ReactNode => {
    const data = deviceDailyList.find(deviceDaily => {
      const dataMonth = moment(deviceDaily.date).month();
      const dataDate = moment(deviceDaily.date).date();
      return dataDate === date.date() && dataMonth === date.month();
    });
    if (data === undefined) return;
    return (
      <ul className={styles.events}>
          <li key={data.id}>
            <Badge status={"success"} text={"当日累计产能:" + data.yieldSummary + "件"} />
          </li>
      </ul>
    )
  };

  const renderTextLoop = (): React.ReactNode => {
    if (current === undefined || current === null || !current) {
      return (
        <TextLoop mask>
          <div>还没有数据</div>
          <div>请编辑来添加数据</div>
        </TextLoop>
      )
    } else {
      return (
        <TextLoop mask>
          <div>设备每日停机小时数：{current.statusStopHour}小时</div>
          <div>设备每日待机小时数：{current.statusAwaitHour}小时</div>
          <div>设备每日故障小时数：{current.statusFaultHour}小时</div>
          <div>设备每日运行小时数：{current.statusRunHour}小时</div>
          <div>设备每日产能累计：{current.yieldSummary}件</div>
        </TextLoop>
      )
    }
  };

  return (
    <PageContainer>
      <Row gutter={5}>
        <Col span={24}>
          <Layout style={{background: '#fff', padding: '24px 0', minHeight: '80vh'}} >
            <Sider style={{background: '#fff'}} width={230}>
              <Menu
                onClick={handleClick}
                style={{ height: '100%' }}
                defaultOpenKeys={['deviceList']}
                selectedKeys={selectedKey? [selectedKey]: []}
                mode="inline"
              >
                <SubMenu key="deviceList"
                         title={
                           <span>
                            <MailOutlined/>
                            <span>设备列表</span>
                           </span>
                         }
                >
                  {
                    deviceList.map(device => {
                      return (
                        <Menu.Item key={device.id} icon={<SlidersOutlined/>}>{device.name}</Menu.Item>
                      )
                    })
                  }
                </SubMenu>
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 200 }}>
              <Row>
                <div>
                  <Alert
                    description={
                      renderTextLoop()
                    }
                    type="info"
                    showIcon
                    message={

                    <Row >
                      <Col span={16}>{`您选择的日期为: ${selectedDate && selectedDate.format('YYYY-MM-DD')}`}</Col>
                      <Col span={8} style={{textAlign: 'right'}}>
                        <Button type={"primary"} onClick={() => handleEdit()} disabled={!disabled}>
                          <EditOutlined/> 编辑
                        </Button>
                      </Col>
                    </Row>}
                  />
                  <Calendar value={selectedDate} onSelect={onSelect} onPanelChange={onPanelChange} dateCellRender={renderCell}/>
                </div>
              </Row>
            </Content>
          </Layout>
        </Col>
      </Row>
      <DeviceDailyForm visible={visible} current={current} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )

};

export default DeviceDaily;
