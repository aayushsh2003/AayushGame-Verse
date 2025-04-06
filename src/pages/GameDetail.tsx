
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import { Star, ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Calendar, Clock, Award, Tag, Cpu } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedElement from '@/components/AnimatedElement';
import { getGameById, getGameScreenshots } from '@/services/api';
import { Game } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [screenshots, setScreenshots] = useState<{ results: { id: number; image: string }[] }>({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  const { isSignedIn, user } = useUser();
  
  // Check if game is in favorites
  const isFavorite = favorites.some(fav => fav.id === Number(id));

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch game details and screenshots in parallel
        const [gameData, screenshotsData] = await Promise.all([
          getGameById(parseInt(id)),
          getGameScreenshots(parseInt(id)),
        ]);
        
        setGame(gameData);
        setScreenshots(screenshotsData);
        
        // Set document title for SEO with game name
        document.title = `${gameData.name} | GameVerse Explorer`;
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError('Failed to load game details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGameDetails();
    
    // Reset title when component unmounts
    return () => {
      document.title = 'GameVerse Explorer | Discover Amazing Games';
    }
  }, [id]);
  
  // Format release date
  const formatReleaseDate = (dateString?: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!game) return;
    
    if (!isSignedIn) {
      toast.error("Please sign in to add games to your library");
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFavorite(game.id));
      toast.success(`${game.name} removed from your library`);
    } else {
      dispatch(addFavorite({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        added: new Date().toISOString(),
        rating: game.rating,
        released: game.released
      }));
      toast.success(`${game.name} added to your library`);
    }
  };

  // Find PC platform requirements if available
  const getPCRequirements = () => {
    if (!game || !game.platforms) return null;
    
    const pcPlatform = game.platforms.find(p => p.platform.slug === "pc");
    return pcPlatform?.requirements;
  };

  const pcRequirements = getPCRequirements();
  
  // Calculate rating color based on score
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'info';
    if (rating >= 2) return 'warning';
    return 'danger';
  };
  
  // Calculate metacritic color based on score
  const getMetacriticColor = (score?: number) => {
    if (!score) return '';
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Add SEO-specific meta tags for this game page */}
      {game && (
        <Helmet>
          <title>{game.name} | AayushGame Verse Explorer</title>
          <meta name="description" content={game.description_raw ? game.description_raw.substring(0, 160) : `Explore details about ${game.name} on GameVerse Explorer`} />
          <meta name="keywords" content={`${game.name}, video game, ${game.genres?.map(genre => genre.name).join(', ')}, RAWG, game details`} />
          <meta property="og:title" content={`${game.name} | GameVerse Explorer`} />
          <meta property="og:description" content={game.description_raw ? game.description_raw.substring(0, 160) : `Explore details about ${game.name} on GameVerse Explorer`} />
          <meta property="og:image" content={game.background_image} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://gameverse-explorer.com/game/${game.id}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${game.name} | GameVerse Explorer`} />
          <meta name="twitter:description" content={game.description_raw ? game.description_raw.substring(0, 160) : `Explore details about ${game.name} on GameVerse Explorer`} />
          <meta name="twitter:image" content={game.background_image} />
          <link rel="canonical" href={`https://gameverse-explorer.com/game/${game.id}`} />
        </Helmet>
      )}
      
      <Header />
      
      <div className="mt-5 flex-grow">
        <Container className="py-4">
          {loading ? (
            <div className="p-4">
              <div className="placeholder-glow">
                <div className="placeholder col-12 mb-3" style={{ height: "2rem" }}></div>
                <div className="placeholder col-12 mb-4" style={{ height: "20rem" }}></div>
                <div className="placeholder col-6 mb-2"></div>
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-7 mb-2"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-5">
              <p className="text-danger">{error}</p>
              <Button 
                variant="primary"
                onClick={handleBack}
                className="mt-3"
              >
                Go Back
              </Button>
            </div>
          ) : game ? (
            <AnimatedElement animation="fade-in" className="mb-5">
              {/* Back Button and Game Title */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <div>
                  <Button 
                    variant="link" 
                    onClick={handleBack} 
                    className="text-secondary mb-2 p-0 d-flex align-items-center"
                  >
                    <ArrowLeft size={18} className="me-1" />
                    Back to Games
                  </Button>
                  <h1 className="display-5 fw-bold">{game.name}</h1>
                </div>
                
                <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
                  {game.metacritic && (
                    <span className={`px-3 py-1 rounded-2 fw-medium fs-5 border border-${getMetacriticColor(game.metacritic)} text-${getMetacriticColor(game.metacritic)}`}>
                      {game.metacritic}
                    </span>
                  )}
                  
                  <Button 
                    variant={isFavorite ? "primary" : "outline-secondary"} 
                    onClick={handleFavoriteToggle}
                    className="rounded-circle p-2"
                    aria-label={isFavorite ? "Remove from library" : "Add to library"}
                  >
                    {isFavorite ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                  </Button>
                </div>
              </div>
              
              {/* Main Content */}
              <Row className="mb-4 gy-4">
                {/* Left Column - Game Media and Info */}
                <Col lg={8}>
                  <AnimatedElement animation="slide-in" className="mb-4">
                    {/* Main Screenshot */}
                    <Card className="shadow rounded-3 overflow-hidden border-0 mb-4">
                      <div className="position-relative" style={{ height: "400px" }}>
                        {screenshots.results.length > 0 ? (
                          <img
                            src={screenshots.results[activeScreenshotIndex]?.image || game.background_image}
                            alt={`${game.name} screenshot`}
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <img
                            src={game.background_image || "/placeholder.svg"}
                            alt={game.name}
                            className="w-100 h-100 object-fit-cover"
                          />
                        )}
                      </div>
                    </Card>
                  
                    {/* Thumbnail Gallery */}
                    {screenshots.results.length > 1 && (
                      <div className="d-flex gap-2 pb-3 overflow-auto">
                        {screenshots.results.slice(0, 5).map((screenshot, index) => (
                          <Button
                            key={screenshot.id}
                            variant="outline-light"
                            onClick={() => setActiveScreenshotIndex(index)}
                            className={`p-1 rounded-2 border-2 ${activeScreenshotIndex === index ? 'border-primary' : 'border-secondary'}`}
                            style={{ minWidth: "120px" }}
                          >
                            <img
                              src={screenshot.image}
                              alt={`${game.name} thumbnail ${index + 1}`}
                              className="img-fluid rounded-2"
                              style={{ height: "70px", objectFit: "cover", width: "100%" }}
                            />
                          </Button>
                        ))}
                      </div>
                    )}
                  </AnimatedElement>
                  
                  {/* Game Description */}
                  <Card className="shadow-sm rounded-3 mb-4">
                    <Card.Body className="p-4">
                      <h2 className="fs-3 mb-3">About {game.name}</h2>
                      <div className="text-secondary lh-lg">
                        <p className="mb-0 white-space-pre-line">{game.description_raw}</p>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  {/* System Requirements Section */}
                  {pcRequirements && (pcRequirements.minimum || pcRequirements.recommended) && (
                    <Card className="shadow-sm rounded-3 mb-4">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center gap-2 mb-4">
                          <Cpu className="text-primary" size={20} />
                          <h2 className="fs-4 mb-0">System Requirements</h2>
                        </div>
                        
                        <Row className="g-4">
                          {pcRequirements.minimum && (
                            <Col md={6}>
                              <h3 className="fs-5 mb-2 text-primary">Minimum</h3>
                              <div className="bg-light p-3 rounded-3">
                                <p className="white-space-pre-line mb-0 small">{pcRequirements.minimum}</p>
                              </div>
                            </Col>
                          )}
                          
                          {pcRequirements.recommended && (
                            <Col md={6}>
                              <h3 className="fs-5 mb-2 text-primary">Recommended</h3>
                              <div className="bg-light p-3 rounded-3">
                                <p className="white-space-pre-line mb-0 small">{pcRequirements.recommended}</p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </Card.Body>
                    </Card>
                  )}
                  
                  {/* Tags Section */}
                  {game.tags?.length > 0 && (
                    <Card className="shadow-sm rounded-3">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <Tag className="text-primary" size={20} />
                          <h2 className="fs-4 mb-0">Tags</h2>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {game.tags.map(tag => (
                            <Badge 
                              key={tag.id} 
                              bg="light"
                              text="dark" 
                              className="fs-6 py-2 px-3 rounded-pill"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
                
                {/* Right Column - Game Details */}
                <Col lg={4}>
                  <Card className="shadow-sm rounded-3 sticky-top" style={{top: "6rem"}}>
                    <Card.Body className="p-4">
                      <h2 className="fs-4 mb-3">Game Details</h2>
                      
                      {/* Rating */}
                      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="text-secondary">Rating</span>
                        <div className="d-flex align-items-center">
                          <Star className="text-warning me-1 fill-warning" size={20} />
                          <span className="fw-medium">{game.rating.toFixed(1)}/5</span>
                        </div>
                      </div>
                      
                      {/* Rating Progress */}
                      <div className="py-2 border-bottom">
                        <ProgressBar 
                          variant={getRatingColor(game.rating)} 
                          now={game.rating * 20} 
                          className="mb-2"
                          style={{height: "8px"}}
                        />
                      </div>
                      
                      {/* Release Date */}
                      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <span className="text-secondary d-flex align-items-center">
                          <Calendar size={16} className="me-2" />
                          Release Date
                        </span>
                        <span className="fw-medium">{formatReleaseDate(game.released)}</span>
                      </div>
                      
                      {/* Playtime */}
                      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <span className="text-secondary d-flex align-items-center">
                          <Clock size={16} className="me-2" />
                          Playtime
                        </span>
                        <span className="fw-medium">{game.playtime} hours</span>
                      </div>
                      
                      {/* Platforms */}
                      <div className="py-3 border-bottom">
                        <h3 className="text-secondary fs-6 mb-2">Platforms</h3>
                        <div className="d-flex flex-wrap gap-2">
                          {game.platforms?.map(({ platform }) => (
                            <Badge 
                              key={platform.id} 
                              bg="light"
                              text="dark"
                              className="py-2 px-3 rounded-pill"
                            >
                              {platform.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Genres */}
                      <div className="py-3 border-bottom">
                        <h3 className="text-secondary fs-6 mb-2">Genres</h3>
                        <div className="d-flex flex-wrap gap-2">
                          {game.genres?.map(genre => (
                            <Badge 
                              key={genre.id} 
                              bg="primary"
                              className="py-2 px-3 rounded-pill"
                            >
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* ESRB Rating */}
                      {game.esrb_rating && (
                        <div className="py-3 border-bottom">
                          <h3 className="text-secondary fs-6 mb-2">ESRB Rating</h3>
                          <Badge 
                            bg="dark" 
                            className="py-2 px-3 rounded-pill"
                          >
                            {game.esrb_rating.name}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Stores */}
                      {game.stores?.length > 0 && (
                        <div className="py-3">
                          <h3 className="text-secondary fs-6 mb-2">Available On</h3>
                          <div className="d-flex flex-wrap gap-2">
                            {game.stores.map(({ store }) => (
                              <Badge 
                                key={store.id} 
                                bg="secondary"
                                className="py-2 px-3 rounded-pill d-flex align-items-center"
                              >
                                {store.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Add/Remove from Library Button for Mobile */}
                      <Button 
                        variant={isFavorite ? "outline-primary" : "primary"} 
                        onClick={handleFavoriteToggle}
                        className="w-100 py-2 mt-4 d-flex align-items-center justify-content-center"
                      >
                        {isFavorite ? (
                          <>
                            <BookmarkCheck size={20} className="me-2" />
                            Added to Library
                          </>
                        ) : (
                          <>
                            <Bookmark size={20} className="me-2" />
                            Add to Library
                          </>
                        )}
                      </Button>
                      
                      {!isSignedIn && (
                        <p className="small text-secondary mt-2 text-center">
                          Please sign in to add games to your library
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </AnimatedElement>
          ) : null}
        </Container>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default GameDetail;
