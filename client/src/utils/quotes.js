const quotes = [
  'Small steps every day lead to big wins.',
  'Rest is part of the plan, not a reward.',
  'Focus on progress, not perfection.',
  'Discipline is a form of self-care.',
  'Balance fuels brilliance.',
  'Protect your energy like your grades depend on it.',
  'Study smart, live smart.',
  'Momentum beats motivation.',
]

export const quoteOfTheDay = (dateKey) => {
  const index =
    dateKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    quotes.length
  return quotes[index]
}
