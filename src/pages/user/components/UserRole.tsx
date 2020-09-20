import React, {useEffect, useState} from 'react';
import {Modal, Checkbox, Row, Col} from "antd";
import {getUserRoleByUserId} from "@/pages/user/service";
import {getRoleList} from "@/pages/Role/service";
import {CheckboxValueType} from "antd/lib/checkbox/Group";
import {RoleDataType} from "@/pages/Role/data";

interface UserRoleProps {
  visible: boolean;
  currentId: string | undefined;
  onCancel: () => void;
  onOk: (values: string[]) => void;
}

const UserRole: React.FC<UserRoleProps> = (props) => {

  const {visible, currentId, onCancel, onOk} = props;

  const [roleList, setRoleList] = useState<RoleDataType[]>([]);

  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  /**
   * 获取所有的role
   */
  useEffect(() => {
    getRoleList().then(res => {
      setRoleList(res);
    });
  }, []);

  useEffect(() => {
    if (currentId !== undefined) {
      getUserRoleByUserId(currentId).then(res => {
        setCheckedValues(res.map(userRole => {
          return userRole.roleId;
        }))
      });
    }
  }, [currentId]);

  useEffect(() => {
    if (!visible) setCheckedValues([]);
  }, [visible]);

  const handleChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedValues(checkedValues as string[]);
  };

  const renderCheckBox = (): React.ReactNode => {
    return (
      <Checkbox.Group style={{ width: '100%', marginLeft: 100 }} onChange={handleChange} value={checkedValues}>
        <Row>
          {
            roleList.map(role => {
              return (
                <Col span={8}>
                  <Checkbox value={role.id}>{role.name}</Checkbox>
                </Col>
              )
            })
          }
        </Row>
      </Checkbox.Group>
    )
  };
  return (
    <Modal
      width={800}
      visible={visible}
      title={"分配角色"}
      onCancel={onCancel}
      onOk={() => onOk(checkedValues)}
    >
      {renderCheckBox()}
    </Modal>
  )
};

export default UserRole
