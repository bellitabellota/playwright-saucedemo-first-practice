import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

const URL = 'https://www.saucedemo.com/';

test.describe('Cart functionality', () => {
  let loginPage: LoginPage;
  
    test.beforeEach(async ({ page } ) => {
      await page.goto(URL);
      loginPage = new LoginPage(page);
      await loginPage.login('standard_user', 'secret_sauce');
    });

  test('should add item to cart when user clicks add to cart', async ({ page }) => {
    const firstItemCard = page.locator('[data-test="inventory-item"]').first();
    const itemName = await firstItemCard.locator('[data-test="inventory-item-name"]').textContent();

    await firstItemCard.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page.locator('[data-test="cart-list"]')).toContainText(`${itemName}`);
  });
});