<script setup lang="ts">
import ReadingActions from '../app/components/ReadingActions.vue'
</script>

<template>
  <Story title="Reading / Actions" :layout="{ type: 'single', iframe: true }">
    <Variant title="Share and replay">
      <ReadingActions share-url="https://tarotagent.app/r/a1b2c3d4e5f6" />
    </Variant>

    <Variant title="Replaying">
      <ReadingActions share-url="https://tarotagent.app/r/a1b2c3d4e5f6" is-replaying />
    </Variant>

    <Variant title="Email error">
      <ReadingActions
        share-url="https://tarotagent.app/r/a1b2c3d4e5f6"
        email-error="We could not send that reading."
      />
    </Variant>

    <Variant title="Email sent">
      <ReadingActions
        share-url="https://tarotagent.app/r/a1b2c3d4e5f6"
        email-message="Reading emailed successfully."
      />
    </Variant>
  </Story>
</template>
