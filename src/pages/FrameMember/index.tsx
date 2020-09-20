import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Divider, Layout, Menu, Modal, Progress, Row} from "antd";
import {ProjectDataType} from "@/pages/Project/data";
import {FrameMemberDataType, FrameMemberQueryParamsDataType} from "@/pages/FrameMember/data";
import {PageContainer} from "@ant-design/pro-layout";
import {
  ExclamationCircleOutlined,
  MailOutlined,
  PlusOutlined,
  SlidersOutlined
} from "@ant-design/icons/lib";
import {ClickParam} from "antd/lib/menu";
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {
  getProjectListByCompanyId,
} from "@/pages/Project/service";
import ProTable from '@ant-design/pro-table';
import {
  deleteFrameMemberById,
  getFrameMemberPageByCompanyId,
  insertFrameMember,
  updateFrameMemberById
} from "@/pages/FrameMember/service";
import FrameMemberForm from "@/pages/FrameMember/components/FrameMemberForm";


const {SubMenu} = Menu;
const {Content, Sider} = Layout;
const confirm = Modal.confirm;

const FrameMember: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const [projectList, setProjectList] = useState<ProjectDataType[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<"edit" | "create">("create");
  const [disabled, setDisabled] = useState<boolean>(false);
  //const [params, setParams] = useState<{pageSize: number;current: number;[key: string]: any;}>({pageSize: 20, current: 1});

  useEffect(() => {
    if (selectedKey !== undefined) {
      if (actionRef.current) {
        actionRef.current.reloadAndRest();
      }
    }
    setDisabled(selectedKey === undefined);
  }, [selectedKey]);

  useEffect(() =>{
    getProjectListByCompanyId().then(res => {
      setProjectList(res);
      if (res && res.length > 0) {
        setSelectedKey(res[0].id);
      }
    })
  }, []);

  const handleClick = (e: ClickParam) => {
    setSelectedKey(e.key);
  };

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
        const res = await deleteFrameMemberById(id);
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

  const handleFinish = async (values: Partial<FrameMemberDataType>) => {
    // 赋值projectId
    if (selectedKey === undefined) return;
    values.projectId = selectedKey;
    if (currentId && type === 'edit') {
      // 编辑
      await updateFrameMemberById(currentId, values);
    } else {
      // 新建
      await insertFrameMember(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

  const columns: ProColumns<FrameMemberDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '构件名称',
      dataIndex: 'name',
    },
    {
      title: '构件类型',
      dataIndex: 'typeId',
    },
    {
      title: '完成进度',
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
      <Row gutter={5}>
        <Col span={24}>
          <Layout style={{background: '#fff', padding: '24px 0', minHeight: '80vh'}} >
            <Sider style={{background: '#fff'}} width={230}>
              <Menu
                onClick={handleClick}
                style={{ height: '100%' }}
                defaultOpenKeys={['projectList']}
                selectedKeys={selectedKey? [selectedKey]: []}
                mode="inline"
              >
                <SubMenu key="projectList"
                         title={
                           <span>
                            <MailOutlined/>
                            <span>项目列表</span>
                           </span>
                         }
                >
                  {
                    projectList.map(project => {
                      return (
                        <Menu.Item key={project.id} icon={<SlidersOutlined/>}>{project.name}</Menu.Item>
                      )
                    })
                  }
                </SubMenu>
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 200 }}>
              <ProTable<FrameMemberDataType>
                rowKey={"id"}
                headerTitle={"项目"}
                actionRef={actionRef}
                columns={columns}
                search={false}
                request={async (params) => {
                  if (selectedKey == undefined) return;
                  const pageParams: FrameMemberQueryParamsDataType = {
                    projectId: selectedKey,
                    current: params.current? params.current : 1,
                    pageSize: params.pageSize? params.pageSize : 20
                  };
                  return await getFrameMemberPageByCompanyId(pageParams);
                }}
                toolBarRender={() => {
                  return [
                    <Button type={"primary"} onClick={() => handleAdd()} disabled={disabled}>
                      <PlusOutlined/> 新建
                    </Button>
                  ]
                }}
              />
            </Content>
          </Layout>
        </Col>
      </Row>
      <FrameMemberForm type={type} visible={visible} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
    </PageContainer>
  )
};

export default FrameMember;
