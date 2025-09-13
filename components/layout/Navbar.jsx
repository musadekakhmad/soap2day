import Link from 'next/link';
import { FaVideo } from 'react-icons/fa';
import SearchBar from '../SearchBar';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <Link href="/about" className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors">
          <FaVideo className="text-2xl" />
          <span className="text-xl font-bold">Soap2day</span>
        </Link>
        <div className="flex-grow flex justify-end items-center space-x-4">
          <Link href="/" className="text-white hover:text-red-500 transition-colors font-bold">
            Home
          </Link>
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
