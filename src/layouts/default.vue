<template>
  <a-layout class="layout">
    <a-layout-content class="layoutContent">
      <div class="innerContent">
        <router-view />
      </div>
    </a-layout-content>
    <TheFooter/>
  </a-layout>
</template>

<script>
  import TheFooter from "../components/common/Footer";
  export default {
    name: "Layout",
    components: {
      TheFooter
    },
  };
</script>