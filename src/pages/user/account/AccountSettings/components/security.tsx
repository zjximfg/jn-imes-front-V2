import React, { Component } from 'react';
import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;
const passwordStrength = {
  strong: <span className="strong">Strong</span>,
  medium: <span className="medium">Medium</span>,
  weak: <span className="weak">Weak Weak</span>,
};

class SecurityView extends Component {
  getData = () => [
    {
      title: 'userandaccountandaccountsettings.security.password',
      description: (
        <>
          'userandaccountandaccountsettings.security.password-description'：
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify">Modify</a>],
    },
    {
      title: 'userandaccountandaccountsettings.security.phone',
      description: `${'userandaccountandaccountsettings.security.phone-description'}：138****8293`,
      actions: [<a key="Modify">Modify</a>],
    },
    {
      title: 'userandaccountandaccountsettings.security.question',
      description: 'userandaccountandaccountsettings.security.question-description',
      actions: [<a key="Set">Set</a>],
    },
    {
      title: 'userandaccountandaccountsettings.security.email',
      description: `${'userandaccountandaccountsettings.security.email-description'}：ant***sign.com`,
      actions: [<a key="Modify">Modify</a>],
    },
    {
      title: 'userandaccountandaccountsettings.security.mfa',
      description: 'userandaccountandaccountsettings.security.mfa-description',
      actions: [<a key="bind">Bind</a>],
    },
  ];

  render() {
    const data = this.getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default SecurityView;
