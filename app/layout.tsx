import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Header from "./components/Header";
import DashboardSidebar from "./components/Dashboard";
import "./global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en" className="h-full overflow-hidden" suppressHydrationWarning>
        <body className="h-full flex flex-col overflow-hidden">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-midnightBlue px-3 py-2 rounded-md"
          >
            Skip to main content
          </a>

          <Header />

          <div className="flex flex-grow min-h-screen bg-midnightBlue">
            <aside className="w-20 md:w-64 flex-shrink-0" role="navigation">
              <DashboardSidebar />
            </aside>

            <main
              id="main-content"
              className="flex-grow min-h-[calc(100vh-4rem)] overflow-y-auto"
              role="main"
              aria-labelledby="page-title"
            >
              {children}
            </main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}