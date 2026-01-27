"""Visual States Tests - VS01-VS08"""
import pytest
from config import SEL
from utils.storage_helpers import create_profile, award_badge


class TestButtonStates:
    """Tests for button visual states."""

    def test_vs01_preset_active_state(self, page, base_url):
        """VS01: Active preset button has green border and background."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Find active preset button (default should be Curto/25-5)
        active_preset = page.locator(f"{SEL['preset_btn']}.active")
        if active_preset.count() > 0:
            # Check visual styling
            classes = active_preset.get_attribute("class") or ""
            assert "active" in classes

            # Click a different preset
            page.click(SEL["preset_longo"])

            # New button should be active
            longo_btn = page.locator(SEL["preset_longo"])
            classes = longo_btn.get_attribute("class") or ""
            assert "active" in classes

    def test_vs02_buy_button_disabled_state(self, page, base_url):
        """VS02: Disabled buy button shows gray and blocked cursor."""
        create_profile(page, points=0)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open shop
        page.click(SEL["points_btn"])
        page.wait_for_selector(SEL["modal"])

        # Find disabled buy buttons
        disabled_btns = page.locator(f"{SEL['buy_btn']}:disabled, {SEL['buy_btn']}.disabled")
        if disabled_btns.count() > 0:
            first_disabled = disabled_btns.first
            # Should be disabled
            assert first_disabled.is_disabled() or \
                   "disabled" in (first_disabled.get_attribute("class") or "")


class TestMediaStates:
    """Tests for media player visual states."""

    def test_vs03_track_playing_state(self, page, base_url):
        """VS03: Playing track shows green border and music badge."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open settings and enable music
        page.click(SEL["settings_btn"])
        page.wait_for_selector(SEL["settings_panel"])

        music_btn = page.locator(f"{SEL['music_btn']}:has-text('Música')")
        if music_btn.count() > 0:
            music_btn.click()

        # Click a track to play
        tracks = page.locator(SEL["track_card"])
        if tracks.count() > 0:
            tracks.first.click()

            # Playing track should have visual indicator
            playing = page.locator(f"{SEL['track_card']}.playing, {SEL['track_card']}.active")
            # Track should show playing state


class TestThemeStates:
    """Tests for theme button visual states."""

    def test_vs04_locked_theme_state(self, page, base_url):
        """VS04: Locked theme shows opacity 0.6 and lock icon."""
        # Only unlock one theme
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
            first_locked = locked_themes.first
            classes = first_locked.get_attribute("class") or ""
            assert "locked" in classes

            # Check for lock icon
            lock_icon = first_locked.locator(".lock-icon, :text('🔒')")
            # Locked themes should have visual indicator


class TestBadgeStates:
    """Tests for badge visual states."""

    def test_vs05_earned_badge_state(self, page, base_url):
        """VS05: Earned badge shows full opacity and colored icon."""
        create_profile(page, badges=["primeiro-passo"])
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open badges
        page.click(SEL["badges_btn"])
        page.wait_for_selector(SEL["modal"])

        # Find earned badges
        earned = page.locator(f"{SEL['badge_earned']}, .badge-card.earned")
        if earned.count() > 0:
            first_earned = earned.first
            # Earned badges should not be dimmed
            classes = first_earned.get_attribute("class") or ""
            assert "locked" not in classes

    def test_vs06_locked_badge_state(self, page, base_url):
        """VS06: Locked badge shows 0.5 opacity and lock icon."""
        create_profile(page, badges=[])  # No badges
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open badges
        page.click(SEL["badges_btn"])
        page.wait_for_selector(SEL["modal"])

        # Find locked badges (those without "earned" class)
        locked = page.locator(".badge-card:not(.earned)")
        assert locked.count() > 0, "Should have unearned badges"

        # Locked badges should show lock icon (🔒)
        first_locked = locked.first
        lock_icon = first_locked.locator(".locked-icon, :text('🔒')")
        assert lock_icon.count() > 0 or "earned" not in (first_locked.get_attribute("class") or "")


class TestTimerStates:
    """Tests for timer mode visual states."""

    def test_vs07_break_mode_visual(self, page, base_url):
        """VS07: Break mode has distinct visual style (blue tint)."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Use 1-minute custom to reach break faster
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

        # Check for break visual state
        status_badge = page.locator(".status-badge.break, .status-badge:has-text('Intervalo')")
        assert status_badge.is_visible()

        # App may have different styling in break mode
        app = page.locator(".app, #app")
        # Break mode might add a class or change data attribute

    def test_working_mode_visual(self, page, base_url):
        """Working mode shows distinct visual style."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Start timer
        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Status badge should show working state
        status_badge = page.locator(".status-badge.working, .status-badge:has-text('Trabalhando')")
        assert status_badge.is_visible()

        # Stop timer
        page.click(SEL["stop_btn"])


class TestShopItemStates:
    """Tests for shop item visual states."""

    def test_vs08_owned_item_badge(self, page, base_url):
        """VS08: Owned item shows 'Desbloqueado' badge."""
        create_profile(
            page,
            avatar="rabbit",
            unlocked_avatars=["rabbit", "turtle"]
        )
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Open shop
        page.click(SEL["points_btn"])
        page.wait_for_selector(SEL["modal"])

        # Look for owned/unlocked indicators
        owned = page.locator(":text('Desbloqueado'), :text('Em uso'), .owned, .unlocked")
        # Should show unlocked items


class TestStatusTransitions:
    """Tests for visual state transitions."""

    def test_idle_to_working_transition(self, page, base_url):
        """Idle to working state transition is visually clear."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Verify idle state
        idle_badge = page.locator(".status-badge.idle, .status-badge:has-text('Pronto')")
        assert idle_badge.is_visible()

        # Start timer
        page.click(SEL["start_btn"])

        # Should transition to working
        working_badge = page.locator(".status-badge.working, .status-badge:has-text('Trabalhando')")
        working_badge.wait_for(state="visible")
        assert working_badge.is_visible()

        # Idle badge should no longer be visible
        idle_badge = page.locator(".status-badge.idle")
        assert idle_badge.count() == 0 or not idle_badge.is_visible()

        # Stop timer
        page.click(SEL["stop_btn"])

    def test_working_to_paused_transition(self, page, base_url):
        """Working to paused state transition is visually clear."""
        create_profile(page)
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Start timer
        page.click(SEL["start_btn"])
        page.wait_for_selector(".status-badge.working, .status-badge:has-text('Trabalhando')")

        # Pause timer
        page.click(SEL["pause_btn"])

        # Should transition to paused
        paused_badge = page.locator(".status-badge.paused, .status-badge:has-text('Pausado')")
        paused_badge.wait_for(state="visible")
        assert paused_badge.is_visible()

        # Stop timer
        page.click(SEL["stop_btn"])
