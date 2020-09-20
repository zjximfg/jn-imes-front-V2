import React, {useEffect, useState} from 'react';
import {AccessoryDataType, WarehouseEntryDataType} from "@/pages/WarehouseEntry/data";
import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Upload} from "antd";
import {WorkAreaDataType} from "@/pages/WorkArea/data";
import {getWorkAreaListByCompanyId} from "@/pages/WorkArea/service";
import {MaterialSupplierDataType} from "@/pages/MaterialSupplier/data";
import {getMaterialSupplierListByCompanyId} from "@/pages/MaterialSupplier/service";
import {
  getAccessoriesByParentId,
  getProcurementMethods,
  getWarehouseEntryById,
  uploadAccessories
} from "@/pages/WarehouseEntry/service";
import {PlusOutlined} from "@ant-design/icons/lib";
import {RcFile} from "antd/es/upload";
import moment from "moment";


const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

const Option = Select.Option;

interface WarehouseEntryFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<WarehouseEntryDataType>, fileList: AccessoryDataType[]) => void;
}

const WarehouseEntryForm: React.FC<WarehouseEntryFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;
  const [form] = Form.useForm();

  const [workAreaList, setWorkAreaList] = useState<WorkAreaDataType[]>([]);

  const [materialSupplierList, setMaterialSupplierList] = useState<MaterialSupplierDataType[]>([]);

  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    //初始化时，加载工区列表
    getWorkAreaListByCompanyId().then(data => {
      setWorkAreaList(data);
    });
    getMaterialSupplierListByCompanyId().then(data => {
      setMaterialSupplierList(data);
    })
  }, []);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
      return;
    }
    if (currentId !== undefined) {
      // 获取当前的值，并赋值给当前的form
      getWarehouseEntryById(currentId).then(res => {
        const initialValues = {
          ...res,
          receivingTime: res.receivingTime? moment(res.receivingTime, "YYYY-MM-DD HH:mm:ss") : null,
        };
        form.setFieldsValue(initialValues);
        // 创建默认显示附件
        //setFileList(data.accessories);
      });
      getAccessoriesByParentId(currentId).then(data => {
        setFileList(data)
      })
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

  const renderForm = () => {
    return (
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={(values) => {
          values = {...values, receivingTime: values["receivingTime"].format('YYYY-MM-DD HH:mm:ss')};
          onFinish(values, fileList)
        }}
        {...formLayout}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name={"workAreaId"} label={"工区"} rules={[{required: true}]}>
              <Select>
                {workAreaList.map(item => {
                  return (
                    <Option value={item.id}>{item.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={"materialSupplierId"} label={"供货商"} rules={[{required: true}]}>
              <Select>
                {materialSupplierList.map(item => {
                  return (
                    <Option value={item.id}>{item.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={"receivingTime"} label={"收货时间"}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
            </Form.Item>
            <Form.Item name={"procurementMethod"} label={"入库类型"} rules={[{required: true}]}>
              <Select>
                {getProcurementMethods().map(item => {
                  return (
                    <Option value={item.id}>{item.type}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={"receiver"} label={"签收人"}>
              <Input type={"text"} placeholder={"签收人"}/>
            </Form.Item>
            <Form.Item name={"submitter"} label={"交货人"}>
              <Input type={"text"} placeholder={"交货人"}/>
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
      title={type === 'create' ? "新建入库单" : "编辑入库单"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  )
};

export default WarehouseEntryForm;
