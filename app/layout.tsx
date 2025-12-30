import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"></div>
        <div className="relative z-10">{children}</div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.9)",
              color: "#fff",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backdropFilter: "blur(10px)",
            },
          }}
        />
      </body>
    </html>
  );
}
