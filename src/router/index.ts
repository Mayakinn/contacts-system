import ContactView from '@/views/ContactView.vue'
import SingleContactView from '@/views/SingleContactView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'contacts',
          component: ContactView,
          alias: '/contacts',
        },
        {
          path: 'contacts/:id',
          name: 'contact',
          component: SingleContactView,
          props: true,
        },
      ],
    },
  ],
})

export default router
