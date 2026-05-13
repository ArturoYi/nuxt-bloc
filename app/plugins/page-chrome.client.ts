export default defineNuxtPlugin((nuxtApp) => {
  const { start, finish } = useNavProgress()

  nuxtApp.hook('page:start', () => {
    start()
  })

  nuxtApp.hook('page:finish', () => {
    finish()
  })

  nuxtApp.hook('app:error', () => {
    finish()
  })
})
