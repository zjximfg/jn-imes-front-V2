import React, {useEffect, useState} from 'react';
import {Button, Col, Form, InputNumber, message, Modal, Row, Select,} from "antd";
import {
  getOutWarehouseRebarById,
  getRebarCategories,
  queryDiameterListInWarehouseStorages,
  queryLengthListInWarehouseStorages,
  querySpecificationListInWarehouseStorages
} from "@/pages/OutWarehouse/service";
import {getDeviceListByCompanyId} from "@/pages/Device/service";
import {DeviceDataType} from "@/pages/Device/data";
import {OutWarehouseRebarDataType} from "@/pages/OutWarehouse/data";
import {getBatchNumberListByConditions} from "@/pages/WarehouseStorage/service";
import OutWarehouseRebarMember, {RebarMemberOutDataType} from "@/pages/WarehouseStorage/components/OutWarehouseRebarMember";
import {TableFormDateType} from "@/pages/WarehouseStorage/components/OutWarehouseRebarForm";


const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

const Option = Select.Option;

interface OutWarehouseRebarFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<OutWarehouseRebarDataType>) => void;
}

const OutWarehouseRebarForm: React.FC<OutWarehouseRebarFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  // const [warehouseEntryId, setWarehouseEntryId] = useState<string | undefined>(undefined);

  const [deviceList, setDeviceList] = useState<DeviceDataType[]>([]);

  const [specificationList, setSpecificationList] = useState<string[]>([]);

  const [diameterList, setDiameterList] = useState<number[]>([]);

  const [lengthList, setLengthList] = useState<number[]>([]);

  const [batchNumberList, setBatchNumberList] = useState<string[]>([]);

  const [batchNumberSelectDisabled, setBatchNumberSelectDisabled] = useState<boolean>(true);

  const [baseSelectDisabled, setBaseSelectDisabled] = useState<boolean>(false);

  const [batchNumber, setBatchNumber] = useState<string>();

  const [currentTableForm, setCurrentTableForm] = useState<TableFormDateType | undefined>(undefined);

  const [memberVisible, setMemberVisible] = useState<boolean>(false);

  const [selectedRebarMemberOutList, setSelectedRebarMemberOutList] = useState<RebarMemberOutDataType[]>([]);

  const [outWarehouseRebar, setOutWarehouseRebar] = useState<Partial<OutWarehouseRebarDataType>>({});

  const [form] = Form.useForm();

  useEffect(() => {
    //初始化时，加载设备列表
    getDeviceListByCompanyId().then(data => {
      setDeviceList(data);
    });
  }, []);


  useEffect(() => {
    if (currentId !== undefined) {
      getOutWarehouseRebarById(currentId).then(res => {
        form.setFieldsValue(res);
      });
    }
  }, [currentId]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setBaseSelectDisabled(false);
    }
  }, [visible]);

  const handleSpecificationSearch = async (value: string) => {
    const result = await querySpecificationListInWarehouseStorages({...form.getFieldsValue(), specification: value});
    setSpecificationList(result);
  };

  const handleDiameterSearch = async () => {
    const result = await queryDiameterListInWarehouseStorages({...form.getFieldsValue()});
    setDiameterList(result);
  };

  const handleLengthSearch = async () => {
    const result = await queryLengthListInWarehouseStorages({...form.getFieldsValue()});
    setLengthList(result);
  };

  const handleBatchNumberSearch = async () => {
    const target = form.getFieldsValue();
    if (target && target.rebarCategory !== undefined && target.specification && target.diameter && target.length) {
      const result = await getBatchNumberListByConditions(target.rebarCategory, target.specification, target.diameter, target.length);
      setBatchNumberList(result);
    }
  };

  /**
   * 选中后禁止编辑其他选项
   * @param value
   */
  const handleBatchNumberSelected = (value: string) => {
    if (value) {
      setBaseSelectDisabled(true);
    } else {
      setBaseSelectDisabled(false);
    }
  };

  const handleSelectDetails = (record: OutWarehouseRebarDataType) => {
    if (!record.batchNumber) {
      message.error("请先选择批次号！");
    } else {
      setCurrentTableForm(record);
      setBatchNumber(record.batchNumber);
      setSelectedRebarMemberOutList(record.rebarMemberOutList);   // 用于回显
      setMemberVisible(true);
    }
  };

  const handleCancel = () => {
    setCurrentTableForm(undefined);
    setSelectedRebarMemberOutList([]);
    setBatchNumber(undefined);
    setMemberVisible(false);
  };

  const handleFinish = (values: RebarMemberOutDataType[], sumOutQuantity: number, sumOutTheoreticalWeight: number, rebarStorageId_temp: string) => {
    form.setFieldsValue({outboundQuantity: sumOutQuantity});
    form.setFieldsValue({outboundTheoreticalWeight: sumOutTheoreticalWeight});
    const rebarMemberOutList = values;
    const rebarStorageId = rebarStorageId_temp;
    const outWarehouseRebarMemberList = values.map(item => {
      return {
        id: "", // 后端生成
        outWarehouseRebarId: "", // 后端生成主表时插入
        rebarMemberStorageId: item.id,
        rebarStorageId: item.rebarStorageId,
        rebarIndex: item.rebarIndex,
        outQuantity: item.outQuantity,
        outTheoreticalWeight: item.outQuantity * item.unitTheoreticalWeight,
        unitTheoreticalWeight: item.unitTheoreticalWeight,
      }
    });
    setOutWarehouseRebar({
      rebarMemberOutList,
      rebarStorageId,
      outWarehouseRebarMemberList
    })

    setCurrentTableForm(undefined);
    setSelectedRebarMemberOutList([]);
    setBatchNumber(undefined);
    setMemberVisible(false);
  };

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout}
            onFinish={(values) => {
              values = {...values, ...outWarehouseRebar};
              console.log("values", values)
              onFinish(values);
            }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={"材料种类"} name={"rebarCategory"} rules={[{required: true}]}>
              <Select disabled={baseSelectDisabled}>
                {getRebarCategories().map(item => {
                  return (
                    <Option value={item.id}>{item.type}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"规格"} name={"specification"} rules={[{required: true}]}>
              <Select
                showSearch
                onSearch={handleSpecificationSearch}
                onFocus={() => handleSpecificationSearch(form.getFieldValue("specification"))}
                placeholder="规格"
                disabled={baseSelectDisabled}
              >
                {specificationList.map((item: string) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={"直径"} name={"diameter"} rules={[{required: true, type: 'number'}]}>
              <Select
                onFocus={() => handleDiameterSearch()}
                placeholder="直径"
                disabled={baseSelectDisabled}
              >
                {diameterList.map(item => {
                  return (
                    <Option value={item}>{item}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"长度"} name={"length"} rules={[{required: true, type: 'number'}]}>
              <Select
                onFocus={() => handleLengthSearch()}
                placeholder="长度"
                disabled={baseSelectDisabled}
              >
                {lengthList.map(item => {
                  return (
                    <Option value={item}>{item}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"批次号"} name={"batchNumber"} rules={[{required: true}]}>
              <Select
                showSearch
                onMouseEnter={() => {
                  const target = form.getFieldsValue();
                  setBatchNumberSelectDisabled(!(target.rebarCategory !== undefined && target.specification && target.diameter && target.length));
                }}    // 是能判断
                optionFilterProp="children" // 对option的内容进行搜索
                placeholder="批次号"
                disabled={batchNumberSelectDisabled}
                onSelect={handleBatchNumberSelected}  // 选中后，禁止前面的form item进行编辑
                onFocus={handleBatchNumberSearch}     // 从后端调取数据
              >
                <option value={undefined}>--请选择--</option>
                {batchNumberList.map(item => {
                  return (
                    <Option value={item}>{item}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={"deviceId"} label={"加工设备"} rules={[{required: true}]}>
              <Select>
                {deviceList.map(item => {
                  return (
                    <Option value={item.id}>{item.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"出库数量"} name={"outboundQuantity"} rules={[{required: true}]}>
              <div
                style={{width: 100}}
                onClick={() => handleSelectDetails(form.getFieldsValue())}
              >
                <InputNumber value={form.getFieldValue("outboundQuantity")}/>
              </div>
            </Form.Item>
            <Form.Item label={"理重"} name={"outboundTheoreticalWeight"} rules={[{required: true}]}>
              <InputNumber/>
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
    <>
      <Modal
        title={type === 'create' ? "新建钢筋明细" : "编辑钢筋明细"}
        visible={visible}
        footer={null}
        width={800}
        onCancel={onCancel}
      >
        {renderForm()}
      </Modal>
      <OutWarehouseRebarMember visible={memberVisible} currentTableForm={currentTableForm} batchNumber={batchNumber}
                               rebarMemberOutEdited={selectedRebarMemberOutList} onCancel={handleCancel}
                               onFinish={handleFinish}/>
    </>

  );
};

export default OutWarehouseRebarForm;
