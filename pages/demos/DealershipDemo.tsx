import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DealershipAgent } from '../../components/agents/DealershipAgent';
import { DemoWrapper } from '../Demos';

export const DealershipDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Dealership AI Agent">
      <DealershipAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
