import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {  BookOutline as mBookOutlineIcon, BookPlus as mBookPlusIcon, BookMinus as mBookMinusIcon } from 'mdi-material-ui'

import {stylesWrapper} from '../../../common'


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
  // const classes = useTreeItemStyles();
  const { classes, labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;
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
        fetch("http://172.21.31.181:8080/api/v1/tree/"+this.props.nodeId, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
          .then(res => res.json())
          .then(j => {
            // const state = this.store.getState()

            this.setState({children:[j.map((item)=><StateItem classes={this.props.classes} nodeId={item.path} labelText={item.name} type={item.type} fileCallback={this.props.fileCallback} />)], expanded: true, loaded: true})
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
    fetch("http://172.21.31.181:8080/api/v1/raw/"+this.props.nodeId, { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
          .then(res => res.text())
          .then(t => {
            // const state = this.store.getState()

            this.props.fileCallback(t)
            // this.store.setState({...state, openKeys:state.openKeys.concat([e.key])})
          })
  }
  render() {
    console.log("StateItem", this.props.nodeId, "render")
    const exProps = this.props.type === "dir" ? {
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

class StatefulTreeView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      children: [],
    }
  }
  componentDidMount() {
    fetch("http://172.21.31.181:8080/api/v1/tree/", { method:"GET", mode:"cors", headers:{"Access-Control-Allow-Origin":"*"} })
      .then(res => res.json())
      .then(j => {
        console.log("查了根一遍")
        this.setState({children:[j.map((item)=><StateItem classes={this.props.classes} nodeId={item.path} labelText={item.name} type={item.type} fileCallback={this.props.itemOnClick}/>)]})
      })
  }
  render() {
    const {classes} = this.props
    return (
      <TreeView
        className={classes.treeViewRoot}
        // defaultExpanded={['3']}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
      >
        {this.state.children}
      </TreeView>
    )
  }
}

export default stylesWrapper(StatefulTreeView, useTreeItemStyles)