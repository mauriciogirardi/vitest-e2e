import clsx from 'clsx';

type TButtonVariants = 'default' | 'ghost' | 'danger';
type TButtonSizes = 'sm' | 'md' | 'lg';

type TButtonProps = {
  variant?: TButtonVariants;
  size?: TButtonSizes;
} & React.ComponentProps<'button'>;

export function Button({
  variant = 'default',
  size = 'md',
  ...props
}: TButtonProps) {
  const buttonVariants: Record<TButtonVariants, string> = {
    default: clsx('bg-blue-600 hover:bg-blue-700 text-blue-100'),
    ghost: clsx('bg-slate-300 hover:bg-slate-400 text-slate-950'),
    danger: clsx('bg-red-600 hover:bg-red-700 text-red-100'),
  };

  const buttonSizes: Record<TButtonSizes, string> = {
    sm: clsx(
      'text-xs/tight',
      'py-1',
      'px-2',
      'rounded-sm',
      '[&_svg]:w-3 [&_svg]:h-3 gap-1',
    ),
    md: clsx(
      'text-base/tight',
      'py-2',
      'px-4',
      'rounded-md',
      '[&_svg]:w-4 [&_svg]:h-4 gap-2',
    ),
    lg: clsx(
      'text-lg/tight',
      'py-4',
      'px-6',
      'rounded-lg',
      '[&_svg]:w-5 [&_svg]:h-5 gap-3',
    ),
  };

  const buttonClasses = clsx(
    buttonVariants[variant],
    buttonSizes[size],
    'flex items-center justify-center cursor-pointer',
    'transition',
    'disabled:bg-slate-200',
    'disabled:text-slate-400',
    'disabled:cursor-not-allowed',
    props.className,
  );

  return <button {...props} className={buttonClasses} />;
}