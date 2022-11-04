<template>
   <div class="flex w-screen h-screen text-gray-700">
      <div v-if="isOffline" class="absolute top-0 left-0 opacity-75 z-10 w-full text-center py-2 bg-red-300 border-b border-red-700 text-white">
         Sorry it's look like you are offline 
      </div>



      <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
        <!-- sidebar -->
        <div class="h-0 overflow-auto flex-grow">
         <div  class="flex items-center h-8 px-3 group mt-4" >
            <div class="flex items-center flex-grow focus-outline-none">
               <a 
               @click.prevent="showAllNotes"
               href="javascript:void(0)" class="ml-2 leading-none font-medium text-sm">
                  All Notes
               </a>
            </div>
            <button @click.prevent="addNewNote">
               <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  width="30px" height="30px" viewBox="0 0 304.899 304.899" style="enable-background:new 0 0 304.899 304.899;"
                  xml:space="preserve">
                  <g><g><path d="M0.006,152.45c0,20.344,16.546,36.893,36.894,36.893h78.669v78.663c0,20.345,16.546,36.894,36.893,36.894
                           c20.351,0,36.894-16.549,36.894-36.894v-78.663H268c20.345,0,36.894-16.549,36.894-36.893c0-20.348-16.549-36.894-36.894-36.894
                           h-78.645V36.894C189.355,16.546,172.812,0,152.462,0c-20.347,0-36.893,16.546-36.893,36.894v78.663H36.9
                           C16.553,115.557,0.006,132.103,0.006,152.45z M121.718,127.854c3.401,0,6.149-2.756,6.149-6.149V36.894
                           c0-13.564,11.031-24.596,24.595-24.596c13.565,0,24.596,11.031,24.596,24.596v84.812c0,3.393,2.75,6.149,6.149,6.149H268
                           c13.565,0,24.596,11.03,24.596,24.596c0,13.564-11.03,24.596-24.596,24.596h-84.793c-3.399,0-6.149,2.756-6.149,6.148v84.812
                           c0,13.565-11.03,24.596-24.596,24.596c-13.564,0-24.595-11.03-24.595-24.596v-84.812c0-3.393-2.748-6.148-6.149-6.148H36.9
                           c-13.565,0-24.596-11.031-24.596-24.596c0-13.565,11.031-24.596,24.596-24.596H121.718z"/>
                     </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                  </svg>
            </button>
         </div>
            

            <div class="mt-4">
               <a 
               class="flex items-center h-8 text-sm pl-8 pr-3"
               href="javascript:void(0)"
               v-for="note in notes"
               @click.prevent="openNote(note)"
               :key="note.created"
               >
                  <span class="ml-2 leading-none"> {{ new Date(note.created).toLocaleString()}}</span>
               </a>
            </div>
        </div>
      </div>
      <!-- main content - editor  -->
      <div class="flex flex-col flex-grow" v-if="Object.keys(activeNote).length">
         <div class="flex flex-col flex-grow overflow-auto">
            <editor-content :editor="editor" />
         </div>
         <div class="h-16 text-right">
            <button @click="saveNote" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Button
            </button>
         </div>

      </div>
        <!-- main content - note list  -->
      <div class="flex flex-col flex-grow" v-else>
            <div v-for="note in notes" :key="note.created">
               <div class="flex px-4 pt-3 pb-4">
                  <div class="prose my-2 mx-auto">
                     <div>
                        <div class="ml-1 text-xs text-gray-500">
                           <span class="ml-1 text-xs text-gray-500">
                              Created On {{ new Date(note.created).toLocaleString() }}
                           </span>
                        </div>
                        <div v-html="note.content"></div>
                     </div>
                  </div>
               </div>
                
               <hr class="w-full">

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
      notes:[],
      activeNote:{},
      isOffline: !navigator.onLine
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
            const objectStore = this.database
                                  .transaction('notes', 'readwrite')
                                  .objectStore('notes');

            let noteRequest = objectStore.get(this.activeNote.created);

            noteRequest.onerror = (event) => {
               reject("Error Saving The Note in Datatbase")
            };
            noteRequest.onsuccess = (event) => {
               let note = event.target.result
               note.content = this.editor.getHTML()
               let requestUpdate = objectStore.put(note);
               requestUpdate.onerror = (event) => {
                  reject("Error storing the updated note in database")
               };
               requestUpdate.onsuccess = e => {
                  let noteIndex = this.notes.findIndex(n => n.created == note.created)
                  this.notes[noteIndex] = note
                  resolve()
               }
            };
          
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
    } ,
    openNote(note){
      console.log(note)
      this.editor.commands.setContent(note.content)
      this.activeNote = note
    },
    showAllNotes()
    {
         this.editor.commands.clearContent()
         this.activeNote = {}
    },
    addNewNote()
    {
      return new Promise((resolve, reject) => {
            let transaction = this.database.transaction('notes', 'readwrite');
            transaction.oncomplete = (event) => {
               resolve()
            }

            let now = new Date()
            let note = {
               content:'',
               created: now.getTime()    
            }

            this.notes.unshift(note)

            this.activeNote = note

            transaction.objectStore("notes").add(note);

         })
    },
    syncUsersData()
    {
      if(this.isOffline){
         return;
      }

      //make api request to external server 
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

   window.addEventListener('offline', ()=>{
      this.isOffline = true
   })

   window.addEventListener('online', ()=>{
      this.isOffline = false
      //sync up users data  with an external api 
      this.syncUsersData()
   })

  },

  beforeUnmount() {
    this.editor.destroy()
  },
}

</script>
<style>
</style>
