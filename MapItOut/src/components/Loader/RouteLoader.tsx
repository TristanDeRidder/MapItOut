import { useProgress } from "@react-three/drei";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type RouteLoaderContextValue = {
  isRouteLoading: boolean;
  startRouteLoading: () => void;
  stopRouteLoading: () => void;
};

const RouteLoaderContext = createContext<RouteLoaderContextValue | null>(null);

export function RouteLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const startRouteLoading = useCallback(() => setIsRouteLoading(true), []);
  const stopRouteLoading = useCallback(() => setIsRouteLoading(false), []);

  const value = useMemo(
    () => ({ isRouteLoading, startRouteLoading, stopRouteLoading }),
    [isRouteLoading, startRouteLoading, stopRouteLoading]
  );

  return (
    <RouteLoaderContext.Provider value={value}>
      {children}
    </RouteLoaderContext.Provider>
  );
}

export function useRouteLoader() {
  const ctx = useContext(RouteLoaderContext);
  if (!ctx)
    throw new Error("useRouteLoader must be used within RouteLoaderProvider");
  return ctx;
}

function FullscreenLoader({ visible }: { visible: boolean }) {
  const { progress } = useProgress();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-3xl">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/20 border-t-black" />
        <div className="text-black text-lg">
          Loading Model ({Math.round(progress)}%)
        </div>
      </div>
    </div>
  );
}

export function RouteLoaderOverlay() {
  const { isRouteLoading } = useRouteLoader();
  const { active } = useProgress();

  return <FullscreenLoader visible={isRouteLoading || active} />;
}

export function useRouteLoaderAutoStop({
  fallbackMs = 1500,
}: { fallbackMs?: number } = {}) {
  const { isRouteLoading, stopRouteLoading } = useRouteLoader();
  const { active } = useProgress();

  const hasSeenActiveRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearFallback = () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };

    if (!isRouteLoading) {
      hasSeenActiveRef.current = false;
      clearFallback();
      return;
    }

    if (active) {
      hasSeenActiveRef.current = true;
      clearFallback();
      return;
    }

    if (hasSeenActiveRef.current) {
      stopRouteLoading();
      hasSeenActiveRef.current = false;
      clearFallback();
      return;
    }

    if (!fallbackTimerRef.current) {
      fallbackTimerRef.current = window.setTimeout(() => {
        stopRouteLoading();
        hasSeenActiveRef.current = false;
        fallbackTimerRef.current = null;
      }, fallbackMs);
    }

    return clearFallback;
  }, [isRouteLoading, active, stopRouteLoading, fallbackMs]);
}
