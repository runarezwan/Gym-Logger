'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
     return (
        <div className="min-h-screen bg-navy flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
        </div>
     );
  }

  if (!user && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
