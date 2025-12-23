
# ExaMind - Sınav Planlayıcı Yayınlama Kılavuzu

Bu projeyi GitHub Pages üzerinde ücretsiz olarak yayınlamak için şu basit adımları izle:

### 1. GitHub Deposu Oluştur
- GitHub hesabına gir ve yeni bir "Repository" oluştur.
- Bilgisayarındaki bu dosyaları o depoya yükle (push yap).

### 2. API Anahtarını Tanımla (Önemli!)
Uygulamanın çalışması için Google Gemini API anahtarına ihtiyacı var:
- GitHub deponda **Settings** > **Secrets and variables** > **Actions** kısmına git.
- **New repository secret** butonuna bas.
- İsim olarak `API_KEY` yaz, değer olarak Google'dan aldığın API anahtarını yapıştır.

### 3. GitHub Pages Ayarını Aç
- **Settings** > **Pages** sekmesine git.
- "Build and deployment" kısmındaki **Source** seçeneğini "GitHub Actions" olarak değiştir.

### 4. Siten Hazır!
- Kodun `main` branch'ine yüklendiğinde otomatik olarak bir "Action" başlayacak.
- İşlem bittiğinde aynı sayfada (Settings > Pages) sana bir link verilecek (örn: `kullaniciadi.github.io/depo-adi/`).

Artık siten yayında! Her kod değişikliğinde site otomatik olarak güncellenecektir.
