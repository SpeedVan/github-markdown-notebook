import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwipeableViews from 'react-swipeable-views';

// import { fade, makeStyles, useTheme } from '@material-ui/core/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const SubscribeObject = (obj) => {
  const newObj = {
    __obj: obj,
    __subfuncs: {}
  }
  for (let key in obj) {
    newObj.__defineGetter__(key, function(){
      return this.__obj[key]
    });
    newObj.__defineSetter__(key, function(x){
      this.__obj[key] = x
      this.__subfuncs[key].forEach(f=>f(x))
    });

    newObj.__subfuncs[key] = []
  }
  
  return newObj
}

const TabsBuild = (tabsConfig) => {
  const obj = SubscribeObject({value:0})
  class TabsBar extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        value: 0
      }
    }
    componentDidMount() {
      obj.__subfuncs["value"].push((v)=>this.setState({value:v}))
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
      return nextState != null
    }
    render() {
      return (
        <Tabs
          value={this.state.value}
          onChange={(e,v)=>obj.value=v}
          indicatorColor="primary"
          textColor="primary"
          // variant="fullWidth"
          aria-label="full width tabs example"
        >
          {
            tabsConfig.map((item, index)=><Tab label={item.label} {...a11yProps(index)} />)
          }
        </Tabs>
      )
    }
  }



  class TabsContent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        value: 0
      }
    }
    componentDidMount() {
      obj.__subfuncs["value"].push((v)=>this.setState({value:v}))
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
      return nextState != null
    }
    render() {
      const {value} = this.state
      const theme = {
        direction: 'ltr'
      }
      return (
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          // onChangeIndex={handleChangeIndex}
        >
          {
            tabsConfig.map((item, index)=>
              <TabPanel value={value} label={item.label} index={index} dir={theme.direction} >
                {item.component}
              </TabPanel>
            )
          }
        </SwipeableViews>
      )
    }
  }
  return {
    bar:<TabsBar />,
    content:<TabsContent />,
    obj: obj
  }
}

export default TabsBuild

