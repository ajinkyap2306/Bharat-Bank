import React, { useEffect } from 'react';
import { useBanking } from '../../context/BankingContext';

/** Shows a toast when the service worker has cached the app for offline use. */
export const PwaLifecycle: React.FC = () => {
  const { addToast } = useBanking();

  useEffect(() => {
    const onOfflineReady = () => {
      addToast({
        type: 'success',
        title: 'Ready for offline use',
        message: 'This app can now run without an internet connection.',
      });
    };

    window.addEventListener('pwa-offline-ready', onOfflineReady);
    return () => window.removeEventListener('pwa-offline-ready', onOfflineReady);
  }, [addToast]);

  return null;
};
