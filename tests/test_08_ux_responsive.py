"""Responsive Design Tests - RES01-RES05"""
import pytest
from config import SEL, MOBILE, TABLET, DESKTOP
from utils.storage_helpers import create_profile


class TestMobileViewport:
    """Tests for mobile viewport (375x667)."""

    def test_res01_no_horizontal_scroll(self, mobile_page, base_url):
        """RES01: No horizontal scroll on mobile (within 10px tolerance)."""
        create_profile(mobile_page)
        mobile_page.reload()
        mobile_page.wait_for_load_state("networkidle")
        mobile_page.wait_for_selector(SEL["timer_display"])

        # Check for horizontal overflow (allow small tolerance for scrollbar)
        scroll_width = mobile_page.evaluate("document.documentElement.scrollWidth")
        client_width = mobile_page.evaluate("document.documentElement.clientWidth")

        # Allow up to 10px overflow (may be due to scrollbar or minor styling)
        assert scroll_width <= client_width + 10, \
            f"Horizontal scroll detected: scrollWidth={scroll_width}, clientWidth={client_width}"

    def test_res02_timer_controls_visible(self, mobile_page, base_url):
        """RES02: All timer controls are visible on mobile."""
        create_profile(mobile_page)
        mobile_page.reload()
        mobile_page.wait_for_load_state("networkidle")
        mobile_page.wait_for_selector(SEL["timer_display"])

        # Check that key controls are visible
        assert mobile_page.locator(SEL["start_btn"]).is_visible()

        # Check preset buttons
        presets = mobile_page.locator(SEL["preset_btn"])
        visible_count = 0
        for i in range(presets.count()):
            if presets.nth(i).is_visible():
                visible_count += 1
        assert visible_count >= 2  # At least 2 presets should be visible

    def test_res03_modals_fit_width(self, mobile_page, base_url):
        """RES03: Modals fit within mobile viewport width."""
        create_profile(mobile_page)
        mobile_page.reload()
        mobile_page.wait_for_load_state("networkidle")
        mobile_page.wait_for_selector(SEL["timer_display"])

        # Open settings modal
        mobile_page.click(SEL["settings_btn"])
        mobile_page.wait_for_selector(SEL["modal"])

        # Get modal dimensions
        modal = mobile_page.locator(SEL["modal"]).first
        box = modal.bounding_box()

        if box:
            viewport_width = 375
            # Modal should fit within viewport (with some padding)
            assert box["width"] <= viewport_width, \
                f"Modal too wide: {box['width']} > {viewport_width}"


class TestTabletViewport:
    """Tests for tablet viewport (768x1024)."""

    def test_res04_tablet_grid(self, tablet_page, base_url):
        """RES04: Tablet shows proper grid layout."""
        create_profile(tablet_page)
        tablet_page.reload()
        tablet_page.wait_for_load_state("networkidle")
        tablet_page.wait_for_selector(SEL["timer_display"])

        # Open settings to see grid layout
        tablet_page.click(SEL["settings_btn"])
        tablet_page.wait_for_selector(SEL["settings_panel"])

        # Theme grid should be visible
        theme_grid = tablet_page.locator(SEL["theme_grid"])
        if theme_grid.count() > 0:
            box = theme_grid.bounding_box()
            if box:
                # Grid should utilize tablet width
                assert box["width"] >= 300  # Should be wider than narrow mobile


class TestDesktopViewport:
    """Tests for desktop viewport (1024x768)."""

    def test_res05_desktop_layout(self, desktop_page, base_url):
        """RES05: Desktop shows optimal spacing."""
        create_profile(desktop_page)
        desktop_page.reload()
        desktop_page.wait_for_load_state("networkidle")
        desktop_page.wait_for_selector(SEL["timer_display"])

        # Check that layout uses available space
        # Use specific selector to avoid strict mode violation
        app = desktop_page.locator("div.app").first
        if app.count() > 0:
            box = app.bounding_box()
            if box:
                # App should have reasonable width
                assert box["width"] >= 400


class TestResponsiveElements:
    """Tests for responsive element behavior."""

    @pytest.mark.parametrize("viewport", [MOBILE, TABLET, DESKTOP])
    def test_no_horizontal_scroll_all_viewports(self, browser, base_url, viewport):
        """No horizontal scroll on any viewport size (within 10px tolerance)."""
        context = browser.new_context(viewport=viewport)
        page = context.new_page()
        page.goto(base_url)

        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        scroll_width = page.evaluate("document.documentElement.scrollWidth")
        client_width = page.evaluate("document.documentElement.clientWidth")

        # Allow up to 10px overflow (may be due to scrollbar or minor styling)
        assert scroll_width <= client_width + 10, \
            f"Horizontal scroll at {viewport}: scrollWidth={scroll_width}, clientWidth={client_width}"

        page.close()
        context.close()

    @pytest.mark.parametrize("viewport", [MOBILE, TABLET, DESKTOP])
    def test_header_visible_all_viewports(self, browser, base_url, viewport):
        """Header buttons are visible on all viewport sizes."""
        context = browser.new_context(viewport=viewport)
        page = context.new_page()
        page.goto(base_url)

        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Header buttons should be visible
        assert page.locator(SEL["profile_badge"]).is_visible()
        assert page.locator(SEL["settings_btn"]).is_visible()

        page.close()
        context.close()

    @pytest.mark.parametrize("viewport", [MOBILE, TABLET, DESKTOP])
    def test_modals_accessible_all_viewports(self, browser, base_url, viewport):
        """Modals can be opened and closed on all viewports."""
        context = browser.new_context(viewport=viewport)
        page = context.new_page()
        page.goto(base_url)

        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["modal"])

        # Modal should be visible
        assert page.locator(SEL["modal"]).is_visible()

        # Close button should be accessible
        close_btn = page.locator(SEL["close_btn"])
        assert close_btn.is_visible()
        close_btn.click()

        # Modal should close
        page.wait_for_selector(SEL["modal"], state="hidden")

        page.close()
        context.close()
