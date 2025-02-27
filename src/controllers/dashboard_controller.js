// Kullanıcı modelini içe aktarıyoruz
const User = require("../models/user_model.js");

// Kullanıcının kontrol panelini (dashboard) render eden asenkron fonksiyon
const renderDashboard = async (req, res) => {
  try {
    // Oturum açmış kullanıcının kullanıcı adını alıyoruz
    const { username } = req.session.user;

    // Kullanıcının bilgilerini veritabanından çekiyoruz
    const loggedUser = await User.findOne({ username })
      .select("totalVisits totalReactions blogPublished blogs") // Kullanıcıya ait istatistikleri seçiyoruz
      .populate({
        path: "blogs", // Kullanıcının bloglarını getiriyoruz
        select: "title createdAt updatedAt reaction totalVisit", // Blog için gerekli bilgileri seçiyoruz
        options: { sort: { createdAt: "desc" } }, // Blogları oluşturulma tarihine göre sıralıyoruz (son eklenen en üstte)
      });

    // Dashboard sayfasını render ediyoruz ve gerekli verileri şablona iletiyoruz
    res.render("./pages/dashboard.ejs", {
      sessionUser: req.session.user, // Oturumdaki kullanıcı bilgileri
      loggedUser, // Kullanıcının blog ve istatistik bilgileri
    });
  } catch (error) {
    // Hata oluşursa hatayı konsola yazdırıyoruz
    console.error("Error rendering dashboard: ", error.message);
    throw error;
  }
};

// Fonksiyonu dışa aktarıyoruz (başka dosyalarda kullanmak için)
module.exports = renderDashboard;
