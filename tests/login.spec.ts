import {test, expect} from '@playwright/test';

const URL = 'https://www.saucedemo.com/';

test.beforeEach(async ({ page }, testInfo ) => {
  await page.goto(URL);
});

test.describe('Homepage - Login', ()=>{
  test('should be successfull if credentials are valid', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*inventory/);  
  });

  test('should fail if username is invalid', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should fail if password is invalid', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('invalid_password');
    await page.getByRole('button', { name: 'Login' }).click();
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});





