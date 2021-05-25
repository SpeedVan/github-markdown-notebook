import React, {JSXElementConstructor, InputHTMLAttributes, ClassAttributes, PropsWithChildren, FunctionComponent, Attributes} from 'react';

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

const HookProps = <P extends {}>(C: FunctionComponent<P>, exP:P ) => {
  // class tCom extends React.PureComponent<P, S> {
  //     render() {
  //       let exProps:{[key in keyof P]:P[key]} = {} as {[key in keyof P]:P[key]} 
  //       for (let key in exPropsFuncMap) {
  //         exProps[key] = exPropsFuncMap[key](this)
  //       }
  //       console.log(this.props,"渲染一次")
  //       return <C {...{ ...this.props, ...exProps, ...this.state }} />
  //     }
  // }
  
  return (p:PropsWithChildren<P>) => <C {...{...p, ...exP}} />
}

export { HookMounted, HookProps }