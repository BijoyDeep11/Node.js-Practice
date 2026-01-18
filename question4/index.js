const http = require("http")
const EventEmitter = require("events")

class ServerEvents extends EventEmitter {}
const serverEvents = new ServerEvents()

const RATE_LIMIT = 5
const WINDOW_MS = 60 * 1000

const requests = {}

serverEvents.on("request", (info) => {
    console.log(`[REQUEST] ${info.url} ${info.method}`)
});

serverEvents.on("response", (info) =>{
    console.log(`[RESPONSE] ${info.statusCode} ${info.url} ${info.method}`)
});

serverEvents.on("error", (error) => {
    console.error(`[ERROR] ${error.message}`);
})

const server = http.createServer((req, res) => {
    serverEvents.emit("request", {
        method: req.method,
        url: req.url
    });

    const ip = req.socket.remoteAddress;
    const now = Date.now()

    if(!requests[ip]){
        requests[ip] = { count: 1, startTime: now }
    }
    else{
        const elapsed = now - requests[ip].startTime;
        if (elapsed < WINDOW_MS){
            requests[ip].count++;
        }else{
            requests[ip] = { count: 1, startTime: now }
        }
    }

    if(requests[ip].count > RATE_LIMIT){
        res.statusCode = 429
        res.end("Too Many Requests")

        serverEvents.emit("response",{
            statusCode: res.statusCode,
            method: req.method,
            url: req.url
        });

        return;
    }

    try{
        if(req.url === "/" && req.method === "GET"){
            res.statusCode = 200
            res.end("Server Running");
        }
        else if (req.url === "/health" && req.method === "GET"){
            res.statusCode = 200
            res.end("OK")
        }
        else{
            res.statusCode = 404
            res.end("Not Found")
        }

        serverEvents.emit("response", {
            statusCode: res.statusCode,
            url: req.url,
            method: req.method
        })
    }

    catch(err){
        serverEvents.emit("error", err);
        res.statusCode = 500
        res.end("Internal Server Error")
        return;
    }
}).listen(3000, () =>{
    console.log("Server listening on port 3000")
})

process.on("SIGINT", () => {
    console.log("\nGraceful shutdown started...")

    server.close(() => {
        console.log("All connections closed.")
        process.exit(0)
    })
})