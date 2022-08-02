<template>
    <div>
        <div class="mb-2">
            <h3 class="text-center">Add User Form</h3>
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
</template>

<script>
    import {mapState, mapActions} from "vuex";
    import { notification } from 'ant-design-vue';
    import {defineComponent, reactive} from 'vue';

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
        computed: mapState({
            response: state => state.users.responseFromApi
        }),
        watch: {
            response(newResponse, oldResponse) {
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

        },
        methods: {
            ...mapActions('users', ["createUser"]),
            onFinish(values) {
                values.status = values.status === true ? "active" : "inactive";
                this.createUserMethod(values)
            },
            onFinishFailed(errorInfo) {
                console.log('Failed:', errorInfo);
            },
            createUserMethod(values) {
                this.$store.dispatch('users/createUser', values);
            },
        }
    });
</script>
