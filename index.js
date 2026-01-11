const http = require('http');

// const server = http.createServer();

// server.on('request', (req, res) =>{
//     res.writeHead(200, {"Content-Type": "application/json" });
//     res.end(JSON.stringify({
//         data: "Hello World!"
//     }));
// });


const server = http.createServer((req, res) => {
    const { url, method } = req

    res.setHeader("Content-Type", "text/plain")

    if(url === "/" && method === "GET"){
        res.statusCode = 200
        res.end("HomePage")
    }
    else if(url === "/users" && method === "GET"){
        res.statusCode = 200
        res.end("Users List: ");
    }
    else if (url === "/login" && method === "POST") {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify({
      message: "Login data received",
      data: body
    }));
  });
}

    else if(url === "/login" && method === "GET"){
        res.statusCode = 200
        res.end("Login Here: ");
    }
    else{
        res.statusCode = 404
        res.end("404 Error Not found");
    }
});

server.listen(8000, () => console.log("Server running on Port 8000"));