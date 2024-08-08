import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";
import { expect } from "chai";

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

  it("Movie review is added`", async () => {
    const tx = await program.methods.addMovieReview(movie.title, movie.description, movie.rating).rpc();
    console.log(tx);
    const account = await program.account.movieAccountState.fetch(moviePDA);
    expect(movie.title === account.title);
    expect(movie.rating === account.rating);
    expect(movie.description === account.description);
    expect(provider.wallet.publicKey === account.reviewer);
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
