// src/access.ts
import {CurrentUserDataType} from "@/pages/user/data";

export default function (initialState: { currentUser?: CurrentUserDataType | undefined }) {
  const { currentUser } = initialState || {};
  return {
    //canAdmin: currentUser && currentUser.access === 'admin',
    company:  currentUser && currentUser.permissionCodeMap.menus.indexOf("company") > -1,
    system:  currentUser && currentUser.permissionCodeMap.menus.indexOf("system") > -1,
    system_department:  currentUser && currentUser.permissionCodeMap.menus.indexOf("system_department") > -1,
    system_user:  currentUser && currentUser.permissionCodeMap.menus.indexOf("system_user") > -1,
    system_role:  currentUser && currentUser.permissionCodeMap.menus.indexOf("system_role") > -1,
    system_permission:  currentUser && currentUser.permissionCodeMap.menus.indexOf("system_permission") > -1,

  };
}
