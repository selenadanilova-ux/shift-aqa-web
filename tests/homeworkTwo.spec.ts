import {test, expect} from '@playwright/test'
import config from '../playwright.config.ts'

const baseURL = config.use?.baseURL
if (!baseURL) {
    throw new Error('baseURL не задан в конфиге')
}


//  1. Проверки на интерактивные элементы в хедере

test('Проверка текста на кнопке Главная в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-home')).toHaveText('Главная')
})

test('Переход на страницу Главная через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-home').click();
    await expect.soft(page).toHaveURL(`${baseURL}`);
    await expect.soft(page).toHaveTitle('Главная');
});

test('Переход на страницу Каталог через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-catalog').click();
    await expect.soft(page).toHaveURL(`${baseURL}catalog`);
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей');
});

test('Проверка текста на кнопке Акции в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-promotions')).toHaveText('Акции')
})

test('Переход на страницу Акции через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-promotions').click();
    await expect.soft(page).toHaveURL(`${baseURL}promotions`);
    await expect.soft(page).toHaveTitle('Акции | СладкийДом');
});

test('Проверка текста на кнопке Доставка в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-delivery')).toHaveText('Доставка')
})

test('Переход на страницу Доставка через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-delivery').click();
    await expect.soft(page).toHaveURL(`${baseURL}delivery`);
    await expect.soft(page).toHaveTitle('Доставка и оплата | СладкийДом');
});

test('Проверка текста на кнопке О нас в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-about')).toHaveText('О нас')
})

test('Переход на страницу О нас через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-about').click();
    await expect.soft(page).toHaveURL(`${baseURL}about`);
    await expect.soft(page).toHaveTitle('О компании | СладкийДом');
});

test('Проверка текста на кнопке Контакты в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-contacts')).toHaveText('Контакты')
})

test('Переход на страницу Контакты через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-contacts').click();
    await expect.soft(page).toHaveURL(`${baseURL}contacts`);
    await expect.soft(page).toHaveTitle('Контакты | СладкийДом');
});

test('Проверка текста на кнопке Обратная связь в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-feedback')).toHaveText('Обратная связь')
})

test('Переход на страницу Обратная связь через хедер', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-feedback').click();
    await expect.soft(page).toHaveURL(`${baseURL}feedback`);
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей');
});

test('Проверка текста на кнопке FAQ в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-faq')).toHaveText('FAQ')
})

test('Переход на страницу FAQ', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-nav-link-faq').click();
    await expect.soft(page).toHaveURL(`${baseURL}faq`);
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей');
});

test('Переход на страницу Корзина', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('header-cart-button').click();
    await expect.soft(page).toHaveURL(`${baseURL}cart`);
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей');
});


// 2. Проверка интерактивных элементов на плашке кук

test('Проверка текстов на плашке кук', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toHaveText('Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с политикой конфиденциальности.ОтклонитьПринять')
})

test('Проверка закрытия плашки кук кнопкой Отклонить', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-decline-button').click()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden()
})

test('Переход по ссылке политики конфиденциальности в куки-плашке', async ({ page }) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-consent-privacy-link').click()
    await expect.soft(page).toHaveURL(`${baseURL}privacy`)
})

test('Проверка текста ссылки политики конфиденциальности', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-privacy-link')).toHaveText('политикой конфиденциальности')
})


// 3. Определите особенность страницы каталог

// Каждый раз при одновлении страницы цена на товары изменяется.