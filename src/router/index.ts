import { useAuthStore } from '@/stores/authStore'
import AdminView from '@/views/AdminView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import CompaniesManagementView from '@/views/CompaniesManagementView.vue'
import CompanyStructureView from '@/views/CompanyStructureView.vue'
import ContactView from '@/views/ContactView.vue'
import DepartmentStructureView from '@/views/DepartmentStructureView.vue'
import DivisionStructureView from '@/views/DivisionStructureView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import GroupStructureView from '@/views/GroupStructureView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import OfficeStructureView from '@/views/OfficeStructureView.vue'
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
      path: '/structures',
      name: 'structures',
      component: CompanyStructureView,
      children: [
        {
          path: 'offices',
          name: 'offices',
          component: OfficeStructureView,
        },
        {
          path: 'departments',
          name: 'departments',
          component: DepartmentStructureView,
        },
        {
          path: 'groups',
          name: 'groups',
          component: GroupStructureView,
        },
        {
          path: 'divisions',
          name: 'divisions',
          component: DivisionStructureView,
        },
      ],
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
      path: '/changepassword',
      name: 'changepassword',
      component: ChangePasswordView,
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompaniesManagementView,
    },
    {
      path: '/structures',
      name: 'structures',
      component: CompanyStructureView,
      children: [
        {
          path: 'offices',
          name: 'offices',
          component: OfficeStructureView,
        },
        {
          path: 'departments',
          name: 'departments',
          component: DepartmentStructureView,
        },
        {
          path: 'groups',
          name: 'groups',
          component: GroupStructureView,
        },
        {
          path: 'divisions',
          name: 'divisions',
          component: DivisionStructureView,
        },
      ],
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
      path: '/changepassword',
      name: 'changepassword',
      component: ChangePasswordView,
      meta: {
        hideNavbar: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
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
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
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
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
    },
  ],
})

export default router
