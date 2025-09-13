import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdsterraLayoutWrapper from '../components/AdsterraLayoutWrapper';

export const metadata = {
  title: 'Soap2day | Free HD Movies, TV Shows and Web Series',
  description: 'Soap2day is your one-stop destination for free movies, TV shows, and web series. Download thousands of titles in HD quality, with unlimited access to the latest blockbusters and trending series. ',
  openGraph: {
    title: 'Soap2day | Free HD Movies, TV Shows and Web Series',
    description: 'Soap2day is your one-stop destination for free movies, TV shows, and web series. Download thousands of titles in HD quality, with unlimited access to the latest blockbusters and trending series. Start your free entertainment journey today! ',
    url: 'https://Soap2day-us.netlify.app',
    siteName: 'Soap2day',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54783257648_f9fd991eaf_b.jpg',
        width: 1200,
        height: 630,
        alt: 'Soap2day - Free HD Movies, TV Shows and Web Series',
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
    title: 'Soap2day | Free HD Movies, TV Shows and Web Series',
    description: 'Soap2day is your one-stop destination for free movies, TV shows, and web series. Download thousands of titles in HD quality, with unlimited access to the latest blockbusters and trending series. Start your free entertainment journey today!',
    images: ['https://live.staticflickr.com/65535/54783257648_f9fd991eaf_b.jpg'],
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
              <div id="container-ce4c42ba51eddb0024dfa25613d99fda"></div>
              <Footer />
            </footer>
          </div>
        </AdsterraLayoutWrapper>
      </body>
    </html>
  );
}
