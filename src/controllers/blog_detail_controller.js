// Gerekli modülleri ve modelleri içe aktarıyoruz.
const mongoose = require("mongoose");

const Blog = require("../models/blog_model.js");
const User = require("../models/user_model.js");
const markdown = require("../config/markdown_it_config.js");

// Blog detay sayfasını render eden fonksiyon
const renderBlogDetail = async (req, res) => {
  try {
    // URL parametresinden blogId'yi alıyoruz.
    const { blogId } = req.params;

    // Blog ID'nin geçerli bir MongoDB ObjectId olup olmadığını kontrol ediyoruz.
    const isValidObjectId = mongoose.Types.ObjectId.isValid(blogId);
    if (!isValidObjectId) {
      return res.render("./pages/404"); // Geçersizse 404 sayfasına yönlendiriyoruz.
    }

    // Blog'un var olup olmadığını kontrol ediyoruz.
    const blogExists = await Blog.exists({
      _id: new mongoose.Types.ObjectId(blogId),
    });

    if (!blogExists) {
      return res.render("./pages/404"); // Blog bulunamazsa 404 sayfasına yönlendiriyoruz.
    }

    // Blog detaylarını getiriyoruz ve "owner" alanını ilgili kullanıcı bilgileriyle dolduruyoruz.
    const blog = await Blog.findById(blogId).populate({
      path: "owner",
      select: "name username profilePhoto", // Sadece belirli alanları alıyoruz.
    });

    // Aynı blog sahibine ait, ancak şu an görüntülenen blog hariç, en yeni 3 blogu getiriyoruz.
    const ownerBlogs = await Blog.find({ owner: { _id: blog.owner._id } })
      .select("title reaction totalBookmarks owner readingTime createdAt") // Sadece belirli alanları seçiyoruz.
      .populate({
        path: "owner",
        select: "name username profilePhoto", // Blog sahibinin bilgilerini de ekliyoruz.
      })
      .where("_id")
      .nin(blogId) // Şu an görüntülenen blogu hariç tutuyoruz.
      .sort({ createdAt: "desc" }) // En son eklenenleri önce getiriyoruz.
      .limit(3); // Sadece 3 blog getiriyoruz.

    let user;
    // Kullanıcı giriş yapmışsa, kullanıcının beğendiği ve okuma listesinde olan blogları getiriyoruz.
    if (req.session.user) {
      user = await User.findOne({ username: req.session.user.username }).select(
        "reactedBlogs readingList"
      );
    }

    // Blog detay sayfasını render ediyoruz ve gerekli verileri şablona gönderiyoruz.
    res.render("./pages/blog_detail.ejs", {
      sessionUser: req.session.user, // Giriş yapan kullanıcı bilgisi
      blog, // Blog detayları
      ownerBlogs, // Aynı blog sahibine ait diğer bloglar
      user, // Kullanıcı bilgileri (eğer giriş yapmışsa)
      markdown, // Markdown dönüştürücüsü
    });
  } catch (error) {
    // Hata durumunda hatayı logluyoruz.
    console.error("Error rendering blog detail page: ", error.message);
    throw error; // Hata fırlatarak daha üst seviyede yakalanmasını sağlıyoruz.
  }
};

// Fonksiyonu dışa aktarıyoruz, böylece diğer dosyalarda kullanılabilir.
module.exports = renderBlogDetail;
