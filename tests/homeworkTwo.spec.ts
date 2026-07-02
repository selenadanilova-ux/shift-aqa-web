import {test, expect} from '@playwright/test'
import config from '../playwright.config'

const baseURL = config.use?.baseURL
if (!baseURL) {
    throw new Error('baseURL не задан в конфиге')
}

//  1. Проверки на интерактивные элементы в хедере

test('Проверка перехода на страницу Акции', async ({page}) => {
    await page.goto('promotions')
    await expect.soft(page).toHaveTitle('Акции | СладкийДом')
    await expect.soft(page).toHaveURL(`${baseURL}promotions`)
})

test('Проверка текста на кнопке Акции в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-promotions')).toHaveText('Акции')
})

test('Проверка перехода на страницу Доставка', async ({page}) => {
    await page.goto('delivery')
    await expect.soft(page).toHaveTitle('Доставка и оплата | СладкийДом')
    await expect.soft(page).toHaveURL(`${baseURL}delivery`)
})

test('Проверка текста на кнопке Доставка в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-delivery')).toHaveText('Доставка')
})

test('Проверка перехода на страницу О нас', async ({page}) => {
    await page.goto('about')
    await expect.soft(page).toHaveTitle('О компании | СладкийДом')
    await expect.soft(page).toHaveURL(`${baseURL}about`)
})

test('Проверка текста на кнопке О нас в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-about')).toHaveText('О нас')
})

test('Проверка перехода на страницу Контакты', async ({page}) => {
    await page.goto('contacts')
    await expect.soft(page).toHaveTitle('Контакты | СладкийДом')
    await expect.soft(page).toHaveURL(`${baseURL}contacts`)
})

test('Проверка текста на кнопке Контакты в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-contacts')).toHaveText('Контакты')
})

test('Проверка перехода на страницу Обратная связь', async ({page}) => {
    await page.goto('feedback')
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
    await expect.soft(page).toHaveURL(`${baseURL}feedback`)
})

test('Проверка текста на кнопке Обратная связь в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-feedback')).toHaveText('Обратная связь')
})

test('Проверка перехода на страницу FAQ', async ({page}) => {
    await page.goto('faq')
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
    await expect.soft(page).toHaveURL(`${baseURL}faq`)
})

test('Проверка текста на кнопке FAQ в хедере', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('header-nav-link-faq')).toHaveText('FAQ')
})

test('Проверка перехода на страницу корзина', async ({page}) => {
    await page.goto('cart')
    await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей')
    await expect.soft(page).toHaveURL(`${baseURL}cart`)
})

// 2. Проверка интерактивных элементов на плашке кук

test('Проверка закрытия плашки кук кнопкой Отклонить', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await page.getByTestId('cookie-decline-button').click()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden()
})

test('Проверка текстов на плашке кук', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible()
    await expect.soft(page.getByTestId('cookie-consent-banner')).toHaveText('Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с политикой конфиденциальности.ОтклонитьПринять')
})

test('Проверка перехода на страницу политики конфиденциальности', async ({page}) => {
    await page.goto('privacy')
    await expect.soft(page).toHaveTitle('Политика конфиденциальности | СладкийДом')
    await expect.soft(page).toHaveURL(`${baseURL}privacy`)
})

test('Проверка URL на странице политики конфиденциальности', async ({page}) => {
    await page.goto('privacy')
    await expect.soft(page).toHaveURL(/.*privacy/)
})

test('Проверка текста ссылки политики конфиденциальности', async ({page}) => {
    await page.goto('')
    await expect.soft(page.getByTestId('cookie-consent-privacy-link')).toHaveText('политикой конфиденциальности')
})

// 3. Определите особенность страницы каталог

// Особенность 1: при выборе категории товары обновляются динамически 
// без перезагрузки всей страницы. 
// 
// Особенность 2: в момент загрузки отображаются лоадеры элементов.
// Нужно дожидаться их исчезновения и появления реальных карточек.

// Весовой формат цен: стоимость некоторых товаров указана за килограмм, а не за штуку.
