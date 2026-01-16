'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Cookie utility functions (client-side only)
const setCookie = (name: string, value: string, hours: number) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Check if loading is active
const isLoadingActive = (): boolean => {
  return getCookie('loading-active') === 'true';
};

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const eightSecondsPassedRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);
  // Initialize states synchronously to prevent flickering
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof document === 'undefined') return false;
    return getCookie('pwa-install-dismissed') !== null;
  });

  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;
    return isMobileUserAgent || (hasTouchScreen && isSmallScreen);
  });
  // Initialize isReady based on immediate checks
  const [isReady, setIsReady] = useState(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return false;
    // If dismissed, we're ready immediately (won't show anything)
    if (getCookie('pwa-install-dismissed') !== null) return true;
    // Check if installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    if (isStandaloneMode || isIOSStandalone) return true;
    // For mobile, we need to wait for events, so not ready yet
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;
    const mobile = isMobileUserAgent || (hasTouchScreen && isSmallScreen);
    // If not mobile, we're ready (won't show)
    return !mobile;
  });

  // Function to check if app is installed
  const checkIfInstalled = () => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    return isStandaloneMode || isIOSStandalone;
  };

  // Hide popup when route changes
  useEffect(() => {
    // Check if pathname changed
    if (previousPathnameRef.current !== null && previousPathnameRef.current !== pathname) {
      // Route changed - hide the popup
      setShowPrompt(false);
    }
    previousPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    // If already ready (not mobile or dismissed), don't do anything
    if (isReady && (!isMobile || isDismissed)) {
      return;
    }

    // Double-check cookie (already checked in initializer, but be safe)
    const hasDismissed = getCookie('pwa-install-dismissed');
    if (hasDismissed) {
      setIsDismissed(true);
      setIsReady(true);
      return;
    }

    // Don't proceed if not mobile (already checked in initializer)
    if (!isMobile) {
      setIsReady(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if app is already installed
    const installed = checkIfInstalled();
    setIsInstalled(installed);

    if (installed) {
      setIsReady(true);
      return;
    }

    // Listen for app installation event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    // Re-check installation status when page becomes visible (in case installed in another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const installed = checkIfInstalled();
        if (installed) {
          setIsInstalled(true);
          setShowPrompt(false);
          setDeferredPrompt(null);
        }
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const checkAndShowPrompt = () => {
      // Re-check all conditions before showing
      const stillDismissed = getCookie('pwa-install-dismissed');
      if (stillDismissed) {
        return; // Don't show if dismissed
      }

      if (checkIfInstalled()) {
        return; // Don't show if already installed
      }

      // Check if loading screen is still active (cookie-based)
      if (isLoadingActive()) {
        // Loading screen is still showing, retry after a short delay
        setTimeout(() => checkAndShowPrompt(), 500);
        return;
      }

      // For iOS, show instructions if delay has passed
      if (isIOSDevice && eightSecondsPassedRef.current) {
        setShowPrompt(true);
      }
      // For Android/Chrome, show if we have deferred prompt AND delay has passed
      else if (!isIOSDevice && deferredPromptRef.current && eightSecondsPassedRef.current) {
        setShowPrompt(true);
      }
    };

    // Set up delay timer - 5 seconds if loading cookie doesn't exist, otherwise 10 seconds
    // Check if loading is active to determine delay
    const loadingActive = isLoadingActive();
    const delay = loadingActive ? 10000 : 5000; // 10s if loading active, 5s if not

    const showPromptTimer = setTimeout(() => {
      eightSecondsPassedRef.current = true;
      checkAndShowPrompt();
    }, delay);

    // For iOS, we still need to detect it
    if (isIOSDevice) {
      setIsReady(true);
    }

    // For Android/Chrome, listen for beforeinstallprompt event
    const handler = (e: Event) => {
      // Check cookie before showing prompt
      const stillDismissed = getCookie('pwa-install-dismissed');
      if (stillDismissed) {
        return; // Don't show if dismissed
      }

      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      deferredPromptRef.current = promptEvent;

      // If 8 seconds have already passed, show immediately
      if (eightSecondsPassedRef.current) {
        checkAndShowPrompt();
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    setIsReady(true);

    return () => {
      clearTimeout(showPromptTimer);
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReady, isMobile, isDismissed]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // The appinstalled event will fire, but we can also check immediately
      // and hide the prompt right away
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    deferredPromptRef.current = null;
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    // Store dismissal in cookie with 4 hour expiration
    setCookie('pwa-install-dismissed', 'true', 4);
  };

  // Don't render until ready to prevent flickering
  if (!isReady) {
    return null;
  }

  // Check dismissal first (highest priority) - prevents any flicker
  if (isDismissed) {
    return null;
  }

  // Don't show if not mobile, already installed, or prompt not ready
  if (!isMobile || isInstalled || !showPrompt) {
    return null;
  }

  // For iOS, show instructions
  if (isIOS && !deferredPrompt) {
    return (
      <div className="fixed left-4 right-4 top-[3.2rem] z-[100] md:left-auto md:right-4 md:w-96">
        <div className="border-border-primary flex items-start gap-3 rounded-lg border bg-main-surface-secondary p-4 shadow-lg">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold text-text-primary">Install Foodterest</h3>
            <p className="mb-2 text-xs text-text-secondary">
              Tap the share button <span className="inline-block">📤</span> and select &quot;Add to
              Home Screen&quot;
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Got it
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-text-tertiary transition-colors hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // For Android/Chrome with install prompt
  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed left-4 right-4 top-[3.2rem] z-[100] md:left-auto md:right-4 md:w-96">
      <div className="border-border-primary flex items-start gap-3 rounded-lg border bg-main-surface-secondary p-4 shadow-lg">
        <div className="flex-1">
          <h3 className="mb-1 text-sm font-semibold text-text-primary">Install Foodterest</h3>
          <p className="mb-3 text-xs text-text-secondary">
            Install our app for a better experience and faster loading.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-md bg-main-surface-primary px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-main-surface-tertiary"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-text-tertiary transition-colors hover:text-text-primary"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}