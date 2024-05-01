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
     * If not, you will have to provide a way to close the dialog yourself. Note though that open dialogs are not saved - you'll have to store a variable
     * indicating that the dialog was open and re-open in on a load or page refresh.
     */
    dismissible: boolean;
};