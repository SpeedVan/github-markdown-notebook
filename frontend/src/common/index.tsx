import React, {JSXElementConstructor} from 'react';

const Hook = <P extends {}, S extends {}>(C: JSXElementConstructor<P>|React.ComponentType<P>, f: Function) => {
  console.log(C, C instanceof React.Component)
  if (C instanceof React.Component) { 
    console.log(C, "是一个 React.Component")
    return C
  } else {
    class tCom extends React.Component<P, S> {
      dp={}
      constructor(props: P) {
        super(props)
      }
      componentDidMount() {
        f(this)
      }
      shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        // console.log("判断是否需要渲染", nextProps, nextState, nextContext)
        return nextState != null
      }
      render() {
        console.log("渲染一次")
        return <C {...{ ...this.dp, ...this.props, ...this.state }} />
      }
    }

    return tCom
  }
}

export { Hook }