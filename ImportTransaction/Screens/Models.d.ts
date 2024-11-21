import React from 'react';
import '../MultiStepForm.css';
interface GuidelinesModalProps {
    show: boolean;
    handleClose: () => void;
}
export declare const ParentComponent: React.FC;
export declare const GuidelinesModal: React.FC<{
    show: boolean;
    handleClose: () => void;
    handleShowGuidelines: () => void;
}>;
export declare const ImportGuidelinesModal: React.FC<GuidelinesModalProps>;
export {};
