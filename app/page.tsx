/* eslint-disable react/button-has-type */

'use client';

import { CHAIN_NAMESPACES, IProvider } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { useEffect, useState } from 'react';

import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

import RPC from '../lib/ethersRPC'; // for using ethers.js

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!; // get from https://dashboard.web3auth.io

export default function HomePage() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const lweb3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1',
            rpcTarget: 'https://rpc.ankr.com/eth', // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan
          uiConfig: {
            appName: 'Mantine PWA App',
            mode: 'light',
            // loginMethodsOrder: ['apple', 'google', 'twitter'],
            logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
            logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
            defaultLanguage: 'ja', // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: 'emailLogin', // 'externalLogin' | 'socialLogin' | 'emailLogin'
          },
          web3AuthNetwork: 'sapphire_devnet',
        });
        setWeb3auth(lweb3auth);
        console.log(lweb3auth);

        await lweb3auth.initModal();
        if (lweb3auth.connected) {
          setLoggedIn(true);
          const web3authProvider = await lweb3auth.connect();
          setProvider(web3authProvider);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      alert('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connect();
    setLoggedIn(true);
    setProvider(web3authProvider);
  };

  const getChainId = async () => {
    if (!provider) {
      alert('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    alert(chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      alert('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    alert(address);
  };

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  const loggedInView = (
    <>
      <p> Logged In !!</p>
      <button onClick={getChainId}>
        Get Chain ID
      </button>
      <button onClick={getAccounts}>
        Get My Address
      </button>
    </>
  )

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
    </>
  );
}
