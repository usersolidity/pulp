import { PrivateKey } from '@textile/hub';
import {
  ArticleDto,
  ArticleEntity,
  EnsAlias,
  EthereumAddress,
  EthereumTransactionId,
  IpfsHash,
  IpnsHash,
  PnlpConstant,
  PublicationDto,
  PublicationEntity,
  PublicationMetadata,
  PublicationSettingsEntity
} from 'pnlp/domain';
import { PnlpIdentity } from 'pnlp/identity';

export interface BlockchainService {
  createPublication(publication_slug: string, ipns_address: IpnsHash): Promise<EthereumTransactionId>;

  getPublication(publication_slug: string): Promise<PublicationMetadata>;

  publishArticle(publication_slug: string, ipfs_hash: IpfsHash): Promise<EthereumTransactionId>;

  awaitTransaction(transactionId: EthereumTransactionId): Promise<any>; //TODO: transaction result metadata

  getAccount(): Promise<EthereumAddress>;

  generatePnlpIdentity(ethereumAddress: EthereumAddress): Promise<PrivateKey>;

  lookupEns(address: EthereumAddress): Promise<EnsAlias | undefined>;
}

export interface IpfsService {
  writeData(path: string, buffer: Buffer, identity: PrivateKey): Promise<IpnsHash>;

  catIpfsJson<T>(path: string, identity?: PrivateKey): Promise<T>;

  resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash>;

  lsIpns(path: string, identity: PrivateKey): Promise<string[]>;
}

export interface SmtpService {
  send(...args: any[]): Promise<any>; //TODO
}

/**
 * TODO: The PnlpClient and associated interfaces and types should eventually be split into its own library.
 * TODO: Include interfaces for signing transactions and updating IPNS directories here.
 * TODO: Include "establishIdentity" here.
 *
 * This is the reference client for the pnlp protocol.
 */
export class PnlpClient {
  constructor(private blockchain_service: BlockchainService, private ipfs_service: IpfsService) { }

  public async lookupEns(ethereum_address: EthereumAddress): Promise<EnsAlias | undefined> {
    return this.blockchain_service.lookupEns(ethereum_address);
  }

  public async establishIdentity(): Promise<PnlpIdentity> {
    const ethereumAddress = await this.blockchain_service.getAccount();
    const ipns_identity = await this.blockchain_service.generatePnlpIdentity(ethereumAddress);

    return {
      ipns_key: ipns_identity,
      ethereum_address: ethereumAddress,
    };
  }

  public async createPublication(publication: PublicationEntity, identity: PrivateKey): Promise<PublicationDto> {
    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);

    const buffer = Buffer.from(JSON.stringify(publication, null, 2));
    const path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    const ipns_address = await this.ipfs_service.writeData(path, buffer, identity);
    console.debug('ipns_address: ', ipns_address);

    const settings = Buffer.from(JSON.stringify({}, null, 2));
    const settings_path = `${publication.slug}/${PnlpConstant.SETTINGS_FILENAME}`;
    const settings_ipns_address = await this.ipfs_service.writeData(settings_path, settings, identity);
    console.log('settings_ipns_address: ', settings_ipns_address);

    const transaction_hash = await this.blockchain_service.createPublication(publication.slug, ipns_address);

    // TODO: consider writing some of the metadata back to the PublicationEntity for reverse-lookups?
    // // write to ipfs again
    // const new_buffer = Buffer.from(JSON.stringify(publication_with_metadata, null, 2));
    // await this.ipfs_service.writeData(path, new_buffer);

    return {
      publication,
      metadata: {
        tx: transaction_hash,
        ipns: ipns_address,
        founder: publication.founder,
        timestamp: new Date(), // not the true, persisted date
      },
    };
  }

  public async updatePublication(publication: PublicationEntity, identity: PrivateKey): Promise<PublicationEntity> {
    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);

    const buffer = Buffer.from(JSON.stringify(publication, null, 2));
    const path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    const ipns_address = await this.ipfs_service.writeData(path, buffer, identity);
    console.debug('ipns_address: ', ipns_address);

    return publication;
  }

  public async loadPublication(publication_slug: string): Promise<PublicationEntity> {
    console.debug(`fetching ${publication_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns);

    const path = `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.INDEX_FILENAME}`;
    const publication = await this.ipfs_service.catIpfsJson<PublicationEntity>(path);

    return publication;
  }

  public async updatePublicationSettings(publication_slug: string, settings: PublicationSettingsEntity, identity: PrivateKey): Promise<PublicationSettingsEntity> {
    console.debug(`updating publication settings: ${JSON.stringify(settings)}`);

    // TODO: encrypt settings with user key
    const buffer = Buffer.from(JSON.stringify(settings, null, 2));
    const path = `${publication_slug}/${PnlpConstant.INDEX_FILENAME}`;
    const ipns_address = await this.ipfs_service.writeData(path, buffer, identity);
    console.debug('ipns_address: ', ipns_address);

    return settings;
  }

  public async loadPublicationSettings(publication_slug: string, identity: PrivateKey): Promise<PublicationSettingsEntity> {
    console.debug(`fetching settings for ${publication_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns);

    // TODO: decrypt settings with user key
    const path = `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.SETTINGS_FILENAME}`;
    const settings = await this.ipfs_service.catIpfsJson<PublicationSettingsEntity>(path, identity);

    return settings;
  }

  public async listPublications(identity: PrivateKey): Promise<string[]> {
    console.debug(`listing publications...`);
    const files = await this.ipfs_service.lsIpns(PnlpConstant.ROOT, identity);
    if (!files) {
      throw new Error(`The root publication path does not exist or is not visible`);
    }
    return files.filter(f => PnlpConstant.RESERVED_NAMES.every(r => f !== r));
  }

  public async publishArticle(article: ArticleEntity, identity: PrivateKey): Promise<ArticleDto> {
    console.debug(`publishing article ${article.slug}; ${article.title}; subtitle length ${article.subtitle?.length}; content length ${article.content?.length}`);

    const article_buffer = Buffer.from(JSON.stringify(article, null, 2));
    const article_path = `${article.publication_slug}/${article.slug}`;
    const ipns_address = await this.ipfs_service.writeData(article_path, article_buffer, identity);
    console.debug('ipns_address: ', ipns_address);

    const bucket_address = await this.ipfs_service.resolveIpns(ipns_address);
    const ipfs_address = `${bucket_address}/${article.publication_slug}/${article.slug}`;

    const transaction_hash = await this.blockchain_service.publishArticle(article.publication_slug, ipfs_address);

    // update publication with new transaction ID and article slug
    const publication = await this.loadPublication(article.publication_slug);
    publication.articles = publication.articles || {};
    publication.articles[article.slug] = {
      tx: transaction_hash,
      title: article.title,
      ipfs: ipfs_address,
      author: article.author,
      subtitle: article.subtitle,
    };

    const publication_buffer = Buffer.from(JSON.stringify(publication, null, 2));
    const publication_path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    await this.ipfs_service.writeData(publication_path, publication_buffer, identity);

    return {
      article,
      metadata: {
        ipfs: ipfs_address,
        ipns: ipns_address,
        tx: transaction_hash,
      },
    };
  }

  public async loadArticle(publication_slug: string, article_slug: string): Promise<{ publication: PublicationEntity; article: ArticleDto }> {
    console.debug(`fetching article: ${publication_slug}/${article_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);
    const ipns_hash = publication_record.ipns;
    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns);

    const article = await this.ipfs_service.catIpfsJson<ArticleEntity>(`/ipfs/${ipfs_hash}/${publication_slug}/${article_slug}`);

    const publication = await this.ipfs_service.catIpfsJson<PublicationEntity>(`/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.INDEX_FILENAME}`);

    if (!article) {
      throw new Error(`Article pulp/${publication_slug}/${article_slug} does not exist or is not visible`);
    }

    return {
      publication,
      article: {
        article,
        metadata: {
          ipfs: ipfs_hash,
          ipns: ipns_hash,
          tx: 'not-implemented: TODO: do we need to get TransactionId in this direction?',
        },
      },
    };
  }

  public async awaitTransaction(transactionId: string) {
    return this.blockchain_service.awaitTransaction(transactionId);
  }
}
