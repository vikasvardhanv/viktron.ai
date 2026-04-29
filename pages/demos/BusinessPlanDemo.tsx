import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessPlanner } from '../../components/BusinessPlanner';
import { DemoWrapper } from '../Demos';

export const BusinessPlanDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="AI Business Plan Generator" description="Generate complete business plans with AI: market analysis, financial projections, competitive landscape, and investor-ready executive summaries.">
      <BusinessPlanner onRestart={() => navigate('/demos')} />
    </DemoWrapper>
  );
};
