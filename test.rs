





#[cfg(test)]
mod tests {
  use std::{os::unix::net::{UnixStream, UnixListener}, thread, io::prelude::*};

  fn handle_client(mut stream: UnixStream) {
    stream.write_all(b"hello world");
  }
  #[test]
  pub fn test_in_memory_files() -> std::io::Result<()> {
    let listener = UnixListener::bind("/home/alex/socket")?;
    // let mut stream = UnixStream::connect("/tmp/sock")?;
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(|| handle_client(stream));
            }
            Err(err) => {
                break;
            }
        }
    }

    Ok(())
  }

 
  use std::error::Error;
  use std::convert::TryInto;
  use zbus::{dbus_interface, fdo};

  struct Greeter {
    count: u64
  }

  #[dbus_interface(name = "org.zbus.MyGreeter1")]
  impl Greeter {
      fn say_hello(&mut self, name: &str) -> String {
          self.count += 1;
          format!("Hello {}! I have been called: {}", name, self.count)
      }
  }

  #[test]
  pub fn test_zbus() -> Result<(), Box<dyn Error>> {
  
    let connection = zbus::Connection::new_session()?;
    fdo::DBusProxy::new(&connection)?.request_name(
        "org.zbus.MyGreeter",
        fdo::RequestNameFlags::ReplaceExisting.into(),
    )?;

    let mut object_server = zbus::ObjectServer::new(&connection);
    let mut greeter = Greeter { count: 0 };
    object_server.at(&"/org/zbus/MyGreeter".try_into()?, greeter)?;
    loop {
        if let Err(err) = object_server.try_handle_next() {
            eprintln!("{}", err);
        }
    }
  }
}