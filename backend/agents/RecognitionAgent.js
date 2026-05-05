const turtleService = require("../services/TurtleService");
const similarityService = require("../services/SimilarityService");

class RecognitionAgent {
async recognize(filePath) {
    const turtles = turtleService.getAllTurtles();

    if (turtles.length === 0) {
      return {
        agent: "RecognitionAgent",
        status: "no-data",
        message: "Veritabanında kayıtlı kaplumbağa bulunamadı"
      };
    }

const recognitionResult = await similarityService.findBestMatch(filePath, turtles);

    return {
      agent: "RecognitionAgent",
      status: "completed",
      message: "Kaplumbağa kimlik tanıma işlemi tamamlandı",
      result: recognitionResult
    };
  }
}

module.exports = new RecognitionAgent();