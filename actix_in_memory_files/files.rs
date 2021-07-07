use std::{io::prelude::*, fs, path::{Path, PathBuf}, collections::HashMap, ffi::{OsString}, sync::{Arc}};
use actix_web::{
    dev::{AppService, HttpServiceFactory, ResourceDef, ServiceRequest, ServiceResponse},
    error::{Error},
};
use actix_service::{ServiceFactory};
use futures_util::future::{ok, FutureExt, LocalBoxFuture};

use crate::actix_in_memory_files::files_service::FilesService;

fn fill_file_info(mount_path: &str, prefix:&str, mut map:HashMap<OsString, Vec<u8>>, path:&str) -> HashMap<OsString, Vec<u8>> {
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Ok(metadata) = entry.metadata() {
                    if metadata.is_file() {
                        if let Ok(mut f) = fs::File::open(entry.path()) {
                            let mut buffer = Vec::new();
                            if let Ok(_) = f.read_to_end(&mut buffer) {
                                if let Ok(p) = entry.path().strip_prefix(prefix) {
                                    // Path::new(String::from("abd"));
                                    let pa = Path::new(mount_path).join(p);
                                    println!("{:?}, {:?}, {:?}, {:?}: {:?}", mount_path, p, entry.path(), path, pa);
                                    map.insert(pa.into(), buffer);
                                }
                            }
                        }
                    }
                    if metadata.is_dir() {
                        map = fill_file_info(mount_path, prefix, map, entry.path().to_str().unwrap());
                    }
                } else {
                    println!("Couldn't get metadata for {:?}", entry.path());
                }
            }
        }
    }
    map
}

pub struct InMemFilesServiceFactoryBuilder {
    mount_urlpath: String,
    data: Arc<HashMap<OsString, Vec<u8>>>,
}

impl InMemFilesServiceFactoryBuilder {

    pub fn new<T: Into<PathBuf>>(mount_urlpath: &str, serve_from: T) -> InMemFilesServiceFactoryBuilder {
        let mut map = HashMap::<OsString, Vec<u8>>::new();
        let pathbuf = serve_from.into();
        let path = pathbuf.to_str().unwrap();
        map = fill_file_info(mount_urlpath, path.clone(), map, path);
        InMemFilesServiceFactoryBuilder {
            mount_urlpath: String::from(mount_urlpath),
            data: Arc::new(map),
        }
    }

    pub fn build(&self) -> InMemFilesServiceFactory {
        InMemFilesServiceFactory::new(self.mount_urlpath.clone(), Arc::clone(&self.data))
    }

    pub fn to_arc(self) -> Arc<InMemFilesServiceFactoryBuilder> {
        Arc::new(self)
    }
}

pub struct InMemFilesServiceFactory {
    path: String,
    data: Arc<HashMap<OsString, Vec<u8>>>,
}

impl InMemFilesServiceFactory {

    pub fn new(mount_path: String, data: Arc<HashMap<OsString, Vec<u8>>>) -> InMemFilesServiceFactory {
        InMemFilesServiceFactory{
            path: mount_path,
            data: data,
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
        let srv = FilesService::new(Arc::clone(&self.data));
        ok(srv).boxed_local()
    }
}

#[cfg(test)]
mod tests {
    // mod actix_in_memory_files;
    use std::path::Path;
    #[test]
    pub fn test_in_memory_files() {
        let path = Path::new("./abc/bcd/a");
        println!("{:?}", path.strip_prefix("./abc/"));
        // files::InMemFiles::new("/abc", "./static/");
    }
}