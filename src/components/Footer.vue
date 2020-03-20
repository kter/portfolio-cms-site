<template>
  <div class="footer">
    <div class="footer-img">
      <a href="https://buttercms.com" target="_blank" rel="noopener">
        このサイトは次のCMSで管理しています<br />
        <img class="img" src="@/assets/butter-y.png">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  border-top: solid;
  border-color: gray;
  border-width: thin;
  padding-top: 25px;
  margin-bottom: 50px;
}
.footer-img {
  text-align: center;
}
a {
  color: #42b983;
}
img {
  width: 35%;
}
</style>
