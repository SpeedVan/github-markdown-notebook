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

import {stylesWrapper, statefulWrapper} from '../../../../common'

const useStyles = makeStyles((theme) => ({
  list: {
    width: 300,
  },
  fullList: {
    width: 'auto',
  }
}));

const ListArchor = ({anchor, classes, __hook}) => {
  // console.log(classes)
  return <div
    className={clsx(classes.list, {
      [classes.fullList]: anchor === 'top' || anchor === 'bottom',
    })}
    role="presentation"
    onClick={(e)=>__hook.setState({open:false})}
    onKeyDown={(e)=>__hook.setState({open:false})}
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

const DrawerSider = ({anchor, open, classes, __hook}) => (
  <React.Fragment key={anchor}>
    <Drawer anchor={anchor} open={open} onClose={(e)=>__hook.setState({open:false})}>
      <ListArchor anchor={anchor} classes={classes} __hook={__hook}/>
    </Drawer>
  </React.Fragment>
)

export const StatefulDrawerSider = statefulWrapper(stylesWrapper(DrawerSider, useStyles),{open:false})