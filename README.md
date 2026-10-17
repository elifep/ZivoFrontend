# Zivo

Kuaför ve güzellik salonlarını keşfetmek, incelemek ve randevu almak için yazılmış mobil istemci. Bu depo uygulamanın kendisidir. Salon, kullanıcı ve randevu verisi ayrı bir API’den gelir.

## Ne yapar

Kullanıcı e-posta ve şifre ile kayıt olur veya giriş yapar. Oturum jetonu cihazda saklanır; uygulama açılınca oturum varsa ana sekmeler, yoksa giriş ekranı gelir.

- **Keşfet:** salon listesi, arama ve kategori (saç, tırnak, cilt bakımı)
- **Salon:** hizmetler, yorumlar, portföy ve salon bilgisi
- **Randevu:** hizmet ve çalışan seçerek randevu oluşturma, düzenleme ve iptal
- **Randevularım:** tarihe göre aktif, geçmiş ve iptal edilmiş randevular
- **Favoriler:** kaydedilen salonlar
- **Profil:** ad, iletişim, doğum tarihi; açık/koyu tema; Türkçe, İngilizce ve Arapça

## Çalıştırma

Node.js ve npm gerekir. Android için Expo Go veya bir emülatör yeter.

```bash
npm install
npx expo start
```

Terminaldeki karekodu Expo Go ile okutun. Android emülatör için `a`, web için `w` tuşuna basın.

## API

İstekler `app.json` içindeki `extra.API_URL` adresine gider. Varsayılan değer Android emülatöründen bilgisayara çıkan adrestir:

```text
http://10.0.2.2:5000
```

Fiziksel telefonda bu adres çalışmaz. Aynı ağdaki bilgisayarın IP’sini yazın, örneğin `http://192.168.1.20:5000`. API ayakta değilse giriş, salon listesi ve randevu ekranları veri alamaz.

Kullandığı uçlar:

| İş | İstek |
| --- | --- |
| Giriş | `POST /auth/login` |
| Kayıt | `POST /auth/register` |
| Jeton yenileme | `POST /auth/refresh` |
| Salonlar | `GET /businesses` |
| Randevular | `GET /appointments/user` |
| Randevu oluşturma | `POST /appointments` |
| İptal | `PUT /appointments/:id/status` |

## Teknolojiler

React Native, Expo 53, Expo Router, TypeScript, Zustand, i18next.

## Klasörler

```text
app/            Ekranlar ve yönlendirme
src/components  Salon kartı, filtre, dil ve tema seçicileri
src/services    API çağrıları
src/stores      Oturum, salon, randevu ve profil durumu
src/locales     tr, en, ar metinleri
```
