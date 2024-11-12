// app/page.tsx
"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Transacciones from "@/components/Transacciones";
import RecompensasSugeridas from "@/components/RecompensasSugeridas";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Home from "../components/Home";
Amplify.configure(outputs);

const client = generateClient<Schema>();
export default function App() {
  const { user, signOut } = useAuthenticator();
  return (
    <div className="flex flex-col">
      <h1>Bienvenido de vuelta {user?.signInDetails?.loginId}</h1>
      <Home />
      <RecompensasSugeridas />
      <Transacciones client={client} user={user} />
    </div>
  );
}
