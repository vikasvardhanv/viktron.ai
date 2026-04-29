import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RealEstateAgent } from '../../components/agents/RealEstateAgent';
import { DemoWrapper } from '../Demos';

export const RealEstateDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Real Estate AI Agent" description="AI agent for real estate: property inquiries, virtual tour booking, pre-qualification forms, and automated follow-up with buyers and sellers.">
      <RealEstateAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
