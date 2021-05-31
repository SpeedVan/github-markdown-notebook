import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';


import {stylesWrapper, statefulWrapper} from '../../../common'
import {MarkdownReader} from './MarkdownReader'
import StatefulTreeView from './TreeView'
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';


const Notebook = ({classes}) => {
  const StatefulReader = statefulWrapper(MarkdownReader,{content:""})
  // const reader = <StatefulReader />
  // console.log(reader)
  const anchorRef = React.useRef(null);
  const readerHook = {}
  return (
    <div className={classes.root}>
      
      {/* <Grid className={classes.root} container layout={"row"} spacing={8}> */}
        
        <React.Fragment>
          <Popper
            id={'scroll-playground'}
            open={true}
            anchorEl={anchorRef.current}
            placement="left-start"
            disablePortal={true}
            className={classes.popper}
            modifiers={{
              flip: {
                enabled: true,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: 'scrollParent',
              },
              arrow: {
                enabled: false,
              },
            }
          }>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} in={true} timeout={5}>
                  <Paper className={classes.treeViewPaper}>
                    <StatefulTreeView itemOnClick={content=>readerHook.setState({content:content})} />  
                  </Paper>
              </Fade>
            )}
          </Popper>
          <Container className={classes.contentContainer} >
            <Paper className={classes.contentPaper} ref={anchorRef} aria-describedby={'scroll-playground'} >
              <StatefulReader __hook={readerHook}/>
            </Paper>
          </Container>
        </React.Fragment>
      {/* </Grid> */}
    </div>
  )
}

export default stylesWrapper(Notebook, makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    height: '100%',
    overflowY: 'scroll',
    overflowX: 'block',
    
  },
  contentContainer: {
    height: '100%',
  },
  contentPaper: {
    display: 'grid',
    minHeight: `calc(100% - ${theme.spacing(1)}px)`,
    // paddingTop: theme.spacing(1),
    // marginTop: theme.spacing(1)
  },


  popper: {
    zIndex: 1,
    height: `calc(100% - ${theme.spacing(1)}px)`,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '0 !important'
    },
    padding: '1px', 
    '&[x-placement*="left"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
    }
  },
  treeViewPaper: {
    flexGrow: 1,
    width: 280,
    padding: theme.spacing(1), 
    // textAlign: 'center',
    color: theme.palette.text.secondary,
  },
})))




