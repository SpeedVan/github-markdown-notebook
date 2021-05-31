import React from 'react';

const hookObj = (obj, that) => {
  obj.__obj = that
  for (let key in that) {
    console.log("hookObj typeof(key) key:", typeof obj.__obj[key], key)
    obj.__defineGetter__(key, function () {
      if (typeof obj.__obj[key] === "function") {
        return p => obj.__obj[key](p)
      }
    })
  }
  return obj
}

export const statefulWrapper = (Com, state={}) => {
  class StatefulWrapper extends React.Component {
    OrginalCom = Com
    ss = null
    constructor(props) {
      super(props)
      this.state = state
      if (props.__hook) {
        if (props.__hook.__obj) {
          console.warn("statefulCom __hook is dirty obj")
          return
        }
        hookObj(props.__hook, this)
      }
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState != null
    }
    componentDidMount() {
    }
    render(){
        return <Com {...this.props} {...this.state} />
    }
  }

  return StatefulWrapper
}

export const SW = statefulWrapper