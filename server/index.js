const express = require("express")
const cors = require("cors")
const multer = require("multer")
const pinataSDK = require("@pinata/sdk")
const mongoose = require("mongoose")
const streamifier = require("streamifier");
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Pinata configuration
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY)

// MongoDB connection (optional)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err))
}

// Multer configuration for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF and image files are allowed"))
    }
  },
})

// Test Pinata connection
app.get("/api/test-pinata", async (req, res) => {
  try {
    const result = await pinata.testAuthentication()
    res.json({ success: true, result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Upload file to IPFS
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const { walletAddress, fileName } = req.body

    const options = {
      pinataMetadata: {
        name: fileName || req.file.originalname,
        keyvalues: {
          walletAddress: walletAddress,
          uploadDate: new Date().toISOString(),
          fileType: req.file.mimetype,
        },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }

    const readableStream = streamifier.createReadStream(req.file.buffer);

    const result = await pinata.pinFileToIPFS(readableStream, options);

    res.json({
      success: true,
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get file from IPFS
app.get("/api/file/:hash", async (req, res) => {
  try {
    const { hash } = req.params
    const url = `https://gateway.pinata.cloud/ipfs/${hash}`
    res.json({ url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user's pinned files
app.get("/api/files/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params

    const filters = {
      status: "pinned",
      metadata: {
        keyvalues: {
          walletAddress: walletAddress,
        },
      },
    }

    const result = await pinata.pinList(filters)
    res.json({ success: true, files: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
