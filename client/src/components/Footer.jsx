import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Information */}
          <div>
            <h2 className="text-2xl font-bold mb-4">HiBuy</h2>
            <p className="mb-4">
              We provide quality products to help you achieve your goals. 
              Explore our collections and enjoy the best shopping experience.
            </p>
            <p>© 2024 HiBuy. All rights reserved.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/collections" className="text-gray-400 hover:text-white">Collections</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: HiBuy@gmail.com</p>
            <p className="text-gray-400">Phone: +1 (234) 567-890</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center mt-8">
          <a href="https://facebook.com" className="mx-2 text-gray-400 hover:text-white">
            <FaFacebookF size={20} />
          </a>
          <a href="https://twitter.com" className="mx-2 text-gray-400 hover:text-white">
            <FaTwitter size={20} />
          </a>
          <a href="https://instagram.com" className="mx-2 text-gray-400 hover:text-white">
            <FaInstagram size={20} />
          </a>
          <a href="https://linkedin.com" className="mx-2 text-gray-400 hover:text-white">
            <FaLinkedinIn size={20} />
          </a>
        </div>

        {/* Copyright Statement */}
        <div className="mt-10 text-center">
          <p className="text-gray-400">
            © 2024 Your Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
