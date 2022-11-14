# MakerDAO Bridge invariant checking

## Description

This bot detects if the totalSupply on arbitrum and optimism exceeds the balance of escrow on L1

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- DAI SUPPLY OPT

  - Fired every block to show total supply of DAI on Optimism
  - Severity is set to "low"
  - Type is set to "info"
  - Metadata
    - `blockNumber`: Block number of the current block
    - `blockHash` : Block hash of the current block
    - `totalSupplyOPT`: Total DAI on Optimism

- DAI SUPPLY ARB

  - Fired every block to show total supply of DAI on Arbitrum
  - Severity is set to "low"
  - Type is set to "info"
  - Metadata
    - `blockNumber`: Block number of the current block
    - `blockHash` : Block hash of the current block
    - `totalSupplyARB`: Total DAI on Arbitrum

- BRIDGE INVARIANT COMPROMISED ARB

  - Fired when L2 DAI supply on Arbitrum exceeds L1 escrow
  - Severity is set to "High"
  - Type is set to "Exploit"
  - Metadata
    - `blockNumber`: Block number of the current block
    - `blockHash` : Block hash of the current block
    - `totalSupplyARB`: Total DAI on Arbitrum
    - `balanceEscrowARB`: Balance in Escrow

- BRIDGE INVARIANT COMPROMISED OPT
  - Fired when L2 DAI supply on Optimism exceeds L1 escrow
  - Severity is set to "High"
  - Type is set to "Exploit"
  - Metadata
    - `blockNumber`: Block number of the current block
    - `blockHash` : Block hash of the current block
    - `totalSupplyOPT`: Total DAI on Optimism
    - `balanceEscrowOPT`: Balance in Escrow

## Test Data

The bot behaviour can be verified with the following block:
15356579
