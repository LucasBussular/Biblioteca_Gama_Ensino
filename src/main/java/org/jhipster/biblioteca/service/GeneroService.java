package org.jhipster.biblioteca.service;

import java.util.Optional;
import org.jhipster.biblioteca.domain.Genero;
import org.jhipster.biblioteca.repository.GeneroRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link org.jhipster.biblioteca.domain.Genero}.
 */
@Service
@Transactional
public class GeneroService {

    private static final Logger LOG = LoggerFactory.getLogger(GeneroService.class);

    private final GeneroRepository generoRepository;

    public GeneroService(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

    /**
     * Save a genero.
     *
     * @param genero the entity to save.
     * @return the persisted entity.
     */
    public Genero save(Genero genero) {
        LOG.debug("Request to save Genero : {}", genero);
        return generoRepository.save(genero);
    }

    /**
     * Update a genero.
     *
     * @param genero the entity to save.
     * @return the persisted entity.
     */
    public Genero update(Genero genero) {
        LOG.debug("Request to update Genero : {}", genero);
        return generoRepository.save(genero);
    }

    /**
     * Partially update a genero.
     *
     * @param genero the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Genero> partialUpdate(Genero genero) {
        LOG.debug("Request to partially update Genero : {}", genero);

        return generoRepository
            .findById(genero.getId())
            .map(existingGenero -> {
                if (genero.getGenero() != null) {
                    existingGenero.setGenero(genero.getGenero());
                }

                return existingGenero;
            })
            .map(generoRepository::save);
    }

    /**
     * Get all the generos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Genero> findAll(Pageable pageable) {
        LOG.debug("Request to get all Generos");
        return generoRepository.findAll(pageable);
    }

    /**
     * Get one genero by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Genero> findOne(Long id) {
        LOG.debug("Request to get Genero : {}", id);
        return generoRepository.findById(id);
    }

    /**
     * Delete the genero by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Genero : {}", id);
        generoRepository.deleteById(id);
    }
}
