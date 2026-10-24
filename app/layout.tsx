import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CookedResume.in - The Indian Tech Resume & GitHub Roaster',
  description:
    'Find out how badly you are cooked before the 3.2 LPA mass recruiter, Bengaluru startup CTO, FAANG Bhaiya, or Placement Cell HOD rejects you. High-contrast viral scorecard with STAR resume bullet rewrites.',
  keywords: [
    'Indian tech resume roast',
    'GitHub profile roaster',
    'Tier-3 resume roast',
    '3.2 LPA mass recruiter',
    'Bengaluru startup CTO roast',
    'FAANG bhaiya didi',
    'STAR resume bullet rewrite',
    'CookedResume',
  ],
  authors: [{ name: 'CookedResume.in' }],
  openGraph: {
    title: 'CookedResume.in - The Indian Tech Resume & GitHub Roaster',
    description:
      'Upload your PDF resume or enter your GitHub. Get roasted by Indian tech personas and download your viral Spotify Wrapped style scorecard.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#07080d] text-zinc-100 selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
