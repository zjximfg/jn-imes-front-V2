import React, {useEffect} from "react";
import {Button, Form, InputNumber, Modal} from "antd";
import {DeviceDailyDataType} from "@/pages/DeviceDaily/data";

const formLayout = {
  labelCol: {span: 9},
  wrapperCol: {span: 11},
};

const tailLayout = {
  wrapperCol: {offset: 9, span: 11},
};

interface DeviceDailyFormProps {
  visible: boolean;
  current: DeviceDailyDataType | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<DeviceDailyDataType>) => void;
}

const DeviceDailyForm: React.FC<DeviceDailyFormProps> = (props) => {

  const {visible, current, onCancel, onFinish} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (current !== undefined) {
      form.setFieldsValue(current);
    } else {
      form.resetFields();
    }
  }, [current]);


  useEffect(() => {
    if (visible === false)
      form.resetFields();
  }, [visible]);

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout} onFinish={onFinish}>
        <Form.Item label={"每日停机小时数"} name={"statusStopHour"} rules={[{required: true}]}>
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item label={"每日待机小时数"} name={"statusAwaitHour"} rules={[{required: true}]}>
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item label={"每日故障小时数"} name={"statusFaultHour"} rules={[{required: true}]}>
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item label={"每日运行小时数"} name={"statusRunHour"} rules={[{required: true}]}>
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item label={"每日产能累计"} name={"yieldSummary"} rules={[{required: true}]}>
          <InputNumber precision={2} />
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
      title={"编辑设备统计数据"}
      visible={visible}
      footer={null}
      width={600}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default DeviceDailyForm;
