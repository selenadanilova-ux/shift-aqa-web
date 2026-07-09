import {test, expect} from '@playwright/test'
import { fillAllFields } from '../helpers/fillAllFields';

// 1. Тест с сортировкой по убыванию с учетом пагинации.

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


// 2. Проверка цен со всех страниц, а не каждой по отдельности.

test('Проверка корректности цен со всех страниц каталога', async ({ page }) => {
    await page.goto('catalog');

    const allPrices: number[] = [];
    let hasNextPage = true;

    const priceLocator = page.locator('[data-testid^="catalog-product-price-prod-"]');
    await page.waitForSelector('[data-testid^="catalog-product-price-prod-"]');

    while (hasNextPage) {
        const priceElements = await priceLocator.all();

        for (const element of priceElements) {
            const price = Number((await element.textContent())?.replace(/[^0-9]/g, '')); 
            allPrices.push(price);
        }

        const isDisabled = await page.getByTestId('catalog-pagination-next').isDisabled();

        if (isDisabled) {
            hasNextPage = false;
        } else {
            await page.getByTestId('catalog-pagination-next').click();
            await page.waitForTimeout(500); 
        }
    }

    expect(allPrices.length).toBeGreaterThan(0);

    for (const price of allPrices) {
        expect.soft(price).toBeGreaterThan(0);
    }
});


// 3. Тесты для поля ФИО (позитивные и негативные проверки)

test('Позитивная проверка ФИО 1 символ кириллица', async ({ page }) => {
    
    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('А');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 1 символ латиница', async ({ page }) => {
    
    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('A');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 2 символа кириллица', async ({ page }) => {
    
    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Аб');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 2 символа латиница', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Ab');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 35 символов кириллица', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Константинопольский Антон Игоревич');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 35 символов латиница', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Konstantinopolskiy Anton Fedorovich');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 69 символов кириллица', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Благодарственно-Воскресенский-Самарский Аполлинарий Пантелеймоновичус');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 69 символов латиница', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Blagodarstvenno-Voskresenskiy-Samarskiy Apollinariy Panteleimonovitch');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 70 символов кириллица', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Благодарственно-Воскресенский-Самарский Аполлинарий Пантелеймоновичусс');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО 70 символов латиница', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Blagodarstvenno-Voskresenskiy-Samarskiy Apollinariy Panteleimonovitchs');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});
    
test('Позитивная проверка ФИО заглавные буквы кириллица', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('ИВАНОВ');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО заглавные буквы латиница', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('IVANOV');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО строчные буквы кириллица', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('иванов');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО строчные буквы латиница', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('ivanov');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО заглавная буква Ё', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Ёжиков');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Позитивная проверка ФИО строчная буква Ё', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Аксёнов');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).not.toBeVisible();
});

test('Негативная проверка ФИО пустое поле', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО обязательно для заполнения');
});
    
test('Негативная проверка ФИО 71 символ', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Благодарственно-Воскресенский-Самарский Аполлинариус Пантелеймоновичусс');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО не должно превышать 70 символов');
});  
    
test('Негативная проверка ФИО спецсимволы', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('&&&&&');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО может содержать только буквы, пробелы и дефисы');
});
    
test('Негативная проверка ФИО цифр', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('44444');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО может содержать только буквы, пробелы и дефисы');
});
    
test('Негативная проверка ФИО точка', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('Д.Иванов');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО может содержать только буквы, пробелы и дефисы');
});

test('Негативная проверка ФИО диакритические знаки', async ({ page, request }) => {

    await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill('René François Rodolphe');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО может содержать только буквы, пробелы и дефисы');
});
 
test('Негативная проверка ФИО пробел', async ({ page, request }) => {

     await page.goto('feedback');

    const fullnameInput = page.getByTestId('feedback-input-fullname');
    await fullnameInput.fill(' ');
    
    await page.getByTestId('feedback-input-email').click(); 

    const errorLabel = page.getByTestId('feedback-error-fullname');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('ФИО может содержать только буквы, пробелы и дефисы');
});
