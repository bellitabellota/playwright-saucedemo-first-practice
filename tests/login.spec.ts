import {test, expect, type Page} from '@playwright/test';

const URL = 'https://www.saucedemo.com/';

test.beforeEach(async ({ page }, testInfo ) => {
  await page.goto(URL);
});

async function login(page:Page, username:string, password:string) {
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click()
}

test.describe('Homepage - Login', ()=>{
  test('should be successfull if credentials are valid', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory/);  
  });

  test('should fail if username is invalid', async ({ page }) => {
    await login(page, 'invalid_user', 'secret_sauce');
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should fail if password is invalid', async ({ page }) => {
    await login(page, 'standard_user', 'invalid_password');
    const loginError = page.locator('[data-test="error"]');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});





