import axios from 'axios';

// initial state
const state = {
    usersData: [],
    currentPage: 1,
    totalCount: 20
};

// actions
const actions = {
    getUsers ({ commit }, currentPage) {
        console.log("sdsd",currentPage);
        axios.get(`https://gorest.co.in/public/v1/users?page=${currentPage}`).then((res) => {
            commit('setUsers', res.data.data);
            commit('setCurrentPage', res.data.meta.pagination.page);
            commit('setTotalCount', res.data.meta.pagination.total);
        });
    },
    updateCurrentPage({commit}, currentPage) {
        commit('setCurrentPage', currentPage);
    }
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
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}