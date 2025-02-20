/**
 * Seçilen görselin önizlemesini oluşturur ve ekrana gösterir.
 * @param {HTMLElement} $imageField - Görsel seçme input'u (file input)
 * @param {HTMLElement} $imagePreview - Önizlemenin gösterileceği alan
 * @returns {Promise<string>} - Görselin geçici URL'sini döndürür
 */
const imagePreview = async function ($imageField, $imagePreview) {
    // 📌 Kullanıcının seçtiği görsel için geçici bir URL oluştur
    const imageObjectUrl = URL.createObjectURL($imageField.files[0]);

    // 📌 Yeni bir <img> elementi oluştur
    const $image = document.createElement('img');
    $image.classList.add('img-cover'); // CSS sınıfını ekle (kaplamalı görünüm)
    $image.src = imageObjectUrl; // Görsel kaynağını oluşturulan URL'ye ayarla

    // 📌 Önizleme alanına resmi ekle
    $imagePreview.append($image);
    $imagePreview.classList.add('show'); // Önizleme alanını görünür hale getir

    return imageObjectUrl; // Oluşturulan görsel URL'sini döndür
};

export default imagePreview;
