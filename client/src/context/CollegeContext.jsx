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
      // campus-portal.vercel.app -> parts.length = 3 (Subdomain = campus-portal) -> PROBLEM!
      
      let slug = null;

      if (hostname.includes('localhost')) {
        if (parts.length === 2) slug = parts[0];
      } else {
        // Production Logic
        // If we are on a custom domain like "campus.com", subdomains are 3 parts.
        // If we are on "vercel.app", we might want to ignore the subdomain check OR 
        // explicitly check if the subdomain is NOT our main app name.
        
        // For now, let's assume if it's a Vercel URL, we are NOT using subdomains yet 
        // unless the user has configured a custom domain.
        // Or we can just check if parts > 2.
        
        if (parts.length > 2) {
           // Exclude 'www' and potentially your main Vercel app name if you want
           // But for a real custom domain setup, this is correct.
           // The issue is likely that your Vercel URL `project.vercel.app` has 3 parts.
           // So it thinks `project` is the college slug.
           
           // Quick fix: If the domain ends in 'vercel.app', ignore subdomain logic 
           // UNLESS you really want to test subdomains on Vercel (which requires wildcard setup).
           if (!hostname.includes('vercel.app')) {
              slug = parts[0];
           }
        }
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
