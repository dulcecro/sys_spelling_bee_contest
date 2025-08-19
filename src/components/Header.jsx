import React from "react";
import logoRight from "../assets/insignia.png";
import logoLeft from "../assets/logo_sbee.png";

const Header = () => {
  return (
    <header className="w-full bg-blue-300 h-14 flex justify-between items-center px-6 fixed top-0 left-0 z-50">
      {/* Logo izquierdo */}
      <img src={logoLeft} alt="Logo Izquierdo" className="h-10 w-auto" />

      {/* Logo derecho */}
      <img src={logoRight} alt="Logo Derecho" className="h-10 w-auto" />
    </header>
  );
};

export default Header;