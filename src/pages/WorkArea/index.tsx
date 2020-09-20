import React, {useRef, useState} from 'react';
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {Button, Divider, Modal} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import {WorkAreaDataType, WorkAreaQueryParamsDataType} from "@/pages/WorkArea/data";
import {
  deleteWorkAreaById,
  getWorkAreaPageByCompanyId,
  insertWorkArea,
  updateWorkAreaById
} from "@/pages/WorkArea/service";
import WorkAreaForm from "@/pages/WorkArea/components/WorkAreaForm";


const confirm = Modal.confirm;

const WorkArea: React.FC<{}> = () => {

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
        const res = await deleteWorkAreaById(id);
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

  const handleFinish = async (values: Partial<WorkAreaDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateWorkAreaById(currentId, values);
    } else {
      // 新建
      await insertWorkArea(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<WorkAreaDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '工区名称',
      dataIndex: 'name',
    },
    {
      title: '工区位置',
      dataIndex: 'position',
    },
    {
      title: '工区联系人',
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
      <ProTable<WorkAreaDataType>
        rowKey={"id"}
        headerTitle={"工区"}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={async (params) => {
          const pageParams: WorkAreaQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20
          };
          return await getWorkAreaPageByCompanyId(pageParams);
        }}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建
            </Button>
          ]
        }}
      />

      <WorkAreaForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )



};

export default WorkArea;
