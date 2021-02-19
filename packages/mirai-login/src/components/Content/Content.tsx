import { defineComponent, RendererElement, SetupContext, Slots } from 'vue';
import style from './content.sass';

interface SetupReturn {
  slots: Slots;
}

/**
 * 布局组件 padding: 16px
 */
function setup(props: {}, ctx: SetupContext): SetupReturn {
  return {
    slots: ctx.slots // children
  };
}

export default defineComponent({
  setup,
  render(): RendererElement {
    return (
      <div class={ style.content }>
        { this.slots?.default?.() }
      </div>
    );
  }
});