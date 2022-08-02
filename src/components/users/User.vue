<template>
    <div>
        <div v-if="!userNotFound">
            <div class="mb-2">
                <h3 class="text-center">{{this.pageTitle}}</h3>
            </div>
            <a-form
                    :model="formState"
                    name="basic"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
            >
                <a-form-item
                        label="Name"
                        name="name"
                        :rules="[{ required: true, message: 'Please input name!' }]"
                >
                    <a-input v-model:value="formState.name"/>
                </a-form-item>
                <a-form-item
                        label="Email"
                        name="email"
                        :rules="[{ required: true, message: 'Please input email!' }]"
                >
                    <a-input v-model:value="formState.email"/>
                </a-form-item>
                <a-form-item
                        label="Gender"
                        name="gender"
                        :rules="[{ required: true, message: 'Please input gender!' }]"
                >
                    <a-radio-group v-model:value="formState.gender">
                        <a-radio value="female">Female</a-radio>
                        <a-radio value="male">Male</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="Status" name="status">
                    <a-switch v-model:checked="formState.status"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                    <a-button type="primary" html-type="submit">Submit</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div v-else>
            <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
                <template #extra>
                    <router-link to="/">
                        <a-button type="primary">Back Home</a-button>
                    </router-link>
                </template>
            </a-result>
        </div>
    </div>
</template>

<script>
    import {defineComponent, reactive} from 'vue';
    import {mapState, mapActions} from "vuex";
    import { notification } from 'ant-design-vue';
    export default defineComponent({
        name: "User",
        setup() {
            const formState = reactive({
                name: '',
                email: '',
                gender: '',
                status: true,
            });
            return {
                formState
            };
        },
        data(){
          return {
              routerName: "",
              pageTitle: ""
          }
        },
        created() {
            this.routerName = this.$route.name;
            if (this.routerName === "updateUser") {
                this.pageTitle = "Update User Form";
                this.$store.dispatch('users/getUser', this.$route.params.id);
            }
            else {
                this.pageTitle = "Add User Form";
            }
        },
        computed: mapState({
            response: state => state.users.responseFromApi,
            userData: state => state.users.userData,
            userNotFound: state => state.users.userNotFound
        }),
        watch: {
            response(newResponse) {
                if (newResponse !== "") {
                    if (newResponse === "success") {
                        notification['success']({
                            message: 'Success',
                            description: 'User created successfully',
                        });
                        window.location.href = "/users"
                    }
                    else {
                        notification['error']({
                            message: 'Failed',
                            description: 'Something went wrong',
                        });
                    }
                }
            },
            userData(newResponse) {
                this.formState.name = newResponse.name;
                this.formState.email = newResponse.email;
                this.formState.gender = newResponse.gender;
                this.formState.status = newResponse.status === "inactive" ? false : true;
            }
        },
        methods: {
            ...mapActions('users', ["createUser", "getUser", "updateUser"]),
            onFinish(values) {
                values.status = values.status === true ? "active" : "inactive";
                if (this.routerName === "createUser") {
                    this.createUserMethod(values)
                }
                else {
                    this.updateUserMethod(values, this.$route.params.id)
                }
            },
            onFinishFailed(errorInfo) {
                console.log('Failed:', errorInfo);
            },
            createUserMethod(values) {
                this.$store.dispatch('users/createUser', values);
            },
            updateUserMethod(values, id) {
                this.$store.dispatch('users/updateUser', {values, id});
            },
        }
    });
</script>
