<template>
  <div>
    <div><span :class="detailInfos.icon"></span>{{ detailInfos.title }}</div>
  </div>
</template>
<script lang="ts" setup>
import { RegistrationDetailElement } from '@/types'

interface Props {
  detailInfos: RegistrationDetailElement
}
defineProps<Props>()
</script>
