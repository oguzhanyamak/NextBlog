// Express framework'ünü içe aktarıyoruz
const express = require('express');

// .env dosyasındaki değişkenleri yüklemek için dotenv modülünü kullanıyoruz
require('dotenv').config();

// Express uygulamasını oluşturuyoruz
const app = express();

// Kayıt işlemleri için yönlendirme dosyasını içe aktarıyoruz
const register = require('./src/routes/register_route');

// MongoDB bağlantı ve bağlantıyı kesme fonksiyonlarını içe aktarıyoruz
const { connecDb, disconnectDB } = require('./src/config/mongoose_config');

// Görüntüleme motoru olarak EJS'yi belirliyoruz
app.set('view engine', 'ejs');

// Statik dosyalar için public klasörünü belirtiyoruz
app.use(express.static(`${__dirname}/public`));

// Gelen HTTP isteklerinin URL-encoded verilerini işlemeye izin veriyoruz
app.use(express.urlencoded({ extended: true }));

// "/Register" rotasına gelen istekleri register_route dosyasına yönlendiriyoruz
app.use('/Register', register);

// Ana sayfa rotasını oluşturuyoruz
app.get('/', (req, res) => {
    res.send("<h1>Selam Canım Ben Amcanım</h1>"); // Basit bir HTML yanıtı gönderiyoruz
});

// Port numarasını ortam değişkeninden alıyoruz, eğer tanımlı değilse 3000 kullanıyoruz
const PORT = process.env.PORT || 3000;

// Sunucuyu belirtilen portta dinlemeye başlıyoruz
const server = app.listen(PORT, async () => {
    console.log(`Server listening on port http://localhost:${PORT}`);

    // MongoDB bağlantısını başlatıyoruz
    await connecDb(process.env.MONGO_CONNECTION_URI);
});

// Sunucu kapatıldığında MongoDB bağlantısını kesiyoruz
server.on('close', async () => await disconnectDB());
