import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import auth from "./routes/auth.js"
import { json } from "express"

const app = express()
const port = 3000
const dbUrl = ""

app.use(cors())
app.use(json())

mongoose.connect(dbUrl).then(()=>{
    console.log("connected to database")
}).catch((e)=>{
    console.error("error connecting to database")
})

app.use("/", auth)

app.listen(port, ()=>{
    console.log("app listening on port "+port)
})