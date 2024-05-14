import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import web3 from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();
const PING_PROGRAM_ADDRESS = new web3.PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa");
const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod");

// ### 3. Ping Program
// Now create an async function called `pingProgram()` with two parameters requiring a connection and payer’s keypair as arguments:

async function pingProgram(connection: web3.Connection, payer: web3.Keypair) {
  const transaction = new web3.Transaction();
  const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
  const programDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: programDataId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId,
  });

  transaction.add(instruction);
  const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(signature);
}
// ### 4. Run the program
// Now call the `pingProgram()`

try {
  const prayer = getKeypairFromEnvironment("PRIVATE_KEY");
  console.log(`✅ Loaded prayer keypair ${prayer.publicKey.toBase58()}`);
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  console.log(`✅ Connected to the devnet`);

  await pingProgram(connection, prayer);
} catch (error) {
  console.error(error);
}
