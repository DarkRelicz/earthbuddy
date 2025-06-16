import { colourOf } from "./Functions";
import { Globe } from "lucide-react";

interface RatingProps {
    rating: number;
    size: number
}

function Rating({ rating, size }: RatingProps) {
    return (
        <>
            <Globe className={`w-${size} h-${size} mr-2`} />
            <span className='text-lg mt-1 font-bold' style={{ color: colourOf(rating) }}>{rating} / 5</span>
        </>
    )
}

export default Rating