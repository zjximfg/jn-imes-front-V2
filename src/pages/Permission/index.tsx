import React, {useRef, useState} from 'react';
import {Button, Divider, Modal} from "antd";
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {PermissionDataType} from "@/pages/Permission/data";
import {PermissionType} from '@/pages/Permission/data.d.ts';
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {
  deletePermissionById,
  getPermissionList,
  insertPermission,
  updatePermissionById
} from "@/pages/Permission/service";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import {listToTreeTable} from "@/utils/utils";
import PermissionMenu from "@/pages/Permission/components/PermissionMenu";
import PermissionPoint from "@/pages/Permission/components/PermissionPoint";
import PermissionApi from "@/pages/Permission/components/PermissionApi";


const confirm = Modal.confirm;

const Permission: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [currentParentId, setCurrentParentId] = useState<string | undefined>(undefined);

  const [permissionType, setPermissionType] = useState<number>(1);

  const [type, setType] = useState<string>("create");

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const [pointVisible, setPointVisible] = useState<boolean>(false);

  const [apiVisible, setApiVisible] = useState<boolean>(false);

  const handleAdd = (parentId: string, permissionType: number) => {
    setCurrentId(undefined);
    setCurrentParentId(parentId);
    setPermissionType(permissionType);
    setType("create");
    switch (permissionType) {
      case 1:
        setMenuVisible(true);
        break;
      case 2:
        setPointVisible(true);
        break;
      case 3:
        setApiVisible(true);
        break;
    }
  };

  const handleEdit = (id: string, permissionType: number) => {
    setCurrentId(id);
    setPermissionType(permissionType);
    setType("edit");
    switch (permissionType) {
      case 1:
        setMenuVisible(true);
        break;
      case 2:
        setPointVisible(true);
        break;
      case 3:
        setApiVisible(true);
        break;
    }
  };

  const handleCancel = () => {
    setCurrentParentId(undefined);
    setCurrentId(undefined);
    setMenuVisible(false);
    setPointVisible(false);
    setApiVisible(false);
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
        const res = await deletePermissionById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reloadAndRest();
        }
      }
    })
  };

  const handleFinish = async (values: Partial<PermissionDataType>) => {
    values.parentId = currentParentId;
    values.type = permissionType;
    if (currentId && type === 'edit') {
      // 编辑
      await updatePermissionById(currentId, values);
    } else {
      // 新建
      await insertPermission(values);
    }
    setApiVisible(false);
    setMenuVisible(false);
    setPointVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<PermissionDataType>[] = [
    {
      title: '权限名称',
      dataIndex: 'name',
    },
    {
      title: '权限标识',
      dataIndex: 'code',
    },
    {
      title: '权限类型',
      render: (text, record) => {
        const permissionType = PermissionType.find(item => item.id === record.type);
        return permissionType? permissionType.name: '';
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 500,
      render: (text, record) => {
        switch (record.type) {
          case 1:
            return (
              <>
                <a onClick={e=>{
                  e.preventDefault();
                  handleAdd(record.id, 1);
                }}>添加子菜单</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleAdd(record.id, 2);
                }}>添加权限点</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleAdd(record.id, 3);
                }}>添加API权限</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleEdit(record.id, record.type);
                }}>编辑</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleDelete(record.id);
                }}>删除</a>
              </>
            );
          case 2:
            return (
              <>
                <a onClick={e=>{
                  e.preventDefault();
                  handleAdd(record.id, 3);
                }}>添加API权限</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleEdit(record.id, record.type);
                }}>编辑</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleDelete(record.id);
                }}>删除</a>
              </>
            );
          case 3:
            return (
              <>
                <a onClick={e=>{
                  e.preventDefault();
                  handleEdit(record.id, record.type);
                }}>编辑</a>
                <Divider type={"vertical"}/>
                <a onClick={e=>{
                  e.preventDefault();
                  handleDelete(record.id);
                }}>删除</a>
              </>
            );
          default:
            return <></>
        }
      }
    },
  ];

  return (
    <PageContainer>
      <ProTable<PermissionDataType>
        rowKey={"id"}
        headerTitle={"权限列表"}
        columns={columns}
        actionRef={actionRef}
        search={false}
        pagination={false}
        request={ async () => {
          const response = await getPermissionList();
          const list = response.map(item => {
            item.key = item.id;
            return item;
          });
          const data = listToTreeTable<PermissionDataType>(list);
          return {data: data, success: true};
        }}
        toolBarRender={() => [
          <Button type={"primary"} onClick={() => handleAdd("0", 1)}>
            <PlusOutlined/> 新建
          </Button>
        ]}
      />
      <PermissionMenu visible={menuVisible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
      <PermissionPoint visible={pointVisible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
      <PermissionApi visible={apiVisible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )
};

export default Permission;
