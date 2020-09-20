import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Switch, TreeSelect} from "antd";
import {UserDataType} from "@/pages/user/data";
import {DepartmentDataType} from "@/pages/Department/data";
import {getUserById} from "@/pages/user/service";
import {listToTreeData} from "@/utils/utils";
import {TreeNodeNormal} from "antd/es/tree/Tree";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface UserFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  departmentList: DepartmentDataType[];
  onCancel: () => void;
  onFinish: (values: Partial<UserDataType>) => void;
}

const UserForm: React.FC<UserFormProps> = (props) => {

  const {visible, type, currentId, departmentList, onCancel, onFinish} = props;

  const [treeData, setTreeData] = useState<TreeNodeNormal[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getUserById(currentId).then(res => {
        form.setFieldsValue(res);
      });
    }
  }, [currentId]);

  useEffect(() => {
    // 将departmentList 转成treeData
    setTreeData(listToTreeData(departmentList));
  }, [departmentList]);


  useEffect(() => {
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form
        form={form}
        {...formLayout}
        onFinish={onFinish}
      >
        <Form.Item label={"用户名"} name={"username"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"用户名"}/>
        </Form.Item>
        <Form.Item label={"手机号"} name={"mobile"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"手机号"}/>
        </Form.Item>
        <Form.Item label={"工号"} name={"workNumber"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"工号"}/>
        </Form.Item>
        <Form.Item label={"部门"} name={"departmentId"} >
          <TreeSelect
            // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="Please select"
          />
        </Form.Item>
        <Form.Item label={"账户状态"} name={"enableState"} rules={[{required: true}]} valuePropName={"checked"}>
          <Switch/>
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
      width={800}
      visible={visible}
      title={type === 'create' ? "添加用户" : "编辑用户"}
      footer={null}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default UserForm
