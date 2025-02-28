// Gerekli modülleri içe aktarıyoruz
import Snackbar from "./snackbar.js";
import imagePreviewFunc from "./utils/imagePreview.js";
import imageAsDataURL from "./utils/imageAsDataUrl.js";
import config from "./config.js";

// HTML'deki ilgili elementleri seçiyoruz
const imageField = document.querySelector("[data-image-field]"); // Görsel yükleme inputu
const imagePreview = document.querySelector("[data-image-preview]"); // Görsel önizleme alanı
const imagePreviewClear = document.querySelector("[data-image-preview-clear]"); // Önizlemeyi temizleme butonu

// Görsel yüklendiğinde önizleme fonksiyonunu çalıştırıyoruz
imageField.addEventListener("change", () => {
  imagePreviewFunc(imageField, imagePreview);
});

// Görsel önizleme alanını temizleyen fonksiyon
const clearImagePreview = function () {
  imagePreview.classList.remove("show"); // Önizleme görünürlüğünü kaldır
  imagePreview.innerHTML = ""; // İçeriği temizle
  imageField.value = ""; // Input değerini sıfırla
};

// Görsel önizlemeyi temizleme butonuna event listener ekliyoruz
imagePreviewClear.addEventListener("click", clearImagePreview);

// Kullanıcının temel bilgilerini içeren formu seçiyoruz
const basicInfoForm = document.querySelector("[data-basic-info-form]");
const basicInfoSubmit = document.querySelector("[data-basic-info-submit]");
const oldFormData = new FormData(basicInfoForm); // Mevcut form verilerini saklıyoruz
const progressBar = document.querySelector("[data-progress-bar]"); // Yükleme çubuğu

// Kullanıcı bilgilerini güncelleyen fonksiyon
const updateBasicInfo = async (event) => {
  event.preventDefault(); // Sayfanın yeniden yüklenmesini engelliyoruz

  basicInfoSubmit.setAttribute("disabled", ""); // Butonu devre dışı bırakıyoruz

  const formData = new FormData(basicInfoForm); // Yeni form verilerini alıyoruz

  // Profil fotoğrafı boyutunu kontrol ediyoruz
  if (formData.get("profilePhoto").size > config.profilePhoto.maxByteSize) {
    basicInfoSubmit.removeAttribute("disabled"); // Butonu tekrar etkinleştir
    Snackbar({
      type: "error",
      message: "Your profile photo should be less than 1MB.",
    });
    return;
  }

  // Eğer profil fotoğrafı yüklenmemişse, formdan siliyoruz
  if (!formData.get("profilePhoto").size) {
    formData.delete("profilePhoto");
  }

  // Profil fotoğrafını base64 formatına çeviriyoruz
  if (formData.get("profilePhoto")) {
    formData.set("profilePhoto", await imageAsDataURL(imageField.files[0]));
  }

  // Eğer kullanıcı adı değişmemişse, gönderilecek verilerden siliyoruz
  if (formData.get("username") === oldFormData.get("username")) {
    formData.delete("username");
  }

  // Eğer e-posta adresi değişmemişse, gönderilecek verilerden siliyoruz
  if (formData.get("email") === oldFormData.get("email")) {
    formData.delete("email");
  }

  // Form verilerini JSON formatına dönüştürüyoruz
  const body = Object.fromEntries(formData.entries());

  progressBar.classList.add("loading"); // Yükleme çubuğunu başlatıyoruz

  // Sunucuya güncelleme isteği gönderiyoruz
  const response = await fetch(`${window.location.href}/basic_info`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Güncelleme başarılıysa işlemi tamamlıyoruz
  if (response.ok) {
    basicInfoSubmit.removeAttribute("disabled");
    progressBar.classList.add("loading-end");
    Snackbar({
      message: "Your profile has been updated.",
    });
    window.location.reload(); // Sayfayı yeniliyoruz
  }

  // Hata durumunda kullanıcıya mesaj gösteriyoruz
  if (response.status === 400) {
    basicInfoSubmit.removeAttribute("disabled");
    progressBar.classList.add("loading-end");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message,
    });
  }
};

// Temel bilgiler formuna submit event'i ekliyoruz
basicInfoForm.addEventListener("submit", updateBasicInfo);

// Şifre güncelleme formu ve butonunu seçiyoruz
const passwordForm = document.querySelector("[data-password-form]");
const passwordSubmit = document.querySelector("[data-password-submit]");

// Kullanıcının şifresini güncelleyen fonksiyon
const updatePassword = async (event) => {
  event.preventDefault(); // Sayfanın yeniden yüklenmesini engelliyoruz

  passwordSubmit.setAttribute("disabled", ""); // Butonu devre dışı bırakıyoruz

  const formData = new FormData(passwordForm); // Form verilerini alıyoruz

  // Şifrelerin eşleşip eşleşmediğini kontrol ediyoruz
  if (formData.get("password") !== formData.get("confirm_password")) {
    passwordSubmit.removeAttribute("disabled");
    Snackbar({
      type: "error",
      message:
        "Please ensure your password and confirm password fields contain the same value.",
    });
    return;
  }

  // Form verilerini JSON formatına çeviriyoruz
  const body = Object.fromEntries(formData.entries());

  progressBar.classList.add("loading"); // Yükleme çubuğunu başlatıyoruz

  // Sunucuya şifre güncelleme isteği gönderiyoruz
  const response = await fetch(`${window.location.href}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Güncelleme başarılıysa işlemi tamamlıyoruz
  if (response.ok) {
    passwordSubmit.removeAttribute("disabled");
    progressBar.classList.add("loading-end");
    Snackbar({
      message: "Your password has been updated.",
    });
    return;
  }

  // Hata durumunda kullanıcıya mesaj gösteriyoruz
  if (response.status === 400) {
    passwordSubmit.removeAttribute("disabled");
    progressBar.classList.add("loading-end");
    const { message } = await response.json();
    Snackbar({
      type: "error",
      message,
    });
  }
};

// Şifre formuna submit event'i ekliyoruz
passwordForm.addEventListener("submit", updatePassword);

// Hesap silme butonunu seçiyoruz
const accountDeleteBtn = document.querySelector("[data-account-delete]");

// Kullanıcının hesabını silen fonksiyon
const deleteAccount = async (event) => {
  // Kullanıcıdan onay alıyoruz
  const confirmDelete = confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmDelete) {
    return; // Kullanıcı iptal ederse işlemi durduruyoruz
  }

  accountDeleteBtn.setAttribute("disabled", ""); // Butonu devre dışı bırakıyoruz

  progressBar.classList.add("loading"); // Yükleme çubuğunu başlatıyoruz

  // Sunucuya hesap silme isteği gönderiyoruz
  const response = await fetch(`${window.location.href}/account`, {
    method: "DELETE",
  });

  // Silme işlemi başarılıysa kullanıcıyı ana sayfaya yönlendiriyoruz
  if (response.ok) {
    progressBar.classList.add("loading-end");

    window.location = `${window.location.origin}/`;
  }
};

// Hesap silme butonuna click event'i ekliyoruz
accountDeleteBtn.addEventListener("click", deleteAccount);
