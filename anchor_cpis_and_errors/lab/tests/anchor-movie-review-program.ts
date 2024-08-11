import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";
import { expect } from "chai";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
describe("anchor-movie-review-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorMovieReviewProgram as Program<AnchorMovieReviewProgram>;
  console.log(provider.wallet.publicKey.toString());
  const movie = {
    title: "Just a test movie",
    description: "Wow what a good movie it was real great",
    rating: 5,
  };

  const [moviePDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const [mint] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("mint")], program.programId);

  // it("Initializes the reward token", async () => {
  //   const tx = await program.methods.initializeMint().rpc();
  // });

  it("Movie review is added`", async () => {
    const tokenAccount = await getAssociatedTokenAddress(mint, provider.wallet.publicKey);

    const tx = await program.methods
      .addMovieReview(movie.title, movie.description, movie.rating)
      .accounts({ tokenAccount: tokenAccount })
      .rpc();
    console.log(tx);
    const account = await program.account.movieAccountState.fetch(moviePDA);
    expect(movie.title === account.title);
    expect(movie.rating === account.rating);
    expect(movie.description === account.description);
    expect(provider.wallet.publicKey === account.reviewer);

    const userAta = await getAccount(provider.connection, tokenAccount);
    expect(Number(userAta.amount)).to.equal(10 * Math.pow(10, 6));
  });

  it("Movie review is updated`", async () => {
    const newDescription = "Wow this is new";
    const newRating = 3;

    const tx = await program.methods.updateMovieReview(movie.title, newDescription, newRating).rpc();
    console.log(tx);

    const account = await program.account.movieAccountState.fetch(moviePDA);
    expect(movie.title === account.title);
    expect(newRating === account.rating);
    expect(newDescription === account.description);
    expect(provider.wallet.publicKey === account.reviewer);
  });

  it("Deletes a movie review", async () => {
    const tx = await program.methods.deleteMovieReview(movie.title).rpc();
    console.log(tx);
  });
});