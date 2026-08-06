<script setup lang="ts">
import ReadingDisplay from '../app/components/ReadingDisplay.vue'
</script>

<template>
  <Story title="Reading / Display" :layout="{ type: 'single', iframe: true }">
    <Variant title="Completed">
      <ReadingDisplay
        text="The cards point toward a deliberate next step. Let steadiness create the space for a clearer choice."
        :is-streaming="false"
      />
    </Variant>

    <Variant title="Streaming">
      <ReadingDisplay
        text="The first signal is already visible."
        :is-streaming="true"
        heading="Your Reading"
      />
    </Variant>

    <Variant title="Error">
      <ReadingDisplay
        text=""
        :is-streaming="false"
        error="The reading could not be completed. Please try again."
      />
    </Variant>
  </Story>
</template>
