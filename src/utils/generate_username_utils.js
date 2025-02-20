/**
 * Verilen isimden benzersiz bir kullanıcı adı oluşturur.
 * @param {string} name - Kullanıcının adı
 * @returns {string} - Oluşturulan benzersiz kullanıcı adı
 */

module.exports = (name) => {
  // İsmi küçük harfe çevir ve boşlukları kaldır
  const username = name.toLowerCase().replace(" ", "");
  // Kullanıcı adının sonuna zaman damgası ekleyerek benzersiz hale getir
  return `${username}-${Date.now()}`;
};
