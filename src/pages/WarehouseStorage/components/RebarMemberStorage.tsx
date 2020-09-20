import React, {useEffect, useRef, useState} from 'react';
import {
  RebarMemberStorageDataType,
  RebarMemberStorageQueryParamsDataType,
  RebarStorageDataType,
  WarehouseStorageDataType
} from "@/pages/WarehouseStorage/data";
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {Button, Col, Descriptions, Modal, Row} from "antd";
import {getRebarCategories} from "@/pages/WarehouseEntry/service";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {getRebarMemberStoragePageByRebarStorageId, getRebarStorageStorageById} from "@/pages/WarehouseStorage/service";

interface RebarMemberStorageProps {
  visible: boolean;
  warehouseStorage: Partial<WarehouseStorageDataType>;
  currentId: string | undefined;
  onCancel: () => void;
}

const RebarMemberStorage: React.FC<RebarMemberStorageProps> = (props) => {

  const actionRef = useRef<ActionType>();

  const {visible, warehouseStorage, currentId, onCancel} = props;

  const [rebarStorage, setRebarStorage] = useState<Partial<RebarStorageDataType>>({});


  useEffect(() => {
    if (visible) {
      if (!currentId) return;
      // 获取rebarStorage
      getRebarStorageStorageById(currentId).then( res => {
        setRebarStorage(res);
      });
      if (actionRef.current) actionRef.current.reload();
    }
  }, [visible]);

  const columns: ProColumns<RebarMemberStorageDataType>[] = [
    {
      title: '捆序号',
      dataIndex: 'rebarIndex',
      width: 300,
    },
    {
      title: '根数',
      dataIndex: 'quantity',
      width: 300,
    },
    {
      title: '理重（T）',
      dataIndex: 'theoreticalWeight',
      width: 300,
    },
  ];

  return (
    <Modal
      title={"钢筋捆库存"}
      visible={visible}
      width={1000}
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
          <Descriptions column={5} >
            <Descriptions.Item label="材料种类">{getRebarCategories().find(item => item.id === warehouseStorage.rebarCategory)?.type}</Descriptions.Item>
            <Descriptions.Item label="规格">{warehouseStorage.specification}</Descriptions.Item>
            <Descriptions.Item label="直径">{warehouseStorage.diameter}</Descriptions.Item>
            <Descriptions.Item label="长度">{warehouseStorage.length}</Descriptions.Item>
            <Descriptions.Item label="批次号">{rebarStorage.batchNumber}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <ProTable<RebarMemberStorageDataType>
            rowKey={"id"}
            columns={columns}
            actionRef={actionRef}
            headerTitle={false}
            search={false}
            options={false}
            request={async (params) => {
              if (!currentId) return;
              const pageParams: RebarMemberStorageQueryParamsDataType = {
                current: params.current? params.current : 1,
                pageSize: params.pageSize? params.pageSize : 10,
                rebarStorageId: currentId,
                ...params,
              };
              return await getRebarMemberStoragePageByRebarStorageId(pageParams);
            }}
            pagination={{pageSize: 10}}
          />
        </Col>
      </Row>
    </Modal>
  )
};

export default RebarMemberStorage;
