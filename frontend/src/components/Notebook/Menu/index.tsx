// @ts-nocheck 
import React, {Component, PropsWithChildren} from 'react';
import { Menu } from 'antd';

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu, ItemGroup } = Menu;
class DynamicItemList<P> extends Component<P>{
  constructor(props: PropsWithChildren<P>) {
    super(props)
    
    const {children, cbRef} = this.props
    cbRef.open = this.open(this)
    this.state = {
      children: children
    }
  }
  
  componentDidMount() {
  }
  render(){
    console.log("DynamicItemList 被渲染", this.props.eventKey)
    return(
      <ItemGroup {...{...this.props, ...this.state}} />
    )
  }
}



class MySubMenu extends React.Component {
  constructor(props: PropsWithChildren<P>) {
    super(props)
    
    const {children} = this.props
    this.state = {
      children: children
    }
  }
  open(key) {
    const t = this
    console.log(t)
    
  }
  render(){
    console.log("MySubMenu 被渲染", this)
    const {children} = this.state
    const _this = this
    return <SubMenu onTitleClick={function(e){
        console.log("onTitleClick", this.isOpen, e, this, this.store.getState())
        if (!this.isOpen) {
          console.log("onTitleClick not Open")
          fetch("http://106.75.181.203:8081/api/v1/tree/"+e.key, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
            .then(res => res.json())
            .then(j => {
              console.log("http cb")
              // const state = this.store.getState()
              
              _this.setState({children:[j.map((item:any)=>item.type === "dir"?<MySubMenu key={item.path} title={item.name} forceSubMenuRender={true}/>:<Menu.Item key={item.path}>{item.name}</Menu.Item>)]})
              // this.store.setState({...state, openKeys:state.openKeys.concat([e.key])})
            })
        }
      }} {...{...this.props, ...this.state}} forceSubMenuRender={true} />
  }
}

export {DynamicItemList, MySubMenu}


