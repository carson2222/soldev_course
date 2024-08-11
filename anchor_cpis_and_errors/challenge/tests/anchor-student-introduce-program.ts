import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorStudentIntroduceProgram } from "../target/types/anchor_student_introduce_program";
import { expect } from "chai";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

describe("anchor-student-introduce-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorStudentIntroduceProgram as Program<AnchorStudentIntroduceProgram>;

  const studentInfo = { name: "Andrzej", message: "I love poratoes" };
  const [studentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(studentInfo.name), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const [mint] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("mint")], program.programId);
  // it("Initialized mint", async () => {
  //   const tx = await program.methods.initializeMint().rpc();
  //   console.log("Your transaction signature", tx);
  // });
  it("Introduced yourself", async () => {
    const tokenAccount = await getAssociatedTokenAddress(mint, provider.wallet.publicKey);

    const tx = await program.methods
      .introduceYourself(studentInfo.name, studentInfo.message)
      .accounts({ tokenAccount: tokenAccount })
      .rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.studentInfo.fetch(studentPDA);
    expect(studentInfo.name === account.name);
    expect(studentInfo.message === account.message);
    expect(account.student.toString() === provider.wallet.publicKey.toString());

    const userAta = await getAccount(provider.connection, tokenAccount);
    expect(Number(userAta.amount)).to.equal(10 * Math.pow(10, 6));
  });

  it("Updated info", async () => {
    const newMessage = "I love carrots";
    const tx = await program.methods.changeYourMessage(studentInfo.name, newMessage).rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.studentInfo.fetch(studentPDA);
    expect(studentInfo.name === account.name);
    expect(studentInfo.message === newMessage);
    expect(account.student.toString() === provider.wallet.publicKey.toString());
  });

  it("Deleted profile", async () => {
    const tx = await program.methods.deleteYourProfile(studentInfo.name).rpc();
    console.log("Your transaction signature", tx);
  });
});
