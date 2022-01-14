import Assistance from "../models/Assistance";
import Exhibitor from "../models/Exhibitor";
import Note from "../models/Note";
import User from "../models/User";
import configurations from "../config";

export const renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};

export const createNewNote = async (req, res) => {
  const { title, description, exhibitors, date, schedule, link } = req.body;
  const errors = [];
  if (!title || !description || !exhibitors || !date || !schedule || !link) {
    errors.push({ text: "Falta agregar datos" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
      exhibitors,
      date,
      schedule,
      link,
    });
  } else {
    try {
      const ex = exhibitors.split(",");
      const newNote = new Note({
        title,
        description,
        exhibitors: ex,
        date,
        schedule,
        link,
      });
      newNote
        .save()
        .then(function (_) {
          req.flash("success_msg", "Note Added Successfully");
          res.redirect("/notes");
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      req.flash("error_msg", "Error al crear Evento");
    }
  }
};

export const createNewExhibitor = async (req, res) => {
  const { dni, name } = req.body;
  const errors = [];
  if (!dni) {
    errors.push({ text: "Falta DNI" });
  }
  if (!name) {
    errors.push({ text: "Falta Nombre" });
  }
  if (errors.length > 0) {
    res.render("notes/new-exhibitor", {
      errors,
      dni,
      name,
    });
  } else {
    try {
      const newExhibitor = new Exhibitor({ dni, name });
      await newExhibitor.save();
      req.flash("success_msg", "Exhibitor Added Successfully");
      res.redirect("/notes/add");
    } catch (error) {
      req.flash("error_msg", "Error al añadir Expositor");
    }
  }
};

export const getExhibitors = async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find().exec();
    return res.status(200).json({
      status: 1,
      data: exhibitors,
    });
  } catch (error) {
    return res.status(400).json({
      status: 0,
      msg: "Error al obtener registro",
    });
  }
};

export const renderNotes = async (req, res) => {
  const user = await User.findOne({
    email: configurations.localStorage.getItem("email"),
  });
  if (user.role === "admin") {
    const notes = await Note.find()
      .populate("exhibitors")
      .populate({
        path: "assistance",
        populate: "user",
      })
      .sort({ date: "desc" })
      .lean();
    res.render("notes/all-notes", { notes });
    return;
  }
  const notes = await Note.find()
    .populate("exhibitors")
    .populate({
      path: "assistance",
      populate: "user",
    })
    .sort({ date: "desc" })
    .lean();
  let assistances = [];
  notes.forEach((note) => {
    let assistance = false;
    if (!note.assistance) {
      assistance = true;
    } else {
      if (!note.assistance.find((e) => e.user.email === user.email)) {
        assistance = true;
      }
    }
    note.assist = assistance;
  });
  res.render("notes/all-events", { notes, user, assistances });
};

export const renderEvents = async (req, res) => {
  const notes = await Note.find()
    .populate("exhibitors")
    .populate({
      path: "assistance",
      populate: "user",
    })
    .sort({ date: "desc" })
    .lean();
  const user = await User.findOne({
    email: configurations.localStorage.getItem("email"),
  });
  res.render("notes/all-events", { notes, user });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

export const updateNote = async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
};

export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};

export const statusEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);
    if (note.status === "PENDIENTE") {
      await Note.findByIdAndUpdate(id, { status: "EN CURSO" });
    } else if (note.status === "EN CURSO") {
      await Note.findByIdAndUpdate(id, { status: "TERMINADO" });
    }
    req.flash("success_msg", "Evento actualizado!");
    res.redirect("/notes");
  } catch (error) {
    console.log(error);
  }
};

export const assistanceUser = async (req, res) => {
  try {
    const id = req.params.id;
    const asis = await Assistance.findById(id)
    await Assistance.findByIdAndUpdate(id, { status: !asis.status }) 
    req.flash("success_msg", "Marcado");
    res.redirect("/notes");   
  } catch (error) {
    console.log(error)
  }
}

export const assistEvent = async (req, res) => {
  try {
    const email = configurations.localStorage.getItem("email");
    const user = await User.findOne({ email });
    const newAssistance = new Assistance({ user });
    await newAssistance.save();
    const note = await Note.findById(req.params.id).populate({
      path: "assistance",
      populate: "user",
    });
    let assistance = [];
    if (note.assistance) assistance = note.assistance;
    if (!assistance.find((e) => e.user.email === user.email))
      assistance.push(newAssistance);
    else {
      let index = -1;
      let deleteAssistance;
      assistance.forEach((e, i) => {
        if (e.user.email === user.email) {
          index = i;
          deleteAssistance = e._id;
          return;
        }
      });
      if (index !== -1) {
        assistance.splice(index, 1);
        try {
          await Assistance.findByIdAndDelete(deleteAssistance);
        } catch (error) {
          console.log(error);
        }
      }
    }
    await Note.findOneAndUpdate({ _id: req.params.id }, { assistance });

    req.flash("success_msg", "Evento actualizado!");
    res.redirect("/notes");
  } catch (error) {
    console.log(error);
  }
};
