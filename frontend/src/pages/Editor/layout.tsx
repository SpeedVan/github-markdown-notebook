import React from 'react';
import './layout.css'

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';


import { Layout, Menu, Breadcrumb } from 'antd';
import Editor from './editor'

import data from './../../components/Data'
import { Hook } from '../../common'
import { time } from 'console';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Editor_ = Hook(Editor, (t: any) => {
  fetch("/api/v1/raw/Rust/%E5%9C%A3%E7%BB%8F%E3%80%8ARust%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E8%AF%AD%E8%A8%80%E3%80%8B/%E7%AC%AC%E5%85%AB%E7%AB%A0.md")
    .then(res => res.text())
    .then(txt => t.setState({ content: txt }))
})

const Menu_ = Hook(Menu, (t: any) =>{
  fetch("http://172.22.21.136:8080/api/v1/tree/", { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
  .then(res => res.json())
  .then(j => t.setState({ data: j, children:[j.map((item:any)=>item.type == "dir"?<SubMenu_ key={item.path} title={item.name}/>:<Menu.Item key={item.path}>{item.name}</Menu.Item>)] }))
})
const SubMenu_ = Hook(SubMenu, (t: any) =>{
  console.log(t)
  const P = t.props
  t.dp.onTitleClick=() => fetch("http://172.22.21.136:8080/api/v1/tree/"+P.eventKey, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
  .then(res => res.json())
  .then(j => t.setState({ data: j, children:[j.map((item:any)=>item.type == "dir"?<SubMenu_ key={item.path} title={item.name}/>:<Menu.Item key={item.path}>{item.name}</Menu.Item>)] }))
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
          <Menu_
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
          </Menu_>
        </Sider>
        <Content className="content" style={{ padding: '0 24px', minHeight: 280 }}><Editor content="" /></Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)

export default EditorLayout