<template>
   <div class="flex w-screen h-screen text-gray-700">
      <div v-if="isOffline"
         class="absolute top-0 left-0 opacity-75 z-10 w-full text-center py-2 bg-red-300 border-b border-red-700 text-white">
         Sorry it's look like you are offline
      </div>

      <Sidebar />
      <Editor v-if="Object.keys(activeNote).length" />
      <Notes v-else />
   </div>

</template>
<script>
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Notes from './components/Notes'

export default {
   components: {
      Sidebar,
      Editor,
      Notes
   },
   computed: {
      activeNote() {
         return this.$store.state.activeNote;
      },
      isOffline() {
         return this.$store.state.isOffline;
      }
   },
   methods: {

      syncUsersData() {
         if (this.isOffline) {
            return;
         }
         //make api request to external server 
      }
   },
   mounted() {
      window.addEventListener('offline', () => {
         this.$store.commit('updateIsOffline', true)
      })

      window.addEventListener('online', () => {
         this.$store.commit('updateIsOffline', false)
         //sync up users data  with an external api 
         this.syncUsersData()
      })

   },

   beforeUnmount() {
      this.$store.dispatch('updateEditor')
   },
}

</script>
<style>

</style>
