// Gerekli modelleri ve yardımcı fonksiyonları içe aktarıyoruz.
const User = require("../models/user_model.js"); // Kullanıcı modelini içe aktarır.
const Blog = require("../models/blog_model.js"); // Blog modelini içe aktarır.
const getPagination = require("../utils/get_pagination_util.js"); // Sayfalama işlemleri için yardımcı fonksiyon.

// Kullanıcı profilini render eden fonksiyon.
const renderProfile = async (req, res) => {
  try {
    // URL'den gelen kullanıcı adını alıyoruz.
    const { username } = req.params;

    // Kullanıcının veritabanında olup olmadığını kontrol ediyoruz.
    const userExists = await User.exists({ username });
    if (!userExists) {
      // Eğer kullanıcı yoksa, 404 sayfasına yönlendiriyoruz.
      return res.render("./pages/404.ejs");
    }

    // Kullanıcı bilgilerini getiriyoruz. Sadece belirli alanları seçiyoruz.
    const profile = await User.findOne({ username }).select(
      "profilePhoto username name bio blogs blogPublished createdAt"
    );

    // Sayfalama bilgilerini oluşturuyoruz.
    const pagination = getPagination(
      `/profile/${username}`, // Sayfalama için temel URL
      req.params, // İstekten gelen parametreler
      10, // Sayfa başına gösterilecek blog sayısı
      profile.blogs.length // Toplam blog sayısı
    );

    // Kullanıcının yazdığı blogları getiriyoruz.
    const profileBlogs = await Blog.find({ _id: { $in: profile.blogs } })
      .select("title createdAt reaction totalBookmarks readingTime") // İlgili alanları seçiyoruz.
      .populate({
        path: "owner", // Blog sahibinin bilgilerini getiriyoruz.
        select: "name username profilePhoto",
      })
      .sort({ createdAt: "desc" }) // En yeni blogları en başa getiriyoruz.
      .limit(pagination.limit) // Sayfa başına belirlenen sayıda blog alıyoruz.
      .skip(pagination.skip); // Önceki sayfalardaki blogları atlıyoruz.

    // Kullanıcının profil sayfasını oluşturup verileri gönderiyoruz.
    res.render("./pages/profile.ejs", {
      sessionUser: req.session.user, // Oturum açmış kullanıcı bilgisi
      profile, // Kullanıcı profili
      profileBlogs, // Kullanıcının blogları
      pagination, // Sayfalama bilgisi
    });
  } catch (error) {
    // Hata durumunda hata mesajını konsola yazdırıyoruz.
    console.error("Error rendering profile: ", error.message);
    throw error; // Hata yönetimi için hatayı tekrar fırlatıyoruz.
  }
};

// Fonksiyonu dışa aktarıyoruz, böylece diğer dosyalarda kullanılabilir.
module.exports = renderProfile;
