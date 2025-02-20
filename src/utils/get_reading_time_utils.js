const AVG_READ_WPM = 200;

/**
 * Bir metnin okunma süresini hesaplar.
 * @param {string} text - Okunacak metin
 * @returns {number} - Tahmini okuma süresi (dakika cinsinden, yukarı yuvarlanmış)
 */

const getReadingTime = (text) =>
  Math.ceil(text.split(" ").length / AVG_READ_WPM);

module.exports = getReadingTime;
