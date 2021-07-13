import { PrivateKey } from 'libp2p-crypto';
import { EthereumAddress } from 'pnlp/domain';

export interface PnlpIdentity {
  ipns_key: PrivateKey;
  ethereum_address: EthereumAddress;
}
