import React from 'react';
import clsx from 'clsx';

import Drawer from '@material-ui/core/Drawer';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import { makeStyles } from '@material-ui/core/styles';


// const drawer = (anchor) => (
//   <React.Fragment key={anchor}>
//     <Drawer anchor={anchor} open={state.open} onClose={toggleDrawer(false)}>
//       {list(anchor)}
//     </Drawer>
//   </React.Fragment>
// )

const SubscribeObject = (obj) => {
  const newObj = {
    __obj: obj,
    __subfuncs: {}
  }
  for (let key in obj) {
    newObj.__defineGetter__(key, function () {
      return this.__obj[key]
    });
    newObj.__defineSetter__(key, function (x) {
      this.__obj[key] = x
      this.__subfuncs[key].forEach(f => f(x))
    });

    newObj.__subfuncs[key] = []
  }

  return newObj
}
const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  }
}));

const DrawerBuild = (anchor) => {
  const obj = SubscribeObject({ open: false })
  // const useStyles = makeStyles(() => ({
  //   list: {
  //     width: 250,
  //   },
  //   fullList: {
  //     width: 'auto',
  //   }
  // }))
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    obj.open = open
  };

  const ListArchor = ({anchor}) => {
    const classes = useStyles()
    // console.log(classes)
    return <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  }

  class DrawerSider extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
      }
    }
    componentDidMount() {
      obj.__subfuncs["open"].push((v)=>this.setState({open:v}))
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
      return nextState != null
    }
    render() {
      return (
        <React.Fragment key={anchor}>
          <Drawer anchor={anchor} open={this.state.open} onClose={toggleDrawer(false)}>
            <ListArchor anchor={anchor} />
          </Drawer>
        </React.Fragment>
      )
    }
  }

  return {
    sider: <DrawerSider />,
    obj: obj,
  }
}

export default DrawerBuild