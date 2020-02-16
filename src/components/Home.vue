<template>
  <div id="customer-page">
    <h1>{{ page.fields.headline }}</h1>
    <div v-html="page.fields.body"></div>
  </div>
</template>

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
          console.log(res.data.data)
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
