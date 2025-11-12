import React from 'react';
import '../components/Footer.css';
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Twitter → X logo

const Footer = () => {
  const socialPlatforms = [
    { name: 'GitHub', url: 'https://github.com', icon: <FaGithub />, color: '#333' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: <FaLinkedin />, color: '#0077b5' },
    { name: 'X', url: 'https://x.com', icon: <FaXTwitter />, color: '#000000' },
    { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebook />, color: '#1877f2' },
    { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram />, color: '#e1306c' },
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
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
              style={{ '--hover-color': platform.color }} // dynamic hover color
            >
              {platform.icon}
            </button>
          ))}
        </div>

        {/* Footer Text and Links */}
        <div className="footer-info">
          <p>&copy; 2024 Library Management System. Team Hotel.</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
