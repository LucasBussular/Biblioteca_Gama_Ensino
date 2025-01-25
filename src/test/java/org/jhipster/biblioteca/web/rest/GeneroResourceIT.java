package org.jhipster.biblioteca.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.biblioteca.domain.GeneroAsserts.*;
import static org.jhipster.biblioteca.web.rest.TestUtil.createUpdateProxyForBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.jhipster.biblioteca.IntegrationTest;
import org.jhipster.biblioteca.domain.Genero;
import org.jhipster.biblioteca.repository.GeneroRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GeneroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GeneroResourceIT {

    private static final String DEFAULT_GENERO = "AAAAAAAAAA";
    private static final String UPDATED_GENERO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/generos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GeneroRepository generoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGeneroMockMvc;

    private Genero genero;

    private Genero insertedGenero;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Genero createEntity() {
        return new Genero().genero(DEFAULT_GENERO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Genero createUpdatedEntity() {
        return new Genero().genero(UPDATED_GENERO);
    }

    @BeforeEach
    public void initTest() {
        genero = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedGenero != null) {
            generoRepository.delete(insertedGenero);
            insertedGenero = null;
        }
    }

    @Test
    @Transactional
    void createGenero() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Genero
        var returnedGenero = om.readValue(
            restGeneroMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genero)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Genero.class
        );

        // Validate the Genero in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertGeneroUpdatableFieldsEquals(returnedGenero, getPersistedGenero(returnedGenero));

        insertedGenero = returnedGenero;
    }

    @Test
    @Transactional
    void createGeneroWithExistingId() throws Exception {
        // Create the Genero with an existing ID
        genero.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGeneroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genero)))
            .andExpect(status().isBadRequest());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkGeneroIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        genero.setGenero(null);

        // Create the Genero, which fails.

        restGeneroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genero)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGeneros() throws Exception {
        // Initialize the database
        insertedGenero = generoRepository.saveAndFlush(genero);

        // Get all the generoList
        restGeneroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(genero.getId().intValue())))
            .andExpect(jsonPath("$.[*].genero").value(hasItem(DEFAULT_GENERO)));
    }

    @Test
    @Transactional
    void getGenero() throws Exception {
        // Initialize the database
        insertedGenero = generoRepository.saveAndFlush(genero);

        // Get the genero
        restGeneroMockMvc
            .perform(get(ENTITY_API_URL_ID, genero.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(genero.getId().intValue()))
            .andExpect(jsonPath("$.genero").value(DEFAULT_GENERO));
    }

    @Test
    @Transactional
    void getNonExistingGenero() throws Exception {
        // Get the genero
        restGeneroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGenero() throws Exception {
        // Initialize the database
        insertedGenero = generoRepository.saveAndFlush(genero);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the genero
        Genero updatedGenero = generoRepository.findById(genero.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGenero are not directly saved in db
        em.detach(updatedGenero);
        updatedGenero.genero(UPDATED_GENERO);

        restGeneroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGenero.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedGenero))
            )
            .andExpect(status().isOk());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGeneroToMatchAllProperties(updatedGenero);
    }

    @Test
    @Transactional
    void putNonExistingGenero() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genero.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeneroMockMvc
            .perform(put(ENTITY_API_URL_ID, genero.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genero)))
            .andExpect(status().isBadRequest());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGenero() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genero.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(genero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGenero() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genero.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genero)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGeneroWithPatch() throws Exception {
        // Initialize the database
        insertedGenero = generoRepository.saveAndFlush(genero);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the genero using partial update
        Genero partialUpdatedGenero = new Genero();
        partialUpdatedGenero.setId(genero.getId());

        restGeneroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGenero.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGenero))
            )
            .andExpect(status().isOk());

        // Validate the Genero in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGeneroUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedGenero, genero), getPersistedGenero(genero));
    }

    @Test
    @Transactional
    void fullUpdateGeneroWithPatch() throws Exception {
        // Initialize the database
        insertedGenero = generoRepository.saveAndFlush(genero);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the genero using partial update
        Genero partialUpdatedGenero = new Genero();
        partialUpdatedGenero.setId(genero.getId());

        partialUpdatedGenero.genero(UPDATED_GENERO);

        restGeneroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGenero.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGenero))
            )
            .andExpect(status().isOk());

        // Validate the Genero in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGeneroUpdatableFieldsEquals(partialUpdatedGenero, getPersistedGenero(partialUpdatedGenero));
    }

    @Test
    @Transactional
    void patchNonExistingGenero() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genero.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeneroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, genero.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(genero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGenero() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genero.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(genero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGenero() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genero.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(genero)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Genero in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGenero() throws Exception {
        // Initialize the database
        insertedGenero = generoRepository.saveAndFlush(genero);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the genero
        restGeneroMockMvc
            .perform(delete(ENTITY_API_URL_ID, genero.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return generoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Genero getPersistedGenero(Genero genero) {
        return generoRepository.findById(genero.getId()).orElseThrow();
    }

    protected void assertPersistedGeneroToMatchAllProperties(Genero expectedGenero) {
        assertGeneroAllPropertiesEquals(expectedGenero, getPersistedGenero(expectedGenero));
    }

    protected void assertPersistedGeneroToMatchUpdatableProperties(Genero expectedGenero) {
        assertGeneroAllUpdatablePropertiesEquals(expectedGenero, getPersistedGenero(expectedGenero));
    }
}
