<template>
    <div class="card menu-width relative">
      <Menu :model="items"
            class="sticky top-0 left-0 h-[calc(100vh-20px)]">
        <template #start>
          <RouterLink to="/" class="flex justify-center mb-8 mt-8">
            <img class="logo"
                 alt="logo Akia"
                 src="@/assets/logo-base-line.png">
          </RouterLink>
        </template>
        <template #item="{ item, props }">
          <a class="flex items-center ml-[10px]"
             @click="navigateTo(item.url!)">
            <p :class="item.icon" class="mr-2" />
            <p>{{ item.label }}</p>
          </a>
        </template>
        <template #end>
          <div class=" pb-[10px] absolute bottom-0 w-full">
            <div class="flex justify-center">
              <Button label="Déconnexion"
                      @click="disconnect"></Button>
            </div>
          </div>

        </template>
      </Menu>
    </div>
</template>

<script lang="ts" setup>
import { adminMenuItems } from '@/components/Admin/LeftBar/config/menu-items.ts';

const items = adminMenuItems

const emit = defineEmits(['naviate', 'disconnect']);

const disconnect = () => {
  emit('disconnect')
}

const navigateTo = (url: string) => {
  emit('naviate', url)
}

</script>

<style scoped src="./style.css"></style>