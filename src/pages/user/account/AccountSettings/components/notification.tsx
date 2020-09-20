import { List, Switch } from 'antd';
import React, { Component, Fragment } from 'react';

type Unpacked<T> = T extends (infer U)[] ? U : T;

class NotificationView extends Component {
  getData = () => {
    const Action = (
      <Switch
        checkedChildren="userandaccountandaccountsettings.settings.open"
        unCheckedChildren="userandaccountandaccountsettings.settings.close"
        defaultChecked
      />
    );
    return [
      {
        title: 'userandaccountandaccountsettings.notification.password',
        description: 'userandaccountandaccountsettings.notification.password-description',
        actions: [Action],
      },
      {
        title: 'userandaccountandaccountsettings.notification.messages',
        description: 'userandaccountandaccountsettings.notification.messages-description',
        actions: [Action],
      },
      {
        title: 'userandaccountandaccountsettings.notification.todo',
        description: 'userandaccountandaccountsettings.notification.todo-description',
        actions: [Action],
      },
    ];
  };

  render() {
    const data = this.getData();
    return (
      <Fragment>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default NotificationView;
