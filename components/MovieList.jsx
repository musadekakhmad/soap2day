import { FaStar } from 'react-icons/fa';

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p className="text-center text-gray-400">No Movies or TV Series Found.</p>;
  }

  const getImageUrl = (path) => {
    if (path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    }
    return 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Tidak+Tersedia';
  };

  const createSlug = (item) => {
    const title = item.title || item.name;
    if (!title) return '';
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();

    let year = '';
    if (item.media_type === 'movie' && item.release_date) {
      year = item.release_date.substring(0, 4);
    } else if (item.media_type === 'tv' && item.first_air_date) {
      year = item.first_air_date.substring(0, 4);
    }

    return year ? `${baseSlug}-${year}` : baseSlug;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((item) => {
        const itemSlug = createSlug(item);
        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
        const altText = `Poster untuk ${mediaType === 'tv' ? 'serial TV' : 'film'} ${item.title || item.name}`;
        const href = `/${mediaType === 'tv' ? 'tv-show' : 'movie'}/${itemSlug}`;

        // Tambahkan pemeriksaan keamanan untuk vote_average
        const voteAverage = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

        return (
          <a key={item.id} href={href}>
            <div className="relative group w-full h-auto rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-xl">
              <img
                src={getImageUrl(item.poster_path)}
                alt={altText}
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-sm font-semibold text-white truncate mb-1">
                  {item.title || item.name}
                  {item.release_date && (<span className="text-xs text-gray-400 ml-1">({item.release_date.substring(0, 4)})</span>)}
                  {item.first_air_date && (<span className="text-xs text-gray-400 ml-1">({item.first_air_date.substring(0, 4)})</span>)}
                </h3>
                <p className="text-xs text-gray-300">
                  <span className="inline-block text-yellow-400 mr-1"><FaStar /></span>
                  {voteAverage}
                </p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
