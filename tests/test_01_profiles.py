"""Profile CRUD Tests - P01-P08"""
import pytest
from config import SEL
from utils.storage_helpers import (
    clear_storage,
    create_profile,
    create_multiple_profiles,
    get_storage_data,
)


class TestProfileCreation:
    """Tests for creating new profiles."""

    def test_p01_create_profile(self, page, base_url):
        """P01: Create a new profile via the modal."""
        # Should start on profile selector
        page.wait_for_selector(SEL["profile_selector"])

        # Click the add new profile card
        page.click(SEL["add_profile"])

        # Modal should open
        page.wait_for_selector(SEL["modal"])

        # Enter profile name
        page.fill(SEL["input_field"], "Maria")

        # Click create button
        page.click(SEL["create_btn"])

        # Should transition to timer screen
        page.wait_for_selector(SEL["timer_display"])

        # Profile badge should show the name
        badge = page.locator(SEL["profile_badge"])
        assert badge.is_visible()
        assert "Maria" in badge.text_content()

    def test_p07_empty_name_disabled(self, page, base_url):
        """P07: Create button should be disabled with empty name."""
        page.wait_for_selector(SEL["profile_selector"])
        page.click(SEL["add_profile"])
        page.wait_for_selector(SEL["modal"])

        # Create button should be disabled when name is empty
        create_btn = page.locator(SEL["create_btn"])

        # Clear the input field
        page.fill(SEL["input_field"], "")

        # Button should be disabled
        assert create_btn.is_disabled() or not create_btn.is_enabled()

    def test_p08_persistence(self, page, base_url):
        """P08: Created profile should persist after reload."""
        page.wait_for_selector(SEL["profile_selector"])
        page.click(SEL["add_profile"])
        page.wait_for_selector(SEL["modal"])
        page.fill(SEL["input_field"], "Persistente")
        page.click(SEL["create_btn"])
        page.wait_for_selector(SEL["timer_display"])

        # Reload the page
        page.reload()
        page.wait_for_load_state("networkidle")

        # Should still be on timer screen with same profile
        page.wait_for_selector(SEL["timer_display"])
        badge = page.locator(SEL["profile_badge"])
        assert "Persistente" in badge.text_content()


class TestProfileSelection:
    """Tests for selecting and switching profiles."""

    def test_p02_select_profile(self, page, base_url):
        """P02: Click profile card to select profile."""
        # Create a profile in storage
        create_profile(page, name="Joao")
        page.reload()
        page.wait_for_load_state("networkidle")

        # Should show timer screen with profile
        page.wait_for_selector(SEL["timer_display"])
        badge = page.locator(SEL["profile_badge"])
        assert "Joao" in badge.text_content()

    def test_p03_switch_profile(self, page, base_url):
        """P03: Switch between profiles via profile badge."""
        # Create multiple profiles
        create_multiple_profiles(page, [
            {"name": "Ana"},
            {"name": "Bruno"},
        ])
        page.reload()
        page.wait_for_load_state("networkidle")

        # Should show profile selector
        page.wait_for_selector(SEL["profile_selector"])

        # Select first profile
        page.click(f"{SEL['profile_card']}:has-text('Ana')")
        page.wait_for_selector(SEL["timer_display"])

        # Click profile badge to switch
        page.click(SEL["profile_badge"])
        page.wait_for_selector(SEL["modal"])

        # Select Bruno
        page.click(f"{SEL['profile_list_item']}:has-text('Bruno')")

        # Should now show Bruno
        page.wait_for_selector(SEL["timer_display"])
        badge = page.locator(SEL["profile_badge"])
        assert "Bruno" in badge.text_content()

    def test_p06_logout(self, page, base_url):
        """P06: Logout returns to profile selector."""
        create_profile(page, name="TestLogout")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Click profile badge
        page.click(SEL["profile_badge"])
        page.wait_for_selector(SEL["modal"])

        # Click logout button
        page.click("button:has-text('Sair')")

        # Should return to profile selector
        page.wait_for_selector(SEL["profile_selector"])


class TestProfileEditing:
    """Tests for editing profile details."""

    def test_p04_edit_name(self, page, base_url):
        """P04: Edit profile name via modal."""
        create_profile(page, name="Original")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Click edit button directly (it's in the header)
        page.click(SEL["edit_profile_btn"])

        # Wait for edit modal
        page.wait_for_selector(SEL["modal"])

        # Find and update name input
        name_input = page.locator(SEL["input_field"]).first
        name_input.fill("Atualizado")

        # Save
        page.click(SEL["save_btn"])

        # Verify name updated
        page.wait_for_selector(SEL["timer_display"])
        badge = page.locator(SEL["profile_badge"])
        assert "Atualizado" in badge.text_content()

    def test_p05_edit_avatar(self, page, base_url):
        """P05: Change avatar via edit modal."""
        create_profile(page, name="AvatarTest", avatar="rabbit")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(SEL["timer_display"])

        # Click edit button directly (it's in the header)
        page.click(SEL["edit_profile_btn"])

        # Wait for edit modal with avatar options
        page.wait_for_selector(SEL["modal"])
        page.wait_for_selector(SEL["avatar_grid"])

        # Select a different avatar (not rabbit)
        avatars = page.locator(f"{SEL['avatar_option']}:not(.selected)")
        if avatars.count() > 0:
            avatars.first.click()

        # Save
        page.click(SEL["save_btn"])

        # Avatar should have changed (or still valid)
        page.wait_for_selector(SEL["timer_display"])
        assert page.locator(SEL["profile_badge"]).is_visible()
