import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setResult(null);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Lütfen JPG veya PNG formatında bir fotoğraf seç.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/api/recognize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Backend'e bağlanılamadı. Backend çalışıyor mu kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  const bestMatch = result?.result?.bestMatch;
  const allResults = result?.result?.allResults || [];

  return (
    <main className="app">
      <section className="hero">
        <div>
          <span className="tag">Photo-ID Research Prototype</span>
          <h1>CarettaID</h1>
          <p>
            Caretta caretta bireylerini yüz, pul ve desen benzerliğine göre
            karşılaştıran çoklu ajan destekli tanıma sistemi.
          </p>
        </div>

        <div className="hero-icon">🐢</div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Fotoğraf Yükle</h2>
          <p className="muted">
            Yüz bölgesi net görünen JPG/PNG kaplumbağa fotoğrafı seç.
          </p>

          <label className="upload-box">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            <div className="upload-icon">📷</div>
            <strong>{file ? file.name : "Fotoğraf seç"}</strong>
            <span>JPG veya PNG desteklenir</span>
          </label>

          {preview && (
            <div className="preview">
              <img src={preview} alt="Seçilen kaplumbağa" />
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Analiz ediliyor..." : "Kaplumbağayı Tanı"}
          </button>
        </div>

        <div className="panel">
          <h2>Tanıma Sonucu</h2>

          {!bestMatch && (
            <div className="empty">
              Henüz analiz yapılmadı. Fotoğraf seçip tanıma işlemini başlat.
            </div>
          )}

          {bestMatch && (
            <>
              <div className="score">%{bestMatch.similarityScore}</div>

              <div className="info-list">
                <div>
                  <span>Tür</span>
                  <strong>{bestMatch.species}</strong>
                </div>
                <div>
                  <span>En Yakın Birey</span>
                  <strong>{bestMatch.turtleName}</strong>
                </div>
                <div>
                  <span>Kimlik</span>
                  <strong>{bestMatch.turtleId}</strong>
                </div>
                <div>
                  <span>Karar</span>
                  <strong>{result.result.decision}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {allResults.length > 0 && (
        <section className="panel table-panel">
          <h2>Tüm Benzerlik Sonuçları</h2>

          {allResults.map((item, index) => (
            <div className="result-row" key={item.turtleId}>
              <div>
                <strong>{index + 1}. {item.turtleName}</strong>
                <span>{item.species} / {item.side}</span>
              </div>

              <div className="bar-area">
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{ width: `${item.similarityScore}%` }}
                  />
                </div>
                <strong>%{item.similarityScore}</strong>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;