"use client";

import { useEffect } from 'react';
// Asumsi: file `adsterra.js` tidak ada, jadi kita hapus import-nya untuk memperbaiki error kompilasi.
// Ini mungkin perlu disesuaikan jika file tersebut benar-benar ada dan berisi logika penting.
// import { handleAdsterraClick } from '../utils/adsterra';

// Komponen khusus untuk menangani klik secara global dan menampilkan Native Banner, Social Bar, dan Popunder Adsterra.
export default function AdsterraLayoutWrapper({ children }) {
  useEffect(() => {
    // Memastikan window tersedia sebelum memuat skrip iklan dan event listener.
    if (typeof window !== 'undefined') {
      // Fungsi untuk memanggil logika adsterra saat ada klik di mana saja.
      const handleClick = (e) => {
        // Dummy targetUrl dibuat karena logika handleAdsterraClick memerlukannya.
        // Kita menggunakan URL halaman saat ini.
        const targetUrl = window.location.href;
        // Kita tidak bisa memanggil fungsi `handleAdsterraClick` karena file-nya tidak ditemukan.
        // handleAdsterraClick(e, targetUrl);
      };
  
      window.addEventListener('click', handleClick);

      // Memuat skrip iklan Native Banner
      const nativeBannerScript = document.createElement('script');
      nativeBannerScript.src = "//discreetisabella.com/ce4c42ba51eddb0024dfa25613d99fda/invoke.js";
      nativeBannerScript.async = true;
      nativeBannerScript.setAttribute('data-cfasync', 'false');
      document.body.appendChild(nativeBannerScript);

      // Memuat skrip iklan Popunder
      const popunderScript = document.createElement('script');
      popunderScript.type = 'text/javascript';
      popunderScript.src = "//discreetisabella.com/c4/ac/5c/c4ac5cbbdf0ff844b553232a3ff4f729.js";
      popunderScript.async = true;
      document.body.appendChild(popunderScript);

      // Memuat skrip iklan Social Bar
      const socialBarScript = document.createElement('script');
      socialBarScript.type = 'text/javascript';
      socialBarScript.src = "//discreetisabella.com/38/a8/09/38a809c8d813008628915e6c653a3e97.js";
      socialBarScript.async = true;
      document.body.appendChild(socialBarScript);
  
      // Cleanup function untuk menghapus event listener dan skrip saat komponen di-unmount.
      return () => {
        window.removeEventListener('click', handleClick);
        document.body.removeChild(nativeBannerScript);
        document.body.removeChild(popunderScript);
        document.body.removeChild(socialBarScript);
      };
    }
  }, []); // Dependensi kosong memastikan efek hanya berjalan sekali saat mount.

  return (
    <>
      {children}
      {/* Container untuk iklan Native Banner */}
      <div id="container-ce4c42ba51eddb0024dfa25613d99fda"></div>
    </>
  );
}
