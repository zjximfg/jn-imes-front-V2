import React, {useEffect, useRef, useState} from 'react';
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {Button, Divider, Modal} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {DeviceSupplierDataType, DeviceSupplierQueryParamsDataType} from "@/pages/DeviceSupplier/data";
import {
  getDeviceSupplierListByCompanyId,
} from "@/pages/DeviceSupplier/service";
import ProTable from '@ant-design/pro-table';
import {
  deleteDeviceById,
  getDevicePageByCompanyId,
  insertDevice,
  updateDeviceById
} from "@/pages/Device/service";
import {DeviceDataType} from "@/pages/Device/data";
import DeviceForm from "@/pages/Device/components/DeviceForm";
import {getDeviceTemplateList} from "@/pages/DeviceTemplate/service";
import {DeviceTemplateDataType} from "@/pages/DeviceTemplate/data";
import ReadPropertyView from "@/pages/Device/components/ReadPropertyView";

const confirm = Modal.confirm;

const DeviceSupplier: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState<boolean>(false);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [gatewayId, setGatewayId] = useState<string | undefined>(undefined);

  const [enableOnline, setEnableOnline] = useState<boolean>(false);

  const [type, setType] = useState<string>("create");

  const [deviceSupplierList, setDeviceSupplierList] = useState<DeviceSupplierDataType[]>([]);

  const [deviceTemplateList, setDeviceTemplateList] = useState<DeviceTemplateDataType[]>([]);

  const [readPropertyVisible, setReadPropertyVisible] = useState<boolean>(false);

  const [writePropertyVisible, setWritePropertyVisible] = useState<boolean>(false);

  useEffect(() => {
    getDeviceSupplierListByCompanyId().then(res => {
      if (res)
      setDeviceSupplierList(res);
    });
    getDeviceTemplateList().then(res => {
      setDeviceTemplateList(res);
    })
  }, []);

  const handleEdit = (id: string) => {
    setCurrentId(id);
    setType("edit");
    setVisible(true);
  };

  const handleAdd = () => {
    setCurrentId(undefined);
    setType("create");
    setVisible(true);
  };

  const handleReadView = (device: Partial<DeviceDataType>) => {
    setCurrentId(device.id);
    setGatewayId(device.gatewayId);
    setEnableOnline(device.gatewayId !== null);
    setReadPropertyVisible(true);
  };

  const handleWriteView = (id: string) => {
    setCurrentId(id);
    setWritePropertyVisible(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        const res = await deleteDeviceById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reloadAndRest();
        }
      }
    })
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setGatewayId(undefined);
    setVisible(false);
    setReadPropertyVisible(false);
  };

  const handleFinish = async (values: Partial<DeviceDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateDeviceById(currentId, values);
    } else {
      // 新建
      await insertDevice(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    setGatewayId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<DeviceDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备编号',
      dataIndex: 'code',
    },
    {
      title: '用途',
      dataIndex: 'usage',
    },
    {
      title: '功能',
      dataIndex: 'function',
    },
    {
      title: '设备供货商',
      render: (text, record) => deviceSupplierList.find(item => record.supplierId === item.id)?.name
    },
    {
      title: '设备模板',
      render: (text, record) => deviceTemplateList.find(item => record.templateId === item.id)?.name
    },
    {
      title: '网关ID',
      dataIndex: 'gatewayId',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <a onClick={e => {
              e.preventDefault();
              handleEdit(record.id);
            }}>编辑设备</a>
            <Divider type={"vertical"}/>
            <a onClick={e => {
              e.preventDefault();
              handleReadView(record);
            }}>查看接收属性</a>
            <Divider type={"vertical"}/>
            <a onClick={e => {
              e.preventDefault();
              handleWriteView(record.id);
            }}>查看发送属性</a>
            <Divider type={"vertical"}/>
            <a onClick={e => {
              e.preventDefault();
              handleDelete(record.id);
            }}>删除</a>
          </>
        )
      }
    }
  ];

  return (
    <PageContainer>
      <ProTable<DeviceDataType>
        rowKey={"id"}
        headerTitle={"设备信息"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: DeviceSupplierQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20
          };
          return await getDevicePageByCompanyId(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>
          ]
        }}
      />
      <DeviceForm visible={visible} type={type} currentId={currentId} supplierList={deviceSupplierList} templateList={deviceTemplateList} onCancel={handleCancel} onFinish={handleFinish}/>
      <ReadPropertyView visible={readPropertyVisible} currentId={currentId} gatewayId={gatewayId} enableOnline={enableOnline} onCancel={handleCancel}/>
    </PageContainer>
  )



};

export default DeviceSupplier;
