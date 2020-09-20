import React, {useRef, useState} from 'react';
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {Button, Divider, Modal, Progress} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import {deleteProjectById, getProjectPageByCompanyId, insertProject, updateProjectById} from "@/pages/Project/service";
import {ProjectDataType, ProjectQueryParamsDataType} from "@/pages/Project/data";
import ProjectForm from "@/pages/Project/components/ProjectForm";


const confirm = Modal.confirm;

const Project: React.FC<{}> = () => {

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
        const res = await deleteProjectById(id);
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

  const handleFinish = async (values: Partial<ProjectDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateProjectById(currentId, values);
    } else {
      // 新建
      await insertProject(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<ProjectDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '构件种数',
      dataIndex: 'frameMemberQuantity',
    },
    {
      title: '总体进度',
      dataIndex: 'progress',
      width: 300,
      render: (text, record) => {
        return (
          <Progress percent={record.progress} size="small"  style={{width: 200, padding: "0, 20px"}}/>
        )
      }
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
      <ProTable<ProjectDataType>
        rowKey={"id"}
        headerTitle={"项目"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: ProjectQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20
          };
          return await getProjectPageByCompanyId(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>
          ]
        }}
      />

      <ProjectForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )



};

export default Project;
