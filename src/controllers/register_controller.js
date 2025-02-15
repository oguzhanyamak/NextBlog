// Kullanıcı şifrelerini güvenli hale getirmek için bcrypt kütüphanesini içe aktarıyoruz
const bcrypt = require("bcrypt");

// Kullanıcı modelini içe aktarıyoruz (MongoDB modelimiz)
const User = require("../models/user_model");

// Kullanıcı adı oluşturma fonksiyonunu içe aktarıyoruz
const generateUsername = require("../utils/generate_username_utils");

// Kullanıcı kayıt sayfasını render eden fonksiyon
const renderRegister = (req, res) => {
  res.render("./pages/register.ejs"); // `register.ejs` sayfasını görüntüler
};

// Kullanıcı kayıt işlemini gerçekleştiren fonksiyon
const postRegister = async (req, res) => {
  try {
    // Formdan gelen verileri alıyoruz
    const { name, email, password } = req.body;

    // Kullanıcıyı veritabanına ekliyoruz
    await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10), // Şifreyi hashleyerek güvenli hale getiriyoruz
      username: generateUsername(name), // Kullanıcı adını otomatik oluşturuyoruz
    });

    // Başarılı kayıt sonrası kullanıcıyı giriş sayfasına yönlendiriyoruz
    res.redirect('/login');

  } catch (error) {
    // Eğer hata MongoDB'deki unique kısıtlamasından kaynaklanıyorsa (duplicate key hatası)
    if (error.code === 11000) {
        if (error.keyPattern.email) {
            // Eğer e-posta zaten kullanımda ise hata mesajı döndürüyoruz
            return res.status(400).send({ message: 'Bu Mail adresi zaten kullanımda' });
        }
        if (error.keyPattern.username) {
            // Eğer kullanıcı adı zaten kullanımda ise hata mesajı döndürüyoruz
            return res.status(400).send({ message: 'Bu kullanıcı adı zaten kullanımda' });
        }
    } else {
        // Diğer hatalar için genel hata mesajı döndürüyoruz
        return res.status(400).send({ message: `Kayıt Başarısız: ${error.message}` });
        throw error; // Hatanın detaylarını terminalde görmek için fırlatıyoruz
    }
  }
};

// Fonksiyonları dışa aktarıyoruz, böylece başka dosyalarda kullanılabilir
module.exports = { renderRegister, postRegister };
