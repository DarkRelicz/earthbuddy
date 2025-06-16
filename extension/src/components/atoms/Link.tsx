import { link } from 'fs';
import React from 'react'

interface LinkProps {
    onClickCallBack: () => void;
    title: string;
}

function Link({ onClickCallBack, title }: LinkProps) {
    return (
        <button
            onClick={onClickCallBack}
            className="text-[#4F7BFF] font-medium hover:underline focus:outline-none">
            {title}
        </button>
    )
}

export default Link