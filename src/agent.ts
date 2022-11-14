import {
  BlockEvent,
  ethers,
  Finding,
  FindingSeverity,
  FindingType,
  HandleBlock,
} from "forta-agent";

import {
  ARB_URL,
  L1_DAI,
  L1_ESCROW_ARB,
  L1_ESCROW_OPT,
  L1_URL,
  OPT_URL,
} from "./constants";

import { DAI_L2_INTERFACE, DAI_L1_INTERFACE } from "./interfaceConstants";

var DAI_L2_ADD = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
let providerOP = new ethers.providers.JsonRpcProvider(OPT_URL);
let providerARB = new ethers.providers.JsonRpcProvider(ARB_URL);
let providerL1 = new ethers.providers.JsonRpcProvider(L1_URL);

export const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
  //for optimism
  let DAI_L2_CONT = new ethers.Contract(
    DAI_L2_ADD,
    DAI_L2_INTERFACE,
    providerOP
  );
  const findings: Finding[] = [];
  let L2_totalSupply_OPT = parseInt(await DAI_L2_CONT.totalSupply());
  findings.push(
    Finding.fromObject({
      name: "DAI SUPPLY OPT",
      description: "Total supply of L2 optimism DAI tokens",
      alertId: "DAI-OPT-SUPP",
      protocol: "MakerDAO",
      severity: FindingSeverity.Low,
      type: FindingType.Info,
      metadata: {
        blockNumber: blockEvent.blockNumber.toString(),
        blockHash: blockEvent.blockHash,
        totalSupplyOPT: L2_totalSupply_OPT.toString(),
      },
    })
  );
  //for arbitrum
  DAI_L2_CONT = new ethers.Contract(DAI_L2_ADD, DAI_L2_INTERFACE, providerARB);
  let L2_totalSupply_ARB = parseInt(await DAI_L2_CONT.totalSupply());
  findings.push(
    Finding.fromObject({
      name: "DAI SUPPLY ARB",
      description: "Total supply of L2 arbitrum DAI tokens",
      alertId: "DAI-ARB-SUPP",
      protocol: "MakerDAO",
      severity: FindingSeverity.Low,
      type: FindingType.Info,
      metadata: {
        blockNumber: blockEvent.blockNumber.toString(),
        blockHash: blockEvent.blockHash,
        totalSupplyARB: L2_totalSupply_ARB.toString(),
      },
    })
  );
  //L1 contract
  let DAI_L1_CONT = new ethers.Contract(L1_DAI, DAI_L1_INTERFACE, providerL1);

  //checking invariant for arb
  let balanceESC_ARB = parseInt(await DAI_L1_CONT.balanceOf(L1_ESCROW_ARB));
  if (balanceESC_ARB < L2_totalSupply_ARB) {
    findings.push(
      Finding.fromObject({
        name: "BRIDGE INVARIANT COMPROMISED ARB",
        description: "L2 DAI supply(arbitrum) exceeds L1 escrow",
        alertId: "DAI-ARB-INV",
        protocol: "MakerDAO",
        severity: FindingSeverity.High,
        type: FindingType.Exploit,
        metadata: {
          blockNumber: blockEvent.blockNumber.toString(),
          blockHash: blockEvent.blockHash,
          totalSupplyARB: L2_totalSupply_ARB.toString(),
          balanceEscrowARB: balanceESC_ARB.toString(),
        },
      })
    );
  }
  //checking invariant for opt
  let balanceESC_OPT = parseInt(await DAI_L1_CONT.balanceOf(L1_ESCROW_OPT));
  if (balanceESC_OPT < L2_totalSupply_OPT) {
    findings.push(
      Finding.fromObject({
        name: "BRIDGE INVARIANT COMPROMISED OPT",
        description: "L2 DAI supply (optimism) exceeds L1 escrow",
        alertId: "DAI-OPT-INV",
        protocol: "MakerDAO",
        severity: FindingSeverity.High,
        type: FindingType.Exploit,
        metadata: {
          blockNumber: blockEvent.blockNumber.toString(),
          blockHash: blockEvent.blockHash,
          totalSupplyOPT: L2_totalSupply_OPT.toString(),
          balanceEscrowOPT: balanceESC_OPT.toString(),
        },
      })
    );
  }

  return findings;
};

export default {
  handleBlock,
};
