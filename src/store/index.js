import { createStore, createLogger } from 'vuex'
import users from './modules/users'
import posts from './modules/posts'

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  modules: {
    users,
    posts
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})