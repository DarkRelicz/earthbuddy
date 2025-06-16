export const colourOf = (rating: number) => {
    return rating > 4 ? '#099D89' :
        rating > 3 ? '#68942A' :
            rating > 2 ? "#C47E0D" : "#C43E0D"
};