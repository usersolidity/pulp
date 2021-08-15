import { PrivateKey } from '@textile/hub';
import { create } from 'ipfs-http-client';
import { IpfsService } from 'pnlp/client';
import { IpfsHash, IpnsHash } from 'pnlp/domain';

class PinataClient implements IpfsService {
  private ipfs_client = create({
    url: 'https://pulp.mypinata.cloud',
    // headers: {
    //   Origin: 'http://localhost:3000',
    // },
  });

  public async writeData(path: string, content: Buffer, identity: PrivateKey): Promise<{ ipns_hash: IpnsHash; links: any }> {
    console.debug(`Writing ${content.length} bytes to ${path}`);
    const add_result = await this.ipfs_client.add({
      path: path,
      content,
    });
    console.log('add_result');
    console.log(add_result);
    const publish_result = await this.ipfs_client.name.publish(add_result.cid);
    console.log('publish_result');
    console.log(publish_result);
    return {
      ipns_hash: publish_result.name,
      links: {},
    };
  }

  public async lsIpns(path: string, identity: PrivateKey): Promise<string[]> {
    console.debug(`listPath: ${path}`);
    const ls_res = this.ipfs_client.ls(path);
    console.log(JSON.stringify(ls_res));

    let local = '';

    for await (const chunk of ls_res) {
      local += chunk;
    }
    console.log('local');
    console.log(local);
    return ['TODO'];
  }

  public async catIpfsJson<T>(path: string, identity?: PrivateKey, progress?: (num?: number) => void): Promise<T> {
    console.debug(`pullIpfsPath: ${path}`);
    const stream = this.ipfs_client.cat(path);
    return this.convertIpfsRequestToJson(stream);
  }

  public async resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash> {
    if (!ipns_hash) {
      throw new Error('ipns_hash required: ' + ipns_hash);
    }
    console.log(`resolving ipns/${ipns_hash}...`);
    const response = this.ipfs_client.name.resolve(ipns_hash);

    const ipfs_hash = await this.convertIpnsResolveToString(response);
    console.log(`ipns/${ipns_hash} resolved to ipfs/${ipfs_hash}`);
    return ipfs_hash;
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

  private async convertIpnsResolveToString(stream: AsyncIterable<string>): Promise<string> {
    let local = '';

    for await (const chunk of stream) {
      local += chunk;
    }
    return local;
  }
}

export const pinata_client: PinataClient = new PinataClient();
