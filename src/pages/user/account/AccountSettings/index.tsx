import React, {useEffect, useState} from 'react';
import {Menu} from 'antd';
import styles from './style.less';
import {GridContent} from "@ant-design/pro-layout";
import SecurityView from "@/pages/user/account/AccountSettings/components/security";
import BaseView from "@/pages/user/account/AccountSettings/components/base";
import {MenuMode} from "antd/es/menu";
import {UserDataType} from "@/pages/user/data";
import {getUserByCurrentUser} from "@/pages/user/service";

const {Item} = Menu;

type AccountSettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';

interface menuMapDataType {
  [key: string]: React.ReactNode;
}

const AccountSettings: React.FC<{}> = () => {

  const menuMap: menuMapDataType = {
    base: '基本设置',
    security: '安全设置',
    // binding: 'Account Binding',
    // notification: 'New Message Notification',
  };

  const [main, setMain] = useState<HTMLDivElement | undefined>(undefined);
  const [mode, setMode] = useState<MenuMode>('inline');
  const [selectKey, setSelectKey] = useState<AccountSettingsStateKeys>('base');
  const [user, setUser] = useState<Partial<UserDataType>>({});

  useEffect(() => {
    getUserByCurrentUser().then(res =>{
      setUser(res);
    });
    window.addEventListener('resize', resize);
    resize();
    // componentWillUnmount
    return () => window.removeEventListener('resize', resize);
  }, []);

  const resize = () => {
    if (!main) {
      return;
    }
    requestAnimationFrame();
  };

  const requestAnimationFrame = () => {
    if (!main) {
      return;
    }

    let modeLocal: 'inline' | 'horizontal' = 'inline';
    const {offsetWidth} = main;

    if (main.offsetWidth < 641 && offsetWidth > 400) {
      setMode('horizontal');
    }

    if (window.innerWidth < 768 && offsetWidth > 400) {
      setMode('horizontal');
    }
    setMode(modeLocal);
  };

  const getMenu = () => {
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  const getRightTitle = () => {
    return menuMap[selectKey];
  };

  const handleSelectKey = (key: AccountSettingsStateKeys) => {
    setSelectKey(key);
  };

  const handleUpdateFetchUser = () => {
    getUserByCurrentUser().then(res =>{
      setUser(res);
    });
  };

  const renderChildren = () => {
    switch (selectKey) {
      case 'base':
        return <BaseView user={user} onChange={handleUpdateFetchUser}/>;

      case 'security':
        return <SecurityView/>;

      default:
        break;
    }

    return null;
  };

  if (!user || !user.id) return <></>;

  return (
    <GridContent>
      <div
        className={styles.main}
        ref={ref => {
          if (ref) {
            setMain(ref);
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={mode}
            selectedKeys={[selectKey]}
            onClick={({key}) => handleSelectKey(key as AccountSettingsStateKeys)}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  )
};

 export default AccountSettings;
