import { render, screen } from "@testing-library/react"
import { InputText } from "./input"
import userEvent from "@testing-library/user-event"

describe('<InputText/>', () => {
  it('should display label and placeholder', () => {
    render(<InputText labelText="Label text" placeholder="placeholder text"/>)
    expect(screen.getByLabelText('Label text')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('placeholder text')).toBeInTheDocument()
  })

  it('should not display label and placeholder', () => {
    render(<InputText placeholder={undefined} labelText={undefined}/>)
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('placeholder')
    expect(input).not.toHaveAttribute('labelText')
  })

  it('should use placeholder with aria-label when possible', () => {
    render(<InputText labelText="Label text" />)
    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('aria-label', 'Label text')
  })

  it('should use placeholder with fallback of aria-label', () => {
    render(<InputText placeholder="placeholder" />)
    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('aria-label', 'placeholder')
  })

  it('should display default value', () => {
    render(<InputText defaultValue="defaultValue" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('defaultValue')
  })

  it('should not show error message', () => {
    render(<InputText errorMessage={undefined}/>)
    expect(screen.queryByText('error')).not.toBeInTheDocument()
  })

  it('should display error message', () => {
    render(<InputText errorMessage="error" />)
    const input = screen.getByRole('textbox')
    const error = screen.getByRole('alert')
    const errorId = error.getAttribute('id')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', errorId)
    expect(error).toBeInTheDocument()
  })

  it('should render classes disabled', () => {
    render(<InputText  disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('disabled:bg-slate-200 disabled:text-slate-400 disabled:placeholder-slate-300')
  })

  it('should render classes read only', () => {
    render(<InputText  readOnly />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('read-only:bg-slate-100')
  })

  it('should render error classes', () => {
    render(<InputText  errorMessage="error" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('ring-red-500 focus:ring-red-700 placeholder-red-200')
  })

  it('should render custom classes', () => {
     render(<InputText  className="class-name"/>)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('class-name')
  })

  it('should write input', async () => {
    const user = userEvent.setup()
    render(<InputText  errorMessage="error" />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'text')

    expect(input).toHaveValue('text')
  })
})