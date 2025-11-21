import React from 'react';
import { Row, Col } from 'antd';
import SectionSummary from './SectionSummary';
import type { SectionSummaryProps } from './SectionSummary';

export interface DashboardGridProps {
  sections: Omit<SectionSummaryProps, 'maxItems'>[];
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  sections,
  columns = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3 },
}) => {
  const getColSpan = () => {
    const { xs = 1, sm = 1, md = 2, lg = 2, xl = 3 } = columns;
    return {
      xs: 24 / xs,
      sm: 24 / sm,
      md: 24 / md,
      lg: 24 / lg,
      xl: 24 / xl,
    };
  };

  const colSpan = getColSpan();

  return (
    <Row gutter={[16, 16]}>
      {sections.map((section, index) => (
        <Col
          xs={colSpan.xs}
          sm={colSpan.sm}
          md={colSpan.md}
          lg={colSpan.lg}
          xl={colSpan.xl}
          key={index}
        >
          <SectionSummary {...section} maxItems={5} />
        </Col>
      ))}
    </Row>
  );
};

export default DashboardGrid;

