import React, {useRef, useState} from 'react';
import ProTable, {ProColumns} from '@ant-design/pro-table'
import {PageContainer} from "@ant-design/pro-layout";
import {CompanyDataType, DeviceConnectionDataType} from "@/pages/Company/data";
import {ActionType} from "@ant-design/pro-table/es/Table";
import {Button, Divider, Modal, Switch} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {
  deleteCompanyById,
  getCompanyList,
  insertCompany,
  updateCompanyById,
  updateDeviceConnectionByCompanyId
} from "@/pages/Company/service";
import CompanyForm from "@/pages/Company/components/CompanyForm";
import DeviceConnectionForm from "@/pages/Company/components/DeviceConnectionForm";

const confirm = Modal.confirm;

const Company: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [connectionVisible, setConnectionVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>("create");
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const columns: ProColumns<CompanyDataType>[] = [
    {
      title: '公司名称',
      dataIndex: 'name',
    },
    {
      title: '当前版本',
      dataIndex: 'version'
    },
    {
      title: '联系人',
      dataIndex: 'liaison',
    },
    {
      title: '公司电话',
      dataIndex: 'companyPhone',
    },
    {
      title: '所在地区',
      dataIndex: 'companyArea',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      render: (text, record) => {
        return (
          <Switch checked={record.state === 1} disabled/>
        )
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <a onClick={(e) => {
              e.preventDefault();
              handleEdit(record.id);
            }}>编辑企业信息</a>
            <Divider type={'vertical'}/>
            <a onClick={(e) => {
              e.preventDefault();
              handleConnectionEdit(record.id);
            }}>编辑设备连接信息</a>
            <Divider type={'vertical'}/>
            <a onClick={(e) => {
              e.preventDefault();
              handleDelete(record.id);
            }}>删除</a>
          </>
        )
      }
    }

  ];

  const handleAdd = () => {
    setCurrentId(undefined);
    setType("create");
    setVisible(true);
  };

  const handleEdit = (id: string) => {
    setCurrentId(id);
    setType("edit");
    setVisible(true);
  };

  const handleConnectionEdit = (id: string) => {
    setCurrentId(id);
    setConnectionVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setConnectionVisible(false);
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
        const res = await deleteCompanyById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reload();
        }
      }
    })
  };

  const handleFinish = async (values: Partial<CompanyDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateCompanyById(currentId, values);
    } else {
      // 新建
      await insertCompany(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reload();
  };

  const handleConnectionFinish = async (values: Partial<DeviceConnectionDataType>) => {
    if (!values || currentId === undefined) return;
    await updateDeviceConnectionByCompanyId(currentId, values);
    setConnectionVisible(false);
    setCurrentId(undefined);
  };

  return (
    <PageContainer>
      <ProTable<CompanyDataType>
        rowKey="id"
        request={() => {
          return getCompanyList().then(res => {
            return {data: res, success: true};
          });
        }}
        search={false}
        pagination={false}
        headerTitle={"企业列表"}
        actionRef={actionRef}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleAdd()}>
            <PlusOutlined/> 新建
          </Button>,
        ]}
      />
      <CompanyForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel}
                   onFinish={(values) => handleFinish(values)}/>
                   <DeviceConnectionForm visible={connectionVisible} currentId={currentId} onCancel={handleCancel} onFinish={handleConnectionFinish}/>
    </PageContainer>
  )
};

export default Company;
