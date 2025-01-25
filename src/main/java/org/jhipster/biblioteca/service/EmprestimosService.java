package org.jhipster.biblioteca.service;

import java.util.Optional;
import org.jhipster.biblioteca.domain.Emprestimos;
import org.jhipster.biblioteca.domain.User;
import org.jhipster.biblioteca.repository.EmprestimosRepository;
import org.jhipster.biblioteca.repository.UserRepository;
import org.jhipster.biblioteca.security.AuthoritiesConstants;
import org.jhipster.biblioteca.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link org.jhipster.biblioteca.domain.Emprestimos}.
 */
@Service
@Transactional
public class EmprestimosService {

    private static final Logger LOG = LoggerFactory.getLogger(EmprestimosService.class);

    private final EmprestimosRepository emprestimosRepository;
    private final UserRepository userRepository;

    public EmprestimosService(EmprestimosRepository emprestimosRepository) {
        this.emprestimosRepository = emprestimosRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a emprestimos.
     *
     * @param emprestimos the entity to save.
     * @return the persisted entity.
     */
    public Emprestimos save(Emprestimos emprestimos) {
        LOG.debug("Request to save Emprestimos : {}", emprestimos);
        return emprestimosRepository.save(emprestimos);
    }

    /**
     * Update a emprestimos.
     *
     * @param emprestimos the entity to save.
     * @return the persisted entity.
     */
    public Emprestimos update(Emprestimos emprestimos) {
        LOG.debug("Request to update Emprestimos : {}", emprestimos);
        return emprestimosRepository.save(emprestimos);
    }

    /**
     * Partially update a emprestimos.
     *
     * @param emprestimos the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Emprestimos> partialUpdate(Emprestimos emprestimos) {
        LOG.debug("Request to partially update Emprestimos : {}", emprestimos);

        return emprestimosRepository
            .findById(emprestimos.getId())
            .map(existingEmprestimos -> {
                if (emprestimos.getDataEmprestimo() != null) {
                    existingEmprestimos.setDataEmprestimo(emprestimos.getDataEmprestimo());
                }
                if (emprestimos.getDataDevolucao() != null) {
                    existingEmprestimos.setDataDevolucao(emprestimos.getDataDevolucao());
                }
                if (emprestimos.getStatus() != null) {
                    existingEmprestimos.setStatus(emprestimos.getStatus());
                }

                return existingEmprestimos;
            })
            .map(emprestimosRepository::save);
    }

    /**
     * Get all the emprestimos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Emprestimos> findAll(Pageable pageable) {
        LOG.debug("Request to get all Emprestimos");
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            // Se for admin, retorna todos os empréstimos
            return emprestimosRepository.findAll(pageable);
        } else {
            // Se não for admin, filtra os empréstimos do usuário logado
            String login = SecurityUtils.getCurrentUserLogin().get(); // Obtém o login do usuário logado
            User user = userRepository.findOneByLogin(login).get(); // Encontra o usuário pelo login

            // Retorna apenas os empréstimos do usuário logado
            return emprestimosRepository.findByCliente(user, pageable);
        }
    }

    /**
     * Get one emprestimos by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Emprestimos> findOne(Long id) {
        LOG.debug("Request to get Emprestimos : {}", id);
        return emprestimosRepository.findById(id);
    }

    /**
     * Delete the emprestimos by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Emprestimos : {}", id);
        emprestimosRepository.deleteById(id);
    }
}
