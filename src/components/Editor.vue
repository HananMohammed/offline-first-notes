<template>
    <div class="flex flex-col flex-grow">
        <div class="flex flex-col flex-grow overflow-auto">
            <editor-content :editor="$store.state.editor" />
        </div>
        <div class="h-16 text-right">
            <button @click="$store.dispatch('saveNote')"
                class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                Button
            </button>
        </div>

    </div>
</template>

<script>
import { EditorContent } from '@tiptap/vue-3'

export default {
    name: 'Editor',
    components: {
        EditorContent,
    },
}
</script>
 