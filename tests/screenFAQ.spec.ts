import {test, expect} from '@playwright/test';

test('Cтраницf FAQ с раскрытым бургером ответа на вопрос', async ({ page }) => {
    await page.goto('/faq');
    const faqButtons = page.locator('svg.lucide-chevron-down');
    const count = await faqButtons.count();
    for (let i = 0; i < count; i++) {
        await faqButtons.nth(i).click();
    }
    await expect(page).toHaveScreenshot({
        fullPage: true
    });
});