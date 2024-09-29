import { describe, it, expect, beforeEach } from 'vitest';
import { MockProvider } from '@stacks/blockchain-api-client';
import { callReadOnlyFunction, callContractFunction } from '@stacks/transactions';

describe('Fungible Token Contract', () => {
  let mockProvider: MockProvider;
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const contractName = 'fungible-token';

  beforeEach(() => {
    mockProvider = new MockProvider();
  });

  it('should mint tokens successfully', async () => {
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const amount = 1000;

    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'mint-tokens',
      functionArgs: [recipient, amount.toString()],
      senderAddress: contractAddress,
    });

    expect(result.success).toBe(true);

    const balance = await callReadOnlyFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'get-balance',
      functionArgs: [recipient],
    });

    expect(balance.value).toBe(amount);
  });

  it('should transfer tokens successfully', async () => {
    const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const recipient = 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0';
    const initialAmount = 1000;
    const transferAmount = 500;

    // First, mint tokens for the sender
    await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'mint-tokens',
      functionArgs: [sender, initialAmount.toString()],
      senderAddress: contractAddress,
    });

    // Now, transfer tokens
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'transfer-tokens',
      functionArgs: [sender, recipient, transferAmount.toString()],
      senderAddress: sender,
    });

    expect(result.success).toBe(true);

    const senderBalance = await callReadOnlyFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'get-balance',
      functionArgs: [sender],
    });

    const recipientBalance = await callReadOnlyFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'get-balance',
      functionArgs: [recipient],
    });

    expect(senderBalance.value).toBe(initialAmount - transferAmount);
    expect(recipientBalance.value).toBe(transferAmount);
  });

  it('should fail to transfer tokens if balance is insufficient', async () => {
    const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const recipient = 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0';
    const initialAmount = 500;
    const transferAmount = 1000;

    // First, mint tokens for the sender
    await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'mint-tokens',
      functionArgs: [sender, initialAmount.toString()],
      senderAddress: contractAddress,
    });

    // Now, try to transfer more tokens than the sender has
    const result = await callContractFunction({
      network: mockProvider.getNetwork(),
      contractAddress,
      contractName,
      functionName: 'transfer-tokens',
      functionArgs: [sender, recipient, transferAmount.toString()],
      senderAddress: sender,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('u101');
  });
});