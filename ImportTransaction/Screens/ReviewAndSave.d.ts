import React from 'react';
import { FormData } from '../types';
interface ReviewAndSaveProps {
    data: FormData;
    updateData: (data: Partial<FormData>) => void;
}
declare const ReviewAndSave: React.FC<ReviewAndSaveProps>;
export default ReviewAndSave;
