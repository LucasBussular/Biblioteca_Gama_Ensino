package org.jhipster.biblioteca.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.jhipster.biblioteca.domain.Genero;
import org.jhipster.biblioteca.repository.GeneroRepository;
import org.jhipster.biblioteca.service.GeneroService;
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

/**
 * REST controller for managing {@link org.jhipster.biblioteca.domain.Genero}.
 */
@RestController
@RequestMapping("/api/generos")
public class GeneroResource {

    private static final Logger LOG = LoggerFactory.getLogger(GeneroResource.class);

    private static final String ENTITY_NAME = "genero";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GeneroService generoService;

    private final GeneroRepository generoRepository;

    public GeneroResource(GeneroService generoService, GeneroRepository generoRepository) {
        this.generoService = generoService;
        this.generoRepository = generoRepository;
    }

    /**
     * {@code POST  /generos} : Create a new genero.
     *
     * @param genero the genero to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new genero, or with status {@code 400 (Bad Request)} if the genero has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Genero> createGenero(@Valid @RequestBody Genero genero) throws URISyntaxException {
        LOG.debug("REST request to save Genero : {}", genero);
        if (genero.getId() != null) {
            throw new BadRequestAlertException("A new genero cannot already have an ID", ENTITY_NAME, "idexists");
        }
        genero = generoService.save(genero);
        return ResponseEntity.created(new URI("/api/generos/" + genero.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, genero.getId().toString()))
            .body(genero);
    }

    /**
     * {@code PUT  /generos/:id} : Updates an existing genero.
     *
     * @param id the id of the genero to save.
     * @param genero the genero to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genero,
     * or with status {@code 400 (Bad Request)} if the genero is not valid,
     * or with status {@code 500 (Internal Server Error)} if the genero couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Genero> updateGenero(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Genero genero
    ) throws URISyntaxException {
        LOG.debug("REST request to update Genero : {}, {}", id, genero);
        if (genero.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, genero.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!generoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        genero = generoService.update(genero);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genero.getId().toString()))
            .body(genero);
    }

    /**
     * {@code PATCH  /generos/:id} : Partial updates given fields of an existing genero, field will ignore if it is null
     *
     * @param id the id of the genero to save.
     * @param genero the genero to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genero,
     * or with status {@code 400 (Bad Request)} if the genero is not valid,
     * or with status {@code 404 (Not Found)} if the genero is not found,
     * or with status {@code 500 (Internal Server Error)} if the genero couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Genero> partialUpdateGenero(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Genero genero
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Genero partially : {}, {}", id, genero);
        if (genero.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, genero.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!generoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Genero> result = generoService.partialUpdate(genero);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genero.getId().toString())
        );
    }

    /**
     * {@code GET  /generos} : get all the generos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of generos in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Genero>> getAllGeneros(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Generos");
        Page<Genero> page = generoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /generos/:id} : get the "id" genero.
     *
     * @param id the id of the genero to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the genero, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Genero> getGenero(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Genero : {}", id);
        Optional<Genero> genero = generoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(genero);
    }

    /**
     * {@code DELETE  /generos/:id} : delete the "id" genero.
     *
     * @param id the id of the genero to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenero(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Genero : {}", id);
        generoService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
