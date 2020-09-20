import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Input, Popconfirm, Table, message, Select, InputNumber} from 'antd';
import React, {FC, useEffect, useState} from 'react';

import styles from '../style.less';
import {OutWarehouseRebarDataType} from "@/pages/OutWarehouse/data";
import {getBatchNumberListByConditions} from "@/pages/WarehouseStorage/service";
import OutWarehouseRebarMember, {RebarMemberOutDataType} from "@/pages/WarehouseStorage/components/OutWarehouseRebarMember";
import {DeviceDataType} from "@/pages/Device/data";
import {getDeviceListByCompanyId} from "@/pages/Device/service";

const {Option} = Select;

export interface TableFormDateType extends OutWarehouseRebarDataType {
  key: string;
  isNew?: boolean;
  editable?: boolean;
}

interface TableFormProps {
  value?: TableFormDateType[];
  onChange?: (value: TableFormDateType[]) => void;
}

const OutWarehouseRebarForm: FC<TableFormProps> = ({value, onChange}) => {
  const [clickedCancel, setClickedCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [cacheOriginData, setCacheOriginData] = useState({});
  const [data, setData] = useState(value);

  const [batchNumber, setBatchNumber] = useState<string>();

  const [currentTableForm, setCurrentTableForm] = useState<TableFormDateType | undefined>(undefined);

  const [visible, setVisible] = useState<boolean>(false);

  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

  const [selectedRebarMemberOutList, setSelectedRebarMemberOutList] = useState<RebarMemberOutDataType[]>([]);

  const [deviceList, setDeviceList] = useState<DeviceDataType[]>([]);

  useEffect(() => {
    getDeviceListByCompanyId().then(res => {
      setDeviceList(res);
    })
  }, []);

  useEffect(() => {
    setData(value);
  }, [value]);

  //TODO 批次号 ！== null 就需要将前4项disabled
  //TODO 出库数量 不为0时   批次号和出库理重也disabled

  const updateBatchNumberList = (key: string) => {
    const newData = [...(data as TableFormDateType[])];
    const target = getRowByKey(key, newData);
    if (target && target.editable && target.specification && target.diameter && target.length) {
      getBatchNumberListByConditions(target.rebarCategory, target.specification, target.diameter, target.length).then(res => {
        target.batchNumberList = res;
        setData(newData);
      });
    }
  };

  const getRowByKey = (key: string, newData?: TableFormDateType[]) =>
    (newData || data)?.filter((item) => item.key === key)[0];

  const toggleEditable = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.preventDefault();
    const newData = data?.map((item) => ({...item}));
    const target = getRowByKey(key, newData);
    if (target) {

      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        cacheOriginData[key] = {...target};
        setCacheOriginData(cacheOriginData);
      }
      target.editable = !target.editable;
      setData(newData);
    }
  };
  const newMember = () => {
    const newData = data?.map((item) => ({...item})) || [];

    newData.push({
      key: `NEW_TEMP_ID_${index}`,
      id: "",
      outWarehouseId: "",
      warehouseStorageId: "",
      rebarStorageId: "",
      rebarCategory: 0, //钢筋种类，0=棒材， 1=线材
      specification: "", //规格
      diameter: 0, //直径
      length: 0, //长度
      batchNumber: "", //批次号
      deviceId: "", //设备名称
      outboundQuantity: 0, //出库数量
      outboundQuantityUnit: "根", //出库单位 根
      outboundTheoreticalWeight: 0, //出库理重
      outboundActualWeight: 0, //出库实重
      editable: true,
      isNew: true,
      rebarMemberOutList: [],
      outWarehouseRebarMemberList: [],
      batchNumberList: [],
    });

    setIndex(index + 1);
    setData(newData);
  };

  const remove = (key: string) => {
    const newData = data?.filter((item) => item.key !== key) as TableFormDateType[];
    setData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    key: string,
  ) => {
    const newData = [...(data as TableFormDateType[])];
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      setData(newData);
    }
  };

  const handleSelectFieldChange = (
    value: any,
    fieldName: string,
    key: string,
  ) => {
    const newData = [...(data as TableFormDateType[])];
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      setData(newData);
    }
  };

  const handleInputNumberFieldChange = (
    value: string | number | undefined,
    fieldName: string,
    key: string,
  ) => {
    const newData = [...(data as TableFormDateType[])];
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      setData(newData);
    }
  };

  const saveRow = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.persist();
    setLoading(true);
    setTimeout(() => {
      if (clickedCancel) {
        setClickedCancel(false);
        return;
      }
      const target = getRowByKey(key) || ({} as any);
      if (!target.warehouseStorageId || !target.specification || !target.diameter || !target.length || !target.batchNumber || !target.deviceName || !target.outboundQuantity || !target.outboundQuantityUnit || !target.outboundTheoreticalWeight || !target.outboundActualWeight) {
        message.error('请填写完整成员信息。');
        (e.target as HTMLInputElement).focus();
        setLoading(false);
        return;
      }
      delete target.isNew;
      toggleEditable(e, key);
      target.editable = false;
      if (onChange) {
        onChange(data as TableFormDateType[]);
      }
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
    if (e.key === 'Enter') {
      saveRow(e, key);
    }
  };

  const cancel = (e: React.MouseEvent, key: string) => {
    setClickedCancel(true);
    e.preventDefault();
    const newData = [...(data as TableFormDateType[])];
    // 编辑前的原始数据
    let cacheData;
    cacheData = newData.map((item) => {
      if (item.key === key) {
        if (cacheOriginData[key]) {
          const originItem = {
            ...item,
            ...cacheOriginData[key],
            editable: false,
          };
          delete cacheOriginData[key];
          setCacheOriginData(cacheOriginData);
          return originItem;
        }
      }
      return item;
    });
    setData(cacheData);
    setClickedCancel(false);
  };

  const handleSelectDetails = (record: TableFormDateType) => {
    if (!record.batchNumber) {
      message.error("请先选择批次号！");
    } else {
      setCurrentTableForm(record);
      setSelectedKey(record.key);
      setBatchNumber(record.batchNumber);
      setSelectedRebarMemberOutList(record.rebarMemberOutList);
      setVisible(true);
    }

  };

  const handleCancel = () => {
    setCurrentTableForm(undefined);
    setSelectedRebarMemberOutList([]);
    setBatchNumber(undefined);
    setSelectedKey(undefined);
    setVisible(false);
  };

  const handleFinish = (values: RebarMemberOutDataType[], sumOutQuantity: number, sumOutTheoreticalWeight: number, rebarStorageId: string) => {
    if (!selectedKey) return;
    const newData = [...(data as TableFormDateType[])];
    let target = getRowByKey(selectedKey, newData);
    if (target) {
      target.outboundQuantity = sumOutQuantity;
      target.rebarMemberOutList = values;
      target.outboundTheoreticalWeight = sumOutTheoreticalWeight;
      target.rebarStorageId = rebarStorageId;
      target.outWarehouseRebarMemberList = values.map(item => {
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
      setData(newData);
    }
    setCurrentTableForm(undefined);
    setSelectedRebarMemberOutList([]);
    setBatchNumber(undefined);
    setSelectedKey(undefined);
    setVisible(false);
  };

  const columns = [
    {
      title: '钢筋种类',
      dataIndex: 'rebarCategory',
      key: 'rebarCategory',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Select onChange={(value) => {
              handleSelectFieldChange(value, 'workId', record.key);
              updateBatchNumberList(record.key);
            }}
                    defaultValue={record.rebarCategory}>
              <Option value={0}>{"棒材"}</Option>
              <Option value={1}>{"线材"}</Option>
            </Select>
          );
        }
        return record.rebarCategory === 0 ? "棒材" : "线材";
      },
    },
    {
      title: '规格',
      width: 200,
      dataIndex: 'specification',
      key: 'specification',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => {
                handleFieldChange(e, 'specification', record.key);
                updateBatchNumberList(record.key);
              }}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="规格"
            />
          );
        }
        return text;
      },
    },
    {
      title: '直径',
      dataIndex: 'diameter',
      key: 'diameter',
      render: (text: number, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <InputNumber
              value={text}
              onChange={(value) => {
                handleInputNumberFieldChange(value, 'diameter', record.key);
                updateBatchNumberList(record.key);
              }}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="直径"
            />
          );
        }
        return text;
      },
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
      render: (text: number, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <InputNumber
              value={text}
              onChange={(value) => {
                handleInputNumberFieldChange(value, 'length', record.key);
                updateBatchNumberList(record.key);
              }}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="长度"
            />
          );
        }
        return text;
      },
    },
    {
      title: '批次号',
      dataIndex: 'batchNumber',
      width: 200,
      key: 'batchNumber',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable && record.batchNumberList.length > 0) {
          return (
            <Select
              value={text}
              onChange={(value) => {
                handleSelectFieldChange(value, 'batchNumber', record.key);
              }}>
              {record.batchNumberList.length > 0 ? record.batchNumberList.map(item => {
                return (
                  <Option value={item}>{item}</Option>
                )
              }) : null
              }
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: '加工设备',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 200,
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Select
              value={text}
              onChange={(value) => {
                handleSelectFieldChange(value, 'deviceId', record.key);
              }}>
              {deviceList.length > 0 ? deviceList.map(item => {
                return (
                  <Option value={item.id}>{item.name}</Option>
                )
              }) : null
              }
            </Select>
          );
        }
        return deviceList.find(item => item.id === record.deviceId)?.id;
      },
    },
    {
      title: '出库数量',
      dataIndex: 'outboundQuantity',
      key: 'outboundQuantity',
      render: (text: number, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <div
              style={{width: 100}}
              onClick={() => handleSelectDetails(record)}
            >
              <InputNumber value={record.outboundQuantity ? record.outboundQuantity : 0}/>
            </div>
          );
        }
        return text;
      },
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'outboundQuantityUnit',
      key: 'outboundQuantityUnit',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(e, 'outboundQuantityUnit', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="根"
            />
          );
        }
        return text;
      },
    },
    {
      title: '出库理重',
      dataIndex: 'outboundTheoreticalWeight',
      key: 'outboundTheoreticalWeight',
      render: (text: number, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <InputNumber
              value={text}
              onChange={(value) => handleInputNumberFieldChange(value, 'outboundTheoreticalWeight', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="出库理重"
            />
          );
        }
        return text;
      },
    },
    {
      title: '出库实重',
      dataIndex: 'outboundActualWeight',
      key: 'outboundActualWeight',
      render: (text: number, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <InputNumber
              value={text}
              onChange={(value) => handleInputNumberFieldChange(value, 'outboundActualWeight', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="出库实重"
            />
          );
        }
        return text;
      },
    },

    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableFormDateType) => {
        if (!!record.editable && loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={(e) => saveRow(e, record.key)}>添加</a>
                <Divider type="vertical"/>
                <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={(e) => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical"/>
              <a onClick={(e) => cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={(e) => toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Table<TableFormDateType>
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName={(record) => (record.editable ? styles.editable : '')}
        bordered
      />
      <Button
        style={{width: '100%', marginTop: 16, marginBottom: 8}}
        type="dashed"
        onClick={newMember}
      >
        <PlusOutlined/>
        添加空行
      </Button>
      <OutWarehouseRebarMember visible={visible} currentTableForm={currentTableForm} batchNumber={batchNumber}
                               rebarMemberOutEdited={selectedRebarMemberOutList} onCancel={handleCancel}
                               onFinish={handleFinish}/>
    </>
  );
};

export default OutWarehouseRebarForm;
