import { colourOf } from "./Functions";
import { Globe } from "lucide-react";

interface RatingProps {
    rating: number;
    size: number
}

function Rating({ rating, size }: RatingProps) {
    return (
        <>
            <span className='text-lg mt-1 font-bold' style={{ color: colourOf(rating) }}>{rating} </span>
        </>
    )
}

export default Rating