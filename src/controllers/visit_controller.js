// Blog modelini içe aktarıyoruz
const Blog = require(`../models/blog_model.js`);

// Ziyaret sayısını güncelleyen fonksiyon
const updateVisit = async (req, res) => {
  try {
    // İstek parametrelerinden blogId'yi alıyoruz
    const { blogId } = req.params;

    // Belirtilen blogu veritabanından sorguluyoruz ve sadece "totalVisit" ve "owner" alanlarını seçiyoruz
    const visitedBlog = await Blog.findById(blogId)
      .select("totalVisit owner")
      .populate({
        path: "owner", // Blogun sahibini de getiriyoruz
        select: "totalVisits", // Sahibin toplam ziyaret sayısını da alıyoruz
      });

    // Blogun toplam ziyaret sayısını artırıyoruz
    visitedBlog.totalVisit++;
    await visitedBlog.save(); // Güncellenmiş veriyi kaydediyoruz

    // Blog sahibinin toplam ziyaret sayısını artırıyoruz
    visitedBlog.owner.totalVisits++;
    await visitedBlog.owner.save(); // Güncellenmiş veriyi kaydediyoruz

    // İşlem başarılıysa 200 durum kodu döndürüyoruz
    res.sendStatus(200);
  } catch (error) {
    // Hata durumunda konsola hata mesajı yazdırıyoruz
    console.error("Error updating totalVisits: ", error.message);
    throw error; // Hata fırlatılıyor, böylece hata yakalanabilir
  }
};

// updateVisit fonksiyonunu dışa aktarıyoruz
module.exports = updateVisit;
