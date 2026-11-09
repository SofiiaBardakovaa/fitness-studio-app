
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fitness Studio",
  description: "Fitness Studio Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
