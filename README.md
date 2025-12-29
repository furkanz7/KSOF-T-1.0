# 🏋️ KSOFit - Killer Skinny Obese Fit

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini 3.5](https://img.shields.io/badge/AI-Gemini_3.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**"Sıradan bir fitness uygulaması değil; cebinizdeki biyomekanik yapay zeka antrenörü."**

</div>

---

## 📖 Proje Hakkında

**KSOFit**, özellikle fitness dünyasına yeni adım atan **"Skinny Fat"** (Zayıf-Yağlı) ve **"Obez"** bireyler için tasarlanmış yeni nesil bir mobil koçluk platformudur.

Piyasadaki statik (herkese aynı şeyi veren) programların aksine, KSOFit **Google Gemini 3.5** dil modelini kullanarak kullanıcının anatomik verilerini, hedeflerini ve mevcut ekipmanlarını analiz eder. Sonuç olarak, milimetrik hesaplanmış beslenme planları ve hiper-kişiselleştirilmiş antrenman rutinleri oluşturur.

---

## 🧠 Yapay Zeka Motoru: Gemini 3.5

Bu projenin kalbinde, Google'ın en güncel ve en hızlı modellerinden biri olan **Gemini 3.5** yatmaktadır. Uygulama, basit metin istemleri yerine **"Structured Outputs" (Yapılandırılmış JSON Şemaları)** kullanır.

| Özellik | Açıklama |
| :--- | :--- |
| **🧬 Biyometrik Analiz** | Kullanıcının boy, kilo, yaş ve cinsiyet verilerini işleyerek TDEE ve BMR (Bazal Metabolizma Hızı) hesaplar. |
| **🥗 Dinamik Beslenme** | *"Dolabımda sadece yumurta ve pirinç var"* dediğinizde, bu malzemelerle makro hedeflerinize uygun tarif üretir. |
| **🏋️ Akıllı Programlama** | *"Haftada 3 günüm var ve dizim ağrıyor"* gibi karmaşık kısıtlamaları anlayıp programı buna göre revize eder. |
| **🗺️ Lokasyon Zekası** | Google Maps entegrasyonu ile (Grounding) çevrenizdeki en yüksek puanlı spor salonlarını analiz eder ve listeler. |

---

## ✨ Temel Özellikler

### 1. 🔐 Güvenli Kimlik Doğrulama
* Modern form validasyonları.
* Şifre güvenliği ve kullanıcı oturum yönetimi.
* Kullanıcı dostu hata yönetimi ve geri bildirimler.

### 2. 🎯 Hedef Odaklı Onboarding
Kullanıcıyı boğmadan, 5 adımda analiz eden sihirbaz:
* **Vücut Tipi Analizi:** Skinny Fat, Obez, Atletik.
* **Hedef Belirleme:** Yağ Yakımı (Cut), Kas İnşası (Bulk), Vücut Düzenleme (Recomp).
* **Ekipman Durumu:** Evde, Spor Salonunda veya Vücut Ağırlığıyla.

### 3. 🔥 "Chef Mode" (Şef Modu)
Yapay zeka, elinizdeki malzemelere göre anlık yemek tarifi üretir.
> *"Bana 200g tavuk ve mantarla, 500 kaloriyi geçmeyecek, yüksek proteinli bir akşam yemeği hazırla."*

### 4. 🎨 Premium "Dark Gym" Arayüzü
* Göz yormayan koyu mod (Dark Mode).
* **Glassmorphism:** Şeffaf katmanlar ve modern bulanıklık efektleri.
* **Linear Gradients:** Derinlik katan renk geçişleri.
* Akıcı animasyonlar ve sayfa geçişleri.

---

## 🛠 Teknik Mimari & Teknoloji Yığını

Proje, sürdürülebilirlik ve performans için **Clean Architecture** prensiplerine uygun olarak geliştirilmiştir.

### 🏗️ Çekirdek Teknolojiler
* **Framework:** React Native (Expo SDK 50+)
* **Dil:** TypeScript (Tam Tip Güvenliği İçin)
* **Navigasyon:** React Navigation (Native Stack)
* **AI SDK:** `@google/genai` (Modern SDK)
* **Styling:** StyleSheet & Flexbox Layout

### 📂 Dosya Yapısı
Modüler ve ölçeklenebilir bir yapı tercih edilmiştir:

```bash
src/
├── components/      # Yeniden kullanılabilir UI parçaları (Button, Input, Card)
├── screens/         # Uygulama sayfaları (Login, WorkoutPlan, ChefMode)
├── services/        # Dış dünya ile konuşan servisler (Gemini API, Google Maps)
├── types/           # TypeScript arayüzleri ve veri modelleri
└── utils/           # Yardımcı fonksiyonlar ve sabitler
