import { useAuthenticator } from "@aws-amplify/ui-react";

export const Footer = () => {
  const { signOut } = useAuthenticator();
  return (
    <footer className="footer">
      <p>&copy; Capital Chorizo Team</p>
      <button onClick={signOut}>Sign out</button>
    </footer>
  );
};
