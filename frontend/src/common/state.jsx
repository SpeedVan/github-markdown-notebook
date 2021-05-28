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

export const statefulWrapper = (Com, state) => {
  console.log("statefulWrapper:", Com)
  class StatefulWrapper extends React.Component {
    TCom = Com
    constructor(props) {
        super(props)
        this.state = state
        console.log("StatefulWrapper", this.TCom)
        result.ss = function(s) {
          console.log("ss",this)
          this.setState(s)
        }.bind(this)
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
  
  const result = {
    Com: StatefulWrapper
  }

  return result
}

export const SW = statefulWrapper