import React, {useEffect} from "react";
import {Button, Form, Input, InputNumber, Modal, Select} from "antd";
import {FrameMemberDataType} from "@/pages/FrameMember/data";
import {getFrameMemberById} from "@/pages/FrameMember/service";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface FrameMemberFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<FrameMemberDataType>) => void;
}

const FrameMemberForm: React.FC<FrameMemberFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getFrameMemberById(currentId).then(res => {
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
        <Form.Item label={"构件名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"构件名称"}/>
        </Form.Item>
        <Form.Item label={"完成进度"} name={"progress"} rules={[{required: true}]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label={"构件类型"} name={"typeId"}>
          <Select>
            <Select.Option value={"1"}>默认类型</Select.Option>
          </Select>
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
      title={type === 'create' ? "添加构件" : "编辑构件"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default FrameMemberForm;
