import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;
  const projectExist = await Project.findById(project);
  if (!projectExist) {
    const error = new Error("The Project not Exist");
    return res.status(404).json({ msg: error.message });
  }
  if (projectExist.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You do not have the right permissions");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const saveTask = await Task.create(req.body);
    //Save id in the project
    projectExist.tasks.push(saveTask._id);
    await projectExist.save();
    res.json(saveTask);
  } catch (error) {
    console.log(error);
  }
};
const getTask = async (req, res) => {
  const { id } = req.params;
  // EL populate lo que hace es que en evez de hacer dos llamadas una para projecto y otra apra tarea y que te de los JSON separados este anida dentro la tarea el projecto realcionado
  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Action Denied");
    return res.status(403).json({ msg: error.message });
  }
  res.json(task);
};
const editTask = async (req, res) => {
  const { id } = req.params;
  // EL populate lo que hace es que en evez de hacer dos llamadas una para projecto y otra apra tarea y que te de los JSON separados este anida dentro la tarea el projecto realcionado
  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Action Denied");
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deliveryDate = req.body.deliveryDate || task.deliveryDate;
  try {
    const saveTask = await task.save();
    res.json(saveTask);
  } catch (error) {
    console.log(error);
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Task not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Action Denied");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);

    //! Esto es en el caso de que deba poner varios awaits para que no se blockeen
    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ msg: "The Task Has Been Deleted" });
  } catch (error) {
    console.log(error);
  }
};
const changeStateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Task not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.partners.some(
      (partner) => partner._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("Action Denied");
    return res.status(403).json({ msg: error.message });
  }

  task.state = !task.state;
  task.complete = req.user._id;
  await task.save();
  const storeTask = await Task.findById(id)
    .populate("project")
    .populate("complete");
  res.json(storeTask);
};

export { addTask, getTask, editTask, deleteTask, changeStateTask };
