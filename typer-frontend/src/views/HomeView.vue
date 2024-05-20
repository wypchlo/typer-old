<template>
    <div>
        <h1 class="text-center text-3xl font-bold"> Recently used groups </h1>
        <div class="flex justify-center py-20" id="container">
            <groupItem class="inline-block h-80 w-60 text-center pt-2 bg-gray-100 rounded-xl" v-for="(group, index) in groups" :key="group.name" :index="index" :documentInfo="group"> </groupItem>
        </div> 
        <h1 class="text-center text-3xl font-bold"> <router-link to="/group/add"> Add new group </router-link> </h1>
    </div>     
</template>

<script>
    import axios from 'axios';
    import groupItem from '../components/groupItem.vue';

    export default {
        data() {
            return{
                groups: []
            }
        },
        mounted() {
            this.getGroups();
        },
        methods: {
            getGroups: async function() {
                try{
                    const data = await axios.get('http://localhost:3000/api/groups');
                    this.groups = data.data;
                }
                catch(error) {
                    console.log(error);
                }
            }
        },
        components: {
            groupItem
        }
    }   
</script>