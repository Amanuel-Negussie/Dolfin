// src/components/LoginButton.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()}>
      Log in using Auth0
    </Button>
  );
};

export default LoginButton;