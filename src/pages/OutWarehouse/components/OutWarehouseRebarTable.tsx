import React, {useEffect, useRef, useState} from 'react';
import {OutWarehouseDataType, OutWarehouseRebarDataType} from "@/pages/OutWarehouse/data";
import {
  getRebarCategories,
  getOutWarehouseRebarByOutWarehouseId
} from "@/pages/OutWarehouse/service";
import ProTable, {ActionType} from '@ant-design/pro-table';
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {DeviceDataType} from "@/pages/Device/data";
import {getDeviceListByCompanyId} from "@/pages/Device/service";
import {Key} from "antd/es/table/interface";


interface OutWarehouseTableProps {
  current: Partial<OutWarehouseDataType>;
  onEdit: (id: string) => void;
  // onRefresh: () => void;
  onSelectedChange: (keys: Key[]) => void;
}

let OutWarehouseRebarTable: React.FC<OutWarehouseTableProps> = (props) => {

  const {current, onSelectedChange} = props;

  const actionRef = useRef<ActionType>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [outWarehouseRebarList, setOutWarehouseRebarList] = useState<OutWarehouseRebarDataType[]>([]);

  const [deviceList, setDeviceList] = useState<DeviceDataType[]>([]);

  useEffect(() => {
    getDeviceListByCompanyId().then(res => {
      setDeviceList(res);
    })
  }, []);

  useEffect(() => {
    if (current.id) {
      getOutWarehouseRebarByOutWarehouseId(current.id).then(data => {
        setOutWarehouseRebarList(data);
      });
    }
  }, [current]);

  const handleSelectedChange = (keys: any[]) => {
    onSelectedChange(keys);
    setSelectedRowKeys(keys);
  };

  // const handleDelete = (id: string) => {
  //   confirm({
  //     title: '你确定要删除该数据吗?',
  //     icon: <ExclamationCircleOutlined/>,
  //     content: '删除后将无法恢复该数据',
  //     okText: '是',
  //     okType: 'danger',
  //     cancelText: '否',
  //     onOk: async () => {
  //       await deleteOutWareHouseRebarById(id);
  //       onRefresh();
  //       if (actionRef.current) actionRef.current.reload();
  //     }
  //   })
  // };

  const columns: ProColumns<OutWarehouseRebarDataType>[] = [
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
      title: '批次号',
      dataIndex: 'batchNumber',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      render: (text, record) => {
        return deviceList.find(item => record.deviceId === item.id)?.name;
      }
    },
    {
      title: '出库数量',
      dataIndex: 'outboundQuantity',
    },
    {
      title: '理重(T)',
      dataIndex: 'outboundTheoreticalWeight',
      hideInSearch: true,
      render: (text, record) => {
        return record.outboundTheoreticalWeight.toFixed(3);
      }
    },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   render: (text, record) => {
    //     const editButton =
    //       <a onClick={e => {
    //         e.preventDefault();
    //         onEdit(record.id);
    //       }}>编辑</a>;
    //     const deleteButton =
    //       <a onClick={e => {
    //         e.preventDefault();
    //         handleDelete(record.id);
    //       }}>删除</a>;
    //     return (
    //       <>
    //         {editButton}
    //         <Divider type={"vertical"}/>
    //         {deleteButton}
    //       </>
    //     )
    //   }
    // }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectedChange,
  };

  return (
    <ProTable<OutWarehouseRebarDataType>
      bordered
      rowKey={"id"}
      columns={columns}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={outWarehouseRebarList}
      pagination={false}
      actionRef={actionRef}
      rowSelection={rowSelection}
    />
  )
};

export default OutWarehouseRebarTable;

