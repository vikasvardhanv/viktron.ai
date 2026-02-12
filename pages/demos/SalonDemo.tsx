import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SalonAgent } from '../../components/agents/SalonAgent';
import { DemoWrapper } from '../Demos';

export const SalonDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Salon AI Agent">
      <SalonAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
