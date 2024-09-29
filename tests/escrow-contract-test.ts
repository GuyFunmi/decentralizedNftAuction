import { describe, it, expect, beforeEach } from 'vitest';
import { MockProvider } from '@stacks/blockchain-api-client';
import { callReadOnlyFunction, callContractFunction } from '@stacks/transactions';

describe('Escrow Contract', () => {
  let mockProvider: MockProvider;

  beforeEach(() => {
    mockProvider = new MockProvider();
  });

  it('should deposit funds successfully', async () => {
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'escrow',
      functionName: 'deposit',
      functionArgs: ['1', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', '1000'],
      senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    });

    expect(result.success).toBe(true);
  });

  it('should withdraw funds successfully', async () => {
    // First, deposit some funds
    await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'escrow',
      functionName: 'deposit',
      functionArgs: ['1', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', '1000'],
      senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    });

    // Now, withdraw the funds
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'escrow',
      functionName: 'withdraw',
      functionArgs: ['1', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'],
      senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    });

    expect(result.success).toBe(true);
    expect(result.value).toBe('1000');
  });

  it('should fail to withdraw non-existent funds', async () => {
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'escrow',
      functionName: 'withdraw',
      functionArgs: ['2', 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0'],
      senderAddress: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('u200');
  });

  it('should return correct escrow amount', async () => {
    // First, deposit some funds
    await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'escrow',
      functionName: 'deposit',
      functionArgs: ['1', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', '1000'],
      senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    });

    const result = await callReadOnlyFunction({
      network: mockProvider.getNetwork(),
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'escrow',
      functionName: 'get-escrow-amount',
      functionArgs: ['1', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'],
    });

    expect(result).toBe('1000');
  });
});