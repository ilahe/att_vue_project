<template>
    <div>
        <div class="dFlexV1">
            <h3>Posts List </h3>
            <router-link :to="{ name: 'createPost', params: { id: this.$route.params.id }}">
                <a-button type="primary">New Post</a-button>
            </router-link>
        </div>

       <div class="filterContainer">
           <a-form
                   class="postsFilter"
                   layout="inline"
                   :model="formState"
                   name="basic"
                   autocomplete="off"
                   @finish="onFinishFilter"
           >
               <a-form-item label="Title" name="title">
                   <a-input v-model:value="formState.title"/>
               </a-form-item>
               <a-form-item label="Body" name="body">
                   <a-input v-model:value="formState.body"/>
               </a-form-item>
               <a-form-item>
                   <a-button type="primary" class="mr-1" html-type="submit">Filter</a-button>
                   <a-button type="primary" @click="clearFilter">Clear Filter</a-button>
               </a-form-item>
           </a-form>
       </div>

        <a-table :columns="columns" :data-source="posts" :pagination="false" size="small" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key == 'body'">
                    {{record.body}}
                </template>
                <template v-if="column.key == 'action'">
                    <div class="dFlexV2">
                        <div class="mr-1">
                            <router-link :to="{ name: 'updatePost', params: { id: record.id,  userId: this.$route.params.id  }}">
                                <a-button type="primary">Edit</a-button>
                            </router-link>
                        </div>
                        <div>
                            <a-popconfirm title="Are you sure to want this user" @confirm="confirmDelete(record.id)" @cancel="cancelDelete">
                                <a-button type="primary">Delete</a-button>
                            </a-popconfirm>
                        </div>
                    </div>
                </template>
            </template>
        </a-table>

        <div class="paginationContainer">
            <a-pagination :current="currentPage" :total="totalCount" @change="onChangePage"  show-less-items/>
        </div>
    </div>
</template>

<script>
    import {reactive} from 'vue';
    import {mapState, mapActions} from "vuex";
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Body',
            dataIndex: 'body',
            key: 'body',
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center'
        },
    ];
    export default ({
        name: "Posts",
        setup() {
            const formState = reactive({
                title: '',
                body: ''
            });
            return {
                columns,
                formState
            };
        },
        data() {
            return {
               filterData: {}
            }
        },
        computed: mapState({
            posts: state => state.posts.postsData,
            currentPage: state => state.posts.currentPage,
            totalCount: state => state.posts.totalCount,
            response: state => state.posts.responseFromApi,
            doFilter: state => state.posts.doFilter
        }),
        mounted() {
            this.getData();
        },
        watch: {
            response(newResponse) {
                if (newResponse !== "") {
                    if (newResponse === "success") {
                        this.getData();
                    }
                }
            },
        },
        methods: {
            ...mapActions('posts', ["getPosts", "updateCurrentPage", "deletePost", "updateDoFilter"]),
            getData() {
                this.$store.dispatch('posts/getPosts', {"currentPage": this.currentPage, "filterData" : this.filterData, "userId": this.$route.params.id});
            },
            onChangePage(page) {
                this.$store.dispatch('posts/updateCurrentPage', page);
                this.$store.dispatch('posts/getPosts', {"currentPage": page, "filterData" : this.filterData, "userId": this.$route.params.id});
            },
            confirmDelete(id) {
                this.$store.dispatch('posts/deletePost', id);
            },
            cancelDelete() {
                console.log("canceled");
            },
            onFinishFilter(values) {
                this.filterData = values;
                this.$store.dispatch('posts/updateDoFilter', true);
                this.$store.dispatch('posts/getPosts', {"currentPage": 1, "filterData" : this.filterData, "userId": this.$route.params.id});
            },
            clearFilter() {
                this.$store.dispatch('posts/updateDoFilter', false);
                this.filterData = {"title": '', "body": ''};
                this.formState = {};
                this.$store.dispatch('posts/getPosts', {"currentPage": 1, "filterData" : this.filterData, "userId": this.$route.params.id});
            }
        }
    });
</script>
