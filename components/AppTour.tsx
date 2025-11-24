import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import { Card, CardContent, Button } from './ui/DesignSystem';
import { useUser } from '../contexts/UserContext';
import { TRANSLATIONS } from '../constants';
import { Compass } from 'lucide-react';

export const AppTour: React.FC = () => {
  const { profile } = useUser();
  const [showDialog, setShowDialog] = useState(false);
  
  const t = TRANSLATIONS[profile?.language || 'en'];
  const STORAGE_KEY = 'ghifarmkcy_tour_seen';

  useEffect(() => {
    // Only show if user exists (onboarding done) and hasn't seen tour
    if (profile && profile.onboardingCompleted) {
        const hasSeen = localStorage.getItem(STORAGE_KEY);
        if (!hasSeen) {
            // Delay slightly to ensure UI is ready
            const timer = setTimeout(() => setShowDialog(true), 1500);
            return () => clearTimeout(timer);
        }
    }
  }, [profile]);

  const startTour = () => {
    setShowDialog(false);
    localStorage.setItem(STORAGE_KEY, 'true');

    const driverObj = driver({
      showProgress: true,
      popoverClass: 'driverjs-theme', // Custom class defined in index.html
      steps: [
        { 
            element: '#tour-balance', 
            popover: { 
                title: t.tourBalanceTitle, 
                description: t.tourBalanceDesc,
                side: "bottom", 
                align: 'start' 
            } 
        },
        { 
            element: '#tour-quick-add', 
            popover: { 
                title: t.tourQuickAddTitle, 
                description: t.tourQuickAddDesc,
                side: "left", 
                align: 'start' 
            } 
        },
        { 
            element: '#tour-filter', 
            popover: { 
                title: t.tourFilterTitle, 
                description: t.tourFilterDesc,
                side: "bottom", 
                align: 'end' 
            } 
        },
      ]
    });

    driverObj.drive();
  };

  const skipTour = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-sm border-orange-500/20 shadow-2xl">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-orange-500 animate-bounce">
                <Compass size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{t.tourConfirmTitle}</h2>
            <p className="text-zinc-400 text-sm">
                {t.tourConfirmDesc}
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={skipTour} className="flex-1">
                {t.skipTour}
            </Button>
            <Button onClick={startTour} className="flex-1">
                {t.startTour}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};