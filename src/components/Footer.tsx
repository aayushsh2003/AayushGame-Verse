import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Github, Linkedin, Mail, ExternalLink, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-light text-dark py-5 mt-auto">
      <Container>
        <Row className="align-items-center gy-4">
          <Col xs={12} md={6} className="text-center text-md-start">
            <h5 className="mb-0">AayushGame Verse Explorer</h5>
            <p className="mb-0 text-muted small">
              &copy; {currentYear} All Rights Reserved
            </p>
          </Col>
          
          <Col xs={12} md={6}>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-end">
              
              
              <a 
                href="https://aiclassof26.vercel.app/portfolio/aayush-sharma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm d-flex align-items-center"
              >
                Developer Portfolio <ExternalLink size={16} className="ms-1" />
              </a>
            </div>
          </Col>
          
          <Col xs={12} className="text-center">
            <hr className="my-2 border-secondary" />
            {/* <p className="text-muted small mb-2">Quick Links</p>
            <div className="d-flex justify-content-center gap-4 mb-3">
              <a href="/sign-in" className="text-dark">SignIn</a>
              <a href="/sign-up" className="text-dark">Sign-Up</a>
              <a href="/library" className="text-dark">Library</a>
            </div> */}
            <p className="text-muted small">
              Developed by Aayush Sharma | Powered by RAWG API
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;