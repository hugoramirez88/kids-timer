import json
from typing import Optional


def clear_storage(page):
    """Clear all kids-timer localStorage data."""
    page.evaluate("localStorage.removeItem('kids-timer-data')")
    page.evaluate("localStorage.removeItem('kids-timer-last-date')")


def get_storage_data(page) -> dict:
    """Get current localStorage data."""
    data = page.evaluate("localStorage.getItem('kids-timer-data')")
    if data:
        return json.loads(data)
    return {}


def create_profile(
    page,
    name: str = "Teste",
    points: int = 0,
    badges: Optional[list] = None,
    avatar: str = "rabbit",
    theme: str = "divertido",
    progress_indicator: str = "circular",
    total_pomodoros: int = 0,
    unlocked_themes: Optional[list] = None,
    unlocked_avatars: Optional[list] = None,
):
    """Create a test profile in localStorage."""
    if badges is None:
        badges = []
    if unlocked_themes is None:
        unlocked_themes = ["divertido", "minimalista"]
    if unlocked_avatars is None:
        unlocked_avatars = ["rabbit"]

    data = {
        "version": 1,
        "profiles": [{
            "id": "test-profile-001",
            "name": name,
            "avatar": avatar,
            "theme": theme,
            "progressIndicator": progress_indicator,
            "musicPreference": "none",
            "pathAnimal": "rabbit",
            "totalPomodoros": total_pomodoros,
            "totalMinutes": total_pomodoros * 25,
            "currentStreak": 0,
            "longestStreak": 0,
            "lastActiveDate": None,
            "points": points,
            "unlockedThemes": unlocked_themes,
            "unlockedAvatars": unlocked_avatars,
            "unlockedAnimals": ["rabbit"],
            "unlockedSoundscapes": ["piano-calmo", "anoitecer"],
            "unlockedEnergeticTracks": ["happy-ukulele", "adventure-theme"],
            "badges": badges,
            "triedIndicators": []
        }],
        "activeProfileId": "test-profile-001",
        "globalSettings": {
            "masterVolume": 0.7,
            "soundEffectsEnabled": True,
            "defaultPreset": "25-5",
            "hapticEnabled": True
        },
        "sessionHistory": [],
        "timerState": None
    }

    json_str = json.dumps(data)
    page.evaluate(f"localStorage.setItem('kids-timer-data', {repr(json_str)})")


def create_multiple_profiles(page, profiles: list):
    """Create multiple test profiles."""
    profile_list = []
    for i, p in enumerate(profiles):
        profile_list.append({
            "id": f"test-profile-{i+1:03d}",
            "name": p.get("name", f"Profile {i+1}"),
            "avatar": p.get("avatar", "rabbit"),
            "theme": p.get("theme", "divertido"),
            "progressIndicator": p.get("progressIndicator", "circular"),
            "musicPreference": "none",
            "pathAnimal": "rabbit",
            "totalPomodoros": p.get("totalPomodoros", 0),
            "totalMinutes": p.get("totalPomodoros", 0) * 25,
            "currentStreak": 0,
            "longestStreak": 0,
            "lastActiveDate": None,
            "points": p.get("points", 0),
            "unlockedThemes": ["divertido", "minimalista"],
            "unlockedAvatars": ["rabbit"],
            "unlockedAnimals": ["rabbit"],
            "unlockedSoundscapes": ["piano-calmo", "anoitecer"],
            "unlockedEnergeticTracks": ["happy-ukulele", "adventure-theme"],
            "badges": p.get("badges", []),
            "triedIndicators": []
        })

    data = {
        "version": 1,
        "profiles": profile_list,
        "activeProfileId": None,
        "globalSettings": {
            "masterVolume": 0.7,
            "soundEffectsEnabled": True,
            "defaultPreset": "25-5",
            "hapticEnabled": True
        },
        "sessionHistory": [],
        "timerState": None
    }

    json_str = json.dumps(data)
    page.evaluate(f"localStorage.setItem('kids-timer-data', {repr(json_str)})")


def add_points(page, points: int):
    """Add points to the active profile."""
    page.evaluate(f"""
        (() => {{
            const data = JSON.parse(localStorage.getItem('kids-timer-data'));
            const profile = data.profiles.find(p => p.id === data.activeProfileId);
            if (profile) {{
                profile.points += {points};
                localStorage.setItem('kids-timer-data', JSON.stringify(data));
            }}
        }})()
    """)


def award_badge(page, badge_id: str):
    """Award a badge to the active profile."""
    page.evaluate(f"""
        (() => {{
            const data = JSON.parse(localStorage.getItem('kids-timer-data'));
            const profile = data.profiles.find(p => p.id === data.activeProfileId);
            if (profile && !profile.badges.includes('{badge_id}')) {{
                profile.badges.push('{badge_id}');
                localStorage.setItem('kids-timer-data', JSON.stringify(data));
            }}
        }})()
    """)


def set_timer_state(page, status: str, time_remaining: int, total_time: int):
    """Set timer state in localStorage for testing restoration."""
    page.evaluate(f"""
        (() => {{
            const data = JSON.parse(localStorage.getItem('kids-timer-data')) || {{}};
            data.timerState = {{
                status: '{status}',
                timeRemaining: {time_remaining},
                totalTime: {total_time},
                targetEndTime: Date.now() + {time_remaining} * 1000,
                workDuration: 25,
                breakDuration: 5,
                pausedStatus: null,
                savedAt: Date.now()
            }};
            localStorage.setItem('kids-timer-data', JSON.stringify(data));
        }})()
    """)
