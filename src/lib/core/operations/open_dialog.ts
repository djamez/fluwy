import type { Operation } from '@/lib/core/contracts.js';
import { useDialogs } from '@/lib/core/stores/dialogs.js';

export const open_dialog: Operation = (yamlDoc, { context }) => {
    return useDialogs().open(yamlDoc, context);
};
