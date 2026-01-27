"""Timer Functionality Tests - T01-T10"""
import pytest
import time
from config import SEL
from utils.storage_helpers import create_profile, get_storage_data


class TestTimerStart:
    """Tests for starting the timer."""

    def test_t01_start_default(self, page, base_url):
        """T01: Start timer with default 25-minute preset."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Click start button
        page.click(SEL["start_btn"])

        # Timer should show working status
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Timer display should show time (approximately 25:00 or less)
        timer_time = page.locator(SEL["timer_time"])
        assert timer_time.is_visible()
        time_text = timer_time.text_content()
        assert ":" in time_text

    def test_t02_preset_longo(self, page, base_url):
        """T02: Start timer with 50/10 (Longo) preset."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Select Longo preset
        page.click(SEL["preset_longo"])

        # Click start
        page.click(SEL["start_btn"])

        # Should show 50:00 or close to it
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")
        timer_time = page.locator(SEL["timer_time"])
        time_text = timer_time.text_content()
        # Should be around 50 minutes
        assert time_text.startswith("50:") or time_text.startswith("49:")

    def test_t03_custom_time(self, page, base_url):
        """T03: Start timer with custom duration."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Select custom preset
        page.click(SEL["preset_custom"])

        # Wait for custom inputs to appear
        page.wait_for_selector(SEL["custom_inputs"])

        # Set work duration to 5 minutes
        work_input = page.locator(f"{SEL['custom_inputs']} {SEL['number_input']}").first
        work_input.fill("5")

        # Click start
        page.click(SEL["start_btn"])

        # Should show 05:00 or close
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")
        timer_time = page.locator(SEL["timer_time"])
        time_text = timer_time.text_content()
        assert time_text.startswith("05:") or time_text.startswith("04:")


class TestTimerControls:
    """Tests for timer pause, resume, stop controls."""

    def test_t04_pause(self, page, base_url):
        """T04: Pause running timer."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Start timer
        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Wait a moment then pause
        time.sleep(1)
        page.click(SEL["pause_btn"])

        # Should show paused status and resume button
        page.wait_for_selector(".status-badge.paused, .status-badge:has-text('Pausado')")
        assert page.locator(SEL["resume_btn"]).is_visible()

    def test_t05_resume(self, page, base_url):
        """T05: Resume paused timer."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Start and pause
        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")
        time.sleep(1)
        page.click(SEL["pause_btn"])
        page.wait_for_selector(".status-badge.paused, .status-badge:has-text('Pausado')")

        # Resume
        page.click(SEL["resume_btn"])

        # Should show working status again
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")
        assert page.locator(SEL["pause_btn"]).is_visible()

    def test_t06_stop(self, page, base_url):
        """T06: Stop timer resets to idle."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Start timer
        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Stop timer
        page.click(SEL["stop_btn"])

        # Should show idle status and start button
        page.wait_for_selector(".status-badge.idle, .status-badge:has-text('Pronto')")
        assert page.locator(SEL["start_btn"]).is_visible()


class TestTimerCompletion:
    """Tests for timer completion and transitions."""

    def test_t07_work_to_break_transition(self, page, base_url):
        """T07: Timer transitions from work to break after completion."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Use custom 1-minute duration for faster test
        page.click(SEL["preset_custom"])
        page.wait_for_selector(SEL["custom_inputs"])

        work_input = page.locator(f"{SEL['custom_inputs']} {SEL['number_input']}").first
        work_input.fill("1")

        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Wait for work period to complete (1 minute + buffer)
        page.wait_for_selector(
            ".status-badge.break, .status-badge:has-text('Intervalo')",
            timeout=70000
        )

        # Skip button should be visible during break
        assert page.locator(SEL["skip_btn"]).is_visible()

    def test_t08_skip_break(self, page, base_url):
        """T08: Skip break returns to idle."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Use 1-minute custom duration
        page.click(SEL["preset_custom"])
        page.wait_for_selector(SEL["custom_inputs"])

        work_input = page.locator(f"{SEL['custom_inputs']} {SEL['number_input']}").first
        work_input.fill("1")

        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Wait for break
        page.wait_for_selector(
            ".status-badge.break, .status-badge:has-text('Intervalo')",
            timeout=70000
        )

        # Click celebration overlay to dismiss it, then skip the break
        celebration = page.locator(".celebration-overlay")
        if celebration.count() > 0 and celebration.is_visible():
            celebration.click(force=True)
            page.wait_for_timeout(1000)

        # Skip the break (force click in case overlay is still visible)
        page.click(SEL["skip_btn"], force=True)

        # Should return to idle
        page.wait_for_selector(".status-badge.idle, .status-badge:has-text('Pronto')")
        assert page.locator(SEL["start_btn"]).is_visible()


class TestTimerPoints:
    """Tests for points and tracking."""

    def test_t09_points_awarded(self, page, base_url):
        """T09: Points are awarded after completing work session."""
        create_profile(page, points=0)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Get initial points (should be 0)
        points_btn = page.locator(SEL["points_btn"])
        initial_text = points_btn.text_content()

        # Complete a 1-minute work session
        page.click(SEL["preset_custom"])
        page.wait_for_selector(SEL["custom_inputs"])
        work_input = page.locator(f"{SEL['custom_inputs']} {SEL['number_input']}").first
        work_input.fill("1")

        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Wait for break (work completed)
        page.wait_for_selector(
            ".status-badge.break, .status-badge:has-text('Intervalo')",
            timeout=70000
        )

        # Points should have increased
        new_text = points_btn.text_content()
        # Extract numbers from text
        initial_points = int(''.join(filter(str.isdigit, initial_text)) or '0')
        new_points = int(''.join(filter(str.isdigit, new_text)) or '0')
        assert new_points > initial_points

    def test_t10_today_count(self, page, base_url):
        """T10: Today count increments after completing pomodoro."""
        create_profile(page, total_pomodoros=0)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Complete a 1-minute work session
        page.click(SEL["preset_custom"])
        page.wait_for_selector(SEL["custom_inputs"])
        work_input = page.locator(f"{SEL['custom_inputs']} {SEL['number_input']}").first
        work_input.fill("1")

        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Wait for break (work completed)
        page.wait_for_selector(
            ".status-badge.break, .status-badge:has-text('Intervalo')",
            timeout=70000
        )

        # Check storage for pomodoro count
        data = get_storage_data(page)
        profile = next(
            (p for p in data.get("profiles", [])
             if p["id"] == data.get("activeProfileId")),
            None
        )
        assert profile is not None
        assert profile.get("totalPomodoros", 0) >= 1
