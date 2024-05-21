<template>
    <div>
        <h1 class="text-center text-3xl font-bold"> Recently used groups </h1>
        <div class="flex justify-center py-20" id="container">
            <div @click="test(group['_id'])" class="inline-block h-80 w-60 text-center pt-2 bg-gray-100 rounded-xl" v-for="(group, index) in groups" :key="group.name" @deleted="removeGroup(index)" :documentInfo="group"> 
                
                <h1 class="text-3xl"> {{ index }}. {{ group.name }} </h1>
                <h5> {{ group.description }} </h5>
                <button @click.stop="deleteItem(group, index)"> Delete </button>
            </div>
        </div> 
        <h1 class="text-center text-3xl font-bold"> <router-link to="/group/add"> Add new group </router-link> </h1>
    </div>     
</template>

<script>
    import axios from 'axios';

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
            },
            deleteItem: async function(group, index) {
                try {
                    await axios.delete(`http://localhost:3000/api/groups/${group['_id']}`);
                    this.groups.splice(index, 1);
                }
                catch(error) {
                    console.log('failed to delete group with error: ' + error)
                } 
            },
            test: function(id) {
                this.$router.push({ name: 'EditGroup', params: { id: id } });
            }
        }
    }   
</script>