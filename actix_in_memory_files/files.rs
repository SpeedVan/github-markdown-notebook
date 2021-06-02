use std::{cell::RefCell, io::prelude::*, fs, path::PathBuf, collections::HashMap, ffi::{OsString}, rc::Rc};
use actix_web::{
    dev::{AppService, HttpServiceFactory, ResourceDef, ServiceRequest, ServiceResponse},
    error::{Error},
};
use actix_service::{boxed::{BoxServiceFactory}, ServiceFactory};
use futures_util::future::{ok, FutureExt, LocalBoxFuture};

use crate::actix_in_memory_files::files_service::FilesService;

type HttpNewService = BoxServiceFactory<(), ServiceRequest, ServiceResponse, Error, ()>;



pub struct InMemFiles {
    map: HashMap<OsString, Vec<u8>>,

    path: String,
    directory: PathBuf,
}

impl Clone for InMemFiles {
    fn clone(&self) -> Self {
        Self {
            map: self.map.clone(),

            path: self.path.clone(),
            directory: self.directory.clone(),
        }
    }
}

impl InMemFiles {
    pub fn new<T: Into<PathBuf>>(mount_path: &str, serve_from: T) -> InMemFiles {
        let orig_dir = serve_from.into();
        let dir = match orig_dir.canonicalize() {
            Ok(canon_dir) => canon_dir,
            Err(_) => {
                PathBuf::new()
            }
        };
        let mut map = HashMap::<OsString, Vec<u8>>::new();
        if let Ok(entries) = fs::read_dir(orig_dir) {
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Ok(metadata) = entry.metadata() {
                        // map.extend_one(entry.path().display())
                        if metadata.is_file() {
                            if let Ok(mut f) = fs::File::open(entry.path()) {
                                let mut buffer = Vec::new();
                                if let Ok(n) = f.read_to_end(&mut buffer) {
                                    println!("{}", n);
                                    map.insert(entry.path().into_os_string(), buffer);
                                }
                            }

                        }
                        println!("{:?}: {:?}", entry.path(), metadata.is_dir());
                    } else {
                        println!("Couldn't get metadata for {:?}", entry.path());
                    }
                }
            }
        }

        InMemFiles{
            map: map,

            path: mount_path.to_owned(),
            directory: dir,

            
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

impl ServiceFactory<ServiceRequest> for InMemFiles {
    type Response = ServiceResponse;
    type Error = Error;
    type Config = ();
    type Service = FilesService;
    type InitError = ();
    type Future = LocalBoxFuture<'static, Result<Self::Service, Self::InitError>>;

    fn new_service(&self, _: ()) -> Self::Future {
        let mut srv = FilesService {
            // directory: self.directory.clone(),
        };

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