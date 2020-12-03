import React from 'react';
import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Go to <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">WishList</a></p>
    </div>
  );
};

export default ExploreContainer;
