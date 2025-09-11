// utils/adsterra.jsx
// File utilitas untuk mengelola logika Adsterra.

// Daftar tautan direct link Adsterra.
const ADSTERRA_DIRECT_LINKS = [
    'https://discreetisabella.com/g77bpz0g?key=f1cc7147d1c59d932b6186896ab8854c',
    'https://discreetisabella.com/vttzzi1n?key=bfc8d7d57de835830a0d72fbe7a47be1',
    'https://discreetisabella.com/y5fc24f7?key=d6efa8068c5da148ed5cf346ffa62290',
    'https://discreetisabella.com/a43vczjf1b?key=70467091cade36a7f916bfe58dc80cff',
    'https://discreetisabella.com/t71keggw?key=9c6906c82c8eb114e2baef9058f4c4e5',
    'https://discreetisabella.com/vb5ixea83?key=c4e7438c85503eda026984db5e7aa3c4',
    'https://discreetisabella.com/x818nj48?key=db0a9d9fa9d81626b459383a7bdc33ee',
    'https://discreetisabella.com/gd8bwkyj?key=d2d35cf16f521bf5e9accfdd865dae8f',
    'https://discreetisabella.com/paij3re0by?key=fa60f72b73c05d987bd978f83a6deaa8',
    'https://discreetisabella.com/gh4tkda15?key=080742d09d4b5234a4fdaa773e48ebd4',
    'https://discreetisabella.com/u1ipxidjif?key=bf544685cc418fde38d3de4391de6fee',
    'https://discreetisabella.com/nu4ravi1cx?key=4d0556009c2d17968977e235d5de925a',
    'https://discreetisabella.com/wdhedf2wx?key=a2c98838af4390b59e8b7aaaea3f1660',
    'https://discreetisabella.com/yed8kj7bvw?key=b7830767455354f8e097df2a9e0f040c',
    'https://discreetisabella.com/w2sw8zgx21?key=d34ca1378210247721e98e65d20b3693',
    'https://discreetisabella.com/qn92sfcb?key=a8333f15c6bba15e367a5456f691547c',
    'https://discreetisabella.com/rz2xzbfm?key=8c4045c97068010d84c3f1002e82b1c9'
];

/**
 * Fungsi untuk menangani klik pada tautan dengan logika Adsterra.
 * Ini akan melacak jumlah klik dan membuka iklan pada interval tertentu.
 * @param {Event} e - Objek event dari klik.
 * @param {string} targetUrl - URL tujuan yang akan dibuka setelah iklan.
 */
export const handleAdsterraClick = (e, targetUrl) => {
    // Memastikan kode ini hanya berjalan di sisi client (browser)
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        let clickCount = parseInt(localStorage.getItem('adsterraClickCount') || '0', 10);
        clickCount += 1;
        localStorage.setItem('adsterraClickCount', clickCount.toString());

        // Pemicu iklan pada klik ke-3, ke-9, ke-15, ke-21, dst.
        // Formula: (n - 3) % 6 === 0, di mana n adalah jumlah klik.
        if (clickCount > 1 && (clickCount - 3) % 6 === 0) {
            // Membuka tautan iklan di tab baru
            const adLink = ADSTERRA_DIRECT_LINKS[Math.floor((clickCount - 3) / 6) % ADSTERRA_DIRECT_LINKS.length];
            window.open(adLink, '_blank');
        }
    }
};
