import { useAuthStore } from '@/stores/authStore'
import AdminView from '@/views/AdminView.vue'
import CompaniesManagementView from '@/views/CompaniesManagementView.vue'
import CompanyStructureView from '@/views/CompanyStructureView.vue'
import ContactView from '@/views/ContactView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
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
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompaniesManagementView,
    },
    {
      path: '/structure',
      name: 'structure',
      component: CompanyStructureView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: ForgotPasswordView,
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()
  if (auth.jwtToken != null && to.name == 'login') {
    return { name: 'contacts' }
  }
})

export default router
