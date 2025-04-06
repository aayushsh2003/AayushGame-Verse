
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '@/components/Header';
import { SignUp as ClerkSignUp, useUser } from '@clerk/clerk-react';

const SignUp = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="mt-20 flex-grow flex items-center justify-center">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} xl={5}>
              <div className="bg-gaming-card p-4 rounded-lg shadow-lg">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Join Game Verse Explorer</h1>
                  <p className="text-gaming-textMuted">
                    Create an account to save your favorite games and personalize your experience
                  </p>
                </div>
                
                <ClerkSignUp 
                  signInUrl="/sign-in"
                  afterSignUpUrl="/"
                  routing="path"
                  path="/sign-up"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default SignUp;
