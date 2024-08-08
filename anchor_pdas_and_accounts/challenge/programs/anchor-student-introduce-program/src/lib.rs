use anchor_lang::prelude::*;

mod constants;

use constants::*;

declare_id!("E1cVE3QEQmJGz4j7agsM31CrnFUBk8pJmSk8DMe6cUUq");

#[program]
pub mod anchor_student_introduce_program {
  use super::*;

  pub fn introduce_yourself(ctx: Context<IntroduceYourself>, name: String, message: String) -> Result<()> {
    require!(name.len() <= MAX_NAME_LENGTH, StudentIntroduceError::NameTooLong);
    require!(message.len() <= MAX_MESSAGE_LENGTH, StudentIntroduceError::MessageTooLong);

    msg!("You have successfully introduced yourself!");
    msg!("Your name is: {}", name);
    msg!("Your message is: {}", message);

    let student_info = &mut ctx.accounts.student_info;
    student_info.student = ctx.accounts.initializer.key();
    student_info.name = name;
    student_info.message = message;

    Ok(())
  }

  pub fn change_your_message(ctx: Context<ChangeYourMessage>, name: String, message: String) -> Result<()> {
    require!(message.len() <= MAX_MESSAGE_LENGTH, StudentIntroduceError::MessageTooLong);

    msg!("{}, You have successfully changed your message!", name);
    msg!("Your new message is: {}", message);

    let student_info = &mut ctx.accounts.student_info;
    student_info.message = message;
    Ok(())
  }

  pub fn delete_your_profile(ctx: Context<DeleteYourProfile>, name: String) -> Result<()> {
    msg!("{}, You have successfully deleted your profile!", name);
    Ok(())
  }
}

#[derive(Accounts)]
#[instruction(name: String, message: String)]
pub struct IntroduceYourself<'info> {
  #[account(
    init,
    seeds = [name.as_bytes(), initializer.key().as_ref()],
    bump,
    payer = initializer,
    space = StudentInfo::INIT_SPACE + name.len() + message.len()
  )]
  pub student_info: Account<'info, StudentInfo>,
  #[account(mut)]
  pub initializer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, message: String)]
pub struct ChangeYourMessage<'info> {
  #[account(mut, seeds = [name.as_bytes(), initializer.key().as_ref()], bump, realloc = StudentInfo::INIT_SPACE + name.len() + message.len(), realloc::payer = initializer, realloc::zero = true)]
  pub student_info: Account<'info, StudentInfo>,
  #[account(mut)]
  pub initializer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct DeleteYourProfile<'info> {
  #[account(mut, seeds = [name.as_bytes(), initializer.key().as_ref()], bump, close = initializer)]
  pub student_info: Account<'info, StudentInfo>,
  #[account(mut)]
  pub initializer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[account]
pub struct StudentInfo {
  pub student: Pubkey,
  pub name: String,
  pub message: String,
}

impl Space for StudentInfo {
  const INIT_SPACE: usize = ANCHOR_DISCRIMINATOR + PUBKEY_SIZE + STRING_PREFIX_SIZE * 2;
}

#[error_code]
enum StudentIntroduceError {
  #[msg("The name is too long!")]
  NameTooLong,
  #[msg("The message is too long!")]
  MessageTooLong,
}
