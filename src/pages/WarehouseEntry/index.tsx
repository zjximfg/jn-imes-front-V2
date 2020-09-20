import React, {useRef, useState} from 'react';
import {Button, Divider, message, Modal, Tag, Upload} from "antd";
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {
  ExclamationCircleOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  PrinterOutlined
} from "@ant-design/icons/lib";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {
  AccessoryDataType,
  RebarEntryDataType,
  WarehouseEntryDataType,
  WarehouseEntryQueryParamsDataType
} from "@/pages/WarehouseEntry/data";
import {
  deleteWarehouseEntry,
  downloadTemplateExcel,
  getProcurementMethods,
  getWarehouseEntryPageByCompanyId,
  importExcel,
  insertRebarEntry,
  insertWarehouseEntry,
  printRebarEntries,
  updateRebarEntry,
  updateWarehouseEntry
} from "@/pages/WarehouseEntry/service";
import RebarEntryTable from "@/pages/WarehouseEntry/components/RebarEntryTable";
import WarehouseEntryForm from "@/pages/WarehouseEntry/components/WarehouseEntryForm";
import RebarEntryForm from "@/pages/WarehouseEntry/components/RebarEntryForm";
import {RcFile} from "antd/es/upload";
import {downloadCallback} from "@/utils/utils";
import {Key} from "antd/es/table/interface";


const confirm = Modal.confirm;


const WarehouseEntry: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState<boolean>(false);
  const [rebarEntryVisible, setRebarEntryVisible] = useState<boolean>(false);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [rebarEntryId, setRebarEntryId] = useState<string | undefined>(undefined);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  let printList = new Map<string, string[]>();

  const [type, setType] = useState<string>("create");

  const handleEdit = (id: string) => {
    setCurrentId(id);
    setType("edit");
    setVisible(true);
  };

  const handleRebarEntryEdit = (id: string) => {
    setRebarEntryId(id);
    setType("edit");
    setRebarEntryVisible(true);
  };


  const handleAdd = () => {
    setCurrentId(undefined);
    setType("create");
    setVisible(true);
  };

  const handleRebarAdd = (id: string) => {
    setCurrentId(id);
    setRebarEntryId(undefined);
    setType("create");
    setRebarEntryVisible(true);
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
        const res = await deleteWarehouseEntry(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reload();
        }
      }
    })
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setRebarEntryId(undefined);
    setVisible(false);
    setRebarEntryVisible(false);
  };

  const handleFinish = async (values: Partial<WarehouseEntryDataType>, fileList: AccessoryDataType[]) => {
    values.accessories = fileList;
    if (currentId && type === 'edit') {
      // 编辑
      await updateWarehouseEntry(currentId, values);
    } else {
      // 新建
      await insertWarehouseEntry(values);
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reload();
  };

  const handleRebarEntryFinish = async (values: Partial<RebarEntryDataType>, fileList: AccessoryDataType[]) => {
    values.accessories = fileList;
    if (rebarEntryId && type === 'edit') {
      // 编辑
      await updateRebarEntry(rebarEntryId, values);
    } else {
      // 新建
      values = {...values, warehouseEntryId: currentId};
      await insertRebarEntry(values);
    }
    setRebarEntryVisible(false);
    setRebarEntryId(undefined);
    if (actionRef.current)
      actionRef.current.reload();
  };

  const handleSelectedChange = (keys: Key[], id: string) => {
    printList.set(id, keys as string[]);
  };

  const handlePrint = () => {
    //todo
    let list: string[] = [];
    printList.forEach((value) => {
      value.forEach(m =>{
        list.push(m);
      })
    });
    if (!list || list.length <= 0) return;
    printRebarEntries(list).then(res => {
      if (res.size === 0) return;
      const fileName = "料牌.pdf";
      if (fileName) {
        downloadCallback(res, fileName);
      }
      if (actionRef.current) actionRef.current.reload();
    });
  };

  const handleImport = (warehouseEntryId: string, file: RcFile) => {
    // 包装成 formData 用于转换成文件流格式
    const formData = new FormData();
    formData.set('file', file);
    importExcel(warehouseEntryId, formData).then(() => {
      if (actionRef.current)
        actionRef.current.reload();
      message.success(`文件导入成功`);
    });
    // 返回 false 禁止组件自动上传
    return false;
  };

  const handleDownload = () => {
    setDownloadLoading(true);
    if (downloadLoading) return;
    downloadTemplateExcel().then(res => {
      if (res.size === 0) return;
      const fileName = "Rebar Entry Import Template.xlsx";
      if (fileName) {
        downloadCallback(res, fileName);
      }
    }).finally(() => {
      setDownloadLoading(false);
    });
  };

  const handleRefresh = () => {
    if (actionRef.current)
      actionRef.current.reload();
  };

  const columns: ProColumns<WarehouseEntryDataType>[] = [
    {
      title: "流水号",
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <Tag icon={<InfoCircleOutlined />} color="#55acee">
            {record.id}
          </Tag>
        )
      }
    },

    {
      title: '采购方式',
      dataIndex: 'procurementMethod',
      hideInSearch: true,
      render: (text, record) => {
        return getProcurementMethods().find(item => item.id === record.procurementMethod)?.type
      }
    },
    {
      title: '收货日期',
      dataIndex: 'receivingTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '总理重(T)',
      dataIndex: 'totalTheoreticalWeight',
      hideInSearch: true,
      render: (text, record) => {
        return record.totalTheoreticalWeight?.toFixed(3);
      }
    },
    {
      title: '总实重(T)',
      dataIndex: 'totalActualWeight',
      hideInSearch: true,
      render: (text, record) => {
        return record.totalActualWeight?.toFixed(3);
      }
    },
    {
      title: '共计(批次)',
      hideInSearch: true,
      dataIndex: 'total',
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
            <a style={{display: record.total>0? "none": "display"}} onClick={e => {
              e.preventDefault();
              handleDelete(record.id);
            }}>删除</a>
            <Divider type={"vertical"} style={{display: record.total>0? "none": "display"}}/>
            <a onClick={e => {
              e.preventDefault();
              handleRebarAdd(record.id);
            }}>添加钢筋明细</a>
            <Divider type={"vertical"} style={{display: record.total>0? "none": "display"}}/>
            <Upload  name={"file"} beforeUpload={file => handleImport(record.id, file)} fileList={[]}>
              <a style={{display: record.total>0? "none": "display"}}>导入钢筋明细</a>
            </Upload>
          </>
        )
      }
    },
    {
      // 用于查询
      title: "收货日期范围",
      valueType: 'dateTimeRange',
      dataIndex: 'receivingTimeRange',
      hideInTable: true,     // 不在表格中显示
    },
  ];


  const expandedRowRender = (record: WarehouseEntryDataType) => {

    return <RebarEntryTable current={record} onEdit={handleRebarEntryEdit} onRefresh={handleRefresh} onSelectedChange={(keys) => handleSelectedChange(keys, record.id)} />
  };

  return (
    <PageContainer>
      <ProTable<WarehouseEntryDataType>
        rowKey={"id"}
        headerTitle={"原材入库单"}
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const pageParams: WarehouseEntryQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20,
            ...params,
          };
          return await getWarehouseEntryPageByCompanyId(pageParams);
        }}
        beforeSearchSubmit={(params: Partial<WarehouseEntryDataType>) => {
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
              <PlusOutlined /> 新建入库单
            </Button>,
            <Button type={"primary"} onClick={() => handlePrint()}>
              <PrinterOutlined /> 打印原材牌
            </Button>,
            <Button  >
              <ExportOutlined /> 导出
            </Button>,
            <Button onClick={() => handleDownload()}>
              <ExportOutlined /> 钢筋模板下载
            </Button>

          ]
        }}
      />

      <WarehouseEntryForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
      <RebarEntryForm visible={rebarEntryVisible} type={type} currentId={rebarEntryId} onCancel={handleCancel} onFinish={handleRebarEntryFinish}/>
    </PageContainer>
  )

};

export default WarehouseEntry;
