import {test, expect} from '@playwright/test';

test('Корзина пустая', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-cart-button').click();
    await page.waitForURL('**/cart');
    await expect.soft(page).toHaveScreenshot({
        maxDiffPixels: 200
    });
});        

test('Корзина с товаром', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('header-cart-button').click();
    await page.waitForURL('**/cart');
    await expect.soft(page).toHaveScreenshot({
        mask: [
        page.locator('p.text-sm.font-semibold.text-primary'),
        page.getByTestId('cart-captcha-image')                       
    ], 
        maxDiffPixels: 200
        });
});