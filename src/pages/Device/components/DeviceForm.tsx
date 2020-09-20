import React, {useEffect} from "react";
import {Button, Form, Input, Modal, Select} from "antd";
import {DeviceDataType} from "@/pages/Device/data";
import {getDeviceById} from "@/pages/Device/service";
import {DeviceSupplierDataType} from "@/pages/DeviceSupplier/data";
import {DeviceTemplateDataType} from "@/pages/DeviceTemplate/data";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface DeviceFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  supplierList: DeviceSupplierDataType[];
  templateList: DeviceTemplateDataType[];
  onCancel: () => void;
  onFinish: (values: Partial<DeviceDataType>) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = (props) => {

  const {visible, type, currentId, supplierList, templateList, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getDeviceById(currentId).then(res => {
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
        <Form.Item label={"设备名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"设备名称"}/>
        </Form.Item>
        <Form.Item label={"设备编号"} name={"code"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"设备编号"}/>
        </Form.Item>
        <Form.Item label={"用途"} name={"usage"} >
          <Input type={"text"} placeholder={"用途"}/>
        </Form.Item>
        <Form.Item label={"功能"} name={"function"} >
          <Input type={"text"} placeholder={"功能"}/>
        </Form.Item>
        <Form.Item label={"设备供货商"} name={"supplierId"} rules={[{required: true}]}>
          <Select>
            {
              supplierList?.map(item => {
              return (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label={"设备模板"} name={"templateId"} >
          <Select>
            {
              templateList?.map(item => {
                return (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item label={"网关ID"} name={"gatewayId"} >
          <Input type={"text"} placeholder={"网关ID"}/>
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
      title={type === 'create' ? "添加设备" : "编辑设备信息"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default DeviceForm;
