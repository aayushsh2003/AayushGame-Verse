
import { ReactNode } from 'react';

interface AnimatedElementProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-in' | 'scale-in';
  className?: string;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({ 
  children, 
  animation = 'fade-in',
  className = '' 
}) => {
  return (
    <div className={`${animation} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedElement;
