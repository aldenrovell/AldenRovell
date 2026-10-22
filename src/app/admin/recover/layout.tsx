import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Password Recovery | Alden Rovell',
  robots: { index: false, follow: false },
};

export default function PasswordRecoveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
