package org.jhipster.biblioteca.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.biblioteca.domain.EmprestimosAsserts.*;
import static org.jhipster.biblioteca.web.rest.TestUtil.createUpdateProxyForBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.jhipster.biblioteca.IntegrationTest;
import org.jhipster.biblioteca.domain.Emprestimos;
import org.jhipster.biblioteca.domain.enumeration.Status;
import org.jhipster.biblioteca.repository.EmprestimosRepository;
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
 * Integration tests for the {@link EmprestimosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmprestimosResourceIT {

    private static final Instant DEFAULT_DATA_EMPRESTIMO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_EMPRESTIMO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATA_DEVOLUCAO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_DEVOLUCAO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Status DEFAULT_STATUS = Status.EMPRESTADO;
    private static final Status UPDATED_STATUS = Status.ATRASADO;

    private static final String ENTITY_API_URL = "/api/emprestimos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EmprestimosRepository emprestimosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmprestimosMockMvc;

    private Emprestimos emprestimos;

    private Emprestimos insertedEmprestimos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Emprestimos createEntity() {
        return new Emprestimos().dataEmprestimo(DEFAULT_DATA_EMPRESTIMO).dataDevolucao(DEFAULT_DATA_DEVOLUCAO).status(DEFAULT_STATUS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Emprestimos createUpdatedEntity() {
        return new Emprestimos().dataEmprestimo(UPDATED_DATA_EMPRESTIMO).dataDevolucao(UPDATED_DATA_DEVOLUCAO).status(UPDATED_STATUS);
    }

    @BeforeEach
    public void initTest() {
        emprestimos = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEmprestimos != null) {
            emprestimosRepository.delete(insertedEmprestimos);
            insertedEmprestimos = null;
        }
    }

    @Test
    @Transactional
    void createEmprestimos() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Emprestimos
        var returnedEmprestimos = om.readValue(
            restEmprestimosMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(emprestimos)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Emprestimos.class
        );

        // Validate the Emprestimos in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEmprestimosUpdatableFieldsEquals(returnedEmprestimos, getPersistedEmprestimos(returnedEmprestimos));

        insertedEmprestimos = returnedEmprestimos;
    }

    @Test
    @Transactional
    void createEmprestimosWithExistingId() throws Exception {
        // Create the Emprestimos with an existing ID
        emprestimos.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmprestimosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(emprestimos)))
            .andExpect(status().isBadRequest());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDataEmprestimoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        emprestimos.setDataEmprestimo(null);

        // Create the Emprestimos, which fails.

        restEmprestimosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(emprestimos)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        emprestimos.setStatus(null);

        // Create the Emprestimos, which fails.

        restEmprestimosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(emprestimos)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmprestimos() throws Exception {
        // Initialize the database
        insertedEmprestimos = emprestimosRepository.saveAndFlush(emprestimos);

        // Get all the emprestimosList
        restEmprestimosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emprestimos.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataEmprestimo").value(hasItem(DEFAULT_DATA_EMPRESTIMO.toString())))
            .andExpect(jsonPath("$.[*].dataDevolucao").value(hasItem(DEFAULT_DATA_DEVOLUCAO.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getEmprestimos() throws Exception {
        // Initialize the database
        insertedEmprestimos = emprestimosRepository.saveAndFlush(emprestimos);

        // Get the emprestimos
        restEmprestimosMockMvc
            .perform(get(ENTITY_API_URL_ID, emprestimos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emprestimos.getId().intValue()))
            .andExpect(jsonPath("$.dataEmprestimo").value(DEFAULT_DATA_EMPRESTIMO.toString()))
            .andExpect(jsonPath("$.dataDevolucao").value(DEFAULT_DATA_DEVOLUCAO.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEmprestimos() throws Exception {
        // Get the emprestimos
        restEmprestimosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmprestimos() throws Exception {
        // Initialize the database
        insertedEmprestimos = emprestimosRepository.saveAndFlush(emprestimos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the emprestimos
        Emprestimos updatedEmprestimos = emprestimosRepository.findById(emprestimos.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEmprestimos are not directly saved in db
        em.detach(updatedEmprestimos);
        updatedEmprestimos.dataEmprestimo(UPDATED_DATA_EMPRESTIMO).dataDevolucao(UPDATED_DATA_DEVOLUCAO).status(UPDATED_STATUS);

        restEmprestimosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmprestimos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEmprestimos))
            )
            .andExpect(status().isOk());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEmprestimosToMatchAllProperties(updatedEmprestimos);
    }

    @Test
    @Transactional
    void putNonExistingEmprestimos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        emprestimos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmprestimosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emprestimos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(emprestimos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmprestimos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        emprestimos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmprestimosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(emprestimos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmprestimos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        emprestimos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmprestimosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(emprestimos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmprestimosWithPatch() throws Exception {
        // Initialize the database
        insertedEmprestimos = emprestimosRepository.saveAndFlush(emprestimos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the emprestimos using partial update
        Emprestimos partialUpdatedEmprestimos = new Emprestimos();
        partialUpdatedEmprestimos.setId(emprestimos.getId());

        restEmprestimosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmprestimos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEmprestimos))
            )
            .andExpect(status().isOk());

        // Validate the Emprestimos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEmprestimosUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEmprestimos, emprestimos),
            getPersistedEmprestimos(emprestimos)
        );
    }

    @Test
    @Transactional
    void fullUpdateEmprestimosWithPatch() throws Exception {
        // Initialize the database
        insertedEmprestimos = emprestimosRepository.saveAndFlush(emprestimos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the emprestimos using partial update
        Emprestimos partialUpdatedEmprestimos = new Emprestimos();
        partialUpdatedEmprestimos.setId(emprestimos.getId());

        partialUpdatedEmprestimos.dataEmprestimo(UPDATED_DATA_EMPRESTIMO).dataDevolucao(UPDATED_DATA_DEVOLUCAO).status(UPDATED_STATUS);

        restEmprestimosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmprestimos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEmprestimos))
            )
            .andExpect(status().isOk());

        // Validate the Emprestimos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEmprestimosUpdatableFieldsEquals(partialUpdatedEmprestimos, getPersistedEmprestimos(partialUpdatedEmprestimos));
    }

    @Test
    @Transactional
    void patchNonExistingEmprestimos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        emprestimos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmprestimosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emprestimos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(emprestimos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmprestimos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        emprestimos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmprestimosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(emprestimos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmprestimos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        emprestimos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmprestimosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(emprestimos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Emprestimos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmprestimos() throws Exception {
        // Initialize the database
        insertedEmprestimos = emprestimosRepository.saveAndFlush(emprestimos);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the emprestimos
        restEmprestimosMockMvc
            .perform(delete(ENTITY_API_URL_ID, emprestimos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return emprestimosRepository.count();
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

    protected Emprestimos getPersistedEmprestimos(Emprestimos emprestimos) {
        return emprestimosRepository.findById(emprestimos.getId()).orElseThrow();
    }

    protected void assertPersistedEmprestimosToMatchAllProperties(Emprestimos expectedEmprestimos) {
        assertEmprestimosAllPropertiesEquals(expectedEmprestimos, getPersistedEmprestimos(expectedEmprestimos));
    }

    protected void assertPersistedEmprestimosToMatchUpdatableProperties(Emprestimos expectedEmprestimos) {
        assertEmprestimosAllUpdatablePropertiesEquals(expectedEmprestimos, getPersistedEmprestimos(expectedEmprestimos));
    }
}
