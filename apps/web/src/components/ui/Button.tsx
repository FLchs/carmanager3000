type Props = {
  callback?: () => Promise<void> | void;
  label: string;
  type?: HTMLButtonElement["type"];
};

function Button({ callback, label, type = "button" }: Props) {
  return (
    <button
      className="bg-elevated border-highlight border-1 hover:bg-surface hover:cursor-pointer rounded-lg py-2 px-4"
      onClick={callback}
      type={type}
    >
      {label}
    </button>
  );
}

export default Button;
