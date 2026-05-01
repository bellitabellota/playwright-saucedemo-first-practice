import { type Locator, type Page } from "@playwright/test";

export class LoginPage{
  readonly page:Page;
  readonly usernameInputField: Locator;
  readonly passwordInputField: Locator;
  readonly loginButton: Locator;

  constructor(page:Page){
    this.page = page;
    this.usernameInputField = page.getByRole('textbox', { name: 'Username' });
    this.passwordInputField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async enterUsername(username: string) {
    await this.usernameInputField.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInputField.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}

