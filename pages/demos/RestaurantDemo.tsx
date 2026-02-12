import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RestaurantAgent } from '../../components/agents/RestaurantAgent';
import { DemoWrapper } from '../Demos';

export const RestaurantDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Restaurant AI Agent">
      <RestaurantAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
