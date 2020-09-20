import React, {useEffect} from 'react';
import {PermissionDataType} from "@/pages/Permission/data";
import {Button, Form, Input, Modal, Switch} from "antd";
import {getPermissionById} from "@/pages/Permission/service";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface PermissionMenuProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<PermissionDataType>) => void;
}

const PermissionMenu: React.FC<PermissionMenuProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getPermissionById(currentId).then(res => {
        form.setFieldsValue(res);
        console.log(form.getFieldsValue())
      });
    }
  }, [currentId]);


  useEffect(() => {
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout} onFinish={onFinish}>
        <Form.Item label={"权限名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"权限名称"}/>
        </Form.Item>
        <Form.Item label={"权限标识"} name={"code"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"权限标识"}/>
        </Form.Item>
        <Form.Item label={"权限描述"} name={"description"}>
          <Input type={"text"} placeholder={"权限描述"}/>
        </Form.Item>
        <Form.Item label={"非系统配置可见"} name={"systemVisible"} valuePropName={"checked"}>
          <Switch checkedChildren={"可见"} unCheckedChildren={"不可见"}/>
        </Form.Item>
        <Form.Item label={"菜单图标"} name={["permissionMenu", "menuIcon"]}>
          <Input type={"text"} placeholder={"菜单图标"}/>
        </Form.Item>
        <Form.Item label={"菜单顺序"} name={["permissionMenu", "menuOrder"]}>
          <Input type={"text"} placeholder={"菜单顺序"}/>
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
      title={type === 'create' ? "添加菜单权限" : "编辑菜单权限"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default PermissionMenu;
