use std::{cell::RefCell, io::prelude::*, fs, path::{Path, PathBuf}, collections::HashMap, ffi::{OsString}, rc::Rc};
use actix_web::{
    dev::{AppService, HttpServiceFactory, ResourceDef, ServiceRequest, ServiceResponse},
    error::{Error},
};
use actix_service::{boxed::{BoxServiceFactory}, ServiceFactory};
use futures_util::future::{ok, FutureExt, LocalBoxFuture};

use crate::actix_in_memory_files::files_service::FilesService;

type HttpNewService = BoxServiceFactory<(), ServiceRequest, ServiceResponse, Error, ()>;



fn fill_file_info(mut map:HashMap<OsString, Vec<u8>>, mount_path: &str, path:&str) -> HashMap<OsString, Vec<u8>> {
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Ok(metadata) = entry.metadata() {
                    // map.extend_one(entry.path().display())
                    if metadata.is_file() {
                        if let Ok(mut f) = fs::File::open(entry.path()) {
                            let mut buffer = Vec::new();
                            if let Ok(n) = f.read_to_end(&mut buffer) {
                                match entry.path().strip_prefix(path) {
                                    Ok(p) => Ok(map.insert(p.into(), buffer)),
                                    Err(e) => Err(e),
                                };
                                
                            }
                        }

                    }
                    if metadata.is_dir() {
                        map = fill_file_info(map, mount_path, entry.path().to_str().unwrap());
                    }
                    println!("{:?}: {:?}", entry.path(), metadata.is_dir());
                } else {
                    println!("Couldn't get metadata for {:?}", entry.path());
                }
            }
        }
    }
    map
}

pub struct InMemFilesServiceFactory {
    path: String,
    data: Rc<HashMap<OsString, Vec<u8>>>,
}

impl Clone for InMemFilesServiceFactory {
    fn clone(&self) -> Self {
        Self {

            path: self.path.clone(),
            data: Rc::clone(&self.data),
        }
    }
}

impl InMemFilesServiceFactory {
    pub fn new<T: Into<PathBuf>>(mount_path: &str, serve_from: T) -> InMemFilesServiceFactory {
        let mut map = HashMap::<OsString, Vec<u8>>::new();
        map = fill_file_info(map, mount_path, serve_from.into().to_str().unwrap());

        InMemFilesServiceFactory{
            path: mount_path.to_owned(),
            data: Rc::new(map),
        }
    }
}

impl HttpServiceFactory for InMemFilesServiceFactory {
    
    fn register(self, config: &mut AppService) {

        let rdef = if config.is_root() {
            ResourceDef::root_prefix(&self.path)
        } else {
            ResourceDef::prefix(&self.path)
        };

        
        config.register_service(rdef, None, self, None)
    }
}

impl ServiceFactory for InMemFilesServiceFactory {
    type Request = ServiceRequest;
    type Response = ServiceResponse;
    type Error = Error;
    type Config = ();
    type Service = FilesService;
    type InitError = ();
    type Future = LocalBoxFuture<'static, Result<Self::Service, Self::InitError>>;

    fn new_service(&self, _: ()) -> Self::Future {
        let mut srv = FilesService::new(Rc::clone(&self.data));

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
        // files::InMemFiles::new("/abc", "./static/");
    }
}