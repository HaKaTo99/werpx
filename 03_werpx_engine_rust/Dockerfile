# ===============================================
# Forge Engine (Rust) High-Stability Dockerfile
# ===============================================
FROM rust:latest as builder

WORKDIR /usr/src/werpx_engine_rust
COPY . .

# Build for release
RUN cargo build --release

# Thin runtime image
FROM debian:stable-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/werpx_engine_rust/target/release/werpx_engine_rust /usr/local/bin/werpx_engine_rust

EXPOSE 8080

CMD ["werpx_engine_rust"]
