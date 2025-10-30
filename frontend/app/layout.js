import "./globals.css";
import Navbar from "./NavBar";
import { UserProvider } from "./context/usercontext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
