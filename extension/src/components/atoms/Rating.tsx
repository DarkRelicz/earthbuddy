import { colourOf } from "./Functions";

interface RatingProps {
    rating: number;
    size: number;
    imageUrl: string;
}

function Rating({ rating, size, imageUrl }: RatingProps) {
    return (
        <>
            <img 
                src={imageUrl} 
                alt="brand logo" 
                className="object-contain"
                style={{ width: size, height: size }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'img/EarthBuddyLogo.png';
                }}
            />
            <span className='text-lg mt-1 font-bold' style={{ color: colourOf(rating) }}>{rating} </span>
        </>
    )
}

export default Rating