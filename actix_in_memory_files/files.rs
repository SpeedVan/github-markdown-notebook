use std::{cell::RefCell, io::prelude::*, fs, path::{Path, PathBuf}, collections::HashMap, ffi::{OsString}, rc::Rc};
use actix_web::{
    dev::{AppService, HttpServiceFactory, ResourceDef, ServiceRequest, ServiceResponse},
    error::{Error},
};
use actix_service::{boxed::{BoxServiceFactory}, ServiceFactory};
use futures_util::future::{ok, FutureExt, LocalBoxFuture};

use crate::actix_in_memory_files::files_service::FilesService;

type HttpNewService = BoxServiceFactory<(), ServiceRequest, ServiceResponse, Error, ()>;



pub struct InMemFiles {
    path: String,
    dir: PathBuf,
}

impl Clone for InMemFiles {
    fn clone(&self) -> Self {
        Self {

            path: self.path.clone(),
            dir: self.dir.to_owned(),
        }
    }
}

impl InMemFiles {
    pub fn new<T: Into<PathBuf>>(mount_path: &str, serve_from: T) -> InMemFiles {
        

        InMemFiles{
            path: mount_path.to_owned(),
            dir: serve_from.into(),
        }
    }
}

impl HttpServiceFactory for InMemFiles {
    
    fn register(self, config: &mut AppService) {

        let rdef = if config.is_root() {
            ResourceDef::root_prefix(&self.path)
        } else {
            ResourceDef::prefix(&self.path)
        };

        
        config.register_service(rdef, None, self, None)
    }
}

impl ServiceFactory for InMemFiles {
    type Request = ServiceRequest;
    type Response = ServiceResponse;
    type Error = Error;
    type Config = ();
    type Service = FilesService;
    type InitError = ();
    type Future = LocalBoxFuture<'static, Result<Self::Service, Self::InitError>>;

    fn new_service(&self, _: ()) -> Self::Future {
        let mut srv = FilesService::new(self.dir.to_owned());

        // if let Some(ref default) = *self.default.borrow() {
        //     default
        //         .new_service(())
        //         .map(move |result| match result {
        //             Ok(default) => {
        //                 srv.default = Some(default);
        //                 Ok(srv)
        //             }
        //             Err(_) => Err(()),
        //         })
        //         .boxed_local()
        // } else {
            ok(srv).boxed_local()
        // }
    }
}




#[cfg(test)]
mod tests {
    // mod actix_in_memory_files;
    use crate::actix_in_memory_files::files;
    #[test]
    pub fn test_in_memory_files() {
        files::InMemFiles::new("/abc", "./static/");
    }
}