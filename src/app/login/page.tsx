'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Win95Window } from '@/components/Win95Window';
import { Win95Button } from '@/components/Win95Button';
import { Win95Input } from '@/components/Win95Input';
import { storage } from '@/lib/storage';
import { User } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = storage.getUser();
    if (user) {
      router.push('/calendar');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
    };

    storage.setUser(user);

    setTimeout(() => {
      router.push('/calendar');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Win95Window title="Scheduler - Login">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold mb-1">Welcome to Scheduler</h1>
              <p className="text-xs">Enter your details to get started</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-bold block">
                Name:
              </label>
              <Win95Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-bold block">
                Email:
              </label>
              <Win95Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-center pt-2">
              <Win95Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="px-8"
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </Win95Button>
            </div>
          </form>
        </Win95Window>
      </div>
    </div>
  );
}
