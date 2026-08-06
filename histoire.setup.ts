import { defineSetupVue3 } from '@histoire/plugin-vue'
import { defineComponent, h, ref } from 'vue'
import './app/assets/css/main.css'

const ButtonStub = defineComponent({
  props: {
    disabled: Boolean,
    loading: Boolean,
  },
  emits: ['click'],
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          disabled: props.disabled || props.loading,
          type: 'button',
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default?.(),
      )
  },
})

const BadgeStub = defineComponent({
  setup(_, { attrs, slots }) {
    return () => h('span', attrs, slots.default?.())
  },
})

const InputStub = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.component('UButton', ButtonStub)
  app.component('UBadge', BadgeStub)
  app.component('UInput', InputStub)

  const globalScope = globalThis as typeof globalThis & {
    useFetch?: () => { data: ReturnType<typeof ref<{ emailEnabled: boolean }>> }
  }

  globalScope.useFetch = () => ({ data: ref({ emailEnabled: true }) })
})

export const setupVanilla = () => {}
