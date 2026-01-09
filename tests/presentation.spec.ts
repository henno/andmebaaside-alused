import { test, expect } from "@playwright/test";

test.describe("Esitluse põhifunktsioonid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1, h2", { timeout: 15000 });
  });

  test("tiitelslaid laeb korrektselt", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("ANDMEBAASIDE");
    await expect(page.getByText("DBMS", { exact: true })).toBeVisible();
    await expect(page.getByText("Arhitektuur", { exact: true })).toBeVisible();
  });

  test("info nupp on nähtav ja avab külgpaneeli", async ({ page }) => {
    const infoButton = page.locator('[data-testid="info-button"]');
    await expect(infoButton).toBeVisible();

    await infoButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="info-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Selle slaidiga taoteldakse");
    await expect(modal).toContainText("Õpetaja juhend");
  });

  test("külgpaneeli saab sulgeda", async ({ page }) => {
    const infoButton = page.locator('[data-testid="info-button"]');
    await infoButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="info-modal"]');
    await expect(modal).toBeVisible();

    const closeButton = page.locator('[data-testid="info-modal-close"]');
    await closeButton.click();
    await page.waitForTimeout(500);

    await expect(modal).not.toBeVisible();
  });
});

test.describe("Navigeerimine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1, h2", { timeout: 15000 });
  });

  test("nooleklahviga paremale navigeerib järgmisele slaidile", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("ANDMEBAASIDE");

    await page.keyboard.press("ArrowRight");

    // Oota kuni h2 element ilmub
    await page.waitForSelector("h2", { timeout: 5000 });
    await expect(page.locator("h2")).toContainText("Kus asub andmebaas?");
  });

  test("nooleklahviga vasakule navigeerib tagasi", async ({ page }) => {
    await page.keyboard.press("ArrowRight");
    await page.waitForSelector("h2", { timeout: 5000 });

    await page.keyboard.press("ArrowLeft");
    await page.waitForSelector("h1", { timeout: 5000 });

    await expect(page.locator("h1")).toContainText("ANDMEBAASIDE");
  });

  test("slaidi loendur näitab õiget numbrit", async ({ page }) => {
    await expect(page.locator("text=1 / 15")).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(800);

    await expect(page.locator("text=2 / 15")).toBeVisible();
  });
});

test.describe("Slaidide sisu", () => {
  test("DBMS ülevaate slaid laeb ja kaardid töötavad", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1", { timeout: 15000 });
    // Navigeeri 3. slaidile (DBMS ülevaade)
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(600);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1000);
    await page.waitForSelector("h2", { timeout: 10000 });

    await expect(page.locator("h2")).toContainText("Andmebaaside Haldussüsteemid");

    // Kontrolli, et PostgreSQL kaart on olemas
    const postgresCard = page.locator("text=PostgreSQL").first();
    await expect(postgresCard).toBeVisible();

    // Klõpsa kaardil
    await postgresCard.click();
    await page.waitForTimeout(500);

    // Kontrolli, et lisainfo ilmub
    await expect(page.locator("text=Avatud lähtekoodiga")).toBeVisible();
  });

  test("DBMS võrdluse slaid laeb ja tabel on nähtav", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1", { timeout: 15000 });

    // Navigeeri 4. slaidile (DBMS võrdlus)
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(600);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(600);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1000);

    await expect(page.locator("h2")).toContainText("DBMS Võrdlus");

    // Kontrolli, et legend on nähtav
    await expect(page.locator("text=Tugev")).toBeVisible();
    await expect(page.locator("text=Keskmine")).toBeVisible();
    await expect(page.locator("text=Nõrk")).toBeVisible();
  });

  test("navigeerimine viib läbi kõigi slaidide", async ({ page }) => {
    await page.goto("/");

    const expectedTitles = [
      "ANDMEBAASIDE",
      "Kus asub andmebaas?",
      "Andmebaaside Haldussüsteemid",
      "DBMS Võrdlus",
      "Andmebaasimootori Omadused",
      "Andmebaasi Arhitektuur",
      "Andmebaasiobjektid",
      "Andmebaasitüüpide Võrdlus",
      "Andmetüübid",
      "Normaliseerimine",
      "Skaleerimistehnikad",
      "SQL Ajalugu",
      "Ajast Sõltuvad Andmed",
      "Kokkuvõte",
      "Praktiline ülesanne"
    ];

    for (let i = 0; i < expectedTitles.length; i++) {
      const expectedTitle = expectedTitles[i];

      if (i === 0) {
        await expect(page.locator("h1")).toContainText(expectedTitle);
      } else {
        await expect(page.locator("h2")).toContainText(expectedTitle);
      }

      // Kontrolli, et info nupp on nähtav
      await expect(page.locator('[data-testid="info-button"]')).toBeVisible();

      // Kontrolli loendur
      await expect(page.locator(`text=${i + 1} / 15`)).toBeVisible();

      if (i < expectedTitles.length - 1) {
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(800);
      }
    }
  });
});

test.describe("Info külgpaneel kõigil slaididel", () => {
  test("esimene slaid - tiitel", async ({ page }) => {
    await page.goto("/");

    const infoButton = page.locator('[data-testid="info-button"]');
    await infoButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="info-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Selle slaidiga taoteldakse");
  });

  test("teine slaid - Kus asub andmebaas", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.keyboard.press("ArrowRight");
    // Oota kuni h2 element ilmub (kinnitab et oleme teisel slaidil)
    await page.waitForTimeout(1000);
    await page.waitForSelector("h2", { timeout: 10000 });
    await expect(page.locator("h2")).toContainText("Kus asub andmebaas?");

    const infoButton = page.locator('[data-testid="info-button"]');
    await infoButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="info-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Selle slaidiga taoteldakse");
    await expect(modal).toContainText("Interaktiivsuse kasutamine");
  });

  test("kolmas slaid - DBMS ülevaade", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(800);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1000);

    await expect(page.locator("h2")).toContainText("Andmebaaside Haldussüsteemid");

    const infoButton = page.locator('[data-testid="info-button"]');
    await infoButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="info-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Selle slaidiga taoteldakse");
  });
});
