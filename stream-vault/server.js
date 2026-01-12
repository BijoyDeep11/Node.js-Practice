const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
    if (req.url === "/download"){
        streamFile(res)
    }else{
        res.writeHead(200, { "content-type": "text/plain"});
        res.end("Go to /download to stream the file");
    }
}).listen(3000, () => {
    console.log("Server running on Port 3000");
})

function streamFile(res){
    const readStream = fs.createReadStream("bigfile.txt");

    readStream.on("error", (err) => {
        console.log("Error in reading file", err);
        res.writeHead(500);
        res.end("Could not read this file")
    });
    readStream.pipe(res)
}

function backupFile(){
    const readStream = fs.createReadStream("bigfile.txt");
    const writeStream = fs.createWriteStream("backup.txt");

    readStream.on("error", (err) => {
        console.log("Backup read error: ", err);
    })

    writeStream.on("error", (err) => {
        console.log("Backup write error: ",err)
    })

    writeStream.on("finish", () => {
        console.log("Backup finished successfully");
    })

    readStream.pipe(writeStream);
}

backupFile();