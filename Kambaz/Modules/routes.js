import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  const findModuleById = async (req, res) => {
    const { moduleId } = req.params;
    const module = await modulesDao.findModuleById(moduleId);
    if (module) {
      res.json(module);
    } else {
      res.sendStatus(404);
    }
  };

  const deleteModule = async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.json(status);
  };

  const updateModule = async (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await modulesDao.updateModule(moduleId, moduleUpdates);
    res.json(status);
  };

  app.get("/api/modules/:moduleId", findModuleById);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}
