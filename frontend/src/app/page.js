'use client'; // This ensures the component runs on the client-side

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in (by checking cookies)
    const isLoggedIn = document.cookie.includes('isLoggedIn=true');
    
    // If not logged in, redirect to the login page
    if (!isLoggedIn) {
      router.push('/login');
    }
    else{
      router.push('/home')
    }
  }, [router]); // Empty dependency array ensures the check happens only once

  return null; // Nothing will be rendered since we're just redirecting
}
