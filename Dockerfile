FROM rust:1.52 as builder

RUN USER=root cargo new --bin /app/github-markdown-notebook
RUN rm /app/github-markdown-notebook/src/*.rs
WORKDIR /app/github-markdown-notebook
COPY ./Cargo.toml /app/github-markdown-notebook/Cargo.toml
COPY ./Cargo.lock /app/github-markdown-notebook/Cargo.lock
RUN cargo fetch

COPY ./main.rs /app/github-markdown-notebook/main.rs
RUN cargo build --release
RUN rm /app/github-markdown-notebook/main.rs


FROM debian:buster-slim

RUN apt-get update \
    && apt-get install -y libssl-dev pkg-config ca-certificates \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080

COPY --from=builder /app/github-markdown-notebook/target/release/github-markdown-notebook /app/github-markdown-notebook
COPY ./static /app/static
COPY ./start_withenv.sh /app/start_withenv.sh
RUN chmod 777 /app/start_withenv.sh
WORKDIR /app

ENTRYPOINT [ "./github-markdown-notebook"]