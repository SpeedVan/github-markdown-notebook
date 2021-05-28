import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';


import {stylesWrapper, statefulWrapper} from '../../../common'
import {MarkdownReader} from './MarkdownReader'
import StatefulTreeView from './TreeView'



const Notebook = ({classes}) => {
  const StatefulReader = statefulWrapper(MarkdownReader,{content:""})
  return (
    <div className={classes.root}> 
      <Grid className={classes.root} container layout={"row"} spacing={8}>
        <React.Fragment>
          <Grid item xs={24}>
            <Paper className={classes.treeViewPaper}>
              <StatefulTreeView itemOnClick={content=>StatefulReader.ss({content:content})} />
            </Paper>
          </Grid>
          <Container>
            <Paper className={classes.contentPaper}>
              <StatefulReader.Com />
            </Paper>
          </Container>
        </React.Fragment>
      </Grid>
    </div>
  )
}

export default stylesWrapper(Notebook, makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100%',
  },
  treeViewPaper: {
    flexGrow: 1,
    width: 300,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '100%',
  },
  contentPaper: {
    padding: theme.spacing(1),
    minHeight: '100%',
  }
})))




