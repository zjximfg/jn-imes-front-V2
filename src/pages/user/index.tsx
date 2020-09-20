import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, message, Modal, Switch, Upload} from "antd";
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {DepartmentDataType} from "@/pages/Department/data";
import {UserDataType, UserQueryParamsDataType} from "@/pages/user/data";
import {getDepartmentList} from "@/pages/Department/service";
import {ExclamationCircleOutlined, ExportOutlined, ImportOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {
  deleteUserById, exportUserExcel,
  getUserPage,
  importUserExcel,
  insertUser,
  updateUserById,
  updateUserRoleByUserId
} from "@/pages/user/service";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import UserForm from "@/pages/user/components/UserForm";
import UserRole from "@/pages/user/components/UserRole";
import {RcFile} from "antd/es/upload";
import {downloadCallback} from "@/utils/utils";

const confirm = Modal.confirm;

const User: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [departmentList, setDepartmentList] = useState<DepartmentDataType[]>([]);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [visible, setVisible] = useState<boolean>(false);

  const [type, setType] = useState<string>("create");

  const [userRoleVisible, setUserRoleVisible] = useState<boolean>(false);

  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  useEffect(() => {
    getDepartmentList().then(res => {
      setDepartmentList(res);
    });
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

  const handleDelete = (id: string) => {
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        await deleteUserById(id);
        setCurrentId(undefined);
        if (actionRef.current)
          actionRef.current.reloadAndRest();
      }
    })
  };

  const handleAssign = (id: string) => {
    setCurrentId(id);
    setUserRoleVisible(true);
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setVisible(false);
    setUserRoleVisible(false);
  };

  const handleFinish = async (user: Partial<UserDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateUserById(currentId, user);
    } else {
      // 新建
      await insertUser(user);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const handleUserRoleOk = async (values: string[]) => {
    if (currentId == undefined) return;
    await updateUserRoleByUserId(currentId, values);
    setUserRoleVisible(false);
    if (actionRef.current) actionRef.current.reloadAndRest();
  };

  const handleImport = (file: RcFile) => {
    // 包装成 formData 用于转换成文件流格式
    const formData = new FormData();
    formData.set('file', file);
    importUserExcel(formData).then(() => {
      message.success(`文件导入成功`);
      if (actionRef.current)
        actionRef.current.reloadAndRest();
    });
    // 返回 false 禁止组件自动上传
    return false;
  };

  const handleExport = () => {
    setDownloadLoading(true);
    if (downloadLoading) return;
    exportUserExcel().then(res => {
      const fileName = localStorage.getItem("filename");
      if (fileName) {
        downloadCallback(res, fileName);
      }
    }).finally(() => {
      setDownloadLoading(false);
    });
  };

  const columns: ProColumns<UserDataType>[] = [
    {
      title: '序号',
      valueType: 'index',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '工号',
      dataIndex: 'workNumber',
    },
    {
      title: '部门',
      render: (text, record) => {
        const department = departmentList.find(department => department.id === record.departmentId);
        return department ? department.name : '';
      },
    },
    {
      title: '账户状态',
      render: (text, record) => {
        return (
          <Switch checked={record.enableState} disabled/>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
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
            }}>分配角色</a>
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
      <ProTable<UserDataType>
        rowKey={"id"}
        headerTitle={"用户列表"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: UserQueryParamsDataType = {
            current: params.current ? params.current : 1,
            pageSize: params.pageSize ? params.pageSize : 20
          };
          return await getUserPage(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Upload name={"file"} beforeUpload={file => handleImport(file)} fileList={[]}>
              <Button type="primary">
                <ImportOutlined/> 导入
              </Button>
            </Upload>,
            <Button type="primary" onClick={() => handleExport()} loading={downloadLoading}>
              <ExportOutlined/>导出
            </Button>,
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>,
          ]
        }}

      />
      <UserForm visible={visible} type={type} currentId={currentId} departmentList={departmentList}
                onCancel={handleCancel} onFinish={handleFinish}/>
      <UserRole visible={userRoleVisible} currentId={currentId} onCancel={handleCancel} onOk={handleUserRoleOk}/>
    </PageContainer>
  )

};

export default User;
