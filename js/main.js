class PopoutWindow extends FormApplication {
  static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
          id: "interactive-map-popout",
          template: "modules/interactive-map-popout/templates/map-popout.html",
          width: 800,
          height: 600,
          resizable: true,
          closeOnSubmit: false,
          popOut: true
      });
  }

  activateListeners(html) {
      super.activateListeners(html);
      html.find(".close").click(() => this.close());
  }
}

Hooks.once("init", () => {
  game.keybindings.register("interactive-map-popout", "toggleWindow", {
      name: "Toggle Map Window",
      editable: [{ key: "KeyM" }],
      onDown: () => {
          const existing = Object.values(ui.windows).find(w => w.id === "interactive-map-popout");
          if (existing) existing.close();
          else new PopoutWindow().render(true);
          return true;
      },
      restricted: true
  });
});