// dialog.js modülünü içe aktarıyoruz (Bu modül, kullanıcıya açılan diyalog kutularını yönetmek için kullanılıyor)
import dialog from "./dialog.js";

// DOM'dan okuma listesi butonunu ve sayısını temsil eden öğeleri seçiyoruz
const readingListBtn = document.querySelector("[data-reading-list-btn]");
const readingListNumber = document.querySelector("[data-reading-list-number]");

// Kullanıcının okuma listesine blog ekleme fonksiyonu
const addToReadingList = async () => {
  try {
    // Mevcut sayfanın URL'sini kullanarak API'ye PUT isteği gönderiyoruz
    const response = await fetch(`${window.location}/readingList`, {
      method: "PUT",
    });

    // Eğer istek başarılıysa, butonu aktif hale getir ve okuma listesi sayısını artır
    if (response.ok) {
      readingListBtn.classList.add("active");
      readingListNumber.textContent = Number(readingListNumber.textContent) + 1;
    }

    // Kullanıcı giriş yapmamışsa, bir diyalog kutusu açarak giriş yapmasını iste
    if (response.status === 401) {
      const dialogBox = dialog({
        title: "Login to continue",
        content: `We're a place where coders share, stay up-to-date 
                  and grow their careers.`,
      });
      document.body.appendChild(dialogBox);
    }
  } catch (error) {
    console.error("Error adding to reading list: ", error.message);
    throw error;
  }
};

// Kullanıcının okuma listesinden blog kaldırma fonksiyonu
const removeFromReadingList = async () => {
  try {
    // Mevcut sayfanın URL'sini kullanarak API'ye DELETE isteği gönderiyoruz
    const response = await fetch(`${window.location}/readingList`, {
      method: "DELETE",
    });

    // Eğer istek başarılıysa, butonu pasif hale getir ve okuma listesi sayısını azalt
    if (response.ok) {
      readingListBtn.classList.remove("active");
      readingListNumber.textContent = Number(readingListNumber.textContent) - 1;
    }
  } catch (error) {
    console.error("Error removing from reading list: ", error.message);
    throw error;
  }
};

// Okuma listesi butonuna tıklama olayını dinleyerek işlem yapıyoruz
readingListBtn.addEventListener("click", async function () {
  // Kullanıcı bir işlem yaparken butonu devre dışı bırak
  readingListBtn.setAttribute("disabled", "");

  // Eğer buton aktif değilse, blogu okuma listesine ekle; aktifse çıkar
  if (!readingListBtn.classList.contains("active")) {
    await addToReadingList();
  } else {
    await removeFromReadingList();
  }

  // İşlem tamamlandıktan sonra butonu tekrar etkinleştir
  readingListBtn.removeAttribute("disabled");
});
