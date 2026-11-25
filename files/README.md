Layihə: "Admin Dashboard & Product Management System" (Pure JS)
Əsas Şərtlər:
Heç bir xarici kitabxana (React, Bootstrap, jQuery və s.) istifadə etmək olmaz. Sırf HTML, CSS və Vanilla JS tətbiq olunmalıdır.
AI istifadəsi minimum olmalıdır. Kodları AI-a yazdırmaq qadağandır.
Məlumatların saxlanması: Bütün CRUD əməliyyatları localStorage üzərində sinxronlaşdırılmalıdır ki, səhifə yeniləndikdə (F5) dəyişikliklər itməsin.
Tapşırıq Öhdəlikləri (CRUD & Admin Panel)
1. C - Create (Yeni Məhsul Əlavə Etmə):
Modal və ya ayrı bir form bölməsi vasitəsilə yeni məhsul əlavə edilməlidir.
Məhsul Sahələri: Ad, Kateqoriya (select), Qiymət, Stok Sayı, Status (Aktiv/Deaktiv toggle).
Validasiya: Bütün sahələr doldurulmalıdır. Qiymət və Stok mənfi ədəd ola bilməz. Səhv daxil edildikdə müvafiq inputun altında xəbərdarlıq görünməlidir.
2. R - Read (Cədvəl / Table Görünüşü və Statistikalar):
Admin Cədvəli: Bütün məhsullar HTML <table> elementi içərisində nümayiş olunmalıdır.
Üst Analitika Paneli (Dashboard Cards): Cədvəlin üstündə anlıq olaraq reduce() metodu ilə hesablanan 3 statik kart olmalıdır:
Ümumi Məhsul Sayı
Ümumi Stok Dəyəri (Qiymət × Stok Sayı)
Stoku Bitişən Məhsullar (Stok = 0 olanların sayısı)
3. U - Update (Məhsul Redaktə Etmə):
Cədvəldə hər sətirin sonunda "Düzəliş et" (Edit) düyməsi olmalıdır.
Düyməyə basıldıqda həmin sətin məlumatları formun içine dolmalı (Form Populating) və düymə "Yenilə" (Update) halına keçməlidir.
Redaktə edilib təsdiqləndikdə massivdəki həmin obyekt yenilənməli və cədvəl anlıq olaraq təkrar render olunmalıdır.
4. D - Delete (Təkli və Qrup Şəklində Silmə):
Təkli Silmə: Hər sətirdə "Sil" düyməsi olmalıdır (xəbərdarlıq modalı ilə).
Qrup Şəklində Silmə (Bulk Delete): Cədvəlin ilk sütununda checkbox-lar olmalıdır. Cədvəlin başlığındakı "Hamısını Seç" (Select All) checkbox-u seçildikdə bütün məhsullar seçilməli və yuxarıda "Seçilənləri Sil (X)" düyməsi görünməlidir.
5. Axtarış, Filtrləmə və Sortlaşdırma:
Cədvəlin üstündə anlıq axtarış inputu (input event-i).
Kateqoriyaya görə süzgəc (select).
Cədvəl başlıqlarına (Qiymət, Stok) kliklədikdə sütun üzrə artan/azalan sıra ilə çeşidləmə (sort()).
