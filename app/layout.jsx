import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdsterraLayoutWrapper from '../components/AdsterraLayoutWrapper';

export const metadata = {
  title: 'Vegamovies: Your Hub for Free Movies, Shows & Web Series Downloads',
  description: 'Vegamovies is your ultimate destination. Enjoy unlimited access to thousands of movies, TV shows, and web series, all available for free download in excellent quality. ',
  openGraph: {
    title: 'Vegamovies: Your Hub for Free Movies, Shows & Web Series Downloads',
    description: 'Vegamovies is your ultimate destination. Enjoy unlimited access to thousands of movies, TV shows, and web series, all available for free download in excellent quality. ',
    url: 'https://vegamovies.netlify.app/',
    siteName: 'Himovies',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54777580906_77cfe0ccdf_b.jpg',
        width: 1200,
        height: 630,
        alt: 'Vegamovies - Your Hub for Free Movies, Shows & Web Series Downloads',
      },
    ],
    locale: 'id_ID',
    type: 'website',
    // Properti yang diperlukan untuk Facebook Debugger
    appId: '100074345305108',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WatchStream123',
    creator: '@WatchStream123',
    title: 'Vegamovies: Your Hub for Free Movies, Shows & Web Series Downloads',
    description: 'Vegamovies is your ultimate destination. Enjoy unlimited access to thousands of movies, TV shows, and web series, all available for free download in excellent quality. ',
    images: ['https://live.staticflickr.com/65535/54777580906_77cfe0ccdf_b.jpg'],
  },
  // Tambahkan tag meta eksplisit untuk Facebook
  other: {
    'fb:app_id': '100074345305108',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AdsterraLayoutWrapper>
          <div className="flex flex-col min-h-screen bg-slate-900">
            <header className="w-full max-w-7xl mx-auto px-4 py-4 sticky top-0 z-50 bg-slate-900 shadow-lg">
              <Navbar />
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 mt-2">
              {children}
            </main>
            <footer className="w-full max-w-7xl mx-auto px-4 py-8">
              {/* Tempatkan div Native Banner di sini, sebelum Footer */}
              <div id="container-f164b40cd7c6863996c9ec4da638c7c6"></div>
              <Footer />
            </footer>
          </div>
        </AdsterraLayoutWrapper>
      </body>
    </html>
  );
}
