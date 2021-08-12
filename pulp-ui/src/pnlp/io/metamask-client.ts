import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { keccak256 } from '@ethersproject/keccak256';
import { ExternalProvider, JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import SuperfluidSDK from '@superfluid-finance/js-sdk';
import { PrivateKey } from '@textile/hub';
import { BlockchainService } from 'pnlp/client';
import { EnsAlias, EthereumAddress, EthereumTransactionId, IpfsHash, PublicationMetadata, SubscriberList } from 'pnlp/domain';
import ContractJson from './pnlp.json';

type WindowInstanceWithEthereum = Window &
  typeof globalThis & {
    ethereum: ExternalProvider & {
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (event: string, onChange: (accounts: string[]) => any) => Promise<any>;
    };
  };

export class MetamaskClient implements BlockchainService {
  private contractAbi = ContractJson.abi;
  //contract address in ROPSTEN
  // private contractAddress: EthereumAddress = '0x5B64b955039Aca748b42fCf0942F33A3a530A0e9'; // ropsten
  private contractAddress: EthereumAddress = '0x8C4533716A13587481d74dd44b49b43f284298D8'; // rinkeby
  //local contract address
  //private contractAddress: EthereumAddress = '0x6e7987EC732832c9bEA4712156985da2CC72018b';

  private provider: Web3Provider;
  private signer: JsonRpcSigner;
  private contract: Contract;
  private superfluid: any;
  private superfluid_initialized = false;

  constructor() {
    if (!this.contractAddress) {
      throw new Error('The contractAddress for pnlp is not defined. If you see this in production, please create a github issue for the pnlp team.');
    }

    if (!(window as WindowInstanceWithEthereum).ethereum) {
      throw new Error('Ethereum is not connected. Please download Metamask from https://metamask.io/download.html');
    }

    console.debug('initializing web3 provider...');
    this.provider = new Web3Provider((window as WindowInstanceWithEthereum).ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new Contract(this.contractAddress, this.contractAbi, this.signer);

    this.superfluid = new SuperfluidSDK.Framework({ web3: this.provider });
  }

  public async createPublication(publication_slug: string, ipns_hash: IpfsHash): Promise<EthereumTransactionId> {
    console.debug(`creating publication on ethereum: ${publication_slug}:${ipns_hash}`);
    const transaction = await this.contract.functions.createPublication(publication_slug, ipns_hash);
    console.debug('transaction result: ', transaction);
    return transaction.hash;
  }

  public async awaitTransaction(transaction: string) {
    return this.provider.waitForTransaction(transaction, 1, 120000);
  }

  public async getPublication(publication_slug: string): Promise<PublicationMetadata> {
    type EthereumPublication = [string, string, BigNumber] & {
      ipnsHash: string;
      publisher: string;
      timestamp: BigNumber;
    };
    console.debug(`fetching publication ${publication_slug} from ethereum blockchain...`);

    // TODO:ERROR_1:
    // call revert exception (method="publications(string)", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.0.1)
    const publication: EthereumPublication = await this.contract.functions.publications(publication_slug);
    console.log('publication: ', publication);
    if (!publication) {
      throw new Error('Cannot get publication');
    }

    // If a publication_slug does not exist, throw
    if (publication.ipnsHash === '' && publication.publisher === '0x0000000000000000000000000000000000000000' && publication.timestamp.toHexString() === '0x00') {
      throw new Error('Publication does not exist');
    }

    // TODO:PUBLICATION_AUTHOR:
    console.debug(`found publication at ${publication.ipnsHash} published by ${publication.publisher} on ${publication.timestamp}`);

    return {
      ipns: publication.ipnsHash.replace('ipns/', ''), // TODO: we should remove the prefix from the contract
      tx: 'TODO',
      publisher: publication.publisher,
      timestamp: new Date(publication.timestamp.toNumber() * 1000),
    };
  }

  public async publishArticle(publication_slug: string, ipfs_hash: IpfsHash): Promise<EthereumTransactionId> {
    if (!publication_slug || !ipfs_hash) {
      throw new Error(`publication_slug (${publication_slug}) and ipfs_hash (${ipfs_hash}) are required fields`);
    }

    console.debug(`creating article on ethereum: ${publication_slug}:${ipfs_hash}`);

    const transaction = await this.contract.functions.publishArticle(publication_slug, ipfs_hash);
    console.debug('transaction result: ', transaction);
    return transaction.hash;
  }

  public async getAccount(onChange?: Function): Promise<EthereumAddress> {
    const accounts = await (window as WindowInstanceWithEthereum).ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new Error('No account is provided. Please provide an account to this application.');
    }

    if (onChange) {
      console.log('setting hook...');
      (window as WindowInstanceWithEthereum).ethereum.on('accountsChanged', function (accounts) {
        console.log('ethereum just changed accounts...');
        console.log(accounts);
        onChange(accounts[0]);
      });
    }

    return accounts[0];
  }

  // From https://github.com/textileio/js-threads/blob/master/packages/crypto/src/ed25519.ts
  private readonly constants = {
    PUBLIC_KEY_BYTE_LENGTH: 32,
    PRIVATE_KEY_BYTE_LENGTH: 32,
    SEED_BYTE_LENGTH: 32,
    SIGN_BYTE_LENGTH: 64,
    HASH_BYTE_LENGTH: 64,
  };

  public async lookupEns(address: EthereumAddress): Promise<EnsAlias | undefined> {
    const ens_alias = this.provider.lookupAddress(address).catch(e => {
      console.log("Could not communicate with ENS. This is expected if you're not on ropsten or mainnet." + e);
      return undefined;
    });
    return ens_alias;
  }

  // Modified from https://github.com/textileio/js-threads/blob/master/packages/crypto/src/ed25519.ts
  public async generatePnlpIdentity(ethereumAddress: EthereumAddress): Promise<PrivateKey> {
    const message = this.generateMessageForEntropy(ethereumAddress, 'pnlp');
    const signedText = await this.signText(message);
    const hash = keccak256(signedText);

    // The following line converts the hash in hex to an array of 32 integers.
    const segment = hash
      .replace('0x', '') // Gets rid of the '0x' prefix
      .match(/.{2}/g); // Segments the string each two hex charachers. Each element of the array is one binary digit.

    const array = segment?.map(hexNoPrefix => BigNumber.from('0x' + hexNoPrefix).toNumber()) || []; // Convert hex string to number
    if (array?.length !== 32) {
      throw new Error('Hash of signature is not the correct size! Something went wrong!');
    }

    return PrivateKey.fromRawEd25519Seed(Uint8Array.from(array));
  }

  public async subscribe(author: EthereumAddress, token: EthereumAddress, flowRate: number) {
    if (!this.superfluid_initialized) {
      this.initializeSuperfluid();
    }

    const subscriber_address = await this.getAccount();

    const subscriber = this.superfluid.user({
      address: subscriber_address,
      token: token,
    });

    await subscriber.flow({ recipient: author, flowRate });
  }

  public async listSubscribers(token: EthereumAddress): Promise<SubscriberList> {
    if (!this.superfluid_initialized) {
      this.initializeSuperfluid();
    }

    const author_address = await this.getAccount();

    const author = this.superfluid.user({
      address: author_address,
      token: token,
    });

    const details = await author.details();

    return {
      subscribers: details.cfa.flows.inFlows,
    };
  }

  public async reviewArticle(ipfs_hash: IpfsHash, approved: boolean, rating: number): Promise<EthereumTransactionId> {
    const transaction = await this.contract.functions.revewArticle(ipfs_hash, approved, rating);
    console.debug('transaction result: ' + JSON.stringify(transaction));
    return transaction.hash;
  }

  public async requestReview(ipfs_hash: IpfsHash, reviewer: EthereumAddress): Promise<EthereumTransactionId> {
    const transaction = await this.contract.functions.requestReview(ipfs_hash, reviewer);
    console.debug('transaction result: ' + JSON.stringify(transaction));
    return transaction.hash;
  }

  private generateMessageForEntropy(ethereum_address: EthereumAddress, application_name: string): string {
    return (
      '******************************************************************************** \n' +
      'READ THIS MESSAGE CAREFULLY. \n' +
      'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
      'ACCESS TO THIS APPLICATION. \n' +
      'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
      'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
      '******************************************************************************** \n' +
      'The Ethereum address used by this application is: \n' +
      '\n' +
      ethereum_address +
      '\n' +
      '\n' +
      '\n' +
      'By signing this message, you authorize the current application to use the \n' +
      'following app associated with the above address: \n' +
      '\n' +
      application_name +
      '\n' +
      '\n' +
      '\n' +
      '******************************************************************************** \n' +
      'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
      'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
      'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
      'WRITE ACCESS TO THIS APPLICATION. \n' +
      '******************************************************************************** \n'
    );
  }

  private async signText(text: string): Promise<string> {
    return this.signer.signMessage(text);
  }

  private async initializeSuperfluid(): Promise<void> {
    await this.superfluid.initialize();
    this.superfluid_initialized = true;
  }
}

export const metamask_client: MetamaskClient = new MetamaskClient();
