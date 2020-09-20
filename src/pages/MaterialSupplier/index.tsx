import React, {useRef, useState} from 'react';
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {Button, Divider, Modal} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import {
  deleteMaterialSupplierById, getMaterialSupplierPageByCompanyId,
  insertMaterialSupplier,
  updateMaterialSupplierById
} from "@/pages/MaterialSupplier/service";
import {MaterialSupplierDataType, MaterialSupplierQueryParamsDataType} from "@/pages/MaterialSupplier/data";
import MaterialSupplierForm from "@/pages/MaterialSupplier/components/MaterialSupplierForm";


const confirm = Modal.confirm;

const MaterialSupplier: React.FC<{}> = () => {

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
        const res = await deleteMaterialSupplierById(id);
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

  const handleFinish = async (values: Partial<MaterialSupplierDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateMaterialSupplierById(currentId, values);
    } else {
      // 新建
      await insertMaterialSupplier(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<MaterialSupplierDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '供货商名称',
      dataIndex: 'name',
    },
    {
      title: '供货商地址',
      dataIndex: 'position',
    },
    {
      title: '供货商联系人',
      dataIndex: 'liaison',
    },
    {
      title: '联系人电话',
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
      <ProTable<MaterialSupplierDataType>
        rowKey={"id"}
        headerTitle={"原材供货商"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: MaterialSupplierQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20
          };
          return await getMaterialSupplierPageByCompanyId(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>
          ]
        }}
      />

      <MaterialSupplierForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )



};

export default MaterialSupplier;
