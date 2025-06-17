import { colourOf } from "./Functions";

interface RatingProps {
    rating: number;
    size: number;
    imageUrl: string;
}

function Rating({ rating, size, imageUrl }: RatingProps) {
    return (
        <>
<<<<<<< HEAD
            <img 
                src={imageUrl} 
                alt="brand logo" 
                className="object-contain"
                style={{ width: size, height: size }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'img/EarthBuddyLogo.png';
                }}
            />
=======
>>>>>>> 12110797db7a19790f02b2ef87cd71a7b29468bd
            <span className='text-lg mt-1 font-bold' style={{ color: colourOf(rating) }}>{rating} </span>
        </>
    )
}

export default Rating