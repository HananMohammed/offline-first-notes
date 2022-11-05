import { createStore } from "vuex";
import { Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const store = createStore({
  state() {
    return {
      editor: null,
      database: null,
      notes: [],
      activeNote: {},
      isOffline: !navigator.onLine,
    };
  },
  mutations: {
    updateEditor(state, editor) {
      state.editor = editor;
    },
    updateDatabase(state, database) {
      state.database = database;
    },
    updateNotes(state, notes) {
      state.notes = notes;
    },
    updateActiveNote(state, note) {
      state.activeNote = note;
    },
    updateIsOffline(state, isOffline) {
      state.isOffline = isOffline;
    },
  },
  actions: {
    initEditor({ commit, state }) {
      let editor = new Editor({
        content: "",
        extensions: [StarterKit],
        editorProps: {
          attributes: {
            class: "prose my-6 mx-auto focus:outline-none",
          },
        },
      });

      commit("updateEditor", editor);
    },
    init({ dispatch }) {
      dispatch("initDatabase").then(() =>
        setTimeout(() => {
          dispatch("initNotes");
        }, 500)
      );
    },
    initDatabase({ commit }) {
      //initialize a connection to database and pass it a name like notes and define its version to be 1
      let db = window.indexedDB.open("myNotes", 3);

      db.onerror = (e) =>
        console.error(`Database error: ${e.target.errorCode}`);

      db.onsuccess = (e) => commit("updateDatabase", e.target.result);

      //Creating or updating the version of the database
      db.onupgradeneeded = (event) => {
        console.log("db.onupgradeneeded", event);

        // Save the IDBDatabase interface
        const db = event.target.result;

        //  db.deleteObjectStore("notes")
        // Create an objectStore for this database
        const objectStore = db.createObjectStore("notes", {
          keyPath: "created",
        });
      };
    },
    initNotes({ commit, state }) {
      // console.log("db", state.database);
      // if (state.database) {
      state.database
        .transaction("notes")
        .objectStore("notes")
        .getAll().onsuccess = (e) => {
        console.log(e.target.result);
        commit("updateNotes", e.target.result.reverse());
      };
      //}
    },
    saveNote({ commit, state }) {
      const objectStore = state.database
        .transaction("notes", "readwrite")
        .objectStore("notes");

      let noteRequest = objectStore.get(state.activeNote.created);

      noteRequest.onerror = (event) => {
        console.error("Error Saving The Note in Datatbase");
      };
      noteRequest.onsuccess = (event) => {
        let note = event.target.result;
        note.content = state.editor.getHTML();
        let requestUpdate = objectStore.put(note);
        requestUpdate.onerror = (event) => {
          console.error("Error storing the updated note in database");
        };
        requestUpdate.onsuccess = (e) => {
          let notes = state.notes;
          let noteIndex = notes.findIndex((n) => n.created == note.created);
          state.notes[noteIndex] = note;
          commit("updateNotes", notes);
        };
      };
    },
    addNewNote({ commit, state }) {
      let transaction = state.database.transaction("notes", "readwrite");

      let now = new Date();
      let note = {
        content: "",
        created: now.getTime(),
      };

      let notes = state.notes;
      Array.prototype.unshift.call(notes, note);
      commit("updateNotes", notes);
      commit("updateActiveNote", note);
      transaction.objectStore("notes").add(note);
    },
    updateEditor({ commit, state }) {
      state.editor.destroy();
      commit("updateEditor", null);
    },
  },
});
export default store;
