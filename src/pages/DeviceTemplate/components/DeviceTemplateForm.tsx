import React, {useEffect, useState} from "react";
import styles from "./DeviceTemplateForm.less";
import {Button, message, Upload, Form, Input, Modal} from "antd";
import {RcFile} from "antd/es/upload";
import {uploadAvatar} from "@/pages/DeviceTemplate/service";
import {UploadOutlined} from "@ant-design/icons/lib";
import {DeviceTemplateDataType} from "@/pages/DeviceTemplate/data";

interface DeviceTemplateFormProps {
  visible: boolean;
  type: string;
  current: Partial<DeviceTemplateDataType> | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<DeviceTemplateDataType>) => void;
}

const DeviceTemplateForm: React.FC<DeviceTemplateFormProps> = (props) => {

  const {current, onFinish, type, onCancel, visible} = props;

  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (current) {
      form.setFieldsValue(current);
      if (current.avatar) {
        setAvatarUrl(current.avatar);
      } else {
        setAvatarUrl("");
      }
    } else {
      form.resetFields();
     setAvatarUrl("");
    }
  }, [visible]);

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({avatar}: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>设备图片</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar"/>
      </div>
      <Upload showUploadList={false} beforeUpload={file => handleUpload(file)}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined/>
            更换图片
          </Button>
        </div>
      </Upload>
    </>
  );

  const handleUpload = (file: RcFile) => {
    // 包装成 formData 用于转换成文件流格式
    const formData = new FormData();
    formData.set('file', file);
    uploadAvatar(formData).then(res => {
      message.success(`图片上传成功`);
      setAvatarUrl(res.name);
    });
    // 返回 false 禁止组件自动上传
    return false;
  };

  const handleFinish = (values: Partial<DeviceTemplateDataType>) => {
    values.avatar = avatarUrl;
    onFinish(values);
  };

  const renderForm = (): React.ReactNode => {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        hideRequiredMark
      >
        <Form.Item label={"模板名称"} name={"name"} rules={[{required: true}]}>
          <Input type={"text"} placeholder={"模板名称"}/>
        </Form.Item>
        <Form.Item
          name="description"
          label="模板描述"
        >
          <Input.TextArea
            placeholder="模板描述"
            rows={4}
          />
        </Form.Item>
        <Form.Item>
          <Button type={"primary"} htmlType={"submit"}>提交</Button>
          <Button type={"primary"} onClick={onCancel} style={{marginLeft: 8}}>取消</Button>
        </Form.Item>
      </Form>
    )
  };

  return (
    <Modal
      title={type === 'create' ? "添加设备模板信息" : "编辑设备模板信息"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      <div className={styles.baseView} style={{marginLeft: 100}}>
        <div className={styles.left}>
          {renderForm()}
        </div>
        <div className={styles.right}>
          <AvatarView avatar={avatarUrl}/>
        </div>
      </div>
    </Modal>
  );
};

export default DeviceTemplateForm;
