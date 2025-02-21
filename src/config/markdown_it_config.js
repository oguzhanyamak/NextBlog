// Markdown-It ve Highlight.js kütüphanelerini içe aktarıyoruz
const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js").default;

// MarkdownIt nesnesini oluşturuyoruz ve yapılandırıyoruz
const markdown = new MarkdownIt({
  // Satır sonlarında otomatik olarak <br> etiketi eklenmesini sağlar
  breaks: true,

  // Otomatik olarak bağlantıları algılar ve dönüştürür
  linkify: true,

  // Özel sözdizimi vurgulama fonksiyonu belirliyoruz
  highlight: (str, lang) => {
    // Eğer bir dil belirtilmemişse veya geçersizse boş string döndür
    if (!lang && !hljs.getLanguage(lang)) return "";

    try {
      // Highlight.js kullanarak kod bloğunu vurgula
      return hljs.highlight(str, {
        language: lang, // Belirtilen dili kullan
        ignoreIllegals: true, // Geçersiz sözdizimi hatalarını yok say
      }).value;
    } catch (error) {
      // Hata durumunda mesajı konsola yazdır ve hatayı fırlat
      console.error("Error highlighting language: ", error.message);
      throw error;
    }
  },
});

// markdown nesnesini dışa aktarıyoruz, böylece başka dosyalarda kullanılabilir
module.exports = markdown;
