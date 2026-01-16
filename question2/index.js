const http = require("http")
const fs = require("fs")
const path = require("path");

const logsDir = path.join(__dirname, "logs")
const logFilePath = path.join(logsDir, "server.log");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

http.createServer((req, res) =>{
    time = new Date().toISOString()
    const logLine = `[${time}] ${req.url} ${req.method}\n`;
    fs.appendFile(logFilePath, logLine, (err) => {
        if(err){
            console.log("Failed to write log: ",err);
        }
    });
    res.statusCode = 200
    res.end("Request Logged");
}).listen(3000, () =>{
    console.log("Server running on Port 3000");
})

