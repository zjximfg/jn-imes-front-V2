import React, {useEffect, useRef, useState} from 'react';
import {RebarEntryDataType, WarehouseEntryDataType} from "@/pages/WarehouseEntry/data";
import {Divider, Modal, Tag} from "antd";
import {
  deleteRebarEntry,
  getRebarCategories,
  getRebarEntryListByWarehouseId
} from "@/pages/WarehouseEntry/service";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons/lib";
import ProTable from '@ant-design/pro-table';
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {ActionType} from "@ant-design/pro-table/lib/Table";
import {Key} from "antd/es/table/interface";

const confirm = Modal.confirm;


interface RebarEntryTableProps {
  current: Partial<WarehouseEntryDataType>;
  onEdit: (id: string) => void;
  onRefresh: () => void;
  onSelectedChange: (keys: Key[]) => void;
}

let RebarEntryTable: React.FC<RebarEntryTableProps> = (props) => {

  const {current, onEdit, onRefresh, onSelectedChange} = props;

  const actionRef = useRef<ActionType>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [rebarEntryList, setRebarEntryList] = useState<RebarEntryDataType[]>([]);

  useEffect(() => {
    if (current.id) {
      getRebarEntryListByWarehouseId(current.id).then(data => {
        setRebarEntryList(data);
      });
    }
  }, [current]);

  const onSelectChange = (keys: any[]) => {
    onSelectedChange(keys);
    setSelectedRowKeys(keys);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        await deleteRebarEntry(id);
        // if (current.id) {
        //   getRebarEntryListByWarehouseId(current.id).then(data => {
        //     setRebarEntryList(data);
        //   });
        // }
        onRefresh();
        if (actionRef.current) actionRef.current.reloadAndRest();
      }
    })
  };

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
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        const editButton = record.hasPrinted ?
          <a style={{textDecoration: "none", cursor: "default", opacity: 0.2}}
             href={"javascript:return false;"}>编辑</a> :
          <a onClick={e => {
            e.preventDefault();
            onEdit(record.id);
          }} >编辑</a>;
        const deleteButton = record.hasPrinted ?
          <a style={{textDecoration: "none", cursor: "default", opacity: 0.2}}
             href={"javascript:return false;"}>删除</a> :
          <a onClick={e => {
            e.preventDefault();
            handleDelete(record.id);
          }}>删除</a>;
        return (
          <>
            {editButton}
            <Divider type={"vertical"}/>
            {deleteButton}
          </>
        )
      }
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <ProTable<RebarEntryDataType>
      bordered
      rowKey={"id"}
      columns={columns}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={rebarEntryList}
      pagination={false}
      actionRef={actionRef}
      rowSelection={rowSelection}
    />
  )
};

export default RebarEntryTable;

