import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

const URL = 'https://www.saucedemo.com/';

async function addItemToCart(page: Page, itemIndex: number) {
  const itemCard = page.locator('[data-test="inventory-item"]').nth(itemIndex);
  const itemName = await itemCard.locator('[data-test="inventory-item-name"]').innerText(); //use innerText() (is always string), rather than textContent() (is string or null)

  await itemCard.getByRole('button', { name: 'Add to cart' }).click();

  return itemName;
}

async function navigateToCart(page:Page) {
  await page.locator('[data-test="shopping-cart-link"]').click();
}

test.describe('Cart functionality', () => {
  let loginPage: LoginPage;
  
    test.beforeEach(async ({ context, page } ) => {
      /*
      - Do not assert that initial state is as desired, rather control the enviroment and guarantee this.
      - The site sourcedemo.com stores the cart in the browser session and can be reset to guarantee cart is empty before tests run.
      - If you are unsure how the application handles the cart state you can inspect the localStorage/sessionStorage in the 'Application' tab of DevTools, and check under the 'Network' tab if upon adding an item to the cart a POST or PUT request is sent. 
      Furthermore, 
          - if the cart persists after refresh without login --> likely localStorage
          - if cart persists across devices --> backend
          - if you see API calls when adding item --> backend
       */
      await context.clearCookies();
      await page.goto(URL);
      loginPage = new LoginPage(page);
      await loginPage.login('standard_user', 'secret_sauce');
    });

  test('should add item to cart when user clicks add to cart', async ({ page }) => {
    const itemName = await addItemToCart(page, 0);
    await navigateToCart(page);

    await expect(page.locator('[data-test="cart-list"]')).toContainText(`${itemName}`);
  });

  test('should keep items in cart when navigating between pages', async ({ page }) => {
    const firstItemName = await addItemToCart(page, 0);

    const secondItemCard = page.locator('[data-test="inventory-item"]').nth(1);
    const secondItemName = await secondItemCard.locator('[data-test="inventory-item-name"]').innerText();
    await secondItemCard.getByRole('button', { name: 'Add to cart' }).click();

    await navigateToCart(page);
    await page.getByRole('button', {name:'Go back Continue Shopping' }).click();
    await navigateToCart(page);

    await expect(page.locator('[data-test="cart-list"]')).toContainText(`${firstItemName}`);
    await expect(page.locator('[data-test="cart-list"]')).toContainText(`${secondItemName}`);
  });

  test('should remove item from cart when user clicks remove', async ({ page }) => {
    const itemName = await addItemToCart(page, 0);
    await navigateToCart(page);
    const cartItem = page.locator('[data-test="inventory-item"]', { hasText: itemName });

    await expect(cartItem).toHaveCount(1);

    await cartItem.getByRole('button', { name: 'Remove' }).click();
    
    await expect(cartItem).toHaveCount(0);
  });

  test('should display empty cart when no items are added', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-link"]').locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveCount(0);
  });

  test('should update cart badge when items are added', async ({ page }) => {
    await addItemToCart(page, 0);
    const cartBadge = page.locator('[data-test="shopping-cart-link"]').locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });

  test('should update cart badge when items are removed', async ({ page }) => {
    const itemName = await addItemToCart(page, 0);

    const cartBadge = page.locator('[data-test="shopping-cart-link"]').locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText('1');

    const cartItem = page.locator('[data-test="inventory-item"]', { hasText: itemName });
    await cartItem.getByRole('button', { name: 'Remove' }).click();

    await expect(cartBadge).toHaveCount(0);
  });
});