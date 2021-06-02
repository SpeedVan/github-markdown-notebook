use std::{
    fmt, io,
    path::PathBuf,
    rc::Rc,
    task::{Context, Poll},
};
use actix_web::{
  dev::{AppService, HttpServiceFactory, ResourceDef, ServiceRequest, ServiceResponse},
  error::{Error},
  http::{header, Method}
};
use actix_service::Service;
use futures_util::future::{ok, Either, FutureExt, LocalBoxFuture, Ready};

pub struct FilesService {
}

impl FilesService {
    // fn handle_err(&mut self, e: io::Error, req: ServiceRequest) -> FilesServiceFuture {
    //     // log::debug!("Failed to handle {}: {}", req.path(), e);

    //     if let Some(ref mut default) = self.default {
    //         Either::Right(default.call(req))
    //     } else {
    //         Either::Left(ok(req.error_response(e)))
    //     }
    // }
}

impl Service<ServiceRequest> for FilesService {
    type Response = ServiceResponse;
    type Error = Error;
    type Future = FilesServiceFuture;

    fn poll_ready(&self, _: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        Poll::Ready(Ok(()))
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        return Either::Left(ok(req.into_response(
            actix_web::HttpResponse::MethodNotAllowed()
                .header(header::CONTENT_TYPE, "text/plain")
                .body("Request did not meet this resource's requirements."),
        )));
    }
}

type FilesServiceFuture = Either<
    Ready<Result<ServiceResponse, Error>>,
    LocalBoxFuture<'static, Result<ServiceResponse, Error>>,
>;