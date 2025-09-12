import { useState, useRef, useEffect } from "react";

interface ServiceDescriptionProps {
    description: string;
    maxLength?: number;
}

export default function ServiceDescription({
    description,
    maxLength = 38,
}: ServiceDescriptionProps) {
    const [expanded, setExpanded] = useState(false);
    const [truncatedText, setTruncatedText] = useState("");
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (description.length > maxLength) {
            setTruncatedText(description.substring(0, maxLength) + "...");
        } else {
            setTruncatedText(description);
        }
    }, [description, maxLength]);

    return (
        <div className="relative">
            <p
                ref={textRef}
                className="text-gray-600 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ maxHeight: expanded ? "1000px" : "3rem" }}
            >
                {expanded ? description : truncatedText}
            </p>

            {description.length > maxLength && (
                <div className="flex justify-end mt-1">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sage font-medium text-sm hover:underline transition-colors duration-200"
                    >
                        {expanded ? "Voir moins" : "Voir plus"}
                    </button>
                </div>
            )}
        </div>

    );
}
