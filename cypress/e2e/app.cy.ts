describe('Home', () => {
  it('should have pagination', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    cy.url().should('include', '/')

    cy.get('[data-testid="prev_button"]').should('exist')
    cy.get('[data-testid="next_button"]').should('exist')
    cy.get('[data-testid="page_number"]').should('exist')
    cy.get('[data-testid="page_number"]').contains('1')
  })

  it('should navigate to next page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    cy.url().should('include', '/')

    cy.get('[data-testid="next_button"]').click()

    cy.url().should('include', '/houses/2')
  })

  it('should navigate to previous page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/houses/3')

    cy.url().should('include', '/houses/3')

    cy.get('[data-testid="prev_button"]').click()

    cy.url().should('include', '/houses/2')
  })

  it('should navigate to root page if page is 2', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/houses/2')

    cy.url().should('include', '/houses/2')

    cy.get('[data-testid="prev_button"]').click()

    cy.url().should('include', '/')
  })
})