const app = require('./app')
const cors = require('cors');
app.get("/", (req, res) => {
    res.json("Hello");
})

//------for port from env file--------
const dotenv = require('dotenv');
const connectdatabase = require("./config/database")
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "./config/config.env" });
}

connectdatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working at http://localhost:${process.env.PORT}`);
});

//handling uncaught exception
process.on("uncaughtException", err => {
    console.log(`Error:${err.message}`);
    console.log("shutting down server due to uncaught error")
    server.close(() => {
        process.exit(1);
    })
})
//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error:${err.message}`);
    console.log("shutting down server due to unhandled error")
    server.close(() => {
        process.exit(1);
    })
})
