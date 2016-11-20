import json

from flask import Flask
from flask_testing import TestCase

from app.api.controllers import api as ctl_api
from . import schemas


class APITest(TestCase):
    def create_app(self):
        # Create app and register blueprints for testing
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.register_blueprint(ctl_api)
        return app

    def test_hello(self):
        rs = self.client.get('/api/')
        self.assert200(rs)
        self.assertIn('data', rs.json)

    def test_create_get(self):
        rs = self.client.get('/api/create_item')
        self.assert405(rs)

    def test_create_post_ok(self):
        item = {'name': 'sshaman', 'age': 22}
        rs = self.client.post(
            path='/api/create_item',
            data=json.dumps(item),
            content_type='application/json'
        )

        self.assert200(rs)

        v = schemas.item_created_response_validator
        self.assertTrue(v.validate(rs.json), msg=v.errors)

    def test_create_post_invalid_data(self):
        invalid_item = {'name': 'a', 'age': -99}
        rs = self.client.post(
            path='/api/create_item',
            data=json.dumps(invalid_item),
            content_type='application/json'
        )

        self.assert200(rs)
        v = schemas.item_created_response_validator
        v.validate(rs.json)

        self.assertIn('errors', v.errors)

    def test_create_post_crash(self):
        invalid_item = {'name': 'crash_me', 'age': 25}
        rs = self.client.post(
            path='/api/create_item',
            data=json.dumps(invalid_item),
            content_type='application/json'
        )

        self.assert200(rs)
        v = schemas.item_created_response_validator

        v.validate(rs.json)
        self.assertNotIn('errors', v.errors)

        print(rs.json)
        self.assertEqual(rs.json['created'], False)
        self.assertEqual(rs.json['item_id'], '')
