// const apiUrl = process.env.API_URL || 'https://admin.breakfastinbed.me'
// export const directus = new Directus(apiUrl)
const directus = (moduleOptions) => {
    console.log({ moduleOptions });
};
export default directus;
// Vue.use({
//   // install: (app: VueConstructor) => {
//   //   Vue.prototype.$directus = directus
//   //   // Vue.prototype.$auth = directus.auth
//   //   app.mixin({
//   //     data() {
//   //       return {}
//   //     }
//   //   })
//   // }
// })
