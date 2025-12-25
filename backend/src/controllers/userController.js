const userService = require("../services/userService");

async function listUsers(req, res, next) {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const users = await userService.listUsers({ limit, offset });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const id = req.params.id;

    if (req.user.id !== id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const user = await userService.getUser(id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

async function patchUser(req, res, next) {
  try {
    const id = req.params.id;

    if (req.user.id !== id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const updated = await userService.updateUser(id, req.body);
    res.json({ user: updated });
  } catch (error) {
    next(error);
  }
}

async function deactivate(req, res, next) {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const id = req.params.id;
    await userService.deactivateUser(id);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = req.params.id;
    await userService.deleteUser(id);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  getUser,
  patchUser,
  deactivate,
  deleteUser,
};
