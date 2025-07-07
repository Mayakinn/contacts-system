import AdminView from '@/views/AdminView.vue'
import CompaniesManagementView from '@/views/CompaniesManagementView.vue'
import CompanyStructureView from '@/views/CompanyStructureView.vue'
import ContactView from '@/views/ContactView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import LoginView from '@/views/LoginView.vue'
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
    },
  ],
})

export default router
