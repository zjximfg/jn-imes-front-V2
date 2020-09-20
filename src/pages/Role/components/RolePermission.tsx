import React, {useEffect, useState} from 'react';
import {Modal, Tree} from "antd";
import {getRolePermissionByRoleId} from "@/pages/Role/service";
import {TreeNodeNormal} from "antd/es/tree/Tree";
import {listToTreeData} from "@/utils/utils";
import {getPermissionList} from "@/pages/Permission/service";

interface RolePermissionProps {
  visible: boolean;
  currentId: string | undefined;
  onCancel: () => void;
  onOk: (values: string[]) => void;
}

const RolePermission: React.FC<RolePermissionProps> = (props) => {

  const {visible, currentId, onCancel, onOk} = props;

  const [treeData, setTreeData] = useState<TreeNodeNormal[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  /**
   * 加载所有的Permission
   */
  useEffect(() => {
    getPermissionList().then(res => {
      setTreeData(listToTreeData(res));
    });
  }, []);

  useEffect(() => {
    if (currentId !== undefined) {
      getRolePermissionByRoleId(currentId).then(res => {
        setCheckedKeys(res.map(rolePermission => rolePermission.permissionId));
      })
    }
  }, [currentId]);

  const handleCheck = (checked: any) => {
    setCheckedKeys(checked.checked);
  };

  const renderForm = (): React.ReactNode => {
    return (
      <Tree
        checkable
        checkStrictly
        onCheck={handleCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    )
  };

  return (
    <Modal
      title={"分配权限"}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={() => onOk(checkedKeys)}
    >
      {renderForm()}
    </Modal>
  )
};

export default RolePermission;
