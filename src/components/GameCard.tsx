
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Star, Bookmark, BookmarkPlus, Calendar, Tag, Gamepad } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { Game } from '@/types';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { isSignedIn } = useUser();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  const isFavorited = favorites.some(fav => fav.id === game.id);
  
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the release date
  const releaseDate = game.released 
    ? new Date(game.released).toLocaleDateString() 
    : 'TBA';
    
  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to game details
    e.stopPropagation(); // Stop event propagation
    
    if (!isSignedIn) {
      toast.error("Please sign in to add games to your library", {
        position: "top-center",
      });
      return;
    }
    
    if (isFavorited) {
      dispatch(removeFavorite(game.id));
      toast.success("Game removed from your library");
    } else {
      dispatch(addFavorite({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        added: new Date().toISOString(),
        rating: game.rating,
        released: game.released
      }));
      toast.success("Game added to your library");
    }
  };

  // Extract a short description from the game object
  const getShortDescription = () => {
    if (game.description_raw) {
      return game.description_raw.substring(0, 75) + '...';
    }
    return "Explore this exciting game and discover its features.";
  };

  return (
    <Link to={`/game/${game.id}`} className="d-block h-100 text-decoration-none">
      <div 
        className="h-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-100 shadow-sm game-card">
          <div className="position-relative">
            <div className="overflow-hidden">
              <Card.Img 
                variant="top" 
                src={game.background_image || "/placeholder.svg"} 
                alt={game.name}
                className="game-card-image"
                style={{ 
                  height: '12rem',
                  objectFit: 'cover',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
                  transition: 'transform 0.5s'
                }}
              />
            </div>
            
            <button
              className={`position-absolute top-0 end-0 m-2 p-2 rounded-circle ${
                isFavorited ? 'bg-primary text-white' : 'bg-light bg-opacity-75 text-dark'
              }`}
              onClick={handleFavoriteToggle}
              style={{
                zIndex: 10,
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
            >
              {isFavorited ? (
                <Bookmark className="small" style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <BookmarkPlus className="small" style={{ width: '1rem', height: '1rem' }} />
              )}
            </button>
            
            <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 p-2">
              <div className="d-flex align-items-center">
                <Star className="text-warning me-1" style={{ width: '1rem', height: '1rem', fill: '#ffc107' }} />
                <span className="small fw-medium text-white">{game.rating.toFixed(1)}</span>
                
                {game.metacritic && (
                  <span className={`ms-2 px-1 py-0 small rounded ${
                    game.metacritic >= 75 ? 'bg-success text-white' :
                    game.metacritic >= 50 ? 'bg-warning text-dark' :
                    'bg-danger text-white'
                  }`}>
                    {game.metacritic}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <Card.Body className="d-flex flex-column p-3">
            <Card.Title className="fs-5 fw-semibold mb-1 text-truncate">
              {game.name}
            </Card.Title>
            
            <div className="small text-muted mb-2 d-flex align-items-center">
              <Calendar style={{ width: '0.75rem', height: '0.75rem' }} className="me-1" />
              {releaseDate}
            </div>
            
            {/* Short description */}
            <p className="small mb-3 text-muted" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {getShortDescription()}
            </p>
            
            {/* Platforms */}
            {game.parent_platforms && game.parent_platforms.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mb-2">
                {game.parent_platforms.slice(0, 3).map(({ platform }) => (
                  <span 
                    key={platform.id} 
                    className="d-inline-flex align-items-center small text-muted"
                  >
                    <Gamepad style={{ width: '0.75rem', height: '0.75rem' }} className="me-1" />
                    {platform.name}
                    {game.parent_platforms.indexOf(game.parent_platforms.find(p => p.platform.id === platform.id)!) < 
                      game.parent_platforms.length - 1 && ", "}
                  </span>
                ))}
                {game.parent_platforms.length > 3 && (
                  <span className="small text-muted">+{game.parent_platforms.length - 3} more</span>
                )}
              </div>
            )}
            
            {/* Genres */}
            <div className="d-flex flex-wrap gap-1 mt-auto">
              {game.genres && game.genres.slice(0, 2).map(genre => (
                <span 
                  key={genre.id} 
                  className="d-flex align-items-center bg-light text-primary small px-2 py-1 rounded-pill"
                >
                  <Tag style={{ width: '0.75rem', height: '0.75rem' }} className="me-1" />
                  {genre.name}
                </span>
              ))}
            </div>
          </Card.Body>
          
          {isHovered && (
            <div 
              className="position-absolute top-0 start-0 end-0 bottom-0 bg-primary bg-opacity-10"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </Card>
      </div>
    </Link>
  );
};

export default GameCard;
