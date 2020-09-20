import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload,} from "antd";

import {
  getAccessoriesByParentId,
  getRebarCategories, getRebarEntryById, uploadAccessories
} from "@/pages/WarehouseEntry/service";
import {PlusOutlined,} from "@ant-design/icons/lib";
import {RcFile} from "antd/es/upload";
import {AccessoryDataType, RebarEntryDataType} from "@/pages/WarehouseEntry/data";


const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

const Option = Select.Option;

interface RebarEntryFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<RebarEntryDataType>, fileList: AccessoryDataType[]) => void;
}

const RebarEntryForm: React.FC<RebarEntryFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [fileList, setFileList] = useState<any[]>([]);

  const [warehouseEntryId, setWarehouseEntryId] = useState<string | undefined>(undefined);

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentId !== undefined) {
      getRebarEntryById(currentId).then(res => {
        form.setFieldsValue(res);
        if (res && res.warehouseEntryId) {
          setWarehouseEntryId(res.warehouseEntryId);
        }
      });
      getAccessoriesByParentId(currentId).then(res => {
        setFileList(res);
      });
    }
  }, [currentId]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setWarehouseEntryId(undefined);
    }
  }, [visible]);

  // 上传附件
  const handleUpload = (file: RcFile) => {
    // 包装成 formData 用于转换成文件流格式
    const formData = new FormData();
    formData.set('file', file);
    uploadAccessories(formData).then(data => {
      message.success(`图片上传成功`);
      // 创建列表
      setFileList([...fileList, data]);
    });
    // 返回 false 禁止组件自动上传
    return false;
  };

  const uploadButton = (
    <div>
      <PlusOutlined/>
      <div className={"ant-upload-text"}>上传</div>
    </div>
  );

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout}
            onFinish={(values) => {
              if (warehouseEntryId) values = {...values, warehouseEntryId};
              onFinish(values, fileList)
            }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={"材料种类"} name={"rebarCategory"} rules={[{required: true}]}>
              <Select>
                {getRebarCategories().map(item => {
                  return (
                    <Option value={item.id}>{item.type}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"厂家"} name={"manufacturer"} rules={[{required: true}]}>
              <Input placeholder={"厂家"}/>
            </Form.Item>
            <Form.Item label={"规格"} name={"specification"} rules={[{required: true}]}>
              <Input placeholder={"规格"}/>
            </Form.Item>
            <Form.Item label={"直径"} name={"diameter"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"长度"} name={"length"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"捆数"} name={"quantity"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"每捆根数"} name={"packageQuantity"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"理重"} name={"theoreticalWeight"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"实重"} name={"actualWeight"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"批次号"} name={"batchNumber"} rules={[{required: true}]}>
              <Input placeholder={"批次号"}/>
            </Form.Item>
            <Form.Item label={"使用位置"} name={"usagePosition"}>
              <Input placeholder={"使用位置"}/>
            </Form.Item>
            <Form.Item label={"运输车辆"} name={"vehicle"}>
              <Input placeholder={"运输车辆"}/>
            </Form.Item>
            <Form.Item label={"司机"} name={"driver"}>
              <Input placeholder={"司机"}/>
            </Form.Item>
            <Form.Item label={"备注"} name={"remarks"}>
              <Input.TextArea placeholder={""}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <div style={{marginLeft: 100}}>上传附件:</div>
          <div style={{marginLeft: 50}}>
            <Upload beforeUpload={file => handleUpload(file)} fileList={fileList} multiple={true}
                    listType="picture-card"
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </div>
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
      title={type === 'create' ? "新建钢筋明细" : "编辑钢筋明细"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  );

};

export default RebarEntryForm;
