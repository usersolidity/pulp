import { Buckets, KeyInfo, Links, PrivateKey } from '@textile/hub';
import axios from 'axios';
import { create } from 'ipfs-http-client';
import { IpfsService } from 'pnlp/client';
import { IpfsHash, IpnsHash } from 'pnlp/domain';

class TextileClient implements IpfsService {
  private bucketMap: Map<string, Buckets> = new Map();

  private selectedBucketKey!: string;

  private ipfs_client = create({
    url: 'https://dweb.link',
    // headers: {
    //   Origin: 'http://localhost:3000',
    // },
  });

  // TODO:11: pull this out into environment.ts
  // this is an insecure key from textile hub. it is okay to share and publish on github.
  // do NOT put production secure keys here.
  private auth: KeyInfo = {
    key: 'bqpml3jj4afgmldkggb73cpvffy',
    secret: '',
  };

  public static mapLinksToIpns(links: Links): IpnsHash {
    const ipns_string = links.ipns.replace('https://hub.textile.io/ipns/', '');
    return ipns_string;
  }

  public async writeData(path: string, content: Buffer, identity: PrivateKey): Promise<IpnsHash> {
    await this.initializeBucketIfNecessary(identity);

    // const buf = Buffer.from(JSON.stringify(content, null, 2));
    console.debug(`Writing ${content.length} bytes to ${path}`);
    await this.getSelectedBucket().pushPath(this.selectedBucketKey, path, content);
    const links_reply = await this.getSelectedBucket().links(this.selectedBucketKey);
    return TextileClient.mapLinksToIpns(links_reply);
  }

  // TODO: can we take the identity argument out of this for read-only operations?
  public async lsIpns(path: string, identity: PrivateKey): Promise<string[]> {
    await this.initializeBucketIfNecessary(identity);
    console.debug(`listPath: ${path}`);
    const res = await this.getSelectedBucket().listPath(this.selectedBucketKey, path);
    return res.item?.items.map(i => i.name) || [];
  }

  // TODO: can we take the identity argument out of this for read-only operations?
  // public async catPathJson<T>(path: string, identity: PrivateKey, progress?: (num?: number) => void): Promise<T> {
  //   await this.initializeBucketIfNecessary(identity);
  //   console.debug(`catPathJson: ${path}`);
  //   const request = this.getSelectedBucket().pullPath(this.selectedBucketKey, path, { progress });
  //   return this.convertIpfsRequestToJson(request);
  //   // const stream = this.ipfs_client.cat(path);
  //   // return await this.convertIpfsRequestToJson(stream);
  // }

  // TODO: can we take the identity argument out of this for read-only operations?
  // public async catIpfsJson<T>(path: string, identity: PrivateKey, progress?: (num?: number) => void): Promise<T> {
  //   await this.initializeBucketIfNecessary(identity);
  //   console.debug(`pullIpfsPath: ${path}`);
  //   // const request = this.getSelectedBucket().pullIpfsPath(path, { progress });
  //   // return this.convertRequestToJson(request);
  //   const stream = this.ipfs_client.cat(path);
  //   return this.convertIpfsRequestToJson(stream);
  // }

  public async catIpfsJson<T>(path: string, identity?: PrivateKey, progress?: (num?: number) => void): Promise<T> {
    console.debug(`pullIpfsPath: ${path}`);
    // const request = this.getSelectedBucket().pullIpfsPath(path, { progress });
    // return this.convertRequestToJson(request);
    const stream = this.ipfs_client.cat(path);
    return this.convertIpfsRequestToJson(stream);
  }

  /**
   * Currently the only known public mechanism for resolving IPNS is the textile website. They don't expose this
   * functionality in the API yet. Currently we're just scraping the HTML for this information.
   *
   * @param ipns_hash
   */
  public async resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash> {
    if (!ipns_hash) {
      throw new Error('ipns_hash required: ' + ipns_hash);
    }
    const response = await axios.get(`https://${ipns_hash}.ipns.hub.textile.io/`, {
      headers: {
        Accept: 'text/html',
        'Content-Type': 'application/json',
      },
      responseType: 'text',
    });

    // matches this from the textile site:  <span class="yellow">/:</span> /ipfs/bafybeicfpliv2eh25kv3w5bpl4h623ksurkj4q4lro4ac275pdm7h3kmuq
    const ipfs_regex = /<span.*ipfs\/(.*)\n/;

    const matches = ipfs_regex.exec(response.data);

    if (!matches || !matches[0].includes('span') || !matches[0].includes('ipfs') || !matches[1].length) {
      // this signals that the textile site may have changed and our scraper is broken
      throw new Error('The IPNS resolver is currently not working. Please contact pnlp development team on github.');
    }

    return matches[1];
  }

  private async convertRequestToJson<T>(request: AsyncIterableIterator<Uint8Array>): Promise<T> {
    const { value } = await request.next();
    const res = new TextDecoder('utf-8').decode(value);
    return JSON.parse(res) as T;
  }

  private async convertIpfsRequestToJson<T>(stream: AsyncIterable<Uint8Array>): Promise<T> {
    let local = new Uint8Array([]);

    for await (const chunk of stream) {
      // this is potentially an expensive buffer here... probably not a problem early though. TODO
      var temp = new Uint8Array(local.length + chunk.length);
      temp.set(local);
      temp.set(chunk, local.length);

      local = new Uint8Array(temp);
    }
    const decoded = new TextDecoder('utf-8').decode(local);
    const result: T = JSON.parse(decoded);
    return result;
  }

  private async initializeBucketIfNecessary(identity: PrivateKey) {
    if (!this.isInitialized()) {
      const { default_key, map } = await this.initBucketMap(identity);
      this.selectedBucketKey = default_key;
      this.bucketMap = map;
    }
  }

  private isInitialized() {
    return this.selectedBucketKey && this.bucketMap && this.bucketMap.size;
  }

  private async initBucketMap(identity: PrivateKey): Promise<{ default_key: string; map: Map<string, Buckets> }> {
    console.debug('initializing bucket map...');

    const buckets = await Buckets.withKeyInfo(this.auth);

    console.debug('initialized with key...');

    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity);

    console.debug('got token...');

    const res = await buckets.getOrCreate('com.textile.io');
    console.debug('created...');
    if (!res?.root) {
      throw new Error('Failed to open bucket');
    }

    const bucketMap = new Map();
    bucketMap.set(res.root.key, buckets);
    return { default_key: res.root.key, map: bucketMap };
  }

  private getSelectedBucket(): Buckets {
    const bucket = this.bucketMap.get(this.selectedBucketKey);
    if (!bucket) {
      throw new Error('Selected bucket does not exist');
    } else {
      return bucket;
    }
  }
}

export const textile_client: TextileClient = new TextileClient();
