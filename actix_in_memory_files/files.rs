use std::{io::prelude::*, fs, path::PathBuf, collections::HashMap};

pub struct InMemFiles {
    path: String,
    directory: PathBuf,
    map: HashMap<String, Vec<u8>>,
}

impl InMemFiles {
    pub fn new<T: Into<PathBuf>>(mount_path: &str, serve_from: T)  {
        let mut map = HashMap::<&str, Vec<u8>>::new();
        if let Ok(entries) = fs::read_dir(serve_from.into()) {
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Ok(metadata) = entry.metadata() {
                        // map.extend_one(entry.path().display())
                        if metadata.is_file() {
                            if let Ok(mut f) = fs::File::open(entry.path()) {
                                let mut buffer = Vec::new();
                                if let Ok(n) = f.read_to_end(&mut buffer) {
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
    }
}

#[cfg(test)]
mod tests {
    // mod actix_in_memory_files;
    use crate::actix_in_memory_files::files;
    #[test]
    pub fn test_InMemFiles() {
        files::InMemFiles::new("/abc", "./static/");
    }
}