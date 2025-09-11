import { notFound } from 'next/navigation';
import { getTvSeriesById, searchMoviesAndTv } from '../../../../lib/api';
import WatchClient from './WatchClient';

// Fungsi utilitas untuk membuat slug dari judul TV show
const createSlug = (item) => {
  const title = item.name;
  if (!title) return '';
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
  
  let year = '';
  if (item.first_air_date) {
    year = item.first_air_date.substring(0, 4);
  }
  return `${baseSlug}-${year}`;
};

// Function to fetch data from the TMDb keyword API
const getEroticMovies = async (page = 1) => {
    // Memastikan penggunaan variabel apiKey yang benar
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY; 
    const keywordId = 190370;

    // Menggunakan variabel apiKey yang sudah didefinisikan
    const url = `https://api.themoviedb.org/3/keyword/${keywordId}/movies?api_key=${apiKey}&page=${page}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url);

    console.log('Response status:', response.status);
    if (!response.ok) {
        console.error('API Error:', await response.text());
        throw new Error('Failed to fetch erotic movies data');
    }

    const data = await response.json();
    return data.results;
};

// ===================================
// KOMPONEN SERVER UTAMA
// ===================================
export default async function StreamPage({ params }) {
    const { slug } = params; // Mendapatkan slug dari params

    let tvDetails = null;
    let mediaType = "tv"; // Menentukan tipe media secara eksplisit sebagai "tv"

    const id = parseInt(slug, 10);
  
    // Logika untuk memisahkan slug tetap sama
    const slugParts = slug.split('-');
    const lastPart = slugParts[slugParts.length - 1];
    const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
    const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;
  
    if (!isNaN(id) && slugParts.length === 1) {
      tvDetails = await getTvSeriesById(id);
    } else {
      const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
      
      let matchingTvShow = searchResults.find(item => {
        const itemTitle = item.name?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        if (!itemTitle) {
          return false;
        }
  
        const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
  
        const titleMatch = itemTitle === slugTitleClean ||
                           itemTitle.replace(/\s/g, '') === slugTitleClean;
  
        const yearMatch = !slugYear || (item.first_air_date && item.first_air_date.substring(0, 4) === slugYear);
        
        return item.media_type === 'tv' && titleMatch && yearMatch;
      });
  
      if (matchingTvShow) {
        tvDetails = await getTvSeriesById(matchingTvShow.id);
      }
    }

    if (!tvDetails) {
        notFound();
    }
    
    // Perbaikan: Panggil fungsi getEroticMovies dan simpan hasilnya
    // ke variabel yang akan diteruskan ke komponen klien.
    const similarMedia = await getEroticMovies(1);

    return (
        <WatchClient
            mediaType={mediaType} // Gunakan variabel mediaType yang telah didefinisikan
            id={tvDetails.id}
            initialDetails={tvDetails}
            initialSimilarMedia={similarMedia} // Gunakan variabel yang benar
        />
    );
}
