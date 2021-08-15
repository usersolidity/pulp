import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { ExternalProvider, JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

import CeramicClient from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';

//3ID connect imports
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
//Document creation imports
import { TileDocument } from '@ceramicnetwork/stream-tile';
//IDX
import { IDX } from '@ceramicstudio/idx';

import WalletConnectProvider from "@walletconnect/web3-provider"; 
import Web3Modal from "web3modal"; 

type WindowInstanceWithEthereum = Window &
  typeof globalThis & {
    ethereum: ExternalProvider & {
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (event: string, onChange: (accounts: string[]) => any) => Promise<any>;
    };
};

export function Bio() {

  const API_URL = "https://ceramic-clay.3boxlabs.com";
  const ceramic = new CeramicClient(API_URL);

  const [userDID, setUserDID] = React.useState<string>('');
  const [authorName, setAuthorName] = React.useState<string>('');
  const [approval, setApproval] = React.useState<string>('');
  const [rating, setRating] = React.useState<string>('');
  const [profileMessage, setProfileMessage] = React.useState<string>('');

  

  React.useEffect(() => {
    const init = async () => {

      const modal = new Web3Modal({
        network: "rinkeby",
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: process.env.INFURA_ID,
            },
          },
        }
      });


      // const provider = new Web3Provider((window as WindowInstanceWithEthereum).ethereum);
      // const signer = provider.getSigner();
      // const addresses = await signer.getAddress();//await window.ethereum.enable();

    const provider = await modal.connect();
    const addresses = await provider.enable();
    console.log('Address: ' + addresses[0]);

      const resolver = { ...KeyDidResolver.getResolver(), ...ThreeIdResolver.getResolver(ceramic) }
      const did = new DID({ resolver });
      ceramic.did = did;

      const threeIdConnect = new ThreeIdConnect();
      const authProvider = new EthereumAuthProvider(provider, addresses[0]);
      await threeIdConnect.connect(authProvider);

      const didProvider = await threeIdConnect.getDidProvider();
      ceramic.did.setProvider(didProvider);
      await ceramic.did.authenticate();
      console.log("After ceramic.did.authenticate()")

      //set user IDX
      const userIDX = new IDX({ ceramic });
      const userDID = userIDX.id;
      console.log('DID:' + userDID);
      setUserDID(userDID);
    
      const profile: any = await userIDX.get('basicProfile', userDID);
      if(!profile){
        setProfileMessage("No profile exist for this user. Please create one.")
      } else {
        setAuthorName(profile.name);
        setApproval(profile.description.split('|')[0]);
        setRating(profile.description.split('|')[1]);
      }

    }
    init();
  }, [] );

  const createProfile = async () => {
    //userIDX.set('basicProfile', {name, description})
  }

  return (
    <Container>
      <div>
        <h2>User Profile</h2>
        <div>
          <label htmlFor="Author"><b>Author DID </b></label>  
          <input id="author" type="text" value={userDID} disabled />
        </div>
        <div>
          <label htmlFor="authorName"><b>Name </b></label>  
          <input id="authorName" type="text" value={authorName} disabled />
        </div>
        <div>
          <label htmlFor="Approval"><b>Approval </b> </label>  
          <input id="approval" type="text" value={approval} disabled />
        </div>
        <div>
          <label htmlFor="Rating"><b>Reputation Index </b></label>  
          <input id="rating" type="text" value={rating} disabled />
        </div>
        <br/>
        <div>
        <label htmlFor="profileMessage"><h4>{profileMessage}</h4> </label>  
        </div>
        <Button onClick={createProfile} variant="primary" block size="lg">
          🕵🏻‍♂️ Create/Update User Profile
        </Button>
      </div>
    </Container>
  );

}
