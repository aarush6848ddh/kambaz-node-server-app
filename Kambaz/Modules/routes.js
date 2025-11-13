import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  const deleteModule = (req, res) => {
    const { moduleId } = req.params;
    modulesDao.deleteModule(moduleId);
    res.sendStatus(200);
  };

  const updateModule = (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    modulesDao.updateModule(moduleId, moduleUpdates);
    res.sendStatus(204);
  };

  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}

