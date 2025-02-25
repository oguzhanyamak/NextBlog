// Gerekli modülleri içe aktarıyoruz
import imagePreviewFunc from "./utils/imagePreview.js"; // Resim önizleme fonksiyonu
import Snackbar from "./snackbar.js"; // Bildirim (Snackbar) gösterme fonksiyonu
import config from "./config.js"; // Konfigürasyon dosyası (örneğin, maksimum dosya boyutu vb.)
import imageAsDataURL from "./utils/imageAsDataUrl.js"; // Resmi veri URL'sine dönüştüren fonksiyon

// DOM'daki ilgili elementleri seçiyoruz
const imageField = document.querySelector("[data-image-field]"); // Resim yükleme inputu
const imagePreview = document.querySelector("[data-image-preview]"); // Resim önizleme bölgesi
const imagePreviewClear = document.querySelector("[data-image-preview-clear]"); // Önizleme temizleme butonu

// Resim seçildiğinde önizleme fonksiyonunu çalıştırıyoruz
imageField.addEventListener("change", () => {
  imagePreviewFunc(imageField, imagePreview);
});

// Resim önizlemesini temizleyen fonksiyon
const clearImagePreview = function () {
  imagePreview.classList.remove("show"); // Önizleme bölgesini gizle
  imagePreview.innerHTML = ""; // İçeriği temizle
};

// Temizleme butonuna tıklanınca önizlemeyi temizle
imagePreviewClear.addEventListener("click", clearImagePreview);

// Blog formu, gönderme butonu ve yükleme çubuğunu seçiyoruz
const blogForm = document.querySelector("[data-form]");
const submitBtn = document.querySelector("[data-submit-btn]");
const progressBar = document.querySelector("[data-progress-bar]");

// Blog güncelleme fonksiyonu
const handleBlogUpdate = async (event) => {
  event.preventDefault(); // Sayfanın yeniden yüklenmesini engelliyoruz

  submitBtn.setAttribute("disabled", ""); // Gönder butonunu devre dışı bırakıyoruz

  const formData = new FormData(blogForm); // Form verilerini alıyoruz

  // Eğer kullanıcı yeni bir resim yüklememişse ve önizleme alanında resim yoksa hata veriyoruz
  if (!formData.get("banner").size && !imagePreview.hasChildNodes()) {
    submitBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "You didn't select any image for blog banner.", // Kullanıcıya hata mesajı gösteriyoruz
    });

    return;
  }

  // Eğer resim boyutu 5MB'dan büyükse hata veriyoruz
  if (formData.get("banner").size > config.blogBanner.maxByteSize) {
    submitBtn.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message: "Image should be less than 5MB.", // Kullanıcıya hata mesajı gösteriyoruz
    });

    return;
  }

  // Eğer kullanıcı yeni bir resim yüklememiş ama önizleme alanında bir resim varsa, banner alanını kaldırıyoruz
  if (!formData.get("banner").size && imagePreview.hasChildNodes()) {
    formData.delete("banner");
  }

  // Eğer bir resim varsa, onu veri URL'sine dönüştürüp formData'ya ekliyoruz
  if (formData.get("banner")) {
    formData.set("banner", await imageAsDataURL(formData.get("banner")));
  }

  // Form verilerini nesneye çeviriyoruz
  const body = Object.fromEntries(formData.entries());

  // Yükleme çubuğunu aktif hale getiriyoruz
  progressBar.classList.add("loading");

  // Blogu güncellemek için API isteği gönderiyoruz
  const response = await fetch(window.location.href, {
    method: "PUT", // PUT metodu ile güncelleme yapıyoruz
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(body), // JSON formatında verileri gönderiyoruz
  });

  // Eğer güncelleme başarılıysa
  if (response.ok) {
    submitBtn.removeAttribute("disabled");
    Snackbar({ message: "Your blog has been updated" }); // Başarı mesajı gösteriyoruz
    progressBar.classList.add("loading-end"); // Yükleme çubuğunu kapatıyoruz
    window.location = window.location.href.replace("/edit", ""); // Kullanıcıyı güncellenmiş blog sayfasına yönlendiriyoruz
    return;
  }

  // Eğer hata kodu 400 ise (geçersiz istek)
  if (response.status === 400) {
    progressBar.classList.add("loading-end");
    submitBtn.removeAttribute("disabled");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message, // Sunucudan dönen hata mesajını kullanıcıya gösteriyoruz
    });
  }
};

// Form gönderildiğinde `handleBlogUpdate` fonksiyonunu çalıştırıyoruz
blogForm.addEventListener("submit", handleBlogUpdate);
