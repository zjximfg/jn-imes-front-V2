import React, {useEffect} from "react";
import {Button, Form, Input, Modal} from "antd";
import {WorkAreaDataType} from "@/pages/WorkArea/data";
import {getWorkAreaById} from "@/pages/WorkArea/service";

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface WorkAreaFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<WorkAreaDataType>) => void;
}

const WorkAreaForm: React.FC<WorkAreaFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getWorkAreaById(currentId).then(res => {
        form.setFieldsValue(res);
      })
    }
  }, [currentId]);


  useEffect(() => {
    if (!visible)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout} onFinish={onFinish}>
        <Form.Item label={"工区名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"工区名称"}/>
        </Form.Item>
        <Form.Item label={"工区位置"} name={"position"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"工区位置"}/>
        </Form.Item>
        <Form.Item label={"工区联系人"} name={"liaison"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"工区联系人"}/>
        </Form.Item>
        <Form.Item label={"联系人电话"} name={"phone"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"联系人电话"}/>
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
      title={type === 'create' ? "添加工区" : "编辑工区"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default WorkAreaForm;
