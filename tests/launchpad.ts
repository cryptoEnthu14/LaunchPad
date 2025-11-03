import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Launchpad } from "../target/types/launchpad";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { assert } from "chai";

describe("Launchpad", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Launchpad as Program<Launchpad>;
  const authority = provider.wallet;

  let configPDA: PublicKey;
  let configBump: number;
  let communityPool: Keypair;

  before(async () => {
    [configPDA, configBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    communityPool = Keypair.generate();
  });

  it("Initializes the launchpad", async () => {
    try {
      await program.methods
        .initialize(100) // 1% fee
        .accounts({
          config: configPDA,
          authority: authority.publicKey,
          communityPool: communityPool.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const config = await program.account.launchpadConfig.fetch(configPDA);
      assert.equal(config.feePercentage, 100);
      assert.equal(config.referralFee, 10);
      console.log("✓ Launchpad initialized successfully");
    } catch (error) {
      console.error("Error initializing launchpad:", error);
      throw error;
    }
  });

  it("Creates a token launch", async () => {
    const creator = Keypair.generate();

    // Airdrop SOL to creator
    const signature = await provider.connection.requestAirdrop(
      creator.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    const name = "Test Token";
    const symbol = "TEST";
    const uri = "https://test.com/metadata.json";
    const supply = new anchor.BN(1_000_000_000_000_000); // 1 billion with 9 decimals
    const totalSellAmount = new anchor.BN(700_000_000_000_000); // 70%
    const totalFundRaising = new anchor.BN(85_000_000_000); // 85 SOL

    const [mintPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint"), creator.publicKey.toBuffer(), Buffer.from(name)],
      program.programId
    );

    const [launchPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("launch"), mintPDA.toBuffer()],
      program.programId
    );

    const launchTokenAccount = await getAssociatedTokenAddress(
      mintPDA,
      launchPDA,
      true
    );

    try {
      await program.methods
        .createLaunch(
          name,
          symbol,
          uri,
          supply,
          totalSellAmount,
          totalFundRaising,
          { linear: {} },
          { cpmm: {} },
          new anchor.BN(0),
          new anchor.BN(0)
        )
        .accounts({
          launch: launchPDA,
          mint: mintPDA,
          launchTokenAccount,
          creator: creator.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([creator])
        .rpc();

      const launch = await program.account.launch.fetch(launchPDA);
      assert.equal(launch.name, name);
      assert.equal(launch.symbol, symbol);
      assert.equal(launch.totalSupply.toString(), supply.toString());
      console.log("✓ Token launch created successfully");
    } catch (error) {
      console.error("Error creating launch:", error);
      throw error;
    }
  });

  it("Buys tokens from bonding curve", async () => {
    // This test would need a previously created launch
    // Implementation similar to create launch test
    console.log("✓ Buy tokens test (implementation pending)");
  });

  it("Sells tokens to bonding curve", async () => {
    // This test would need tokens purchased first
    console.log("✓ Sell tokens test (implementation pending)");
  });

  it("Migrates to AMM pool when goal reached", async () => {
    // This test would need a launch that reached its goal
    console.log("✓ Migration test (implementation pending)");
  });

  it("Claims creator fees", async () => {
    // This test would need a launch with accumulated fees
    console.log("✓ Claim fees test (implementation pending)");
  });

  it("Handles referral rewards", async () => {
    // This test would setup referrals and verify rewards
    console.log("✓ Referral test (implementation pending)");
  });
});
