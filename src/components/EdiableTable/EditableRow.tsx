import React from 'react';
import {Form} from "antd";

export const EditableContext = React.createContext<any>({});

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = (props) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr/>
      </EditableContext.Provider>
    </Form>
  )
};

export default EditableRow;
