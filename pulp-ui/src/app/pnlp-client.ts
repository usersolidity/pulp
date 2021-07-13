import { PnlpClient } from 'pnlp/client';
import { metamask_client } from 'pnlp/io/metamask-client';
import { textile_client } from 'pnlp/io/textile-client';

/**
 * instantiate the pnlp_client with the metamask and space_daemon connections, we can always toggle these later
 */
export const pnlp_client = new PnlpClient(metamask_client, textile_client);
