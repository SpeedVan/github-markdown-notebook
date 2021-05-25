use actix_web::{client::{Client, Connector}};
mod notebook;
use notebook::{Notebook, Tree};


struct GithubReastNotebook {
    client:Client,
}

impl GithubReastNotebook {
    
}

impl Notebook for GithubReastNotebook {
    pub fn getRootTree(key: str):Tree{

    }
}