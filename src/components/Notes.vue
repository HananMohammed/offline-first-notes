<template>
    <div class="flex flex-col flex-grow">
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
</template>

<script>
export default {
    name:"Notes",
    computed:{
        notes()
        {
            return this.$store.state.notes;
        }
    }
}
</script>
 