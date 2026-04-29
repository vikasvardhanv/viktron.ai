import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WhatsAppBot } from '../../components/WhatsAppBot';
import { DemoWrapper } from '../Demos';

export const WhatsAppDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="WhatsApp Business Bot" description="AI-powered WhatsApp automation: auto-reply to customer messages, send order updates, run marketing campaigns, and qualify leads on WhatsApp.">
      <WhatsAppBot onRestart={() => navigate('/demos')} />
    </DemoWrapper>
  );
};
