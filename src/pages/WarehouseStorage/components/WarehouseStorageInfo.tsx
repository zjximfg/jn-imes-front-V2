import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Descriptions, Divider, Modal, Row} from "antd";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {
  RebarStorageDataType,
  RebarStorageQueryParamsDataType,
  WarehouseStorageDataType
} from "@/pages/WarehouseStorage/data";
import {getRebarStoragePageByWarehouseStorageId, getWarehouseStorageById} from "@/pages/WarehouseStorage/service";
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {getRebarCategories, getRebarEntryById} from "@/pages/WarehouseEntry/service";
import RebarMemberStorage from "@/pages/WarehouseStorage/components/RebarMemberStorage";
import WarehouseEntryInfo from "@/pages/WarehouseEntry/components/WarehouseEntryInfo";

interface WarehouseStorageInfoProps {
  visible: boolean;
  currentId: string | undefined;
  onCancel: () => void;
}

const WarehouseStorageInfo: React.FC<WarehouseStorageInfoProps> = (props) => {

  const actionRef = useRef<ActionType>();

  const {visible, currentId, onCancel} = props;

  const [warehouseStorage, setWarehouseStorage] = useState<Partial<WarehouseStorageDataType>>({});

  const [memberVisible, setMemberVisible] = useState<boolean>(false);

  const [warehouseEntryVisible, setWarehouseEntryVisible] = useState<boolean>(false);

  const [currentWarehouseEntryId, setCurrentWarehouseEntryId] = useState<string | undefined>(undefined);


  const [currentRebarStorageId, setCurrentRebarStorageId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      if (!currentId) return;
      // 获取warehouseStorage
      getWarehouseStorageById(currentId).then( res => {
        setWarehouseStorage(res);
      });
    }
  }, [visible]);

  const handleViewEntry = (id: string) => {
    // 获取rebarEntry数据
    getRebarEntryById(id).then(res=> {
      setCurrentWarehouseEntryId(res?.warehouseEntryId);
      setWarehouseEntryVisible(true);
    });
  };

  const handleViewMember = (id: string) => {
    setCurrentRebarStorageId(id);
    setMemberVisible(true);
  };

  const handleCancel = () => {
    setCurrentRebarStorageId(undefined);
    setCurrentWarehouseEntryId(undefined);
    setMemberVisible(false);
    setWarehouseEntryVisible(false);
  };

  const columns: ProColumns<RebarStorageDataType>[] = [
    {
      title: '厂家',
      dataIndex: 'manufacturer',
    },
    {
      title: '捆数',
      dataIndex: 'quantity',
    },
    {
      title: '总根数',
      dataIndex: 'totalQuantity',
    },
    {
      title: '总理重',
      dataIndex: 'theoreticalWeight',
    },
    {
      title: '收货时间',
      dataIndex: 'receivingTime',
    },
    {
      title: '批次号',
      dataIndex: 'batchNumber',
    },
    {
      title: '实验代码',
      dataIndex: 'experimentCode',
    },
    {
      title: '使用位置',
      dataIndex: 'usagePosition',
    },
    {
      title: '报警信息',
      dataIndex: 'alarmInfo',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <a onClick={e => {
              e.preventDefault();
              handleViewEntry(record.rebarEntryId);
            }} >入库单</a>
            <Divider type={"vertical"}/>
            <a onClick={e => {
              e.preventDefault();
              handleViewMember(record.id);
            }} >捆明细</a>
          </>
        )
      }
    }
  ];

  return (
    <Modal
      title={"库存详情"}
      visible={visible}
      width={1400}
      style={{maxHeight:800}}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Descriptions column={4} >
            <Descriptions.Item label="材料种类">{getRebarCategories().find(item => item.id === warehouseStorage.rebarCategory)?.type}</Descriptions.Item>
            <Descriptions.Item label="规格">{warehouseStorage.specification}</Descriptions.Item>
            <Descriptions.Item label="直径">{warehouseStorage.diameter}</Descriptions.Item>
            <Descriptions.Item label="长度">{warehouseStorage.length}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <ProTable<RebarStorageDataType>
            rowKey={"id"}
            columns={columns}
            actionRef={actionRef}
            headerTitle={false}
            search={false}
            options={false}
            request={async (params) => {
              if (!currentId) return;
              const pageParams: RebarStorageQueryParamsDataType = {
                current: params.current? params.current : 1,
                pageSize: params.pageSize? params.pageSize : 20,
                warehouseStorageId: currentId,
                ...params,
              };
              return await getRebarStoragePageByWarehouseStorageId(pageParams);
            }}
            pagination={{pageSize: 10}}
          />
        </Col>
      </Row>
      <RebarMemberStorage visible={memberVisible} warehouseStorage={warehouseStorage} currentId={currentRebarStorageId} onCancel={handleCancel}/>
      <WarehouseEntryInfo currentId={currentWarehouseEntryId} visible={warehouseEntryVisible} onCancel={handleCancel}/>
    </Modal>
  )
};

export default WarehouseStorageInfo;
