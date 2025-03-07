import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoadingProvider } from "@/components/loading-provider";
import { ChatBot } from '@/components/chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CONFLIX Clone',
  description: 'A modern streaming platform built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative min-h-screen`}>
        <div className="animated-gradient fixed inset-0 z-[-2]" />
        <div className="content-overlay fixed inset-0 z-[-1]" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LoadingProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatBot />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}