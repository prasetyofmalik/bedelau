import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">BPS Kabupaten Siak</h3>
            <p className="text-sm">
              Kompleks Perkantoran Sungai Betung, Siak Sri Indrapura
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: bps1405@bps.go.id</li>
              <li>Telepon: (021) xxx-xxxx</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Portal BPS</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Pelayanan Statistik Terpadu</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Reformasi Birokrasi</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 SAMS - Sistem Aplikasi Manajemen Siak. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};