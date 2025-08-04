<script lang="ts" setup>
interface DataItem {
  [key: string]: any
}
interface Field {
  key: string
  label: string
}

const props = defineProps<{
  data: DataItem[]
  fields: Field[]
  canUserDelete: boolean | undefined
  canUserEdit: boolean | undefined
}>()

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mr-10">
    <table class="text-sm text-left w-full table-fixed">
      <thead class="text-md text-center bg-gray-50">
        <tr class="font-light">
          <th v-for="(item, idx) in fields" :key="idx" scope="col" class="px-6 py-3">
            {{ item.label }}
          </th>
          <th v-show="canUserEdit == true || canUserDelete == true">Veiksmai</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="index"
          class="bg-white border-b border-gray-200 text-center"
        >
          <th v-for="(field, idx) in fields" :key="idx">
            <p
              :item="item"
              class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
            >
              {{ item[field.key] }}
            </p>
          </th>
          <td
            class="px-6 py-4 space-x-5 text-white font-light"
            v-show="canUserEdit == true || canUserDelete == true"
          >
            <button
              class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500 text-white"
              @click="emit('edit', item.id)"
              v-show="canUserEdit"
            >
              Redaguoti
            </button>
            <button
              class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600 text-white"
              @click="emit('delete', item.id)"
              v-show="canUserDelete"
            >
              Ištrinti
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
