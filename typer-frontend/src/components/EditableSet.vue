<template>
    <form @submit.prevent="passSet()" class="flex flex-col justify-around items-center h-80 w-60 pt-2 bg-gray-100 rounded-xl">
        <div>
            <input type="text" v-model="set.name" placeholder="name" class="text-3xl text-center w-full bg-gray-100">
            <input type="text" v-model="set.description" placeholder="description" class="w-full bg-gray-100 text-center">
        </div>
        <button type="submit"> Confirm </button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
               set: {}
            }
        },
        methods: {
            passSet: function() {
                this.$emit('confirmed', this.set);
            }
        }
    }
</script>