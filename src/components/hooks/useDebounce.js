import {useEffect, useRef, useState} from "react";


export default function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState("");
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            clearTimeout(timerRef.current);
        }
    }, [value, delay]);

    return debouncedValue;
}
