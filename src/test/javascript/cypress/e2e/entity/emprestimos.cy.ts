import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Emprestimos e2e test', () => {
  const emprestimosPageUrl = '/emprestimos';
  const emprestimosPageUrlPattern = new RegExp('/emprestimos(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const emprestimosSample = { dataEmprestimo: '2025-01-25T04:05:16.565Z', status: 'DEVOLVIDO' };

  let emprestimos;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/emprestimos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/emprestimos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/emprestimos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (emprestimos) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/emprestimos/${emprestimos.id}`,
      }).then(() => {
        emprestimos = undefined;
      });
    }
  });

  it('Emprestimos menu should load Emprestimos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('emprestimos');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Emprestimos').should('exist');
    cy.url().should('match', emprestimosPageUrlPattern);
  });

  describe('Emprestimos page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(emprestimosPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Emprestimos page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/emprestimos/new$'));
        cy.getEntityCreateUpdateHeading('Emprestimos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimosPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/emprestimos',
          body: emprestimosSample,
        }).then(({ body }) => {
          emprestimos = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/emprestimos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/emprestimos?page=0&size=20>; rel="last",<http://localhost/api/emprestimos?page=0&size=20>; rel="first"',
              },
              body: [emprestimos],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(emprestimosPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Emprestimos page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('emprestimos');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimosPageUrlPattern);
      });

      it('edit button click should load edit Emprestimos page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Emprestimos');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimosPageUrlPattern);
      });

      it('edit button click should load edit Emprestimos page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Emprestimos');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimosPageUrlPattern);
      });

      it('last delete button click should delete instance of Emprestimos', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('emprestimos').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimosPageUrlPattern);

        emprestimos = undefined;
      });
    });
  });

  describe('new Emprestimos page', () => {
    beforeEach(() => {
      cy.visit(`${emprestimosPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Emprestimos');
    });

    it('should create an instance of Emprestimos', () => {
      cy.get(`[data-cy="dataEmprestimo"]`).type('2025-01-25T11:05');
      cy.get(`[data-cy="dataEmprestimo"]`).blur();
      cy.get(`[data-cy="dataEmprestimo"]`).should('have.value', '2025-01-25T11:05');

      cy.get(`[data-cy="dataDevolucao"]`).type('2025-01-24T16:42');
      cy.get(`[data-cy="dataDevolucao"]`).blur();
      cy.get(`[data-cy="dataDevolucao"]`).should('have.value', '2025-01-24T16:42');

      cy.get(`[data-cy="status"]`).select('EMPRESTADO');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        emprestimos = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', emprestimosPageUrlPattern);
    });
  });
});
