import React, {useEffect} from "react";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import {DeviceConnectionDataType} from "@/pages/Company/data";
import {getDeviceConnectionByCompanyId} from "@/pages/Company/service";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface DeviceConnectionFormProps {
  visible: boolean;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<DeviceConnectionDataType>) => void;
}

const DeviceConnectionForm: React.FC<DeviceConnectionFormProps> = (props) => {

  const {visible, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (currentId !== undefined) {
  //     getDeviceConnectionByCompanyId(currentId).then(res => {
  //       form.setFieldsValue(res);
  //     })
  //   }
  // }, [currentId]);


  useEffect(() => {
    if (currentId !== undefined && visible === true) {
      getDeviceConnectionByCompanyId(currentId).then(res => {
        form.setFieldsValue(res);
      })
    }
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout} onFinish={onFinish}>
        <Form.Item label={"时序数据库IP"} name={"influxIp"} >
          <Input type={"text"} placeholder={"时序数据库IP"}/>
        </Form.Item>
        <Form.Item label={"时序数据库端口"} name={"influxPort"} >
          <InputNumber  />
        </Form.Item>
        <Form.Item label={"时序数据库存储规则"} name={"influxRetentionPolicy"} >
          <Input type={"text"} placeholder={"时序数据库存储规则"}/>
        </Form.Item>
        <Form.Item label={"数据库名称"} name={"influxDatabase"} >
          <Input type={"text"} placeholder={"数据库名称"}/>
        </Form.Item>
        <Form.Item label={"MQTT服务IP"} name={"mqttServiceIp"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"MQTT服务IP"}/>
        </Form.Item>
        <Form.Item label={"MQTT服务端口"} name={"mqttServicePort"} rules={[{required: true}]}>
          <InputNumber  />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <>
            <Button type={"primary"} htmlType={"submit"}>提交</Button>
            <Button type={"primary"} onClick={onCancel} style={{marginLeft: 8}}>取消</Button>
          </>
        </Form.Item>
      </Form>
    )
  };

  return (
    <Modal
      title={"编辑设备连接信息"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default DeviceConnectionForm;
