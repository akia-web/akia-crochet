<template>
  <div class="h-full">
    <div class="cropper-container-wrapper w-[80%] h-[70vh] m-auto md:w-[60%]">
      <vue-cropper
          ref="cropper"
          v-if="cropperSrc"
          :src="cropperSrc"
          :aspect-ratio="1"
          :view-mode="0"
          :drag-mode="'move'"
          :auto-crop-area="0.8"
          :movable="true"
          :zoomable="true"
          :background="false"
          :crop-box-resizable="true"
          :responsive="true"
          @ready="onCropperReady"
      />
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <Button label="Annuler" @click="closeCropper"/>
      <Button label="Valider" @click="confirmCrop"/>
    </div>
  </div>

</template>

<script lang="ts" setup>
import VueCropper from 'vue-cropperjs';
import { inject, ref, onUnmounted } from 'vue';

const cropper = ref<any>(null);
const dialogRef = inject('dialogRef') as any;
const { file } = dialogRef.value.data;

const cropperSrc = ref<string>(URL.createObjectURL(file));

onUnmounted(() => {
  if (cropperSrc.value) URL.revokeObjectURL(cropperSrc.value);
});


const onCropperReady = () => {
  const instance = cropper.value;
  if (!instance) return;

  instance.reset();

  const container = document.querySelector('.cropper-container-wrapper') as HTMLElement;
  const containerHeight = container?.clientHeight || 800;
  const containerWidth = container?.clientWidth || 800;

  const cropBoxData = instance.getCropBoxData();
  const imageData = instance.getImageData();

  const zoomX = cropBoxData.width / imageData.naturalWidth;
  const zoomY = cropBoxData.height / imageData.naturalHeight;
  const zoom = Math.min(zoomX, zoomY, 1);
  instance.zoomTo(zoom);

  instance.setCropBoxData({
    left: (containerWidth - cropBoxData.width) / 2,
    top: (containerHeight - cropBoxData.height) / 2,
    width: cropBoxData.width,
    height: cropBoxData.height,
  });

  const updatedCanvas = instance.getCanvasData();
  const moveX = ((containerWidth) / 2) - (updatedCanvas.left + updatedCanvas.width / 2);
  const moveY = ((containerHeight) / 2) - (updatedCanvas.top + updatedCanvas.height / 2);

  instance.move(moveX, moveY);
};

const closeCropper = () => {
  if (cropperSrc.value) URL.revokeObjectURL(cropperSrc.value);
  dialogRef.value.close({ result: null });
};

const confirmCrop = () => {
  if (!cropper.value) return;

  const canvas = cropper.value.getCroppedCanvas({
    width: 1000,
    height: 1000,
    imageSmoothingQuality: 'high',
  });

  canvas.toBlob((blob: any) => {
    if (!blob) return;

    const fileName = file.name.split('/').pop();
    const newFileName = `new-${fileName}`;
    const croppedFile = new File([blob], newFileName, { type: file.type });

    if (cropperSrc.value) URL.revokeObjectURL(cropperSrc.value);
    dialogRef.value.close({ newImage: croppedFile });
  }, file.type || 'image/jpeg', 0.9);
};
</script>

<style scoped>

</style>
