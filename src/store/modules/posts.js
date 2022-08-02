import axios from 'axios';

// initial state
const state = {
    postsData: [],
    currentPage: 1,
    totalCount: 20,
    responseFromApi: '',
    postData: {},
    postNotFound: false,
    doFilter: false
};

// actions
const actions = {
    getPosts ({ commit, state }, data) {
        let myUrl;
        if (state.doFilter) {
            var filteredTitle = data.filterData.title ? data.filterData.title : "";
            var filteredBody = data.filterData.body ? data.filterData.body : ""
            myUrl = `https://gorest.co.in/public/v1/users/${data.userId}/posts?page=${data.currentPage}&title=${filteredTitle}&body=${filteredBody}`;
        }
        else {
            myUrl = `https://gorest.co.in/public/v1/users/${data.userId}/posts?page=${data.currentPage}`
        }
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.get(myUrl, header).then((res) => {
            commit('setPosts', res.data.data);
            commit('setCurrentPage', res.data.meta.pagination.page);
            commit('setTotalCount', res.data.meta.pagination.total);
        });
    },

    updateDoFilter({commit}, doFilter) {
        commit('setDoFilter', doFilter);
    },

    updateCurrentPage({commit}, currentPage) {
        commit('setCurrentPage', currentPage);
    },

    createPost ({ commit }, formData) {
        commit('setResponse', "");
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.post(`https://gorest.co.in/public/v1/users`, formData, header)
            .then((res) => {
                if (res.status = 201) {
                    commit('setResponse', "success");
                }
            }).catch((err) => {
            commit('setResponse', "failed");
        });
    },

    getPost ({ commit }, id) {
        commit('setUserNotFound', false);
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.get(`https://gorest.co.in/public/v1/users/${id}`, header)
            .then((res) => {
                commit('setUserNotFound', false);
                commit('setUserData', res.data.data);
            }).catch((err) => {
            commit('setUserNotFound', true);
        });
    },

    updatePost ({ commit }, data) {
        commit('setResponse', "");
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.put(`https://gorest.co.in/public/v1/users/${data.id}`, data.values, header)
            .then((res) => {
                if (res.status = 201) {
                    commit('setResponse', "success");
                }
            }).catch((err) => {
            commit('setResponse', "failed");
        });
    },

    deletePost({commit}, id) {
        commit('setResponse', "");
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.delete(`https://gorest.co.in/public/v1/posts/${id}`, header)
            .then((res) => {
                if (res.status = 201) {
                    commit('setResponse', "success");
                }
            }).catch((err) => {
            commit('setResponse', "failed");
        });
    }
};

// mutations
const mutations = {
    setPosts (state, posts) {
        state.postsData = posts;
    },
    setCurrentPage (state, currentPage) {
        state.currentPage = currentPage;
    },
    setTotalCount (state, totalCount) {
        state.totalCount = totalCount;
    },
    setResponse (state, response) {
        state.responseFromApi = response;
    },
    setPostData (state, postData) {
        state.postData = postData;
    },
    setPostNotFound (state, postNotFound) {
        state.postNotFound = postNotFound;
    },
    setDoFilter (state, doFilter) {
        state.doFilter = doFilter;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}