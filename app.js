// Express framework'ünü içe aktarıyoruz
const express = require("express");

// .env dosyasındaki değişkenleri yüklemek için dotenv modülünü kullanıyoruz
require("dotenv").config();

// Kullanıcı oturum yönetimi için express-session modülünü içe aktarıyoruz
const session = require("express-session");

// Oturumları MongoDB'de saklamak için connect-mongo modülünü içe aktarıyoruz
const MongoStore = require("connect-mongo");


const compression = require("compression");

// MongoDB tabanlı oturum deposu oluşturuyoruz
const store = new MongoStore({
  mongoUrl: process.env.MONGO_CONNECTION_URI, // MongoDB bağlantı adresi (ortam değişkeninden alınıyor)
  collectionName: "sessions", // Oturum verilerinin saklanacağı koleksiyon adı
  dbName: "NextBlog", // Veritabanı adı
});

// Express uygulamasını oluşturuyoruz
const app = express();

app.use(compression());


// İşlemleri yöneten yönlendirme dosyalarını içe aktarıyoruz
const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const home = require("./src/routes/home_route");
const createBlog = require("./src/routes/create_blog_route");
const logOut = require("./src/routes/logout_route");
const blogDetail = require("./src/routes/blog_detail_route");
const auth = require("./src/middlewares/user_auth_middleware");
const readingList = require("./src/routes/reading_list_route");
const blogUpdate = require("./src/routes/blog_update_route");
const profile = require("./src/routes/profile_route");
const dashboard = require("./src/routes/dashboard_route");
const deleteBlog = require("./src/routes/blog_delete_route");
const settings = require("./src/routes/settings_route");



// MongoDB bağlantısını yönetmek için gerekli fonksiyonları içe aktarıyoruz
const { connecDb, disconnectDB } = require("./src/config/mongoose_config");

// Görüntüleme motoru olarak EJS'yi belirtiyoruz (HTML sayfalarını dinamik olarak oluşturabilmek için)
app.set("view engine", "ejs");

// Statik dosyalar için 'public' klasörünü belirtiyoruz (CSS, JS, resimler vb. dosyalar için)
app.use(express.static(`${__dirname}/public`));

// Gelen HTTP isteklerinin gövdesinde URL-encoded verileri işlemeye izin veriyoruz
app.use(express.urlencoded({ extended: true }));

// Express uygulamasına JSON gövdeli istekleri işleme yeteneği ekler
app.use(express.json({limit:'10mb'}));

// Kullanıcı oturumlarını yönetmek için session middleware'ini tanımlıyoruz
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Oturumları güvenli hale getirmek için gizli anahtar (ortam değişkeninden alınır)
    resave: false, // Oturumun her istekte yeniden kaydedilmesini engeller (performans için false)
    saveUninitialized: false, // Tanımlanmamış oturumları kaydetmez
    store: store, // Oturumları MongoDB'ye kaydeder
    cookie: {
      maxAge: Number(process.env.SESSION_MAX_AGE), // Çerez süresini belirler (milisaniye cinsinden)
    },
  })
);

// gelen istekleri dosyalarına yönlendiriyoruz
app.use("/register", register);
app.use("/login", login);
app.use("/",home);
app.use('/blogs',blogDetail);
app.use('/profile',profile);
app.use(auth);
app.use("/createblog",createBlog);
app.use("/readingList",readingList);
app.use("/blogs",blogUpdate,deleteBlog);
app.use('/dashboard',dashboard);
app.use('/settings',settings);
app.use("/logout",logOut);

// Port numarasını ortam değişkeninden alıyoruz, eğer tanımlı değilse 3000 kullanıyoruz
const PORT = process.env.PORT || 3000;

// Sunucuyu belirtilen portta dinlemeye başlıyoruz
const server = app.listen(PORT, async () => {
  console.log(`Server listening on port http://localhost:${PORT}`);

  // MongoDB bağlantısını başlatıyoruz
  await connecDb(process.env.MONGO_CONNECTION_URI);
});

// Sunucu kapatıldığında MongoDB bağlantısını kesiyoruz
server.on("close", async () => {
  await disconnectDB();
  console.log("MongoDB bağlantısı kapatıldı.");
});
