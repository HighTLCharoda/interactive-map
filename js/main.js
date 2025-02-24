class LeafletTileLayer {
  static async init() {
    // Регистрация типа карты
    CONFIG.Canvas.layers.leafletTiles = {
      group: "interface",
      layerClass: LeafletTileLayer,
    };
  }

  constructor() {
    this.map = null;
    this.tileLayer = null;
  }

  async draw() {
    // Создаем контейнер для Leaflet
    const div = document.createElement("div");
    div.id = "leaflet-map";
    div.style.width = "100%";
    div.style.height = "100%";

    canvas.grid.background = div;
    canvas.grid.grid = div;

    // Инициализация Leaflet
    this.map = L.map("leaflet-map", {
      crs: L.CRS.Simple,
      minZoom: 3,
      maxZoom: 8,
      attributionControl: false,
    });

    // Включение зума колесом мыши
    this.map.scrollWheelZoom.enable();

    // Добавление кнопок зума
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(this.map);

    // Загрузка тайлов
    this.tileLayer = L.tileLayer(
      "modules/leaflet-tiles/tiles/{z}/{x}/{y}.webp",
      {
        tileSize: 512,
        noWrap: true,
      }
    ).addTo(this.map);

    // Центрирование карты
    const bounds = [
      [0, 0],
      [canvas.dimensions.height, canvas.dimensions.width],
    ];
    this.map.fitBounds(bounds);

    this.map.on("moveend", () => {
      // Отправляем данные о центре карты всем игрокам
      const center = this.map.getCenter();
      game.socket.emit("module.leaflet-tiles", {
        action: "move",
        data: {
          lat: center.lat,
          lng: center.lng,
        },
      });
    });

    // Обработка входящих событий от игроков
    game.socket.on("module.leaflet-tiles", (data) => {
      if (data.action === "move") {
        this.map.panTo([data.data.lat, data.data.lng]);
      }
    });

    // Пример маркера для города (координаты X=1000px, Y=500px)
    const marker = L.marker([500, 1000], {
      icon: L.divIcon({
        className: "custom-marker",
        html: '<div class="map-pin">🏰</div>', // Эмодзи или HTML
        iconSize: [30, 30],
      }),
    }).addTo(this.map);

    // Обработчик клика по маркеру
    marker.on("click", () => {
      // Показать всплывающее окно с описанием
      marker.bindPopup("Столица королевства Эльдария").openPopup();

      // Или запустить макрос Foundry
      game.macros.getName("Open City Journal").execute();
    });
  }
}

// Хуки Foundry
Hooks.once("init", () => {
  LeafletTileLayer.init();
});

Hooks.on("canvasInit", () => {
  new LeafletTileLayer().draw();
});
