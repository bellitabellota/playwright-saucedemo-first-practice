import {test, expect, type Page} from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

const URL = 'https://www.saucedemo.com/';

test.describe('Homepage - Login', ()=>{
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo ) => {
    await page.goto(URL);
    loginPage = new LoginPage(page);
  });

  test('should be successfull if credentials are valid', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory/);  
  });

  test('should fail if username is invalid', async ({ page }) => {
    await loginPage.login('invalid_user', 'secret_sauce');
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should fail if password is invalid', async ({ page }) => {
    await loginPage.login('standard_user', 'invalid_password');
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});





