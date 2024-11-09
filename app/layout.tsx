"use client";

import { Inter } from "next/font/google";
import { Amplify } from "aws-amplify";
import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./app.css";

import { Navbar } from "../src/components/Navbar";
import { Footer } from "../src/components/Footer";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createTheme from '@mui/material/styles/createTheme';
const theme = createTheme({
  // You can customize your theme here
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="en">
      <body className={inter.className}>
        <Authenticator>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </Authenticator>
      </body>
    </html>
    </ThemeProvider>    
  );
}
