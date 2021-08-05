import * as React from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useSelector } from 'react-redux';
import { selectAwaitingTransaction, selectIpfsLoading, selectIpfsWriting } from 'store/app-state';

export function Loader() {
  const ipfs_loading = useSelector(selectIpfsLoading);
  const ipfs_writing = useSelector(selectIpfsWriting);
  const awaiting_tx = useSelector(selectAwaitingTransaction);

  return (
    <>
      <div style={{ width: '12px', height: '12px' }} className="mr-3">
        {awaiting_tx && (
          <Spinner animation="grow" variant="primary" role="status">
            <span className="sr-only">Writing to Ethereum...</span>
          </Spinner>
        )}
        {ipfs_loading && (
          <Spinner animation="grow" variant="primary" role="status">
            <span className="sr-only">Loading from IPFS...</span>
          </Spinner>
        )}
        {ipfs_writing && (
          <Spinner animation="grow" variant="primary" role="status">
            <span className="sr-only">Writing to IPFS...</span>
          </Spinner>
        )}
      </div>
    </>
  );
}
