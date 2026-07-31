import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Clean Architecture · Next.js 15 App',
  description: 'Next.js 15 App Router consuming shared @clean/cart domain and @clean/ui-components',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: '#f8fafc',
          color: '#0f172a',
        }}
      >
        {children}
      </body>
    </html>
  );
}
