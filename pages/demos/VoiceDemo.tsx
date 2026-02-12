import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceAgent } from '../../components/VoiceAgent';
import { DemoWrapper } from '../Demos';

export const VoiceDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Voice AI Agent">
      <VoiceAgent onRestart={() => navigate('/demos')} />
    </DemoWrapper>
  );
};
