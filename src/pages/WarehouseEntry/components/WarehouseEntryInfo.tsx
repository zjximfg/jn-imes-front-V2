import React, {useEffect, useRef, useState} from 'react';
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {Button, Col, Descriptions, Divider, Modal, Row, Tag} from "antd";
import {
  getProcurementMethods,
  getRebarCategories,
  getRebarEntryListByWarehouseId,
  getWarehouseEntryById
} from "@/pages/WarehouseEntry/service";
import ProTable from "@ant-design/pro-table";
import {RebarEntryDataType, WarehouseEntryDataType} from "@/pages/WarehouseEntry/data";
import {getWorkAreaListByCompanyId} from "@/pages/WorkArea/service";
import {WorkAreaDataType} from "@/pages/WorkArea/data";
import {getMaterialSupplierListByCompanyId} from "@/pages/MaterialSupplier/service";
import {MaterialSupplierDataType} from "@/pages/MaterialSupplier/data";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons/lib";

interface WarehouseEntryInfoProps {
  currentId: string | undefined;
  visible: boolean;
  onCancel: () => void;
}

const WarehouseEntryInfo: React.FC<WarehouseEntryInfoProps> = (props) => {

  const {currentId, visible, onCancel} = props;

  const actionRef = useRef<ActionType>();

  const [workAreaList, setWorkAreaList] = useState<WorkAreaDataType[]>([]);

  const [materialSupplierList, setMaterialSupplierList] = useState<MaterialSupplierDataType[]>([]);

  const [warehouseEntry, setWarehouseEntry] = useState<Partial<WarehouseEntryDataType>>({});
  const [rebarEntryList, setRebarEntryList] = useState<RebarEntryDataType[]>([]);


  useEffect(() => {
    getWorkAreaListByCompanyId().then(res => {
      setWorkAreaList(res);
    });
    getMaterialSupplierListByCompanyId().then(res => {
      setMaterialSupplierList(res);
    });
  }, []);

  useEffect(() => {
    if (visible) {
      // 获取WarehouseEntry
      if (!currentId) return;
      getWarehouseEntryById(currentId).then(res => {
        setWarehouseEntry(res);
      });
      getRebarEntryListByWarehouseId(currentId).then(res => {
        setRebarEntryList(res);
      })
    }
  }, [visible]);

  const columns: ProColumns<RebarEntryDataType>[] = [
    {
      title: '料牌打印',
      dataIndex: 'hasPrinted',
      render: (text, record) => {
        return record.hasPrinted ?
          <Tag icon={<CheckCircleOutlined/>} color="success">
            已打印
          </Tag> :
          <Tag icon={<ExclamationCircleOutlined/>} color="warning">
            未打印
          </Tag>
      }
    },
    {
      title: '材料种类',
      dataIndex: 'rebarCategory',
      render: (text, record) => {
        return getRebarCategories().find(item => record.rebarCategory === item.id)?.type;
      }
    },
    {
      title: '规格',
      dataIndex: 'specification',
    },
    {
      title: '直径',
      dataIndex: 'diameter',
    },
    {
      title: '长度(mm)',
      dataIndex: 'length',
    },
    {
      title: '厂家',
      dataIndex: 'manufacturer',
    },
    {
      title: '批次号',
      dataIndex: 'batchNumber',
    },
    {
      title: '捆数',
      render: (text, record) => {
        const text1 = record.quantity > 0 ? record.quantity + record.quantityUnit : "";
        const text2 = record.packageQuantity > 0 ? record.packageQuantity + record.packageQuantityUnit : "";
        return text1 + "*" + text2;
      }
    },
    {
      title: '理重(T)',
      dataIndex: 'theoreticalWeight',
      render: (text, record) => {
        return record.theoreticalWeight.toFixed(3);
      }
    },
    {
      title: '实重(T)',
      dataIndex: 'actualWeight',
      render: (text, record) => {
        return record.actualWeight.toFixed(3);
      }
    },
    {
      title: '使用位置',
      dataIndex: 'usagePosition',
    },
    {
      title: '实验编号',
      dataIndex: 'experimentCode',
    },
  ];


  return (
    <Modal
      title={"入库单详情"}
      visible={visible}
      width={1400}
      style={{maxHeight: 800}}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Descriptions column={3} bordered>
            <Descriptions.Item
              label="工区">{workAreaList.find(item => item.id === warehouseEntry.workAreaId)?.name}</Descriptions.Item>
            <Descriptions.Item
              label="供货商">{materialSupplierList.find(item => item.id === warehouseEntry.materialSupplierId)?.name}</Descriptions.Item>

            <Descriptions.Item label="收货时间">{warehouseEntry.receivingTime}</Descriptions.Item>
            <Descriptions.Item
              label="入库类型">{getProcurementMethods().find(item => item.id === warehouseEntry.procurementMethod)?.type}</Descriptions.Item>
            <Descriptions.Item label="签收人">{warehouseEntry.receiver}</Descriptions.Item>
            <Descriptions.Item label="交料人">{warehouseEntry.submitter}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider type={"horizontal"}/>
      <Row gutter={16} style={{marginTop: 20}}>
        <Col span={24}>
          <ProTable<RebarEntryDataType>
            rowKey={"id"}
            columns={columns}
            actionRef={actionRef}
            headerTitle={"钢筋明细"}
            dataSource={rebarEntryList}
            search={false}
            options={false}
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  )
};

export default WarehouseEntryInfo;

