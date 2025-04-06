
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '@/components/Header';
import { SignIn as ClerkSignIn, useUser } from '@clerk/clerk-react';

const SignIn = () => {
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
                  <h1 className="text-2xl font-bold mb-2">Welcome to Game Verse</h1>
                  <p className="text-gaming-textMuted">
                    Sign in to access your game library and personalized features
                  </p>
                </div>
                
                <ClerkSignIn 
                  signUpUrl="/sign-up"
                  afterSignInUrl="/library"
                  routing="path"
                  path="/sign-in"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default SignIn;
