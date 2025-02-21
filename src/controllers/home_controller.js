// Blog modelini içe aktarır (MongoDB ile etkileşim için)
const Blog = require("../models/blog_model.js");

// Sayfalama işlemini gerçekleştiren yardımcı fonksiyonu içe aktarır
const getPagination = require("../utils/get_pagination_util.js");

/**
 * Anasayfa render eden fonksiyon.
 * Blogları veritabanından alarak EJS şablonuna iletir.
 *
 * @param {Object} req - İstek nesnesi.
 * @param {Object} res - Yanıt nesnesi.
 */
const renderHome = async (req, res) => {
  try {
    // Veritabanındaki toplam blog sayısını al
    const totalBlogs = await Blog.countDocuments();

    // Sayfalama bilgilerini al (Sayfa başına 1 blog gösterilecek şekilde)
    const pagination = getPagination("/", req.params, 6, totalBlogs);

    // En son oluşturulan blogları getir
    const latestBlogs = await Blog.find()
      .select(
        "banner author createdAt readingTime title reaction totalBookmarks"
      ) // Seçili alanları getir (gerekli olmayan verileri almamak için)
      .populate({
        path: "owner", // "owner" alanını kullanıcı bilgileriyle doldur
        select: "name username profilePhoto", // Sadece belirli alanları getir
      })
      .sort({ createdAt: "desc" }) // En yeni blogları önce getir
      .limit(pagination.limit) // Sayfalama limitine göre sınırla
      .skip(pagination.skip); // Sayfalama için kaç tane kaydın atlanacağını belirle

    // Anasayfa şablonunu (home.ejs) render et
    res.render("./pages/home.ejs", {
      sessionUser: req.session.user, // Kullanıcı oturum bilgisi
      latestBlogs, // En son bloglar
      pagination, // Sayfalama bilgisi
    });
  } catch (error) {
    // Hata durumunda hata mesajını konsola yazdır
    console.error("Error rendering home page: ", error.message);
    throw error;
  }
};

// Fonksiyonu dışa aktararak diğer modüllerde kullanılmasını sağlar
module.exports = renderHome;
