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
  PublicationSettingsEntity,
  ReviewDto,
  ReviewEntity,
  ReviewRequestDto,
  ReviewRequestEntity,
  SubscriberList,
} from 'pnlp/domain';
import { PnlpIdentity } from 'pnlp/identity';

export interface BlockchainService {
  createPublication(publication_slug: string, ipns_address: IpnsHash): Promise<EthereumTransactionId>;

  getPublication(publication_slug: string): Promise<PublicationMetadata>;

  subscribe(recipient: EthereumAddress, token: EthereumAddress, flowRate: number);

  publishArticle(publication_slug: string, ipfs_hash: IpfsHash): Promise<EthereumTransactionId>;

  reviewArticle(ipfs_hash: IpfsHash, approved: boolean, rating: number): Promise<EthereumTransactionId>;

  requestReview(ipfs_hash: IpfsHash, reviewer: EthereumAddress): Promise<EthereumTransactionId>;

  listReviews(ipfs_hash: IpfsHash): Promise<ReviewEntity[]>;

  awaitTransaction(transactionId: EthereumTransactionId): Promise<any>; //TODO: transaction result metadata

  getAccount(onChange?: Function): Promise<EthereumAddress>;

  generatePnlpIdentity(ethereumAddress: EthereumAddress): Promise<PrivateKey>;

  lookupEns(address: EthereumAddress): Promise<EnsAlias | undefined>;

  listSubscribers(token: EthereumAddress): Promise<SubscriberList>;
}

export interface IpfsService {
  writeData(path: string, buffer: Buffer, identity: PrivateKey): Promise<{ ipns_hash: IpnsHash; links: any }>;

  catIpfsJson<T>(path: string): Promise<T>;

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

  public async establishIdentity(onChange?: Function): Promise<PnlpIdentity> {
    const ethereumAddress = await this.blockchain_service.getAccount(onChange);
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
    const { ipns_hash } = await this.ipfs_service.writeData(path, buffer, identity);
    console.debug('ipns_address: ', ipns_hash);

    const settings = Buffer.from(JSON.stringify({}, null, 2));
    const settings_path = `${publication.slug}/${PnlpConstant.SETTINGS_FILENAME}`;
    const { ipns_hash: settings_ipns_address } = await this.ipfs_service.writeData(settings_path, settings, identity);
    console.log('settings_ipns_address: ', settings_ipns_address);

    const transaction_hash = await this.blockchain_service.createPublication(publication.slug, ipns_hash);

    // TODO: consider writing some of the metadata back to the PublicationEntity for reverse-lookups?
    // // write to ipfs again
    // const new_buffer = Buffer.from(JSON.stringify(publication_with_metadata, null, 2));
    // await this.ipfs_service.writeData(path, new_buffer);

    return {
      publication,
      metadata: {
        tx: transaction_hash,
        ipns: ipns_hash,
        publisher: publication.founder,
        timestamp: new Date(), // not the true, persisted date
      },
    };
  }

  public async updatePublication(publication: PublicationEntity, identity: PrivateKey): Promise<PublicationEntity> {
    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);

    const buffer = Buffer.from(JSON.stringify(publication, null, 2));
    const path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    const { ipns_hash } = await this.ipfs_service.writeData(path, buffer, identity);
    console.debug('ipns_hash: ', ipns_hash);

    return publication;
  }

  public async loadPublication(publication_slug: string): Promise<PublicationDto> {
    console.debug(`loadPublication: ${publication_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);
    console.debug(`retrieved publication_record from blockchain: ${JSON.stringify(publication_record)}...`);

    console.debug(`going to resolve ipns_hash: ${publication_record.ipns}...`);
    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns);
    console.debug(`resolved to ipfs_hash: ${ipfs_hash}`);

    const path = `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.INDEX_FILENAME}`;
    console.debug(`pulling data from publication path: ${path}`);
    const publication = await this.ipfs_service.catIpfsJson<PublicationEntity>(path);
    console.debug(`loaded publication: ${JSON.stringify(publication)}`);

    return {
      metadata: publication_record,
      publication,
    };
  }

  public async updatePublicationSettings(publication_slug: string, settings: PublicationSettingsEntity, identity: PrivateKey): Promise<PublicationSettingsEntity> {
    console.debug(`updating publication settings: ${JSON.stringify(settings)}`);

    // TODO: encrypt settings with user key
    const buffer = Buffer.from(JSON.stringify(settings, null, 2));
    const path = `${publication_slug}/${PnlpConstant.INDEX_FILENAME}`;
    const { ipns_hash } = await this.ipfs_service.writeData(path, buffer, identity);
    console.debug('ipns_hash: ', ipns_hash);

    return settings;
  }

  public async loadPublicationSettings(publication_slug: string): Promise<PublicationSettingsEntity> {
    console.debug(`fetching settings for ${publication_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns);

    // TODO: decrypt settings with user key
    const path = `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.SETTINGS_FILENAME}`;
    const settings = await this.ipfs_service.catIpfsJson<PublicationSettingsEntity>(path);

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
    const { ipns_hash } = await this.ipfs_service.writeData(article_path, article_buffer, identity);
    console.debug('ipns_address: ', ipns_hash);

    console.debug(`resolving ipns_address: ${ipns_hash}`);
    const ipfs_address = await this.ipfs_service.resolveIpns(ipns_hash);
    console.debug(`resolved to ipfs_address: ${ipfs_address}`);
    const article_address = `${ipfs_address}/${article.publication_slug}/${article.slug}`;
    console.debug(`using article address: ${ipfs_address}`);

    console.debug(`publishing article to blockchain...`);
    const transaction_hash = await this.blockchain_service.publishArticle(article.publication_slug, article_address);
    console.debug(`published article in transaction: ${transaction_hash}`);

    // update publication with new transaction ID and article slug
    console.debug(`loading publication to update articles: ${article.publication_slug}`);
    const { publication } = await this.loadPublication(article.publication_slug);
    console.debug(`loaded publication: ${publication.slug}`);

    publication.articles = publication.articles || {};
    publication.articles[article.slug] = {
      tx: transaction_hash,
      title: article.title,
      ipfs: article_address,
      author: article.author,
      subtitle: article.subtitle,
    };

    const publication_buffer = Buffer.from(JSON.stringify(publication, null, 2));

    const publication_path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    console.debug(`writing publication back to path: ${publication_path}`);
    const { links } = await this.ipfs_service.writeData(publication_path, publication_buffer, identity);
    console.debug(`wrote data, see links: ${JSON.stringify(links)}`);

    return {
      article,
      metadata: {
        ipfs: ipfs_address,
        ipns: ipns_hash,
        tx: transaction_hash,
      },
      reviews: [],
    };
  }

  public async loadArticle(publication_slug: string, article_slug: string): Promise<ArticleDto> {
    console.debug(`loading article: ${publication_slug}/${article_slug}...`);

    console.debug(`getting publication from blockchain: ${publication_slug}...`);
    const publication_record = await this.blockchain_service.getPublication(publication_slug);
    console.debug(`found publication_record by founder: ${publication_record.publisher}...`);
    const ipns_hash = publication_record.ipns;
    console.debug(`resolving ipfs_hash from ipns_hash: ${publication_record.ipns}...`);
    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns);
    console.debug(`resolved to ipfs_hash: ${ipfs_hash}...`);

    const path = `/ipfs/${ipfs_hash}/${publication_slug}/${article_slug}`;
    console.debug(`loading article at path: ${path}...`);
    const article = await this.ipfs_service.catIpfsJson<ArticleEntity>(path);
    console.debug(`loaded article: ${article.title}`);

    if (!article) {
      throw new Error(`Article pulp/${publication_slug}/${article_slug} does not exist or is not visible`);
    }

    // TODO: we can use Promise.all() to parallelize a lot of these requests
    console.debug(`loading reviews for article: ${ipfs_hash}...`);
    const reviews = await this.blockchain_service.listReviews(ipfs_hash);
    console.debug(`loaded ${reviews.length} reviews`);

    return {
      article,
      metadata: {
        ipfs: ipfs_hash,
        ipns: ipns_hash,
        tx: 'not-implemented: TODO: do we need to get TransactionId in this direction?',
      },
      reviews,
    };
  }

  public async reviewArticle(review: ReviewEntity): Promise<ReviewDto> {
    console.debug(`reviewing an article: ${JSON.stringify(review)}`);

    const transaction_hash = await this.blockchain_service.reviewArticle(review.article, review.approved, review.rating);
    console.debug(`review sent in transaction: ${transaction_hash}`);

    return {
      review,
      metadata: {
        tx: transaction_hash,
        timestamp: new Date(), // not the true, persisted date
      },
    };
  }

  public async requestReview(review_request: ReviewRequestEntity): Promise<ReviewRequestDto> {
    console.debug(`requesting review for article: ${JSON.stringify(review_request)}`);

    const transaction_hash = await this.blockchain_service.requestReview(review_request.article, review_request.reviewer);

    return {
      review_request,
      metadata: {
        tx: transaction_hash,
        timestamp: new Date(), // TODO: we should be able to get this from the returned transaction object
      },
    };
  }

  public async awaitTransaction(transactionId: string) {
    return this.blockchain_service.awaitTransaction(transactionId);
  }

  public async subscribe(publication_slug: string, token: EthereumAddress, flow_rate: number) {
    console.debug(`subscribing to ${publication_slug} with token: ${token} at rate: ${flow_rate}...`);

    console.debug(`fetching publication: ${publication_slug}...`);
    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    console.debug(`subscribing to publisher ${publication_record.publisher} with token: ${token} at rate: ${flow_rate}...`);
    await this.blockchain_service.subscribe(publication_record.publisher, token, flow_rate);
    console.debug(`subscribe complete`);

    return publication_record;
  }

  public async listSubscribers(token: EthereumAddress): Promise<SubscriberList> {
    return this.blockchain_service.listSubscribers(token);
  }
}
