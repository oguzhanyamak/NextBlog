const cloudinary = require('cloudinary').v2; // Cloudinary modülünü içe aktar

// Cloudinary'yi ortam değişkenleri ile yapılandır
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary hesabı adı
    api_key: process.env.CLOUDINARY_API_KEY, // API anahtarı
    api_secret: process.env.CLOUDINARY_API_SECRET // API gizli anahtarı
});

/**
 * Resmi Cloudinary'ye yükler ve güvenli URL'yi döndürür.
 * @param {string} image - Yüklenecek resmin veri URI'si veya dosya yolu
 * @param {string} public_id - Cloudinary'de kaydedilecek dosyanın benzersiz kimliği
 * @returns {Promise<string>} - Yüklenen resmin güvenli URL'si
 */
const uploadToCloudinary = async (image, public_id) => {
    try {
        // Cloudinary'ye resmi yükle
        const result = await cloudinary.uploader.upload(image, {
            public_id: public_id, // Dosya için belirlenen benzersiz kimlik
            resource_type: 'auto' // Resim, video veya diğer formatları otomatik algıla
        });

        return result.secure_url; // Güvenli URL'yi döndür
    } catch (error) {
        console.log('Error uploading image to Cloudinary:', error.message); // Hata mesajını konsola yaz
        throw error; // Hata durumunda hatayı tekrar fırlat
    }
};

// Fonksiyonu dışa aktarma
module.exports = uploadToCloudinary;
