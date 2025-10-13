import React from 'react';
import type { Config } from '../utils/types.js';
interface SetupProps {
    onComplete: (config: Config) => void;
}
export declare const Setup: React.FC<SetupProps>;
export {};
