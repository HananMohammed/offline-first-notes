<template>
   <div class="flex w-screen h-screen text-gray-700">
      <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
        <!-- sidebar -->
        <div class="h-0 overflow-auto flex-grow">
            <div class="mt-4">
               <a 
               class="flex items-center h-8 text-sm pl-8 pr-3"
               href="#"
               v-for="note in notes"
               :key="note.created"
               >
                  <span class="ml-2 leading-none"> {{ new Date(note.created).toLocaleString()}}</span>
               </a>
            </div>
        </div>
      </div>
      <div class="flex flex-col flex-grow">
         <div class="flex flex-col flex-grow overflow-auto">
            <editor-content :editor="editor" />
         </div>
         <div class="h-16 text-right">
            <button @click="saveNote" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Button
            </button>
         </div>

      </div>
   </div>

</template>
<script>
   import { Editor, EditorContent } from '@tiptap/vue-3'
   import StarterKit from '@tiptap/starter-kit'


export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
      database: null,
      notes:[]
    }
  },
  methods:{
      async getDatatbase()
      {
         return new Promise((resolve, reject)=>{
            //initialize a connection to database and pass it a name like notes and define its version to be 1
            let db = window.indexedDB.open('myNotes', 3)

            db.onerror = (event) => {
               reject("Error Opening the datatbase !! ")
               console.error(`Database error: ${event.target.errorCode}`);

            };

            db.onsuccess = (event) => {
               console.log('db.onsuccess', event);
               resolve(event.target.result);
            };

            //Creating or updating the version of the database
            db.onupgradeneeded = (event) => {
               console.log('db.onupgradeneeded', event);

               // Save the IDBDatabase interface
               const db = event.target.result;
               
             //  db.deleteObjectStore("notes")
               // Create an objectStore for this database
               const objectStore = db.createObjectStore("notes", {
                  keyPath: 'created'
               });
            };
         })
      },
     async saveNote()
      {
         return new Promise((resolve, reject) => {
            let transaction = this.database.transaction('notes', 'readwrite');
            transaction.oncomplete = (event) => {
               resolve()
            }

            let now = new Date()
            let note = {
               content:this.editor.getHTML(),
               created: now.getTime()    
            }

            this.notes.unshift(note)

            transaction.objectStore("notes").add(note);

         })
      },
    async getNotes(){
      return new Promise((resolve, reject) => {
            this.database
            .transaction('notes')
            .objectStore('notes')
            .getAll()
            .onsuccess = e => {
               resolve(e.target.result)
            }

         })
    }  
  },
  async created()
  {
      this.database = await this.getDatatbase()
      let notes = await this.getNotes()
      this.notes = notes.reverse()
  },
  mounted() {
    this.editor = new Editor({
      content: '',
      extensions: [
        StarterKit,
      ],
      editorProps: {
         attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
         },
   },

   })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}

</script>
<style>
</style>
