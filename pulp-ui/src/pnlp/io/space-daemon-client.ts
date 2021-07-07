import { IpfsService } from 'pnlp/client';
import { IpfsHash, IpnsHash } from 'pnlp/domain';

class SpaceDaemonClient implements IpfsService {
  async writeData(path: string, buffer: Buffer): Promise<IpnsHash> {
    // TODO:
    console.log('writing ipfs data to space daemon... NOT YET IMPLEMENTED');
    return Promise.resolve('not-yet-implemented-space-daemon-write-data');
  }

  async catIpfsJson<T>(path: string): Promise<T> {
    // TODO:
    console.log('reading ipfs data from space daemon... NOT YET IMPLEMENTED');
    return Promise.resolve({} as T);
  }

  async resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash> {
    // TODO:
    console.log('resolve ipns with space daemon... NOT YET IMPLEMENTED');
    return Promise.resolve('not-yet-implemented-space-daemon-resolve-ipns');
  }

  async lsIpns(path: string): Promise<string[]> {
    // TODO:
    console.log('listing ipns directory with space daemon... NOT YET IMPLEMENTED');
    return Promise.resolve(['not-yet-implemented-space-daemon-ls-ipns']);
  }
}

export const space_daemon_client: SpaceDaemonClient = new SpaceDaemonClient();
