// Custom modules (Kullanıcı ve Blog modelleri import ediliyor)
const User = require("../models/user_model.js");
const Blog = require("../models/blog_model.js");

const getPagination = require("../utils/get_pagination_util.js");
const session = require("express-session");

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
    const readingListedBlog = await Blog.findById(blogId).select(
      "totalBookmarks"
    );
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
    const readingListedBlog = await Blog.findById(blogId).select(
      "totalBookmarks"
    );
    readingListedBlog.totalBookmarks--;
    await readingListedBlog.save();

    // Başarı durumunda 200 döndür
    res.sendStatus(200);
  } catch (error) {
    console.error("Error removing from reading list: ", error.message);
    throw error;
  }
};

// Kullanıcının okuma listesini görüntüleme fonksiyonu
const renderReadingList = async (req, res) => {
  try {
    // Oturum açmış kullanıcının kullanıcı adını alıyoruz
    const { username } = req.session.user;

    // Kullanıcının okuma listesini veritabanından çekiyoruz
    const { readingList } = await User.findOne({ username }).select("readingList");

    // Sayfalandırma ayarlarını belirliyoruz
    // - "/readinglist": Sayfanın temel URL'si
    // - req.params: URL'deki parametreleri içerir
    // - 20: Sayfa başına gösterilecek blog sayısı
    // - readingList.length: Toplam blog sayısı
    const pagination = getPagination(
      "/readinglist",
      req.params,
      20,
      readingList.length
    );

    // Okuma listesindeki blogları veritabanından çekiyoruz
    const readingListedBlogs = await Blog.find({ _id: { $in: readingList } })
      .select("owner createdAt readingTime title reaction totalBookmarks") // Gerekli alanları seçiyoruz
      .populate({
        path: "owner", // Blog sahibinin bilgilerini getiriyoruz
        select: "name username profilePhoto", // Kullanıcı adı, ismi ve profil fotoğrafı dahil
      })
      .limit(pagination.limit) // Sayfa başına gösterilecek blog sayısını belirliyoruz
      .skip(pagination.skip); // Sayfalama için atlanacak öğe sayısını ayarlıyoruz

    // Sayfa render ediliyor ve okuma listesi ile ilgili veriler gönderiliyor
    res.render("./pages/reading_list.ejs", {
      sessionUser: req.session.user, // Kullanıcının oturum bilgileri
      readingListedBlogs, // Kullanıcının okuma listesindeki bloglar
      pagination, // Sayfalama bilgisi
    });
  } catch (error) {
    // Hata oluşursa, konsola hata mesajı yazdırılır ve hata fırlatılır
    console.error("Error rendering reading list: ", error.message);
    throw error;
  }
};


// Fonksiyonları dışa aktarma
module.exports = {
  addToReadingList,
  removeFromReadingList,
  renderReadingList, 
};
