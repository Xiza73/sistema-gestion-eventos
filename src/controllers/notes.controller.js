import Exhibitor from "../models/Exhibitor";
import Note from "../models/Note";

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
      const ex = exhibitors.split(",")
      const newNote = new Note({
        title,
        description,
        exhibitors: ex,
        date,
        schedule,
        link,
      });
      console.log("Create note");
      newNote
        .save()
        .then(function (_) {
          req.flash("success_msg", "Note Added Successfully");
          res.redirect("/notes");
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log("save");
      console.log("redirected");
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
  const notes = await Note.find()
    .populate("exhibitors")
    .sort({ date: "desc" })
    .lean();
  console.log(notes)
  res.render("notes/all-notes", { notes });
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
