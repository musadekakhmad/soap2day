import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaUserCircle, FaStar, FaInfoCircle } from 'react-icons/fa';
import {
  getTvSeriesById,
  getTvSeriesVideos,
  getTvSeriesCredits,
  getTvSeriesReviews,
  searchMoviesAndTv,
  getSimilarTvSeries,
} from '../../../lib/api';

// Utility function to create a slug from a TV show title
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

// Generate metadata function for SEO and OG tags
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  let tvShowData = null;
  const id = parseInt(slug, 10);

  const slugParts = slug.split('-');
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
  const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;

  if (!isNaN(id) && slugParts.length === 1) {
    tvShowData = await getTvSeriesById(id);
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
      tvShowData = await getTvSeriesById(matchingTvShow.id);
    }
  }

  if (!tvShowData) {
    return {
      title: 'Page Not Found',
      description: 'The TV series page you are looking for could not be found.'
    };
  }

  const tvShowTitle = tvShowData.name || 'Untitled TV Series';
  const tvShowDescription = tvShowData.overview || 'Synopsis not available.';
  
  const tvShowImageUrl = tvShowData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tvShowData.backdrop_path}` : tvShowData.poster_path ? `https://image.tmdb.org/t/p/w1280${tvShowData.poster_path}` : '';
  
  const tvShowUrl = `https://soap2day-us.netlify.app/tv-show/${slug}`;

  return {
    title: `${tvShowTitle} | Soap2day`,
    description: tvShowDescription,
    alternates: {
      canonical: tvShowUrl,
    },
    openGraph: {
      title: `${tvShowTitle} | Soap2day`,
      description: tvShowDescription,
      url: tvShowUrl,
      type: 'website',
      images: [
        {
          url: tvShowImageUrl,
          alt: tvShowTitle,
        },
      ],
      siteName: 'Soap2day',
    },
  };
}


export default async function TvShowPage({ params }) {
  const { slug } = await params;

  let tvShowData = null;
  const id = parseInt(slug, 10);

  // Separate the slug into title and year, if a year exists
  const slugParts = slug.split('-');
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
  const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;

  // Check if the slug is a numeric ID
  if (!isNaN(id) && slugParts.length === 1) {
    tvShowData = await getTvSeriesById(id);
  } else {
    // Search for the TV series based on the title part of the slug
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
      tvShowData = await getTvSeriesById(matchingTvShow.id);
    }
  }

  if (!tvShowData) {
    notFound();
  }

  const [videos, credits, reviews, similarTvShows] = await Promise.all([
    getTvSeriesVideos(tvShowData.id),
    getTvSeriesCredits(tvShowData.id),
    getTvSeriesReviews(tvShowData.id),
    getSimilarTvSeries(tvShowData.id),
  ]);

  const backdropUrl = tvShowData.backdrop_path ? `https://image.tmdb.org/t/p/original${tvShowData.backdrop_path}` : tvShowData.poster_path ? `https://image.tmdb.org/t/p/original${tvShowData.poster_path}` : null;
  const posterUrl = tvShowData.poster_path ? `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}` : null;

  const trailer = videos && videos.length > 0 ? videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') : null;
  const cast = credits.cast.slice(0, 10);
  const crew = credits.crew.filter(member => ['Director', 'Writer', 'Screenplay'].includes(member.job)).slice(0, 5);
  const userReviews = reviews ? reviews.slice(0, 5) : [];
  const seasons = tvShowData.seasons;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-8">
      {/* Backdrop Section */}
      {backdropUrl && (
        <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
          <Image
            src={backdropUrl}
            alt={`${tvShowData.name} backdrop`}
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full object-cover rounded-lg shadow-xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      )}

      <div className="p-4 sm:p-8 md:p-12 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          {/* Poster Section */}
          <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
            <Image
              src={posterUrl || `https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available`}
              alt={tvShowData.name}
              width={500}
              height={750}
              className="w-full h-auto rounded-lg shadow-xl"
              priority
              unoptimized={!posterUrl}
            />
          </div>

          {/* Details Section */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">
              {tvShowData.name}
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-4 italic">
              {tvShowData.tagline}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                <FaStar className="text-yellow-400 mr-1" />
                {tvShowData.vote_average.toFixed(1)} / 10
              </span>
              <span className="text-gray-400 text-sm">
                {tvShowData.number_of_seasons} seasons
              </span>
              <span className="text-gray-400 text-sm">
                {tvShowData.first_air_date?.substring(0, 4)}
              </span>
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-2">Synopsis</h2>
            <p className="text-gray-300 text-justify mb-6">
              {tvShowData.overview || 'Synopsis not available.'}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
              <div>
                <p>
                  <strong>Genre:</strong>{' '}
                  {tvShowData.genres?.map((genre) => genre.name).join(', ')}
                </p>
                <p>
                  <strong>Status:</strong> {tvShowData.status}
                </p>
              </div>
              <div>
                <p>
                  <strong>Created by:</strong>{' '}
                  {tvShowData.created_by?.map((creator) => creator.name).join(', ') || 'N/A'}
                </p>
                <p>
                  <strong>Website:</strong> <a href={tvShowData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{tvShowData.homepage}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 md:p-12">
        {/* Crew Section */}
        {crew.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Key Crew</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {crew.map((member) => (
                <div key={member.credit_id} className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-gray-600">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FaUserCircle className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{member.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{member.job}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasons Section */}
        {seasons && seasons.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Seasons</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {seasons.sort((a,b) => a.season_number - b.season_number).map(season => (
                <div key={season.id} className="flex-shrink-0 w-32 md:w-48 text-center">
                  <div className="w-32 md:w-48 h-auto rounded-lg overflow-hidden mb-2 shadow-lg">
                    {season.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                        alt={`Poster ${season.name}`}
                        width={200}
                        height={300}
                        className="w-full h-full object-cover"
                        unoptimized={!season.poster_path}
                      />
                    ) : (
                      <div className="w-full h-48 md:h-64 bg-gray-700 flex items-center justify-center rounded-lg">
                        <FaInfoCircle className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-white truncate">{season.name}</p>
                  <p className="text-[10px] md:text-xs text-gray-400">{season.episode_count} episodes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cast Section */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Main Cast</h2>
          {cast.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {cast.map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-600">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FaUserCircle className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Cast information not available.</p>
          )}
        </div>

        {/* Trailer Section */}
        {trailer && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Trailer</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full aspect-video rounded-xl shadow-lg"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">User Reviews</h2>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-white">{review.author}</p>
                  <p className="text-sm text-gray-300 mt-1 text-justify">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No reviews for this TV show yet.</p>
          )}
        </div>

        {/* Similar TV Shows Section */}
        {similarTvShows && similarTvShows.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Similar TV Shows</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {similarTvShows.slice(0, 10).map(item => {
                const itemSlug = createSlug(item);
                const itemUrl = `/tv-show/${itemSlug}`;

                const getImageUrl = (path) => {
                  if (path) {
                    return `https://image.tmdb.org/t/p/w500${path}`;
                  }
                  return 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available';
                };

                return (
                  <a key={item.id} href={itemUrl} className="flex-shrink-0 w-32 md:w-48 text-center group">
                    <div className="relative w-full h-auto rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-lg">
                      <Image
                        src={getImageUrl(item.poster_path)}
                        alt={item.name}
                        width={200}
                        height={300}
                        className="w-full h-auto object-cover rounded-lg"
                        unoptimized={!item.poster_path}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-xs md:text-sm font-semibold text-white truncate mb-1">
                          {item.name}
                        </h3>
                        {item.first_air_date && (
                          <span className="text-[10px] md:text-xs text-gray-400">
                            ({item.first_air_date.substring(0, 4)})
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
		
		{/* Bottom Stream Button */}
        <div className="mt-12 text-center">
             <a href={`/tv-show/${slug}/stream`}>
              <button className="bg-blue-600 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg">
                🎬 Stream Now
              </button>
            </a>
        </div>
      </div>
    </div>
  );
}