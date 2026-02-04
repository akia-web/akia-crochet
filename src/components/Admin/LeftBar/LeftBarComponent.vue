<template>
  <div class="sticky bg-white top-0 left-0 h-[100vh] p-[20px] min-w-[241px]">
    <div>
      <RouterLink to="/" class="flex justify-center mb-8">
        <img class="logo"
             alt="logo Akia"
             src="@/assets/logo-base-line.png">
      </RouterLink>
    </div>
    <div>
      <PanelMenu :model="items">
        <template #item="{ item, active }">
          <div class="flex items-center px-4 py-2 cursor-pointer group">
            <span :class="[item.icon, 'text-primary group-hover:text-inherit']"/>
            <span :class="['ml-2', { 'font-semibold': item.items }]"
                  @click="navigateTo(item.url? item.url : undefined)">
              {{ item.label }}
            </span>

            <span
                v-if="item.items"
                class="pi ml-auto transition-transform"
                :class="active ? 'pi-angle-down' : 'pi-angle-right'"
            />
          </div>
        </template>
      </PanelMenu>
    </div>
    <div>
      <div class=" pb-[10px] absolute bottom-0 left-0 w-full">
        <div class="text-center">
          <Button label="Déconnexion"
                  class="text-center"
                  @click="disconnect"></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { adminMenuItems } from '@/components/Admin/LeftBar/config/menu-items.ts';

const items = adminMenuItems;

const emit = defineEmits(['naviate', 'disconnect']);

const disconnect = () => {
  emit('disconnect');
};

const navigateTo = (url: string | undefined) => {
  if (url === undefined) {
    return;
  }
  emit('naviate', url);
};

</script>

<style scoped src="./style.css"></style>