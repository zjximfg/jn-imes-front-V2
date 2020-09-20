import React, {useRef, useState} from 'react';
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {Button, Divider, Modal} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {DeviceSupplierDataType, DeviceSupplierQueryParamsDataType} from "@/pages/DeviceSupplier/data";
import {
  deleteDeviceSupplierById,
  getDeviceSupplierPageByCompanyId,
  insertDeviceSupplier,
  updateDeviceSupplierById
} from "@/pages/DeviceSupplier/service";
import ProTable from '@ant-design/pro-table';
import DeviceSupplierForm from "@/pages/DeviceSupplier/components/DeviceSupplierForm";


const confirm = Modal.confirm;

const DeviceSupplier: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState<boolean>(false);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [type, setType] = useState<string>("create");

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

  const handleDelete = (id: string) => {
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        const res = await deleteDeviceSupplierById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reloadAndRest();
        }
      }
    })
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setVisible(false);
  };

  const handleFinish = async (values: Partial<DeviceSupplierDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateDeviceSupplierById(currentId, values);
    } else {
      // 新建
      await insertDeviceSupplier(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<DeviceSupplierDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '供货商名称',
      dataIndex: 'name',
    },
    {
      title: '简称',
      dataIndex: 'shortName',
    },
    {
      title: '供货商代码',
      dataIndex: 'code',
    },
    {
      title: '联系人姓名',
      dataIndex: 'liaisonName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
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
            }}>编辑</a>
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
      <ProTable<DeviceSupplierDataType>
        rowKey={"id"}
        headerTitle={"设备供货商"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: DeviceSupplierQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20
          };
          return await getDeviceSupplierPageByCompanyId(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>
          ]
        }}
      />

      <DeviceSupplierForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )



};

export default DeviceSupplier;
