import React, {useEffect} from 'react';
import {WarehouseStorageDataType} from "@/pages/WarehouseStorage/data";
import {OutWarehouseDataType} from "@/pages/OutWarehouse/data";
import {Button, Col, DatePicker, Form, Input, Modal, Row} from "antd";
import OutWarehouseRebarForm, {TableFormDateType} from "@/pages/WarehouseStorage/components/OutWarehouseRebarForm";
import {getBatchNumberListByWarehouseStorageId} from "@/pages/WarehouseStorage/service";

interface OutWarehouseFormProps {
  visible: boolean;
  warehouseStorageList: WarehouseStorageDataType[];
  onCancel: () => void;
  onFinish: (values: Partial<OutWarehouseDataType>) => void;
}

const OutWarehouseForm: React.FC<OutWarehouseFormProps> = (props) => {
  const {visible, warehouseStorageList, onFinish, onCancel} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    // 赋值formTable
    if (!warehouseStorageList || warehouseStorageList.length <= 0) return;
    let outWarehouseRebarList: Partial<TableFormDateType>[] = warehouseStorageList.map(warehouseStorage => {
      return {
        ...warehouseStorage,
        warehouseStorageId: warehouseStorage.id,
        key: warehouseStorage.id,
        outboundQuantityUnit: "根",
        isNew: true,
        editable: true,
      };
    });

    outWarehouseRebarList.forEach(item => {
      if (!item.warehouseStorageId) return;
      getBatchNumberListByWarehouseStorageId(item.warehouseStorageId).then(list => {
        item.batchNumberList = list;
        form.setFieldsValue({outWarehouseRebarList: outWarehouseRebarList})
      })
    });
  }, [warehouseStorageList]);

  const getFields = (): React.ReactNode => {
    return (
      <>
        <Col span={6} key={1}>
          <Form.Item
            name="purpose"
            label="用途"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder={"用途"}/>
          </Form.Item>
        </Col>
        <Col span={6} key={2}>
          <Form.Item
            name="recipientsUnit"
            label="领用单位"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="领用单位"/>
          </Form.Item>
        </Col>
        <Col span={6} key={3}>
          <Form.Item
            name="recipient"
            label="领用人"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="领用人"/>
          </Form.Item>
        </Col>
        <Col span={6} key={4}>
          <Form.Item
            name="recipientsTime"
            label="领用时间"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>
        </Col>
      </>
    )
  };


  return (
    <Modal
      title={"库存详情"}
      visible={visible}
      width={1600}
      style={{maxHeight: 800}}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} onFinish={(values => {
        values = {...values, recipientsTime: values["recipientsTime"].format('YYYY-MM-DD HH:mm:ss')};
        onFinish(values);
      })}>
        <Row gutter={24}>{getFields()}</Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="outWarehouseRebarList"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <OutWarehouseRebarForm/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
            <Button
              style={{margin: '0 8px'}}
              onClick={() => {
                form.resetFields();
                onCancel();
              }}
            >
              取消
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )


};

export default OutWarehouseForm;


