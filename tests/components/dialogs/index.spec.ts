import { test, expect } from '@playwright/test';
import { checkScreenshot } from '../../utils.js';

test('basic dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/components/dialogs/tests');

    await page.getByRole('button', { name: 'Basic Dialog', exact: true }).click();
    await checkScreenshot(page);
});

test('basic dialog with a button', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/components/dialogs/tests');

    await page.getByRole('button', { name: 'Basic Dialog with a button' }).click();
    await checkScreenshot(page);
});

test('confirmation dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/components/dialogs/tests');

    await page.getByRole('button', { name: 'Confirmation Dialog', exact: true }).click();
    await checkScreenshot(page);
});

test('danger confirmation dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/components/dialogs/tests');

    await page.getByRole('button', { name: 'Danger Confirmation Dialog', exact: true }).click();
    await checkScreenshot(page);
});

test('dialog interactions with the danger confirmation dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/components/dialogs/tests');

    await page.getByRole('button', { name: 'Danger Confirmation Dialog', exact: true }).click();
    await expect(page.locator('form')).toMatchAriaSnapshot(`
      - button "Cancel"
      - button "Deactivate" [disabled]
      `);
    await page.getByRole('textbox', { name: 'Type "DELETE" to confirm' }).fill('DELETE');
    await expect(page.locator('form')).toMatchAriaSnapshot(`
        - button "Cancel"
        - button "Deactivate"
        `);
    await page.getByRole('button', { name: 'Deactivate' }).click();
});

test('very long dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/components/dialogs/tests');

    await page.getByRole('button', { name: 'Very Long Dialog', exact: true }).click();
    await checkScreenshot(page);

    await expect(page.getByLabel('This is a very long dialog')).toMatchAriaSnapshot(`- button "Ok"`);
    await page.locator('div').filter({ hasText: 'Ok' }).nth(3).click();
    await checkScreenshot(page);
});
