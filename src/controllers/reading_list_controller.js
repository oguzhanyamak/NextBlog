// Custom modules (Kullanıcı ve Blog modelleri import ediliyor)
const User = require("../models/user_model.js");
const Blog = require("../models/blog_model.js");

// Kullanıcının okuma listesine blog ekleme fonksiyonu
const addToReadingList = async (req, res) => {
  try {
    // Kullanıcı oturum açmamışsa, yetkisiz erişim (401) hatası döndür
    if (!req.session.user) return res.sendStatus(401);

    // Oturum açan kullanıcının kullanıcı adını al
    const { username } = req.session.user;

    // İstek parametresinden blog ID'sini al
    const { blogId } = req.params;

    // Kullanıcının okuma listesini veritabanından çek
    const loggedUser = await User.findOne({ username }).select("readingList");

    // Eğer blog zaten okuma listesinde varsa, 400 hatası döndür
    if (loggedUser.readingList.includes(blogId)) {
      return res.sendStatus(400);
    }

    // Blog ID'sini okuma listesine ekle ve kullanıcıyı kaydet
    loggedUser.readingList.push(blogId);
    await loggedUser.save();

    // Blogun toplam kaydedilme sayısını artır
    const readingListedBlog = await Blog.findById(blogId).select("totalBookmarks");
    readingListedBlog.totalBookmarks++;
    await readingListedBlog.save();

    // Başarı durumunda 200 döndür
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating reading list: ", error.message);
    throw error;
  }
};

// Kullanıcının okuma listesinden blog kaldırma fonksiyonu
const removeFromReadingList = async (req, res) => {
  try {
    // Kullanıcı oturum açmamışsa, yetkisiz erişim (401) hatası döndür
    if (!req.session.user) return res.sendStatus(401);

    // Oturum açan kullanıcının kullanıcı adını al
    const { username } = req.session.user;

    // İstek parametresinden blog ID'sini al
    const { blogId } = req.params;

    // Kullanıcının okuma listesini veritabanından çek
    const loggedUser = await User.findOne({ username }).select("readingList");

    // Eğer blog okuma listesinde yoksa, 400 hatası döndür
    if (!loggedUser.readingList.includes(blogId)) {
      return res.sendStatus(400);
    }

    // Blog ID'sini okuma listesinden çıkar ve kullanıcıyı kaydet
    loggedUser.readingList.splice(loggedUser.readingList.indexOf(blogId), 1);
    await loggedUser.save();

    // Blogun toplam kaydedilme sayısını azalt
    const readingListedBlog = await Blog.findById(blogId).select("totalBookmarks");
    readingListedBlog.totalBookmarks--;
    await readingListedBlog.save();

    // Başarı durumunda 200 döndür
    res.sendStatus(200);
  } catch (error) {
    console.error("Error removing from reading list: ", error.message);
    throw error;
  }
};

// Fonksiyonları dışa aktarma
module.exports = {
  addToReadingList,
  removeFromReadingList, // (Düzeltildi)
};
