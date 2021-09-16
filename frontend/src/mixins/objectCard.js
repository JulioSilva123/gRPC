export default {
  computed: {
    cardColunmWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12
        case 'sm':
        case 'md': return 6
        case 'lg': return 4
        case 'xl': return 3
        default: return 3
      }
    }
  }
}