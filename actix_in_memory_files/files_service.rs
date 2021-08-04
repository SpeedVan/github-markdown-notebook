use std::{
    path::PathBuf,
    collections::HashMap,
    ffi::{OsString},
    task::{Context, Poll},
    sync::{Arc}
};
use actix_web::{
  dev::{ServiceRequest, ServiceResponse},
  error::{Error},
  http::{header, StatusCode, HeaderValue},
  body::{Body}
};
use actix_service::Service;
use futures_util::future::{ok, Either, LocalBoxFuture, Ready};

pub struct FilesService {
    data: Arc<HashMap<OsString, Vec<u8>>>,
}

impl FilesService {
    pub fn new(data:Arc<HashMap<OsString, Vec<u8>>>) -> FilesService {
        FilesService {
            data: data,
        }
    }
}

type FilesServiceFuture = Either<
    Ready<Result<ServiceResponse, Error>>,
    LocalBoxFuture<'static, Result<ServiceResponse, Error>>,
>;

impl Service for FilesService {
    type Request = ServiceRequest;
    type Response = ServiceResponse;
    type Error = Error;
    type Future = FilesServiceFuture;

    fn poll_ready(&mut self, _: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, req: ServiceRequest) -> Self::Future {
        let path = req.match_info().path();
        println!("{}", path);
        let req_path:PathBuf = if path == "" { // req_path : /index.html
            PathBuf::from("/index.html")
        } else {
            path.into()
        };
          
        let ext = req_path.extension();
        let url_key = req_path.clone().into_os_string();
        let content = match self.data.get(&url_key) {
            Some(content) =>content,
            None => return Either::Left(ok(req.into_response(actix_web::HttpResponse::NotFound()))),
        };

        let mut resp = actix_web::HttpResponse::with_body(StatusCode::OK, Body::from_slice(content));

        match ext {
            Some(s) => match s.to_str().unwrap() {
                "svg" => resp.headers_mut().insert(header::CONTENT_TYPE, HeaderValue::from_static("image/svg+xml")),
                _ => (),
            },
            None => (),
        }
        

        return Either::Left(ok(req.into_response(resp)));
    }
}



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