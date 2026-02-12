import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessPlanner } from '../../components/BusinessPlanner';
import { DemoWrapper } from '../Demos';

export const BusinessPlanDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DemoWrapper title="AI Business Plan Generator">
      <BusinessPlanner onRestart={() => navigate('/demos')} />
    </DemoWrapper>
  );
};
