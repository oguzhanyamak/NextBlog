// Gerekli modülleri içe aktarıyoruz
const bcrypt = require("bcrypt"); // Şifreleme işlemleri için bcrypt kütüphanesi
const mongoose = require("mongoose"); // MongoDB bağlantısı için mongoose

// Kullanıcı ve Blog modellerini içe aktarıyoruz
const User = require(`../models/user_model.js`);
const Blog = require(`../models/blog_model.js`);

// Cloudinary'ye dosya yükleme fonksiyonunu içe aktarıyoruz
const uploadToCloudinary = require("../config/cloudinary_config.js");

// Ayarlar sayfasını render eden fonksiyon
const renderSettings = async (req, res) => {
  try {
    const { username } = req.session.user; // Oturum açmış kullanıcının adını alıyoruz

    // Kullanıcı bilgilerini veritabanından alıyoruz
    const currentUser = await User.findOne({ username });

    // Ayarlar sayfasını ilgili verilerle render ediyoruz
    res.render("./pages/settings.ejs", {
      sessionUser: req.session.user,
      currentUser,
    });
  } catch (error) {
    console.error("Error rendering settings page: ", error.message);
    throw error;
  }
};

// Kullanıcının temel bilgilerini güncelleyen fonksiyon
const updateBasicInfo = async (req, res) => {
  try {
    const { username: sessionUsername } = req.session.user; // Oturum açmış kullanıcının kullanıcı adını alıyoruz

    // Kullanıcının güncellenecek bilgilerini veritabanından çekiyoruz
    const currentUser = await User.findOne({
      username: sessionUsername,
    }).select("profilePhoto name username email bio");

    // Kullanıcıdan gelen yeni bilgileri alıyoruz
    const { profilePhoto, name, username, email, bio } = req.body;

    // Eğer yeni bir e-posta adresi girilmişse, başka bir hesapta kayıtlı olup olmadığını kontrol ediyoruz
    if (email) {
      if (await User.exists({ email })) {
        return res.status(400).json({
          message:
            "Sorry, an account is already associated with this email address.",
        });
      }

      currentUser.email = email;
    }

    // Eğer yeni bir kullanıcı adı girilmişse, başka bir hesapta olup olmadığını kontrol ediyoruz
    if (username) {
      if (await User.exists({ username })) {
        return res.status(400).json({
          message:
            "Sorry, that username is already taken. Please choose a different one.",
        });
      }

      currentUser.username = username;
      req.session.user.username = username; // Oturum bilgisini güncelliyoruz
    }

    // Profil fotoğrafı güncellenmişse, Cloudinary'ye yükleyip URL'sini kaydediyoruz
    if (profilePhoto) {
      const public_id = currentUser.username; // Kullanıcı adına göre bir public ID belirliyoruz
      const imageURL = await uploadToCloudinary(profilePhoto, public_id);

      currentUser.profilePhoto = {
        url: imageURL,
        public_id,
      };

      req.session.user.profilePhoto = imageURL; // Oturum bilgisini güncelliyoruz
    }

    // Kullanıcı adını ve biyografisini güncelliyoruz
    currentUser.name = name;
    req.session.user.name = name; // Oturum bilgisini güncelliyoruz
    currentUser.bio = bio;

    // Güncellenmiş kullanıcı bilgilerini kaydediyoruz
    await currentUser.save();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating basic info: ", error.message);
    throw error;
  }
};

// Kullanıcının şifresini güncelleyen fonksiyon
const updatePassword = async (req, res) => {
  try {
    const { username: sessionUsername } = req.session.user; // Oturum açmış kullanıcının kullanıcı adını alıyoruz

    // Kullanıcının mevcut şifresini veritabanından alıyoruz
    const currentUser = await User.findOne({
      username: sessionUsername,
    }).select("password");

    // Kullanıcıdan gelen eski ve yeni şifreleri alıyoruz
    const { old_password, password } = req.body;

    // Kullanıcının girdiği eski şifrenin doğru olup olmadığını kontrol ediyoruz
    const oldPasswordIsValid = await bcrypt.compare(
      old_password,
      currentUser.password
    );

    // Eğer eski şifre yanlışsa hata döndürüyoruz
    if (!oldPasswordIsValid) {
      return res
        .status(400)
        .json({ message: "Your old password is not valid." });
    }

    // Yeni şifreyi hash'leyerek güvenli hale getiriyoruz
    const newPassword = await bcrypt.hash(password, 10);
    currentUser.password = newPassword;

    // Güncellenmiş şifreyi veritabanına kaydediyoruz
    await currentUser.save();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error changing password: ", error.message);
    throw error;
  }
};

// Kullanıcının hesabını silen fonksiyon
const deleteAccount = async (req, res) => {
  try {
    const { username } = req.session.user; // Oturum açmış kullanıcının adını alıyoruz

    // Kullanıcıyı ve sahip olduğu blogları buluyoruz
    const currentUser = await User.findOne({ username }).select("blogs");

    // Kullanıcının tüm bloglarını siliyoruz
    await Blog.deleteMany({ _id: { $in: currentUser.blogs } });

    // Kullanıcının hesabını siliyoruz
    await User.deleteOne({ username });

    // Kullanıcının oturumlarını MongoDB'den kaldırıyoruz
    const Session = mongoose.connection.db.collection("sessions");
    await Session.deleteMany({ session: { $regex: username, $options: "i" } });

    // Oturumu sonlandırıyoruz
    req.session.destroy();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting account: ", error.message);
    throw error;
  }
};

// Fonksiyonları dışa aktarıyoruz
module.exports = {
  renderSettings,
  updateBasicInfo,
  updatePassword,
  deleteAccount,
};
