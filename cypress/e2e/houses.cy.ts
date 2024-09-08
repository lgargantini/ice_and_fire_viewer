describe("Houses", () => {
    it("should have header", () => {
        // Start from the index page
        cy.visit("http://localhost:3000/houses/1");

        cy.url().should("include", "/houses");

        cy.get("h1").contains("Game of Thrones Houses");

        cy.get("table").contains("th", "Name");
        cy.get("table").contains("th", "Region");
        cy.get("table").contains("th", "Sworn Members");
    })

    it("should have houses results - no sworn members", () => {
        cy.visit("http://localhost:3000/houses/1");

        cy.get('tbody>tr').eq(0).as('firstRow');
        cy.get('@firstRow').contains('td', 'House Algood');
        cy.get('@firstRow').contains('td', 'The Westerlands');
        cy.get('@firstRow').contains('td', 'This house has no sworn members');
    });

    it('should have house results - with sworn members', () => {
        cy.visit("http://localhost:3000/houses/1");

        cy.get('tbody>tr').eq(1).as('secondRow');
        cy.get('@secondRow').contains('td', 'House Allyrion of Godsgrace');
        cy.get('@secondRow').contains('td', 'Dorne');
        cy.get('@secondRow').find("li").should('have.length', 4);

        cy.get('@secondRow').find("li").as('swornMembers');

        cy.get('@swornMembers').eq(0).contains('Alive');
        cy.get('@swornMembers').eq(0).contains('Delonne Allyrion');
        cy.get('@swornMembers').eq(1).contains('Alive');
        cy.get('@swornMembers').eq(1).contains('Ynys Yronwood');
        cy.get('@swornMembers').eq(2).contains('Alive');
        cy.get('@swornMembers').eq(2).contains('Daemon Sand');
        cy.get('@swornMembers').eq(3).contains('Alive');
        cy.get('@swornMembers').eq(3).contains('Ryon Allyrion');
    });
});