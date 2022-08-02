import axios from 'axios';

// initial state
const state = {
    usersData: [],
    currentPage: 1,
    totalCount: 20,
    responseFromApi: ''
};

// actions
const actions = {
    getUsers ({ commit }, currentPage) {
        axios.get(`https://gorest.co.in/public/v1/users?page=${currentPage}`).then((res) => {
            commit('setUsers', res.data.data);
            commit('setCurrentPage', res.data.meta.pagination.page);
            commit('setTotalCount', res.data.meta.pagination.total);
        });
    },

    updateCurrentPage({commit}, currentPage) {
        commit('setCurrentPage', currentPage);
    },

    createUser ({ commit }, formData) {
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
};

// mutations
const mutations = {
    setUsers (state, users) {
        state.usersData = users;
    },
    setCurrentPage (state, currentPage) {
        state.currentPage = currentPage;
    },
    setTotalCount (state, totalCount) {
        state.totalCount = totalCount;
    },
    setResponse (state, response) {
        state.responseFromApi = response;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}