
const recognitionAgent = require("./agents/RecognitionAgent");
const imageProcessingAgent = require("./agents/ImageProcessingAgent");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const turtleService = require("./services/TurtleService");
const researchAgent = require("./agents/ResearchAgent");

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.json({
    message: "CarettaID API çalışıyor",
    description: "Deniz kaplumbağaları için fotoğraf tabanlı kimlik tanıma sistemi"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "CarettaID Backend"
  });
});

app.get("/api/turtles", (req, res) => {
  const turtles = turtleService.getAllTurtles();

  res.json({
    count: turtles.length,
    data: turtles
  });
});

app.get("/api/turtles/:id", (req, res) => {
  const turtle = turtleService.findTurtleById(req.params.id);

  if (!turtle) {
    return res.status(404).json({
      message: "Kaplumbağa bulunamadı"
    });
  }

  res.json(turtle);
});

app.get("/api/agents/research", (req, res) => {
  const result = researchAgent.getProjectBackground();
  res.json(result);
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Fotoğraf yüklenmedi"
    });
  }

  res.json({
    message: "Fotoğraf başarıyla yüklendi",
    filePath: req.file.path
  });
});
app.post("/api/process-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Fotoğraf yüklenmedi"
    });
  }

  const result = imageProcessingAgent.processImage(req.file.path);

  res.json(result);
});
app.post("/api/recognize", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Fotoğraf yüklenmedi"
    });
  }

  const result = await recognitionAgent.recognize(req.file.path);
  res.json(result);
});

  
module.exports = app;