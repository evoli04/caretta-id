const { Jimp } = require("jimp");
const path = require("path");

class SimilarityService {
  async compareImages(imgPath1, imgPath2) {
    try {
      const fullPath1 = path.join(__dirname, "../", imgPath1);
      const fullPath2 = path.join(__dirname, "../", imgPath2);

      const img1 = await Jimp.read(fullPath1);
      const img2 = await Jimp.read(fullPath2);

      img1.resize({ w: 128, h: 128 }).greyscale();
      img2.resize({ w: 128, h: 128 }).greyscale();

      const grayHist1 = this.createGrayHistogram(img1);
      const grayHist2 = this.createGrayHistogram(img2);

      const edgeHist1 = this.createEdgeHistogram(img1);
      const edgeHist2 = this.createEdgeHistogram(img2);

      const grayScore = this.compareHistograms(grayHist1, grayHist2);
      const edgeScore = this.compareHistograms(edgeHist1, edgeHist2);

      // Renk/parlaklık %35, desen/kenar/pul yapısı %65 etkili
      const finalScore = grayScore * 0.35 + edgeScore * 0.65;

      return Math.round(finalScore);
    } catch (err) {
      console.error("Compare error:", err.message);
      return 0;
    }
  }

  createGrayHistogram(image) {
    const bins = new Array(16).fill(0);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    image.scan(0, 0, width, height, function (x, y, idx) {
      const pixelValue = this.bitmap.data[idx];
      const binIndex = Math.min(15, Math.floor(pixelValue / 16));
      bins[binIndex]++;
    });

    const total = width * height;
    return bins.map((value) => value / total);
  }

  createEdgeHistogram(image) {
    const bins = new Array(16).fill(0);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const data = image.bitmap.data;

    const getPixel = (x, y) => {
      const idx = (width * y + x) << 2;
      return data[idx];
    };

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const left = getPixel(x - 1, y);
        const right = getPixel(x + 1, y);
        const up = getPixel(x, y - 1);
        const down = getPixel(x, y + 1);

        const gradient = Math.abs(right - left) + Math.abs(down - up);
        const binIndex = Math.min(15, Math.floor(gradient / 32));

        bins[binIndex]++;
      }
    }

    const total = (width - 2) * (height - 2);
    return bins.map((value) => value / total);
  }

  compareHistograms(hist1, hist2) {
    let similarity = 0;

    for (let i = 0; i < hist1.length; i++) {
      similarity += Math.min(hist1[i], hist2[i]);
    }

    return similarity * 100;
  }

  async findBestMatch(uploadedImagePath, turtles) {
    const results = [];

    for (const turtle of turtles) {
      const similarityScore = await this.compareImages(
        uploadedImagePath,
        turtle.imagePath
      );

      results.push({
        turtleId: turtle.id,
        turtleName: turtle.name,
        species: turtle.species,
        side: turtle.side,
        imagePath: turtle.imagePath,
        similarityScore
      });
    }

    results.sort((a, b) => b.similarityScore - a.similarityScore);

    const bestMatch = results[0];

    return {
      uploadedImagePath,
      bestMatch,
      allResults: results,
      decision:
        bestMatch.similarityScore >= 55
          ? "Kayıtlı kaplumbağa ile olası eşleşme bulundu"
          : "Yeni birey olabilir, manuel inceleme önerilir"
    };
  }
}

module.exports = new SimilarityService();