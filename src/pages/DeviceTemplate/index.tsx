import React, {useEffect, useState} from 'react';
import {Button, Typography, List, Card, Modal} from "antd";
import image from "@/assets/RzwpdLnhmvDJToTdfDPe.png";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import styles from './style.less';
import {DeviceTemplateDataType} from "@/pages/DeviceTemplate/data";
import {
  deleteDeviceTemplateById,
  getDeviceTemplateList,
  insertDeviceTemplate,
  updateDeviceTemplateById
} from "@/pages/DeviceTemplate/service";
import DeviceTemplateForm from "@/pages/DeviceTemplate/components/DeviceTemplateForm";
import {useModel} from "@@/plugin-model/useModel";
import {history} from "umi";


const {Paragraph} = Typography;
const confirm = Modal.confirm;

const DeviceTemplate: React.FC<{}> = () => {

  const [list, setList] = useState<DeviceTemplateDataType[]>([]);

  const [current, setCurrent] = useState<Partial<DeviceTemplateDataType> | undefined>(undefined);

  const [visible, setVisible] = useState<boolean>(false);

  // 全局数据， 用于传递选中的id
  const {changeTemplateId} = useModel("deviceTemplate");

  const [type, setType] = useState<"edit" | "create">("edit");

  useEffect(() => {
    getDeviceTemplateList().then(res => {
      setList(res);
    });
  }, []);

  const handleCancel = () => {
    setCurrent(undefined);
    setVisible(false);
  };

  const handleAdd = () => {
    setCurrent(undefined);
    setType("create");
    setVisible(true);
  };

  const handleEdit = (item: Partial<DeviceTemplateDataType>) => {
    setCurrent(item);
    setType("edit");
    setVisible(true);
  };

  const handlePropertyEdit = (id: string | undefined) => {
    changeTemplateId(id);
    history.push("/device/device-property");
  };

  const handleDelete = (id: string | undefined) => {
    if (id === undefined) return;
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        const res = await deleteDeviceTemplateById(id);
        if (res) {
          getDeviceTemplateList().then(res => {
            setList(res);
          });
        }
      }
    })
  };

  const handleFinish = async (values: Partial<DeviceTemplateDataType>) => {
    if (current && current.id && type === 'edit') {
      // 编辑
      await updateDeviceTemplateById(current.id, values);
    } else {
      // 新建
      await insertDeviceTemplate(values);
    }
    setVisible(false);
    setCurrent(undefined);
    // 刷新列表
    getDeviceTemplateList().then(res => {
      setList(res);
    });
  };

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        设备数据模板：用于创建设备的基本属性，此属性可以自动配置给用户自定义的设备。
      </p>
      <p>
        当该模板创建后，意味着，选择该模板的设备也同样拥有了一样的设备属性。这些属性将用于业务逻辑和实时数据连接。
      </p>
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="设备数据模板"
        src={image}
      />
    </div>
  );

  const nullData: Partial<DeviceTemplateDataType> = {};

  return (
    <PageHeaderWrapper content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List<Partial<DeviceTemplateDataType>>
          rowKey="id"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[nullData, ...list]}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<a key="option1" onClick={(e) => {
                      e.preventDefault();
                      handlePropertyEdit(item.id);
                    } }>模板属性</a>, <a key="option2" onClick={e => {
                      e.preventDefault();
                      handleDelete(item.id);
                    }}>删除模板</a>]}
                  >
                    <div onClick={() => handleEdit(item)}>
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                        title={<a>{item.name}</a>}
                        description={
                          <Paragraph className={styles.item} ellipsis={{rows: 3}}>
                            {item.description}
                          </Paragraph>
                        }
                      />
                    </div>
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
                <Button type="dashed" className={styles.newButton} onClick={handleAdd}>
                  <PlusOutlined/> 新增模板
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
      <DeviceTemplateForm visible={visible} type={type} current={current} onCancel={handleCancel}
                          onFinish={handleFinish}/>
    </PageHeaderWrapper>
  )

};

export default DeviceTemplate;
