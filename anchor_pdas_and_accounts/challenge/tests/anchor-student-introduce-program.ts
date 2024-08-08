import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorStudentIntroduceProgram } from "../target/types/anchor_student_introduce_program";
import { expect } from "chai";

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

  it("Introduced yourself", async () => {
    const tx = await program.methods.introduceYourself(studentInfo.name, studentInfo.message).rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.studentInfo.fetch(studentPDA);
    expect(studentInfo.name === account.name);
    expect(studentInfo.message === account.message);
    expect(account.student.toString() === provider.wallet.publicKey.toString());
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
