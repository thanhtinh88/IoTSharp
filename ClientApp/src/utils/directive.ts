import type { App } from 'vue';
import { authDirective } from '/@/utils/authDirective';
import { wavesDirective, dragDirective } from '/@/utils/customDirective';

/**
  * Export command method: v-xxx
  * @methods authDirective user permission command, usage: v-auth
  * @methods wavesDirective button wave command, usage: v-waves
  * @methods dragDirective Custom drag command, usage: v-drag
  */
export function directive(app: App) {
    //User permission instructions
    authDirective(app);
    // Button wave command
    wavesDirective(app);
    //Custom drag command
    dragDirective(app);
}