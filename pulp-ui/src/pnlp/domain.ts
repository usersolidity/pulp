import { BigNumber } from '@ethersproject/bignumber';

export interface PnlpError {
  message: string; // TODO: this is useful in redux state but probably doesn't belong in the domain.ts. it also needs to carry more information from the Error() and not just the message
}

export class PnlpConstant {
  public static INDEX_FILENAME = '.pnlp.json';
  public static SETTINGS_FILENAME = '.pnlp.author.json';
  public static RESERVED_NAMES = [PnlpConstant.INDEX_FILENAME, PnlpConstant.SETTINGS_FILENAME, '.textileseed', '.pnlp'];
  public static ROOT = '/';
}

export const DEFAULT_FLOW = '385802469136';
export const DAIx_CONTRACT_ADDRESS = '0x88271d333C72e51516B67f5567c728E702b3eeE8';

/**
 * Begin Domain
 */
export type IpfsHash = string;
export type IpnsHash = string;
export type EthereumAddress = string;
export type EnsAlias = string;
export type EthereumTransactionId = string;
export type EthereumContractAddress = string;
export type EmailAddress = string;
export type SmsAddress = string;
export type TwitterAddress = string;
export type BitcloutAddress = string;

export type FriendlyName = string;

export function friendlyName(ethereum_address?: EthereumAddress, ens_alias?: EnsAlias) {
  return ens_alias || ethereum_address ? `${ethereum_address?.slice(0, 5)}..${ethereum_address?.slice(-3)}` : '0x0000';
}

export interface PublicationRecord {
  ipnsHash: string;
  publisher: string;
  timestamp: BigNumber;
}

/**
 * Corresponds to an IPFS file,
 * all public Publication data lives here
 */
export interface PublicationEntity {
  slug: string;
  previous_version?: IpfsHash;
  founder: EthereumAddress;
  articles: {
    [article_slug: string]: ArticleSummaryEntity;
  };
  properties: PublicationPropertiesEntity;
  read_function?: EthereumContractAddress; // a method by which a caller can read encrypted articles
}

export interface SubscriberList {
  subscribers: Inflow[];
}

export interface Inflow {
  sender: EthereumAddress;
  receiver: EthereumAddress;
  flowRate: string;
}

export interface ReviewEntity {
  approved: boolean;
  rating: number;
  article: IpfsHash;
  reviewer: EthereumAddress;
}

export interface ReviewRequestEntity {
  article: IpfsHash;
  reviewer: EthereumAddress;
}

export interface ArticleSummaryEntity {
  tx?: EthereumTransactionId;
  ipfs?: IpfsHash;
  author?: EthereumAddress;
  title?: string;
  subtitle?: string;
}

export interface PublicationPropertiesEntity {
  title: string;
  tagline: string;
  img_url: IpfsHash;
  header_url: IpfsHash;
  theme: {
    primary?: string;
    text?: string;
    textSecondary?: string;
    background?: string;
    backgroundVariant?: string;
    border?: string;
    borderLight?: string;
  };
  tags: { [key: string]: string };
}

/**
 * Corresponds to an IPFS file,
 * all private Publication data lives here
 */
export interface PublicationSettingsEntity {
  subscribers?: { [address: string]: SubscriberEntity };
  email?: EmailAddress;
  stats?: StatsEntity;
}

export interface SubscriberEntity {
  address: EthereumAddress;
  email?: EmailAddress;
  sms?: SmsAddress;
  twitter?: TwitterAddress;
  bitclout?: BitcloutAddress;
}

export interface SubscriptionEntity {
  subscriber: EthereumAddress;
  recipient: EthereumAddress;
  amount: string;
  token: EthereumAddress;
}

export interface StatsEntity {
  articles?: {
    read_series?: {
      subscriber_address: string;
      date: Date;
      metadata?: {};
    }[];
  }[];
}

/**
 * Corresponds to an IPFS file,
 * all public Article data lives here
 */
export interface ArticleEntity {
  publication_slug: string;
  slug: string;
  publication?: IpnsHash;
  author?: EthereumAddress;
  title?: string;
  subtitle?: string;
  edit_of?: IpfsHash;
  retracted?: boolean;
  content_type?: string;
  content?: string; // TODO: bytes?
}

/**
 * Begin data transfer objects
 */
export interface PublicationMetadata {
  ipns: IpnsHash;
  tx: EthereumTransactionId;
  publisher: EthereumAddress;
  timestamp: Date;
}

export interface ArticleMetadata {
  ipfs: IpfsHash;
  tx: EthereumTransactionId;
  ipns: IpnsHash;
}

export interface ReviewMetadata {
  tx: EthereumTransactionId;
  timestamp: Date;
}

export interface ReviewRequestMetadata {
  tx: EthereumTransactionId;
  timestamp: Date;
}

export interface ArticleDto {
  metadata: ArticleMetadata;
  article: ArticleEntity;
  reviews: ReviewEntity[];
}

export interface PublicationDto {
  publication: PublicationEntity;
  metadata: PublicationMetadata;
}

export interface ReviewDto {
  review: ReviewEntity;
  metadata: ReviewMetadata;
}

export interface ReviewRequestDto {
  review_request: ReviewRequestEntity;
  metadata: ReviewMetadata;
}

export interface ArticleSlug {
  article_slug: string;
  publication_slug: string;
}
