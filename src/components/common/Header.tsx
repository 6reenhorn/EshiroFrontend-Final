import React from "react";

interface HeaderProps {
  isVisible: boolean;
}

const HEADER_CLASS =
  "absolute top-0 left-0 w-full h-16 z-20 flex items-center text-primary-foreground bg-gradient-to-r from-black via-gray-900 to-gray-700";

const Header: React.FC<HeaderProps> = ({ isVisible }) => {
  return (
    <div
      className={`${HEADER_CLASS} ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      {/* Add any additional content or children here if needed */}
    </div>
  );
};

export default Header;