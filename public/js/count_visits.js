// Ziyaret sayısını artıran asenkron fonksiyon
const countVisit = async () => {
    try {
      // Sunucuya ziyaret bilgisini göndermek için bir PUT isteği yapılıyor
      const response = await fetch(`${window.location}/visit`, {
        method: "PUT",
      });
  
      // Eğer yanıt başarılıysa (HTTP 200 OK veya benzeri)
      if (response.ok) {
        // Geçerli sayfanın yolunu (pathname) ziyaret edilen bloglar listesine ekliyoruz
        visitedBlogs.push(window.location.pathname);
        // Güncellenmiş listeyi localStorage'a kaydediyoruz
        localStorage.setItem("visitedBlogs", JSON.stringify(visitedBlogs));
      }
    } catch (error) {
      // Hata durumunda konsola hata mesajı yazdırıyoruz
      console.error("Error counting visit: ", error.message);
      throw error; // Hata fırlatılıyor ki üst katmanda ele alınabilsin
    }
  };
  
  // LocalStorage'dan ziyaret edilen blogları alıyoruz
  let visitedBlogs = localStorage.getItem("visitedBlogs");
  
  // Eğer localStorage'da kayıtlı bir liste yoksa, boş bir dizi oluşturup kaydediyoruz
  if (!visitedBlogs) {
    localStorage.setItem("visitedBlogs", JSON.stringify([]));
  }
  
  // LocalStorage'dan alınan string veriyi JSON formatına çeviriyoruz
  visitedBlogs = JSON.parse(localStorage.getItem("visitedBlogs"));
  
  // Eğer şu anki sayfa daha önce ziyaret edilmemişse, sayacı artırmak için countVisit fonksiyonunu çağırıyoruz
  if (!visitedBlogs.includes(window.location.pathname)) {
    countVisit();
  }
  