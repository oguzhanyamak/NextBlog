import imagePreviewFunc from "./utils/imagePreview.js"; // Resim önizleme işlevi
import Snackbar from "./snackbar.js"; // Bildirim göstermek için kullanılan bileşen
import config from "./config.js"; // Yapılandırma ayarları (ör. maksimum dosya boyutu)
import imageAsDataURL from "./utils/imageAsDataUrl.js"; // Görseli Base64 formatına dönüştürme işlevi

// 📌 Görsel Seçme & Önizleme Alanlarını Seç
const imageField = document.querySelector("[data-image-field]"); // Görsel yükleme input'u
const imagePreview = document.querySelector("[data-image-preview]"); // Önizleme alanı
const imagePreviewClear = document.querySelector("[data-image-preview-clear]"); // Önizlemeyi temizleme butonu

// 📌 Görsel Yüklendiğinde Önizleme Fonksiyonunu Çalıştır
imageField.addEventListener("change", () => {
  imagePreviewFunc(imageField, imagePreview);
});

// 📌 Önizlemeyi Temizleme İşlevi
const clearImagePreview = function () {
  imagePreview.classList.remove("show"); // Önizleme alanını gizle
  imagePreview.innerHTML = ""; // İçeriği temizle
};

// 📌 Önizlemeyi Temizleme Butonuna Olay Dinleyicisi Ekle
imagePreviewClear.addEventListener("click", clearImagePreview);

// 📌 Blog Yayınlama İşlemi

const blogForm = document.querySelector("[data-form]"); // Form elemanı
const publishBtn = document.querySelector("[data-publish-btn]"); // Yayınla butonu
const progressBar = document.querySelector("[data-progress-bar]"); // Yükleme çubuğu

/**
 * Blog yayınlama işlevi
 * @param {Event} event - Formun gönderme olayı
 */
const handlePublishBlog = async function (event) {
  event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

  publishBtn.setAttribute("disabled", ""); // Çift tıklamaya karşı butonu devre dışı bırak

  // Formdaki verileri almak için FormData nesnesi oluştur
  const formData = new FormData(blogForm);

  // 📌 Kullanıcı herhangi bir banner resmi yüklemediyse hata ver
  if (!formData.get("banner").size) {
    publishBtn.removeAttribute("disabled"); // Butonu tekrar etkinleştir
    Snackbar({
      type: "error",
      message: "You didn't select any image for blog banner.", // Hata mesajı
    });
    return;
  }

  // 📌 Seçilen resmin boyutu 5MB'tan büyükse hata ver
  if (formData.get("banner").size > config.blogBanner.maxByteSize) {
    publishBtn.removeAttribute("disabled"); // Butonu tekrar etkinleştir
    Snackbar({
      type: "error",
      message: "Image should be less than 5MB.", // Hata mesajı
    });
    return;
  }

  // 📌 Görseli Base64 formatına dönüştür ve FormData'ya ekle
  formData.set("banner", await imageAsDataURL(formData.get("banner")));

  // 📌 FormData'yı JSON formatına çevir
  const body = Object.fromEntries(formData.entries());

  // 📌 Yükleme çubuğunu göster
  progressBar.classList.add("loading");

  // 📌 Blog verisini sunucuya gönder
  const response = await fetch(`${window.location.origin}/createblog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // 📌 Başarılı yanıt durumu (Blog oluşturuldu)
  if (response.ok) {
    Snackbar({ message: "Your blog has been created." }); // Başarı mesajı göster
    progressBar.classList.add("loading-end"); // Yükleme animasyonunu durdur
    return (window.location = response.url); // Kullanıcıyı yeni blog sayfasına yönlendir
  }

  // 📌 Hata durumu (400 - Geçersiz istek)
  if (response.status === 400) {
    publishBtn.removeAttribute("disabled"); // Butonu tekrar etkinleştir
    progressBar.classList.add("loading-end"); // Yükleme animasyonunu durdur
    const { message } = await response.json(); // Yanıttan hata mesajını al
    Snackbar({
      type: "error",
      message, // Kullanıcıya hata mesajını göster
    });
  }
};

// 📌 Form gönderildiğinde handlePublishBlog fonksiyonunu çalıştır
blogForm.addEventListener("submit", handlePublishBlog);
