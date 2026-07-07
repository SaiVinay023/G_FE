'use client';

import { ReactNode, useEffect, useState } from 'react';

import Layout from 'src/components/Layout/Layout';

import MainLoader from '../MainLoader';

export default function LayoutWithDelay({ children }: { children: ReactNode }) {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChildren(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!showChildren) {
    return <MainLoader />;
  }

  return <Layout>{children}</Layout>;
}
