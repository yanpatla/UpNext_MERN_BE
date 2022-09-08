import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ partners: { $in: req.user } }, { creator: { $in: req.user } }],
  }).select("-tasks");

  res.json(projects);
};
const newProjects = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;
  try {
    const saveProject = await project.save();
    res.json(saveProject);
  } catch (error) {
    console.log(error);
  }
};
const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id)
    //Deep Populate
    .populate({ path: "tasks", populate: { path: "complete", select: "name" } })
    .populate("partners", "name email");

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.partners.some(
      (partner) => partner._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("Not Valid");
    return res.status(401).json({ msg: error.message });
  }

  //Obtener las tareas del Proyecto

  res.json(project);
};
const editProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Not Valid");
    return res.status(401).json({ msg: error.message });
  }
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
  project.client = req.body.client || project.client;
  try {
    const saveProject = await project.save();
    res.json(saveProject);
  } catch (error) {
    console.log(error);
  }
};
const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Not Valid");
    return res.status(401).json({ msg: error.message });
  }
  try {
    await Project.deleteOne();
    res.json({ msg: "The Project has been Deleted" });
  } catch (error) {
    console.log(error);
  }
};
const searchPartner = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmated -createdAt -password -token -updatedAt -__v"
  );
  if (!user) {
    const error = new Error("User not Found");
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};
const addPartners = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not Found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(404).json({ msg: error.message });
  }
  const user = await User.findOne({ email }).select(
    "-confirmated -createdAt -password -token -updatedAt -__v"
  );
  if (!user) {
    const error = new Error("User not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() === user._id.toString()) {
    const error = new Error("The Creator of the Project Cannot be a Partner");
    return res.status(404).json({ msg: error.message });
  }

  if (project.partners.includes(user._id)) {
    const error = new Error("the user already belongs to the project");
    return res.status(404).json({ msg: error.message });
  }

  project.partners.push(user._id);
  await project.save();
  res.json({ msg: "Partner added successfully" });
};
const deletePartners = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not Found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(404).json({ msg: error.message });
  }

  project.partners.pull(req.body.id);
  await project.save();
  res.json({ msg: "Partner Deleted successfully" });
};

export {
  getProjects,
  newProjects,
  getProject,
  editProject,
  deleteProject,
  addPartners,
  deletePartners,
  searchPartner,
};
