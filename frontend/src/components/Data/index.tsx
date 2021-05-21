
class Data {
  data={}

  condFunc=[]

  constructor(){
    console.log("new data")
  }

  // addCondSetState(condFunc: ({}, {})=>{}) {
  //   return (t) => {
  //     this.condFunc.push({condFunc:condFunc, setState:t.setState})
  //   }
  // }

  // setData(data:{}){
  //   this.condFunc.forEach(({condFunc, setState})=>{
  //     const someData = condFunc(this.data, data)
  //     if (someData!= null) setState(someData)
  //   })
  // }
}

const data = new Data()

export default data