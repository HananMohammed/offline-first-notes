<template>

    <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
        <!-- sidebar -->
        <div class="h-0 overflow-auto flex-grow">
            <div class="flex items-center h-8 px-3 group mt-4">
                <div class="flex items-center flex-grow focus-outline-none">
                    <a @click.prevent="showAllNotes" href="javascript:void(0)"
                        class="ml-2 leading-none font-medium text-sm">
                        All Notes
                    </a>
                </div>
                <button @click.prevent="addNewNote">
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px"
                        viewBox="0 0 304.899 304.899" style="enable-background:new 0 0 304.899 304.899;"
                        xml:space="preserve">
                        <g>
                            <g>
                                <path d="M0.006,152.45c0,20.344,16.546,36.893,36.894,36.893h78.669v78.663c0,20.345,16.546,36.894,36.893,36.894
                           c20.351,0,36.894-16.549,36.894-36.894v-78.663H268c20.345,0,36.894-16.549,36.894-36.893c0-20.348-16.549-36.894-36.894-36.894
                           h-78.645V36.894C189.355,16.546,172.812,0,152.462,0c-20.347,0-36.893,16.546-36.893,36.894v78.663H36.9
                           C16.553,115.557,0.006,132.103,0.006,152.45z M121.718,127.854c3.401,0,6.149-2.756,6.149-6.149V36.894
                           c0-13.564,11.031-24.596,24.595-24.596c13.565,0,24.596,11.031,24.596,24.596v84.812c0,3.393,2.75,6.149,6.149,6.149H268
                           c13.565,0,24.596,11.03,24.596,24.596c0,13.564-11.03,24.596-24.596,24.596h-84.793c-3.399,0-6.149,2.756-6.149,6.148v84.812
                           c0,13.565-11.03,24.596-24.596,24.596c-13.564,0-24.595-11.03-24.595-24.596v-84.812c0-3.393-2.748-6.148-6.149-6.148H36.9
                           c-13.565,0-24.596-11.031-24.596-24.596c0-13.565,11.031-24.596,24.596-24.596H121.718z" />
                            </g>
                        </g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                        <g></g>
                    </svg>
                </button>
            </div>


            <div class="mt-4">
                <a class="flex items-center h-8 text-sm pl-8 pr-3" href="javascript:void(0)" v-for="note in notes"
                    @click.prevent="openNote(note)" :key="note.created">
                    <span class="ml-2 leading-none"> {{ new Date(note.created).toLocaleString() }}</span>
                </a>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'Sidebar',
    computed: {
        notes() {
            return this.$store.state.notes
        }
    },
    methods: {
        openNote(note) {
            this.$store.commit('updateActiveNote', note)
            this.$store.state.editor.commands.setContent(note.content)
        },
        showAllNotes() {
            this.$store.state.editor.commands.clearContent()
            this.$store.commit('updateActiveNote', {})
        },
        addNewNote() {
            this.$store.dispatch('addNewNote')
        }
    }
}
</script>

<style lang="scss" scoped>

</style>