import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LegalAgent } from '../../components/agents/LegalAgent';
import { DemoWrapper } from '../Demos';

export const LegalDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Legal Intake AI Agent" description="AI agent for law firms: client intake forms, case qualification, document collection, and consultation scheduling.">
      <LegalAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
