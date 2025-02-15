// Snackbar bildirimlerini gösterecek olan wrapper elementini seçiyoruz
const $snackbarWrapper = document.querySelector("[data-snackbar-wrapper]");

// Son gösterilen Snackbar için zamanlayıcıyı takip eden değişken
let lastTimeout = null;

// Snackbar bileşeni (bildirim mesajlarını göstermek için)
const Snackbar = (props) => {
  // Yeni bir snackbar div elementi oluşturuyoruz
  const $snackbar = document.createElement("div");
  $snackbar.classList.add("snackbar"); // Genel snackbar CSS sınıfını ekliyoruz

  // Snackbar'ın tipini belirleyerek ilgili CSS sınıfını ekliyoruz (örneğin: error, success, warning)
  props.type && $snackbar.classList.add(props.type);

  // Snackbar içeriğini belirliyoruz (mesajı ekliyoruz)
  $snackbar.innerHTML = `<p class="body-medium snackbar-text">${props.message}</p>`;

  // Önceki snackbar mesajlarını temizliyoruz (Sadece en son mesajı göstermek için)
  $snackbarWrapper.innerHTML = '';

  // Yeni oluşturduğumuz snackbar'ı wrapper içine ekliyoruz
  $snackbarWrapper.append($snackbar);

  // Önceki timeout'u temizleyerek yeni bir zamanlayıcı başlatıyoruz
  clearTimeout(lastTimeout);
  lastTimeout = setTimeout(() => {
    // 5 saniye sonra snackbar mesajını ekrandan kaldırıyoruz
    $snackbarWrapper.removeChild($snackbar);
  }, 5000);
};

// Snackbar fonksiyonunu dışa aktarıyoruz, böylece başka dosyalarda kullanılabilir
export default Snackbar;
