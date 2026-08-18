import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useBanking } from '../../../context/BankingContext';
import { AllServicesScreen } from './AllServicesScreen';
import { ServiceSearchOverlay } from './ServiceSearchOverlay';
import { ServiceItem } from '../../../types/services';

export const ServicesModule: React.FC = () => {
  const { navigateService, setBottomNavHidden } = useBanking();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSelect = (service: ServiceItem & { categoryId?: string; categoryTitle?: string }) => {
    setSearchOpen(false);
    setBottomNavHidden(false);
    navigateService(service.id, service.route);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setBottomNavHidden(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setBottomNavHidden(false);
  };

  return (
    <>
      <AllServicesScreen onOpenSearch={openSearch} onSelectService={handleSelect} />
      <AnimatePresence>
        {searchOpen && (
          <ServiceSearchOverlay onClose={closeSearch} onSelectService={handleSelect} />
        )}
      </AnimatePresence>
    </>
  );
};
