# CSS Selectors (verified from component exploration)
SEL = {
    # Profile Selector
    "profile_selector": ".profile-selector",
    "profile_card": ".profile-card",
    "add_profile": ".profile-card.add-new",
    "profile_badge": ".profile-badge",
    "edit_profile_btn": ".edit-profile-btn",
    "profile_list_item": ".profile-list-item",
    "profile_avatar": ".profile-avatar",

    # Header
    "points_btn": ".points-btn",
    "badges_btn": ".badges-btn",
    "settings_btn": ".settings-btn",
    "today_count": ".today-count",

    # Timer Display
    "timer_display": ".timer-display",
    "timer_time": ".timer-time",
    "timer_status": ".timer-status",
    "status_badge": ".status-badge",

    # Timer Controls
    "timer_controls": ".timer-controls",
    "start_btn": "button:has-text('Começar')",
    "pause_btn": "button:has-text('Pausar')",
    "resume_btn": "button:has-text('Continuar')",
    "stop_btn": "button:has-text('Parar')",
    "skip_btn": "button:has-text('Pular')",
    "preset_curto": ".preset-btn:has-text('Curto')",
    "preset_longo": ".preset-btn:has-text('Longo')",
    "preset_custom": ".preset-btn:has-text('Personalizado')",
    "preset_btn": ".preset-btn",
    "custom_inputs": ".custom-inputs",

    # Modals
    "modal_overlay": ".modal-overlay",
    "modal": ".modal",
    "modal_large": ".modal-large",
    "modal_header": ".modal-header",
    "close_btn": ".close-btn",
    "create_btn": "button:has-text('Criar')",
    "save_btn": "button:has-text('Salvar')",
    "cancel_btn": "button:has-text('Cancelar')",

    # Settings (from SettingsPanel.vue)
    "settings_panel": ".settings-panel",
    "settings_section": ".settings-section",
    "theme_grid": ".theme-grid",
    "theme_btn": ".theme-btn",
    "indicator_grid": ".indicator-grid",
    "indicator_btn": ".indicator-btn",
    "toggle_btn": ".toggle-btn",
    "music_btn": ".music-btn",
    "volume_slider": "input[type='range']",
    "dev_section": ".dev-section",
    "dev_btn": ".dev-btn",

    # Progress Indicators
    "circular_progress": ".circular-progress",
    "animal_path": ".animal-path",
    "hourglass": ".hourglass",
    "progress_bar": ".progress-bar",

    # Music
    "music_player": ".music-player",
    "track_card": ".track-card",
    "now_playing": ".now-playing",
    "mini_player": ".mini-player",

    # Rewards Shop
    "rewards_shop": ".rewards-shop",
    "shop_item": ".shop-item",
    "buy_btn": ".buy-btn",
    "avatar_grid": ".avatar-grid",
    "avatar_option": ".avatar-option",

    # Badges
    "badges_display": ".badges-display",
    "badge_card": ".badge-card",
    "badge_locked": ".badge-card:not(.earned)",
    "badge_earned": ".badge-card.earned",

    # Break Suggestion
    "break_suggestion": ".break-suggestion",

    # Form elements
    "form_group": ".form-group",
    "input_field": ".form-group input[type='text']",
    "number_input": "input[type='number']",
}

# Viewports for responsive testing
MOBILE = {"width": 375, "height": 667}
TABLET = {"width": 768, "height": 1024}
DESKTOP = {"width": 1024, "height": 768}

# Timeouts
DEFAULT_TIMEOUT = 5000
ANIMATION_TIMEOUT = 1000
TIMER_TICK_TIMEOUT = 2000

# Test data
DEFAULT_PROFILE_NAME = "Teste"
DEFAULT_AVATAR = "rabbit"
DEFAULT_THEME = "divertido"
