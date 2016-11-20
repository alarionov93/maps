"""
    Runner for simple debug server
"""

from app import app
import config

app.run(host=config.LISTEN_ADDR, port=config.LISTEN_PORT, debug=config.DEBUG)
