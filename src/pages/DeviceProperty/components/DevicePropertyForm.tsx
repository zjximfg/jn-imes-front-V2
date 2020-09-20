import React, {useEffect} from "react";
import {Button, Form, Input, Modal, Radio, Select} from "antd";
import {DevicePropertyDataType} from "@/pages/DeviceProperty/data";
import {getDevicePropertyById} from "@/pages/DeviceProperty/service";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons/lib";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface DevicePropertyFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  category: number;
  onCancel: () => void;
  onFinish: (values: Partial<DevicePropertyDataType>) => void;
}

const DevicePropertyForm: React.FC<DevicePropertyFormProps> = (props) => {

  const VariableTypeDataType = ['string', 'integer', 'unsigned', 'boolean', 'float'];

  const {visible, type, currentId, category, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
    } else {
      if (currentId !== undefined) {
        getDevicePropertyById(currentId).then(res => {
          if (!res || !res.category) res.category = 1;
          form.setFieldsValue(res);
        })
      } else {
        form.setFieldsValue({category: category})
      }
    }
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout} onFinish={onFinish}>
        <Form.Item label={"属性名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"属性名称"}/>
        </Form.Item>
        <Form.Item label={"变量地址"} name={"variableAddress"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"变量地址"}/>
        </Form.Item>
        <Form.Item label={"变量类型"} name={"variableType"}>
          <Select>
            {VariableTypeDataType.map(value => {
              return (
              <Select.Option value={value}>
              {value}
              </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label={"数据方向"} name={"category"}  rules={[{required: true}]}>
          <Radio.Group >
            <Radio value={1}>
                <span>网关</span>
                <ArrowRightOutlined />
                <span>平台</span>
            </Radio>
            <Radio value={2}>
                <span>网关</span>
                <ArrowLeftOutlined />
                <span>平台</span>
            </Radio>
          </Radio.Group>
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
      title={type === 'create' ? "添加模板属性" : "编辑模板属性"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default DevicePropertyForm;
