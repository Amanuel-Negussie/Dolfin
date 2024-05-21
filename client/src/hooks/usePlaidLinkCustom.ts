import { usePlaidLink } from 'react-plaid-link';

const usePlaidLinkCustom = (token: string, onSuccess: (public_token: string) => void) => {
  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return { open, ready };
};

export default usePlaidLinkCustom;
