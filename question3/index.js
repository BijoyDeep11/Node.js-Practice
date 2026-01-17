const http = require("http")
const fs = require("fs")
const process = require("process")

const ENV = process.env.NODE_ENV || "development"

function log(message, type = "info"){
    const time = new Date().toISOString()

    if (ENV === "development"){
        console.log(`${time} [${type.toUpperCase()}]`)
    }

    if (ENV === "production"){
        if (type === "error"){
            console.error(`${time} ERROR: ${message}`)
        }
    }
}

const server = http.createServer((req, res) => {
    log(`${req.method} ${req.url}`, "info");

    if (req.url === "/" && req.method === "GET"){
        res.statusCode = 200;
        res.end("Server Running");
    }

    else if (req.url === "/health" && req.method === "GET"){
        res.statusCode = 200;
        res.end("OK");
    }

    else{
        res.statusCode = 404
        log(`Route not found: ${req.method} ${req.url}`)
        res.end("Not Found")
    }
})

server.listen(3000, () => {
    log(`Server started in ${ENV} mode`, "info")
})