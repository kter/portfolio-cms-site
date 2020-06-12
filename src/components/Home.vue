<template>
  <div id="customer-page">
    <div class="headline">{{ page.fields.headline }}</div>
    <div class="contents" v-html="page.fields.body"></div>
  </div>
</template>

<style>
  ul {
    padding-inline-start: 0;
  }

  .headline {
    font-size: 1.4em;
    margin: 70px 0 50px;
  }

  .contents {
    margin-bottom: 4em;
  }

  h1 {
    margin-bottom: 20px;
  }
  h2:nth-of-type(1) {
    margin-top: 35px;
  }
</style>

<script>
import { butter } from '@/buttercms'
export default {
  name: 'top-page',
  data () {
    return {
      page: {
        fields: {}
      }
    }
  },
  methods: {
    getPage () {
      butter.page.retrieve('*', 'homepage')
        .then((res) => {
          this.page = res.data.data
        }).catch((res) => {
          console.log(res)
        })
    }
  },
  created () {
    this.getPage()
  }
}
</script>
