import React from 'react';
interface ClaudeInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    label?: string;
    mask?: string;
}
export declare const ClaudeInput: React.FC<ClaudeInputProps>;
export {};
