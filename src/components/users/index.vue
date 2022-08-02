<template>
    <div>
        <div class="dFlexV1">
            <h3>Users List </h3>
            <router-link to="/createUser">
                <a-button type="primary">New User</a-button>
            </router-link>
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
            return {
                columns
            };
        },
        computed: mapState({
            users: state => state.users.usersData,
            currentPage: state => state.users.currentPage,
            totalCount: state => state.users.totalCount,
            response: state => state.users.responseFromApi,
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
            ...mapActions('users', ["getUsers", "updateCurrentPage", "deleteUser", "updateWantDelete"]),
            getData() {
                this.$store.dispatch('users/getUsers', this.currentPage);
            },
            onChangePage(page) {
                this.$store.dispatch('users/updateCurrentPage', page);
                this.getData();
            },
            confirmDelete(id) {
                this.$store.dispatch('users/deleteUser', id);
            },
            cancelDelete() {
                console.log("canceled");
            }
        }
    });
</script>
