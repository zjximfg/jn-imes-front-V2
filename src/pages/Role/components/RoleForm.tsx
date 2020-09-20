import React, {useEffect} from 'react';
import {RoleDataType} from "@/pages/Role/data";
import {Button, Form, Input, Modal} from "antd";
import {getRoleById} from "@/pages/Role/service";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface RoleFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<RoleDataType>) => void;
}

const RoleForm: React.FC<RoleFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getRoleById(currentId).then(res => {
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
        <Form.Item label={"角色名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"角色名称"}/>
        </Form.Item>
        <Form.Item label={"角色描述"} name={"description"}>
          <Input type={"text"} placeholder={""}/>
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
      title={type === 'create' ? "添加角色" : "编辑角色"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default RoleForm;
