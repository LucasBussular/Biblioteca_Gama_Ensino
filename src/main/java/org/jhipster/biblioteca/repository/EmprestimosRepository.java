package org.jhipster.biblioteca.repository;

import org.jhipster.biblioteca.domain.Emprestimos;
import org.jhipster.biblioteca.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Emprestimos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmprestimosRepository extends JpaRepository<Emprestimos, Long> {
    Page<Emprestimos> findByCliente(User cliente, Pageable pageable);
}
