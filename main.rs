use actix_web::{client::{Client, Connector}, get, web, App, HttpResponse, HttpServer, Responder, http::StatusCode};
use actix_files as fs;
use std::{env, sync::Mutex};
use openssl::ssl::{SslConnector, SslMethod};
use serde_json::value::Value;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};

struct Context {
    http_client: Client,
    private_token: String,
    repository: String,
}

#[get("/api/v1/{path:.*}")]
async fn api(path_params: web::Path<String>, data: web::Data<Mutex<Context>>) -> impl Responder {
    println!("{}", path_params);
    let ctx = data.lock().unwrap();
    let url = format!("https://api.github.com/repos/{}/contents/{}?ref=main", ctx.repository, utf8_percent_encode(path_params.as_ref(), NON_ALPHANUMERIC).to_string());
    let token = format!("token {}", ctx.private_token);
    println!("url: {}", url);
    println!("token: {}", token);
    let response = ctx.http_client.get(url)
      .header("Authorization", token)
      .header("Accept", "application/vnd.github.v3+json")
      .header("User-Agent", "request")
      .send()     // <- Send request//   .await;.map_err(|_| ())
      .await;
    //   .await
    //   .and_then(|mut response| {
    //     println!("Response: {:?}", response);
    //     let json = response.json::<Value>();
    //     println!("{:?}", json);
    //     // json.and_then(|v|{});
    //     // match json {
    //     //     Ok(v) => match v.as_array() {
    //     //         Ok(arr) => Ok(arr.iter().map(|v|{ println!("item: {:?}", v) }).collect::<Vec<_>>()),
    //     //         Err(e) => Err(e),
    //     //     },
    //     //     Err(e) => Err(e),
    //     // }
    //     // response.json::<Value>().await.unwrap()..and_then(move |bytes| {
    //     //     let s = std::str::from_utf8(&bytes).expect("utf8 parse error)");
    //     //     println!("html: {:?}", s);

    //     //     // Ok(())
    //     //     // Or return something else...
    //     //     Ok(HttpResponse::Ok()
    //     //         .content_type("text/html")
    //     //         .body(format!("{}", s)))
    //     // }).map_err(|_| ())
    //     Ok(response)
    //   });
    // let result = response
    //     .unwrap()
    //     .json::<Value>()
    //     .await;
    let maybe_jsonarr = match response { // 判断是否正常响应，如超时等。
        Ok(mut res) => match res.status() { // 判断statusCode
            StatusCode::OK => match res.json::<Value>().await { //判断是否返回 json
                Ok(json) =>
                    match json.as_array() { // 判断是否是 json的arr类型
                        Some(arr) => Ok(arr.iter().map(|item| {item.get("name").unwrap().as_str().unwrap().to_string()}).collect::<Vec<String>>()), // 不to_string()的话，&str无论怎么复制都是地址，该回收的话，还是live not enough
                        None => Err(String::from("err：is not arr")),
                    },
                Err(err) => Err(err.to_string()),
            },
            _ => Err(res.status().to_string()),
        },
        Err(err) => Err(err.to_string()),
    };
    // // println!("result: {:?}", result);
    // let json = result.unwrap();

    // let v = json.as_array().unwrap().iter().map(|v|{ println!("item: {:?}", v) }).collect::<Vec<_>>();

    HttpResponse::Ok().json(maybe_jsonarr)
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let private_token = env::var("GMN_PRIVATETOKEN").expect("no GMN_PRIVATETOKEN");
        let repository = env::var("GMN_REPOSITORY").expect("no GMN_REPOSITORY");
        let web_staticpath = env::var("GMN_WEB_STATICPATH").expect("no GMN_WEB_STATICPATH");

        let builder = SslConnector::builder(SslMethod::tls()).unwrap();
        let client = Client::builder().connector(Connector::new().ssl(builder.build()).finish()).finish();
        let data = web::Data::new(Mutex::new(Context{http_client: client, private_token: private_token, repository: repository}));
        App::new()
            .app_data(data.clone())
            .service(api)
            .service(fs::Files::new("/", web_staticpath).index_file("index.html"))
            // .route("/index.html", web::get().to(manual_hello))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}