const PasswordRule = ({
  isValid,
  label,
}: {
  isValid: boolean;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center
          ${isValid ? 'bg-purple-500 border-purple-500' : 'border-gray-400'}
        `}
      >
        {isValid && <span className="text-white text-xs">✓</span>}
      </div>

      <p
        className={`text-sm ${isValid ? 'text-purple-500' : 'text-[#888888]'}`}
      >
        {label}
      </p>
    </div>
  );
};

export default PasswordRule;
