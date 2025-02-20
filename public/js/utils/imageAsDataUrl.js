/**
 * Bir görseli Base64 (Data URL) formatına dönüştürür.
 * @param {Blob|File} imageBlob - Dönüştürülecek görselin Blob veya File nesnesi
 * @returns {Promise<string>} - Base64 formatındaki Data URL'yi döndürür
 */
const imageAsDataURL = (imageBlob) => {
  // 📌 FileReader nesnesi oluştur
  const fileReader = new FileReader();
  fileReader.readAsDataURL(imageBlob); // Dosyayı Base64 formatına dönüştürmek için oku

  return new Promise((resolve, reject) => {
    // 📌 Dosya başarıyla yüklendiğinde Base64 sonucunu döndür
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result);
    });

    // 📌 Dosya okunurken hata oluşursa hatayı döndür
    fileReader.addEventListener("error", () => {
      reject(fileReader.error);
    });
  });
};

export default imageAsDataURL;
