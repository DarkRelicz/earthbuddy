export const colourOf = (score: number | null) => {
    if (score != null) {
        return score > 40 ? '#FA4C66' : 
            score > 30 ? '#E54747' : 
                score > 20 ? "#DB5228" : 
                    score > 10 ? "#D2BD36" : 
                        score >= 0 ? "#68942A" : "#099D89"
    }
    else {
        return "#8B959B"
    }
};
