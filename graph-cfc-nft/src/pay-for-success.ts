import { BigInt, Address, Bytes } from '@graphprotocol/graph-ts';
import {
  AssetReceived as AssetReceivedEvent,
  ClinialResult as ClinialResultEvent,
  NFTIssued as NFTIssuedEvent,
  SignedClinicalResult as SignedClinicalResultEvent,
} from '../generated/PayForSuccess/PayForSuccess';

import { NFTIssued } from '../generated/schema';

export function handleAssetReceived(event: AssetReceivedEvent): void {}

export function handleClinialResult(event: ClinialResultEvent): void {}

export function handleNFTIssued(event: NFTIssuedEvent): void {
  let nftIssued = NFTIssued.load(
    getIdFromEventParams(event.params.to, event.params.uri)
  );
  if (!nftIssued) {
    nftIssued = new NFTIssued(
      getIdFromEventParams(event.params.to, event.params.uri)
    );
  }
  nftIssued.to = event.params.to;
  nftIssued.uri = event.params.uri;
  nftIssued.amount = event.params.amount;

  nftIssued.save();
}

export function handleSignedClinicalResult(
  event: SignedClinicalResultEvent
): void {}

function getIdFromEventParams(to: Address, uri: Bytes): string {
  return to.toHexString() + uri.toHexString();
}
