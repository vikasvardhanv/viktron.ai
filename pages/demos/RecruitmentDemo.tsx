import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecruitmentAgent } from '../../components/agents/RecruitmentAgent';
import { DemoWrapper } from '../Demos';

export const RecruitmentDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="Recruitment AI Agent" description="AI agent for recruitment: candidate screening, interview scheduling, job description matching, and automated follow-up throughout the hiring pipeline.">
      <RecruitmentAgent
        onBack={() => navigate('/agents')}
        onRestart={() => navigate('/demos')}
      />
    </DemoWrapper>
  );
};
