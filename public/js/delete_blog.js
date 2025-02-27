// SnackBar modülünü içe aktarıyoruz (bildirim mesajı göstermek için)
import SnackBar from "./snackbar.js";

// Sayfadaki tüm blog silme butonlarını seçiyoruz
const blogDeleteBtnAll = document.querySelectorAll("[data-blog-delete-btn]");

// Blog silme işlemini gerçekleştiren asenkron fonksiyon
const handleBlogDelete = async (blogId) => {
  // Kullanıcıya blogu silmek istediğinden emin olup olmadığını soruyoruz
  const confirmDelete = confirm("Are you sure you want to delete this blog?");

  // Eğer kullanıcı "Hayır" derse, işlem iptal edilir
  if (!confirmDelete) {
    return;
  }

  // Silme isteğini API'ye gönderiyoruz
  const response = await fetch(
    `${window.location.origin}/blogs/${blogId}/delete`, // API uç noktası
    {
      method: "DELETE", // HTTP DELETE isteği gönderiyoruz
    }
  );

  // Eğer işlem başarılıysa, kullanıcıya bildirim gösteriyoruz
  if (response.ok) {
    SnackBar({
      message: "Blog has been deleted.", // Silme işlemi başarılı mesajı
    });
  }

  // Sayfayı yenileyerek güncellenmiş blog listesini gösteriyoruz
  window.location.reload();
};

// Her bir silme butonu için tıklama olayını dinliyoruz
blogDeleteBtnAll.forEach((deleteBtn) => {
  const blogId = deleteBtn.dataset.blogDeleteBtn; // Blog ID'sini butondan alıyoruz
  deleteBtn.addEventListener("click", handleBlogDelete.bind(null, blogId)); // Tıklanınca handleBlogDelete fonksiyonunu çalıştırıyoruz
});
