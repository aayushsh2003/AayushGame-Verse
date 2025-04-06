
import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { removeFavorite } from '@/store/slices/favoritesSlice';
import Header from '@/components/Header';
import { useUser } from '@clerk/clerk-react';
import { Bookmark, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

const Library = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  
  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    }
  }, [isSignedIn, navigate]);
  
  const handleRemoveFromLibrary = (id: number, name: string) => {
    dispatch(removeFavorite(id));
    toast.success(`${name} removed from your library`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="mt-20 flex-grow">
        <Container fluid className="px-4 py-3">
          <div className="bg-gaming-card/30 rounded-lg p-6 mb-8">
            <br />
            <br />
            <br />
            <br />

            <h1 className="text-3xl font-bold mb-2">My Game Library</h1>
            {isSignedIn && user && (
              <p className="text-gaming-textMuted">
                Welcome back, {user.firstName || user.username || user.emailAddresses[0].emailAddress.split('@')[0]}! Here are your saved games.
              </p>
            )}
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-gaming-card rounded-lg">
              <Bookmark className="w-12 h-12 mx-auto text-gaming-purple mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
              <p className="text-gaming-textMuted mb-4">
                Start adding games to your library to keep track of what you want to play.
              </p>
              <Link to="/" className="btn-primary">
                Browse Games
              </Link>
            </div>
          ) : (
            <Row>
              {favorites.map(game => (
                <Col key={game.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="game-card h-full">
                    <div className="relative">
                      <Card.Img 
                        variant="top" 
                        src={game.background_image || "/placeholder.svg"} 
                        alt={game.name}
                        className="game-card-image"
                      />
                      
                      <button
                        className="absolute top-2 right-2 p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600/80 transition-colors"
                        onClick={() => handleRemoveFromLibrary(game.id, game.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {game.rating !== undefined && (
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white rounded px-2 py-1 text-sm flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                          {game.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    <Card.Body className="p-3">
                      <Card.Title className="text-base font-semibold mb-1">
                        <Link to={`/game/${game.id}`} className="hover:text-gaming-purple transition-colors">
                          {game.name}
                        </Link>
                      </Card.Title>
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gaming-textMuted">
                          Added: {new Date(game.added).toLocaleDateString()}
                        </div>
                        {game.released && (
                          <div className="text-xs text-gaming-textMuted">
                            Released: {new Date(game.released).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Library;
