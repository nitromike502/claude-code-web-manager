<template>
  <div class="project-detail">
    <h1>Project Detail</h1>
    <p>Project ID: {{ id }}</p>
    <p>Configuration cards will be shown here (Story 2.4)</p>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetail',
  props: ['id']
}
</script>

<style scoped>
.project-detail {
  padding: 2rem;
}
</style>
