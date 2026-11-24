import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the bilingual travel homepage and changes to Japanese', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Discover Sri Lanka,/ })).toBeInTheDocument();
  expect(document.querySelector('.cursor-grid__canvas')).not.toBeInTheDocument();

  fireEvent.click(screen.getAllByRole('button', { name: '日本語' })[0]);

  expect(screen.getByRole('heading', { name: /スリランカを、/ })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('ja');
});

test('opens a sample tour itinerary dialog', () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole('button', { name: /View journey/ })[0]);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('A possible rhythm')).toBeInTheDocument();
});

test('validates, reviews, and completes the inquiry preview without transmitting data', () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole('link', { name: /Plan your journey/i })[0]);

  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
  expect(screen.getByText('Please enter your name and a valid email address.')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: 'Alex' } });
  fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: 'alex@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
  expect(screen.getByRole('heading', { name: 'When are you thinking of coming?' })).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/My dates are flexible/));
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
  fireEvent.click(screen.getByLabelText('Private vehicle and driver'));
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
  fireEvent.click(screen.getByRole('button', { name: /Continue/ }));

  expect(screen.getByRole('heading', { name: 'Please review your details.' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Finish preview/ }));
  expect(screen.getByRole('heading', { name: 'Thank you for sharing your plans.' })).toBeInTheDocument();
});
