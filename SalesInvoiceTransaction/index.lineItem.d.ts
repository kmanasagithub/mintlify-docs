import './index.css';
import { Data } from './interfaces';
interface DataProps {
    data: Data | null;
    onCancel: () => void;
}
declare const LineIndex: ({ data, onCancel }: DataProps) => any;
export default LineIndex;
