import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CollegeContext = createContext();

export const useCollege = () => useContext(CollegeContext);

export const CollegeProvider = ({ children }) => {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    const checkSubdomain = async () => {
      const hostname = window.location.hostname; // e.g., "tech.localhost" or "localhost"
      const parts = hostname.split('.');

      // Logic: 
      // localhost -> parts.length = 1 (No subdomain)
      // tech.localhost -> parts.length = 2 (Subdomain = tech)
      // my.campus.com -> parts.length = 3 (Subdomain = my)
      
      // For local dev (localhost), we expect 2 parts for a subdomain.
      // For production (domain.com), we expect 3 parts.
      
      let slug = null;

      if (hostname.includes('localhost') && parts.length === 2) {
        slug = parts[0];
      } else if (!hostname.includes('localhost') && parts.length === 3) {
        slug = parts[0];
      }

      if (slug && slug !== 'www') {
        setIsSubdomain(true);
        try {
          // Using 127.0.0.1 to avoid some browser/extension blocking issues with 'localhost'
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/colleges/slug/${slug}`);
          setCollege(res.data);
        } catch (err) {
          console.error('Failed to load college from subdomain', err);
        }
      }
      
      setLoading(false);
    };

    checkSubdomain();
  }, []);

  return (
    <CollegeContext.Provider value={{ college, loading, isSubdomain }}>
      {children}
    </CollegeContext.Provider>
  );
};
