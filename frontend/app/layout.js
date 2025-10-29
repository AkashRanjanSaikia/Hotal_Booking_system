import "./globals.css";
import Navbar from "./NavBar";
import NavSpacer from "./NavSpacer";
import { UserProvider } from "./context/usercontext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <Navbar />
          {/* spacer to prevent fixed navbar from covering page content on non-auth pages */}
          <NavSpacer />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
