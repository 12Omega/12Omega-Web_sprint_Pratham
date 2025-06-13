// Button.tsx
export const Button = ({ text, onClick }) => (
  <button className="btn" onClick={onClick}>{text}</button>
);

// Usage:
//<Button text="Submit" onClick={handleSubmit} />
