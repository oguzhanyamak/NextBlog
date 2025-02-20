// Üst menü çubuğunu seçiyoruz
const $topAppBar = document.querySelector("[data-top-app-bar]");

// Son kaydırma pozisyonunu takip etmek için değişken tanımlıyoruz
let lastScrollPos = 0;

// Pencere (window) kaydırıldığında (scroll) çalışacak olay dinleyicisini ekliyoruz
window.addEventListener("scroll", (event) => {
  // Eğer sayfa 50 pikselden fazla kaydırıldıysa "active" sınıfını ekle, aksi halde çıkar
  $topAppBar.classList[window.scrollY > 50 ? "add" : "remove"]("active");

  // Eğer aşağı doğru kaydırılıyorsa ve 50 pikselden fazla scroll yapıldıysa "hide" sınıfını ekle, aksi halde çıkar
  $topAppBar.classList[
    window.scrollY > lastScrollPos && window.scrollY > 50 ? "add" : "remove"
  ]("hide");
});

// En son kaydırma pozisyonunu güncelliyoruz
lastScrollPos = window.scrollY;

// Menü kapsayıcılarını seçiyoruz
const $menuWrappers = document.querySelectorAll("[data-menu-wrapper]");

// Eğer menü kapsayıcıları varsa, her biri için döngü başlatıyoruz
$menuWrappers?.forEach(function ($menuWrapper) {
  // Menü açma/kapama butonunu seçiyoruz
  const $menuToggler = $menuWrapper.querySelector("[data-menu-toggler]");
  
  // Açılacak menüyü seçiyoruz
  const $menu = $menuWrapper.querySelector("[data-menu]");

  // Menü açma/kapama butonuna tıklanınca çalışacak fonksiyonu ekliyoruz
  $menuToggler.addEventListener("click", () => {
    // Menüye "active" sınıfını ekleyip çıkarıyoruz (toggle)
    $menu.classList.toggle("active");

    // Konsola menüye tıklanıp tıklanmadığını ve güncel class listesini yazdırıyoruz
    console.log("Tıklandı! Menü Class Listesi:", $menu.classList.value);
  });
});


// Geri butonunu seç
const $backBtn = document.querySelector("[data-back-btn]");

/**
 * Tarayıcı geçmişinde bir adım geri gider.
 */
const handleBackward = function () {
  window.history.back(); // Kullanıcıyı önceki sayfaya yönlendir
};

// Eğer geri butonu varsa, tıklama olayını dinle
$backBtn?.addEventListener("click", handleBackward);


// Otomatik yükseklik ayarlayan textarea seç
const $autoHeightTextArea = document.querySelector("[data-textarea-auto-height]");

/**
 * Textarea içeriğe göre dinamik olarak yüksekliği ayarlar.
 */
const textareaAutoHeight = function () {
  this.style.height = this.scrollHeight + "px"; // İçeriğe bağlı olarak yüksekliği güncelle
  this.style.maxHeight = this.scrollHeight + "px"; // Maksimum yüksekliği de aynı ayarla
};

// Eğer textarea varsa, input olayını dinleyerek yüksekliği dinamik olarak ayarla
$autoHeightTextArea?.addEventListener("input", textareaAutoHeight);

// Sayfa yüklendiğinde, textarea'da içerik varsa yüksekliği hemen ayarla
$autoHeightTextArea && textareaAutoHeight.call($autoHeightTextArea);
