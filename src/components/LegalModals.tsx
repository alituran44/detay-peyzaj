import React from 'react';
import { X, FileText, Truck, Lock, ShieldCheck, Cookie, RefreshCw, Scale, CheckCircle2, Printer } from 'lucide-react';

export type LegalModalType = 
  | 'teslimat_iade' 
  | 'gizlilik_kvkk' 
  | 'mesafeli_satis' 
  | 'cerez_politikasi'
  | 'aydinlatma_metni'
  | 'iptal_iade'
  | 'ssl_guvenlik'
  | null;

interface LegalModalsProps {
  activeType: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeType, onClose }) => {
  if (!activeType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-obsidian-900 border border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-950 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              {activeType === 'teslimat_iade' && <Truck className="w-6 h-6" />}
              {activeType === 'gizlilik_kvkk' && <Lock className="w-6 h-6" />}
              {activeType === 'mesafeli_satis' && <Scale className="w-6 h-6" />}
              {activeType === 'cerez_politikasi' && <Cookie className="w-6 h-6" />}
              {activeType === 'aydinlatma_metni' && <FileText className="w-6 h-6" />}
              {activeType === 'iptal_iade' && <RefreshCw className="w-6 h-6" />}
              {activeType === 'ssl_guvenlik' && <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-white">
                  {activeType === 'teslimat_iade' && 'Teslimat, Garanti ve İade Şartları'}
                  {activeType === 'gizlilik_kvkk' && 'Gizlilik Sözleşmesi ve Veri Güvenliği Politikası'}
                  {activeType === 'mesafeli_satis' && 'Mesafeli Satış Sözleşmesi (6502 Sayılı Kanun)'}
                  {activeType === 'cerez_politikasi' && 'Çerez (Cookie) ve İzleme Politikası'}
                  {activeType === 'aydinlatma_metni' && 'KVKK Aydınlatma ve Açık Rıza Beyan Metni'}
                  {activeType === 'iptal_iade' && 'İptal, Cayma, İade ve Mimari Revizyon Prosedürü'}
                  {activeType === 'ssl_guvenlik' && '256-Bit SSL Sertifikası ve 3D Secure Güvenlik Standartları'}
                </h3>
              </div>
              <p className="text-xs text-orange-400/90 font-mono">
                Detay Peyzaj & Mimarlık • TMMOB Peyzaj Mimarları Odası Standartları & Yasal Mevzuat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-full bg-obsidian-950 text-slate-400 hover:text-white border border-orange-950 cursor-pointer hidden sm:flex"
              title="Yazdır"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-obsidian-950 text-slate-400 hover:text-white border border-orange-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Legal Content */}
        <div className="overflow-y-auto pr-3 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans divide-y divide-orange-950/60">
          
          {/* =========================================================================
              1. TESLİMAT VE İADE ŞARTLARI
             ========================================================================= */}
          {activeType === 'teslimat_iade' && (
            <div className="space-y-4 pt-1">
              <div className="bg-orange-950/40 border border-orange-800/60 p-4 rounded-2xl space-y-1 text-xs">
                <span className="text-orange-400 font-bold font-mono uppercase">Resmi Taahhüt Özeti:</span>
                <p className="text-slate-200">
                  Tüm projeleriniz <strong>5 iş günü</strong> içinde eksiksiz DWG, PDF, Excel ve 4K 3D Render formatlarında dijital teslim edilir. <strong>1 tur ücretsiz revizyon</strong> hakkınız mevcuttur.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Teslimat Kapsamı ve Dijital Pafta Seti</h4>
                <p>
                  Detay Peyzaj & Mimarlık (Hasan Hüseyin Yıldırım) tarafından hazırlanan projeler aşağıdaki 5 ana paftadan oluşan eksiksiz teknik teslim paketi olarak sunulur:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
                  <li><strong>1. Yapısal Peyzaj Vaziyet Planı (AutoCAD DWG + Vektörel PDF):</strong> Teraslar, havuz, yürüyüş yolları, otopark, istinat duvarları, kotlandırma ve sert zemin metrajları (1/100 veya 1/200 ölçek).</li>
                  <li><strong>2. Bitkisel Peyzaj Tasarım Projesi (DWG + PDF):</strong> İklim bölgesine uygun ağaç, çalı, yer örtücü türleri, dikim koordinatları, taç çapları ve fidan adetleri.</li>
                  <li><strong>3. Otomatik Sulama Projesi (DWG + PDF):</strong> Damlama hatları, rotor/sprey sprinkler, solenoid vana zonlaması, ana boru çapları, pompa ve hidrofor debi hesabı.</li>
                  <li><strong>4. 4K Fotogerçekçi 3D Görselleştirme (Ultra HD Render):</strong> Gündüz ve gece aydınlatmalı gerçekçi villa & bahçe görselleri.</li>
                  <li><strong>5. Bitkisel & Yapısal Metraj Listesi (Excel Tablosu):</strong> Fidan boyları, gövde çevreleri, rulo çim m², bordür metre tülü ve keşif listesi.</li>
                </ul>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — 5 İş Günü Teslimat Süresi ve Başlangıç Koşulları</h4>
                <p>
                  Teslimat süresi olan <strong>5 (beş) iş günü</strong>; alıcının sisteme geçerli tapu/kroki/imar çapı veya arsa fotoğraflarını yüklemesi ve ödemenin onaylanması ile başlar. Resmi tatil ve pazar günleri iş günü hesabına dahil edilmez.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — Ücretsiz Mimari Revizyon Hakkı</h4>
                <p>
                  Müşteri memnuniyetini garanti altına almak adına, ilk teslimat tarihinden itibaren <strong>14 gün içerisinde</strong> iletilecek revizyon talepleri doğrultusunda <strong>1 (bir) tur ücretsiz revizyon</strong> uygulanır. Arsa sınırları veya imar taban alanı köklü biçimde değişmeksizin yapılan bitki türü değişimi, teras revizyonu ve donatı kaydırmaları en geç 3 iş günü içinde revize edilerek yeniden yüklenir.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 4 — İade ve Cayma Şartları (6502 Sayılı Kanun m.15/b)</h4>
                <p>
                  Mesafeli Sözleşmeler Yönetmeliği m.15/b uyarınca; <em>"Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara/hizmetlere ilişkin sözleşmelerde"</em> mimari çizim ve analiz aşamasına başlandıktan sonra cayma hakkı kullanılamaz. Ancak henüz çizimine başlanmamış siparişlerde ilk 24 saat içinde koşulsuz %100 ücret iadesi aynı kart/hesaba yapılır.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. GİZLİLİK SÖZLEŞMESİ & KVKK
             ========================================================================= */}
          {activeType === 'gizlilik_kvkk' && (
            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Veri Sorumlusu ve Yasal Dayanak</h4>
                <p>
                  İşbu Gizlilik Sözleşmesi ve KVKK Politikası; 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat uyarınca, veri sorumlusu sıfatıyla <strong>Detay Peyzaj & Mimarlık (Hasan Hüseyin Yıldırım)</strong> tarafından işletilen web platformu üzerinden toplanan kişisel verilerin korunmasını düzenler.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — İşlenen Veriler ve Toplanma Amaçları</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. Kimlik No (Bireysel faturalandırma için) veya Şirket Ünvanı ve Vergi No (Kurumsal faturalar için).</li>
                  <li><strong>İletişim Bilgileri:</strong> Telefon numarası (WhatsApp proje bildirimleri), E-posta adresi (Proje ve e-fatura teslimatı), Fatura adresi.</li>
                  <li><strong>Mülkiyet ve Proje Belgeleri:</strong> Ada/parsel numaraları, tapu fotokopileri, aplikasyon krokileri, arsa fotoğrafları ve coğrafi koordinatlar.</li>
                </ul>
                <p className="mt-2">
                  Bu veriler yalnızca mimari peyzaj projesi üretimi, statik ve bitkisel analiz, 5 günlük teslimat takibi ve GİB uyumlu resmi e-arşiv fatura tanzimi amacıyla işlenir.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — Mülkiyet Belgelerinin Mahremiyeti ve Güvenliği</h4>
                <p>
                  Sisteme yüklenen tapu kayıtları, mimari planlar ve arsa fotoğrafları hiçbir şart altında ticari amaçla üçüncü şahıslara, gayrimenkul veri tabanlarına veya reklam ajanslarına devredilemez, satılamaz veya paylaşılamaz. Tüm dosyalar 256-Bit şifreleme katmanıyla korunan sunucularda saklanır.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 4 — Ödeme ve Kart Güvenliği (PCI-DSS & SSL)</h4>
                <p>
                  Detay Peyzaj web sitesi üzerinden kredi kartı veya banka kartı ile yapılan ödemelerde kart numarası, son kullanma tarihi ve CVV güvenlik kodu şirketimiz veri tabanında ASLA saklanmaz. Ödeme işlemleri TCMB ve BDDK lisanslı ödeme kuruluşu <strong>Paynkolay (Aktif Bank)</strong> ve bankaların <strong>3D Secure</strong> doğrulama ağ geçitleri üzerinden doğrudan bankanız ile güvenli ortamda gerçekleştirilir.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              3. MESAFELİ SATIŞ SÖZLEŞMESİ
             ========================================================================= */}
          {activeType === 'mesafeli_satis' && (
            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Taraflar</h4>
                <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 space-y-2 text-xs">
                  <div>
                    <strong className="text-white">SATICI (Hizmet Sağlayıcı):</strong><br />
                    <strong>Ünvan:</strong> Detay Peyzaj & Mimarlık — Hasan Hüseyin Yıldırım<br />
                    <strong>Adres:</strong> İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale<br />
                    <strong>Telefon:</strong> +90 544 477 20 44 | <strong>E-Posta:</strong> peyzajdetay@gmail.com
                  </div>
                  <div className="pt-2 border-t border-orange-950">
                    <strong className="text-white">ALICI (Müşteri):</strong><br />
                    Web sitesi üzerinden sipariş formunu doldurarak arsa bilgilerini ileten ve ödemeyi gerçekleştiren gerçek veya tüzel kişi.
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — Sözleşmenin Konusu ve Hizmet Nitelikleri</h4>
                <p>
                  İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait web sitesi üzerinden elektronik ortamda siparişini verdiği online peyzaj mimarlığı projesi, 3D görselleştirme ve sulama planlama hizmetlerinin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — Fiyatlandırma, Vergi ve Ödeme Koşulları</h4>
                <p>
                  Hizmet bedelleri web sitesinde ilan edilen güncel birim fiyatlar (Peyzaj Projesi: 12.000 TL/Dönüm, 3D Görsel Tasarım: 12.000 TL/Dönüm, Sulama Projesi: 8.000 TL/Dönüm) üzerinden hesaplanır. Peyzaj Projelerinde 1-2 Dönüm için %15, 2-3 Dönüm için %20, 3-4 Dönüm için %25 indirim uygulanır. Tüm fiyatlara yasal KDV dahildir ve fatura ALICI'ya elektronik ortamda iletilir.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 4 — Fikri Mülkiyet Hakları (5846 Sayılı Kanun)</h4>
                <p>
                  Hazırlanan tüm mimari çizimler, 3D renderlar ve hesap tabloları 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında korunmaktadır. ALICI, teslim edilen projeyi sadece ilgili arsa ve yapının inşası/uygulaması amacıyla kullanabilir; yazılı izin olmaksızın çoğaltıp başka arsalarda uygulayamaz veya ticari olarak satamaz.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 5 — Yetkili Mahkeme ve İcra Daireleri</h4>
                <p>
                  İşbu sözleşmenin uygulanmasında, Sanayi ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile SATICI'nın yerleşim yerindeki (Çanakkale) Tüketici Mahkemeleri ve İcra Daireleri yetkilidir.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. ÇEREZ POLİTİKASI
             ========================================================================= */}
          {activeType === 'cerez_politikasi' && (
            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Çerez (Cookie) Nedir?</h4>
                <p>
                  Çerezler, web sitemizi ziyaret ettiğinizde bilgisayarınız veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Sitemizin güvenli çalışması, oturumunuzun korunması ve size daha hızlı bir kullanıcı deneyimi sunulması amacıyla kullanılmaktadır.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — Kullanılan Çerez Kategorileri</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Zorunlu ve Güvenlik Çerezleri:</strong> Kullanıcı girişi, sipariş sepeti durumu, 3D Secure ödeme doğrulaması ve SSL protokolü için zorunludur; kapatılamaz.</li>
                  <li><strong>İşlevsel Çerezler:</strong> Şehir seçimi, iklim analizi tercihleri ve hesaplama parametrelerini hatırlamak için kullanılır.</li>
                  <li><strong>Performans ve Hız Çerezleri:</strong> Web sitesi sayfalarının yüklenme hızını ve harita/render bileşenlerinin performansını artırmak amacıyla anonim olarak işlenir.</li>
                </ul>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — Çerez Tercihlerini Yönetme</h4>
                <p>
                  Tarayıcınızın (Chrome, Safari, Firefox, Edge vb.) ayarlarından çerezleri dilediğiniz an silebilir, engelleyebilir veya belirli siteler için sınırlandırabilirsiniz. Zorunlu çerezlerin engellenmesi durumunda sipariş tamamlama ve müşteri portalı girişlerinde aksamalar meydana gelebilir.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              5. KVKK AYDINLATMA METNİ
             ========================================================================= */}
          {activeType === 'aydinlatma_metni' && (
            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Aydınlatma Yükümlülüğü</h4>
                <p>
                  Detay Peyzaj & Mimarlık (Hasan Hüseyin Yıldırım) olarak 6698 sayılı KVKK m.10 uyarınca, web sitemiz ve iletişim kanallarımız aracılığıyla toplanan kişisel verilerinizin işlenme usul ve esasları hakkında sizleri aydınlatıyoruz.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — Veri İşleme Hukuki Sebepleri</h4>
                <p>
                  Kişisel verileriniz, KVKK m.5/2 uyarınca; <em>"Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması"</em>, <em>"Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (Fatura tanzimi)"</em> ve <em>"İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaatler için veri işlenmesinin zorunlu olması"</em> hukuki sebeplerine dayalı olarak toplanmaktadır.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — İlgili Kişi Olarak Haklarınız (KVKK m.11)</h4>
                <p>
                  KVKK'nın 11. maddesi kapsamında veri sahibi olarak;
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                  <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                  <li>KVKK m.7 çerçevesinde silinmesini veya yok edilmesini talep etme hakkına sahipsiniz.</li>
                </ul>
                <p className="mt-2">
                  Haklarınıza ilişkin taleplerinizi <strong>peyzajdetay@gmail.com</strong> adresine yazılı olarak iletebilirsiniz.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              6. İPTAL, CAYMA & REVİZYON PROSEDÜRÜ
             ========================================================================= */}
          {activeType === 'iptal_iade' && (
            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Sipariş İptali ve İlk 24 Saat Kuralı</h4>
                <p>
                  Siparişinizi oluşturup ödemeyi tamamladıktan sonraki ilk <strong>24 saat içerisinde</strong> (mimarımız arsa analizi ve çizim sürecini başlatmadan önce) siparişinizi iptal edebilirsiniz. Bu durumda hiçbir kesinti yapılmaksızın ödemeniz 1-3 iş günü içinde kartınıza/banka hesabınıza %100 iade edilir.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — Çizimine Başlanmış Projelerde Cayma Hakkı</h4>
                <p>
                  Mimari tasarım kişiye ve arsaya özel üretilen fikri bir hizmet olduğundan, 24 saatin ardından analiz ve CAD çizim süreci başladıktan sonra mesafeli sözleşmeler yönetmeliği gereğince ücret iadesi yapılmamaktadır. Bunun yerine müşterimize revizyon ve mimari destek güvencesi sağlanır.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — Mimari Revizyon Standartları</h4>
                <p>
                  Proje teslim edildikten sonra 14 gün boyunca müşterimiz <strong>1 tur kapsamlı ücretsiz revizyon</strong> talep edebilir. Revizyon talepleri; bitki türü ve adetlerinin değiştirilmesi, yürüyüş yolu güzergahlarının güncellenmesi, havuz/teras yerleşimi veya pergola modellerinin revize edilmesini kapsar. Revize edilen paftalar 3 iş günü içinde tamamlanarak müşteri portalına yüklenir.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              7. 256-BIT SSL & GÜVENLİK
             ========================================================================= */}
          {activeType === 'ssl_guvenlik' && (
            <div className="space-y-4 pt-1">
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <ShieldCheck className="w-5 h-5" />
                  <span>256-BIT SHA-256 TLS / SSL ŞİFRELEME AKTİF</span>
                </div>
                <p className="text-slate-200">
                  Web sitemiz ve sunucularımız arasındaki tüm veri trafiği askeri düzeyde 256-Bit SSL şifreleme sertifikası ile korunmaktadır.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 1 — Uçtan Uca İletişim Güvenliği</h4>
                <p>
                  Sipariş sihirbazında girdiğiniz kimlik, adres, arsa tapu verileri ve proje talepleri tarayıcınızdan sunucularımıza şifrelenmiş güvenli HTTPS protokolü ile aktarılır. Araya girme (Man-in-the-Middle) veya veri dinleme saldırılarına karşı tam koruma sağlanır.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 2 — BDDK Lisanslı Paynkolay & 3D Secure Doğrulama</h4>
                <p>
                  Ödemeleriniz Türkiye Cumhuriyet Merkez Bankası (TCMB) ve BDDK lisanslı ödeme kuruluşu <strong>Paynkolay (Aktif Bank)</strong> güvencesiyle tahsil edilir. Kartınızdan çekim yapılabilmesi için bankanız tarafından kayıtlı cep telefonunuza SMS ile gönderilen 6 haneli 3D Secure onay şifresini girmeniz zorunludur.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Madde 3 — PCI-DSS Level 1 Sertifikasyonu</h4>
                <p>
                  Paynkolay altyapısı, uluslararası kredi kartı güvenlik standardı olan <strong>PCI-DSS Seviye 1</strong> sertifikasına sahiptir. Kart bilgileriniz Detay Peyzaj sunucularına asla uğramaz, şifrelenmiş tokenize havuzlarda güvenle işlenir.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-orange-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>TMMOB Peyzaj Mimarları Odası ve 6502 Sayılı Tüketici Kanunu Standartlarında</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-glow cursor-pointer"
            >
              Okudum ve Anladım
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
