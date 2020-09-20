import React, {Key, useRef, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {
  getRebarCategories,
} from "@/pages/WarehouseEntry/service";
import {Button, Tag} from "antd";
import {ExclamationCircleOutlined, ExportOutlined} from "@ant-design/icons/lib";
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {WarehouseStorageDataType, WarehouseStorageQueryParamsDataType} from "@/pages/WarehouseStorage/data";
import {getWarehouseStoragePageByCompanyId} from "@/pages/WarehouseStorage/service";
import WarehouseStorageInfo from "@/pages/WarehouseStorage/components/WarehouseStorageInfo";
import OutWarehouseForm from "@/pages/WarehouseStorage/components/OutWarehouseForm";
import {OutWarehouseDataType} from "@/pages/OutWarehouse/data";
import {insertOutWarehouseCascade} from "@/pages/OutWarehouse/service";


const WarehouseStorage: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [visible, setVisible] = useState<boolean>(false);

  const [outWarehouseVisible, setOutWarehouseVisible] = useState<boolean>(false);

  const [selectedWarehouseStorageList, setSelectedWarehouseStorageList] = useState<WarehouseStorageDataType[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);


  const handleDetail = (id: string) => {
    setCurrentId(id);
    setVisible(true);
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setVisible(false);
    // 同时清除选择框
    setSelectedWarehouseStorageList([]);
    setOutWarehouseVisible(false);
    setSelectedKeys([]);

  };

  const handleSelectedChange = (selectedRowKeys: Key[], selectedRows: WarehouseStorageDataType[]) => {
    setSelectedKeys(selectedRowKeys);
    setSelectedWarehouseStorageList(selectedRows);
  };

  const handleOutWarehouse = () => {
    setOutWarehouseVisible(true);
  };

  const handleOutWarehouseFinish = async (values: Partial<OutWarehouseDataType>) => {
    // 新建数据
    await insertOutWarehouseCascade(values);
    setOutWarehouseVisible(false);
    setSelectedWarehouseStorageList([]);
    setSelectedKeys([]);

    if (actionRef.current) actionRef.current.reload();
  };

  let object = {};
  getRebarCategories().forEach(item => {
    object[item.id] = item.type;
  });

  const columns: ProColumns<WarehouseStorageDataType>[] = [
    {
      title: "材料种类",
      dataIndex: 'rebarCategory',
      width: 200,
      sorter: true,
      valueEnum: object,
      render: (text, record) => {
        return getRebarCategories().find(item => item.id === record.rebarCategory)?.type;
      }
    },

    {
      title: '规格',
      sorter: true,
      width: 250,
      dataIndex: 'specification',
    },
    {
      title: '直径',
      sorter: true,
      width: 200,
      dataIndex: 'diameter',
      valueType: 'digit',
    },
    {
      title: '长度',
      sorter: true,
      width: 200,
      dataIndex: 'length',
      valueType: 'digit',
    },
    {
      title: '总理重(T)',
      sorter: true,
      dataIndex: 'totalTheoreticalWeight',
      hideInSearch: true,
      render: (text, record) => {
        return record.totalTheoreticalWeight?.toFixed(3);
      }
    },
    {
      title: '库存预警',
      width: 300,
      hideInSearch: true,
      dataIndex: 'alarmInfo',
      render: (text, record) => {
        return record.alarmInfo ?
          <Tag icon={<ExclamationCircleOutlined/>} color="warning">
            {record.alarmInfo}
          </Tag> : "-";
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record) => {
        return (
          <>
            <a onClick={e => {
              e.preventDefault();
              handleDetail(record.id);
            }}>库存详情</a>
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
      <ProTable<WarehouseStorageDataType>
        rowKey={"id"}
        headerTitle={"原材库存"}
        actionRef={actionRef}
        rowSelection={{selectedRowKeys: selectedKeys, onChange: handleSelectedChange}}
        columns={columns}
        request={async (params, sort) => {
          const pageParams: WarehouseStorageQueryParamsDataType = {
            current: params.current ? params.current : 1,
            pageSize: params.pageSize ? params.pageSize : 20,
            sortName: Object.keys(sort)[0],
            sortOrder: Object.values(sort)[0] as string,
            ...params,
          };
          return await getWarehouseStoragePageByCompanyId(pageParams);
        }}
        toolBarRender={(_, {selectedRowKeys}) => [
          selectedRowKeys && selectedRowKeys.length && (
            <Button type={"primary"} onClick={handleOutWarehouse}>
              <ExportOutlined/> 出库
            </Button>
          ),
          <Button>
            <ExportOutlined/> 导出
          </Button>
        ]}
      />

      <WarehouseStorageInfo visible={visible} currentId={currentId} onCancel={handleCancel}/>
      <OutWarehouseForm visible={outWarehouseVisible} warehouseStorageList={selectedWarehouseStorageList}
                        onCancel={handleCancel} onFinish={handleOutWarehouseFinish}/>
    </PageContainer>
  )
};

export default WarehouseStorage;
