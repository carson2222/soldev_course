use anchor_lang::prelude::*;
use anchor_spl::token::{ mint_to, MintTo, Mint, TokenAccount, Token };
use anchor_spl::associated_token::AssociatedToken;

mod constants;

use constants::*;

declare_id!("f9z8QicUa1RKxPARXAiAo7Y28mqhy8L96MW3vUPP7GU");

#[program]
pub mod anchor_movie_review_program {
  use super::*;

  pub fn add_movie_review(
    ctx: Context<AddMovieReview>,
    title: String,
    description: String,
    rating: u8
  ) -> Result<()> {
    require!(rating >= MIN_RATING && rating <= MAX_RATING, MovieReviewError::InvalidRating);

    require!(title.len() <= MAX_TITLE_LENGTH, MovieReviewError::TitleTooLong);

    require!(description.len() <= MAX_DESCRIPTION_LENGTH, MovieReviewError::DescriptionTooLong);

    msg!("Movie Review Created");
    msg!("Title: {}", title);
    msg!("Description: {}", description);
    msg!("Rating: {}", rating);

    let movie_review = &mut ctx.accounts.movie_review;
    movie_review.reviewer = ctx.accounts.initializer.key();
    movie_review.rating = rating;
    movie_review.title = title;
    movie_review.description = description;

    mint_to(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
          authority: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.token_account.to_account_info(),
          mint: ctx.accounts.mint.to_account_info(),
        },
        &[&["mint".as_bytes(), &[ctx.bumps.mint]]]
      ),
      10 * (10_u64).pow(6)
    )?;

    msg!("Token Minted");

    Ok(())
  }

  pub fn update_movie_review(
    ctx: Context<UpdateMovieReview>,
    title: String,
    description: String,
    rating: u8
  ) -> Result<()> {
    msg!("Movie review account space reallocated");
    msg!("Title: {}", title);
    msg!("Description: {}", description);
    msg!("Rating: {}", rating);

    let movie_review = &mut ctx.accounts.movie_review;
    movie_review.rating = rating;
    movie_review.description = description;

    Ok(())
  }

  pub fn delete_movie_review(ctx: Context<DeleteMovieReview>, title: String) -> Result<()> {
    msg!("Movie review for {} deleted", title);
    Ok(())
  }

  pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
    msg!("Token mint initializer");
    Ok(())
  }
}

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct AddMovieReview<'info> {
  #[account(
    init,
    seeds = [title.as_bytes(), initializer.key().as_ref()],
    bump,
    payer = initializer,
    space = MovieAccountState::INIT_SPACE + title.len() + description.len()
  )]
  pub movie_review: Account<'info, MovieAccountState>,
  #[account(mut)]
  pub initializer: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  #[account(
        seeds=["mint".as_bytes()],
        bump,
        mut
    )]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = initializer,
    associated_token::mint = mint,
    associated_token::authority = initializer
  )]
  pub token_account: Account<'info, TokenAccount>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(title:String, description:String)]
pub struct UpdateMovieReview<'info> {
  #[account(
        mut,
        seeds = [title.as_bytes(), initializer.key().as_ref()],
        bump,
        realloc = MovieAccountState::INIT_SPACE + title.len() + description.len(),
        realloc::payer = initializer,
        realloc::zero = true,
    )]
  pub movie_review: Account<'info, MovieAccountState>,
  #[account(mut)]
  pub initializer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteMovieReview<'info> {
  #[account(mut, seeds = [title.as_bytes(), initializer.key().as_ref()], bump, close = initializer)]
  pub movie_review: Account<'info, MovieAccountState>,
  #[account(mut)]
  pub initializer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeMint<'info> {
  #[account(init, seeds = ["mint".as_bytes()], bump, payer = user, mint::decimals = 6, mint::authority = mint)]
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
}

#[account]
pub struct MovieAccountState {
  pub reviewer: Pubkey, // 32
  pub rating: u8, // 1
  pub title: String, // 4 + len()
  pub description: String, // 4 + len()
}
/*
   For the MovieAccountState account, since it is dynamic, we implement the Space trait to calculate the space required for the account.
   We add the STRING_LENGTH_PREFIX twice to the space to account for the title and description string prefix.
   We need to add the length of the title and description to the space upon initialization.
*/
impl Space for MovieAccountState {
  const INIT_SPACE: usize =
    ANCHOR_DISCRIMINATOR + PUBKEY_SIZE + U8_SIZE + STRING_LENGTH_PREFIX + STRING_LENGTH_PREFIX;
}

#[error_code]
enum MovieReviewError {
  #[msg("Rating must be between 1 and 5")]
  InvalidRating,
  #[msg("Movie title too long")]
  TitleTooLong,
  #[msg("Movie description too long")]
  DescriptionTooLong,
}
