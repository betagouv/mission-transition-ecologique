<template>
  <div class="tee-number-card fr-border fr-p-2w">
    <div class="tee-number-card-icon-div">
      <div
        class="tee-number-card-icon"
        :class="`fr-bg--${color}`"
      ></div>
    </div>

    <div class="tee-number-card-number-div">
      <span
        class="tee-number-card-number"
        :class="`fr-text--${color}`"
      >
        {{ number }}
      </span>
    </div>

    <div class="tee-number-card-content-div">
      <div class="tee-number-card-title">
        {{ title }}
      </div>
      <div class="tee-number-card-slot">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Color = 'blue-900' | 'green-tilleul-verveine' | 'red-marianne' | 'yellow-tournesol'

defineProps<{
  number: number | string
  title: string
  color: Color
}>()
</script>

<style scoped>
.tee-number-card {
  border: 1px solid var(--border-default-grey);
  display: flex;
  gap: 1rem;
  min-height: 100px;
}

.tee-number-card-icon-div {
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tee-number-card-icon {
  width: 24px;
  height: 24px;
  position: relative;
  background: linear-gradient(135deg, var(--background-action-high-blue-900) 50%, transparent 50%);
}

.tee-number-card-number-div {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tee-number-card-number {
  font-size: 2rem;
  font-weight: 700;
}

.tee-number-card-content-div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tee-number-card-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-title-grey);
  margin-bottom: 0.25rem;
}

.tee-number-card-slot {
  font-size: 0.875rem;
  align-items: center;
}
</style>
