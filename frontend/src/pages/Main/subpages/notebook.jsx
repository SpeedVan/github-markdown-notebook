import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeViewContext from '@material-ui/lab/TreeView/TreeViewContext';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import {Book as BookIcon, BookOutlined as BookOutlinedIcon} from '@material-ui/icons';
import { Book as mBookIcon, BookOutline as mBookOutlineIcon, BookPlus as mBookPlusIcon, BookMinus as mBookMinusIcon } from 'mdi-material-ui'
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import {stylesWrapper} from '../../../common'
import {StatefulEditor} from './editor'

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  view: {

  },
  item: {
    paddingLeft: theme.spacing(2),
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    // '& $content': {
      paddingLeft: theme.spacing(2),
    // },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;
  // const context = React.useContext(TreeViewContext)
  // console.log("context", context, TreeViewContext)
  return (
    <TreeItem
      key = {other.nodeId}
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

class StateItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      children: [],
      loaded: false,
      expanded: props.expanded|false,
    }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("StateItem shouldComponentUpdate", nextState, nextContext)
    return nextState != null
  }
  dirOnClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!this.state.expanded) {
      if (!this.state.loaded) {
        fetch("http://106.75.181.203:8081/api/v1/tree/"+this.props.nodeId, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
          .then(res => res.json())
          .then(j => {
            // const state = this.store.getState()

            this.setState({children:[j.map((item)=><StateItem nodeId={item.path} labelText={item.name} type={item.type} fileCallback={this.props.fileCallback} />)], expanded: true, loaded: true})
            // this.store.setState({...state, openKeys:state.openKeys.concat([e.key])})
          })
      } else {
        this.setState({expanded: true})
      }
    } else {
      this.setState({expanded: false})
    }
  }
  fileOnClick(e) {
    e.preventDefault()
    e.stopPropagation()
    fetch("http://106.75.181.203:8081/api/v1/raw/"+this.props.nodeId, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
          .then(res => res.text())
          .then(t => {
            // const state = this.store.getState()

            this.props.fileCallback(t)
            // this.store.setState({...state, openKeys:state.openKeys.concat([e.key])})
          })
  }
  render() {
    console.log("StateItem", this.props.nodeId, "render")
    const exProps = this.props.type == "dir" ? {
      onLabelClick:this.dirOnClick.bind(this),
      labelIcon:this.state.expanded?mBookMinusIcon:mBookPlusIcon
    }: {
      onLabelClick:this.fileOnClick.bind(this),
      labelIcon:mBookOutlineIcon
    }

    return <StyledTreeItem {...this.props} {...this.state} {...exProps}/>
  }
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};


class Notebook extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      open: false,
      children: [],
      expanded: false,
      editor: StatefulEditor(),
    }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("Notebook shouldComponentUpdate", nextState != null)
    return nextState != null
  }
  componentDidMount() {
    fetch("http://106.75.181.203:8081/api/v1/tree/", { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
      .then(res => res.json())
      .then(j => {
        // const state = this.store.getState()
        console.log("查了根一遍")
        this.setState({children:[j.map((item)=><StateItem nodeId={item.path} labelText={item.name} type={item.type} fileCallback={content=>this.state.editor.obj.content=content}/>)]})
        // this.store.setState({...state, openKeys:state.openKeys.concat([e.key])})
      })
  }
  render() {
    console.log("Notebook render")
    const { classes } = this.props
    return  (  
      <div className={classes.root}>
        
        <Grid className={classes.root} container layout={"row"} spacing={8}>
          <React.Fragment>
            <Grid item xs={24}>
              <Paper className={classes.treeViewPaper}>
                <TreeView
                  className={classes.treeViewRoot}
                  // defaultExpanded={['3']}
                  defaultCollapseIcon={<ArrowDropDownIcon />}
                  defaultExpandIcon={<ArrowRightIcon />}
                  defaultEndIcon={<div style={{ width: 24 }} />}
                >
                  {this.state.children}
                </TreeView>
              </Paper>
            </Grid>
            <Container>
              <Paper className={classes.contentPaper}>
                {this.state.editor.element}
              </Paper>
            </Container>
          </React.Fragment>
        </Grid>
        
        
      </div>
    )
  }
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




