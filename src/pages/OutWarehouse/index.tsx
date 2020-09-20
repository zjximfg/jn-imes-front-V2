import React, {useRef, useState} from 'react';
import {Button, Divider, Modal, Tag} from "antd";
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {
  ExclamationCircleOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons/lib";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {
  OutWarehouseQueryParamsDataType,
  OutWarehouseDataType,
  OutWarehouseRebarDataType
} from "@/pages/OutWarehouse/data";
import {
  getOutWarehousePageByCompanyId,
  deleteById,
  updateOutWarehouse,
  updateOutWarehouseRebar,
  insertOutWarehouseRebar, insertOutWarehouse
} from "@/pages/OutWarehouse/service";
import OutWarehouseRebarTable from "@/pages/OutWarehouse/components/OutWarehouseRebarTable";
import OutWarehouseForm from "@/pages/OutWarehouse/components/OutWarehouseForm";
import OutWarehouseRebarForm from "@/pages/OutWarehouse/components/OutWarehouseRebarForm";
import {Key} from "antd/es/table/interface";


const confirm = Modal.confirm;

const OutWarehouse: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState<boolean>(false);
  const [outWarehouseRebarVisible, setOutWarehouseRebarVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [OutWarehouseRecordId, setOutWarehouseRecordId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<"create" | "edit">("create");


  let printList = new Map<string, string[]>();

  const handleEdit = (id: string) => {
    setCurrentId(id);
    setType("edit");
    setVisible(true);
  };

  const handleOutRebarEdit = (id: string) => {
    setOutWarehouseRecordId(id);
    setType("edit");
    setOutWarehouseRebarVisible(true);
  };


  const handleAdd = () => {
    setCurrentId(undefined);
    setType("create");
    setVisible(true);
  };

  const handleRebarAdd = (id: string) => {
    setCurrentId(id);
    setOutWarehouseRecordId(undefined);
    setType("create");
    setOutWarehouseRebarVisible(true);
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
        const res = await deleteById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reload();
        }
      }
    })
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setOutWarehouseRecordId(undefined);
    setOutWarehouseRebarVisible(false);
    setVisible(false);
  };

  const handleFinish = async (values: Partial<OutWarehouseDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateOutWarehouse(currentId, values);
    } else {
      // 新建
      await insertOutWarehouse(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reload();
  };


  const handleRebarEntryFinish = async (values: Partial<OutWarehouseRebarDataType>) => {
    values = {...values, outWarehouseId: currentId}
    if (OutWarehouseRecordId && type === 'edit') {
      // 编辑
      await updateOutWarehouseRebar(OutWarehouseRecordId, values);
    } else {
      //新建
      await insertOutWarehouseRebar(values);
    }
    setOutWarehouseRebarVisible(false);
    setOutWarehouseRecordId(undefined);
    if (actionRef.current)
      actionRef.current.reload();
  };

  const handleSelectedChange = (keys: Key[], id: string) => {
    printList.set(id, keys as string[]);
  };



  // const handleRefresh = () => {
  //   if (actionRef.current)
  //     actionRef.current.reload();
  // };

  const columns: ProColumns<OutWarehouseDataType>[] = [
    {
      title: "流水号",
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <Tag icon={<InfoCircleOutlined/>} color="#55acee">
            {record.id}
          </Tag>
        )
      }
    },

    {
      title: '使用用途',
      dataIndex: 'purpose',
      hideInSearch: true,
      render: (text, record) => {
        return record.purpose;
      }
    },
    {
      title: '领用时间',
      dataIndex: 'recipientsTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '领用人',
      dataIndex: 'recipient',
      hideInSearch: true,
      render: (text, record) => {
        return record.recipient;
      }
    },
    {
      title: '领用单位',
      dataIndex: 'recipientsUnit',
      hideInSearch: true,
      render: (text, record) => {
        return record.recipientsUnit;
      }
    },

    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <a onClick={e => {
              e.preventDefault();
              handleEdit(record.id);
            }}>编辑</a>
            <Divider type={"vertical"}/>
            <a onClick={e => {
              e.preventDefault();
              handleDelete(record.id);
            }}>删除</a>
            <Divider type={"vertical"}/>
            <a onClick={e => {
              e.preventDefault();
              handleRebarAdd(record.id);
            }}>添加钢筋明细</a>
            <Divider type={"vertical"}/>
          </>
        )
      }
    }
  ];


  const expandedRowRender = (record: OutWarehouseDataType) => {

    return <OutWarehouseRebarTable current={record} onEdit={handleOutRebarEdit} onSelectedChange={(keys) => handleSelectedChange(keys, record.id)}/>
  };

  return (
    <PageContainer>
      <ProTable<OutWarehouseDataType>
        rowKey={"id"}
        headerTitle={"原材出库单"}
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const pageParams: OutWarehouseQueryParamsDataType = {
            current: params.current ? params.current : 1,
            pageSize: params.pageSize ? params.pageSize : 20,
            ...params,
          };
          return await getOutWarehousePageByCompanyId(pageParams);
        }}
        beforeSearchSubmit={(params: Partial<OutWarehouseDataType>) => {
          if (params.receivingTimeRange) {
            return {
              receivingTimeStart: params.receivingTimeRange[0],
              receivingTimeEnd: params.receivingTimeRange[1],
              ...params
            }
          }
          return params
        }}
        expandable={{expandedRowRender}}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined/> 新建出库单
            </Button>,
            <Button>
              <ExportOutlined/> 导出
            </Button>


          ]
        }}
      />
      <OutWarehouseForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel}
                        onFinish={handleFinish}/>
      <OutWarehouseRebarForm visible={outWarehouseRebarVisible} type={type} currentId={OutWarehouseRecordId}
                             onCancel={handleCancel} onFinish={handleRebarEntryFinish}/>
    </PageContainer>
  )
};

export default OutWarehouse;
