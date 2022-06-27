<template>
  <div
    class="check-item"
    :class="[value ? 'checked' : 'unchecked']"
  >
    <span
      class="material-icons"
      v-html="icon"
    />
    <span class="check-text"><slot /></span>
  </div>
</template>

<script>
export default {
  props: ['value'],

  computed: {
    icon() {
      return this.value ? '&#xe876' : '&#xe5cd';
    },
  },
};
</script>
