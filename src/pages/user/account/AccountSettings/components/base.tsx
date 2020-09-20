import { UploadOutlined } from '@ant-design/icons';
import {Button, Input, Upload, Form, message, TreeSelect, Switch} from 'antd';
import React, {useEffect, useState} from 'react';
import styles from './BaseView.less';
import {UserDataType} from "@/pages/user/data";
import {TreeNodeNormal} from "antd/es/tree/Tree";
import {listToTreeData} from "@/utils/utils";
import {getDepartmentList} from "@/pages/Department/service";
import {updateUserById, uploadAvatar} from "@/pages/user/service";
import {RcFile} from "antd/es/upload";


interface BaseViewProps {
  user: Partial<UserDataType>;
  onChange: () => void;
}

const BaseView: React.FC<BaseViewProps> = (props) => {

  const {user, onChange} = props;

  const [treeData, setTreeData] = useState<TreeNodeNormal[]>([]);

  useEffect(() => {
    getDepartmentList().then(res => {
      setTreeData(listToTreeData(res));
    });
    form.setFieldsValue(user);
  }, []);

  const [form] = Form.useForm();

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false} beforeUpload={file => handleUpload(file)}>
        <div className={styles.button_view} >
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );

  const handleUpload = (file: RcFile) => {
    // 包装成 formData 用于转换成文件流格式
    if (!user || !user.id) return false;
    const formData = new FormData();
    formData.set('file', file);
    uploadAvatar(user.id, formData).then(() => {
      message.success(`图片上传成功`);
      onChange();
    });
    // 返回 false 禁止组件自动上传
    return false;
  };

  const getAvatarURL = () => {
    if (user) {
      if (user.avatar) {
        return user.avatar;
      }
      return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    }
    return '';
  };

  const handleFinish = async(values: Partial<UserDataType>) => {
    if (user && user.id) {
      // 编辑
      await updateUserById(user.id, values);
    }
    onChange();
    message.success('更新用户基本信息成功！');
  };

  return(
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={user}
          hideRequiredMark
        >
          <Form.Item label={"用户名"} name={"username"} rules={[{required: true}]}>
            <Input type={"text"} placeholder={"用户名"} disabled={true}/>
          </Form.Item>
          <Form.Item label={"手机号"} name={"mobile"} rules={[{required: true}]}>
            <Input type={"text"} placeholder={"手机号"}/>
          </Form.Item>
          <Form.Item label={"工号"} name={"workNumber"} rules={[{required: true}]}>
            <Input type={"text"} placeholder={"工号"}/>
          </Form.Item>
          <Form.Item label={"部门"} name={"departmentId"} >
            <TreeSelect
              treeData={treeData}
              placeholder="Please select"
            />
          </Form.Item>
          <Form.Item label={"账户状态"} name={"enableState"} rules={[{required: true}]} valuePropName={"checked"}>
            <Switch/>
          </Form.Item>
          <Form.Item
            name="description"
            label="个人描述"
          >
            <Input.TextArea
              placeholder="个人描述"
              rows={4}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
};

export default BaseView;
