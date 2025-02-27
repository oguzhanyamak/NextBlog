// Blog ve Kullanıcı modellerini içe aktarıyoruz
const Blog = require("../models/blog_model.js");
const User = require("../models/user_model.js");

// Blog silme işlemini gerçekleştiren asenkron fonksiyon
const deleteBlog = async (req, res) => {
  try {
    // İstek parametrelerinden blogId'yi alıyoruz
    const { blogId } = req.params;

    // Oturum açmış kullanıcının kullanıcı adını alıyoruz
    const { username } = req.session.user;

    // Silinecek blogu veritabanında buluyoruz (reaction ve totalVisit bilgilerini seçerek)
    const deletedBlog = await Blog.findOne({ _id: blogId }).select(
      "reaction totalVisit"
    );

    // Blog sahibi olan kullanıcıyı veritabanında buluyoruz
    const currentUser = await User.findOne({ username }).select(
      "blogPublished totalVisits totalReactions blogs"
    );

    // Kullanıcının istatistiklerini güncelliyoruz
    currentUser.blogPublished--; // Yayınladığı blog sayısını bir azaltıyoruz
    currentUser.totalVisits -= deletedBlog.totalVisit; // Toplam ziyaret sayısından bu blogun ziyaretlerini çıkarıyoruz
    currentUser.totalReactions -= deletedBlog.reaction; // Toplam reaksiyon sayısından bu blogun reaksiyonlarını çıkarıyoruz
    
    // Kullanıcının blog listesinden bu blogu kaldırıyoruz
    currentUser.blogs.splice(currentUser.blogs.indexOf(blogId), 1);

    // Kullanıcıyı güncellenmiş verilerle kaydediyoruz
    await currentUser.save();

    // Blogu veritabanından tamamen siliyoruz
    await Blog.deleteOne({ _id: blogId });

    // İşlem başarılıysa HTTP 200 durum kodunu dönüyoruz
    res.sendStatus(200);
  } catch (error) {
    // Hata oluşursa konsola yazdırıyoruz
    console.error("Error Deleting blog: ", error.message);
    throw error;
  }
};

// deleteBlog fonksiyonunu dışa aktarıyoruz (başka dosyalarda kullanmak için)
module.exports = deleteBlog;
