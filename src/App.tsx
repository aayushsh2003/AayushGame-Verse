
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { ClerkProvider } from '@clerk/clerk-react';
import { store } from './store';
import Home from "./pages/Home";
import GameDetail from "./pages/GameDetail";
import Library from "./pages/Library";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";
import Footer from "./components/Footer";

// Get API keys from env variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// Check for required API keys
if (!RAWG_API_KEY) {
  console.warn("Warning: VITE_RAWG_API_KEY is not set in environment variables");
}

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Warning: VITE_CLERK_PUBLISHABLE_KEY is not set in environment variables");
}

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Set default document title
  useEffect(() => {
    document.title = "AayushGame Verse Explorer | Discover Amazing Games";
  }, []);

  return (
    <Provider store={store}>
      <ClerkProvider 
        publishableKey={CLERK_PUBLISHABLE_KEY}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/library"
        signUpFallbackRedirectUrl="/"
        afterSignOutUrl="/"
      >
        <QueryClientProvider client={queryClient}>
          <Helmet>
            <meta name="description" content="Explore thousands of games with GameVerse Explorer. Filter by category, tags, release year, and more." />
            <meta name="keywords" content="games, video games, gaming, game library, RAWG, game database" />
            <meta property="og:title" content="AayushGame Verse Explorer | Discover Amazing Games" />
            <meta property="og:description" content="Explore thousands of games with GameVerse Explorer. Filter by category, tags, release year, and more." />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="AayushGame Verse Explorer | Discover Amazing Games" />
            <meta name="twitter:description" content="Explore thousands of games with GameVerse Explorer. Filter by category, tags, release year, and more." />
          </Helmet>
          <Toaster position="top-right" richColors />
          <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GameDetail />} />
                <Route path="/library" element={<Library />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </ClerkProvider>
    </Provider>
  );
};

export default App;
