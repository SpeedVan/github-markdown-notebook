import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwipeableViews from 'react-swipeable-views';
import { withRouter } from "react-router-dom";

import { statefulWrapper, stylesWrapper } from '../../../../common'
import { makeStyles } from '@material-ui/core/styles';

const TabPanel = ({ children, value, index, classes, ...other }) => {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className = {classes.tabpanel}
      {...other}
    >
      {value === index && (
        <Box className = {classes.tabpanel}>
          <Typography className = {classes.tabpanel}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


export const StatefulTabsBar = statefulWrapper(withRouter(props=>
  <Tabs
    value={props.history.location.pathname}
    onChange={(e,v)=>props.history.push(v)}
    // value={this.state.value}
    // onChange={(e,v)=>obj.value=v}
    indicatorColor="primary"
    textColor="primary"
    // variant="fullWidth"
    aria-label="full width tabs example"
  >
    {
      props.items.map((item, index)=><Tab label={item.label} value={props.pathPrefix+"/"+item.label} {...a11yProps(index)} />)
    }
  </Tabs>
))

export const StatefulTabsContent = statefulWrapper(withRouter(
  stylesWrapper(({history, classes, items, pathPrefix}) =>
    // <SwipeableViews
    //   axis={'x'}
    //   index={history.location.pathname}
    //   // onChangeIndex={handleChangeIndex}
    //   className={classes.root}
    //   // style={{minHeight:"100%"}}
    //   containerStyle={{height:"100%"}}
    //   // slideStyle={{overflowX:undefined, overflowY:undefined}}
    //   slideClassName= {classes.slide}
    // >
    <div className={classes.root} >
      {
        items.map(item=>
          <TabPanel value={pathPrefix+"/"+item.label} label={item.label} index={history.location.pathname} dir={'ltr'} classes={classes} >
            {item.component?<item.component />:<div />}
          </TabPanel>
        )
      }
    </div>
    // </SwipeableViews>
    ,
    makeStyles((theme) => ({
      root: {
        // flexGrow: 1,
        display: 'block',
        height: '100%',
        width: '100%',
        willChange: 'transform',
      },
      slide: {
        height: '100%',
        width: '100%'
      },
      tabpanel: {
        height: '100%',
        width: '100%'
      }
    }))
  )
))

