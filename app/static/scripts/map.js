function Point(id, header, gasTypes, lat, lon) {
    this.id = id;
    this.header = header;
    this.gasTypes = gasTypes;
    this.lat = parseFloat(lat);
    this.lon = parseFloat(lon);
}

(function(){
	ymaps.ready(init);
    var shown;

    function init() {
    	myMap = new ymaps.Map("map", {
    		center: [58.010259, 56.234195],
    		zoom: 5
    	}, {
    		autoFitToViewport: 'always'
    	}, {
            searchControlProvider: 'yandex#search'
        });
        $.ajax({
            url: '/api/points',
            type: 'post',
            // data: $.param(data),
            success: function(resp) {
                var points = [];
                console.log(resp);
                var pts;
                var point;
                for (var i = 0; i < resp.Stations.length; i++) {
                    point = new Point(i, resp["Stations"][i]["a"], resp["Stations"][i]["f"],
                        resp["Stations"][i]["y"], resp["Stations"][i]["x"]);
                    // pts = drawPts(point);
                    // myMap.geoObjects.add(pts);
                    points.push(point);
                }
                clusterize(points);
                myMap.geoObjects.events.add('click', function (e) {
                    // Получение ссылки на дочерний объект, на котором произошло событие.
                    var point = e.get('target');
                    var coords = point.geometry._coordinates;
                    getRoute(coords, false);
                    // for (var i = 0; i < myMap.geoObjects.length; i++) {
                    //     if(myMap.geoObjects[i] !== point) {
                    //         myMap.geoObjects[i].setOptions('visible', false);
                    //     }
                    // }
                });
            },
            error: function(resp) {
                console.log(resp);
            }
        });
    }
})();

/**
 *
 *
 * @param point
 * @returns {ymaps.GeoObject}
 */
function drawPts(point) {
   myGeoObject = new ymaps.GeoObject({
    // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: [point.lat, point.lon]
        },
        // Свойства.
        properties: {
            // Контент метки.
            iconContent: point.id,
            balloonContent: point.header + " (" + point.gasTypes + ")"
        }
    }, {
        // Опции.
        // Иконка метки будет растягиваться под размер ее содержимого.
        preset: 'twirl#redStretchyIcon',
        // Метку можно перемещать.
        draggable: false
    });

  return myGeoObject;
}
/**
 *
 * @param to
 * @param from
 */
function getRoute(to, from) {
    if (!from) {
        curCoords = getLocation(); //getCurrentLocation
        if (curCoords) {
            from = curCoords;
        } else {
            from = [58.010259, 56.234195];
            console.error("Can not get location");
        }
    }
    ymaps.route([
        from,
        // {
        //     point: 'Москва, метро Молодежная',
        //     // метро "Молодежная" - транзитная точка
        //     // (проезжать через эту точку, но не останавливаться в ней).
        //     type: 'viaPoint'
        // },
        // [55.731272, 37.447198], // метро "Кунцевская".
        to
    ]).then(function (route) {
        myMap.geoObjects.add(route);
        // Зададим содержание иконок начальной и конечной точкам маршрута.
        // С помощью метода getWayPoints() получаем массив точек маршрута.
        // Массив транзитных точек маршрута можно получить с помощью метода getViaPoints.
        var routeData = {
            length: route.properties._data.RouterRouteMetaData.Length.text,
            time: route.properties._data.RouterRouteMetaData.Time.text
        };
        showRouteData(routeData);
        var points = route.getWayPoints(),
            lastPoint = points.getLength() - 1;
        // Задаем стиль метки - иконки будут красного цвета, и
        // их изображения будут растягиваться под контент.
        points.options.set('preset', 'islands#redStretchyIcon');
        // Задаем контент меток в начальной и конечной точках.
        points.get(0).properties.set('iconContent', 'Точка отправления');
        points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');

        // Проанализируем маршрут по сегментам.
        // Сегмент - участок маршрута, который нужно проехать до следующего
        // изменения направления движения.
        // Для того, чтобы получить сегменты маршрута, сначала необходимо получить
        // отдельно каждый путь маршрута.
        // Весь маршрут делится на два пути:
        // 1) от улицы Крылатские холмы до станции "Кунцевская";
        // 2) от станции "Кунцевская" до "Пионерская".

        var moveList = 'Трогаемся,</br>',
            way,
            segments;
        // Получаем массив путей.
        for (var i = 0; i < route.getPaths().getLength(); i++) {
            way = route.getPaths().get(i);
            segments = way.getSegments();
            for (var j = 0; j < segments.length; j++) {
                var street = segments[j].getStreet();
                moveList += ('Едем ' + segments[j].getHumanAction() + (street ? ' на ' + street : '') + ', проезжаем ' + segments[j].getLength() + ' м.,');
                moveList += '</br>'
            }
        }
        moveList += 'Останавливаемся.';
        // Выводим маршрутный лист.
        $('#list').append(moveList);
    }, function (error) {
        console.log('Возникла ошибка: ' + error.message);
    });
}

function showRouteData(data) {
    var barInfo = $(document).find('#routeInfo');
    $(barInfo).empty();
    $(barInfo).append('<p class="text-info">'+data.length+'</p><p>'+data.time+'</p>');
}

/**
 *
 * @param pts [[lat, lon], [lat, lon]]
 */
function clusterize(pts) {
        /**
         * Создадим кластеризатор, вызвав функцию-конструктор.
         * Список всех опций доступен в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#constructor-summary
         */
            clusterer = new ymaps.Clusterer({
            /**
             * Через кластеризатор можно указать только стили кластеров,
             * стили для меток нужно назначать каждой метке отдельно.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage.xml
             */
            preset: 'islands#invertedVioletClusterIcons',
            /**
             * Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
             */
            groupByCoordinates: false,
            /**
             * Опции кластеров указываем в кластеризаторе с префиксом "cluster".
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
             */
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        }),
        /**
         * Функция возвращает объект, содержащий данные метки.
         * Поле данных clusterCaption будет отображено в списке геообъектов в балуне кластера.
         * Поле balloonContentBody - источник данных для контента балуна.
         * Оба поля поддерживают HTML-разметку.
         * Список полей данных, которые используют стандартные макеты содержимого иконки метки
         * и балуна геообъектов, можно посмотреть в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
         * data = {id: 1, header: 'txt'}
         */
            getPointData = function (data) {
            return {
                balloonContentBody: '<strong> ' + data.header + '</strong>',
                clusterCaption: '<strong>' + data.id + '</strong>'
            };
        },
        /**
         * Функция возвращает объект, содержащий опции метки.
         * Все опции, которые поддерживают геообъекты, можно посмотреть в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
         */
            getPointOptions = function () {
            return {
                preset: 'islands#violetIcon'
            };
        },
        points = pts,
        geoObjects = [];

    /**
     * Данные передаются вторым параметром в конструктор метки, опции - третьим.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark.xml#constructor-summary
     */
    for(var i = 0, len = points.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark([points[i].lat, points[i].lon],
            getPointData({id: points[i].id, header: points[i].header}), getPointOptions());
    }

    /**
     * Можно менять опции кластеризатора после создания.
     */
    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });

    /**
     * В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
     */
    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);

    /**
     * Спозиционируем карту так, чтобы на ней были видны все объекты.
     */

    myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
    });
}
function getLocation() {
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoords);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    function getCoords(position) {
        var curCoords = [
            parseFloat(position.coords.latitude),
            parseFloat(position.coords.longitude)
        ];
        return curCoords;
    }
}