export const colourOf = (score: number | null) => {
    if (score != null) {
        return score > 40 ? '#EF4444' :
            score > 30 ? '#F87171' :
                score > 20 ? "#FDBA74" :
                    score > 10 ? "#FEF08A" :
                        score >= 0 ? "#BBF7D0" : "#F3F4F6"
    }
    else {
        return "#8B959B"    
    }
};

// colour can change ltr


        // return score > 40 ? '#099D89' :
        //     score > 30 ? '#68942A' :
        //         score > 20 ? "#C47E0D" :
        //             score > 10 ? "#C43E0D" :
        //                 score >= 0 ? "#C3780D" : "#C28910"
