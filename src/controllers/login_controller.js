// Kullanıcı şifrelerini güvenli hale getirmek için bcrypt kütüphanesini içe aktarıyoruz
const bcrypt = require("bcrypt");

// Kullanıcı modelini içe aktarıyoruz (MongoDB modelimiz)
const User = require("../models/user_model");

// Giriş sayfasını render eden fonksiyon
const renderLogin = (req, res) => {

  const {userAuthenticated} = req.session.user || {};

  if(userAuthenticated){
    return res.redirect('/');
  }
  res.render("./pages/login.ejs"); // login.ejs sayfasını kullanıcıya gösterir
};

// Kullanıcı girişini işleyen fonksiyon
const postLogin = async (req, res) => {
  try {
    // Kullanıcının formdan gönderdiği email ve şifreyi alıyoruz
    const { email, password } = req.body;

    // Veritabanında email adresine sahip kullanıcıyı arıyoruz
    const currentUser = await User.findOne({ email });

    // Eğer kullanıcı bulunamazsa hata mesajı döndürülür
    if (!currentUser) {
      return res.status(400).json({ message: "Kullanıcı Bulunamadı" });
    }

    // Kullanıcının girdiği şifreyi veritabanındaki hashlenmiş şifre ile karşılaştırıyoruz
    const passwordIsValid = await bcrypt.compare(password, currentUser.password);

    // Eğer şifre yanlışsa hata mesajı döndürülür
    if (!passwordIsValid) {
      return res.status(400).json({ message: "Hatalı Kullanıcı Adı veya Şifre" });
    }

    // Kullanıcı doğrulandıktan sonra oturum bilgilerini saklıyoruz
    req.session.user = {
      userAuthenticated: true, // Kullanıcının oturum açtığını belirten bayrak
      name: currentUser.name, // Kullanıcının adı
      username: currentUser.username, // Kullanıcının kullanıcı adı
      profilePhoto: currentUser.profilePhoto?.url, // Kullanıcının profil fotoğrafı
    };

    // Başarılı girişten sonra ana sayfaya yönlendirme yapıyoruz
    res.redirect('/');
  } catch (error) {
    // Hata durumunda sunucu hatası döndürülür
    res.status(500).json({ message: "Sunucu Hatası", error });
  }
};

// Fonksiyonları dışa aktarıyoruz, böylece diğer dosyalarda kullanılabilir
module.exports = { renderLogin, postLogin };
