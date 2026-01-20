import "./globals.css";
import Navbar from "./NavBar";
import { UserProvider } from "./context/usercontext";

export const metadata = {
  title: "Cozy Stay",
  description: "Find your perfect stay with Cozy Stay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased suppressHydrationWarning">
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
