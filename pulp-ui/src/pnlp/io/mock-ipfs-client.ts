import { PrivateKey } from '@textile/hub';
import { IpfsService } from 'pnlp/client';
import { IpfsHash, IpnsHash } from 'pnlp/domain';

class MockIpfsClient implements IpfsService {
  private ipns_map: { [key: string]: string } = {
    tny58: 'mock_ipfs_hash',
  };
  private fs: { [key: string]: any } = {
    ipfs: {
      mock_ipfs_hash: {
        'the-pulp-dev-blog-17': {
          '.pnlp.json': {
            slug: 'the-pulp-dev-blog-17',
            founder: '0x5d20cafc82fede339acff0d3097b07b3e3e940b5',
            articles: {},
            properties: { title: 'The Pulp Dev Blog', tagline: 'test', img_url: '', header_url: '', theme: {}, tags: {} },
          },
        },
      },
    },
  };

  public async writeData(path: string, content: Buffer, identity: PrivateKey): Promise<{ ipns_hash: IpnsHash; links: any }> {
    const dirs = [...path.split('/')];
    let current_level = this.fs;
    dirs.forEach((value, i) => {
      if (i < dirs.length - 1) {
        current_level[value] = {};
        current_level = current_level[value];
        console.log(`adding ${value} deep`);
      } else {
        console.log(`content at ${JSON.stringify(value)}`);
        current_level[value] = JSON.parse(content.toString());
      }
    });

    const hash = (Math.random() + 1).toString(36).substring(7);
    this.ipns_map[hash] = path;

    console.log('wrote data:');
    console.log('fs:');
    console.log(JSON.stringify(this.fs));
    console.log('ipns_map:');
    console.log(JSON.stringify(this.ipns_map));

    return {
      ipns_hash: hash,
      links: {},
    };
  }

  public async lsIpns(path: string, identity: PrivateKey): Promise<string[]> {
    const keys = Object.keys(this.fs['ipfs']['mock_ipfs_hash']);
    return keys;
  }

  public async catIpfsJson<T>(path: string, identity?: PrivateKey, progress?: (num?: number) => void): Promise<T> {
    const dirs = [...path.split('/')];
    let current_level = this.fs;
    dirs.forEach((value, i) => {
      current_level = current_level[value];
    });

    console.log(`cat ${path}:`);
    console.log(current_level);

    return Promise.resolve(current_level as T);
  }

  public async resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash> {
    return Promise.resolve(this.ipns_map[ipns_hash]);
  }
}

export const mock_ipfs_client: MockIpfsClient = new MockIpfsClient();
