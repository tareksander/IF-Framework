/**
 * Describes an open dialog.
 */
export interface Dialog {
    /**
     * A Svelte component constructor.
     */
    component: any,
    /**
     * If true, the dialog is dismissible by the default means: Pressing escape or clicking outside the dialog bounds dismisses the topmost dialog.
     */
    dismissible: boolean;
};