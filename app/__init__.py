"""
    Initial Flask application routine
"""

from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('config')


@app.errorhandler(404)
def not_found(error):
    return render_template('errors/404.html'), 404


@app.errorhandler(500)
def internal_server_error(error):
    return render_template('errors/500.html'), 500


# Import modules using blueprint handlers
from app.index_page.controllers import index as ctl_index
from app.api.controllers import api as ctl_api

# Register blueprints
app.register_blueprint(ctl_index)
app.register_blueprint(ctl_api)
