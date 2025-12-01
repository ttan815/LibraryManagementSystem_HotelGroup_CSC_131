import React from 'react';
import '../pages/style.css'
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = ({ onNavigate }) => {
  const socialPlatforms = [
    { name: 'GitHub', url: 'https://github.com/ttan815/LibraryManagementSystem_HotelGroup_CSC_131', icon: <FaGithub />, color: '#333' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/lms-hotel-group-46948939b/', icon: <FaLinkedin />, color: '#0077b5' },
    { name: 'X', url: 'https://x.com/LCsc13135400', icon: <FaXTwitter />, color: '#000000' },
    { name: 'Facebook', url: 'https://www.facebook.com/LMSHotelGroupCSC131/', icon: <FaFacebook />, color: '#1877f2' },
    { name: 'Instagram', url: 'https://www.instagram.com/hotel_lms_131/?igsh=NTc4MTIwNjQ2YQ%3D%3D#', icon: <FaInstagram />, color: '#e1306c' },
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social Media Icons */}
        <div className="social-links">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.name}
              className="social-icon"
              onClick={() => handleSocialClick(platform.url)}
              aria-label={`Visit our ${platform.name}`}
              title={`Follow us on ${platform.name}`}
              style={{ '--hover-color': platform.color }}
            >
              {platform.icon}
            </button>
          ))}
        </div>

        {/* Footer Text and Links */}
        <div className="footer-info">
          <p>&copy; 2024 Library Management System. Team Hotel.</p>
          <div className="footer-links">
            <button 
              className="footer-link-btn"
              onClick={() => handleNavigation('about')}
            >
              About
            </button>
            <button 
              className="footer-link-btn"
              onClick={() => handleNavigation('contact')}
            >
              Contact
            </button>
            <button 
              className="footer-link-btn"
              onClick={() => handleNavigation('credits')}
            >
              Credits
            </button>
            <button 
              className="footer-link-btn"
              onClick={() => handleNavigation('privacy')}
            >
              Privacy
            </button>
            <button 
              className="footer-link-btn"
              onClick={() => handleNavigation('terms')}
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;