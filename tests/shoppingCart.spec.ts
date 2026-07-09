import {test, expect} from '@playwright/test';
     
test('Корзина с товаром', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('catalog-add-to-cart-button-prod-001').click();
    await page.getByTestId('header-cart-button').click();
    await page.waitForURL('**/cart');
    await expect.soft(page).toHaveScreenshot({
        fullPage: true,
        mask: [
        page.locator('p.text-sm.font-semibold.text-primary'),
        page.getByTestId('cart-captcha-image'),
        page.getByTestId('cart-total-price')                       
    ]        
        });
});