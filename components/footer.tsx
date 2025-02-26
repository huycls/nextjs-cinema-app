import { Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const footerLinks = [
    ['Audio Description', 'Investor Relations', 'Legal Notices'],
    ['Help Center', 'Jobs', 'Cookie Preferences'],
    ['Gift Cards', 'Terms of Use', 'Corporate Information'],
    ['Media Center', 'Privacy', 'Contact Us']
  ];

  return (
    <footer className="bg-background py-16">
      <div className="container mx-auto px-4">
        {/* Social Links */}
        <div className="flex space-x-6 mb-8">
          <a href="#" className="hover:text-gray-300">
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <Instagram className="h-6 w-6" />
          </a>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((column, i) => (
            <div key={i} className="space-y-4">
              {column.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-gray-400 hover:text-gray-300"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Service Code */}
        <button className="mt-8 border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white">
          Service Code
        </button>

        {/* Copyright */}
        <p className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} CONFLIX Clone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}