// import { PrivateKey } from 'libp2p-crypto'; TODO: replace TextilePrivateKey with PrivateKey from libp2p
import { PrivateKey } from '@textile/hub';
import { EthereumAddress } from 'pnlp/domain';

export interface PnlpIdentity {
  ipns_key: PrivateKey;
  ethereum_address: EthereumAddress;
}
