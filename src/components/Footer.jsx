import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700  w-full">
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row items-center justify-between">

        <p className="text-sm">
          © {year} created by Om . All rights reserved.
        </p>

        <div className="flex space-x-6 mt-3 md:mt-0 justify-center md:justify-end">
          <a
            href="#"
            className="text-sm hover:underline hover:text-white transition" >
            About
          </a>
          <a
            href="#"
            className="text-sm hover:underline hover:text-white transition"
          >
            Contact
          </a>
          <a
            href="#"
            className="text-sm hover:underline hover:text-white transition"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
