import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import ShortUrl from "./models/ShortUrls.js"


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost/ShortUrls", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.get("/", async (req, res) => {
    try {
        const urls = await ShortUrl.find({})
        res.status(200).json({
            status: "success",
            data: urls
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.post("/shortUrl", async (req, res) => {
    try {
        const url = await ShortUrl.create({ url: req.body.fullUrl })
        res.status(201).json({
            status: "success",
            data: url
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.get("/:shortUrl", async (req, res) => {
    try {
        const { shortUrl } = req.params
        const url = await ShortUrl.findOne({ shortUrl })
        if (!url) {
            return res.status(404).json({
                status: "failed",
                message: "URL doesn't exist"
            })
        }
        url.clicks++
        url.save()
        res.status(200).json({
            status: "success",
            fullUrl: url.url
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))