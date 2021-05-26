import React from 'react';

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
        this.__subfuncs.forEach(f => f(this))
      });
  
      newObj.__subfuncs = []
    }
  
    return newObj
  }

export const statefulWrapper = (Com, state) => (props) => {
  const newObj = SubscribeObject(state)

  class StatefulWrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = state
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState != null
    }
    componentDidMount() {
        newObj.__subfuncs.push()
    }
    render(){
        return <Com {...this.props} {...this.state} />
    }
  }
  return <StatefulWrapper {...props} />
}