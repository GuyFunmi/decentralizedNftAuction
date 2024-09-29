import { describe, it, expect, beforeEach } from 'vitest';
import { MockProvider } from '@stacks/blockchain-api-client';
import { callReadOnlyFunction, callContractFunction } from '@stacks/transactions';

describe('NFT Auction Contract', () => {
  let mockProvider: MockProvider;

  beforeEach(() => {
    mockProvider = new MockProvider();
  });

  it('should create an auction for an owned NFT', async () => {
    // First, mint an NFT
    await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'nft-marketplace',
      functionName: 'mint-nft',
      functionArgs: ['1'],
      senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    });

    // Now, create an auction
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'nft-auction',
      functionName: 'create-auction',
      functionArgs: ['1', '100'],
      senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    });

    expect(result.success).toBe(true);
  });

  it('should fail to create an auction for an unowned NFT', async () => {
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'nft-auction',
      functionName: 'create-auction',
      functionArgs: ['2', '100'],
      senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('u200');
  });

  it('should place a valid bid', async () => {
    // First, create an auction
    await cal