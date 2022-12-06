describe('API assignment testing with Cypress', () => {

  it('Test viewing the page', () => {
    cy.visit('localhost:3000')
    cy.get('h1').should('have.text', 'To Do List')
    cy.get('h5').should('have.text', 'Add new ToDo item')
    cy.get('#AddingTaskTitleInput').should('be.visible')
    cy.get('#AddingTaskCompletedInput').should('be.visible')
    cy.get('#AddButton').should('be.visible')
    cy.get('.header').should('be.visible')
    cy.get('div[id=ID]').first().should('have.text', '1')
    cy.get('div[id=Title]').first().should('have.text', 'delectus aut autem')
    cy.get('div[id=Completed]').first().should('have.text', 'false')
    cy.get('#EditButton').should('be.visible')
    cy.get('#DeleteButton').should('be.visible')
  })

  it('Test deleting of tasks ', () => {
    cy.get('button[id=DeleteButton]').first().click()
    cy.wait(1000)
    cy.get('#ID').first().should('have.text', '2')
    cy.get('button[id=DeleteButton]').last().click()
    cy.wait(1000)
    cy.get('div[id=ID]').last().should('have.text', '9')
  })

  it('Test editing of tasks ', () => {
    cy.get('button[id=EditButton]').first().click()
    cy.get('#EditTaskTitleInput').type('{selectAll}{backspace}A sample task')
    cy.get('#EditTaskCompletedInput').type('{selectAll}{backspace}Not completed')
    cy.get('button[id=SaveEditButton]').first().click()
    cy.get('#Title').first().should('have.text', 'A sample task')
    cy.get('#Completed').first().should('have.text', 'Not completed')
  })

  it('Test adding tasks ', () => {
    cy.get('#AddingTaskTitleInput').type('Another sample task')
    cy.get('#AddingTaskCompletedInput').type('Not yet')
    cy.get('button[id=AddButton]').click()
    cy.wait(1000)
    cy.get('div[id=ID]').last().should('have.text', '10')
    cy.get('div[id=Title]').last().should('have.text', 'Another sample task')
    cy.get('div[id=Completed]').last().should('have.text', 'Not yet')
  })

})
