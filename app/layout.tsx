import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CookedResume.in - The Indian Tech Resume & GitHub Roaster',
  description:
    'Select a brutal AI persona and get a reality check on your tech career. 100% Client-Side PDF parsing with instant scorecard generation.',
  keywords: [
    'CookedResume.in',
    'Indian tech resume roast',
    'Figma UI tech resume',
    'Mass Recruiter HR',
    'Bengaluru Startup CTO',
    'FAANG Tech Lead',
    'Placement HOD',
    '3.2 LPA WITCH',
  ],
  authors: [{ name: 'CookedResume.in' }],
  openGraph: {
    title: 'CookedResume.in - Is Your Tech Resume Cooked?',
    description:
      'Select a brutal AI persona and get a reality check on your tech career. 100% Client-Side PDF Parsing.',
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
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexMono.variable} dark h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#09090B] bg-zinc-950 text-neutral-50 selection:bg-orange-500 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
