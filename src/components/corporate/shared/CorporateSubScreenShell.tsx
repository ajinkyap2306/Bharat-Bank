import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '../../common/ScreenHeader';

interface CorporateSubScreenShellProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  children: React.ReactNode;
}

export const CorporateSubScreenShell: React.FC<CorporateSubScreenShellProps> = ({
  title,
  subtitle,
  backTo = '/corporate/more',
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-4">
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        onBack={() => navigate(backTo)}
      />
      <div className="px-3 pt-3 space-y-4">{children}</div>
    </div>
  );
};
