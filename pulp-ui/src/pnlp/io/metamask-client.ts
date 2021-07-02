import { BlockchainService } from 'pnlp/client';
import { EthereumTransactionId, IpfsHash, IpnsHash, PublicationMetadata } from 'pnlp/domain';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MetamaskClient implements BlockchainService {
  async createPublication(publication_slug: string, ipns_address: IpnsHash): Promise<EthereumTransactionId> {
    // TODO:
    await sleep(1000);
    console.log('broadcasting ethereum transaction to create publication... NOT YET IMPLEMENTED');
    return Promise.resolve('not-implemented' as EthereumTransactionId);
  }

  async getPublication(publication_slug: string): Promise<PublicationMetadata> {
    // TODO:
    await sleep(1000);
    console.log('getting publication metadata ... NOT YET IMPLEMENTED');
    return Promise.resolve({
      tx: 'not-implemented',
      ipns: 'not-implemented',
      publisher: 'not-implemented',
      timestamp: new Date(),
    });
  }

  async publishArticle(publication_slug: string, ipfs_hash: IpfsHash): Promise<EthereumTransactionId> {
    // TODO:
    console.log('broadcasting ethereum transaction to publish article... NOT YET IMPLEMENTED');
    return Promise.resolve('not-implemented' as EthereumTransactionId);
  }

  async awaitTransaction(transactionId: EthereumTransactionId): Promise<any> {
    // TODO:
    await sleep(30000);
    console.log('ethereum transaction complete... NOT YET IMPLEMENTED');
    return Promise.resolve('not-implemented' as EthereumTransactionId);
  }
}

export const metamask_client: MetamaskClient = new MetamaskClient();
