package org.jhipster.biblioteca.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.biblioteca.security.AuthoritiesConstants;
import org.jhipster.biblioteca.domain.Emprestimos;
import org.jhipster.biblioteca.repository.EmprestimosRepository;
import org.jhipster.biblioteca.service.EmprestimosService;
import org.jhipster.biblioteca.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/*
 * REST controller for managing {@link org.jhipster.biblioteca.domain.Emprestimos}.
 */
@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimosResource {

    private static final Logger LOG = LoggerFactory.getLogger(EmprestimosResource.class);

    private static final String ENTITY_NAME = "emprestimos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmprestimosService emprestimosService;

    private final EmprestimosRepository emprestimosRepository;

    public EmprestimosResource(EmprestimosService emprestimosService, EmprestimosRepository emprestimosRepository) {
        this.emprestimosService = emprestimosService;
        this.emprestimosRepository = emprestimosRepository;
    }

    /**
     * {@code POST  /emprestimos} : Create a new emprestimos.
     *
     * @param emprestimos the emprestimos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emprestimos, or with status {@code 400 (Bad Request)} if the emprestimos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Emprestimos> createEmprestimos(@Valid @RequestBody Emprestimos emprestimos) throws URISyntaxException {
        LOG.debug("REST request to save Emprestimos : {}", emprestimos);
        if (emprestimos.getId() != null) {
            throw new BadRequestAlertException("A new emprestimos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        emprestimos = emprestimosService.save(emprestimos);
        return ResponseEntity.created(new URI("/api/emprestimos/" + emprestimos.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, emprestimos.getId().toString()))
            .body(emprestimos);
    }

    /**
     * {@code PUT  /emprestimos/:id} : Updates an existing emprestimos.
     *
     * @param id the id of the emprestimos to save.
     * @param emprestimos the emprestimos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emprestimos,
     * or with status {@code 400 (Bad Request)} if the emprestimos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emprestimos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Emprestimos> updateEmprestimos(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Emprestimos emprestimos
    ) throws URISyntaxException {
        LOG.debug("REST request to update Emprestimos : {}, {}", id, emprestimos);
        if (emprestimos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emprestimos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emprestimosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        emprestimos = emprestimosService.update(emprestimos);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emprestimos.getId().toString()))
            .body(emprestimos);
    }

    /**
     * {@code PATCH  /emprestimos/:id} : Partial updates given fields of an existing emprestimos, field will ignore if it is null
     *
     * @param id the id of the emprestimos to save.
     * @param emprestimos the emprestimos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emprestimos,
     * or with status {@code 400 (Bad Request)} if the emprestimos is not valid,
     * or with status {@code 404 (Not Found)} if the emprestimos is not found,
     * or with status {@code 500 (Internal Server Error)} if the emprestimos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Emprestimos> partialUpdateEmprestimos(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Emprestimos emprestimos
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Emprestimos partially : {}, {}", id, emprestimos);
        if (emprestimos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emprestimos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emprestimosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Emprestimos> result = emprestimosService.partialUpdate(emprestimos);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emprestimos.getId().toString())
        );
    }

    /**
     * {@code GET  /emprestimos} : get all the emprestimos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emprestimos in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Emprestimos>> getAllEmprestimos(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Emprestimos");
        Page<Emprestimos> page = emprestimosService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /emprestimos/:id} : get the "id" emprestimos.
     *
     * @param id the id of the emprestimos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emprestimos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Emprestimos> getEmprestimos(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Emprestimos : {}", id);
        Optional<Emprestimos> emprestimos = emprestimosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(emprestimos);
    }

    /**
     * {@code DELETE  /emprestimos/:id} : delete the "id" emprestimos.
     *
     * @param id the id of the emprestimos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     *
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteEmprestimos(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Emprestimos : {}", id);
        emprestimosService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
