import React, {useEffect} from 'react';
import { OutWarehouseDataType} from "@/pages/OutWarehouse/data";
import {Button, Col, DatePicker, Form, Input,  Modal, Row} from "antd";
import {
  getOutWarehouseById,
} from "@/pages/OutWarehouse/service";
import moment from "moment";


const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

interface WarehouseEntryFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<OutWarehouseDataType>) => void;
}

const OutWarehouseForm: React.FC<WarehouseEntryFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      return;
    }

    if (currentId !== undefined) {
      // 获取当前的值，并赋值给当前的form
     getOutWarehouseById(currentId).then(res => {
        const initialValues = {
          ...res,
          recipientsTime: res.recipientsTime? moment(res.recipientsTime, "YYYY-MM-DD HH:mm:ss") : null,
        };
        form.setFieldsValue(initialValues);
      });

    }
  }, [visible]);

  const renderForm = () => {
    return (
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={(values) => {
          values = {...values, recipientsTime: values["recipientsTime"].format('YYYY-MM-DD HH:mm:ss')};
          onFinish(values)
        }}
        {...formLayout}
      >

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={"使用用途"} name={"purpose"} rules={[{required: true}]}>
            <Input placeholder={"使用用途"}/>
            </Form.Item>
            <Form.Item name={"recipientsTime"} label={"领用时间"}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>

            </Form.Item>
            <Form.Item name={"recipient"} label={"领用人"}>
              <Input type={"text"} placeholder={"领用人"}/>
            </Form.Item>
            <Form.Item name={"recipientsUnit"} label={"领用单位"}>
              <Input type={"text"} placeholder={"领用单位"}/>
            </Form.Item>
          </Col>
        </Row>

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
      title={type === 'create' ? "新建出库单" : "编辑出库单"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default OutWarehouseForm;
