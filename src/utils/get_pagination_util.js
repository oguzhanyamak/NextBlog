/**
 * Sayfalama işlemi için gerekli olan bilgileri hesaplar ve döndürür.
 *
 * @param {string} currentRoute - Geçerli URL yolu (örn: "/blogs/").
 * @param {Object} reqParams - HTTP isteğinden gelen parametreler.
 * @param {number} limit - Sayfa başına gösterilecek blog sayısı.
 * @param {number} totalBlogs - Toplam blog sayısı.
 * @returns {Object} Sayfalama bilgilerini içeren nesne.
 */
const getPagination = (currentRoute, reqParams, limit, totalBlogs) => {

    // İstek parametrelerinden sayfa numarasını al, varsayılan olarak 1 yap
    const currentPage = Number(reqParams.pageNumber) || 1;

    // Veritabanından kaç tane kaydın atlanacağını hesapla
    const skip = limit * (currentPage - 1);

    // Toplam sayfa sayısını hesapla (Yukarı yuvarlayarak)
    const totalPage = Math.ceil(totalBlogs / limit);

    // Sayfalama nesnesini oluştur
    const paginationObj = {
        // Eğer toplam blog sayısı, mevcut sayfanın son blogundan fazlaysa sonraki sayfanın URL'sini ekle
        next: totalBlogs > (currentPage * limit) ? `${currentRoute}page/${currentPage + 1}` : null,

        // Eğer önceki sayfa mevcutsa ve geçerli sayfa toplam sayfa sayısından küçük veya eşitse önceki sayfanın URL'sini ekle
        prev: skip && currentPage <= totalPage ? `${currentRoute}page/${currentPage - 1}` : null,

        // Toplam sayfa sayısını ekle
        totalPage,

        // Geçerli sayfa numarasını ekle
        currentPage,

        // Veritabanı sorgusunda kaç kayıt atlanacağını belirt
        skip,

        // Sayfa başına kaç kayıt gösterileceğini belirt
        limit
    };

    // Sayfalama nesnesini döndür
    return paginationObj;
}

// Modülü dışa aktararak diğer dosyalarda kullanılmasını sağlar
module.exports = getPagination;
