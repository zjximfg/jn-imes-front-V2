import React, {Key, useEffect, useRef, useState} from 'react';
import {
  RebarMemberStorageDataType,
  RebarStorageDataType,
} from "@/pages/WarehouseStorage/data";
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {Button, Col, Descriptions, InputNumber, Modal, Row} from "antd";
import {getRebarCategories} from "@/pages/WarehouseEntry/service";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {
  getRebarMemberStorageListByRebarStorageId,
  getRebarStorageStorageByBatchNumber
} from "@/pages/WarehouseStorage/service";
import {TableFormDateType} from "@/pages/WarehouseStorage/components/OutWarehouseRebarForm";

interface OutWarehouseRebarMemberProps {
  visible: boolean;
  currentTableForm: TableFormDateType | undefined;
  batchNumber: string | undefined;
  onCancel: () => void;
  rebarMemberOutEdited: RebarMemberOutDataType[];
  onFinish: (values: RebarMemberOutDataType[], sumOutQuantity: number, sumOutTheoreticalWeight: number, rebarStorageId: string) => void;
}

export interface RebarMemberOutDataType extends RebarMemberStorageDataType {
  outQuantity: number;
  outTheoreticalWeight: number;
}

const OutWarehouseRebarMember: React.FC<OutWarehouseRebarMemberProps> = (props) => {

  const actionRef = useRef<ActionType>();

  const {visible, currentTableForm, batchNumber, onCancel, onFinish, rebarMemberOutEdited} = props;

  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const [selectedRebarMemberOutList, setSelectedRebarMemberOutList] = useState<RebarMemberOutDataType[]>([]);

  const [rebarStorage, setRebarStorage] = useState<Partial<RebarStorageDataType>>({});

  const [rebarMemberOutList, setRebarMemberOutList] = useState<RebarMemberOutDataType[]>();


  useEffect(() => {
    if (visible) {
      if (!batchNumber) return;
      // 获取rebarStorage
      getRebarStorageStorageByBatchNumber(batchNumber).then(res => {
        setRebarStorage(res);
      });
      if (actionRef.current) actionRef.current.reload();
    }
  }, [visible]);

  useEffect(() => {
    if (rebarStorage && rebarStorage.id) {
      getRebarMemberStorageListByRebarStorageId(rebarStorage.id).then(res => {
        let data;
        data = res.map(rebarMemberStorage => {
          let result = {
            ...rebarMemberStorage,
            outQuantity: rebarMemberStorage.quantity,
            outTheoreticalWeight: rebarMemberStorage.theoreticalWeight,
          };
          if (rebarMemberOutEdited && rebarMemberOutEdited.length > 0) {
            rebarMemberOutEdited.forEach(item => {
              if (item.id === rebarMemberStorage.id) {
                result = item;
              }
            });
          }
          return result;
        });
        setRebarMemberOutList(data);
        if (rebarMemberOutEdited)
          setSelectedKeys(rebarMemberOutEdited.map(item => item.id))
      });
    }
  }, [rebarStorage]);

  const handleInputNumberFieldChange = (value: string | number | undefined, id: string) => {
    const selectedRebarMemberOutListTemp = selectedRebarMemberOutList.map(selectedRebarMemberOut => {
      if (selectedRebarMemberOut.id === id) {
        selectedRebarMemberOut.outQuantity = value as number;
        selectedRebarMemberOut.outTheoreticalWeight = selectedRebarMemberOut.unitTheoreticalWeight * (value as number);
      }
      return selectedRebarMemberOut;
    });
    setSelectedRebarMemberOutList(selectedRebarMemberOutListTemp);
  };

  const handleFinish = () => {
    if (!rebarStorage.id) return;
    // 限制出库数量
    selectedRebarMemberOutList.forEach(item => {
      if (item.outQuantity > item.quantity) {
        item.outQuantity = item.quantity;
      }
    });
    let sumOutQuantity = 0;
    let sumOutTheoreticalWeight = 0;
    selectedRebarMemberOutList.forEach(item => {
      sumOutQuantity += item.outQuantity;
      sumOutTheoreticalWeight += item.outTheoreticalWeight;
    });
    onFinish(selectedRebarMemberOutList, sumOutQuantity, sumOutTheoreticalWeight, rebarStorage.id);
  };

  const columns: ProColumns<RebarMemberOutDataType>[] = [
    {
      title: '捆序号',
      dataIndex: 'rebarIndex',
      width: 300,
    },
    {
      title: '出库根数',
      dataIndex: 'outQuantity',
      width: 300,
      render: (text, record: RebarMemberOutDataType) => {

        const i = selectedKeys.findIndex(selectedKey => {
          return selectedKey === record.id;
        });

        if (i === -1) {
          return text;
        } else {
          return (
            <InputNumber
              value={record.outQuantity}
              onChange={(value) => handleInputNumberFieldChange(value, record.id)}
              // onKeyPress={(e) => handleKeyPress(e, record.id)}
            />
          )
        }
      },
    },
    {
      title: '理重（T）',
      dataIndex: 'theoreticalWeight',
      width: 300,
    },
    {
      title: '出库理重（T）',
      dataIndex: 'outTheoreticalWeight',
      width: 300,
    },
  ];

  const handleSelectedChange = (selectedRowKeys: Key[], selectedRows: RebarMemberOutDataType[]) => {
    setSelectedKeys(selectedRowKeys);
    setSelectedRebarMemberOutList(selectedRows);
  };

  return (
    <Modal
      title={"钢筋捆库存"}
      visible={visible}
      width={1000}
      style={{height: 800}}
      onCancel={onCancel}
      footer={[
        <Button key="submit" onClick={handleFinish}>
          确定
        </Button>,
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Descriptions column={5}>
            <Descriptions.Item
              label="材料种类">{getRebarCategories().find(item => item.id === currentTableForm?.rebarCategory)?.type}</Descriptions.Item>
            <Descriptions.Item label="规格">{currentTableForm?.specification}</Descriptions.Item>
            <Descriptions.Item label="直径">{currentTableForm?.diameter}</Descriptions.Item>
            <Descriptions.Item label="长度">{currentTableForm?.length}</Descriptions.Item>
            <Descriptions.Item label="批次号">{rebarStorage.batchNumber}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <ProTable<RebarMemberOutDataType>
            rowKey={"id"}
            columns={columns}
            actionRef={actionRef}
            headerTitle={false}
            style={{maxHeight: 600, overflowY: "auto"}}
            rowSelection={{selectedRowKeys: selectedKeys, onChange: handleSelectedChange}}
            search={false}
            options={false}
            pagination={false}
            dataSource={rebarMemberOutList}
          />
        </Col>
      </Row>
    </Modal>
  )
};

export default OutWarehouseRebarMember;
