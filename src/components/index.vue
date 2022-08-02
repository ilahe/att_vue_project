<template>
  <div>
    <div class="mainPageContainer">
      <div class="innerPart">
        <h3> Agro Procurement and Supply task</h3>
        <br>
        This project is created to manage users and their posts.
        <br>
        If you want to see users lists, you can click
        <br><br>

        <router-link to="/users">
          <a-button type="primary">Users Page</a-button>
        </router-link>
      </div>
      <div class="bgImage"></div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>