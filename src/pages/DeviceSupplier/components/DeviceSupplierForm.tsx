import React, {useEffect} from "react";
import {Button, Form, Input, Modal} from "antd";
import {getDeviceSupplierById} from "@/pages/DeviceSupplier/service";
import {DeviceSupplierDataType} from "@/pages/DeviceSupplier/data";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface DeviceSupplierFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<DeviceSupplierDataType>) => void;
}

const DeviceSupplierForm: React.FC<DeviceSupplierFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getDeviceSupplierById(currentId).then(res => {
        form.setFieldsValue(res);
      })
    }
  }, [currentId]);


  useEffect(() => {
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout} onFinish={onFinish}>
        <Form.Item label={"供货商名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"供货商名称"}/>
        </Form.Item>
        <Form.Item label={"简称"} name={"shortName"} >
          <Input type={"text"} placeholder={"简称"}/>
        </Form.Item>
        <Form.Item label={"供货商代码"} name={"code"} >
          <Input type={"text"} placeholder={"供货商代码"}/>
        </Form.Item>
        <Form.Item label={"联系人姓名"} name={"liaisonName"} >
          <Input type={"text"} placeholder={"联系人姓名"}/>
        </Form.Item>
        <Form.Item label={"联系电话"} name={"phone"} >
          <Input type={"text"} placeholder={"联系电话"}/>
        </Form.Item>
        <Form.Item label={"备注"} name={"description"}>
          <Input.TextArea  placeholder={""}/>
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
      title={type === 'create' ? "添加设备供货商" : "编辑设备供货商"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default DeviceSupplierForm;
