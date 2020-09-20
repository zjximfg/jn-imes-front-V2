import React, {useContext, useEffect, useRef, useState} from 'react';
import {EditableContext} from "@/components/EdiableTable/EditableRow";
import {FormInstance} from "antd/es/form";
import {Form, Input} from 'antd';

export interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = (props) => {
  const {title, editable, children, dataIndex, record, handleSave} = props;

  const [editing, setEditing] = useState<boolean>(false);
  const inputRef = useRef<any>();
  const form: FormInstance = useContext(EditableContext);

  useEffect(() => {
    if (editable) {
      if (inputRef.current !== undefined) {
        inputRef.current.focus();
      }
    }
  }, [editable]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({...record, ...values});
    } catch (err) {
      console.log(err);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing? (
      <Form.Item
        style={{margin:0}}
        name={dataIndex}
        rules={[{required: true,  message: `${title} is required.`,}]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
      </Form.Item>
    ) : (
      <div className={"editable-cell-value-wrap"} style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td>{childNode}</td>;
};

export default EditableCell;

