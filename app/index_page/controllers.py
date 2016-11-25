import json

from flask import Blueprint, render_template, Response, Request, jsonify
import requests

index = Blueprint('index', __name__, url_prefix='/')


@index.route('/', methods=['GET'])
def show_index():
    """ just render index page template """
    return render_template("index/index.html")

@index.route('map', methods=['GET'], defaults={})
def show_map():
    resp = Response(render_template("index/map.html"))
    return resp

@index.route('api/points', methods=['POST'], defaults={})
def get_map_points():
    stations = get_stations()
    return jsonify(**stations)

def get_stations():
    data = {
        'bounds':"43.908777108384264, 12.612617375000013, 64.47610514622922, 80.28839862500003",
        'tab': "map",
        'territoryid': "c1"
    }
    headers = {'User-Agent': 'Chrome/54.0.2840.98', 'X-Requested-With': 'XMLHttpRequest', 'Origin': 'http://lukoil.ru'}
    session = requests.Session()
    # the session instance holds the cookie. So use it to get/post later.
    # e.g. session.get('https://example.com/profile')
    r = session.post('http://www.lukoil.ru/new/azslocator/GetStations/', headers=headers, data=data)
    stations = json.loads(str(r.text))
    return stations
