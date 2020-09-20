import React, {useEffect, useRef, useState} from 'react';
import {useModel} from "@@/plugin-model/useModel";
import {DeviceTemplateDataType} from "@/pages/DeviceTemplate/data";
import {getDeviceTemplateList} from "@/pages/DeviceTemplate/service";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Col, Divider, Layout, Menu, Modal, Row, Tabs, Tag} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined, FallOutlined,
  MailOutlined,
  PlusOutlined, RiseOutlined,
  SlidersOutlined
} from "@ant-design/icons/lib";
import {ClickParam} from "antd/lib/menu";
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {DevicePropertyDataType, DevicePropertyQueryParamsDataType} from "@/pages/DeviceProperty/data";
import ProTable from '@ant-design/pro-table';
import {
  deleteDevicePropertyById,
  getDevicePropertyPageByTemplateId, insertDeviceProperty,
  updateDevicePropertyById
} from "@/pages/DeviceProperty/service";
import DevicePropertyForm from "@/pages/DeviceProperty/components/DevicePropertyForm";

const {SubMenu} = Menu;
const {Content, Sider} = Layout;
const confirm = Modal.confirm;
const { TabPane } = Tabs;

const DeviceProperty: React.FC<{}> = () => {
  const {templateId} = useModel("deviceTemplate");
  const [deviceTemplateList, setDeviceTemplateList] = useState<DeviceTemplateDataType[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<"edit" | "create">("create");
  const [category, setCategory] = useState<number>(1);

  const actionRef1 = useRef<ActionType>();
  const actionRef2 = useRef<ActionType>();


  useEffect(() => {
    // 获取所有的deviceTemplateList
    getDeviceTemplateList().then(res => {
      setDeviceTemplateList(res);
      if (res && res.length > 0) {
        if (templateId) {
          setSelectedKey(templateId);
        } else {
          setSelectedKey(res[0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (selectedKey) {
      if (actionRef1.current) {
        actionRef1.current.reloadAndRest();
      }
      if (actionRef2.current) {
        actionRef2.current.reloadAndRest();
      }
    }
    setDisabled(selectedKey === undefined);
  }, [selectedKey]);

  useEffect(() => {
    if (selectedKey) {
      if (actionRef1.current) {
        actionRef1.current.reloadAndRest();
      }
      if (actionRef2.current) {
        actionRef2.current.reloadAndRest();
      }
    }
    setDisabled(selectedKey === undefined);
  }, [category]);

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
        const res = await deleteDevicePropertyById(id);
        if (res) {
          if (actionRef1.current)
            actionRef1.current.reloadAndRest();
          if (actionRef2.current)
            actionRef2.current.reloadAndRest();
        }
      }
    })
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setVisible(false);
  };

  const handleFinish = async (values: Partial<DevicePropertyDataType>) => {
    // 赋值templateId
    if (selectedKey === undefined) return;
    values.templateId = selectedKey;
    if (currentId && type === 'edit') {
      // 编辑
      await updateDevicePropertyById(currentId, values);
    } else {
      // 新建
      await insertDeviceProperty(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef1.current)
      actionRef1.current.reloadAndRest();
    if (actionRef2.current)
      actionRef2.current.reloadAndRest();
  };

  const handleTabsChange = (key: string) => {
    setCategory(Number(key));
  };

  const columns: ProColumns<DevicePropertyDataType>[] = [
    {
      title: "序号",
      valueType: 'index',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
    },
    {
      title: '变量地址',
      dataIndex: 'variableAddress',
    },
    {
      title: '变量地址',
      dataIndex: 'variableType',
      render: (text, record) => {
        return (
          <Tag color={"blue"} key={record.variableType}>
            {record.variableType}
          </Tag>
        )
      }
    },
    {
      title: '数据流向',
      dataIndex: 'category',
      render: (text, record) => {
        return record.category === 1? (
          <div>
            <span>网关</span>
            <ArrowRightOutlined />
            <span>平台</span>
          </div>
        ): (
          <div>
            <span>网关</span>
            <ArrowLeftOutlined />
            <span>平台</span>
          </div>
        );
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
                defaultOpenKeys={['deviceTemplateList']}
                selectedKeys={selectedKey? [selectedKey]: []}
                mode="inline"
              >
                <SubMenu key="deviceTemplateList"
                         title={
                           <span>
                            <MailOutlined/>
                            <span>设备模板列表</span>
                           </span>
                         }
                >
                  {
                    deviceTemplateList.map(deviceTemplate => {
                      return (
                        <Menu.Item key={deviceTemplate.id} icon={<SlidersOutlined/>}>{deviceTemplate.name}</Menu.Item>
                      )
                    })
                  }
                </SubMenu>
              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 200 }}>
              <Tabs defaultActiveKey={"1"} onChange={handleTabsChange} type="card" tabBarExtraContent={
                <Button type={"primary"} onClick={() => handleAdd()} disabled={disabled}>
                  <PlusOutlined/> 新建
                </Button>
              }>
                <TabPane tab={
                  <span>
                    <FallOutlined />
                    接收数据的属性
                  </span>
                } key={"1"}>
                  <ProTable<DevicePropertyDataType>
                    rowKey={"id"}
                    headerTitle={"属性列表"}
                    actionRef={actionRef1}
                    columns={columns}
                    search={false}
                    request={async (params) => {
                      if (selectedKey == undefined) return;
                      const pageParams: DevicePropertyQueryParamsDataType = {
                        templateId: selectedKey,
                        category: category,
                        current: params.current? params.current : 1,
                        pageSize: params.pageSize? params.pageSize : 20
                      };
                      return await getDevicePropertyPageByTemplateId(pageParams);
                    }}
                  />
                </TabPane>
                <TabPane tab={
                  <span>
                    <RiseOutlined />
                    发送数据的属性
                  </span>
                } key="2">
                  <ProTable<DevicePropertyDataType>
                    rowKey={"id"}
                    headerTitle={"属性列表"}
                    actionRef={actionRef2}
                    columns={columns}
                    search={false}
                    request={async (params) => {
                      if (selectedKey == undefined) return;
                      const pageParams: DevicePropertyQueryParamsDataType = {
                        templateId: selectedKey,
                        category: category,
                        current: params.current? params.current : 1,
                        pageSize: params.pageSize? params.pageSize : 20
                      };
                      return await getDevicePropertyPageByTemplateId(pageParams);
                    }}
                  />
                </TabPane>
              </Tabs>

            </Content>
          </Layout>
        </Col>
      </Row>
      <DevicePropertyForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} category={category} onFinish={handleFinish}/>
    </PageContainer>
  )
};

export default DeviceProperty
