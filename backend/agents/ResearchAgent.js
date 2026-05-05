class ResearchAgent {
  getProjectBackground() {
    return {
      agent: "ResearchAgent",
      title: "Caretta caretta fotoğraf tabanlı kimlik tanıma araştırması",
      problem:
        "Klasik takip yöntemlerinde etiketlerin düşmesi, bozulması, maliyetli olması ve hayvan üzerinde stres oluşturması gibi problemler vardır.",
      proposedSolution:
        "Caretta caretta bireylerinin yüz bölgesindeki benzersiz pul/leke desenleri kullanılarak fotoğraf tabanlı kimlik tanıma yapılması hedeflenmektedir.",
      literatureFinding:
        "Literatürde deniz kaplumbağalarında photo-ID yöntemi; bireysel yüz/pul desenlerinin fotoğraflanması ve kayıtlı bireylerle karşılaştırılması mantığına dayanır.",
      projectLimitation:
        "Gerçek araştırma merkezi verisi verilmediği için ilk prototip açık kaynak görseller ve demo kayıtlar üzerinden geliştirilecektir."
    };
  }
}

module.exports = new ResearchAgent();