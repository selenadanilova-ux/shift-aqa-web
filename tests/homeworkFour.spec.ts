import {test, expect} from '@playwright/test'
import { fillAllFields } from '../helpers/fillAllFields';

// 1. Тест с сортировкой по убыванию с учетом пагинации.

test('Проверка сортировки по убыванию текущая страница', async ({ page }) => {
    await page.goto('catalog');
    await page.getByTestId('catalog-sort-select').click();
    await page.getByTestId('catalog-sort-option-desc').click();

    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]')
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]')

    const priceElemnt = await priceLocator.all()
    const prices: number[] = []

    for (const element of priceElemnt) {
        const price = Number((await element.textContent())?.replace(/[^0-9]/g, '')) 
        prices.push(price)
    }

    for (let i = 0; i<prices.length-1; i++) {
        console.log(`${prices[i]}>${prices[i+1]}`)
        expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i+1])
    }
});

// 2. Проверка цен со всех страниц, а не каждой по отдельности.

test('Проверка сортировки по убыванию все страницы', async ({ page }) => {
    await page.goto('catalog');
    await page.getByTestId('catalog-sort-select').click();
    await page.getByTestId('catalog-sort-option-desc').click();

    let lastPrice = Infinity
    let curentPage = 1
    let hasNextPage = true

    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]')
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]')

    while (hasNextPage) {
        const priceElemnt = await priceLocator.all()
        const prices: number[] = []

        for (const element of priceElemnt) {
            const price = Number((await element.textContent())?.replace(/[^0-9]/g, '')) 
            prices.push(price)
        }

        console.log(`////////////////// ${prices[0]} <= ${lastPrice}`)
        expect.soft(prices[0]).toBeLessThanOrEqual(lastPrice)
        for (let i = 0; i < prices.length - 1; i++) {
            console.log(`${prices[i]} >= ${prices[i+1]}`)
            expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i+1])
        }

        const isDisabled = await page.getByTestId('catalog-pagination-next').isDisabled()

        if (isDisabled) {
            hasNextPage = false
        } else {
            await page.getByTestId('catalog-pagination-next').click()
            await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]')
        }
        lastPrice = prices[prices.length-1]
        curentPage++
    }
    console.log(curentPage)
});

// 3. Тесты для поля ФИО (позитивные и негативные проверки)

test('Позитивная проверка ФИО 1 символ кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('А');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 1 символ латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('A');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 2 символа кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Аб');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 2 символа латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Ab');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 35 символов кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Константинопольский Антон Игоревич');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 35 символов латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Konstantinopolskiy Anton Fedorovich');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 69 символов кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Благодарственно-Воскресенский-Самарский Аполлинарий Пантелеймоновичус');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 69 символов латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Blagodarstvenno-Voskresenskiy-Samarskiy Apollinariy Panteleimonovitch');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 70 символов кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Благодарственно-Воскресенский-Самарский Аполлинарий Пантелеймоновичусс');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО 70 символов латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Blagodarstvenno-Voskresenskiy-Samarskiy Apollinariy Panteleimonovitchs');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО заглавные буквы кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('ИВАНОВ');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО заглавные буквы латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('IVANOV');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО строчные буквы кириллица', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('иванов');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Позитивная проверка ФИО строчные буквы латиница', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('ivanov');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('modal-message')).toBeVisible()
    await expect.soft(page.getByTestId('modal-message')).toContainText('Ваша обратная связь принята. Мы свяжемся с вами в ближайшее время.')
});

test('Негативная проверка ФИО пустое поле', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО обязательно для заполнения')
});

test('Негативная проверка ФИО 71 символ', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Благодарственно-Воскресенский-Самарский Аполлинариус Пантелеймоновичусс');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО не должно превышать 70 символов')
});

test('Негативная проверка ФИО спецсимволы', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('&&&&&&&&&');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО может содержать только буквы, пробелы и дефисы')
});

test('Негативная проверка ФИО цифр', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('4444');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО может содержать только буквы, пробелы и дефисы')
});

test('Негативная проверка ФИО точка', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('Д.Иванов');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО может содержать только буквы, пробелы и дефисы')
});

test('Негативная проверка ФИО диакритические знаки', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill('René François Rodolphe');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО может содержать только буквы, пробелы и дефисы')
});

test('Негативная проверка ФИО пробел', async ({ page, request }) => {

    const captchaResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/api/captcha")
    )

    await page.goto('feedback');
    const captchaResponse = await captchaResponsePromise
    const {id} = await captchaResponse.json()
    const {code} = await (await request.get(`/api/testing/captcha?id=${id}`)).json()

    await page.getByTestId('feedback-input-fullname').fill(' ');
    await page.getByTestId('feedback-input-email').fill('test@gmail.com');
    await page.getByTestId('feedback-input-phone').fill('+7 983 000 00 00');
    await page.getByTestId('feedback-input-message').fill('Текст моего обращения в службу поддержки');
    await page.getByTestId('feedback-input-captcha').fill(code);
    await page.getByTestId('feedback-checkbox-consent').click();
    await page.getByTestId('feedback-submit-button').click();

    await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled()
    await expect.soft(page.getByTestId('feedback-error-fullname')).toContainText('ФИО может содержать только буквы, пробелы и дефисы')
});
