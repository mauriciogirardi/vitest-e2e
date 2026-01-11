import { render, screen } from "@testing-library/react"
import { userEvent } from '@testing-library/user-event'
import { Button } from "./button"

describe('<Button/>', () => {
  describe('Props', () => {
    it('should render props default button', () => {
      render(<Button>Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})
      expect(screen.getByText('Send form')).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })

    it('should check if properties default is right', async () => {
      const mockOnClick = vi.fn()
      render(<Button onClick={mockOnClick} type="submit">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('bg-blue-600 hover:bg-blue-700 text-blue-100')
      expect(button).not.toHaveClass('bg-slate-300 hover:bg-slate-400 text-slate-950')

      await userEvent.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should render disabled', async () => {
      const mockOnClick = vi.fn()
      render(<Button disabled onClick={mockOnClick}>Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed')
      await userEvent.click(button)
      expect(mockOnClick).toHaveBeenCalledTimes(0)
    })
  })

  describe('Display variants colors', () => {
    it('should check default', () => {
      render(<Button variant="default">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('bg-blue-600 hover:bg-blue-700 text-blue-100')
    })

    it('should check danger', () => {
      render(<Button variant="danger">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('bg-red-600 hover:bg-red-700 text-red-100')
    })

    it('should check ghost', () => {
      render(<Button variant="ghost">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('bg-slate-300 hover:bg-slate-400 text-slate-950')
    })
  })

  describe('Sizes', () => {
    it('should render sm size', () => {
      render(<Button size="sm">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('text-xs/tight py-1 px-2 rounded-sm [&_svg]:w-3 [&_svg]:h-3 gap-1')
    })

    it('should render md size', () => {
      render(<Button size="md">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2')
    })

    it('should render lg size', () => {
      render(<Button size="lg">Send form</Button>)
      const button = screen.getByRole('button', { name: 'Send form'})

      expect(button).toHaveClass('text-lg/tight py-4 px-6 rounded-lg [&_svg]:w-5 [&_svg]:h-5 gap-3')
    })
  })
})