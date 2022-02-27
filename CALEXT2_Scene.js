/* global View */
// eslint-disable-next-line no-unused-vars
class Scene {
  constructor(uid, cfgs) {
    const scene = cfgs.scenes[uid];
    const sceneLength = cfgs.scenes.length;
    this.config = cfgs;
    this.name = scene.name;
    this.className = scene.className;
    this.uid = uid;
    this.nextUid = uid === sceneLength - 1 ? 0 : uid + 1;
    this.previousUid = uid === 0 ? sceneLength - 1 : uid - 1;
    this.viewNames =
      !scene.views || scene.views.length === 0
        ? cfgs.views.map((v) => v.name)
        : scene.views;
    this.views = [];
  }

  draw(events) {
    this.clearViews();
    this.viewNames.forEach((viewName) => {
      const viewConfig = this.config.views.find((config) => {
        if (config.name === viewName) return true;
      });
      viewConfig.sceneClassName = this.className;
      const view = View.makeByName(viewConfig, events);
      if (view) {
        this.views.push(view);
        view.draw();
      }
    });
  }

  clearViews() {
    for (let i = 0; i < this.views.length; i++) {
      const view = this.views[i];
      view.destroy();
    }
  }
}
