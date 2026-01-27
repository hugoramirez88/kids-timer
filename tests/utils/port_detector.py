import socket


def find_port(ports=None):
    """Find an active dev server port."""
    if ports is None:
        ports = [5173, 5174, 5175, 3000, 3001, 3002]

    for port in ports:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            if s.connect_ex(('localhost', port)) == 0:
                return port

    raise RuntimeError(
        f"Dev server not running on any of these ports: {ports}. "
        "Start with: cd /home/in/kids-timer && npm run dev"
    )


def get_base_url():
    """Get the base URL for the dev server."""
    return f"http://localhost:{find_port()}"
