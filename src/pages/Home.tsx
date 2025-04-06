
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import GameCard from '@/components/GameCard';
import Pagination from '@/components/Pagination';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Game, APIResponse } from '@/types';
import { getGames } from '@/services/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const Home = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const filters = useAppSelector(state => state.filters);
  const isMobile = useIsMobile();
  
  // Set SEO metadata based on filters
  const getPageTitle = () => {
    if (filters.search) {
      return `Search: ${filters.search} | AayushGame Verse Explorer`;
    } else if (filters.genres.length > 0) {
      return `${filters.genres.join(', ')} Games | AayushGame Verse Explorer`;
    } else if (filters.platforms.length > 0) {
      return `Games on ${filters.platforms.join(', ')} | AayushGame Verse Explorer`;
    } else if (filters.tags.length > 0) {
      return `${filters.tags.join(', ')} Games | AayushGame Verse Explorer`;
    }
    return "AayushGame Verse Explorer | Discover Amazing Games";
  };

  const getPageDescription = () => {
    if (filters.search) {
      return `Explore games matching "${filters.search}" on AayushGame Verse Explorer. Find detailed information, ratings, and more.`;
    } else if (filters.genres.length > 0 || filters.platforms.length > 0 || filters.tags.length > 0) {
      return `Browse filtered game collection on AayushGame Verse Explorer. Find games by genre, platform, tags, and more.`;
    }
    return "Explore thousands of games with GameVerse Explorer. Filter by category, tags, release year, and more to find your next gaming adventure.";
  };
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // The API requires some parameters to show data
        const response: APIResponse<Game> = await getGames({
          ...filters,
          page_size: filters.page_size || 12,
        });
        
        if (response.results.length === 0) {
          console.log('No games found with current filters:', filters);
        } else {
          console.log(`Found ${response.results.length} games`);
        }
        
        setGames(response.results);
        
        // Calculate total pages
        const total = Math.ceil(response.count / (filters.page_size || 12));
        setTotalPages(total || 1);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
        toast.error('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [filters]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* SEO Metadata */}
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content={`games, video games, gaming, ${filters.genres.join(', ')}, ${filters.platforms.join(', ')}, ${filters.tags.join(', ')}`} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gameverse-explorer.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <link rel="canonical" href="https://gameverse-explorer.com" />
        {filters.search && <meta name="robots" content="noindex, follow" />}
      </Helmet>
      
      {/* Header Component - Contains site logo, search bar, and library/bookmark section */}
      <Header />
      
      <div className="mt-20 flex-grow">
        <Container fluid className="px-4 py-3">
          {/* Hero Section */}
          <div className="hero-section mb-4 fade-in">
            <div className="row" >
              <div className="col-md-12">
                
                <br />
                <br />
                <br />
                <br />
                {/* <h1 className="display-6 mb-3 fw-bold">Game Verse Explorer</h1> */}
                <p className="fs-5 text-secondary">
                  Discover and explore thousands of games. Filter by category, tags, release year, 
                  and more to find your next gaming adventure.
                </p>
              </div>
            </div>
          </div>
          
          <Row>
            {/* Left Sidebar (Filters Menu) - Includes filtering options */}
            <Col xs={isMobile ? 12 : 3} lg={3} className="mb-4">
              <div className="fade-in">
                <Sidebar />
              </div>
            </Col>
            
            {/* Main Content (Game Cards) - Displays a grid of game cards */}
            <Col xs={isMobile ? 12 : 9} lg={9}>
              {loading ? (
                <div className="row g-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="col-12 col-sm-6 col-lg-4">
                      <div className="game-card h-100 fade-in">
                        <div className="bg-light" style={{height: '12rem'}}></div>
                        <div className="p-4">
                          <div className="bg-light mb-2" style={{height: '1.25rem'}}></div>
                          <div className="bg-light w-50" style={{height: '0.75rem'}}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center p-4 bg-white rounded shadow-sm fade-in">
                  <p className="text-danger">{error}</p>
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.reload()}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              ) : games.length === 0 ? (
                <div className="text-center p-4 bg-white rounded shadow-sm fade-in">
                  <h3 className="h5 fw-semibold mb-2">No Games Found</h3>
                  <p className="text-muted">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <>
                  <Row className="g-4">
                    {games.map(game => (
                      <Col key={game.id} xs={12} sm={6} lg={4} className="fade-in">
                        <GameCard game={game} />
                      </Col>
                    ))}
                  </Row>
                  
                  <div className="mt-4 fade-in">
                    <Pagination totalPages={totalPages} />
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
