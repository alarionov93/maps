(function(){
	ymaps.ready(init);
    var myMap;
    var shown;

    function init() {
    	myMap = new ymaps.Map("map", {
    		center: [58.010259, 56.234195],
    		zoom: 12
    	}, {
    		autoFitToViewport: 'always'
    	});
      var myDeviceId = "13450633605839585280";
      // setInterval(function(){
        $.get('/list?token='+myDeviceId, function(data) {
          // if (shown != null) {
            // shown.removeFromMap(myMap);
          // }
          var points = [];
          var reports = "";
          
          for (var i = 0; i < data["reports"].length; i++) {
            reports += "<p>"+data["reports"][i]["created_at"]+" | "+data["reports"][i]["device_id"]+" | "+data["reports"][i]["error_desc"]+"</p>";
          }
          $("#reports").append(reports);
          var last_idx = data["points"].length - 1;
          var last = [data["points"][last_idx]["lat"], data["points"][last_idx]["lon"]];
          var last_date = data["points"][last_idx]["created_at"];
          console.log(data);
          for (var i = 0; i < data["points"].length; i++) {
              points.push([data["points"][i]["lat"], data["points"][i]["lon"]]);
          }
          var pts = drawPts(points);
          shown = ymaps.geoQuery(pts).addToMap(myMap).applyBoundsToMap(myMap, {checkZoomRange: true});
          var placemark = new ymaps.Placemark(last, 
            {
              balloonContent: "<h7>Последнее местоположение:</h7><p>" + last_date + "</p>",
              iconContent: ""
            },
            {
              preset: "twirl#yellowStretchyIcon",
              // Отключаем кнопку закрытия балуна.
              balloonCloseButton: true,
              // Балун будем открывать и закрывать кликом по иконке метки.
              hideIconOnBalloonOpen: false
            });

          myMap.geoObjects.add(placemark);
        });
      // }, 5000);
    }
})();


function drawPts(a) {
  var myPolyline = new ymaps.Polyline(
    // Указываем координаты вершин ломаной.
    a,
  {
    // не убирать этот блок
    // Описываем свойства геообъекта.
  }, {
    // Задаем опции геообъекта.
    // Отключаем кнопку закрытия балуна.
    balloonCloseButton: true,
    // Цвет линии.
    // strokeColor: color,
    // Ширина линии.
    strokeWidth: 6,
    // Коэффициент прозрачности.
    strokeOpacity: 0.8
  });

  return myPolyline;
}