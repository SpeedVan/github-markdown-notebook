use std::{
    fmt, io::prelude::*, fs,
    path::PathBuf,
    rc::Rc,
    collections::HashMap,
    ffi::{OsString, OsStr},
    task::{Context, Poll},
};
use actix_web::{
  dev::{AppService, HttpServiceFactory, ResourceDef, ServiceRequest, ServiceResponse},
  error::{Error, ErrorNotFound},
  http::{header, Method, StatusCode, HeaderValue},
  body::{Body}
};
use actix_service::Service;
use futures_util::future::{ok, Either, FutureExt, LocalBoxFuture, Ready};

pub struct FilesService {
    data: Rc<HashMap<OsString, Vec<u8>>>,
}

impl FilesService {
    pub fn new(data:Rc<HashMap<OsString, Vec<u8>>>) -> FilesService {
        FilesService {
            data: data,
        }
    }
}

impl Service for FilesService {
    type Request = ServiceRequest;
    type Response = ServiceResponse;
    type Error = Error;
    type Future = FilesServiceFuture;

    fn poll_ready(&mut self, _: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, req: ServiceRequest) -> Self::Future {
        let req_path:PathBuf = req.match_info().path().into(); // req_path : /index.html
        let oS = req_path.into_os_string();
        // full file path
        // let path = self.directory.join(req_path.chars().skip(1).collect::<String>());
        // let full_path = path.to_str().unwrap();
        // println!("{}", full_path);
        let content = match self.data.get(&oS) {
            Some(content) =>content,
            None => return Either::Left(ok(req.into_response(actix_web::HttpResponse::NotFound()))),
        };

        let mut resp = actix_web::HttpResponse::with_body(StatusCode::OK, Body::from_slice(content));

        match req_path.extension() {
            Some(s) => match s.to_str().unwrap() {
                "svg" => resp.headers_mut().insert(header::CONTENT_TYPE, HeaderValue::from_static("image/svg+xml")),
                _ => (),
            },
            None => (),
        }
        
        
        return Either::Left(ok(req.into_response(resp)));
    }
}

type FilesServiceFuture = Either<
    Ready<Result<ServiceResponse, Error>>,
    LocalBoxFuture<'static, Result<ServiceResponse, Error>>,
>;

#[cfg(test)]
mod tests {
    use std::{path::PathBuf};

    fn  f<T:Into<PathBuf>>(p:T) {
        let dir = match p.into().canonicalize() {
            Ok(canon_dir) => canon_dir,
            Err(_) => {
                PathBuf::new()
            }
        };
        println!("{}", dir.to_str().unwrap());
        let real_path ="/index.html";
        let full_path = dir.join(real_path.chars().skip(1).collect::<String>());
        
        println!("{}", full_path.to_str().unwrap());
    }

    #[test]
    pub fn test_pathbuf() {

        let p = "./static";
        f(p);
    }
}