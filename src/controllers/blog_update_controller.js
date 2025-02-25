// Blog modelini ve Cloudinary yükleme fonksiyonunu içe aktarıyoruz
const Blog = require(`../models/blog_model.js`);
const uploadToCloudinary = require("../config/cloudinary_config.js");

// Blog düzenleme sayfasını render eden fonksiyon
const renderBlogEdit = async (req, res) => {
  try {
    // URL parametresinden blog ID'sini alıyoruz
    const { blogId } = req.params;

    // Oturum açmış kullanıcının adını alıyoruz
    const { username } = req.session.user;

    // Veritabanından blogu buluyoruz ve gerekli alanları seçiyoruz
    const currentBlog = await Blog.findById(blogId)
      .select("banner title content owner")
      .populate({
        path: "owner", // Blogun sahibini getiriyoruz
        select: "username", // Sadece username alanını alıyoruz
      });

    // Kullanıcı blogun sahibi değilse, hata mesajı gösteriyoruz
    if (currentBlog.owner.username !== username) {
      return res
        .status(403)
        .send(
          "<h2>Sorry, you don't have permission to edit this article as you're not the author.</h2>"
        );
    }

    // Blog düzenleme sayfasını render ediyoruz
    res.render("./pages/blog_update.ejs", {
      sessionUser: req.session.user, // Kullanıcı bilgilerini sayfaya iletiyoruz
      currentBlog, // Güncellenmekte olan blogu iletiyoruz
    });
  } catch (error) {
    // Hata durumunda konsola hata mesajını yazdırıyoruz
    console.error("Error rendering blog edit page: ", error.message);
    throw error;
  }
};

// Blogu güncelleyen fonksiyon
const updateBlog = async (req, res) => {
  try {
    // URL parametresinden blog ID'sini alıyoruz
    const { blogId } = req.params;
    
    // İstek gövdesinden güncellenmiş verileri alıyoruz
    const { title, content, banner } = req.body;

    // Güncellenmekte olan blogu veritabanından çekiyoruz
    const updatedBlog = await Blog.findById(blogId).select(
      "banner title content"
    );

    // Kullanıcı yeni bir banner yüklemişse, Cloudinary'ye yüklüyoruz
    if (banner) {
      const bannerURL = await uploadToCloudinary(
        banner,
        updatedBlog.banner.public_id // Önceki bannerın public_id'sini kullanarak güncelliyoruz
      );
      updatedBlog.banner.url = bannerURL; // Yeni banner URL'sini güncelliyoruz
    }

    // Blogun başlık ve içerik bilgilerini güncelliyoruz
    updatedBlog.title = title;
    updatedBlog.content = content;

    // Güncellenmiş blogu veritabanına kaydediyoruz
    await updatedBlog.save();

    // Başarı durumunda 200 OK yanıtı gönderiyoruz
    res.sendStatus(200);
  } catch (error) {
    // Hata durumunda konsola hata mesajını yazdırıyoruz
    console.error("Error updating blog: ", error.message);
    throw error;
  }
};

// Fonksiyonları dışa aktarıyoruz, böylece diğer dosyalarda kullanılabilirler
module.exports = {
  renderBlogEdit,
  updateBlog,
};
