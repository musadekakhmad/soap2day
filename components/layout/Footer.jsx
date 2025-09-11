// components/layout/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-gray-400 py-6 text-center rounded-lg shadow-xl">
      <div className="container mx-auto px-4">
        <p>&copy; {year} Vegamovies. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Powered by{' '}
          <a
            href="https://www.themoviedb.org/"
            className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            TMDB API
          </a>{' '}
          & Next.js{' '}
          <a
            href="https://Vegamovies-us.netlify.app/"
            className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vegamovies
          </a>
        </p>
      </div>
    </footer>
  );
}