import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BharatBankLogo } from '../common/BharatBankLogo';
import {
  RegPrimaryButton,
  RegRadioOption,
  RegShell,
  RegTitle,
  RegTopBar,
} from './retail/shared/RetailRegistrationUI';

type RegistrationType = 'retail' | 'corporate' | null;

export const RegistrationEntry: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = React.useState<RegistrationType>(null);
  const [error, setError] = React.useState('');

  const handleContinue = () => {
    if (!type) {
      setError('Select Retail or Corporate registration to continue.');
      return;
    }
    setError('');
    navigate(type === 'retail' ? '/retail/register' : '/corporate/register');
  };

  return (
    <RegShell>
      <RegTopBar onBack={() => navigate('/')} title="Register" />
      <div className="px-4 mb-4">
        <BharatBankLogo variant="full" size="sm" />
      </div>
      <RegTitle
        title="Choose Registration Type"
        subtitle="Select whether you are registering for Retail Mobile Banking or Corporate Internet Banking."
      />
      <div className="px-4 space-y-3">
        <RegRadioOption
          selected={type === 'retail'}
          title="Retail (R)"
          description="Individual account · User ID starts with RB-"
          onSelect={() => {
            setType('retail');
            setError('');
          }}
        />
        <RegRadioOption
          selected={type === 'corporate'}
          title="Corporate (C)"
          description="Business account · User ID starts with CB-"
          onSelect={() => {
            setType('corporate');
            setError('');
          }}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <div className="pt-2">
          <RegPrimaryButton label="Continue" onClick={handleContinue} />
        </div>
      </div>
    </RegShell>
  );
};
