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
    headers = {
        'User-Agent': 'Chrome/54.0.2840.98',
        'Host': 'auto.lukoil.ru',
        # 'Cookie': 'srv_id=e99692e5ba8484a746ed3da3865b78d4; _ym_uid=1479674380235575645; ASP.NET_SessionId=dyh3mpedtjj04ulmjk0gfpmg; _ym_isad=1; __utmt=1; LukCountry=RU; LukChoosenId=097e1123-97d2-466d-b00f-3f6d4118697d; __utma=250865689.1571358088.1479674380.1479801042.1482432360.3; __utmb=250865689.2.10.1482432360; __utmc=250865689; __utmz=250865689.1479674380.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); LukGeo=%7B%22countryName%22%3A%22%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F%22%2C%22countryCode%22%3A%22RU%22%2C%22region%22%3A%22%D0%9F%D0%B5%D1%80%D0%BC%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BA%D1%80%D0%B0%D0%B9%22%2C%22city%22%3A%22%D0%9F%D0%B5%D1%80%D0%BC%D1%8C%22%7D; LukCartMapPositionYandex=58.01037399999167%3A56.229397999999975%3A11; LukPersonalizedJournal=[{"t":"a1c11241-4c5a-461f-99b0-172739f2b60d","c":0},{"t":"41594da9-5eb8-4a53-b4be-41596e84f53d","c":0}]; LukPersonalizedCoefficient=10'
    }
    session = requests.Session()
    # the session instance holds the cookie. So use it to get/post later.
    # e.g. session.get('https://example.com/profile')
    r = session.get('http://auto.lukoil.ru/api/cartography/GetSearchObjects?form=gasStation', headers=headers)
    stations = json.loads(str(r.text))
    return stations
