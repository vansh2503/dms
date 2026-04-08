package com.dms.demo.repository;

import com.dms.demo.entity.BookingCancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BookingCancellationRepository extends JpaRepository<BookingCancellation, Long> {
    Optional<BookingCancellation> findByBookingBookingId(Long bookingId);
}
