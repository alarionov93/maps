"""
    Simple API controllers
"""
import uuid

from flask import Blueprint, request, jsonify

from app.api import schemas

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/', methods=['GET'])
def hello():
    return jsonify({'data': 'hello, world!'})


@api.route('/create_item', methods=['POST', ])
def create_item():
    body = request.json
    v = schemas.create_item_validator
    if not v.validate(body):
        return jsonify({'errors': v.errors})

    if body['name'] == 'crash_me':
        return jsonify({
            'created': False,
            'item_id': '',
        })

    return jsonify({
        'created': True,
        'item_id': str(uuid.uuid4()),
    })
