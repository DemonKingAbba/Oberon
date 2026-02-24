import "./styles/globals.css";
import { Providers } from "./providers";

export const metadata = { title: "Oberon Web", description: "Oberon Lite dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
