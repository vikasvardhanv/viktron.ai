import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConstructionAgent } from '../../components/agents/ConstructionAgent';
import { DemoWrapper } from '../Demos';

export const ConstructionDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Construction AI Agent">
      <ConstructionAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
