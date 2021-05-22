// @ts-nocheck 
import React from 'react';
import './layout.css'

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Layout, Menu, Breadcrumb } from 'antd';

import Editor from './editor'
import { HookMounted, HookProps } from '../../common'

// import SubMenu from 'antd/lib/menu/SubMenu';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

let Editor_setState = {}
const HookEditor = HookMounted(Editor, (t: any) => {
  Editor_setState.f = (data)=>t.setState(data)
})

const HookItem = HookProps(Menu.Item, {
  onClick:function(t) {
    return (e) => {
      console.log("Item_", t, e, Editor_setState)
      fetch("/api/v1/raw/"+e.key)
      .then(res => res.text())
      .then(txt => {
        Editor_setState.f({ content: txt })
      })
    }
  }
})

const HookMenu = HookMounted(Menu, (t: any) =>{
  fetch("/api/v1/tree/", { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
  .then(res => res.json())
  .then(j => t.setState({ data: j, children:[j.map((item:any)=>item.type === "dir"?<HookSubMenu key={item.path} title={item.name} />:<HookItem key={item.path} >{item.name}</HookItem>)] }))
})

const SubMenu_p = HookProps(SubMenu, {
  onOpenChange:function(t){
    const originFunc = t.props.onOpenChange
    return (e) => {
      if (e.open) {
        fetch("/api/v1/tree/"+e.key, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
        .then(res => res.json())
        .then(j => {
          t.setState({ data: j, children:[j.map((item:any)=>item.type === "dir"?<HookSubMenu key={item.path} title={item.name}/>:<HookItem key={item.path}>{item.name}</HookItem>)] })
          originFunc(e)
        })
      } else {
        originFunc(e)
      }
    }
  }
})


const HookSubMenu = HookMounted(SubMenu_p, (t: any) =>{})

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
          <HookMenu
            mode="inline"
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
          </HookMenu>
        </Sider>
        <Content className="content" style={{ padding: '0 24px', minHeight: 280 }}><HookEditor content="" /></Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)

export default EditorLayout