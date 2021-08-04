// use std::rc::Rc;

// pub struct LambdaSelf<Arg, Ret>{
    
//     func:Rc<dyn Fn<(Rc<LambdaSelf<Arg, Ret>>, Arg), Output = Ret>>
// }

// impl<Arg, Ret> LambdaSelf<Arg, Ret> {
//     pub fn new<F: 'static>(func:F) -> Self where F:Fn<(Rc<LambdaSelf<Arg, Ret>>, Arg), Output = Ret> {
//         LambdaSelf{
//             func:Rc::new(func)
//         }
//     }
// }


// impl<Arg, Ret> Fn<Arg> for LambdaSelf<Arg, Ret> {
//     extern "rust-call" fn call(&self, args: Arg) ->Ret {
//         println!("Call (Fn) for Foo");
//         //              Rc<LambdaSelf<Arg, Ret>>
//         self.func.call((Rc::new(self), args)) //(Rc<LambdaSelf<Arg, Ret>>, Arg)
//     }
// }

// impl<Arg, Ret> FnMut<Arg> for LambdaSelf<Arg, Ret> {
//     extern "rust-call" fn call_mut(&mut self, args: Arg) -> Ret {
//         println!("Call (FnMut) for Foo");
//         self.func.call_mut((Rc::new(*self), args))
//     }
// }

// impl<Arg, Ret> FnOnce<Arg> for LambdaSelf<Arg, Ret> {
//     type Output = Ret;
//     extern "rust-call" fn call_once(self, args: Arg) -> Self::Output {
//         println!("Call (Fn) for Foo");
//         self.func.call_once((Rc::new(self), args))
//     }
// }

// #[cfg(test)]
// mod tests {
//     use crate::actix_in_memory_files::lambda::LambdaSelf;
//     #[test]
//     pub fn test_lambdaself() {
//         let a = 1;
//         let b = 2;
//         let lf = LambdaSelf::new(move |this,()|->u32{return a+b});
//         println!("{}", lf());
//     }
// }