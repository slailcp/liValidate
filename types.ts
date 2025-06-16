
export interface RuleDefinition {
  pattern: RegExp;
  message: string;
}

export interface LiValidateOptions {
  errorClass?: string;
  popoverClass?: string;
  validateMode?: 'default' | 'single' | 'all';
  tipDuration?: number;
  scrollMargin?: string;
  scrollMarginTop?: string;
  scrollMarginRight?: string;
  scrollMarginBottom?: string;
  scrollMarginLeft?: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right';
  rules?: Record<string, RuleDefinition>;
}

export interface LiValidateInstance {
  validate: (formId: string, options?: LiValidateOptions) => boolean;
  clearValidateErrors: (formId?: string) => void;
}

declare global {
  interface Window {
    validate: (formId: string, options?: LiValidateOptions) => boolean;
    clearValidateErrors: (formId?: string) => void;
  }
}