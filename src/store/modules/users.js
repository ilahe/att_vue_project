import axios from 'axios';

// initial state
const state = {
    usersData: [],
    currentPage: 1,
    totalCount: 20,
    responseFromApi: '',
    userData: {},
    userNotFound: false,
    doFilter: false
};

// actions
const actions = {
    getUsers ({ commit, state }, data) {
        let myUrl;
        if (state.doFilter) {
            var filteredName = data.filterData.name;
            var filteredEmail = data.filterData.email;
            var filteredGender = data.filterData.gender;
            var filteredStatus = data.filterData.status === true ? 'active' : 'inactive';
            myUrl = `https://gorest.co.in/public/v1/users?page=${data.currentPage}&name=${filteredName}&email=${filteredEmail}&gender=${filteredGender}&status=${filteredStatus}`;
        }
        else {
            myUrl = `https://gorest.co.in/public/v1/users?page=${data.currentPage}`
        }
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.get(myUrl, header).then((res) => {
            commit('setUsers', res.data.data);
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

    getUser ({ commit }, id) {
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

    updateUser ({ commit }, data) {
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

    deleteUser({commit}, id) {
        commit('setResponse', "");
        const header = {
            headers: { Authorization: `Bearer 8de3a559816c6ed8ad2b795800b774a9ac00784acd9aa6de441a7424744671da` }
        };
        axios.delete(`https://gorest.co.in/public/v1/users/${id}`, header)
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
    },
    setUserData (state, userData) {
        state.userData = userData;
    },
    setUserNotFound (state, userNotFound) {
        state.userNotFound = userNotFound;
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