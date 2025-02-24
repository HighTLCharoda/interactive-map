class LeafletTileLayer extends CanvasLayer {
  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      zIndex: 100,
      name: "LeafletMap"
    });
  }

  async draw() {
    // Удаляем старую карту, если существует
    if (this.map) this.map.remove();

    // Создаем контейнер для Leaflet
    this.leafletDiv = document.createElement("div");
    this.leafletDiv.id = "leaflet-map";
    Object.assign(this.leafletDiv.style, {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "0"
    });

    // Добавляем контейнер в слой
    this.canvas.background.addChild(this.leafletDiv);

    // Инициализация Leaflet
    this.map = L.map(this.leafletDiv, {
      crs: L.CRS.Simple,
      minZoom: 3,
      maxZoom: 8,
      attributionControl: false,
      interactive: true
    });

    // Загрузка тайлов
    this.tileLayer = L.tileLayer('modules/leaflet-tiles/tiles/{z}/{x}/{y}.webp', {
      tileSize: 512,
      noWrap: true
    }).addTo(this.map);

    // Центрирование карты
    const bounds = [[0,0], [this.canvas.dimensions.height, this.canvas.dimensions.width]];
    this.map.fitBounds(bounds);

    // Включение зума колесом
    this.map.scrollWheelZoom.enable();
  }
}

// Регистрация слоя
Hooks.once('init', () => {
  CONFIG.Canvas.layers.leafletTiles = {
    group: "primary",
    layerClass: LeafletTileLayer
  };
});

// Активация слоя при создании сцены
Hooks.on("canvasInit", (canvas) => {
  canvas.leafletTiles = new LeafletTileLayer();
});