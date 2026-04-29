import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RestaurantAgent } from '../../components/agents/RestaurantAgent';
import { DemoWrapper } from '../Demos';

export const RestaurantDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Restaurant AI Agent" description="AI agent for restaurants: handle reservations, take orders, answer menu questions, and manage takeout requests 24/7 via chat and voice.">
      <RestaurantAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
