import React, { useRef, useState } from 'react';

const Navbar = (props) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuref = useRef(null);
  const handlelogout = () => {
    localStorage.removeItem("token");
    props.setIsAuth(false);
    window.location.reload();
  }

  return (
    <nav className=" h-[7.5vh] bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-950 text-white shadow-xl px-8 py-5 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold tracking-wide cursor-pointer hover:scale-105 transition-transform">
        <span className="text-emerald-400">&lt;</span>
        Pass
        <span className="text-emerald-400">OP/&gt;</span>
      </h1>

      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white focus:outline-none z-20"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>




      <ul ref={menuref} className={`flex flex-col md:flex-row  md:space-x-7 text-lg font-medium absolute md:relative 
       md:top-0 top-[7.5vh] space-y-3 md:space-y-0  left-0 w-full md:w-auto p-4 md:p-0 transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'transform translate-y-0 opacity-100 z-10' : 'transform -translate-y-full md:translate-y-0 opacity-0 md:opacity-100'}
          bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-950 md:bg-none
          shadow-lg md:shadow-none`}>

        <li><a href="#home" className="hover:text-emerald-300 border-b-2 border-transparent hover:border-emerald-300 transition-colors duration-300">Home</a></li>

        <li>  <button
          onClick={() => {
            handlelogout()
          }}
className="
  relative inline-flex items-center gap-2
  px-4 py-2
  text-sm font-semibold
  text-emerald-200
  border border-emerald-400/40
  rounded-full
  hover:bg-emerald-400/10
  hover:border-emerald-300
  active:scale-95
  transition-all duration-200
  focus:outline-none
  focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-900
"
        >
          Logout
        </button>
      </li>

        <li onClick={() => props.settheme(!props.theme)} className="hover:text-emerald-300 border-b-2 border-transparent hover:border-emerald-300 transition-colors duration-300">
          <img className='invert' width={27} height={27} src={props.theme ? "./icon/moon.png" : "./icon/daylight.png"} alt="" />
        </li>
        <li><a href="https://github.com/Omprapandeep" target="_blank" rel="noopener noreferrer" className=" hover:text-emerald-300 border-b-2 border-transparent hover:border-emerald-300 transition-colors duration-300"><img className='invert' width={30} height={30} src="./icon/github.svg" alt="" /></a></li>
      </ul>
    </nav>


  );
};

export default Navbar;
