<template>
   <div class="flex w-screen h-screen text-gray-700">
      <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
        <!-- sidebar -->
      </div>
      <div class="flex flex-col flex-grow">
         <div class="flex flex-col flex-grow overflow-auto">
            <editor-content :editor="editor" />
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
      database: null
    }
  },
  methods:{
      async getDatatbase()
      {
         return new Promise((resolve, reject)=>{
            //initialize a connection to database and pass it a name like notes and define its version to be 1
            let db = window.indexedDB.open('notes', 1 )

            db.onerror = (event) => {
               reject("Error Opening the datatbase !! ")
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

               // Create an objectStore for this database
               const objectStore = db.createObjectStore("notes");
            };
         })
 


      }
  },
  async created()
  {
      this.database = await this.getDatatbase()
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
