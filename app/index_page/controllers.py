from flask import Blueprint, render_template
import requests

index = Blueprint('index', __name__, url_prefix='/')


@index.route('/', methods=['GET'])
def show_index():
    """ just render index page template """
    return render_template("index/index.html")

@index.route('map', methods=['GET'], defaults={})
def show_map():
    return render_template("index/map.html")

def get_stations():
    r = requests.post('http://www.lukoil.ru/new/azslocator/GetStations/', )
    return
