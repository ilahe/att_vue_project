<template>
    <div>
        <div v-if="!postNotFound">
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
                        label="Title"
                        name="title"
                        :rules="[{ required: true, message: 'Please input title!' }]"
                >
                    <a-input v-model:value="formState.title"/>
                </a-form-item>
                <a-form-item
                        label="Body"
                        name="body"
                        :rules="[{ required: true, message: 'Please input body!' }]"
                >
                    <a-input v-model:value="formState.body"/>
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
        name: "Post",
        setup() {
            const formState = reactive({
                title: '',
                body: ''
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
            if (this.routerName === "updatePost") {
                this.pageTitle = "Update User Post Form";
                this.$store.dispatch('posts/getPost', this.$route.params.id);
            }
            else {
                this.pageTitle = "Add User Post Form";
            }
        },
        computed: mapState({
            response: state => state.posts.responseFromApi,
            postData: state => state.posts.postData,
            postNotFound: state => state.posts.postNotFound
        }),
        watch: {
            response(newResponse) {
                if (newResponse !== "") {
                    if (newResponse === "success") {
                        notification['success']({
                            message: 'Success',
                            description: 'Post created successfully',
                        });
                        window.location.href = `/user/${this.$route.params.userId ? this.$route.params.userId : this.$route.params.id}/posts`
                    }
                    else {
                        notification['error']({
                            message: 'Failed',
                            description: 'Something went wrong',
                        });
                    }
                }
            },
            postData(newResponse) {
                this.formState.title = newResponse.title;
                this.formState.body = newResponse.body;
            }
        },
        methods: {
            ...mapActions('posts', ["createPost", "getPost", "updatePost"]),
            onFinish(values) {
                if (this.routerName === "createPost") {
                    this.createPostMethod(values)
                }
                else {
                    this.updatePostMethod(values, this.$route.params.id)
                }
            },
            onFinishFailed(errorInfo) {
                console.log('Failed:', errorInfo);
            },
            createPostMethod(values) {
                this.$store.dispatch('posts/createPost', {"values":values, "userId" : this.$route.params.id});
            },
            updatePostMethod(values, id) {
                this.$store.dispatch('posts/updatePost', {"values":values, "id" : id});
            },
        }
    });
</script>
