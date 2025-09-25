import { Plugin } from "obsidian";
import { getContainer } from "./container";

export default class ObsidianDataviewTableCache extends Plugin {
  public override async onload(): Promise<void> {
    await super.onload();

    const {
      cacheManager,
      dataviewManager,
    } = getContainer();

    await cacheManager.rebuildCache(this.app);
    dataviewManager.patchDataviewApi(this.app);

    this.registerEvent(this.app.metadataCache.on("dataview:index-ready", async () => {
      await cacheManager.rebuildCache(this.app);
    }));

    this.registerEvent(this.app.metadataCache.on("dataview:metadata-change", async (type, file, oldPath?) => {
      const promises = [cacheManager.cachePath(file.path, this.app)];
      if (oldPath) {
        promises.push(cacheManager.cachePath(oldPath, this.app));
      }
      await Promise.all(promises);
    }));
  }
}
