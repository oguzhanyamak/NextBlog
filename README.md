# 🚀 NextBlog - Modern & Güçlü Blog Platformu

NextBlog, modern bir blog yazma platformu olarak, kullanıcı dostu arayüzü ve güçlü özellikleriyle yazı yazma deneyimini bir üst seviyeye taşır. 

Kendi blog yazılarınızı oluşturabilir, paylaşabilir, beğenebilir ve okuma listenize ekleyebilirsiniz. Gelişmiş sayfalama, dinamik kullanıcı arayüzü ve güçlü backend altyapısı ile ideal bir ortam sağlar.

## 🌍 **Canlı Demo**
🚀 **NextBlog'u hemen deneyin:** 👉 [NextBlog'ı Keşfet](https://nextblog-klnl.onrender.com) 👈

---

## 🚀 Hızlı Başlangıç

### 1️⃣ Bağımlılıkları Yükleyin

```sh
# Depoyu klonlayın
git clone https://github.com/kullaniciadi/nextblog.git
cd nextblog

# Bağımlılıkları yükleyin
npm install
```

### 2️⃣ Çevresel Değişkenleri Yapılandırın

`.env` dosyanızı oluşturun ve aşağıdaki bilgileri girin:

```
PORT=3000
MONGO_CONNECTION_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
SESSION_MAX_AGE=86400000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3️⃣ Sunucuyu Çalıştırın
```sh
npm start
```
Sunucu başarıyla başlatıldığında şu adresten erişebilirsiniz:
```
http://localhost:3000
```

---

## 🌟 Temel Özellikler

✅ **Kullanıcı Yönetimi** – Kayıt, Giriş, Şifre Güncelleme, Profil Düzenleme
✅ **Blog Yönetimi** – Blog Oluşturma, Düzenleme, Silme, Görüntüleme
✅ **Beğeni & Okuma Listesi** – Blogları Beğenme ve Kaydetme
✅ **Dinamik UI & Bildirim Sistemi** – Kullanıcı dostu arayüz ve Snackbar uyarıları
✅ **Görsel Yükleme & Cloudinary Entegrasyonu** – Blog kapak fotoğrafı desteği
✅ **Gelişmiş Sayfalama (Pagination)** – Verimli içerik yönetimi
✅ **SEO Dostu URL’ler** – Kullanıcıların içeriklere kolay erişimi

---

## 📖 Kullanım Kılavuzu

### 🧑‍💻 Kullanıcı İşlemleri
- 🚀 **Hızlı Kayıt & Giriş:** Kullanıcılar birkaç adımda hesap oluşturabilir ve giriş yapabilir.
- 🔑 **Şifre Değiştirme:** Şifrenizi güvenli bir şekilde güncelleyebilirsiniz.
- ✏️ **Profil Yönetimi:** Adınızı, kullanıcı adınızı, e-posta adresinizi ve profil fotoğrafınızı kolayca düzenleyin.
- ❌ **Hesap Silme:** Kullanıcı hesabınızı ve tüm içeriklerinizi kalıcı olarak silebilirsiniz.

### ✍️ Blog İşlemleri
- 📝 **Yeni Blog Yayınlama:** İçeriğinizi oluşturup paylaşın.
- 🛠 **Düzenleme & Silme:** Bloglarınızı kolayca güncelleyin veya kaldırın.
- ❤️ **Beğeni & Okuma Listesi:** Beğendiğiniz içerikleri kaydedin.
- 📊 **Ziyaretçi & Beğeni Sayacı:** Blog istatistiklerinizi görüntüleyin.
---

## 🌍 API Bitiş Noktaları (Endpoints)

### 🛠 Kullanıcı İşlemleri
- `POST /register` → Kullanıcı kaydı
- `POST /login` → Giriş yapma
- `PUT /profile/basic_info` → Profil güncelleme
- `PUT /profile/password` → Şifre değiştirme
- `DELETE /profile/account` → Hesap silme

### 📝 Blog İşlemleri
- `POST /createblog` → Yeni blog oluşturma
- `PUT /blogs/:blogId` → Blog güncelleme
- `DELETE /blogs/:blogId` → Blog silme
- `GET /blogs/:blogId` → Blog detayları
- `POST /blogs/:blogId/reaction` → Blog beğenme
- `DELETE /blogs/:blogId/reaction` → Beğeniyi kaldırma
- `POST /blogs/:blogId/readingList` → Okuma listesine ekleme

---

## 🏗 Kullanılan Teknolojiler

🔹 **Backend:** Node.js, Express.js, MongoDB (Mongoose)
🔹 **Frontend:** EJS, JavaScript, CSS
🔹 **Kimlik Doğrulama:** Express-session
🔹 **Dosya Yükleme:** Cloudinary
🔹 **Şifreleme:** Bcrypt

---

