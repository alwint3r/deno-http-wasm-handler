import init, { handle_request } from "./pkg/web_http.js";

await init(Deno.readFile("./pkg/web_http_bg.wasm"));

const server = Deno.listen({ port: 8080 });

console.log(`HTTP web server is running. Access it at http://localhost:8080/`);

for await (const conn of server) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  
  for await (const requestEvent of httpConn) {
    const { request } = requestEvent;
    const response = handle_request(request);

    requestEvent.respondWith(response);
  }
}
