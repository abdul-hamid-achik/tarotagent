<script setup lang="ts">
import ReadingMetaCard from '../app/components/ReadingMetaCard.vue'
</script>

<template>
  <Story title="Reading / Metadata" :layout="{ type: 'single', iframe: true }">
    <Variant title="New reading">
      <ReadingMetaCard
        spread-name="Three Card"
        question="What should I focus on next?"
        spread-description="Past, present, and future"
      />
    </Variant>

    <Variant title="Saved reading">
      <ReadingMetaCard
        badge="Saved Reading"
        spread-name="Celtic Cross"
        question="Where can I make room for change?"
        spread-description="The classic deep-dive spread"
        share-slug="a1b2c3d4e5f6"
        share-url="https://tarotagent.app/r/a1b2c3d4e5f6"
      />
    </Variant>
  </Story>
</template>
