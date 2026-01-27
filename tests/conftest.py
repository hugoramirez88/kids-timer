import sys
from pathlib import Path

# Add tests directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

import pytest
from playwright.sync_api import sync_playwright

from utils.port_detector import get_base_url
from utils.storage_helpers import clear_storage


@pytest.fixture(scope="session")
def browser():
    """Create a browser instance for the test session."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture
def context(browser):
    """Create a new browser context for each test."""
    context = browser.new_context()
    yield context
    context.close()


@pytest.fixture
def page(context):
    """Create a new page for each test."""
    page = context.new_page()
    yield page
    page.close()


@pytest.fixture(scope="session")
def base_url():
    """Get the base URL for the dev server."""
    return get_base_url()


@pytest.fixture(autouse=True)
def setup_test(page, base_url):
    """Setup that runs before each test - clears storage and navigates to app."""
    page.goto(base_url)
    clear_storage(page)
    page.reload()
    page.wait_for_load_state("networkidle")
    yield


@pytest.fixture
def mobile_page(browser, base_url):
    """Create a mobile viewport page."""
    context = browser.new_context(viewport={"width": 375, "height": 667})
    page = context.new_page()
    page.goto(base_url)
    clear_storage(page)
    page.reload()
    page.wait_for_load_state("networkidle")
    yield page
    page.close()
    context.close()


@pytest.fixture
def tablet_page(browser, base_url):
    """Create a tablet viewport page."""
    context = browser.new_context(viewport={"width": 768, "height": 1024})
    page = context.new_page()
    page.goto(base_url)
    clear_storage(page)
    page.reload()
    page.wait_for_load_state("networkidle")
    yield page
    page.close()
    context.close()


@pytest.fixture
def desktop_page(browser, base_url):
    """Create a desktop viewport page."""
    context = browser.new_context(viewport={"width": 1024, "height": 768})
    page = context.new_page()
    page.goto(base_url)
    clear_storage(page)
    page.reload()
    page.wait_for_load_state("networkidle")
    yield page
    page.close()
    context.close()
