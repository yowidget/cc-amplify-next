"use client";

import { Inter } from "next/font/google";
import { Amplify } from "aws-amplify";
import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Authenticator>{children} </Authenticator>
      </body>
    </html>
  );
}
