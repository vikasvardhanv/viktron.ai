import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DealershipAgent } from '../../components/agents/DealershipAgent';
import { DemoWrapper } from '../Demos';

export const DealershipDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Dealership AI Agent" description="AI agent for auto dealerships: vehicle inquiries, test drive booking, trade-in valuations, and service department scheduling.">
      <DealershipAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
