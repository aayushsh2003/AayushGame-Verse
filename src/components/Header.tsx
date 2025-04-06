
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSearch } from '@/store/slices/filtersSlice';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Search, Bookmark, Menu, X, Library, Home as HomeIcon } from 'lucide-react';
import { Container, Navbar, Form, InputGroup, Button, Offcanvas, Badge } from 'react-bootstrap';
import { useAppSelector } from '@/hooks/useAppSelector';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isSignedIn, user } = useUser();
  const favorites = useAppSelector(state => state.favorites.favorites);
  
  // Get current filter search term
  const currentSearch = useAppSelector(state => state.filters.search);
  
  // Reset search term when navigating away from home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setSearchTerm('');
    } else {
      // Set search input to current filter value when on home page
      setSearchTerm(currentSearch);
    }
  }, [location.pathname, currentSearch]);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(searchTerm));
    navigate('/');
    setShowMobileSearch(false);
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        fixed="top"
        className={`navbar-gaming py-2 ${isScrolled ? 'shadow' : ''}`}
      >
        <Container fluid className="px-4">
          {/* Site Logo */}
          <img src='/AayushGame Verse.png' alt="Gaming Logo" className="logo" />
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {/* <img src='../../public/AayushGame Verse.png' alt="Gaming Logo" className="logo" /> */}
            <span className="text-primary fw-bold fs-4">AayushGame Verse</span>
            <span className="ms-1 text-secondary fw-light">Explorer</span>
          </Navbar.Brand>
          
          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Desktop Search Bar */}
            <Form onSubmit={handleSearch} className="d-none d-md-flex position-relative" style={{ width: '16rem' }}>
              <InputGroup>
                <Form.Control
                  placeholder="Search games..."
                  className="border border-light-subtle bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search for games"
                />
                <Button 
                  variant="outline-secondary"
                  type="submit"
                  className="border border-light-subtle bg-white"
                  aria-label="Submit search"
                >
                  <Search className="small" style={{ width: '1rem', height: '1rem' }} />
                </Button>
              </InputGroup>
            </Form>
            
            {/* Mobile Search Toggle */}
            <Button
              variant="outline-secondary"
              className="d-md-none border-0 bg-transparent"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Toggle search"
            >
              <Search className="small" style={{ width: '1.2rem', height: '1.2rem' }} />
            </Button>
            
            {/* Library/Bookmark Section */}
            <Link to={isSignedIn ? "/library" : "/sign-in"} className="position-relative">
              <Button
                variant="outline-primary"
                className="bg-transparent border border-primary"
                aria-label="Your game library"
              >
                <Bookmark className="small me-2" style={{ width: '1rem', height: '1rem' }} />
                <span className="d-none d-sm-inline">My Library</span>
                {isSignedIn && favorites.length > 0 && (
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 end-0 translate-middle d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: '1.25rem', height: '1.25rem', fontSize: '0.65rem' }}
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Auth Buttons */}
            <div>
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="primary"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="outline-secondary"
              className="d-md-none border-0 bg-transparent"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="small" style={{ width: '1.2rem', height: '1.2rem' }} />
            </Button>
          </div>
        </Container>
      </Navbar>
      
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div 
          className="position-fixed top-0 start-0 end-0 z-3 bg-white px-4 py-3 shadow d-md-none fade-in"
          style={{ marginTop: '56px' }}
        >
          <Form onSubmit={handleSearch} className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn text-dark p-2"
              onClick={() => setShowMobileSearch(false)}
              aria-label="Close search"
            >
              <X className="small" style={{ width: '1.2rem', height: '1.2rem' }} />
            </button>
            <InputGroup className="flex-grow-1">
              <Form.Control
                ref={searchInputRef}
                placeholder="Search games..."
                className="border border-light-subtle bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for games"
              />
              <Button 
                variant="outline-secondary"
                type="submit"
                className="border border-light-subtle bg-white"
                aria-label="Submit search"
              >
                <Search className="small" style={{ width: '1rem', height: '1rem' }} />
              </Button>
            </InputGroup>
          </Form>
        </div>
      )}
      
      {/* Mobile Menu Offcanvas */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>GameVerse Explorer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column gap-4">
            <Link 
              to="/" 
              className="text-decoration-none fs-5 fw-medium text-dark d-flex align-items-center gap-2"
              onClick={() => setShowMobileMenu(false)}
            >
              <HomeIcon className="small" style={{ width: '1rem', height: '1rem' }} />
              Home
            </Link>
            <Link 
              to={isSignedIn ? "/library" : "/sign-in"} 
              className="text-decoration-none fs-5 fw-medium text-dark d-flex align-items-center gap-2"
              onClick={() => setShowMobileMenu(false)}
            >
              <Library className="small" style={{ width: '1rem', height: '1rem' }} />
              My Library 
              {isSignedIn && favorites.length > 0 && 
                <span className="badge rounded-pill bg-primary">{favorites.length}</span>
              }
            </Link>
            {!isSignedIn && (
              <div className="mt-4">
                <SignInButton mode="modal">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
