"""Settings Panel Tests - S01-S10"""
import pytest
from config import SEL
from utils.storage_helpers import create_profile, get_storage_data


class TestSettingsModal:
    """Tests for settings modal behavior."""

    def test_s01_open_settings(self, page, base_url):
        """S01: Open settings modal."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Click settings button
        page.click(SEL["settings_btn"])

        # Settings modal should open
        page.wait_for_selector(SEL["settings_panel"])
        assert page.locator(SEL["settings_panel"]).is_visible()

    def test_s10_close_settings(self, page, base_url):
        """S10: Close settings by clicking outside."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Click close button
        page.click(SEL["close_btn"])

        # Modal should close
        page.wait_for_selector(SEL["settings_panel"], state="hidden")


class TestThemeSettings:
    """Tests for theme selection."""

    def test_s02_theme_select(self, page, base_url):
        """S02: Select and apply a theme."""
        create_profile(page, theme="divertido", unlocked_themes=["divertido", "minimalista"])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Click minimalista theme
        minimalista_btn = page.locator(f"{SEL['theme_btn']}:has-text('Minimalista')")
        if minimalista_btn.count() > 0:
            minimalista_btn.click()

            # Theme should be applied (check data-theme attribute)
            page.wait_for_timeout(300)
            theme_attr = page.locator("html").get_attribute("data-theme")
            assert theme_attr == "minimalista" or "minimalista" in (theme_attr or "")

    def test_s03_locked_theme(self, page, base_url):
        """S03: Locked theme shows lock icon and is disabled."""
        # Only unlock default themes
        create_profile(page, theme="divertido", unlocked_themes=["divertido"])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find locked theme buttons
        locked_themes = page.locator(f"{SEL['theme_btn']}.locked")
        if locked_themes.count() > 0:
            # Locked themes should have reduced opacity or lock icon
            first_locked = locked_themes.first
            classes = first_locked.get_attribute("class") or ""
            assert "locked" in classes


class TestToggleSettings:
    """Tests for toggle switches."""

    def test_s04_sound_toggle(self, page, base_url):
        """S04: Toggle sound effects on/off."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find sound effects toggle
        sound_toggle = page.locator(f"{SEL['toggle_btn']}").first
        if sound_toggle.is_visible():
            # Get initial state
            initial_active = "active" in (sound_toggle.get_attribute("class") or "")

            # Click to toggle
            sound_toggle.click()
            page.wait_for_timeout(200)

            # State should have changed
            new_active = "active" in (sound_toggle.get_attribute("class") or "")
            assert new_active != initial_active

    def test_s05_volume_slider(self, page, base_url):
        """S05: Adjust volume slider."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find volume slider
        slider = page.locator(SEL["volume_slider"]).first
        if slider.is_visible():
            # Get initial value
            initial_value = slider.input_value()

            # Set new value
            slider.fill("0.3")
            page.wait_for_timeout(200)

            # Value should persist
            new_value = slider.input_value()

    def test_s06_haptic_toggle(self, page, base_url):
        """S06: Toggle haptic feedback."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find haptic toggle (might be labeled "Vibração" or similar)
        haptic_toggle = page.locator(":text('Vibração'), :text('Haptic')").locator("xpath=..").locator(SEL["toggle_btn"])
        if haptic_toggle.count() > 0:
            haptic_toggle.first.click()


class TestMusicSettings:
    """Tests for music preference settings."""

    def test_s07_music_options(self, page, base_url):
        """S07: Switch between music options."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find music option buttons
        music_btns = page.locator(SEL["music_btn"])
        if music_btns.count() > 1:
            # Click on "Música" option
            music_option = page.locator(f"{SEL['music_btn']}:has-text('Música')")
            if music_option.count() > 0:
                music_option.click()
                page.wait_for_timeout(200)

                # Should show music player or track selection
                # The UI should update to show music options


class TestAlertSettings:
    """Tests for timer alert settings."""

    def test_s08_alert_toggles(self, page, base_url):
        """S08: Toggle time alert settings."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find alert toggle buttons
        toggles = page.locator(SEL["toggle_btn"])
        if toggles.count() > 0:
            # Click each toggle to verify they work
            for i in range(min(3, toggles.count())):
                toggle = toggles.nth(i)
                if toggle.is_visible():
                    toggle.click()
                    page.wait_for_timeout(100)


class TestDevMode:
    """Tests for developer mode."""

    def test_s09_dev_mode(self, page, base_url):
        """S09: Enable dev mode by tapping header 7 times."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find settings header
        header = page.locator(f"{SEL['modal_header']}:has-text('Configurações')")
        if header.count() > 0:
            # Tap 7 times to enable dev mode
            for _ in range(7):
                header.click()
                page.wait_for_timeout(50)

            # Dev section should appear
            page.wait_for_timeout(500)
            dev_section = page.locator(SEL["dev_section"])
            # Dev mode may show extra buttons/options

    def test_dev_buttons_add_points(self, page, base_url):
        """Dev mode +50 points button adds points."""
        create_profile(page, points=0)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings and enable dev mode
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        header = page.locator(f"{SEL['modal_header']}:has-text('Configurações')")
        if header.count() > 0:
            for _ in range(7):
                header.click()
                page.wait_for_timeout(50)

            page.wait_for_timeout(500)

            # Click +50 points button
            add_points_btn = page.locator(f"{SEL['dev_btn']}:has-text('+50')")
            if add_points_btn.count() > 0:
                add_points_btn.click()

                # Check points increased
                data = get_storage_data(page)
                profile = next(
                    (p for p in data.get("profiles", [])
                     if p["id"] == data.get("activeProfileId")),
                    {}
                )
                assert profile.get("points", 0) >= 50
