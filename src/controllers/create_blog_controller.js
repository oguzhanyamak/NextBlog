const crypto = require('crypto'); // Rastgele public_id üretmek için
const uploadToCloudinary = require('../config/cloudinary_config'); // Cloudinary'ye dosya yükleme fonksiyonu
const getReadingTime = require('../utils/get_reading_time_utils.js'); // Okuma süresi hesaplama fonksiyonu
const Blog = require('../models/blog_model'); // Blog modeli
const User = require('../models/user_model.js'); // Kullanıcı modeli

/**
 * Blog oluşturma sayfasını render eder.
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 */
const renderCreateBlog = (req, res) => {
  res.render('./pages/create_blog.ejs', {
    sessionUser: req.session.user, // Oturumu açık olan kullanıcıyı sayfaya gönder
    route: req.originalUrl // Mevcut URL'yi sayfaya gönder (navigasyon için)
  });
};

/**
 * Yeni bir blog yazısı oluşturur ve veritabanına kaydeder.
 * @param {Object} req - İstek nesnesi (body içinde blog verileri bulunur)
 * @param {Object} res - Yanıt nesnesi
 */
const postCreateBlog = async (req, res) => {
  try {
    // Kullanıcıdan gelen verileri al
    const { banner, title, content } = req.body;

    // Blog için benzersiz bir public_id üret
    const public_id = crypto.randomBytes(10).toString('hex');

    // Görseli Cloudinary'ye yükle ve URL'sini al
    const bannerURL = await uploadToCloudinary(banner, public_id);

    // Kullanıcının veritabanındaki bilgilerini getir (_id, blogs ve blogPublished alanlarını seçerek)
    const user = await User.findOne({ username: req.session.user.username }).select('_id blogs blogPublished');

    // Yeni blog oluştur
    const newBlog = await Blog.create({
      banner: {
        url: bannerURL, // Cloudinary'den gelen URL
        public_id: public_id // Rastgele oluşturulan public_id
      },
      title: title, // Blog başlığı
      content: content, // Blog içeriği
      owner: user._id, // Blog sahibinin ID'si
      readingTime: getReadingTime(content) // Okuma süresini hesaplayıp ekle
    });

    // Kullanıcı modelinde blog listesini güncelle
    user.blogs.push(newBlog._id); // Kullanıcının blog listesine yeni blogu ekle
    user.blogPublished += 1; // Kullanıcının yayınlanan blog sayısını artır
    await user.save(); // Güncellenmiş kullanıcı bilgilerini kaydet

    // Yeni oluşturulan blog sayfasına yönlendir
    res.redirect(`blogs/${newBlog._id}`);
  } catch (error) {
    console.log('Error create new blog', error.message); // Hata durumunda hata mesajını konsola yaz
  }
};

// Fonksiyonları dışa aktarma
module.exports = {
  renderCreateBlog,
  postCreateBlog
};
