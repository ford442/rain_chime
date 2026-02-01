from playwright.sync_api import sync_playwright, expect

def test_rain_mode_zoom():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        page.goto("http://localhost:5173")

        # 1. Click "Start Experience" to initialize audio and remove overlay
        # It says "Start Experience"
        page.click("text=Start Experience")

        # 2. Wait for the overlay to disappear (isAudioReady=true)
        # The overlay has class bg-black/60. We can wait for "Start Rain" to be clickable/enabled?
        # Or just wait for the "Start Rain" text which is in the controls.

        # Actually, "Start Rain" button is disabled until isAudioReady.
        # But since we clicked Start Experience, it should trigger logic.
        # Note: In headless mode without real audio hardware, AudioContext might behave differently,
        # but the hook usually handles it.

        # Wait for "Start Rain" to be enabled?
        # Or just wait for a short bit.
        page.wait_for_timeout(1000)

        # 3. Click "Start Rain"
        page.click("text=Start Rain")

        # 4. Wait for transition
        page.wait_for_timeout(2000)

        # 5. Screenshot
        page.screenshot(path="verification/rain_mode.png")

        browser.close()

if __name__ == "__main__":
    test_rain_mode_zoom()
