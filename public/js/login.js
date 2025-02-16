// Snackbar bileşenini içe aktarıyoruz (bildirim göstermek için)
import Snackbar from "./snackbar.js";

// Form ve gönderme butonunu seçiyoruz
const $form = document.querySelector("[data-form]");
const $submitBtn = document.querySelector("[data-submit-btn]");

// Kayıt formunun gönderilmesini ele alan event listener
$form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Sayfanın yenilenmesini engelliyoruz
  $submitBtn.setAttribute("disabled", ""); // Butonu devre dışı bırakıyoruz (çift tıklamayı önlemek için)

  // Form verilerini alıyoruz
  const formData = new FormData($form);

  // Form verilerini sunucuya gönderiyoruz
  const response = await fetch(`${window.location.origin}/login`, {
    method: "POST", // HTTP POST isteği yapıyoruz
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // URL-encoded formatında veri gönderiyoruz
    },
    body: new URLSearchParams(
      Object.fromEntries(formData.entries())
    ).toString(), // Form verilerini encode edip body'ye ekliyoruz
  });

  // Sunucudan başarılı yanıt dönerse, yönlendirme yapıyoruz
  if (response.ok) {
    return (window.location = response.url); // Kullanıcıyı yönlendiriyoruz
  }

  // Sunucudan hata yanıtı (400 Bad Request) gelirse
  if (response.status === 400) {
    $submitBtn.removeAttribute("disabled"); // Hata durumunda butonu tekrar aktif hale getiriyoruz
    const { message } = await response.json(); // Hata mesajını alıyoruz
    Snackbar({
      type: "error",
      message, // Hata mesajını ekranda gösteriyoruz
    });
  }
});
