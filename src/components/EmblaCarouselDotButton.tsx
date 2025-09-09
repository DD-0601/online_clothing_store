type DotButtonProps = {
    selected: boolean
    onClick: () => void
  }
  
  export const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
    <button
      type="button"
      className={`embla__dot${selected ? " embla__dot--selected" : ""}`}
      onClick={onClick}
      aria-label="Go to slide"
    />
  )
  