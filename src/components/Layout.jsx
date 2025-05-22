// Layout.jsx
import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="flex bg-[#f6fdf4] text-black h-screen overflow-hidden">
      {/* Sidebar */}
      <NavBar />

      {/* Main Content */}
      <div className="pl-64 w-full pt-16 pb-10 relative">
        <main className="h-[calc(100vh-4rem-2.5rem)] p-5 overflow-hidden">
          {children}
        </main>
      </div>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-64 w-[calc(100%-16rem)] h-10 bg-[#a4d4a0] text-sm text-[#2e2e2e] font-medium flex items-center justify-center shadow-md z-10">
        &copy; {new Date().getFullYear()} Visitor Pass Management System
      </footer>
    </div>
  );
}
