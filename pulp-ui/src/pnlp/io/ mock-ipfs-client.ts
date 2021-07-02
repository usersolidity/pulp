import { IpfsService } from 'pnlp/client';
import { IpfsHash, IpnsHash } from 'pnlp/domain';

// TODO: use mock-fs maybe?
class MockIpfsClient implements IpfsService {
  private path_data: { [key: string]: Buffer } = {}
  private ipns_data: { [key: string]: Buffer } = {}
  private ipns_map: { [address: string]: IpfsHash } = {}

  writeData(path: string, buffer: Buffer): Promise<IpnsHash> {
    // TODO:
    const ipns_hash = '0x...';
    this.path_data[path] = buffer;
    this.path_data[ipns_hash] = buffer;
    return Promise.resolve(ipns_hash);
  }

  catIpfsJson<T>(path: string): Promise<T> {
    const json = this.convertRequestToJson<T>(this.path_data[path]);
    return Promise.resolve(json);
  }

  resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash> {
    return Promise.resolve(this.ipns_map[ipns_hash]);
  }

  lsIpns(path: string): Promise<string[]> {
    return Promise.resolve([]);
  }

  private async convertRequestToJson<T>(buffer: Buffer): Promise<T> {
    const res = new TextDecoder('utf-8').decode(buffer);
    const contents_as_json: T = JSON.parse(res);
    return contents_as_json;
  }
}

export const mock_ipfs_client: MockIpfsClient = new MockIpfsClient();
