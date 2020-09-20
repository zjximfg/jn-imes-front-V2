import React, {useRef, useState} from 'react';
import {Button, Divider, Modal} from "antd";
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {
  deleteRoleById,
  getRolePage,
  insertRole,
  updateRoleById,
  updateRolePermissionsByRoleId
} from "@/pages/Role/service";
import {RoleDataType, RoleQueryParamsDataType} from "@/pages/Role/data";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import RoleForm from "@/pages/Role/components/RoleForm";
import RolePermission from "@/pages/Role/components/RolePermission";

const confirm = Modal.confirm;

const Role: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState<boolean>(false);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [type, setType] = useState<string>("create");

  const [rolePermissionVisible, setRolePermissionVisible] = useState<boolean>(false);

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

  const handleAssign = (id: string) => {
    setCurrentId(id);
    setRolePermissionVisible(true);
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
        const res = await deleteRoleById(id);
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
    setRolePermissionVisible(false);
  };

  const handleFinish = async (values: Partial<RoleDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateRoleById(currentId, values);
    } else {
      // 新建
      await insertRole(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const handleRolePermissionOk = async (values: string[]) => {
    if (currentId == null) return;
    await updateRolePermissionsByRoleId(currentId, values);
    setRolePermissionVisible(false);
    if (actionRef.current) actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<RoleDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
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
              handleAssign(record.id);
            }}>分配权限</a>
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
      <ProTable<RoleDataType>
        rowKey={"id"}
        headerTitle={"权限列表"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: RoleQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20
          };
          return await getRolePage(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>
          ]
        }}
      />

      <RoleForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
      <RolePermission visible={rolePermissionVisible} currentId={currentId} onCancel={handleCancel} onOk={handleRolePermissionOk}/>
    </PageContainer>
  )


};


export default Role;
