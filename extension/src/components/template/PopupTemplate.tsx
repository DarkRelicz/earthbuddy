import { ReactNode } from 'react'

interface PopupTemplateProps {
    children: ReactNode;
}

function PopupTemplate({ children }: PopupTemplateProps) {
  return (
    <div className="w-[375px] min-h-[300px] bg-[#FFF9F3] flex flex-col items-center justify-center px-6 py-8 text-center font-sans">
        { children }
    </div>
  )
}

export default PopupTemplate