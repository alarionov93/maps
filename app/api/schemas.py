from cerberus import Validator

create_item_request_schema = {
    'name': {'type': 'string', 'empty': False, 'required': True, 'minlength': 5},
    'age':  {'type': 'number', 'empty': False, 'required': True, 'min': 1}
}

create_item_validator = Validator(create_item_request_schema, allow_unknown=False)

item_created_response_schema = {
    'created': {'type': 'boolean', 'empty': False, 'required': True},
    'item_id': {'type': 'string', 'empty': True, 'required': True, 'maxlength': 36},
}

item_created_response_validator = Validator(item_created_response_schema, allow_unknown=False)
