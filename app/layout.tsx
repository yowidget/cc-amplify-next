"use client";
import "../styles/globals.css";
import React from "react";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../components/Home";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-capitalone-gray-light" >
        <Home/> 
        <Authenticator className="flex-1">
          <header>
            <Navbar />
          </header>
          <main className="flex-grow container mx-auto p-4">{children}</main>
        </Authenticator>
        <Footer />
      </body>
    </html>
  );
}
