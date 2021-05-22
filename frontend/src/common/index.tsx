import React, {JSXElementConstructor} from 'react';

const HookMounted = <P extends {}, S extends {}>(C: JSXElementConstructor<P>|React.ComponentType<P>, f: Function) => {
  if (C instanceof React.Component) { 
    const tmpf = C.componentDidMount 
    C.componentDidMount = function() {
      f(this)
      if (tmpf != null) {
        tmpf()
      }
    }
    return C
  } else {
    class tCom extends React.Component<P, S> {
      dp={}
      componentDidMount() {
        f(this)
      }
      shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        // console.log("判断是否需要渲染", nextProps, nextState, nextContext)
        return nextState != null
      }
      render() {
        // console.log(C, "渲染一次")
        return <C {...{ ...this.dp, ...this.props, ...this.state }} />
      }
    }

    return tCom
  }
}

const HookProps = <P extends {}, S extends {}>(C: JSXElementConstructor<P>|React.ComponentType<P>, exPropsFuncMap:{[key in keyof P]:(t:React.Component<P, S>)=>P[key]} ) => {
  class tCom extends React.PureComponent<P, S> {
      render() {
        let exProps:{[key in keyof P]:P[key]} = {} as {[key in keyof P]:P[key]} 
        for (let key in exPropsFuncMap) {
          exProps[key] = exPropsFuncMap[key](this)
        }
        // console.log(C,"渲染一次", this.props, exProps, this.state)
        return <C {...{ ...this.props, ...exProps, ...this.state }} />
      }
  }
  return tCom
}

export { HookMounted, HookProps }