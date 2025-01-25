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

describe('Genero e2e test', () => {
  const generoPageUrl = '/genero';
  const generoPageUrlPattern = new RegExp('/genero(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const generoSample = { genero: 'fuel vacantly' };

  let genero;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/generos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/generos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/generos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (genero) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/generos/${genero.id}`,
      }).then(() => {
        genero = undefined;
      });
    }
  });

  it('Generos menu should load Generos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('genero');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Genero').should('exist');
    cy.url().should('match', generoPageUrlPattern);
  });

  describe('Genero page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(generoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Genero page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/genero/new$'));
        cy.getEntityCreateUpdateHeading('Genero');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', generoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/generos',
          body: generoSample,
        }).then(({ body }) => {
          genero = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/generos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/generos?page=0&size=20>; rel="last",<http://localhost/api/generos?page=0&size=20>; rel="first"',
              },
              body: [genero],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(generoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Genero page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('genero');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', generoPageUrlPattern);
      });

      it('edit button click should load edit Genero page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Genero');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', generoPageUrlPattern);
      });

      it('edit button click should load edit Genero page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Genero');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', generoPageUrlPattern);
      });

      it('last delete button click should delete instance of Genero', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('genero').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', generoPageUrlPattern);

        genero = undefined;
      });
    });
  });

  describe('new Genero page', () => {
    beforeEach(() => {
      cy.visit(`${generoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Genero');
    });

    it('should create an instance of Genero', () => {
      cy.get(`[data-cy="genero"]`).type('bootleg');
      cy.get(`[data-cy="genero"]`).should('have.value', 'bootleg');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        genero = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', generoPageUrlPattern);
    });
  });
});
