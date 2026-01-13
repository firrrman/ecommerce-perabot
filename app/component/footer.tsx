export default function Footer() {
  return (
    <footer className="w-full bg-white p-5">
      <p className="text-center mt-5">
        Menyediakan perabot rumah berkualitas dengan desain modern dan harga
        terjangkau.
      </p>
      <div className=" mx-auto py-10 flex justify-center gap-20 flex-wrap">
        {/* Navigasi */}
        <div>
          <h3 className="font-medium mb-3">Menu</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-black">
                Beranda
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Produk
              </a>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="font-medium mb-3">Hubungi Kami</h3>
          <p className="text-sm">
            WhatsApp: 085810542529
            <br />
            Email: perabotan1174@gmail.com
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t text-center py-4 text-sm">
        © {new Date().getFullYear()} Perabotan All rights reserved.
      </div>
    </footer>
  );
}
