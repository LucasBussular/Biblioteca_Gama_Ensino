package org.jhipster.biblioteca.service;

import java.util.Optional;
import org.jhipster.biblioteca.domain.Livro;
import org.jhipster.biblioteca.repository.LivroRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link org.jhipster.biblioteca.domain.Livro}.
 */
@Service
@Transactional
public class LivroService {

    private static final Logger LOG = LoggerFactory.getLogger(LivroService.class);

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    /**
     * Save a livro.
     *
     * @param livro the entity to save.
     * @return the persisted entity.
     */
    public Livro save(Livro livro) {
        LOG.debug("Request to save Livro : {}", livro);
        return livroRepository.save(livro);
    }

    /**
     * Update a livro.
     *
     * @param livro the entity to save.
     * @return the persisted entity.
     */
    public Livro update(Livro livro) {
        LOG.debug("Request to update Livro : {}", livro);
        return livroRepository.save(livro);
    }

    /**
     * Partially update a livro.
     *
     * @param livro the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Livro> partialUpdate(Livro livro) {
        LOG.debug("Request to partially update Livro : {}", livro);

        return livroRepository
            .findById(livro.getId())
            .map(existingLivro -> {
                if (livro.getTitulo() != null) {
                    existingLivro.setTitulo(livro.getTitulo());
                }
                if (livro.getAutor() != null) {
                    existingLivro.setAutor(livro.getAutor());
                }
                if (livro.getAnoPublicacao() != null) {
                    existingLivro.setAnoPublicacao(livro.getAnoPublicacao());
                }
                if (livro.getIsbn() != null) {
                    existingLivro.setIsbn(livro.getIsbn());
                }

                return existingLivro;
            })
            .map(livroRepository::save);
    }

    /**
     * Get all the livros.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Livro> findAll(Pageable pageable) {
        LOG.debug("Request to get all Livros");
        return livroRepository.findAll(pageable);
    }

    /**
     * Get one livro by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Livro> findOne(Long id) {
        LOG.debug("Request to get Livro : {}", id);
        return livroRepository.findById(id);
    }

    /**
     * Delete the livro by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Livro : {}", id);
        livroRepository.deleteById(id);
    }
}
