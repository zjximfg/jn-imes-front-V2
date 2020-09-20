import {Button, Modal, Tag} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {DevicePropertyDataType} from "@/pages/DeviceProperty/data";
import {ArrowLeftOutlined, ArrowRightOutlined, PoweroffOutlined} from "@ant-design/icons/lib";
import {getReadPropertyListByDeviceId} from "@/pages/Device/service";
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {CompatClient, Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {MqttResultDataType} from "@/pages/Device/data";
import {getCurrentCompanyDeviceConnection} from "@/pages/Company/service";
import {DeviceConnectionDataType} from "@/pages/Company/data";

interface ReadPropertyViewProps {
  visible: boolean;
  currentId: string | undefined;
  gatewayId: string | undefined;
  enableOnline: boolean;
  onCancel: () => void;
}

let socket;
let stompClient: CompatClient | undefined;

let headers: {'Authorization': string};

const ReadPropertyView: React.FC<ReadPropertyViewProps> = (props) => {

  const actionRef = useRef<ActionType>();

  const {visible, currentId, gatewayId, enableOnline, onCancel} = props;

  const [devicePropertyList, setDevicePropertyList] = useState<DevicePropertyDataType[]>([]);

  const [deviceConnetion, setDeviceConnection] = useState<Partial<DeviceConnectionDataType>>({});

  const [loading, setLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("离线状态！");

  const [disabled, setDisabled] = useState<boolean>(true);


  useEffect(() => {
    if (currentId) {
      getReadPropertyListByDeviceId(currentId).then(res => {
        setDevicePropertyList(res);
      });
      getCurrentCompanyDeviceConnection().then(res => {
        setDeviceConnection(res);
        if (res===null || res.mqttServiceIp === null || res.mqttServicePort === null) {
          setDisabled(true);
          setMessage("贵公司没有配置设备的连接信息！请设置或联系软件服务部门帮助设置！")
        } else {
          setDisabled(false);
        }
      })
    } else {
      setDevicePropertyList([]);
    }
  }, [currentId]);

  const handleOnline = () => {
    if (gatewayId === null  || gatewayId === undefined) return;
    // socket = new SockJS( "http://localhost:10001/socket");
    socket = new SockJS("http://" + deviceConnetion.mqttServiceIp + ":" + deviceConnetion.mqttServicePort + "/socket");
    stompClient = Stomp.over(socket);

    if (localStorage.getItem('token')) {
      headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };
    } else {
      setMessage("未登录，请重新登录.....当前时间：" + (new Date()).toLocaleTimeString());
      return;
    }
    setMessage("正在连接服务端.....请稍等！！！当前时间：" + (new Date()).toLocaleTimeString());
    setLoading(true);
    stompClient.connect(headers, () => {
      setMessage("已经连接上服务端。当前时间：" + (new Date()).toLocaleTimeString());
      if (stompClient === undefined) return;
      stompClient.send("/app/subscribe", headers, currentId);
      stompClient.subscribe("/topic/" + gatewayId, (res) => {
        const mqttResult = JSON.parse(res.body) as MqttResultDataType;
        const newValues = devicePropertyList.map(item => {
          if (item.id === mqttResult.id) {
            item.time = mqttResult.time;
            item.value = mqttResult.value;
          }
          return item;
        });
        setDevicePropertyList(newValues);
        setMessage("接收到数据.....当前时间：" + (new Date()).toLocaleTimeString());
      }, headers);
    }, () => {
      // onErr
      setMessage("连接发生故障！！！当前时间：" + (new Date()).toLocaleTimeString());
      setLoading(false);
    }, () => {
      // onDisconnect
      setMessage("连接断开！！！当前时间：" + (new Date()).toLocaleTimeString());
      setLoading(false);
    })
  }

  const handleDisconnect = () => {
    // console.log(stompClient)
    if (stompClient !== null && stompClient !== undefined) {
      stompClient.send("/app/disconnect", headers, currentId);
      stompClient.disconnect(() => {
        setMessage("关闭了与服务器的连接" + (new Date()).toLocaleTimeString());
      });
    }
    setLoading(false);
    stompClient = undefined;
    socket = null;
  };

  const renderTableAlert = () => {
    return (
      <div>
        在线状态：
        <span>
              {message}
            </span>
      </div>
    )
  };

  const columns: ProColumns<DevicePropertyDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
    },
    {
      title: '变量地址',
      dataIndex: 'variableAddress',
    },
    {
      title: '变量地址',
      dataIndex: 'variableType',
      render: (text, record) => {
        return (
          <Tag color={"blue"} key={record.variableType}>
            {record.variableType}
          </Tag>
        )
      }
    },
    {
      title: '数据流向',
      dataIndex: 'category',
      render: (text, record) => {
        return record.category === 1? (
          <div>
            <span>网关</span>
            <ArrowRightOutlined />
            <span>平台</span>
          </div>
        ): (
          <div>
            <span>网关</span>
            <ArrowLeftOutlined />
            <span>平台</span>
          </div>
        );
      }
    },
    {
      title: '当前数值',
      render: (text, record) => {
        return (
          <Tag color={"blue"} key={record.value}>
            {record.value}
          </Tag>
        )
      }
    },
    {
      title: '当前数值',
      render: (text, record) => {
        return (
          <Tag color={"blue"} key={record.time}>
            {record.time}
          </Tag>
        )
      }
    },
  ];

  const renderView = (): React.ReactNode => {
    return (
      <ProTable<DevicePropertyDataType>
        rowKey={"id"}
        headerTitle={"属性列表"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        dataSource={devicePropertyList}
        pagination={false}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              icon={<PoweroffOutlined />}
              disabled={!enableOnline || disabled}
              loading={loading}
              onClick={() => handleOnline()}
            >
              在线
            </Button>,
            <Button onClick={handleDisconnect}>
              离线
            </Button>
          ]
        }}
        tableAlertRender={renderTableAlert}
        rowSelection={{}}
      />
    )
  };

  return (
    <Modal
      title={"设备接收的属性"}
      visible={visible}
      footer={null}
      width={1200}
      onCancel={() => {
        handleDisconnect();
        onCancel();
      }}
    >
      {renderView()}
    </Modal>
  )
};

export default ReadPropertyView;
