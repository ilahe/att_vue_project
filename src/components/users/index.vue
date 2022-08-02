<template>
    <div>
        <div class="dFlexV1">
            <h3>Users List </h3>
            <router-link to="/createUser">
                <a-button type="primary">New User</a-button>
            </router-link>
        </div>

       <div class="filterContainer">
           <a-form
                   class="formFilter"
                   layout="inline"
                   :model="formState"
                   name="basic"
                   autocomplete="off"
                   @finish="onFinishFilter"
           >
               <a-form-item label="Name" name="name">
                   <a-input v-model:value="formState.name"/>
               </a-form-item>
               <a-form-item label="Email" name="email">
                   <a-input v-model:value="formState.email"/>
               </a-form-item>
               <a-form-item label="Gender" name="gender">
                   <a-radio-group v-model:value="formState.gender">
                       <a-radio value="female">Female</a-radio>
                       <a-radio value="male">Male</a-radio>
                   </a-radio-group>
               </a-form-item>
               <a-form-item label="Status" name="status">
                   <a-switch v-model:checked="formState.status"/>
               </a-form-item>
               <a-form-item>
                   <a-button type="primary" class="mr-1" html-type="submit">Filter</a-button>
                   <a-button type="primary" @click="clearFilter">Clear Filter</a-button>
               </a-form-item>
           </a-form>
       </div>

        <a-table :columns="columns" :data-source="users" :pagination="false" size="small" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key == 'gender'">
                  <span>
                    <a-tag :color="record.gender === 'female' ? 'orange' : 'green'">
                      {{ record.gender.toUpperCase() }}
                    </a-tag>
                  </span>
                </template>
                <template v-if="column.key == 'status'">
                  <span>
                    <a-tag :color="record.status === 'inactive' ? 'red' : 'blue'">
                      {{ record.status.toUpperCase() }}
                    </a-tag>
                  </span>
                </template>
                <template v-if="column.key == 'action'">
                    <div class="dFlexV2">
                        <div class="mr-1">
                            <router-link :to="{ name: 'updateUser', params: { id: record.id }}">
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Gender',
            key: 'gender',
            align: 'center',
            dataIndex: 'gender',
        },
        {
            title: 'Status',
            key: 'status',
            align: 'center',
            dataIndex: 'status',
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center'
        },
    ];
    export default ({
        name: "Users",
        setup() {
            const formState = reactive({
                name: '',
                email: '',
                gender: '',
                status: true,
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
            users: state => state.users.usersData,
            currentPage: state => state.users.currentPage,
            totalCount: state => state.users.totalCount,
            response: state => state.users.responseFromApi,
            doFilter: state => state.users.doFilter
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
            ...mapActions('users', ["getUsers", "updateCurrentPage", "deleteUser", "updateDoFilter"]),
            getData() {
                this.$store.dispatch('users/getUsers', {"currentPage": this.currentPage, "filterData" : this.filterData});
            },
            onChangePage(page) {
                this.$store.dispatch('users/updateCurrentPage', page);
                this.$store.dispatch('users/getUsers', {"currentPage": page, "filterData" : this.filterData});
            },
            confirmDelete(id) {
                this.$store.dispatch('users/deleteUser', id);
            },
            cancelDelete() {
                console.log("canceled");
            },
            onFinishFilter(values) {
                this.filterData = values;
                this.$store.dispatch('users/updateDoFilter', true);
                this.$store.dispatch('users/getUsers', {"currentPage": 1, "filterData" : this.filterData});
            },
            clearFilter() {
                this.$store.dispatch('users/updateDoFilter', false);
                this.filterData = {};
                this.formState = {};
                this.$store.dispatch('users/getUsers', {"currentPage": 1, "filterData" : this.filterData});
            }
        }
    });
</script>
