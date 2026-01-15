const http = require("http");

const serverTime = Date.now();

const myServer = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET"){
        res.statusCode = 200
        res.end("Server Running")
    }
    else if(req.url ==="/health" && req.method === "GET"){
        res.statusCode = 200;
        const presentTime = Date.now();
        const uptime = presentTime - serverTime;
        const uptimeSeconds = Math.floor(uptime/1000);

        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({
            status: "ok",
            uptime: `${uptimeSeconds} seconds.`
        }))
    }
    else if(req.url === "/echo" && req.method === "POST"){
        let body = ""
        req.on("data", (chunk) => body += chunk.toISOstring());
        
        
        req.on("end", () =>{
            try{
                const parsedData = JSON.parse(body);
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify(parsedData))
            }catch{
                res.statusCode = 400
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify({
                    error:"Invalid JSON"
                }))
            }
        })

        req.on("error", () => {
            res.statusCode = 500
            res.end("Server Error");
        })
    }
    else{
        res.statusCode = 404
        res.end("Not Found");
    }
})

myServer.listen(3000, () => {
    console.log("Server Started!!!")
});