import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClinicAgent } from '../../components/agents/ClinicAgent';
import { DemoWrapper } from '../Demos';

export const ClinicDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Healthcare AI Agent" description="AI agent for healthcare clinics: patient intake, appointment scheduling, prescription reminders, and insurance verification.">
      <ClinicAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
