<template>
    <form @submit.prevent="passSet()" class="flex flex-col justify-around items-center h-80 w-60 pt-2 bg-gray-100 rounded-xl">
        <div>
            <input type="text" v-model="set.name" placeholder="name" class="text-3xl text-center w-full bg-gray-100">
            <input type="text" v-model="set.description" placeholder="description" class="w-full bg-gray-100 text-center text-gray-500">
        </div>
        <div> 
            <button type="submit"><img src="/src/assets/icons/check.svg" class="w-6 h-6"></button>
        </div>
    </form>
</template>

<script>
    export default {
        methods: {
            passSet: function() {
                this.$emit('confirmed', this.set);
            }
        },
        props: {
            set: {
                type: Object,
                default: {}
            }
        }
    }
</script>