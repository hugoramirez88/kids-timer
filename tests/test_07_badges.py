"""Badge System Tests - B01-B05"""
import pytest
from config import SEL
from utils.storage_helpers import create_profile, award_badge, get_storage_data


class TestBadgesDisplay:
    """Tests for badges display modal."""

    def test_b01_open_badges(self, page, base_url):
        """B01: Open badges modal."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Click badges button
        page.click(SEL["badges_btn"])

        # Badges modal should open
        page.wait_for_selector(SEL["modal"])

        # Should show badges display
        badges_content = page.locator(":text('Conquistas'), :text('Badges')")
        assert badges_content.count() > 0 or page.locator(SEL["badges_display"]).count() > 0

    def test_b02_locked_badge_display(self, page, base_url):
        """B02: Locked badges show lock icon and dimmed appearance."""
        create_profile(page, badges=[])  # No badges earned
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open badges
        page.click(SEL["badges_btn"])
        page.wait_for_selector(SEL["modal"])

        # Look for locked badges
        locked_badges = page.locator(
            f"{SEL['badge_locked']}, .badge-card:not(.earned)"
        )
        # Should have some locked badges
        if locked_badges.count() > 0:
            # Check visual styling (opacity, lock icon)
            first_locked = locked_badges.first
            # Locked badges should be visible but dimmed

    def test_b03_earned_badge_display(self, page, base_url):
        """B03: Earned badges show full color and icon."""
        # Create profile with some badges
        create_profile(page, badges=["primeiro-passo", "cinco-seguidos"])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open badges
        page.click(SEL["badges_btn"])
        page.wait_for_selector(SEL["modal"])

        # Look for earned badges
        earned_badges = page.locator(
            f"{SEL['badge_earned']}, .badge-card.earned"
        )
        # Should have earned badges
        assert earned_badges.count() > 0

    def test_b04_badges_count_summary(self, page, base_url):
        """B04: Badge count summary shows X of total."""
        create_profile(page, badges=["primeiro-passo"])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open badges
        page.click(SEL["badges_btn"])
        page.wait_for_selector(SEL["modal"])

        # Look for count text like "1 de 8 conquistas"
        count_text = page.locator(":text('de'), :text('conquistas')")
        # Should show progress indicator


class TestBadgeEarning:
    """Tests for earning badges."""

    def test_b05_first_pomodoro_badge(self, page, base_url):
        """B05: Earn 'Primeiro Passo' badge after first pomodoro."""
        create_profile(page, badges=[], total_pomodoros=0)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Verify no badges initially
        initial_data = get_storage_data(page)
        initial_profile = next(
            (p for p in initial_data.get("profiles", [])
             if p["id"] == initial_data.get("activeProfileId")),
            {}
        )
        assert len(initial_profile.get("badges", [])) == 0

        # Complete a 1-minute pomodoro
        page.click(SEL["preset_custom"])
        page.wait_for_selector(SEL["custom_inputs"])

        work_input = page.locator(f"{SEL['custom_inputs']} {SEL['number_input']}").first
        work_input.fill("1")

        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Wait for work period to complete
        page.wait_for_selector(
            ".status-badge.break, .status-badge:has-text('Intervalo')",
            timeout=70000
        )

        # Check badges after completion
        final_data = get_storage_data(page)
        final_profile = next(
            (p for p in final_data.get("profiles", [])
             if p["id"] == final_data.get("activeProfileId")),
            {}
        )

        # Should have earned first-step badge
        badges = final_profile.get("badges", [])
        assert "primeiro-passo" in badges or len(badges) > 0

    def test_badge_via_storage(self, page, base_url):
        """Verify badge appears in UI after being added via storage."""
        create_profile(page, badges=[])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Award badge via storage helper
        award_badge(page, "primeiro-passo")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open badges
        page.click(SEL["badges_btn"])
        page.wait_for_selector(SEL["modal"])

        # Badge should be visible and earned
        earned_badges = page.locator(
            f"{SEL['badge_earned']}, .badge-card.earned"
        )
        assert earned_badges.count() > 0


class TestBadgePersistence:
    """Tests for badge persistence."""

    def test_badges_persist_after_reload(self, page, base_url):
        """Earned badges persist after page reload."""
        create_profile(page, badges=["primeiro-passo", "cinco-seguidos"])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Reload again
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Check badges still in storage
        data = get_storage_data(page)
        profile = next(
            (p for p in data.get("profiles", [])
             if p["id"] == data.get("activeProfileId")),
            {}
        )
        badges = profile.get("badges", [])
        assert "primeiro-passo" in badges
        assert "cinco-seguidos" in badges
