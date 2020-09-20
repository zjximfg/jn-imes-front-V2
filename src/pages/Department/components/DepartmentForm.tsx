import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select} from "antd";
import moment from "@/pages/Company/components/CompanyForm";
import {DepartmentDataType} from "@/pages/Department/data";
import {getDepartmentById} from "@/pages/Department/service";
import {getUserListByDepartmentId} from "@/pages/user/service";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

interface DepartmentFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<DepartmentDataType>) => void;
}

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

const DepartmentForm: React.FC<DepartmentFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [userList, setUserList] = useState<any[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getDepartmentById(currentId).then(res => {
        const initialValues = {
          ...res,
          expirationDate: res.expirationDate? moment(res.expirationDate, "YYYY-MM-DD") : null,
        };
        form.setFieldsValue(initialValues);
      });
      // 获取对应id的人员名单userList
      getUserListByDepartmentId(currentId).then(res => {
        setUserList(res);
      });
    }
  }, [currentId]);


  useEffect(() => {
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form {...formLayout} form={form} onFinish={values => onFinish(values)}>
        <FormItem label={"部门名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"部门名称"}/>
        </FormItem>
        <FormItem label={"部门编号"} name={"code"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"部门编号"}/>
        </FormItem>
        <FormItem label={"部门类别"} name={"category"} >
          <Input type={"text"} placeholder={"部门类别"}/>
        </FormItem>
        <FormItem label={"负责人"} name={"managerId"} >
          <Select onChange={(value, option) => {
            const managerOption = option as {children: string};
            form.setFieldsValue({manager: managerOption.children});
          }}>
            {userList.map(user => (
              <Option value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem name={"manager"} noStyle><></></FormItem>
        <FormItem label={"所在城市"} name={"city"} >
          <Input type={"text"} placeholder={"所在城市"}/>
        </FormItem>
        <FormItem label={"简介"} name={"introduce"} >
          <TextArea  placeholder={"简介"}/>
        </FormItem>
        <FormItem {...tailLayout}>
          <>
            <Button type={"primary"} htmlType={"submit"}>提交</Button>
            <Button type={"primary"} onClick={onCancel} style={{marginLeft: 8}}>取消</Button>
          </>
        </FormItem>
      </Form>
    )
  };

  return (
    <Modal
      title={type === 'create' ? "添加部门" : "编辑部门"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default DepartmentForm;
