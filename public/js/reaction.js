import dialog  from "./dialog.js";
// Beğeni butonunu ve beğeni sayısını temsil eden HTML öğelerini seçiyoruz.
const reactionBtn = document.querySelector("[data-reaction-btn]");
const reactionNumber = document.querySelector("[data-reaction-number]");

// Beğeni ekleme fonksiyonu
const addReaction = async () => {
  try {
    // Sunucuya PUT isteği göndererek beğeni ekleme işlemi yapıyoruz.
    const response = await fetch(`${window.location}/reactions`, {
      method: "PUT",
    });

    // Eğer istek başarılıysa (HTTP 200 OK)
    if (response.ok) {
      // Butona aktif sınıfı ekleyerek animasyonları tetikliyoruz.
      reactionBtn.classList.add("active", "reaction-anim-add");
      reactionBtn.classList.remove("reaction-anim-remove");

      // Beğeni sayısını bir artırıyoruz.
      reactionNumber.textContent = Number(reactionNumber.textContent) + 1;
    }

    // Eğer kullanıcı yetkilendirilmemişse (HTTP 401 Unauthorized)
    if (response.status === 401) {
      // Kullanıcıya giriş yapmasını isteyen bir diyalog kutusu oluşturuyoruz.
     const dialogBox = dialog({
        title: "Login to continue",
        content: `We're a place where coders share, stay up-to-date 
                        and grow their careers.`,
      });

      // Diyalog kutusunu sayfaya ekliyoruz.
      document.body.appendChild(dialogBox);
    }
  } catch (error) {
    // Hata durumunda hatayı konsola yazdırıyoruz.
    console.error("Error in reaction: ", error.message);
    throw error; // Hata fırlatılıyor, böylece çağıran kod tarafından yakalanabilir.
  }
};

// Beğeni kaldırma fonksiyonu
const removeReaction = async () => {
  try {
    // Sunucuya DELETE isteği göndererek beğeniyi kaldırıyoruz.
    const response = await fetch(`${window.location}/reactions`, {
      method: "DELETE",
    });

    // Eğer istek başarılıysa (HTTP 200 OK)
    if (response.ok) {
      // Buton animasyonlarını güncelliyoruz.
      reactionBtn.classList.add("reaction-anim-remove");
      reactionBtn.classList.remove("active", "reaction-anim-add");

      // Beğeni sayısını bir azaltıyoruz.
      reactionNumber.textContent = Number(reactionNumber.textContent) - 1;
    }
  } catch (error) {
    // Hata durumunda hatayı konsola yazdırıyoruz.
    console.error("Error removing Reaction: ", error.message);
    throw error; // Hata fırlatılıyor.
  }
};

// Beğeni butonuna tıklama olayını dinliyoruz.
reactionBtn.addEventListener("click", async function () {
  // Kullanıcı tekrar tekrar tıklamasın diye butonu devre dışı bırakıyoruz.
  reactionBtn.setAttribute("disabled", "");

  // Eğer buton aktif değilse beğeni ekliyoruz, aktifse beğeniyi kaldırıyoruz.
  if (!reactionBtn.classList.contains("active")) {
    await addReaction();
  } else {
    await removeReaction();
  }

  // İşlem tamamlandığında butonu tekrar etkin hale getiriyoruz.
  reactionBtn.removeAttribute("disabled");
});
