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
      nativeBannerScript.src = "//discreetisabella.com/6157f3c3b504068f7b930e8c3b3b4c61/invoke.js";
      nativeBannerScript.async = true;
      nativeBannerScript.setAttribute('data-cfasync', 'false');
      document.body.appendChild(nativeBannerScript);

      // Memuat skrip iklan Popunder
      const popunderScript = document.createElement('script');
      popunderScript.type = 'text/javascript';
      popunderScript.src = "//discreetisabella.com/87/f8/3b/87f83bda80875f0a822db9415424a6f3.js";
      popunderScript.async = true;
      document.body.appendChild(popunderScript);

      // Memuat skrip iklan Social Bar
      const socialBarScript = document.createElement('script');
      socialBarScript.type = 'text/javascript';
      socialBarScript.src = "//discreetisabella.com/5b/26/41/5b2641f7a5a927126a69412b007dc4e7.js";
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
      <div id="container-f164b40cd7c6863996c9ec4da638c7c6"></div>
    </>
  );
}
