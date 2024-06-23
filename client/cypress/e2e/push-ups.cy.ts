import { ERRORS, SELECTORS } from "./constants";

describe("push-ups", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding push-ups", () => {
    beforeEach(() => {
      cy.visit("/push-ups/add");
      cy.get(SELECTORS.eventAddPage);
    });

    it("errors when there is no value", () => {
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when provided with text instead of number", () => {
      cy.get(SELECTORS.pushUpsValueInput).type("a{enter}");
      cy.get(SELECTORS.pushUpsValueInput).should("have.value", "");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when range overflows", () => {
      cy.get(SELECTORS.pushUpsValueInput).type("1001{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeOverflow,
      );
    });

    it("errors when range underflows", () => {
      cy.get(SELECTORS.pushUpsValueInput).type("0{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeUnderflow,
      );
    });

    it("errors when value is not an integer", () => {
      cy.get(SELECTORS.pushUpsValueInput).type("20.1{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should("have.text", ERRORS.integer);
    });

    it("works when value is valid", () => {
      const testValue = "20";
      cy.get(SELECTORS.pushUpsValueInput).type(testValue);
      const expectedTime = Math.round(Date.now() / 1e3);
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/push-ups/log");
      cy.get(SELECTORS.eventCardValue)
        .first()
        .should("have.text", `${testValue} push-ups`);

      cy.get(SELECTORS.eventCardDateTime)
        .invoke("attr", "data-time")
        .then(Number)
        .should("be.closeTo", expectedTime, 1);
    });

    it("works with 1 push-up", () => {
      cy.get(SELECTORS.pushUpsValueInput).type("1{enter}");
      cy.location("pathname").should("equal", "/push-ups/log");
      cy.get(SELECTORS.eventCardValue).first().should("have.text", "1 push-up");
    });
  });
});
