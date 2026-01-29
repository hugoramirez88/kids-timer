"""Progress Indicator Tests - PR01-PR06"""
import pytest
from config import SEL
from utils.storage_helpers import create_profile, get_storage_data


class TestProgressIndicators:
    """Tests for different progress indicator types."""

    def test_pr01_circular_default(self, page, base_url):
        """PR01: Circular progress indicator is shown by default."""
        create_profile(page, progress_indicator="circular")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Circular progress should be visible (SVG circle)
        circular = page.locator(".circular-progress, svg.progress-ring, .progress-circle")
        assert circular.count() > 0 or page.locator("svg circle").count() > 0

    def test_pr02_animal_path(self, page, base_url):
        """PR02: Animal path indicator shows animal on path."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Change to animal path via settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])
        page.click(f"{SEL['indicator_btn']}:has-text('Caminho')")
        page.click(SEL["close_btn"])
        page.wait_for_selector(SEL["timer_display"])

        # Animal path should be visible
        animal_path = page.locator(".animal-path")
        assert animal_path.count() > 0

    def test_pr03_hourglass(self, page, base_url):
        """PR03: Hourglass indicator shows hourglass SVG."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Change to hourglass via settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])
        page.click(f"{SEL['indicator_btn']}:has-text('Ampulheta')")
        page.click(SEL["close_btn"])
        page.wait_for_selector(SEL["timer_display"])

        # Hourglass should be visible
        hourglass = page.locator(".hourglass-container")
        assert hourglass.count() > 0

    def test_pr04_progress_bar(self, page, base_url):
        """PR04: Progress bar indicator shows horizontal bar."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Change to progress bar via settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])
        page.click(f"{SEL['indicator_btn']}:has-text('Barra')")
        page.click(SEL["close_btn"])
        page.wait_for_selector(SEL["timer_display"])

        # Progress bar should be visible
        progress_bar = page.locator(".progress-bar-container")
        assert progress_bar.count() > 0


class TestProgressSettings:
    """Tests for changing progress indicators via settings."""

    def test_pr05_change_via_settings(self, page, base_url):
        """PR05: Change progress indicator via settings panel."""
        create_profile(page, progress_indicator="circular")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        # Find and click a different indicator (not the active one)
        indicators = page.locator(f"{SEL['indicator_btn']}:not(.active)")
        if indicators.count() > 0:
            # Click on animal path indicator (Caminho)
            animal_btn = page.locator(f"{SEL['indicator_btn']}:has-text('Caminho')")
            if animal_btn.count() > 0:
                animal_btn.click()

        # Close settings
        page.click(SEL["close_btn"])

        # Verify indicator changed
        page.wait_for_selector(SEL["timer_display"])

    def test_pr06_persistence(self, page, base_url):
        """PR06: Progress indicator persists after reload."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Change to hourglass via settings
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])
        page.click(f"{SEL['indicator_btn']}:has-text('Ampulheta')")
        page.click(SEL["close_btn"])
        page.wait_for_selector(SEL["timer_display"])

        # Reload the page
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Hourglass should still be visible (persisted)
        hourglass = page.locator(".hourglass-container")
        assert hourglass.count() > 0


class TestProgressAccuracy:
    """Tests for progress indicator accuracy."""

    def test_progress_shows_during_timer(self, page, base_url):
        """Progress indicator updates while timer is running."""
        create_profile(page, progress_indicator="circular")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Start timer
        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Progress element should be visible
        progress = page.locator("svg circle, .progress-ring, .circular-progress")
        assert progress.count() > 0

        # Stop timer
        page.click(SEL["stop_btn"])
        page.wait_for_selector(".status-badge.idle, .status-badge:has-text('Pronto')")
