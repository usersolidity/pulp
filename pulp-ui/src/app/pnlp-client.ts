import { PnlpClient } from 'pnlp/client';
import { metamask_client } from 'pnlp/io/metamask-client';
import { textile_client } from 'pnlp/io/textile-client';

export const pnlp_client = new PnlpClient(metamask_client, textile_client);
