import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Modal} from "antd";
import {ActionType} from "@ant-design/pro-table/es/Table";
import {ProColumns} from "@ant-design/pro-table/lib/Table";
import {CompanyDataType} from "@/pages/Company/data";
import {
  ExclamationCircleOutlined,
  ExportOutlined,
  HomeOutlined, ImportOutlined,
  UserOutlined
} from "@ant-design/icons/lib";
import {
  getCurrentCompany,
} from "@/pages/Company/service";
import {PageContainer} from "@ant-design/pro-layout";
import {DepartmentDataType} from "@/pages/Department/data";
import {
  deleteDepartmentById,
  getDepartmentList,
  insertDepartment,
  updateDepartmentById
} from "@/pages/Department/service";
import {listToTreeTable} from "@/utils/utils";
import ProTable from '@ant-design/pro-table';
import DepartmentForm from "@/pages/Department/components/DepartmentForm";

const confirm = Modal.confirm;

const Department: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>("create");
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [currentCompany, setCurrentCompany] = useState<Partial<CompanyDataType>>({});

  useEffect(() => {
    // 通过头信息，获取对应的company
    getCurrentCompany().then(res => {
      setCurrentCompany(res);
    });
  }, []);

  const columns: ProColumns<DepartmentDataType>[] = [
    {
      title: <><HomeOutlined /> {currentCompany? currentCompany.name: '公司名称'}</>,
      render: (text, record) => {
        const icon = record.children? <></> : <UserOutlined/>;
        return (
          <span>{icon} {record.name}</span>
        )
      },
    },
    {
      title: '负责人',
      dataIndex: 'manager'
    },
    {
      title: '部门编码',
      dataIndex: 'code',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
    },
    {
      title: <>
        <a onClick={e => {
          e.preventDefault();
          handleAdd("0");
        }}>添加子部门</a>
      </>,
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <a onClick={e => {
              e.preventDefault();
              handleAdd(record.id);
            }}>添加子部门</a>
            <Divider type={"vertical"}/>
            <a onClick={(e) => {
              e.preventDefault();
              handleEdit(record.id, record.parentId);
            }}>编辑</a>
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

  const handleAdd = (parentId: string) => {
    setParentId(parentId);
    setCurrentId(undefined);
    setType("create");
    setVisible(true);
  };

  const handleEdit = (id: string, parentId: string) => {
    setParentId(parentId);
    setCurrentId(id);
    setType("edit");
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentId(undefined);
    setParentId(undefined);
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
        const res = await deleteDepartmentById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reloadAndRest();
        }
      }
    })
  };

  const handleFinish = async (values: Partial<DepartmentDataType>) => {
    values.parentId = parentId;
    if (currentId && type === 'edit') {
      // 编辑
      await updateDepartmentById(currentId, values);
    } else {
      // 新建
      await insertDepartment(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const handleImport = async () => {
    // todo
  };

  const handleExport = async () => {
    // todo
  };

  return (
    <PageContainer>
      <ProTable<DepartmentDataType>
        rowKey="id"
        request={() => {
          return getDepartmentList().then(res => {
            const list = res.map((item) => {
              item.key = item.id;
              return item;
            });
            const data = listToTreeTable<DepartmentDataType>(list);
            return {data: data, success: true};
          });
        }}
        search={false}
        pagination={false}
        headerTitle={"部门列表"}
        actionRef={actionRef}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={handleImport}>
            <ImportOutlined /> 导入
          </Button>,
          <Button type="primary" onClick={handleExport}>
            <ExportOutlined />导出
          </Button>,
        ]}
      />
      <DepartmentForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )

};

export default Department;
