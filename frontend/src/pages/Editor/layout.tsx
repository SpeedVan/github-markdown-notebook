import React from 'react';
import './layout.css'

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';


import { Layout, Menu, Breadcrumb } from 'antd';
import Editor from './editor'
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

// let data:{[key:string]:any}= {}

// setInterval(()=>{
//   console.log(data["a"])
//   data["a"]({})
// }, 5000)

const Hook = <T extends {}>(C:React.JSXElementConstructor<T>, f:Function) => {
  class tCom extends React.Component<T> {
    constructor(props:T) {
      super(props)
    }
    componentDidMount() {
      f(this)
    }
    render(){
      console.log("渲染一次")
      return <C {...{...this.props, ...this.state}} />
    }
  }

  return tCom
}


const EContent = Hook(Editor, (t:any)=>{
  fetch("www.baidu.com").then(res => res.text()).then(txt=>t.setState({content:txt}))
})


const EditorLayout = () => (
  <Layout className="editor">
    <Header className="header">
      {/* <div className="logo" /> */}
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Breadcrumb style={{ margin: '16px 20px' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb>
    <Content className="content" style={{ padding: '0 50px' }}>
      <Layout className="layout" style={{ padding: '24px 0' }}>
        <Sider className="sider" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content className="content" style={{ padding: '0 24px', minHeight: 280 }}><EContent content=""/></Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)

export default EditorLayout