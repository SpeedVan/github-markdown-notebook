import React from 'react';

import RMD from 'react-markdown'
// import gfm from 'remark-gfm'

const Editor = ({content}) => <RMD remarkPlugins={[]} children={content} />

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

export const StatefulEditor = (props) => {
    const newObj = SubscribeObject({content:""})
    class StatefulEditor extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                content: ""
            }
        }
        shouldComponentUpdate(nextProps, nextState, nextContext) {
            console.log("StatefulEditor shouldComponentUpdate", nextState, nextContext)
            return nextState != null
        }
        componentDidMount(){
            newObj.__subfuncs["content"].push((content)=>this.setState({content:content}))
        }
        render(){
            return <Editor {...this.props} {...this.state} />
        }
    }

    return {
        obj:newObj,
        element: <StatefulEditor {...props}/>
    }
}


export default Editor