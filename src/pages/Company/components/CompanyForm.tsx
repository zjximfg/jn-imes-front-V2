import React, {useEffect} from 'react';
import {Button, DatePicker, Form, Input, Modal} from "antd";
import {CompanyDataType} from "@/pages/Company/data";
import {getCompanyById} from "@/pages/Company/service";
import moment from "moment";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface CompanyFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<CompanyDataType>) => void;
}

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

const CompanyForm: React.FC<CompanyFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getCompanyById(currentId).then(res => {
        const initialValues = {
          ...res,
          expirationDate: res.expirationDate? moment(res.expirationDate, "YYYY-MM-DD") : null,
        };
        form.setFieldsValue(initialValues);
      })
    }
  }, [currentId]);


  useEffect(() => {
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form {...formLayout} form={form} onFinish={values => onFinish(values)}>
        <FormItem label={"公司名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"公司名称"}/>
        </FormItem>
        <FormItem label={"企业登录账号ID"} name={"managerId"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"企业登录账号ID"}/>
        </FormItem>
        <FormItem label={"联系人"} name={"liaison"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"联系人"}/>
        </FormItem>
        <FormItem label={"当前版本"} name={"version"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"当前版本"}/>
        </FormItem>
        <FormItem label={"到期时间"} name={"expirationDate"} rules={[{required: true}]}>
          <DatePicker format={"YYYY-MM-DD"} placeholder={"到期时间"}/>
        </FormItem>
        <FormItem label={"公司地址"} name={"companyArea"} >
          <Input type={"text"} placeholder={"公司地址"}/>
        </FormItem>
        <FormItem label={"法人代表"} name={"legalRepresentative"} >
          <Input type={"text"} placeholder={"法人代表"}/>
        </FormItem>
        <FormItem label={"公司电话"} name={"companyPhone"} >
          <Input type={"text"} placeholder={"公司电话"}/>
        </FormItem>
        <FormItem label={"邮箱"} name={"mailbox"} >
          <Input type={"text"} placeholder={"邮箱"}/>
        </FormItem>
        <FormItem label={"公司规模"} name={"companySize"} >
          <Input type={"text"} placeholder={"公司规模"}/>
        </FormItem>
        <FormItem label={"所属行业"} name={"industry"} >
          <Input type={"text"} placeholder={"所属行业"}/>
        </FormItem>
        <FormItem label={"审核状态"} name={"auditState"} >
          <Input type={"text"} placeholder={"审核状态"}/>
        </FormItem>
        <FormItem label={"备注"} name={"remarks"} >
          <TextArea  placeholder={"备注"}/>
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
      title={type === 'create' ? "新建企业" : "编辑企业"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default CompanyForm;

